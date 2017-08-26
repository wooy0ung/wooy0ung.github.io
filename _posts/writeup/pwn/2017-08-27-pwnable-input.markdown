---
layout:     post
title:      pwnable input
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Mom? how can I pass my input to a computer program? 
>  
>Address:  
>ssh input2@pwnable.kr -p2222 (pw:guest)
<!-- more -->


### 0x00 exploit

不解释, 按照要求输入即可~

```
import subprocess
import os
import sys, socket, struct
import time

# stage 1: arg
args = 'A' * 99
args = list(args)
args[ord('A')-1] = ""
args[ord('B')-1] = "\x20\x0a\x0d"
args[ord('C')-1] = "2224"

# stage 2: stdin
stdinr, stdinw = os.pipe()
stderrr, stderrw = os.pipe()
os.write(stdinw, "\x00\x0a\x00\xff")
os.write(stderrw, "\x00\x0a\x02\xff")

# stage 3: env
my_env = os.environ.copy()
path = "/tmp/exploit:" + my_env["PATH"]
environ = {"\xde\xad\xbe\xef" : "\xca\xfe\xba\xbe", "PATH": path}

# stage 4: fileio
f = open("\x0a", "wb")
f.write("\x00\x00\x00\x00")
f.close()

# stage 5: network
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

proc = subprocess.Popen(["/home/input2/input"] + args, env = dict(os.environ,**environ), stdin=stdinr, stderr=stderrr)
time.sleep(1)
s.connect(("127.0.0.1", 2224))
s.send("\xde\xad\xbe\xef")
s.close()
```

scp上传到远程主机, tmp没有权限, 需要新建一个exploit文件夹

```
$ scp -P 2222 exploit.py input2@pwnable.kr:/tmp/exploit
```

将input2目录下的flag链接到exploit目录

```
$ ln -s /home/input2/flag flag
```

getflag~

![](/assets/img/writeup/pwn/2017-08-27-pwnable-input/0x00.png)