---
layout:     post
title:      ssh 连接 vps 验证失败
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>某日将 vps rebuild, 再次 ssh 连上去就出现验证失败...  
![](/assets/img/note/2017-09-04-ubuntu-ssh-fail/0x00.png)
<!-- more -->


### 0x00 解决

.ssh/known_hosts 记录远程着主机的公钥, 主机 rebuild 后还是用旧key去登录自然连不上, 输入以下命令

```
$ ssh-keygen -R VPS_IP
```

再次连接询问是否添加公钥, 确认后就能正常连接