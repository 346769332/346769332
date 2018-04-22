var TopMenu = new Function();

TopMenu.prototype = {
	// 选择器
	selecter : null,
	contentDiv : null,
	parentThis : null,
	// 初始化加载菜单
	init : function(contentDiv) {
		this.contentDiv = contentDiv;
		temp = this;
		// 权限校验，菜单加载
		$.jump.ajax(URL_READ_JURISDICTION.encodeUrl(), function(data) {
			if (data.code == "0") {
				
				if (data.menuLst != null && data.menuLst.length > 0) {
					temp.bindMetod(temp, data);
					
					//首页先写死到单池
					if(data.homePageLst != null && data.homePageLst.length > 0) {
						
						var homePageLst = data.homePageLst[0];
						var htmlPath = homePageLst.fun_path + homePageLst.fun_url + '.html';
						temp.loadHtml(htmlPath,temp, homePageLst.fun_url,"");
					}else {
//						layer.alert("您无角色权限，无法进行任何操作，请联系管理员", 8);
						return;
					}
//					temp.loadHtml("/web/html/order/poolOrderList.html",temp, "poolOrderList","");
				} else {
					layer.alert("您无角色权限，无法进行任何操作，请联系管理员", 8);
					return;
				}
			} else {
				layer.alert(msg);
			}
		}, null, true);
	},
	// 绑定事件
	bindMetod : function(parentThis, data) {
		$('#jsddm').html('');
		var html =[];
		
		if (data.menuLst != null && data.menuLst.length > 0) {
			$.each(data.menuLst, function(i, menuObj) {
				html.push('<li>');
				if(menuObj.fun_url != ""){
					html.push('<a href="#" name="hrefA" funUrl='+menuObj.fun_url+' funPath='+menuObj.fun_path+' param='+menuObj.param+'>'+menuObj.menu_name+'</a>');
				}else{
					html.push('<a href="#">'+menuObj.menu_name+'</a>');
					html.push('<ul>');
					$.each(data.funLst,function(j, funObj){
						
						var param={};
						if(!common.utils.isNull(funObj.param)){
							param= eval("("+funObj.param+")");//将json字符串转换成map  
						}
						param["regionCode"]=data.region_code;//判断登录人是否是西安的
						var parMap=JSON.stringify(param);
						if (funObj.menu_id == menuObj.menu_id) {
						html.push('<li><a href="#" name="hrefA" funUrl='+funObj.fun_url+' funPath='+funObj.fun_path+'  param='+parMap+'>'+funObj.fun_name+'</a></li>');
						}
					});
					html.push('</ul>');
				}
				html.push('</li>');
			});
		}
		$('#jsddm').html(html.join(''));
		$('#jsddm').find('a[name=hrefA]').unbind('click').bind('click',function(){
			debugger
			
			var funPath = $(this).attr("funPath");
			var funUrl = $(this).attr("funUrl");
			var param = $(this).attr("param");
			var htmlPath = funPath+ funUrl + ".html";
			common.loadding("open");
			parentThis.loadHtml(htmlPath,parentThis, funUrl,param);
		});
		/**美工提供**/
		$('#jsddm > li').unbind('mouseover').bind('mouseover', jsddm_open);
		$('#jsddm > li').unbind('mouseout').bind('mouseout',  jsddm_timer);
		/**美工提供**/
	},
	 //加载html页面
	 loadHtml : function(htmlPath,parentThis,url,param){
		 parentThis=this;
		 
		 $.jump.loadHtmlForFun(htmlPath.encodeUrl(),function(menuHtml){
				debugger
			 common.loadding("close");
				parentThis.contentDiv.html(menuHtml);
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
