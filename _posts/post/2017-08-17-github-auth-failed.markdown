---
layout:     post
title:      Github Authentication failed
author:     wooy0ung
tags: 		git diary
category:  	post
---


### 0x00 起因

今天mac出现 login fail 问题, 终于修好了, 因为更改了钥匙串, github desktop 又出现 Authentication failed 的问题。

![](/assets/img/post/2017-08-17-github-auth-failed/0x00.png)
<!-- more -->


### 0x01 解决

先用以下命令完成一次push

```
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```

中途提示输入username和password

```
Username for 'https://github.com': wooy0ung
Password for 'https://wooy0ung@github.com':
```

输入后push完成, 回到 github desktop 注销账号后再登入, 以后就正常了