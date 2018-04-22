var SingatureNoSolveProcessList= new Function();
SingatureNoSolveProcessList.prototype = {
	selecter : "#demandListPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		//加载数据
		parentThis.loadDemandList(parentThis,0); 
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		parentThis.dataQryBind(searchObj,parentThis);
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#demandCode").val("");
			$("#demandName").val("");
			$("#workflowName").val("");
		});
	},
	//查询绑定
	dataQryBind : function(searchObj,parentThis){
		searchObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0);
		});
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex) {
		debugger;
		var flag = parentThis.selecter.findById("input","flag")[0];
		var demandCode = parentThis.selecter.findById("input","demandCode")[0];
		var demandName = parentThis.selecter.findById("input","demandName")[0];
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];
		debugger;
		var param = {
			"flag"			:	flag.val()	,
			"demandCode"	:	demandCode.val()	,
			"demandName"	:	demandName.val()	,
			"workflowName"	:	workflowName.val()
		};
		var demandListFootObj = parentThis.selecter.findById("div","demandListFoot")[0];
		common.pageControl.start(URL_QUERY_NOSINGATURE_DEMAND.encodeUrl(),
				 pageIndex,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 demandListFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					var demandListBodyObj = parentThis.selecter.findById("tbody","demandListBody")[0];
					debugger;
					demandListBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,demandListBodyObj);
		});
	},

	//创建HTML
	createLstHtml : function(parentThis,data,demandListBodyObj){
		debugger;
		var html=[];
		var dataLst = data.data;
		var demandListFootObj = parentThis.selecter.findById("div","demandListFoot")[0];
		if(dataLst.length > 0 ){
			demandListFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.DEMAND_CODE+'</td>');
				var demand_name = obj.DEMAND_NAME;
					var demand_name_1 = demand_name.split(".")[0];
					if(demand_name.length > 15){
						demand_name = demand_name.substring(0, 10) + "..."
						+ demand_name_1.substring(demand_name_1.length-2, demand_name_1.length)
						;
					}
				html.push('<td title='+obj.DEMAND_NAME+'>'+demand_name+'</td>');
				if(obj.DEMAND_STATUS=='1000'){
					html.push('<td>审批中</td>');
				}else{
					html.push('<td></td>');
				}
				var workflow_name = obj.WORKFLOW_NAME;
				var workflow_name_1 = workflow_name.split(".")[0];
				if(workflow_name.length > 15){
					workflow_name = workflow_name.substring(0, 10) + "..."
					+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
					;
				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+workflow_name+'</td>');
				html.push('<td>'+obj.OPERATOR_DEPT+'</td>');
				html.push('<td>'+obj.OPERATOR_NAME+'</td>');
				html.push('<td>');	
				html.push('<a href="#"  class="but" name="dispose" taskId="'+obj.TASK_ID+'" singatureUser="'+obj.SINGATURE_USER+'" singatureDepart="'+obj.SINGATURE_DEPART+'" workflowType="'+obj.ACT_WORKFLOW_TYPE_NAME+'" wcreatorId="'+obj.WCREATOR_ID+'"  templateId="'+obj.TEMPLATE_ID+'"  workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'" demandId="'+obj.DEMAND_ID+'"  demandName="'+obj.DEMAND_NAME+'"  staffId="'+data.staffId+'"  demandDesc="'+obj.DEMAND_DESC+'"  >处理</a>');	
				html.push('</td>');
				html.push('</tr>');
			});
		}else{
				demandListFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('</div>');
		}
		demandListBodyObj.html(html.join(''));
		
		//给处理绑定事件
		$("#demandListPage").find("a[name=dispose]").unbind("click").bind("click",function(){
			debugger
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandId=$(this).attr("demandId");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var staffId=$(this).attr("staffId");
			var templateId=$(this).attr("templateId");
			var workflowType=$(this).attr("workflowType");
			//会签发起人
			var singatureUser=$(this).attr("singatureUser");
			//会签发起人部门
			var singatureDepart=$(this).attr("singatureDepart");
			//发起人ID
			var wcreatorId=$(this).attr("wcreatorId");
			//任务id
			var taskId=$(this).attr("taskId");
			var param={
					"workflowId"			:		workflowId,
					"workflowName" 			: 		workflowName,
					"demandId" 		    	: 		demandId,
					"demandName" 			: 		demandName,
					"demandDesc" 			: 		demandDesc,
					"staffId" 		    	: 		staffId,
					"templateId" 			: 		templateId,
					"workflowType" 			: 		workflowType,
					"singatureUser" 		: 		singatureUser,
					"singatureDepart" 		: 		singatureDepart,
					"wcreatorId" 			: 		wcreatorId,
					"taskId" 				: 		taskId
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/singatureDemandSolve.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var singatureDemandSolve = new SingatureDemandSolve();
				singatureDemandSolve.init(param);
			});
		});
	}
};
