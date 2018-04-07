---
layout:		post
title:		linux二进制学习工具篇
author:		wooy0ung
tags:		binary
category:  	note
---


>[索引目录]  
>0x001 gef  
>0x002 pwndbg  
>0x003 peda  
>0x004 windbg  
>0x005 objdump  
>0x006 objcopy  
>0x007 strace  
>0x008 ltrace  
>0x009 readelf  
>0x010 ftrace  
>0x011 gcc  
>0x012 quenya  
<!-- more -->


## 0x001 gef

```
gef➤  elf
Magic                 : 7f 45 4c 46
Class                 : 0x1 - 32-bit
Endianness            : 0x1 - Little-Endian
Version               : 0x1
OS ABI                : 0x0 - System V
ABI Version           : 0x0
Type                  : 0x2 - Executable
Machine               : 0x3 - x86
Program Header Table  : 0x00000034
Section Header Table  : 0x0000117c
Header Table          : 0x00000034
ELF Version           : 0x1
Header size           : 0 (0x0)
Entry point           : 0x08048490
```

```
gef➤  cs
 →     0x804864b                  mov    dword ptr [esp], eax
       0x804864e                  call   0x8048430
       0x8048653                  jmp    0x80485e2
       0x8048655                  leave  
       0x8048656                  ret    
       0x8048657                  push   ebp
```

```
gef➤  asm mov eax,1
[+] Assembling 1 instruction for X86:32 (little endian)
\xb8\x01\x00\x00\x00                                         # mov eax,1
```

```
gef➤  vmmap
Start      End        Offset     Perm Path
0x08048000 0x08049000 0x00000000 r-x /root/workspace/ANYUN2016/safedoor
0x08049000 0x0804a000 0x00000000 r-- /root/workspace/ANYUN2016/safedoor
0x0804a000 0x0804b000 0x00001000 rw- /root/workspace/ANYUN2016/safedoor
0x0804b000 0x0806c000 0x00000000 rw- [heap]
0xf7e03000 0xf7e04000 0x00000000 rw- 
0xf7e04000 0xf7fb4000 0x00000000 r-x /lib/i386-linux-gnu/libc-2.23.so
0xf7fb4000 0xf7fb6000 0x001af000 r-- /lib/i386-linux-gnu/libc-2.23.so
0xf7fb6000 0xf7fb7000 0x001b1000 rw- /lib/i386-linux-gnu/libc-2.23.so
0xf7fb7000 0xf7fba000 0x00000000 rw- 
0xf7fd4000 0xf7fd5000 0x00000000 rw- 
0xf7fd5000 0xf7fd7000 0x00000000 r-- [vvar]
0xf7fd7000 0xf7fd9000 0x00000000 r-x [vdso]
0xf7fd9000 0xf7ffc000 0x00000000 r-x /lib/i386-linux-gnu/ld-2.23.so
0xf7ffc000 0xf7ffd000 0x00022000 r-- /lib/i386-linux-gnu/ld-2.23.so
0xf7ffd000 0xf7ffe000 0x00023000 rw- /lib/i386-linux-gnu/ld-2.23.so
0xfffdd000 0xffffe000 0x00000000 rw- [stack]
```

```
gef➤  checksec
[+] checksec for '/root/workspace/ANYUN2016/safedoor'
Canary                        : No
NX                            : Yes
PIE                           : Yes
Fortify                       : No
RelRO                         : Partial

```


## 0x002 pwndbg

```
pwndbg> arena
{
  mutex = 0, 
  flags = 1, 
  fastbinsY = {0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0, 0x0}, 
  top = 0x804b408, 
  last_remainder = 0x0, 
  bins = {0xf7fb67b0 <main_arena+48>, 0xf7fb67b0 <main_arena+48>, 0xf7fb67b8 <main_arena+56>, 0xf7fb67b8 <main_arena+56>, 0xf7fb67c0 <main_arena+64>, 0xf7fb67c0 <main_arena+64>, 0xf7fb67c8 <main_arena+72>, 0xf7fb67c8 <main_arena+72>, 0xf7fb67d0 <main_arena+80>, 0xf7fb67d0 <main_arena+80>, 0xf7fb67d8 <main_arena+88>, 0xf7fb67d8 <main_arena+88>, 0xf7fb67e0 <main_arena+96>, 0xf7fb67e0 <main_arena+96>, 0xf7fb67e8 <main_arena+104>...}, 
  binmap = {0, 0, 0, 0}, 
  next = 0xf7fb6780 <main_arena>, 
  next_free = 0x0, 
  attached_threads = 1, 
  system_mem = 135168, 
  max_system_mem = 135168
}
```

```
pwndbg> mp
{
  trim_threshold = 131072, 
  top_pad = 131072, 
  mmap_threshold = 131072, 
  arena_test = 2, 
  arena_max = 0, 
  n_mmaps = 0, 
  n_mmaps_max = 65536, 
  max_n_mmaps = 0, 
  no_dyn_threshold = 0, 
  mmapped_mem = 0, 
  max_mmapped_mem = 0, 
  max_total_mem = 0, 
  sbrk_base = 0x804b000 ""
}
```

