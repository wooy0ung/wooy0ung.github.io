---
layout:     post
title:      JarvisOJ 爱吃培根的出题人
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>听说你也喜欢吃培根？那我们一起来欣赏一段培根的介绍吧：  
>bacoN is one of aMerICa'S sWEethEartS. it's A dARlinG, SuCCulEnt fOoD tHAt PaIRs FlawLE  
>什么，不知道要干什么？上面这段巨丑无比的文字，为什么会有大小写呢？你能发现其中的玄机吗？  
>提交格式：PCTF{你发现的玄机}   
<!-- more -->


### 0x00 decrypt

去掉除字母外的字符, 以5个为一组

```
bacoN isone ofaMe rICaS sWEet hEart SitsA dARli nGSuC CulEn tfOoD tHAtP aIRsF lawLE
aaaab aaaaa aaaba abbab abbaa abaaa baaab abbaa abbab baaba aabab abbab abbab aaabb
```

注意有两种形式的培根密码

```
第一种方式：
A aaaaa B aaaab C aaaba D aaabb E aabaa F aabab G aabba H aabbb I abaaa J abaab
K ababa L ababb M abbaa N abbab O abbba P abbbb Q baaaa R baaab S baaba T baabb
U babaa V babab W babba X babbb Y bbaaa Z bbaab

第二种方式
a AAAAA		g AABBA 	n ABBAA 	t BAABA
b AAAAB 	h AABBB 	o ABBAB 	u-v BAABB
c AAABA 	i-j ABAAA 	p ABBBA 	w BABAA
d AAABB 	k ABAAB 	q ABBBB 	x BABAB
e AABAA 	l ABABA 	r BAAAA 	y BABBA
f AABAB 	m ABABB 	s BAAAB 	z BABBB
```

本题依据第2个密码表, get flag~

```
PCTF{baconisnotfood}
```