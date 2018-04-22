var EvalTransitShortProcessListInfo = new Function();

EvalTransitShortProcessListInfo.prototype = {

	parentBody : null,

	demandId : "",
	
	workflow_id : "",
	
	demand_code : "",

	scroll : null,

	init : function(parentBody, demandId) {
		this.parentBody = parentBody;
		this.demandId = common.utils.getHtmlUrlParam("demand_id");
		this.workflow_id = common.utils.getHtmlUrlParam("workflow_id");
		this.demand_code = common.utils.getHtmlUrlParam("demand_code");
		this.bindMethod();
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
		//星级评价
		var rating = "".findById("input", "rating_02", this.parentBody)[0];
		rating.rating({'size':'sm','showClear':false,'showCaption':false});
		//提交
		"".findById("a", "submitBtn", this.parentBody)[0].unbind().bind("click",function(){
			parentThis.submit();
		});
		//返回
		"".findById("a", "goBackBtn", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
	},
	submit : function(){
		var parentThis = this;
		var showDialogDivObj = "".findById("div", "showDialogDiv",this.parentBody)[0];
		//var showDialogDivObj = "".findById("div", "showDialogDiv", this.parentBody)[0];
//		if(!this.validate(showDialogDivObj)){
//			return;
//		}
		var rating = "".findById("input", "rating_02", this.parentBody)[0];
		var evalOpinion = "".findById("textarea", "evalOpinion", this.parentBody)[0];
		var params={
						"handleType"	:	2008,
						"starNum"		:	rating.val() ,
						"evalDesc"		:	evalOpinion.val(),
						"demandId"		:	this.demandId,
						"demand_Code"	:	this.demand_code,
						"workflowId"	:	this.workflow_id,
				};
				$.jump.ajax(URL_SHORT_PROCESS,function(data){
					if(data.code == 0){
						
						common.loadMsgDialog(showDialogDivObj, "消息提示","需求单评价成功!",null,null,{style:{height:"50px"}});
						//common.loadMsgDialog(showDialogDivObj,"消息提示","需求单评价成功!");
//						common.loadMsgDialog(showDialogDivObj,"消息提示","需求单评价成功！",function(){
//						common.go.next("transitShortProcessList.html");
//						});
						$("#submitBtn").hide();
						$("#submitBtns").hide();
					}else{
						common.loadMsgDialog(showDialogDivObj,"消息提示","评价失败!");
					}
				},params,true);
	},
	validate : function(showDialogDivObj){
		var rating 		= "".findById("input", "rating_02", this.parentBody)[0];
		var evalOpinion = "".findById("textarea", "evalOpinion", this.parentBody)[0];
		if((rating.val()=="" || rating.val() == "0")){
			common.loadMsgDialog(showDialogDivObj,"消息提示","确认评价时，请先选择评价星级！");
			return false;
		}
		if(evalOpinion.val().trim().length>200){
			common.loadMsgDialog(showDialogDivObj,"消息提示","意见超过了200字，请精简您的意见！");
			return false;
		}
		return true;
	},
};
$(document).ready(function() {
	var evalTransitShortProcessListInfo = new EvalTransitShortProcessListInfo();
	evalTransitShortProcessListInfo.init($(this));
});