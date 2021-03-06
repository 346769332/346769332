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
		ajax : function(url, callbackName, data, isMask , asyn, errorFun) {	
			if(data == null) data = {};
			var util  = new Util();
			if(util.getQueryString("ticket") != null){
	 			data.ticket = util.getQueryString("ticket");
	 		}
			if (!common.utils.isNull(isMask) && isMask == true){
				common.loadding("open");
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
					if (!common.utils.isNull(isMask) && isMask == true){
						common.loadding("close");
					}
					if (json.ajaxRetCode != null &&  json.ajaxRetCode == '0') {
						if(json.showTip=='1'){
							alert(json.message);
						}
					
						parent.location.href=CTX+'/web/login.html';
						var iframIndex = parent.layer.getFrameIndex();
						parent.layer.close(iframIndex);
						return;
					}
					else if (json.ajaxRetCode != null &&  json.ajaxRetCode == '-1') {
						
						$.jump.ajax(URL_LOGOUT.encodeUrl(), function(data) {
							if(!(json.isLogout != null && json.isLogout == 'Y')) {
								
								alert(json.message);
							}
							location.href=CTX+'/web/login.html';
							return;
					    }, null,true,false);
					}
					else if (callbackName != undefined && callbackName != "") {
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
//						alert("用户会话失效，请重新登录");
						return;
					}
					else{
//						var alertMessage = '登录信息失效,请重新登录';
//						alert(alertMessage);
//						location.href=CTX+'/web/login.html';
						var alertMessage = '用户会话失效，请重新登录';
//						alert(alertMessage);
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
//				that.html(text);
				document.getElementById(selector).innerHTML=text;
				
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
	
	function formhtml(){
		if (arguments.length) return oldHTML.apply(this,arguments);
        $("input,textarea,button", this).each(function() {
            this.setAttribute('value',this.value);
        });
        $(":radio,:checkbox", this).each(function() {
            if (this.checked) this.setAttribute('checked', 'checked');
            else this.removeAttribute('checked');
        });
        $("option", this).each(function() {
            if (this.selected) this.setAttribute('selected', 'selected');
            else this.removeAttribute('selected');
        });
        return oldHTML.apply(this);
	}

	function $am(el) {
		el = el.indexOf("#") == -1 ? "#" + el : el;
		return jQuery(el).get(0);
	}

	$.jump = new jump;

})(jQuery);


