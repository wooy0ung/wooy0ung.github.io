---
layout:		post
title:		HackRF实现GPS欺骗
author:		wooy0ung
tags:		wireless
category:  	iot
---

- 目录
{:toc #markdown-toc}

>说明：
>GPS定位需要至少4颗卫星完成三角定位，我们一般使用的是L1民用1575.42MHz的超高频波段，通过生成GPS仿真数据，再由HackRF以一定频率发送，可以实现GPS欺骗，以下是效果图(我当前在华东地区，但地图显示是拉萨地区)。
![](/assets/img/iot/2018-06-21-hackrf-one-gps-signal-cheat/0x001.png)
<!-- more -->


## 0x001 GPS原理

GPS信号里包含了3种常用信息
```
Pseudorandom code: 简单的ID码, 用来识别每颗卫星
Ephemeris data: 包含卫星的运行状态, 时间日期等信息. 这在通过卫星来定位起到非常重要的作用
Almanac data: 包含有每颗卫星的轨道信息，以及卫星在某个特定时段将出现的具体位置
```
![](/assets/img/iot/2018-06-21-hackrf-one-gps-signal-cheat/0x002.png)

测量方法通常是在已知坐标(比如卫星当前位置)，广播位置信息，测得到达目标点的时间差CT
![](/assets/img/iot/2018-06-21-hackrf-one-gps-signal-cheat/0x003.png)

考虑到卫星时间的异步性，需要修正方程
![](/assets/img/iot/2018-06-21-hackrf-one-gps-signal-cheat/0x004.png)


## 0x002 配置环境

编译gps-sdr-sim
```
$ git clone https://github.com/osqzss/gps-sdr-sim.git
$ cd gps-sdr-sim
$ gcc gpssim.c -lm -O3 -o gps-sdr-sim
```

RINEX星历数据下载
```
ftp://cddis.gsfc.nasa.gov/pub/gps/data/daily/2016/brdc
```

找到brdc0050.16n.Z这样的文件，解压

生成GPS仿真数据
```
$ ./gps-sdr-sim -e brdc3540.16n -l 29.643598,91.101319,100 -b 8
```

耐心等待300秒，直到gpssim.bin生成完
![](/assets/img/iot/2018-06-21-hackrf-one-gps-signal-cheat/0x005.png)

也可以伪造一个动态的GPS数据样本
```
$ ./gps-sdr-sim -e brdc3540.14n -u circle.csv -b 8
```

HackRF发射GPS数据
```
hackrf_transfer -t gpssim.bin -f 1575420000 -s 2600000 -a 1 -x 0 -R
```