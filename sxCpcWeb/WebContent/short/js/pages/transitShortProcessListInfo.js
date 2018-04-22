var TransitShortProcessListInfo = new Function();

TransitShortProcessListInfo.prototype = {
	parentBody : null,
	
	data : null,
	pages : {
		pagenum  : 1,
		pagesize : 20
	},
	demandId : "",
	workflowId : "",
	demandCode : "",
	demandStatus : "",
	demandName	: "",
	is_evaluate	: "",
	staffId:"",
	urge_time : null,
	init : function(parentBody) {
		
		this.parentBody = parentBody;
		this.demandId = common.utils.getHtmlUrlParam("demand_id");
		this.demandName = decodeURI(common.utils.getHtmlUrlParam("demand_name"));
		this.demandCode = common.utils.getHtmlUrlParam("demand_code");
		this.workflowId = common.utils.getHtmlUrlParam("workflow_id");
		this.demandStatus = common.utils.getHtmlUrlParam("demand_status");
		this.is_evaluate = common.utils.getHtmlUrlParam("is_evaluate");
		this.bindMethod();
		this.searchDemandInfo();

	},
	
	bindMethod : function() {
		var parentThis = this;
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);
		
		"".findById("a", "backB", this.parentBody)[0].unbind().bind("click",function(){
			new AppService().closeApp();
		});

		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
	},
	loaded :  function(){
		var myScroll;
		myScroll = new iScroll('wrapper', { scrollbarClass: 'myScrollbar' });
	},
	searchDemandInfo : function(){
		var parentThis = this;
		
		
		var param = {
				"handleType" 	:	2011,
				"workflowId"	: 	common.utils.getHtmlUrlParam("workflow_id"),
				"demandId" 		: 	common.utils.getHtmlUrlParam("demand_id"),
		};
		$.jump.ajax(URL_SHORT_PROCESS,function(data){
			if(data.code == 0){
				parentThis.data = data.data;
				var listLen = data.data.length;
				parentThis.urge_time = data.data[listLen-1].APPURGE_TIME;
				parentThis.setPageList(data.data);
				parentThis.staffId=data.staff_id;
				var params = {
						"handleTypecom"		: "qryLst",
						"handleType"     	: 2018,
						"sqlName"   		: "getSolveProcessListInfo",
						"demandCode"   		: parentThis.demandCode
			   };
				$.jump.ajax(URL_SHORT_PROCESS,function(dataInfo){
					if(dataInfo.code == 0){
						parentThis.is_evaluate = dataInfo.data[0].IS_EVALUATE;
						//alert("1::"+parentThis.is_evaluate);
					}
				},params,true);
			}
		},param,true);
	},
	setPageList : function(list){
		
		var parentThis = this;
		var startStadd="";//发起者
		var trsDetailObj = "".findById("ul", "transitDetailDiv", this.parentBody)[0];
		var  html=[];
		    html="<div class='d_list' style='border-radius:5px;margin-top: 10px;'><dt id='titleNameDt'>"+parentThis.demandName+"</dt></div>";
		if(list.length>0){
			startStadd=list[0].OPERATOR_ID;
		}
		    $.each(list,function(i, obj){
			
			var length=list.length;
 			var flag=length-i;
 			var dueDate="";
 			if(obj.APPCREATE_TIME!=null&&obj.APPCREATE_TIME!=""){
 				dueDate=(obj.APPCREATE_TIME).substring(0,16);
 			}
 			if(obj.TASK_STATUS!=''){
 				if(list.length==1||(list.length!=1&&1==flag)){
 					html+="<div class='xq' style='padding:10px 0px;'><span class='lc_box' style='float:left;'><dt>"+(i+1)+"</dt></span>";
 	 				html+="<div class='status_c' style='width:85%;float:right;'>";
 	 				html+="<h3>"+obj.NODE_NAME+"</h3>";
 	 				html+="<dl style='line-height: 30px;clear:left;'><dt style='float:left;width:38%;' id="+obj.OPERATOR_ID+">处理人：</dt><dd style='float:left;width:62%;'>"+obj.OPERATOR_NAME+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>处理时间：</dt><dd style='float:left;width:62%;'>"+dueDate+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批意见：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION_INFO+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批结果：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>是否超时：</dt><dd style='float:left;width:62%;'>"+obj.TLOVER_TIME+"</dd></dl>";
// 	 				html+="<dl class='transit_dl'><dt class='transit_dt'>需求单号："+parentThis.demandCode+"</dt>";
// 	 				html+="<dl class='transit_dl'><dt class='transit_dt'>处理时限：接单后"+obj.TIME_LIMIT+"个小时</dt><dd class='transit_dt'></dd></dl>";
 	 				html+="</div>";
 	 				html+="</div>";	 				
 				}else {
 					html+="<div class='xq' style='padding:10px 0px;'><span class='lc_box' style='float:left;'><dt>"+(i+1)+"</dt></span>";
 	 				html+="<div class='status_c' style='width:85%;float:right;'>";
 	 				html+="<h3>"+obj.NODE_NAME+"</h3>";
 	 				html+="<dl style='line-height: 30px;clear:left;'><dt style='float:left;width:38%;' id="+obj.OPERATOR_ID+">处理人：</dt><dd style='float:left;width:62%;'>"+obj.OPERATOR_NAME+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>处理时间：</dt><dd style='float:left;width:62%;'>"+dueDate+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批意见：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION_INFO+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批结果：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION+"</dd></dl>";
 	 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>是否超时：</dt><dd style='float:left;width:62%;'>"+obj.TLOVER_TIME+"</dd></dl>";
 	 				html+="</div>";
 	 				html+="</div>";
 				}
 			}else{
 				html+="<div class='xq' style='padding:10px 0px;'><span class='lc_box' style='float:left;'><dt>"+(i+1)+"</dt></span>";
 				html+="<div class='status_c' style='width:85%;float:right;'>";
 				html+="<h3>"+obj.NODE_NAME+"</h3>";
 				html+="<dl style='line-height: 30px;clear:left;'><dt style='float:left;width:38%;' id="+obj.OPERATOR_ID+">处理人：</dt><dd style='float:left;width:62%;'>"+obj.OPERATOR_NAME+"</dd></dl>";
 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>处理时间：</dt><dd style='float:left;width:62%;'>"+dueDate+"</dd></dl>";
 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批意见：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION_INFO+"</dd></dl>";
 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批结果：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION+"</dd></dl>";
 				html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>是否超时：</dt><dd style='float:left;width:62%;'>"+obj.TLOVER_TIME+"</dd></dl>";
 				html+="</div>";
 				html+="</div>";
 			}
		});
		
		if(parentThis.is_evaluate=="0"&&parentThis.demandStatus=='1001'&&parentThis.staffId==startStadd){
			html+="<div class='syrd'><div class='cd_box'><ul><a id='evalDemandBtn'>评价</a></ul><li></li></div></div>";
		}
		
		trsDetailObj.html(html);					

				//催单
//		"".findById("a", "urgeDemandBtn", this.parentBody)[0].unbind().bind("click",function(){
//			parentThis.urgeDemand();
//		});
		
		parentThis.loaded();
		//评价
		if(parentThis.is_evaluate=="0"&&parentThis.demandStatus=='1001'&&parentThis.staffId==startStadd){
			"".findById("a", "evalDemandBtn", parentThis.parentBody)[0].unbind().bind("click",function(){
				//只有需求状态为'审批完结'的需求单才能进行评价
				if(!(parentThis.demandStatus=='1001')){
					var showDialogDivObj = "".findById("div", "showDialogDiv", parentThis.parentBody)[0];
					common.loadMsgDialog(showDialogDivObj,"消息提示","需求单<b style='color:red;'>'审批完结'</b>后才能进行评价！");
					return false;
				}
				//判断
				common.go.next("evalTransitShortProcessListInfo.html?demand_id="+parentThis.demandId+"&workflow_id="+parentThis.workflowId+"&demand_code="+parentThis.demandCode);
			});
		}
	}

