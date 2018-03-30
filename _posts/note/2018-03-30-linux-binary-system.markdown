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