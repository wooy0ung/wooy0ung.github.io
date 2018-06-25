---
layout:		post
title:		使用Arduino模块实施无线信号的重放攻击  
author:		wooy0ung
tags:		wireless
category:  	iot
---


>说明：
>433.925MHz频段在日常生活中很广泛使用，这个频段我们可以利用rtl-sdr也就是电视棒接收到这种射频信号，
可以录制该信号并做分析，为进一步实施攻击准备。
![](/assets/img/iot/2018-06-24-rtl-sdr-replay-attack/0x001.png)
<!-- more -->


## 0x001 前期准备

rtl-sdr一套(某宝上有卖，也就几十大洋)
433MHz ASK/OOK模块(用来发射信号)
Arduino Uno板子
SDR-Sharp软件工具: [传送门](http://sdrsharp.com)
rc-switch库: [传送门](https://github.com/sui77/rc-switch)
Audacity: [传送门](https://sourceforge.net/projects/audacity/)


## 0x002 分析信号

如图接好ASK/OOK模块VCC、GND、DATA引脚
![](/assets/img/iot/2018-06-24-rtl-sdr-replay-attack/0x002.png)

将以下代码烧写到arduino
```
#include <RCSwitch.h>

RCSwitch mySwitch = RCSwitch();

void setup() {
  mySwitch.enableTransmit(2);  // Using Pin #2
}

void loop() {
  mySwitch.send("1100101");	// Send the message 0x65, in ASCII, ‘a’
  delay(1000);	// 1 second delay per transmission; 1000ms
}
```

这是打开SDR-Sharp, 选择AM调制方式, 监听433MHz频段, 观察瀑布图
![](/assets/img/iot/2018-06-24-rtl-sdr-replay-attack/0x003.png)

找到无线模块发射的信号后，记录下来并保存为WAV的文件，用Audacity打开
![](/assets/img/iot/2018-06-24-rtl-sdr-replay-attack/0x004.png)

计算波特率
```
1 / (samples / samplerate) = 1 / (110 / 2048000) ~= 18,618bps
```

其中sample是采样数(110)，samplerate是采样速率(2048000Hz)
![](/assets/img/iot/2018-06-24-rtl-sdr-replay-attack/0x005.png)