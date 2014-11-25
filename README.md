WaCms!
======
简介
---
> 一款算是自己在chrome扩展开发中的一次小总结，使用了browser_action和background的通信，以及html5的worker的后台处理与background的通信。有点乱= =，不过自认为算是目前自己做得比较好的作品了。   
> 哇Cms!用于扫描网站所用管理系统和第三方库，比如discuz, dedecms, wordpress等cms系统，以及jquery, bootstrap和一些出名广告联盟、路由器设备等系统。   
> 目前采用了两种识别方式：1、正则匹配模式；2、md5匹配模式。cms库在js/cms.js文件中   

安装
---
1.把代码`clone`回本地
```bash
$ git clone ..
```
2.`Chrome`浏览器进入扩展程序，然后点击开发者模式，加载正在开发的扩展程序，选择下载好的目录即可

使用
---
安装完毕可以在需要扫描的网站上右键，选择`扫描此站cms!`或者点击右上角的图标即可进入扫描界面    
扫描中会有进度显示，扫描结束会有桌面提醒用户，所以大可放心在后台运行。

反馈
----
> BUG以及新功能总是要添加和修复的，以及cms库还是得更新才能强大这款小工具。    
> 有兴趣的可以直接fork it!，BUG反馈请到本人的[留言板](http://ursb.org/guest/)进行反馈，谢谢支持！