var ViewWorkflowDetail = new Function();
ViewWorkflowDetail.prototype = {
	selecter : "#viewWorkflowDetailPage",
	pageSize : 10,
	//初始化执行
	init : function(param) {
		this.paramObj=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		$("#workflow").hide();
		var regionId=parentThis.paramObj.regionId;
		var workflowLevel=parentThis.paramObj.workflowLevel;
		$("#jump").hide();
		var flag=parentThis.paramObj.flag;
		if(flag=="1"){
			$("#startDemand").hide();
		}
		
		if((regionId=="888" && (workflowLevel=="2" || workflowLevel=="3")) || regionId!="888"){
			$("#sonWorkflow").hide();
		}
		//判断是否显示 “发起需求”按钮
		var workflowStatus=parentThis.paramObj.workflowStatus;
		if(workflowStatus=="1010"){
			$("#timeAndLevel").hide();
		}
		if(workflowStatus=="1002" || workflowStatus=="1003"){
			$("#startDemand").hide();
		}
		if(regionId=="888" && workflowLevel=="3"){
			$("#startDemand").hide();
		}

		//查询子流程数量及流程处理所需的平均工时
		var workflowId=parentThis.paramObj.workflowId;
		$.jump.ajax(URL_QUERY_SONWORKFLOW_TIMELIMIT.encodeUrl(), function(json) {
			var param={
					"workflowId"	:	workflowId
			};
			if(json.code=="0"){
				var num=json.num;
				var avgTimeLimt=json.avgTimeLimt;
				$("#sonWorkflowNum").val(num);
				$("#workflowTimeLimit").val(avgTimeLimt);
			}
		},param,null,false,false);
		
		var workflowName=parentThis.paramObj.workflowName;
		var regionName=parentThis.paramObj.regionName;
		var workflowStatus=parentThis.paramObj.workflowStatus;
		var workflowLevel=parentThis.paramObj.workflowLevel;
		var workflowSort=parentThis.paramObj.workflowSort;
		var workflowType=parentThis.paramObj.workflowType;
		var workflowSingleType=parentThis.paramObj.workflowSingleType;
		var wisUpdate=parentThis.paramObj.wisUpdate;
		//加载流程分类数据begin
		var sortParam={
			"flag"	:	1	
		};
		$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
			if(json.code=="0"){
				var workflowClassObj =  parentThis.selecter.findById("select","workflowClass")[0];
				var dataObj=json.data;
				parentThis.createWorkflowSortHtml(parentThis,dataObj,workflowClassObj);
			}
		},sortParam,null,false,false);
		//加载流程分类数据end
		var typeParam={
				"flag"			:	2,	
				"workflowClass"	:	workflowSort	
			};
			$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
				if(json.code=="0"){
					var workflowTypeObj =  parentThis.selecter.findById("select","workflowType")[0];
					var dataObj=json.data;
					parentThis.createWorkflowTypeHtml(parentThis,dataObj,workflowTypeObj);
				}
			},typeParam,null,false,false);
