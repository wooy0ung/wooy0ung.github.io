---
layout:     post
title:      AliCrackme 2015 iOS Level1
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>二十二世纪，人类社会沦为电脑智能主体MATRIX的寄生物，一群电脑病毒似的幸存者聚集在一起组成人类反抗组织，试图颠覆由强大的电脑所建立的虚拟世界，然而MATRIX派出的电脑特警成为这一行动的最大死敌，人类需要找到救世主Neo。  
<!-- more -->


### 0x00 IDA分析

拿到 ipa 包, 先安装到 iOS

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x00.png)

常规的密码校验程序, 解包后将可执行文件拖到 IDA 分析, 定位到 onClick 方法

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x01.png)

这里的 _objc_msgSend 方法控制程序从文件读取 source data, 生成特定 string, 再与输入 string 判断是否相同

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x02.png)


### 0x01 crack

直接 lldb attach 上去

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x03.png)

查找 entry point

```
(lldb) list image -o -f
```

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x04.png)

在第一个 _objc_msgSend 下断, 输入任意密码(如:11111111)后点击"进入", 断点断下

```
(lldb) br s -a 0x0000000000050000+0x0000000100009A94
(lldb) c
```

跟下去, 这里返回了输入的 string

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x05.png)

继续单步下去, 最后一个 _objc_msgSend 返回了 flag, 将 X0 寄存器打印出来, getflag~

![](/assets/img/writeup/re/2017-08-31-alicrackme-2015-ios-level1/0x06.png)