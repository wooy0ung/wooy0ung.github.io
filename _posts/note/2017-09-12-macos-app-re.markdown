---
layout:     post
title:      macOS 逆向挖坑～
author:     wooy0ung
tags: 		macos
category:  	note
---


>说明:  
>前几天刷帖时突然发现《macOS软件安全与逆向分析》出版, 立马入手了一本。  
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

未完...