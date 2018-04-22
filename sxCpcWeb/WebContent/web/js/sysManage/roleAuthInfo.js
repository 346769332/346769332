var RoleAuthInfo=new Function();

RoleAuthInfo.prototype={
	temp : null ,
	selector : null,
	roleId:"",
	roleName:"",
	allRoleAuthSet:[],
	useRoleAuthSet:[],
	initUseRoleAuthSet:[],
	//初始化执行
	init : function(){
		temp = this ;
		this.selector="#roleAuthInfoPageDiv";
		temp.roleId=common.utils.getHtmlUrlParam("roleId");
		var roleName=common.utils.getHtmlUrlParam("roleName");
		temp.roleName=decodeURI(roleName);
		var roleStateName=common.utils.getHtmlUrlParam("roleStateName");
		this.selector.findById("td","roleNameTd")[0].html(temp.roleName);
		this.selector.findById("td","roleStateTd")[0].html(decodeURI(roleStateName));
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
		parentThis.queryRoleAuthPageInitData(parentThis);
		
		//保存按钮
		var saveBtnObj =parentThis.selector.findById("a","saveBtn")[0];
		saveBtnObj.unbind("click").bind("click",function(){
			
			var content="您确定授予"+temp.roleName+"相关权限？";
			if(temp.initUseRoleAuthSet.length==0 && temp.useRoleAuthSet.length==0){
				layer.alert("请选择需开通的相关权限",8);
				return false;
			}
			if(temp.useRoleAuthSet.length==0){
				content="您确定清除"+temp.roleName+"相关权限？";
			}
			var param={
					"type"					:			"save"			,
					"roleId"				:			temp.roleId		,
					"roleAuthInfoSet"			:			JSON.stringify(temp.useRoleAuthSet),
			};
			var confirm=layer.confirm(content, function(){
				$.jump.ajax(URL_DEAL_ROLE_AUTH_INFO.encodeUrl(), function(json) {
					
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
	queryRoleAuthPageInitData:function(parentThis){
		var param={
				"type"			:			"query",
				"roleId"		:			temp.roleId
		};
		
		$.jump.ajax(URL_DEAL_ROLE_AUTH_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				if(null!=json.allRoleAuthList && json.allRoleAuthList.length>0){
					$.each(json.allRoleAuthList,function(i,obj){
						temp.allRoleAuthSet.push(obj);
					});
				}
				if(null!=json.useRoleAuthList && json.useRoleAuthList.length>0){
					$.each(json.useRoleAuthList,function(i,obj){
						temp.useRoleAuthSet.push(obj);
						temp.initUseRoleAuthSet.push(obj);
					});
				
				}
				parentThis.initAllRoleAuthResource(parentThis);
				parentThis.initUseRoleAuthResource(parentThis);
			}else{
				layer.alert("获取权限数据异常",8);
			};
		}, param, false,false);
	},
	//初始化权限资源
	initAllRoleAuthResource:function(parentThis){
		var html=[];
		var latnSet=[];
		$.each(temp.allRoleAuthSet,function(i,obj){
			var latnCount=0;
			$.each(latnSet,function(j,latnObj){
				if(obj.latn_id==latnObj.latn_id){
					latnCount++;
				}
			});
			
			if(latnCount==0){
				var latnObject={
						"latn_id"		: 		obj.latn_id,
						"latn_name"		: 		obj.latn_name,
				};
				latnSet.push(latnObject);
			}
		});
		
		$.each(latnSet,function(i,latnObj){
			html.push('<li name="latn">');
//			if(i==0){
//				html.push('<a name="latnNameA"  class="cur" href="javascript:void(0)">'+latnObj.latn_name+'</a>');
//				html.push('<ul style="display:block;">');
//				$.each(temp.allRoleAuthSet,function(j,obj){
//					if(obj.latn_id==latnObj.latn_id){
//						html.push('<li><a href="javascript:void(0)" authId="'+obj.a_id+'" latnId="'+obj.latn_id+'">'+obj.a_name+'</a></li>  '); 
//					}
//				});
//				html.push('</ul>');
//			}else{
				html.push('<a name="latnNameA"  href="javascript:void(0)">'+latnObj.latn_name+'</a>');
				html.push('<ul name="latnNameUl"  style="display:none;">');
				$.each(temp.allRoleAuthSet,function(j,obj){
					if(obj.latn_id==latnObj.latn_id){
						var showFlag="true";
						var str='style="display: list-item;"';
						if(null!=temp.useRoleAuthSet && temp.useRoleAuthSet.length>0)
						$.each(temp.useRoleAuthSet,function(m,obj2){
							if(obj2.latn_id==obj.latn_id && obj2.a_id==obj.a_id){
								showFlag="false";
								str='style="display: none;"';
								return false;
							}
						});
						html.push('<li  showFlag="'+showFlag+'" '+str+'>');
						html.push('<a href="javascript:void(0)" authId="'+obj.a_id+'" latnId="'+obj.latn_id+'">'+obj.a_name+'</a>');
						html.push('<ul name="roleAuth_'+obj.latn_id+'_'+obj.a_id+'"></ul>');
						html.push('</li>');
					}
				});
				html.push('</ul>');
//			}
			html.push('</li>');
		});
		
		var firstDivObj=parentThis.selector.findById("div","first")[0];
		firstDivObj.find("ul[name=roleAuthUl]").html(html.join(''));
		firstDivObj.find("ul[name=roleAuthUl]").find("li[name=latn]").each(function(){
			var ulObj=$(this).find("ul[name=latnNameUl]");
			if(ulObj.find("li[showFlag=true]").size()==0){
				ulObj.parent("li").hide();
			}
		});
		
		firstDivObj.find("ul[name=roleAuthUl]").find("li").find("a[name=latnNameA]").unbind("click").bind("click",function(){
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
		
		firstDivObj.find("ul[name=roleAuthUl]").find("li").find("ul").find("li").unbind("click").bind("click",function(){
			var liObj=$(this);
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		firstDivObj.find("ul[name=roleAuthUl]").find("li").find("ul").find("li").unbind("dblclick").bind("dblclick",function(){
			
			var roleAuthInfo=null;
			var roleAuthAObj=$(this).children("a");
			var roleAuthId=roleAuthAObj.attr("authId");
			var roleAuthLatnId=roleAuthAObj.attr("latnId");
			$.each(temp.allRoleAuthSet,function(i,obj){
				if(roleAuthId==obj.a_id && roleAuthLatnId==obj.latn_id){
					roleAuthInfo=obj;
				}
			});
			 $(this).hide();
			 $(this).attr("showFlag","false");
			 var parentUl=$(this).parent("ul");
			 if(parentUl.find("li[showFlag=true]").size()==0){
				parentUl.parent("li").hide();
			  }
			parentThis.setUpUseRoleAuthSet(parentThis,roleAuthInfo,"add");
		});
		
	},
	
	//初始化已选权限资源
	initUseRoleAuthResource:function(parentThis){
		var html=[];
		var latnSet=[];
		$.each(temp.useRoleAuthSet,function(i,obj){
			var latnCount=0;
			$.each(latnSet,function(j,latnObj){
				if(obj.latn_id==latnObj.latn_id){
					latnCount++;
				}
			});
			
			if(latnCount==0){
				var latnObject={
						"latn_id"		: 		obj.latn_id,
						"latn_name"		: 		obj.latn_name,
				};
				latnSet.push(latnObject);
			};
		});
		
		$.each(latnSet,function(i,latnObj){
			html.push('<li>');
//			if(i==0){
//				html.push('<a name="latnNameA"  class="cur" href="javascript:void(0)">'+latnObj.latn_name+'</a>');
//				html.push('<ul style="display:block;">');
//				$.each(temp.useRoleAuthSet,function(j,obj){
//					if(obj.latn_id==latnObj.latn_id){
//						html.push('<li><a href="javascript:void(0)" authId="'+obj.a_id+'" latnId="'+obj.latn_id+'">'+obj.a_name+'</a></li>  '); 
//					}
//				});
//				html.push('</ul>');
//			}else{
				html.push('<a   class="cur"  name="latnNameA"  href="javascript:void(0)">'+latnObj.latn_name+'</a>');
				html.push('<ul  style="display:block;">');
				$.each(temp.useRoleAuthSet,function(j,obj){
					if(obj.latn_id==latnObj.latn_id){
						html.push('<li><a name="data" href="javascript:void(0)" authId="'+obj.a_id+'" latnId="'+obj.latn_id+'">'+obj.a_name+'</a></li>  '); 
					}
				});
				html.push('</ul>');
//			}
			html.push('</li>');
		});
		var secondDivObj=parentThis.selector.findById("div","second")[0];
		secondDivObj.find("ul[name=roleAuthUl]").html(html.join(''));
		
		secondDivObj.find("ul[name=roleAuthUl]").find("li").find("a[name=latnNameA]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			if(liObj.children("a").hasClass("cur")){
				liObj.children("a").removeClass("cur");
				liObj.children("ul").slideUp("fast");
			}else{
				liObj.parent("ul").find("li").find("a").removeClass("cur");
				liObj.children("a").addClass("cur");
				liObj.children("ul").slideDown("fast");
				liObj.siblings().children("ul").slideUp("fast");
			};
		});
		
		secondDivObj.find("ul[name=roleAuthUl]").find("li").find("ul").find("a[name=data]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		secondDivObj.find("ul[name=roleAuthUl]").find("li").find("ul").find("a[name=data]").unbind("dblclick").bind("dblclick",function(){
			
			var roleAuthInfo=null;
			var roleAuthAObj=$(this);
			var roleAuthId=roleAuthAObj.attr("authId");
			var roleAuthLatnId=roleAuthAObj.attr("latnId");
			$.each(temp.useRoleAuthSet,function(i,obj){
				if(roleAuthId==obj.a_id && roleAuthLatnId==obj.latn_id){
					roleAuthInfo=obj;
				}
			});
			var firstDivObj=parentThis.selector.findById("div","first")[0];
			var ulName="roleAuth_"+roleAuthLatnId+"_"+roleAuthId;
			firstDivObj.find("ul[name="+ulName+"]").parent("li").show();
			firstDivObj.find("ul[name="+ulName+"]").parent("li").attr("showFlag","true");
			firstDivObj.find("ul[name="+ulName+"]").parent("li").parent("ul").parent("li").show();
			parentThis.setUpUseRoleAuthSet(parentThis,roleAuthInfo,"delete");
		});
	},
	
	
	//设置已选资源
	setUpUseRoleAuthSet:function(parentThis,roleAuthInfo,type){
		
		if("add"==type){
			var count=0;
			$.each(temp.useRoleAuthSet,function(i,obj){
				
				if(obj.a_id==roleAuthInfo.a_id){
					count++;
				}
			});
			if(count==0){
				temp.useRoleAuthSet.push(roleAuthInfo);
			}
		}else if("delete"==type){
			$.each(temp.useRoleAuthSet,function(i,obj){
				if(obj.a_id==roleAuthInfo.a_id){
					temp.useRoleAuthSet.remove(i);
					return false;
				}
			});
		}
		parentThis.initUseRoleAuthResource(parentThis);
	},
	
};


$(document).ready(function(){
	var roleAuthInfo = new RoleAuthInfo();
	roleAuthInfo.init();
	//需求详单查询 
});

