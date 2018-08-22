---
layout:     post
title:      ciscn的一道misc与macOS内核调试
author:     wooy0ung
tags: 		misc
category:	writeup
---

- 目录
{:toc #markdown-toc}

>Problem Description:  
>请在 macOS High Sierra, macOS Sierra 或 EL Capitan 平台禁用系统签名校验后加载附件中的 Kext 驱动程序，
>macOS 系统会 Panic。请试着分析 Panic 信息，找出隐藏在内存中的密钥。  
>题目来自ciscn 2018 memory_forensics  
<!-- more -->


题目下载下来，解压得到kext驱动包，找到agent执行文件
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x001.png)
kauth_callback_start是驱动入口，装载macOS驱动时会先执行这个函数

看到疑似是flag，直接提交不对
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x002.png)

根据提示，应该是要core dump，先配置一下环境
主机、虚拟机：macOS Sierra 10.12.6
虚拟机安装Kernel_Debug_Kit_10.12.6_build_16G29，关掉SIP，主机安装lldb

```
# command+R进入rescovery mode 
$ csrutil status
$ csrutil disable
```


直接装载驱动，会出现mac下的“BSOD”五国提示，重启后会在/Library/Logs/DiagnosticReports找到panic log
```
# agent.kext拷贝到/System/Library/Extensions
$ sudo chown -R root:wheel /System/Library/Extensions/agent.kext
$ sudo chmod -R 755 /System/Library/Extensions/agent.kext
$ kextutil -i /System/Library/Extensions/agent.kext
```
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x003.png)
这文件记录了崩溃点以及栈回溯信息

然后设置引导参数，将KDK的debug支持组件拷贝到/System目录，注意macOS core dump不能存本机，需要指定一个服务机，再次装载驱动
```
# 支持组件
$ sudo cp -rf /Library/Developer/KDKs/KDK_10.12.6_16G29.kdk/System/Library /System/
$ sudo kextcache -invalidate /

# 主机
$ sudo mkdir /PanicDumps
$ sudo chown root:wheel /PanicDumps
$ sudo chmod 1777 /PanicDumps
$ sudo launchctl load -w /System/Library/LaunchDaemons/com.apple.kdumpd.plist
$ sudo launchctl list | grep kdump

# 虚拟机
$ sudo nvram boot-args="debug=0xd44 _panicd_ip=192.168.1.127"
```
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x004.png)
kernel crash以后将core dump传到服务机上

![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x005.png)
等待调试器接入

lldb attach上去，注意这里崩溃点在Kauth_callback_stop，驱动卸载时会调用这个函数
```
$ lldb
(lldb) target create /Library/Developer/KDKs/KDK_10.12.6_16G29.kdk/System/Library/Kernels/kernel.development
(lldb) kdp-remote 192.168.1.127
```
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x006.png)

猜测flag已经生成好，并且还存在内存中，在本机找到从虚拟机传来的core dump文件
```
$ gunzip xnu-xxx.gz
```
![](/assets/img/writeup/2018-05-01-ciscn-2018-memory-forensics/0x007.png)

补充：顺便记录下用户态crash的核心转储

```
$ ulimit -c unlimited
$ sudo mkdir /cores
$ sudo chown root:admin /cores	(或者 sudo chmod o+w /cores)
$ sudo chmod 1775 /cores

# 测试
$ /Applications/TextEdit.app/Contents/MacOS/TextEdit
$ killall -ABRT TextEdit
```
然后在/cores目录下就会看到转储文件