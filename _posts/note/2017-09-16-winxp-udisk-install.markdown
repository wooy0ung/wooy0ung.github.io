---
layout:     post
title:      制作 Windows XP U盘启动盘
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>前段时间由于需要用到 WinXP, 常规地用 UltraISO 烧录到 U盘。  
>但一开始加载镜像就出现 "inf file txtsetup.sif is corrupt or missing status 18." 错误...  
>解决方法是改用 WinSetupFromUSB 制作启动盘  
<!-- more -->


打开 WinSetupFromUSB x64 按照下图设置

![](/assets/img/note/2017-09-16-winxp-udisk-install/0x00.png)

烧写完成后就能成功加载