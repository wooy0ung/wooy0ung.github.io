---
layout:     post
title:      动态调试apk —— JEB2
author:     wooy0ung
tags: 		android
category:  	note
---


>JEB2 打开apk反编译, 直接选择 start debug 提示缺少 adb  

![](/assets/img/note/2017-08-20-macos-jeb2-debug/0x00.png)
<!-- more -->


### 0x00 解决

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

![](/assets/img/note/2017-08-20-macos-jeb2-debug/0x01.png)
![](/assets/img/note/2017-08-20-macos-jeb2-debug/0x02.png)