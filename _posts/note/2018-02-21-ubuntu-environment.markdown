---
layout:		post
title:		环境搭建之Ubuntu篇
author:		wooy0ung
tags:		ubuntu
category:  	note
---

- 目录
{:toc #markdown-toc}

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
>0x012 安装ropper  
>0x013 tar解压命令详细参数  
>0x014 配置arm调试器 & gef脚本  
>0x015 解决Ubuntu 16.04.3虚拟机开机开机蓝屏  
>0x016 ubuntu 16.04下的美化配置  
>0x017 安装wireshark  


## 0x001 启用内置root用户

设置root用户密码
```
$ sudo passwd root
[sudo] password for user:
Enter new UNIX password:
Retype new UNIX password:
passwd: password updated successfully
```

对于Ubuntu 12
```
$ cp -p /etc/lightdm/lightdm.conf /etc/lightdm/lightdm.conf.bak
$ nano /etc/lightdm/lightdm.conf

# 添加
greeter-show-manual-login=true
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
$ git clone https://github.com/longld/peda.git
$ echo "source ~/toolchain/peda/peda.py" >> ~/.gdbinit
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


## 0x012 安装ropper

```
$ sudo pip install capstone
$ sudo apt install python-capstone
$ sudo pip install filebytes
$ sudo pip install ropper
```


## 0x013 tar解压命令详细参数

tar
```
# 这五个是独立的命令，压缩解压都要用到其中一个，可以和别的命令连用但只能用其中一个。
-c: 建立压缩档案
-x：解压
-t：查看内容
-r：向压缩归档文件末尾追加文件
-u：更新原压缩包中的文件

# 下面的参数是根据需要在压缩或解压档案时可选的。
-z：有gzip属性的
-j：有bz2属性的
-Z：有compress属性的
-v：显示所有过程
-O：将文件解开到标准输出

# 下面的参数-f是必须的
-f: 使用档案名字，切记，这个参数是最后一个参数，后面只能接档案名。

# 这条命令是将所有.jpg的文件打成一个名为all.tar的包。-c是表示产生新的包，-f指定包的文件名。
$ tar -cf all.tar *.jpg 

# 这条命令是将所有.gif的文件增加到all.tar的包里面去。-r是表示增加文件的意思。
$ tar -rf all.tar *.gif 

# 这条命令是更新原来tar包all.tar中logo.gif文件，-u是表示更新文件的意思。
$ tar -uf all.tar logo.gif 

# 这条命令是列出all.tar包中所有文件，-t是列出文件的意思
$ tar -tf all.tar 

# 这条命令是解出all.tar包中所有文件，-x是解开的意思
$ tar -xf all.tar 
```

压缩
```
# 将目录里所有jpg文件打包成tar.jpg
$ tar –cvf jpg.tar *.jpg

# 将目录里所有jpg文件打包成jpg.tar后，并且将其用gzip压缩，生成一个gzip压缩过的包，命名为jpg.tar.gz
$ tar –czf jpg.tar.gz *.jpg

#将目录里所有jpg文件打包成jpg.tar后，并且将其用bzip2压缩，生成一个bzip2压缩过的包，命名为jpg.tar.bz2
$ tar –cjf jpg.tar.bz2 *.jpg

# 将目录里所有jpg文件打包成jpg.tar后，并且将其用compress压缩，生成一个umcompress压缩过的包，命名为jpg.tar.Z
tar –cZf jpg.tar.Z *.jpg

# rar格式的压缩，需要先下载rar for linux
$ rar a jpg.rar *.jpg

# zip格式的压缩，需要先下载zip for linux
$ zip jpg.zip *.jpg
```

解压
```
$ tar -xvf file.tar //解压 tar包

$ tar -xzvf file.tar.gz //解压tar.gz

$ tar -xjvf file.tar.bz2   //解压 tar.bz2

$ tar –xZvf file.tar.Z   //解压tar.Z

$ unrar e file.rar //解压rar

$ unzip file.zip //解压zip
```


## 0x014 配置arm调试器 & gef脚本

安装交叉编译环境
```
$ sudo apt install gcc-5-arm-linux-gnueabi
```

安装依赖
```
$ sudo apt install gdb-multiarch
```

进入目录./gdb-7.11.1/gdb/gdbserver
```
$ mkdir build
$ CC="arm-linux-gnueabi-gcc-5" CXX="arm-linux-gnueabi-g++-5" ./configure --target=arm-linux-gnueabi --host="arm-linux-gnueabi" --prefix="/root/toolchain/gdb/gdb-7.11.1/gdb/gdbserver/build"
$ make install
```

在build目录找到编译好的gdbserver
```
$ file arm-linux-gnueabi-gdbserver
arm-linux-gnueabi-gdbserver: ELF 32-bit LSB executable, ARM, EABI5 version 1 (SYSV), dynamically linked, interpreter /lib/ld-linux.so.3, for GNU/Linux 3.2.0, BuildID[sha1]=b65f702a4d50f352a03e2346724bf0f888cd93ea, not stripped
```

安装gef增强脚本
```
$ wget -O ~/.gdbinit-gef.py -q https://github.com/hugsy/gef/raw/master/gef.py
$ echo source ~/.gdbinit-gef.py >> ~/.gdbinit
```

修复依赖
```
$ pip3 install capstone
$ pip3 install unicorn
$ pip3 install ropper
$ pip3 install retdec-python
```

修复keystone-engine
```
$ sudo apt-get install cmake
$ mkdir build
$ cd build
$ cmake -DCMAKE_BUILD_TYPE=Release -DBUILD_SHARED_LIBS=ON -DLLVM_TARGETS_TO_BUILD="AArch64;X86" -G "Unix Makefiles" ..
$ sudo make install

$ sudo ldconfig
$ pip3 install keystone-engine
```
![](/assets/img/note/2018-02-21-ubuntu-environment/0x014-001.png)

启动gdbserver
```
$ scp -P 5022 hello pi@127.0.0.1:/tmp
$ scp -P 5022 arm-linux-gnueabi-gdbserver pi@127.0.0.1:/tmp
$ ./arm-linux-gnueabi-gdbserver 0.0.0.0:2333 hello
Process hello created; pid = 702
Listening on port 2333
```

启动gdb
```
$ gdb-multiarch
$ set architecture arm
$ gef-remote –q 127.0.0.1:2333
```


## 0x015 解决Ubuntu 16.04.3虚拟机开机开机蓝屏

现象
![](/assets/img/note/2018-02-21-ubuntu-environment/0x015-001.png)

编辑.vmx文件，添加
```
cpuid.1.eax = "0000:0000:0000:0001:0000:0110:1010:0101"
```

重启


## 0x017 安装wireshark

```
sudo apt-add-repository ppa:wireshark-dev/stable
sudo apt-get update
sudo apt-get install wireshark
```