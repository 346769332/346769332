var HasSolveProcessList = new Function();

HasSolveProcessList.prototype = {
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
			$("#overTime").val(""); //是否超时
			$("#workflowName").val(""); //所属短流程名称
		});
		//加载数据
		parentThis.loadDemandList(parentThis,0); 
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex) {
		debugger;
		var demandCode = parentThis.selecter.findById("input","demandCode")[0];
		var demandName = parentThis.selecter.findById("input","demandName")[0];
		var demandStatus = parentThis.selecter.findById("select","demandStatus")[0];
		//var overTime = parentThis.selecter.findById("select","overTime")[0];
		//var workflowName = parentThis.selecter.findById("input","workflowName")[0];
		
		var param = {
				"handleType"	:	"qry",
	    		"dataSource"	:	"",
	    		"nameSpace"		:	"shortProcess",
	    		"sqlName"		:   "getSolveProcessList",
				"demandCode"	:	demandCode.val()   ,
				"demandName"	:	demandName.val()   ,
				"demandStatus"	:	demandStatus.val()  				
				//"overTime"		:	overTime.val() 	 ,
				//"workflowName"	:	workflowName.val()  , 	
		};
		var listFootObj =$("#hasSolveProcessFoot");
		common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
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
		var nowstaffId=data.staffId;
		var hasSolveProcessFootObj = $("#hasSolveProcessFoot");
		if(dataLst.length > 0 ){
			hasSolveProcessFootObj.show();
			$.each(data.data,function(i,obj){
				debugger;
				html.push('<tr>');
				html.push('<td>'+obj.DEMAND_CODE+'</td>');
				
//				var demand_name = obj.DEMAND_NAME;
//				var demand_name_1 = demand_name.split(".")[0];
//				if(demand_name.length > 8){
//					demand_name = demand_name.substring(0, 5) + "..."
//					+ demand_name_1.substring(demand_name_1.length-2, demand_name_1.length)
//					;
//				}
			html.push('<td title='+obj.DEMAND_NAME+'>'+obj.DEMAND_NAME+'</td>');
				if(obj.DEMAND_STATUS=='1000'){
					html.push('<td>审批中</td>');
				}else if (obj.DEMAND_STATUS=='1001'){
					html.push('<td>审批完结</td>');
				}else if (obj.DEMAND_STATUS=='1002'){
					html.push('<td>草稿</td>');
				}else if (obj.DEMAND_STATUS=='1003'){
					html.push('<td>已作废</td>');
				}
//				var workflow_name=obj.WORKFLOW_NAME;
//				var workflow_name_1 = workflow_name.split(".")[0];
//				if(workflow_name.length > 8){
//					workflow_name = workflow_name.substring(0,5) + "..."
//					+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
//					;
//				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+obj.WORKFLOW_NAME+'</td>');
				if(obj.DEMAND_STATUS=='1001'&&obj.IS_EVALUATE=='0'){
					html.push('<td>待评价</td>');
				}else if(obj.DEMAND_STATUS=='1001'&&obj.IS_EVALUATE=='1'){
					html.push('<td>已评价</td>');
				}else{
					html.push('<td></td>');
				}
				html.push('<td>');
				html.push('<a href="#"  class="but" name="detail" is_EvalInfo="'+obj.IS_EVALUATE+'" demand_Code="'+obj.DEMAND_CODE+'"  demand_status="'+obj.DEMAND_STATUS+'" workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'"  demandName="'+obj.DEMAND_NAME+'" demandDesc="'+obj.DEMAND_DESC+'" starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'" demand_id="'+obj.DEMAND_ID+'" expect_time="'+obj.EXPECT_TIME+'" demand_sumit_pid="'+obj.DEMAND_SUMIT_PID+'" demand_sumit_pname="'+obj.DEMAND_SUMIT_PNAME+'" department="'+obj.DEPARTMENT+'">查看</a>');	
				if(obj.DEMAND_STATUS=='1001'){
					html.push('<a href="#"  class="but" name="printPdf" is_EvalInfo="'+obj.IS_EVALUATE+'" demand_Code="'+obj.DEMAND_CODE+'"  demand_status="'+obj.DEMAND_STATUS+'" workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'"  demandName="'+obj.DEMAND_NAME+'" demandDesc="'+obj.DEMAND_DESC+'" starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'" demand_id="'+obj.DEMAND_ID+'" expect_time="'+obj.EXPECT_TIME+'" demand_sumit_pid="'+obj.DEMAND_SUMIT_PID+'" demand_sumit_pname="'+obj.DEMAND_SUMIT_PNAME+'" department="'+obj.DEPARTMENT+'" first_type="'+obj.ACT_WORKFLOW_SORT_NAME+'" second_type="'+obj.ACT_WORKFLOW_TYPE_NAME+'" mob_tel="'+obj.MOB_TEL+'">流程打印</a>');
				}
				if(obj.DEMAND_SUMIT_PID==nowstaffId&&obj.DEMAND_STATUS=='1000'){
					html.push('<a href="#"  class="but" name="applyCancle" is_EvalInfo="'+obj.IS_EVALUATE+'" demand_Code="'+obj.DEMAND_CODE+'"  demand_status="'+obj.DEMAND_STATUS+'" workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'"  demandName="'+obj.DEMAND_NAME+'" demandDesc="'+obj.DEMAND_DESC+'" starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'" demand_id="'+obj.DEMAND_ID+'" expect_time="'+obj.EXPECT_TIME+'" demand_sumit_pid="'+obj.DEMAND_SUMIT_PID+'" demand_sumit_pname="'+obj.DEMAND_SUMIT_PNAME+'" department="'+obj.DEPARTMENT+'" first_type="'+obj.ACT_WORKFLOW_SORT_NAME+'" second_type="'+obj.ACT_WORKFLOW_TYPE_NAME+'" mob_tel="'+obj.MOB_TEL+'">申请作废</a>');
				}
				html.push('</td>');
				
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
			var demand_status=$(this).attr("demand_status");	
			var demand_Code=$(this).attr("demand_Code");	
			var is_EvalInfo=$(this).attr("is_EvalInfo");	
			var param={
					"workflowId"			:		workflowId,
					"workflowName" 			: 		workflowName,
					"demandName" 			: 		demandName,
					"demandDesc" 			: 		demandDesc,
					"starEvaluate"  		:		starEvaluate,
					"evaluateInfo" 			: 		evaluateInfo,
					"demand_id" 			: 		demand_id,
					"expect_time" 			: 		expect_time,
					"demand_sumit_pid"      :       $(this).attr("demand_sumit_pid"),
					"demand_sumit_pname"    :       $(this).attr("demand_sumit_pname"),
					"department"  			:      department,
					"demand_status"     	:      demand_status,
					"demand_Code"     		:      demand_Code,
					"is_EvalInfo"     		:      is_EvalInfo,
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/solveProcessDetail.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var solveProcessDetail=new SolveProcessDetail();
				//显示短流程需求详细信息
				solveProcessDetail.init(param);
			});
		});
		//给"流程打印绑定事件"
		$("#hasSolveProcessPage").find("a[name=printPdf]").unbind("click").bind("click",function(){
			debugger;
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var demand_id=$(this).attr("demand_id");	
			var expect_time=$(this).attr("expect_time");	
			var department=$(this).attr("department");	
			var demand_status=$(this).attr("demand_status");	
			var demand_Code=$(this).attr("demand_Code");	
			var firstType=$(this).attr("first_type");//pdf中流程一级类型
			var secondType=$(this).attr("second_type");//二级类型
			var mob_tel=$(this).attr("mob_tel");
			
			var param={
					"workflowId"			:		workflowId,
					"workflowName" 			: 		workflowName,
					"demandName" 			: 		demandName,
					"demandDesc" 			: 		demandDesc,
					"firstType"  		    :		firstType,
					"secondType" 			: 		secondType,
					"demand_id" 			: 		demand_id,
					"expect_time" 			: 		expect_time,
					"department"  			:      department,
					"demand_status"     	:      demand_status,
					"demand_Code"     		:      demand_Code,
					"mob_tel"               :       mob_tel,
					"demand_sumit_pid"      :       $(this).attr("demand_sumit_pid"),
					"demand_sumit_pname"    :       $(this).attr("demand_sumit_pname")
			};
			//
			window.location.href=URL_DOWN_PDF_DEMAND+"?"+encodeURI($.param(param));
			
		});
		
		//申请作废applyCancle,弹出框填写作废原因
		$("#hasSolveProcessPage").find("a[name=applyCancle]").unbind("click").bind("click",function(){
			var html = [];
			html.push('<div  id="reasonPage" class="tanchu_box"  style="width:800px;">');
			html.push('<h3 id="title">作废原因</h3>'); 
			html.push('<div name="resontable">'); 
			html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
			html.push('<tr  style="background: #ebf6ff;">');         
			html.push('<td style="width:20%;">作废原因</td>');         
			html.push('<td style="width:50%"><textarea id="reasonText"  style="line-height:25px;width: 95%;" maxlength="500"></textarea></td> ');                
			html.push('</tr>');		
			html.push('<tr> '); 
			html.push('<td colspan="6" style="text-align:center;">');   
			html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
			 
			html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
			html.push('</td>'); 
			html.push('</tr>'); 
		
			html.push('</table>');      
			html.push('</div>'); 
			var authInfoPage = $.layer({
			    type: 1,
			    title: false,
			    area: ['auto', 'auto'],
			    border: [0], // 去掉默认边框
			     //shade: [0], //去掉遮罩
			    // closeBtn: [0, false], //去掉默认关闭按钮
			     shift: 'left', // 从左动画弹出
			    page: {
			        html: html.join('')
			    }
			});
			var reasonPage=$("#reasonPage");
			//关闭
			reasonPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
				layer.close(authInfoPage);
			});
			
			//这里需要给任务表，任务日志表都要新增一条记录，并且将需求状态改为作废状态，并将该需求未处理的任务都作废
			var workflowId=$(this).attr("workflowId");
			var demand_id=$(this).attr("demand_id");	
			var expect_time=$(this).attr("expect_time");	
			var start_staff_id=$(this).attr("demand_sumit_pid");
			var start_staff_name=$(this).attr("demand_sumit_pname");
			var demand_status=$(this).attr("demand_status");	
			var demand_Code=$(this).attr("demand_Code");	
			var mob_tel=$(this).attr("mob_tel");
			
			//确认
			reasonPage.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				var reasonInfo=$("#reasonText").val();
				
				if(reasonInfo==""||reasonInfo==null||reasonInfo==undefined){
					layer.alert("请填写作废原因!");
					return false;
				}
				debugger;
				var param={
						"workflowId"			:		workflowId,
						"demandId" 			    : 		demand_id,
						"expect_time" 			: 		expect_time,
						"start_staff_id"  		:       start_staff_id,
						"start_staff_name"     	:      start_staff_name,
						"demand_Code"     		:      demand_Code,
						"mob_tel"               :       mob_tel,
						"reason_info"           :       $("#reasonText").val(),
						"flag"                  :       "1"
				};
				$.jump.ajax(URL_ADD_WORKFLOWACANCLE.encodeUrl(), function(json) {
					if(json.code=="0"){
						layer.close(authInfoPage);
						parentThis.loadDemandList(parentThis,0); 
					}
				},param,true);
				
			});
		});
	}
};