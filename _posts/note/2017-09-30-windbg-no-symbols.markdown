---
layout:     post
title:      解决windbg"your debugger is not using the correct symbols"错误
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>某天用windbg调试堆, 输入!heap时提示"not using correct symbols"  
![](/assets/img/note/2017-09-30-windbg-no-symbols/0x00.png)  
<!-- more -->


在C盘根目录新建文件夹Symbols, 回到windbg选择File->Symbol File Path

![](/assets/img/note/2017-09-30-windbg-no-symbols/0x01.png)

在弹出窗口贴上"SRV*C:\Symbols*http://msdl.microsoft.com/download/symbols", 重新启动调试

![](/assets/img/note/2017-09-30-windbg-no-symbols/0x02.png)

现在已经正常了