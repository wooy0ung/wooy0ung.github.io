---
layout:     post
title:      Github Pages + Jekyll搭建个人博客
author:     wooy0ung
tags: 		others
category:  	note
---

- 目录
{:toc #markdown-toc}

### 0x001 注册Github

注册
![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x001.png)

创建repository
<!-- more -->
![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x002.png)


### 0x01 安装 Github Desktop

```
// 从 https://desktop.github.com/ 下载安装
```

找到repository的地址
![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x003.png)

用 Github Desktop clone到本地
![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x004.png)


### 0x02 安装Jekyll

```
$ gem install bundler
$ gem install jekyll
```

选择合适的主题，可以从github上fork，放到前面clone的本地仓库，然后开启本地服务
```
jekyll server
```

提示缺少jekyll组件？
```
# 几个常用组件，其他依赖组件安装方法类似
gem install jekyll-sitemap
gem install jekyll-gist
gem install jekyll-mentions
gem install jekyll-feed
```


### 0x03 push到github

```
$ git add --all
$ git commit -m "Initial commit"
$ git push -u origin master
```


### 0x04 域名绑定

之前用的是Godaddy，但不知为什么，账号前几天登不上，还是改用万网了

进入域名控制台，选择解析

![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x005.png)
新建一条CNAME记录，主机记录填www，记录值填github地址，如username.github.io

![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x006.png)

在username.github.io仓库新建一个CNAME文件，写入注册的域名

![](/assets/img/note/2017-06-20-github-pages-and-jekyll/0x07.png)

完成后，通过访问域名，就能跳转到自己的博客