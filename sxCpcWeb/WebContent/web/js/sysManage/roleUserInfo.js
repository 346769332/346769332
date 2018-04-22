var RoleUserInfo=new Function();

RoleUserInfo.prototype={
	temp : null ,
	selector : null,
	roleId:"",
	roleName:"",
	latnId:"",
	departmentId:"",
	allRoleUserSet:[],
	useRoleUserSet:[],
	initUseRoleUserSet:[],
	pageSize:20,
	pageCount:0,
	//初始化执行
	init : function(){
		temp = this ;
		this.selector="#roleUserInfoPageDiv";
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
		
//		var chooseBtnObj =parentThis.selector.findById("a","chooseBtn")[0];
//		chooseBtnObj.unbind("click").bind("click",function(){
//			parentThis.serachRoleUserPageInitData(parentThis);
//		});
		
		//关闭
		var closeBtnObj =parentThis.selector.findById("a","closeBtn")[0];
		closeBtnObj.unbind("click").bind("click",function(){
			var i = parent.layer.getFrameIndex();
			parent.layer.close(i);
		});
		parentThis.queryLatnPageInitData(parentThis);
		//保存按钮
		var saveBtnObj =parentThis.selector.findById("a","saveBtn")[0];
		saveBtnObj.unbind("click").bind("click",function(){
			
			var content="您确定授予"+temp.roleName+"相关用户？";
			if(temp.initUseRoleUserSet.length==0 && temp.useRoleUserSet.length==0){
				layer.alert("请选择需开通的用户",8);
				return false;
			}
			if(temp.useRoleUserSet.length==0){
				content="您确定清除"+temp.roleName+"相关用户？";
			}
			var param={
					"type"						:			"save"			,
					"roleId"					:			temp.roleId		,
					"roleUserInfoSet"			:			JSON.stringify(temp.useRoleUserSet),
			};
			var confirm=layer.confirm(content, function(){
				$.jump.ajax(URL_DEAL_ROLE_USER_INFO.encodeUrl(), function(json) {
					
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
	
	//查询本地网数据
	queryLatnPageInitData:function(parentThis){
		var param={
				"type"				:			"query",
				"serch_type"		:			"latn" ,
				"roleId"			:			temp.roleId,
		};
		
		$.jump.ajax(URL_DEAL_ROLE_USER_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				if(null!=json.allRoleUserList && json.allRoleUserList.length>0){
					parentThis.createHtmlLatnPageInitData(parentThis,json.allRoleUserList);
				}
				if(null!=json.useRoleUserList && json.useRoleUserList.length>0){
					$.each(json.useRoleUserList,function(i,obj){
						temp.useRoleUserSet.push(obj);
						temp.initUseRoleUserSet.push(obj);
					});
					parentThis.initUseRoleUserResource(parentThis);
				}
			}else{
				layer.alert("获取本地网数据异常",8);
			};
		}, param, true,false);
	},
	
	createHtmlLatnPageInitData:function(parentThis,allRoleUserList){
		var html=[];
		$.each(allRoleUserList,function(i,obj){
			html.push('<li  showFlag="true" >');
//			if(i==0){
//				latnId=obj.latn_id;
//				html.push('<a class="cur" latnId="'+obj.latn_id+'"  href="javascript:void(0)">'+obj.latn_name+'</a>');
//				html.push('<ul name="latnName_'+obj.latn_id+'" style="display:block;" >');
//				html.push('</ul>');
//			}else{
				html.push('<a  name="latnLi"  latnId="'+obj.latn_id+'"  href="javascript:void(0)">'+obj.latn_name+'</a>');
				html.push('<ul name="latnName_'+obj.latn_id+'" style="display:none;" >');
				html.push('</ul>');
//			}
			html.push('</li>');
		});
		var firstDivObj=parentThis.selector.findById("div","first")[0];
		firstDivObj.find("ul[name=roleUserUl]").html(html.join(''));
		
		firstDivObj.find("ul[name=roleUserUl]").find("a[name=latnLi]").unbind("click").bind("click",function(){
			
			var liObj=$(this).parent("li");
			if(liObj.children("a").hasClass("cur")){
				liObj.children("a").removeClass("cur");
				liObj.children("ul").slideUp("fast");
			}else{
				liObj.parent("ul").children("li").children("a").removeClass("cur");
				liObj.children("a").addClass("cur");
				liObj.children("ul").slideDown("fast");
				liObj.siblings().children("ul").slideUp("fast");
				temp.latnId=liObj.children("a").attr("latnId");
				var ulObj=$(this).next("ul");
				if(ulObj.find("li").size()>0){
					ulObj.show();
				}else{
					parentThis.queryDepartmentPageInitData(parentThis);
				}
			}
		});
		
//		parentThis.queryDepartmentPageInitData(parentThis);
	},
	
	//获取部门数据
	queryDepartmentPageInitData:function(parentThis){
		
		var param={
				"type"				:			"query",
				"serch_type"		:			"org" ,
				"latnId"			:			temp.latnId,
				"roleId"			:			temp.roleId,
		};
		
		$.jump.ajax(URL_DEAL_ROLE_USER_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				var html=[];
				if(null!=json.allRoleUserList && json.allRoleUserList.length>0){
					$.each(json.allRoleUserList,function(i,obj){
						var showFlag="true";
						var str='style="display: list-item;"';
						$.each(temp.useRoleUserSet,function(j,obj2){
							if(obj2.latn_id==obj.latn_id && obj2.data_id==obj.department_id && obj2.data_type=="ORG"){
								str='style="display:none;"';
								showFlag="false";
								return false;
							}
						});
						html.push('<li  showFlag="'+showFlag+'" '+str+'>');
//						if(i==0){
//							html.push('<a class="cur"   latnId="'+obj.latn_id+'" departmentId="'+obj.department_id+'"  href="javascript:void(0)">'+obj.department+'</a>');
//							html.push('<ul name="department_'+obj.latn_id+'_'+obj.department_id+'" style="display:block;" >');
//							html.push('</ul>');
//						}else{
							html.push('<a name="departmentLi" latnId="'+obj.latn_id+'" latnName="'+obj.latn_name+'"   departmentId="'+obj.department_id+'" departmentName="'+obj.department+'" href="javascript:void(0)">'+obj.department+'</a>');
							html.push('<ul name="department_'+obj.latn_id+'_'+obj.department_id+'" style="display:none;" >');
							html.push('</ul>');
//						}
						html.push('</li>');
					});
					var firstDivObj=parentThis.selector.findById("div","first")[0];
					firstDivObj.find("ul[name=latnName_"+temp.latnId+"]").html(html.join(''));
					var clickTimer = null;
					firstDivObj.find("ul[name=latnName_"+temp.latnId+"]").find("a[name=departmentLi]").unbind("click").bind("click",function(){
						var liObj=$(this).parent("li");
						if(clickTimer) {
					          window.clearTimeout(clickTimer);
					          clickTimer = null;
					      }
					      clickTimer = window.setTimeout(function(){
								if(liObj.children("a").hasClass("cur")){
									liObj.children("a").removeClass("cur");
									liObj.children("ul").slideUp("fast");
								}else{
									liObj.parent("ul").children("li").children("a").removeClass("cur");
									liObj.children("a").addClass("cur");
									liObj.children("ul").slideDown("fast");
									liObj.siblings().children("ul").slideUp("fast");
									parentThis.latnId=liObj.children("a").attr("latnId");
									parentThis.departmentId=liObj.children("a").attr("departmentId");
									var ulObj=liObj.children("a").next("ul");
									if(ulObj.find("li").size()>0){
										ulObj.show();
									}else{
										parentThis.queryRoleUserPageInitData(parentThis,1);
									}
								}
					      }, 300);
						
					});
					
					firstDivObj.find("ul[name=latnName_"+temp.latnId+"]").find("a[name=departmentLi]").unbind("dblclick").bind("dblclick",function(){
						
						var roleUserAObj=$(this);
						var latnId=roleUserAObj.attr("latnId");
						var latnName=roleUserAObj.attr("latnName");
						var departmentId=roleUserAObj.attr("departmentId");
						var departmentName=roleUserAObj.attr("departmentName");
						 var roleUserInfo={
								 "data_type"		:			"ORG",
								 "latn_id"			:			latnId,
								 "data_id"			:			departmentId,
								 "latn_name"		:			latnName,
								 "data_name"		:			departmentName,
						 };
						 $(this).parent("li").hide();
						 $(this).parent("li").attr("showFlag","false");
						 var parentUl=$(this).parent("li").parent("ul");
						 if(parentUl.find("li[showFlag=true]").size()==0){
							parentUl.parent("li").hide();
						  }
						parentThis.setUpUseRoleUserSet(parentThis,roleUserInfo,"add");
					});
				}
			}else{
				layer.alert("获取部门数据异常",8);
			};
		}, param, true,false);
		
	},
	
	
	//获取用户数据
	queryRoleUserPageInitData:function(parentThis,pageIndex){
		
		var param={
				"type"					:				"query",
				"serch_type"			:				"staff" ,
				"limit"					:				"limit" ,
				"roleId"				:				temp.roleId,
				"latnId"				:				temp.latnId 	,
				"departmentId"			:				temp.departmentId,
				"pageIndex"				:				pageIndex,
				"pageSize"				:				temp.pageSize
				
		};
		$.jump.ajax(URL_DEAL_ROLE_USER_INFO.encodeUrl(), function(json) {
			
			if(json.code == "0"){
				var html=[];
				if(null!=json.allRoleUserList && json.allRoleUserList.length>0){
					$.each(json.allRoleUserList,function(i,obj){
						var showFlag="true";
						var str='style="display: list-item;"';
						$.each(temp.useRoleUserSet,function(j,obj2){
							if(obj2.latn_id==obj.latn_id && obj2.data_id==obj.department_id && obj2.data_type=="STAFF"){
								str='style="display:none;"';
								showFlag="false";
								return false;
							}
						});
						html.push('<li  showFlag="'+showFlag+'" '+str+'>');
						html.push('<a name="staffLi" latnId="'+obj.latn_id+'" latnName="'+obj.latn_name+'" departmentId="'+obj.department_id+'"  staffId="'+obj.staff_id+'" staffName="'+obj.staff_name+'" href="javascript:void(0)">'+obj.staff_name+'</a>');
						html.push('<ul name="staff_'+obj.latn_id+'_'+obj.staff_id+'"></ul>');
						html.push('</li>');
					});
					if(json.allRoleUserList.length==temp.pageSize){
						html.push('<li showFlag="true"><a name="pageContorlA"  pageIndex="'+(pageIndex+1)+'" style="background:none;font-size: 12px;color: blue;text-decoration: underline;">更多</a></li>');
					}
					var firstDivObj=parentThis.selector.findById("div","first")[0];
					firstDivObj.find("ul[name=department_"+temp.latnId+"_"+temp.departmentId+"]").append(html.join(''));
					
					firstDivObj.find("ul[name=department_"+temp.latnId+"_"+temp.departmentId+"]").find("a[name=staffLi]").unbind("click").bind("click",function(){
						var liObj=$(this).parent("li");
						liObj.parent("ul").find("li").find("a").removeClass("sed");
						liObj.children("a").addClass("sed");
					});
					firstDivObj.find("ul[name=department_"+temp.latnId+"_"+temp.departmentId+"]").find("a[name=pageContorlA]").unbind("click").bind("click",function(){
						 var  pageIndex=$(this).attr("pageIndex");
						 $(this).parent("li").remove();
						 parentThis.queryRoleUserPageInitData(parentThis,parseInt(pageIndex));
					});
					
					firstDivObj.find("ul[name=department_"+temp.latnId+"_"+temp.departmentId+"]").find("a[name=staffLi]").unbind("dblclick").bind("dblclick",function(){
						
						var roleUserAObj=$(this);
						var latnId=roleUserAObj.attr("latnId");
						var staffId=roleUserAObj.attr("staffId");
						var staffName=roleUserAObj.attr("staffName");
						var latnName=roleUserAObj.attr("latnName");
						var roleUserInfo={
								 "data_type"		:			"STAFF",
								 "latn_id"			:			latnId,
								 "data_id"			:			staffId,
								 "latn_name"		:			latnName,
								 "data_name"		:			staffName,
						 };
						$(this).parent("li").hide();
						$(this).parent("li").attr("showFlag","false");
						var parentUl=$(this).parent("li").parent("ul");
						if(parentUl.find("li[showFlag=true]").size()==0){
							parentUl.parent("li").hide();
						}
						parentThis.setUpUseRoleUserSet(parentThis,roleUserInfo,"add");
					});
				}
			}else{
				layer.alert("获取工号数据异常",8);
			};
		}, param, false,false);
	},
//	
//	//获取用户数据
//	serachRoleUserPageInitData:function(parentThis){
//		var firstDivObj=parentThis.selector.findById("div","first")[0];
//		firstDivObj.find("ul[name=roleUserUl]").html("");
//		
//		var search_staff_name =parentThis.selector.findById("input","search_staff_name")[0].val();
//		
//		if(search_staff_name==""  || search_staff_name.length==0){
//			layer.alert("员工姓名",8);
//			return false;
//		}
//		var param={
//				"type"					:				"query",
//				"serch_type"			:				"staff" ,
//				"staffName"				:				search_staff_name 	,
//		};
//		
//		$.jump.ajax(URL_DEAL_ROLE_USER_INFO.encodeUrl(), function(json) {
//			
//			if(json.code == "0"){
//				var html=[];
//				var latnSet=[];
//				if(null!=json.allRoleUserList && json.allRoleUserList.length>0){
//					$.each(json.allRoleUserList,function(i,obj){
//						var latnCount=0;
//						$.each(latnSet,function(j,latnObj){
//							if(obj.latn_id==latnObj.latn_id){
//								latnCount++;
//							}
//						});
//						
//						if(latnCount==0){
//							var latnObject={
//									"latn_id"		: 		obj.latn_id,
//									"latn_name"		: 		obj.latn_name,
//							};
//							latnSet.push(latnObject);
//						}
//					});
//					
//					$.each(latnSet,function(i,latnObj){
//						html.push('<li>');
//						if(i==0){
//							html.push('<a name="latnNameA"  class="cur" href="javascript:void(0)">'+latnObj.latn_name+'</a>');
//							html.push('<ul style="display:block;">');
//							$.each(json.allRoleUserList,function(j,obj){
//								if(obj.latn_id==latnObj.latn_id){
//									html.push('<li><a style="background:none;margin-left:10px;"  latnId="'+obj.latn_id+'" latnName="'+obj.latn_name+'" dataId="'+obj.staff_id+'"  href="javascript:void(0)">'+obj.staff_name+'</a></li>'); 
//								}
//							});
//							html.push('</ul>');
//						}else{
//							html.push('<a  name="latnNameA"   href="javascript:void(0)">'+latnObj.latn_name+'</a>');
//							html.push('<ul style="display:none;">');
//							$.each(json.allRoleUserList,function(j,obj){
//								if(obj.latn_id==latnObj.latn_id){
//									html.push('<li><a  style="background:none;margin-left:10px;"   name="staffNameA" latnId="'+obj.latn_id+'" latnName="'+obj.latn_name+'"  dataId="'+obj.staff_id+'"  href="javascript:void(0)">'+obj.staff_name+'</a><li>'); 
//								}
//							});
//							html.push('</ul>');
//						}
//						html.push('</li>');
//					});
//				}else{
//					html.push('<li>');
//					html.push('无相关数据');
//					html.push('</li>');
//				}
//				var firstDivObj=parentThis.selector.findById("div","first")[0];
//				firstDivObj.find("ul[name=roleUserUl]").html(html.join(''));
//				
//				firstDivObj.find("ul[name=roleUserUl]").find("a[name=latnNameA]").unbind("click").bind("click",function(){
//					var liObj=$(this).parent("li");
//					liObj.parent("ul").find("li").find("a").removeClass("cur");
//					liObj.children("a").addClass("cur");
//					liObj.children("ul").slideDown("fast");
//					liObj.siblings().children("ul").slideUp("fast");
//				});
//				
//				firstDivObj.find("ul[name=roleUserUl]").find("li").find("ul").find("li").unbind("click").bind("click",function(){
//					var liObj=$(this);
//					liObj.parent("ul").find("li").find("a").removeClass("sed");
//					liObj.children("a").addClass("sed");
//				});
//				
//			}else{
//				layer.alert("获取工号数据异常",8);
//			};
//		}, param, false,false);
//	},
//	
//	
	
	//初始化已选权限资源
	initUseRoleUserResource:function(parentThis){
		var html=[];
		var latnSet=[];
		$.each(temp.useRoleUserSet,function(i,obj){
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
			html.push('<li>');
//			if(i==0){
//				html.push('<a  class="cur" href="javascript:void(0)">'+latnObj.latn_name+'</a>');
//				html.push('<ul style="display:block;">');
//				$.each(temp.useRoleUserSet,function(j,obj){
//					if(obj.latn_id==latnObj.latn_id){
//						html.push('<li><a  latnId="'+obj.latn_id+'" dataId="'+obj.data_id+'"  dataType="'+obj.data_type+'"  href="javascript:void(0)">'+obj.data_name+'</a></li>'); 
//					}
//				});
//				html.push('</ul>');
//			}else{
				html.push('<a name="latnNameA" class="cur" href="javascript:void(0)">'+latnObj.latn_name+'</a>');
				html.push('<ul style="display:block;">');
				$.each(temp.useRoleUserSet,function(j,obj){
					if(obj.latn_id==latnObj.latn_id){
						html.push('<li><a name="userInfo"  latnId="'+obj.latn_id+'" dataId="'+obj.data_id+'" dataType="'+obj.data_type+'"   href="javascript:void(0)">'+obj.data_name+'</a></li>'); 
					}
				});
				html.push('</ul>');
//			}
		});
			html.push('</li>');
		var secondDivObj=parentThis.selector.findById("div","second")[0];
		secondDivObj.find("ul[name=roleUserUl]").html(html.join(''));
		

		secondDivObj.find("ul[name=roleUserUl]").find("a[name=latnNameA]").unbind("click").bind("click",function(){
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
		
		secondDivObj.find("ul[name=roleUserUl]").find("li").find("ul").find("a[name=userInfo]").unbind("click").bind("click",function(){
			var liObj=$(this).parent("li");
			liObj.parent("ul").find("li").find("a").removeClass("sed");
			liObj.children("a").addClass("sed");
		});
		
		secondDivObj.find("ul[name=roleUserUl]").find("li").find("ul").find("li").unbind("dblclick").bind("dblclick",function(){
			
			var roleUserAObj=$(this).children("a");
			var roleUserDataType=roleUserAObj.attr("dataType");
			var roleUserLatnId=roleUserAObj.attr("latnId");
			var roleUserDataId=roleUserAObj.attr("dataId");
			var roleUserInfo={
					"latn_id"		:		roleUserLatnId,
					"data_id"		:		roleUserDataId,
					"data_type"		:		roleUserDataType,
			};
			var firstDivObj=parentThis.selector.findById("div","first")[0];
			if("ORG"==roleUserDataType){
				var ulName="department_"+roleUserLatnId+"_"+roleUserDataId;
				firstDivObj.find("ul[name="+ulName+"]").parent("li").show();
				firstDivObj.find("ul[name="+ulName+"]").parent("li").attr("showFlag","true");
				firstDivObj.find("ul[name="+ulName+"]").parent("li").parent("ul").parent("li").show();
			}else if("STAFF"==roleUserDataType) {
				var ulName="staff_"+roleUserLatnId+"_"+roleUserDataId;
				firstDivObj.find("ul[name="+ulName+"]").parent("li").show();
				firstDivObj.find("ul[name="+ulName+"]").parent("li").attr("showFlag","true");
				firstDivObj.find("ul[name="+ulName+"]").parent("li").parent("ul").parent("li").show();
			}
			
			parentThis.setUpUseRoleUserSet(parentThis,roleUserInfo,"delete");
		});
	},
	
	
	//设置已选资源
	setUpUseRoleUserSet:function(parentThis,roleUserInfo,type){
		
		if("add"==type){
			var count=0;
			$.each(temp.useRoleUserSet,function(i,obj){
				
				if(roleUserInfo.latn_id==obj.latn_id && roleUserInfo.data_type==obj.data_type &&roleUserInfo.data_id==obj.data_id){
					count++;
				}
			});
			if(count==0){
				temp.useRoleUserSet.push(roleUserInfo);
			}
		 
		}else if("delete"==type){
			$.each(temp.useRoleUserSet,function(i,obj){
				if(roleUserInfo.latn_id==obj.latn_id && roleUserInfo.data_type==obj.data_type &&roleUserInfo.data_id==obj.data_id){
					temp.useRoleUserSet.remove(i);
					return false;
				}
			});
		}
		parentThis.initUseRoleUserResource(parentThis);
	},
};


$(document).ready(function(){
	var roleUserInfo = new RoleUserInfo();
	roleUserInfo.init();
	//需求详单查询 
});

