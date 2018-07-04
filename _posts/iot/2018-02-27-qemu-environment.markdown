---
layout:		post
title:		玩转qemu之环境搭建
author:		wooy0ung
tags:		qemu
category:  	note
---


>[索引目录]  
>0x001 aarch64  
>0x002 aarch32  
>0x003 mips  
>0x004 mips64  
>0x005 mipsel  
>0x006 mipsel64  
<!-- more -->
>0x006 raspberrypi  
>0x006 x86  
>0x007 x86_x64  
>0x008 x86-k2.6  


## 0x001 aarch64

安装依赖
```
$ sudo apt-get install libcap-dev
$ sudo apt-get install libpixman-1-dev
$ apt-get install libncurses5-dev
$ sudo apt-get install libasound2-dev libasound2
$ sudo apt-get install libglib2.0-dev
$ sudo apt install u-boot-tools
```

安装qemu
```
# http://download.qemu-project.org/qemu-2.8.0.tar.xz
$ tar -xf qemu-2.8.0.tar.xz
$ cd qemu-2.8.0
$ mkdir build
$ cd build
$ ../configure --target-list=arm-softmmu,aarch64-softmmu,mips-softmmu,mipsel-softmmu,i386-softmmu,x86_64-softmmu,arm-linux-user,aarch64-linux-user,i386-linux-user,x86_64-linux-user,mips-linux-user,mipsel-linux-user --audio-drv-list=alsa --enable-virtfs
$ make -j8
$ sudo make install
```

下载工具链
```
# http://www.veryarm.com/aarch64-linux-gnu-gcc
# gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux
```

编译linux内核
```
# https://cdn.kernel.org/pub/linux/kernel/v4.x/linux-4.10.tar.xz
$ tar -xf linux-4.10.tar.xz

$ cross_compile=/root/toolchain/gcc/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-
$ make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 defconfig
$ sudo gedit .config

# CONFIG 9P
CONFIG_NET_9P=y
CONFIG_NET_9P_VIRTIO=y
CONFIG_NET_9P_DEBUG=y
CONFIG_9P_FS=y
CONFIG_9P_FS_POSIX_ACL=y
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y

# CONFIG PCI and virtio
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y
CONFIG_PCI_HOST_GENERIC=y

$ make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 menuconfig
$ make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 Image -j4

General setup  --->
    [*] Initial RAM filesystem and RAM disk (initramfs/initrd) support

Device Drivers  --->
    [*] Block devices  --->
        <*>   RAM block device support
        (65536) Default RAM disk size (kbytes)
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-001.png)
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-002.png)

制作根文件系统
```
# https://busybox.net/downloads/busybox-1.24.2.tar.bz2
$ tar -xjvf busybox-1.24.2.tar.bz2

$ make menuconfig

Build Options  --->
    [*] Build BusyBox as a static binary (no shared libs)
    (/root/toolchain/gcc/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-)Cross Compiler prefix

$ make && make install
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-003.png)

添加开机自启动挂载共享文件
```
$ sudo gedit /etc/init.d/rcS

mkdir /nfsroot
mount -t 9p -o trans=virtio,version=9p2000.L hostshare /nfsroot
```

制作启动用的ramdisk
```
# http://files.cnblogs.com/files/pengdonglin137/aarch64_ramdisk_rootfs.tar.gz
$ tar -xzvf aarch64_ramdisk_rootfs.tar.gz

# mk_ramdisk.sh
#!/bin/bash
sudo rm -rf rootfs
sudo rm -rf tmpfs
sudo rm -rf ramdisk*
sudo mkdir rootfs
sudo cp ../busybox-1.24.2/_install/*  rootfs/ -raf
sudo mkdir -p rootfs/proc/
sudo mkdir -p rootfs/sys/
sudo mkdir -p rootfs/tmp/
sudo mkdir -p rootfs/root/
sudo mkdir -p rootfs/var/
sudo mkdir -p rootfs/mnt/
sudo cp etc rootfs/ -arf
sudo mkdir -p rootfs/lib
sudo cp -arf /root/toolchain/gcc/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/aarch64-linux-gnu/libc/lib/aarch64-linux-gnu/* rootfs/lib/
sudo rm rootfs/lib/*.a
sudo /root/toolchain/gcc/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-strip rootfs/lib/*
sudo mkdir -p rootfs/dev/
sudo mknod rootfs/dev/tty1 c 4 1
sudo mknod rootfs/dev/tty2 c 4 2
sudo mknod rootfs/dev/tty3 c 4 3
sudo mknod rootfs/dev/tty4 c 4 4
sudo mknod rootfs/dev/console c 5 1
sudo mknod rootfs/dev/null c 1 3
sudo dd if=/dev/zero of=ramdisk bs=1M count=16
sudo mkfs.ext4 -F ramdisk
sudo mkdir -p tmpfs
sudo mount -t ext4 ramdisk ./tmpfs/  -o loop
sudo cp -raf rootfs/*  tmpfs/
sudo umount tmpfs
sudo gzip --best -c ramdisk > ramdisk.gz
sudo mkimage -n "ramdisk" -A arm -O linux -T ramdisk -C gzip -d ramdisk.gz ramdisk.img
```

