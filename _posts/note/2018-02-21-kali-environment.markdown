---
layout:		post
title:		环境搭建之Kali篇
author:		wooy0ung
tags:		kali
category:  	note
---


>[索引目录]  
>0x001 解决登录密码与钥匙环密码不一致  
>0x002 安装32位运行库  
<!-- more -->


## 0x001 解决登录密码与钥匙环密码不一致

说明：
某日连接 pptp 是弹出需要输入钥匙环密码, 提示登录密码与钥匙环密码不一致。  
在弹出框里输入登录密码后果然是 incorrect。  
![](/assets/img/note/2018-02-21-kali-environment/0x001-001.png)

输入以下命令
```
$ seahorse
```
![](/assets/img/note/2018-02-21-kali-environment/0x001-002.png)

找不到命令, 安装 seahorse
```
$ sudo apt-get install seahorse
```

再次输入 seahorse, 在弹出的密码与密钥框更改登录密码, 此时会要求验证旧密钥环密码, 通过后再设置新密钥环密码


## 0x002 安装32位运行库

```
dpkg --add-architecture i386
apt-get update
apt-get install lib32z1 lib32ncurses5
```