var ChooseDeptAndExecuter=new Function();
/**问题调度*/
ChooseDeptAndExecuter.prototype = {
	selecter : "#chooseDeptAndExecuterPage",
	//初始化执行
	init : function(demandId) {
		parentThis=this;
		this.bindMetod(parentThis);
	},
	bindMetod : function(parentThis) {
		//加载按照部门查询
		parentThis.querydept(parentThis,2);
		//默认加载本地网专家人员
		parentThis.queryPeopleList(parentThis,regionId,3);
	},
	//加载按照部门查询页面
	querydept : function(parentThis,check_circle){
		if(check_circle==2){
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			
			if (json.code == "0") {
				regionName=json.currUser.regionName;
				regionId=json.currUser.regionId;
				var html1=[];									
				html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;background:#eaf6ff;color:#0e5895;">部门查询</div>');
				html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
//				html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
//					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
//					}
			});				
				html1.push('</div>');
				$("#processDiv").html(html1.join(''));		
			}else{
				layer.alert(msg);
			};
		}, null, false, false);										
		//点击本地网
		$("#processDiv").find("div[name='divfu']").each(function(index){
			var fuId=$(this).attr("id");			
			var param={								
					"handleType":"qryLst",
		    		"dataSource":"",
		    		"nameSpace":"easy",
		    		"sqlName":"searchdeppt",
		    		"region_id": fuId
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
								var tupianObj=parentThis.selecter.findById("img",'tupian'+fuId+'')[0];
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
						parentThis.queryPeopleList(parentThis,ziId,2);
					});
				});
			});
		});
		}
		//按照问题分类找专家
		else if(check_circle==888){
				param={
						"handleType":"qryLst",
			    		"dataSource":"ora",
			    		"nameSpace":"easy",
			    		"sqlName":"qry_properties",
			    		"askType":"bigType"
				}
				
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					
					if (json.code == "0") {
						var html1=[];									
						html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;">问题分类查询</div>');
						html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
						
						$.each(json.data,function(i,obj){
							if(obj.REGION_ID!='888'){						
								html1.push('<div id ="'+obj.ASK_ID+'" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ASK_ID+'"  src="images/ico+.gif" alt="">'+obj.ASK_NAME+'</div>');								
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
				    		"dataSource":"ora",
				    		"nameSpace":"easy",
				    		"sqlName":"qry_properties",
				    		"pid": fuId
					};
					$("#"+fuId+"").unbind("click").bind("click",function(){
						
						$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							
							if(json.code == "0" ){
								var html=[];
								if(json.data.length > 0) {
									$.each(json.data,function(i,obj){
										html.push('<div id="'+obj.ASK_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ASK_NAME+'</div>');
									});
									
									if($("#"+fuId+"").children().length == 1) {
										//为1 ，代表div中无值，为其赋值
										$("#"+fuId+"").append(html.join(''));
										var tupianObj=parentThis.selecter.findById("img",'tupian'+fuId+'')[0];
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
								parentThis.queryPeopleList(parentThis,ziId,1);
							});
						});
					});
				});
		}
	},
	//查询专家数据
	queryPeopleList : function(parentThis,ziId,num) {			
		param={							
				"handleType":"qry",
	    		"dataSource":"ora",
	    		"nameSpace":"easy",
	    		"sqlName":"searchforeignerdeptInfo"	    	
		};
		if(num==1){
			param["demand_child_type"] = ziId;
		}else if(num==2){
			param["regionid"] = ziId;
		}else if(num==3){
			if(regionId==888){
				param["region_id"]="";
			}else{				
			param["region_id"] = regionId;
			}
		}		
		//下面展示数据
		var noticeLstFootObj=parentThis.selecter.findById("div","quesDispatchFoot")[0];						
			common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								 '0',
								 '10',
								 param,
								 "data",
								 null,
								 noticeLstFootObj,
								 "",
									 function(data,dataSetName,showDataSpan){
				var noticeLstBodyObj=parentThis.selecter.findById("tbody","quesDispatchBody")[0];						
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
			$.each(data.data,function(i,obj){			
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" REGION_NAME="'+obj.REGION_NAME+'" DEPARTMENT_NAME="'+obj.DEPARTMENT_NAME+'"DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="checkbox" name="staffid" id="staffid_'+obj.STAFF_ID+'"></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>等级</td>');
				html.push('<td>称号</td>');		
				if(obj.COUNTDA==''){
					html.push('<td>0</td>');		
				}else{						
				html.push('<td>'+obj.COUNTDA+'</td>');		
				}
				html.push('<td>'+obj.REGION_NAME+'</td>');		
				html.push('<td title="'+obj.DEPARTMENT_NAME+'">'+obj.DEPARTMENT_NAME.substring(0,6)+'</td>');	
				
				html.push('</tr>');
			
			});
		}else{
				noticeLstFootObj.hide();
				html.push('<div>');
				html.push('<div  style="width:130px;">无相关数据</div>');
				html.push('<div>');
		}
		noticeLstBodyObj.html(html.join(''));		
		//单选
		noticeLstBodyObj.find("input[type=checkbox][name=staffid]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			noticeLstBodyObj.find("input[type=checkbox][name=staffid]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
	},
};