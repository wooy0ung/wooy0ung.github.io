---
layout:     post
title:      安装 Exploit 开发利器 -- PEDA
author:     wooy0ung
tags: 		
category:  	note
---


>PEDA 2012 Blackhat 中放出的脚本工具, 依赖于 GDB, 方便编写 Exploit  
<!-- more -->


### 0x00 install

```
$ git clone https://github.com/longld/peda.git ~/peda
$ echo "source ~/peda/peda.py" >> ~/.gdbinit
```

![](/assets/img/note/2017-08-30-linux-gdb-peda/0x00.png)

安装完成, 打开 GDB 自动加载 PEDA

![](/assets/img/note/2017-08-30-linux-gdb-peda/0x01.png)