安装网络配置工具
```
$ sudo apt-get install uml-utilities
$ sudo apt-get install bridge-utils
```

查看/dev/net/tun文件
```
$ ls -l /dev/net/tun
crw-rw-rw- 1 root root 10, 200 Feb 27 03:36 /dev/net/tun
```

修改/etc/network/interfaces
```
# This file describes the network interfaces available on your system
# and how to activate them. For more information, see interfaces(5).

# The loopback network interface
auto lo
iface lo inet loopback

# The primary network interface
auto eth0

auto br0
iface br0 inet dhcp
   bridge_ports eth0
```

添加/etc/qemu-ifup
```
#!/bin/sh

echo sudo tunctl -u $(id -un) -t $1
sudo tunctl -u $(id -un) -t $1

echo sudo ifconfig $1 0.0.0.0 promisc up
sudo ifconfig $1 0.0.0.0 promisc up

echo sudo brctl addif br0 $1
sudo brctl addif br0 $1

echo brctl show
brctl show

sudo ifconfig br0 192.168.1.156
```

添加/etc/qemu-ifdown
```
#!/bin/sh

echo sudo brctl delif br0 $1
sudo brctl delif br0 $1

echo sudo tunctl -d $1
sudo tunctl -d $1
 
echo brctl show
brctl show

ifdown br0
ifup br0
```

添加可执行权限
```
$ chmod +x /etc/qemu-ifup
$ chmod +x /etc/qemu-ifdown
```

重启网卡
```
$ sudo /etc/init.d/networking restart
```

运行
```
# run.sh
sudo qemu-system-aarch64 \
    -M  virt \
    -cpu cortex-a53 \
    -smp 2 \
    -m 4096M \
    -kernel ./Image \
    -nographic \
    -append "root=/dev/ram0 rw rootfstype=ext4 console=ttyAMA0 init=/linuxrc ignore_loglevel" \
    -initrd ./ramdisk.img \
    -fsdev local,security_model=passthrough,id=fsdev0,path=/nfsroot \
    -device virtio-9p-pci,id=fs0,fsdev=fsdev0,mount_tag=hostshare \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-004.png)

设置虚拟机网络
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-005.png)

能双向ping通
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-006.png)
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-007.png)

下载gdb-7.11.1
```
$ CC="/root/toolchain/gcc/aarch64/bin/aarch64-linux-gnu-gcc" CXX="/root/toolchain/gcc/aarch64/bin/aarch64-linux-gnu-g++" ./configure --target=aarch64-linux-gnu --host="aarch64-linux-gnu" --prefix="/root/toolchain/gdb/gdb-7.11.1/gdb/gdbserver/out_aarch64"
$ make install
```

交叉编译测试例程
```
$ mkdir build && cd build
$ nano hello.c
#include <stdio.h>

int main()
{
    printf("hello\n");
    return 0;
}

$ ./arm-none-linux-gnueabi-gcc -g hello.c -o hello_aarch64 -static
```

gdbserver拷贝到虚拟机，执行
```
$ ./gdbserver-aarch64 0.0.0.0:2333 ./hello_aarch64
```

报错，原因是没有编译静态文件
```
-/bin/sh: ./gdbserver-aarch64: not found
```

修改gdbserver的Makefile，再次编译
![](/assets/img/iot/2018-02-27-qemu-environment/0x001-008.png)

guest执行
```
$ ./gdbserver-aarch64 0.0.0.0:2333 ./hello_aarch64
```

host执行
```
$ gdb-multiarch
gef➤ set architecture aarch64
The target architecture is assumed to be aarch64
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x002 aarch32

安装qemu和依赖
```
# 我已经安装过，输入以下命令会出现提示
$ qemu-system-arm
qemu-system-arm: No machine specified, and there is no default
Use -machine help to list supported machines
```

下载工具链
```
# http://www.veryarm.com/arm-none-linux-gnueabi-gcc
# arm-2014.05-29-arm-none-linux-gnueabi-i686-pc-linux-gnu.tar.bz2
```

