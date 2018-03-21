---
layout:     post
title:      jarvisoj re部分writeup
author:     wooy0ung
tags: 		re
category:  	writeup
---


>[索引目录]  
>0x001 DD - Android Easy  
>0x002 [61dctf]]Android Easy  
>0x003 [61dctf]stheasy  
>0x004 爬楼梯  
>0x005 DD - Hello  
>0x006 DD - Android Normal  
<!-- more -->
>0x007 软件密码破解-1  
>0x008 软件密码破解-2  
>0x009 Classical CrackMe2  
>0x010 Smali  
>0x011 软件密码破解-3  
>0x012 FindPass  


## DD - Android Easy

>Problem Description:  
>Flag 为下一关邮箱。  

先运行一遍, 是一个常规的登录验证程序
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x001-001.png)

定位到onClickTest方法, 取得输入字串与从i方法中取得的字串相比较, 判断相同则打印出一串字符, 估计就是flag
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x001-002.png)

然后是i方法的执行过程
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x001-003.png)

最后python脚本, 仿照i方法生成flag
```
#!/usr/bin/python
# -*- coding:utf8 -*-

v1 = 0
p = [-40, -62, 107, 66, -126, 103, -56, 77, 122, -107, -24, -127, 72, -63, -98, 64, -24, -5, -49, -26, 79, -70, -26, -81, 120, 25, 111, -100, -23, -9, 122, -35, 66, -50, -116, 3, -72, 102, -45, -85, 0, 126, -34, 62, 83, -34, 48, -111, 61, -9, -51, 114, 20, 81, -126, -18, 27, -115, -76, -116, -48, -118, -10, -102, -106, 113, -104, 98, -109, 74, 48, 47, -100, -88, 121, 22, -63, -32, -20, -41, -27, -20, -118, 100, -76, 70, -49, -39, -27, -106, -13, -108, 115, -87, -1, -22, -53, 21, -100, 124, -95, -40, 62, -69, 29, 56, -53, 85, -48, 25, 37, -78, 11, -110, -24, -120, -82, 6, -94, -101]
q = [-57, -90, 53, -71, -117, 98, 62, 98, 101, -96, 36, 110, 77, -83, -121, 2, -48, 94, -106, -56, -49, -80, -1, 83, 75, 66, -44, 74, 2, -36, -42, -103, 6, -115, -40, 69, -107, 85, -78, -49, 54, 78, -26, 15, 98, -70, 8, -90, 94, -61, -84, 64, 112, 51, -29, -34, 126, -21, -126, -71, -31, -24, -60, -2, -81, 66, -84, 85, -91, 10, 84, 70, -8, -63, 26, 126, -76, -104, -123, -71, -126, -62, -23, 11, -39, 70, 14, 59, -101, -39, -124, 91, -109, 102, -49, 21, 105, 0, 37, -128, -57, 117, 110, -115, -86, 56, 25, -46, -55, 7, -125, 109, 76, 104, -15, 82, -53, 18, -28, -24]

v2 = []
for v0 in range(len(p)):
	v2.append(p[v0] ^ q[v0])

v0 = 0
v3 = v2[0]
while True:
	if v2[v3+v0] == 0:
		break
	v0 = v0 + 1

v4 = []
while v1 < v0:
	v4.append(v2[v3+v1])
	v1 = v1 + 1

print v4

flag = ""
for i in v4:
	flag += chr(i)

print flag
```

getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x001-004.png)


## 0x002 [61dctf]]Android Easy

与 DD - Android Easy 类似, 输入字串经过一个异或与某子串相同则通过 check, 输入字串为flag
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x002-001.png)

然后是脚本
```
#!/usr/bin/python
# -*- coding:utf8 -*-

s = [113, 123, 118, 112, 108, 94, 99, 72, 38, 68, 72, 87, 89, 72, 36, 118, 100, 78, 72, 87, 121, 83, 101, 39, 62, 94, 62, 38, 107, 115, 106]

v0 = []
for i in range(len(s)):
	v0.append(s[i] ^ 23)

print v0

flag = ""
for i in v0:
	flag += chr(i)

print flag
```

getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x002-002.png)


## 0x003 [61dctf]stheasy

![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x003-001.png)

按照执行流程生成flag
```
#!/usr/bin/python
# -*- coding:utf8 -*-

byte_8049AE0 = [0x6c, 0x6b, 0x32, 0x6a, 0x39, 0x47, 0x68, 0x7d, 0x41, 0x67, 0x66, 0x59, 0x34, 0x64, 0x73, 0x2d ,0x61, 0x36, 0x51, 0x57, 
				0x31, 0x23, 0x6b, 0x35, 0x45, 0x52, 0x5f, 0x54, 0x5b, 0x63, 0x76, 0x4c, 0x62, 0x56, 0x37, 0x6e ,0x4f, 0x6d, 0x33, 0x5a, 
				0x65, 0x58, 0x7b, 0x43, 0x4d, 0x74, 0x38, 0x53, 0x5a, 0x6f, 0x5d, 0x55, 0x0]

byte_8049B15 = [0x48, 0x5d, 0x8d, 0x24, 0x84, 0x27, 0x99, 0x9f, 0x54, 0x18, 0x1e, 0x69, 0x7e, 0x33, 0x15, 0x72, 0x8d, 0x33, 0x24, 0x63,
				0x21, 0x54, 0xc, 0x78, 0x78, 0x78, 0x78, 0x78, 0x1b, 0x0, 0x0]

s = []
v3 = 0
while v3<29:
	s.append(byte_8049AE0[byte_8049B15[v3]/0x03 - 2])
	v3 = v3 + 1

print s

flag = ""
for i in s:
	flag += chr(i)

print flag
```

getflag~

![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x003-002.png)


## 0x004 爬楼梯

>Problem Description:  
>对压缩包中的程序进行分析并获取flag。flag形式为16位大写md5。  
>  
>题目来源：CFF2016  

先运行一遍, 是一个小游戏, 不断点击爬一层楼直至到达目标层数就能看flag
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-001.png)

放到JEB分析, 定位到Btn_up_onclick方法, 这里当to_reach <= has_gone就会将button设置成可按下
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-002.png)

又发现onCreate方法调用setClickable(false)初始设置按键不可按下
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-003.png)

再看看smali, 程序在调用setClickable方法时通过v5传递0值
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-004.png)

现在打开Apktool Box反编译程序, 在MainActivity.smali里检索 onCreate, 然后将const/4 v5, 0x0修改为const/4 v5, 0x1
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-005.png)

重打包并签名, getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x004-006.png)


## 0x005 DD - Hello

>Problem Description:  
>Flag 是下一关的邮箱地址（以 DD 开头）。  

这是个Mach-O的可执行文件, 放到IDAfenxi, 主流程没发现什么有用信息, 怀疑有后门
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x005-001.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x005-002.png)

再看看 sub_100000DE0、sub_100000CE0, 果然存在后门
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x005-003.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x005-004.png)

主要流程:
```
1. sub_100000CE0执行完返回一个标志, 存到result
2. 判断result是否为0, 若是执行后门操作, 打印flag
```

直接写个python脚本生成一下flag即可
```
#!/usr/bin/python
# -*- coding:utf8 -*-

byte_100001040 = [0x41, 0x10, 0x11, 0x11, 0x1B, 0x0A, 0x64, 0x67, 0x6A, 0x68, 0x62, 0x68, 0x6E, 0x67,
				0x68, 0x6B, 0x62, 0x3D, 0x65, 0x6A, 0x6A, 0x3D, 0x68, 0x4, 0x5, 0x8, 0x3, 0x2, 0x2, 
				0x55, 0x8, 0x5D, 0x61, 0x55, 0x0A, 0x5F, 0x0D, 0x5D, 0x61, 0x32, 0x17, 0x1D, 0x19, 
				0x1F, 0x18, 0x20, 0x4, 0x2, 0x12, 0x16, 0x1E, 0x54, 0x20, 0x13, 0x14, 0x0, 0x0]

v2 = (0x100000CB0 - 0x100000C90) >> 2 ^ byte_100001040[0]
v1 = 0

while v1<55:
	byte_100001040[v1] = byte_100001040[v1] - 2
	byte_100001040[v1] = byte_100001040[v1] ^ v2
	v1 = v1 + 1
	v2 = v2 + 1

flag = ""
for i in byte_100001040:
	flag += chr(i)

print "Final output is %s" % flag[1:]
```

getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x005-005.png)


## 0x006 DD - Android Normal

>Problem Description:  
>提交下一关的邮箱地址。  
>  
>解压密码 infected。  

常规的密码验证程序, 但涉及 java、C/C++ 混合编程, 稍麻烦些
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-001.png)

按下按键, 取得输入字串并与从 stringFromJNI 方法生成的字串比较, stringFromJNI 在 hello-libs 中定义
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-002.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-003.png)

由于 stringFromJNI 返回的字串先存到 v1, 再比较, 可以直接将flag打印出来
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-004.png)

直接修改 MainActivity.smali
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-005.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-006.png)

回编译、签名, 运行, getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-007.png)

也可通过调试
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x006-008.png)


## 0x007 软件密码破解-1

>Problem Description:  
>请对压缩包中的程序进行分析并获取flag。flag形式为xxx-xxxxx_xxxx。 

先跑一遍, 是一个MFC程序, 输入错误没有弹框
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-001.png)

OD载入, 在GetDlgItem下断
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-002.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-003.png)

F9运行起来, 密码框里输入"11111111", 按"确定"后断下, F9再跑起来
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-004.png)

可以看到输入的字符串
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-005.png)

看到栈区, 跟随返回地址, 检索字符串
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-006.png)

找到"你赢了"跟进去, 往上找到关键跳, 作了4个比较, 不满足则跳往失败
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-007.png)

比较前, 还做了一个异或
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-008.png)

因为静态没看到异或数据, 我们动态追踪
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-009.png)

在此处下断, F9运行, 输入14个"1"
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-010.png)

可以看到, dl=0x28, 输入字符串存放在eax=0x016d5058, 循环esi=14次
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-011.png)

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
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x007-012.png)


## 0x008 软件密码破解-2

>Problem Description:  
>对压缩包中的程序进行分析并获取flag。flag形式为16位大写md5。  
>  
>题目来源：CFF2016  

拖到IDA, 发现main函数没有正常反编译
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-001.png)

定位到sub_401180函数, WriteProcessMemory这里覆写了代码段, 需要动态patch
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-002.png)

载入OD, 定位到0x004013c0, 注意关闭aslr
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-003.png)

程序从代码段0x401145开始覆写13 byte指令
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-004.png)

转到0x401145地址, patch掉13 byte数据
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-005.png)

IDA重新载入, main函数已经正常了
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-006.png)

定位到这里, 其中off_40fec0="Welcome to CFF test!"
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-007.png)
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
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-008.png)
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
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x008-009.png)


## 0x009 Classical CrackMe2

>Problem Description:  
>做完了Classical CrackMe1是不是不太过瘾？那再来一题吧。  

导入到dnSpy, 发现是AES加密但被混淆过, 在此处下断
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-001.png)

断下后看数据区
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-002.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-003.png)

可以看到bytes存放着解密的key="pctf2016pctf2016pctf2016pctf2016"
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-004.png)

单步到此处, 进行密码校验
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-005.png)

查看数据区, 没发现加密的flag
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-006.png)

猜测key与enc_flag放在相邻内存, 检索"pctf2016pctf2016pctf2016pctf2016", 找到enc_flag
```
enc_flag="x/nzolo0TTIyrEISd4AP1spCzlhSWJXeNbY81SjPgmk=+"
```

