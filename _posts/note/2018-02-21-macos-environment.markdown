---
layout:		post
title:		环境搭建之macOS篇
author:		wooy0ung
tags:		macos
category:  	note
---


>[索引目录]  
>0x001 解决macOS 10.12.x软件包提示损坏  
>0x002 macOS 10.12.x登陆bug修复  
>0x003 安装theos越狱开发环境  
>0x004 iOS app砸壳  
>0x005 利用lldb调试app  
>0x006 用Voltron增强lldb  
<!-- more -->


### 0x001 解决macOS 10.12.x软件包提示损坏

现象
![](/assets/img/note/2018-02-21-macos-environment/0x001-001.png)

在终端输入以下命令
```
$ sudo spctl --master-disable
```

打开系统偏好设置->安全与隐私，选择“任何来源”
![](/assets/img/note/2018-02-21-macos-environment/0x001-002.png)


### 0x002 macOS 10.12.x登陆bug修复

现象：某天用着用着, 一打开Mac终端提示需要login, 输入管理员密码却是incorrect。
重启发现密码不对, 不能登入系统。

方法一(二选一)：
```
1.若本机密码设置成允许AppleID修改, 输入3次错误后会提示通过Apple修改密码, 修改即可。  
2.按住command+R再启动mac, 进入恢复模式, 终端下输入resetpassword重置密码即可。 
```

方法二：
```
进入恢复模式终端, 通过date命令确认当前时间, 然后 date 212330170817 将时间修改
为2017年8月17日21时23分30秒(按自己的时间来), 再resetpassword。但这种方法不适用于
我的情况。
```

方法三：
```
按住alt+command+R+P再启动mac, 这时会打开一个终端(这个终端字体较小), 分别键入以下命令:
mount -uw /
rm /var/db/.AppleSetupDone
reboot
mac重启后再resetpassword。但我操作过后不断重启, 同样不适用。
```

方法四(终极方法)：
```
确保能进恢复模式, 并且没有启用FileVault, 这时我们可以通过选择第2个选项重新安装macOS, 
注意不要抹除, 因为这只会覆盖必要的系统文件, 个人数据不会丢失, 等待安装完成后resetpassword,
惊奇发现系统能进了, 而且数据完全没丢失。
```

办法四比较稳定, 但一定要确定没开FileVault, 否则就gg了~要是开了FileVault就只好找客服, 看还有没有办法...
如果数据不太重要也可以抹除掉重装...这估计是macOS 10.12.x的bug吧, 问了Apple客服也不知道什么原因。


### 0x003 安装theos越狱开发环境

指定Xcode
```
$ sudo xcode-select -s /Applications/Xcode_7.2.app/Contents/Developer
Password:
$ xcode-select -p /Applications/Xcode_7.2.app/Contents/Developer
```

获取Theos(因为版本不稳定, 我上传到了个人Github)
```
$ export THEOS=/opt/theos        
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/theos $THEOS
```

第一次使用svn的话, 可能会出现下面这个提示，输入p即可
![](/assets/img/note/2018-02-21-macos-environment/0x003-001.png)

获取完成
![](/assets/img/note/2018-02-21-macos-environment/0x003-002.png)

配置ldid & dpkg
```
$ sudo chmod 777 /opt/theos/bin/ldid
$ sudo chmod 777 /opt/theos/bin/dpkg-deb
```

启动Theos
```
$ /opt/theos/bin/nic.pl
```

参照下图设置
![](/assets/img/note/2018-02-21-macos-environment/0x003-003.png)

修改Makefile
```
THEOS_DEVICE_IP = 192.168.2.115	# iOS的ip

ARCHS = armv7 arm64
TARGET = iphone:latest:7.0

HelloTweak_FRAMEWORKS = UIKit Foundation
HelloTweak_PRIVATE_FRAMEWORKS = AppSupport	# 导入私有库，/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS9.3.sdk/System/Library/
HelloTweak_LDFLAGS = -lz	# mach-o对象(.dylib文件，.a文件，.o文件等)，-lz会自动搜索libz.dylib或libz.a

include theos/makefiles/common.mk

TWEAK_NAME = HelloTweak
HelloTweak_FILES = Tweak.xm

include $(THEOS_MAKE_PATH)/tweak.mk

after-install::
	install.exec "killall -9 SpringBoard"
```

