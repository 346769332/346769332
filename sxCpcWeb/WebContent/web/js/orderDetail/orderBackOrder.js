var OrderBackOrder = new Function() ;

OrderBackOrder.prototype = {
		orderBackOrderDiv : null ,
		tempOrderBackOrder : null  ,
		init : function (detailData,callBackFun,parentObj){
			
			tempOrderBackOrder = this ;
			tempOrderBackOrder.orderBackOrderDiv = $("#orderBackOrder");
			tempOrderBackOrder.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(data,callBackFun){
				var optId = "";//市综支上报人ID，回单功能用
				var optName = "";//市综支上报人NAME，回单功能用
				$.each(data.recordSet,function(key,obj){
						if("100102" == obj.curr_node_id){ //区综支上报
							optId = obj.opt_id;
							optName = obj.opt_name.split('-');
							optName = optName[1];
						}
					});
				var recordSetLength = data.recordSet.length-1;
	 			tempOrderBackOrder.orderBackOrderDiv.find("#diposeFlowRecordA").unbind("click").bind("click",function(){
	 				
	 				var diposeFlowRecord = tempOrderBackOrder.orderBackOrderDiv.find("#diposeFlowRecord").val();
	 				if(diposeFlowRecord.length < 0){
	 					layer.alert("请填写回单说明",8);
	 					return false;
	 				}
	 				if(diposeFlowRecord.length > 1000){
	 					layer.alert("回单说明不能超过1000字",8);
	 					return false;
	 				}
	 				var demand = {"demand_id" : data.demandInst.demand_id,"summary" : tempOrderBackOrder.orderBackOrderDiv.find("#diposeFlowRecord").val(),"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
	 				var flow_record = { 
	 									"flagType"			:	"1"								, //解锁单子
	 									"urge_count"   		: 	"0"								,
	 									"busi_id"    		: 	data.demandInst.demand_id		,
	 									"opt_desc"   		: 	diposeFlowRecord				,
	 									"opt_time"   		: 	data.recordSet[recordSetLength].opt_time					,
	 									"record_id" 		: 	data.demandInst.curr_record_id	,
	 									"opt_id"			: 	data.demandInst.promoters_id	,
	 									"opt_name"			: 	data.demandInst.promoters		,
	 									"funTypeId"			:	"100004"				
	 				};
	 				
	 				var record_list = new Array();
	 				var record_proc =  {
	 						"attr_id" 			: 	'4' , // 4表示回单说明  map_code 
	 						"attr_value" 		: 	diposeFlowRecord ,
	 						"busi_id" 			: 	data.demandInst.demand_id ,
	 						"attr_group" 		: 	'1'
	 				      } ;
	 				record_list.push(record_proc);
	 				if("200102" == data.recordSet[recordSetLength].curr_node_id){
	 					flow_record["opt_id"] = optId;
	 					flow_record["opt_name"] = optName;
	 					flow_record["smsFlag"] = "1"; //发区综支短信
	 					var record_proc =  {
	 	 						"attr_id" 			: 	'16' , // 16表示回单时间  map_code 
	 	 						"attr_value" 		: 	"newDate" ,
	 	 						"busi_id" 			: 	data.demandInst.demand_id ,
	 	 						"attr_group" 		: 	'1'
	 	 				      } ;
	 	 				record_list.push(record_proc);
	 				}
	 				
	 				var param = {
	 						"handleType"	:	"2"									,
	 	 					"demand" 	    : 	 JSON.stringify(demand)				,
	 	 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
	 	 					"record_proc"   :    JSON.stringify(record_list)
	 	 				};
	 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
						if(json.code == 0){
							layer.alert('回单成功!',9);
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


