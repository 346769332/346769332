var OrgAuthInfo=new Function();

OrgAuthInfo.prototype={
	temp : null ,
	selector : null,
	id:"",
	name:"",
	stateName:"",
	dealType:"",
	paramInfo:"",
	allOrgAuthSet:[],
	useOrgAuthSet:[],
	initUseOrgAuthSet:[],
	//初始化执行
	init : function(){
		
		temp = this ;
		this.selector="#orgAuthInfoPageDiv";
		temp.dealType = orgId=common.utils.getHtmlUrlParam("dealType");
		temp.id=common.utils.getHtmlUrlParam("id");
		var name=common.utils.getHtmlUrlParam("name");
		temp.name=decodeURI(name);
		var stateName=common.utils.getHtmlUrlParam("stateName");
		this.selector.findById("td","nameTd")[0].html(temp.name);
		this.selector.findById("td","stateTd")[0].html(decodeURI(stateName));
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
		parentThis.queryOrgAuthPageInitData(parentThis);
		
		//保存按钮
		var saveBtnObj =parentThis.selector.findById("a","saveBtn")[0];
		saveBtnObj.unbind("click").bind("click",function(){
			
			var content="您确定授予"+temp.name+"相关权限？";
			if(temp.initUseOrgAuthSet.length==0 && temp.useOrgAuthSet.length==0){
				layer.alert("请选择需开通的相关权限",8);
				return false;
			}
			if(temp.useOrgAuthSet.length==0){
				content="您确定清除"+temp.name+"相关权限？";
			}
			var param={
					"type" : "save",
					"dealType" : temp.dealType,
					"id" : temp.id,
					"orgAuthInfoSet" : JSON.stringify(temp.useOrgAuthSet),
					"oldOrgAuthInfoSet"	: JSON.stringify(temp.initUseOrgAuthSet)
			};
			var confirm=layer.confirm(content, function(){
				$.jump.ajax(URL_DEAL_ORG_AUTH_INFO.encodeUrl(), function(json) {
					
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
	queryOrgAuthPageInitData:function(parentThis){
		var param={
			"type" : "query",
			"dealType":temp.dealType,
			"id" : temp.id
		};
		
		$.jump.ajax(URL_DEAL_ORG_AUTH_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				if(null!=json.allOrgAuthList && json.allOrgAuthList.length>0){
					$.each(json.allOrgAuthList,function(i,obj){
						temp.allOrgAuthSet.push(obj);
					});
				}
				if(null!=json.useOrgAuthList && json.useOrgAuthList.length>0){
					$.each(json.useOrgAuthList,function(i,obj){
						temp.useOrgAuthSet.push(obj);
						temp.initUseOrgAuthSet.push(obj);
					});
				
				}
				parentThis.initAllOrgAuthResource(parentThis);
				parentThis.initUseOrgAuthResource(parentThis);
			}else{
				layer.alert("获取权限数据异常",8);
			};
		}, param, false,false);
	},
	
	//初始化权限资源
	initAllOrgAuthResource:function(parentThis){
		
		var html=[];
		var latnSet=[];
		$.each(temp.allOrgAuthSet,function(i,obj){
			var latnCount=0;
			$.each(latnSet,function(j,latnObj){
				if(obj.LATN_ID==latnObj.latn_id){
					latnCount++;
				}
			});
			
			if(latnCount==0){
				var latnObject={
						"latn_id"		: 		obj.LATN_ID,
						"latn_name"		: 		obj.LATN_NAME
				};
				latnSet.push(latnObject);
			}
		});
		
		$.each(latnSet,function(i,latnObj){
			html.push('<li name="latn">');
				html.push('<a name="latnNameA"  href="javascript:void(0)">'+latnObj.latn_name+'</a>');
				html.push('<ul name="roleNameUl" >');
				$.each(temp.allOrgAuthSet,function(j,obj){
					if(obj.LATN_ID==latnObj.latn_id){
						var showFlag="true";
						var str='style="display: list-item;"';
						if(null!=temp.useOrgAuthSet && temp.useOrgAuthSet.length>0)
						$.each(temp.useOrgAuthSet,function(m,obj2){
							if(obj2.LATN_ID==obj.LATN_ID && obj2.ROLE_ID==obj.ROLE_ID){
								showFlag="false";
								str='style="display: none;"';
								return false;
							}
						});
						html.push('<li  showFlag="'+showFlag+'" '+str+'>');
						html.push('<a href="#" latnId="'+obj.LATN_ID+'" roleId="'+obj.ROLE_ID+'">'+obj.ROLE_NAME+'</a>');
						html.push('<ul name="orgAuth_'+obj.ROLE_ID+'_'+obj.LATN_ID+'"></ul>');
						html.push('</li>');
					}
				});
				html.push('</ul>');
			html.push('</li>');
		});
		
		var firstDivObj=parentThis.selector.findById("div","first")[0];
		firstDivObj.find("ul[name=orgAuthUl]").html(html.join(''));
		firstDivObj.find("ul[name=orgAuthUl]").find("li[name=latn]").each(function(){
			var ulObj=$(this).find("ul[name=roleNameUl]");
			if(ulObj.find("li[showFlag=true]").size()==0){
				ulObj.parent("li").hide();
			}
		});
		
		firstDivObj.find("ul[name=orgAuthUl]").find("li").find("a[name=latnNameA]").unbind("click").bind("click",function(){
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
		
		firstDivObj.find("ul[name=orgAuthUl]").find("li").find("ul").find("li").unbind("click").bind("click",function(){
			var liObj=$(this);
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		firstDivObj.find("ul[name=orgAuthUl]").find("li").find("ul").find("li").unbind("dblclick").bind("dblclick",function(){
			
			var orgAuthInfo=null;
			var orgAuthAObj=$(this).children("a");
			var latnAuthId=orgAuthAObj.attr("latnId");
			var orgAuthRoleId=orgAuthAObj.attr("roleId");
			$.each(temp.allOrgAuthSet,function(i,obj){
				if(latnAuthId==obj.LATN_ID && orgAuthRoleId==obj.ROLE_ID){
					orgAuthInfo=obj;
				}
			});
			 $(this).hide();
			 $(this).attr("showFlag","false");
			 var parentUl=$(this).parent("ul");
			 if(parentUl.find("li[showFlag=true]").size()==0){
				parentUl.parent("li").hide();
			  }
			parentThis.setUpUseOrgAuthSet(parentThis,orgAuthInfo,"add");
		});
		
	},
	
	//初始化已选权限资源
	initUseOrgAuthResource:function(parentThis){
		var html=[];
		var latnSet=[];
		$.each(temp.useOrgAuthSet,function(i,obj){
			var latnCount=0;
			$.each(latnSet,function(j,latnObj){
				if(obj.LATN_ID==latnObj.latn_id){
					latnCount++;
				}
			});
			
			if(latnCount==0){
				var latnObject={
						"latn_id"		: 		obj.LATN_ID,
						"latn_name"		: 		obj.LATN_NAME
				};
				latnSet.push(latnObject);
			};
		});
		
		$.each(latnSet,function(i,latnObj){
			html.push('<li>');
				html.push('<a   class="cur"  name="latnNameA"  href="javascript:void(0)">'+latnObj.latn_name+'</a>');
				html.push('<ul  style="display:block;">');
				$.each(temp.useOrgAuthSet,function(j,obj){
					if(obj.LATN_ID==latnObj.latn_id){
						html.push('<li><a name="data" href="#" latnId="'+obj.LATN_ID+'" roleId="'+obj.ROLE_ID+'">'+obj.ROLE_NAME+'</a></li>  '); 
					}
				});
				html.push('</ul>');
			html.push('</li>');
		});
		var secondDivObj=parentThis.selector.findById("div","second")[0];
		secondDivObj.find("ul[name=orgAuthUl]").html(html.join(''));
		
		secondDivObj.find("ul[name=orgAuthUl]").find("li").find("a[name=latnNameA]").unbind("click").bind("click",function(){
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
		
		secondDivObj.find("ul[name=orgAuthUl]").find("li").find("ul").find("a[name=data]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		secondDivObj.find("ul[name=orgAuthUl]").find("li").find("ul").find("a[name=data]").unbind("dblclick").bind("dblclick",function(){
			
			var orgAuthInfo=null;
			var orgAuthAObj=$(this);
			var latnAuthId=orgAuthAObj.attr("latnId");
			var orgAuthRoleId=orgAuthAObj.attr("roleId");
			$.each(temp.useOrgAuthSet,function(i,obj){
				if(latnAuthId==obj.LATN_ID && orgAuthRoleId==obj.ROLE_ID){
					orgAuthInfo=obj;
				}
			});
			var firstDivObj=parentThis.selector.findById("div","first")[0];
			var ulName="orgAuth_"+orgAuthRoleId+"_"+latnAuthId;
			firstDivObj.find("ul[name="+ulName+"]").parent("li").show();
			firstDivObj.find("ul[name="+ulName+"]").parent("li").attr("showFlag","true");
			firstDivObj.find("ul[name="+ulName+"]").parent("li").parent("ul").parent("li").show();
			parentThis.setUpUseOrgAuthSet(parentThis,orgAuthInfo,"delete");
		});
	},
	
	
	//设置已选资源
	setUpUseOrgAuthSet:function(parentThis,orgAuthInfo,type){
		
		if("add"==type){
			var count=0;
			$.each(temp.useOrgAuthSet,function(i,obj){
				
				if(obj.ROLE_ID==orgAuthInfo.ROLE_ID){
					count++;
				}
			});
			if(count==0){
				temp.useOrgAuthSet.push(orgAuthInfo);
			}
		}else if("delete"==type){
			$.each(temp.useOrgAuthSet,function(i,obj){
				if(obj.ROLE_ID==orgAuthInfo.ROLE_ID){
					temp.useOrgAuthSet.remove(i);
					return false;
				}
			});
		}
		parentThis.initUseOrgAuthResource(parentThis);
	},
	
};


$(document).ready(function(){
	var orgAuthInfo = new OrgAuthInfo();
	orgAuthInfo.init();
	//需求详单查询 
});

