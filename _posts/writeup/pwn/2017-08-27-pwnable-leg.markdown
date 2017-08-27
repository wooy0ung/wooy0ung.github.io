---
layout:     post
title:      pwnable leg
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Daddy told me I should study arm.  
>But I prefer to study my leg!  
>  
>Download:  
>http://pwnable.kr/bin/leg.c  
>http://pwnable.kr/bin/leg.asm  
>Address:  
>ssh leg@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 exploit

if key1+key2+key3 = key, getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-leg/0x00.png)

ARM指令处理的三级流水: 执行(PC-8)、译码(PC-4)、取指(PC), PC指向正在执行指令的后2条

![](/assets/img/writeup/pwn/2017-08-27-pwnable-leg/0x01.png)
![](/assets/img/writeup/pwn/2017-08-27-pwnable-leg/0x02.png)
![](/assets/img/writeup/pwn/2017-08-27-pwnable-leg/0x03.png)

getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-leg/0x04.png)