修改Tweak.xm
```
#import <UIKit/UIKit.h>
#import <SpringBoard/SpringBoard.h>

%hook SpringBoard

-(void)applicationDidFinishLaunching:(id)application
{
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Hello Tweak"
	message:@"By wooy0ung"
	delegate:nil
	cancelButtonTitle:@"Ok"
	otherButtonTitles:nil];
	[alert show];
	[alert release];
	%orig;
}

%end
```

编译
```
$ make
```

提示出错，找到SpringBoard.h(可以 class-dump SpringBoard这个 Mach-O文件得到)，放到 /opt/theos/include，删除 #import <SpringBoard/SpringBoard.h>，再次make就能通过
![](/assets/img/note/2018-02-21-macos-environment/0x003-004.png)

安装tweak
```
$ make package
$ make install
```

输入两次root密码后，设备自动重启，然后就能看到效果
![](/assets/img/note/2018-02-21-macos-environment/0x003-005.png)
![](/assets/img/note/2018-02-21-macos-environment/0x003-006.png)


### 0x004 iOS app砸壳

编译
```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/dumpdecrypted
$ cd dumpdecrypted
$ sudo make
```
![](/assets/img/note/2018-02-21-macos-environment/0x004-001.png)

ssh连上iOS
```
# 密码默认alpine（可用passwd命令更改）
$ ssh root@192.168.2.115
```

关闭所有后台app，保留待破解app
```
root# ps -e | grep /Application
 1816 ??         0:01.12 /Applications/MobileMail.app/MobileMail
 1823 ??         0:01.09 /Applications/MobileSMS.app/MobileSMS
 1883 ??         0:03.83 /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
 1891 ttys000    0:00.00 grep /Application
```

注入目标app，找到Documents路径
```
$ cycript -p WeChat
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDoma ns:NSUserDomainMask][0]
#"file:///var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/"
```

将dumpdecrypted.dylib复制到Documents
```
$ scp ~/dumpdecrypted/dumpdecrypted.dylib root@172.20.10.1:/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/
```

砸壳，会在当前目录下生成WeChat.decrypted
```
// DYLD_INSERT_LIBRARIES=/path/to/dumpdecrypted.dylib /path/to/executable
root# DYLD_INSERT_LIBRARIES=/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/dumpdecrypted.dylib /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
```
![](/assets/img/note/2018-02-21-macos-environment/0x004-002.png)

WeChat.decrypted复制到mac
```
scp root@172.20.10.1:~/WeChat.decrypted ~/
```

class-dump头文佳
```
//到 http://stevenygard.com/projects/class-dump/ 下载class-dump-3.5.dmg，将dmg包里的executable复制到 /usr/local/bin
$ sudo chmod 777 /usr/local/bin/class-dump
$ class-dump -s -S -H ~/WeChat.decrypted -o ~/header
```

dump出8000+的header，砸壳成功
![](/assets/img/note/2018-02-21-macos-environment/0x004-003.png)


### 0x005 利用lldb调试app

将本地2222端口转发到iOS的22端口
```
$ /Users/wooy0ung/toolchain/operation_system/OSX/Debuggers/usbmux/tcprelay.py -t 22:2222
Forwarding local port 2222 to remote port 22
Incoming connection to 2222
Waiting for devices...
```

ssh过去, debugserver attach待调试应用
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

lldb attach
```
$ lldb
(lldb) process connect connect://localhost:7000
```
![](/assets/img/note/2018-02-21-macos-environment/0x005-001.png)


### 0x006 用Voltron增强lldb

安装Voltron
```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/voltron
$ cd voltron
$ ./install.sh

# 这里有个bug，voltron的executable会自动链接到/usr/local/bin，要再通过brew安装
$ brew install voltron
```

开启lldb本地调试，下断，运行
```
$ lldb ./test
$ b 1
$ r
```
![](/assets/img/note/2018-02-21-macos-environment/0x006-001.png)

开启Voltron观测窗口
```
$ voltron view disasm
$ voltron view breakpoints
$ voltron view backtrace
$ voltron view stack
$ voltron view register
```
![](/assets/img/note/2018-02-21-macos-environment/0x006-002.png)