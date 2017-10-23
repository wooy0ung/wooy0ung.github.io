---
layout:     post
title:      天翼杯 2017 迷你游戏
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>玩游戏, 拿到一定的分数就给提示。
>  
>Download:  
>svn checkout https://github.com/wooy0ung/ctfs/trunk/write-ups-2017/%E6%B1%9F%E8%8B%8F%E7%9C%81%E5%A4%A9%E7%BF%BC%E6%9D%AF-2017/%E7%A7%BB%E5%8A%A8%E5%AE%89%E5%85%A8/%E8%BF%B7%E4%BD%A0%E6%B8%B8%E6%88%8F_50pt  
>
>Addition:  
>这是个贪吃蛇游戏, 检查源码硬是没找到在哪生成的flag, 最后还是靠战队里的大表哥@appl3做出来了, 脑洞不够大啊23333333。
<!-- more -->


### 0x00 crack

祭出神器jeb, 定位到这里

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-mini-game/0x00.png)

发现有这么两段字符串

```
"marysue.funnyj"
"涅琪落恋月盘瑟莹·呗凌洁安·琉丽璃·白·银玖姆依喃影银樱·依凤心银艾爱·燢绯塔爱莹莹·薇乐倩璃·苏妙多爱魅·琉·多之沫茜璃·柔馨柔如璃"
```

google检索一下"marysue加密", 发现这个网站, 

####传送门: [玛丽苏文本加密器](https://sulian.me/marysue/)

直接decode一下, getflag

![](/assets/img/writeup/re/2017-10-23-tianyi-2017-mini-game/0x01.png)