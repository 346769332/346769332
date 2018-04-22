/**
 * jq.ui - A User Interface library for creating jqMobi applications
 *
 * @copyright 2011
 * @author AppMobi
 */
(function($) {
	var jump = function() {
		// Init the page
		//setup the menu and boot touchLayer
		jQuery(document).ready(function() {
			//boot touchLayer
			//create jQUi element if it still does not exist
			var jQUi = document.getElementById("jQUi");
			if (jQUi == null) {
				jQUi = document.createElement("div");
				jQUi.id = "jQUi";
				var body = document.body;
				while (body.firstChild) {
					jQUi.appendChild(body.firstChild);
				}
				jQuery(document.body).prepend(jQUi);
			}
		});
	};
	
	jump.prototype = {
		showLoading : true,
		history : [],
		activeDivId : "main",
		useAjaxCacheBuster : true,
		scrollTopOffSet : 0,
		
		remoteJSPages : {},
		/**
		 * Show the loading mask
		   ```
		   $.ui.showMask()
		   $.ui.showMask(;Doing work')
		   ```
		 * @param {String} [text]
		 * @title $.ui.showMask(text);
		 */
		showMask : function(text) {
			if (!text)
				text = "Loading Content";
			jQuery("#jQui_mask>h1").html(text);
			jQuery("#jQui_mask").show();
		},
		
		/**
		 * Hide the loading mask
		 * @title $.ui.hideMask();
		 */
		hideMask : function() {
			jQuery("#jQui_mask").hide();
		},
		
		/**
		 * Dynamically create a new panel on the fly.  It wires events, creates the scroller, applies Android fixes, etc.
		   ```
		   $.ui.addContentDiv("myDiv","This is the new content","Title");
		   ```
		 * @param {String|Object} Element to add
		 * @param {String} Content
		 * @param {String} title
		 * @title $.ui.addContentDiv(id,content,title);
		 */
		addContentDiv : function(el, content) {
			var myEl = $am(el);
			if (!myEl) {
				var newDiv = document.createElement("div");
				newDiv.id = el;
				newDiv.innerHTML = content;
			} else {
				newDiv = myEl;
			}
			newDiv.className = "panel";
			$("#content").append(newDiv);
			
			return;
		},
		
		/**
		 * Update the HTML in a content panel
		   ```
		   $.ui.updateContentDiv("#myDiv","This is the new content");
		   ```
		 * @param {String,Object} panel
		 * @param {String} html to update with
		 * @title $.ui.updateContentDiv(id,content);
		 */
		updateContentDiv : function(id, content) {
			id = "#" + id.replace("#", "");
			var el = jQuery(id).get(0);
			if (!el)
				return;

			var newDiv = document.createElement("div");
			newDiv.innerHTML = content;
			if ($(newDiv).children('.panel')
					&& $(newDiv).children('.panel').length > 0)
				newDiv = $(newDiv).children('.panel').get();
			$.cleanUpContent(el, false, true);
			el.innerHTML = content;
		},
		
		/**
		 * Helper function that parses a contents html for any script tags and either adds them or executes the code
		 * @api private
		 */
		parseScriptTags : function(div) {
			if (!div)
				return;
			var scripts = div.getElementsByTagName("script");
			div = null;
			var that = this;
			for (var i = 0; i < scripts.length; i++) {
				if (scripts[i].src.length > 0
						&& !that.remoteJSPages[scripts[i].src]) {
					var doc = document.createElement("script");
					doc.type = scripts[i].type;
					doc.src = scripts[i].src;
					doc.id = scripts[i].id;
					document.getElementsByTagName('head')[0].appendChild(doc);
					that.remoteJSPages[scripts[i].src] = 1;
					doc = null;
				} else {
					window.eval(scripts[i].innerHTML);
				}
			}
		},
		
		/**
		 * This is called to initiate a transition or load content via ajax.
		 * We can pass in a hash+id or URL and then we parse the panel for additional functions
		   ```
		   $.ui.loadContent("#main",false,false,"up");
		   ```
		 * @param {String} target
		 * @param {Boolean} newtab (resets history)
		 * @param callbackName 回调方法
		 * @api public 
		 */
		loadContent : function(target, newTab, callbackName) {

			if (target.length === 0)
				return;

			if (target.indexOf("#") == -1) {
				this.loadAjax(target, newTab, callbackName);
			} else {
				this.loadDiv(target, newTab);
				// 执行回调
				if (callbackName != null && callbackName != ""
						&& typeof(callbackName) != "undefined") {
					callbackName();
				}
			}
		},
		/**
		 * 封装jquery ajax方法
		 * isMask : 是否遮罩 false: 不遮罩，否则默认遮罩层显示
		 * errorFun : 异常处理
		 */
		ajax : function(url, callbackName, data, isMask , asyn, errorFun,notEncodeData) {	
			if(data == null) data = {};
			if(notEncodeData == null) notEncodeData ={};
			/*var util  = new Util();
			if(util.getQueryString("ticket") != null){
	 			data.ticket = util.getQueryString("ticket");
	 		}*/
			if (!common.utils.isNull(isMask) && isMask == true){
				common.loadding("open");
			}
			data = {data:encodeURI(encodeURI(JSON.stringify(data))),
					notEncodeData:JSON.stringify(notEncodeData)};
			
			var newURl = "";
			if(URL_LOGIN == url){
				newURl = url;
			}else{
				var idx = url.indexOf("?");
				var firstUrl = idx == "-1" ? url : url.substr(0,idx);
				var param = idx == "-1" ? "" : "&"+url.substr(idx,url.length);
				
				newURl = firstUrl +";jsessionid="+common.jsessionid+"?"+param;
			}

			jQuery.support.cors = true;
			$.ajax({
				url : newURl,
				async : asyn == null ? true : asyn,
				//contentType : "application/x-www-form-urlencoded;charset=utf-8",
				dataType : "json",//"jsonp",
			   //jsonpCallback:"callbackName",  
				timeout:180*1000,
				type : "post",
				data : data,
				cache : false,//
				success : function(json) {
					if (!common.utils.isNull(isMask) && isMask == true){
						common.loadding("close");
					}
					if (json.ajaxRetCode != null &&  json.ajaxRetCode == '0') {
						alert("登录认证超时，请重新登录！");
						location.href='./login.html';
						return;
					}
					if (callbackName != undefined && callbackName != "") {
						callbackName(json);
					}
				},
				error : function(xhtp, err) {
					if (!common.utils.isNull(isMask) && isMask == true){
						common.loadding("close");
					}
					if(xhtp.responseText == "ajaxSessionTimeOut"){
						alert("用户登录超时，或非法用户，请重新登录！");
						window.location.href = common.loginOut();
						return;
					}
					else if(xhtp.status == 0){
						alert("网络或系统服务异常");
						return;
					}
					
					/**异常回调*/
					if(errorFun != undefined && errorFun != null && errorFun != ""){
						errorFun();
						return;
					}
				}
			});
		},
		/**手机图片上传*/
		ajaxImgByCordova : function(imageURI,url,success,fail,isMask){
			if (!common.utils.isNull(isMask) && isMask == true){
				common.loadding("open");
			}
			var options = new FileUploadOptions();
	        options.fileKey = "fileAddPic";//用于设置参数，对应form表单里控件的name属性，这是关键，废了一天时间，完全是因为这里，这里的参数名字，和表单提交的form对应
	        options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
	        //如果是图片格式，就用image/jpeg，其他文件格式上官网查API
	        options.mimeType = "image/jpeg";
	        //options.mimeType = "multipart/form-data";//这两个参数修改了，后台就跟普通表单页面post上传一样 enctype="multipart/form-data"
	 
	        options.chunkedMode = false;
	         
	        /* var params = new Object();
	 
	         params.fileAddPic = imageURI;
	 
	         options.params = params; */
	 
	        var ft = new FileTransfer();
	        ft.upload(imageURI, url, function(data){
	        	if (!common.utils.isNull(isMask) && isMask == true){
					common.loadding("close");
				}
	        	eval(data.response.replace("callbackName","success"));
	        }, function(){
	        	if (!common.utils.isNull(isMask) && isMask == true){
					common.loadding("close");
				}
	        	fail();
	        }, options);
		},
		
		/**
		 * 封装jquery ajax方法
		 * isMask : 是否遮罩 false: 不遮罩，否则默认遮罩层显示
		 * errorFun : 异常处理
		 */
		ajaxGet : function(url, callbackName, data, isMask , asyn, errorFun) {	
			
			if(util.getQueryString("ticket") != null){
	 			data.ticket = util.getQueryString("ticket");
	 		}
			if (!common.utils.isNull(isMask) && isMask == true){
				common.loadding("open");
			}
			//data = {data:JSON.stringify(data)};
			$.ajax({
				url : url,
				async : asyn == null ? true : asyn,
				contentType : "application/x-www-form-urlencoded;charset=utf-8",
				dataType : "json",
				type : "GET",
				data : data,
				cache : false,//
				success : function(json) {
					if (!common.utils.isNull(isMask) && isMask == true){
						common.loadding("close");
					}
					if (callbackName != undefined && callbackName != "") {
						callbackName(json);
					}
				},
				error : function(xhtp, err) {
					
					if (!common.utils.isNull(isMask) && isMask == true){
						common.loadding("close");
					}
					if(xhtp.responseText == "ajaxSessionTimeOut"){
						alert("用户登录超时，或非法用户，请重新登录！");
						window.location.href = common.loginOut();
						return;
					}
					else if(xhtp.status == 0){
						alert("网络或系统服务异常");
						return;
					}
					else{
						var alertMessage = '请求内部异常';
						alert(alertMessage);
					}
					
					/**异常回调*/
					if(errorFun != undefined && errorFun != null && errorFun != ""){
						errorFun();
						return;
					}
				}
			});
		},
		
		/**
		 * 加载html到指定的容器里面, 可带入传送的对象
		 * @param selector  选择器(ID、对象 2种选择器)
		 * @param url  路径
		 * @param callBack  回调函数
		 * @param obj 对象
		 */
		loadHtml : function(selector, url, callBack, obj) {
			
			var that = null;
			//如果不存在则表示对象选择器
			if(typeof(selector) == "object")
				that = selector;
			else
				that = $(selector);
			
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
		 * 将内容设置给
		 * @param url  路径
		 */
		loadHtmlForFun : function(url,callFun) {
			
			$.get(url, function(text) {
				
				try {
					var urlList = url.split("html?");
					if (urlList.length > 1) {
						text = "<input type='hidden' name='url_get_param' value='" + urlList[1] + "'>" + text;
					}
				} catch (e) {}
				callFun(text);
			});
		},
		/**
		 * This is called internally by loadContent.  Here we are using Ajax to fetch the data
		   ```
		   $.ui.loadDiv("page.html",false,false,"up");
		   ```
		 * @param {String} target
		 * @param {Boolean} newtab (resets history)
		 * @api private
		 */
		loadAjax : function(target, newTab, callbackName) {
			var that = this;
			var ajaxDivId = "jQui-ajax-" + new Date().getTime();
			var xmlhttp = null;
			try {
				xmlhttp = new XMLHttpRequest();
			} catch (e) {
				try {
					xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
				} catch (e) {
					xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
				}
			}	
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					if (jQuery("#" + ajaxDivId).length > 0) {
                    } else { 
						that.addContentDiv(ajaxDivId, xmlhttp.responseText);
						
						var div = document.createElement("div");
						var html = '';
						if($.browser.msie) { // ie 浏览器
							html = '<span style="display:none;">for ie</span>';
						}
	                    div.innerHTML =  html + xmlhttp.responseText;
	                    that.parseScriptTags(div);
	                    
						that.loadContent("#" + ajaxDivId, newTab, callbackName);
						//that.parseScriptTags($am(ajaxDivId));
                    }
                    
					return null;
				}
			};
			ajaxUrl = target;
			var newtarget = this.useAjaxCacheBuster ? target
					+ (target.split('?')[1] ? '&' : '?') + "cache="
					+ Math.random() * 10000000000000000 : target;
			xmlhttp.open("GET", newtarget, true);
			xmlhttp.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			xmlhttp.send();
			
			/*if (this.showLoading)this.showMask();*/
		},

		/**
		 * Clear the history queue
		   ```
		   $.ui.clearHistory()
		   ```
		 * @title $.ui.clearHistory()
		 */
		clearHistory : function() {
			if (this.history.length > 0) {
				if (!this.deleteAjaxDiv(this.activeDivId)) {
					$("#" + tmp.target).hide();
				}
				while (this.history.length > 1) {
					var tmp = this.history.pop();
					if (!this.deleteAjaxDiv(tmp.target)) {
						$("#" + tmp.target).hide();
					}
				}
				var tmp = this.history.pop();
				this.activeDivId = tmp.target;
				$("#" + this.activeDivId).show();
			}
		},
		
		/**
		 * This is called internally by loadContent.  Here we are loading a div instead of an Ajax link
		   ```
		   $.ui.loadDiv("#main",false,false,"up");
		   ```
		 * @param {String} target
		 * @param {Boolean} newtab (resets history)
		 * @param {Boolean} go back (initiate the back click)
		 * @param {String} transition
		 * @title $.ui.loadDiv(target,newTab,goBack,transition);
		 * @api private
		 */
		loadDiv : function(target, newTab) {
			if(document.body){
				this.scrollTopOffSet = document.body.scrollTop;
			}
			
			//隐藏
			$("#" + this.activeDivId).hide();
			this.pushHistory(this.activeDivId, null);

			what = target.replace("#", "");
			what = jQuery("#" + what).get(0);
			this.activeDivId = what.id;
			$("#" + this.activeDivId).show();

		},
		
		/**
		 * Initiate a back transition
		   ```
		   $.ui.goBack()
		   ```
		 * @title $.ui.goBack()
		 */
		goBack : function() {
			if (this.history.length > 0) {
				if (!this.deleteAjaxDiv(this.activeDivId)) {
					$("#" + this.activeDivId).hide();
				}
				var tmp = this.history.pop();
				this.activeDivId = tmp.target;
				$("#" + this.activeDivId).show();
				$("body").scrollTop(this.scrollTopOffSet);
			}
		},
		
		deleteAjaxDiv : function(id) {
			if (id.startWith('jQui-ajax-')) {
				var cuurDiv = $am(id);
				if (cuurDiv) {
					cuurDiv.parentNode.removeChild(cuurDiv);
					return true;
				}
				return false;
			}
		},
		
		removeCurrDiv : function(id) {
			if (this.history.length > 0) {
				if (!this.deleteAjaxDiv(id)) {
					$("#" + this.activeDivId).hide();
				}
				var tmp = this.history.pop();
				this.activeDivId = tmp.target;
			}
		},
		
		/**
		 * PushHistory
		   ```
		   $.ui.pushHistory(previousPage, newPage, transition, hashExtras)
		   ```
		 * @title $.ui.pushHistory()
		 */
		pushHistory : function(previousPage, newPage, transition, hashExtras) {
			//push into local history
			this.history.push({
						target : previousPage,
						transition : transition
					});
		}
		
	};

	function $am(el) {
		el = el.indexOf("#") == -1 ? "#" + el : el;
		return jQuery(el).get(0);
	}

	$.jump = new jump;

})(jQuery);


