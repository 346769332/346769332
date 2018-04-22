var DistalRepertoryDetail = new Function();
DistalRepertoryDetail.prototype = {
	selecter : "#distalRepertoryDetail",
	// 初始化执行
	init : function(param) {
		this.paramInfo=param
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		var workflowName=parentThis.paramInfo.workflowName;
		var demand_sumit_pname=parentThis.paramInfo.demand_sumit_pname;
		var department=parentThis.paramInfo.department;
		var mobTel=parentThis.paramInfo.mobTel;
		var subofficeName=parentThis.paramInfo.subofficeName;
		var centerRepositoryName=parentThis.paramInfo.centerRepositoryName;
		var demandDesc=parentThis.paramInfo.demandDesc;
		
		$("#workflowName").val(workflowName);
		$("#releasePersonName").val(demand_sumit_pname);
		$("#releaseDeptName").val(department);
		$("#releasePersonNum").val(mobTel);
		$("#remark").val(demandDesc);
		$("#subofficeName").val(subofficeName);
		$("#centerRepositoryName").val(centerRepositoryName);
		parentThis.queryMaterialList(parentThis);
	},
	queryMaterialList : function(parentThis) {
		var demandId=parentThis.paramInfo.demandId;
		var materialPara={
				"demandId"	:	demandId
		}
		$.jump.ajax(URL_QUERY_MATERIALLIST_BY_DEMANDID.encodeUrl(), function(json) {
			if(json.code=="0"){
				var dataLst=json.data;
				var materialInfoObj=$("#materialInfo");
				parentThis.createMaterialListHtml(parentThis,dataLst,materialInfoObj);
			}
		},materialPara,null,false,false);
	},
	//显示数据
	createMaterialListHtml : function(parentThis,dataLst,listBodyObj) {

		var html=[];
		if(dataLst.length > 0 ){
			$.each(dataLst,function(i,obj){
				html.push('<tr>');
				html.push('<td align="center">'+obj.MATERIAL_CODE+'</td>');
				html.push('<td align="center">'+obj.MATERIAL_NAME+'</td>');
				html.push('<td align="center">'+obj.MATERIAL_KIND+'</td>');
				html.push('<td align="center">'+obj.MATERIAL_TYPE+'</td>');
				html.push('<td align="center">'+obj.MATERIAL_COUNT+'</td>');
				html.push('</tr>');
			});
		}else{
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));

	}
};