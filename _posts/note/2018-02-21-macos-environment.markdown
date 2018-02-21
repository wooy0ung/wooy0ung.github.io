---
layout:		post
title:		环境搭建之macOS篇
author:		wooy0ung
tags:		macos
category:  	note
---


>[索引目录]  
>0x001 解决macOS 10.12.x软件包提示损坏  
>0x002 macOS 10.12.x登陆bug修复  
<!-- more -->


### 0x001 解决macOS 10.12.x软件包提示损坏

现象
![](/assets/img/note/2018-02-21-macos-environment/0x001-001.png)

在终端输入以下命令
```
$ sudo spctl --master-disable
```

打开系统偏好设置->安全与隐私，选择“任何来源”
![](/assets/img/note/2018-02-21-macos-environment/0x001-002.png)


### 0x002 macOS 10.12.x登陆bug修复

现象：某天用着用着, 一打开Mac终端提示需要login, 输入管理员密码却是incorrect。
重启发现密码不对, 不能登入系统。

方法一(二选一)：
```
1.若本机密码设置成允许AppleID修改, 输入3次错误后会提示通过Apple修改密码, 修改即可。  
2.按住command+R再启动mac, 进入恢复模式, 终端下输入resetpassword重置密码即可。 
```

方法二：
```
进入恢复模式终端, 通过date命令确认当前时间, 然后 date 212330170817 将时间修改
为2017年8月17日21时23分30秒(按自己的时间来), 再resetpassword。但这种方法不适用于
我的情况。
```

方法三：
```
按住alt+command+R+P再启动mac, 这时会打开一个终端(这个终端字体较小), 分别键入以下命令:
mount -uw /
rm /var/db/.AppleSetupDone
reboot
mac重启后再resetpassword。但我操作过后不断重启, 同样不适用。
```

方法四(终极方法)：
```
确保能进恢复模式, 并且没有启用FileVault, 这时我们可以通过选择第2个选项重新安装macOS, 
注意不要抹除, 因为这只会覆盖必要的系统文件, 个人数据不会丢失, 等待安装完成后resetpassword,
惊奇发现系统能进了, 而且数据完全没丢失。
```

办法四比较稳定, 但一定要确定没开FileVault, 否则就gg了~要是开了FileVault就只好找客服, 看还有没有办法...
如果数据不太重要也可以抹除掉重装...这估计是macOS 10.12.x的bug吧, 问了Apple客服也不知道什么原因。


