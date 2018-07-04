---
layout:		post
title:		使用hackrf重放无线家用门铃  
author:		wooy0ung
tags:		wireless
category:  	iot
---


>说明：
>一般的无线门铃普遍工作在315Mhz或者433MHz，我们可以对这两种频段分别监听，确定其工作频率，下面我们对这款家用门铃进行重放攻击。
![](/assets/img/iot/2018-06-27-hackrf-one-replay-doorbell/0x001.png)
<!-- more -->


## 0x001 简单录制信号并重放

启动gqrx
```
$ hackrf_info
$ gqrx
```

监听到该门铃的无线遥控信号是以433.9Mhz传输
![](/assets/img/iot/2018-06-27-hackrf-one-replay-doorbell/0x002.png)

录制信号
```
$ hackrf_transfer -r door.iq -f 433900000
```

重放
```
$ hackrf_transfer -t door.iq -f 433900000 -a 1 -l 30 -x 40
```

这时候发现门铃并没有反应，用rtl-sdr监听信号，发现信号太弱了，改成录制433.0Mhz

```
$ hackrf_transfer -r door.iq -f 433000000
$ hackrf_transfer -t door.iq -f 433000000 -a 1 -l 30 -x 40
```

这时sdr检测出足够强度的信号，但不知为何hackrf重放的信号又是433.9Mhz的
![](/assets/img/iot/2018-06-27-hackrf-one-replay-doorbell/0x003.png)


## 0x002 使用GNURadio

先录制一段信号，为了方便我就直接在windows下录制了


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