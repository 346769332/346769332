var NoSolveProcessList = new Function();
NoSolveProcessList.prototype = {
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
			$("#demandListPage").find("select").val("");
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
		var demandStatus =1000;
		var overTime = parentThis.selecter.findById("select","overTime")[0];
		var workflowName = parentThis.selecter.findById("input","workflowName")[0];
		debugger;
		var param = {
			"flag"			:	flag.val()	,
			"demandCode"	:	demandCode.val()	,
			"demandName"	:	demandName.val()	,
			"demandStatus"	:	demandStatus,	
			"overTime"		:	overTime.val()	,
			"workflowName"	:	workflowName.val(),
			"flags"         :   "chuli"
		};
		var demandListFootObj = parentThis.selecter.findById("div","demandListFoot")[0];
		common.pageControl.start(URL_QUERY_SHORTPROCESS.encodeUrl(),
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
				}else if (obj.DEMAND_STATUS=='1001'){
					html.push('<td>审批完结</td>');
				}else if (obj.DEMAND_STATUS=='1002'){
					html.push('<td>草稿</td>');
				}
				var workflow_name = obj.WORKFLOW_NAME;
				var workflow_name_1 = workflow_name.split(".")[0];
				if(workflow_name.length > 15){
					workflow_name = workflow_name.substring(0, 10) + "..."
					+ workflow_name_1.substring(workflow_name_1.length-2, workflow_name_1.length)
					;
				}
				html.push('<td  title='+obj.WORKFLOW_NAME+'>'+workflow_name+'</td>');
				if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""&&obj.AUTHOR_STATUS!=0){
 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
 						html.push('<td >'+obj.ERA_OPERATOR_NAME+'</td>');
				}else{
						html.push('<td>'+obj.OPERATOR_DEPT+'</td>');
						html.push('<td>'+obj.OPERATOR_NAME+'</td>');
				}
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth()+1;
				var day = date.getDate();
				var hour = date.getHours();
				var minute = date.getMinutes();
				var second = date.getSeconds();
				var a=year+'-'+month+'-'+day+'- '+hour+':'+minute+':'+second;
				var b=obj.END_TIME;
				a = a.replace("-","/");
				b = b.replace("-","/");
			    var aDate = new Date(a);
			    var bDate = new Date(b);
			    
			    if( bDate.getTime()<aDate.getTime()){
			    	html.push('<td>是</td>');
			    }else {
			    	html.push('<td>否</td>');
			    }				
				html.push('<td>');
				debugger;
				if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""){
					if(obj.IS_SINGATURE=="2"){
						html.push('<a  href="javascript:void(0)" class="but hs_bg">处理</a>');
					}else{
						if(obj.ERA_OPERATOR_ID!=data.staffId&&obj.AUTHOR_STATUS!=0){
							html.push('已授权');
						}else{
							html.push('<a href="#"  class="but" name="dispose" ear_operatop_id="'+obj.ERA_OPERATOR_ID+'" repulseType="'+obj.REPULSE_TYPE+'"  wcreatorId="'+obj.WCREATOR_ID+'" unifiedAuthentication="'+obj.UNIFIED_AUTHENTICATION+'" templateId="'+obj.TEMPLATE_ID+'"  workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'" demandId="'+obj.DEMAND_ID+'"  demandCode="'+obj.DEMAND_CODE+'" demandName="'+obj.DEMAND_NAME+'"  staffId="'+data.staffId+'"  staffName="'+data.staffName+'"   starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'"   demandDesc="'+obj.DEMAND_DESC+'">处理</a>');
						}
					}
				}else{
					if(obj.IS_SINGATURE=="2"){
						html.push('<a  href="javascript:void(0)" class="but hs_bg">处理</a>');
					}else{
						html.push('<a href="#"  class="but" name="dispose" ear_operatop_id="'+obj.ERA_OPERATOR_ID+'" repulseType="'+obj.REPULSE_TYPE+'"  wcreatorId="'+obj.WCREATOR_ID+'" unifiedAuthentication="'+obj.UNIFIED_AUTHENTICATION+'" templateId="'+obj.TEMPLATE_ID+'"  workflowId="'+obj.WORKFLOW_ID+'" workflowName="'+obj.WORKFLOW_NAME+'" demandId="'+obj.DEMAND_ID+'"  demandCode="'+obj.DEMAND_CODE+'"  demandName="'+obj.DEMAND_NAME+'" staffId="'+data.staffId+'" staffName="'+data.staffName+'"   starEvaluate="'+obj.STAR_EVALUATE+'" evaluateInfo="'+obj.EVALUATE_INFO+'"   demandDesc="'+obj.DEMAND_DESC+'"  >处理</a>');
					}
				}
				html.push('</td>');
				html.push('</tr>');
			});
		}else{
				demandListFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		demandListBodyObj.html(html.join(''));
		//点击查看
		$('#demandListPage').find('a[name=query]').unbind('click').bind('click',function(){
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var starEvaluate=$(this).attr("starEvaluate");
			var evaluateInfo=$(this).attr("evaluateInfo");
			var demandId=$(this).attr("demandId");
			var demandStatus=$(this).attr("demandStatus");
			var param={
					"workflowId"		:		workflowId,
					"workflowName" 		: 		workflowName,
					"demandName" 		: 		demandName,
					"demandDesc" 		: 		demandDesc,
					"starEvaluate"  	:		starEvaluate,
					"evaluateInfo" 		: 		evaluateInfo,
					"demandId"          :       demandId,
					"demandStatus"      :       demandStatus,
					"opt_id"            :       $(this).attr("operator_id"),
					"opt_name"          :       $(this).attr("operator_name"),
					"urge_time"          :       $(this).attr("urge_time"),
					"flag"              :          "act",
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/demandListDetail.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var demandListDeatil=new DemandListDeatil();
				//显示短流程需求详细信息
				demandListDeatil.init(param);
			});
		});
		//点击"详细"事件
		$('#demandListPage').find('a[name=detail]').unbind('click').bind('click',function(){
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandName=$(this).attr("demandName");
			var demandDesc=$(this).attr("demandDesc");
			var starEvaluate=$(this).attr("starEvaluate");
			var evaluateInfo=$(this).attr("evaluateInfo");
			var demandId=$(this).attr("demandId");
			var demandStatus=$(this).attr("demandStatus");
			var param={
					"workflowId"		:		workflowId,
					"workflowName" 		: 		workflowName,
					"demandName" 		: 		demandName,
					"demandDesc" 		: 		demandDesc,
					"starEvaluate"  	:		starEvaluate,
					"evaluateInfo" 		: 		evaluateInfo,
					"demandId"          :       demandId,
					"demandStatus"      :       demandStatus,
					"opt_id"            :       $(this).attr("operator_id"),
					"opt_name"          :       $(this).attr("operator_name"),
					"urge_time"          :       $(this).attr("urge_time"),
			};
			$.jump.loadHtmlForFun("/web/html/shortProcess/demandListDetail.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var demandListDeatil=new DemandListDeatil();
				//显示短流程需求详细信息
				demandListDeatil.init(param);
			});
		});
		
		//给"催单"绑定事件
		$("#demandListPage").find("a[name=reminder]").unbind("click").bind("click",function(){	
			var urge_time=$(this).attr("urge_time");
			var param={				
					"opt_id" :$(this).attr("operator_id"),
					"opt_name" :$(this).attr("operator_name"),
		    		"demand_id"  :$(this).attr("demandId"),	
		    		"demand_name"  :$(this).attr("demand_name"),	
			};
			debugger;
			if(!parentThis.validate(parentThis,urge_time)){
				return false;
			}
			$.jump.ajax(URL_UPDATE_DEMANDINFO.encodeUrl(), function(json) {	
				debugger;
				if (json.code == "0") {
					layer.alert('催单成功！！！',8);		
					parentThis.loadDemandList(parentThis,0);
				}else{
					layer.alert(json.cuo);
				};
			}, param, false, false);	
			
		});
		//给"维护"绑定事件
		$("#demandListPage").find("a[name=maintain]").unbind("click").bind("click",function(){
			window.open('html/orderDetail/orderDetail.html?demandId='+$(this).attr("demandId")+'&isHistory=N&handleType=onlyClaim'); 
		});
		//给处理绑定事件
		$("#demandListPage").find("a[name=dispose]").unbind("click").bind("click",function(){
			debugger;
			var workflowId=$(this).attr("workflowId");
			var workflowName=$(this).attr("workflowName");
			var demandId=$(this).attr("demandId");
			var demandName=$(this).attr("demandName");
			var demandCode=$(this).attr("demandCode");
			var demandDesc=$(this).attr("demandDesc");
			var starEvaluate=$(this).attr("starEvaluate");
			var evaluateInfo=$(this).attr("evaluateInfo");
			var staffId=$(this).attr("staffId");
			var templateId=$(this).attr("templateId");
			var repulseType=$(this).attr("repulseType");
			var unifiedAuthentication=$(this).attr("unifiedAuthentication");
			var ear_operatop_id=$(this).attr("ear_operatop_id");
			//发起人ID
			var wcreatorId=$(this).attr("wcreatorId");
			
			var param={
					"workflowId"					:		workflowId,
					"workflowName" 					: 		workflowName,
					"demandId" 		   			 	: 		demandId,
					"demandName" 					: 		demandName,
					"demandDesc" 					: 		demandDesc,
					"demandCode" 					: 		demandCode,
					"starEvaluate"  				:		starEvaluate,
					"evaluateInfo" 					: 		evaluateInfo,
					"staffId" 		    			: 		staffId,
					"templateId" 					: 		templateId,
					"unifiedAuthentication" 		: 		unifiedAuthentication,
					"ear_operatop_id" 				: 		ear_operatop_id,
					"wcreatorId" 					: 		wcreatorId,
					"staffName"                     :       $(this).attr("staffName") 
			};
			if(repulseType=='1'){
				$.jump.loadHtmlForFun("/web/html/shortProcess/updateShortProcessDemandInitiate.html".encodeUrl(), function(menuHtml){
					$('#content').html(menuHtml);
					var updateShortProcessDemandInitiate = new UpdateShortProcessDemandInitiate();
					updateShortProcessDemandInitiate.init(param);

				});
			}else{
				$.jump.loadHtmlForFun("/web/html/shortProcess/stayDisposeShortProcessDemand.html".encodeUrl(), function(menuHtml){
					$('#content').html(menuHtml);
					var stayDisposeShortProcessDemand = new StayDisposeShortProcessDemand();
					stayDisposeShortProcessDemand.init(param);
				});
			}
		});
	},
	validate : function(parentThis,urge_time){
		debugger;		
		if(urge_time && parentThis.countDay(urge_time,common.date.nowDate()) == 0){
			layer.alert("消息提示,今天处理人员已经收到您的催单短信，正在处理，请稍后!");
			return false;
		}
		return true;
	},
	countDay : function (a,b){
		a = a.replace("-","/");
		b = b.replace("-","/");
	    var aDate = new Date(a);
	    var bDate = new Date(b);
	    var dif = bDate.getTime() - aDate.getTime();
	    var day = Math.floor(dif / (1000 * 60 * 60 * 24));
	    return day;
	},
};