```
pwndbg> bins
fastbins
0x10: 0x0
0x18: 0x0
0x20: 0x0
0x28: 0x0
0x30: 0x0
0x38: 0x0
0x40: 0x0
unsortedbin
all: 0xf7fb67b0 (main_arena+48) ◂— 0xf7fb67b0
smallbins
0x10: 0xf7fb67b8 (main_arena+56) ◂— 0xf7fb67b8
0x18: 0xf7fb67c0 (main_arena+64) ◂— 0xf7fb67c0
0x20: 0xf7fb67c8 (main_arena+72) ◂— 0xf7fb67c8
0x28: 0xf7fb67d0 (main_arena+80) ◂— 0xf7fb67d0
0x30: 0xf7fb67d8 (main_arena+88) ◂— 0xf7fb67d8
0x38: 0xf7fb67e0 (main_arena+96) ◂— 0xf7fb67e0
0x40: 0xf7fb67e8 (main_arena+104) ◂— 0xf7fb67e8
0x48: 0xf7fb67f0 (main_arena+112) ◂— 0xf7fb67f0
0x50: 0xf7fb67f8 (main_arena+120) ◂— 0xf7fb67f8
0x58: 0xf7fb6800 (main_arena+128) ◂— 0xf7fb6800
0x60: 0xf7fb6808 (main_arena+136) ◂— 0xf7fb6808
0x68: 0xf7fb6810 (main_arena+144) ◂— 0xf7fb6810
0x70: 0xf7fb6818 (main_arena+152) ◂— 0xf7fb6818
0x78: 0xf7fb6820 (main_arena+160) ◂— 0xf7fb6820
0x80: 0xf7fb6828 (main_arena+168) ◂— 0xf7fb6828
0x88: 0xf7fb6830 (main_arena+176) ◂— 0xf7fb6830
0x90: 0xf7fb6838 (main_arena+184) ◂— 0xf7fb6838
0x98: 0xf7fb6840 (main_arena+192) ◂— 0xf7fb6840
0xa0: 0xf7fb6848 (main_arena+200) ◂— 0xf7fb6848
0xa8: 0xf7fb6850 (main_arena+208) ◂— 0xf7fb6850
0xb0: 0xf7fb6858 (main_arena+216) ◂— 0xf7fb6858
0xb8: 0xf7fb6860 (main_arena+224) ◂— 0xf7fb6860
0xc0: 0xf7fb6868 (main_arena+232) ◂— 0xf7fb6868
0xc8: 0xf7fb6870 (main_arena+240) ◂— 0xf7fb6870
0xd0: 0xf7fb6878 (main_arena+248) ◂— 0xf7fb6878
0xd8: 0xf7fb6880 (main_arena+256) ◂— 0xf7fb6880
0xe0: 0xf7fb6888 (main_arena+264) ◂— 0xf7fb6888
0xe8: 0xf7fb6890 (main_arena+272) ◂— 0xf7fb6890
0xf0: 0xf7fb6898 (main_arena+280) ◂— 0xf7fb6898
0xf8: 0xf7fb68a0 (main_arena+288) ◂— 0xf7fb68a0
0x100: 0xf7fb68a8 (main_arena+296) ◂— 0xf7fb68a8
0x108: 0xf7fb68b0 (main_arena+304) ◂— 0xf7fb68b0
0x110: 0xf7fb68b8 (main_arena+312) ◂— 0xf7fb68b8
0x118: 0xf7fb68c0 (main_arena+320) ◂— 0xf7fb68c0
0x120: 0xf7fb68c8 (main_arena+328) ◂— 0xf7fb68c8
0x128: 0xf7fb68d0 (main_arena+336) ◂— 0xf7fb68d0
0x130: 0xf7fb68d8 (main_arena+344) ◂— 0xf7fb68d8
0x138: 0xf7fb68e0 (main_arena+352) ◂— 0xf7fb68e0
0x140: 0xf7fb68e8 (main_arena+360) ◂— 0xf7fb68e8
0x148: 0xf7fb68f0 (main_arena+368) ◂— 0xf7fb68f0
0x150: 0xf7fb68f8 (main_arena+376) ◂— 0xf7fb68f8
0x158: 0xf7fb6900 (main_arena+384) ◂— 0xf7fb6900
0x160: 0xf7fb6908 (main_arena+392) ◂— 0xf7fb6908
0x168: 0xf7fb6910 (main_arena+400) ◂— 0xf7fb6910
0x170: 0xf7fb6918 (main_arena+408) ◂— 0xf7fb6918
0x178: 0xf7fb6920 (main_arena+416) ◂— 0xf7fb6920
0x180: 0xf7fb6928 (main_arena+424) ◂— 0xf7fb6928
0x188: 0xf7fb6930 (main_arena+432) ◂— 0xf7fb6930
0x190: 0xf7fb6938 (main_arena+440) ◂— 0xf7fb6938
0x198: 0xf7fb6940 (main_arena+448) ◂— 0xf7fb6940
0x1a0: 0xf7fb6948 (main_arena+456) ◂— 0xf7fb6948
0x1a8: 0xf7fb6950 (main_arena+464) ◂— 0xf7fb6950
0x1b0: 0xf7fb6958 (main_arena+472) ◂— 0xf7fb6958
0x1b8: 0xf7fb6960 (main_arena+480) ◂— 0xf7fb6960
0x1c0: 0xf7fb6968 (main_arena+488) ◂— 0xf7fb6968
0x1c8: 0xf7fb6970 (main_arena+496) ◂— 0xf7fb6970
0x1d0: 0xf7fb6978 (main_arena+504) ◂— 0xf7fb6978
0x1d8: 0xf7fb6980 (main_arena+512) ◂— 0xf7fb6980
0x1e0: 0xf7fb6988 (main_arena+520) ◂— 0xf7fb6988
0x1e8: 0xf7fb6990 (main_arena+528) ◂— 0xf7fb6990
0x1f0: 0xf7fb6998 (main_arena+536) ◂— 0xf7fb6998
0x1f8: 0xf7fb69a0 (main_arena+544) ◂— 0xf7fb69a0
largebins
0x200: 0xf7fb69a8 (main_arena+552) ◂— 0xf7fb69a8
0x240: 0xf7fb69b0 (main_arena+560) ◂— 0xf7fb69b0
0x280: 0xf7fb69b8 (main_arena+568) ◂— 0xf7fb69b8
0x2c0: 0xf7fb69c0 (main_arena+576) ◂— 0xf7fb69c0
0x300: 0xf7fb69c8 (main_arena+584) ◂— 0xf7fb69c8
0x340: 0xf7fb69d0 (main_arena+592) ◂— 0xf7fb69d0
0x380: 0xf7fb69d8 (main_arena+600) ◂— 0xf7fb69d8
0x3c0: 0xf7fb69e0 (main_arena+608) ◂— 0xf7fb69e0
0x400: 0xf7fb69e8 (main_arena+616) ◂— 0xf7fb69e8
0x440: 0xf7fb69f0 (main_arena+624) ◂— 0xf7fb69f0
0x480: 0xf7fb69f8 (main_arena+632) ◂— 0xf7fb69f8
0x4c0: 0xf7fb6a00 (main_arena+640) ◂— 0xf7fb6a00
0x500: 0xf7fb6a08 (main_arena+648) ◂— 0xf7fb6a08
0x540: 0xf7fb6a10 (main_arena+656) ◂— 0xf7fb6a10
0x580: 0xf7fb6a18 (main_arena+664) ◂— 0xf7fb6a18
0x5c0: 0xf7fb6a20 (main_arena+672) ◂— 0xf7fb6a20
0x600: 0xf7fb6a28 (main_arena+680) ◂— 0xf7fb6a28
0x640: 0xf7fb6a30 (main_arena+688) ◂— 0xf7fb6a30
0x680: 0xf7fb6a38 (main_arena+696) ◂— 0xf7fb6a38
0x6c0: 0xf7fb6a40 (main_arena+704) ◂— 0xf7fb6a40
0x700: 0xf7fb6a48 (main_arena+712) ◂— 0xf7fb6a48
0x740: 0xf7fb6a50 (main_arena+720) ◂— 0xf7fb6a50
0x780: 0xf7fb6a58 (main_arena+728) ◂— 0xf7fb6a58
0x7c0: 0xf7fb6a60 (main_arena+736) ◂— 0xf7fb6a60
0x800: 0xf7fb6a68 (main_arena+744) ◂— 0xf7fb6a68
0x840: 0xf7fb6a70 (main_arena+752) ◂— 0xf7fb6a70
0x880: 0xf7fb6a78 (main_arena+760) ◂— 0xf7fb6a78
0x8c0: 0xf7fb6a80 (main_arena+768) ◂— 0xf7fb6a80
0x900: 0xf7fb6a88 (main_arena+776) ◂— 0xf7fb6a88
0x940: 0xf7fb6a90 (main_arena+784) ◂— 0xf7fb6a90
0x980: 0xf7fb6a98 (main_arena+792) ◂— 0xf7fb6a98
0x9c0: 0xf7fb6aa0 (main_arena+800) ◂— 0xf7fb6aa0
0xa00: 0xf7fb6aa8 (main_arena+808) ◂— 0xf7fb6aa8
0xc00: 0xf7fb6ab0 (main_arena+816) ◂— 0xf7fb6ab0
0xe00: 0xf7fb6ab8 (main_arena+824) ◂— 0xf7fb6ab8
0x1000: 0xf7fb6ac0 (main_arena+832) ◂— 0xf7fb6ac0
0x1200: 0xf7fb6ac8 (main_arena+840) ◂— 0xf7fb6ac8
0x1400: 0xf7fb6ad0 (main_arena+848) ◂— 0xf7fb6ad0
0x1600: 0xf7fb6ad8 (main_arena+856) ◂— 0xf7fb6ad8
0x1800: 0xf7fb6ae0 (main_arena+864) ◂— 0xf7fb6ae0
0x1a00: 0xf7fb6ae8 (main_arena+872) ◂— 0xf7fb6ae8
0x1c00: 0xf7fb6af0 (main_arena+880) ◂— 0xf7fb6af0
0x1e00: 0xf7fb6af8 (main_arena+888) ◂— 0xf7fb6af8
0x2000: 0xf7fb6b00 (main_arena+896) ◂— 0xf7fb6b00
0x2200: 0xf7fb6b08 (main_arena+904) ◂— 0xf7fb6b08
0x2400: 0xf7fb6b10 (main_arena+912) ◂— 0xf7fb6b10
0x2600: 0xf7fb6b18 (main_arena+920) ◂— 0xf7fb6b18
0x2800: 0xf7fb6b20 (main_arena+928) ◂— 0xf7fb6b20
0x2a00: 0xf7fb6b28 (main_arena+936) ◂— 0xf7fb6b28
0x3000: 0xf7fb6b30 (main_arena+944) ◂— 0xf7fb6b30
0x4000: 0xf7fb6b38 (main_arena+952) ◂— 0xf7fb6b38
0x5000: 0xf7fb6b40 (main_arena+960) ◂— 0xf7fb6b40
0x6000: 0xf7fb6b48 (main_arena+968) ◂— 0xf7fb6b48
0x7000: 0xf7fb6b50 (main_arena+976) ◂— 0xf7fb6b50
0x8000: 0xf7fb6b58 (main_arena+984) ◂— 0xf7fb6b58
0x9000: 0xf7fb6b60 (main_arena+992) ◂— 0xf7fb6b60
0xa000: 0xf7fb6b68 (main_arena+1000) ◂— 0xf7fb6b68
0x10000: 0xf7fb6b70 (main_arena+1008) ◂— 0xf7fb6b70
0x18000: 0xf7fb6b78 (main_arena+1016) ◂— 0xf7fb6b78
0x20000: 0xf7fb6b80 (main_arena+1024) ◂— 0xf7fb6b80
0x28000: 0xf7fb6b88 (main_arena+1032) ◂— 0xf7fb6b88
0x40000: 0xf7fb6b90 (main_arena+1040) ◂— 0xf7fb6b90
0x80000: 0xf7fb6b98 (main_arena+1048) ◂— 0xf7fb6b98
```

```
pwndbg> fastbins
fastbins
0x10: 0x0
0x18: 0x0
0x20: 0x0
0x28: 0x0
0x30: 0x0
0x38: 0x0
0x40: 0x0
```

```
pwndbg> unsorted
unsortedbin
all: 0xf7fb67b0 (main_arena+48) ◂— 0xf7fb67b0
```

