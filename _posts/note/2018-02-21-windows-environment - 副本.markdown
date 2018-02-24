---
layout:		post
title:		环境搭建之Windows篇
author:		wooy0ung
tags:		windows
category:  	note
---


>[索引目录]  
>0x001 关闭sublime更新提示  
>0x002 Win10鼠标卡顿修复  
>0x003 解决Tntel VT-x处于禁用状态  
>0x004 利用FileZilla搭建局域网  
>0x005 制作Windows XP U盘启动盘  
>0x006 解决windbg"your debugger is not using the correct symbols"错误  
<!-- more -->
>0x007 解决Sublime Text 3中文乱码
>0x008 设置java环境变量  
>0x009 安装pip环境  


## 0x001 关闭sublime更新提示

找到Preferences -> Settings-User，写入
```
"update_check":false
```

更改字号
```
"font_size":18
```


## 0x002 Win10鼠标卡顿修复

Win+R输入regedit打开注册表，在注册表展开
```
HEKY_CLASSES_ROOT\directory\background\shellex\contextmenuhandlers
```

![](/assets/img/note/2018-02-21-windows-environment/0x002-001.png)
保留“New”、“WorkFolders”选项，其余子项全部删除


## 0x003 解决Tntel VT-x处于禁用状态

现象
![](/assets/img/note/2018-02-21-windows-environment/0x003-001.png)

解决方法：进入BIOS允许虚拟化，HP在开机时点按F10进入BIOS


## 0x004 利用FileZilla搭建局域网

安装FileZilla Server，点击Connect建立连接
![](/assets/img/note/2018-02-21-windows-environment/0x004-001.png)

打开Edit->Users新建用户，添加共享目录
![](/assets/img/note/2018-02-21-windows-environment/0x004-002.png)

客户机通过主机ip和21端口进行连接，可能需要关闭防火墙


## 0x005 制作Windows XP U盘启动盘

说明:  
由于需要用到WinXP, 常规地用UltraISO烧录到 U盘。  
但一开始加载镜像就出现 "inf file txtsetup.sif is corrupt or missing status 18." 错误...  
解决方法是改用 WinSetupFromUSB 制作启动盘  

打开 WinSetupFromUSB x64 按照下图设置
![](/assets/img/note/2018-02-21-windows-environment/0x005-001.png)

烧写完成后就能成功加载


## 0x006 解决windbg"your debugger is not using the correct symbols"错误

说明:  
某天用windbg调试堆, 输入!heap时提示"not using correct symbols"  
![](/assets/img/note/2018-02-21-windows-environment/0x006-001.png)

在C盘根目录新建文件夹Symbols, 回到windbg选择File->Symbol File Path
![](/assets/img/note/2018-02-21-windows-environment/0x006-002.png)

在弹出窗口贴上
```
SRV*C:\Symbols*http://msdl.microsoft.com/download/symbols
```

![](/assets/img/note/2018-02-21-windows-environment/0x006-003.png)
重新启动调试, 现在已经正常了


## 0x007 解决Sublime Text 3中文乱码

ctrl + ~打开控制台, 贴入以下代码
```
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

Preferences->Package Control
![](/assets/img/note/2018-02-21-windows-environment/0x007-001.png)

选择Package Control: install Package
![](/assets/img/note/2018-02-21-windows-environment/0x007-002.png)

选中ConvertToUTF8
![](/assets/img/note/2018-02-21-windows-environment/0x007-003.png)

重启后报错
```
File: /Users/wooy0ung/workspace/xxx.txt
Encoding: GB2312
Error: Codecs missing

Please install Codecs33 plugin (https://github.com/seanliang/Codecs33/tree/osx).
```

继续安装Codecs33, 重启后就正常了


## 0x008 设置java环境变量

右击计算机，打开属性->高级系统设置->高级->环境变量
![](/assets/img/note/2018-02-21-windows-environment/0x008-001.png)


```
# JAVA_HOME
D:\Program Files\Java\jdk1.8.0_101

# Path添加
%JAVA_HOME%\bin;%JAVA_HOME%\jre\bin;

# CLASSPATH
.;%JAVA_HOME%\lib\dt.jar;%JAVA_HOME%\lib\tools.jar;
```

验证
![](/assets/img/note/2018-02-21-windows-environment/0x008-002.png)