var DemandHistoryList = new Function();

DemandHistoryList.prototype = {
	selecter : "#demandHistoryListPage",
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
			$("#demandHistoryListPage").find("select").val("");
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
		var flag = parentThis.selecter.findById("input","flag")[0];
		var demandCode = parentThis.selecter.findById("input","demandCode")[0];
		var demandName = parentThis.selecter.findById("input","demandName")[0];
		var demandStatus = parentThis.selecter.findById("select","demandStatus")[0];
		var overTime = parentThis.selecter.findById("select","overTime")[0];
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];
		var param = {
				"flag"			:	flag.val()	,
				"demandCode"	:	demandCode.val()	,
				"demandName"	:	demandName.val()	,
				//"demandStatus"	:	demandStatus.val(),	
				"overTime"		:	overTime.val()	,
				"workflowName"	:	workflowName.val()	,
				"flags"	:	""	,
		};
		var demandListHistroyObj = parentThis.selecter.findById("tbody","demandListHistroyBody")[0];
		var demandListHistoryFootObj = parentThis.selecter.findById("div","demandHistroyListFoot")[0];
		common.pageControl.start(URL_QUERY_SHORTPROCESS.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 demandListHistoryFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			demandListHistroyObj.html("");
			parentThis.createLstHtml(parentThis,data,demandListHistroyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,demandListHistroyObj){
		var html=[];
		var dataLst = data.data;
		var demandListHistoryFootObj = parentThis.selecter.findById("div","demandHistroyListFoot")[0];
		if(dataLst.length > 0 ){
			
			demandListHistoryFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr id="ids"'+i+'>');
				html.push('<td>'+obj.DEMAND_CODE+'</td>');
				var demand_name = obj.DEMAND_NAME;
				var demand_name_1 = demand_name.split(".")[0];
				if(demand_name.length > 16){
					demand_name = demand_name.substring(0, 14) + "..."
					+ demand_name_1.substring(demand_name_1.length-2, demand_name_1.length)
					;
				}
			html.push('<td title='+obj.DEMAND_NAME+'>'+demand_name+'</td>');
				
			var workflow_name = obj.WORKFLOW_NAME;
			var workflow_name_1 = workflow_name.split(".")[0];
			if(workflow_name.length > 16){
				workflow_name = workflow_name.substring(0, 14) + "..."
				+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
				;
			}
			html.push('<td  title='+obj.WORKFLOW_NAME+'>'+workflow_name+'</td>');
				if(obj.OVER_TIME=="1"){
					html.push('<td>是</td>');
				}else{
					html.push('<td>否</td>');
				}
			
//				if(obj.DEMAND_STATUS=='1000'){
//					html.push('<td>审批中</td>');
//				}else if (obj.DEMAND_STATUS=='1001'){
//					html.push('<td>审批完结</td>');
//				}else if (obj.DEMAND_STATUS=='1002'){
//					html.push('<td>草稿</td>');
//				}
				//评价积分
				html.push('<td style="align-content: center;">');
			var num=obj.STAR_EVALUATE;
			
				for (var int = 0; int < 5; int++) {		
					if(int<num){
						html.push('<a name="evalstar" index="'+(int+1)+'" class="evalStarYellow" href="javascript:void(0)" style="display: inline-block;vertical-align: middle;line-height: 0px;        float: inherit; " />');
					}else {
						html.push('<a name="evalstar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"style="display: inline-block;vertical-align: middle;line-height: 0px;    float: inherit; " />');
					}
					
				}	
				html.push('</td>');
				html.push('<td>');
				html.push('<a href="#"  class="but" name="detail" workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'"    demandName="'+obj.DEMAND_NAME+'" demandDesc="'+obj.DEMAND_DESC+'" starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'" demand_id="'+obj.DEMAND_ID+'" demand_sumit_pid="'+obj.DEMAND_SUMIT_PID+'" demand_sumit_pname="'+obj.DEMAND_SUMIT_PNAME+'" department="'+obj.DEPARTMENT+'">详细</a>&nbsp;&nbsp;');	
				html.push('</td>');
				html.push('</tr>');
				
			});
		}else{
				demandListHistoryFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		demandListHistroyObj.html(html.join(''));
		
		//给"详细"绑定事件
		$("#demandHistoryListPage").find("a[name=detail]").unbind("click").bind("click",function(){
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var starEvaluate=$(this).attr("starEvaluate");
			var evaluateInfo=$(this).attr("evaluateInfo");
			var demand_id=$(this).attr("demand_id");
			var expect_time=$(this).attr("expect_time");	
			var demand_sumit_pid= $(this).attr("demand_sumit_pid");	
			var demand_sumit_pname=$(this).attr("demand_sumit_pname");	
			var department=$(this).attr("DEPARTMENT");	
			debugger;
			var param={
					"workflowId"		:		workflowId,
					"workflowName" 		: 		workflowName,
					"demandName" 		: 		demandName,
					"demandDesc" 		: 		demandDesc,
					"starEvaluate"  	:		starEvaluate,
					"evaluateInfo" 		: 		evaluateInfo,
					"demand_id" 		: 		demand_id,
					"expect_time" 		: 		expect_time,
					"demand_sumit_pid"    :     demand_sumit_pid,
					"demand_sumit_pname"   :    demand_sumit_pname,
					"department"   :    department,
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/demanHistorydListDetail.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var demanHistorydListDetail=new DemanHistorydListDetail();
				demanHistorydListDetail.init(param);
			});
		});
	},
	
};