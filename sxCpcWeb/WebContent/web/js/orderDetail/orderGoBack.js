var OrderGoBack = new Function() ;

OrderGoBack.prototype = {
		orderGoBackDiv : null ,
		tempOrderGoBack : null  ,
		init : function (detailData,callBackFun,parentObj){
			
			tempOrderGoBack = this ;
			tempOrderGoBack.orderGoBackDiv = $("#orderGoBack");
			tempOrderGoBack.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(data,callBackFun){
			
				var recordSetLength = data.recordSet.length-1;
	 			tempOrderGoBack.orderGoBackDiv.find("#disposeGoBack").unbind("click").bind("click",function(){
	 				
	 				var goBckDesc =tempOrderGoBack.orderGoBackDiv.find('textarea[id=goBackDesc]').val();
	 				if(goBckDesc==""){
	 					layer.alert("请填写打回说明",8);
	 					return false;
	 				}
	 				if(goBckDesc!=""&&goBckDesc.length>1000){
	 					layer.alert("说明不能超过1000字",8);
	 					return false;
	 				}
	 				var record_list = new Array();
	 				var record_proc =  {
	 						"attr_id" 			: 	'10' ,
	 						"attr_value" 		: 	goBckDesc ,
	 						"busi_id" 			: 	data.demandInst.demand_id ,
	 						"attr_group" 		: 	'3'
	 				      } ;
	 				record_list.push(record_proc);
	 				var demand = {"demand_id" : data.demandInst.demand_id,"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
	 				var flow_record = { 
	 						"next_node_id"   			: 		"100102"								,
							"urge_count"   				: 		"0"										,
							"busi_id"   				: 		data.demandInst.demand_id			,
							"opt_desc"   				: 		goBckDesc										,
							"opt_time"   				: 		data.recordSet[recordSetLength].opt_time								,
							"record_id" 				: 		data.recordSet[recordSetLength].record_id								,
							"opt_id" 					: 		'' 	,//在后台处理，打回到此部门的上一级部门
							"opt_name" 					: 		''								,
							"funTypeId"					:		"100111"								,
							"currNode_id"				:		data.recordSet[recordSetLength].curr_node_id,
							"region_code"               :       data.regionCode		
	 				};
	 				
	 					 				
	 				var param = {
	 						"handleType"	:	"5"									,//打回
	 	 					"demand" 	    : 	 JSON.stringify(demand)				,
	 	 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
	 	 					"record_proc"   :    JSON.stringify(record_list)
	 	 				};
	 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
						if(json.code == 0){
							layer.alert('打回成功!',9);
							location.reload();
						}else{
							layer.alert(json.msg,8);
						}
					}, param, true);
	 	 		});
	 			
	 			if(callBackFun != undefined){
					callBackFun();
				};
		}
};


