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
			 
 			 var param = {"empeeCode" :  currSelector.find("#userName").val(),
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
