---
layout:     post
title:      配置 MonkeyDev 集成环境 —— 基于 Xcode、Theos
author:     wooy0ung
tags: 		ios
category:  	xnu
---


>说明:  
>MonkeyDev是由AloneMonkey开源的一款集成开发环境, 整合了越狱与非越狱开发, 相比Theos省去许多繁琐步骤。  
>支持最新Xcode9和Theos, 一步集成非越狱调试。  
<!-- more -->

as
### 0x00 Xcode & Theos

安装最新版的Xcode9, 直接到Apple开发者中心下载xip包(经测试Xcode8报错)

```
$ sudo xcode-select -s /Applications/Xcode_9.0.app/Contents/Developer
```

新版Theos的安装可以看另外一篇文章

#### 传送门: [配置新版 Theos 越狱开发环境](http://www.wooy0ung.me/xnu/2017/09/18/install-new-theos/)


### 0x01 MonkeyDev

安装MonkeyDev

```
$ cd /opt
$ git clone https://github.com/AloneMonkey/MonkeyDev.git
$ cd MonkeyDev/bin
$ sudo ./md-install
# 卸载
$ sudo ./md-uninstall
```

完成后, 到新建工程界面, 如下图就是成功装上

![](/assets/img/xnu/2017-09-19-install-monkeydev/0x00.png)


### 0x02 测试

新建一个MonkeyApp

![](/assets/img/xnu/2017-09-19-install-monkeydev/0x01.png)

直接编译安装到iOS, 打开Reveal8也能正常连接

![](/assets/img/xnu/2017-09-19-install-monkeydev/0x02.png)

至于Reveal8的安装可以看另一篇文章

#### 传送门: [安装Reveal8 & 分析iOS UI](http://www.wooy0ung.me/xnu/2017/09/18/install-reveal8/)


### 0x03 参考

[iOSOpenDev修改版MonkeyDev](http://www.alonemonkey.com/2017/06/28/monkeydev/)
[无须越狱、自动集成、只需要一个砸壳的应用---MonkeyDev](http://www.alonemonkey.com/2017/07/12/monkeydev-without-jailbreak/)