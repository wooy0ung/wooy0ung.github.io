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
>0x006 修复/root/.profile加载错误  
<!-- more -->
>0x007 安装Exploit开发利器--peda  
>0x008 搭建java环境  
>0x009 搭建shadowsocks服务器  
>0x010 解决ssh超时自动断开  
>0x011 解决ssh连接vps验证失败  


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


## 0x006 修复/root/.profile加载错误

现象：
![](/assets/img/note/2018-02-21-ubuntu-environment/0x006-001.png)

编辑/root/.profile文件
```
tty -s && mesg n || true
```
![](/assets/img/note/2018-02-21-ubuntu-environment/0x006-002.png)

重启


## 0x007 安装Exploit开发利器--PEDA

```
$ git clone https://github.com/longld/peda.git ~/peda
$ echo "source ~/peda/peda.py" >> ~/.gdbinit
```


## 0x008 搭建java环境

先验证是否已安装
```
$ java -version
```

未安装
![](/assets/img/note/2018-02-21-ubuntu-environment/0x008-001.png)

下载 jdk, [传送门](http://www.oracle.com/technetwork/java/javase/downloads/java-archive-javase8-2177648.html)

![](/assets/img/note/2018-02-21-ubuntu-environment/0x008-002.png)
选择对应版本的 jdk, 登录后获取下载地址
```
$ wget download_address
```

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
![](/assets/img/note/2018-02-21-ubuntu-environment/0x008-003.png)


## 0x009 搭建shadowsocks服务器

环境:  
DigitalOcean Singapore  
ubuntu 16.04 LST

安装shadowsocks
```
$ sudo apt-get update
$ sudo apt-get install python-pip
$ sudo pip install shadowsocks
```

创建/etc/shadowsocks.json, 添加
```
{
    "server": "server_ip",
    "server_port": 8000,
    "local_port": 1080,
    "password": "password",
    "timeout": 300,
    "method": "aes-256-cfb"
}
```

后台启动
```
$ sudo ssserver -c /etc/shadowsocks.json -d start
```

添加开机启动项
```
$ cd /etc/init.d
$ nano shadowsocks
#添加
#!/bin/bash
ssserver -c /etc/shadowsocks.json -d start

$ chmod 755 shadowsocks
$ sudo update-rc.d shadowsocks defaults 95
```


## 0x010 解决ssh超时自动断开

说明:  
默认设置下, ssh连接一段时间内没有任何操作, 连接会自动断开。 

编辑 /etc/ssh/sshd_config
```
ClientAliveInterval 60
ClientAliveCountMax 3
```

"ClientAliveInterval 60" 表示服务器每分钟向客户端发送一次请求消息
![](/assets/img/note/2018-02-21-ubuntu-environment/0x010-001.png)

现在, 即使空闲下ssh也不会断开


## 0x011 解决ssh连接vps验证失败

说明：
某日将 vps rebuild, 再次 ssh 连上去就出现验证失败...  
![](/assets/img/note/2018-02-21-ubuntu-environment/0x011-001.png)

.ssh/known_hosts 记录远程着主机的公钥, 主机 rebuild 后还是用旧key去登录自然连不上, 输入以下命令
```
$ ssh-keygen -R VPS_IP
```

再次连接询问是否添加公钥, 确认后就能正常连接