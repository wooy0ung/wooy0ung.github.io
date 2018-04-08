---
layout:     post
title:      制作iOS内核调试线 & 调试内核
author:     wooy0ung
tags: 		ios
category:  	xnu
---


>说明:  
>早期A5处理器的机器是能直接调内核的，而且30pin的数据线并没有对内核信息加密，因此我们能够直接读到内核数据。  
>而现在的新机器一律采用加密过的light接口，使得非官方的内核调试基本上消失了。  
>网上也有不少大佬写过类似的教程，但年代久远，自己动手时还是遇到不少问题。  
<!-- more -->


## 0x001 准备材料

```
1. iPhone 4手机一部(iOS 5.1.1 9B208)
2. Apple 30pin转换接口一个
3. FT232RL串口一个
4. mini USB数据线两条
5. 470k欧电阻一个
6. 杜邦线、飞线、焊锡若干
```
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x001.png)


## 0x002 安装驱动

到官网上下载串口对应的驱动: [Virtual COM Port Drivers](http://www.ftdichip.com/Drivers/VCP.htm)

安装iTunes，注意redsn0w最后支持iTunes 12.0.1版本，可以在这个网站下载iTunes早期版本:
[АРХИВ ВЕРСИЙ ITUNES](https://appstudio.org/itunes)

以前装过较新版本的，需要先卸载以下几个程序，重启
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x002.png)

redsn0w的历史版本可以在这下载: 
[Download iOS - Jailbreak Tools](http://www.redsn0w.us/2010/03/download-direct-links-jailbreak-guides.html)


## 0x003 焊接

![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x003.png)
```
1. 27pin(D+)、25pin(D-)、23pin(VCC)、16pin(GND)分别接USB的绿、白、红、黑色线。
2. 13pin(RX)、12pin(TX)、1pin(GND)分别接串口的TX端、RX端、GND端
3. pin1与pin21间焊上一个470k欧的电阻
```

正面
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x004.png)

背面
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x005.png)


## 0x004 编译SerialKDPProxy

安装cywin，官网上下载安装包: [Cygwin](http://www.cygwin.com/)

勾选gcc-g++、cmake、make包，再下载SerialKDPProxy_m.rar，直接make

编译提示缺少ethernet.h、if_ether.h，下载相应的头文件，扔到对应目录再次编译
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x006.png)

设置串口的波特率为115200
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x007.png)

打开串口监听
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x008.png)


## 0x005 设置红雪参数调试内核

启动命令
```
> redsn0w.exe -i iPhone3,1_5.1.1_9B208_Restore.ipsw -j -a "-v debug=0x08"
```

内核信息输出到串口了
![](/assets/img/xnu/2018-04-08-ios-kernel-cable/0x009.png)

挂起
```
redsn0w.exe -i iPhone3,1_5.1.1_9B208_Restore.ipsw -j -a "-v debug=0x09"		# DB_KPRT | DB_HALT => 0x09
```
但我这里内核并没有挂起，暂时不知道什么原因，也许是系统版本...


## 0x006 参考

[如何调试iOS内核](https://bbs.pediy.com/thread-157624.htm)
[如何调试iOS内核-补充说明](https://bbs.pediy.com/thread-189854.htm)
[SyScanTaipei2011_StefanEsser_iOS_Kernel_Exploitation_IOKit_Edition](https://papers.put.as/papers/ios/2011/SyScanTaipei2011_StefanEsser_iOS_Kernel_Exploitation_IOKit_Edition.pdf)
[iOS内核调试教程](http://www.cocoachina.com/cms/wap.php?action=article&id=21808)
[iOS内核调试](http://sbim.github.io/ios_kdb.html)