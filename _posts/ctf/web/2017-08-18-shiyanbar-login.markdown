---
layout:     post
title:      shiyanbar 登陆一下好吗??
author:     wooy0ung
tags: 		web
category:  	ctf
---


### 0x00 introduction


```
Problem Address:
http://www.shiyanbar.com/

Problem Description:
不要怀疑,我已经过滤了一切,还再逼你注入,哈哈哈哈哈!
flag格式：ctf{xxxx}

Address:
http://ctf5.shiyanbar.com/web/wonderkun/web/index.html
```
<!-- more -->

### 0x01 inject

直接尝试万能密码 'or'='or' 与 'or 1=1/*, 发现 or 被过滤

![](/assets/img/ctf/web/2017-08-18-shiyanbar-login/0x00.png)

进一步发现 select、union 等关键字也被过滤了

考虑到登录验证的sql语句一般为 select * from user where username='' and password='',构造注入语句

![](/assets/img/ctf/web/2017-08-18-shiyanbar-login/0x01.png)

构造 username='1'='' and password='1'='' --> 1 and 1, 最终将所有表项列出来

![](/assets/img/ctf/web/2017-08-18-shiyanbar-login/0x02.png)