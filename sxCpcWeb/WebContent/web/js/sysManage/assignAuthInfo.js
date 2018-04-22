var AssignAuthInfo=new Function();

AssignAuthInfo.prototype={
	temp : null ,
	selector : null,
	authId:"",
	authName:"",
	allAssignAuthSet:[],
	useAssignAuthSet:[],
	initUseAssignAuthSet:[],
	//初始化执行
	init : function(){
	
		temp = this ;
		this.selector="#assignAuthInfoPageDiv";
		temp.authId=common.utils.getHtmlUrlParam("authId");
		var authName=common.utils.getHtmlUrlParam("authName");
		temp.authName=decodeURI(authName);
		var authStateName=common.utils.getHtmlUrlParam("authStateName");
		this.selector.findById("td","authNameTd")[0].html(temp.authName);
		this.selector.findById("td","authStateTd")[0].html(decodeURI(authStateName));
		this.bindMethod(this);
	} ,
	//绑定方法
	bindMethod : function(parentThis) {
		//关闭
		var closeBtnObj =parentThis.selector.findById("a","closeBtn")[0];
		closeBtnObj.unbind("click").bind("click",function(){
			var i = parent.layer.getFrameIndex();
			parent.layer.close(i);
		});
		parentThis.queryAssignAuthPageInitData(parentThis);
		
		//保存按钮
		var saveBtnObj =parentThis.selector.findById("a","saveBtn")[0];
		saveBtnObj.unbind("click").bind("click",function(){
			
			var content="您确定授予"+temp.authName+"相关资源？";
			if(temp.initUseAssignAuthSet.length==0 && temp.useAssignAuthSet.length==0){
				layer.alert("请选择需开通的相关资源",8);
				return false;
			}
			if(temp.useAssignAuthSet.length==0){
				content="您确定清除"+temp.authName+"相关资源？";
			}
			var param={
					"type"						:			"save"			,
					"authId"					:			temp.authId		,
					"assignAuthInfoSet"			:			JSON.stringify(temp.useAssignAuthSet),
			};
			var confirm=layer.confirm(content, function(){
				$.jump.ajax(URL_DEAL_ASSIGN_AUTH_INFO.encodeUrl(), function(json) {
					
					if(json.code == "0" ){
						layer.alert("操作成功!",9,function(){
							var closeBtnObj =temp.selector.findById("a","closeBtn")[0];
							layer.close(confirm);
							closeBtnObj.click();
						});	
					}else{
						layer.close(confirm);
						layer.alert("操作失败!",8);	
					}
				}, param, false,false);
			});
			
		});
	},

	//获取角色数据
	queryAssignAuthPageInitData:function(parentThis){
		
		var param={
				"type"			:			"query",
				"authId"		:			temp.authId
				
		};
		
		$.jump.ajax(URL_DEAL_ASSIGN_AUTH_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				if(null!=json.allAssignAuthList && json.allAssignAuthList.length>0){
					$.each(json.allAssignAuthList,function(i,obj){
						temp.allAssignAuthSet.push(obj);
					});
				}
				if(null!=json.useAssignAuthList && json.useAssignAuthList.length>0){
					$.each(json.useAssignAuthList,function(i,obj){
						temp.useAssignAuthSet.push(obj);
						temp.initUseAssignAuthSet.push(obj);
					});
				
				}
				parentThis.initAllAssignAuthResource(parentThis);
				parentThis.initUseAssignAuthResource(parentThis);
			}else{
				layer.alert("获取权限数据异常",8);
			};
		}, param, false,false);
	},
	//初始化权限资源
	
	initAllAssignAuthResource:function(parentThis){
	
		var html=[];
		var dataSet=[];
		var menuCount=0;
		var funCount=0;
		var dataCount=0;
		$.each(temp.allAssignAuthSet,function(i,obj){
			if(obj.data_type=="MENU"){
				menuCount++;
			}else if(obj.data_type=="FUN"){
				funCount++;
			}else if(obj.data_type=="DATA"){
				dataCount++;
			}
		});
		
		if(menuCount>0){
			var param={
				"data_type"			:		"MENU"	,
				"data_name"			:		"菜单"	
			}
			dataSet.push(param);
		}
		
		if(funCount>0){
			var param={
				"data_type"			:		"FUN"	,
				"data_name"			:		"功能"	
			}
			dataSet.push(param);
		}
		
		if(dataCount>0){
			var param={
				"data_type"			:		"DATA"	,
				"data_name"			:		"数据"	
			}
			dataSet.push(param);
		}
		
		
		$.each(dataSet,function(i,dataObj){
			html.push('<li name="dataLi">');
//			if(i==0){
//				html.push('<a class="cur" href="javascript:void(0)">'+dataObj.data_name+'</a>');
//				html.push('<ul style="display:block;">');
//				$.each(temp.allAssignAuthSet,function(j,obj){
//					if(obj.data_type==dataObj.data_type){
//						html.push('<li><a href="javascript:void(0)" dataId="'+obj.data_id+'" dataType="'+obj.data_type+'">'+obj.data_name+'</a></li>  '); 
//					}
//				});
//				html.push('</ul>');
//			}else{
				html.push('<a name="dataTypeName" href="javascript:void(0)">'+dataObj.data_name+'</a>');
				html.push('<ul name="dataTypeNameUl" style="display:none;">');
				$.each(temp.allAssignAuthSet,function(j,obj){
					if(obj.data_type==dataObj.data_type){
						var showFlag="true";
						var str='style="display: list-item;"';
						if(null!=temp.useAssignAuthSet && temp.useAssignAuthSet.length>0)
						$.each(temp.useAssignAuthSet,function(m,obj2){
							if(obj2.data_type==obj.data_type && obj2.data_id==obj.data_id){
								showFlag='false';
								str='style="display:none;"';
								return false;
							}
						});
						html.push('<li  showFlag="'+showFlag+'" '+str+'>');
						html.push('<a href="javascript:void(0)" dataId="'+obj.data_id+'" dataType="'+obj.data_type+'">'+obj.data_name+'</a>');
						html.push('<ul name="auth_'+obj.data_type+'_'+obj.data_id+'"></ul>');
						html.push('</li>');
					}
				});
				html.push('</ul>');
//			}
			html.push('</li>');
		});
		
		var firstDivObj=parentThis.selector.findById("div","first")[0];
		firstDivObj.find("ul[name=assignAuthUl]").html(html.join(''));
		
		firstDivObj.find("ul[name=assignAuthUl]").find("li[name=dataLi]").each(function(){
			var ulObj=$(this).find("ul[name=dataTypeNameUl]");
			if(ulObj.find("li[showFlag=true]").size()==0){
				ulObj.parent("li").hide();
			}
		});
		
		
		firstDivObj.find("ul[name=assignAuthUl]").find("li").find("a[name=dataTypeName]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			if(liObj.children("a").hasClass("cur")){
				liObj.children("a").removeClass("cur");
				liObj.children("ul").slideUp("fast");
			}else{
				liObj.parent("ul").find("li").find("a").removeClass("cur");
				liObj.children("a").addClass("cur");
				liObj.children("ul").slideDown("fast");
				liObj.siblings().children("ul").slideUp("fast");
			}
		});
		
		firstDivObj.find("ul[name=assignAuthUl]").find("li").find("ul").find("li").unbind("click").bind("click",function(){
			var liObj=$(this);
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		firstDivObj.find("ul[name=assignAuthUl]").find("li").find("ul").find("li").unbind("dblclick").bind("dblclick",function(){
			var assignAuthInfo=null;
			var assignAuthAObj=$(this).children("a");
			var assignDataId=assignAuthAObj.attr("dataId");
			var assignDataType=assignAuthAObj.attr("dataType");
			$.each(temp.allAssignAuthSet,function(i,obj){
				if(assignDataId==obj.data_id && assignDataType==obj.data_type){
					assignAuthInfo=obj;
				}
			});
			 $(this).hide();
			 $(this).attr("showFlag","false");
			 var parentUl=$(this).parent("ul");
			 if(parentUl.find("li[showFlag=true]").size()==0){
				parentUl.parent("li").hide();
			  }
			parentThis.setUpUseAssignAuthSet(parentThis,assignAuthInfo,"add");
		});
		
	},
	
	//初始化已选权限资源
	initUseAssignAuthResource:function(parentThis){
		var html=[];
		var dataSet=[];
		var menuCount=0;
		var funCount=0;
		var dataCount=0;
		$.each(temp.useAssignAuthSet,function(i,obj){
			if(obj.data_type=="MENU"){
				menuCount++;
			}else if(obj.data_type=="FUN"){
				funCount++;
			}else if(obj.data_type=="DATA"){
				dataCount++;
			}
		});
		
		if(menuCount>0){
			var param={
				"data_type"			:		"MENU"	,
				"data_name"			:		"菜单"	
			}
			dataSet.push(param);
		}
		
		if(funCount>0){
			var param={
				"data_type"			:		"FUN"	,
				"data_name"			:		"功能"	
			}
			dataSet.push(param);
		}
		
		if(dataCount>0){
			var param={
				"data_type"			:		"DATA"	,
				"data_name"			:		"数据"	
			}
			dataSet.push(param);
		}		
		
		$.each(dataSet,function(i,dataObj){
			html.push('<li>');
//			if(i==0){
//				html.push('<a class="cur" href="javascript:void(0)">'+dataObj.data_name+'</a>');
//				html.push('<ul style="display:block;">');
//				$.each(temp.useAssignAuthSet,function(j,obj){
//					if(obj.data_type==dataObj.data_type){
//						html.push('<li><a href="javascript:void(0)" dataId="'+obj.data_id+'" dataType="'+obj.data_type+'">'+obj.data_name+'</a></li>  '); 
//					}
//				});
//				html.push('</ul>');
//			}else{
				html.push('<a class="cur" name="dataTypeName"  href="javascript:void(0)">'+dataObj.data_name+'</a>');
				html.push('<ul style="display:block;">');
				$.each(temp.useAssignAuthSet,function(j,obj){
					if(obj.data_type==dataObj.data_type){
						html.push('<li><a name="data" href="javascript:void(0)" dataId="'+obj.data_id+'" dataType="'+obj.data_type+'">'+obj.data_name+'</a></li>  '); 
					}
				});
				html.push('</ul>');
//			}
			html.push('</li>');
		});
		
		var secondDivObj=parentThis.selector.findById("div","second")[0];
		secondDivObj.find("ul[name=assignAuthUl]").html(html.join(''));
		
		secondDivObj.find("ul[name=assignAuthUl]").find("li").find("a[name=dataTypeName]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			if(liObj.children("a").hasClass("cur")){
				liObj.children("a").removeClass("cur");
				liObj.children("ul").slideUp("fast");
			}else{
				liObj.parent("ul").find("li").find("a").removeClass("cur");
				liObj.children("a").addClass("cur");
				liObj.children("ul").slideDown("fast");
				liObj.siblings().children("ul").slideUp("fast");
			}
		});
		
		secondDivObj.find("ul[name=assignAuthUl]").find("li").find("ul").find("a[name=data]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			liObj.parent("ul").find("li").find("a[name=data]").removeClass("sed");
			liObj.children("a[name=data]").addClass("sed");
		});
		
		secondDivObj.find("ul[name=assignAuthUl]").find("li").find("ul").find("li").find("a[name=data]").unbind("dblclick").bind("dblclick",function(){
			
			var assignAuthInfo=null;
			var assignAuthAObj=$(this);
			var assignDataId=assignAuthAObj.attr("dataId");
			var assignDataType=assignAuthAObj.attr("dataType");
			$.each(temp.useAssignAuthSet,function(i,obj){
				if(assignDataId==obj.data_id && assignDataType==obj.data_type){
					assignAuthInfo=obj;
				}
			});
			
			var firstDivObj=parentThis.selector.findById("div","first")[0];
			var ulName="auth_"+assignDataType+"_"+assignDataId;
			firstDivObj.find("ul[name="+ulName+"]").parent("li").show();
			firstDivObj.find("ul[name="+ulName+"]").parent("li").attr("showFlag","true");
			firstDivObj.find("ul[name="+ulName+"]").parent("li").parent("ul").parent("li").show();
			parentThis.setUpUseAssignAuthSet(parentThis,assignAuthInfo,"delete");
		});
	},
	
	
	//设置已选资源
	setUpUseAssignAuthSet:function(parentThis,assignAuthInfo,type){
		if("add"==type){
			var count=0;
			$.each(temp.useAssignAuthSet,function(i,obj){
				if(obj.data_id==assignAuthInfo.data_id && obj.data_type==assignAuthInfo.data_type){
					count++;
				}
			});
			if(count==0){
				temp.useAssignAuthSet.push(assignAuthInfo);
			}
		}else if("delete"==type){
			$.each(temp.useAssignAuthSet,function(i,obj){
				if(obj.data_id==assignAuthInfo.data_id && obj.data_type==assignAuthInfo.data_type){
					temp.useAssignAuthSet.remove(i);
					return false;
				}
			});
		}
		
		parentThis.initUseAssignAuthResource(parentThis);
	},
	
};


$(document).ready(function(){
	var assignAuthInfo = new AssignAuthInfo();
	assignAuthInfo.init();
	//需求详单查询 
});

