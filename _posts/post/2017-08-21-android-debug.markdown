---
layout:     post
title:      macOS下 Android Studio 动态调试apk
author:     wooy0ung
tags: 		diary
category:  	post
---


### 0x00 配置 Android Studio

下载 Android Studio for Mac

```
http://www.android-studio.org/
```

在 /Applications/Android Studio.app/Contents/bin/idea.properties文件末尾添加

```
disable.android.first.run=true
```

![](/assets/img/post/2017-08-21-android-studio-debug/0x00.png)
<!-- more -->

安装 sdk、ndk, Configure->Project Defaults->Project Structure

![](/assets/img/post/2017-08-21-android-studio-debug/0x01.png)


### 0x01 配置 AVDM、DDMS

新建一个工程, 打开 Android Device Monitor 与 AVD Manager

![](/assets/img/post/2017-08-21-android-studio-debug/0x02.png)

在 AVD Manager 界面新建一个 Virtual Device, 运行

![](/assets/img/post/2017-08-21-android-studio-debug/0x03.png)

在 Android Device Monitor 界面选择 Monitor->偏好设置, 按下图设置

![](/assets/img/post/2017-08-21-android-studio-debug/0x04.png)


### 0x02 反编译apk

将目标apk反编译, 在 AndroidManifest.xml 添加

```
<application ... android:debuggable="true">
```

重新打包、签名, 将 smali 文件夹和打包后的apk单独copy出来

![](/assets/img/post/2017-08-21-android-studio-debug/0x05.png)

smali文件夹导入到 Android Studio, 选择 Run->Edit Configurations, 按下图设置

![](/assets/img/post/2017-08-21-android-studio-debug/0x06.png)

apk拖到 Virtual Device 里安装, 打开, 此时 Monitor 会出现目标apk的信息

![](/assets/img/post/2017-08-21-android-studio-debug/0x07.png)


### 0x03 debug

输入以下命令, 让app进入等待调试模式

```
$ adb shell
generic_x86_64:/ $ am start -D -n com.didictf.hellolibs/.MainActivity	# 包名
```

![](/assets/img/post/2017-08-21-android-studio-debug/0x08.png)

执行成功会有以下现象

![](/assets/img/post/2017-08-21-android-studio-debug/0x09.png)
![](/assets/img/post/2017-08-21-android-studio-debug/0x0a.png)

现在可以开始debug了, 回到 Android Studio, 先下个断点, 点击 debug 图标

![](/assets/img/post/2017-08-21-android-studio-debug/0x0b.png)

断点断下, Virtual Device 也被阻塞

![](/assets/img/post/2017-08-21-android-studio-debug/0x0c.png)
![](/assets/img/post/2017-08-21-android-studio-debug/0x0d.png)