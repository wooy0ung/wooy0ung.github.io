---
layout:		  post
title:		  环境搭建之macOS篇
author:		  wooy0ung
tags:		    macos
category:  	note
---

- 目录
{:toc #markdown-toc}

>[索引目录]  
>0x001 解决macOS 10.12.x软件包提示损坏  
>0x002 macOS 10.12.x登陆bug修复  
>0x003 安装theos越狱开发环境  
>0x004 iOS app砸壳  
>0x005 利用lldb调试app  
>0x006 用Voltron增强lldb  
>0x007 配置新版theos越狱开发环境  
>0x008 配置MonkeyDev集成环境  
<!-- more -->
>0x009 安装wine容器  
>0x010 安装Reveal8 & 分析iOS UI  
>0x011 解决Github Authentication failed  
>0x012 配置php环境  
>0x013 用tmuxinator更好管理你的lldb  
>0x014 安装angr二进制分析环境  
>0x015 显示隐藏文件  
>0x016 解决gem命令被墙  
>0x017 解决安装tmuxinator时ruby版本过低  

## 0x001 解决macOS 10.12.x软件包提示损坏

现象
![](/assets/img/note/2018-02-21-macos-environment/0x001-001.png)

在终端输入以下命令
```
$ sudo spctl --master-disable
```

打开系统偏好设置->安全与隐私，选择“任何来源”
![](/assets/img/note/2018-02-21-macos-environment/0x001-002.png)

mac查看app使用的框架
```
$ otool L Safari
```


## 0x002 macOS 10.12.x登陆bug修复

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


## 0x003 安装theos越狱开发环境

指定Xcode
```
$ sudo xcode-select -s /Applications/Xcode_7.2.app/Contents/Developer
Password:
$ xcode-select -p /Applications/Xcode_7.2.app/Contents/Developer
```

获取Theos(因为版本不稳定, 我上传到了个人Github)
```
$ export THEOS=/opt/theos        
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/theos $THEOS
```

第一次使用svn的话, 可能会出现下面这个提示，输入p即可
![](/assets/img/note/2018-02-21-macos-environment/0x003-001.png)

获取完成
![](/assets/img/note/2018-02-21-macos-environment/0x003-002.png)

配置ldid & dpkg
```
$ sudo chmod 777 /opt/theos/bin/ldid
$ sudo chmod 777 /opt/theos/bin/dpkg-deb
```

启动Theos
```
$ /opt/theos/bin/nic.pl
```

参照下图设置
![](/assets/img/note/2018-02-21-macos-environment/0x003-003.png)

修改Makefile
```
THEOS_DEVICE_IP = 192.168.2.115	# iOS的ip

ARCHS = armv7 arm64
TARGET = iphone:latest:7.0

HelloTweak_FRAMEWORKS = UIKit Foundation
HelloTweak_PRIVATE_FRAMEWORKS = AppSupport	# 导入私有库，/Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS9.3.sdk/System/Library/
HelloTweak_LDFLAGS = -lz	# mach-o对象(.dylib文件，.a文件，.o文件等)，-lz会自动搜索libz.dylib或libz.a

include theos/makefiles/common.mk

TWEAK_NAME = HelloTweak
HelloTweak_FILES = Tweak.xm

include $(THEOS_MAKE_PATH)/tweak.mk

after-install::
	install.exec "killall -9 SpringBoard"
```

修改Tweak.xm
```
#import <UIKit/UIKit.h>
#import <SpringBoard/SpringBoard.h>

%hook SpringBoard

-(void)applicationDidFinishLaunching:(id)application
{
	UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"Hello Tweak"
	message:@"By wooy0ung"
	delegate:nil
	cancelButtonTitle:@"Ok"
	otherButtonTitles:nil];
	[alert show];
	[alert release];
	%orig;
}

%end
```

编译
```
$ make
```

提示出错，找到SpringBoard.h(可以 class-dump SpringBoard这个 Mach-O文件得到)，放到 /opt/theos/include，删除 #import <SpringBoard/SpringBoard.h>，再次make就能通过
![](/assets/img/note/2018-02-21-macos-environment/0x003-004.png)

安装tweak
```
$ make package
$ make install
```

输入两次root密码后，设备自动重启，然后就能看到效果
![](/assets/img/note/2018-02-21-macos-environment/0x003-005.png)
![](/assets/img/note/2018-02-21-macos-environment/0x003-006.png)


## 0x004 iOS app砸壳

编译
```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/dumpdecrypted
$ cd dumpdecrypted
$ sudo make
```
![](/assets/img/note/2018-02-21-macos-environment/0x004-001.png)

ssh连上iOS
```
# 密码默认alpine（可用passwd命令更改）
$ ssh root@192.168.2.115
```

关闭所有后台app，保留待破解app
```
root# ps -e | grep /Application
 1816 ??         0:01.12 /Applications/MobileMail.app/MobileMail
 1823 ??         0:01.09 /Applications/MobileSMS.app/MobileSMS
 1883 ??         0:03.83 /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
 1891 ttys000    0:00.00 grep /Application
```

注入目标app，找到Documents路径
```
$ cycript -p WeChat
cy# [[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDoma ns:NSUserDomainMask][0]
#"file:///var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/"
```

将dumpdecrypted.dylib复制到Documents
```
$ scp ~/dumpdecrypted/dumpdecrypted.dylib root@172.20.10.1:/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/
```

砸壳，会在当前目录下生成WeChat.decrypted
```
// DYLD_INSERT_LIBRARIES=/path/to/dumpdecrypted.dylib /path/to/executable
root# DYLD_INSERT_LIBRARIES=/var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/Documents/dumpdecrypted.dylib /var/mobile/Applications/DD9A6BD4-0DD8-4A4E-9E0C-3B5C017B3436/WeChat.app/WeChat
```
![](/assets/img/note/2018-02-21-macos-environment/0x004-002.png)

WeChat.decrypted复制到mac
```
scp root@172.20.10.1:~/WeChat.decrypted ~/
```

class-dump头文佳
```
//到 http://stevenygard.com/projects/class-dump/ 下载class-dump-3.5.dmg，将dmg包里的executable复制到 /usr/local/bin
$ sudo chmod 777 /usr/local/bin/class-dump
$ class-dump -s -S -H ~/WeChat.decrypted -o ~/header
```

dump出8000+的header，砸壳成功
![](/assets/img/note/2018-02-21-macos-environment/0x004-003.png)


## 0x005 利用lldb调试app

将本地2222端口转发到iOS的22端口
```
$ /Users/wooy0ung/toolchain/operation_system/OSX/Debuggers/usbmux/tcprelay.py -t 22:2222
Forwarding local port 2222 to remote port 22
Incoming connection to 2222
Waiting for devices...
```

ssh过去, debugserver attach待调试应用
```
$ ssh root@localhost -p 2222
$ root@localhost's password:
root# debugserver *:7000 -a "level1"
root# debugserver-310.2 for arm64.
Attaching to process level1...
```

本地7000端口转发到iOS的7000端口
```
$ /Users/wooy0ung/toolchain/operation_system/OSX/Debuggers/usbmux/tcprelay.py -t 7000:7000
Forwarding local port 7000 to remote port 7000
Incoming connection to 7000
Waiting for devices...
```

lldb attach
```
$ lldb
(lldb) process connect connect://localhost:7000
```
![](/assets/img/note/2018-02-21-macos-environment/0x005-001.png)


## 0x006 用Voltron增强lldb

安装Voltron
```
$ sudo svn checkout https://github.com/wooy0ung/ios/trunk/voltron
$ cd voltron
$ ./install.sh

# 这里有个bug，voltron的executable会自动链接到/usr/local/bin，要再通过brew安装
$ brew install voltron
```

开启lldb本地调试，下断，运行
```
$ lldb ./test
$ b 1
$ r
```
![](/assets/img/note/2018-02-21-macos-environment/0x006-001.png)

开启Voltron观测窗口
```
$ voltron view disasm
$ voltron view breakpoints
$ voltron view backtrace
$ voltron view stack
$ voltron view register
```
![](/assets/img/note/2018-02-21-macos-environment/0x006-002.png)


## 0x007 配置新版theos越狱开发环境

安装打包 & 签名工具
```
$ brew install dpkg ldid
```

安装theos
```
$ sudo git clone --recursive https://github.com/theos/theos.git /opt/theos
```

赋予权限
```
$ sudo chown $(id -u):$(id -g) /opt/theos
```

添加环境变量(.bash_profile)
```
export THEOS=/opt/theos
export PATH=/opt/theos/bin/:$PATH
```

测试
```
$ nic.pl
NIC 2.0 - New Instance Creator
------------------------------
  [1.] iphone/activator_event
  [2.] iphone/application_modern
  [3.] iphone/cydget
  [4.] iphone/flipswitch_switch
  [5.] iphone/framework
  [6.] iphone/ios7_notification_center_widget
  [7.] iphone/library
  [8.] iphone/notification_center_widget
  [9.] iphone/preference_bundle_modern
  [10.] iphone/tool
  [11.] iphone/tweak
  [12.] iphone/xpc_service
Choose a Template (required):
```

注意: 新版theos“sudo /opt/theos/bin/bootstrap.sh substrate”这一句已经去除, 也不用到 Cydia 下 copy libsubstrate.dylib, 相比旧版来说简化了安装步骤。


## 0x008 配置MonkeyDev集成环境

安装最新版的Xcode9 & theos
```
$ sudo xcode-select -s /Applications/Xcode_9.0.app/Contents/Developer
```

安装MonkeyDev
```
$ cd /opt
$ git clone https://github.com/AloneMonkey/MonkeyDev.git
$ cd MonkeyDev/bin
$ sudo ./md-install
# 卸载
$ sudo ./md-uninstall
```

完成后, 到新建工程界面, 如下图就是成功装上
![](/assets/img/note/2018-02-21-macos-environment/0x008-001.png)

新建一个MonkeyApp
![](/assets/img/note/2018-02-21-macos-environment/0x008-002.png)

直接编译安装到iOS, 打开Reveal8也能正常连接
![](/assets/img/note/2018-02-21-macos-environment/0x008-003.png)

参考:
[iOSOpenDev修改版MonkeyDev](http://www.alonemonkey.com/2017/06/28/monkeydev/)
[无须越狱、自动集成、只需要一个砸壳的应用---MonkeyDev](http://www.alonemonkey.com/2017/07/12/monkeydev-without-jailbreak/)


## 0x009 安装wine容器

安装wine & winetricks
```
$ brew install wine
$ brew install winetricks
```

配置wine & winetricks
```
$ winecfg
```

弹出需要下载缺少的组件，选择是即可，然后选择windows 7版本
![](/assets/img/note/2018-02-21-macos-environment/0x009-001.png)

安装常用组件
```
$ winetricks comctl32
$ winetricks comctl32ocx
$ winetricks comdlg32ocx
$ winetricks riched30
$ winetricks richtx32
$ winetricks mdac28
$ winetricks jet40
$ winetricks mfc42
$ winetricks msxml6
$ winetricks vb6run
$ winetricks vcrun6sp6
$ winetricks vcrun2003
$ winetricks vcrun2005
$ winetricks vcrun2008
$ winetricks vcrun2010
$ winetricks vcrun2012
$ winetricks vcrun2013
$ winetricks vcrun2015
```

配置字体 & 显示
```
$ winetricks wenquanyi
$ winetricks fakechinese
$ winetricks ddr=opengl
$ winetricks fontsmooth=rgb
```

关闭输出调试信息
```
// 将 export WINEDEBUG=-all 添加到 .bash_profile
$ source ./.bash_profile
```

常用命令
```
$ wine *.exe
$ wine msiexec /i *.msi
$ regedit	# 注册表
$ control	# 控制面板
```


## 0x010 安装Reveal8 & 分析iOS UI

说明:  
最近在配置MonkeyDev, 因为是 iOS 10.3.2 的机器, 旧版的Reveal都不能正常工作...  
找到一个Reveal8的破解版, 但破解者需要收费, 这就不太厚道了...下面就来破解这个简单的激活码校验。

将包里的 librevealcrack.dylib 拖到hopper分析
![](/assets/img/note/2018-02-21-macos-environment/0x010-001.png)

这些方法与注册窗口相关, 接下来确定那个是注册窗口中"Go"按钮的调用方法, 可以用lldb测试
```
$ lldb
(lldb) process attach --pid reveal_pid
(lldb) list image -o -f
(lldb) br s -a librevealcrack.dylib_base_addr+0x0000000000001c85
```
按下"Go", 断点断下, 确定[RegisterWindow hhhhjjjjjxxxx]是关键方法

![](/assets/img/note/2018-02-21-macos-environment/0x010-002.png)
这里字串比较不相同返回 0, 跳到激活失败, 直接nop掉, 但重启后无效

再看看校验流程, 源串经过 base64hmacsha1(key=NSLog) 加密后, 与输入串比较
![](/assets/img/note/2018-02-21-macos-environment/0x010-003.png)

发现激活码直接通过NSLog打印出来了, 打开控制台观察Reveal
![](/assets/img/note/2018-02-21-macos-environment/0x010-004.png)
"ens:"后面的字串就是激活码


## 0x011 解决Github Authentication failed

说明：
今天mac出现 login fail 问题, 终于修好了, 因为更改了钥匙串, github desktop 又出现 Authentication failed 的问题。  
![](/assets/img/note/2018-02-21-macos-environment/0x010-001.png)

先用以下命令完成一次push
```
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```

中途提示输入username和password
```
Username for 'https://github.com': wooy0ung
Password for 'https://wooy0ung@github.com':
```

输入后push完成, 回到 github desktop 注销账号后再登入, 以后就正常了


## 0x012 配置php环境

打开Apache
```
$ sudo apachectl start
Password:
/System/Library/LaunchDaemons/org.apache.httpd.plist: service already loaded
```

访问localhost, 确认Apache正常
![](/assets/img/note/2018-02-21-macos-environment/0x011-001.png)

Apache添加php支持
```
$ sudo nano /etc/apache2/httpd.conf
Password:
```

取消这句注释
```
LoadModule php5_module libexec/apache2/libphp5.so
```

重启Apache
```
$ sudo apachectl restart
```

cd到/Library/WebServer/Documents, sudo nano demo.php新建一个文件, 贴上以下代码
```
<?php phpinfo(); ?>
```

浏览器访问localhost/demo.php, 确认是否正常
![](/assets/img/note/2018-02-21-macos-environment/0x011-002.png)

选择Tools->Build System->New Build System..., 贴入以下代码
```
{ 
    "cmd": ["php", "$file"],
    "file_regex": "php$", 
    "selector": "source.php" 
}
```

更名为php.sublime-build, 保存在默认目录
```
<?php
$strDemo = 'demo';
echo $strDemo;
?>
```

新建一个文件, 贴入以上代码, 保存为demo.php
![](/assets/img/note/2018-02-21-macos-environment/0x011-003.png)

Build System选择php, command+B运行
![](/assets/img/note/2018-02-21-macos-environment/0x011-004.png)


## 0x013 用tmuxinator更好管理你的lldb

安装tmux、tmuxinator
```
$ brew install tmux
$ gem install tmuxinator
```

配置
```
$ export EDITOR='nano'
$ echo $EDITOR
$ tmuxinator new voltron
```

修改配置文件
```
# ~/.tmuxinator/voltron.yml
name: voltron
root: ~/
windows:
  # two spaces
  - madhax:
      # four spaces
      layout: 15a8,169x41,0,0{147x41,0,0[147x13,0,0{81x13,0,0,60,65x13,82,0,61},147x19,0,14,62,147x7,0,34{89x7,0,34,63,57x7,90,34,64}],21x41,148,0,65}
      panes:
        # two spaces
        - voltron view disasm
        - voltron view bp
        - lldb
        - voltron view stack
        - voltron view bt
        - voltron view reg
```

以后需要lldb，直接
```
$ tmuxinator start voltron
```
退出直接C-b + k即可


## 0x014 安装angr二进制分析环境

创建一个虚拟环境
```
$ virtualenv angr
```

打开
```
$ source ./angr/bin/activate
```

安装angr
```
$ pip install angr-only-z3-custom
$ pip install angr
```

退出
```
$ deactivate
```


## 0x015 显示隐藏文件

```
defaults write com.apple.finder AppleShowAllFiles -boolean true ; killall Finder
```


## 0x016 解决gem命令被墙

起因
```
wooy0ungdeMac:~ wooy0ung$ gem install tmuxinator
ERROR:  Could not find a valid gem 'tmuxinator' (>= 0), here is why:
          Unable to download data from https://rubygems.org/ - SSL_connect returned=1 errno=0 state=SSLv2/v3 read server hello A: tlsv1 alert protocol version (https://rubygems.org/latest_specs.4.8.gz)
wooy0ungdeMac:~ wooy0ung$ 
```

解决：使用淘宝镜像
```
wooy0ungdeMac:~ wooy0ung$ gem sources --add https://ruby.taobao.org/ --remove https://rubygems.org/
https://ruby.taobao.org/ added to sources
https://rubygems.org/ removed from sources
wooy0ungdeMac:~ wooy0ung$ gem sources -l
*** CURRENT SOURCES ***

https://ruby.taobao.org/
wooy0ungdeMac:~ wooy0ung$
```


## 0x017 解决安装tmuxinator时ruby版本过低

起因
```
wooy0ungdeMac:~ wooy0ung$ sudo gem install tmuxinator
ERROR:  Error installing tmuxinator:
  tmuxinator requires Ruby version >= 2.2.7.
```

安装ruby管理器rvm
```
$ curl -L get.rvm.io | bash -s stable
$ source ~/.rvm/scripts/rvm
$ rvm -v
rvm 1.29.4 (latest) by Michal Papis, Piotr Kuczynski, Wayne E. Seguin [https://rvm.io]
```

安装ruby
```
$ rvm list known
$ rvm install 2.3.7
```

查看已安装
```
$ rvm list
```

设置默认版本
```
$ rvm use 2.3.7 --default
```

设置一下源以后，再重新安装tmuxinator

不再需要时，可通过这个命令卸载
```
rvm remove 2.3.7
```