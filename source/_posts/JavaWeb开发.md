---
title: JavaWeb开发
date: 2025-05-30 21:20:00
updated: 2025-06-23 08:30:00
tags: [Hexo, 博客,JavaWeb]
categories: [技术, 前端]
toc: true   
comments: true
description: 学习JavaWeb开发基础知识时的笔记
author: 扎西尖措
---
- 扎西尖措

# 学习路线



## 前端开发

1. Web前端开发技术栈：HTML、CSS、JS
2. 异步交互技术：Ajax、Axios
3. 前端js框架：vue、基于vue的桌面端组件库Element
4. 前端工程化，vue脚手架

## 后端开发

1. Java项目构建工具Maven
2. SpringBoot基础（Spring的IOC、DI等）
3. 基于SpringBoot学习SpringMVC基础
4. MySQL
5. 通过Java语言操作关系型数据库（JDBC、Mybatis）

## 案例设计

1. 基于SpringBoot整合SSM**（Spring + Spring MVC + MyBatis）**，根据页面原型，需求，接口文档编写接口
2. 会话跟踪技术:Cookie、Session、令牌技术（JWT）
3. 令牌的统一校验（Filter、Interceptor）
4. AOP
5. SpringBoot底层原理

<span style="color:blue">前后端分离开发，基于接口交互（接口文档）。</span>

<span style="color:blue">前端-基于vue脚手架，构建工程化前端项目。</span>

<span style="color:blue">后端-基于主流SpringBoot高效学习SSM。</span>

<span style="color:blue">通过案例贯穿整个课程体系，学以致用。</span>

<span style="color:blue">参照企业开发模式，需求分析-表结构设计-接口文档-功能实现-测试。</span>

## Web网站的开发模式

### 前后端分离开发

浏览器向前端服务器发送请求，前端程序响应后浏览器向后端服务器发送请求，Java程序向数据库发送请求，数据库响应后Java程序再返回到浏览器响应

### 前后端程序混合开发

前后端程序均在一台服务器上，浏览器向服务器发送请求后，服务器将数据和前端代码一起返回给浏览器

前后端分离式开发占比远远大于前后端程序混合开发

## Web前端开发

网页组成部分：<span style="color:red">文字、图片、音频、视频、超链接等</span>

我们所看到的的网页背后的本质就是程序员所编写的<span style="color:red">前端代码</span>

<span style="color:#000000">前端代码通过</span><span style="color:red">浏览器转</span><span style="color:#000000">化（解析和渲染）成用户看到的网页</span> 

<span style="color:#000000">浏览器中对代码进行渲染的部分，称为</span><span style="color:red">浏览器内核</span>



*不同的浏览器，内核不同，对于相同的的前端代码解析的效果会存在差异。*

### Web标准

- Web标准也称为网页标准，由一系列的标准组成，大部分由w3C（Word Wide Web Consortium,万维网联盟）负责制定。

- 三个组成部分：


1. HTML：负责<span style="color:#FF0000">网页的结构</span>（页面元素和内容）

2. CSS:负责<span style="color:#FF0000">网页的表现</span>（页面元素的外观、位置等页面样式，如：颜色、大小等）。

3. JavaScript:负责<span style="color:#FF0000">网页的行为</span><span style="color:#000000">（交互效果）。</span>


#### HTML（超文本标记语言）

超文本：超越文本的限制，比普通文本更强大，除了文字信息，还可以定义图片，音频，视频等内容。

标记语言：由标签构成的语言

HTML标签都是<span style="color:#FF0000">预定义</span>好的。例如：使用<a>展示超链接，使用<img>展示图片，<video>展示视频。

HTML代码直接在浏览器中运行，HTML标签由浏览器解析。

#### CSS

- CSS(Cascading Style Sheet) : 层叠样式表，用于控制页面样式(表现)。

#### 案例  

**HTML快速入门**

1. 新建文本文件，后缀名为.html

2. 编写HTML结构标签

3. 在<body>中填写内容

1. HTML结构标签

   ```HTML
   <html>
       <head>
           <title>标题</title>
       </head>
       <body>
           
       </body>
   </html>    
   ```

2. 特点

   - HTML标签不区分大小写

   - HTML标签属性值单双引号都可以

   - HTML语法松散

     ### HTML基础标签&样式
     
     新浪新闻示例
     
     - 新浪新闻-标题
       - 标题排版
       - 标题样式
       - 超链接
     
     - 新浪新闻-正文
       - 
     
     
     #### 新浪微博-实现标题-排版
     
     - **图片标签** :**<span style="color:blue"><img></span>**
     
       - <span style="color:red">src</span>:指定图像的url ( 绝对路径 / 相对路径 )
       - <span style="color:red">width</span>:图像的宽度 ( 像素 / 相对于父元素的百分比 )
       - <span style="color:red">height</span>:图像的高度 ( 像素 / 相对于父元素的百分比 )
     
     - 标题标签**<span style="color:blue"><h1> - <h6></span>**
     
     - 水平线标签:**<span style="color:blue"><hr></span>**
     
     - 
     
       
     
     







  

  























