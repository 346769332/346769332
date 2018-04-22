var DisposeShortInfo = new Function();

DisposeShortInfo.prototype = {

	parentBody : null,

	demandId : "",
	
	flowType : null,
	
	workflowId : "",
	
	workflow_Name : "",
	
	workflow_Type_Name : "",
	demandCode : "",
	demandName : "",
	demandDesc : "",
	staff_ids : [], 
    staff_names: [], 
    department_names : [], 
    department_codes: [],
    next_node_id: [],
    now_node_id: null,
    type :null,
    demo : null,
    falg :1,
    taskId : null,  
    isEndTime : null,  
    timeLimit : null,  
    urgeCount : null,  
    urgeTime  : null,  
    nodecount : null,  
    up_node_id : null,  
    taskNums   : null,  
    submitInfos   : null,  
    huiqianNodeId  : [],  
    nodeIds  : "",  
    workflow_st : null,  
    totaskId  : "",  
    isIndex : -1,
    workflow_type : "",
    endNodeId : "",
    signNodeId : "",
    consignInfoRadiotype : true,
    unsignNext : "",
	Sign_staffId : [],  //会签人ID
	Sign_staffName : [], //会签人名称
	Sign_staffDeptId : [], //会签人部门ID
	Sign_staffDeptName : [], //会签人部门名称
    ear_staff_ids : [], //被授权人ID
    ear_staff_names: [], //被授权人名称
    ear_department_names : [], //被授权人部门
    ear_department_codes: [],//被授权人部门ID
    now_ear_staff_ids : null, //被授权人ID
    now_ear_staff_names: null, //被授权人名称
    now_ear_department_names : null, //被授权人部门
    now_ear_department_codes: null,//被授权人部门ID
    ear_operatop_id: null,//被授权人部门ID
    workFlowTypeCode:"",
	templateId : "",
	init : function(parentBody) {
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
		this.workflowId = common.utils.getHtmlUrlParam("workflow_id"); 
		this.workflow_Name =decodeURI(common.utils.getHtmlUrlParam("workflow_Name")); 
		this.demandId =decodeURI(common.utils.getHtmlUrlParam("demandId")); 
		this.demandName =decodeURI(common.utils.getHtmlUrlParam("demandName")); 
		this.demandDesc =decodeURI(common.utils.getHtmlUrlParam("demandDesc"));
		this.ear_operatop_id =decodeURI(common.utils.getHtmlUrlParam("ear_operatop_id"));
		this.demandCode=decodeURI(common.utils.getHtmlUrlParam("demandCode"));
		this.templateId =decodeURI(common.utils.getHtmlUrlParam("templateId")); 
		this.bindMethod();

	},
	
	bindMethod : function() {
		var parentThis = this;

		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
		"".findById("a", "submitInfo", this.parentBody)[0].unbind().bind("click",function(){
			
			parentThis.sunmitDemandInfo();
		});
		//parentThis.searchWorkFlowInfo();
		$("#workflow_Name").text(parentThis.workflow_Name);
		$("#demandName").text(parentThis.demandName);
		$("#demandDesc").text(parentThis.demandDesc);
		var templateId=parentThis.templateId;
		if(templateId!=""&&templateId!=null&&templateId!=undefined){
			var attrParam={
					"handleTypecom"  : "qryLst",
					"handleType"     : 2018,
					"sqlName"     	 : "queryTemplataInfo",
					"demandId"       :  parentThis.demandId,
					"templateId"	 :	templateId
			};
			$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
					if(json.code == "0" ){
						var dataList=json.data;
						var html=[];
						$.each(dataList,function(i,obj){
							if(obj.ATTR_TYPE=="radio"){
								if(i==0){
									html.push('<dl class="xq_content">');
									html.push('<dt>个性规则</dt>');
									html.push('<dt style="color:#888;width: 80%;">');
								}
								html.push('<input id='+obj.ATTR_ONAME+' tempId='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' name="radios" style="width: 9%;" disabled="disabled">'+obj.ATTR_NAME+'');
								parentThis.templateType = obj.ATTR_TYPE;
								if(i==(dataList.length-1)){
									html.push('</dt></dl>');
								}
							}else{
								html.push('<dl class="xq_content">');
								html.push('<dt>'+obj.ATTR_NAME+'</dt>');
								html.push('<dt style="color:#888;">');
								html.push('<input id='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' style="width: 95%;" disabled="disabled">');
								html.push('</dl>');
							}
						});
						$("#templateInfos").before(html.join(''));
					};
				}, attrParam, false,false);
		}
		//流程单类型
		var params={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"   	 :  "qryWorkflowType",
				"workflowId"     :  parentThis.workflowId,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){
			 			parentThis.workflow_st = obj.WORKFLOW_SINGLE_TYPE;
			 		});
				}
			}, params, false,false);
		//$("#workflowSort").text(parentThis.workflow_st);
		//发起人及部门
		var params={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"   :  "queryDeptPno",
				"demandId"  :  parentThis.demandId,
				"workflowId":  parentThis.workflowId,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
			 		$("#releasePersonName").text(obj.DEMAND_SUMIT_PNAME);
			 		$("#releaseDeptName").text(obj.dept_name);
			 		$("#releasePersonNum").text(obj.DEMAND_SUMIT_PNO);
				});
			}
		}, params, false,false);
		//打回根节点/上一步
		var params={								
				"handleTypecom":  "qryLst",
				"handleType"     : 2018,
				"sqlName"   :  "qryDangQiaTaskId",
				"demandId"  :  parentThis.demandId,
				"workflowId":  parentThis.workflowId,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
					parentThis.totaskId = obj.TASKID;
				});
			}
		}, params, false,false);
		var parama={};
		if(parentThis.ear_operatop_id!=""){
			//当前节点ID及任务ID
			parama={
					"handleTypecom"		: "qryLst",
					"handleType"     	: 2018,
					"sqlName"   		: "qryTaskId",
					"demandId"  		: parentThis.demandId,
					"workflowId"		: parentThis.workflowId,
					"ear_operatop_id"	: parentThis.ear_operatop_id,
			};
		}else{
			//当前节点ID及任务ID
			parama={								
					"handleTypecom"		: "qryLst",
					"handleType"     	: 2018,
					"sqlName"   		: "qryTaskId",
					"demandId"  : parentThis.demandId,
					"workflowId": parentThis.workflowId,
			};
		}	
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
					
			 		$.each(json.data,function(i,obj){
			 			parentThis.taskId = obj.TASK_ID;
			 			parentThis.now_node_id = obj.NODE_ID;
			 			parentThis.urgeTime = obj.LIMITTIME;
			 			parentThis.urgeCount = obj.URGE_COUNT;
			 		});
				}
			}, parama, false,false);
		//下一节点个数
		var parama={								
				"handleTypecom"  :"qryLst",
				"handleType"     : 2018,
				"sqlName"     :"qryNodeCount",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.workflowId,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			
			 			parentThis.nodecount = obj.NODECOUNT;
			 		});
				}
			}, parama, false,false);
		//下一节点ID
		var parama={								
				"handleTypecom"  :"qryLst",
				"handleType"     : 2018,
				"sqlName"     :"getNextNodeList",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.workflowId,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.nodeIds +=obj.NEXT_NODE_ID+",";
			 		});
				}
			}, parama, false,false);
		//审批动作
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     : "qryCaozuoType",
				"workflowId"  : parentThis.workflowId,
				"nodeId"      : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
					var html ="";
			 		$.each(json.data,function(i,obj){
			 			
			 			if(obj.IS_SIGNATURE=="1"){//是否允许会签
			 				html+='<input name="disposeRadio" type="radio" value="sign" style="width: 5%;">会签 ';
			 			 }
//			 			if(obj.OPERAT_AGREE=="1"){//是否审批通过
//			 				html+='<input name="disposeRadio" type="radio" value="agree">通过 ';
//			 			}
//			 			if(obj.TO_PREV_NODE=="2"){//是否允许打回上一步
//			 				html+='<input name="disposeRadio" type="radio" value="toPrev">打回上一节点';
//			 			}
//			 			 if(obj.TO_BEGIN_NODE=="3"){//是否允许打回开始节点
//			 				html+='<input name="disposeRadio" type="radio" value="toStart">打回发起节点 ';
//			 			}
			 			html+='<input name="disposeRadio" type="radio" value="agree">通过 ';
			 			html+='<input name="disposeRadio" type="radio" value="toPrev">打回上一节点';
			 			html+='<input name="disposeRadio" type="radio" value="toStart">打回发起节点 ';
			 			$("#disposeRadio").html(html);
			 		});
				}
			}, parama, false,false);
		//获取时限
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     	 : "qryGuoShiTime",
				"demandId"    	 : parentThis.demandId,
				"workflowId"  	 : parentThis.workflowId,
				"nodeId"      	 : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.timeLimit = obj.TIME_LIMIT;
						var d = new Date();
						var endtime =new   Date(Date.parse(obj.ENDTIME.replace(/-/g,"/")));
			 			if(endtime>d){
			 				parentThis.isEndTime = 0;	
			 			}else{
			 				parentThis.isEndTime = 1;	
			 			}
			 		});
				}
			}, parama, false,false);
