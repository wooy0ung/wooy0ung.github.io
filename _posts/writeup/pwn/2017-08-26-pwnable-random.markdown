---
layout:     post
title:      pwnable random
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Daddy, teach me how to use random value in programming!  
>  
>Address:  
>ssh random@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 exploit

if key ^ random = 0xdeadbeef, getflag~

![](/assets/img/writeup/pwn/2017-08-26-pwnable-random/0x00.png)

未设置随机数种子, 默认种子为 srand(1), 每次生成的伪随机数都相同

![](/assets/img/writeup/pwn/2017-08-26-pwnable-random/0x01.png)

通过debug拿到random值

```
$ x /20i $pc
$ i r
```

![](/assets/img/writeup/pwn/2017-08-26-pwnable-random/0x02.png)
![](/assets/img/writeup/pwn/2017-08-26-pwnable-random/0x03.png)

getflag~

![](/assets/img/writeup/pwn/2017-08-26-pwnable-random/0x04.png)