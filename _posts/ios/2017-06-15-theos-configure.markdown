---
layout:     post
title:      搭建theos越狱开发环境
author:     wooy0ung
tags: 		ios re app
category:  	ios
---


### 0x00 指定xcode

```
$ sudo xcode-select -s /Applications/Xcode_7.2.app/Contents/Developer
Password:
$ xcode-select -p
/Applications/Xcode_7.2.app/Contents/Developer
```
<!-- more -->


### 0x01 下载theos

```
$ export THEOS=/opt/theos        
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/theos $THEOS
```

第一次使用svn的话, 可能会出现下面这个提示，输入p即可

![](/assets/img/ios/2017-06-15-theos-configure/0x00.png)

获取完成

![](/assets/img/ios/2017-06-15-theos-configure/0x01.png)


### 0x02 赋予execute权限

```
$ sudo chmod 777 /opt/theos/bin/ldid
$ sudo chmod 777 /opt/theos/bin/dpkg-deb
```


### 0x03 编写第一个tweak

启动theos

```
$ /opt/theos/bin/nic.pl
```

参照下图设置

![](/assets/img/ios/2017-06-15-theos-configure/0x02.png)

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

进行编译

```
$ make
```

提示出错，找到SpringBoard.h(可以 class-dump SpringBoard这个 Mach-O文件得到)，放到 /opt/theos/include，删除 #import <SpringBoard/SpringBoard.h>，再次make就能通过

![](/assets/img/ios/2017-06-15-theos-configure/0x03.png)

安装tweak

```
$ make package
$ make install
```

输入两次root密码后，设备自动重启，然后就能看到效果

![](/assets/img/ios/2017-06-15-theos-configure/0x04.png)

![](/assets/img/ios/2017-06-15-theos-configure/0x05.png)