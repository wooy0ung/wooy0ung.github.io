---
layout:     post
title:      jarvisoj Backdoor
author:     wooy0ung
tags: 		linux exe pwn
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
这是一个有后门的程序，有个参数可以触发该程序执行后门操作，请找到这个参数，并提交其SHA256摘要。(小写)

FLAG：PCTF{参数的sha256}

Download:
https://dn.jarvisoj.com/challengefiles/vulnerable.rar.10d720f2dcf2b4133ec512813d7b89ce
```
<!-- more -->


### 0x01 IDA分析

定位到main函数，参数v13比较可疑

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x00.png)

查看一下栈区

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x01.png)
![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x02.png)

若以strcpy(&Dest[v13], Source)作为溢出点，v13 = v13 ^ 0x6443 = (0x20c + 4) ^ 0x6443

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x03.png)

提交错误，由于v13在栈上跟在Dest后面，v13会被垃圾数据填充

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x04.png)

以sub_401000(Dest)里的strcpy(Dest, Source)作溢出点，v13 = v13 ^ 0x6443 = (0x20 + 4) ^ 0x6443

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x05.png)
![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x06.png)

计算sha256，提交正确

```
#!/usr/bin/python
# -*- coding:utf8 -*-

import hashlib

offset = 0x20 + 4
a = hex(offset ^ 0x6443)[2:]
a = a.decode('hex')[::-1]
print "PCTF{" + hashlib.sha256(a).hexdigest() + "}"
```

![](/assets/img/ctf/pwn/2017-07-21-jarvisoj-backdoor/0x07.png)