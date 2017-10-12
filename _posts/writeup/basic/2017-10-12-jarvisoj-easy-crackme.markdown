---
layout:     post
title:      JarvisOJ Easy Crackme
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>都说逆向挺难的，但是这题挺容易的，反正我不会，大家来挑战一下吧~~:)  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/easycrackme.6dbc7c78c9bb25f724cd55c0e1412617  
<!-- more -->


### 0x00 crack

拖到IDA分析

![](/assets/img/writeup/re/2017-10-12-jarvisoj-easy-crackme/0x00.png)

校验算法直接出来了, 生成一下flag

```
pad1 = [0xab,0xdd,0x33,0x54,0x35,0xef]
pad2 = [0xfb,0x9e,0x67,0x12,0x4e,0x9d,0x98,0xab,0x00,0x06,0x46,0x8a,0xf4,0xb4,0x06,0x0b,0x43,0xdc,0xd9,0xa4,0x6c,0x31,0x74,0x9c,0xd2,0xa0]

flag = ""
flag += chr(pad2[0]^0xab);
for i in range(1,26):
    flag += chr(pad1[i%6]^pad2[i])

print flag
```

get flag~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-easy-crackme/0x00.png)

