---
layout:     post
title:      ebCTF Dice Game
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Description:  
>Beat our dice game and get the flag  
>先跑一遍, 是个小游戏
![](/assets/img/writeup/re/2017-09-16-ebctf-dice-game/0x00.png)
<!-- more -->


### 0x00 crack

直接跳转到目标块

![](/assets/img/writeup/re/2017-09-16-ebctf-dice-game/0x01.png)

打开 HT, 将跳转到 Game Over 的5处地方nop掉

![](/assets/img/writeup/re/2017-09-16-ebctf-dice-game/0x02.png)

再跑一遍, getflag~

![](/assets/img/writeup/re/2017-09-16-ebctf-dice-game/0x03.png)