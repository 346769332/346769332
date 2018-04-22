var PolicyManualInfo = new Function();

PolicyManualInfo.prototype = {
	parentBody:null,	
	selecter : "#policyManualInfoPage",
	PM : null ,// 政策 包括 政策 子政策  政策属性 
	pmId:"",
	scroll:null,
	
	init : function(parentBody){
		
		this.parentBody =parentBody;
		this.pmId=common.utils.getHtmlUrlParam("pmId");
		this.initPageData(this);
		this.bindMethod(this);
	},
    
	scrollRefresh:function(parentThis){
		if(null!=parentThis.scroll){
			parentThis.scroll.destroy();
			parentThis.scroll=null;
		}
		var scrollDivObj = "".findById("div", "scrollDiv",parentThis.parentBody)[0];
		scrollDivObj.height((document.documentElement.clientHeight-55)+"px");
		parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,
			function(){ 
			});
		parentThis.scroll.refresh();
	},
	
	bindMethod:function(parentThis){
		
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);
		}, false);
		
		"".findById("a", "backA", parentThis.parentBody)[0].unbind("click").bind("click",function(){
			navigator.app.backHistory();
		});
		
		"".findById("a", "homeEnvelope", parentThis.parentBody)[0].unbind("click").bind("click",function(){
			common.go.next("home.html");
		});
	},
	
	initPageData:function(parentThis){
		var html=[];
		var param={
				"id" 	: 		parentThis.pmId	
		};
		$.jump.ajax(URL_SEARCH_POLICY_MANUAL_INFO, function(json) {
				if(json.code == "0" ){
					
					parentThis.PM =json.list[0];
					html.push('<div class="row">');
					html.push('<div class=" well" style="background-color: #FFFFFF;margin-bottom: 0px;">');
					html.push('<h4 style="text-align: center;">'+parentThis.PM.theme+'</h4>');
					html.push('</div>');
					html.push('<div class=" well">');
					html.push('<p style="line-height:26px; font-size:12px;">');
					html.push(parentThis.PM.content);
					html.push('</p>');
					html.push('</div>');
					html.push('</div>');
					
				var contentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
				 contentDivObj.html(html.join(''));
			
				 parentThis.scrollRefresh(parentThis);
			}else{
				layer.alert(json.msg);
			};
		}, param, true,false);
	},
	 
};
$(document).ready(function(){
	var policyManualInfo  =new PolicyManualInfo();
	policyManualInfo.init($(this));
});