---
layout:     post
title:      JarvisOJ 公倍数
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>请计算1000000000以内3或5的倍数之和。  
>如：10以内这样的数有3,5,6,9，和是23  
>请提交PCTF{你的答案}  
<!-- more -->


### 0x00 计算

数学问题, 生成一下flag

```
flag = 0
for i in xrange(3,1000000000,3):
    flag += i
for i in xrange(5,1000000000,5):
    flag += i
for i in xrange(15,1000000000,15):
    flag -= i
print flag
```

get flage~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-common-multiple/0x00.png)