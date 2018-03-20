---
layout:		post
title:		环境搭建之Python篇
author:		wooy0ung
tags:		python
category:  	note
---


>[索引目录]  
>0x001 解决ImportError: No module named pcapy  
>0x002 安装Microsoft Visual C++ Compiler for Python 2.7  
>0x003 解决Cannot open include file: 'pcap.h'  
>0x004 解决ImportError: No module named setuptools  
<!-- more -->  


## 0x001 ImportError: No module named pcapy

```

```


## 0x002 安装Microsoft Visual C++ Compiler for Python 2.7

现象
```
running install                                                                                                 
running bdist_egg                                                                                               
running egg_info                                                                                                
creating pcapy.egg-info                                                                                         
writing pcapy.egg-info\PKG-INFO                                                                                 
writing top-level names to pcapy.egg-info\top_level.txt                                                         
writing dependency_links to pcapy.egg-info\dependency_links.txt                                                 
writing manifest file 'pcapy.egg-info\SOURCES.txt'                                                              
reading manifest file 'pcapy.egg-info\SOURCES.txt'                                                              
reading manifest template 'MANIFEST.in'                                                                         
writing manifest file 'pcapy.egg-info\SOURCES.txt'                                                              
installing library code to build\bdist.win32\egg                                                                
running install_lib                                                                                             
running build_ext                                                                                               
building 'pcapy' extension                                                                                      
error: Microsoft Visual C++ 9.0 is required (Unable to find vcvarsall.bat). Get it from http://aka.ms/vcpython27
```

安装VCForPython27.msi


## 0x003 解决Cannot open include file: 'pcap.h'

现象
```
pcapdumper.cc
pcapdumper.cc(11) : fatal error C1083: Cannot open include file: 'pcap.h': No such file or directory
error: command '"C:\Users\wooy0ung\AppData\Local\Programs\Common\Microsoft\Visual C++ for Python\9.0\VC\Bin\cl.exe"' failed with exit status 2
```


## 0x004 解决ImportError: No module named setuptools

现象
```
Traceback (most recent call last):
  File "setup.py", line 5, in <module>
    from setuptools import setup, Extension
ImportError: No module named setuptools
```

安装setuptools-0.6c11.win32-py2.7.exe