//		// 选择节点处理部门
//		"".findById("input", "disposePersonName", this.parentBody)[0].unbind().bind("click",function(){
//			parentThis.searchWorkFlowInfo();
//		});
		//结束流程
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     	 : "qryEndNode",
				"nodeId"      	 : parentThis.now_node_id,
				"workflowId"  	 : parentThis.workflowId
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
					parentThis.submitInfos = json.data.length;
					if(json.data.length>0){
						parentThis.endNodeId = json.data[0].ENDNODEID;
					}
					
				}
			}, parama, false,false);
		//获取下一节点处理人信息
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     	 : "showNextNodeDeptInfo",
				"nodeId"       	 : parentThis.now_node_id,
				"workflowId"  	 : parentThis.workflowId
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
				$.each(json.data,function(i,obj){
					var disposeDeptName;
					var disposePersonName;
							parentThis.huiqianNodeId.push(obj.NODE_ID);
						if(obj.NODE_EXECUTOR_ID!=""){
							parentThis.staff_ids.push(obj.NODE_EXECUTOR_ID);				
							parentThis.staff_names.push(obj.NODE_EXECUTOR);
							parentThis.department_names.push(obj.NODE_EXECUTE_DEPART);
							parentThis.department_codes.push(obj.NODE_EXECUTE_DEPART_ID);
						}
							disposeDeptName = parentThis.department_names.join(",");
							disposePersonName = parentThis.staff_names.join(",");
					$("#disposeDeptName").text(disposeDeptName);
					$("#disposePersonName").text(disposePersonName);
				});
				}
			}, parama, false,false);
		//add 2017-09-05
		var post_id;
		var dept_type_id;
		var dept_level;
		var selectNodeId;
		
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"dataSource"  		: 	"",
				"sqlName"     		: 	"qrySumitLeadIdByDisDeptInfo",
				"nodeId"      		: 	parentThis.huiqianNodeId.join(","),
				"workflowId"  		: 	parentThis.workflowId
		};	
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {//URL_QUERY_COMMON_METHOD
				
			if(json.code == "0"){
				$.each(json.data,function(i,obj){
					
		 			post_id = obj.POST_ID;
		 			dept_type_id = obj.DEPT_TYPE_ID;
		 			dept_level = obj.DEPT_LEVEL;
		 			selectNodeId = obj.SELECTNODE_ID;
		 			if(dept_level=="4"){
		 				var paramma={
								"handleType"  : 2018,
								"handleTypecom"  : "qryLst",
								"dataSource"  : "",
								"nameSpace"   : "shortProcess",
								"sqlName"     		: 	"qryRealDeptLevel",
								"workflowId"     :  parentThis.workflowId,
								"demandId"       :  parentThis.demandId,
								"selectNodeId"   :  selectNodeId,
								"flag"        : "1"	
						};
		 				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
		 					
		 					if(json.code == "0"){
		 						if(json.data.length>0){
									dept_level=json.data[0].dept_level;
									dept_type_id=json.data[0].dept_type_id;
								}
		 					}
		 				}, paramma, false,false);
		 			}
				  });
				}
			}, parama, false,false);
		var param={"handleType" : 2013,"workflowId":parentThis.workflowId};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			
			if(json.code == "0"){
				$.each(json.data0,function(i,obj){
					
					parentThis.workFlowTypeCode = obj.ACT_WORKFLOW_TYPE_CODE;
		 		});
			}
		}, param, false,false);
		if(parentThis.staff_ids.length==0){//动态节点
			//获取下一节点处理人信息
			var parama={								
					"handleTypecom"  : "qryLst",
					"handleType"     : 2018,
					//"sqlName"        : "qrySumitLeadIdByDept",
					"sqlName"     		: 	"qrySumitLeadIdByDisDept",
					"flag"           : "1",
					"nodeId"         : parentThis.huiqianNodeId.join(","),
					"workflowId"     :  parentThis.workflowId,
					"demandId"       :  parentThis.demandId,
					"post_id"     	 : 	post_id,
					"dept_type_id"   : 	dept_type_id,
					"dept_level"     : 	dept_level,
					"selectNodeId"   :  selectNodeId,
					"workFlowTypeCode"  :parentThis.workFlowTypeCode
			};			
			$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				
					if(json.code == "0"){
					$.each(json.data,function(i,obj){
						
						var disposeDeptName;
						var disposePersonName;
								parentThis.staff_ids.push(obj.STAFF_ID);				
								parentThis.staff_names.push(obj.STAFF_NAME);
								parentThis.department_names.push(obj.DEPT_NAME);
								parentThis.department_codes.push(obj.DEPT_ID);
								disposeDeptName = parentThis.department_names.join(",");
								disposePersonName = parentThis.staff_names.join(",");
						$("#disposeDeptName").text(disposeDeptName);
						$("#disposePersonName").text(disposePersonName);
					});
					}
				}, parama, false,false);
		}
		
		//获取单选规则属性模板
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"dataSource"  	 :"",
				"nameSpace"   	 :"shortProcess",
				"sqlName"     	 :"qrySelectedRadioInfo",
				"nodeId"      	 : parentThis.now_node_id
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			
				if(json.code == "0"){
					var html =[];
					html.push('<dl class="xq_content">');
					for(var i=0;i<json.data.length;i++){
						
						if(i<(json.data.length-1)){
							if(json.data[i].RADIO_ID==json.data[i+1].RADIO_ID){
								html.push('<dt>'+json.data[i].RADIO_NAME+'</dt>');
								html.push('<dt style="color:#888;">');
							}
							html.push('<input id='+json.data[i].CONTENT_ID+' radioContentId='+json.data[i].CONTENT_ID+' name="radioContent" type="radio" value='+json.data[i].CONTENT_VALUE+'>'+json.data[i].CONTENT_NAME+'');
							
						}else{
							//html.push('<td>');
							html.push('<input id='+json.data[i].CONTENT_ID+' radioContentId='+json.data[i].CONTENT_ID+' name="radioContent" type="radio" value='+json.data[i].CONTENT_VALUE+'>'+json.data[i].CONTENT_NAME+'</dt>');
						}
						
					}
					html.push('</dl>');
					$("#templateInfos").before(html.join(''));
				}
			}, parama, false,false);
		
		//获取本节点处理人信息
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     : "showNowNodeDeptInfo",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.workflowId
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
				$.each(json.data,function(i,obj){
							parentThis.now_ear_staff_ids = obj.NODE_EXECUTOR_ID;				
							parentThis.now_ear_staff_names=obj.NODE_EXECUTOR;
							parentThis.now_ear_department_names=obj.NODE_EXECUTE_DEPART;
							parentThis.now_ear_department_codes=obj.NODE_EXECUTE_DEPART_ID;
				});
				}
			}, parama, false,false);
		"".findById("button", "searchBtn", this.parentBody)[0].unbind().bind("click",function(){
			parentThis.getSearchDisposePerson();

		});
		 //单选规则事件
		 $("input:radio[name=radioContent]").click(function(){
			 
			 var radioContentRadio=$('input:radio[name=radioContent]:checked').val();  //获取单选规则属性
			 var radioContentId = $('input:radio[name=radioContent]:checked').attr("radioContentId");
			 //查询单选规则下一步
				var paramsd={								
						"handleTypecom"      : "qryLst",
						"handleType"         : 2018,
						"dataSource" 		 : "",
						"nameSpace"  		 : "shortProcess",
						"sqlName"    		 : "qrySelectedRadioInfoDispose",
						"workflowId" 		 :  parentThis.workflowId,
						"nodeId"   	 		 :  parentThis.now_node_id,//当前节点
						"radioContentId"   	 :  radioContentId//单选规则属性ID
				};
				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
					parentThis.staff_ids = [];
					parentThis.staff_names = [];
					parentThis.department_names = [];
					parentThis.department_codes = [];
					parentThis.nodeIds = [];
					parentThis.huiqianNodeId = [];
						if(json.code == "0" ){
							parentThis.staff_ids.push(json.data[0].NODE_EXECUTOR_ID);				
							parentThis.staff_names.push(json.data[0].NODE_EXECUTOR);
							parentThis.department_names.push(json.data[0].NODE_EXECUTE_DEPART);
							parentThis.department_codes.push(json.data[0].NODE_EXECUTE_DEPART_ID);
		                	parentThis.next_node_id=json.data[0].NEXTNODEID;
		                	parentThis.nodeIds.push(json.data[0].NEXTNODEID);
		                	parentThis.huiqianNodeId.push(json.data[0].NEXTNODEID);
							$("#disposeDeptName").text(json.data[0].NODE_EXECUTE_DEPART);
							$("#disposePersonName").text(json.data[0].NODE_EXECUTOR);
							parentThis.nodecount =json.data.length; 
						}
					}, paramsd, false,false);
		 });
		"".findById("button", "submitBtn", this.parentBody)[0].unbind().bind("click",function(){
			
			 $("#myModal").hide();
				if(parentThis.nodecount==1&&(parentThis.workflow_st==1||parentThis.workflow_st==2||parentThis.workflow_st==0)){
					var nextNodeSelect = parentThis.nodeIds.split(",");
					//画页面
					parentThis.seleteNextDisposeInfo(nextNodeSelect[0]);
				}else if(parentThis.nodecount>1&&parentThis.workflow_st==1){
					
					var signNodeId =parentThis.signNodeId;
					//画页面
					parentThis.seleteNextDisposeInfo(signNodeId);
				}else if(parentThis.nodecount>1&&parentThis.workflow_st==2){
					var inlineInfoRadio=$('input:radio[name=inlineInfoRadio]:checked').val();
					
					if(inlineInfoRadio!=null||inlineInfoRadio!=undefined){
					 //画页面
					 parentThis.seleteNextDisposeInfo(inlineInfoRadio);
					}else{
						layer.alert("请选择发往单位!");
					}
				}
			
			
		});
		// 发起需求
		
