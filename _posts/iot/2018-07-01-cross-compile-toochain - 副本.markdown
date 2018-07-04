---
layout:		post
title:		编译mipsel交叉工具链  
author:		wooy0ung
tags:		mipsel
category:  	iot
---


>说明：
>通过buildroot可以编译出各架构的交叉编译链，配置过程也很简单，下面以mispel为例。  
<!-- more -->


下载buildroot
[[传送门]](https://buildroot.org/)

安装依赖
```
$ sudo apt install libncurses5-dev patch
```

执行
```
$ make menuconf
```

设置Target Architecture
![](/assets/img/iot/2018-07-01-cross-compile-toochain/0x001.png)

Kernel Headers设置为与本机对应(uname -r查询)
![](/assets/img/iot/2018-07-01-cross-compile-toochain/0x002.png)

编译
```
$ make
```

在./output/host目录可以看到编译好的工具链
![](/assets/img/iot/2018-07-01-cross-compile-toochain/0x003.png)

加入环境变量
```
$ nano /etc/profile
export PATH=$PATH:/root/toolchain/gcc/mipsel32/bin
$ source /etc/profile
```

执行成功
```
$ mipsel-linux-gcc -g hello.c -o hello -static
```