```
pwndbg> smallbins
smallbins
0x10: 0xf7fb67b8 (main_arena+56) ◂— 0xf7fb67b8
0x18: 0xf7fb67c0 (main_arena+64) ◂— 0xf7fb67c0
0x20: 0xf7fb67c8 (main_arena+72) ◂— 0xf7fb67c8
0x28: 0xf7fb67d0 (main_arena+80) ◂— 0xf7fb67d0
0x30: 0xf7fb67d8 (main_arena+88) ◂— 0xf7fb67d8
0x38: 0xf7fb67e0 (main_arena+96) ◂— 0xf7fb67e0
0x40: 0xf7fb67e8 (main_arena+104) ◂— 0xf7fb67e8
0x48: 0xf7fb67f0 (main_arena+112) ◂— 0xf7fb67f0
0x50: 0xf7fb67f8 (main_arena+120) ◂— 0xf7fb67f8
0x58: 0xf7fb6800 (main_arena+128) ◂— 0xf7fb6800
0x60: 0xf7fb6808 (main_arena+136) ◂— 0xf7fb6808
0x68: 0xf7fb6810 (main_arena+144) ◂— 0xf7fb6810
0x70: 0xf7fb6818 (main_arena+152) ◂— 0xf7fb6818
0x78: 0xf7fb6820 (main_arena+160) ◂— 0xf7fb6820
0x80: 0xf7fb6828 (main_arena+168) ◂— 0xf7fb6828
0x88: 0xf7fb6830 (main_arena+176) ◂— 0xf7fb6830
0x90: 0xf7fb6838 (main_arena+184) ◂— 0xf7fb6838
0x98: 0xf7fb6840 (main_arena+192) ◂— 0xf7fb6840
0xa0: 0xf7fb6848 (main_arena+200) ◂— 0xf7fb6848
0xa8: 0xf7fb6850 (main_arena+208) ◂— 0xf7fb6850
0xb0: 0xf7fb6858 (main_arena+216) ◂— 0xf7fb6858
0xb8: 0xf7fb6860 (main_arena+224) ◂— 0xf7fb6860
0xc0: 0xf7fb6868 (main_arena+232) ◂— 0xf7fb6868
0xc8: 0xf7fb6870 (main_arena+240) ◂— 0xf7fb6870
0xd0: 0xf7fb6878 (main_arena+248) ◂— 0xf7fb6878
0xd8: 0xf7fb6880 (main_arena+256) ◂— 0xf7fb6880
0xe0: 0xf7fb6888 (main_arena+264) ◂— 0xf7fb6888
0xe8: 0xf7fb6890 (main_arena+272) ◂— 0xf7fb6890
0xf0: 0xf7fb6898 (main_arena+280) ◂— 0xf7fb6898
0xf8: 0xf7fb68a0 (main_arena+288) ◂— 0xf7fb68a0
0x100: 0xf7fb68a8 (main_arena+296) ◂— 0xf7fb68a8
0x108: 0xf7fb68b0 (main_arena+304) ◂— 0xf7fb68b0
0x110: 0xf7fb68b8 (main_arena+312) ◂— 0xf7fb68b8
0x118: 0xf7fb68c0 (main_arena+320) ◂— 0xf7fb68c0
0x120: 0xf7fb68c8 (main_arena+328) ◂— 0xf7fb68c8
0x128: 0xf7fb68d0 (main_arena+336) ◂— 0xf7fb68d0
0x130: 0xf7fb68d8 (main_arena+344) ◂— 0xf7fb68d8
0x138: 0xf7fb68e0 (main_arena+352) ◂— 0xf7fb68e0
0x140: 0xf7fb68e8 (main_arena+360) ◂— 0xf7fb68e8
0x148: 0xf7fb68f0 (main_arena+368) ◂— 0xf7fb68f0
0x150: 0xf7fb68f8 (main_arena+376) ◂— 0xf7fb68f8
0x158: 0xf7fb6900 (main_arena+384) ◂— 0xf7fb6900
0x160: 0xf7fb6908 (main_arena+392) ◂— 0xf7fb6908
0x168: 0xf7fb6910 (main_arena+400) ◂— 0xf7fb6910
0x170: 0xf7fb6918 (main_arena+408) ◂— 0xf7fb6918
0x178: 0xf7fb6920 (main_arena+416) ◂— 0xf7fb6920
0x180: 0xf7fb6928 (main_arena+424) ◂— 0xf7fb6928
0x188: 0xf7fb6930 (main_arena+432) ◂— 0xf7fb6930
0x190: 0xf7fb6938 (main_arena+440) ◂— 0xf7fb6938
0x198: 0xf7fb6940 (main_arena+448) ◂— 0xf7fb6940
0x1a0: 0xf7fb6948 (main_arena+456) ◂— 0xf7fb6948
0x1a8: 0xf7fb6950 (main_arena+464) ◂— 0xf7fb6950
0x1b0: 0xf7fb6958 (main_arena+472) ◂— 0xf7fb6958
0x1b8: 0xf7fb6960 (main_arena+480) ◂— 0xf7fb6960
0x1c0: 0xf7fb6968 (main_arena+488) ◂— 0xf7fb6968
0x1c8: 0xf7fb6970 (main_arena+496) ◂— 0xf7fb6970
0x1d0: 0xf7fb6978 (main_arena+504) ◂— 0xf7fb6978
0x1d8: 0xf7fb6980 (main_arena+512) ◂— 0xf7fb6980
0x1e0: 0xf7fb6988 (main_arena+520) ◂— 0xf7fb6988
0x1e8: 0xf7fb6990 (main_arena+528) ◂— 0xf7fb6990
0x1f0: 0xf7fb6998 (main_arena+536) ◂— 0xf7fb6998
0x1f8: 0xf7fb69a0 (main_arena+544) ◂— 0xf7fb69a0
```

```
pwndbg> largebins
largebins
0x200: 0xf7fb69a8 (main_arena+552) ◂— 0xf7fb69a8
0x240: 0xf7fb69b0 (main_arena+560) ◂— 0xf7fb69b0
0x280: 0xf7fb69b8 (main_arena+568) ◂— 0xf7fb69b8
0x2c0: 0xf7fb69c0 (main_arena+576) ◂— 0xf7fb69c0
0x300: 0xf7fb69c8 (main_arena+584) ◂— 0xf7fb69c8
0x340: 0xf7fb69d0 (main_arena+592) ◂— 0xf7fb69d0
0x380: 0xf7fb69d8 (main_arena+600) ◂— 0xf7fb69d8
0x3c0: 0xf7fb69e0 (main_arena+608) ◂— 0xf7fb69e0
0x400: 0xf7fb69e8 (main_arena+616) ◂— 0xf7fb69e8
0x440: 0xf7fb69f0 (main_arena+624) ◂— 0xf7fb69f0
0x480: 0xf7fb69f8 (main_arena+632) ◂— 0xf7fb69f8
0x4c0: 0xf7fb6a00 (main_arena+640) ◂— 0xf7fb6a00
0x500: 0xf7fb6a08 (main_arena+648) ◂— 0xf7fb6a08
0x540: 0xf7fb6a10 (main_arena+656) ◂— 0xf7fb6a10
0x580: 0xf7fb6a18 (main_arena+664) ◂— 0xf7fb6a18
0x5c0: 0xf7fb6a20 (main_arena+672) ◂— 0xf7fb6a20
0x600: 0xf7fb6a28 (main_arena+680) ◂— 0xf7fb6a28
0x640: 0xf7fb6a30 (main_arena+688) ◂— 0xf7fb6a30
0x680: 0xf7fb6a38 (main_arena+696) ◂— 0xf7fb6a38
0x6c0: 0xf7fb6a40 (main_arena+704) ◂— 0xf7fb6a40
0x700: 0xf7fb6a48 (main_arena+712) ◂— 0xf7fb6a48
0x740: 0xf7fb6a50 (main_arena+720) ◂— 0xf7fb6a50
0x780: 0xf7fb6a58 (main_arena+728) ◂— 0xf7fb6a58
0x7c0: 0xf7fb6a60 (main_arena+736) ◂— 0xf7fb6a60
0x800: 0xf7fb6a68 (main_arena+744) ◂— 0xf7fb6a68
0x840: 0xf7fb6a70 (main_arena+752) ◂— 0xf7fb6a70
0x880: 0xf7fb6a78 (main_arena+760) ◂— 0xf7fb6a78
0x8c0: 0xf7fb6a80 (main_arena+768) ◂— 0xf7fb6a80
0x900: 0xf7fb6a88 (main_arena+776) ◂— 0xf7fb6a88
0x940: 0xf7fb6a90 (main_arena+784) ◂— 0xf7fb6a90
0x980: 0xf7fb6a98 (main_arena+792) ◂— 0xf7fb6a98
0x9c0: 0xf7fb6aa0 (main_arena+800) ◂— 0xf7fb6aa0
0xa00: 0xf7fb6aa8 (main_arena+808) ◂— 0xf7fb6aa8
0xc00: 0xf7fb6ab0 (main_arena+816) ◂— 0xf7fb6ab0
0xe00: 0xf7fb6ab8 (main_arena+824) ◂— 0xf7fb6ab8
0x1000: 0xf7fb6ac0 (main_arena+832) ◂— 0xf7fb6ac0
0x1200: 0xf7fb6ac8 (main_arena+840) ◂— 0xf7fb6ac8
0x1400: 0xf7fb6ad0 (main_arena+848) ◂— 0xf7fb6ad0
0x1600: 0xf7fb6ad8 (main_arena+856) ◂— 0xf7fb6ad8
0x1800: 0xf7fb6ae0 (main_arena+864) ◂— 0xf7fb6ae0
0x1a00: 0xf7fb6ae8 (main_arena+872) ◂— 0xf7fb6ae8
0x1c00: 0xf7fb6af0 (main_arena+880) ◂— 0xf7fb6af0
0x1e00: 0xf7fb6af8 (main_arena+888) ◂— 0xf7fb6af8
0x2000: 0xf7fb6b00 (main_arena+896) ◂— 0xf7fb6b00
0x2200: 0xf7fb6b08 (main_arena+904) ◂— 0xf7fb6b08
0x2400: 0xf7fb6b10 (main_arena+912) ◂— 0xf7fb6b10
0x2600: 0xf7fb6b18 (main_arena+920) ◂— 0xf7fb6b18
0x2800: 0xf7fb6b20 (main_arena+928) ◂— 0xf7fb6b20
0x2a00: 0xf7fb6b28 (main_arena+936) ◂— 0xf7fb6b28
0x3000: 0xf7fb6b30 (main_arena+944) ◂— 0xf7fb6b30
0x4000: 0xf7fb6b38 (main_arena+952) ◂— 0xf7fb6b38
0x5000: 0xf7fb6b40 (main_arena+960) ◂— 0xf7fb6b40
0x6000: 0xf7fb6b48 (main_arena+968) ◂— 0xf7fb6b48
0x7000: 0xf7fb6b50 (main_arena+976) ◂— 0xf7fb6b50
0x8000: 0xf7fb6b58 (main_arena+984) ◂— 0xf7fb6b58
0x9000: 0xf7fb6b60 (main_arena+992) ◂— 0xf7fb6b60
0xa000: 0xf7fb6b68 (main_arena+1000) ◂— 0xf7fb6b68
0x10000: 0xf7fb6b70 (main_arena+1008) ◂— 0xf7fb6b70
0x18000: 0xf7fb6b78 (main_arena+1016) ◂— 0xf7fb6b78
0x20000: 0xf7fb6b80 (main_arena+1024) ◂— 0xf7fb6b80
0x28000: 0xf7fb6b88 (main_arena+1032) ◂— 0xf7fb6b88
0x40000: 0xf7fb6b90 (main_arena+1040) ◂— 0xf7fb6b90
0x80000: 0xf7fb6b98 (main_arena+1048) ◂— 0xf7fb6b98
```

