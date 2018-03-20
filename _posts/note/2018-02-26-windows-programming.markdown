---
layout:		post
title:		Windows编程记录篇
author:		wooy0ung
tags:		windows
category:  	note
---


>[索引目录]  
>0x001 dll注入方法  
<!-- more -->  


## 0x001 dll注入方法

注入dll
```
1. OpenProcess获取待注入进程句柄
2. VirtualAllocEx在远程进程开辟出一块内存，长度strlen(dllname) + 1;
3. WriteProcessMemory将dllname写入开辟出的内存
4. CreateRemoteThread将LoadLibraryA作为线程函数，创建线程
5. CloseHandle关闭线程句柄
```

卸载dll
```
1. CreateRemoteThread将GetModuleHandle注入远程进程
2. GetExitCodeThread将线程退出码作为dll的句柄
3. CloseHandle关闭线程句柄
4. CreateRemoteThread将FreeLibrary注入远程进程
5. WaitForSingleObject等待对象句柄返回
6. CloseHandle关闭线程及进程句柄
```

完整代码
```
#include "stdafx.h"
#include <windows.h>
#include <tlhelp32.h>


DWORD getProcessHandle(LPCTSTR lpProcessName)
{
	DWORD dwRet = 0;
	HANDLE hSnapShot = CreateToolhelp32Snapshot(TH32CS_SNAPPROCESS, 0);
	if (hSnapShot == INVALID_HANDLE_VALUE)
	{
		printf("\n获得进程快照失败%d", GetLastError());
		return dwRet;
	}

	PROCESSENTRY32 pe32;
	pe32.dwSize = sizeof(PROCESSENTRY32);
	Process32First(hSnapShot, &pe32);
	do
	{
		if (!lstrcmp(pe32.szExeFile, lpProcessName))
		{
			dwRet = pe32.th32ProcessID;
			break;
		}
	} while (Process32Next(hSnapShot, &pe32));
	CloseHandle(hSnapShot);
	return dwRet;
}

INT main(INT argc, CHAR* argv[])
{
	DWORD dwPid = getProcessHandle((LPCTSTR)argv[1]);
	LPCSTR lpDllName = "name.dll";
	HANDLE hProcess = OpenProcess(PROCESS_VM_OPERATION | PROCESS_VM_WRITE, FALSE, dwPid);
	if (hProcess == NULL)
	{
		printf("\n获取进程句柄错误%d", GetLastError());
		return -1;
	}
	DWORD dwSize = strlen(lpDllName) + 1;
	DWORD dwHasWrite;
	LPVOID lpRemoteBuf = VirtualAllocEx(hProcess, NULL, dwSize, MEM_COMMIT, PAGE_READWRITE);
	if (WriteProcessMemory(hProcess, lpRemoteBuf, lpDllName, dwSize, (SIZE_T*)dwHasWrite))
	{
		if (dwHasWrite != dwSize)
		{
			VirtualFreeEx(hProcess, lpRemoteBuf, dwSize, MEM_COMMIT);
			CloseHandle(hProcess);
			return -1;
		}
	}else
	{
		printf("\n写入远程进程内存空间出错%d", GetLastError());
		CloseHandle(hProcess);
		return -1;
	}

	DWORD dwNewThreadId;
	LPVOID lpLoadDll = LoadLibraryA;
	HANDLE hNewRemoteThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)lpLoadDll, lpRemoteBuf, 0, &dwNewThreadId);
	if (hNewRemoteThread == NULL)
	{
		printf("\n建立远程线程失败%d", GetLastError());
		CloseHandle(hProcess);
		return -1;
	}

	WaitForSingleObject(hNewRemoteThread, INFINITE);
	CloseHandle(hNewRemoteThread);

	//准备卸载之前注入的Dll
	DWORD dwHandle, dwID;
	LPVOID pFunc = GetModuleHandleA;
	HANDLE hThread = CreateRemoteThread(hProcess, NULL, 0, (LPTHREAD_START_ROUTINE)pFunc, lpRemoteBuf, 0, &dwID);
	WaitForSingleObject(hThread, INFINITE);
	GetExitCodeThread(hThread, &dwHandle);
	CloseHandle(hThread);
	pFunc = FreeLibrary;
	hThread = CreateRemoteThread(hThread, NULL, 0, (LPTHREAD_START_ROUTINE)pFunc, (LPVOID)dwHandle, 0, &dwID);
	WaitForSingleObject(hThread, INFINITE);
	CloseHandle(hThread);
	CloseHandle(hProcess);

	return 0;
}
```
