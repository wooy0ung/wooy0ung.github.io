---
layout:     post
title:      ssh 解决超时自动断开
author:     wooy0ung
tags: 		
category:  	note
---


>说明:  
>默认设置下, ssh连接一段时间内没有任何操作, 连接会自动断开。  
<!-- more -->


### 0x00 解决

编辑 /etc/ssh/sshd_config

```
ClientAliveInterval 60
ClientAliveCountMax 3
```

"ClientAliveInterval 60" 表示服务器每分钟向客户端发送一次请求消息

![](/assets/img/note/2017-09-04-ssh-timeout/0x00.png)

最后, 即使空闲下 ssh 也不会断开 