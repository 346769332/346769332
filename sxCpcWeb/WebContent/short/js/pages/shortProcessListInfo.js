var ShortProcessListInfo = new Function();

ShortProcessListInfo.prototype = {

	parentBody : null,

	workflow_id : "",
	
	workflow_Name : "",
	
	workflow_Type : "",
	
	workflow_Type_Name : "",
	
	workflow_SingleType : "",
	
	templateId : "",
	
	flowType : null,
	
	comeFrom   : null,
	init : function(parentBody) {
		
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
		this.workflow_id = common.utils.getHtmlUrlParam("workflow_id"); 
		this.workflow_Name =decodeURI(common.utils.getHtmlUrlParam("workflow_Name")); 
		this.workflow_Type =decodeURI(common.utils.getHtmlUrlParam("workflow_Type")); 
		this.workflow_Type_Name =decodeURI(common.utils.getHtmlUrlParam("workflow_Type_Name")); 
		this.workflow_SingleType =common.utils.getHtmlUrlParam("workflow_SingleType"); 
		this.templateId =common.utils.getHtmlUrlParam("templateId"); 
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
		var html="<dt>"+parentThis.workflow_Name+"</dt><dd><a href='#' id='editor'>发起</a></dd>";
		$("#workFlowInfo").html(html);
		if(parentThis.workflow_id!=919){
			$("#img").attr("src", "../images/workflow_00.png");
		}else if (parentThis.workflow_id==919){
			$("#img").attr("src", "../images/919.png");
		}
	"".findById("a", "editor", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("editor.html?workflow_id="+parentThis.workflow_id+"&workflow_Name="+parentThis.workflow_Name+"&workflow_Type="+parentThis.workflow_Type+"&workflow_Type_Name="+parentThis.workflow_Type_Name+"&templateId="+parentThis.templateId);
		});
	},
};
$(document).ready(function() {
	
	var shortProcessListInfo = new ShortProcessListInfo();
	shortProcessListInfo.init($(this));
});