编译linux内核
```
# https://www.kernel.org/pub/linux/kernel/v3.x/linux-3.16.tar.xz
$ tar -xf linux-3.16.tar.xz

$ cross_compile=/root/toolchain/gcc/arm-2014.05/bin/arm-none-linux-gnueabi-
$ make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 vexpress_defconfig
$ make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 menuconfig
$ make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 zImage -j4

Kernel Features  --->
    Memory split (3G/1G user/kernel split)  --->
    [*] High Memory Support
Device Drivers  --->
    [*] Block devices  --->
        <*>   RAM block device support
        (8192)  Default RAM disk size (kbytes)
System Type  --->
    [ ] Enable the L2x0 outer cache controller
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x002-001.png)
![](/assets/img/iot/2018-02-27-qemu-environment/0x002-002.png)

添加开机自启动挂载共享文件
```
$ sudo gedit /etc/init.d/rcS

$ mkdir /nfsroot
$ mount -t nfs -o nolock 192.168.1.18:/nfsroot /nfsroot
```

制作根文件系统
```
# https://busybox.net/downloads/busybox-1.24.2.tar.bz2
$ tar -xjvf busybox-1.24.2.tar.bz2
$ make menuconfig

Build Options  ---> 
    [*] Build BusyBox as a static binary (no shared libs)
    (/root/toolchain/gcc/arm-2014.05/bin/arm-none-linux-gnueabi-) Cross Compiler prefix

$ make && make install
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x002-003.png)

制作启动用的ramdisk
```
# http://files.cnblogs.com/files/pengdonglin137/aarch32_rootfs.tar.gz
$ tar -xzvf aarch32_rootfs.tar.gz

# mk_ramdisk.sh
#!/bin/bash
sudo rm -rf rootfs
sudo rm -rf tmpfs
sudo rm -rf ramdisk*
sudo mkdir rootfs
sudo cp ../busybox-1.24.2/_install/*  rootfs/ -raf
sudo mkdir -p rootfs/proc/
sudo mkdir -p rootfs/sys/
sudo mkdir -p rootfs/tmp/
sudo mkdir -p rootfs/root/
sudo mkdir -p rootfs/var/
sudo mkdir -p rootfs/mnt/
sudo cp etc rootfs/ -arf
sudo cp -arf /root/toolchain/gcc/arm-2014.05/arm-none-linux-gnueabi/libc/lib rootfs/
sudo rm -rf rootfs/lib/*.a
sudo /root/toolchain/gcc/arm-2014.05/bin/arm-none-linux-gnueabi-strip rootfs/lib/*
sudo mkdir -p rootfs/dev/
sudo mknod rootfs/dev/tty1 c 4 1
sudo mknod rootfs/dev/tty2 c 4 2
sudo mknod rootfs/dev/tty3 c 4 3
sudo mknod rootfs/dev/tty4 c 4 4
sudo mknod rootfs/dev/console c 5 1
sudo mknod rootfs/dev/null c 1 3
sudo dd if=/dev/zero of=ramdisk bs=1M count=8
sudo mkfs.ext4 -F ramdisk
sudo mkdir -p tmpfs
sudo mount -t ext4 ramdisk ./tmpfs/  -o loop
sudo cp -raf rootfs/*  tmpfs/
sudo umount tmpfs
sudo gzip --best -c ramdisk > ramdisk.gz
sudo mkimage -n "ramdisk" -A arm -O linux -T ramdisk -C gzip -d ramdisk.gz ramdisk.img
```

提示"mkimage：找不到命令"
```
$ sudo apt install u-boot-tools
```

配置网络 & 启动
```
# run.sh
qemu-system-arm \
    -M vexpress-a9 \
    -m 1024M \
    -smp 2 \
    -kernel ./zImage \
    -nographic \
    -append "root=/dev/mmcblk0 rw console=ttyAMA0 init=/linuxrc" \
    -sd ./a9rootfs.ext3 \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```
![](/assets/img/iot/2018-02-27-qemu-environment/0x002-004.png)

提示
```
EXT4-fs (ram0): mounted filesystem with ordered data mode. Opts: (null)
VFS: Mounted root (ext4 filesystem) readonly on device 1:0.
Freeing unused kernel memory: 1024K
mkdir: can't create directory '/var/lock': Read-only file system
```

