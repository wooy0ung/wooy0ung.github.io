---
layout:     post
title:      ubuntu 搭建 java 环境
author:     wooy0ung
tags: 		ubuntu
category:  	note
---


>环境:  
>ubuntu 16.04 LST  
>java jdk1.8.0_121  
>注意:  
>直接 wget, 会出现 Authentication Failed  
![](/assets/img/note/2017-09-04-ubuntu-java/0x00.png)  
<!-- more -->


### 0x00 下载

先验证是否已安装

```
$ java -version
```

未安装

![](/assets/img/note/2017-09-04-ubuntu-java/0x01.png)

下载 jdk, [传送门](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html)

![](/assets/img/note/2017-09-04-ubuntu-java/0x02.png)

选择对应版本的 jdk, 登录后获取下载地址

```
$ wget download_address
```


### 0x01 安装

解压

```
$ tar zxvf jdk-8u121-linux-x64.tar.gz
$ mv jdk1.8.0_121 /opt/
```

设置环境变量

```
# 编辑 /etc/profile, 在末尾添加
export JAVA_HOME=/opt/jdk1.8.0_121
export JRE_HOME=$JAVA_HOME/jre
export CLASSPATH=.:$CLASSPATH:$JAVA_HOME/lib:$JRE_HOME/lib
export PATH=$PATH:$JAVA_HOME/bin:$JRE_HOME/bin
```

验证

```
$ java -version
```

安装完成

![](/assets/img/note/2017-09-04-ubuntu-java/0x03.png)