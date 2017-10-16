---
layout:     post
title:      解决Sublime Text 3中文乱码
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>每次用Sublime打开中文文本都乱码, 实在难受(´-﹏-`；), 还是解决一下吧...
<!-- more -->)  


ctrl + ~打开控制台, 贴入以下代码

```
import urllib.request,os,hashlib; h = '6f4c264a24d933ce70df5dedcf1dcaee' + 'ebe013ee18cced0ef93d5f746d80ef60'; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); by = urllib.request.urlopen( 'http://packagecontrol.io/' + pf.replace(' ', '%20')).read(); dh = hashlib.sha256(by).hexdigest(); print('Error validating download (got %s instead of %s), please try manual install' % (dh, h)) if dh != h else open(os.path.join( ipp, pf), 'wb' ).write(by)
```

Preferences->Package Control

![](/assets/img/note/2017-10-16-sublime-text3-gbk/0x00.png)

选择Package Control: install Package

![](/assets/img/note/2017-10-16-sublime-text3-gbk/0x01.png)

选中ConvertToUTF8

![](/assets/img/note/2017-10-16-sublime-text3-gbk/0x02.png)

重启后报错

```
File: /Users/wooy0ung/workspace/xxx.txt
Encoding: GB2312
Error: Codecs missing

Please install Codecs33 plugin (https://github.com/seanliang/Codecs33/tree/osx).
```

继续安装Codecs33, 重启后就正常了