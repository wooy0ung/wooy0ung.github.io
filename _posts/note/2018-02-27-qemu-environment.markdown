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
>0x004 arm  
<!-- more -->


## 0x001 aarch64

安装依赖
```
$ sudo apt-get install libcap-dev
$ sudo apt-get install libpixman-1-dev
$ apt-get install libncurses5-dev
$ sudo apt-get install libasound2-dev libasound2
$ sudo apt-get install libglib2.0-dev
```

安装qemu
```
# http://download.qemu-project.org/qemu-2.8.0.tar.xz
$ tar -xf qemu-2.8.0.tar.xz
$ cd qemu-2.8.0
$ mkdir build
$ cd build
$ ../configure --target-list=arm-softmmu,i386-softmmu,x86_64-softmmu,aarch64-linux-user,arm-linux-user,i386-linux-user,x86_64-linux-user,aarch64-softmmu --audio-drv-list=alsa --enable-virtfs
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

# make.sh
#!/bin/bash
cross_compile=/root/toolchain/qemu/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-
make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 defconfig
make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 menuconfig
make CROSS_COMPILE=$cross_compile ARCH=arm64 O=./out_aarch64 Image -j4

General setup  --->
    [*] Initial RAM filesystem and RAM disk (initramfs/initrd) support

Device Drivers  --->
    [*] Block devices  --->
        <*>   RAM block device support
        (65536) Default RAM disk size (kbytes)
```
![](/assets/img/note/2018-02-27-qemu-environment/0x001-001.png)
![](/assets/img/note/2018-02-27-qemu-environment/0x001-002.png)


制作根文件系统
```
# https://busybox.net/downloads/busybox-1.24.2.tar.bz2
$ tar -xjvf busybox-1.24.2.tar.bz2

$ make menuconfig

Build Options  --->
    [*] Build BusyBox as a static binary (no shared libs)
    (/root/toolchain/qemu/gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-)Cross Compiler prefix

$ make && make install
```
![](/assets/img/note/2018-02-27-qemu-environment/0x001-003.png)

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
sudo cp -arf ../gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/aarch64-linux-gnu/libc/lib/aarch64-linux-gnu/* rootfs/lib/
sudo rm rootfs/lib/*.a
sudo ../gcc-linaro-aarch64-linux-gnu-4.9-2014.07_linux/bin/aarch64-linux-gnu-strip rootfs/lib/*
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

sudo ifconfig br0 192.168.1.18
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
```

添加可执行权限
```
$ chmod +x /etc/qemu-ifup
$ chmod +x /etc/qemu-ifdown
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
    -initrd ./rootfs/ramdisk.img \
    -fsdev local,security_model=passthrough,id=fsdev0,path=/nfsroot \
    -device virtio-9p-pci,id=fs0,fsdev=fsdev0,mount_tag=hostshare \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0
```
![](/assets/img/note/2018-02-27-qemu-environment/0x001-004.png)

挂载共享文件
```
$ mkdir /nfsroot
$ mount -t 9p -o trans=virtio,version=9p2000.L hostshare /nfsroot
```

设置虚拟机网络
![](/assets/img/note/2018-02-27-qemu-environment/0x001-005.png)

能双向ping通
![](/assets/img/note/2018-02-27-qemu-environment/0x001-006.png)
![](/assets/img/note/2018-02-27-qemu-environment/0x001-007.png)


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
# https://cdn.kernel.org/pub/linux/kernel/v4.x/linux-4.10.tar.xz
$ tar -xf linux-4.10.tar.xz

# make.sh
#!/bin/bash
cross_compile=/root/toolchain/qemu/aarch32/arm-2014.05/bin/arm-none-linux-gnueabi-
make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 vexpress_defconfig
make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 menuconfig
make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 zImage -j4
make CROSS_COMPILE=$cross_compile ARCH=arm O=./out_aarch32 dtbs -j4

Kernel Features  --->
    Memory split (3G/1G user/kernel split)  --->
    [*] High Memory Support
Device Drivers  --->
    [*] Block devices  --->
        <*>   RAM block device support
        (8192)  Default RAM disk size (kbytes)
```
![](/assets/img/note/2018-02-27-qemu-environment/0x002-001.png)
![](/assets/img/note/2018-02-27-qemu-environment/0x002-002.png)


制作根文件系统
```
# https://busybox.net/downloads/busybox-1.24.2.tar.bz2
$ tar -xjvf busybox-1.24.2.tar.bz2
$ make menuconfig

Build Options  ---> 
    [*] Build BusyBox as a static binary (no shared libs)
    (/root/toolchain/qemu/aarch32/arm-2014.05/bin/arm-none-linux-gnueabi-) Cross Compiler prefix

$ make && make install
```
![](/assets/img/note/2018-02-27-qemu-environment/0x002-003.png)

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
sudo cp -arf ../arm-2014.05/arm-none-linux-gnueabi/libc/lib rootfs/
sudo rm -rf rootfs/lib/*.a
sudo ../arm-2014.05/bin/arm-none-linux-gnueabi-strip rootfs/lib/*
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

配置网络 & 启动
```
# run.sh
sudo qemu-system-arm \
    -M vexpress-a9 \
    -m 1024M \
    -smp 2 \
    -kernel ./zImage \
    -nographic \
    -append "root=/dev/ram0 rw rootfstype=ext4 console=ttyAMA0 init=/linuxrc ignore_loglevel" \
    -initrd ./rootfs/ramdisk.img \
    -dtb ./vexpress-v2p-ca9.dtb \
    -net nic,vlan=0 -net tap,vlan=0,ifname=tap0
```
![](/assets/img/note/2018-02-27-qemu-environment/0x002-004.png)

nfs挂载
```
$ mount -t nfs -o nolock 192.168.1.128:/nfsroot /mnt
```


## 0x003 mips

安装qemu
```
# http://download.qemu-project.org/qemu-2.8.0.tar.xz
$ tar -xf qemu-2.8.0.tar.xz

$ cd qemu-2.8.0
$ mkdir build
$ cd build
$ ../configure --target-list=mips-softmmu,mips-linux-user --audio-drv-list=alsa --enable-virtfs
$ make -j8
$ sudo make install
```

下载debian mips镜像
```
# https://people.debian.org/~aurel32/qemu/mips/
# debian_squeeze_mips_standard.qcow2
# vmlinux-2.6.32-5-4kc-malta
```

配置网络 & 启动
```
# run.sh
sudo qemu-system-mips \
    -M malta \
    -kernel vmlinux-2.6.32-5-4kc-malta \
    -hda debian_squeeze_mips_standard.qcow2 \
    -m 1024M \
    -append "root=/dev/sda1 console=ttyAMA0" \
    -nographic \
    -net nic,vlan=0,macaddr=00:16:3e:00:00:01 \
    -net tap,vlan=0,ifname=tap0
```
![](/assets/img/note/2018-02-27-qemu-environment/0x003-001.png)


## 0x004 arm

下载启动镜像
```
# https://www.raspberrypi.org/downloads/raspbian/
# 2017-11-29-raspbian-stretch-lite.img

# https://github.com/dhruvvyas90/qemu-rpi-kernel
# kernel-qemu-4.4.34-jessie
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
```
![](/assets/img/note/2018-02-27-qemu-environment/0x004-001.png)

修改raspberry的/etc/network/interfaces文件
```
$ sudo nano /etc/network/interfaces

iface lo inet loopback

auto eth0
iface eth0 inet static
address 192.168.1.24
netmask 255.255.255.0
gateway 192.168.1.2
```

重启