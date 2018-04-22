var CenterIndex1 = new Function();

CenterIndex1.prototype = {
	selecter : "#body",
	
	top : null,
	//初始化执行
	init : function(){
		this.loadTopVi();
	},
	//加载vi
	loadTopVi : function(){
		debugger;
		var parentThis = this;
		var headerDiv = this.selecter.findById("div", "topHeader")[0];
		var contentDiv = this.selecter.findById("div", "content")[0];
		$.jump.loadHtmlForFun("/web/html/top/singletop.html".encodeUrl(),function(menuHtml){
			headerDiv.html(menuHtml);
			parentThis.top = new Top1();
			parentThis.top.init(contentDiv);
		});
	},
	
	saveOptInfo : function(param) {
		$.jump.ajax(URL_SAVE_OPT_INFO.encodeUrl(), function(data) {
			
		}, param, true, false);
	},
};

$(document).ready(function(){
	var index = new CenterIndex1();
	index.init();
	//setInterval(chechIsLogin, 60000);
});

