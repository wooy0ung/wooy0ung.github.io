---
layout:     post
title:      WeChat砸壳
author:     wooy0ung
tags: 		ios re app
category:  	ios
---

### 0x00 下载dumpdecrypted

```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/dumpdecrypted
$ cd dumpdecrypted
$ sudo make
```

![](/assets/img/ios/2017-06-15-app-decrypt/0x00.png)
<!-- more -->


### 0x01 连接设备

ssh连上iOS，密码默认alpine（可用passwd命令更改）

```
$ ssh root@192.168.2.115
```


### 0x02 找到目标App

关闭所有后台App，后台保留待破解App，用ps命令找到App的bundle

```
root# ps -e | grep /Application
 1816 ??         0:01.12 /Applications/MobileMail.app/MobileMail
 1823 ??         0:01.09 /Applications/MobileSMS.app/MobileSMS
 1883 ??         0:03.83 /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
 1891 ttys000    0:00.00 grep /Application
```


### 0x03 注入目标进程

用cycript命令，注入目标App找到App的Documents路径

```
$ cycript -p WeChat
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDoma ns:NSUserDomainMask][0]
#"file:///var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/"
```


### 0x04 将dumpdecrypted.dylib复制到Documents目录

```
$ scp ~/dumpdecrypted/dumpdecrypted.dylib root@172.20.10.1:/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/
```


### 0x05 砸壳，完成后会在当前目录下生成WeChat.decrypted

```
// DYLD_INSERT_LIBRARIES=/path/to/dumpdecrypted.dylib /path/to/executable
root# DYLD_INSERT_LIBRARIES=/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/dumpdecrypted.dylib /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
```

![](/assets/img/ios/2017-06-15-app-decrypt/0x01.png)


### 0x06 将WeChat.decrypted.decrypted复制到mac

```
scp root@172.20.10.1:~/WeChat.decrypted ~/
```

### 0x07 class-dump

```
//到 http://stevenygard.com/projects/class-dump/ 下载class-dump-3.5.dmg，将dmg包里的executable复制到 /usr/local/bin
$ sudo chmod 777 /usr/local/bin/class-dump
$ class-dump -s -S -H ~/WeChat.decrypted -o ~/header
```

dump出8000+的header，说明砸壳成功

![](/assets/img/ios/2017-06-15-app-decrypt/0x02.png)
