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
<!-- more -->


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