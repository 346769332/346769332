var Home = new Function();

Home.prototype = {
	
	parentBody 	: null,
	
	
	init : function(parentBody){
		this.parentBody =parentBody;
		this.bindMethod(this);
	},
	
	bindMethod:function(parentThis){
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				parentThis.onAppOut();
			}, false);
		}, false);
		
//		"".findById("a", "backA", parentThis.parentBody)[0].unbind("click").bind("click",function(){
//			parentThis.onAppOut();
//		});
//		
//		"".findById("a", "homeEnvelope", parentThis.parentBody)[0].unbind("click").bind("click",function(){
//			common.go.next("home.html");
//		});
		var zcscObj="".findById("div", "zcsc", parentThis.parentBody)[0];
		zcscObj.find("ul").find("li").unbind("click").bind("click",function(){
			var liObj=$(this);
			var param={
					"policyType"			:		liObj.attr("policyType"),
					"policyTypeName"		:		liObj.attr("policyTypeName")
			};
			var url="policyManualList.html?"+$.param(param);
			common.go.next(url);
		});
	},
	
	//退出
	onAppOut : function(){
		navigator.notification.confirm('您确定要退出“政策手册”吗？', function(button){
			if( button==1 ) {
				navigator.app.exitApp();
			}
		}, '退出政策手册', '确定,取消');
	},
};


$(document).ready(function(){
	var home  =new Home();
	home.init($(this));
});