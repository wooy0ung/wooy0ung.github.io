---
layout:     post
title:      ctf比赛中的pwn-docker环境搭建
author:     wooy0ung
tags: 		normal
category:  	writeup
---


>前言:   
>为什么写这篇文? 最近在准备一场BIN专题的校内赛, 在搭PWN环境时多多少少踩到了一些坑,  
>写这篇文章记录下自己的踩坑经历, 也方便以后查看。  
>  
>为什么需要布置PWN服务器? 像PWN这类神题怎么能布置在本地, 当然得放到一个具有公网ip  
的服务器上。为什么需要docker? 想像一下getshell后的各种删flag、删库操作...  
>  
>说明:  
>本来是打算投稿到Freebuf上的，估计是太简单了，没通过(・ω・)，最后还是发到博客上来吧。  
<!-- more -->

### 0x01 前期准备

1. 具有公网ip的vps
2. ubuntu 16.04 LST
3. docker


### 0x02 docker安装&配置

ssh连接上vps

```
$ root@vps_ip
```

安装docker

```
$ sudo apt-get update
$ sudo apt-get install docker.io
```

启动docker

```
$ sudo service docker start
```

测试运行

```
$ docker run hello-world
```

显示这样是正常的

![](/assets/img/writeup/normal/2018-01-16-ctf-pwn-docker/0x01.png)

### 0x03 配置Dockerfile

准备题目源码, 保存为pwn.c

```
#include <stdio.h>
#include <stdlib.h>

int main()
{
	unsigned int n,m;
	char x,y;
	scanf("%u %u", &n, &m);

	x = n + m;
	y = n - m;

	if(x == -23 && y == -33)
		system("/bin/sh");
	else
		printf("Try again~\n");

	return 0;
}
```

准备flag

```
flag{2333333333333333333}
```

编译

```
$ gcc pwn.c -o pwn
```

关闭ASLR

```
$ sudo bash -c 'echo 0 > /proc/sys/kernel/randomize_va_space'
```

准备Dockerfile

```
FROM ubuntu
MAINTAINER wooy0ung
# x86支持
RUN dpkg --add-architecture i386
# update列表
RUN apt-get update
# 安装基础程序
RUN apt-get install -y libc6:i386 libncurses5:i386 libstdc++6:i386\
    &&apt-get install -y socat sudo

# copy源文件
COPY ./pwn /tmp/pwn
COPY ./flag	/tmp/
# add低权限用户
RUN useradd -U -m pwn
# 配置权限, 程序属于低权限用户, flag属于root与低权限组, 组可查看flag
RUN chown root:pwn /tmp/flag\
    &&chown root:pwn /tmp/pwn
RUN chmod  750 /tmp/pwn\
    &&chmod 740 /tmp/flag

CMD sudo -u pwn socat tcp-l:4444,fork exec:/tmp/pwn
EXPOSE 4444
```

建立docker镜像

```
$ docker build -t pwn .
```

![](/assets/img/writeup/normal/2018-01-16-ctf-pwn-docker/0x02.png)

运行

```
$ docker run -d -p 0.0.0.0:10001:4444 -t pwn
```

nc上去

![](/assets/img/writeup/normal/2018-01-16-ctf-pwn-docker/0x02.png)


###0x04 拉取libc.so

运行docker镜像

```
$ docker run -it pwn /bin/bash
```

![](/assets/img/writeup/normal/2018-01-16-ctf-pwn-docker/0x04.png)

copy libc.so 到主机, 再scp传回本地

```
$ docker cp ddb4a858df6c:/tmp/libc.so.6 .
```

![](/assets/img/writeup/normal/2018-01-16-ctf-pwn-docker/0x05.png)