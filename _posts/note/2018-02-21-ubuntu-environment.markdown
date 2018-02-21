---
layout:		post
title:		环境搭建之Ubuntu篇
author:		wooy0ung
tags:		ubuntu
category:  	note
---


>[索引目录]  
>0x001 启用内置root用户  
>0x002 解决py脚本不能attach进程  
>0x003 安装python2 & python3  
>0x004 安装pwntools  
>0x005 安装32位运行库  
<!-- more -->


## 0x001 启用内置root用户

设置root用户密码
```
$ sudo passwd root
[sudo] password for user:
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

对于Ubuntu 16
```
$ sudo gedit /usr/share/lightdm/lightdm.conf.d/50-unity-greeter.conf

# 添加
user-session=ubuntu
greeter-show-manual-login=true
all-guest=false
```

对于Ubuntu 17
```
$ sudo nano gdm-autologin
#auth   required        pam_succeed_if.so user != root quiet_success

$ sudo nano gdm-password
#auth   required        pam_succeed_if.so user != root quiet_success
```

重启后输入root账户密码登陆


## 0x002 解决py脚本不能attach进程

关闭ptrace
```
$ echo 0 | sudo tee /proc/sys/kernel/yama/ptrace_scope
```


## 0x003 安装python2 & python3

python2
```
$ sudo apt-get install python2.7 python2.7-dev
$ sudo apt-get install python-pip
```

python3
```
$ sudo apt-get install python3.7 python3.7-dev
$ sudo apt-get install python-pip3
```

安装开发包
```
$ sudo apt-get install build-essential libssl-dev libevent-dev libjpeg-dev libxml2-dev libxslt-dev
```


## 0x004 安装pwntools

```
$ sudo pip install pwntools
```


## 0x005 安装32位运行库

```
$ sudo dpkg --add-architecture i386
$ sudo apt-get update
$ sudo apt-get install libc6:i386 libc6-dev-i386 libncurses5:i386 libstdc++6:i386 zlib1g:i386
```