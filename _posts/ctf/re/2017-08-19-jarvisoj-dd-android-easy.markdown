---
layout:     post
title:      jarvisoj DD - Android Easy
author:     wooy0ung
tags: 		re apk
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
Flag 为下一关邮箱。

Download:
https://dn.jarvisoj.com/challengefiles/DDCTF-Easy.apk.64812266499cc050ac23e190e53b87f7
```
<!-- more -->


### 0x01 crack

先运行一遍, 是一个常规的登录验证程序

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-android-easy/0x00.png)

定位到 onClickTest 方法, 取得输入字串与从 i 方法中取得的字串相比较, 判断相同则打印出一串字符, 估计就是flag

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-android-easy/0x01.png)

然后是 i 方法的执行过程 

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-android-easy/0x02.png)

最后写个python脚本, 仿照 i 方法生成flag

```
#!/usr/bin/python
# -*- coding:utf8 -*-

s = [113, 123, 118, 112, 108, 94, 99, 72, 38, 68, 72, 87, 89, 72, 36, 118, 100, 78, 72, 87, 121, 83, 101, 39, 62, 94, 62, 38, 107, 115, 106]

v0 = []
for i in range(len(s)):
	v0.append(s[i] ^ 23)

print v0

flag = ""
for i in v0:
	flag += chr(i)

print flag
```

getflag~

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-android-easy/0x03.png)