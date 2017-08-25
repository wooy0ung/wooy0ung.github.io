---
layout:     post
title:      jarvisoj Help!!
author:     wooy0ung
tags: 		basic
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
出题人硬盘上找到一个神秘的压缩包，里面有个word文档，可是好像加密了呢~让我们一起分析一下吧！

Download:
https://dn.jarvisoj.com/challengefiles/word.zip.a5465b18cb5d7d617c861dee463fe58b
```
<!-- more -->


### 0x01 check

文件下载下来, 是一个压缩包, 解压需要密码

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x00.png)

binwalk 扫一遍, 压缩文件包含了一个 doc 文档

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x01.png)

尝试用 ziperello 爆破, 提示并未加密, 猜测是被伪加密了

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x02.png)


### 0x02 zip

先了解一下 zip file format

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x03.png)

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x04.png)

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

### 0x03 repair

检索 hex 值 50 4B 03 04, 修正偏移 0x6 处值为 00 00

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x05.png)

检索 hex 值 50 4B 01 02, 修正偏移 0x8 处值为 00 00

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x06.png)

解压得到 word.docx, 打开没有发现 flag

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x07.png)

binwalk, 发现这个 doc 文件有2张 png 图片, 解压 word.docx

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x08.png)

getflag～

![](/assets/img/ctf/basic/2017-08-06-jarvisoj-help/0x09.png)


### 0x04 reference

[http://blog.xmsec.cc/blog/2016/06/27/ZIP伪加密](http://blog.xmsec.cc/blog/2016/06/27/ZIP%E4%BC%AA%E5%8A%A0%E5%AF%86)

[https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html](https://users.cs.jmu.edu/buchhofp/forensics/formats/pkzip.html)