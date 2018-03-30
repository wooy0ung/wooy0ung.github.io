---
layout:     post
title:      华为honor v9 play解锁 & root
author:     wooy0ung
tags: 		android
category:  	android
---


## 0x001 解锁设备

申请解锁码，PC端安装华为手机助手
![](/assets/img/android/2018-03-23-honor-v9-play-unlock/0x001.png)

下载解锁所需工具
```
链接：https://pan.baidu.com/s/1tnuj5RxdFgcpgLGqHvTbfw 密码：lf7f
```

设置->关于手机，连续点击7次版本号进入开发者模式，打开usb调试，进入fastboot模式
```
> adb reboot bootloader
> fastboot devices
> fastboot oem unlock **********
```
注意：*为你的解锁码

出现提示选择“Yes”，等待格式化后重启


## 0x002 root