//		$("input[type=radio][name=authorityMaintain]").each(function(){
//			if($(this).val()==wisUpdate){
//				$(this).attr("checked","checked");
//			}
//		});
		if(workflowSingleType=="0"){
			$("#workflowSingleType").val("渠道工号审批流程");
		}else if(workflowSingleType=="1"){
			$("#workflowSingleType").val("会签流程");
		}else if(workflowSingleType=="2"){
			$("#workflowSingleType").val("内联单流程");
		}else{
			$("#workflowSingleType").val("");
		}
		$("#workflowName").val(workflowName);
		$("#workflowClass option").each(function(){
			if($(this).val()==workflowSort){
				$(this).attr("selected","selected");
			}
		});
		$("#workflowType option").each(function(){
			if($(this).val()==workflowType){
				$(this).attr("selected","selected");
			}
		});
		if(workflowStatus=="1000"){
			$("#workflowStatus").val("已发布");
		}else if(workflowStatus=="1001"){
			$("#workflowStatus").val("草稿");
		}else if(workflowStatus=="1002"){
			$("#workflowStatus").val("暂停");
		}else if(workflowStatus=="1003"){
			$("#workflowStatus").val("作废");
		}else{
			$("#workflowStatus").val("父流程");
		}
		if(workflowLevel==1){
			$("#workflowLevel").val("省统一定制(1级)");
		}else if(workflowLevel==2){
			$("#workflowLevel").val("省统一定制(2级)");
		}else{
			$("#workflowLevel").val("市定制");
		}
		//回显本地网
		var html=[];
		html.push("适用本地网&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		html.push("<input type='checkbox' style='width:10%'  checked='checked' disabled='disabled'>"+regionName+"");
		$("#wlan").html(html.join(''));

		parentThis.loadWorkflow(parentThis);
		//返回
		var backObj=parentThis.selecter.findById("a","back")[0];
		backObj.unbind("click").bind("click",function(){
			if(flag=="1"){
				$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(),function(pageHtml){
					$("#content").html(pageHtml);
					var workFlowList=new WorkFlowList();
					workFlowList.init();
				});
			}else {
				$.jump.loadHtmlForFun("/web/html/shortProcess/flowList.html".encodeUrl(),function(pageHtml){
					$("#content").html(pageHtml);
					var flowList=new FlowList();
					flowList.init();
				});
			}
			
		});
		//给"发起需求"绑定事件
		var startDemand=parentThis.selecter.findById("a","startDemand")[0];
		startDemand.unbind("click").bind("click",function(){
			var workflowStatus=parentThis.paramObj.workflowStatus;
			var templateId=parentThis.paramObj.templateId;
			var wcreatorId=parentThis.paramObj.wcreatorId;
//			var wisUpdate=parentThis.paramObj.wisUpdate;
//			if(workflowStatus=="1010"){
//				if(wisUpdate==""){
//					layer.alert("该流程还未发布,不能发起需求!");
//					return false;
//				}
//			}else{
//				if(workflowStatus!="1000"){
//					layer.alert("该流程还未发布,不能发起需求!");
//					return false;
//				}
//			}
			var workflowId=parentThis.paramObj.workflowId;
			var workflowName=parentThis.paramObj.workflowName;
			$.jump.loadHtmlForFun("/web/html/shortProcess/shortProcessDemandInitiate.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				param={
						"workflowId"	:	workflowId,
						"workflowName"	:	workflowName,
						"templateId"	:	templateId,
						"wcreatorId"	:	wcreatorId
				};
				var shortProcessDemandInitiate=new ShortProcessDemandInitiate();
				shortProcessDemandInitiate.init(param);
			});
		});
		
		//显示流程图
		var flowPictureObj=parentThis.selecter.findById("a","flowPicture")[0];
		flowPictureObj.unbind("click").bind("click",function(){
			$("#workflow").show();
		});
		//点击“子流程”时 显示流程列表
		$("#sonWorkflowList").hide();
		var sonWorkflow=parentThis.selecter.findById("a","sonWorkflow")[0];
		sonWorkflow.unbind("click").bind("click",function(){
			var workflowId=parentThis.paramObj.workflowId;
			var paramSon={
					"workflowId"	:	workflowId,
					"flag"			:	"0"
			}
			$.jump.ajax(URL_QUERY_PUBLISH_WORKFLOWDATA.encodeUrl(), function(json) {
				var tbodyObj=parentThis.selecter.findById("tbody","sonWorkflowListBody")[0];
				var dataObj=json.data;
				parentThis.createHtml(parentThis,dataObj,tbodyObj);
			},paramSon,null,false,false);

		});
	},
	createWorkflowSortHtml:function(parentThis,dataObj,workflowClassObj){
		var html = [];
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				if(parentThis.paramObj.workflowSort==obj.ACT_WORKFLOW_SORT_ID){
					html.push("<option value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");	
				}
				
			});
		}
		workflowClassObj.html(html.join(''));
	},
	createWorkflowTypeHtml:function(parentThis,dataObj,workflowTypeObj){
		var html = [];
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push("<option value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
			});
		}
		workflowTypeObj.html(html.join(''));
	},
	
	createHtml:function(parentThis,dataObj,tbodyObj){
		var html=[];
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.WORKFLOW_NAME+'</td>');
				html.push('<td>'+obj.ACT_WORKFLOW_SORT_NAME+'</td>');
				html.push('<td>'+obj.ACT_WORKFLOW_TYPE_NAME+'</td>');
				if(obj.WORKFLOW_LEVEL=="2"){
					html.push('<td>省统一定制('+obj.WORKFLOW_LEVEL+'级)</td>');
				}else{
					html.push('<td></td>');
				}
				html.push('<td>'+obj.WLIMIT_TIME+'</td>');
				html.push('<td>'+obj.REGION_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
				html.push('<div>');
				html.push('<div>无相关的数据</div>');
				html.push('<div>');
		}
		tbodyObj.html(html.join(''));
		$("#sonWorkflowList").show();
		$("#jump").show();
	},
	//加载流程
	loadWorkflow:function(parentThis){
		param={"workflowId":parentThis.paramObj.workflowId}
		// 后台获取"节点数据"和"线数据",组装流程格式
	 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
	 		var nodeNum=json.nodeNum;
	 		var nodeData=json.data.nodes;
	 		var jsonnodes="";
	 		$.each(json.data.nodes,function(i,obj){
	 			var type="";
	 			if(obj.NODE_TYPE=="0"){
	 				// 开始节点
	 				type="start round";
	 			}else if(obj.NODE_TYPE=="1"){
	 				// 自由节点
	 				type="node";
	 			}else{
	 				// 结束节点
	 				type="end round";
	 			}
	 			
  				var operatAgree=obj.OPERAT_AGREE;
  				var toPrevNode=obj.TO_PREV_NODE;
  				var toBeginNode=obj.TO_BEGIN_NODE;
  				var executer=obj.NODE_EXECUTOR;
  				var depart=obj.NODE_EXECUTE_DEPART;
  				var action="";
  				var prev="";
  				var begin="";
  				if(executer==""){
  					executer="无";
  				}
  				if(depart==""){
  					depart="无";
  				}
  				if(operatAgree=="1"){
  					action="通过";
  				}else{
  					action="无";
  				}
  				if(toPrevNode=="2"){
  					prev="打回上一节点";
  				}else{
  					prev="";
  				}
  				if(toBeginNode=="3"){
  					begin="打回发起节点";
  				}
  				debugger;
  				if(prev=="" && begin==""){
  					prev="无";
  				}
  				var wd = obj.NODE_WIDTH+150;
	 			var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
			 	jsonnodes+=nodes+",";
	 		});
	 		jsonnodes="{"+jsonnodes.substring(0,jsonnodes.length-1)+"}";
	 		debugger;
	 		var jsonnodesObj=eval("("+jsonnodes+")");
	 		//console.log(jsonnodesObj);
	 		var lineNum=json.lineNum;
	 		var jsonlines="";
	 		$.each(json.data.lines,function(i,obj){
	 			//add by dangzw begin 2016-12-01
	 			var lineName="";
	 			if(obj.LINE_NAME=="1"){
	 				lineName="串行";
	 			}else if(obj.LINE_NAME=="2"){
	 				lineName="并行";
	 			}else{
	 				lineName="";
	 			}
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
	  			demo.loadData(workflow);
	  			//详细页面的流程图节点的名称不可编辑(在GooFlow.js的844行用到)
	  			$("#workflow .GooFlow_item").attr("flag","1");
	  			$("#draw_workflow g").attr("flag","1");
		 		//给每一个节点加title 
	  			
	  			$.each(json.data.nodes,function(i,obj){
	  				debugger;
	  				var operatAgree=obj.OPERAT_AGREE;
	  				var toPrevNode=obj.TO_PREV_NODE;
	  				var toBeginNode=obj.TO_BEGIN_NODE;
	  				var executer=obj.NODE_EXECUTOR;
	  				var depart=obj.NODE_EXECUTE_DEPART;
	  				var action="";
	  				var prev="";
	  				var begin="";
	  				if(executer==""){
	  					executer="无";
	  				}
	  				if(depart==""){
	  					depart="无";
	  				}
	  				if(operatAgree=="1"){
	  					action="通过";
	  				}else{
	  					action="无";
	  				}
	  				if(toPrevNode=="2"){
	  					prev="打回上一节点";
	  				}else{
	  					prev="";
	  				}
	  				if(toBeginNode=="3"){
	  					begin="打回发起节点";
	  				}
	  				debugger;
	  				if(prev=="" && begin==""){
	  					prev="无";
	  				}
	  				//$("#"+obj.NODE_ID).attr("title","处理人:"+obj.NODE_EXECUTOR+"\n处理部门:"+obj.NODE_EXECUTE_DEPART+"\n处理通过动作:"+action+"\n处理时限:"+obj.TIME_LIMIT+"");
	  				if(obj.NODE_TYPE!="0" && obj.NODE_TYPE!="2"){
	  					$("#"+obj.NODE_ID).attr("title","处理人:"+executer+"\n处理部门:"+depart+"\n联系电话:"+obj.NODE_EXECUTORTEL+"\n处理通过动作:"+action+"\n处理不通过动作:"+prev+" "+begin+"\n处理时限:"+obj.TIME_LIMIT+"");
	  				}
	  			});
	  		}else{
	  			layer.alert("加载失败");
	  		};
	 	}, param, true);
	}
};
