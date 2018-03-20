---
layout:     post
title:      iOS版WeChat消息防撤回
author:     wooy0ung
tags: 		ios
category:  	xnu
---


>说明:  
>微信上经常别人发了消息自己还没来得及看, 就又撤回去, 真心蓝瘦啊... (ノ・_・)ノ  
>好, 现在我们来写个Tweak让这些消息全都不能撤回去。  
>注意, 别用来恶作剧, 小心引战2333333。  
<!-- more -->


### 0x00 创建工程

如图设置创建一个Tweak模板

![](/assets/img/xnu/2017-06-16-ios-wechat-not-revoke/0x00.png)

编辑Makefile

```
THEOS_DEVICE_IP = iOS_IP

ARCHS = armv7 arm64
TARGET = iPhone:latest:7.0

include theos/makefiles/common.mk

TWEAK_NAME = WeChatNotRevoke
WeChatNotRevoke_FILES = Tweak.xm
WeChatNotRevoke_FRAMEWORKS = UIKit

include $(THEOS_MAKE_PATH)/tweak.mk

after-install::
	install.exec "killall -9 WeChat"
```

编辑Tweak.xm

```
#import <UIKit/UIKit.h>

%hook CMessageMgr
- (void)onRevokeMsg:(id)arg1
{
	return;
}
%end
```


### 0x01 编译运行

mac与iOS连在同一局域网

```
$ make
$ make package
$ make install
```

![](/assets/img/xnu/2017-06-16-ios-wechat-not-revoke/0x01.png)

输入两次root密码后安装完成, 同时WeChat被Kill掉, 重启WeChat, 最终效果如下

![](/assets/img/xnu/2017-06-16-ios-wechat-not-revoke/0x02.png)
![](/assets/img/xnu/2017-06-16-ios-wechat-not-revoke/0x03.png)


### 0x02 补充

App砸壳、Theos环境配置, 以及SpringBoard.h缺少参考以下文章
[iOS App砸壳](http://www.wooy0ung.me/xnu/2017/06/15/ios-app-decrypted/)
[搭建Theos越狱开发环境](http://www.wooy0ung.me/xnu/2017/06/15/theos-configure/)