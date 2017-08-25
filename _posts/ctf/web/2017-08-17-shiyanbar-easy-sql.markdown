---
layout:     post
title:      shiyanbar 简单的sql注入
author:     wooy0ung
tags: 		web sql
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
http://www.shiyanbar.com/

Problem Description:
通过注入获得flag值（提交格式：flag{}）。

Address:
http://ctf5.shiyanbar.com/423/web/
```
<!-- more -->


### 0x01 check

判断是否存在注入点

![](/assets/img/ctf/web/2017-08-17-shiyanbar-easy-sql/0x00.png)

![](/assets/img/ctf/web/2017-08-17-shiyanbar-easy-sql/0x01.png)

猜测报错的sql语句变成了
```
select * from student where ID=''' and name=''
```

### 0x02 inject

发现关键字 union、select、from 被过滤了

![](/assets/img/ctf/web/2017-08-17-shiyanbar-easy-sql/0x02.png)

将被过滤的关键字写2遍提交, getflag~

![](/assets/img/ctf/web/2017-08-17-shiyanbar-easy-sql/0x03.png)