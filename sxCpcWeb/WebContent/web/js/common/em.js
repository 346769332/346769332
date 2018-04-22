var sessionId;
var em = {
	/**
	 * 封装jquery ajax方法
	 * isMask : 是否遮罩 false: 不遮罩，否则默认遮罩层显示
	 * errorFun : 异常处理
	 */
	ajax : function(url, callbackName, data, asyn, isMask, errorFun) {	
		if(data == null) data = {};
 		
 		data.serviceUrl = util.getCurrentUrl(true);
		if (util.isNull(isMask) || isMask == true){
			//showProcess();
		}
		$.ajax({
			url : url,
			async : asyn == null ? true : asyn,
			contentType : "application/x-www-form-urlencoded;charset=utf-8",
			dataType : "json",
			type : "POST",
			data : data,
			cache : false,//
			success : function(json) {
				if (util.isNull(isMask) || isMask == true){
					//closeProcess();
				}
				// 如果没有登录,则返回登录页面
				try {
					if (json.ajaxRetCode != null &&  json.ajaxRetCode == '0') {
						if(json.showTip=='1'){
							alert(json.message);
						}
						if(json.appId == '708'){
							location.href=CONTEXT+'/www/html/login.html';
						}else{
							window.location.href=json.authUrl;
						}
						return;
					}
				} catch (e) {}
				//begin 添加一段用于调试的代码
				try {
					if ($('#menu_top') && $('#menu_top').attr('test')&& '调试' == $('#menu_top').attr('test')) {
						var str="url=" + url + "\n" + "data="+ JSON.stringify(data) + "\n" + "json="+ JSON.stringify(json);
						var input=window.prompt("本提示框架仅用于开发调试\n服务路径:"+url,str); 
						json=util.toObj(input);
					}
				} catch (e) {
				}
				//end 添加一段用于调试的代码
				if (callbackName != undefined && callbackName != "") {
					callbackName(json);
				}
			},
			error : function(xhtp, err) {
				
				if(xhtp.status == 0){
					//maskDg.hide();
					closeProcess();
					alert("网络或系统服务异常,状态码："+xhtp.status);
					return;
				}
				closeProcess();
				/**异常回调*/
				if(errorFun != undefined && errorFun != null && errorFun != ""){
					errorFun();
					return;
				}
				var alertMessage = '请求内部异常,状态码:'+xhtp.status;
				alert(alertMessage);
			}
		});
	},
	
	/**
	 *加载js文件
	 *@param scriptName js路径
	 *@param callBack 回调函数
	 */
	loadJs : function(scriptName, callBack){
		if (!$.ui.remoteJSPages[scriptName]) {
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = scriptName;
			script.onload = callBack;
			document.getElementsByTagName("head")[0].appendChild(script);
			$.ui.remoteJSPages[scriptName] = 1;
			script = null;
		} else {
			callBack.call();
		}
	},
	
	/**
	 * 加载html到指定的容器里面, 可带入传送的对象
	 * @param selector  选择器
	 * @param url  路径
	 * @param callBack  回调函数
	 * @param obj 对象
	 */
	loadHtml : function(selector, url, callBack, obj) {
		var that = $(selector);
		$.get(url, function(text) {
			
			try {
				var urlList = url.split("html?");
				if (urlList.length > 1) {
					text = "<input type='hidden' name='url_get_param' value='" + urlList[1] + "'>" + text;
				}
			} catch (e) {}
			that.html(text);
			
			//$.ui.parseScriptTags(that.get(0));
			
			if (callBack != null && callBack !="" && typeof(callBack) != "undefined")
				callBack(obj);
		});
	},
	
	/**
	 * 动态加载html到弹出层content容器里面
	 * */
	loadDlgContent : function(dlgObj, url, callBack, obj) {
		$.get(url, function(text) {
			dlgObj.content(text);
			//$.ui.parseScriptTags(dlgObj.dom.content.get(0));
			
			if (callBack != null && callBack !="" && typeof(callBack) != "undefined")
				callBack(obj);
		});
	},
	
	/**
	 * 动态加载html到弹出层content容器里面
	 * */
	loadDiaLogContent : function(dlgObj, url, callBack, obj) {
		$.get(url, function(text) {
			dlgObj.find("div[name=content]").html(text);
			if (callBack != null && callBack !="" && typeof(callBack) != "undefined")
				callBack(obj);
		});
	},
	/**
	 * 
	 * @param id  divID
	 * @param title 标题
	 * @param width 宽度
	 * @param height 高度
	 * @param isMask 是否遮罩，true显示，false不显示
	 * @param isMaskClick 是否遮罩添加点击退却事件，true显示，false不显示
	 * @param isShowX 是否显示X，true显示，false不显示
	 */
	showDialog : function(id,title,content,isMask,isShowX,isMaskClick,width,height,top){
		var util  = new Util();
		var divShow = $("#"+id);
		
		if($("#diaLogDiv").find("div[id="+id+"]").length > 0){
			divShow.remove();
		}
		
		var diaLogHtml = [];
		diaLogHtml.push('<div class="divshow warp" id="'+id+'" name="diaLogDetailDiv" style="display:none;z-index: 9999;position:absolute" >');
		diaLogHtml.push('<h1 class="divshow_h1" name="title"><span class="left_sj"></span> <span class="right_sj"></span></h1>');
		diaLogHtml.push('<div class="close" name="xx"></div>');
		diaLogHtml.push('<div class="con" name="content"></div>');
		diaLogHtml.push('</div>');
		
		$("#diaLogDiv").append(diaLogHtml.join(''));
		
		divShow = $("#"+id);
		
		divShow.find("div[name=content]").html(content); //加载内容
		
		if(util.isNull(title)){  //处理标题
			divShow.find("h1[name=title]").hide();
		}else{
			divShow.find("h1[name=title]").html(title+'<span class="left_sj"></span> <span class="right_sj"></span>');
		}
		if(util.isNull(isMask) || isMask == true){ //处理遮罩
			
			$("#_ShowDialogBGDiv").css({"height":$(document).height()}).show();
		}
		
		if(util.isNull(isShowX) || isShowX == true){ //处理XX
			divShow.find("div[name=xx]").unbind("click").bind("click",function() {
				divShow.animate({"top":-300},function(){divShow.hide();$("#_ShowDialogBGDiv").hide();});
				if(id == "diaLog_numLvl" || id == "dialog_numConfirm"){
					if(!$("#dialog_selNum").is("hidden")){
						$("#dialog_selNum").show();
					}
					
				}
			});
		}else{
			divShow.find("div[name=xx]").hide();
		}
		
		if(util.isNull(isMaskClick) || isMaskClick == true){ //处理遮罩点击
			$("#_ShowDialogBGDiv").unbind("click").bind("click",function() {
				//divShow.animate({"top":-300},function(){divShow.hide();$("#_ShowDialogBGDiv").hide();});
				em.hideDialog(id);
			});
		}

		if(util.isNull(width)){
			width =50;
		}
		
		if(!util.isNull(width)){
			divShow.css({"width":width});
		}
		
		if(!util.isNull(height)){
			divShow.css({"height":height});
		}
		
		if(util.isNull(top)){
			top = ($(window).height()-height)/2;
			//top = "50" ;
		}
		
		divShow.css({"left":($(window).width()-width)/2,"top":-300}).show();
		
		if(id == "diaLog_numLvl" || id == "dialog_numConfirm"){
			if(!$("#dialog_selNum").is("hidden")){
				$("#dialog_selNum").hide();
			}
			
		}
		$("#diaLogDiv").show();
		divShow.animate({"top":top});
	},
	
	/**
	 * 隐藏Dialog
	 */
	hideDialog : function(id){
		
		var divShow = $("#"+id);
		var flag = true;
		$.each($("#diaLogDiv").find("div[name=diaLogDetailDiv]"),function(){
			if(!$(this).is(":hidden") && $(this).attr("id") != id){
				flag = false;
				return;
			}
		});
		if(flag){
			divShow.animate({"top":-300},function(){divShow.hide();$("#_ShowDialogBGDiv").hide();});
		}else{
			divShow.animate({"top":-300},function(){divShow.hide();});
		}
		
	},
	
	
	
	find : function(id) {
		return $("#" + $.ui.activeDivId).find(id);
	}
};