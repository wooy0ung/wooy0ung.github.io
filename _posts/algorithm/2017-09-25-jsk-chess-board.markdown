---
layout:     post
title:      计蒜客 棋盘覆盖
author:     wooy0ung
tags: 	    alg
category:   algorithm
password:   yes
---


>问题描述:  
>在一个(2^k)×(2^k)个放个组成的棋盘中，若恰有一个方格与其他方格不同，则称该方格为一特殊方格，且称该棋盘为一特殊棋盘。  
>  
>在棋盘覆盖问题中，要用如下四种不同形态的L型骨牌覆盖一个给定的特殊棋盘上除特殊方格以外的所有方格，且任何2个L型骨牌不得重叠覆盖。易知，在任何一个2^k * 2^k的批判覆盖中，用到的L型骨牌个数恰好为((4^k) -1) / 3。  
<!-- more -->
>  
>输入格式:  
>多组测试样例。每组测试样例给定k(1≤k≤10)、x、 y，代表这是一个(2^k)×(2^k)的棋盘，x和y代表特殊方格的位置（坐标从0开始）。  
>输出格式:  
>对于每组测试样例，输出你设计的棋盘。给每个骨牌编号（编号从1 到((4^k)-1)/3，特殊方格用0编号）。若有多种方案，请任意输出一种即可。  
>样例输入:  
>2 0 1  
>样例输出:  
>2 0 3 3  
>2 2 1 3  
>4 1 1 5  
>4 4 5 5  


思路: 将棋盘分成4块, 其中1块有特殊块, 用方块填充棋盘中央(除去含有特殊块的)。
这样可看作4块小棋盘都有特殊块, 递归下去, 直到问题规模为1。

```
#include <iostream>
#include <cmath>
using namespace std;

int **gpn;
int gt=1;

//tr:棋盘左上角方格的行号 tc:棋盘左上角方格列号 dr:特殊方格所在的行号 dc:特殊方格所在的列号 s:棋盘的行数或列数
void chess(int tr,int tc,int dr,int dc,int as){
    if(as==1)
        return;

    int t=gt++,s=as/2;

    //左上
    if(dr<tr+s&&dc<tc+s)
        chess(tr,tc,dr,dc,s);
    else{
        gpn[tr+s-1][tc+s-1]=t;
        chess(tr,tc,tr+s-1,tc+s-1,s);
    }

    //右上
    if(dr<tr+s&&dc>=tc+s)
        chess(tr,tc+s,dr,dc,s);
    else{
        gpn[tr+s-1][tc+s]=t;
        chess(tr,tc+s,tr+s-1,tc+s,s);
    }

    //左下
    if(dr>=tr+s&&dc<tc+s)
        chess(tr+s,tc,dr,dc,s);
    else{
        gpn[tr+s][tc+s-1]=t;
        chess(tr+s,tc,tr+s,tc+s-1,s);
    }

    //右下
    if(dr>=tr+s&&dc>=tc+s)
        chess(tr+s,tc+s,dr,dc,s);
    else{
        gpn[tr+s][tc+s]=t;
        chess(tr+s,tc+s,tr+s,tc+s,s);
    }
}

int main() {
    int k,x,y,s;
    while(cin>>k>>x>>y){
        s=pow(2,k);
        gt=1;
        gpn=new int*[s];
        for(int i=0;i<s;i++){
            gpn[i]=new int[s];
            for(int j=0;j<s;j++)
                gpn[i][j]=0;
        }
        /*
        for(int i=0;i<s;i++){
            for(int j=0;j<s;j++){
                cout<<gpn[i][j]<<' ';
            }
            cout<<'\n';
        }*/

        chess(0,0,x,y,s);

        for(int i=0;i<s;i++){
            for(int j=0;j<s;j++){
                cout<<gpn[i][j]<<' ';
            }
            cout<<'\n';
        }

        for(int i=0;i<s;i++)
            delete[] gpn[i];
        delete[] gpn;
    }

    return 0;
}
```