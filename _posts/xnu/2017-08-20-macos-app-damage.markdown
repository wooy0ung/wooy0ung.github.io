---
layout:     post
title:      macOS 10.12.x软件包提示损坏
author:     wooy0ung
tags: 		macos
category:  	xnu
---


>说明:  
>今天安装 Android Studio 时提示软件包已损坏, 估计是 "安全与隐私" 没设置成任何来源  
![](/assets/img/xnu/2017-08-20-macos-app-damage/0x00.png)
<!-- more -->


打开设置, 发现并没有 "任何来源" 选项, 原来是 OS X 10.12.x 隐藏起来了

![](/assets/img/xnu/2017-08-20-macos-app-damage/0x01.png)

输入以下命令

```
$ sudo spctl --master-disable
```

"任何来源" 又回来了

![](/assets/img/xnu/2017-08-20-macos-app-damage/0x02.png)

再打开软件包, 运行正常

![](/assets/img/xnu/2017-08-20-macos-app-damage/0x03.png)