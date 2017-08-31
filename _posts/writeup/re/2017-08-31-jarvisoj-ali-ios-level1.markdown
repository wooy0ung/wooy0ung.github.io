---
layout:     post
title:      AliCrackme 2015 iOS Level1
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>二十二世纪，人类社会沦为电脑智能主体MATRIX的寄生物，一群电脑病毒似的幸存者聚集在一起组成人类反抗组织，试图颠覆由强大的电脑所建立的虚拟世界，然而MATRIX派出的电脑特警成为这一行动的最大死敌，人类需要找到救世主Neo。  
<!-- more -->


### 0x00 crack



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