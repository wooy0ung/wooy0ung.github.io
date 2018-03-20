---
layout:     post
title:      JarvisOJ Classical CrackMe2
author:     wooy0ung
tags: 		re
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>做完了Classical CrackMe1是不是不太过瘾？那再来一题吧。  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/CrackMe2.rar.6886f4141bedfb27a2dd0d3dcc4f38f9  
<!-- more -->


导入到dnSpy, 发现是AES加密但被混淆过, 在此处下断

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x00.png)

断下后看数据区

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x01.png)
![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x02.png)

可以看到bytes存放着解密的key="pctf2016pctf2016pctf2016pctf2016"

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x03.png)

单步到此处, 进行密码校验

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x04.png)

查看数据区, 没发现加密的flag

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x05.png)

猜测key与enc_flag放在相邻内存, 检索"pctf2016pctf2016pctf2016pctf2016", 找到enc_flag

```
enc_flag="x/nzolo0TTIyrEISd4AP1spCzlhSWJXeNbY81SjPgmk=+"
```

写个脚本作AES解密, 注意加密模式

```
from Crypto.Cipher import AES

key='pctf2016pctf2016pctf2016pctf2016'
enc="x/nzolo0TTIyrEISd4AP1spCzlhSWJXeNbY81SjPgmk=+".decode('base64')

cryptor=AES.new(key,AES.MODE_ECB)
plain=cryptor.decrypt(enc)
print plain
```

get flag~

![](/assets/img/writeup/re/2017-10-12-jarvisoj-classical-crackme2/0x06.png)