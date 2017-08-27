---
layout:     post
title:      pwnable cmd1
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mommy! what is PATH environment in Linux?  
>Address:  
>ssh cmd1@pwnable.kr -p2222 (pw:guest)  
<!-- more -->


### 0x00 exploit

查看源码, flag、sh、tmp 被过滤了

![](/assets/img/writeup/pwn/2017-08-27-pwnable-cmd1/0x00.png)

利用通配符绕过, getflag~

```
$ ./cmd1 "/bin/cat f*"
mommy now I get what PATH environment is for :)
```

![](/assets/img/writeup/pwn/2017-08-27-pwnable-cmd1/0x01.png)