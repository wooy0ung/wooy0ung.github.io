---
layout:     post
title:      安装Reveal8 & 分析iOS UI
author:     wooy0ung
tags: 		ios
category:  	xnu
---


>说明:  
>最近在配置MonkeyDev, 因为是 iOS 10.3.2 的机器, 旧版的Reveal都不能正常工作...
>找到一个Reveal8的破解版, 但破解者需要收费, 这就不太厚道了... (ノ ﾟДﾟ)ノ
>下面就来破解这个简单的激活码校验。
<!-- more -->


### 0x00 修改跳转

将包里的 librevealcrack.dylib 拖到hopper分析

![](/assets/img/note/2017-09-19-install-reveal8/0x00.png)

这些方法与注册窗口相关, 接下来确定那个是注册窗口中"Go"按钮的调用方法, 可以用lldb测试

```
$ lldb
(lldb) process attach --pid reveal_pid
(lldb) list image -o -f
(lldb) br s -a librevealcrack.dylib_base_addr+0x0000000000001c85
```

按下"Go", 断点断下, 确定[RegisterWindow hhhhjjjjjxxxx]是关键方法

![](/assets/img/note/2017-09-19-install-reveal8/0x01.png)

这里字串比较不相同返回 0, 跳到激活失败, 直接nop掉, 但重启后无效


### 0x01 观察控制台

再看看校验流程, 源串经过 base64hmacsha1(key=NSLog) 加密后, 与输入串比较

![](/assets/img/note/2017-09-19-install-reveal8/0x02.png)

发现激活码直接通过NSLog打印出来了, 打开控制台观察Reveal

![](/assets/img/note/2017-09-19-install-reveal8/0x03.png)

"ens:"后面的字串就是激活码。