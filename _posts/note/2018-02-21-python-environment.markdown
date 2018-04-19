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
>0x005 解决pip list警告  
>0x006 安装自定义模块  
<!-- more -->  
>0x007 解决"No module named Crypto.Cipher"  


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


## 0x005 解决pip list警告

现象
```
DEPRECATION: The default format will switch to columns in the future. You can use --format=(legacy|columns) (or define a format=(legacy|columns) in your pip.conf under the [list] section) to disable this warning
```

pip >= 9.0.1，创建C:\Users\wooy0\pip\pip.ini，添加
```
[list] 
format=columns
```


## 0x006 安装自定义模块

新建一个setup.py文件
```
from distutils.core import setup
  
setup(name = 'roputils',
      version = '1.0',
      py_modules = ['roputils'],
     )
```

打包并安装
```
$ python setup.py sdist
$ python setup.py install
```


## 0x007 解决"No module named Crypto.Cipher"

安装VCForPython27.msi

下载
pycrypto
```
https://pypi.org/project/pycrypto/#files
```

编译
```
> python setup.py build
```

提示"error: Unable to find vcvarsall.bat"，找到C:\Python27\Lib\distutils\msvc9compiler.py
在vcvarsall = find_vcvarsall(version)下面添加这句
```
vcvarsall = "C:\Users\wooy0ung\AppData\Local\Programs\Common\Microsoft\Visual C++ for Python\9.0"+"/vcvarsall.bat"
```

安装
```
> python setup.py install
```