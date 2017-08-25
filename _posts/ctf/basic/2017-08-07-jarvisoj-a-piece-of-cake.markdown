---
layout:     post
title:      jarvisoj A Piece Of Cake
author:     wooy0ung
tags: 		basic
category:  	ctf
---


### 0x00 introduction

```
Problem Address:
https://www.jarvisoj.com

Problem Description:
nit yqmg mqrqn bxw mtjtm nq rqni fiklvbxu mqrqnl xwg dvmnzxu lqjnyxmt xatwnl, rzn nit uxnntm xmt zlzxuuk mtjtmmtg nq xl rqnl. nitmt vl wq bqwltwlzl qw yivbi exbivwtl pzxuvjk xl mqrqnl rzn nitmt vl atwtmxu xamttetwn xeqwa tsftmnl, xwg nit fzruvb, nixn mqrqnl ntwg nq gq lqet qm xuu qj nit jquuqyvwa: xbbtfn tutbnmqwvb fmqamxeevwa, fmqbtll gxnx qm fiklvbxu ftmbtfnvqwl tutbnmqwvbxuuk, qftmxnt xznqwqeqzluk nq lqet gtamtt, eqdt xmqzwg, qftmxnt fiklvbxu fxmnl qj vnltuj qm fiklvbxu fmqbtlltl, ltwlt xwg exwvfzuxnt nitvm twdvmqwetwn, xwg tsivrvn vwntuuvatwn rtixdvqm - tlftbvxuuk rtixdvqm yivbi evevbl izexwl qm qnitm xwvexul. juxa vl lzrlnvnzntfxllvldtmktxlkkqzaqnvn. buqltuk mtuxntg nq nit bqwbtfn qj x mqrqn vl nit jvtug qj lkwnitnvb rvquqak, yivbi lnzgvtl twnvnvtl yiqlt wxnzmt vl eqmt bqefxmxrut nq rtvwal nixw nq exbivwtl.

提交格式：PCTF{flag}
```
<!-- more -->


### 0x01 分析

观察密文, 应该是替换密码, 先找一下字母使用频率表

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x00.png)

再来统计一下密文中各个字母出现的次数

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x01.png)

先建立一个最初的字典, 只有2个索引项, 参照使用频率表确定第3项

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x02.png)

尝试 q -> a, 解密后没发现有用信息

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x03.png)

尝试 q -> o, 发现 to go 等词, 猜测此项正确

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x04.png)

继续猜解字典第4项, 发现 xl vl 是2个字母的单词

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x05.png)

找到一份2个字母单词的整理文档, 猜测 xl vl 对应 as is

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x06.png)

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x07.png)

继续猜解第5项, 以下2处可以确定 x 对应 a, 那么 v 就对应 i

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x08.png)

继续下去, 直到补全 23 项的对应关系

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x09.png)

注意, p -> p 项指向自身, 比较特殊, 但此项在最后不影响我们猜解

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x0a.png)

最后得到完整的字典

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x0b.png)


### 0x02 decrypt

```
#!/usr/bin/python
# -*- coding:utf8 -*-

import sys

FILENAME = 'encrypt.txt'

chart = 'abcdefghijklmnopqrstuvwxyz'
letters = 'abdefgijklmnpqrstuvwxyz'
dest_str = list('etaoinshrdlcumwfgypbvkjxqz')
dict_count = 0
letter_num = 23
dict = {}
freq_dict = {}
 
def get_freq(encrypt_str):
    for letter in encrypt_str:
    	if letter < 'A' or (letter >'Z' and letter < 'a') or letter > 'z':
    		continue 
        freq_dict[letter]=freq_dict.get(letter,0)+1

def print_dict():
	print "----------------------------"
	print "|           dict           |"
	print "----------------------------"
	for i in range(0,dict_count):
		print "[ %c -> %c ]" % (freq_dict[i][0], dict[freq_dict[i][0]])
	print ""

def init_dict(freq_dict,dest_str):
	global dict_count
	for i in range(26):
		dict[chr(ord('a')+i)] = chr(ord('a')+i)
	dict[','] = ','
	dict[':'] = ':'
	dict['-'] = '-'
	dict['.'] = '.'
	dict[' '] = ' '

	dict[freq_dict[0][0]] = dest_str[0]
	dict[freq_dict[1][0]] = dest_str[1]
	dest_str[0] = '0'
	dest_str[1] = '0'
	dict_count = 2
	print_dict()

def decrypt():
	print "----------------------------"
	print "|          decrypt         |"
	print "----------------------------"
	for i in range(len(encrypt_str)):
		sys.stdout.write(dict[encrypt_str[i]])
	print ""
	print ""

def guess():
	global dict_count

	while True
		while True:
			print "choose: %c -> [ " % freq_dict[dict_count][0],
			for i in range(26):
				if dest_str[i] == '0':
					continue
				print "%c" % dest_str[i],
			print " ] ?"

			ch = raw_input("input: ")
			dict[freq_dict[dict_count][0]] = ch
			dict_count = dict_count + 1
			print_dict()
			decrypt()
			print "press [y] for next letter, or [n] to retry..."
			select = raw_input("input: ")
			print ""
			if select == 'y':
				dest_str[dest_str.index(ch)] = '0'
				break
			dict_count = dict_count - 1
		if freq_dict[dict_count-1][0] == 'p':
			break;
	print ""
	print "may be you successfully decrypt!!!"


encrypt_str = open(FILENAME,'r').read()
print "----------------------------"
print "|          encrypt         |"
print "----------------------------"
print encrypt_str
print ""

get_freq(encrypt_str)
freq_dict = sorted(freq_dict.items(), key = lambda d: d[1], reverse=True)
print "----------------------------"
print "|         frequency        |"
print "----------------------------"
for i in range(len(freq_dict)):
	print '%s: %d' % (freq_dict[i][0],freq_dict[i][1])
print ""

init_dict(freq_dict, dest_str)
guess()
```
最后根据字典解密, 得到明文, getflag~

![](/assets/img/ctf/basic/2017-08-07-jarvisoj-a-piece-of-cake/0x0c.png)

### 0x03 后记

这题也可以直接用工具解

#### 传送门: [http://quipqiup.com](http://quipqiup.com)