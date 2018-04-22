var StayDisposeShortProcessDemand = new Function();
StayDisposeShortProcessDemand.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
 	node_executor : null,
 	node_execute_depart : null,
 	node_executor_id : null,
 	node_execute_depart_id : null,
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
    endNodeId  : null,
	line_Name  : null,
	to_node_Id : null,
	Sign_staffId : [],  //会签人ID
	Sign_staffName : [], //会签人名称
	Sign_staffDeptId : [], //会签人部门ID
	Sign_staffDeptName : [], //会签人部门名称
	// 初始化执行
	init : function(param) {
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		//add by dangzw beign 2016-12-08
		//加载模板属性
		var templateId=parentThis.demandInfo.templateId;
		var attrParam={
				"templateId"	:	templateId
		};
		$.jump.ajax(URL_QUERY_DEMANDTEMPLATE_ATTR.encodeUrl(), function(json) {
			if(json.code == "0" ){
				var dataList=json.data;
				$.each(dataList,function(i,obj){
					if(obj.ATTR_TYPE=='text' && obj.ATTR_NAME=='工单主题'){
						 $("#ccc").after("<td>工单主题</td><td style='width:440px' colspan='3'><input id='demandName' disabled='disabled' type='text' style='width: 95%;'></td>");
					}
					if(obj.ATTR_TYPE=='radio' && obj.ATTR_NAME=='是否统一认证'){
						 $("#bbb").after("<tr ><td>是否统一认证</td><td style='width:440px' colspan='3'><input name='isCertification' disabled='disabled' type='radio' style='width: 3%;height:15px' checked='checked' value='1'>是&nbsp;&nbsp;<input name='isCertification' type='radio' style='width: 3%;height:15px' value='0'>否</td><tr/>");
					}
					if(obj.ATTR_TYPE=='textarea' && obj.ATTR_NAME=='工单内容'){
						 $("#aaa").after("<tr style='width:440px' colspan='3'><td>工单内容</td><td style='width:440px' colspan='3'><textarea id='demandDesc' disabled='disabled' placeholder='请输入文档描述' style='line-height:25px;width: 95%;' maxlength='500'></textarea></td><tr/>");
					}
				});
			};
		}, attrParam, false,false);
		//add by dangzw end 2016-12-08
		// 取消返回
		var backObj=parentThis.selecter.findById("a","backInfo")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var noSolveProcessList=new NoSolveProcessList();
				noSolveProcessList.init();
				});

		});
		//流程单类型
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryWorkflowType",
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){
			 			parentThis.workflow_st = obj.WORKFLOW_SINGLE_TYPE;
			 		});
				}
			}, params, false,false);
		//发起人及部门
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "queryDeptPno",
				"demandId"  :  parentThis.demandInfo.demandId,
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
			 		$("#releasePersonName").val(obj.DEMAND_SUMIT_PNAME);
			 		$("#releaseDeptName").val(obj.DEPARTMENT);
			 		$("#releasePersonNum").val(obj.DEMAND_SUMIT_PNO);
				});
			}
		}, params, false,false);
		//打回根节点/上一步
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryDangQiaTaskId",
				"demandId"  :  parentThis.demandInfo.demandId,
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
					parentThis.totaskId = obj.TASKID;
				});
			}
		}, params, false,false);
		//当前节点ID及任务ID
		var parama={								
				"handleType": "qryLst",
				"dataSource": "",
				"nameSpace" : "shortProcess",
				"sqlName"   : "qryTaskId",
				"demandId"  : parentThis.demandInfo.demandId,
				"workflowId": parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
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
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"qryNodeCount",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			
			 			parentThis.nodecount = obj.NODECOUNT;
			 		});
				}
			}, parama, false,false);
		//下一节点ID
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"getNextNodeList",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.nodeIds +=obj.NEXT_NODE_ID+",";
			 		});
				}
			}, parama, false,false);
		//审批动作
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryCaozuoType",
				"workflowId"  : parentThis.demandInfo.workflowId,
				"nodeId"      : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
					var html ="";
			 		$.each(json.data,function(i,obj){
			 			if(obj.OPERAT_AGREE=="1"){//是否审批通过
			 				html+='<input name="disposeRadio" type="radio" value="agree" style="width: 5%;">通过 ';
			 			}
			 			if(obj.TO_PREV_NODE=="2"){//是否允许打回上一步
			 				html+='<input name="disposeRadio" type="radio" value="toPrev" style="width: 5%;">打回上一节点';
			 			}
			 			 if(obj.TO_BEGIN_NODE=="3"){//是否允许打回开始节点
			 				html+='<input name="disposeRadio" type="radio" value="toStart" style="width: 5%;">打回发起节点 ';
			 			}
			 			 if(obj.IS_SIGNATURE=="1"){//是否允许会签
			 				html+='<input name="disposeRadio" type="radio" value="sign" style="width: 5%;">会签 ';
			 			 }
			 			$("#disposeRadio").html(html);
			 		});
				}
			}, parama, false,false);
		//获取时限
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryGuoShiTime",
				"demandId"    : parentThis.demandInfo.demandId,
				"workflowId"  : parentThis.demandInfo.workflowId,
				"nodeId"      : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
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
		//结束流程
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryEndNode",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
					parentThis.submitInfos = json.data.length;
					if(json.data.length>0){
						parentThis.endNodeId = json.data[0].ENDNODEID;
					}
					
				}
			}, parama, false,false);
		//获取下一节点处理人信息
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "showNextNodeDeptInfo",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
				$.each(json.data,function(i,obj){
					var disposeDeptName;
					var disposePersonName;
					if(obj.NODE_EXECUTOR.length>0){
						if(parentThis.workflow_st==1){
							parentThis.huiqianNodeId.push(obj.NODE_ID);
							parentThis.staff_ids.push(obj.NODE_EXECUTOR_ID);				
							parentThis.staff_names.push(obj.NODE_EXECUTOR);
							parentThis.department_names.push(obj.NODE_EXECUTE_DEPART);
							parentThis.department_codes.push(obj.NODE_EXECUTE_DEPART_ID);
							disposeDeptName = parentThis.department_names.join(",");
							disposePersonName = parentThis.staff_names.join(",");
						}else{
							parentThis.huiqianNodeId=obj.NODE_ID;
							parentThis.staff_ids=obj.NODE_EXECUTOR_ID;				
							parentThis.staff_names=obj.NODE_EXECUTOR;
							parentThis.department_names=obj.NODE_EXECUTE_DEPART;
							parentThis.department_codes=obj.NODE_EXECUTE_DEPART_ID;
							disposeDeptName = parentThis.department_names;
							disposePersonName = parentThis.staff_names;
						}
					}
					$("#disposeDeptName").val(disposeDeptName);
					$("#disposePersonName").val(disposePersonName);
				});
				}
			}, parama, false,false);
		//当前节点线（串行or并行）
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"queryLineName",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.line_Name = obj.LINE_NAME;
			 			parentThis.to_node_Id = obj.TO_NODE_ID;
			 		});
				}
			}, parama, false,false);
		// 发起需求
		var backObj=parentThis.selecter.findById("a","submitInfo")[0];
		backObj.unbind("click").bind("click",function(){
				parentThis.submitInfo(parentThis);
		});
		debugger;
		//文档名称
		var html=[];
		var downParam = {
				"hanleType" 	: 		"qryDownloadPath" ,
				"proId"			:		parentThis.demandInfo.demandId,
		};
		$.jump.ajax(URL_QUERY_GOVER_ENTER.encodeUrl(), function(json) {
			debugger;
			//取出文件的路径
			if(json.code == "0"){
				if(json.list.length>0){
					$.each(json.list,function(i,obj){
						html.push('<div id="divObj'+i+'" class="lable-title fl" style="width:250px;"><a id="txtObj'+i+'" href="javascript:void(0)" name="attachment" attachment_name="'+obj.ATTACHMENT_NAME+'" otherName="'+obj.OTHER_ATTACHMENT_NAME+'" attachment_path="'+obj.ATTACHMENT_PATH+'" style="color: #4782DD; text-decoration: underline;width:400px;">'+obj.ATTACHMENT_NAME+'</a>&nbsp;&nbsp;</div>');
					});
				}else {
					html.push('<div >该需求单没有附件</div>');
				}
				
				$("#attachment").html(html);
			}
		}, downParam, false,false);
		
		//会签点击事件
		 $("input:radio[name=disposeRadio]").click(function(){
				var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();  //获取审批动作
				if(disposeRadio=='sign'&&parentThis.workflow_st==1&&parentThis.staff_names.length==0){
					$("#disposeDesc").attr('disabled','disabled');
					parentThis.signAndStaff(parentThis);
				}
			 });
		parentThis.bindUpAndDown(parentThis);
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
		/** ******************************************加载流程图begin********************************************** */
		var property={
				width:1200,
				height:600,
				toolBtns:["start round","end round","task round","node","chat","state","plug","join","fork","complex mix"],
				haveHead:true,
				headBtns:["new","open","save","undo","redo","reload"],// 如果haveHead=true，则定义HEAD区的按钮
				haveTool:true,
				haveGroup:true,
				useOperStack:true
			};
