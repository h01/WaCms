// @name	WaCms:background.js
// @what	用于后台执行扫描和通知更新UI功能
// @author	Holger
// @blog	http://ursb.org/
// @github	https://github.com/h01/WaCms
// @update	2014/10/30

// UI状态;0=等待扫描,1=正在扫描,2=扫描结束
var status = "0";
var cururl = "";
var worker = new Worker("js/scan.js");
var resarr = null;
var audio  = document.createElement("audio");
audio.src  = "audio/alert.mp3";

// 创建右键菜单
var menuID = chrome.contextMenus.create({
	type: 'normal',
	title: '扫描此站cms!',
	contexts: ['page'],
	documentUrlPatterns: ["*://*/*"],
	onclick: function(info, tab){
		if (status !== "1") {
			// 设置菜单禁止
			_menu(false);
			// 发送当前url到扫描列表
			chrome.runtime.sendMessage({
				from: "pp",
				data: {
					act: "scan",
					url: info.pageUrl.match(/http[s]?:\/\/[\s\S]+\//)[0]
				}
			})
		}
	}
},function (){}
);

// 监听popup消息
chrome.runtime.onMessage.addListener(function(res, sender, req){
	if (res.from !== "pp") {
		return false;
	};
	switch(res.data.act){
		case 'scan':
			// 开始扫描啦 好激动有木有?
			resarr = Array();
			cururl = res.data.url;
			worker.postMessage({
				act: "scan",
				url: cururl
			});
			status = "1";
			_menu(false);
			break;
		case 'getres':
			_getRes();
			break;
		default:
			break;
	}
})
// 监听Worker消息
worker.onmessage = function(e){
	switch(e.data.act){
		case 'log':
			// 正在扫描
			_sendMsg({
				act: 'log',
				log: e.data.log
			});
			break;
		case 'res':
			// 扫描结果
			if (resarr.indexOf(e.data.res) == -1) {
				resarr.push(e.data.res);
			};
			_sendMsg({
				act: 'res',
				res: _resHtml()
			});
			break;
		case 'progress':
			// 扫描进度
			chrome.browserAction.setBadgeText({text: parseInt((e.data.progress.now/e.data.progress.num) * 100) + "%"});
			_sendMsg({
				act: 'progress',
				progress: e.data.progress.now + "/" + e.data.progress.num
			});
			break;
		case 'end':
			// 扫描结束
			_menu(true);
			_sendMsg({
				act: 'end'
			});
			status = "2";
			_alert();
			break;
		default:
			break;
	}
}

function _menu(ck){
	// 设置禁止|显示右键菜单
	chrome.contextMenus.update(menuID, {
		enabled: ck
	});
}
// 发送消息到popup
function _sendMsg(msg){
	chrome.runtime.sendMessage({
		from: "bg",
		data: msg
	})
}
function _resHtml(){
	// 把结果生成HTML返回
	var html = "";
	for (var i = 0; i < resarr.length; i++) {
		html += '<label class="label label-success _res"><span class="glyphicon glyphicon-tag"></span> ' + resarr[i] + '</label> ';
	};
	return html;
}
function _getRes(){
	// 获取扫描结果
	_sendMsg({
		act: "getres",
		res: _resHtml(),
		len: resarr.length,
		url: cururl
	})
}
function _reload(){
	// 重新开始设置
	resarr = null;
	status = "0";
	cururl = "";
}
function _alert(){
	// 桌面提醒用户已经扫描完成
	var n = new Notification("哇,cms扫描完毕!", {body: "目标: " + cururl + "\n结果: " + resarr.length, icon: "images/icon_128.png"});
	n.onclick = function(){n.close()};
	audio.play();
}