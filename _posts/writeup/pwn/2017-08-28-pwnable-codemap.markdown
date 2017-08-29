---
layout:     post
title:      pwnable codemap
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>I have a binary that has a lot information inside heap.  
>How fast can you reverse-engineer this?  
>(hint: see the information inside EAX,EBX when 0x403E65 is executed)  
>Download:  
>http://pwnable.kr/bin/codemap.exe  
>Address:  
>ssh codemap@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 IDA分析

根据提示ssh连上远程主机, nc 连上本地进程, 提示要依次输入 2nd、3nd biggest 的 chunk 里存放的 string

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x00.png)

直接看伪代码, 先伪随机生成 size 为 0～99999 的堆块(v9 = random_size)

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x01.png)

从字串 "abc...890" 随机 copy 16 bytes 到堆上(v18 = chunk_addr)

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x02.png)

循环 1000 次, 随机数种子 srand(v16), 每轮程序运行生成的堆块大小与存储字串一致

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x03.png)

本地 debug exe, 定位到 0x00403E65(先关闭ASLR), 此时 eax 存放size, ebx 存放 string_addr

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x04.png)


### 0x01 dump

由于循环1000次, 人工处理比较麻烦, 这里直接写个 python 脚本 dump 出寄存器数据

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from idaapi import *  
from idc import *  
import os

count = 0
eax_list = list()
ebx_list = list()

try:
    if debugger:
        print("[*] Removing previous hook ...")
        debugger.unhook()
except:
    pass

AddBpt(0x403E65)
print "[*] Set hook OK ...\n"

StartDebugger("","","")  
for i in range(0,999):
    GetDebuggerEvent(WFNE_SUSP|WFNE_CONT, -1)
    print "[+]",i
    eax = GetRegValue("EAX")
    eax_list.append(eax)
    ebx = GetRegValue("EBX")
    ebx_list.append(ebx)
    if i == 998:
        print '[+] eax max : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "max",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])

        print '[+] eax second : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "second",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])        

        print '[+] eax third : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "third",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])
```

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x05.png)

将得到的 string 提交到远程主机, getflag~

![](/assets/img/writeup/pwn/2017-08-28-pwnable-codemap/0x06.png)