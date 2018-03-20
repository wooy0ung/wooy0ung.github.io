---
layout:     post
title:      jarvisoj [61dctf]]Android Easy
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/androideasy.apk.17e528e9498d4ae25dc82ad43730a03d  
<!-- more -->


### 0x00 crack

与 DD - Android Easy 类似, 输入字串经过一个异或与某子串相同则通过 check, 输入字串为flag

![](/assets/img/writeup/re/2017-08-19-jarvisoj-61dctf-androideasy/0x00.png)

然后是脚本

```
#!/usr/bin/python
# -*- coding:utf8 -*-

s = [113, 123, 118, 112, 108, 94, 99, 72, 38, 68, 72, 87, 89, 72, 36, 118, 100, 78, 72, 87, 121, 83, 101, 39, 62, 94, 62, 38, 107, 115, 106]

v0 = []
for i in range(len(s)):
	v0.append(s[i] ^ 23)

print v0

flag = ""
for i in v0:
	flag += chr(i)

print flag
```

getflag~

![](/assets/img/writeup/re/2017-08-19-jarvisoj-61dctf-androideasy/0x01.png)