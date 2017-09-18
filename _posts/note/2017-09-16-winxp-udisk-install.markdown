---
layout:     post
title:      制作 Windows XP U盘启动盘
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>前段时间由于需要用到 WinXP, 常规地用 UltraISO 烧录到 U盘。  
>但一开始加载镜像就报错。。。
![](/assets/img/note/2017-09-16-winxp-udisk-install/0x00.png)
>解决方法是改用
>大致翻了一下, 居然是以最新的 macOS Sierra 系统讲的, 继续开坑～  
![](/assets/img/note/2017-09-12-macos-app-re/0x00.jpg)
<!-- more -->


### 0x00 环境搭建

安装 HT Editor

```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/ht-2.1.0
$ bzip2 -d ./ht-2.1.0.tar.bz
$ tar xvf ./ht-2.1.0.tar
$ cd ht-2.1.0
$ sudo ln -s /opt/X11/include/X11 /Applications/Xcode_8.3.3.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/include
$ ./configure
$ make
```

增强 homebrew

```
$ brew tap phinze/cask
$ brew install brew-cask
```

安装 Dash, 下载 Apple API Reference

![](/assets/img/note/2017-09-12-macos-app-re/0x01.jpg)

关闭 Rootless, 进入恢复模式

```
$ csrutil disable
# 重启后确认是否已关闭
$ csrutil status
```


### 0x01 常用命令

keychain

```
$ security list-keychain
$ security dump-keychain
$ security find-internet-password -a wooy0ung -s github.com -g
$ security find-identity -v -p codesigning							# 列出所有用户证书
```

codesign

```
$ codesign -s 'wooy0ung@outlook.com (2T565KE9L3)' xxx.app			# 对应用手动签名
$ codesign -s '-' xxx.app											# 使用 adhoc 签名
$ codesign -f -s 'wooy0ung@outlook.com (2T565KE9L3)' xxx.app		# 对签名过的应用重新签名
$ codesign -d -vv /usr/bin/python									# 查看二进制程序的签名
$ codesign -d -vv /Applications/App\ Store.app						# 查看软件包的签名
$ codesign -d -vvv /Applications/iBooks.app							# 查看程序的 cdhash 值
```

Mach-O

```
$ otool -hv ./getbaseaddr		# 查看程序 Mach-O 头信息
```

gatekeeper

```
$ sudo spctl --master-disable									# 关闭 gatekeeper
$ sudo spctl --status											# 查看 gatekeeper 的状态
$ sudo spctl --add --label "MyTest" ~/Download/MyTest.app		# 往系统规则中添加一条规则
$ sudo spctl --remove --label "MyTest"							# 删除一条规则
```


### 0x02 常用操作

通过编译选项关闭程序 ASLR

```
# 在 Build Settings 的 Linking 一栏, 将 Generate Position-Dependent Executable 的值设置为 Yes
```


### 0x03 XNU源码

系统调用

```
/bsd/sys/sysctl.h				# 系统调用声明
/libsyscall						# 系统调用实现
/libsyscall/custom/SYS.h		# 系统调用的宏定义
```

rootless

```
/bsd/sys/csr.h
/bsd/kern/kern_csr.c			# 10.11.4 后移除了 csr_set_allow_all()
```


### 0x04 记录

```
按照样列 getbaseaddr 编译带 ASLR 的 Mach-O 文件, 经 aslr_disable 处理。
在 Finder 单击选中后会触发 Finder 崩溃。
```

```
# 在除了 App Store 以外下载的 App 会带上 "@" 标志, 便于 Gatekeeper 进行验证
$ ls -al
```

```
# 分析 rootless 关闭原理
/usr/bin/csrutil
```

```
# 恶意代码检测基于的规则文件
/var/db/SystemPolicy
```

```
# 分析 gatekeeper 关闭原理
/usr/sbin/spctl
/var/db/SystemPolicy-prefs.plist enable 的值 yes(开启)/no(关闭)

# 验证
# 关闭 syspolicyd 进程
```

未完...