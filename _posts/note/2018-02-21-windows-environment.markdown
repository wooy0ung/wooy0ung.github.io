---
layout:		post
title:		环境搭建之Windows篇
author:		wooy0ung
tags:		windows
category:  	note
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 关闭sublime更新提示  
>0x002 Win10鼠标卡顿修复  
>0x003 解决Tntel VT-x处于禁用状态  
>0x004 利用FileZilla搭建局域网  
>0x005 制作Windows XP U盘启动盘  
>0x006 解决windbg"your debugger is not using the correct symbols"错误  
<!-- more -->
>0x007 解决Sublime Text 3中文乱码
>0x008 设置java环境变量  
>0x009 Visual Studio 2015切换中文语言  
>0x010 搭建Win10驱动开发环境  
>0x011 查看Win10激活状态  
>0x012 Win10一条命令关闭Windows Defender  
>0x013 解决Win10运行VC++ 6.0报错  
>0x014 Win10关闭自动更新 & 清除更新包  
>0x015 关闭Firefox自动更新  
>0x016 Windows安装binwalk  
>0x017 Windows安装pip命令  
>0x018 VMWare14解锁macOS安装限制  
>0x019 安装和破解Matlab 2016a  
>0x020 一条命令关闭Windows Defender  


## 0x001 关闭sublime更新提示

找到Preferences -> Settings-User，写入
```
"update_check":false
```

更改字号
```
"font_size":18
```


## 0x002 Win10鼠标卡顿修复

Win+R输入regedit打开注册表，在注册表展开
```
HEKY_CLASSES_ROOT\directory\background\shellex\contextmenuhandlers
```

![](/assets/img/note/2018-02-21-windows-environment/0x002-001.png)
保留“New”、“WorkFolders”选项，其余子项全部删除


## 0x003 解决Tntel VT-x处于禁用状态

现象
![](/assets/img/note/2018-02-21-windows-environment/0x003-001.png)

解决方法：进入BIOS允许虚拟化，HP在开机时点按F10进入BIOS


## 0x004 利用FileZilla搭建局域网

安装FileZilla Server，点击Connect建立连接
![](/assets/img/note/2018-02-21-windows-environment/0x004-001.png)

打开Edit->Users新建用户，添加共享目录
![](/assets/img/note/2018-02-21-windows-environment/0x004-002.png)

客户机通过主机ip和21端口进行连接，可能需要关闭防火墙


## 0x005 制作Windows XP U盘启动盘

说明:  
由于需要用到WinXP, 常规地用UltraISO烧录到 U盘。  
但一开始加载镜像就出现 "inf file txtsetup.sif is corrupt or missing status 18." 错误...  
解决方法是改用 WinSetupFromUSB 制作启动盘  

打开 WinSetupFromUSB x64 按照下图设置
![](/assets/img/note/2018-02-21-windows-environment/0x005-001.png)

烧写完成后就能成功加载


## 0x006 解决windbg"your debugger is not using the correct symbols"错误

说明:  
某天用windbg调试堆, 输入!heap时提示"not using correct symbols"  
![](/assets/img/note/2018-02-21-windows-environment/0x006-001.png)

在C盘根目录新建文件夹Symbols, 回到windbg选择File->Symbol File Path
![](/assets/img/note/2018-02-21-windows-environment/0x006-002.png)

在弹出窗口贴上
```
SRV*C:\Symbols*http://msdl.microsoft.com/download/symbols
```

![](/assets/img/note/2018-02-21-windows-environment/0x006-003.png)
重新启动调试, 现在已经正常了


## 0x007 解决Sublime Text 3中文乱码

下载Package Control.sublime-package，选择Preferences->Browse Packages回到上一级目录，放到Installed Packages(没有的话新建一个)
```
http://sublime.wbond.net/Package%20Control.sublime-package
```

Preferences->Package Control
![](/assets/img/note/2018-02-21-windows-environment/0x007-001.png)

选择Package Control: install Package
![](/assets/img/note/2018-02-21-windows-environment/0x007-002.png)

选中ConvertToUTF8
![](/assets/img/note/2018-02-21-windows-environment/0x007-003.png)

