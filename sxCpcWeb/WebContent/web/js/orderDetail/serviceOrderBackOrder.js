var ServiceOrderBackOrder = new Function() ;

ServiceOrderBackOrder.prototype = {
		serviceOrderBackOrderDiv : null ,
		tempServiceOrderBackOrder : null  ,
		init : function (detailData,callBackFun,parentObj){
			
			tempServiceOrderBackOrder = this ;
			tempServiceOrderBackOrder.orderToSendDiv = $("#orderBackOrder");
			tempServiceOrderBackOrder.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(data,callBackFun){
			var recordSetLength = data.recordSet.length-1;
			tempServiceOrderBackOrder.orderToSendDiv.find("#diposeFlowRecordA").unbind("click").bind("click",function(){
					var diposeFlowRecord = tempServiceOrderBackOrder.orderToSendDiv.find("#diposeFlowRecord").val();
					if(diposeFlowRecord.length == 0 ){
						layer.alert("请填写回单说明",8);
						return false;
					}
					if(diposeFlowRecord.length > 1000){
						layer.alert("回单说明不能超过1000字",8);
						return false;
					}
					var otherOrderId = tempServiceOrderBackOrder.orderToSendDiv.find("#otherOrderId").val();
					var service = {"service_id" : data.serviceInst.service_id,"summary" : diposeFlowRecord,"service_theme":data.serviceInst.service_theme,"demand_type":data.serviceInst.demand_type};
					var flow_record = { 
								"urge_count"   		: 	"0",
								"busi_id"    		: 	data.serviceInst.service_id,
								"opt_desc"   		: 	diposeFlowRecord,
								"opt_time"   		: 	data.recordSet[recordSetLength].opt_time,
								"record_id" 		: 	data.serviceInst.curr_record_id,																						
								"funTypeId"			:	"100034"
					};
					var smss_record={
							"demand_id"         :   data.serviceInst.demand_id,
							"tel"               :   data.serviceInst.tel,
							"makeType"			:	"huidan"
					};
					var record_list = new Array();
					var record_proc1 =  {
							"attr_id" 		: 	'12' 							, // 12表示专业系统单号  map_code 
							"attr_value" 	: 	otherOrderId 					,
							"busi_id" 		: 	data.serviceInst.service_id 	,
							"attr_group" 	: 	'5'
					      } ;
					var record_proc2 =  {
							"attr_id" 		: 	'4' 							, // 4表示回单说明  map_code 
							"attr_value" 	: 	diposeFlowRecord 				,
							"busi_id" 		: 	data.serviceInst.service_id 	,
							"attr_group" 	: 	'5'
					      } ;
					record_list.push(record_proc1);
					record_list.push(record_proc2);
					var param = {
		 					"service" 	    : 	 JSON.stringify(service)			,
		 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
		 					"record_proc"   :    JSON.stringify(record_list)		,
		 					"otherInfo"		:	 JSON.stringify(data.otherInfo),
		 					"smss_record"   :    JSON.stringify(smss_record)
		 				};
					$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('回单成功!',9);
						temp.init();
					}else{
						alert(json.msg);
					}
				}, param, true);
			});
			if(callBackFun != undefined){
				callBackFun();
			};
		}
};


