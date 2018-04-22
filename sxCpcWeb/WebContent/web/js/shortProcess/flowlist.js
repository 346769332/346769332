var FlowList = new Function();
FlowList.prototype = {
	selecter : "#flowListPage",
	pageSize : 10,
	regionId:"",
	//初始化执行w
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			debugger;
			if (json.code == "0") {
				regionName=json.latnSet[0].REGION_CODE;
				regionId=json.latnSet[0].REGION_ID;
			}
		}, null, false, false);	
		
		var param={
				"handleType" 	: "qryLst",
				"dataSource" 	: "",
				"nameSpace"  	: "shortProcess",
				"sqlName"    	: "queryWorkflwoType",
		};
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json){
			if(json.code=='0'){
				var html=[];
				if(json.data.length>0){
					html.push('<option value="">全部</option>');
					$.each(json.data,function(i,obj){
				html.push('<option value="'+obj.ACT_WORKFLOW_TYPE_ID+'">'+obj.ACT_WORKFLOW_TYPE_NAME+'</option>');
				});
					$("#flowTime").html(html.join(''));
				}
			}else{
				layer.alert(json.msg,8);
			}
		}, param, false, false);
		
		
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		searchObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0);
		});
		parentThis.loadDemandList(parentThis,0);
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#workflowNbr").val("");//流程编号
			$("#workflowName").val("");//流程名称
			$("#flowTime").val("");//流程状态
			
		});		
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex) {
		var workflowNbr = parentThis.selecter.findById("input","workflowNbr")[0];//流程编号
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];//流程名称
		var workflowStateObj = parentThis.selecter.findById("select","flowTime")[0];//流程类型
		var workflow_type=workflowStateObj.find("option:selected").attr("value");
//		if(regionId=='888'){
//			regionId="";
//		}
		var param = {
			"workflowNbr"	:	workflowNbr.val(),
			"workflowName"	:	workflowName.val(),
			"workflow_type" :   workflow_type,
			"latnId"        :   regionId,
			"workflowState" :   '1000',
			"handleType"    :   "qry",
			"dataSource"    :   "",
			"nameSpace"     :    "shortProcess",
			"sqlName"       :   "qryWorkFlowListPage_fun",
			
		};
		var workflowListFootObj = parentThis.selecter.findById("div","flowListFoot")[0];
		common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
				 pageIndex,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 workflowListFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					debugger;
					var workflowListBodyObj = parentThis.selecter.findById("tbody","flowListBody")[0];
					workflowListBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,workflowListBodyObj,regionId);
			});
	},

	//创建HTML
	createLstHtml : function(parentThis,data,workflowListBodyObj,regionId){
		var html=[];
		var dataLst = data.data;
		debugger;
		var workflowListFootObj = parentThis.selecter.findById("div","flowListFoot")[0];
		if(dataLst.length > 0 ){
			workflowListFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.WORKFLOW_CODE+'</td>');
//				var workflow_name = obj.WORKFLOW_NAME;
//				var workflow_name_1 = workflow_name.split(".")[0];
//				if(workflow_name.length > 11){
//					workflow_name = workflow_name.substring(0, 10) + "..."
//					+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
//					;
//				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+obj.WORKFLOW_NAME+'</td>');
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
				
				html.push('<td>'+obj.REGION_NAME+'</td>');
				html.push('<td>');
				//详情
				html.push('<a href="#"  class="but" wcreatorId="'+obj.WCREATOR_ID+'"  workflowSingleType="'+obj.WORKFLOW_SINGLE_TYPE+'" templateId="'+obj.TEMPLATE_ID+'" regionId="'+regionId+'"  name="viewDetail" wisUpdate="'+obj.WIS_UPDATE+'" workflowSort="'+obj.WORKFLOW_SORT+'" workflowType="'+obj.WORKFLOW_TYPE+'" workflowLevel="'+obj.WORKFLOW_LEVEL+'" regionName="'+obj.REGION_NAME+'" workflowStatus="'+obj.WORKFLOW_STATUS+'"  workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'">发起需求</a>&nbsp;&nbsp;&nbsp;');
				
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
		//给"详细"绑定事件
		workflowListBodyObj.find("a[name=viewDetail]").unbind("click").bind("click",function(){
			var workflowSingleType=$(this).attr("workflowSingleType");
			if(workflowSingleType!="3"){
				var regionId=$(this).attr("regionId");
				var workflowStatus=$(this).attr("workflowStatus");
				var workflowId=$(this).attr("workflowId");
				var workflowName=$(this).attr("workflowName");
				var regionName=$(this).attr("regionName");
				var workflowLevel=$(this).attr("workflowLevel");
				var workflowSort=$(this).attr("workflowSort");
				var workflowType=$(this).attr("workflowType");
				var wisUpdate=$(this).attr("wisUpdate");
				var templateId=$(this).attr("templateId");
				var wcreatorId=$(this).attr("wcreatorId");
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
							"wisUpdate"			:	wisUpdate,
							"workflowType"		:	workflowType,
							"flag"              :   "",
							"templateId"        :   templateId,
							"workflowSingleType"        :   workflowSingleType,
							"wcreatorId"        :   wcreatorId
					};
					var viewWorkflowDetail=new ViewWorkflowDetail();
					viewWorkflowDetail.init(param);
				});
			}else{
				//workflowSingleType=3 为末梢库存流程
				var workflowId=$(this).attr("workflowId");
				$.jump.loadHtmlForFun("/web/html/shortProcess/distalRepertory.html".encodeUrl(), function(menuHtml){
					$('#content').html(menuHtml);
					param={
							"workflowId"		:	workflowId
					};
					var distalRepertory=new DistalRepertory();
					distalRepertory.init(param);
				});
			}
		});	
		
		
	}
};
