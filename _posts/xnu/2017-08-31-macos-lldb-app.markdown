---
layout:     post
title:      macOS下利用lldb调试App
author:     wooy0ung
tags: 		macos
category:  	xnu
---


>描述:  
>利用 lldb 调试 iOS App, 在 wifi 下延迟较大, 调试器长时间未有响应。  
>用 usb 线将 iOS 与 Mac 相连, 通过 usbmux 进行端口转发, 调试效果更好。  
>工具:  
>1.lldb  
>2.usbmux  
>3.voltron  
<!-- more -->


### 0x00 端口转发

将本地2222端口转发到iOS的22端口

```
$ /Users/wooy0ung/toolchain/operation_system/OSX/Debuggers/usbmux/tcprelay.py -t 22:2222
Forwarding local port 2222 to remote port 22
Incoming connection to 2222
Waiting for devices...
```

ssh过去, 用debugserver attach 待调试应用

```
$ ssh root@localhost -p 2222
$ root@localhost's password:
root# debugserver *:7000 -a "level1"
root# debugserver-310.2 for arm64.
Attaching to process level1...
```

本地7000端口转发到iOS的7000端口

```
$ /Users/wooy0ung/toolchain/operation_system/OSX/Debuggers/usbmux/tcprelay.py -t 7000:7000
Forwarding local port 7000 to remote port 7000
Incoming connection to 7000
Waiting for devices...
```


### 0x01 lldb

lldb attach 上去

```
$ lldb
(lldb) process connect connect://localhost:7000
```

attach 成功后, 效果如下

![](/assets/img/xnu/2017-08-31-macos-lldb-app/0x00.png)