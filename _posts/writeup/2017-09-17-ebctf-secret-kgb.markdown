---
layout:     post
title:      ebCTF Secret KGB
author:     wooy0ung
tags: 		re
category:  	writeup
---

- 目录
{:toc #markdown-toc}

>Problem Description:  
>During my time at KGB I learned how to hide all the stuff from alpha-dog. But damn it, I somehow lost some of the most important files...  
>感觉这题不是RE, 更像是隐写...
![](/assets/img/writeup/2017-09-17-ebctf-secret-kgb/0x00.png)
<!-- more -->


### 0x00 crack

发现是 ext4 filesystem data, mount 到 Linux 上

```
$ mount ~/secretArchive /mnt
```

打开有一大堆 ASCII 的文件, 写个脚本输出一下, 没有什么有用的数据

![](/assets/img/writeup/2017-09-17-ebctf-secret-kgb/0x01.png)

```
path = 'sec/'
out=''
for i in range(1986):
    out+=open(path+'secret'+str(i),'r').read()

f=open('secret.txt','w')
f.write(out)
f.close()
```

考虑到题目提醒的 KGB, 怀疑还有文件没出来, extundelete 恢复一下

```
$ extundelete --restore-all ./secretArchive
```

![](/assets/img/writeup/2017-09-17-ebctf-secret-kgb/0x02.png)

恢复的文件里有一个 .secret31337 是 KGB 格式

![](/assets/img/writeup/2017-09-17-ebctf-secret-kgb/0x03.png)

直接解密, getflag~

```
$ kgb .secret31337
```

![](/assets/img/writeup/2017-09-17-ebctf-secret-kgb/0x04.png)