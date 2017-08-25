---
layout:     post
title:      shiyanbar 貌似有点难
author:     wooy0ung
tags: 		web
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
http://www.shiyanbar.com/

Problem Description:
不多说，去看题目吧。

Address:
http://ctf5.shiyanbar.com/phpaudit/
```
<!-- more -->


### 0x01 solution

直接看php源码

![](/assets/img/ctf/web/2017-08-18-shiyanbar-little-difficult/0x00.png)

发现判断ip是否为 1.1.1.1 , 在header添加 client-ip: 1.1.1.1, 提交, getflag~

![](/assets/img/ctf/web/2017-08-18-shiyanbar-little-difficult/0x01.png)