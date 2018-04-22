var Home = new Function();

Home.prototype = {
	
	parentBody 	: null,
	 
	helpTel 	: null,
	
	isImplant 	: false,//是否嵌入多角色平台
	
	scroll 		: null,
	comeFrom	: null,//来源
	dayList  : null,//时间配置列表
	noSatisfy : null,// 
	satisfy : null,//
	evalManager : null,
	init : function(parentBody){
		
		
		this.parentBody = parentBody;
		var isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1 ;
		var hasSession = common.utils.getHtmlUrlParam("hasSession");
		this.helpTel = common.utils.getHtmlUrlParam("helpTel");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
		
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
		//parentThis.searchListCount();
		//查询页面的初始信息
		parentThis.searchEvalInfo();
		parentThis.bindMethod();
		var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
		scrollDivObj.height((document.documentElement.clientHeight-60)+"px");
		parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
			return;
		});
		
		
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
		data = eval("("+data+")");
		var param = null;
		if(null == sessionStorage.getItem("help_ticket")){
			param = {
					"latn_id"	:data.latn_id,
					"empeeCode" :data.login_code,
					"staff_id"	:data.user_id,
					"acc_nbr"	:data.acc_nbr,
					"staff_name":data.user_name,
					"cpcAndroid":jsonData.cpcAndroid,
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
             sessionStorage.setItem("jsessionid",jsondata.jsessionid);
				sessionStorage.setItem("isImplant",true);
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
			navigator.notification.confirm('您确定要退出“逆评和红包激励”吗？', function(button){
				if( button==1 ) {
					navigator.app.exitApp();
				}
			}, '退出逆评和红包激励', '确定,取消');
		}
	},
	//查询评价信息
	searchEvalInfo : function(){
		var parentThis=this;
		var param={"handleType":"qryHomePageInfo"};
		$.jump.ajax(URL_SHOW_EVAL_PAGE, function(json){
			var code=json.code;
			if("0"==code){
				parentThis.dayList=json.dayList;
				parentThis.noSatisfy=json.noSatisfy;
				parentThis.satisfy=json.satisfy;
				parentThis.evalManager=json.evalManager;
			}
		}, param, true);
	},
	bindMethod : function(){
		var parentThis = this;
		var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
		document.addEventListener("deviceready", function(){
			document.addEventListener("backbutton", parentThis.onAppOut, false);
		}, false);
        
		/**退出逆评应用*/
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			new AppService().closeApp();
		});
		//支撑部门的评价
		"".findById("a", "evalDept", this.parentBody)[0].unbind().bind("click",function(){
			if(!parentThis.validate(showDialogDivObj,'dept')){
				return;
			}
			if(parentThis.noSatisfy.length<=0){
				common.go.next("eval_dept.html?satisfy=D");
			}else{
				if(parentThis.satisfy.length<=0){
					common.go.next("eval_dept.html?satisfy=A");
				}else{
					common.loadMsgDialog(showDialogDivObj,"消息提示","本月支撑部门已评价过！");
					return;
				}
			}
			
		});
		//领导班子的评价
		"".findById("a", "evalManager", this.parentBody)[0].unbind().bind("click",function(){
			if(!parentThis.validate(showDialogDivObj,'manager')){
				return;
			}
			if(parentThis.evalManager<=0){
				common.go.next("eval_manager.html");
			}else{
				common.loadMsgDialog(showDialogDivObj,"消息提示","本月领导班子评价已结束！");
				return;
			}
			
		});
		//电子红包的激励
		"".findById("a", "sendMoney", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("send_money.html");
		});

		
	},
	sleep: function(numberMillis){
	    var now = new Date();
	    var exitTime = now.getTime() + numberMillis;
	    while (true) {
	        now = new Date();
	        if (now.getTime() > exitTime)
	            return;
	    }
	},
	validate : function(showDialogDivObj,evalType){
		
		var parentThis = this;
		
		if(parentThis.dayList.length>0){
			var startDay=null;
			var endDay=null;
			$.each(parentThis.dayList,function(i,obj){
				if(evalType==obj.eval_type){
					startDay=obj.start_day;
					endDay=obj.end_day;
				}
			});
			var myDate = new Date();
			var day = myDate.getDate(); 
			if((day<startDay)||(day>endDay)){
				common.loadMsgDialog(showDialogDivObj,"消息提示","本月评价期限已过！");
				return false;
			}else{
				return true;
			}
		}else{
			return true;
		}
	},
	
	
};




$(document).ready(function(){
	if(null!=sessionStorage.getItem("jsessionid")){
		common.jsessionid=sessionStorage.getItem("jsessionid");
	}
	var home  =new Home();
	home.init($(this));
});