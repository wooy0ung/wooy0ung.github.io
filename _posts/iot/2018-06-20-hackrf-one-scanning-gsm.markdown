---
layout:		post
title:		利用HackRF one嗅探GSM网络流量
author:		wooy0ung
tags:		wireless
category:  	iot
---

- 目录
{:toc #markdown-toc}

>说明：
>前几天在某宝入手了一块HackRF one，可嗅探1MHz-6GHz频段的射频信号，配合GNU Radio来分析射频信号做IoT Hacking简直无敌。  
![](/assets/img/iot/2018-06-20-hackrf-one-scanning-gsm/0x001.png)
<!-- more -->


## 0x001 前期准备

```
1. HackRF one板子
2. 接受天线一根
3. Kali Linux 2018.2
```


## 0x002 安装工具

gnuradio
```
$ sudo apt-get install gnuradio gnuradio-dev gr-osmosdr
$ sudo apt-get install git cmake libboost-all-dev libcppunit-dev swig doxygen liblog4cpp5-dev python-scipy
$ sudo apt-get install hackrf libhackrf-dev libhackrf0
```

gr-gsm
```
$ git clone https://github.com/ptrkrysik/gr-gsm.git
$ cd gr-gsm
$ mkdir build
$ cd build
$ cmake ..
$ make
$ sudo make install
$ sudo ldconfig
```

先执行一次
```
$ grgsm_livemon
```

待显示此界面，直接关掉，这时候用户目录会生成".gnuradio"文件夹，创建"config.conf"文件
```
[grc]
local_blocks_path=/usr/local/share/gnuradio/grc/blocks
```
![](/assets/img/iot/2018-06-20-hackrf-one-scanning-gsm/0x002.png)

kalibrate-hackrf
```
$ apt-get install automake autoconf
$ git clone https://github.com/scateu/kalibrate-hackrf.git
$ cd kalibrate-hackrf
$ ./bootstrap
$ ./configure
$ make
$ make install
```

若configure时提示"libhackrf not found"，就是"libhackrf-dev"没装上，重新执行这条命令即可
```
$ sudo apt-get install hackrf libhackrf-dev libhackrf0
```

IMSI-catcher
```
$ git clone https://github.com/Oros42/IMSI-catcher.git
```


## 0x003 嗅探

确定频率
```
$ cd kalibrate-hackrf
$ cd src
$ ./kal -s GSM900 -g 40 -l 40
```
![](/assets/img/iot/2018-06-20-hackrf-one-scanning-gsm/0x003.png)

再打开gr-gsm_livemon，选择嗅探出的频率，再进行微调，直到终端捕获到数据
![](/assets/img/iot/2018-06-20-hackrf-one-scanning-gsm/0x004.png)

获取IMSI
```
$ cd IMSI-catcher
$ chmod u+x simple_IMSI-catcher.py
$ ./simple_IMSI-catcher.py
```

我这里并没有嗅探出来，也许是信号质量不好
![](/assets/img/iot/2018-06-20-hackrf-one-scanning-gsm/0x005.png)

记录一下两个网站
```
[基站定位查询](http://www.cellid.cn/)
[IMSI查询](https://the-x.cn/)
```