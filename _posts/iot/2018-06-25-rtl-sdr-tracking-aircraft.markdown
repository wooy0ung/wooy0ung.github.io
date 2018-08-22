---
layout:		post
title:		rtl-sdr实现ADS-B飞机信号跟踪定位
author:		wooy0ung
tags:		wireless
category:  	iot
---

- 目录
{:toc #markdown-toc}

>说明：
>飞机一般使用ADS-B信号与地面接收机通讯，利用rtl-sdr可以接收到这种信号，追踪飞机的实时状况。 
![](/assets/img/iot/2018-06-25-rtl-sdr-tracking-aircraft/0x001.png)
<!-- more -->


## 0x001 Linux系统下

拉取dump1090
```
$ git clone https://github.com/itemir/dump1090_sdrplus.git
$ make
```

若提示"fatal error: rtl-sdr.h: No such file or directory"，安装sdr包
```
$ sudo apt-get install librtlsdr0 librtlsdr-dev
```

提示"fatal error: libairspy/airspy.h: No such file or directory"
```
$ sudo apt-get install libairspy0 libairspy-dev
```

提示"fatal error: mirsdrapi-rsp.h: No such file or directory"，安装SDRPlay libraries
[http://www.sdrplay.com/linuxdl.php](http://www.sdrplay.com/linuxdl.php)
```
$ chmod 755 SDRplay_RSP_API-Linux-2.11.1.run
$ ./SDRplay_RSP_API-Linux-2.11.1.run
```

编译
```
$ sudo apt-get install libsoxr0 libsoxr-dev
$ sudo ldconfig
$ make
```

执行
```
$ ./dump1090 --aggressive --net --interactive
```

打开浏览器
```
http://127.0.0.1:8080/
```
![](/assets/img/iot/2018-06-25-rtl-sdr-tracking-aircraft/0x002.png)


## 0x001 Windows系统下

下载dump1090.exe: [传送门](http://rtl1090.com/)

安装VirtualRadar和FeedFilterPlugin: 
链接：https://pan.baidu.com/s/1gNUvvi0cNyWxanWSuf-wZA 密码：48no

FeedFilterPlugin覆盖安装到VirtualRadar即可

创建dump1090.exe的快捷方式，作以下修改
![](/assets/img/iot/2018-06-25-rtl-sdr-tracking-aircraft/0x003.png)

启动dump1090，选择open确认选择上Mode S，再START

打开VirtualRadar，选择tools->Plugins，选择唯一的组件，设置一下
![](/assets/img/iot/2018-06-25-rtl-sdr-tracking-aircraft/0x004.png)

然后访问http://127.0.0.1/VirtualRadar