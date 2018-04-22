var Home = new Function();

Home.prototype = {
	
	parentBody 	: null,
	 
	helpTel 	: null,
	
	isImplant 	: false,//是否嵌入多角色平台
	
	scroll 		: null,
	
	comeFrom	: null,//来源
	
	showType : null,
	
	staffId : "",
	
	funNodeIds : {
		
	},
	init : function(parentBody){
		this.parentBody = parentBody;
		var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1 ;
		var hasSession = common.utils.getHtmlUrlParam("hasSession");
		this.helpTel = common.utils.getHtmlUrlParam("helpTel");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
		this.showType = common.utils.getHtmlUrlParam("showType");
		
		var parentThis = this;
		if(!isChrome && "yes" == hasSession){
			common.isAndroid = true;
		}
		//直接登录
		if("yes" == hasSession){
			var app_version = common.utils.getHtmlUrlParam("app_version");
			if(app_version)
				app_version = eval("("+decodeURI(app_version)+")");
			parentThis.initInner();
		}else{
			
			if(this.comeFrom && this.comeFrom == "ZIP"){
				//JS验证登录，多角色门户内嵌ZIP登录
							
				this.loginJs();
			}else{
							
				//本机APP登录，多角色门户跳转
				this.loginApp();	
			}
			
		}
	},
	//初始化home内容
	initInner : function(){
		var parentThis = this;
		parentThis.bindMethod();
	},
	/**
	 * 登录
	 * 通过本机安装包获取多角色门户回话
	 * */
	loginApp : function(){
		var parentThis = this;
		common.execGap(function(jsonData){

			common.isAndroid = true;
			
			if(jsonData.code='0000'){
				parentThis.authLogin(jsonData,function(){
	        		alert("该用户非小CEO用户，请重新登录!");
					navigator.app.backHistory(); 
					common.loginOut();
	        	});
			}else{
				alert("令牌获取失败，重新登录！");
				common.loginOut();
			}
		},function(msg){
			alert("会话超时失效，返回登录！");
			common.loginOut();
		},"GetTicket","etst",[]);
	},
	/**
	 * 登录
	 * 通过JS方式登录获取多角色门户回话
	 * */
	loginJs : function(){
		var parentThis = this;
		new AppService().getTicket(function(ticketData){
	        var sodata={
	            ticket:ticketData,
	            service_code:"AUTHOR_0003"
	        };
	        
	        sessionStorage.setItem("ticket",ticketData);
	        
	        util.ajaxRequest(MPI_TICKET_VALID,sodata,function(data){   	
	        	if(data.code='0000'){
	        		data.data = JSON.stringify(data.data);
		        	
			        common.isAndroid = true;
			        
		        	data["cpcAndroid"] = "androidCpcCall";
		        	data["ticket"] = ticketData;
		        	
		        	parentThis.authLogin(data,function(){
		        		alert("该用户非小CEO用户，请重新登录!");
						(new AppService()).closeApp();
		        	});
		        	
				}else{
					alert("令牌获取失败，重新登录！");
					common.loginOut();
				}
	        	
	        	
	        },function(){ alert("shibai1");});
	    },function(){ alert("shibai2");});
		
	},
	//我要帮助认证
	authLogin : function(jsonData,fail){
		var parentThis = this;
		var data = jsonData.data;
		parentThis.staffId =  data.user_id;
		data = eval("("+data+")");
		var param = null;
		if(null == sessionStorage.getItem("help_ticket")){
			param = {
					"latn_id"	:data.latn_id,
					"empeeCode" :parentThis.encode64(data.login_code.toString()),
					"staff_id"	:data.user_id,
					"acc_nbr"	:data.acc_nbr,
					"staff_name":data.user_name,
					"cpcAndroid":parentThis.encode64(jsonData.cpcAndroid),
					"ticket"	:data.ticket,
					"sys_id" 	: APP_ID
			};
			sessionStorage.setItem("help_ticket",JSON.stringify(param));
		}

		//已经登录 直接返回
		if(null != sessionStorage.getItem("isImplant") && sessionStorage.getItem("isImplant")){
			parentThis.initInner();
			return;
		}
		//开始本地登录
		$.jump.ajax(URL_LOGIN,function(jsondata){
			if(jsondata.code == "0"){
				//成功，开始初始化
				common.setJsessionid(jsondata.jsessionid);
				sessionStorage.setItem("isImplant",true);
				sessionStorage.setItem("jsessionid",jsondata.jsessionid);
				parentThis.isImplant = true;
				parentThis.helpTel = jsondata.helpTel;
				
				parentThis.initInner();
			}else{
				fail();
			}
		},param,true);
	},
	//退出
	onAppOut : function(button){
		if(!navigator.notification){
			new AppService().closeApp();
		}else{
			navigator.notification.confirm('您确定要退出“我要帮助”吗？', function(button){
				if( button==1 ) {
					navigator.app.exitApp();
				}
			}, '退出我要帮助', '确定,取消');
		}
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
	bindMethod : function(){
		var parentThis = this;
		document.addEventListener("deviceready", function(){
			document.addEventListener("backbutton", parentThis.onAppOut, false);
		}, false);
        
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
				new AppService().closeApp();
			});
		//APP查询登录角色
		var params={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"   	 :  "qryStaffRoleById"
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code == "0" ){
				
				$.each(json.data,function(i,obj){
					if(obj.role_id=="170000200"){//发起角色
						$("#showShortProcessListInfo").css('display','block');
					}
					if(obj.role_id=="170000300"){//发起角色
						$("#showShortProcessDisposeInfo").css('display','block');
					}
				});
			}
		}, params, false,false);
		/**短流程*/
		"".findById("a", "showShortProcessList", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("shortProcessList.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
		});
		"".findById("a", "showShortProcessDisposeList", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("showShortProcessDisposeList.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
		});
		"".findById("a", "transitShortProcessList", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("transitShortProcessList.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
		});
//		"".findById("a", "historyShortProcessList", this.parentBody)[0].unbind().bind("click",function(){
//			common.go.next("historyShortProcessList.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
//		});
	},
};
$(document).ready(function(){
	if(null!=sessionStorage.getItem("jsessionid")){
		common.jsessionid=sessionStorage.getItem("jsessionid");
	}
	var home  =new Home();
	home.init($(this));
});