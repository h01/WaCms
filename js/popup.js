// @name	WaCms:popup.js
// @what	用于Browser_action与后台操作
// @author	Holger
// @blog	http://ursb.org/
// @github	https://github.com/h01/WaCms
// @update	2014/10/30

function _show(id){
	// 显示div
	for (var i = 0; i < 3; i++) {
		$("#ui_" + i).hide();
	};
	$("#ui_" + id).show();
}
function _sendMsg(msg){
	// 发送消息到后台
	chrome.runtime.sendMessage({
		from: "pp",
		data: msg
	});
}
// 监听background消息
chrome.runtime.onMessage.addListener(function(res, sender, req){
	if (res.from !== "bg") {
		return false;
	};
	switch(res.data.act){
		case 'log':
			// 扫描日志信息
			$("#scan_log").html("正在扫描: " + res.data.log);
			break;
		case 'res':
			// 扫描结果
			$("#scan_res").html(res.data.res);
			break;
		case 'progress':
			// 扫描进度
			$("#scan_progress").html(res.data.progress);
			break;
		case 'end':
			// 扫描结束
			$("#scan_log").html("扫描结束!");
			location.reload();
			break;
		case 'getres':
			// 获取扫描结果
			$("#res_url").html(res.data.url);
			$("#res_num").html(res.data.len);
			$("#res_html").html(res.data.res);
			break;
		default:
			break;
	}
})
$(document).ready(function(){
	// 获取当前浏览器页面URL
	chrome.tabs.getSelected(null, function(e){
		try{
			$("#url").val(e.url.match(/http[s]?:\/\/[\s\S]+\//)[0]);
		}catch(e){}
	});
	// 获取后台扫描状态:0=等待扫描,1=正在扫描,2=扫描结束
	var bg = chrome.extension.getBackgroundPage();
	_show(bg.status);
	if (bg.status == "1") {
		// 正在扫描界面
		// $("#scan_res").html("加载中..");
	}else if(bg.status == "2"){
		// 扫描结束页面
		_sendMsg({
			act: 'getres'
		});
	}else{
		// 等待扫描界面
		$("#cmsnum").html('<span class="glyphicon glyphicon-stats"></span> ' + (cms_reg.length + cms_md5.length));
		$("#scan").click(function(){
			var url = $("#url").val();
			if (url == "" || !url.match(/http[s]?:\/\/[\s\S]+\//)) {
				$("#url").focus();
				return false;
			};
			_sendMsg({
				act: "scan",
				url: url
			});
			_show("1");
		})
	};
	// 返回
	$("#res_back").click(function(){
		chrome.browserAction.setBadgeText({text: ""});
		bg._reload();
		location.reload();
	});
	// 重扫
	$("#res_restart").click(function(){
		chrome.browserAction.setBadgeText({text: ""});
		_sendMsg({
			act: "scan",
			url: $("#res_url").text()
		});
		_show("1");
	});
	// 反馈
	$("#res_debug").click(function(){
		window.open("https://ursb.org/guest/", "_blank");
	});
	// 底部你懂的
	$("#cmsnum").click(function(){
		$("#cmsnum").hide();
		$("#author").show();
	});
	$("#author").click(function(){
		$("#author").hide();
		$("#cmsnum").show();
	})
})