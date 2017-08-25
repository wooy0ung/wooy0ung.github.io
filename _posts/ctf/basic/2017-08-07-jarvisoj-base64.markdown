---
layout:     post
title:      jarvisoj base64?
author:     wooy0ung
tags: 		basic
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLGGY4DGNBXGYZTGNLGGY3DGNBWMU3WI===
```
<!-- more -->


### 0x01 decrypt

base32, 直接python脚本解密

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from base64 import *

flag = b32decode('GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLGGY4DGNBXGYZTGNLGGY3DGNBWMU3WI===')
print flag
print flag.decode('hex')
```

getflag~

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-base64/0x00.png)