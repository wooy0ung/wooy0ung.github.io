---
layout:     post
title:      JarvisOJ 软件密码破解-1
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>请对压缩包中的程序进行分析并获取flag。flag形式为xxx-xxxxx_xxxx。  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/CTF_100_0.rar.b5abee530fee7cdae2f5cdc33bb849e8  
<!-- more -->


### 0x00 分析

先跑一遍, 是一个MFC程序, 输入错误没有弹框

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x00.png)

OD载入, 在GetDlgItem下断

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x01.png)
![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x02.png)

F9运行起来, 密码框里输入"11111111", 按"确定"后断下, F9再跑起来

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x03.png)

可以看到输入的字符串

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x04.png)

看到栈区, 跟随返回地址, 检索字符串

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x05.png)

找到"你赢了"跟进去, 往上找到关键跳, 作了4个比较, 不满足则跳往失败

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x06.png)

比较前, 还做了一个异或

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x07.png)


### 0x01 crack

因为静态没看到异或数据, 我们动态追踪

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x08.png)

在此处下断, F9运行, 输入14个"1"

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x09.png)

可以看到, dl=0x28, 输入字符串存放在eax=0x016d5058, 循环esi=14次

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x0a.png)

继续跟踪得到14 byte dl数据

```
pad=[0x28,0x57,0x64,0x6b,0x93,0x8f,0x65,0x51,0xe3,0x53,0xe4,0x4e,0x1a,0xff]
```

生成一下flag

```
src=[0x1b,0x1c,0x17,0x46,0xf4,0xfd,0x20,0x30,0xb7,0x0c,0x8e,0x7e,0x78,0xde]
pad=[0x28,0x57,0x64,0x6b,0x93,0x8f,0x65,0x51,0xe3,0x53,0xe4,0x4e,0x1a,0xff]

flag=""
for i in range(14):
    flag+=chr(src[i]^pad[i])

print flag
```

get flag~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack1/0x0b.png)