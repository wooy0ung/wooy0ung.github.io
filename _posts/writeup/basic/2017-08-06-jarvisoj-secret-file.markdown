---
layout:     post
title:      jarvisoj 神秘的文件
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>出题人太懒，还是就丢了个文件就走了，你能发现里面的秘密吗？  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/haha.f38a74f55b4e193561d1b707211cf7eb  
<!-- more -->


### 0x00 check

拿到文件, 先 binwalk 跑一遍, 发现是 ext2 格式文件

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-secret-file/0x00.png)

用 ext2 浏览工具打开该文件, 推荐 explore2fs, 将所有文件复制出来

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-secret-file/0x01.png)

浏览这些文件, 发现每个文件都有一个字符, 直接写个脚本提取


### 0x01 script

```
path = 'data/'
out=''
for i in range(254):
    out+=open(path+str(i),'r').read()
print out
```

getflag~

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-secret-file/0x02.png)