---
layout:		post
title:		环境搭建之Debian篇
author:		wooy0ung
tags:		debian
category:  	note
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 启用内置root用户  
>0x002 安装VMwareTools  
>0x003 安装32位运行库  
<!-- more -->


## 0x001 启用内置root用户

登录root
```
$ su root
```

修改daemon.conf
```
$ gedit /etc/gdm3/daemon.conf

# 添加
[security]
AllowRoot = true
```

修改gdm-password
```
$ /etc/pam.d/gdm-password
#auth required pam_succeed_if.so user != root quiet_success
```


## 0x002 安装VMwareTools

manifest.txt和VMwareTools-*-tar.gz复制到/tmp目录，提取VMwareTools-*-tar.gz到此目录
![](/assets/img/note/2018-02-21-windows-environment/0x002-001.png)

安装依赖
```
$ apt-get update
$ apt-get install build-essential
```

安装linux-headers
```
$ apt-cache search linux-headers-$(uname -r)
$ apt-get install linux-headers-$(uname -r)
```

执行vmware-install.pl
```
$ ./vmware-install.pl
```

输入yes进行安装，之后全部默认


## 0x003 安装32位运行库

```

```