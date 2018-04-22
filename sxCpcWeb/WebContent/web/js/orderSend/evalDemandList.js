var EvalDemandList = new Function();
/*完成确认并评价*/
EvalDemandList.prototype = {
	selecter : "#evalDemandPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		//发起时间
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0];
		parentThis.dateBind(sendDateObj,0);
		var clearSendDateObj = parentThis.selecter.findById("img","clearSendDate")[0];
		clearSendDateObj.unbind("click").bind("click",function(){
			sendDateObj.val("");
		});
		//点击查询按钮触发的事件
		$("#senior").unbind("click").bind("click",function(){
			parentThis.qryOrderLst(parentThis);
		});
		//查看并评价
		$("#demandInfoBtn").unbind("click").bind("click",function(){
			if($("#evalDemandBody").find(":checkbox:checked").length == 0){
				layer.alert("请选择需求主题",8);
				return false;
			}
			$("#evalDemandBody").find("input[type=checkbox][name=demandInfoBox]").each(function(i,obj){
				var boxObj = $(this);
				var demandId="";
				var recordId="";
				if(boxObj.is(':checked')){
					var trObj = boxObj.parent().parent("tr[name=demandInfo]");
					demandId = trObj.attr("demandId");
					recordId = trObj.attr("recordId");
					$.jump.loadHtmlForFun("/web/html/orderSend/evalDetail.html".encodeUrl(),function(menuHtml){
						$("#content").html(menuHtml);
						var evalDetail=new EvalDetail();
						evalDetail.init(demandId,recordId);
					});
				}
			});
		});
		parentThis.qryOrderLst(parentThis);
	},
	
	//检索需求单
	qryOrderLst : function(parentThis) {
		var param = {
				"handleType"			:		"demandList"				,
				"curr_node_id"			:	   	"100103",
				"record_status" 		: 		"0"							,
				"start_create_time"		:		$("#sendDate").val()		, //发起时间
				"demand_theme"			:		$("#themeSeach").val()		, //主题检索
		};
		var evalFootObj = $("#evalDemandFoot");
		var evalBodyObj = $("#evalDemandBody");
		common.pageControl.start(SHOW_DEMAND_DRAFT_LIST_LST.encodeUrl(),
				 0,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 evalFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
			evalBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,evalBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,evalBodyObj){
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			$("#evalDemandFoot").show();
			$.each(dataLst,function(i,obj){
				html.push('<tr name="demandInfo" demandId="'+obj.demand_id+'" recordId="'+obj.record_id+'">');
				html.push('<td><input id="demand_'+obj.demand_id+'" name="demandInfoBox" type="checkbox"/></td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'" title="'+obj.demand_theme+'">'+splitStr(obj.demand_theme,20)+'</td>');
				html.push('<td name="demandInfo" currNodeId="'+obj.curr_node_id+'">'+obj.curr_node_name+'</td>');
				html.push('<td name="demandInfo">'+obj.create_time+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.over_limit+'</td>');
				html.push('</tr>');
			});
		}else{
			$("#evalDemandFoot").hide();
			html.push('<tr>');
			html.push('<td colspan="5">无相关数据</td>');
			html.push('</tr>');
		}
		evalBodyObj.html(html.join(''));
		evalBodyObj.find("input[type=checkbox][name=demandInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			evalBodyObj.find("input[type=checkbox][name=demandInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
	},
	
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
};
