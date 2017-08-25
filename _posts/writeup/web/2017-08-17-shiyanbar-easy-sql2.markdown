---
layout:     post
title:      shiyanbar 简单的sql注入2
author:     wooy0ung
tags: 		web
category:  	writeup
---


>Problem Address:  
>http://www.shiyanbar.com/  
>  
>Problem Description:  
>有回显的mysql注入  
>格式：flag{}  
>  
>Address:  
>http://ctf5.shiyanbar.com/web/index_2.php  
<!-- more -->


### 0x00 check

存在注入点

![](/assets/img/writeup/web/2017-08-17-shiyanbar-easy-sql2/0x00.png)

![](/assets/img/writeup/web/2017-08-17-shiyanbar-easy-sql2/0x01.png)

直接拿上一题sql的语句来注入一下

![](/assets/img/writeup/web/2017-08-17-shiyanbar-easy-sql2/0x02.png)

提示sql注入被检测到, 猜测是空格被过滤了

![](/assets/img/writeup/web/2017-08-17-shiyanbar-easy-sql2/0x03.png)


### 0x01 inject

万能空格 /**/ 替代, getflag~

![](/assets/img/writeup/web/2017-08-17-shiyanbar-easy-sql2/0x04.png)