---
layout:     post
title:      jarvisoj DD - Android Normal
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>提交下一关的邮箱地址。  
>  
>解压密码 infected。  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/6.Android%20Normal.zip.a5cfb93ac5f5bc28cfed35a1dea052db  
<!-- more -->


### 0x00 crack

常规的密码验证程序, 但涉及 java、C/C++ 混合编程, 稍麻烦些

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x00.png)

按下按键, 取得输入字串并与从 stringFromJNI 方法生成的字串比较, stringFromJNI 在 hello-libs 中定义

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x01.png)
![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x02.png)

由于 stringFromJNI 返回的字串先存到 v1, 再比较, 可以直接将flag打印出来

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x03.png)

直接修改 MainActivity.smali

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x04.png)
![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x05.png)

回编译、签名, 运行, getflag~

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x06.png)


### 0x01 postscript

也可通过调试

![](/assets/img/writeup/re/2017-08-20-jarvisoj-dd-android-normal/0x07.png)