var Home = new Function();

Home.prototype = {
	// 选择器
	selecter : null,
	contentDiv : null,
	parentThis : null,
	// 初始化加载菜单
	init : function() {
		temp = this;
		// 权限校验，菜单加载
		$.jump.ajax(URL_READ_JURISDICTION.encodeUrl(), function(data) {
			if (data.code == "0") {
				if(data.homePageLst != null && data.homePageLst.length > 0) {
					var homePageLst = data.homePageLst[0];
					var htmlPath = homePageLst.fun_path + homePageLst.fun_url + '.html';
					temp.loadHtml(htmlPath,temp, homePageLst.fun_url,"");
				}else {
					layer.alert("您无角色权限，无法进行任何操作，请联系管理员", 8);
					return;
				}
			} else {
				layer.alert(msg);
			}
		}, null, true);
	},
	
	 //加载html页面
	 loadHtml : function(htmlPath,parentThis,url,param){
		 $.jump.loadHtmlForFun(htmlPath.encodeUrl(),function(menuHtml){
			contentDiv = $("#content");
			contentDiv.html(menuHtml);
			var newFunJsObj = url;
			var fLetter = newFunJsObj.substr(0, 1).toUpperCase();
			var funJsObj = fLetter + url.substring(1);
			newFunJsObj = new (eval(funJsObj))();
			if(param != ""){
				newFunJsObj.init(param);
			}else{
				newFunJsObj.init();
			}
		});
	}
};
