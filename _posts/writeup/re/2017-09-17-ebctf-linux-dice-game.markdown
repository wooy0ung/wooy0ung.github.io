---
layout:     post
title:      ebCTF Linux Dice Game
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>从所给文件中找flag  
>还是 dice game 小游戏  
![](/assets/img/writeup/re/2017-09-17-ebctf-linux-dice-game/0x00.png)
<!-- more -->


### 0x00 crack

直接修改指令, 使能够最终跳到目的块

![](/assets/img/writeup/re/2017-09-17-ebctf-linux-dice-game/0x01.png)

打开 HT, 共需修改 10 处指令

![](/assets/img/writeup/re/2017-09-17-ebctf-linux-dice-game/0x02.png)

再次运行, getflag~

![](/assets/img/writeup/re/2017-09-17-ebctf-linux-dice-game/0x03.png)