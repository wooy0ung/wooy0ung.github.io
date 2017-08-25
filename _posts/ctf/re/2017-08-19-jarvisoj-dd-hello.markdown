---
layout:     post
title:      jarvisoj DD - Hello
author:     wooy0ung
tags: 		re osx
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
Flag 是下一关的邮箱地址（以 DD 开头）。

Download:
https://dn.jarvisoj.com/challengefiles/1.Hello.12b9bde7c0c8558a9da42aa1798cafc8
```
<!-- more -->


### 0x01 crack

这个个 Mach-O 的可执行文件, 放到IDAfenxi, 主流程没发现什么有用信息, 怀疑存在后门

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-hello/0x00.png)
![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-hello/0x01.png)

再看看 sub_100000DE0、sub_100000CE0, 果然存在后门

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-hello/0x02.png)
![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-hello/0x03.png)


主要流程:

```
1. sub_100000CE0执行完返回一个标志, 存到result
2. 判断result是否为0, 若是执行后门操作, 打印flag
```

直接写个python脚本生成一下flag即可

```
#!/usr/bin/python
# -*- coding:utf8 -*-

byte_100001040 = [0x41, 0x10, 0x11, 0x11, 0x1B, 0x0A, 0x64, 0x67, 0x6A, 0x68, 0x62, 0x68, 0x6E, 0x67,
				0x68, 0x6B, 0x62, 0x3D, 0x65, 0x6A, 0x6A, 0x3D, 0x68, 0x4, 0x5, 0x8, 0x3, 0x2, 0x2, 
				0x55, 0x8, 0x5D, 0x61, 0x55, 0x0A, 0x5F, 0x0D, 0x5D, 0x61, 0x32, 0x17, 0x1D, 0x19, 
				0x1F, 0x18, 0x20, 0x4, 0x2, 0x12, 0x16, 0x1E, 0x54, 0x20, 0x13, 0x14, 0x0, 0x0]

v2 = (0x100000CB0 - 0x100000C90) >> 2 ^ byte_100001040[0]
v1 = 0

while v1<55:
	byte_100001040[v1] = byte_100001040[v1] - 2
	byte_100001040[v1] = byte_100001040[v1] ^ v2
	v1 = v1 + 1
	v2 = v2 + 1

flag = ""
for i in byte_100001040:
	flag += chr(i)

print "Final output is %s" % flag[1:]
```

getflag~

![](/assets/img/ctf/re/2017-08-19-jarvisoj-dd-hello/0x04.png)