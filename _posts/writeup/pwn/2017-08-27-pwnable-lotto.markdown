---
layout:     post
title:      pwnable lotto
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mommy! I made a lotto program for my homework.  
>do you want to play?  
>Address:  
>ssh lotto@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 exploit

提交 6 bytes字符 submit, 再从 /dev/urandom 读入 6 bytes字符 lotto

![](/assets/img/writeup/pwn/2017-08-27-pwnable-lotto/0x00.png)

lotto[i] = (lotto[i] % 45) + 1

![](/assets/img/writeup/pwn/2017-08-27-pwnable-lotto/0x01.png)

提交 6 bytes 32 ～ 45 的 ASCII 字符(例如本次的 &&&&&&), 只要在lotto中出现过, 则match = 6, getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-lotto/0x02.png)