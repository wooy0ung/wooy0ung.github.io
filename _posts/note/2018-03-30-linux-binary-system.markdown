---
layout:		post
title:		linux二进制学习系统篇
author:		wooy0ung
tags:		linux
category:  	note
---


>[索引目录]  
>0x001 /proc  
>0x002 /boot  
>0x003 ECFS(扩展核心文件快照)  
>0x004 ELF文件类型  
>0x005 ELF头部结构  
>0x006 text段 & data段布局结构  
>0x007 重定位隐式加数  
<!-- more -->


## 0x001 /proc

```
# /proc/<pid>/maps
保存了一个进程镜像的布局，包括可执行文件、共享库、栈、堆、和VDSO等

# /proc/kcore
linux内核的动态核心文件，gdb可以使用/proc/kcore对内核进行调试和分析

# /proc/kallsyms
包含内核中绝大部分的符号，是内核所属的/proc的一个入口并且可以动态更新(如果在CONFIG_KALLSYMS_ALL内核配置中指明，可包含内核中的全部符号)

# /proc/iomem
与系统内存相关，可以检索Kernel字符串
$ grep Kernel /proc/iomem
```

## 0x002 /boot

```
# /boot/System.map
包含整个内核的所有符号
```

## 0x003 ECFS(扩展核心文件快照)

特殊的核心转储技术
```
# 源码
https:github.com/elfmaster/ecfs
```


## 0x004 ELF文件类型

```
ET_NOTE: 未知类型
ET_REL: 重定位文件
ET_EXEC: 可执行文件
ET_DYN: 共享目标文件
ET_CORE: 核心文件
```


## 0x005 ELF头部结构

```
typedef struct{
    unsigned char e_ident[EI_NIDENT];
    Elf32_Half e_type;
    Elf32_Half e_machine;
    Elf32_Word e_version;
    Elf32_Addr e_entry;
    Elf32_Off  e_phoff;
    Elf32_Off  e_shoff;
    Elf32_Word e_flags;
    Elf32_Half e_ehsize;
    Elf32_Half e_phentsize;
    Elf32_Half e_phnum;
    Elf32_Half e_shentsize;
    Elf32_Half e_shnum;
    Elf32_Half e_shstrndx;
}Elf32_Ehdr;
```

```
e_ident			Magic,类别，数据，版本，OS/ABI,ABI
e_type			类型
e_machine		系统架构
e_version		版本
e_entry			入口点地址
e_phoff			start of program headers
e_shoff			start of section headers
e_flags			标志
e_ehsize		文件头的大小
e_phentsize		程序头大小
e_phnum			number of program headers
e_shentsize		节头大小
e_shnum			number of program headers
e_shstrndx		字符串表段索引
```


## 0x006 text段 & data段布局结构

text段
```
[.text]: 程序代码
[.rodata]: 只读数据
[.hash]: 符号散列表
[.dynsym]: 共享目标文件符号
[.dynstr]: 共享目标文件符号名称
[.plt]: 过程链接表
[.rel.got]: G.O.T重定位数据
```

data段布局
```
[.data]: 全局的初始化变量
[.dynamic:] 动态链接结构和对象
[.got.plt]: 全局偏移表
[.bss]: 全局未初始化变量
```


## 0x007 重定位隐式加数

重定位前
```
# 调用指令e8 fc ff ff ff(-4 <==> -(sizeof(uint32_t)))保存了隐式加数，call 7表示重定位的偏移量
root@ubuntu:~/workspace/elf# objdump -d obj1.o

obj1.o：     文件格式 elf32-i386


Disassembly of section .text:

00000000 <_start>:
   0:   55                      push   %ebp
   1:   89 e5                   mov    %esp,%ebp
   3:   83 ec 08                sub    $0x8,%esp
   6:   e8 fc ff ff ff          call   7 <_start+0x7>
   b:   90                      nop
   c:   c9                      leave  
   d:   c3                      ret    

root@ubuntu:~/workspace/elf# readelf -r obj1.o

重定位节 '.rel.text' 位于偏移量 0x164 含有 1 个条目：
 偏移量     信息    类型              符号值      符号名称
00000007  00000902 R_386_PC32        00000000   foo

重定位节 '.rel.eh_frame' 位于偏移量 0x16c 含有 1 个条目：
 偏移量     信息    类型              符号值      符号名称
00000020  00000202 R_386_PC32        00000000   .text
```

重定位
```
root@ubuntu:~/workspace/elf/obj# gcc -nostdlib -m32 obj1.o obj2.o -o relocated

root@ubuntu:~/workspace/elf/obj# objdump -d relocated

relocated：     文件格式 elf32-i386


Disassembly of section .text:

080480d8 <_start>:
 80480d8:   55                      push   %ebp
 80480d9:   89 e5                   mov    %esp,%ebp
 80480db:   83 ec 08                sub    $0x8,%esp
 80480de:   e8 03 00 00 00          call   80480e6 <foo>
 80480e3:   90                      nop
 80480e4:   c9                      leave  
 80480e5:   c3                      ret    

080480e6 <foo>:
 80480e6:   55                      push   %ebp
 80480e7:   89 e5                   mov    %esp,%ebp
 80480e9:   90                      nop
 80480ea:   5d                      pop    %ebp
 80480eb:   c3                      ret
```


AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA


87   8c    8e   b5