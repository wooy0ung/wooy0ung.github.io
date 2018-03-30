---
layout:		post
title:		pwn命令记录篇
author:		wooy0ung
tags:		  pwn
category: note
---


>[索引目录]  
>0x001 ROPgadget  
>0x002 Python  
<!-- more -->



C代表ctrl键

tmux命令及使用
 
tmux #开启tmux
tmux ls #显示已有tmux列表（C-b s）
tmux attach-session -t 数字 #选择tmux
 
C-b c 创建一个新的窗口    
C-b n 切换到下一个窗口
C-b p 切换到上一个窗口
C-b l 最后一个窗口,和上一个窗口的概念不一样哟,谁试谁知道
c-b w 通过上下键选择当前窗口中打开的会话
 
C-b 数字 直接跳到你按的数字所在的窗口
C-b & 退出当前窗口
C-b d 临时断开会话 断开以后,还可以连上的哟:)
C-b " 分割出来一个窗口 （横向）
C-b % 分割出来一个窗口 （纵向）
 
C-b o 在小窗口中切换    
C-b (方向键)
C-b ! 关闭所有小窗口
C-b x 关闭当前光标处的小窗口
C-b t 钟表
C-b pageup/pagedo