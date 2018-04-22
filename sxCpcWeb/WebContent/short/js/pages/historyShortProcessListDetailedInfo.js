var HistoryShortProcessListDetailedInfo = new Function();

HistoryShortProcessListDetailedInfo.prototype = {

	parentBody : null,

	demandId : "",
	
	flowType : null,
	
	demandInst : null,

	scroll : null,

	cameraImgArr : [],
	
	subTimerID : null,
	
	comeFrom   : null,
	
	dialogContentByKey : {},

	init : function(parentBody, demandId) {
		
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
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
	},
};
$(document).ready(function() {
	var historyShortProcessListDetailedInfo = new HistoryShortProcessListDetailedInfo();
	historyShortProcessListDetailedInfo.init($(this));
});