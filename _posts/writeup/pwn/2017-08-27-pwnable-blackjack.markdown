---
layout:     post
title:      pwnable blackjack
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Hey! check out this C implementation of blackjack game!  
>I found it online  
>* http://cboard.cprogramming.com/c-programming/114023-simple-blackjack-program.html  
>  
>I like to give my flags to millionares.  
>how much money you got?   
>Address:  
>nc pwnable.kr 9009  
<!-- more -->


### 0x00 game

一个有bug的小游戏, cash 达到 100W 就能拿flag

![](/assets/img/writeup/pwn/2017-08-27-pwnable-blackjack/0x00.png)

检查源码发现, betting 处进入 if 后 bet可以写任意数值

![](/assets/img/writeup/pwn/2017-08-27-pwnable-blackjack/0x01.png)

尽情玩吧, 赢一次即可, getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-blackjack/0x02.png)