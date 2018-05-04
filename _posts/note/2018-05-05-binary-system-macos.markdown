---
layout:     post
title:      macOS binary system learning
author:     wooy0ung
tags:       macos
category:   note
---


>[索引目录]  
>0x001 introduction of XNU's architecture  
>0x002 analysis of loading mach-o by dyld  
<!-- more -->


## 0x001 introduction of XNU's architecture

system's architecture
```
The User Experience layer       # ignore
The Application Frameworks layer
The Core Frameworks
Darwin                          # kernel
```

darwin's architecture
![](/assets/img/note/2018-05-05-binary-system-macos/0x001-001.png)  

XNU is darwin's kernel，a mixture of mach and bsd，mainly contains
```
Mach Micro kernel
BSD kernel
libKern
I/O Kit
```

his jobs
```
abstract of process and thread
manager of virtual memory
adjust tasks
process communications
```

BSD's work
```
UNIX process model
POSIX process model(pthread)
manager of UNIX user and group
BSD Socket API
file system
instrucment system
```

libKern provides a C++ subset for I/O Kit，and I/O Kit is driver model framework with OOP features

what's info.plist? Every app or bundle would rely on it，it provide a property list containing: 
```
some info show to user directly
label your app or which types it can support
which system framework would use to load the app 
```

codesigned? As a iOS developer, you may have a certifica，public key and private key。In macOS, it is 
acquiescently closed, but you can open by "Gatekeeper".

Mandatory Access Control, firstly used in FreeBSD 5.x, is the basic of macOS's Sandboxing and iOS entitlement.
It can label users as well as other files with constant security property, and confirm whether a users can
access the files.

sandbox, you can see this picture with traslations
![](/assets/img/note/2018-05-05-binary-system-macos/0x001-002.png)  


## 0x002 analysis of loading mach-o by dyld

