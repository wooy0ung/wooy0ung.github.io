---
layout:     post
title:      pwnable flag
author:     wooy0ung
tags: 		pwn
category:  	writeup
---


>Problem Address:  
>http://pwnable.kr/  
>  
>Problem Description:  
>Papa brought me a packed present! let's open it.  
>  
>Download:  
>http://pwnable.kr/bin/flag  
>  
>Supplementary:  
>This is reversing task. all you need is binary  
<!-- more -->


### 0x00 exploit

先侦壳, 发现被加了UPX壳

```
$ xxd flag | tail
```

![](/assets/img/writeup/pwn/2017-08-18-pwnable-flag/0x00.png)

也可以用工具查

![](/assets/img/writeup/pwn/2017-08-18-pwnable-flag/0x01.png)

脱壳

```
$ upx -d flag
```

拖到IDA, 定位到可疑字符串"UPX...? sounds like a delivery service", 提交后错误, 应该某些字符没正常显示

![](/assets/img/writeup/pwn/2017-08-18-pwnable-flag/0x02.png)

放到winhex, 检索UPX得到完整的flag, UPX...? sounds like a delivery service :)

![](/assets/img/writeup/pwn/2017-08-18-pwnable-flag/0x03.png)