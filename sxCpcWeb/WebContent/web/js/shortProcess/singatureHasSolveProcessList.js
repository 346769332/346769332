var SingatureHasSolveProcessList = new Function();

SingatureHasSolveProcessList.prototype = {
	selecter : "#hasSolveProcessPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
	
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		searchObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0);
		});
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#demandCode").val(""); //需求编号
			$("#demandName").val(""); //需求名称
			$("#demandStatus").val(""); //需求状态
			$("#workflowName").val(""); //所属短流程名称
		});
		//加载数据
		parentThis.loadDemandList(parentThis,0); 
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex) {
		
		var demandCode = parentThis.selecter.findById("input","demandCode")[0];
		var demandName = parentThis.selecter.findById("input","demandName")[0];
		var demandStatus = parentThis.selecter.findById("select","demandStatus")[0];
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];
		
		var param = {
				"flag"			:	"1"	,
				"demandCode"	:	demandCode.val()   ,
				"demandName"	:	demandName.val()   ,
				"demandStatus"	:	demandStatus.val()  ,				
				"workflowName"	:	workflowName.val()  
		};
		var listFootObj =$("#hasSolveProcessFoot");
		common.pageControl.start(URL_QUERY_NOSINGATURE_DEMAND.encodeUrl(),
								 '0',
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = $("#hasSolveProcessBody");
			listBodyObj.html("");
			//展示列表
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		var hasSolveProcessFootObj = $("#hasSolveProcessFoot");
		if(dataLst.length > 0 ){
			hasSolveProcessFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.DEMAND_CODE+'</td>');
				
				var demand_name = obj.DEMAND_NAME;
				var demand_name_1 = demand_name.split(".")[0];
				if(demand_name.length > 20){
					demand_name = demand_name.substring(0, 15) + "..."
					+ demand_name_1.substring(demand_name_1.length-2, demand_name_1.length)
					;
				}
			html.push('<td title='+obj.DEMAND_NAME+'>'+demand_name+'</td>');
				if(obj.DEMAND_STATUS=='1000'){
					html.push('<td>审批中</td>');
				}else if (obj.DEMAND_STATUS=='1001'){
					html.push('<td>审批完结</td>');
				}else if (obj.DEMAND_STATUS=='1002'){
					html.push('<td>草稿</td>');
				}
				var workflow_name=obj.WORKFLOW_NAME;
				var workflow_name_1 = workflow_name.split(".")[0];
				if(workflow_name.length > 20){
					workflow_name = workflow_name.substring(0, 15) + "..."
					+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
					;
				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+workflow_name+'</td>');
				html.push('<td>');
				html.push('<a href="#"  class="but" name="detail" workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'"  demandName="'+obj.DEMAND_NAME+'" demandDesc="'+obj.DEMAND_DESC+'" starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'" demand_id="'+obj.DEMAND_ID+'" expect_time="'+obj.EXPECT_TIME+'" demand_sumit_pid="'+obj.DEMAND_SUMIT_PID+'" demand_sumit_pname="'+obj.DEMAND_SUMIT_PNAME+'" department="'+obj.DEPARTMENT+'">查看</a></td>');	
				html.push('</tr>');
			});
		}else{
		    hasSolveProcessFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="5">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
		
		//给"查看"绑定事件
		$("#hasSolveProcessPage").find("a[name=detail]").unbind("click").bind("click",function(){
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var starEvaluate=$(this).attr("starEvaluate");
			var evaluateInfo=$(this).attr("evaluateInfo");
			var demand_id=$(this).attr("demand_id");	
			var expect_time=$(this).attr("expect_time");	
			var department=$(this).attr("department");	
			var param={
					"workflowId"		:		workflowId,
					"workflowName" 		: 		workflowName,
					"demandName" 		: 		demandName,
					"demandDesc" 		: 		demandDesc,
					"starEvaluate"  	:		starEvaluate,
					"evaluateInfo" 		: 		evaluateInfo,
					"demand_id" 		: 		demand_id,
					"expect_time" 		: 		expect_time,
					"demand_sumit_pid"    :       $(this).attr("demand_sumit_pid"),
					"demand_sumit_pname"   :       $(this).attr("demand_sumit_pname"),
					"department"   :      department,
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/solveProcessDetail.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var solveProcessDetail=new SolveProcessDetail();
				//显示短流程需求详细信息
				solveProcessDetail.init(param);
			});
		});
	}
};