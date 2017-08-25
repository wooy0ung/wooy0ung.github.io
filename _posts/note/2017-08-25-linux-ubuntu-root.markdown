---
layout:     post
title:      Linux 启用 root 用户
author:     wooy0ung
tags: 		ubuntu
category:  	note
---


>一直用的是 Kali, 因为要解压 Android 的 .db 文件需要用到 Ubuntu。。。。  
>果然还是 Ubuntu 比较适合 bin ,装好发现默认不是 root 用户, 以下是启用 root 用户的过程。  
<!-- more -->


### 0x00 编辑 50-ubuntu.conf 文件

```
$ sudo passwd root
[sudo] password for wooy0ung:
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
$ su
Password:
$ sudo gedit /usr/share/lightdm/lightdm.conf.d/50-ubuntu.conf
```

![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x00.png)
![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x01.png)

在 50-ubuntu.conf 文件添加

```
greeter-show-manual-login=true
```

![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x02.png)

rebot 后, 输入用户名 root & 密码登录

![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x03.png)


### 0x01 修复 /root/.profile 加载错误

![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x04.png)

编辑 /root/.profile 文件

```
tty -s && mesg n || true
```

![](/assets/img/note/2017-08-25-linux-ubuntu-root/0x05.png)

reboot