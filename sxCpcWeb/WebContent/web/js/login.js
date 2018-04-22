Login = function() {
	/**当前对象的引用*/
	var temp = this;
	var wait=60;  
	this.appId = null;
	

	/**获取员工工号*/
	this.getEmpeeId = function() {
		return $("#empeeId").val();
	};

	/**获取密码*/
	this.getPassword = function() {
		return $("#password").val();
	};

	/**获取验证码*/
	this.getVerifyCode = function() {
		return $.trim($("#verifyCode").val());
	};

	this.setVerifyCode = function(v) {
		$("#verifyCode").val(v);
	};

	/**
	 * 验证输入信息是否为空androidCpcCall
	 */
	this.validate = function() {
		var util  = new Util();
		if (util.isNull(temp.getEmpeeId()) || temp.getEmpeeId() == "请输入用户名") {
			layer.tips('请输入用户名', '#empeeId', {
				time: 5
			});
			//layer.alert('请输入用户名!',8);
			return false;
		}
//		if (util.isNull(temp.getPassword())) {
//			layer.tips('请输入密码', '#password', {
//				time: 5
//			});
//			//layer.alert('请输入密码!',8);
//			return false;
//		}
		
		
		if(temp.loginType=='Y') return true;
		
		if (util.isNull(temp.getVerifyCode()) || temp.getVerifyCode() == "请输入验证码") {
			layer.tips('请输入验证码', '#verifyCode', {
				time: 5
			});
			return false;
		}
		return true;
	};

	this.init = function(loginType) {
		temp.loginType = loginType;
		
		if(temp.loginType=='Y'){
			$('#yzm').hide();
			//$('#verifyCode').val('');
		}
		
		var empeeId = localStorage.getItem('saleWebEmpeeId', empeeId);
		if (empeeId != "" && empeeId != null) {
			$("#empeeId").val(empeeId);
		}
		$("#loginBtn").click(function() {
			temp.doLogin();
		});
//		$("#forgetPassWord").click(function() {
//			temp.forgetPassWord();
//		});

		$("#verifyCodeTd").click(function() {
			temp.changeVerifyCode();
		});
		//temp.clearData();
		$("#verifyCodeTd").html('<img src="' + URL_VERIFYCODE + '" width="89" height="43">');

		$("#verifyCodeTd").click(function() {
			temp.changeVerifyCode();
		});
		
		$("#empeeId").unbind("blur").bind("blur",function(){
			var empeeId = $("#empeeId").val();
			if(empeeId == ""){
				$("#empeeId").val("请输入用户名");
			}
		});
		$("#empeeId").unbind("focus").bind("focus",function(){
			var empeeId = $("#empeeId").val();
			if(empeeId == "请输入用户名"){
				$("#empeeId").val("");
			}
		});
		
		$("#verifyCode").unbind("blur").bind("blur",function(){
			var empeeId = $("#verifyCode").val();
			if(empeeId == ""){
				$("#verifyCode").val("请输入验证码");
			}
		});
		
		$("#verifyCode").unbind("focus").bind("focus",function(){
			var empeeId = $("#verifyCode").val();
			if(empeeId == "请输入验证码"){
				$("#verifyCode").val("");
			}
		});
		
		$("#empeeId").unbind("keydown").bind("keydown",function(event){
			 if(event.keyCode == "13")    
	            {
				 temp.doLogin();
	            }
		});
		$("#password").unbind("keydown").bind("keydown",function(event){
			 if(event.keyCode == "13")    
	            {
				 temp.doLogin();
	            }
		});
		
		$("#verifyCode").unbind("keydown").bind("keydown",function(event){
			 if(event.keyCode == "13")    
	            {
				 temp.doLogin();
	            }
		});
		$("#getRandom2").unbind("click").bind("click",function(){
			var userCode = $("#empeeId").val().trim();//用户名
			if(userCode == ""||userCode=='请输入用户名'){
				layer.alert("请输入用户名",8);
				return
			}
			var param = {
					"handleType"	:		"get"			,
					"userCode"		:  		userCode
			};
			$.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
				if (data.code == "0") {
					temp.countdown($("#getRandom2"));
					layer.alert(data.msg,9);
				} else {
					layer.alert(data.msg,8);
					$("#verifyCode").val('');
					return;
				}
			}, param, false,false);
		});
	};

	this.changeVerifyCode = function() {
		temp.setVerifyCode("");
		var ran = Math.random();
		var url = URL_VERIFYCODE + "?ran=" + ran;
		$("#verifyCodeTd").html(
				'<img src="' + url + '" width="89" height="43">');
	};
	
	/**
	 *  登陆回调方法
	 */
	this.loginCallback = function(data) {
		
		$.jump.ajax(URL_LOGIN.encodeUrl(), function(data) {
			debugger;
			var retCode = data.code;
			var pwdIsChanged = data.initialPwdChanged;
			var if_v = data.if_v;
			if (retCode == "0") {
				
				if(temp.loginType=='N'){//判断当前的登录方式，是否需要进行短信验证Y需要，N不需要
					if(pwdIsChanged == "N") {
						
						temp.initPwdChange(data.LOGIN_CODE);
					}else {
						location.href = CTX+"/web/index.html";
					}
				}else{
					if(if_v == "Y") {//此工号不需要短信验证
						if(pwdIsChanged == "N") {
							
							temp.initPwdChange(data.LOGIN_CODE);
						}else {
							location.href = CTX+"/web/index.html";
						}
					}else {
						//temp.verification(data.LOGIN_CODE,pwdIsChanged);
						location.href = CTX+"/web/index.html";
					}
				}
				
				
			} else {
				if(temp.loginType == "Y"){
					layer.tips(data.msg, '#password', {
						time: 5
					});
				}else{
					layer.tips(data.msg, '#verifyCode', {
						time: 5
					});
				}
				
				//layer.alert(data.msg,8);
				temp.changeVerifyCode();
			}
		}, data, true);

	};

	this.clearData = function() {
		var param = {};
		var url = "/sale/clearSession.do";
		$.jump.ajax(url.encodeUrl(), function(data) {
			temp.clearCookie();
		}, param, false);
	};
	/**
	 * 登陆页面初始化清除cookie
	 */
	this.clearCookie = function() {
		var strCookie = document.cookie;
		var arrCookie = strCookie.split(";"); // 将多cookie切割为多个名/值对
		for ( var i = 0; i < arrCookie.length; i++) { // 遍历cookie数组，处理每个cookie对
			var arr = arrCookie[i].split("=");
			var exp = new Date();
			exp.setTime(exp.getTime() - 1);
			document.cookie = arr[0] + "=" + arr[1] + "; expires="
					+ exp.toGMTString() + "; path=/";
		}
	};

	/** 登陆 */
	this.doLogin = function() {
		
		if (!temp.validate()) {
			return;
		}
		var param = ({
			empeeCode : $.trim(temp.getEmpeeId()),
			password : $.trim(temp.getPassword()),
			verifyCode : $.trim(temp.getVerifyCode())
		});
		temp.loginCallback(param);
	};
	
	/** 忘记密码*/
	this.forgetPassWord = function() {
		var html = [];
		html.push('<div style="width:400px;background:#3f7aaa;">');
		html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">密码找回</h2>');
		html.push('<table width="90%" border="0" cellspacing="0" cellpadding="0"  style="margin-right:auto;margin-left:auto;border-radius:5px;background:#3f7aaa;padding:10px 30px;">');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:80px;">用户名：</td>');
		html.push('<td  align="left" style="background: #79a2c4"><input type="text"');
		html.push(' id="userCode" class="input" style="width:130px;"></td>');
		html.push('</tr>');
		html.push('<tr style="height:20px;"><td></td><td></td></tr>');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:80px;">验证码：</td>');
		html.push('<td  align="left" style="background: #79a2c4;"><input type="text"');
		html.push('id="userRandom" class="input" style="width:130px;"><button id="getRandom" style="color:#FFFDFD;border-style:none;background-color:#3f7aaa;text-decoration: underline;">点击获取</button></td>');
		html.push('</tr>');
		html.push('<tr style="height:80px;">');
		html.push('<td align="center" colspan="2">');
		html.push('<a class="but" id="nextButton">下一步</a>');
		html.push('</tr>');
		html.push('</table>');
		html.push('</div>');
		//密码找回
		var randomPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		//下一步
		$("#nextButton").unbind("click").bind("click",function(){
			var userCode = $("#userCode").val().trim();//用户名
			var userRandom =$("#userRandom").val().trim();//随机码
			if(userCode == ""){
				layer.alert("用户名不能为空",8);
				return
			}else if(userRandom == ""){
				layer.alert("随机码不能为空",8);
				return;
			}else{
				var param = {
						"handleType"	:		"check"			,
						"random"		:  		userRandom
				};
				$.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
					if (data.code == "0") {
						layer.close(randomPage);
						temp.updatePwd(userCode);
					} else {
						layer.alert(data.msg,8);
						$("#userRandom").val('');
						return;
					}
				}, param, false,false);
				

			}
		});
		
		//获取随机码
		$("#getRandom").unbind("click").bind("click",function(){
			
			var userCode = $("#userCode").val().trim();//用户名
			if(userCode == ""){
				layer.alert("请输入用户名",8);
				return;
			}
			var param = {
					"handleType"	:		"get"			,
					"userCode"		:  		userCode
			};
			$.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
				var retCode = data.code;
				if (retCode == "0") {
					temp.countdown($("#getRandom"));
					layer.alert(data.msg,9);
					return;
				} else {
					layer.alert(data.msg,8);
					return;
				}
			}, param, false,false);
		});
	};
	
	/** 系统登录手机验证 **/
	this.verification = function(userCode,pwdIsChanged){
		var myRandom = '';
		var html = [];
		html.push('<div style="width:400px;background:#3f7aaa;">');
		html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">短信验证</h2>');
		html.push('<table width="90%" border="0" cellspacing="0" cellpadding="0"  style="margin-right:auto;margin-left:auto;border-radius:5px;background:#3f7aaa;padding:10px 30px;">');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:80px;">验证码：</td>');
		html.push('<td  align="left" style="background: #79a2c4;"><input type="text"');
		html.push('id="userRandom2" class="input" style="width:130px;"><button id="getRandom2" style="color:#FFFDFD;border-style:none;background-color:#3f7aaa;text-decoration: underline;">点击获取</button></td>');
		html.push('</tr>');
		html.push('<tr style="height:80px;">');
		html.push('<td align="center" colspan="2">');
		html.push('&nbsp;&nbsp;<a class="but" id="nextButton2">下一步</a>&nbsp;&nbsp;&nbsp;&nbsp;<a class="but" id="cancelButton">取&nbsp;&nbsp;&nbsp;&nbsp;消</a>');
		html.push('</tr>');
		html.push('</table>');
		html.push('</div>');
		//密码找回
		var randomPage = $.layer({
		    type: 1,
		    title: false,
		    closeBtn: [0, false],
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		//下一步
		$("#nextButton2").unbind("click").bind("click",function(){
			var userRandom =$("#userRandom2").val().trim();//随机码
			if(userRandom == ""){
				layer.alert("随机码不能为空",8);
				return;
			}else{
				var param = {
						"handleType"	:		"check"			,
						"random"		:  		userRandom   ,
						"userCode":userCode
				};
				$.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
					/*if (data.code == "0") {
						if(pwdIsChanged=='N'){
							
							layer.close(randomPage);
							temp.initPwdChange(userCode);
						}else{
							layer.close(randomPage);
							location.href = CTX+"/web/index.html";
						}
					} else {*/
					if(data.code == "1"){
						layer.alert(data.msg,8);
						$("#userRandom2").val('');
						return;
					}
				}, param, false,false);
			}
		});
		

		$("#cancelButton").unbind("click").bind("click",function(){
			layer.close(randomPage);
			
			$.jump.ajax(URL_LOGOUT.encodeUrl(), function(data) {
				location.href=CTX+'/web/login.html';
				return;
		    }, null,false,false);
		
		});
		
		//获取随机码
		$("#getRandom2").unbind("click").bind("click",function(){
			//myRandom = (Math.random()*1000000+'').substring(0,6);
			var param = {
					"handleType"	:		"get"			,
					"userCode"		:  		userCode
			};
			$.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
				if (data.code == "0") {
					temp.countdown($("#getRandom2"));
					layer.alert(data.msg,9);
				} else {
					layer.alert(data.msg,8);
					$("#userRandom2").val('');
					return;
				}
			}, param, false,false);
		});
	
		
		$('#getRandom2').click();
		
	};
	
	
	
	//密码修改
	this.updatePwd  = function(userCode){
		var html = [];
		html.push('<div style="width:400px;background:#3f7aaa;">');
		html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">密码修改</h2>');
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"  style="margin-right:auto;margin-left:auto;border-radius:5px;background:#3f7aaa;padding:10px 30px;">');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;height:80px;">新密码：</td>');
		html.push('<td width="200px;" align="left"><input type="password"');
		html.push('id="newPwd" class="input"></td>');
		html.push('</tr>');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;">确认密码：</td>');
		html.push('<td width="200px;" align="left"><input type="password"');
		html.push(' id="confPwd" class="input" style="margin-top:10px;"></td>');
		html.push('</tr>');
		html.push('<tr style="height:80px;">');
		html.push('<td align="center" colspan="2">');
		html.push('<a class="but" id="confUpdatePwd">确定</a>');
		html.push('</tr>');
		html.push('</table>');
		html.push('</div>');
		 var pwdUpdatePage = $.layer({
			    type: 1,
			    title: false,
			    area: ['auto', 'auto'],
			    border: [0], //去掉默认边框
			    page: {
			        html: html.join('')
			    }
			});
		 $("#confUpdatePwd").unbind("click").bind("click",function(){
			 
			 var newPwd = $("#newPwd").val().trim();
			 var confPwd = $("#confPwd").val().trim();
			 
			 var patrn1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			 var patrn2 = /^(?=.*\d)(?=.*[a-z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 var patrn3 = /^(?=.*\d)(?=.*[A-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 var patrn4 = /^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 
//			 if(newPwd.length != 6){
			 if(!(patrn1.exec(newPwd) || patrn2.exec(newPwd) || patrn3.exec(newPwd) || patrn4.exec(newPwd))){
				 layer.alert("请输入8位以上密码，必须包含数字、大小写和特殊字符其中三项，不包含空格");
				 return ;
			 }else if(newPwd != confPwd){
				 layer.alert("两次密码输入不一致",8);
				 return ;
			 }
			 var param = {
						"handleType"	:		"update"			,
						"userCode"		:  		userCode			,
						"newPwd"		:		newPwd				
				};	
			 $.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
					if (data.code == "0") {
						layer.alert("密码修改成功",9);
						 layer.close(pwdUpdatePage);
						return;
					} else {
						layer.alert(data.msg,8);
						return;
					}
				}, param, false,false);
		 });
	};
	
	//初始密码修改
	this.initPwdChange  = function(userCode){
		var html = [];
		html.push('<div style="width:400px;background:#3f7aaa;">');
		html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">密码修改</h2>');
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"  style="margin-right:auto;margin-left:auto;border-radius:5px;background:#3f7aaa;padding:10px 30px;">');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;height:80px;">新密码：</td>');
		html.push('<td width="200px;" align="left"><input type="password"');
		html.push('id="newPwd" class="input"></td>');
		html.push('</tr>');
		html.push('<tr>');
		html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;">确认密码：</td>');
		html.push('<td width="200px;" align="left"><input type="password"');
		html.push(' id="confPwd" class="input" style="margin-top:10px;"></td>');
		html.push('</tr>');
		html.push('<tr style="height:80px;">');
		html.push('<td align="center" colspan="2">');
		html.push('<a class="but" id="confUpdatePwd">确定</a>');
		html.push('</tr>');
		html.push('</table>');
		html.push('</div>');
		 var initPwdUpdatePage = $.layer({
			    type: 1,
			    title: false,
			    area: ['auto', 'auto'],
			    border: [0], //去掉默认边框
//			    closeBtn: [0, false],
			    page: {
			        html: html.join('')
			    },
			    close:function(){
			    	location.href = CTX+"/web/index.html";
			    }
			});
		 
		 $("#confUpdatePwd").unbind("click").bind("click",function(){
			 var newPwd = $("#newPwd").val().trim();
			 var confPwd = $("#confPwd").val().trim();
			 
			 var patrn1 = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
			 var patrn2 = /^(?=.*\d)(?=.*[a-z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 var patrn3 = /^(?=.*\d)(?=.*[A-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 var patrn4 = /^(?=.*[a-z])(?=.*[A-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{8,}$/;
			 
//			 if(newPwd.length != 6){
			 if(!(patrn1.exec(newPwd) || patrn2.exec(newPwd) || patrn3.exec(newPwd) || patrn4.exec(newPwd))){
				 layer.alert("请输入8位以上密码，必须包含数字、大小写和特殊字符其中三项，不包含空格");
				 return ;
			 }else if(newPwd != confPwd){
				 layer.alert("两次密码输入不一致",8);
				 return ;
			 }
			 var param = {
						"handleType"	:		"update"			,
						"userCode"		:  		userCode			,
						"newPwd"		:		newPwd				
				};	
			 
			 $.jump.ajax(URL_FORGET_PASSWORD.encodeUrl(), function(data) {
					if (data.code == "0") {
						layer.alert("密码修改成功",9);
						layer.close(initPwdUpdatePage);
						location.href = CTX+"/web/index.html";
					} else {
						layer.alert(data.msg,8);
						return;
					}
				}, param, false,false);
		 });
	};
	
	//60秒倒计时
	this.countdown = function(o){
        if (wait == 0) {  
            o.attr("disabled", false);  
            o.text("点击获取");  
            wait = 60;  
        } else {  
        	
            o.attr("disabled", true);  
            o.text("重新发送(" + wait + ")");  
            wait--;  
            setTimeout(function() {  
                temp.countdown(o);  
            },  
            1000);  
        };  
    };
};


/**当页面加载完之后*/
$(document).ready(function() {
	/**初始化*/
	
		var login = new Login();
		login.init(sysLoginType);
	
});