```
pwndbg> heap
Top Chunk: 0x804b408
Last Remainder: 0

0x804b000 PREV_INUSE {
  prev_size = 0, 
  size = 1033, 
  fd = 0x41414141, 
  bk = 0x24342520, 
  fd_nextsize = 0xa78, 
  bk_nextsize = 0x0
}
0x804b408 PREV_INUSE {
  prev_size = 0, 
  size = 134137, 
  fd = 0x0, 
  bk = 0x0, 
  fd_nextsize = 0x0, 
  bk_nextsize = 0x0
}
```

```
pwndbg> malloc_chunk a
```

```
pwndbg> top_chunk
0x804b408 PREV_INUSE {
  prev_size = 0, 
  size = 134137, 
  fd = 0x0, 
  bk = 0x0, 
  fd_nextsize = 0x0, 
  bk_nextsize = 0x0
}
```

```
pwndbg> !pr
```

```
pwndbg> context
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
─────────────────────────────────[ REGISTERS ]──────────────────────────────────
*EAX  0x6
 EBX  0x0
*ECX  0xffffffff
*EDX  0xf7fb7870 (_IO_stdfile_1_lock) ◂— 0x0
*EDI  0xf7fb6000 (_GLOBAL_OFFSET_TABLE_) ◂— 0x1b1db0
*ESI  0xf7fb6000 (_GLOBAL_OFFSET_TABLE_) ◂— 0x1b1db0
*EBP  0xffffcf98 —▸ 0xffffcfa8 ◂— 0x0
*ESP  0xffffce80 —▸ 0x804872c ◂— inc    ebp /* 'ERROR:' */
*EIP  0x8048645 ◂— lea    eax, [ebp - 0x108]
───────────────────────────────────[ DISASM ]───────────────────────────────────
 ► 0x8048645    lea    eax, [ebp - 0x108]
   0x804864b    mov    dword ptr [esp], eax
   0x804864e    call   printf@plt <0x8048430>
 
   0x8048653    jmp    0x80485e2
    ↓
   0x80485e2    mov    dword ptr [esp], 0x8048700
   0x80485e9    call   printf@plt <0x8048430>
 
   0x80485ee    mov    eax, dword ptr [stdin] <0x804a040>
   0x80485f3    mov    dword ptr [esp + 8], eax
   0x80485f7    mov    dword ptr [esp + 4], 0xff
   0x80485ff    lea    eax, [ebp - 0x108]
   0x8048605    mov    dword ptr [esp], eax
───────────────────────────────────[ STACK ]────────────────────────────────────
00:0000│ esp  0xffffce80 —▸ 0x804872c ◂— inc    ebp /* 'ERROR:' */
01:0004│      0xffffce84 —▸ 0x8048705 ◂— push   ebx
02:0008│      0xffffce88 —▸ 0xf7fb65a0 (_IO_2_1_stdin_) ◂— 0xfbad2288
03:000c│      0xffffce8c —▸ 0xf7e07f12 ◂— cdq    
04:0010│      0xffffce90 ◂— 'AAAA %4$x\n'
05:0014│      0xffffce94 ◂— ' %4$x\n'
06:0018│      0xffffce98 ◂— 0xf7000a78 /* 'x\n' */
07:001c│      0xffffce9c ◂— 0x7b1ea71
─────────────────────────────────[ BACKTRACE ]──────────────────────────────────
 ► f 0  8048645
   f 1  8048662
   f 2 f7e1c637 __libc_start_main+247
Breakpoint *0x08048645
```

```
pwndbg> procinfo
exe        '/root/workspace/ANYUN2016/safedoor'
pid        7874
tid        7874
ppid       7865
uid        [0, 0, 0, 0]
gid        [0, 0, 0, 0]
groups     [0]
fd[0]      /dev/pts/1
fd[1]      /dev/pts/1
fd[2]      /dev/pts/1
```

```
pwndbg> rop --grep "pop edi" -- --nojop --nosys --depth 2
Saved corefile /tmp/tmp4927_z73
0xf7fd99d4 : pop edi ; ret
0xf7fdcfdd : pop edi ; ret 0
```

```
pwndbg> vmmap
LEGEND: STACK | HEAP | CODE | DATA | RWX | RODATA
 0x8048000  0x8049000 r-xp     1000 0      /root/workspace/ANYUN2016/safedoor
 0x8049000  0x804a000 r--p     1000 0      /root/workspace/ANYUN2016/safedoor
 0x804a000  0x804b000 rw-p     1000 1000   /root/workspace/ANYUN2016/safedoor
 0x804b000  0x806c000 rw-p    21000 0      [heap]
0xf7e03000 0xf7e04000 rw-p     1000 0      
0xf7e04000 0xf7fb4000 r-xp   1b0000 0      /lib/i386-linux-gnu/libc-2.23.so
0xf7fb4000 0xf7fb6000 r--p     2000 1af000 /lib/i386-linux-gnu/libc-2.23.so
0xf7fb6000 0xf7fb7000 rw-p     1000 1b1000 /lib/i386-linux-gnu/libc-2.23.so
0xf7fb7000 0xf7fba000 rw-p     3000 0      
0xf7fd4000 0xf7fd5000 rw-p     1000 0      
0xf7fd5000 0xf7fd7000 r--p     2000 0      [vvar]
0xf7fd7000 0xf7fd9000 r-xp     2000 0      [vdso]
0xf7fd9000 0xf7ffc000 r-xp    23000 0      /lib/i386-linux-gnu/ld-2.23.so
0xf7ffc000 0xf7ffd000 r--p     1000 22000  /lib/i386-linux-gnu/ld-2.23.so
0xf7ffd000 0xf7ffe000 rw-p     1000 23000  /lib/i386-linux-gnu/ld-2.23.so
0xfffdd000 0xffffe000 rw-p    21000 0      [stack]
```

```
pwndbg> dd esp
ffffce80     0804872c 08048705 f7fb65a0 f7e07f12
ffffce90     41414141 24342520 f7000a78 07b1ea71
ffffcea0     f7ff5ac4 ffffcf50 f7ff39f3 f7fd4470
ffffceb0     00000000 00000000 f7ffd000 f7ffdc08
```

```
pwndbg> dps $esp
00:0000│ esp  0xffffce80 —▸ 0x804872c ◂— inc    ebp /* 'ERROR:' */
01:0004│      0xffffce84 —▸ 0x8048705 ◂— push   ebx
02:0008│      0xffffce88 —▸ 0xf7fb65a0 (_IO_2_1_stdin_) ◂— 0xfbad2288
03:000c│      0xffffce8c —▸ 0xf7e07f12 ◂— cdq    
04:0010│      0xffffce90 ◂— 'AAAA %4$x\n'
05:0014│      0xffffce94 ◂— ' %4$x\n'
06:0018│      0xffffce98 ◂— 0xf7000a78 /* 'x\n' */
07:001c│      0xffffce9c ◂— 0x7b1ea71
```

