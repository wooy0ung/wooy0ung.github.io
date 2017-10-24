---
layout:     post
title:      江苏省天翼杯 2017 简单压缩
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>简单的压缩算法。
>  
>Download:  
>svn checkout https://github.com/wooy0ung/ctfs/trunk/write-ups-2017/%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%A4%A9%E7%BF%BC%E6%9D%AF-2017/%E9%80%86%E5%90%91%E7%A0%B4%E8%A7%A3/%E7%AE%80%E5%8D%95%E5%8E%8B%E7%BC%A9_75pt  
>  
>Addition:  
>一道简单的mac逆向, 不知道为什么当时没几队能做出来......(ｏ´_｀ｏ)ﾊｧ･･･。不过整个比赛下来才搞出来这个题, 还是太弱了2333333。
<!-- more -->


解压后发现是一个.app包, 直接运行报错

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-easy-compress/0x00.png)

打开包, 将MacOS内的二进制文件拖到IDA, 发现程序入口不正常

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-easy-compress/0x01.png)

用hex编辑器打开二进制文件, 发现加了UPX壳

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-easy-compress/0x02.png)

unpacked后, IDA再分析, 定位到[ViewController readFileAttributes:]

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-easy-compress/0x03.png)

可疑字符串"ZmxhZzphc2RmMzQ4OTAyc3M=%@"base64 decode, getflag~

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-easy-compress/0x04.png)