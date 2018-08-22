---
layout:		post
title:		Kernel debugging with IDA Pro/Windbg plugin and VirtualKD
author:		wooy0ung
tags:		windows
category:	note
---

- 目录
{:toc #markdown-toc}

>[配置环境]  
>客户机: Windows 7 x86 sp0  s
>主机: Windows 10  
<!-- more -->


启动Win7，执行vmmon64.exe
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x001.png)
记下这里的"kd_Windows-7Professional-sp0-x86"

打开IDA Pro, 选择"Debugger->Attach->Windbg debugger"
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x002.png)

在打开页设置管道"com:port=\\.\pipe\kd_Windows-7-Professional-sp0-x86,pipe"
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x003.png)

继续打开设置页面
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x004.png)

在打开页面选中"Kernel mode debugging"
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x005.png)

返回最初页面，选择"OK"，会弹出attach页面
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x006.png)

继续"OK"，成功附加上去
![](/assets/img/note/2018-08-03-kernel-debug-with-idapro-and-virtualkd/0x007.png)