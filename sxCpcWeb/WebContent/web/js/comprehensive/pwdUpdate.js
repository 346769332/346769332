var PwdUpdate = new Function();

PwdUpdate.prototype = {
		selecter : "#pwdUpdatePage",
		passWord : null	,
		//初始化执行
		init : function() {
			this.bindMetod(this);
			this.initLoginCode(this);
		},
		initLoginCode : function (parentThis){
			var param = {
 					"handleType" 	: 		"init"				,
 				};
			$.jump.ajax(URL_PWD_UPDATE.encodeUrl(), function(json) {
				var loginCodeObj = parentThis.selecter.findById("input","loginCode")[0]; //用户名
				loginCodeObj.val(json.loginCode);
				parentThis.passWord=json.passWord;
			}, param, true);
		},
		bindMetod : function(parentThis){
			var resetObj = parentThis.selecter.findById("a","reset")[0]; //重置
			var oldPasswordObj = parentThis.selecter.findById("input","oldPassword")[0]; //旧密码
			var newPasswordObj = parentThis.selecter.findById("input","newPassword")[0]; //新密码
			var conPasswordObj = parentThis.selecter.findById("input","conPassword")[0]; //确认密码
			var oldPwdDescObj = parentThis.selecter.findById("font","oldPwdDesc")[0]; //旧密码提示
			var newPwdDescObj = parentThis.selecter.findById("font","newPwdDesc")[0];//新密码提示
			var conPwdDescObj = parentThis.selecter.findById("font","conPwdDesc")[0];//就密码提示
			resetObj.unbind("click").bind("click",function(){
				oldPasswordObj.val("");
				newPasswordObj.val("");
				conPasswordObj.val("");
				oldPwdDescObj.text("");
				newPwdDescObj.text("");
				conPwdDescObj.text("");
			});
			parentThis.checkData(parentThis);
		},
		submitPassWord : function(parentThis){
			var oldPasswordObj = parentThis.selecter.findById("input","oldPassword")[0]; //旧密码
			var newPasswordObj = parentThis.selecter.findById("input","newPassword")[0]; //新密码
			var conPasswordObj = parentThis.selecter.findById("input","conPassword")[0]; //确认密码
			var confirmationObj = parentThis.selecter.findById("a","confirmation")[0]; //确认
			confirmationObj.unbind("click").bind("click",function(){
				
				var oldPwdDescObj = parentThis.selecter.findById("font","oldPwdDesc")[0];
				var conPwdDescObj = parentThis.selecter.findById("font","conPwdDesc")[0];
				var newPwdDescObj = parentThis.selecter.findById("font","newPwdDesc")[0];
				
				if(oldPwdDescObj.text() == "" && newPwdDescObj.text() == "" && conPwdDescObj.text() == "" && (oldPasswordObj.val() !="" &&  newPasswordObj.val() !="" && conPasswordObj.val() !="") ){
					$.layer({
					    shade: [0],
					    area: ['auto','auto'],
					    dialog: {
					        msg: '您是否确认修改密码？',
					        btns: 2,                    
					        type: 4,
					        btn: ['确定','取消'],
					        yes: function(){
					        	var param = {
					 					"handleType" 	: 		"pwdUpdate"				,
					 					"passWord"		:		newPasswordObj.val()	
					 				};
								$.jump.ajax(URL_PWD_UPDATE.encodeUrl(), function(json) {
									if(json.code == "0"){
										layer.alert("修改成功",9);
										oldPasswordObj.val("");
										newPasswordObj.val("");
										conPasswordObj.val("");
									}else{
										layer.alert("修改失败 ",8);
									}
								}, param, true);
					        }
					    }
					});
				}else{
					layer.alert("校验未通过",8);
				};
			});
		},
		//数据校验
		checkData : function(parentThis){
			
			var oldPasswordObj = parentThis.selecter.findById("input","oldPassword")[0]; //旧密码
			var newPasswordObj = parentThis.selecter.findById("input","newPassword")[0]; //新密码
			var conPasswordObj = parentThis.selecter.findById("input","conPassword")[0]; //确认密码
			
			var oldPwdDescObj = parentThis.selecter.findById("font","oldPwdDesc")[0];
			var newPwdDescObj = parentThis.selecter.findById("font","newPwdDesc")[0];
			var conPwdDescObj = parentThis.selecter.findById("font","conPwdDesc")[0];
			//旧密码校验
			oldPasswordObj.unbind("blur").bind("blur",function(){
				if($(this).val() != ""){
					var param = {
		 					"handleType" 	: 		"pwdCheck"				,
		 					"passWord"		:		 $(this).val()
		 				};
					$.jump.ajax(URL_PWD_UPDATE.encodeUrl(), function(json) {
						if(!json.flag){
							oldPwdDescObj.text("*密码错误");
							return;
						}else{
							oldPwdDescObj.text("");
						}
					}, param, true);
				}
			});
			
			//新密码校验
			newPasswordObj.unbind("blur").bind("blur",function(){
				var value = $(this).val().trim();
				var patrn = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=(?:.*?[!@#$%*()_+^&}{:;?.])).{6,20}$/;
//				(?!^\\d+$)(?!^[a-zA-Z]+$)(?!^[_#@]+$).{8,}  (?=(?:.*?[!@#$%*()_+^&}{:;?.]))[a-zA-Z0-9]
//				var patee = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[~!@#$%^&*()_+`\-={}[Math Processing Error]:";'<>?,.\/]).{4,16}$/;
				
//				if($(this).val().trim().length < 6 || $(this).val().trim().length > 20){
				if(!patrn.exec(value)) {
					newPwdDescObj.text("*请输入6-20位密码，必须包含数字、大小写和特殊字符，不包含空格");
					return;
				}else{
					newPwdDescObj.text("");
				}
				if(newPasswordObj.val() == oldPasswordObj.val()) {
					newPwdDescObj.text("*新密码和旧密码相同");
					return;
				}else {
					newPwdDescObj.text("");
				}
				if(conPasswordObj.val() != "" && conPasswordObj.val() != newPasswordObj.val()) {
					conPwdDescObj.text("*两次输入的密码不一致");
					return;
				}else{
					conPwdDescObj.text("");
				}
			});
			
			//确认密码校验
			conPasswordObj.unbind("blur").bind("blur",function(){
//				var newPwdDescObj = parentThis.selecter.findById("font","newPwdDesc")[0];
				/*if($(this).val().trim().length != 6 ){
					conPwdDescObj.text("*密码只能为6位");
					return;
				}else{
					conPwdDescObj.text("");
				}*/
				if(conPasswordObj.val() != newPasswordObj.val()){
					conPwdDescObj.text("*两次输入的密码不一致");
					return;
				}else{
					conPwdDescObj.text("");
				}
			});
			parentThis.submitPassWord(parentThis);
		}
	};
