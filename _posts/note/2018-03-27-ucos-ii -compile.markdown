---
layout:   post
title:    uC/OS-II 编译环境搭建
author:   wooy0ung
tags:     ucos
category: note
---


>[前期准备]  
>1.工作系统: Windows 7 Professional sp0 x86  
>2.源码及uC/OS-II库: 链接：https://pan.baidu.com/s/10IzIXYHJSgnF0RT_wo-_8A 密码：p89s  
>3.Borland C 4.5(BC45): 链接：https://pan.baidu.com/s/1_wPyglzPuwxCtoDvbfqzOA 密码：tpxp  

修改D:\uCOS\OS\SOFTWARE\uCOS-II\EX1_x86L\BC45\TEST\MAKETEST.BAT
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x001.png)

修改D:\uCOS\OS\SOFTWARE\uCOS-II\EX1_x86L\BC45\TEST\TEST.MAK
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x002.png)
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x003.png)

修改D:\uCOS\OS\SOFTWARE\uCOS-II\EX1_x86L\BC45\SOURCE\INCLUDES.H
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x004.png)

修改D:\uCOS\OS\SOFTWARE\uCOS-II\EX1_x86L\BC45\SOURCE\TEST.LNK
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x005.png)

修改D:\uCOS\OS\SOFTWARE\uCOS-II\SOURCE\uCOS_II.C
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x006.png)

编译
```
> D:
> cd D:\uCOS\OS\SOFTWARE\uCOS-II\EX1_x86L\BC45\TEST
> maketest
> test
```
![](/assets/img/note/2018-03-27-ucos-ii-compile/0x007.png)