/*			var remark={
				cursor:"选择指针",
				direct:"结点连线",
				start:"入口结点",
				"end":"结束结点",
				"task":"任务结点",
				node:"自动结点",
				chat:"决策结点",
				state:"状态结点",
				plug:"附加插件",
				fork:"分支结点",
				"join":"联合结点",
				"complex mix":"复合结点",
				group:"组织划分框编辑开关"
			};*/
			//var demo;
			parentThis.demo=$.createGooFlow($("#workflow"),property);
/*			parentThis.demo.setNodeRemarks(remark);
			parentThis.demo.onItemDel=function(id,type){
					return confirm("确定要删除该单元吗?");
				};*/
			var workflowId=parentThis.demandInfo.workflowId;
			var demandId=parentThis.demandInfo.demandId;
			var demandStatus=1000;
			/***********************************************审批中标记节点颜色*******************************************/
			if(demandStatus=="1000"){
				debugger;
				//审批中当前节点
				var currentNodeParam={
						"workflowId"	:	workflowId,	
						"demandId"		:	demandId,
						"task_id"       :   parentThis.taskId,
						"flag"			:	"1"
				};
				var currentId="";
				$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
					if(json.code=="0"){
						var dataObj=json.data;
						currentId=dataObj.NODE_ID;
					}
				},currentNodeParam,null,false,false);
				//审批中走过的节点
				var confrimedNodeParam={
						"workflowId"	:	workflowId,	
						"demandId"		:	demandId,
						"task_id"       :   parentThis.taskId,
						"flag"			:	"0"
				};
				var dataConfirmedObj="";
				$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
					if(json.code=="0"){
						dataConfirmedObj=json.data;
					}
				},confrimedNodeParam,null,false,false);
			}
				param={"workflowId":parentThis.demandInfo.workflowId};
				// 后台获取"节点数据"和"线数据",组装流程格式
			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
			 		debugger;
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
//			 			var dats=''+"{"+'"node_Id" : '+'"'+obj.FROM_NODE_ID+'"'+","+'"line_Name" :'+'"'+obj.LINE_NAME+'"}';
//			 			dataLine+=dats+",";
			 			//add by dangzw end 2016-12-01
			 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+lineName+'"'+"}";
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
			  			parentThis.demo.loadData(workflow);
			  			$("#workflow .GooFlow_item").attr("flag","3");
			  			$("#draw_workflow g").attr("flag","3");
			  			debugger;
			  			parentThis.addColorForCurrentNode(currentId);
			  			parentThis.addColorForEndNode(dataConfirmedObj,parentThis);
			  			$.each(json.data.nodes,function(i,obj){ //悬浮
			  				debugger
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
			  		debugger;
			  		if(parentThis.nodecount>1&&parentThis.workflow_st==2&&parentThis.staff_names.length==0){
						layer.alert("内联单请先选择处理人且只能选择一个处理人！",9);
						parentThis.domeOnItemFocus(parentThis,dataLine);
					}else if(parentThis.submitInfos==0&&parentThis.staff_names.length==0){
						  layer.alert("下一节点还未指定处理人，请选择处理人!",9);	
                		  parentThis.domeOnItemFocus(parentThis,dataLine);
					}
			 	}, param, true);
			 	
