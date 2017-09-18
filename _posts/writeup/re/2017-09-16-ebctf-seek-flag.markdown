---
layout:     post
title:      ebCTF Dice Game
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>找flag  
>运行一次, 是一个对话框小程序, GetFlag 按钮无法按下。  
![](/assets/img/writeup/re/2017-09-16-ebctf-seek-flag/0x00.png)
<!-- more -->


### 0x00 crack

定位到打印flag的方法处, 跟进去 sub_401000

![](/assets/img/writeup/re/2017-09-16-ebctf-seek-flag/0x01.png)

按照以下过程生成一下 flag 即可

![](/assets/img/writeup/re/2017-09-16-ebctf-seek-flag/0x02.png)

注意, 此处 var_29(v4) 相对于 Text 偏移 15 Bytes

![](/assets/img/writeup/re/2017-09-16-ebctf-seek-flag/0x03.png)

```
flag = list("flag:{NSCTF_md57e0cad17016b0>?45?f7c>0>4a>1c3a0}")

i=15
while flag[i] != '}':
	flag[i] = chr(ord(flag[i]) ^ 7)
	i+=1

print flag
flag = ''.join(flag)
print flag
```

getflag~

![](/assets/img/writeup/re/2017-09-16-ebctf-seek-flag/0x04.png)