//	//催单
//	urgeDemand : function(){
//		var parentThis = this;
//		var param = this.getPageParam();
//		var showDialogDivObj = "".findById("div", "showDialogDiv", parentThis.parentBody)[0];
//		//校验
//		if(!this.validate(showDialogDivObj)){
//			return;
//		}
//		$.jump.ajax(URL_SHORT_PROCESS,function(data){
//			if(data.code == 0){
//				parentThis.urge_time = common.date.nowDate();
//				common.loadMsgDialog(showDialogDivObj,"消息提示","<b style='color:red;'>需求催单</b>操作成功！");
//			}else{
//				common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg);
//			}
//		},param,true);
//	},
//	
//	getPageParam : function(){
//		var param = {
//				"handleType"   : 	2007,
//				"demand_id"	   :  	this.demandId,
//				"demand_name"  :	this.demandName,
//				"demandcode"   :	this.demandCode,
//		};
//		
//		var listLen = this.data.length;
//		param.opt_id = this.data[listLen-1].OPERATOR_IDS;
//		param.opt_name = this.data[listLen-1].OPERATOR_NAMES;
//		return param;
//	},
	
//	validate : function(showDialogDivObj){
////		if(this.urge_time && common.date.countDay(this.urge_time,common.date.nowDate()) == 0){}
//		//只有需求状态为'审批中'的需求单才能进行催单
//		if(!(this.demandStatus=='1000')){
//			common.loadMsgDialog(showDialogDivObj,"消息提示","需求单状态为<b style='color:red;'>'审批中'</b>的单子才能进行催单！");
//			return false;
//		}
//		if(this.urge_time){
//			if(this.urge_time == common.date.nowDate()){
//				common.loadMsgDialog(showDialogDivObj,"消息提示","今天综支人员已经收到您的催单短信，正在处理，请稍后！");
//				return false;
//			}
//		}
//		return true;
//	},
};
//window.onerror = function(msg, url, line) {
//    var idx = url.lastIndexOf("/");
//    if(idx > -1) {
//        url = url.substring(idx+1);
//    }
//   // alert("ERROR in " + url + " (line #" + line + "): " + msg);
//    return false;
//};
$(document).ready(function() {
	var transitShortProcessListInfo = new TransitShortProcessListInfo();
	transitShortProcessListInfo.init($(this));
});