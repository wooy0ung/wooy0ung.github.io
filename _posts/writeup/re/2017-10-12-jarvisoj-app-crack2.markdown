---
layout:     post
title:      JarvisOJ 软件密码破解-2
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>对压缩包中的程序进行分析并获取flag。flag形式为16位大写md5。  
>  
>题目来源：CFF2016  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/CTF_100_1.rar.aa33faecac5307c4b1021a072e90e1d3  
<!-- more -->


### 0x00 分析

拖到IDA, 发现main函数没有正常反编译

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x00.png)

定位到sub_401180函数, WriteProcessMemory这里覆写了代码段, 需要动态patch

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x01.png)


### 0x01 动态调试

载入OD, 定位到0x004013c0, 注意关闭aslr

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x02.png)

程序从代码段0x401145开始覆写13 byte指令

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x03.png)

转到0x401145地址, patch掉13 byte数据

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x04.png)


### 0x02 静态分析

IDA重新载入, main函数已经正常了

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x05.png)

定位到这里, 其中off_40fec0="Welcome to CFF test!"

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x06.png)

```
len = strlen(src);
i = 0;
pad = "elcome to CFF test!";
do
{
  src[i] ^= pad[i];
  ++v8;
}
while ( i != len );
j = 0;
do
  ++src[j++];
while ( j != len );
OutputDebugStringA(MultiByteStr);	# 传给父进程
```

再定位到sub_401180函数

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x07.png)

```
buf=src;
if(buf != 0x2B5C5C25 || buf+4 != 0x36195D2F || buf+8 != 0x7672642C || buf+12 != 0x524E6680)
	false;
else
	sucess;
```

生成一下flag

```
src = [0x25,0x5c,0x5c,0x2b,0x2f,0x5d,0x19,0x36,0x2c,0x64,0x72,0x76,0x80,0x66,0x4e,0x52]
pad = "elcome to CFF test!"

flag = ""
for i in range(16):
	flag += chr((src[i]-1)^ord(pad[i]))

print flag
```

get flag~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-app-crack2/0x08.png)

