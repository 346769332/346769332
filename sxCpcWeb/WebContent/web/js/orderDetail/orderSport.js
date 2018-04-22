var OrderSport = new Function() ;

OrderSport.prototype = {
		orderSportDiv : null ,
		tempOrderSport : null  ,
		init : function (detailData,callBackFun,parentObj){
			tempOrderSport = this ;
			tempOrderSport.orderSportDiv = $("#orderSport");
			tempOrderSport.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			var recordSetLength = detailData.recordSet.length-1;
			tempOrderSport.orderSportDiv.find("a[name=toReport]").unbind("click").bind("click",function(){
				
 				var reportExplain = tempOrderSport.orderSportDiv.find("textarea[name=reportExplain]").val();
 				if(reportExplain.length > 1000){
 					layer.alert("上报说明不能超过1000字");
 					return false;
 				}
 				if(reportExplain.length == 0){
 					layer.alert("请填写上报说明",8);
 					return false;
 				}
 				var record_list = new Array();
 				var record_proc =  {
 						"attr_id" 			: 		'13' 				,  
 						"attr_value" 		: 		reportExplain 		,
 						"busi_id" 			: 		detailData.demandInst.demand_id 			,
 						"attr_group" 		: 		'3'
 				      } ;
 				record_list.push(record_proc);
 				var record_proc =  {
 						"attr_id" 			: 		'14' 				,  
 						"attr_value" 		: 		"newDate" 		    ,
 						"busi_id" 			: 		detailData.demandInst.demand_id 			,
 						"attr_group" 		: 		'3'
 				      } ;
 				record_list.push(record_proc);
 				
 				var demand = {"demand_id" : detailData.demandInst.demand_id,"tel" : detailData.demandInst.tel,"demand_theme":detailData.demandInst.demand_theme};
 	 			var flow_record = {
 	 						"funTypeId"				:   "100006"   		,//上报
 	 						"urge_count"   			: 	"0"				,
 							"busi_id"    			: 	detailData.demandInst.demand_id		,
 							"opt_desc"   			: 	reportExplain				,//西安综支人上报时要看见处理意见
 							"opt_time"   			: 	detailData.recordSet[recordSetLength].opt_time			,
 							"record_id" 			: 	detailData.recordSet[recordSetLength].record_id			,
 							"flagType"				:	"3"				, //锁单
 							"regionName"			:	detailData.regionName
 					};
 				
 				var param = {
 						"handleType"	:	"5"								 ,
 						"demand" 	    : 	 JSON.stringify(demand	)		 ,
 						"flow_record"	:	 JSON.stringify(flow_record	)    ,
 						"record_proc"   :    JSON.stringify(record_list)	 ,
 					};
 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
 					if(json.code == 0){
 						layer.alert('上报成功!',9);
 						location.reload() ;
 					}else{
 						layer.alert(json.msg,8);
 					}
 				}, param, true);
 			});
		}
};