写个脚本作AES解密, 注意加密模式
```
from Crypto.Cipher import AES

key='pctf2016pctf2016pctf2016pctf2016'
enc="x/nzolo0TTIyrEISd4AP1spCzlhSWJXeNbY81SjPgmk=+".decode('base64')

cryptor=AES.new(key,AES.MODE_ECB)
plain=cryptor.decrypt(enc)
print plain
```

get flag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x009-007.png)


## 0x010 Smali

>Problem Description:  
>都说学好Smali是学习Android逆向的基础，现在刚好有一个smali文件，大家一起分析一下吧~~   

拿到*.smali文件, 用Smali2Java工具转成*.java
```
package net.bluelotus.tomorrow.easyandroid;

import android.util.Base64;
import java.io.PrintStream;
import java.security.NoSuchAlgorithmException;
import javax.crypto.NoSuchPaddingException;
import java.security.InvalidKeyException;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.BadPaddingException;
import javax.crypto.spec.SecretKeySpec;
import javax.crypto.Cipher;
import java.security.Key;
import java.security.GeneralSecurityException;

public class Crackme {
    private String str2 = "cGhyYWNrICBjdGYgMjAxNg==";
    
    public Crackme() {
        GetFlag("sSNnx1UKbYrA1+MOrdtDTA==");
    }
    
    private String GetFlag(String p1) {
        byte[] "content" = Base64.decode(p1.getBytes(), 0x0);
        String "kk" = new String(Base64.decode(str2.getBytes(), 0x0));
        System.out.println(decrypt("content", "kk"));
        return null;
    }
    
    private String decrypt(byte[] p1, String p2) {
        String "m" = 0x0;
        try {
            byte[] "keyStr" = p2.getBytes();
            SecretKeySpec "key" = new SecretKeySpec("keyStr", "AES");
            Cipher "cipher" = Cipher.getInstance("AES/ECB/NoPadding");
            "cipher".init(0x2, "key");
            byte[] "result" = "cipher".doFinal(p1);
            return "m";
        } catch(NoSuchPaddingException "e") {
            "e".printStackTrace();
        }
        return  "m";
    }
}
```

可以看到是AES加密
```
key=Base64.decode("cGhyYWNrICBjdGYgMjAxNg==")
enc=Base64.decode("sSNnx1UKbYrA1+MOrdtDTA==")
```

直接解密
```
from Crypto.Cipher import AES
 
key='cGhyYWNrICBjdGYgMjAxNg=='.decode('base64')
enc='sSNnx1UKbYrA1+MOrdtDTA=='.decode('base64')

cryptor=AES.new(key,AES.MODE_ECB)
plain=cryptor.decrypt(enc)
print plain
```

get flag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x010-001.png)


## 0x011 软件密码破解-3

拖到IDA, 定位到WinMain函数, 没有什么有用信息
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-001.png)

用OD打开动态调试, 检索字符串, 定位到这里
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-002.png)

往下翻到0x00401970, 这里频繁从内存中取值, 先下个断
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-003.png)

再次启动程序, 输入16个"1", 点击确定成功断下
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-004.png)

内存区跟随0x571458, 这里存放输入字串
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-005.png)

跟随0x56B0D0, 这里存放一个hex表
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-006.png)

程序根据输入字串, 循环差表64次
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-007.png)

回到IDA, 定位到0x00401970
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-008.png)

根据调试结果, dword_571458是输入字串, byte_56b0d0存放着表项
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-009.png)

查看引用, 定位到sub_401B80函数, 这里对查表后数据进行校验
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-010.png)
```
key[0] + key[1] + key[2] + key[3] == 71
key[5] + key[6] + key[7] == 3
key[0] - key[1] == 68
key[1] - key[2] == 2
key[2] - key[3] == 59
-key[4] + key[6] == 10
key[6] - key[7] == 9
key[4] - key[5]== 52
```

