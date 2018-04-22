//var DemandList = new Function();
var WorkFlowList = new Function();
WorkFlowList.prototype = {
	selecter : "#workflwoListPage",
	pageSize : 10,
	selectWorkflowType :null,
	selectWorkflowSort :null,
	region_Id :null,
	//初始化执行
	init : function() {
		//发流程 发布后  对应的发布按钮 变灰的标识 从发布页面过来
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		//判断当前登录人是属于本地网还是省公司 所属的流程状态
		var regionId="";
		var regionName="";
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
				var regionId=json.regionId;
				var regionName=json.regionName;
				var workflowStateObj=$("#workflowState");
				var html=[];
				html.push('<option value="">==请选择==</option>');
				html.push('<option value="1000">已发布</option>');
				html.push('<option value="1001">草稿</option>');
				html.push('<option value="1002">暂停</option>');
				html.push('<option value="1003">作废</option>');
				if(json.regionId=="888"){
					html.push('<option value="1010">父流程</option>');
				}
				workflowStateObj.html(html.join(''));
				//加载查询区的本地网
				parentThis.loadWlan(regionId,regionName); 
		},null,null,false,false);
		//流程类型加载
		parentThis.createWorkflowSortHtml(parentThis); 
		//加载数据
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
			var regionId=json.regionId;
			parentThis.loadDemandList(parentThis,0,regionId); 
		},null,null,false,false);
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
			var regionId=json.regionId;
			parentThis.region_Id=json.regionId;
			parentThis.dataQryBind(searchObj,parentThis,regionId);
		},null,null,false,false);

		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#workflowNbr").val("");//流程编号
			$("#workflowName").val("");//流程名称
			$("#workflowState").val("");//流程状态
			$("#latnId").val("");//本地网
		});
		//add by dangzw begin
		//跳转至新建流程页面
		var addStaffObj =  parentThis.selecter.findById("a","addStaffInfo")[0];
		addStaffObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/createWorkflow.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var createWorkflow=new CreateWorkflow();
				createWorkflow.init();
			});
		});
		//add by dangzw end
		

	},
	loadWlan:function(regionId,regionName){
		if(regionId=="888"){
			//加载省级登录人员查询区的本地网数据
			$.jump.ajax(URL_QUERY_SYS_REGION.encodeUrl(), function(json) {
				var wlansObj=json.data;
				var latnId=$("#latnId");
				var html=[];
				html.push('<option value="">==请选择==</option>');
				html.push('<option value="888">省级</option>');
				if(wlansObj.length>0){
					$.each(wlansObj,function(i,obj){
						html.push('<option value="'+obj.REGION_ID+'">'+obj.REGION_NAME+'</option>');
					});
				}
				latnId.html(html.join(''));
			},null,null,false,false);
		}else{
			var html=[];
			var latnId=$("#latnId");
			html.push('<option value="">==请选择==</option>');
			html.push('<option value="'+regionId+'">'+regionName+'</option>');
			latnId.html(html.join(''));
		}
	},
	//查询绑定
	dataQryBind : function(searchObj,parentThis,regionId){
		searchObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0,regionId);
		});
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex,regionId) {
		debugger;
		var workflowNbr = parentThis.selecter.findById("input","workflowNbr")[0];//流程编号
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];//流程名称
		var workflowStateObj = parentThis.selecter.findById("select","workflowState")[0];//流程状态
		var workflowState=workflowStateObj.find("option:selected").attr("value");
		if(workflowState==undefined){
			workflowState="";
		}
		var latnId = parentThis.selecter.findById("select","latnId")[0];//本地网
		var param = {
			"workflowNbr"		 :	workflowNbr.val(),
			"workflowName"		 :	workflowName.val(),
			"workflowState" 	 :   workflowState,
			"selectWorkflowType" :   parentThis.selectWorkflowType,
			"selectWorkflowSort" :   parentThis.selectWorkflowSort,
			"latnId"       	 	 :   latnId.val(),
			"methodType" 		 : 	"query"
		};
		var workflowListFootObj = parentThis.selecter.findById("div","workflowListFoot")[0];
		common.pageControl.start(URL_QUERY_WORKFLOWlIST.encodeUrl(),
				 pageIndex,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 workflowListFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					debugger;
					var workflowListBodyObj = parentThis.selecter.findById("tbody","workflowListBody")[0];
					workflowListBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,workflowListBodyObj,regionId);
			});
	},

	//创建HTML
	createLstHtml : function(parentThis,data,workflowListBodyObj,regionId){
		var html=[];
		var dataLst = data.data;
		debugger;
		var workflowListFootObj = parentThis.selecter.findById("div","workflowListFoot")[0];
		if(dataLst.length > 0 ){
			workflowListFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.WORKFLOW_CODE+'</td>');
				var workflow_name=obj.WORKFLOW_NAME;
				if(workflow_name.length > 8){
					workflow_name = workflow_name.substring(0, 5) + "..."
					+ workflow_name.substring(workflow_name.length-2, workflow_name.length);
				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+workflow_name+'</td>');
				html.push('<td>'+obj.ACT_WORKFLOW_TYPE_NAME+'</td>');
				if(obj.WORKFLOW_STATUS=="1001"){
					html.push('<td>草稿</td>');
				}else if(obj.WORKFLOW_STATUS=="1000"){
					html.push('<td>已发布</td>');
				}else if(obj.WORKFLOW_STATUS=="1002"){
					html.push('<td>暂停</td>');
				}else if(obj.WORKFLOW_STATUS=="1003"){
					html.push('<td>作废</td>');
				}else{
					html.push('<td>父流程</td>');
				}				
				if(obj.WORKFLOW_CUSTOM_TYPE=="0"){
					html.push('<td>省定制</td>');
				}else if(obj.WORKFLOW_CUSTOM_TYPE=="1"){
					html.push('<td>省市协同定制</td>');
				}else{
					html.push('<td>市定制</td>');
				}
				html.push('<td>'+obj.REGION_NAME+'</td>');
				html.push('<td>');
				//详情
				html.push('<a href="#"  class="but" regionId="'+regionId+'" workflowSingleType="'+obj.WORKFLOW_SINGLE_TYPE+'"  name="viewDetail"  workflowSort="'+obj.WORKFLOW_SORT+'" workflowType="'+obj.WORKFLOW_TYPE+'" workflowLevel="'+obj.WORKFLOW_LEVEL+'" regionName="'+obj.REGION_NAME+'" workflowStatus="'+obj.WORKFLOW_STATUS+'"  workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'">详细</a>&nbsp;&nbsp;&nbsp;');
				//维护
				/**/if(regionId=="888" && (obj.WORKFLOW_STATUS=="1001" || obj.WORKFLOW_STATUS=="1010" || obj.WORKFLOW_STATUS=="1000") && (obj.WORKFLOW_LEVEL!="3")){
					html.push('<a href="#"  class="but" name="maintain" workflowCustomType="'+obj.WORKFLOW_CUSTOM_TYPE+'" workflowCustomType="'+obj.WORKFLOW_CUSTOM_TYPE+'" workflowSingleType="'+obj.WORKFLOW_SINGLE_TYPE+'" workflowStatus="'+obj.WORKFLOW_STATUS+'" regionName="'+obj.REGION_NAME+'" workflowSort="'+obj.WORKFLOW_SORT+'" workflowType="'+obj.WORKFLOW_TYPE+'" workflowName="'+obj.WORKFLOW_NAME+'"  workflowId="'+obj.WORKFLOW_ID+'">维护</a>&nbsp;&nbsp;&nbsp;');
				}else if(regionId!="888" &&  (obj.WORKFLOW_STATUS=="1001"  || obj.WORKFLOW_STATUS=="1000") && (obj.WORKFLOW_LEVEL=="3" || obj.WORKFLOW_LEVEL=="2")){
					html.push('<a href="#"  class="but" name="maintain" workflowCustomType="'+obj.WORKFLOW_CUSTOM_TYPE+'" workflowCustomType="'+obj.WORKFLOW_CUSTOM_TYPE+'" workflowSingleType="'+obj.WORKFLOW_SINGLE_TYPE+'" workflowStatus="'+obj.WORKFLOW_STATUS+'" regionName="'+obj.REGION_NAME+'" workflowSort="'+obj.WORKFLOW_SORT+'" workflowType="'+obj.WORKFLOW_TYPE+'" workflowName="'+obj.WORKFLOW_NAME+'"  workflowId="'+obj.WORKFLOW_ID+'">维护</a>&nbsp;&nbsp;&nbsp;');
				}else{
					html.push('<a href="#"  class="but hs_bg"  workflowId="'+obj.WORKFLOW_ID+'">维护</a>&nbsp;&nbsp;&nbsp;');
				}
				html.push('</td>');
				html.push('</tr>');
			});
		}else{
				workflowListFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		workflowListBodyObj.html(html.join(''));
		
		//给"维护"绑定事件
		$("#workflwoListPage").find("a[name=maintain]").unbind("click").bind("click",function(){
			
			var workflowId=$(this).attr("workflowId");
			var workflowExamplePara={
					"workflowId"	:	workflowId
			};
			var workflowName=$(this).attr("workflowName");
			var workflowStatus=$(this).attr("workflowStatus");
			var workflowSort=$(this).attr("workflowSort");
			var workflowType=$(this).attr("workflowType");
			var workflowSingleType=$(this).attr("workflowSingleType");
			var workflowCustomType=$(this).attr("workflowCustomType");
			var regionName=$(this).attr("regionName");
			//判断流程下面有有没有未完的流程实例
			var flag=1;
			if(workflowStatus=="1000" || workflowStatus=="1002"){
				$.jump.ajax(URL_QUERY_WORKFLOWEXAMPLE_STATUS.encodeUrl(), function(json) {
					if(json.code=="-1"){
						layer.alert("该流程下面有未处理完的流程实例,不能维护!");
						flag=0;
						return false;
					}else{
						$.jump.loadHtmlForFun("/web/html/shortProcess/maintainWorkflow.html".encodeUrl(), function(menuHtml){
							$('#content').html(menuHtml);
							param={
									"workflowId"	:	workflowId,
									"workflowName"	:	workflowName,
									"workflowSort"	:	workflowSort,
									"workflowType"	:	workflowType,
									"workflowSingleType"	:	workflowSingleType,
									"workflowCustomType"	:	workflowCustomType,
									"regionName"	:	regionName,
									"methodType"	:	"getOneWorkflowData"
							};
							var maintainWorkflow=new MaintainWorkflow();
							maintainWorkflow.init(param);
						});
					}
				},workflowExamplePara,null,false,false);
			}
			if(flag==1){
				$.jump.loadHtmlForFun("/web/html/shortProcess/maintainWorkflow.html".encodeUrl(), function(menuHtml){
					$('#content').html(menuHtml);
					param={
							"workflowId"	:	workflowId,
							"workflowName"	:	workflowName,
							"workflowSort"	:	workflowSort,
							"workflowType"	:	workflowType,
							"workflowSingleType"	:	workflowSingleType,
							"workflowCustomType"	:	workflowCustomType,
							"regionName"	:	regionName,
							"methodType"	:	"getOneWorkflowData"
					};
					var maintainWorkflow=new MaintainWorkflow();
					maintainWorkflow.init(param);
				});
			}

		});
		
		//给"发布"绑定事件
		$("#workflwoListPage").find("a[name=publish]").unbind("click").bind("click",function(){
			var workflowId=$(this).attr("workflowId");
			var workflowStatus=$(this).attr("workflowStatus");
			var wlanId=$(this).attr("wlanId");
			var workflowSingleType=$(this).attr("workflowSingleType");
			//判断父流程是否已发布
//			if(workflowStatus=="1010"){
//				var isOrNotPublish={
//						"workflowId"	:	workflowId
//				};
//				$.jump.ajax(URL_QUERY_ISORNOT_PUBLISH.encodeUrl(), function(json) {
//					var publishStatus="";
//					if(json.code=="0"){
//						publishStatus=json.publishStatus;
//						if(publishStatus=="1000"){
//							layer.alert("该流程已发布");
//							return false;
//						}else{
//							var param={
//									"workflowId"	:	workflowId,
//									"wlanId"		:	wlanId
//							};
//							
//							$.jump.loadHtmlForFun("/web/html/shortProcess/workflowPublish.html".encodeUrl(), function(menuHtml){
//								$('#content').html(menuHtml);
//								var workflowPublish=new WorkflowPublish();
//								workflowPublish.init(param);
//							});
//						}
//					}
//				},isOrNotPublish,null,false,false);
//				
//			}else{
				var param={
						"workflowId"	:	workflowId,
						"wlanId"		:	wlanId
				};
				
				$.jump.loadHtmlForFun("/web/html/shortProcess/workflowPublish.html".encodeUrl(), function(menuHtml){
					$('#content').html(menuHtml);
					var workflowPublish=new WorkflowPublish();
					workflowPublish.init(param);
				});
//			}
			
			//先判断流程实例的每个节点的是否设置了处理时限
//			$.jump.ajax(URL_ISORNOT_SET_TIMELIMIT.encodeUrl(), function(json) {
//				if(json.code!="0"){
//					layer.alert("请设置该流程每个任务节点的处理时限!");
//					return false;
//				}else{
//					$.jump.loadHtmlForFun("/web/html/shortProcess/workflowPublish.html".encodeUrl(), function(menuHtml){
//						$('#content').html(menuHtml);
//						var workflowPublish=new WorkflowPublish();
//						workflowPublish.init(param);
//					});
//				}
//			},param,null,false,false);
		});
		//给"详细"绑定事件
		$("#workflwoListPage").find("a[name=viewDetail]").unbind("click").bind("click",function(){
			var regionId=$(this).attr("regionId");
			var workflowStatus=$(this).attr("workflowStatus");
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var regionName=$(this).attr("regionName");
			var workflowLevel=$(this).attr("workflowLevel");
			var workflowSort=$(this).attr("workflowSort");
			var workflowType=$(this).attr("workflowType");
			var workflowSingleType=$(this).attr("workflowSingleType");
			$.jump.loadHtmlForFun("/web/html/shortProcess/viewWorkflowDetail.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				param={
						"workflowId"		:	workflowId,
						"regionId"			:	regionId,//用于详细页面判断 是否出现“子流程”的按钮
						"workflowName"		:	workflowName,
						"regionName"		:	regionName,
						"workflowStatus"	:	workflowStatus,
						"workflowLevel"		:	workflowLevel,
						"workflowSort"		:	workflowSort,
						"workflowType"		:	workflowType,
						"workflowSingleType"		:	workflowSingleType,
						"flag"				:   "1"
				};
				var viewWorkflowDetail=new ViewWorkflowDetail();
				viewWorkflowDetail.init(param);
			});
		});	
		//给"暂停"绑定事件  
		$("#workflwoListPage").find("a[name=stop]").unbind("click").bind("click",function(){
			//更新流程状态到暂停
			var currentObj=$(this);
			var workflowId=$(this).attr("workflowId");
			var workflowStatus=$(this).attr("workflowStatus");
			var stopParam={
				"workflowId"	:	workflowId
			};
			$.jump.ajax(URL_UPDATEWORKFLOWSTATUS_TO_STOP.encodeUrl(), function(json) {
				if(json.code!="0"){
					layer.alert("暂停流程失败");
				}else{
					$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(), function(menuHtml){
						$('#content').html(menuHtml);
						var workFlowList=new WorkFlowList();
						workFlowList.init();
					});
				}
			},stopParam,null,false,false);
		});	
		//给"开启"绑定事件  
		$("#workflwoListPage").find("a[name=start]").unbind("click").bind("click",function(){
			//更新流程状态到暂停
			var currentObj=$(this);
			var workflowId=$(this).attr("workflowId");
			var workflowStatus=$(this).attr("workflowStatus");
			var stopParam={
				"workflowId"	:	workflowId
			};
			$.jump.ajax(URL_UPDATEWORKFLOWSTATUS_TO_STOP.encodeUrl(), function(json) {
				if(json.code!="0"){
					layer.alert("开启流程失败");
				}else{
					$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(), function(menuHtml){
						$('#content').html(menuHtml);
						var workFlowList=new WorkFlowList();
						workFlowList.init();
					});
				}
			},stopParam,null,false,false);
		});	
	},
	createWorkflowSortHtml:function(parentThis){
		//加载流程分类数据begin
		var sortParam={
			"flag"	:	1	
		};
		$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
			if(json.code=="0"){
				//var workflowClassObj =  parentThis.selecter.findById("select","workflowClass")[0];
				var dataObj=json.data;
				var html = [];
				if(dataObj.length > 0 ){
					html.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
					$.each(dataObj,function(i,obj){
						//html.push("<option value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
						html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
					});
				}
				html.push('</div>');
				$("#processDiv").html(html.join(''));	
				//parentThis.createWorkflowSortHtml(parentThis,dataObj);
			}
		},sortParam,null,false,false);
		//加载流程分类数据end
		//点击
		$("#processDiv").find("div[name='divfu']").each(function(index){
			var fuId=$(this).attr("id");
			var param={								
					"flag"			:	2,	
					"workflowClass"	:	fuId	
			};
			$("#"+fuId+"").unbind("click").bind("click",function(){
				parentThis.selectWorkflowSort = fuId;
				$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
					
					if(json.code == "0" ){
						var html=[];
						if(json.data.length > 0) {
							$.each(json.data,function(i,obj){
								html.push('<div typeId="'+obj.ACT_WORKFLOW_TYPE_ID+'"  id="'+obj.ACT_WORKFLOW_TYPE_CODE+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ACT_WORKFLOW_TYPE_NAME+'</div>');
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
				//点击子级触发事件 类型
				$("#"+fuId).find("div[name='divzi']").each(function(index){
					var ziId=$(this).attr("id");
					var typeId=$(this).attr("typeId");
					$("#"+fuId).find("div[name='divzi']").css("color","#585858");
					$("#"+ziId+"").click(function(e){
						$('div[name="divzi"]').css("color","#585858");
						$("#"+ziId+"").css("color","#0672d4");
						//里边的<div>点击，但是不触发外层的<div>
						e.stopPropagation();
						//子级流程的内容展示
//						var workflowListBodyObj = parentThis.selecter.findById("tbody","workflowListBody")[0];
//						workflowListBodyObj.html("");
						parentThis.selectWorkflowType = typeId;
						parentThis.loadDemandList(parentThis,0,parentThis.region_Id);
					});
				});
//				$("#"+fuId).find("div[name='divzi']").each(function(index){
//					var ziId=$(this).attr("id");
//						$("#"+ziId+"").click(function(e){
//							alert("类型点击了"+ziId);
//							//里边的<div>点击，但是不触发外层的<div>
//							e.stopPropagation();
//							parentThis.selectWorkflowType = ziId;
//							parentThis.loadDemandList(parentThis,0,parentThis.region_Id);
//						});
//				});
			});
		});
	},
};
