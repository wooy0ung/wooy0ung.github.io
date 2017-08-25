---
layout:     post
title:      在macOS安装wine
author:     wooy0ung
tags: 		osx
category:  	note
---


### 0x00 安装 wine & winetricks

```
$ brew install wine
$ brew install winetricks
```
<!-- more -->


### 0x01 配置 wine & winetricks

```
$ winecfg
```

弹出需要下载缺少的组件，选择是即可，然后选择windows 7版本

![](/assets/img/note/2017-06-21-macos-wine/0x00.png)


### 0x02 安装常用组件

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

### 0x03 配置字体 & 显示

```
$ winetricks wenquanyi
$ winetricks fakechinese
$ winetricks ddr=opengl
$ winetricks fontsmooth=rgb
```

### 0x04 关闭输出调试信息

```
// 将 export WINEDEBUG=-all 添加到 .bash_profile
$ source ./.bash_profile
```

### 0x05 常用命令

```
$ wine *.exe
$ wine msiexec /i *.msi
$ regedit	# 注册表
$ control	# 控制面板
```