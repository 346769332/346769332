var CenterIndex = new Function();

CenterIndex.prototype = {
	selecter : "#body",
	
	top : null,
	//初始化执行
	init : function(){
		this.loadTopVi();
	},
	//加载vi
	loadTopVi : function(){
		var parentThis = this;
		var headerDiv = this.selecter.findById("div", "topHeader")[0];
		var contentDiv = this.selecter.findById("div", "content")[0];
		$.jump.loadHtmlForFun("/web/html/top/top.html".encodeUrl(),function(menuHtml){
			headerDiv.html(menuHtml);
			parentThis.top = new Top();
			parentThis.top.init(contentDiv);
		});
	},
	
	saveOptInfo : function(param) {
		$.jump.ajax(URL_SAVE_OPT_INFO.encodeUrl(), function(data) {
			
		}, param, true, false);
	},
};

/*function chechIsLogin() {
	var param = {
			"handleType" : "checkIsLogin",
			"isCheckSession" : "true"
	};
	$.jump.ajax(URL_LOGIN_RANDOM.encodeUrl(), function(data) {
		if(data.code == "1") {
			$.jump.ajax(URL_LOGOUT.encodeUrl(), function(data) {
				alert("该用户已在其他地方登陆");
				location.href=CTX+'/web/login.html';
				return;
		    }, null,true,false);
		}
	}, param, true, false);
};
*/
$(document).ready(function(){
	var index = new CenterIndex();
	index.init();
	//setInterval(chechIsLogin, 60000);
});

