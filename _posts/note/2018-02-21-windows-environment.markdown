---
layout:		post
title:		环境搭建之Windows篇
author:		wooy0ung
tags:		windows
category:  	note
---


>[索引目录]  
>0x01 关闭sublime更新提示  
>0x02 Win10鼠标卡顿修复  
<!-- more -->


### 0x01 关闭sublime更新提示

找到Preferences -> Settings-User，写入
```
"update_check":false
```

更改字号
```
"font_size":18
```


### 0x02 Win10鼠标卡顿修复

Win+R输入regedit打开注册表，在注册表展开
```
HEKY_CLASSES_ROOT\directory\background\shellex\contextmenuhandlers
```

![](/assets/img/note/2018-02-21-windows-environment.markdown/0x001.png)
保留“New”、“WorkFolders”选项，其余子项全部删除