/** ******************************************加载流程图end************************************************** */		
	},
	domeOnItemFocus : function(parentThis,dataLine){
		debugger;
  		parentThis.demo.onItemFocus=function(id,model){
 			debugger;
 			var flags;
 			var result =parentThis.nodeIds.split(",");
	 		$.each(dataLine,function(i,obj){
 				    if(obj.TO_NODE_ID==id){
 	 				    
 	 	 	 			for(var i=0;i<result.length;i++){
 	 	 	 			debugger
 	 	 	 				if(result[i]==obj.TO_NODE_ID){
 	 	 	 				 if(result[i]!=id&&result[i]!=""&&obj.LINE_NAME=="3"){
 	 	 	 					flags = 0;
 	 	 	 					 continue;
 	 	 	 					// return false;
 	 	 	 				 }else if(result[i]==id&&result[i]!=""&&obj.LINE_NAME!="3"){
 	 	 	 					flags = 1;
 	 	 	 					parentThis.line_Name=obj.LINE_NAME;
 	 	 	 					 break;
 	 	 	 				 }	 
 	 	 	 			}
 	 				}
 				  }
	 		});
 			if(flags!=1){
 				return false;
 			}
				var pars = {
						"nodeId" : id
				};
				$.jump.ajax(URL_QUERY_NODEINFO.encodeUrl(), function(json) {
					$.each(json.data,function(i,obj){
						debugger;
						/***********************回显数据*********************/
						//流程环节
						$("#nodesNames").text(obj.NODE_NAME);
						var j;
							//流程环节处理要求(处理部门、处理人、处理动作、处理时限)
						for(var i=0;i<parentThis.huiqianNodeId.length;i++){
							if(parentThis.huiqianNodeId[i]==id){
								j = i;
							}
						}
							if(obj.NODE_EXECUTOR_ID==""||obj.NODE_EXECUTOR_ID==null||obj.NODE_EXECUTOR_ID==undefined){
								$("#nodeExecutorId").val(parentThis.staff_ids[j]);
							}else{
								$("#nodeExecutorId").val(obj.NODE_EXECUTOR_ID);
							}
							if(obj.NODE_EXECUTE_DEPART_ID==""||obj.NODE_EXECUTE_DEPART_ID==null||obj.NODE_EXECUTE_DEPART_ID==undefined){
								$("#nodeExecuteDepartId").val(parentThis.department_codes[j]);
							}else{
								$("#nodeExecuteDepartId").val(obj.NODE_EXECUTE_DEPART_ID);
							}
							if(obj.NODE_EXECUTOR==""||obj.NODE_EXECUTOR==null||obj.NODE_EXECUTOR==undefined){
								$("#nodeExecutor").val(parentThis.staff_names[j]);
								$("#nodeExecutorName").val(parentThis.staff_names[j]);
							}else{
								$("#nodeExecutor").val(obj.NODE_EXECUTOR);
								$("#nodeExecutorName").val(obj.NODE_EXECUTOR);
							}
							if(obj.NODE_EXECUTE_DEPART==""||obj.NODE_EXECUTE_DEPART==null||obj.NODE_EXECUTE_DEPART==undefined){
								$("#nodeExecuteDepart").val(parentThis.department_names[j]);
								$("#nodeExecuteDepartName").val(parentThis.department_names[j]);
							}else{
								$("#nodeExecuteDepart").val(obj.NODE_EXECUTE_DEPART);
								$("#nodeExecuteDepartName").val(obj.NODE_EXECUTE_DEPART);
								$("#disposeDeptName").val(obj.NODE_EXECUTE_DEPART);
								$("#disposePersonName").val(obj.NODE_EXECUTOR);
							}
						var agree="";
						var to_prve_node="";
						var to_begin_node="";
						if(obj.OPERAT_AGREE=="1"){
							agree="通过";
						}
						if(obj.TO_PREV_NODE=="2"){
							to_prve_node="打回上一节点";
						}if(obj.TO_BEGIN_NODE=="3"){
							to_begin_node="打回发起节点";
						}
						if(obj.TO_BEGIN_NODE=="4"){
							to_begin_node="会签";
						}
						$("#disposeAction").val(agree+"  "+to_prve_node+"  "+to_begin_node);
						debugger;
						//$("#nodeId").val(id);
						//document.getElementById('nodeId').value=id;
						$("#timeLimit").val(obj.TIME_LIMIT);
						//下环节流转要求
						$("#toNextnodeCondition").text(obj.TO_NEXTNODE_CONDITION);
						//流程环节支撑情况
						if(obj.TO_NEXTNODE_CONDITION==null || obj.TO_NEXTNODE_CONDITION==""){
							$("#stateDetail").val("未处理");
						}else{
							$("#stateDetail").val("已处理:"+obj.TO_NEXTNODE_CONDITION);
						}
						$("#tloverTime").val(obj.TLOVER_TIME);
						
					});
				},pars,true);

				//画页面
				parentThis.viewNodeDetail(parentThis,id);
			};
	},

	// 节点详细
	viewNodeDetail:function(parentThis,id){
		var html = [];
		html.push('<div  id="viewNodeDetailPage" class="tanchu_box"  style="width:600px;">');
		html.push('<h3 id="title">节点详细</h3>');
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td>流程环节处理要求</td> ');              
		html.push('</tr>');
		
		html.push('<tr>');         
		html.push('<td  id="nodesNames" rowspan="6" ></td>');         
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:250px" readonly/></td>');         
		//html.push('<td rowspan="5" id="toNextnodeCondition"></td>');         
		//html.push('<td rowspan="5"><input type="text" name="stateDetail" id="stateDetail" style="width:180px" readonly><br/><br/><br/><input type="text" name="tloverTime" id="tloverTime" style="width:180px" readonly></td>');           
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理人&nbsp;&nbsp;&nbsp;:<input type="text"id="nodeExecutor" style="width:250px" readonly/></td>');         
		html.push('<td style="display:none;"><input type="text"  id="nodeExecuteDepartId" style="display:none;" readonly/>');         
		html.push('<input type="text" id="nodeId" value="'+id+'"  style="display:none;" readonly/>');         
		html.push('<input type="text" id="nodeExecuteDepartName" style="display:none;" readonly/>');         
		html.push('<input type="text"  id="nodeExecutorName" style="display:none;" readonly/>');         
		html.push('<input type="text"  id="nodeExecutorId" style="display:none;" readonly/></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理动作:<input type="text" name="disposeAction" id="disposeAction" style="width:250px" readonly></td>');         
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:250px" readonly></td>');         
		html.push('</tr>');   
		html.push('<tr> '); 
		html.push('<td colspan="4" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a></td>'); 
		html.push('</tr>'); 
		html.push('</table>');         
		html.push('</div>');
		
		var authInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], // 去掉默认边框
		    // shade: [0], //去掉遮罩
		    // closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', // 从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var viewNodeDetailPage=$("#viewNodeDetailPage");
		// 关闭
		viewNodeDetailPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		// 关闭
		viewNodeDetailPage.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			parentThis.falg =0;
			debugger;
			var nodeIds =$("#viewNodeDetailPage").find("input[id='nodeId']").val();
			for(var i=0;i<parentThis.huiqianNodeId.length;i++){
				if(parentThis.huiqianNodeId[i]==nodeIds){
					parentThis.isIndex = i;
				}
			}
			var disposeDeptName;
			var disposePersonName;
			if(parentThis.workflow_st==1){
				if(parentThis.isIndex==-1){
					parentThis.huiqianNodeId=$("#nodeId").val();
					parentThis.staff_ids=$("#nodeExecutorId").val();				
					parentThis.staff_names=$("#nodeExecutorName").val();
					parentThis.department_names=$("#nodeExecuteDepartName").val();
					parentThis.department_codes=$("#nodeExecuteDepartId").val();
					disposeDeptName = parentThis.department_names;
					disposePersonName = parentThis.staff_names;
				}else{
					parentThis.huiqianNodeId[parentThis.isIndex]=$("#nodeId").val();
					parentThis.staff_ids[parentThis.isIndex]=$("#nodeExecutorId").val();				
					parentThis.staff_names[parentThis.isIndex]=$("#nodeExecutorName").val();
					parentThis.department_names[parentThis.isIndex]=$("#nodeExecuteDepartName").val();
					parentThis.department_codes[parentThis.isIndex]=$("#nodeExecuteDepartId").val();
					disposeDeptName = parentThis.department_names;
					disposePersonName = parentThis.staff_names;
				 }
			}else{
				if(parentThis.line_Name==1&&parentThis.nodecount>1){
					parentThis.huiqianNodeId.push($("#nodeId").val());
					parentThis.staff_ids.push($("#nodeExecutorId").val());				
					parentThis.staff_names.push($("#nodeExecutorName").val());
					parentThis.department_names.push($("#nodeExecuteDepartName").val());
					parentThis.department_codes.push($("#nodeExecuteDepartId").val());
					 disposeDeptName = parentThis.department_names.join(",");
					 disposePersonName = parentThis.staff_names.join(",");
				}else{
				parentThis.huiqianNodeId=[];
				parentThis.staff_ids=[];
				parentThis.staff_names=[];
				parentThis.department_names=[];
				parentThis.department_codes=[];
				
				parentThis.huiqianNodeId=$("#nodeId").val();
				parentThis.staff_ids=$("#nodeExecutorId").val();				
				parentThis.staff_names=$("#nodeExecutorName").val();
				parentThis.department_names=$("#nodeExecuteDepartName").val();
				parentThis.department_codes=$("#nodeExecuteDepartId").val();
				disposeDeptName = parentThis.department_names;
				disposePersonName = parentThis.staff_names;
				}
			}
			$("#disposeDeptName").val(disposeDeptName);
			$("#disposePersonName").val(disposePersonName);
			layer.close(authInfoPage);
		});
		//选择节点部门
		var nodeExecuteDepartObj = $("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']");
			nodeExecuteDepartObj.unbind("click").bind("click",function(){

			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择部门</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div style="margin-top: 20px;"><a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
			xthtml.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a></div>');  
			xthtml.push('<div style="width:30%;height:520px; border:1px solid #dedede;margin: 10px;float:left;margin-left: 10px;margin-top: 20px;background-color:#f0f6e4;" class="list-main">');         
			xthtml.push('<div id="processDiv" style="margin-left:5px;" ></div> ');         
			xthtml.push('</div>'); 
			xthtml.push('<div id="executerInfo" style="width:65%;height:520px; border:1px solid #dedede;margin-top: 20px;float:right; class="fr">');         
			xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
			xthtml.push('<thead>');         
			xthtml.push('<tr>'); 
			xthtml.push('<th style="width:10%;">选择</th>');
			xthtml.push('<th style="width:15%;">姓名</th>');
			xthtml.push('<th style="width:10%;">部门</th>');
			
			xthtml.push('</tr>');
			xthtml.push('</thead>');
			xthtml.push('<tbody id="chooseDeptAndExecuterBody"></tbody>');
			xthtml.push('</table>');
			xthtml.push('<div class="page mt10" id="chooseDeptAndExecuterFoot"></div>');
			xthtml.push('</div>');
			xthtml.push('</div>');
			xthtml.push('</div>');

			var selectStaffInfoPage = $.layer({
			    type: 1,
			    title: false,
			    area: ['auto', 'auto'],
			    border: [0], //去掉默认边框
			    //shade: [0], //去掉遮罩
			    //closeBtn: [0, false], //去掉默认关闭按钮
			    shift: 'right', //从右动画弹出
			    page: {
			        html: xthtml.join('')
			    }
			});
			var roleInfoPageDiv=$("#selectXTStaffInfoPage");
			//关闭
			roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(selectStaffInfoPage);
			});
			//选中
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
							$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(trObj.attr("staff_name"));
							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(trObj.attr("DEPARTMENT_NAME"));
							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartName']").val(trObj.attr("DEPARTMENT_NAME"));
							$("#viewNodeDetailPage").find("input[id='nodeExecutorName']").val(trObj.attr("staff_name"));
							$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(trObj.attr("staff_id"));
							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(trObj.attr("DEPARTMENT_CODE"));
						layer.close(selectStaffInfoPage);
					}
				});
			});
			parentThis.queryWorkflow(parentThis);

		});	
	},
	queryWorkflow:function(parentThis){
		var param={								
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
	    		"sqlName":"searchland",			    		
		};
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				regionName=json.latnSet[0].REGION_CODE;
				regionId=json.latnSet[0].REGION_ID;
				var html1=[];									
		//		html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;background:#eaf6ff;color:#0e5895;">部门查询</div>');
				html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
				html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
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
				"nameSpace":"shortProcess",
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
	    		"nameSpace":"shortProcess",
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
			$.each(data.data,function(i,obj){			
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" name="sd" style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
				html.push('</tr>');
			
			});
		}else{
				noticeLstFootObj.hide();
				html.push('<div>');
				html.push('<div  style="width:130px;">无相关数据</div>');
				html.push('<div>');
		}
		noticeLstBodyObj.html(html.join(''));		
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);
			//alert(demandInfo.unifiedAuthentication);
			$("input[type='radio'][name='isCertification'][value='"+demandInfo.unifiedAuthentication+"']").attr("checked",true);
		}
	},
	
	submitInfo : function(parentThis){
		debugger;
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();  //获取审批动作
		if(disposeRadio=="agree"){
				debugger;
				//步骤中其他子节点待办条数
				var count;
				var task_snum;
				var endPrveNodeId;  //最后节点的上级节点数
				var paramNode={								
						"handleType" : "qryLst",
						"dataSource" : "",
						"nameSpace"  : "shortProcess",
						"sqlName"    : "qryParallelSum",
						"workflowId" :  parentThis.demandInfo.workflowId,
						"nodeId"     :  parentThis.now_node_id,
						"task_id"    :  parentThis.totaskId,
						"demandId"   :  parentThis.demandInfo.demandId,
				};	
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					debugger;
						if(json.code == "0" ){
							count = json.data[0].SUMS;
						}
					}, paramNode, false,false);
		    	
					//步骤中子节点处理条数
					var paramsd={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryTaskNum",
							"workflowId" :  parentThis.demandInfo.workflowId,
							"upNodeId"   :  parentThis.up_node_id,
							"task_id"    :  parentThis.totaskId,
							"demandId"   :  parentThis.demandInfo.demandId,
					};	
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								task_snum =json.data[0].TASK_SNUM;
							}
						}, paramsd, false,false);
					debugger;
					//拆分步骤中子节点待处理条数
					var cTask_num;
					var paramsds={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryCTaskNum",
							"workflowId" :  parentThis.demandInfo.workflowId,
							//"upNodeId"   :  parentThis.up_node_id,
							//"task_id"    :  parentThis.totaskId,
							"demandId"   :  parentThis.demandInfo.demandId,
					};	
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								cTask_num =json.data.length;
							}
						}, paramsds, false,false);
					//查询流程最后一个节点ID及最后节点的上一节点
					var paramsd={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryEndNodeIdAndPrveNodeId",
							"workflowId" :  parentThis.demandInfo.workflowId,
					};
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								endPrveNodeId =json.data.length;
								//endPrveNodeIdData = json.data;	
							}
						}, paramsd, false,false);
				//判断是否为串行or并行
				if(parentThis.line_Name==2){//并行
					  parentThis.next_node_id = parentThis.huiqianNodeId;
					//判断下一节点是不是最后的节点
				    if(parentThis.endNodeId!=parentThis.to_node_Id){  //不是最后节点
				    	 parentThis.submitPostInfo(parentThis);
				    }else{
				    	if(task_snum==0&&count>0&&endPrveNodeId>1){
						    	parentThis.next_node_id = parentThis.endNodeId;
						    	parentThis.submitOrEndInfo(parentThis);	
				    	}else{
					    	parentThis.next_node_id = parentThis.endNodeId;
					    	parentThis.submitEndInfo(parentThis);	
				    	}
				    }
				}else if(parentThis.line_Name==1){//串行
					  parentThis.next_node_id = parentThis.huiqianNodeId;
						//判断下一节点是不是最后的节点
					    if(parentThis.endNodeId!=parentThis.to_node_Id){  //不是最后节点
					    	if(cTask_num!=1){
					    		parentThis.taskNums = 1;
					    		parentThis.submitAndUpdateInfo(parentThis); 
					    	}else{
						    	parentThis.submitPostInfo(parentThis);
					    	}
					    }else{
					    	if(count>0){
								debugger;
								if(task_snum==count){
									parentThis.taskNums = 0; //会签的处理完 为0
								}else{
									parentThis.taskNums = 1;//会签所有的处理未完 为1
								}
								 parentThis.submitAndUpdateInfo(parentThis); 
					    	}else{
						    	parentThis.next_node_id = parentThis.endNodeId;
						    	parentThis.submitEndInfo(parentThis);	
					    	}
					    }
				}
		}else if(disposeRadio=="toStart"){
      		//处理不通过
      		var nextParam = {
      				"handleType"   :  "qryLst",
      				"dataSource"   :  "",
      				"nameSpace"    :  "shortProcess",
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.demandInfo.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandInfo.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
       			debugger;
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
      				"handleType"   :  "qryLst",
      				"dataSource"   :  "",
      				"nameSpace"    :  "shortProcess",
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.demandInfo.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandInfo.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
       			debugger;
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
			debugger;
			parentThis.submitSignInfo(parentThis);
	    }

	},
	submitPostInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			var  workflowId =parentThis.demandInfo.workflowId;
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			debugger;
			if(disposeRadio=="agree"){
				if(parentThis.line_Name==1&&parentThis.nodecount>1){
					 chulirenid2    = parentThis.staff_ids.join(",");
					 chulirenname2   = parentThis.staff_names.join(",");
					 chulideptid2    = parentThis.department_codes.join(",");
					 chulideptname2  = parentThis.department_names.join(",");
					 node2 = parentThis.next_node_id.join(",");
				}else if(parentThis.nodecount==1){
					 chulirenid2    = parentThis.staff_ids;
					 chulirenname2   = parentThis.staff_names;
					 chulideptid2    = parentThis.department_codes;
					 chulideptname2  = parentThis.department_names;
					 node2 = parentThis.next_node_id;
				}
			}else{
				 chulirenid2    = parentThis.staff_ids;
				 chulirenname2   = parentThis.staff_names;
				 chulideptid2    = parentThis.department_codes;
				 chulideptname2  = parentThis.department_names;
				 node2 = parentThis.next_node_id;
			}
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				layer.alert("请选择处理人!");
				return false;
			}
			var  questtype  = parentThis.workflow_type;
			debugger;
			var  countersign;//会签
			if(parentThis.nodecount>1&&chulirenid2.length>1&&parentThis.line_Name==1){
				countersign = "0";//0代表会签流程
			}else{
				countersign = "1";//1代表普通流程
			}
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "chulirenid2"          :  chulirenid2,//下一步处理人ID
				 "chulirenname2"        :  chulirenname2,//下一步处理人名称
				 "chulideptid2"         :  chulideptid2,//下一步处理部门ID
				 "chulideptname2"       :  chulideptname2,//下一步处理部门名称
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
				 "countersign"          :  countersign,//流程类型
		 };
		 
		 $.jump.ajax(URL_ADD_WORKFLOWNEEDD.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
		}, param, false,false);
		 //add by dangzw begin 2016-12-09
		 var mobileInfoParam = {
				 "workflowName"        :  parentThis.demandInfo.workflowName,
				 "demandId"            :  parentThis.demandInfo.demandId,
				 "demandName"          :  parentThis.demandInfo.demandName,
				 "operator_Id"         :  chulirenid2,
				 "operator_Name"       :  chulirenname2
		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
		 
		 //add by dangzw begin 2016-12-09
		 //工单处理完成到待评价时，需要给发起人进行短信提醒。
		 debugger;
		 var wcreatorId=parentThis.demandInfo.wcreatorId;
		 var demandFinishPara={
				"wcreatorId"	:	wcreatorId,
				"demandId"      :  	parentThis.demandInfo.demandId,
		 };
		 $.jump.ajax(URL_DEMAND_FINISH.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, demandFinishPara, false,false);
		 //add by dangzw end 2016-12-09
	},
	submitAndUpdateInfo :function(parentThis){
		debugger;
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
		var  disposeDesc   = $("#disposeDesc").val(); 
		if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
			layer.alert("请选择审批结果!");
			return false;
		}
		var  workflowId =parentThis.demandInfo.workflowId;  
		var  chulirenid2;
		var  node2;
		var  chulirenname2;
		var  chulideptid2;
		var  chulideptname2;
		debugger;
		if(disposeRadio=="agree"&&parentThis.workflow_st==1){
			 chulirenid2    = parentThis.staff_ids.join(",");
			 chulirenname2   = parentThis.staff_names.join(",");
			 chulideptid2    = parentThis.department_codes.join(",");
			 chulideptname2  = parentThis.department_names.join(",");
			 node2 = parentThis.next_node_id.join(",");
		}else{
			chulirenid2    = parentThis.staff_ids;
			 chulirenname2   = parentThis.staff_names;
			 chulideptid2    = parentThis.department_codes;
			 chulideptname2  = parentThis.department_names;
			 node2 = parentThis.next_node_id;
		} 
		if(parentThis.taskNums!=1){
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				layer.alert("请选择处理人!");
				return false;
			}
		}
		var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
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
		 };
		$.jump.ajax(URL_ADD_WORKFLOWNEEDDD.encodeUrl(), function(json) {
				if(json.code == "0" ){
					layer.alert("审批成功",1);
					$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
						$("#content").html(pageHtml);
						var noSolveProcessList=new NoSolveProcessList();
						noSolveProcessList.init();
						});
					}else{
				layer.alert("审批失败!");	
				}
			}, param, false,false);/* */
		 //add by dangzw begin 2016-12-09
		if(chulirenid2!=""||chulirenid2!=null||chulirenid2!=undefined){
		 var mobileInfoParam = {
				 "workflowName"        :  parentThis.demandInfo.workflowName,
				 "demandId"            :  parentThis.demandInfo.demandId,
				 "demandName"          :  parentThis.demandInfo.demandName,
				 "operator_Id"         :  chulirenid2,
				 "operator_Name"       :  chulirenname2
		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
		 
		 //add by dangzw begin 2016-12-09
		 //工单处理完成到待评价时，需要给发起人进行短信提醒。
		 var wcreatorId=parentThis.demandInfo.wcreatorId;
		 var demandFinishPara={
				"wcreatorId"	:	wcreatorId,
				"demandId"      :  	parentThis.demandInfo.demandId,
		 };
		 $.jump.ajax(URL_DEMAND_FINISH.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, demandFinishPara, false,false);
		 //add by dangzw end 2016-12-09	
		}
	},
	submitEndInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			
			var  workflowId =parentThis.demandInfo.workflowId;  
			  debugger;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "flag"                 :  "0"
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWNEEDDDD.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
					}, param, false,false);
		 
		 //add by dangzw begin 2016-12-09
		 //工单处理完成到待 
		 var demandFinishPara={
				"workflowName"  :  parentThis.demandInfo.workflowName,
				"demandName"    :  parentThis.demandInfo.demandName,
				"wcreatorId"	:	wcreatorId,
				"demandId"      :  	parentThis.demandInfo.demandId,
		 };
		 $.jump.ajax(URL_DEMAND_FINISH.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, demandFinishPara, false,false);
		 //add by dangzw end 2016-12-09
	},
	submitAndDeleteInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			var  workflowId =parentThis.demandInfo.workflowId;  
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			debugger;
			if(disposeRadio=="agree"&&parentThis.workflow_st==1){
				 chulirenid2    = parentThis.staff_ids.join(",");
				 chulirenname2   = parentThis.staff_names.join(",");
				 chulideptid2    = parentThis.department_codes.join(",");
				 chulideptname2  = parentThis.department_names.join(",");
				 node2 = parentThis.next_node_id.join(",");
			}else{
				chulirenid2    = parentThis.staff_ids;
				 chulirenname2   = parentThis.staff_names;
				 chulideptid2    = parentThis.department_codes;
				 chulideptname2  = parentThis.department_names;
				 node2 = parentThis.next_node_id;
			}
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				layer.alert("请选择处理人!");
				return false;
			}
			var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
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
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWBACK.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
					}, param, false,false);
		 
		 //add by dangzw begin 2016-12-09
		 var mobileInfoParam = {
				 "workflowName"        :  parentThis.demandInfo.workflowName,
				 "demandId"            :  parentThis.demandInfo.demandId,
				 "demandName"          :  parentThis.demandInfo.demandName,
				 "operator_Id"         :  chulirenid2,
				 "operator_Name"       :  chulirenname2
		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
			 if(json.code=="1"){
				 layer.alert(json.errorInfo,8);
			 }
		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
	},
	addColorForCurrentNode:function(currentId){
		$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[class='GooFlow_item'][id="+currentId+"]").css("background-color","red");
	},
	addColorForEndNode:function(dataConfirmedObj,parentThis){
		$.each(dataConfirmedObj,function(i,obj){
			if(obj.NODE_TYPE=="1"&&obj.NODE_ID<parentThis.now_node_id){
				//任务节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			} 
			if(obj.NODE_TYPE=="0"){
				//开始节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			}
		});
	},
	//绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		//删除文件
//		$("#goverUpdatePage").find("a[name=deleteFile]").unbind("click").bind("click",function(){});
		//下载文件
		$("#demandDetailInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
			var param={
					"fileName": $(this).attr("attachment_name"),	
					"downloadName" : $(this).attr("otherName"),
					"filePath":	$(this).attr("attachment_path"),
			};
			window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		});
	},
	submitOrEndInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
	var  workflowId =parentThis.demandInfo.workflowId;  
	 var param = {
			 "workflowId"           :  workflowId,//流程ID
			 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
			 "now_node_id"          :  "",//本节点ID
			 "taskId"               :  parentThis.taskId,//本节点任务ID
			 "isEndTime"            :  parentThis.isEndTime,//是否超时
			 "timeLimit"            :  parentThis.timeLimit,//处理时限
			 "disposeRadio"         :  disposeRadio,//审批结果
			 "disposeDesc"          :  disposeDesc,//审批意见
			 "urgeCount"            :  parentThis.urgeCount,//催单次数
			 "urgeTime"             :  parentThis.urgeTime,//催单时间
			 "flag"                 :  "1",
	 };
	 $.jump.ajax(URL_ADD_WORKFLOWNEEDDDD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								layer.alert("审批成功",1);
								$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
									$("#content").html(pageHtml);
									var noSolveProcessList=new NoSolveProcessList();
									noSolveProcessList.init();
									});
								}else{
							layer.alert("审批失败!");	
							}
				}, param, false,false);
	},
	//绑定会签事件
	signAndStaff : function(parentThis){
		debugger;
		//选择节点部门
			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择会签人员</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div id="staff_sign">');
			xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
			xthtml.push('<thead>');         
			xthtml.push('<tr>'); 
			xthtml.push('<th style="width:15%;">姓名</th>');
			xthtml.push('<th style="width:10%;">部门</th>');
			xthtml.push('</tr>');
			xthtml.push('</thead>');
			xthtml.push('<tbody id="staff_signBody"></tbody>');
			xthtml.push('</table>');
			xthtml.push('</div>');
			xthtml.push('<div style="margin-top: 20px;"><a href="javascript:void(0)"  class="but btn-info " name="infoSubmits">选择</a>');
			xthtml.push('<a href="javascript:void(0)"  class="but ml10" name="infoSubmit">确认</a><a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a></div>');  
			xthtml.push('<div style="width:30%;height:520px; border:1px solid #dedede;margin: 10px;float:left;margin-left: 10px;margin-top: 20px;background-color:#f0f6e4;" class="list-main">');         
			xthtml.push('<div id="processDiv" style="margin-left:5px;" ></div> ');         
			xthtml.push('</div>'); 
			xthtml.push('<div id="executerInfo" style="width:65%;height:520px; border:1px solid #dedede;margin-top: 20px;float:right; class="fr">');         
			xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
			xthtml.push('<thead>');         
			xthtml.push('<tr>'); 
			xthtml.push('<th style="width:10%;">选择</th>');
			xthtml.push('<th style="width:15%;">姓名</th>');
			xthtml.push('<th style="width:10%;">部门</th>');
			
			xthtml.push('</tr>');
			xthtml.push('</thead>');
			xthtml.push('<tbody id="chooseDeptAndExecuterBody"></tbody>');
			xthtml.push('</table>');
			xthtml.push('<div class="page mt10" id="chooseDeptAndExecuterFoot"></div>');
			xthtml.push('</div>');
			xthtml.push('</div>');
			xthtml.push('</div>');

			var selectStaffInfoPage = $.layer({
			    type: 1,
			    title: false,
			    area: ['auto', 'auto'],
			    border: [0], //去掉默认边框
			    //shade: [0], //去掉遮罩
			    //closeBtn: [0, false], //去掉默认关闭按钮
			    shift: 'right', //从右动画弹出
			    page: {
			        html: xthtml.join('')
			    }
			});
			var roleInfoPageDiv=$("#selectXTStaffInfoPage");
			//关闭
			roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(selectStaffInfoPage);
			});
			var Sign_staffId=[];
			var Sign_staffName=[];
			var Sign_staffDeptId=[];
			var Sign_staffDeptName=[];
			//选择人员
			roleInfoPageDiv.find("a[name=infoSubmits]").unbind("click").bind("click",function(){
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					var html="";	
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");								
						html+='<tr name="staffInfo">';
						html+='<td>'+trObj.attr("staff_name")+'</td>';		
						html+='<td>'+trObj.attr("DEPARTMENT_NAME")+'</td>';
						html+='</tr>';
						Sign_staffId.push(trObj.attr("staff_id"));
						Sign_staffName.push(trObj.attr("staff_name"));
						Sign_staffDeptId.push(trObj.attr("DEPARTMENT_CODE"));
						Sign_staffDeptName.push(trObj.attr("DEPARTMENT_NAME"));
						$("#staff_signBody").append(html);
//							$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(trObj.attr("staff_name"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(trObj.attr("DEPARTMENT_NAME"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartName']").val(trObj.attr("DEPARTMENT_NAME"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecutorName']").val(trObj.attr("staff_name"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(trObj.attr("staff_id"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(trObj.attr("DEPARTMENT_CODE"));
						//layer.close(selectStaffInfoPage);
					}
				});
			});
			//确定
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				 parentThis.Sign_staffId=Sign_staffId;
				 parentThis.Sign_staffName=Sign_staffName;
				 parentThis.Sign_staffDeptId=Sign_staffDeptId;
				 parentThis.Sign_staffDeptName=Sign_staffDeptName;
				layer.close(selectStaffInfoPage);
			});
			parentThis.queryWorkflows(parentThis);
	},
	queryWorkflows : function(parentThis){
		debugger;
		var param={								
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
	    		"sqlName":"searchland",			    		
		};
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				regionName=json.latnSet[0].REGION_CODE;
				regionId=json.latnSet[0].REGION_ID;
				var html1=[];									
		//		html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;background:#eaf6ff;color:#0e5895;">部门查询</div>');
				html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
				html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
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
				"nameSpace":"shortProcess",
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
					parentThis.queryPeopleLists(parentThis,ziId);
				});
			});
		});
		});
	},
	//查询专家数据
	queryPeopleLists : function(parentThis,ziId) {	
		param={							
				"handleType":"qry",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
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
				parentThis.createPeolpeHtmls(parentThis,data,noticeLstBodyObj,noticeLstFootObj);
			});	
	},
	//创建按查询展示专业人员
	createPeolpeHtmls : function(parentThis,data,noticeLstBodyObj,noticeLstFootObj){		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			noticeLstFootObj.show();
			$.each(data.data,function(i,obj){			
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" name="sd" style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
				html.push('</tr>');
			
			});
		}else{
				noticeLstFootObj.hide();
				html.push('<div>');
				html.push('<div  style="width:130px;">无相关数据</div>');
				html.push('<div>');
		}
		noticeLstBodyObj.html(html.join(''));		
	},
	submitSignInfo :function(parentThis){
			var  workflowId =parentThis.demandInfo.workflowId;  
			var  chulirenid2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
				 chulirenid2    = parentThis.Sign_staffId.join(",");
				 chulirenname2   = parentThis.Sign_staffName.join(",");
				 chulideptid2    = parentThis.Sign_staffDeptId.join(",");
				 chulideptname2  = parentThis.Sign_staffDeptName.join(",");
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				layer.alert("请选择处理人!");
				return false;
			}
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "chulirenid2"          :  chulirenid2,//会签处理人ID
				 "chulirenname2"        :  chulirenname2,//会签处理人名称
				 "chulideptid2"         :  chulideptid2,//会签处理部门ID
				 "chulideptname2"       :  chulideptname2,//会签处理部门名称	 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWSIGN.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("会签成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("会签失败!");	
								}
					}, param, false,false);
		 },
};