```
pwndbg> stack 20
00:0000│ esp  0xffffce80 —▸ 0x804872c ◂— inc    ebp /* 'ERROR:' */
01:0004│      0xffffce84 —▸ 0x8048705 ◂— push   ebx
02:0008│      0xffffce88 —▸ 0xf7fb65a0 (_IO_2_1_stdin_) ◂— 0xfbad2288
03:000c│      0xffffce8c —▸ 0xf7e07f12 ◂— cdq    
04:0010│      0xffffce90 ◂— 'AAAA %4$x\n'
05:0014│      0xffffce94 ◂— ' %4$x\n'
06:0018│      0xffffce98 ◂— 0xf7000a78 /* 'x\n' */
07:001c│      0xffffce9c ◂— 0x7b1ea71
08:0020│      0xffffcea0 —▸ 0xf7ff5ac4 ◂— jae    0xf7ff5b3f
09:0024│      0xffffcea4 —▸ 0xffffcf50 ◂— 0xffffffff
0a:0028│      0xffffcea8 —▸ 0xf7ff39f3 ◂— cmp    al, 0x6d /* '<main program>' */
0b:002c│      0xffffceac —▸ 0xf7fd4470 —▸ 0xf7ffd918 ◂— 0x0
0c:0030│      0xffffceb0 ◂— 0x0
... ↓
0e:0038│      0xffffceb8 —▸ 0xf7ffd000 (_GLOBAL_OFFSET_TABLE_) ◂— 0x23f3c
0f:003c│      0xffffcebc —▸ 0xf7ffdc08 —▸ 0xf7fd7000 ◂— jg     0xf7fd7047
10:0040│      0xffffcec0 ◂— 0x0
... ↓
13:004c│      0xffffcecc —▸ 0xffffcf5c —▸ 0xf7fd41b0 —▸ 0xf7e04000 ◂— jg     0xf7e04047
```


## 0x003 peda

```
gdb-peda$ aslr
ASLR is OFF
gdb-peda$ aslr on
gdb-peda$ aslr
ASLR is ON
```

```
gdb-peda$ checksec
CANARY    : disabled
FORTIFY   : disabled
NX        : ENABLED
PIE       : disabled
RELRO     : Partial
```

```
gdb-peda$ dumpargs
No argument
```

```
gdb-peda$ dumprop
Warning: this can be very slow, do not run for large memory range
Writing ROP gadgets to file: safedoor-rop.txt ...
Dump all ROP gadgets in specific memory range
    Note: only for simple gadgets, for full ROP search try: http://ropshell.com
    Warning: this can be very slow, do not run for big memory range
Usage:
    dumprop start end [keyword] [depth]
    dumprop mapname [keyword]
        default gadget instruction depth is: 5
```

```
gdb-peda$ elfheader
.interp = 0x8048154
.note.ABI-tag = 0x8048168
.note.gnu.build-id = 0x8048188
.gnu.hash = 0x80481ac
.dynsym = 0x80481d8
.dynstr = 0x80482a8
.gnu.version = 0x8048324
.gnu.version_r = 0x8048340
.rel.dyn = 0x8048360
.rel.plt = 0x8048378
.init = 0x80483c0
.plt = 0x80483f0
.text = 0x8048490
.fini = 0x80486e4
.rodata = 0x80486f8
.eh_frame_hdr = 0x8048734
.eh_frame = 0x8048770
.init_array = 0x8049f08
.fini_array = 0x8049f0c
.jcr = 0x8049f10
.dynamic = 0x8049f14
.got = 0x8049ffc
.got.plt = 0x804a000
.data = 0x804a030
.bss = 0x804a040
```

```
gdb-peda$ elfsymbol
Found 8 symbols
setbuf@plt = 0x8048400
strcmp@plt = 0x8048410
mprotect@plt = 0x8048420
printf@plt = 0x8048430
fgets@plt = 0x8048450
puts@plt = 0x8048460
__gmon_start__@plt = 0x8048470
__libc_start_main@plt = 0x8048480
```

```
gdb-peda$ pattern create 100
'AAA%AAsAABAA$AAnAACAA-AA(AADAA;AA)AAEAAaAA0AAFAAbAA1AAGAAcAA2AAHAAdAA3AAIAAeAA4AAJAAfAA5AAKAAgAA6AAL'
gdb-peda$ pattern offset A6
A6 found at offset: 95
```

```
gdb-peda$ procinfo
exe = /root/workspace/ANYUN2016/safedoor
fd[0] -> /dev/pts/1
fd[1] -> /dev/pts/1
fd[2] -> /dev/pts/1
pid = 8589
ppid = 8581
uid = [0, 0, 0, 0]
gid = [0, 0, 0, 0]
```

```
gdb-peda$ pshow
ansicolor = 'on'
autosave = 'on'
badchars = ''
clearscr = 'on'
context = 'register,code,stack'
crashlog = 'peda-crashdump-safedoor.txt'
debug = 'off'
indent = 4
p_charset = ''
pagesize = 25
pattern = 1
payload = 'peda-payload-safedoor.txt'
session = 'peda-session-safedoor.txt'
snapshot = 'peda-snapshot-safedoor.raw'
tracedepth = 0
tracelog = 'peda-trace-safedoor.txt'
verbose = 'off'
```

```
gdb-peda$ readelf
.interp = 0x8048154
.note.ABI-tag = 0x8048168
.note.gnu.build-id = 0x8048188
.gnu.hash = 0x80481ac
.dynsym = 0x80481d8
.dynstr = 0x80482a8
.gnu.version = 0x8048324
.gnu.version_r = 0x8048340
.rel.dyn = 0x8048360
.rel.plt = 0x8048378
.init = 0x80483c0
.plt = 0x80483f0
.text = 0x8048490
.fini = 0x80486e4
.rodata = 0x80486f8
.eh_frame_hdr = 0x8048734
.eh_frame = 0x8048770
.init_array = 0x8049f08
.fini_array = 0x8049f0c
.jcr = 0x8049f10
.dynamic = 0x8049f14
.got = 0x8049ffc
.got.plt = 0x804a000
.data = 0x804a030
.bss = 0x804a040
```

```
gdb-peda$ ropgadget
ret = 0x80483ca
popret = 0x80483e1
pop3ret = 0x80486cd
pop2ret = 0x80486ce
pop4ret = 0x80486cc
addesp_12 = 0x80483de
addesp_44 = 0x80486c9
```

```
gdb-peda$ find "/bin/sh" libc
Searching for '/bin/sh' in: libc ranges
Found 1 results, display max 1 items:
libc : 0xf7f5fa0b ("/bin/sh")
```

```
gdb-peda$ shellcode generate x86/linux exec
# x86/linux/exec: 24 bytes
shellcode = (
    "\x31\xc0\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x31"
    "\xc9\x89\xca\x6a\x0b\x58\xcd\x80"
)
```

```
gdb-peda$ vmmap
Start      End        Perm	Name
0x08048000 0x08049000 r-xp	/root/workspace/ANYUN2016/safedoor
0x08049000 0x0804a000 r--p	/root/workspace/ANYUN2016/safedoor
0x0804a000 0x0804b000 rw-p	/root/workspace/ANYUN2016/safedoor
0x0804b000 0x0806c000 rw-p	[heap]
0xf7e03000 0xf7e04000 rw-p	mapped
0xf7e04000 0xf7fb4000 r-xp	/lib/i386-linux-gnu/libc-2.23.so
0xf7fb4000 0xf7fb6000 r--p	/lib/i386-linux-gnu/libc-2.23.so
0xf7fb6000 0xf7fb7000 rw-p	/lib/i386-linux-gnu/libc-2.23.so
0xf7fb7000 0xf7fba000 rw-p	mapped
0xf7fd4000 0xf7fd5000 rw-p	mapped
0xf7fd5000 0xf7fd7000 r--p	[vvar]
0xf7fd7000 0xf7fd9000 r-xp	[vdso]
0xf7fd9000 0xf7ffc000 r-xp	/lib/i386-linux-gnu/ld-2.23.so
0xf7ffc000 0xf7ffd000 r--p	/lib/i386-linux-gnu/ld-2.23.so
0xf7ffd000 0xf7ffe000 rw-p	/lib/i386-linux-gnu/ld-2.23.so
0xfffdd000 0xffffe000 rw-p	[stack]
```

```
gdb-peda$ context_stack 20
[------------------------------------stack-------------------------------------]
0000| 0xffffce80 --> 0x804872c ("ERROR:")
0004| 0xffffce84 --> 0x8048705 ("STjJaOEwLszsLwRy\n")
0008| 0xffffce88 --> 0xf7fb65a0 --> 0xfbad2288 
0012| 0xffffce8c --> 0xf7e07f12 --> 0x21d24b99 
0016| 0xffffce90 ("AAAA %4$x\n")
0020| 0xffffce94 (" %4$x\n")
0024| 0xffffce98 --> 0xf7000a78 
0028| 0xffffce9c --> 0x7b1ea71 
0032| 0xffffcea0 --> 0xf7ff5ac4 ("symbol=%s;  lookup in file=%s [%lu]\n")
0036| 0xffffcea4 --> 0xffffcf50 --> 0xffffffff 
0040| 0xffffcea8 --> 0xf7ff39f3 ("<main program>")
0044| 0xffffceac --> 0xf7fd4470 --> 0xf7ffd918 --> 0x0 
0048| 0xffffceb0 --> 0x0 
0052| 0xffffceb4 --> 0x0 
0056| 0xffffceb8 --> 0xf7ffd000 --> 0x23f3c 
0060| 0xffffcebc --> 0xf7ffdc08 --> 0xf7fd7000 (jg     0xf7fd7047)
0064| 0xffffcec0 --> 0x0 
0068| 0xffffcec4 --> 0x0 
0072| 0xffffcec8 --> 0x0 
0076| 0xffffcecc --> 0xffffcf5c --> 0xf7fd41b0 --> 0xf7e04000 --> 0x464c457f
```


