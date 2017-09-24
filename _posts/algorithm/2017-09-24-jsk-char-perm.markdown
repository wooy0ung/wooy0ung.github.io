---
layout:     post
title:      计蒜客 字符全排列
author:     wooy0ung
tags: 	    alg
category:   algorithm
---


>问题描述:  
>输入一个可能含有重复字符的字符串，打印出该字符串中所有字符的全排列，输出时以字典序顺序输出，用空格分隔。  
>输入数据是一个长度不超过10个字符的字符串，以逗号结尾。    
<!-- more -->

>样例输入:  
> abc,  
>样例输出:  
> abc acb bac bca cab cba  


先是无序的字符全排列

```
#include <iostream>
#include <algorithm>
#include <string>
using namespace std;
int flag=0;

void charArray(string s,int l,int h){
	if(l==h)
	{
		if(flag==0)
			flag=1;
		else
			cout<<' ';
		for (int i=0; i<=h; i++)
			cout<<s[i];
	}
	for(int i=l;i<=h;i++){
		swap(s[i],s[l]);
		charArray(s,l+1,h);
		swap(s[i],s[l]);
	}
}

int main(){
	string str;
	while(cin>>str){
		str.resize(str.length()-1);
		sort(str.begin(),str.end());
		charArray(str,0,str.length()-1);
	}
	
	return 0;
}
```

递归过程如下

![](/assets/img/algorithm/2017-09-24-jsk-char-perm/0x00.png)

注意到cba、cab的输出顺序不对, 下面将递归数据insert到集合, 得到有序的字符全排列

```
#include <iostream>
#include <algorithm>
#include <string>
#include <set>
using namespace std;
set<string> setStr;

void charArray(string s,int l,int h){
	if(l==h)
	{
		setStr.insert(s);
		return;
	}
	for(int i=l;i<=h;i++){
		swap(s[i],s[l]);
		charArray(s,l+1,h);
		swap(s[i],s[l]);
	}
}

int main(){
	string str;
	while(cin>>str){
		str.resize(str.length()-1);
		sort(str.begin(),str.end());
		charArray(str,0,str.length()-1);
		
		set<string>::iterator it=setStr.begin();
		cout<<*it;
		for(++it; it!=setStr.end(); ++it) 
        	cout<<' '<<*it;
	}
	
	return 0;
}
```