config kernel
```
Device Drivers —>
Generic Driver Options —>
(/sbin/hotplug) path to uevent helper
[*] Maintain a devtmpfs filesystem to mount at /dev
[*] Automount devtmpfs at /dev, after the kernel mounted the rootfs
[*] Select only drivers that don’t need compile-time external firmware
[*] Prevent firmware from being built
-*- Userspace firmware loading support
[ ] Include in-kernel firmware blobs in kernel binary
() External firmware blobs to build into the kernel binary
[ ] Driver Core verbose debug messages
[ ] Managed device resources verbose debug messages
```

配置主机nfs服务
```
$ sudo apt-get update
$ sudo apt-get install nfs-kernel-server

$ mkdir /nfsroot
$ sudo gedit /etc/exports
/nfsroot *(rw,sync,no_root_squash,no_subtree_check)

$ sudo /etc/init.d/rpcbind restart
$ sudo /etc/init.d/nfs-kernel-server restart
```

下载gdb-7.11.1
```
$ CC="arm-linux-gnueabi-gcc-5" CXX="arm-linux-gnueabi-g++-5" ./configure --target=arm-linux-gnueabi --host="arm-linux-gnueabi" --prefix="/root/toolchain/gdb/gdb-7.11.1/gdb/gdbserver/out_aarch32"
$ make install
```

交叉编译测试例程
```
$ mkdir build
$ nano hello.c
#include <stdio.h>

int main()
{
	printf("hello\n");
	return 0;
}

$ ./arm-none-linux-gnueabi-gcc -g hello.c -o hello_aarch32 -static
```

guest机启动调试
```
$ ./gdbserver_aarch32 0.0.0.0:2333 ./hello_aarch32
```

host机附加上去，报错
```
$ gdb
gef➤ gef-remote -q 192.168.1.20:2333
warning: while parsing target description (at line 10): Target description specified unknown architecture "arm"
warning: Could not load XML target description; ignoring
Remote 'g' packet reply is too long: 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000030feffbe000000005c8b0000100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
```

改成用gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture arm
The target architecture is assumed to be arm
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x003 mips

安装交叉编译链
```
sudo apt-get install linux-libc-dev-mips-cross 
sudo apt-get install libc6-mips-cross libc6-dev-mips-cross 
sudo apt-get install binutils-mips-linux-gnu gcc-mips-linux-gnu 
sudo apt-get install g++-mips-linux-gnu
```

