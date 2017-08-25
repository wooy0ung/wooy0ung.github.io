---
layout:     post
title:      pwnable collision
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
http://pwnable.kr/

Problem Description:
Daddy told me about cool MD5 hash collision today.
I wanna do something like that too!

Address:
ssh col@pwnable.kr -p2222 (pw:guest)
```
<!-- more -->


### 0x01 exploit

![](/assets/img/ctf/pwn/2017-08-13-pwnable-collision/0x00.png)

输入 passcode, len = 20 bytes, 以 4 bytes 为一组的 hex 值累加, 与关键值 0x21DD09EC 比较

![](/assets/img/ctf/pwn/2017-08-13-pwnable-collision/0x01.png)

注意, 不能以 "\xEC\x09\xDD\x21" + 16 * "\x00\x00\x00\x00", 否则 strlen 返回 len < 20

![](/assets/img/ctf/pwn/2017-08-13-pwnable-collision/0x02.png)

getflag~

![](/assets/img/ctf/pwn/2017-08-13-pwnable-collision/0x03.png)