---
layout:     post
title:      pwnable coin1
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mommy, I wanna play a game!  
>(if your network response time is too slow, try nc 0 9007 inside pwnable.kr server)  
>Address:  
>nc pwnable.kr 9007  
<!-- more -->


### 0x00 game

每次以 C 次尝试在 N 枚coin中找到次品, 胜利100次就能拿到flag

![](/assets/img/writeup/pwn/2017-08-27-pwnable-coin1/0x00.png)

多次尝试发现 N <= 2^C, 采用二分法

![](/assets/img/writeup/pwn/2017-08-27-pwnable-coin1/0x01.png)


### 0x01 exploit

```
from pwn import *
import re

def get_weight(start,end,r):
    send_str = ""
    if start == end:
        r.sendline(str(start))
    else:
        for i in range(start,end + 1 ):
            send_str = send_str + str(i)+" "
        r.sendline(send_str)
    result = r.recvline()
    return int(result)

def choose_coin(num,chance,r):
    start = 0
    end = num -1
    weight = 0
    for i in range(0,chance  ):
        weight = get_weight(start,int(start+(end-start)/2),r)
        if weight%10 != 0:
            end = int(start+(end-start)/2)
        else:
            start = int(start+(end-start)/2 )+1
    r.sendline(str(end))
    print '[+]server: ',r.recvline()

r = remote('127.0.0.1',9007)
print r.recv()

for i in range(0,100):
    print '[*]','='*18," ",i," ","="*18 ,"[*]"
    recvword = r.recvline()
    print "[+]server: ",recvword
    p = re.compile(r'\d+')
    data = p.findall(recvword)
    num = int(data[0])
    chance = int(data[1])
    choose_coin(num,chance,r)
print r.recv()
```

getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-coin1/0x02.png)