下载vmlinux-3.2.0-4-4kc-malta、debian_wheezy_mips_standard.qcow2
[[传送门]](https://people.debian.org/~aurel32/qemu/mips/)

启动qemu
```
sudo qemu-system-mips \
    -M malta \
    -kernel vmlinux-3.2.0-4-4kc-malta \
    -hda debian_wheezy_mips_standard.qcow2 \
    -nographic \
    -append "root=/dev/sda1 rw console=tty0 init=/linuxrc ignore_loglevel" \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```

设置ip
```
$ ifconfig eth0 192.168.1.20
```

挂载共享文件
```
$ mkdir /nfsroot
$ mount -t nfs -o nolock 192.168.1.156:/nfsroot /nfsroot
```

编译gdbserver
```
$ CC="mips-linux-gnu-gcc" CXX="mips-linux-gnu-g++" ./configure --target=mips-linux-gnu --host="mips-linux-gnu" --prefix="/root/toolchain/gdb/build"

$ nano Makefile
# LDFLAGS is specifically reserved for setting from the command line
# when running make.
LDFLAGS = -static
INTERNAL_LDFLAGS = $(LDFLAGS) -Wl,--dynamic-list=$(srcdir)/proc-service.list

$ make install
```

编译测试程序
```
$ mips-linux-gnu-gcc -g hello.c -o hello_mips -static
```

guest机启动调试
```
$ ./gdbserver_aarch32 0.0.0.0:2333 ./hello_mips
```

执行gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture mips
The target architecture is assumed to be mips
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x004 mips64

编译qemu
```
# http://download.qemu-project.org/qemu-2.8.0.tar.xz
$ tar -xf qemu-2.8.0.tar.xz
$ cd qemu-2.8.0
$ mkdir build
$ cd build
$ ../configure --target-list=mips64-softmmu,mips64-linux-user --audio-drv-list=alsa --enable-virtfs
$ make -j8
$ sudo make install
```

安装交叉编译链，编译出来的程序直接报错"Illegal instruction"，还是用buildroot安装吧
```
$ sudo apt-get install linux-libc-dev-mips64-cross
$ sudo apt-get install libc6-mips64-cross libc6-dev-mips64-cross
$ sudo apt-get install binutils-mips64-linux-gnuabi64 gcc-mips64-linux-gnuabi64
$ sudo apt-get install g++-mips64-linux-gnuabi64
```

下载vmlinux-3.2.0-4-5kc-malta、debian_wheezy_mips_standard.qcow2
[[传送门]](https://people.debian.org/~aurel32/qemu/mips/)

启动qemu
```
sudo qemu-system-mips64 \
    -M malta \
    -kernel vmlinux-3.2.0-4-5kc-malta \
    -hda debian_wheezy_mips_standard.qcow2 \
    -nographic \
    -append "root=/dev/sda1 rw console=tty0 init=/linuxrc ignore_loglevel" \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```

设置ip
```
$ ifconfig eth0 192.168.1.20
```

挂载共享文件
```
$ mkdir /nfsroot
$ mount -t nfs -o nolock 192.168.1.156:/nfsroot /nfsroot
```

编译gdbserver
```
$ CC="mips64-linux-gnuabi64-gcc" CXX="mips64-linux-gnuabi64-g++" ./configure --target=mips64-linux-gnuabi64 --host="mips64-linux-gnuabi64" --prefix="/root/toolchain/gdb/build"

$ nano Makefile
# LDFLAGS is specifically reserved for setting from the command line
# when running make.
LDFLAGS = -static
INTERNAL_LDFLAGS = $(LDFLAGS) -Wl,--dynamic-list=$(srcdir)/proc-service.list

$ make install
```

编译测试程序
```
$ mips64-linux-gnuabi64-gcc -g hello.c -o hello_mips64 -static
```

执行gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture mips
The target architecture is assumed to be mips
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x005 mipsel

安装交叉编译链
```
sudo apt-get install linux-libc-dev-mipsel-cross
sudo apt-get install libc6-mipsel-cross libc6-dev-mipsel-cross
sudo apt-get install binutils-mipsel-linux-gnu gcc-mipsel-linux-gnu
sudo apt-get install g++-mipsel-linux-gnu
```

下载vmlinux-3.2.0-4-4kc-malta、debian_wheezy_mipsel_standard.qcow2
[[传送门]](https://people.debian.org/~aurel32/qemu/mipsel/)

启动qemu
```
sudo qemu-system-mipsel \
    -M malta \
    -kernel vmlinux-3.2.0-4-4kc-malta \
    -hda debian_wheezy_mipsel_standard.qcow2 \
    -nographic \
    -append "root=/dev/sda1 rw console=tty0 init=/linuxrc ignore_loglevel" \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```

设置ip
```
$ ifconfig eth0 192.168.1.20
```

挂载共享文件
```
$ mkdir /nfsroot
$ mount -t nfs -o nolock 192.168.1.156:/nfsroot /nfsroot
```

编译gdbserver
```
$ CC="mipsel-linux-gnu-gcc" CXX="mipsel-linux-gnu-g++" ./configure --target=mipsel-linux-gnu --host="mipsel-linux-gnu" --prefix="/root/toolchain/gdb/build"

$ nano Makefile
# LDFLAGS is specifically reserved for setting from the command line
# when running make.
LDFLAGS = -static
INTERNAL_LDFLAGS = $(LDFLAGS) -Wl,--dynamic-list=$(srcdir)/proc-service.list

$ make install
```

编译测试程序
```
$ mipsel-linux-gnu-gcc -g hello.c -o hello_mipsel -static
```

guest机启动调试
```
$ ./gdbserver_aarch32 0.0.0.0:2333 ./hello_mipsel
```

执行gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture mips
The target architecture is assumed to be mips
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x007 mipsel64

编译qemu
```
# http://download.qemu-project.org/qemu-2.8.0.tar.xz
$ tar -xf qemu-2.8.0.tar.xz
$ cd qemu-2.8.0
$ mkdir build
$ cd build
$ ../configure --target-list=mips64el-softmmu,mips64el-linux-user --audio-drv-list=alsa --enable-virtfs
$ make -j8
$ sudo make install
```

安装交叉编译链，编译出来的程序直接报错"Illegal instruction"，还是用buildroot安装吧
```
$ sudo apt-get install linux-libc-dev-mips64el-cross
$ sudo apt-get install libc6-mips64el-cross libc6-dev-mips64-cross
$ sudo apt-get install binutils-mips64el-linux-gnuabi64 gcc-mips64el-linux-gnuabi64
$ sudo apt-get install g++-mips64el-linux-gnuabi64
```

下载vmlinux-3.2.0-4-5kc-malta、debian_wheezy_mipsel_standard.qcow2
[[传送门]](https://people.debian.org/~aurel32/qemu/mipsel/)

启动qemu
```
sudo qemu-system-mipsel \
    -M malta \
    -kernel vmlinux-3.2.0-4-4kc-malta \
    -hda debian_wheezy_mipsel_standard.qcow2 \
    -nographic \
    -append "root=/dev/sda1 rw console=tty0 init=/linuxrc ignore_loglevel" \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0 \
    -redir tcp:2333::2333
```

设置ip
```
$ ifconfig eth0 192.168.1.20
```

挂载共享文件
```
$ mkdir /nfsroot
$ mount -t nfs -o nolock 192.168.1.156:/nfsroot /nfsroot
```

执行gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture mips
The target architecture is assumed to be mips
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x007 raspberrypi

下载2017-11-29-raspbian-stretch-lite.img
[[传送门]](https://www.raspberrypi.org/downloads/raspbian/)

下载kernel-qemu-4.4.34-jessie
[[传送门]](https://github.com/dhruvvyas90/qemu-rpi-kernel)

执行
```
$ unzip <image-file>.zip
$ fdisk –l <image-file>
```

然后会看到以下内容
```
Disk 2017-08-16-raspbian-stretch-lite.img: 1.7 GiB, 1854418944 bytes, 3621912 sectors
 
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0xee397c53
 
Device                                 Boot Start          End Sectors   Size Id Type
2017-08-16-raspbian-stretch-lite.img1        8192    93813    85622 41.8M   c W95 FAT32 (LBA)
2017-08-16-raspbian-stretch-lite.img2       94208 3621911 3527704   1.7G 83 Linux
```

可以看到文件系统从94208扇区开始。我们将这个值乘以512 ，本例中为"94208 * 512=48234496"，这就是文件系统起始位置的偏移字节数
```
$ sudo mkdir /mnt/raspbian
$ sudo mount -v -o offset=48234496 -t ext4 [path-of-your-img-file.img] /mnt/raspbian
$ sudo nano /mnt/raspbian/etc/ld.so.preload
```
将上述文件中的所有内容用"#"注释掉，保存修改并退出

如果 fstab 文件中有出现 mmcblk0 字符串，那么将"/dev/mmcblk0p1"替换为"/dev/sda1"，将"/dev/mmcblk0p2"替换为"/dev/sda2"
，保存后退出。至此，系统配置的修改完成，可以将"/mnt/raspbian"卸载掉。
```    
$ sudo nano /mnt/raspbian/etc/fstab
$ sudo umount /mnt/raspbian
```

启动qemu
```
qemu-system-arm \
    -kernel kernel-qemu-4.4.34-jessie \
    -cpu arm1176 \
    -m 256 \
    -M versatilepb \
    -serial stdio \
    -append "root=/dev/sda2 rootfstype=ext4 rw console=ttyAMA0" \
    -drive format=raw,file=2017-11-29-raspbian-stretch-lite.img \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0
    -redir tcp:2333::2333
```

修改raspberry的/etc/network/interfaces文件
```
$ sudo nano /etc/network/interfaces

iface lo inet loopback

auto eth0
iface eth0 inet static
address 192.168.1.20
netmask 255.255.255.0
gateway 192.168.1.1
```

重启网卡
```
$ sudo /etc/init.d/networking restart
```

开启ssh服务
```
$ sudo service ssh start
$ sudo update-rc.d ssh enable
```

挂载共享文件
```
$ sudo mkdir /nfsroot
$ sudo mount -t nfs -o nolock 192.168.1.156:/nfsroot /nfsroot
```

通过ssh访问虚拟机
```
$ ssh pi@127.0.0.1 -p 5022
$ scp -P 5022 hello pi@127.0.0.1:/nfsroot
```

执行gdb-multiarch
```
$ gdb-multiarch
gef➤ set architecture arm
The target architecture is assumed to be mips
gef➤ gef-remote -q 192.168.1.20:2333
```


## 0x007 x86

安装开发包
```
$ apt install linux-libc-dev:i386
```

编译linux内核
```
$ make O=out_x86 i386_defconfig

$ sudo gedit .config

# CONFIG 9P
CONFIG_NET_9P=y
CONFIG_NET_9P_VIRTIO=y
CONFIG_NET_9P_DEBUG=y
CONFIG_9P_FS=y
CONFIG_9P_FS_POSIX_ACL=y
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y

# CONFIG PCI and virtio
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y
CONFIG_PCI_HOST_GENERIC=y

make O=out_x86 menuconfig
make O=out_x86 bzImage -j8
```

在kernel配置支持ramdisk的启动方式
```
$ chmod a+x make.sh
$ ./make.sh

General setup  --->
    ----> [*] Initial RAM filesystem and RAM disk (initramfs/initrd) support
Device Drivers  --->
    [*] Block devices  --->
        <*> RAM block device support
        (65536) Default RAM disk size (kbytes)
```

制作根文件系统
```
$ tar -xjvf busybox-1.24.2.tar.bz2
$ make menuconfig

Busybox Settings  --->
    Build Options  --->
        [*] Build BusyBox as a static binary (no shared libs)
        (-m32 -march=i386 -mtune=i386) Additional CFLAGS
        (-m32) Additional LDFLAGS

$ make -j4
$ make install
```

添加开机自启动挂载共享文件
```
$ sudo gedit /etc/init.d/rcS

mkdir /nfsroot
mount -t 9p -o trans=virtio,version=9p2000.L hostshare /nfsroot
```

制作ramdisk镜像
```
# mk_ramdisk.sh
#!/bin/bash
sudo rm -rf rootfs
sudo rm -rf tmpfs
sudo rm -rf ramdisk*
sudo mkdir rootfs
sudo cp ../busybox-1.24.2/_install/*  rootfs/ -raf
sudo mkdir -p rootfs/proc/
sudo mkdir -p rootfs/sys/
sudo mkdir -p rootfs/tmp/
sudo mkdir -p rootfs/root/
sudo mkdir -p rootfs/var/
sudo mkdir -p rootfs/mnt/
sudo cp etc rootfs/ -arf
sudo mkdir -p rootfs/lib
sudo cp -arf /lib/i386-linux-gnu/* rootfs/lib/
sudo rm rootfs/lib/*.a
sudo strip rootfs/lib/*
sudo mkdir -p rootfs/dev/
sudo mknod rootfs/dev/tty1 c 4 1
sudo mknod rootfs/dev/tty2 c 4 2
sudo mknod rootfs/dev/tty3 c 4 3
sudo mknod rootfs/dev/tty4 c 4 4
sudo mknod rootfs/dev/console c 5 1
sudo mknod rootfs/dev/null c 1 3
sudo dd if=/dev/zero of=ramdisk bs=1M count=32
sudo mkfs.ext4 -F ramdisk
sudo mkdir -p tmpfs
sudo mount -t ext4 ramdisk ./tmpfs/  -o loop
sudo cp -raf rootfs/*  tmpfs/
sudo umount tmpfs
sudo gzip --best -c ramdisk > ramdisk.gz

$ chmod a+x ./mk_ramdisk.sh
$ ./mk_ramdisk.sh
```

启动qemu
```
# run.sh
sudo qemu-system-i386 \
    -smp 2 \
    -m 1024M \
    -kernel ./bzImage \
    -nographic \
    -append "root=/dev/ram0 rw rootfstype=ext4 console=ttyS0 init=/linuxrc" \
    -initrd ./rootfs/ramdisk.gz \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0
```

编译gdb
```
$ CC="gcc" CXX="g++" ./configure --target=i386 --host="i386" --prefix="/toolchain/gdb/build"
$ nano Makefile 
# LDFLAGS is specifically reserved for setting from the command line
# when running make.
LDFLAGS = -static
INTERNAL_LDFLAGS = $(LDFLAGS) -Wl,--dynamic-list=$(srcdir)/proc-service.list

$ make install
```


## 0x008 x86_x64

编译linux内核
```
$ make O=out_x86_64 x86_64_defconfig

$ sudo gedit .config

# CONFIG 9P
CONFIG_NET_9P=y
CONFIG_NET_9P_VIRTIO=y
CONFIG_NET_9P_DEBUG=y
CONFIG_9P_FS=y
CONFIG_9P_FS_POSIX_ACL=y
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y

# CONFIG PCI and virtio
CONFIG_PCI=y
CONFIG_VIRTIO_PCI=y
CONFIG_PCI_HOST_GENERIC=y

$ make O=out_x86_64 menuconfig
$ make O=out_x86_64 bzImage -j8
```

在kernel配置支持ramdisk的启动方式
```
$ chmod a+x make.sh
$ ./make.sh

General setup  --->
    ----> [*] Initial RAM filesystem and RAM disk (initramfs/initrd) support
Device Drivers  --->
    [*] Block devices  --->
        <*> RAM block device support
        (65536) Default RAM disk size (kbytes)
```

制作根文件系统
```
$ tar -xjvf busybox-1.24.2.tar.bz2
$ make menuconfig

Busybox Settings  --->
    Build Options  --->
        [*] Build BusyBox as a static binary (no shared libs)

$ make -j4
$ make install
```

添加开机自启动挂载共享文件
```
$ sudo gedit /etc/init.d/rcS

mkdir /nfsroot
mount -t 9p -o trans=virtio,version=9p2000.L hostshare /nfsroot
```

制作ramdisk镜像
```
# mk_ramdisk.sh
#!/bin/bash
sudo rm -rf rootfs
sudo rm -rf tmpfs
sudo rm -rf ramdisk*
sudo mkdir rootfs
sudo cp ../busybox-1.24.2/_install/*  rootfs/ -raf
sudo mkdir -p rootfs/proc/
sudo mkdir -p rootfs/sys/
sudo mkdir -p rootfs/tmp/
sudo mkdir -p rootfs/root/
sudo mkdir -p rootfs/var/
sudo mkdir -p rootfs/mnt/
sudo cp etc rootfs/ -arf
sudo mkdir -p rootfs/lib64
sudo cp -arf /lib/x86_64-linux-gnu/* rootfs/lib64/
sudo rm rootfs/lib/*.a
sudo strip rootfs/lib/*
sudo mkdir -p rootfs/dev/
sudo mknod rootfs/dev/tty1 c 4 1
sudo mknod rootfs/dev/tty2 c 4 2
sudo mknod rootfs/dev/tty3 c 4 3
sudo mknod rootfs/dev/tty4 c 4 4
sudo mknod rootfs/dev/console c 5 1
sudo mknod rootfs/dev/null c 1 3
sudo dd if=/dev/zero of=ramdisk bs=1M count=32
sudo mkfs.ext4 -F ramdisk
sudo mkdir -p tmpfs
sudo mount -t ext4 ramdisk ./tmpfs/  -o loop
sudo cp -raf rootfs/*  tmpfs/
sudo umount tmpfs
sudo gzip --best -c ramdisk > ramdisk.gz

$ chmod a+x ./mk_ramdisk.sh
$ ./mk_ramdisk.sh
```

启动qemu
```
# run.sh
sudo qemu-system-i386 \
    -smp 2 \
    -m 1024M \
    -kernel ./bzImage \
    -nographic \
    -append "root=/dev/ram0 rw rootfstype=ext4 console=ttyS0 init=/linuxrc" \
    -initrd ./rootfs/ramdisk.gz \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0
```

## 0x007 x86-k2.6

错误1
```
gcc: error: elf_i386: No such file or directory
make[2]: *** [arch/x86/vdso/vdso32-int80.so.dbg] Error 1
```

解决
```
VDSO_LDFLAGS_vdso.lds = -m elf_x86_64 -Wl,-soname=linux-vdso.so.1 \
                -Wl,-z,max-page-size=4096 -Wl,-z,common-page-size=4096  # “-m elf_x86_64”替换为“-m64”

VDSO_LDFLAGS_vdso32.lds = -m elf_i386 -Wl,-soname=linux-gate.so.1       # “-m elf_i386”替换为“-m32”
```

错误2
```
drivers/net/igbvf/igbvf.h:128:15: error: duplicate member ‘page’
make[3]: *** [drivers/net/igbvf/ethtool.o] Error 1
make[2]: *** [drivers/net/igbvf] Error 2
make[1]: *** [drivers/net] Error 2
make: *** [drivers] Error 2
```

解决
```
struct {
            struct page *page;  # “*page”替换为“*_page”
            u64 page_dma;
            unsigned int page_offset;
        };
```

增加syscall，在syscall table中添加信息
```
# arch/x86/kernel/syscall_table_32.S
.long sys_muhe_test
.long sys_hello
```

定义syscall的宏
```
# arch/x86/include/asm/unistd_32.h
#define __NR_muhe_test      337
#define __NR_hello      338

#ifdef __KERNEL__

#define NR_syscalls 339
```

添加函数定义
```
# include/linux/syscalls.h
asmlinkage long sys_muhe_test(int arg0);
asmlinkage long sys_hello(void);
```

编写syscall代码，新建目录放自定义syscall的代码
```
$ mkdir muhe_test
$ cd muhe_test
$ nano muhe_test.c

#include <linux/kernel.h>
asmlinkage long sys_muhe_test(int arg0){
    printk("I am syscall");
    printk("syscall arg %d",arg0);
    return ((long)arg0);
}
asmlinkage long sys_hello(void){
    printk("hello my kernel worldn");
    return 0;
}

$ nano Makefile
obj-y := muhe_test.o
```

修改Makefile
```
core-y        += kernel/ mm/ fs/ ipc/ security/ crypto/ block/ muhe_test/
```

编译
```
make -j2
```