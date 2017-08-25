---
layout:     post
title:      jarvisoj 爬楼梯
author:     wooy0ung
tags: 		re apk
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
对压缩包中的程序进行分析并获取flag。flag形式为16位大写md5。

题目来源：CFF2016

Download:
https://dn.jarvisoj.com/challengefiles/CFF_100.rar.dbeee1536c0a5ef5844f42c93602aae5
```
<!-- more -->


### 0x01 crack

先运行一遍, 是一个小游戏, 不断点击爬一层楼直至到达目标层数就能看flag

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x00.png)

放到JEB分析, 定位到 Btn_up_onclick 方法, 这里当 to_reach <= has_gone 就会将button设置成可按下

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x01.png)

又发现 onCreate 方法调用 setClickable(false) 初始设置按键不可按下

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x02.png)

再看看smali, 程序在调用 setClickable 方法时通过 v5 传递 0 值

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x03.png)

现在打开 Apktool Box 反编译程序, 在MainActivity.smali里检索 onCreate, 然后将 const/4 v5, 0x0 修改为 const/4 v5, 0x1

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x04.png)

重打包并签名, getflag~

![](/assets/img/ctf/re/2017-08-19-jarvisoj-climb-stairs/0x05.png)