## 0x004 windbg

.lastevent命令将显示导致调试器停止的最近调试事件。
```
0:000> .lastevent
Last event: ea8.c98: Hit breakpoint 2(断点事件，中断到二号断点)
  debugger time: Sun Sep 15 00:30:25.559 2013 (UTC + 8:00)
```

查看目标系统信息：version、vertarget。vertarget显示信息是version显示信息的子集。
```
0:003> version
Windows 7 Version 7601 (Service Pack 1) MP (4 procs) Free x64
Product: WinNt, suite: SingleUserTS
kernel32.dll version: 6.1.7601.18229 (win7sp1_gdr.130801-1533)
Machine Name:
Debug session time: Sun Jun  8 01:34:28.237 2014 (UTC + 8:00)
System Uptime: 0 days 15:00:02.315
Process Uptime: 0 days 1:14:30.753
  Kernel time: 0 days 0:00:00.109
  User time: 0 days 0:00:00.046
Live user mode: <Local>
 
Microsoft (R) Windows Debugger Version 6.12.0002.633 AMD64
Copyright (c) Microsoft Corporation. All rights reserved.
 
command line: '"C:Program FilesDebugging Tools for Windows (x64)windbg.exe" '  Debugger Process 0x1FD0 
dbgeng:  image 6.12.0002.633, built Tue Feb 02 04:15:54 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)dbgeng.dll]
dbghelp: image 6.12.0002.633, built Tue Feb 02 04:15:44 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)dbghelp.dll]
        DIA version: 20921
Extension DLL search Path:
    C:Program FilesDebugging Tools for Windows (x64)WINXP;C:Program FilesDebugging Tools for Windows (x64)winext;C:Program FilesDebugging Tools for Windows (x64)winextarcade;C:Program FilesDebugging Tools for Windows (x64)pri;C:Program FilesDebugging Tools for Windows (x64);C:Program FilesDebugging Tools for Windows (x64)winextarcade;C:Windowssystem32;C:Windows;C:WindowsSystem32Wbem;C:WindowsSystem32WindowsPowerShellv1.0;C:Program Files (x86)Microsoft SQL Server100ToolsBinn;C:Program FilesMicrosoft SQL Server100ToolsBinn;C:Program FilesMicrosoft SQL Server100DTSBinn;C:Python27;C:UsersxxxDocumentschromiumdepot_tools;C:Python27Scripts;C:UsersxxxDocumentschromiumdepot_tools
Extension DLL chain:
    dbghelp: image 6.12.0002.633, API 6.1.6, built Tue Feb 02 04:15:44 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)dbghelp.dll]
    ext: image 6.12.0002.633, API 1.0.0, built Tue Feb 02 04:15:46 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)winextext.dll]
    exts: image 6.12.0002.633, API 1.0.0, built Tue Feb 02 04:15:38 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)WINXPexts.dll]
    uext: image 6.12.0002.633, API 1.0.0, built Tue Feb 02 04:15:36 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)winextuext.dll]
    ntsdexts: image 6.1.7650.0, API 1.0.0, built Tue Feb 02 04:15:18 2010
        [path: C:Program FilesDebugging Tools for Windows (x64)WINXPntsdexts.dll]
0:003> vertarget
Windows 7 Version 7601 (Service Pack 1) MP (4 procs) Free x64
Product: WinNt, suite: SingleUserTS
kernel32.dll version: 6.1.7601.18229 (win7sp1_gdr.130801-1533)
Machine Name:
Debug session time: Sun Jun  8 01:34:44.967 2014 (UTC + 8:00)
System Uptime: 0 days 15:00:19.045
Process Uptime: 0 days 1:14:47.483
  Kernel time: 0 days 0:00:00.109
  User time: 0 days 0:00:00.046
```

显示进程环境块
```
0:000:x86> !peb
PEB at 000000007efdf000
    InheritedAddressSpace:    No
    ReadImageFileExecOptions: No
    BeingDebugged:            Yes
    ImageBaseAddress:         0000000001000000
    Ldr                       0000000077b52640
    Ldr.Initialized:          Yes
    Ldr.InInitializationOrderModuleList: 00000000002c3170 . 00000000002c37a0
    Ldr.InLoadOrderModuleList:           00000000002c3040 . 00000000002c3ec0
    Ldr.InMemoryOrderModuleList:         00000000002c3050 . 00000000002c3ed0
            Base TimeStamp                     Module
         1000000 472187dc Oct 26 14:23:24 2007 C:UserspanjiajieDocumentsawdawdbinWinXP.x86.chk2sample.exe
        77a20000 51fb164a Aug 02 10:15:38 2013 C:WindowsSYSTEM32ntdll.dll
        756f0000 51fb16c8 Aug 02 10:17:44 2013 C:WindowsSYSTEM32wow64.dll
        75690000 51fb16cb Aug 02 10:17:47 2013 C:WindowsSYSTEM32wow64win.dll
        75680000 51fb16c9 Aug 02 10:17:45 2013 C:WindowsSYSTEM32wow64cpu.dll
    SubSystemData:     0000000000000000
    ProcessHeap:       00000000002c0000
    ProcessParameters: 00000000002c22b0
```

显示线程环境块
```
0:000:x86> !teb
Wow64 TEB32 at 000000007efdd000
Wow64 TEB at 000000007efdb000
    ExceptionList:        000000007efdd000
    StackBase:            000000000008fd20
    StackLimit:           000000000008c000
    SubSystemTib:         0000000000000000
    FiberData:            0000000000001e00
    ArbitraryUserPointer: 0000000000000000
    Self:                 000000007efdb000
    EnvironmentPointer:   0000000000000000
    ClientId:             0000000000001b54 . 00000000000012ac
    RpcHandle:            0000000000000000
    Tls Storage:          0000000000000000
    PEB Address:          000000007efdf000
    LastErrorValue:       0
    LastStatusValue:      0
    Count Owned Locks:    0
    HardErrorMode:        0
```

显示最近错误码
```
0:000:x86> !gle
LastErrorValue: (NTSTATUS) 0 (0) - STATUS_WAIT_0
LastStatusValue: (NTSTATUS) 0 - STATUS_WAIT_0
Wow64 TEB status:
LastErrorValue: (NTSTATUS) 0 (0) - STATUS_WAIT_0
LastStatusValue: (NTSTATUS) 0 - STATUS_WAIT_0
```

查询错误码含义： !error
```
0:000> !error 3
Error code: (NTSTATUS) 0x3 (3) - STATUS_WAIT_3
```

显示异常记录：.exr
显示上下文记录：.cxr
此两个命令通常在一块使用。在排查问题时非常好用。
```
//下面的日志是有应用程序检查器输出的
=======================================
VERIFIER STOP 00000013: pid 0x6DC: First chance access violation for current stack trace. 
 
    02245000 : Invalid address causing the exception.
    0040102A : Code address executing the invalid access.
    0012FC88 : Exception record.
    0012FCA4 : Context record.
 
// 查看异常的详细信息
0:000> .exr 0012fc88 
ExceptionAddress: 0040102a (HeapOverflow!wmain+0x0000002a)
   ExceptionCode: c0000005 (Access violation)
  ExceptionFlags: 00000000
NumberParameters: 2
   Parameter[0]: 00000001
   Parameter[1]: 02245000
Attempt to write to address 02245000
 
// 查看异常时的上下文
0:000> .cxr 0012fca4 
eax=34333231 ebx=00000000 ecx=38373635 edx=00000000 esi=02244ff8 edi=02246ff8
eip=0040102a esp=0012ff70 ebp=0012ffc0 iopl=0         nv up ei pl nz na po nc
cs=001b  ss=0023  ds=0023  es=0023  fs=003b  gs=0000             efl=00010202
HeapOverflow!wmain+0x2a:
0040102a 885608          mov     byte ptr [esi+8],dl        ds:0023:02245000=??
```

寄存器的值
```
0:003> r
rax=000007fffffd7000 rbx=0000000000000000 rcx=000007fffffdf000
rdx=0000000077b17ed0 rsi=0000000000000000 rdi=0000000000000000
rip=0000000077a70590 rsp=00000000023cfde8 rbp=0000000000000000
 r8=0000000000000000  r9=0000000077b17ed0 r10=0000000000000000
r11=0000000000000000 r12=0000000000000000 r13=0000000000000000
r14=0000000000000000 r15=0000000000000000
iopl=0         nv up ei pl zr na po nc
cs=0033  ss=002b  ds=002b  es=002b  fs=0053  gs=002b             efl=00000246
ntdll!DbgBreakPoint:
00000000`77a70590 cc              int     3
```
伪寄存器
伪寄存器是一些符号性的名字，形式为$name。调试器将伪寄存器视为一些变量，在这些变量中保存的是当前调试回话中的一些值。
$ip:指令指针寄存器
$ra:当前函数返回地址
$retreg:主要的值寄存器，在函数调用返回后，函数结果将存放在这个寄存器中。x86架构等于eax，x64架构等于rax。
$csp:当前的桟指针
$proc:当前的进程。在这个伪寄存器中包含的是用户态的进程环境块地址。
$thread:当前的线程，在这个伪寄存器中包含的是用户态的线程环境块地址。
$tpid:当前进程标识符
$tid:当前现成标识符

反汇编当前$ip地址上的8条指令
```
0:000> u .
02sample!RaiseAV [c:awdchapter2sample.cpp @ 53]:
00000000`ffa418a0 4883ec18        sub     rsp,18h
00000000`ffa418a4 48c7042400000000 mov     qword ptr [rsp],0
00000000`ffa418ac 488b0424        mov     rax,qword ptr [rsp]
00000000`ffa418b0 66c7000000      mov     word ptr [rax],0
00000000`ffa418b5 4883c418        add     rsp,18h
00000000`ffa418b9 c3              ret
00000000`ffa418ba cc              int     3
00000000`ffa418bb cc              int     3
```

反汇编包含当前$ip整个函数
```
0:000> uf .
02sample!RaiseAV [c:awdchapter2sample.cpp @ 53]:
   53 00000000`ffa418a0 4883ec18        sub     rsp,18h
   54 00000000`ffa418a4 48c7042400000000 mov     qword ptr [rsp],0
   55 00000000`ffa418ac 488b0424        mov     rax,qword ptr [rsp]
   55 00000000`ffa418b0 66c7000000      mov     word ptr [rax],0
   56 00000000`ffa418b5 4883c418        add     rsp,18h
   56 00000000`ffa418b9 c3              ret
