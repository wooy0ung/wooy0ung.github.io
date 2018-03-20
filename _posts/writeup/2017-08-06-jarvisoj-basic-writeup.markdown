---
layout:     post
title:      jarvisoj basic部分writeup
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>[索引目录]  
>0x001 Help!!  
>0x002 美丽的实验室logo  
>0x003 神秘的文件  
>0x004 shellcode  
>0x005 -.-字符串  
>0x006 A Piece Of Cake  
>0x007 base64?  
>0x008 veryeasyRSA  
>0x009 爱吃培根的出题人  
>0x010 公倍数  
<!-- more -->
 

## 0x001 Help!!

>Problem Description:  
>出题人硬盘上找到一个神秘的压缩包，里面有个word文档，可是好像加密了呢~让我们一起分析一下吧！  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/word.zip.a5465b18cb5d7d617c861dee463fe58b  

文件下载下来, 是一个压缩包, 解压需要密码
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-001.png)

binwalk 扫一遍, 压缩文件包含了一个doc文档
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-002.png)

尝试用ziperello爆破, 提示并未加密, 猜测是被伪加密了
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-003.png)

先了解一下zip file format
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-004.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-005.png)

```
压缩源文件数据区 
50 4B 03 04：这是头文件标记（0x04034b50）
14 00：解压文件所需 pkware 版本 
00 00：全局方式位标记（有无加密） 
08 00：压缩方式 
5A 7E：最后修改文件时间 
F7 46：最后修改文件日期 
16 B5 80 14：CRC-32校验（1480B516）
19 00 00 00：压缩后尺寸（25）
17 00 00 00：未压缩尺寸（23）
07 00：文件名长度 
00 00：扩展记录长度 
6B65792E7478740BCECC750E71ABCE48CDC9C95728CECC2DC849AD284DAD0500  
压缩源文件目录区 
50 4B 01 02：目录中文件文件头标记(0x02014b50)  
3F 00：压缩使用的 pkware 版本 
14 00：解压文件所需 pkware 版本 
00 00：全局方式位标记（有无加密，这个更改这里进行伪加密，改为09 00打开就会提示有密码了） 
08 00：压缩方式 
5A 7E：最后修改文件时间 
F7 46：最后修改文件日期 
16 B5 80 14：CRC-32校验（1480B516）
19 00 00 00：压缩后尺寸（25）
17 00 00 00：未压缩尺寸（23）
07 00：文件名长度 
24 00：扩展字段长度 
00 00：文件注释长度 
00 00：磁盘开始号 
00 00：内部文件属性 
20 00 00 00：外部文件属性 
00 00 00 00：局部头部偏移量 
6B65792E7478740A00200000000000010018006558F04A1CC5D001BDEBDD3B1CC5D001BDEBDD3B1CC5D001  
压缩源文件目录结束标志 
50 4B 05 06：目录结束标记 
00 00：当前磁盘编号 
00 00：目录区开始磁盘编号 
01 00：本磁盘上纪录总数 
01 00：目录区中纪录总数 
59 00 00 00：目录区尺寸大小 
3E 00 00 00：目录区对第一张磁盘的偏移量 
00 00：ZIP 文件注释长度
```

检索hex值50 4B 03 04, 修正偏移0x6处值为00 00
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-006.png)

检索hex值50 4B 01 02, 修正偏移0x8处值为00 00
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-007.png)

解压得到word.docx, 打开没有发现flag
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-008.png)

binwalk, 发现这个doc文件有2张png图片, 解压word.docx
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-009.png)

getflag～
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x001-010.png)

reference: 
[http://blog.xmsec.cc/blog/2016/06/27/ZIP伪加密](http://blog.xmsec.cc/blog/2016/06/27/ZIP%E4%BC%AA%E5%8A%A0%E5%AF%86)
[https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html)


## 0x002 美丽的实验室logo

>Problem Description:  
>出题人丢下个logo就走了，大家自己看着办吧  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/logo.jpg.8244d3d060e9806accc508ec689fabfb  

文件下载下来发现是一张图片, 运行binwalk命令, 没发现有用信息
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-001.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-002.png)

