var Indexsingle = new Function();

Indexsingle.prototype = {
	// 选择器
	selecter : null,
	contentDiv : null,
	parentThis : null,
	// 初始化加载菜单
	init : function(contentDiv) {
		this.contentDiv = contentDiv;
		temp = this;
		$.jump.ajax(URL_READ_JURISDICTION.encodeUrl(), function(data) {
			if (data.code == "0") {
				temp.bindMetod(temp, data);
			}
		}, null, true);
	},
	// 绑定事件
	bindMetod : function(parentThis, data) {
		//alert(111);
		debugger
		$('#content1').html('');
		var html =[];
		
		if (data.menuLst != null && data.menuLst.length > 0) {
			
		        var t=0;
			//html.push('<div style="width:100%;height: 250px;margin-top: 10px;">');
				$.each(data.menuLst, function(i, menuObj) {
					debugger
					$.each(data.funLst,function(j, funObj){
						debugger
						var param={};
						if(!common.utils.isNull(funObj.param)){
							param= eval("("+funObj.param+")");//将json字符串转换成map  
						}
						param["regionCode"]=data.region_code;//判断登录人是否是西安的
						var parMap=JSON.stringify(param);
						if (funObj.menu_id == menuObj.menu_id) {
							if(funObj.fun_url=="leadStrokeArrangeShow"){
								t++;
								html.push('<div style="width: 30%;height: 250px;margin-top: 10px;float: left;text-align:center;border:1px solid #000;margin-left: 2.5%;">'+
										'<div style="height: 180px;">'+
										'<a href="#" name="hrefA" funUrl='+funObj.fun_url+' funPath='+funObj.fun_path+'  param='+parMap+'><img src="images/icon_05.png"></img></a>'+
										'</div>'+
										'<div style="height: 60px;">'+
										'<span style="font-size:20px;">'+funObj.fun_name+'</span>'+
										'</div>'+
										'</div>');
							}
							/*if(funObj.fun_url=="leadStrokeArrangeAdd"){
								t++;
								html.push('<div style="width: 30%;height: 250px;margin-top: 10px;float: left;text-align:center;border:1px solid #000;margin-left: 2.5%;">'+
										'<div style="height: 180px;">'+
										'<a href="#" name="hrefA" funUrl='+funObj.fun_url+' funPath='+funObj.fun_path+'  param='+parMap+'><img src="images/icon_03.png"></img></a>'+
										'</div>'+
										'<div style="height: 60px;">'+
										'<span style="font-size:20px;">'+funObj.fun_name+'</span>'+
										'</div>'+
									     '</div>');
							}*/
						}
						
					})
				})
				//html.push('</div>');
				if(t==0){
					html.push('<div style="text-align:center;"><span>暂无权限查看</span></div>');
				}
				$('#content1').html(html);
				$('#content1').html(html.join(''));
				$('#content1').find('a[name=hrefA]').unbind('click').bind('click',function(){
					debugger
					var funPath = $(this).attr("funPath");
					var funUrl = $(this).attr("funUrl");
					var param = $(this).attr("param");
					var htmlPath = funPath+ funUrl + ".html";
					//显示上面菜单
					//this.contentDiv = contentDiv;
					//temp = this;
					$.jump.ajax(URL_READ_JURISDICTION.encodeUrl(), function(data) {
						if (data.code == "0") {
							parentThis.loadtreeHtml(parentThis, data);
						}
					}, null, true);
					//
					common.loadding("open");
					parentThis.loadHtml(htmlPath,parentThis, funUrl,param);
					//parentThis.loadHtml("/web/html/leadStroke/leadStrokeArrangeShow.html",parentThis, "leadStrokeArrangeShow",param);
				});
		}
	},
	//加载html页面
	 loadHtml : function(htmlPath,parentThis,url,param){
		 $.jump.loadHtmlForFun(htmlPath.encodeUrl(),function(html){
			 	common.loadding("close");
				$("#content").html(html);
				if(url=="leadStrokeArrangeShow"){
					var leadStrokeArrangeShow=new LeadStrokeArrangeShow();
					leadStrokeArrangeShow.init();
				}
				if(url=="leadStrokeArrangeAdd"){
					var leadStrokeArrangeAdd=new LeadStrokeArrangeAdd();
					leadStrokeArrangeAdd.init();
				}
				
		});
		
	},
	loadtreeHtml : function(parentThis, data){
		$('#jsddm').html('');
		var html =[];
		debugger;
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
	}
};