//		"".findById("a", "submitInfo", this.parentBody)[0].unbind().bind("click",function(){
//				parentThis.submitInfo(parentThis);
//		});
		/***********************************************审批中标记节点颜色*******************************************/
		var signNodeName;
		var currNodeName;
		var currentNodeParam={
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"        : "queryRedNode",
				"workflowId"	 :	parentThis.workflowId,	
				"demandId"		 :	parentThis.demandId,
				"task_id"        :   parentThis.taskId,
				"flag"			 :	"1"
		};
		var currentId="";
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code=="0"){
				var dataObj=json.data;
				currentId=dataObj.NODE_ID;
				currNodeName=dataObj.NODE_NAME;
			}
		},currentNodeParam,null,false,false);
		
		param={
				
				"handleType"     :  2013,
				"workflowId"	 :	parentThis.workflowId,
			  };
	 	$.jump.ajax(URL_SHORT_PROCESS, function(json) {
	 		
	 		$.each(json.data0,function(i,obj){
	 			parentThis.workflow_type = obj.WORKFLOW_TYPE;
	 			$("#workflowSort").val(obj.ACT_WORKFLOW_TYPE_NAME);
	 			
	 		});
	 		var nodeNum=json.nodeNum;
	 		var nodeData=json.data.nodes;
	 		var jsonnodes="";
	 		$.each(json.data.nodes,function(i,obj){
	 			var type="";
	 			if(obj.NODE_TYPE=="0"){
	 				// 开始节点
	 				type="start round";
	 			}else if(obj.NODE_TYPE=="1"){
	 				// 任务节点
	 				type="node";
	 			}else{
	 				// 结束节点
	 				type="end round";
	 			}
	 			var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
			 	jsonnodes+=nodes+",";
	 		});
	 		jsonnodes="{"+jsonnodes.substring(0,jsonnodes.length-1)+"}";
	 		var jsonnodesObj=eval("("+jsonnodes+")");
	 		
	 		var lineNum=json.lineNum;
	 		var jsonlines="";
	 		var dataLine=json.data.lines;
	 		$.each(json.data.lines,function(i,obj){
	 			
	 			var lineName="";
	 			if(obj.LINE_NAME=="1"){
	 				lineName="串行";
	 			}else if(obj.LINE_NAME=="2"){
	 				lineName="并行";
	 			}else if(obj.LINE_NAME=="3"){
	 				lineName="无效";
	 			}
//	 			var dats=''+"{"+'"node_Id" : '+'"'+obj.FROM_NODE_ID+'"'+","+'"line_Name" :'+'"'+obj.LINE_NAME+'"}';
//	 			dataLine+=dats+",";
	 			//add by dangzw end 2016-12-01
	 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'""'+"}";
	 			jsonlines+=lines+",";
	 		});
	 		jsonlines="{"+jsonlines.substring(0,jsonlines.length-1)+"}";
	 		var jsonlinesObj=eval("("+jsonlines+")");
	  		if(json.code == "0" ){
	  			// 成功
	  			var workflow={
  				        "nodes": 	jsonnodesObj,
  				        "lines":	jsonlinesObj	
	  			};
//	  			parentThis.demo.loadData(workflow);
//	  			$("#workflow .GooFlow_item").attr("flag","3");
//	  			$("#draw_workflow g").attr("flag","3");
	  			
	  			//parentThis.addColorForCurrentNode(currentId);
	  			//parentThis.addColorForEndNode(dataConfirmedObj,parentThis);
	  			$.each(json.data.nodes,function(i,obj){ //悬浮
	  				
		 			var operat_agree = obj.OPERAT_AGREE;
		 			 if(operat_agree!=1){
		 				operat_agree = "";
		 			 }else{
		 				operat_agree = "通过";
		 			 }
			 		var to_prev_node = obj.TO_PREV_NODE;
			 			 if(to_prev_node!=2){
			 				to_prev_node = "";
			 			 }else{
			 				to_prev_node = "允许打回上一步";
			 			 }
				 	var to_begin_node = obj.TO_BEGIN_NODE;
				 			 if(to_begin_node!=3){
				 				to_begin_node = "";
				 			 }else{
				 				to_begin_node = "允许打回根节点";
				 			 }
				 	var titles ="处理人："+obj.NODE_EXECUTOR+"\n处理部门："+obj.NODE_EXECUTE_DEPART+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + ""+to_begin_node+"\n处理时限："+obj.TIME_LIMIT+"";
				 	$("#td_"+obj.NODE_ID+"").attr("title",titles);
	  			});
	  		}else{
	  			layer.alert("加载失败");
	  		};
	 	}, param, true);
	},
	getSearchDisposePerson : function(){
		var param ={
				"handleType" : 2014,
				"name" : $("#searchName").val()
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			common.loadding("open");
	 		var html="";
			$.each(json.data,function(i,obj){
				html+='<tr name="staffInfo"  staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'"><td style="width :5%">';
				html+='<input type="radio" name="sex"></td>';
				html+='<td>'+obj.STAFF_NAME+'</td><td>'+obj.ORG_NAME+'</td><td>'+obj.REGION_NAME+'</td></tr>';
			});
			$("#searchList").html(html);
			common.loadding("close");
	 	}, param, true);	
	},
	searchWorkFlowInfo: function(){
		
		var parentThis = this;
		param={"handleType" : 2013,"workflowId":parentThis.workflow_id};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
	 		$("#releasePersonName").text(json.staffname);
	 		$("#releasePersonNum").text(json.staffpno);
	 		$.each(json.data,function(i,obj){
	 			parentThis.now_node_id =""+obj.NOW_NODE_ID+"";
	 			parentThis.next_node_id =""+obj.NEXT_NODE_ID+"";
	 			if(obj.NODE_EXECUTOR==""){
	 				parentThis.node_executor = " ";
	 			}else {
	 				parentThis.node_executor = obj.NODE_EXECUTOR;
	 			}
	 			if(obj.NODE_EXECUTE_DEPART==""){
	 				parentThis.node_execute_depart = " ";
	 			}else {
	 				parentThis.node_execute_depart = obj.NODE_EXECUTE_DEPART;
	 			}
	 			if(obj.NODE_EXECUTOR_ID==""){
	 				parentThis.node_executor_id ="";
	 			}else {
	 				parentThis.node_executor_id = obj.NODE_EXECUTOR_ID;
	 			}
	 			if(obj.NODE_EXECUTE_DEPART_ID==""){
	 				parentThis.node_execute_depart_id = "";
	 			}else {
	 				parentThis.node_execute_depart_id = obj.NODE_EXECUTE_DEPART_ID;
	 			}
	 		});
			if(parentThis.node_executor_id==""||parentThis.node_executor_id==undefined||parentThis.node_executor_id==null){
				parentThis.flag = 1;
				$("#dt_a").attr("data-toggle","modal");
				$("#dt_a").attr("data-target","#myModal");
				parentThis.type = "0";
			}else{
					parentThis.flag =0;
			 		parentThis.type ="1";
			 		parentThis.staff_ids  = parentThis.node_executor_id ;
			 		parentThis.staff_names = parentThis.node_executor ;
			 		parentThis.department_names = parentThis.node_execute_depart;
			 		parentThis.department_codes = parentThis.node_execute_depart_id ;
					$("#disposeDeptName").text(parentThis.node_execute_depart);
					$("#disposePersonName").text(parentThis.node_executor);
			}
	 	}, param, true);
	},
	sunmitDemandInfo : function(){
		
		var parentThis = this;
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();  //获取审批动作
		var flowRuleMin;
		var flowRuleMax;
		var flowRuleNextNodeId;
		if(disposeRadio=="agree"){
				var count;//步骤中其他子节点待办条数
				var task_snum;
				var endPrveNodeId;  //最后节点的上级节点数
				var otherSum;  //查询当前节点是否存在同一级其他节点数s
				var paramNode={								
						"handleTypecom"  : "qryLst",
						"handleType"     : 2018,
						"sqlName"    : "qryParallelSum",
						"workflowId" :  parentThis.workflowId,
						"nodeId"     :  parentThis.now_node_id,
						"task_id"    :  parentThis.totaskId,
						"demandId"   :  parentThis.demandId,
				};	
				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
						if(json.code == "0" ){
							count = json.data[0].sums;
						}
					}, paramNode, false,false);
				//步骤中子节点处理条数
				var paramsd={								
						"handleTypecom"  : "qryLst",
						"handleType"     : 2018,
						"sqlName"    : "qryTaskNum",
						"workflowId" :  parentThis.workflowId,
						"upNodeId"   :  parentThis.up_node_id,
						"task_id"    :  parentThis.totaskId,
						"demandId"   :  parentThis.demandId,
				};	
				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						if(json.code == "0" ){
							task_snum =json.data[0].TASK_SNUM;
						}
					}, paramsd, false,false);
					
					//规则获取并判断下一节点
					var paramRule={								
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"    : "getFlowRuleToNextNodeInfo",
							"workflowId" :  parentThis.workflowId,
							"nodeId"   	 :  parentThis.now_node_id,//当前节点
					};	
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						
							if(json.code == "0" ){
								if(json.data.length>0){
									flowRuleMin =json.data[0].FLOWRULEMIN;
									flowRuleMax =json.data[0].FLOWRULEMAX;
									flowRuleNextNodeId =json.data[0].NEXTNODEID;	
								}
							}
						}, paramRule, false,false);
					
					//拆分步骤中子节点待处理条数
					var cTask_num;
					var paramsds={								
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"    : "qryCTaskNum",
							"workflowId" :  parentThis.workflowId,
							"demandId"   :  parentThis.demandId,
					};	
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
							if(json.code == "0" ){
								cTask_num =json.data.length;
							}
						}, paramsds, false,false);
					//查询流程最后一个节点ID及最后节点的上一节点
					var paramsd={								
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"    : "qryEndNodeIdAndPrveNodeId",
							"workflowId" :  parentThis.workflowId,
					};
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
							if(json.code == "0" ){
								endPrveNodeId =json.data.length;
								//endPrveNodeIdData = json.data;	
							}
						}, paramsd, false,false);
					//查询当前节点是否存在同一级其他节点数
					var paramsd={								
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"    	 : "qryNowNodeIdOtherNodeInfoSum",
							"nodeId"   	 	 :  parentThis.now_node_id,//当前节点
							"demandId"   	 :  parentThis.demandId,
					};
					
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						
						if(json.code == "0" ){
							otherSum =json.data[0].otherSum;	
						}
					}, paramsd, false,false);
					//被授权人信息
					var params={};
					params.handleTypecom="qryLst";
					params.handleType=2018;
					params.sqlName="getWorkflowAuthorStaffInfo";
					params.workflowId=parentThis.workflowId;
					params.next_node_id=parentThis.huiqianNodeId.join(",");
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						if(json.code == "0" ){
							if(json.data.length > 0){
								 parentThis.ear_staff_ids.push(obj.ERA_OPERATOR_ID);
								 parentThis.ear_staff_names.push(obj.ERA_OPERATOR_NAME);
								 parentThis.ear_department_names.push(obj.ERA_OPERATOR_DEPTNAME);
								 parentThis.ear_department_codes.push(obj.ERA_OPERATOR_DEPTID);
							}
						};
					}, params, false,false);
					//规则与模板数据对比，判断下一节点
					var ruleInfo=0;
					var ruleInfoData;
					var params={
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"     	 : "queryFlowRuleNextNodeInfo",
							"nodeId"      	 : parentThis.now_node_id,
							"workflowId"  	 : parentThis.workflowId
					};
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						if(json.code == "0" ){
							
							if(json.data.length > 0){
								ruleInfo =json.data.length;
								ruleInfoData = json.data;
							}else{
								ruleInfo = 0;
							}
						};
					}, params, false,false);
				//规则判断下一节点走哪种方法？
					//规则判断下一节点走哪种方法？
					   if(ruleInfo==1){
						   //ruleInfoData.ATTR_VALUE; //输出入的条件值
						   //ruleInfoData.FLOWRULEMIN;//金额最小值
						  // ruleInfoData.FLOWRULEMAX;//金额最大值
						  // ruleInfoData.NEXTNODEID;//下一节点
						   if(parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
								   parentThis.next_node_id.push(parentThis.endNodeId);
							       parentThis.submitEndInfo(parentThis);
							 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)&&parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
								   parentThis.next_node_id.push(parentThis.endNodeId);
								   arentThis.submitEndInfo(parentThis); 
							 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)){//小于最小审批金额(符合流程结束)
								   parentThis.next_node_id.push(parentThis.endNodeId);
							       parentThis.submitEndInfo(parentThis);
							 }else {
								 parentThis.next_node_id.push(ruleInfoData[0].NEXTNODEID);
								 parentThis.submitPostInfo(parentThis);
							 }
					   }else if(ruleInfo>1){
						   var isOverRule="";
							$.each(ruleInfoData,function(i,obj){
								
								   if(parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
									   parentThis.next_node_id=parentThis.endNodeId;
									   isOverRule = "1";
									   return false;
									   //parentThis.submitEndInfo(parentThis);
								 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)>=parseInt(obj.FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
									   parentThis.next_node_id=parentThis.endNodeId;
									   isOverRule = "1";
									   return false;
									   //parentThis.submitEndInfo(parentThis); 
								 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)){//小于最小审批金额(符合流程结束)
									   parentThis.next_node_id=parentThis.endNodeId;
									   isOverRule = "1";
									   return false;
								       //parentThis.submitEndInfo(parentThis);
								 }else if(parseInt(obj.FLOWRULEMIN)<=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)<parseInt(obj.FLOWRULEMAX)||parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMIN)||parseInt(obj.ATTR_VALUE)>=(obj.FLOWRULEMAX)){
									 parentThis.next_node_id.push(obj.NEXTNODEID);
									 isOverRule = "0";
									 return false;
									 //parentThis.submitPostInfo(parentThis);
								 }
							});
							if(isOverRule=="0"){
								parentThis.submitPostInfo(parentThis);
							}else{
								parentThis.submitEndInfo(parentThis);
							}
					   }else if(ruleInfo==0){
						   parentThis.next_node_id = parentThis.huiqianNodeId;
							//判断下一节点是不是最后的节点
						   if(parentThis.endNodeId!=parentThis.next_node_id){
						    	if(cTask_num!=1){
						    		 parentThis.taskNums = 1;
						    		 parentThis.submitAndUpdateInfo(parentThis); 
						    	}else{
						    		if(otherSum>1){
						    			parentThis.taskNums = 1;//会签所有的处理未完 为1
										parentThis.submitAndUpdateInfo(parentThis);
						    		}else{
						    			parentThis.submitPostInfo(parentThis);
						    		}
						    	}
						   }else{
								//判断下一节点是不是最后的节点
							    if(parentThis.endNodeId!=parentThis.next_node_id){  //不是最后节点
							    	if(cTask_num!=1){
							    		parentThis.taskNums = 1;
							    		parentThis.submitAndUpdateInfo(parentThis); 
							    	}else{
								    	parentThis.submitPostInfo(parentThis);
							    	}
							    }else{
							    	if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum==0){
								    	parentThis.next_node_id = parentThis.endNodeId;
								    	parentThis.submitOrEndInfo(parentThis);	
								    }else if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum>1){
						    			parentThis.taskNums = 1;//会签所有的处理未完 为1
										parentThis.submitAndUpdateInfo(parentThis);
						    		}else {
									    	parentThis.next_node_id = parentThis.endNodeId;
									    	parentThis.submitEndInfo(parentThis);	
								   }
							    }
						   }
					   }
		}else if(disposeRadio=="toStart"){
      		//处理不通过
      		var nextParam = {
					"handleTypecom"  : "qryLst",
					"handleType"     : 2018,
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
       			
      			if(json.code == "0" ){
      		 		$.each(json.data,function(i,obj){
      		 			  parentThis.falg="0";
	                	  parentThis.staff_ids=obj.OPERATOR_ID;
	                	  parentThis.staff_names=obj.OPERATOR_NAME;
	                	  parentThis.department_codes=obj.OPERATOR_DEPT_ID;
	                	  parentThis.department_names=obj.OPERATOR_DEPT;
	                	  parentThis.next_node_id=obj.NODE_ID;
      		 		});
      			}
      		}, nextParam, false,false);
			 parentThis.submitPostInfo(parentThis);
		}else if(disposeRadio=="toPrev"){
      		//处理不通过
      		var nextParam = {
					"handleTypecom"  : "qryLst",
					"handleType"     : 2018,
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
       			
      			if(json.code == "0" ){
      		 		$.each(json.data,function(i,obj){
      		 			  parentThis.falg="0";
	                	  parentThis.staff_ids=obj.OPERATOR_ID;
	                	  parentThis.staff_names=obj.OPERATOR_NAME;
	                	  parentThis.department_codes=obj.OPERATOR_DEPT_ID;
	                	  parentThis.department_names=obj.OPERATOR_DEPT;
	                	  parentThis.next_node_id=obj.NODE_ID;
      		 		});
      			}
      		}, nextParam, false,false);
          
			parentThis.submitAndDeleteInfo(parentThis);
		}else if(parentThis.workflow_st==1&&disposeRadio=="sign"){//会签
			
			parentThis.submitSignInfo(parentThis);
	    }

	},
	submitPostInfo :function(parentThis){
		  
		  common.loadding("open");
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var showDialogDivsObj = "".findById("div", "showDialogsDiv",parentThis.parentBody)[0];
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择审批结果！",null,null,{style:{height:"50px"}});
				return false;
			}
			if(parentThis.workflow_st==2){
				var  staff;
				if(disposeRadio!="agree"){
					staff= parentThis.staff_ids.split(",");
				}else{
					staff= parentThis.staff_ids;
				}
			}
			var  workflowId =parentThis.workflowId;
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			var  ear_operator_Id;   //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
				}else{
					ear_operator_Id     = parentThis.ear_staff_ids;
					ear_operator_Name   = parentThis.ear_staff_names;
					ear_operator_dept_Id    = parentThis.ear_department_codes;
					ear_operator_dept_Name  = parentThis.ear_department_names;
			}
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			
			if(disposeRadio=="agree"){
				chulirenid2    = parentThis.staff_ids.join(",");
				chulirenname2   = parentThis.staff_names.join(",");
				chulideptid2    = parentThis.department_codes.join(",");
				chulideptname2  = parentThis.department_names.join(",");
				node2 = parentThis.next_node_id.join(",");
			}else{
				chulirenid2     = parentThis.staff_ids;
				chulirenname2   = parentThis.staff_names;
				chulideptid2    = parentThis.department_codes;
				chulideptname2  = parentThis.department_names;
				node2 = parentThis.next_node_id;
			}
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				
				common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择处理人！",null,null,{style:{height:"50px"}});
				return false;
			}
			var  questtype  = parentThis.workflow_type;
			
			var  countersign;//会签
			if(disposeRadio=="agree"){
				if(parentThis.nodecount>1){
					countersign = "0";//0代表会签流程
				}else{
					countersign = "1";//1代表普通流程
				}
			}else{
				countersign = "1";//1代表普通流程
			}

		 var param = {
				 "workflowId"           					:  workflowId,//流程ID
				 "demandId"             					:  parentThis.demandId, //需求ID
				 "demandName"           					:  parentThis.demandName, //需求名称
				 "demandCode"           					:  parentThis.demandCode, //需求编码
				 "chulirenid2"          					:  chulirenid2,//下一步处理人ID
				 "chulirenname2"        					:  chulirenname2,//下一步处理人名称
				 "chulideptid2"         					:  chulideptid2,//下一步处理部门ID
				 "chulideptname2"       					:  chulideptname2,//下一步处理部门名称
				 "questtype"            					:  questtype,//任务类型		 
				 "node2"                					:  node2,//下一节点ID 
				 "now_node_id"          					:  parentThis.now_node_id,//本节点ID
				 "taskId"               					:  parentThis.taskId,//本节点任务ID
				 "isEndTime"            					:  parentThis.isEndTime,//是否超时
				 "timeLimit"            					:  parentThis.timeLimit,//处理时限
				 "disposeRadio"         					:  disposeRadio,//审批结果
				 "disposeDesc"          					:  disposeDesc,//审批意见
				 "urgeCount"            					:  parentThis.urgeCount,//催单次数
				 "urgeTime"             					:  parentThis.urgeTime,//催单时间
				 "countersign"          					:  countersign,//流程类型
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
				 "handleType"     							: 2019,
		 };
		 $.jump.ajax(URL_SHORT_PROCESS, function(json) {//URL_SHORT_PROCESS
			 common.loadding("close");
								if(json.code == "0" ){						
									$("#dialogMsg").css("margin-left","0px");
									common.loadMsgDialog(showDialogDivsObj, "消息提示","审批成功！",null,null,{style:{height:"50px"}});
									$("#submitInfo").css("visibility","hidden");
									//这里跳转页面，回到待处理页面
//									var url="showShortProcessDisposeList.html?flowType=ZH";
//									common.go.next(encodeURI(url,'utf-8'));
									}
					}, param, false,false);
	},
	submitAndUpdateInfo :function(parentThis){
		
		common.loadding("open");
		var showDialogDivsObj = "".findById("div", "showDialogsDiv",parentThis.parentBody)[0];
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
		var  disposeDesc   = $("#disposeDesc").val(); 
		if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
			common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择审批结果!",null,null,{style:{height:"50px"}});
			common.loadding("close");
			return false;
		}
		if(parentThis.workflow_st==2){
			var  staff;
			if(disposeRadio!="agree"){
				staff= parentThis.staff_ids.split(",");
			}else{
				staff= parentThis.staff_ids;
			}
			if(staff.length>1){
				common.loadMsgDialog(showDialogDivsObj, "消息提示","内联单只能选择一个处理人!",null,null,{style:{height:"50px"}});
				common.loadding("close");
				return false;
			}
		}
		var  workflowId =parentThis.workflowId;  
		var  chulirenid2;
		var  node2;
		var  chulirenname2;
		var  chulideptid2;
		var  chulideptname2;
		var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
		var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
		var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
	    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
		
		var  ear_operator_Id;   //下一步代（授权）处理人ID
		var  ear_operator_Name;//下一步代（授权）处理人名称
		var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
		var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
		if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
				ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
				ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
				ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
				ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
			}else{
				ear_operator_Id     = parentThis.ear_staff_ids;
				ear_operator_Name   = parentThis.ear_staff_names;
				ear_operator_dept_Id    = parentThis.ear_department_codes;
				ear_operator_dept_Name  = parentThis.ear_department_names;
		}
		if(disposeRadio=="agree"){
			chulirenid2    = parentThis.staff_ids.join(",");
			chulirenname2   = parentThis.staff_names.join(",");
			chulideptid2    = parentThis.department_codes.join(",");
			chulideptname2  = parentThis.department_names.join(",");
			node2 = parentThis.next_node_id.join(",");
		}else{
			chulirenid2     = parentThis.staff_ids;
			chulirenname2   = parentThis.staff_names;
			chulideptid2    = parentThis.department_codes;
			chulideptname2  = parentThis.department_names;
			node2 = parentThis.next_node_id;
		}
		if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
			
			common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择处理人！",null,null,{style:{height:"50px"}});
			return false;
		}
		var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandId, //需求ID
				 "demandName"           :  parentThis.demandName, //需求名称
				 "demandCode"           :  parentThis.demandCode, //需求编码
				 "chulirenid2"          :  chulirenid2,//上一步处理人ID
				 "chulirenname2"        :  chulirenname2,//上一步处理人名称
				 "chulideptid2"         :  chulideptid2,//上一步处理部门ID
				 "chulideptname2"       :  chulideptname2,//上一步处理部门名称
				 "questtype"            :  questtype,//任务类型		 
				 "node2"                :  node2,//下一节点ID 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "taskNums"             :  parentThis.taskNums,//标识
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
				 "handleType"     		:  2020,
		 };
			$.jump.ajax(URL_SHORT_PROCESS, function(json) {//URL_SHORT_PROCESS
				common.loadding("close");
					if(json.code == "0" ){
						
			 			$("#dialogMsg").css("margin-left","0px");
						common.loadMsgDialog(showDialogDivsObj, "消息提示","审批成功！",null,null,{style:{height:"50px"}});
			 			$("#submitInfo").css("visibility","hidden"); 
			 			//这里跳转页面，回到待处理页面
//			 			var url="showShortProcessDisposeList.html?flowType=ZH";
//						common.go.next(encodeURI(url,'utf-8'));
			 		}
				}, param, false,false);
	},
	submitEndInfo :function(parentThis){
		  
		  common.loadding("open");
		  var showDialogDivsObj = "".findById("div", "showDialogsDiv",parentThis.parentBody)[0];
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择审批结果!",null,null,{style:{height:"50px"}});
				common.loadding("close");
				return false;
			}
			
			var  workflowId =parentThis.workflowId;  
			var  ear_operator_Id;   //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
				}else{
					ear_operator_Id     = parentThis.ear_staff_ids;
					ear_operator_Name   = parentThis.ear_staff_names;
					ear_operator_dept_Id    = parentThis.ear_department_codes;
					ear_operator_dept_Name  = parentThis.ear_department_names;
			}
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			  
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandId, //需求ID
				 "demandName"           :  parentThis.demandName, //需求主题
				 "demandCode"           :  parentThis.demandCode,
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "handleType"     		:  2021,
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
				 "flag"                 :  "0"
		 };
		 $.jump.ajax(URL_SHORT_PROCESS, function(json) {//URL_SHORT_PROCESS
			 common.loadding("close");
			 if(json.code == "0" ){
		 			$("#dialogMsg").css("margin-left","0px");
					common.loadMsgDialog(showDialogDivsObj, "消息提示","审批成功！",null,null,{style:{height:"50px"}});
		 			$("#submitInfo").css("visibility","hidden"); 
		 			//这里跳转页面，回到待处理页面
//		 			var url="showShortProcessDisposeList.html?flowType=ZH";
//					common.go.next(encodeURI(url,'utf-8'));
		 		}
		}, param, false,false);
	},
	submitAndDeleteInfo :function(parentThis){
		  
		  common.loadding("open");
		  var showDialogDivsObj = "".findById("div", "showDialogsDiv",parentThis.parentBody)[0];
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择审批结果!",null,null,{style:{height:"50px"}});
				common.loadding("close");
				return false;
			}
			if(parentThis.workflow_st==2){
				var  staff;
				if(disposeRadio!="agree"){
					staff= parentThis.staff_ids.split(",");
				}else{
					staff= parentThis.staff_ids;
				}
			}
			var  workflowId =parentThis.workflowId;   
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			var  ear_operator_Id;   //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
				}else{
					ear_operator_Id     = parentThis.ear_staff_ids;
					ear_operator_Name   = parentThis.ear_staff_names;
					ear_operator_dept_Id    = parentThis.ear_department_codes;
					ear_operator_dept_Name  = parentThis.ear_department_names;
			}
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			
			if(disposeRadio=="agree"){
				chulirenid2    = parentThis.staff_ids.join(",");
				chulirenname2   = parentThis.staff_names.join(",");
				chulideptid2    = parentThis.department_codes.join(",");
				chulideptname2  = parentThis.department_names.join(",");
				node2 = parentThis.next_node_id.join(",");
			}else{
				chulirenid2     = parentThis.staff_ids;
				chulirenname2   = parentThis.staff_names;
				chulideptid2    = parentThis.department_codes;
				chulideptname2  = parentThis.department_names;
				node2 = parentThis.next_node_id;
			}
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				
				common.loadMsgDialog(showDialogDivsObj, "消息提示","请选择处理人！",null,null,{style:{height:"50px"}});
				return false;
			}
			var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandId, //需求ID
				 "demandName"           :  parentThis.demandName, //需求主题
				 "demandCode"           :  parentThis.demandCode,
				 "chulirenid2"          :  chulirenid2,//上一步处理人ID
				 "chulirenname2"        :  chulirenname2,//上一步处理人名称
				 "chulideptid2"         :  chulideptid2,//上一步处理部门ID
				 "chulideptname2"       :  chulideptname2,//上一步处理部门名称
				 "questtype"            :  questtype,//任务类型		 
				 "node2"                :  node2,//上一节点ID 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "handleType"     		:  2022,
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
		 };
		 $.jump.ajax(URL_SHORT_PROCESS, function(json) {//URL_SHORT_PROCESS
			 common.loadding("close");
			 if(json.code == "0" ){
		 			$("#dialogMsg").css("margin-left","0px");
					common.loadMsgDialog(showDialogDivsObj, "消息提示","审批成功！",null,null,{style:{height:"50px"}});
		 			$("#submitInfo").css("visibility","hidden"); 
		 			//这里跳转页面，回到待处理页面
//		 			var url="showShortProcessDisposeList.html?flowType=ZH";
//					common.go.next(encodeURI(url,'utf-8'));
		 		}
		}, param, false,false);
	}
};
$(document).ready(function() {
	var disposeShortInfo = new DisposeShortInfo();
	disposeShortInfo.init($(this));
});