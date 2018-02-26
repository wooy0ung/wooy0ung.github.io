---
layout:		post
title:		环境搭建之CentOS篇
author:		wooy0ung
tags:		centos
category:  	note
---


>[索引目录]  
>0x001 解决CentOS7虚拟机无法上网  
>0x002 安装Xfce桌面环境  
>0x003 安装VMware Tools(修复共享问题)与控制台分辨率设置  
>0x004 安装Gnome桌面环境  
>0x005 安装32位运行库  
<!-- more -->


## 0x001 解决CentOS7虚拟机无法上网

现象：执行"yum update"命令报错，ping不通外网
![](/assets/img/note/2018-02-26-centos-environment/0x001-001.png)

打开“编辑->虚拟网络编辑器”
![](/assets/img/note/2018-02-26-centos-environment/0x001-002.png)

打开“NAT设置”设置好网关
![](/assets/img/note/2018-02-26-centos-environment/0x001-003.png)

虚拟机打开/etc/sysconfig/network-scripts/ifcfg-ens33
![](/assets/img/note/2018-02-26-centos-environment/0x001-004.png)

设置虚拟机网络适配器为“NAT模式”
![](/assets/img/note/2018-02-26-centos-environment/0x001-005.png)

重启网络服务
```
$ service network restart
```


## 0x002 安装Xfce桌面环境

安装epel源
```
$ sudo yum install epel-release
$ sudo yum update
```

安装X Windows system
```
$ sudo yum groupinstall "X Window system"
```

安装Xfce4
```
$ sudo yum groupinstall Xfce
```

安装中文字体
```
# 文泉驿
$ yum list | grep wqy
$ sudo yum install wqy*

# cjkuni
$ yum list | grep cjkuni
$ sudo yum install cjkuni*
```

设置开机启动
```
$ sudo systemctl set-default graphical.target
```

重启


## 0x003 安装VMware Tools(修复共享问题)与控制台分辨率设置

挂载镜像
```
$ mkdir /media/mnt
$ mount /dev/cdrom /media/mnt/
```

复制.tar.gz到/tmp目录，解压
```
$ tar -zxvf *.tar.gz
```

安装perl、gcc
```
$ yum install perl
$ yum install gcc
```

安装kernel-headers
```
$ yum install kernel-headers-$(uname -r) kernel-devel-$( uname -r) -y
```

运行vmware-install.pl，全程默认选择
```
$ ./vmware-install.pl
```
![](/assets/img/note/2018-02-26-centos-environment/0x003-001.png)
重启，发现vmtools仍没有装上

安装open-vm-tools与nano
```
$ yum install open-vm-tools
$ yum install nano
```

继续挂载光盘
```
$ mkdir /mnt/cdrom
$ mount /dev/cdrom /mnt/cdrom
```

解压
```
$ cd /mnt/cdrom
$ tar zxf VM*.gz -C /root
```

修改hgfs源码
```
#进入源码目录
$ cd /root/vmware-tools-distrib/lib/modules/source
#解压 hgfs 源码
$ tar xf vmhgfs.tar
$ cd vmhgfs-only
#编辑 page.c 文件, 如果没有安装 nano 用 yum 安装
$ nano page.c
```

按Ctrl + w打开搜索框, 输入以下内容, 按回车搜索
```
#if LINUX_VERSION_CODE >= KERNEL_VERSION(3, 19, 0)
```

多次Ctrl + w查找, 直到找到包含以下内容的代码
```
int
HgfsWbRequestWait(HgfsWbPage *req)
{
#if LINUX_VERSION_CODE >= KERNEL_VERSION(3, 19, 0)
    return wait_on_bit_io(&req->wb_flags,
                          PG_BUSY,
                          TASK_UNINTERRUPTIBLE);
#elif LINUX_VERSION_CODE >= KERNEL_VERSION(2, 6, 13)
    return wait_on_bit(&req->wb_flags,
                       PG_BUSY,
#if LINUX_VERSION_CODE < KERNEL_VERSION(3, 17, 0)
                       HgfsWbRequestWaitUninterruptible,
#endif
                       TASK_UNINTERRUPTIBLE);
#else
    wait_event(req->wb_queue,
               !test_bit(PG_BUSY,&req->wb_flags));
    return 0;
#endif
}
```

将#if LINUX_VERSION_CODE >= KERNEL_VERSION(3, 19, 0)中的3, 19, 0替换为3, 10, 0
```
#if LINUX_VERSION_CODE >= KERNEL_VERSION(3, 10, 0)
```

保存退出
```
$ cd ..
#将改好的代码重新打包
$ tar cf vmhgfs.tar vmhgfs-only
```

开始安装
```
$ cd /root/vmware*
$ ./vmware-install.pl
```

设置共享文件夹，重启生效
![](/assets/img/note/2018-02-26-centos-environment/0x003-002.png)

修改分辨率
```
$ nano /etc/default/grub
```

在GRUB_CMDLINE_LINUX=”xxxx”项最后插入vga=0x342(分辨率为 1152*864*32)
```
GRUB_CMDLINE_LINUX="xxxx vga=0x342"
```

令配置生效
```
$ mkdir /root/grub2
$ grub2-mkconfig -o /root/grub2/grub.cfg
```

重启


## 0x004 安装Gnome桌面环境

说明：
发现CentOS 7对xfce的支持不太好，换成Gnome环境

安装Gnome包
```
$ yum groupinstall "GNOME Desktop" "Graphical Administration Tools"
```

更新系统的运行级别
```
$ ln -sf /lib/systemd/system/runlevel5.target /etc/systemd/system/default.target
```

重启