用hex编辑器打开, 发现有PCTF的字串, 根据头部JFIF知道这是一个JPEG文件 
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-003.png)

先大致了解一下JPEG文件格式, 直接检索FF D9(EOI)看图片数据到哪结束
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-004.png)

发现图像末尾处还有一个JFIF标志, 估计还有图片被隐藏了, dump出来
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-005.png)

但提示文件损坏, 补上缺少的FFE0字段
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-006.png)
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-007.png)

再次打开, getflag
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x002-008.png)

reference: 
[http://www.androidstudy.cn/jpg文件结构讲解](http://www.androidstudy.cn/jpg%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84%E8%AE%B2%E8%A7%A3/)
[http://en.wikipedia.org/wiki/JPEG_File_Interchange_Format](https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format)


## 0x003 神秘的文件

>Problem Description:  
>出题人太懒，还是就丢了个文件就走了，你能发现里面的秘密吗？  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/haha.f38a74f55b4e193561d1b707211cf7eb  

拿到文件, 先 binwalk 跑一遍, 发现是 ext2 格式文件
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x003-001.png)

用 ext2 浏览工具打开该文件, 推荐 explore2fs, 将所有文件复制出来
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x003-002.png)

浏览这些文件, 发现每个文件都有一个字符, 直接写个脚本提取
```
path = 'data/'
out=''
for i in range(254):
    out+=open(path+str(i),'r').read()
print out
```

getflag~
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x003-003.png)


## 0x004 shellcode

>Problem Description:  
>作为一个黑客，怎么能不会使用shellcode?  
>  
>这里给你一段shellcode，你能正确使用并最后得到flag吗？  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/shellcode.06f28b9c8f53b0e86572dbc9ed3346bc  

拿到题目, binwalk扫不出有用信息, file命令发现该文件都是一些ASCII字符
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x004-001.png)

用hex编辑器打开, 估计是实现某种功能的shellcode
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x004-002.png)

先写一个小程序对hex数据进行处理
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x004-003.png)
```
#include <stdio.h>

char source[]="50594949 49494949 4949...";
char shellcode[]=" ";

int main()
{
	printf("[source:]\n%s\n\n", source);

	int i = 0, j = 0;
	while(source[i] != '\0')
	{
		if(source[i] == ' ')
		{
			i++;
			continue;
		}
		shellcode[j++] = '\\';
		shellcode[j++] = 'x';
		shellcode[j++] = source[i++];
		shellcode[j++] = source[i++];
	}

	printf("[shellcode:]\n%s\n\n", shellcode);
	
	return 0;
}
```

对处理后的shellcode进行装载
```
#include <stdio.h>

int main()
{
	char shellcode[]="\x50\x59\x49\x49\x49...";

	printf("%s\n\n", shellcode);

	__asm
	{
		lea		eax, shellcode
		push	eax
		ret
	}

	return 0;
}
```

执行, 发现装载异常, 暂时不知道什么问题
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x004-004.png)

最后找了一个shellcode装载器, 执行getflag
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x004-005.png)

