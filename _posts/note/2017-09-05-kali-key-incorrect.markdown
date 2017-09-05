---
layout:     post
title:      kali 登录密码与钥匙环密码不一致
author:     wooy0ung
tags: 		kali
category:  	note
---


>说明:  
>某日连接 pptp 是弹出需要输入钥匙环密码, 提示登录密码与钥匙环密码不一致。  
>在弹出框里输入登录密码后果然是 incorrect。  
![](/assets/img/note/2017-09-05-kali-key-incorrect/0x00.png)
<!-- more -->


### 0x00 解决

检索一下解决方法, 输入以下命令

```
$ seahorse
```

![](/assets/img/note/2017-09-05-kali-key-incorrect/0x01.png)

找不到命令, 安装 seahorse

```
$ sudo apt-get install seahorse
```

再次输入 seahorse, 在弹出的密码与密钥框更改登录密码, 此时会要求验证旧密钥环密码, 通过后再设置新密钥环密码