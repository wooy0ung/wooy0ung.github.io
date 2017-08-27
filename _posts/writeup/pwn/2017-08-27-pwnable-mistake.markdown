---
layout:     post
title:      pwnable mistake
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>We all make mistakes, let's move on.  
(don't take this too seriously, no fancy hacking skill is required at all)  
>  
>This task is based on real event  
>Thanks to dhmonkey  
>  
>hint : operator priority  
>  
>Address:  
>ssh mistake@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 exploit

运算优先级问题, '>'的优先级大于'='

![](/assets/img/writeup/pwn/2017-08-27-pwnable-mistake/0x00.png)

0000000000 ^ 1111111111 = 1111111111, cmp 1111111111 1111111111 -> getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-mistake/0x01.png)