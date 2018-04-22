var  Login = new Function();
 
Login.prototype = {
		
	 currSelector : null ,	
	 temp : null ,
	 parentBody : null,
	 init : function(parentBody){
	       currSelector = $("#login");
	       temp = this ;
	       this.parentBody = parentBody;
	       temp.initPassword();
	       temp.remeberNumber();
	       temp.loginSys();
	       
	       document.addEventListener("deviceready", function(){
				document.addEventListener("backbutton", function(){
					navigator.app.exitApp();
				}, false);
			
			}, false);
	 },
	 //记住密码
	 remeberNumber : function(){
		 currSelector.find("#remeberNumber").click(function(){
			 var check = null ;
 			 $.each(currSelector.find("#remeberNumber"),function(key,obj){
 				check = this.checked; 
			 });
  			 if(check){
  				window.localStorage.staff_name = currSelector.find("#userName").val();
  				window.localStorage.staff_password = currSelector.find("#userPasswrod").val();
 			 }else{
 				window.localStorage.staff_name = '';
  				window.localStorage.staff_password = '';
  				currSelector.find("#userName").val('');
  				currSelector.find("#userPasswrod").val('');
 			 }
		 });
	 },
	 //初始化页面
	 initPassword : function(){
  		 if(window.localStorage.staff_password){
			  currSelector.find("#userName").val(window.localStorage.staff_name);
			  currSelector.find("#userPasswrod").val(window.localStorage.staff_password);
			  $.each(currSelector.find("#remeberNumber"),function(){
	 				  this.checked = true ; 
				 });
 		 }else{
 			$.each(currSelector.find("#remeberNumber"),function(){
				  this.checked = false ; 
			 });
 		 }
	 },
	 loginSys : function(){
		 var parentThis=this;
		 currSelector.find("#dl").click(function(){
			 var validate = temp.validate();
			 if(!validate){
				 return false;
			 }
 			 var param = {"empeeCode" :  currSelector.find("#userName").val(),
					      "password"  :  currSelector.find("#userPasswrod").val() ,
					      "APP_VALDATE_VERSION" : APP_VALDATE_VERSION, //是否验证本
					      "sys_id" : APP_ID,
					      "APP_ID" : APP_ID};
 			 $.jump.ajax(URL_LOGIN, function(data) {
				 
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
			sessionStorage.setItem("sessionId", sessionId);
			//加载验证
			if(!app_version){
				location.href = "./home.html?jsessionid="+sessionId+"&hasSession=yes&helpTel="+data.helpTel;
				return;
			}
			var versionDiv = "".findById("div", "versionDiv", parentThis.parentBody)[0];
			$.jump.loadHtmlForFun("./app_version.html",function(html){
				versionDiv.html(html);
				AppVersion.validate(versionDiv,APP_VERSION,app_version,function(){
					location.href = "./home.html?jsessionid="+sessionId+"&hasSession=yes&helpTel="+data.helpTel;
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
