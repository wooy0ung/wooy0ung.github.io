---
layout:     post
title:      实验吧 web部分writeup
author:     wooy0ung
tags: 		web
category:  	writeup
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 简单的sql注入  
>0x002 Forbidden  
>0x003 貌似有点难  
>0x004 登陆一下好吗??  
<!-- more -->


## 0x001 简单的sql注入

>Problem Description:  
>通过注入获得flag值（提交格式：flag{}）。  
>  
>Address:  
>http://ctf5.shiyanbar.com/423/web/  

判断是否存在注入点
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x001-001.png)
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x001-002.png)

猜测报错的sql语句变成了
```
select * from student where ID=''' and name=''
```

发现关键字union、select、from被过滤了
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x001-003.png)

将被过滤的关键字写2遍提交, getflag~
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x001-004.png)


## 0x002 Forbidden

>Problem Description:  
>不要相信此题有提示描述哦！  
>  
>Address:  
>http://ctf5.shiyanbar.com/basic/header/  

Accept-Language项的zh-CN改为zh-hk
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x002-001.png)

提交, getflag~
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x002-002.png)


## 0x003 貌似有点难

>Problem Description:  
>不多说，去看题目吧。  
>  
>Address:  
>http://ctf5.shiyanbar.com/phpaudit/  

直接看php源码
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x003-001.png)

发现判断ip是否为1.1.1.1, 在header添加client-ip: 1.1.1.1, 提交, getflag~
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x003-002.png)


## 0x004 登陆一下好吗??

>Problem Description:  
>不要怀疑,我已经过滤了一切,还再逼你注入,哈哈哈哈哈!  
>flag格式：ctf{xxxx}  
>  
>Address:  
>http://ctf5.shiyanbar.com/web/wonderkun/web/index.html  

直接尝试万能密码 'or'='or' 与 'or 1=1/*, 发现 or 被过滤，进一步发现 select、union 等关键字也被过滤了
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x004-001.png)


考虑到登录验证的sql语句一般为 select * from user where username='' and password='',构造注入语句
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x004-002.png)

构造 username='1'='' and password='1'='' --> 1 and 1, 最终将所有表项列出来
![](/assets/img/writeup/2017-08-17-shiyanbar-web-writeup/0x004-003.png)