// @name	WaCms:scan.js
// @what	扫描核心Worker程序
// @author	Holger
// @blog	http://ursb.org/
// @github	https://github.com/h01/WaCms
// @update	2014/10/30

// 导入需要的js
importScripts("md5.js");
importScripts("cms.js");

var cache = Array();

// 监听消息
onmessage = function(e){
	if (e.data.act == "scan") {
		start(e.data.url);
	};
};
function scanLog(log){
	// 发送当前扫描日志
	postMessage({
		act: "log",
		log: log
	});
}
function scanProgress(num, now){
	// 发送扫描进度百分比
	postMessage({
		act: "progress",
		progress: {
			num: num,
			now: now
		}
	});
}
// 开始扫描
function start(url){
	// CMS总数
	var cms_num = cms_reg.length + cms_md5.length;
	// 当前扫描进度
	var cms_now = 0;
	var a = new XMLHttpRequest();
	// 扫描模式1::匹配
	for (var i = 0; i < cms_reg.length; i++) {
		// CMS地址
		var _url = url + cms_reg[i][1];
		// CMS名称
		var _cms = cms_reg[i][0];
		// CMS匹配
		var _reg = cms_reg[i][2];
		// 通知当前扫描CMS
		scanLog(_cms);
		// 通知当前扫描进度
		cms_now ++;
		scanProgress(cms_num, cms_now);
		// ajax获取结果
		a.onreadystatechange = function(){
			if (a.readyState == 4 && a.status == 200) {
				if (a.responseText.match(_reg) !== null) {
					// 保存到临时变量
					cache[_url] = a.responseText;
					// 通知扫描匹配成功CMS
					postMessage({
						act: "res",
						res: _cms
					});
				};
			};
		};
		// 判断本地是否有缓存 ? 匹配测试 : 发送请求
		if (cache[_url] !== undefined) {
			if (cache[_url].match(_reg)) {
				// 匹配成功
				postMessage({
					act: "res",
					res: _cms
				})
			};
		}else{
			a.open("GET", _url, false);
			a.send();
		}
	}
	// 扫描模式2:MD5匹配
	for (var i = 0; i < cms_md5.length; i++) {
		// CMS地址
		var _url = url + cms_md5[i][1];
		// CMS名称
		var _cms = cms_md5[i][0];
		// CMS-MD5
		var _md5 = cms_md5[i][2];
		// 通知当前扫描CMS
		scanLog(_cms);
		// 通知当前扫描进度
		cms_now ++;
		scanProgress(cms_num, cms_now);
		// ajax获取结果
		a.onreadystatechange = function(){
			if (a.readyState == 4 && a.status == 200) {
				// 保存到临时变量
				cache[_url] = a.responseText;
				if (hex_md5(cache[_url]) == _md5) {
					// 通知扫描匹配成功CMS
					postMessage({
						act: "res",
						res: _cms
					});
				};
			};
		};
		// 判断本地是否有缓存 ? 匹配测试 : 发送请求
		if (cache[_url] !== undefined) {
			if (hex_md5(cache[_url]) == _md5) {
				// 匹配成功
				postMessage({
					act: "res",
					res: _cms
				})
			};
		}else{
			a.open("GET", _url, false);
			a.send();
		}
	};
	// 通知扫描结束
	postMessage({
		act: 'end'
	});
	// 清除缓存
	delete cache;
	
}