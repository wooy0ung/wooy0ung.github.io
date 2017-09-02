---
layout:     post
title:      pwnable memcpy
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>Problem Description:  
>Mommy! I think I know how to make shellcodes   
>Address:  
>ssh asm@pwnable.kr -p2222 (pw: guest)  
<!-- more -->


### 0x00 IDA分析

copy 源码, 先编译跑一遍

```
$ apt-get install g++-multilib
$ gcc -o memcpy memcpy.c -m32 -lm
```

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x00.png)
![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x01.png)

发现调用 fast_memcpy 报错, 检查源码

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x02.png)

发现 movntps 指令需要 16 bytes 对齐

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x03.png)

本地 GDB debug, 在 fast_memcpy 0x8048737 下断

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x04.png)

转到 movntps XMMWORD PTR [edx], xmm0

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x05.png)

发现 edx 没有 16 bytes对齐

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x06.png)

### 0x01 exploit

构造一串 size 令 edx 16 bytes 对齐, 8 16 32(if len<64), 72 136 264 520 1032 2056 4104(if len>=64)

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x07.png)

getflag~

![](/assets/img/writeup/pwn/2017-08-29-pwnable-memcpy/0x08.png)