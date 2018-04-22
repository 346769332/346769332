var AddNotification = new Function();
AddNotification.prototype = {
	selecter : "#demandListPage",
	pageSize : 10,
	sendToId : "",
	pushId : "",
	sendToName : "",
	pushTheme : "",
	pushLevel : "",
	pushContent : "",
	attachmentPath : "",
	attachmentName : "",
	sendToNameArry : [],
	sendToIdeArry : [],
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		//加载部门
		parentThis.selectStaffInfo(parentThis);
		var selectOrgNameSearchObj=parentThis.selecter.findById("a","selectOrgNameSearch")[0];
		selectOrgNameSearchObj.unbind("click").bind("click",function(){
			var selectOrgName = $("#selectOrgName").val();
			if(selectOrgName==null||selectOrgName==undefined||selectOrgName==""){
				parentThis.queryWorkflow(parentThis);
			}else{
			var param={								
					"handleType":"qryLst",
					"dataSource":"",
					"nameSpace":"shortProcess",
					"sqlName":"searchdeppt",
					"region_id": "",
					"org_Name": selectOrgName
			};
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					if(json.code == "0" ){
						var html=[];
						if(json.data.length > 0) {
							$("#selectallAuthorInfo").attr("DEPARTMENT_ID",json.data[0].DEPARTMENT_ID);
							$("#selectallAuthorInfo").attr("DEPARTMENT_NAME",json.data[0].ORG_NAME);
							$.each(json.data,function(i,obj){
								html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
							});
							$("#processDiv").html(html.join(''));
						};
					};
			}, param, false,false);
			
				//点击子级触发事件 部门
				$("#processDiv").find("div[name='divzi']").each(function(index){
					var ziId=$(this).attr("id");
					$("#"+ziId+"").click(function(e){
						//里边的<div>点击，但是不触发外层的<div>
						e.stopPropagation();
						//显示查询数据DIV					
						parentThis.queryPeopleList(parentThis,ziId);
					});
				});
			}
		});
		//确认功能
		var infoSubmitObj=parentThis.selecter.findById("a","infoSubmit")[0];
		infoSubmitObj.unbind("click").bind("click",function(){
			parentThis.sendToIdeArry = [];
			parentThis.sendToNameArry = [];
			parentThis.sendToId = "";
			parentThis.sendToName = "";
			var isChecked = $("#selectallAuthorInfo").is(":checked");
			if(isChecked){
				parentThis.sendToId = $("#selectallAuthorInfo").attr("department_id");
				parentThis.sendToName = $("#selectallAuthorInfo").attr("department_name");
				parentThis.sendToIdeArry.push( $("#selectallAuthorInfo").attr("department_id"));
				parentThis.sendToNameArry.push($("#selectallAuthorInfo").attr("department_name"));
				parentThis.pushLevel = 1;
				$("#notificationDept").val(parentThis.sendToNameArry);
				$("#notificationDeptId").val(parentThis.sendToIdeArry);
			}else{
				$("#disposeJobInfoPage").find("input[type=checkbox]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
						parentThis.sendToId   += trObj.attr("staff_id")+",";				
						parentThis.sendToName += trObj.attr("staff_name")+",";
						parentThis.sendToIdeArry.push(trObj.attr("staff_id"));
						parentThis.sendToNameArry.push(trObj.attr("staff_name"));
						parentThis.pushLevel = 2;
						if(boxObj.length==0){
							layer.alert("请选择推送人员或部门!",8);
							return false;
						}
						$("#notificationDept").val(parentThis.sendToNameArry);
						$("#notificationDeptId").val(parentThis.sendToIdeArry);
					}
				});
			}
		});
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#notificationName").val("");
			$("#notificationDesc").val("");
		});
		//提交功能
		var submitInfoObj=parentThis.selecter.findById("a","submitInfo")[0];
		submitInfoObj.unbind("click").bind("click",function(){
			parentThis.submitPushInfo(parentThis);
		});
		//生成推送ID
		var param={};
		param.handleType="qryLst";
		param.dataSource="";
		param.nameSpace="pushInfo";
		param.sqlName="qry_PushInfoId";
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.data.length > 0){
					 parentThis.pushId=json.data[0];
				}
			};
		}, param, false,false);
	},
	submitPushInfo : function(parentThis){
		var notificationName  = $("#notificationName").val();
		var notificationDesc  = $("#notificationDesc").val();
		if(notificationName==null||notificationName==undefined||notificationName==""){
			layer.alert("推送消息主题不可为空!",8);
			return false;
		}
		if(notificationDesc==null||notificationDesc==undefined||notificationDesc==""){
			layer.alert("推送消息内容不可为空!",8);
			return false;
		}
		var msg_param={
				"action_page"	:	"", //启动界面
				"app_key"		:	"", //应用接入KEY
				"msg_type"		:	"NONE" //消息操作类型 非空。取值为：APP_RUN（打开指定应用）、UPDATE（应用更新提醒）、NONE（普通消息）
		};
		;
		var baseParam = {
				"pushId" 			:	 parentThis.pushId,
				"pushTheme" 		:	 notificationName,
				"pushContent" 		:	 notificationDesc,
//				"sendToId" 			:	 parentThis.sendToId,
//				"sendToName" 		:	 parentThis.sendToName,
				"sendToId" 			:	 parentThis.sendToIdeArry.join(","),
				"sendToName" 		:	 parentThis.sendToNameArry.join(","),
				"attachmentPath"    :	 parentThis.attachmentPath,
				"attachmentName"    :	 parentThis.attachmentName,
				"otherAttName" 	    :	 parentThis.pushId,
				"pushLevel" 	    :	 parentThis.pushLevel
		};
		var param = {
				"methodType"		:	 	"addNotification", //操作类型
				"baseParam"		    : 		JSON.stringify(baseParam),
				"msg_param"		    :		JSON.stringify(msg_param)	
		};
		//您即将对所选部门或人员推送主题为“%主题%”的消息，请确认。
		var confirm=layer.confirm('您即将对所选部门或人员推送主题为'+notificationName+'的消息，请确认。', function(){
			$.jump.ajax(URL_PUSH_INFO.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						layer.alert("推送成功",1);
						$.jump.loadHtmlForFun("/web/html/notification/addNotification.html".encodeUrl(),function(pageHtml){
							$("#content").html(pageHtml);
							var addNotification=new AddNotification();
							addNotification.init();
						});
					}else{
						layer.alert("推送失败!");	
					}
			}, param, false,false);
		});
	},
	selectStaffInfo: function(parentThis) {
		var param={								
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"pushInfo",
	    		"sqlName":"searchland",			    		
		};
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				regionName=json.latnSet[0].REGION_CODE;
				regionId=json.latnSet[0].REGION_ID;
				var html1=[];									
		//		html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;background:#eaf6ff;color:#0e5895;">部门查询</div>');
				html1.push('<div  style="overflow-x: hidden;overflow-y: auto;height:330px;">');
				if(regionId=='888'){
					html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				}
				//html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" orgName="'+obj.REGION_NAME+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
					}
			});				
				html1.push('</div>');
				$("#processDiv").html(html1.join(''));		
			}else{
				layer.alert(msg);
			};
		}, param, false, false);									
		//点击本地网
		$("#processDiv").find("div[name='divfu']").each(function(index){
		var fuId=$(this).attr("id");			
		var param={								
				"handleType":"qryLst",
				"dataSource":"",
				"nameSpace":"pushInfo",
				"sqlName":"searchdeppt",
				"region_id": fuId,
				"org_Name": ""
		};
		$("#"+fuId+"").unbind("click").bind("click",function(){
			
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					var html=[];
					if(json.data.length > 0) {
						$.each(json.data,function(i,obj){
							html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
						});
						if($("#"+fuId+"").children().length == 1) {
							//为1 ，代表div中无值，为其赋值
							$("#"+fuId+"").append(html.join(''));
							var tupianObj=$("#tupian"+fuId+"");
							tupianObj.attr('src','images/ico-.gif');
						} else {
							//移除
							$("#"+fuId+"").children('div').remove();
							var tupianObj=parentThis.selecter.findById("img",'tupian'+fuId+'')[0];
							tupianObj.attr('src','images/ico+.gif');
						}
					}
				}
			}, param, false,false);
			//点击子级触发事件 部门
			$("#"+fuId).find("div[name='divzi']").each(function(index){
				var ziId=$(this).attr("id");
				$("#"+ziId+"").click(function(e){
					//里边的<div>点击，但是不触发外层的<div>
					e.stopPropagation();
					//子级流程的内容展示
						//显示查询数据DIV					
					parentThis.queryPeopleList(parentThis,ziId);
				});
			});
		});
		});
	
	},	
	//查询专家数据
	queryPeopleList : function(parentThis,ziId) {
		param={							
				"handleType":"qry",
	    		"dataSource":"",
	    		"nameSpace":"pushInfo",
	    		"department_code":ziId,
	    		"sqlName":"qryStaffPage"	    	
		};	
		//下面展示数据
		var noticeLstFootObj=$("#chooseDeptAndExecuterFoot");						
			common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								 '0',
								 '10',
								 param,
								 "data",
								 null,
								 noticeLstFootObj,
								 "",
									 function(data,dataSetName,showDataSpan){
				var noticeLstBodyObj=$("#chooseDeptAndExecuterBody");						
				noticeLstBodyObj.html("");
				parentThis.createPeolpeHtml(parentThis,data,noticeLstBodyObj,noticeLstFootObj);
			});	
	},
	//创建按查询展示专业人员
	createPeolpeHtml : function(parentThis,data,noticeLstBodyObj,noticeLstFootObj){		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			noticeLstFootObj.show();
//			html.push('<tr>');
//			html.push('<td><input type="checkbox"  id="selectallAuthorInfo" style="width: 10%;" DEPARTMENT_ID="'+dataLst[0].DEPARTMENT_ID+'" DEPARTMENT_NAME="'+dataLst[0].ORG_NAME+'"></td>');	
//			html.push('<td colspan="3">'+dataLst[0].ORG_NAME+'</td>');
//			html.push('</tr>');
			$("#selectallAuthorInfo").attr("DEPARTMENT_ID",dataLst[0].DEPARTMENT_ID);
			$("#selectallAuthorInfo").attr("DEPARTMENT_NAME",dataLst[0].ORG_NAME);
			$.each(data.data,function(i,obj){
				
				html.push('<tr name="staffInfo" mob_tel="'+obj.MOB_TEL+'" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_ID="'+obj.DEPARTMENT_ID+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="checkbox" name="dept"  style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
				html.push('<td>'+obj.MOB_TEL+'</td>');
				html.push('</tr>');
			
			});
		}else{
				noticeLstFootObj.hide();
				html.push('<div>');
				html.push('<div  style="width:130px;">无相关数据</div>');
				html.push('<div>');
		}
		noticeLstBodyObj.html(html.join(''));
		$("#selectallAuthorInfo").click(function () {
			var isChecked = $("#selectallAuthorInfo").is(":checked");
			if(isChecked){
				$("#chooseDeptAndExecuterBody :checkbox").prop("checked", true);  
			}else{
				$("#chooseDeptAndExecuterBody :checkbox").prop("checked", false);
			}
			   
		});
	}
};
