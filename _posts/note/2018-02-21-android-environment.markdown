---
layout:		post
title:		环境搭建之android篇
author:		wooy0ung
tags:		android
category:  	note
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 android studio动态调试apk  
>0x002 jeb2动态调试apk  
>0x003 windows安装android studio以及配置sdk  
>0x004 0x004 安装和破解IntelliJ IDEA  
>0x005 解决"Failure [INSTALL_PARSE_FAILED_NO_CERTIFICATES]"  
<!-- more -->


## 0x001 android studio动态调试apk

下载 Android Studio for Mac
```
http://www.android-studio.org/
```

在 /Applications/Android Studio.app/Contents/bin/idea.properties 文件末尾添加
```
disable.android.first.run=true
```
![](/assets/img/note/2018-02-21-android-environment/0x001-001.png)

安装sdk、ndk, Configure->Project Defaults->Project Structure
![](/assets/img/note/2018-02-21-android-environment/0x001-002.png)

新建一个工程, 打开Android Device Monitor与AVD Manager
![](/assets/img/note/2018-02-21-android-environment/0x001-003.png)

在AVD Manager界面新建一个Virtual Device, 运行
![](/assets/img/note/2018-02-21-android-environment/0x001-004.png)

在Android Device Monitor界面选择Monitor->偏好设置, 按下图设置
![](/assets/img/note/2018-02-21-android-environment/0x001-005.png)

将目标apk反编译, 在AndroidManifest.xml添加
```
<application ... android:debuggable="true">
```

重新打包、签名, 将smali文件夹和打包后的apk单独copy出来
![](/assets/img/note/2018-02-21-android-environment/0x001-006.png)

smali文件夹导入到Android Studio, 选择Run->Edit Configurations, 按下图设置
![](/assets/img/note/2018-02-21-android-environment/0x001-007.png)

apk拖到Virtual Device里安装, 打开, 此时Monitor会出现目标apk的信息
![](/assets/img/note/2018-02-21-android-environment/0x001-008.png)

输入以下命令, 让app进入等待调试模式
```
$ adb shell
generic_x86_64:/ $ am start -D -n com.didictf.hellolibs/.MainActivity	# 包名
```
![](/assets/img/note/2018-02-21-android-environment/0x001-009.png)

执行成功会有以下现象
![](/assets/img/note/2018-02-21-android-environment/0x001-010.png)
![](/assets/img/note/2018-02-21-android-environment/0x001-011.png)

现在可以开始debug, 回到Android Studio, 先下个断点, 点击debug图标
![](/assets/img/note/2018-02-21-android-environment/0x001-012.png)

断点断下, Virtual Device也被阻塞
![](/assets/img/note/2018-02-21-android-environment/0x001-013.png)
![](/assets/img/note/2018-02-21-android-environment/0x001-014.png)


## 0x002 jeb2动态调试apk

jeb2打开apk反编译, 直接选择 start debug 提示缺少 adb  
![](/assets/img/note/2018-02-21-android-environment/0x002-001.png)

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

windows下载adb包，添加环境变量

然后
```
adb devices
adb connect 127.0.0.1:7555		# MuMu模拟器(4.4.4)
adb connect 127.0.0.1:21503		# 逍遥安卓模拟器(5.1)
adb connect 127.0.0.1:5554		# 雷电模拟器(5.1)
```

在terminal打开(不是.app)
```
$ ./jeb_macos.sh
```

windwos打开jeb_win.bat

然后命令行
```
> adb install test2.apk
```

Ctrl+B下断点，jeb附加上去，这样提示
![](/assets/img/note/2018-02-21-android-environment/0x002-002.png)

改用android 5.1以上版本的机器，再附加上去，提示
![](/assets/img/note/2018-02-21-android-environment/0x002-003.png)

将目标apk反编译, 在AndroidManifest.xml添加
```
<application ... android:debuggable="true">
```

再次附加，断点断下
![](/assets/img/note/2018-02-21-android-environment/0x002-004.png)

查看寄存器，得到flag信息
![](/assets/img/note/2018-02-21-android-environment/0x002-005.png)


## 0x003 windows安装android studio以及配置sdk

问题：首次启动android studio提示无法下载sdk

解决：设置http proxy
```
网址：mirrors.neusoft.edu.cn
端口：80
```

或者跳过sdk检查，编辑/bin/idea.properties，添加
```
disable.android.first.run=true
```

问题: Intel x86 Emulator Accelerator(HAXM installer)不兼容

解决: 下载haxm-windows_v7_0_0.zip，解压安装intelhaxm-android.exe
```
https://software.intel.com/en-us/articles/intel-hardware-accelerated-execution-manager-intel-haxm
```


## 0x004 安装和破解IntelliJ IDEA

安装ideaIU-2017.2.7，下载JetbrainsCrack-2.6.9-release-enc.jar

编辑/bin/idea64.exe.vmoptions，添加
```
-javaagent:D:\toolchain\system\android\JetBrains\IntelliJ IDEA 2017.2.7\JetbrainsCrack-2.6.9-release-enc.jar
```

编辑/bin/idea.exe.vmoptions，添加
```
-javaagent:D:\toolchain\system\android\JetBrains\IntelliJ IDEA 2017.2.7\JetbrainsCrack-2.6.9-release-enc.jar
```

Active code填入
```
-javaagent:D:\toolchain\system\android\JetBrains\IntelliJ IDEA 2017.2.7\JetbrainsCrack-2.6.9-release-enc.jar
```


## 0x005 解决"Failure [INSTALL_PARSE_FAILED_NO_CERTIFICATES]"

现象
![](/assets/img/note/2018-02-21-android-environment/0x005-001.png)

这是apk包没有签名导致的，用apktoolbox签上名，再安装
![](/assets/img/note/2018-02-21-android-environment/0x005-002.png)


## 0x005 ndk编译hello world真机运行

解压android-ndk-r15c-windows-x86_64.zip到D:\toolchain\android\ndk, 设置环境变量
```
D:\toolchain\android\ndk\android-ndk-r15c

```