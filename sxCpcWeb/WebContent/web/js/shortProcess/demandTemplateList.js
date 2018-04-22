var DemandTemplateList = new Function();
DemandTemplateList.prototype = {
	selecter : "#demandTemplateListPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		//加载数据
		parentThis.loadDemandTemplateList(parentThis,0); 
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		parentThis.dataQryBind(searchObj,parentThis);
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#demandTemplateName").val("");
			$("#demandType").find("select").val("");
		});
	},
	//查询绑定
	dataQryBind : function(searchObj,parentThis){
		searchObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0);
		});
	},
	//查询模板
	loadDemandTemplateList : function(parentThis,pageIndex) {
		var demandTemplateName = parentThis.selecter.findById("input","demandTemplateName")[0];
		var demandType = parentThis.selecter.findById("select","demandType")[0];
		var param = {
			"demandTemplateName"	:	demandTemplateName.val()	,
			"demandType"			:	demandType.val()	
		};
		var demandListFootObj = parentThis.selecter.findById("div","demandListTemplateFoot")[0];
		common.pageControl.start(URL_QUERY_DEMANDTEMPLATE.encodeUrl(),
				 pageIndex,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 demandListFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					var demandTemplateListBodyObj = parentThis.selecter.findById("tbody","demandTemplateListBody")[0];
					debugger;
					demandListBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,demandTemplateListBodyObj);
		});
	},

	//创建HTML
	createLstHtml : function(parentThis,data,demandTemplateListBodyObj){
		var html=[];
		var dataLst = data.data;
		var demandListTemplateFootObj = parentThis.selecter.findById("div","demandListTemplateFoot")[0];
		if(dataLst.length > 0 ){
			demandListTemplateFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td><input type="checkbox" name="" id=""/></td>');
				html.push('<td>'+obj.TEMPLATE_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
				demandListFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		demandListBodyObj.html(html.join(''));
	}
};
