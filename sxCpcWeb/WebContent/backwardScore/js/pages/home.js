var Home = new Function();

Home.prototype = {
	
	parentBody 	: null,
	 
	helpTel 	: null,
	
	isImplant 	: false,//是否嵌入多角色平台
	
	scroll 		: null,
	
	comeFrom	: null,//来源
	
	showType : null,
	
	role_type : null, //登录用户角色类型
	
	arrayList : [],
	
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
			navigator.notification.confirm('您确定要退出“逆向打分”吗？', function(button){
				if( button==1 ) {
					navigator.app.exitApp();
				}
			}, '退出逆向打分', '确定,取消');
		}
	},
	bindMethod : function(){
		var parentThis = this;
		document.addEventListener("deviceready", function(){
			document.addEventListener("backbutton", parentThis.onAppOut, false);
		}, false);
        
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			new AppService().closeApp();
		});
		"".findById("button", "evalBtn", this.parentBody)[0].unbind().bind("click",function(){
			parentThis.submitInfo(parentThis);
		});
		//逆向打分支撑部门及领导信息查询
		parentThis.searchDeptmentInfo();
	},
	loaded :  function(){
		var myScroll;
		myScroll = new iScroll('wrapper', {
		scrollbarClass: 'myScrollbar',
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType != 1) target = target.parentNode;

			if (target.tagName != 'RADIO' && target.tagName != 'INPUT')
				e.preventDefault();
		}
	});
	},
	//逆向打分支撑部门及领导信息查询
	searchDeptmentInfo:function(){
		var parentThis = this;
		var param={
			"hanleType" : "qryDeptOrStaffInfo",
		};
		$.jump.ajax(SHOW_DEPTANDSTAFF_INFO,function(data){
			if(data.code == 0){
				parentThis.setPageTable(data.deptInfo);
			}else{
				var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
				common.loadMsgDialog(showDialogDivObj,"消息提示","查询部门及领导信息失败！",null,null);
			}
		},param,true);
		},
	
	setPageTable:function(deptInfo){
		var parentThis = this;
		var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
		//判断本月是否已评价
		var param={
			"hanleType" : "checkEval",
		};
		$.jump.ajax(SHOW_DEPTANDSTAFF_INFO,function(data){
			if(data.code == 0){
				if(data.data==0){ //未评价
					//再判断评价是否过期
					var dd = new Date();
					var d = dd.getDate(); //当前日
					if(deptInfo[0].start_time<d && d<deptInfo[0].end_time){
						parentThis.showInfo(deptInfo);
					}else{
						common.loadMsgDialog(showDialogDivObj,"消息提示","评价时间已过期，请下月再进行评价！",null,null);
						return false;
					}					
				}else{
					common.loadMsgDialog(showDialogDivObj,"消息提示","您已参与本次评价，请下月再进行评价！",null,null);
					return false;
				}
			}
		},param,true);
	},
	showInfo : function(deptInfo){
		var parentThis = this;
		var deptAndStaffDivObj = "".findById("div","deptAndStaffDiv",this.parentBody)[0];
		var showDeptDivObj = "".findById("div","showDeptDiv",this.parentBody)[0]; //部门信息
		var showStaffDivObj = "".findById("div","showStaffDiv",this.parentBody)[0]; //领导信息
		showDeptDivObj.empty();
		showStaffDivObj.empty();
	    if(deptInfo.length > 0){
	    	deptAndStaffDivObj.show();
	    	$("#evalBtnDiv").show();
	    	$.each(deptInfo,function(i,obj){
	    		if(i==0){
	    			parentThis.role_type = obj.pro_role_type;
	    		}
	    		var deptHtml = [];
	    		var staffHtml = [];
	    		if(obj.flag == 1){ //被打分人是部门
	    			deptHtml.push('<dl class="xq_content">');
	    			deptHtml.push('<dt id='+obj.opt_id+'>'+obj.opt_name+'</dt>');
	    			deptHtml.push('<dd><span class="badgespan" id="span_'+obj.opt_id+'">100</span><a style="background: #fff;width: atuo; " name="deptAndStaffScore" id="scoreDiv_'+obj.opt_id+'" href="#" flag='+obj.flag+' optId='+obj.opt_id+' proRoleType='+obj.pro_role_type+' score="100"><img src="../images/tzright.png" style="width:16px;"></a></dd>');
	    			deptHtml.push('</dl>');
	    			showDeptDivObj.append(deptHtml.join(''));
	    		}else if(obj.flag == 2){ //被打分人是领导
	    			staffHtml.push('<dl class="xq_content">');
	    			staffHtml.push('<dt id='+obj.opt_id+'>'+obj.opt_name+'</dt>');
	    			staffHtml.push('<dd><span class="badgespan" id="span_'+obj.opt_id+'">100</span><a style="background: #fff;width: atuo; " name="deptAndStaffScore" id="scoreDiv_'+obj.opt_id+'" href="#"  flag='+obj.flag+' optId='+obj.opt_id+' proRoleType='+obj.pro_role_type+' score="100"><img src="../images/tzright.png" style="width:16px;"></a></dd>');
	    			staffHtml.push('</dl>');
	    			showStaffDivObj.append(staffHtml.join(''));
	    		}
			});
		}else{
			deptAndStaffDivObj.hide();
		}
	    
	    //判断登录人是否是小ceo
		var checkCeo = "";
		if(parentThis.role_type == "1"){
			checkCeo = "#myModalCeo";
		}else{
			checkCeo = "#myModal";
		}
	    //部门、领导、应用系统评价
	    deptAndStaffDivObj.find("a[name='deptAndStaffScore']").unbind().bind("click",function(){
	    	var scoreObj = $(this);
	    	var optId = scoreObj.attr("optId");
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			scoreObj.attr("data-toggle", "modal");
			scoreObj.attr("data-target", checkCeo);
	    	//非小ceo用户进行评价
		    $("#scoreBtn").unbind().bind("click",function(){
				var scoreVal = $("#scoreVal").val();
				//校验
				if(scoreVal=="" || scoreVal==null){
					$("#scoreVal").val(100);
					$(checkCeo).modal("hide");
					common.loadMsgDialog(showDialogDivObj,"消息提示","分值不能为空，请重新评价！",null,null);
					return false;
				}
				if(scoreVal > 100){
					$("#scoreVal").val(100);
					$(checkCeo).modal("hide");
					common.loadMsgDialog(showDialogDivObj,"消息提示","分值必须在100分以内，请重新评价！",null,null);
					return false;
				}
				$("#span_"+optId+"")[0].innerHTML=scoreVal;
				$("#scoreDiv_"+optId+"").attr("score",scoreVal);
				$(checkCeo).modal("hide");
	    	});
	    	//小ceo用户进行评价
		    $("#ceoScoreBtn").unbind().bind("click",function(){
		    	var scoreVal = $("#myModalCeo").find("input[type='radio'][name='sex']:checked").val();
		    	$("#span_"+optId+"")[0].innerHTML=scoreVal;
		    	$("#scoreDiv_"+optId+"").attr("score",scoreVal);
		    	$(checkCeo).modal("hide");
				var html='<dl class="dx"><dt>非常满意</dt><dd><input type="radio" name="sex" value="110"></dd></dl>'+
		         '<dl class="dx"><dt>满意</dt><dd><input type="radio" name="sex" value="100" checked></dd></dl>'+
				 '<dl class="dx"><dt>基本满意</dt><dd><input type="radio" name="sex" value="80"></dd></dl>'+
				 '<dl class="dx"><dt>不满意</dt><dd><input type="radio" name="sex" value="60"></dd></dl>'+
				 '<dl><button id="ceoScoreBtn" type="button" class="btn btn-primary btn-block" style="width: 50%;margin-left: 25%;">确认</button></dl>';
				 $("#divceoScore").html(html);
			});
	    });
		parentThis.loaded();	
	},
	submitInfo : function(parentThis){
		var showDialogDivObj = "".findById("div","showDialogDiv",this.parentBody)[0];
		var deptAndStaffDivObj = "".findById("div","deptAndStaffDiv",this.parentBody)[0];
		var scoreDivObj = deptAndStaffDivObj.find("a[id^='scoreDiv_']");
		var arrayB={};
		for(var i=0;i<scoreDivObj.length;i++){
			arrayB = {"flag":scoreDivObj[i].attributes.flag.value, "optId":scoreDivObj[i].attributes.optId.value, "proRoleType":scoreDivObj[i].attributes.proRoleType.value,"score":scoreDivObj[i].attributes.score.value,};
			parentThis.arrayList.push(JSON.stringify(arrayB));
		}
		var param={
			"hanleType"   	: 	"insertScoreInfo",
			"arrayFileInfo" : 	"["+parentThis.arrayList.toString()+"]",
		};
		//操作数据库
    	$.jump.ajax(SHOW_DEPTANDSTAFF_INFO,function(data){
			if(data.code == 0){
				common.loadMsgDialog(showDialogDivObj,"消息提示","打分评价成功！",null,null);
				"".findById("button","closeBtn",parentThis.parentBody)[0].unbind().bind("click",function(){
					new AppService().closeApp();
				});
			}else{
				common.loadMsgDialog(showDialogDivObj,"消息提示","打分评价失败！",null,null);
			}
		},param,true);
	},
};

$(document).ready(function(){
	var home  =new Home();
	home.init($(this));
});