```

反汇编当前$ip之前的8条指令
```
0:000> ub .
02sample!RaiseCPP+0x28:
00000000`ffa41898 cc              int     3
00000000`ffa41899 cc              int     3
00000000`ffa4189a cc              int     3
00000000`ffa4189b cc              int     3
00000000`ffa4189c cc              int     3
00000000`ffa4189d cc              int     3
00000000`ffa4189e cc              int     3
00000000`ffa4189f cc              int     3
```

kp解释参数的形式显示调用桟
```
0:000> kp
Child-SP          RetAddr           Call Site
00000000`0019f4d8 00000000`ffa119b0 KERNELBASE!DebugBreak+0x2
00000000`0019f4e0 00000000`ffa119d9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 0)+0x30 [c:awdchapter2sample.cpp @ 117]
00000000`0019f520 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 2)+0x59 [c:awdchapter2sample.cpp @ 119]
00000000`0019f560 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 3)+0x49 [c:awdchapter2sample.cpp @ 119]
00000000`0019f5a0 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 4)+0x49 [c:awdchapter2sample.cpp @ 119]
00000000`0019f5e0 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 5)+0x49 [c:awdchapter2sample.cpp @ 119]
00000000`0019f620 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 6)+0x49 [c:awdchapter2sample.cpp @ 119]
00000000`0019f660 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall(unsigned int n = 7)+0x49 [c:awdchapter2sample.cpp @ 119]
```

kb 显示调用桟的前三个参数
```
0:000> kb
RetAddr           : Args to Child                                                           : Call Site
00000000`ffa119b0 : 00000000`00000007 65206f54`203e0a0d 00000002`00500028 00000000`00001324 : KERNELBASE!DebugBreak+0x2
00000000`ffa119d9 : 00000000`00000000 00000000`50000163 00000000`00000007 00000000`01adfc18 : 02sample!KBTest::Fibonacci_fastcall+0x30 [c:awdchapter2sample.cpp @ 117]
00000000`ffa119c9 : 00000000`00000002 000007fe`fe2c1302 00000000`00000003 00000000`0019f644 : 02sample!KBTest::Fibonacci_fastcall+0x59 [c:awdchapter2sample.cpp @ 119]
00000000`ffa119c9 : 00000000`00000003 00000000`00070106 00000000`74c10a00 00000000`4e04004a : 02sample!KBTest::Fibonacci_fastcall+0x49 [c:awdchapter2sample.cpp @ 119]
```

显示调用桟空间的大小
```
0:000> kf
  Memory  Child-SP          RetAddr           Call Site
          00000000`0019f4d8 00000000`ffa119b0 KERNELBASE!DebugBreak+0x2
        8 00000000`0019f4e0 00000000`ffa119d9 02sample!KBTest::Fibonacci_fastcall+0x30 [c:awdchapter2sample.cpp @ 117]
       40 00000000`0019f520 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall+0x59 [c:awdchapter2sample.cpp @ 119]
       40 00000000`0019f560 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall+0x49 [c:awdchapter2sample.cpp @ 119]
       40 00000000`0019f5a0 00000000`ffa119c9 02sample!KBTest::Fibonacci_fastcall+0x49 [c:awdchapter2sample.cpp @ 119]
```

手动构造调用桟
在某些情况下，只有一部分的桟是可用的，此时调试器的k命令无法解析桟，这是因为当前桟基指针ebp和栈顶指针esp所指向的地址不可访问。所以需要我们手动构造调用桟。在这个过程当中，最困难的任务就是从内存中找出两个值来表示调用桟中正确的桟帧。找出这两个值的方法之一就是识别出一系列的值，这些值表示当前桟中的某个地址。
```
dc esp 显示栈顶的内存
0:000:x86> dc esp
000cfc9c  010017eb 00000001 00000000 000cfcbc  ................
000cfcac  01001810 00000000 00000001 00000002  ................
000cfcbc  000cfcd0 01001802 00000002 00000001  ................
000cfccc  00000003 000cfce4 01001802 00000003  ................
000cfcdc  00000001 00000004 000cfcf8 01001802  ................
000cfcec  00000004 00000001 00000005 000cfd0c  ................
000cfcfc  01001802 00000005 00000001 00000006  ................
000cfd0c  000cfd20 01001802 00000006 00000001   ...............

找到桟帧，用k去构造
0:000:x86> k = 000cfcbc 000cfcd0 10
ChildEBP RetAddr  
WARNING: Frame IP not in any known module. Following frames may be wrong.
000cfccc 000cfce4 0x10
000cfcd0 01001802 0xcfce4
000cfce4 01001802 02sample!KBTest::Fibonacci_stdcall+0x42 [c:awdchapter2sample.cpp @ 119]
000cfcf8 01001802 02sample!KBTest::Fibonacci_stdcall+0x42 [c:awdchapter2sample.cpp @ 119]
000cfd0c 01001802 02sample!KBTest::Fibonacci_stdcall+0x42 [c:awdchapter2sample.cpp @ 119]
000cfd20 01001802 02sample!KBTest::Fibonacci_stdcall+0x42 [c:awdchapter2sample.cpp @ 119]
000cfd34 01001802 02sample!KBTest::Fibonacci_stdcall+0x42 [c:awdchapter2sample.cpp @ 119]
```

断点命令
代码断点可以通过命令bp来设置，这个命令的参数可以是需要设置断点的地址、断点选项、断点限制，以及一个字符串表示在触发断点时需要执行的命令。

bl是显示所有的断点。

命令bm可以在参数中指定一个符号模式，这样在所有与这个符号模式匹配的地址上都将设置一个断点。

windows操作系统会在必要时加载动态链接库，而我们经常需要在一个还没有被加载的模块上设置断点。命令bu可以用来设置一个延迟断点，只有当这个模块所以的模块被加载时，延迟断点才成为一个正在的断点。例如：bu ole32!CoinitializeEx

设置内存访问断点
```
// 查看全局对象gGlobal
0:000> dt gGlobal
02sample!gGlobal
   +0x000 m_ref            : 0n0
   
// 设置内存断点
0:000:x86> ba w4 gGlobal+0
0:000:x86> bl
 0 e x86 010043f0 w 4 0001 (0001)  0:**** 02sample!gGlobal

0:000:x86> g
Breakpoint 0 hit
02sample!Global::Global+0x12:
01001d82 8b45fc          mov     eax,dword ptr [ebp-4] ss:002b:000cff30={02sample!gGlobal (010043f0)}
0:000:x86> ub .
02sample!AppInfo::Loop+0xbf:
01001d6f cc              int     3
02sample!Global::Global [c:awdchapter2sample.cpp @ 35]:
01001d70 8bff            mov     edi,edi
01001d72 55              push    ebp
01001d73 8bec            mov     ebp,esp
01001d75 51              push    ecx
01001d76 894dfc          mov     dword ptr [ebp-4],ecx
01001d79 8b45fc          mov     eax,dword ptr [ebp-4]
01001d7c c70001000000    mov     dword ptr [eax],1
```

显示变量值命令
dv显示局部变量的值
dv /i 将在第2列显示符号的类型和参数类型
dv /V 将显示变量的存储地址

如果变量为复合类型，例如是一个数据结构或者累，可以是用dt显示准确的值。

查看内存命令
```
// 显示局部变量
0:000:x86> dv 
           argc = 1
           argv = 0x00642918
        appInfo = class AppInfo
 
// 显示双字数据
0:000:x86> dc 0x00642920
00642920  003a0043 0055005c 00650073 00730072  C.:..U.s.e.r.s.
00642930  0070005c 006e0061 0069006a 006a0061  .p.a.n.j.i.a.j.
00642940  00650069 0044005c 0063006f 006d0075  i.e..D.o.c.u.m.
00642950  006e0065 00730074 0061005c 00640077  e.n.t.s..a.w.d.
00642960  0061005c 00640077 00690062 005c006e  .a.w.d.b.i.n..
00642970  00690057 0058006e 002e0050 00380078  W.i.n.X.P...x.8.
00642980  002e0036 00680063 005c006b 00320030  6...c.h.k..0.2.
00642990  00610073 0070006d 0065006c 0065002e  s.a.m.p.l.e...e.
 