先爆破这8 byte
```
print "[x0-x3]: "
for x0 in range(256):
	for x1 in range(256):
		if (x0 - x1)%256 == 68:
			for x2 in range(256):
				if (x1 - x2)%256 == 2:
					for x3 in range(256):
						if x2 - x3 == -59 and (x0 + x1 + x2 + x3)%256 == 71:
							print hex(x0),
							print hex(x1),
							print hex(x2),
							print hex(x3)
print "[x4-x7]: "
for x4 in range(256):
	for x5 in range(256):
		if (x4 - x5)%256 == 52:
			for x6 in range(256):
				if (-x4 + x6)%256 == 10:
					for x7 in range(256):
						if (x6 - x7)%256 == 9 and (x5 + x6 + x7)%256 == 3:
							print hex(x4),
							print hex(x5),
							print hex(x6),
							print hex(x7)
```
得到key = [0x77,0x33,0x31,0x6c,0x64,0x30,0x6e,0x65]

把表copy出来, 发现是S盒子, 找到对应的逆S盒子表
```
pad = 
[0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5,0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB,
0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF,0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB,
0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23,0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E,
0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24,0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25,
0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98,0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92,
0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9,0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84,
0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3,0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06,
0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F,0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B,
0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC,0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73,
0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35,0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E,
0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5,0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B,
0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79,0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4,
0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7,0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F,
0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A,0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF,
0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5,0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61,
0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6,0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D]
```

