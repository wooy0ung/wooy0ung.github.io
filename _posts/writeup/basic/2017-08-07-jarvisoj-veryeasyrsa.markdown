---
layout:     post
title:      jarvisoj veryeasyRSA
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>已知RSA公钥生成参数：  
>  
>p = 3487583947589437589237958723892346254777  
>q = 8767867843568934765983476584376578389  
>e = 65537  
>  
>求d =  
>  
>请提交PCTF{d}  
>  
>Supplementary:  
>Hint1: 有好多小伙伴问d提交什么格式的，现在明确一下，提交十进制的d  
<!-- more -->


### 0x00 decrypt

RSA的私钥生成, 直接调用python库

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from base64 import *

flag = b32decode('GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLGGY4DGNBXGYZTGNLGGY3DGNBWMU3WI===')
print flag
print flag.decode('hex')
```

![](/assets/img/writeup/basic/2017-08-07-jarvisoj-veryeasyrsa/0x00.png)

再贴一份decrypt脚本

```
#!/usr/bin/python
# -*- coding:utf8 -*-

def computeD(fn, e):
    (x, y, r) = extendedGCD(fn, e)
    #y maybe < 0, so convert it
    if y < 0:
        return fn + y
    return y

def extendedGCD(a, b):
    #a*xi + b*yi = ri
    if b == 0:
        return (1, 0, a)
    #a*x1 + b*y1 = a
    x1 = 1
    y1 = 0
    #a*x2 + b*y2 = b
    x2 = 0
    y2 = 1
    while b != 0:
        q = a / b
        #ri = r(i-2) % r(i-1)
        r = a % b
        a = b
        b = r
        #xi = x(i-2) - q*x(i-1)
        x = x1 - q*x2
        x1 = x2
        x2 = x
        #yi = y(i-2) - q*y(i-1)
        y = y1 - q*y2
        y1 = y2
        y2 = y
    return(x1, y1, a)

p = 3487583947589437589237958723892346254777
q = 8767867843568934765983476584376578389
e = 65537

n = p * q
fn = (p - 1) * (q - 1)

d = computeD(fn, e)
print d
```