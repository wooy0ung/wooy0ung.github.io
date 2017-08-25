---
layout:     post
title:      macOS 10.12.x 登陆bug修复
author:     wooy0ung
tags: 		osx
category:  	note
---


>某天用着用着, 一打开Mac终端提示需要login, 输入管理员密码却是incorrect。  
>重启发现密码不对, 不能登入系统。以下给出两种比较方便的方法:  
>1. 若本机密码设置成允许AppleID修改, 输入3次错误后会提示通过Apple修改密码, 修改即可。  
>2. 按住command+R再启动mac, 进入恢复模式, 终端下输入resetpassword重置密码即可。  
<!-- more -->


### 0x00 解决

如果多次尝试以上办法都无法成功, 恭喜你中招了, 我就是这种情况。先说说我的解决方法:

```
1. 进入恢复模式终端, 通过date命令确认当前时间, 然后 date 212330170817 将时间修改
为2017年8月17日21时23分30秒(按自己的时间来), 再resetpassword。但这种方法不适用于
我的情况。
2. 按住alt+command+R+P再启动mac, 这时会打开一个终端(这个终端字体较小), 分别键入以下命令:
mount -uw /
rm /var/db/.AppleSetupDone
reboot
mac重启后再resetpassword。但我操作过后不断重启, 同样不适用。
3. 确保能进恢复模式, 并且没有启用FileVault, 这时我们可以通过选择第2个选项重新安装macOS, 
注意不要抹除, 因为这只会覆盖必要的系统文件, 个人数据不会丢失, 等待安装完成后resetpassword,
惊奇发现系统能进了, 而且数据完全没丢失。
```

### 0x01 后记

0x01的第3个办法比较稳定, 但一定要确定没开FileVault, 这很重要!!! 

要是开了FileVault就只好找客服, 看还有没有办法...

要是数据不太重要也可以抹除掉重装...这估计是 OS X 10.12.x 的bug吧, 问了 Apple 客服也不知道什么原因。