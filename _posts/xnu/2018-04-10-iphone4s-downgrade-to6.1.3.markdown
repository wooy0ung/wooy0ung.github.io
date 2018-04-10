---
layout:     post
title:      将iPhone4s设备从iOS9降回iOS6
author:     wooy0ung
tags: 		ios
category:  	xnu
---


>说明:  
>此方法适用于无shsh2的情况，备份了shsh2的就别瞎折腾了，直接shsh降吧，毕竟这方法还存在一定风险  
<!-- more -->


## 0x001 准备工具

```
1. iTunes
2. cydia impactor
3. phoenix
4. winscap
5. openssl
6. fistmedaddy.ipsw特制固件
7. idevicerestore降级工具
```
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x001.png)


## 0x002 越狱

确保设备在iOS9系统，若不是，请先通过iTunes升级

使用phoenix越狱，更新cydia组件
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x002.png)

安装openssl、openssh插件
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x003.png)


## 0x003 连接ihone

Windows安装winscp、openssl，打开前者
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x004.png)

手机连上wifi，找到ip地址
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x005.png)

在winscp填上ip、用户名：root、密码：alpine，然后登陆
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x006.png)

重复登陆，直到出现这样，点“是”
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x007.png)

成功登陆上会这样
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x008.png)


## 0x004 降级

将kloader、pwnediBSS拷贝到根目录
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x009.png)

打开winscp的terminal
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x010.png)

然后就会弹出控制台
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x011.png)

执行
```
$ chmod +x kloader
$ ./kloader pwnediBSS
```

这样连接会断掉，这是正常的，注意iTunes应该全程处于关闭状态
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x012.png)

然后以管理员打开cmd，执行
```
> idevicerestore.exe -e fistmedaddy.ipsw
```
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x013.png)

耐心等待
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x014.png)

回退到iOS6，也能正常激活
![](/assets/img/xnu/2018-04-10-iphone4s-downgrade-to6.1.3/0x015.png)