reference: 
[https://github.com/inquisb/shellcodeexec](https://github.com/inquisb/shellcodeexec)


## 0x005 -.-字符串

>Problem Description:  
>请选手观察以下密文并转换成flag形式  
>  
>..-. .-.. .- --. ..... ..--- ..--- ----- .---- ---.. -.. -.... -.... ..... ...-- ---.. --... -.. .---- -.. .- ----. ...-- .---- ---.. .---- ..--- -... --... --... --... -.... ...-- ....- .---- -----  
>  
>flag形式为32位大写md5  
>   
>题目来源：CFF2016  

观察密文, 显然是Morse Code, 脚本解密 
```
#!/usr/bin/python
# -*- coding:utf8 -*-

dic = {'.-':'A','-...':'B','-.-.':'C','-..':'D','.':'E','..-.':'F','--.':'G','....':'H','..':'I','.---':'J','-.-':'K','.-..':'L','--':'M','-.':'N','---':'O','.--.':'P','--.-':'Q','.-.':'R','...':'S','-':'T','..-':'U','...-':'V','.--':'W','-..-':'X','-.--':'Y','--..':'Z','.-.-.-':'.','--..--':',','---...':':','.-..-.':'"','.----.':'\'','-.-.--':'!','..--..':'?','.--.-.':'@','-....-':'-','-.-.-.':';','.-.-.':'+','..--.-':'_','...-..-':'$','-..-.':'/','.----':'1','..---':'2','...--':'3','....-':'4','.....':'5','-....':'6','--...':'7','---..':'8','----.':'9','-----':'0'}

enc='..-. .-.. .- --. ..... ..--- ..--- ----- .---- ---.. -.. -.... -.... ..... ...-- ---.. --... -.. .---- -.. .- ----. ...-- .---- ---.. .---- ..--- -... --... --... --... -.... ...-- ....- .---- -----'.split(' ')

dec=""
for c in enc:
	dec+=dic[c]
print dec
```


## 0x006 A Piece Of Cake

>Problem Description:  
>nit yqmg mqrqn bxw mtjtm nq rqni fiklvbxu mqrqnl xwg dvmnzxu lqjnyxmt xatwnl, rzn nit uxnntm xmt zlzxuuk mtjtmmtg nq xl rqnl. nitmt vl wq bqwltwlzl qw yivbi exbivwtl pzxuvjk xl mqrqnl rzn nitmt vl atwtmxu xamttetwn xeqwa tsftmnl, xwg nit fzruvb, nixn mqrqnl ntwg nq gq lqet qm xuu qj nit jquuqyvwa: xbbtfn tutbnmqwvb fmqamxeevwa, fmqbtll gxnx qm fiklvbxu ftmbtfnvqwl tutbnmqwvbxuuk, qftmxnt xznqwqeqzluk nq lqet gtamtt, eqdt xmqzwg, qftmxnt fiklvbxu fxmnl qj vnltuj qm fiklvbxu fmqbtlltl, ltwlt xwg exwvfzuxnt nitvm twdvmqwetwn, xwg tsivrvn vwntuuvatwn rtixdvqm - tlftbvxuuk rtixdvqm yivbi evevbl izexwl qm qnitm xwvexul. juxa vl lzrlnvnzntfxllvldtmktxlkkqzaqnvn. buqltuk mtuxntg nq nit bqwbtfn qj x mqrqn vl nit jvtug qj lkwnitnvb rvquqak, yivbi lnzgvtl twnvnvtl yiqlt wxnzmt vl eqmt bqefxmxrut nq rtvwal nixw nq exbivwtl.  
>  
>提交格式：PCTF{flag}  

直接用工具解

#### 传送门: [http://quipqiup.com](http://quipqiup.com)


## 0x007 base64?

>Problem Description:  
>GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLGGY4DGNBXGYZTGNLGGY3DGNBWMU3WI=== 

base32, 直接python脚本解密

```
#!/usr/bin/python
# -*- coding:utf8 -*-

from base64 import *

flag = b32decode('GUYDIMZVGQ2DMN3CGRQTONJXGM3TINLGG42DGMZXGM3TINLGGY4DGNBXGYZTGNLGGY3DGNBWMU3WI===')
print flag
print flag.decode('hex')
```


## 0x008 veryeasyRSA

>Problem Description:  
>已知RSA公钥生成参数：  
>  
>p = 3487583947589437589237958723892346254777  
>q = 8767867843568934765983476584376578389  
>e = 65537  
>  
>求d =  
>  
>请提交PCTF{d}  
>  
>Supplementary:  
>Hint1: 有好多小伙伴问d提交什么格式的，现在明确一下，提交十进制的d  

```
#!/usr/bin/python
# -*- coding:utf8 -*-

def computeD(fn, e):
    (x, y, r) = extendedGCD(fn, e)
    #y maybe < 0, so convert it
    if y < 0:
        return fn + y
    return y

def extendedGCD(a, b):
    #a*xi + b*yi = ri
    if b == 0:
        return (1, 0, a)
    #a*x1 + b*y1 = a
    x1 = 1
    y1 = 0
    #a*x2 + b*y2 = b
    x2 = 0
    y2 = 1
    while b != 0:
        q = a / b
        #ri = r(i-2) % r(i-1)
        r = a % b
        a = b
        b = r
        #xi = x(i-2) - q*x(i-1)
        x = x1 - q*x2
        x1 = x2
        x2 = x
        #yi = y(i-2) - q*y(i-1)
        y = y1 - q*y2
        y1 = y2
        y2 = y
    return(x1, y1, a)

p = 3487583947589437589237958723892346254777
q = 8767867843568934765983476584376578389
e = 65537

n = p * q
fn = (p - 1) * (q - 1)

d = computeD(fn, e)
print d
```


## 0x009 爱吃培根的出题人

>Problem Description:  
>听说你也喜欢吃培根？那我们一起来欣赏一段培根的介绍吧：  
>bacoN is one of aMerICa'S sWEethEartS. it's A dARlinG, SuCCulEnt fOoD tHAt PaIRs FlawLE  
>什么，不知道要干什么？上面这段巨丑无比的文字，为什么会有大小写呢？你能发现其中的玄机吗？  
>提交格式：PCTF{你发现的玄机}   

去掉除字母外的字符, 以5个为一组

```
bacoN isone ofaMe rICaS sWEet hEart SitsA dARli nGSuC CulEn tfOoD tHAtP aIRsF lawLE
aaaab aaaaa aaaba abbab abbaa abaaa baaab abbaa abbab baaba aabab abbab abbab aaabb
```

注意有两种形式的培根密码

```
第一种方式：
A aaaaa B aaaab C aaaba D aaabb E aabaa F aabab G aabba H aabbb I abaaa J abaab
K ababa L ababb M abbaa N abbab O abbba P abbbb Q baaaa R baaab S baaba T baabb
U babaa V babab W babba X babbb Y bbaaa Z bbaab

第二种方式
a AAAAA		g AABBA 	n ABBAA 	t BAABA
b AAAAB 	h AABBB 	o ABBAB 	u-v BAABB
c AAABA 	i-j ABAAA 	p ABBBA 	w BABAA
d AAABB 	k ABAAB 	q ABBBB 	x BABAB
e AABAA 	l ABABA 	r BAAAA 	y BABBA
f AABAB 	m ABABB 	s BAAAB 	z BABBB
```

本题依据第2个密码表, get flag~

```
PCTF{baconisnotfood}
```


## 0x010 公倍数

>Problem Description:  
>请计算1000000000以内3或5的倍数之和。  
>如：10以内这样的数有3,5,6,9，和是23  
>请提交PCTF{你的答案}  

数学问题, 生成一下flag

```
flag = 0
for i in xrange(3,1000000000,3):
    flag += i
for i in xrange(5,1000000000,5):
    flag += i
for i in xrange(15,1000000000,15):
    flag -= i
print flag
```


## 0x011 Easy Crackme

>Problem Description:  
>都说逆向挺难的，但是这题挺容易的，反正我不会，大家来挑战一下吧~~:)  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/easycrackme.6dbc7c78c9bb25f724cd55c0e1412617  

校验算法直接出来了
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x011-001.png)

生成一下flag
```
pad1 = [0xab,0xdd,0x33,0x54,0x35,0xef]
pad2 = [0xfb,0x9e,0x67,0x12,0x4e,0x9d,0x98,0xab,0x00,0x06,0x46,0x8a,0xf4,0xb4,0x06,0x0b,0x43,0xdc,0xd9,0xa4,0x6c,0x31,0x74,0x9c,0xd2,0xa0]

flag = ""
flag += chr(pad2[0]^0xab);
for i in range(1,26):
    flag += chr(pad1[i%6]^pad2[i])

print flag
```


## 0x012 Secret

>Problem Description:  
>传说中的签到题  
>  
>Address:  
>http://web.jarvisoj.com:32776/  
>  
>Hint1: 提交格式PCTF{你发现的秘密}  

查看http头
![](/assets/img/writeup/2017-08-06-jarvisoj-basic-writeup/0x012-001.png)