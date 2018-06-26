---
layout:		post
title:		使用hackrf实施无线信号的重放攻击  
author:		wooy0ung
tags:		wireless
category:  	iot
---


>说明：
>433.925MHz频段在日常生活中很广泛使用，这个频段我们可以利用hackrf-one也就是电视棒接收到这种射频信号，
可以录制该信号并做分析，为进一步实施攻击准备。
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x001.png)
<!-- more -->


## 0x001 前期准备

```
rtl-sdr(某宝上有卖，也就几十大洋)  
hackrf one(这个要一千多大洋，可以采用发射对应信号频段的发射器，比较经济)  
433MHz ASK/OOK模块(用来发射信号)  
Arduino Uno板子  
SDR-Sharp软件工具: [传送门](http://sdrsharp.com)  
rc-switch库: [传送门](https://github.com/sui77/rc-switch)  
Audacity: [传送门](https://sourceforge.net/projects/audacity/)  
```


## 0x002 分析信号

如图接好ASK/OOK模块VCC、GND、DATA引脚
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x002.png)

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
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x003.png)

找到无线模块发射的信号后，记录下来并保存为WAV的文件，用Audacity打开
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x004.png)

计算波特率
```
1 / (samples / samplerate) = 1 / (110 / 2048000) ~= 18,618bps
```

其中sample是采样数(110)，samplerate是采样速率(2048000Hz)
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x005.png)


## 0x003 重放攻击

我们先对这款遥控器进行重放攻击
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x006.png)

资料显示是工作在315MHz频率下的
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x007.png)

启动gqrx，嗅探315MHz附近频段
```
$ gqrx
```
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x008.png)

录制信号
```
$ hackrf_transfer -r ctl.iq -f 315000000
```

重放
```
$ hackrf_transfer -t ctl.iq -f 315000000 -a 1 -l 30 -x 40
```

再通过rtl-sdr就能嗅探到重放信号
![](/assets/img/iot/2018-06-24-hackrf-one-replay-attack/0x008.png)

记录一下hackrf_transfer常用参数解释
```
-r 接受数据写入文件
-f 监听的频率 单位是Hz，所以315MHz 应该监听-f 31500000000
-s 取样比率，单位是Hz，默认是10MHz
-n 取样数量，默认不限制
-R 循环发射模式。默认关
-x TX VGA (IF) 增益，范围0-47dB，必须是1的倍数。
-a amp-enable
```