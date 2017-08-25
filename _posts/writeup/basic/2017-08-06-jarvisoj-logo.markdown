---
layout:     post
title:      jarvisoj 美丽的实验室logo
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>出题人丢下个logo就走了，大家自己看着办吧  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/logo.jpg.8244d3d060e9806accc508ec689fabfb  
<!-- more -->


### 0x00 check

文件下载下来发现是一张图片, 运行binwalk命令, 没发现有用信息

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x00.png)
![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x01.png)

用 hex 编辑器打开, 发现有 PCTF 的字串, 根据头部 JFIF 知道这是一个 JPEG 文件 

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x02.png)

先大致了解一下 JPEG 文件格式, 直接检索 FF D9(EOI) 看图片数据到哪结束

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x03.png)


### 0x01 repair

发现图像末尾处还有一个 JFIF 标志, 估计还有图片被隐藏了, dump 出来

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x04.png)

但提示文件损坏, 补上缺少的 FFE0 字段

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x05.png)
![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x06.png)

再次打开, getflag

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-logo/0x07.png)


### 0x02 reference

[http://www.androidstudy.cn/jpg文件结构讲解](http://www.androidstudy.cn/jpg%E6%96%87%E4%BB%B6%E7%BB%93%E6%9E%84%E8%AE%B2%E8%A7%A3/)

[http://en.wikipedia.org/wiki/JPEG_File_Interchange_Format](https://en.wikipedia.org/wiki/JPEG_File_Interchange_Format)