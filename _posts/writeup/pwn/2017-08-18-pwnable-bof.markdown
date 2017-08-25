---
layout:     post
title:      pwnable bof
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Nana told me that buffer overflow is one of the most common software vulnerability.   
>Is that true?  
>  
>Download:  
>http://pwnable.kr/bin/bof  
>http://pwnable.kr/bin/bof.c  
>  
>Address:  
>nc pwnable.kr 9000  
<!-- more -->


### 0x00 exploit

填充 0x2c+0x8 个bytes,  继续写入8个bytes即可将a1覆盖为0xcafebabe

![](/assets/img/writeup/pwn/2017-08-18-pwnable-bof/0x00.png)

getshell~

![](/assets/img/writeup/pwn/2017-08-18-pwnable-bof/0x01.png)