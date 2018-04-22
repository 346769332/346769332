var HistoryShortProcessListInfo = new Function();

HistoryShortProcessListInfo.prototype = {

	parentBody : null,
	
	data : null,
	
	flowType : null,

	demandId : "",
	demandName : "",
	demandCode : "",
	workflowId : "",
	
	scroll : null,

	init : function(parentBody, demandId) {
		this.parentBody = parentBody;
		this.demandId = common.utils.getHtmlUrlParam("demand_id");
		this.demandName = decodeURI(common.utils.getHtmlUrlParam("demand_name"));
		this.demandCode = common.utils.getHtmlUrlParam("demand_code");
		this.workflowId = common.utils.getHtmlUrlParam("workflow_id");
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
		//给标题赋值
		var titleName = "".findById("dt", "titleNameDt", this.parentBody)[0];
		titleName.html(parentThis.demandName);
		var param = {
				"handleType" 	:	2011,
				"workflowId"	: 	common.utils.getHtmlUrlParam("workflow_id"),
				"demandId" 		: 	common.utils.getHtmlUrlParam("demand_id"),
		};
		$.jump.ajax(URL_SHORT_PROCESS,function(data){
			if(data.code == 0){
				parentThis.data = data;
				parentThis.setPageList(data.data);
			}
		},param,true);
	},
	
	setPageList : function(list){
		
		var parentThis = this;
		var trsDetailObj = "".findById("ul", "historyDetailDiv", this.parentBody)[0];
		var html="";
		$.each(list,function(i, obj){
			html+="<div class='xq' style='padding:10px 0px;'><span class='lc_box' style='float:left;'><dt>"+(i+1)+"</dt></span>";
			html+="<div class='status_c' style='width:85%;float:right;'>";
			html+="<h3>"+obj.NODE_NAME+"</h3>";
			html+="<dl style='line-height: 30px;clear:left;'><dt style='float:left;width:38%;' id="+obj.OPERATOR_ID+">处理人：</dt><dd style='float:left;width:62%;'>"+obj.OPERATOR_NAME+"</dd></dl>";
			html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>处理时间：</dt><dd style='float:left;width:62%;'>"+(obj.APPCREATE_TIME).substring(0,16)+"</dd></dl>";
			html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批意见：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION_INFO+"</dd></dl>";
			html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>审批结果：</dt><dd style='float:left;width:62%;'>"+obj.OPERATION+"</dd></dl>";
			html+="<dl style='line-height: 30px;clear:left;border-bottom: 1px dashed #dedede'><dt style='float:left;width:38%;'>是否超时：</dt><dd style='float:left;width:62%;'>"+obj.TLOVER_TIME+"</dd></dl>";
//			html+="<dl class='transit_dl'><dt class='transit_dt'>需求单号："+parentThis.demandCode+"</dt>";
//			html+="<dl class='transit_dl'><dt class='transit_dt'>处理时限：接单后"+obj.TIME_LIMIT+"个工作日</dt><dd class='transit_dt'></dd></dl>";
			html+="</div>";
			html+="</div>";
		});
		trsDetailObj.append(html);
		parentThis.loaded();
	},
};
$(document).ready(function() {
	var historyShortProcessListInfo = new HistoryShortProcessListInfo();
	historyShortProcessListInfo.init($(this));
});