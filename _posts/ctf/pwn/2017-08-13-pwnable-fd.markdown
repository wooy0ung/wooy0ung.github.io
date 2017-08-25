---
layout:     post
title:      pwnable fd
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
http://pwnable.kr/

Problem Description:
Mommy! what is a file descriptor in Linux?

* try to play the wargame your self but if you are ABSOLUTE beginner, follow this tutorial link: https://www.youtube.com/watch?v=blAxTfcW9VU

Address:
ssh fd@pwnable.kr -p2222 (pw:guest)
```
<!-- more -->


### 0x01 exploit

![](/assets/img/ctf/pwn/2017-08-13-pwnable-fd/0x00.png)

令 fd = 0 (标准输入), 输入 "LETMEWIN" 字串

![](/assets/img/ctf/pwn/2017-08-13-pwnable-fd/0x01.png)

getflag~

![](/assets/img/ctf/pwn/2017-08-13-pwnable-fd/0x02.png)