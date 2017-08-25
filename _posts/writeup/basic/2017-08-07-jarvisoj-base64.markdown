---
layout:     post
title:      jarvisoj base64?
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLG  
>GY4DGNBXGYZTGNLGGY3DGNBWMU3WI===  
<!-- more -->


### 0x00 decrypt

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

![](/assets/img/writeup/basic/2017-08-07-jarvisoj-base64/0x00.png)