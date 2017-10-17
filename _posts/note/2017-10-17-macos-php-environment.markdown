---
layout:     post
title:      macOS配置php环境
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>macOS下可以直接用phpstorm来php开发, 个人习惯用sublime, 还是配置以下环境吧......
<!-- more -->)  


### 0x00 配置Apache

打开Apache

```
$ sudo apachectl start
Password:
/System/Library/LaunchDaemons/org.apache.httpd.plist: service already loaded
```

访问localhost, 确认Apache正常

![](/assets/img/note/2017-10-17-macos-php-environment/0x00.png)

Apache添加php支持

```
$ sudo nano /etc/apache2/httpd.conf
Password:
```

取消这句注释

```
LoadModule php5_module libexec/apache2/libphp5.so
```

重启Apache

```
$ sudo apachectl restart
```

cd到/Library/WebServer/Documents, sudo nano demo.php新建一个文件, 贴上以下代码

```
<?php phpinfo(); ?>
```

浏览器访问localhost/demo.php, 确认是否正常

![](/assets/img/note/2017-10-17-macos-php-environment/0x01.png)


### 0x01 配置sublime

选择Tools->Build System->New Build System..., 贴入以下代码

```
{ 
    "cmd": ["php", "$file"],
    "file_regex": "php$", 
    "selector": "source.php" 
}
```

更名为php.sublime-build, 保存在默认目录

```
<?php
$strDemo = 'demo';
echo $strDemo;
?>
```

新建一个文件, 贴入以上代码, 保存为demo.php

![](/assets/img/note/2017-10-17-macos-php-environment/0x02.png)

Build System选择php, command+B运行

![](/assets/img/note/2017-10-17-macos-php-environment/0x03.png)