---
layout:     post
title:      在macOS下实现QQ消息防撤回
author:     wooy0ung
tags: 		macos qq
category:  	ios
---

### 0x00 配置substitute

下载MacOSX10.11.sdk，放入/Applications/XCode_8.2.1.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs

```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/MacOSX-SDKs/MacOSX10.11.sdk
```

编译substitute

```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/substitute
$ cd substitute
$ ./configure --xcode-sdk macosx10.11 && make -j8
```
<!-- more -->


### 0x01 创建工程

![](/assets/img/ios/2017-06-21-macos-qq-not-revoke/0x00.png)

![](/assets/img/ios/2017-06-21-macos-qq-not-revoke/0x01.png)

将substitute.dylib与substitute.h添加到工程中

![](/assets/img/ios/2017-06-21-macos-qq-not-revoke/0x02.png)

修改QQMessageRevoke.m

```
#import <Foundation/Foundation.h>
#import "substrate.h"

void handleRecallNotifyIsOnline(id self, SEL _cmd, void * pVoid, BOOL isXXX)
{

}

__attribute__((constructor))
static void initialize()
{
    SEL selector = NSSelectorFromString(@"handleRecallNotify:isOnline:");
    MSHookMessageEx(NSClassFromString(@"QQMessageRevokeEngine"),selector,(IMP)&handleRecallNotifyIsOnline,NULL);
}
```

编辑Scheme，将默认的编译Debug改为编译Release

![](/assets/img/ios/2017-06-21-macos-qq-not-revoke/0x03.png)

![](/assets/img/ios/2017-06-21-macos-qq-not-revoke/0x04.png)

编译生成libQQMessageRevoke.dylib


### 0x02 配置insert_dylib

```
$ svn checkout https://github.com/wooy0ung/ios/trunk/insert_dylib
// 编译insert_dylib的release版本，放到/usr/local/bin
$ sudo chmod 777 /usr/local/bin
```

### 0x03 注入dylib

将libsubstitute.dylib libQQMessageRevoke.dylib放到/Applications/QQ.app/Contents/MacOS/QQ

```
$ insert_dylib libQQMessageRevoke.dylib QQ
$ install_name_tool -change /usr/local/lib/libsubstitute.0.dylib @executable_path/libsubstitute.dylib libQQMessageRevoke.dylib
$ otool -L libQQMessageRevoke.dylib | grep subs
$ mv QQ_patched QQ
$ install_name_tool -change libQQMessageRevoke.dylib @executable_path/libQQMessageRevoke.dylib QQ
$ otool -L QQ | grep voke
```