---
layout:		post
title:		环境搭建之Android篇
author:		wooy0ung
tags:		android
category:  	note
---


>[索引目录]  
>0x001 动态调试apk——android studio  
>0x002 动态调试apk——jeb2  
>0x003 windows安装android studio以及配置sdk  
<!-- more -->


## 0x001 动态调试apk——android studio

下载 Android Studio for Mac
```
http://www.android-studio.org/
```

在 /Applications/Android Studio.app/Contents/bin/idea.properties 文件末尾添加
```
disable.android.first.run=true
```
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-001.png)

安装sdk、ndk, Configure->Project Defaults->Project Structure
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-002.png)

新建一个工程, 打开Android Device Monitor与AVD Manager
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-003.png)

在AVD Manager界面新建一个Virtual Device, 运行
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-004.png)

在Android Device Monitor界面选择Monitor->偏好设置, 按下图设置
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-005.png)

将目标apk反编译, 在AndroidManifest.xml添加
```
<application ... android:debuggable="true">
```

重新打包、签名, 将smali文件夹和打包后的apk单独copy出来
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-006.png)

smali文件夹导入到Android Studio, 选择Run->Edit Configurations, 按下图设置
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-007.png)

apk拖到Virtual Device里安装, 打开, 此时Monitor会出现目标apk的信息
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-008.png)

输入以下命令, 让app进入等待调试模式
```
$ adb shell
generic_x86_64:/ $ am start -D -n com.didictf.hellolibs/.MainActivity	# 包名
```
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-009.png)

执行成功会有以下现象
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-010.png)
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-011.png)

现在可以开始debug, 回到Android Studio, 先下个断点, 点击debug图标
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-012.png)

断点断下, Virtual Device也被阻塞
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-013.png)
![](/assets/img/note/2018-02-21-ubuntu-environment/0x001-014.png)


## 0x002 动态调试apk——jeb2

jeb2打开apk反编译, 直接选择 start debug 提示缺少 adb  
![](/assets/img/note/2018-02-21-ubuntu-environment/0x002-001.png)

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

![](/assets/img/note/2018-02-21-ubuntu-environment/0x002-002.png)
![](/assets/img/note/2018-02-21-ubuntu-environment/0x002-003.png)


## 0x003 windows安装android studio以及配置sdk

现象：首次启动android studio提示无法下载sdk

解决：设置http proxy
```
网址：mirrors.neusoft.edu.cn
端口：80
```