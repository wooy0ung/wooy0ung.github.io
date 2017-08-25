---
layout:     post
title:      jarvisoj shellcode
author:     wooy0ung
tags: 		basic
category:  	writeup
---


>Problem Address:  
>https://www.jarvisoj.com  
>  
>Problem Description:  
>作为一个黑客，怎么能不会使用shellcode?  
>  
>这里给你一段shellcode，你能正确使用并最后得到flag吗？  
>  
>Download:  
>https://dn.jarvisoj.com/challengefiles/shellcode.06f28b9c8f53b0e86572dbc9ed3346bc  
<!-- more -->


### 0x00 execute

拿到题目, binwalk 扫不出有用信息, file 命令发现该文件都是一些 ASCII 字符

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-shellcode/0x00.png)

用 hex 编辑器打开, 估计是实现某种功能的 shellcode

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-shellcode/0x01.png)

先写一个小程序对 hex 数据进行处理

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-shellcode/0x02.png)

```
#include <stdio.h>

char source[]="50594949 49494949 4949...";
char shellcode[]=" ";

int main()
{
	printf("[source:]\n%s\n\n", source);

	int i = 0, j = 0;
	while(source[i] != '\0')
	{
		if(source[i] == ' ')
		{
			i++;
			continue;
		}
		shellcode[j++] = '\\';
		shellcode[j++] = 'x';
		shellcode[j++] = source[i++];
		shellcode[j++] = source[i++];
	}

	printf("[shellcode:]\n%s\n\n", shellcode);
	
	return 0;
}
```

再写一个程序对处理后的 shellcode 进行装载

```
#include <stdio.h>

int main()
{
	char shellcode[]="\x50\x59\x49\x49\x49...";

	printf("%s\n\n", shellcode);

	__asm
	{
		lea		eax, shellcode
		push	eax
		ret
	}

	return 0;
}
```

执行, 发现装载异常, 暂时不知道什么问题

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-shellcode/0x03.png)

最后找了一个 shellcode 装载器, 执行一下 getflag

![](/assets/img/writeup/basic/2017-08-06-jarvisoj-shellcode/0x04.png)


### 0x01 reference

[https://github.com/inquisb/shellcodeexec](https://github.com/inquisb/shellcodeexec)