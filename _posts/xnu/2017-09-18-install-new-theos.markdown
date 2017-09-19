---
layout:     post
title:      配置新版Theos越狱开发环境
author:     wooy0ung
tags: 		  ios
category:  	xnu
---


>说明:  
>旧版 Theos 用了一段时间了, 不时地出现点问题实在难受, 还是换新版吧。  
>由于 Theos 维护人员的更换, 也导致了配置方法稍有不同。  
<!-- more -->


### 0x00 dpkg & ldid

安装打包 & 签名工具

```
$ brew install dpkg ldid
```


### 0x01 Theos

安装 Theos

```
$ sudo git clone --recursive https://github.com/theos/theos.git /opt/theos
```

赋予权限

```
$ sudo chown $(id -u):$(id -g) /opt/theos
```

添加环境变量(.bash_profile)

```
export THEOS=/opt/theos
export PATH=/opt/theos/bin/:$PATH
```


### 0x02 测试

```
$ nic.pl
NIC 2.0 - New Instance Creator
------------------------------
  [1.] iphone/activator_event
  [2.] iphone/application_modern
  [3.] iphone/cydget
  [4.] iphone/flipswitch_switch
  [5.] iphone/framework
  [6.] iphone/ios7_notification_center_widget
  [7.] iphone/library
  [8.] iphone/notification_center_widget
  [9.] iphone/preference_bundle_modern
  [10.] iphone/tool
  [11.] iphone/tweak
  [12.] iphone/xpc_service
Choose a Template (required):
```

注意: 旧版本的 "sudo /opt/theos/bin/bootstrap.sh substrate" 这一句已经去除, 也不用到 Cydia 下 copy libsubstrate.dylib, 相比旧版来说简化了安装步骤。