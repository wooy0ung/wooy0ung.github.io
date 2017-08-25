---
layout:     post
title:      macOS下 JEB2 动态调试apk
author:     wooy0ung
tags: 		diary
category:  	post
---


### 0x00 问题

JEB2 打开apk反编译, 直接选择 start debug 提示缺少 adb

![](/assets/img/post/2017-08-20-macos-jeb2-debug/0x00.png)
<!-- more -->


### 0x01 解决

安装adb

```
$ brew cask install android-platform-tools
```

.bash_profile 文件添加 sdk 环境变量(按自己的路径)

```
# adb
export PATH=${PATH}:~/toolchain/operation_system/Android/Development/sdk/mac-android-sdk/tools
export PATH=${PATH}:~/toolchain/operation_system/Android/Development/sdk/mac-android-sdk/platform-tools
```

在terminal打开(不是.app)

```
$ ./jeb_macos.sh
```

![](/assets/img/post/2017-08-20-macos-jeb2-debug/0x01.png)
![](/assets/img/post/2017-08-20-macos-jeb2-debug/0x02.png)