重启后报错
```
File: /Users/wooy0ung/workspace/xxx.txt
Encoding: GB2312
Error: Codecs missing

Please install Codecs33 plugin (https://github.com/seanliang/Codecs33/tree/osx).
```

继续安装Codecs33, 重启后就正常了


## 0x008 设置java环境变量

右击计算机，打开属性->高级系统设置->高级->环境变量
![](/assets/img/note/2018-02-21-windows-environment/0x008-001.png)


```
# JAVA_HOME
D:\Program Files\Java\jdk1.8.0_101

# Path添加
%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;

# CLASSPATH
.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;
```

验证
![](/assets/img/note/2018-02-21-windows-environment/0x008-002.png)


0x009 Visual Studio 2015切换中文语言

打开Tools->Options->Environment->International Settings，选择"Get additional languages"
![](/assets/img/note/2018-02-21-windows-environment/0x009-001.png)

在打开页面中下载中文语言包(将链接中的"en-us"改"zh-cn")
![](/assets/img/note/2018-02-21-windows-environment/0x009-002.png)

安装重启


## 0x010 搭建Win10驱动开发环境

安装Visual Studio 2015 Community
![](/assets/img/note/2018-02-21-windows-environment/0x010-001.png)

安装SDK(https://docs.microsoft.com/en-us/windows-hardware/drivers/other-wdk-downloads)
![](/assets/img/note/2018-02-21-windows-environment/0x010-002.png)

安装WDK
![](/assets/img/note/2018-02-21-windows-environment/0x010-003.png)

安装Win10 x64虚拟机，添加一个串行设备
```
# 命名管道
\\.\pipe\win10_x64
```
![](/assets/img/note/2018-02-21-windows-environment/0x010-004.png)

设置Win10虚拟机调试模式
```
bcdedit /debug on
bcdedit /dbgsettings serial debugport:2 baudrate:115200
```

wdk10调试驱动拷贝到虚拟机
![](/assets/img/note/2018-02-21-windows-environment/0x010-005.png)

配置vs2015，打开Driver->Test->Configure Devices
![](/assets/img/note/2018-02-21-windows-environment/0x010-006.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-007.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-008.png)

下载DebugView(https://docs.microsoft.com/zh-cn/sysinternals/downloads/debugview)
![](/assets/img/note/2018-02-21-windows-environment/0x010-009.png)

使用DebugView打印内核调试信息
```
# 另存为*.reg，添加注册表后重启
Windows Registry Editor Version 5.00  
  
[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Session Manager\Debug Print Filter]  
"DEFAULT"=dword:0000000f  
```

关闭PathGuard与驱动强制签名
```
> git clone https://github.com/hfiref0x/UPGDSED.git
```

管理员权限运行patch.exe，重启用另一个选项启动系统
![](/assets/img/note/2018-02-21-windows-environment/0x010-010.png)

创建一个驱动工程，删掉inf文件
![](/assets/img/note/2018-02-21-windows-environment/0x010-011.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-012.png)

新建一个.c文件，贴上代码
```
#include <ntifs.h>   
  
VOID DriverUnload(PDRIVER_OBJECT objDriver)  
{  
    // 避免编译器关于未引用参数的警告  
    UNREFERENCED_PARAMETER(objDriver);  
  
    // 什么也不做，只打印一行字符串  
    KdPrint(("My Dirver is Ending..."));  
}  
  
NTSTATUS DriverEntry(PDRIVER_OBJECT objDriver, PUNICODE_STRING strRegPath)  
{  
    // 避免编译器关于未引用参数的警告  
    UNREFERENCED_PARAMETER(strRegPath);  
  
    // 打印一行字符串，并注册驱动卸载函数，以便于驱动卸载  
    KdPrint(("My  Dirver Is Starting!\r\n"));  
  
    objDriver->DriverUnload = DriverUnload;  
  
    return STATUS_SUCCESS;  
}  
```

设置一下项目属性，编译生成sys
![](/assets/img/note/2018-02-21-windows-environment/0x010-013.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-014.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-015.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-016.png)

管理员权限运行Dbgview(勾选Capture Kernel)、InstDrvNewx64，装载驱动
![](/assets/img/note/2018-02-21-windows-environment/0x010-017.png)

成功的话Dbgview会打印以上信息，若出现以下问题并且Dbgview没有信息显示，重新安装UPGDSED
![](/assets/img/note/2018-02-21-windows-environment/0x010-018.png)

附加虚拟机内核进行调试，虚拟机断下后，输入g继续运行
![](/assets/img/note/2018-02-21-windows-environment/0x010-019.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-020.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-021.png)
![](/assets/img/note/2018-02-21-windows-environment/0x010-022.png)


## 0x011 查看Win10激活状态

查看是否永久激活
```
slmgr.vbs -xpr
```

查看详细信息
```
slmgr.vbs -dlv
```


## 0x012 Win10一条命令关闭Windows Defender

cmd输入命令，重启
```
reg add “HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender” /v “DisableAntiSpyware” /d 1 /t REG_DWORD /f
```

重新启用
```
定位到HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender
删除键值DisableAntiSpyware
```


## 0x013 解决Win10运行VC++ 6.0报错

现象
![](/assets/img/note/2018-02-21-windows-environment/0x013-001.png)

将另外准备的MSDEV.EXE替换掉.\Microsoft Visual Studio\Common\MSDev98\Bin\MSDEV.EXE


## 0x014 Win10关闭自动更新 & 清除更新包

Win + R打开services.msc，找到Windows Update禁用掉
![](/assets/img/note/2018-02-21-windows-environment/0x014-001.png)

打开磁盘清理->清理系统文件
![](/assets/img/note/2018-02-21-windows-environment/0x014-002.png)


## 0x015 关闭Firefox自动更新

地址栏输入：about:config，按以下设置
```
user_pref("app.update.auto", false); 
user_pref("app.update.enabled", false);
```


## 0x016 Windows安装binwalk

```
git clone https://github.com/devttys0/binwalk
cd binwalk
python setup.py install
```

新建D:\toolchain\reverse\binwalk文件夹，添加binwalk.bat
```
@echo off
echo * suggest: you'd better to input the parameters enclosed in double quotes.
echo * made by pcat
python "%~dp0\p_binwalk.py" %1 %2 %3 %4 %5 %6 %7 %8 %9
```

添加p_binwalk.py
```
# -*- coding:utf-8 -*-
# author: pcat
# http://pcat.cnblogs.com
 
import sys
import binwalk
 
if __name__ == "__main__":
    lst=sys.argv
    if len(lst)<2:
        print("No files.")
        exit()
    try:
        if lst[1][0]=='-':
            binwalk.scan(*lst[2:],signature=lst[1])
        elif lst[1][0]!='-':
            binwalk.scan(*lst[1:],signature=True)
    except:
        pass
```

安装完成
![](/assets/img/note/2018-02-21-windows-environment/0x016-001.png)


## 0x017 Windows安装pip命令

现象：
![](/assets/img/note/2018-02-21-windows-environment/0x017-001.png)

下载pip-9.0.2.tar.gz
```
链接：https://pan.baidu.com/s/1d_iDb1mP7BEFqWNS1_JMEg 密码：vkse
```

安装pip
```
> python setup.py install
```

提示"No module named setuptools"，安装setuptools

添加环境变量
```
C:\python27\Scripts
```


## 0x018 VMWare14解锁macOS安装限制

打开任务管理器：win+R，输入 services.msc，将关于 VMware 的服务全部停止运行
![](/assets/img/note/2018-02-21-windows-environment/0x018-001.png)

解压 Unlocker 文件，右键选择以管理员身份运行
![](/assets/img/note/2018-02-21-windows-environment/0x018-002.png)


## 0x020 一条命令关闭Windows Defender

```
# 打开管理员cmd
> reg add “HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender” /v “DisableAntiSpyware” /d 1 /t REG_DWORD /f
# 重启
```
开启 Windows Defender
```
# 打开注册表, 定位到 HKEY_LOCAL_MACHINE\SOFTWARE\Policies\Microsoft\Windows Defender, 删除 DisableAntiSpyware
# 重启
```

注意!! 这会关闭实时防御, 并且无法通过安全中心开启, 但对于防火墙没有影响。

cmd 立即关机
```
> shutdown -s -f -t 0
```

停止 Microsoft (R) Windows Based Script Host
```
# 任务管理器找到 wscript kill掉
```