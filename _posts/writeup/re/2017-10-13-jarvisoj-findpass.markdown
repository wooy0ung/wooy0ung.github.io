---
layout:     post
title:      JarvisOJ FindPass
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/FindPass_200.apk.722003c4d7d4c8b37f0eaa5f7109e87a  
<!-- more -->


反编译apk, 定位到MainActivity

![](/assets/img/writeup/re/2017-10-13-jarvisoj-findpass/0x00.png)

主要流程

```
1. 取得输入字符串, 存到v5
2. 以字节流方式读取assets文件夹下src.jpg, 存到v1
3. 用v1生成key
4. 对比输入字符串与key是否相等
```

这类题flag已经生成好了, 比较简单, 直接debug

![](/assets/img/writeup/re/2017-10-13-jarvisoj-findpass/0x01.png)

get flag~

![](/assets/img/writeup/re/2017-10-13-jarvisoj-findpass/0x02.png)