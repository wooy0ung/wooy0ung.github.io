---
layout:     post
title:      在macOS下用Voltron增强lldb
author:     wooy0ung
tags: 		macos
category:  	xnu
---


>说明:  
>调试iOS没有类似OD那么友好的UI, 当前在用的IDA也不支持动调iOS...  
>好在Voltron提供的脚本很大程度的简化了lldb的调试操作。  
<!-- more -->


### 0x00 安装Voltron

```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/voltron
$ cd voltron
$ ./install.sh
$ brew install voltron	# 这里有个bug，voltron的executable会自动链接到/usr/local/bin要通过brew安装
```


### 0x01 启动lldb调试

开启lldb本地调试，下断，运行

```
$ lldb ./test
$ b 1
$ r
```

![](/assets/img/xnu/2017-06-21-macos-voltron-lldb/0x00.png)


### 0x02 开启Voltron观测窗口

```
$ voltron view disasm
$ voltron view breakpoints
$ voltron view backtrace
$ voltron view stack
$ voltron view register
```

![](/assets/img/xnu/2017-06-21-macos-voltron-lldb/0x01.png)