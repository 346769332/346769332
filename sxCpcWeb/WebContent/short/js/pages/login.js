var  Login = new Function();
 
Login.prototype = {
		
	 currSelector : null ,	
	 parentBody : null,
	 init : function(parentBody){
	       currSelector = $("#login");
	       parentThis = this ;
	       parentThis.parentBody = parentBody;
	       parentThis.initPassword();
	       parentThis.loginSys();
	       
	       $("#loginVersion").html(APP_VERSION);
	       
	       document.addEventListener("deviceready", function(){
				document.addEventListener("backbutton", function(){
					navigator.app.exitApp();
				}, false);
			
			}, false);
	       
	       
	 },
	 //初始化页面
	 initPassword : function(){
		 
		 var parentThis = this;
		//设置记住密码
       var userName = "".findById("input", "userName",  parentThis.parentBody)[0];
       var userPasswrod = "".findById("input", "userPasswrod",  parentThis.parentBody)[0];
       
       var localName = localStorage.getItem("userName");
       var localPwd = localStorage.getItem("userPasswrod");
       if(localName && typeof(localName) !="undefined" && localName != "null"){
    	   userName.val(localName);
       }
       if(localPwd && typeof(localPwd) !="undefined" && localPwd != "null"){
    	   userPasswrod.val(localPwd);
       }
       
       "".findById("input", "rembPwd",  parentThis.parentBody)[0].unbind("click").bind("click",function(){
    	   parentThis.rememberPWD($(this));
    	   
       });
       
       var isLocal = localStorage.getItem("isLocal");
       if(isLocal && typeof(isLocal) !="undefined" && isLocal != "false"){
    	   "".findById("input", "rembPwd",  parentThis.parentBody)[0].click();
       }
	 },
	 rememberPWD : function(checkbox){
		 
		 if(checkbox.is(":checked")){
			 
			var userName = "".findById("input", "userName",  parentThis.parentBody)[0];
			var userPasswrod = "".findById("input", "userPasswrod",  parentThis.parentBody)[0];
			var userNameVal = userName.val();
			var userPasswrodVal = userPasswrod.val();
			localStorage.setItem("userName",userNameVal);
			localStorage.setItem("userPasswrod",userPasswrodVal);
			localStorage.setItem("isLocal",true);
  	   	}else{
  	   		localStorage.setItem("userName",null);
  	   		localStorage.setItem("userPasswrod",null);
  	   		localStorage.setItem("isLocal",false);
  	   	}
	 },
	 loginSys : function(){
		 var parentThis = this;
		 
		 currSelector.find(".dl").click(function(){
			 var validate = parentThis.validate();
			 if(!validate){
				 return false;
			 }
			 
			 var rembPwd= "".findById("input", "rembPwd",  parentThis.parentBody)[0];
			 parentThis.rememberPWD(rembPwd);
			 
 			 var param = {"empeeCode" :  parentThis.encode64(currSelector.find("#userName").val()),
					      "password"  :  currSelector.find("#userPasswrod").val() ,
					      "APP_VALDATE_VERSION" : APP_VALDATE_VERSION, //是否严重版本
					      "sys_id" : APP_ID,
					      "APP_ID" : APP_ID};
			 $.jump.ajax(URL_LOGIN, function(data) {
				 debugger;
					var retCode = data.code;
					if (retCode == "0") {
						parentThis.appVersion(data);
					} else {
						alert(data.msg);
	 				}
				}, param, true);
		 
		 });
	 },

	//进行加密
		encode64 : function(input){
			var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"  
	        + "wxyz0123456789+/" + "=";
			var output = "";  
	        var chr1, chr2, chr3 = "";  
	        var enc1, enc2, enc3, enc4 = "";  
	        var i = 0;  
	        do {  
	            chr1 = input.charCodeAt(i++);  
	            chr2 = input.charCodeAt(i++);  
	            chr3 = input.charCodeAt(i++);  
	            enc1 = chr1 >> 2;  
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
	            enc4 = chr3 & 63;  
	            if (isNaN(chr2)) {  
	                enc3 = enc4 = 64;  
	            } else if (isNaN(chr3)) {  
	                enc4 = 64;  
	            }  
	            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)  
	                    + keyStr.charAt(enc3) + keyStr.charAt(enc4);  
	            chr1 = chr2 = chr3 = "";  
	            enc1 = enc2 = enc3 = enc4 = "";  
	        } while (i < input.length);  
	  
	        return output;  

		},

		//进行加密
		encode64 : function(input){
			var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"  
	        + "wxyz0123456789+/" + "=";
			var output = "";  
	        var chr1, chr2, chr3 = "";  
	        var enc1, enc2, enc3, enc4 = "";  
	        var i = 0;  
	        do {  
	            chr1 = input.charCodeAt(i++);  
	            chr2 = input.charCodeAt(i++);  
	            chr3 = input.charCodeAt(i++);  
	            enc1 = chr1 >> 2;  
	            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
	            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
	            enc4 = chr3 & 63;  
	            if (isNaN(chr2)) {  
	                enc3 = enc4 = 64;  
	            } else if (isNaN(chr3)) {  
	                enc4 = 64;  
	            }  
	            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)  
	                    + keyStr.charAt(enc3) + keyStr.charAt(enc4);  
	            chr1 = chr2 = chr3 = "";  
	            enc1 = enc2 = enc3 = enc4 = "";  
	        } while (i < input.length);  
	  
	        return output;  

		},

	 appVersion : function(data){
		 var parentThis = this;
		 	var sessionId = data.jsessionid;
		 	var app_version = data.APP_VERSION;
			//加载验证
		 	common.setJsessionid(sessionId);
			if(!app_version){
				common.go.next("./home.html?hasSession=yes&helpTel="+data.helpTel);
				return;
			}
			var versionDiv = "".findById("div", "versionDiv", parentThis.parentBody)[0];
			$.jump.loadHtmlForFun("./app_version.html",function(html){
				versionDiv.html(html);
				AppVersion.validate(versionDiv,APP_VERSION,app_version,function(){
					common.go.next("./home.html?hasSession=yes&helpTel="+data.helpTel);
				},function(){
					alert("抱歉！版本验证失败，无法登录！");
				});
			});
	 },
	 validate : function() {
 		if ('' == currSelector.find("#userName").val()) {
			alert('请输入用户名!');
			return false;
		}
		if ('' == currSelector.find("#userPasswrod").val()) {
			alert('请输入密码!');
			return false;
		}
		return true;
	}
};

$(document).ready(function(){
	var login  =new Login();
	login.init($(this));
});