仿照IDA伪代码生成一下flag
```
// crk.cpp
#include <cstdio>
#define __int8 char

unsigned char key[8] = {0x77,0x33,0x31,0x6c,0x64,0x30,0x6e,0x65};
unsigned char pad[256] =
{0x52, 0x09, 0x6A, 0xD5, 0x30, 0x36, 0xA5,0x38, 0xBF, 0x40, 0xA3, 0x9E, 0x81, 0xF3, 0xD7, 0xFB,
0x7C, 0xE3, 0x39, 0x82, 0x9B, 0x2F, 0xFF,0x87, 0x34, 0x8E, 0x43, 0x44, 0xC4, 0xDE, 0xE9, 0xCB,
0x54, 0x7B, 0x94, 0x32, 0xA6, 0xC2, 0x23,0x3D, 0xEE, 0x4C, 0x95, 0x0B, 0x42, 0xFA, 0xC3, 0x4E,
0x08, 0x2E, 0xA1, 0x66, 0x28, 0xD9, 0x24,0xB2, 0x76, 0x5B, 0xA2, 0x49, 0x6D, 0x8B, 0xD1, 0x25,
0x72, 0xF8, 0xF6, 0x64, 0x86, 0x68, 0x98,0x16, 0xD4, 0xA4, 0x5C, 0xCC, 0x5D, 0x65, 0xB6, 0x92,
0x6C, 0x70, 0x48, 0x50, 0xFD, 0xED, 0xB9,0xDA, 0x5E, 0x15, 0x46, 0x57, 0xA7, 0x8D, 0x9D, 0x84,
0x90, 0xD8, 0xAB, 0x00, 0x8C, 0xBC, 0xD3,0x0A, 0xF7, 0xE4, 0x58, 0x05, 0xB8, 0xB3, 0x45, 0x06,
0xD0, 0x2C, 0x1E, 0x8F, 0xCA, 0x3F, 0x0F,0x02, 0xC1, 0xAF, 0xBD, 0x03, 0x01, 0x13, 0x8A, 0x6B,
0x3A, 0x91, 0x11, 0x41, 0x4F, 0x67, 0xDC,0xEA, 0x97, 0xF2, 0xCF, 0xCE, 0xF0, 0xB4, 0xE6, 0x73,
0x96, 0xAC, 0x74, 0x22, 0xE7, 0xAD, 0x35,0x85, 0xE2, 0xF9, 0x37, 0xE8, 0x1C, 0x75, 0xDF, 0x6E,
0x47, 0xF1, 0x1A, 0x71, 0x1D, 0x29, 0xC5,0x89, 0x6F, 0xB7, 0x62, 0x0E, 0xAA, 0x18, 0xBE, 0x1B,
0xFC, 0x56, 0x3E, 0x4B, 0xC6, 0xD2, 0x79,0x20, 0x9A, 0xDB, 0xC0, 0xFE, 0x78, 0xCD, 0x5A, 0xF4,
0x1F, 0xDD, 0xA8, 0x33, 0x88, 0x07, 0xC7,0x31, 0xB1, 0x12, 0x10, 0x59, 0x27, 0x80, 0xEC, 0x5F,
0x60, 0x51, 0x7F, 0xA9, 0x19, 0xB5, 0x4A,0x0D, 0x2D, 0xE5, 0x7A, 0x9F, 0x93, 0xC9, 0x9C, 0xEF,
0xA0, 0xE0, 0x3B, 0x4D, 0xAE, 0x2A, 0xF5,0xB0, 0xC8, 0xEB, 0xBB, 0x3C, 0x83, 0x53, 0x99, 0x61,
0x17, 0x2B, 0x04, 0x7E, 0xBA, 0x77, 0xD6,0x26, 0xE1, 0x69, 0x14, 0x63, 0x55, 0x21, 0x0C, 0x7D};

void findKey()
{
    signed int v0; // esi
    unsigned __int8 v1; // bl
    char v2; // cl
    char v3; // al
    char v4; // cl
    char v5; // al
    unsigned __int8 v6; // dl
    unsigned __int8 v7; // bl
    char v8; // cl
    char v9; // al
    unsigned __int8 v10; // dl
    unsigned __int8 v11; // bl
    char v12; // cl
    char v13; // al
    unsigned __int8 v14; // dl
    unsigned __int8 v15; // bl
    int v16; // edi
    unsigned __int8 v17; // cl
    unsigned __int8 v18; // dl
    char v19; // dl
    int result; // eax
    char v21; // cl

    v0 = 64;
    do
    {
        v1 = pad[key[3]];
        v2 = pad[pad[pad[key[1]]]];
        v3 = pad[pad[pad[pad[key[0]]]]];
        key[2] = pad[pad[key[2]]];
        key[1] = v2;
        v4 = pad[key[2]];
        key[0] = v3;
        v5 = pad[key[1]];
        key[3] = v1;
        v6 = pad[v1];
        v7 = pad[key[4]];
        key[3] = v6;
        key[2] = v4;
        v8 = pad[v6];
        key[1] = v5;
        v9 = pad[key[2]];
        key[4] = v7;
        v10 = pad[v7];
        v11 = pad[key[5]];
        key[4] = v10;
        key[3] = v8;
        v12 = pad[v10];
        key[2] = v9;
        v13 = pad[key[3]];
        key[5] = v11;
        v14 = pad[v11];
        v15 = pad[key[6]];
        v16 = pad[pad[key[7]]];
        key[5] = v14;
        key[4] = v12;
        v17 = pad[v14];
        key[3] = v13;
        v18 = pad[pad[v15]];
        key[4] = pad[key[4]];
        v19 = pad[v18];
        key[5] = pad[v17];
        result = pad[v16];
        v21 = pad[result];
        key[6] = v19;
        key[7] = v21;
        --v0;
     }while ( v0 );
  return;
}

int main()
{
	findKey();
	for(int i=0;i<8;i++)
		printf("%02X",key[i]);
	printf("\n");

	return 0;
}
```

注意
```
HIBYTE(dword_571458)	-->		dword_571458[3]
BYTE2(dword_571458)		-->		dword_571458[2]
BYTE1(dword_571458)		-->		dword_571458[1]
dword_571458			-->		dword_571458[0]
```

编译运行findKey, get flag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x011-011.png)


## 0x012 FindPass

反编译apk, 定位到MainActivity
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x012-001.png)

主要流程
```
1. 取得输入字符串, 存到v5
2. 以字节流方式读取assets文件夹下src.jpg, 存到v1
3. 用v1生成key
4. 对比输入字符串与key是否相等
```

这类题flag已经生成好了, 比较简单, 直接debug
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x012-002.png)

get flag~
![](/assets/img/writeup/2017-08-06-jarvisoj-re-writeup/0x012-003.png)