// 转储unicode字符串
0:000:x86> du 0x00642920
00642920  "C:UserspanjiajieDocumentsawd"
00642960  "awdbinWinXP.x86.chk2sample.e"
006429a0  "xe"
 
// 显示内存值
0:000:x86> dd 0x00642920
00642920  003a0043 0055005c 00650073 00730072
00642930  0070005c 006e0061 0069006a 006a0061
00642940  00650069 0044005c 0063006f 006d0075
00642950  006e0065 00730074 0061005c 00640077
00642960  0061005c 00640077 00690062 005c006e
00642970  00690057 0058006e 002e0050 00380078
00642980  002e0036 00680063 005c006b 00320030
00642990  00610073 0070006d 0065006c 0065002e
 
// 转储ascii字符串
0:000:x86> da 0x00642920
00642920  "C"
 
// d*s命令把内存中的每个元素当作符号进行解析，dds是以4个字节解析，dqs以4个字节解析，dps是以最合适的字节长度解析
0:000:x86> dps esp
000cfb88  01001955 02sample!KBTest::Fibonacci_thiscall+0x45 [c:awdchapter2sample.cpp @ 129]
000cfb8c  00000001
000cfb90  00000000
000cfb94  000cff0c
000cfb98  00000001
000cfb9c  000cfbb8
000cfba0  01001980 02sample!KBTest::Fibonacci_thiscall+0x70 [c:awdchapter2sample.cpp @ 133]
000cfba4  00000000
000cfba8  00000001
000cfbac  00000002
000cfbb0  000cff0c
000cfbb4  00000003
000cfbb8  000cfbd4
000cfbbc  0100196f 02sample!KBTest::Fibonacci_thiscall+0x5f [c:awdchapter2sample.cpp @ 133]
 
// 调试器将在内存中进行迭代，将这块内存视作一系列的32位或者64位指针。它将内存中读取出来的值都作为指向不同数据类型的指针，随后使用这种指针来显示数据。
dpu 显示一个unicode字符串数组。
```

调用!address显示内存地址的信息
```
0:000:x86> !address
 
  BaseAddr EndAddr+1 RgnSize     Type       State                 Protect             Usage
-------------------------------------------------------------------------------------------
*        0    10000    10000             MEM_FREE    PAGE_NOACCESS                      Free 
*    10000    20000    10000 MEM_MAPPED  MEM_COMMIT  PAGE_READWRITE                     MemoryMappedFile "PageFile"
*    20000    30000    10000 MEM_MAPPED  MEM_COMMIT  PAGE_READWRITE                     MemoryMappedFile "PageFile"
*    30000    40000    10000             MEM_FREE    PAGE_NOACCESS                      Free 
*    40000    41000     1000 MEM_IMAGE   MEM_COMMIT  PAGE_READONLY                      <unclassified> 
*    41000    50000     f000             MEM_FREE    PAGE_NOACCESS                      Free 
*    50000    89000    39000 MEM_PRIVATE MEM_RESERVE                                    Stack64 [1b54.12ac; ~0]
|-   89000    8c000     3000 MEM_PRIVATE MEM_COMMIT  PAGE_READWRITE|PAGE_GUARD          Stack64 [1b54.12ac; ~0]
|-   8c000    90000     4000 MEM_PRIVATE MEM_COMMIT  PAGE_READWRITE                     Stack64 [1b54.12ac; ~0]
*    90000    cc000    3c000 MEM_PRIVATE MEM_RESERVE                                    Stack32 [1b54.12ac; ~0]
|-   cc000    ce000     2000 MEM_PRIVATE MEM_COMMIT  PAGE_READWRITE|PAGE_GUARD          Stack32 [1b54.12ac; ~0]
|-   ce000    d0000     2000 MEM_PRIVATE MEM_COMMIT  PAGE_READWRITE                     Stack32 [1b54.12ac; ~0]
*    d0000    d4000     4000 MEM_MAPPED  MEM_COMMIT  PAGE_READONLY                      MemoryMappedFile "PageFile"
 
0:000:x86> !address @esp
Usage:                  Stack32
Allocation Base:        00090000
Base Address:           000ce000
End Address:            000d0000
Region Size:            00002000
Type:                   00020000	MEM_PRIVATE
State:                  00001000	MEM_COMMIT
Protect:                00000004	PAGE_READWRITE
More info:              ~0k
```


## 0x005 objdump

```
# 查看ELF文件中所有节的数据或代码
objdump -D <elf_object>

# 只查看ELF文件中的程序代码
objdump -d <elf_objdump>

# 查看所有符号
objdump -tT <elf_objdump>
```


## 0x006 objcopy

```
# 将.data节从一个ELF目标文件复制到另一个文件中
objcopy -only-section=.data <infile> <outfile>
```

## 0x007 strace

```
# 系统调用跟踪一个基本的程序
strace /bin/ls -o ls.out

# 系统调用跟踪一个现存的进程
strace -p <pid> -o daemon.out

# 查看读入到文件描述符3中的所有数据
strace -e read=3 /bin/ls
```

## 0x008 ltrace

```
# 查看库函数调用
ltrace <program> -o program.out

# 查看系统调用
ltrace <program> -S program.out
```

## 0x009 readelf

```
# 查看节头表
readelf -S <object>

# 查询程序头表
readelf -l <object>

# 查询符号表
readelf -s <object>

# 查询ELF文件头数据
readelf -e <object>

# 查询重定位入口
readelf -r <object>

# 查询动态段
readelf -d <object>

# 查看ELF文件
readelf -h <object>
```


## 0x010 ftrace

```
$ gcc ftrace.c -o ftrace
$ ftrace -s <file>
$ ftrace -S <file>

# 删除符号表
$ gcc -nostdlib test2.c -o <file>    # 不使用libc进行链接
$ strip <file>    # 删除符号表
```


## 0x011 gcc

```
# 源代码编译预处理。在预处理过程中，对源代码文件中的文件包含(include)、预编译语句(如宏定义define等)进行分析
gcc -E hello.c -o hello.i

# 经过编译器，生成汇编代码
gcc -S hello.i -o hello.s

# 经过汇编器，生成目标代码
gcc -c hello.s -o hello.o

# 经过链接器，生成可执行程序：在链接阶段，所有的目标文件被安排在可执行程序中的恰当的位置，同时，该程序所调用到的库函数也从各自所在的档案库中连到合适的地方
gcc hello.o -o hello
# 链接多个文件
gcc -nostdlib -m32 obj1.o obj2.o -o relocated

# 也可一步生成.o文件
gcc -c hello.c

参数:
-m32  # 编译x86程序
-fomit-frame-pointer  # 混淆程序入口
-nostdlib # 不链接libc
```


## 0x012 quenya

修改源文件
```
# 打开/root/toolchain/quenya/libptrace/configure，注释掉
#ac_config_files="$ac_config_files tests/linux/Makefile"

#ac_config_files="$ac_config_files tests/windows/Makefile"

#ac_config_files="$ac_config_files tests/windows/psapi/Makefile"

#ac_config_files="$ac_config_files tests/windows/psapiutil/Makefile"

# 然后
$ ./configure

# 打开/root/toolchain/quenya/libptrace/Makefile，注释掉
#am__append_1 = tests/linux
#am__append_2 = tests/windows

#DIST_SUBDIRS = src tests/linux tests/windows

# 然后
$ make

# 打开/root/toolchain/quenya/us_exec/Makefile，添加-m32参数，然后
$ make

# 进入/root/toolchain/quenya/libdasm-1.5，然后
$ make

# 回到/root/toolchain/quenya
$ make

$ ./quenya
```

编译完成
![](/assets/img/note/2018-03-01-linux-binary-tools/0x012-001.png)

编译测试程序
```
#include <sys/syscall.h>

int _write(int fd,void *buf,int count)
{
  long ret;
  
  __asm__ __volatile__ ("pushl %%ebx\n\t"
  "movl %%esi,%%ebx\n\t"
  "int $0x80\n\t""popl %%ebx":"=a" (ret)
        :"0" (SYS_write),"S" ((long) fd),
  "c" ((long) buf),"d" ((long) count));
  if(ret>=0)
  {
    return (int) ret;
  }
  return -1;
}

int evil_puts(void)
{
  _write(1,"HAHA puts() has been hijacked!\n",31);
}

$ gcc -c evil_puts.c

#include <stdio.h>

int main()
{
  puts("Hello World!\n");
}

$ gcc hello.c -o hello
```

文件注入并重定位
```
[Quenya v0.1@ubuntu] reloc evil_puts.o hello
0x08048628  addr: 0x8048616
0x080485c8 _write addr: 0x8048622
0x080485c8  addr: 0x8048693
0x080485c8  addr: 0x80486bb
Injection/Relocation succeeded
```

重写全局偏移表条目
```
[Quenya v0.1@ubuntu] hijack binary hello evil_puts puts
Attempting to hijack function: puts
Modifying GOT entry for puts
Succesfully hijacked function: puts
Commiting changes into executable file
```

成功hijack
![](/assets/img/note/2018-03-01-linux-binary-tools/0x012-002.png)