var ServiceOrderCallBackz = new Function() ;

ServiceOrderCallBackz.prototype = {
		serviceOrderCallBackrDiv : null ,
		tempServiceOrderCallBack : null  ,
		init : function (detailData,callBackFun,parentObj){
			tempServiceOrderCallBackz = this ;
			tempServiceOrderCallBackz.serviceOrderCallBackrDiv = $("#orderCallBack");
			tempServiceOrderCallBackz.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(data,callBackFun){
			var recordSetLength = data.recordSet.length-1;
			tempServiceOrderCallBackz.serviceOrderCallBackrDiv.find("#confCallBack").unbind("click").bind("click",function(){
					var diposeFlowRecord = tempServiceOrderCallBackz.serviceOrderCallBackrDiv.find("#callBackDesc").val();
					if(diposeFlowRecord.length == 0 ){
						layer.alert("请填写退单说明",8);
						return false;
					}
					if(diposeFlowRecord.length > 1000){
						layer.alert("退单说明不能超过1000字",8);
						return false;
					}
					var service = {"service_id" : data.serviceInst.service_id,"service_theme":data.serviceInst.service_theme,"demand_type":data.serviceInst.demand_type};
					
					var flow_record = { 
								"urge_count"   		: 	"0"														,
								"busi_id"    		: 	data.serviceInst.service_id								,
								"opt_desc"   		: 	diposeFlowRecord										,
								"opt_time"   		: 	data.recordSet[recordSetLength].opt_time				,
								"record_id" 		: 	data.serviceInst.curr_record_id							,
								"funTypeId"			:	"100096"												,				
								"default_opt_id"	:	data.serviceInst.promoters_id							,
								"default_opt_name"	:	data.serviceInst.promoters								,
								"opt_id"			: 	data.serviceInst.promoters_id							,
								"opt_name"			:	data.serviceInst.promoters,
								
					};
					var smss_record={
							"demand_id"         :   data.serviceInst.demand_id,
							"tel"               :   data.serviceInst.tel
					};
					var record_list = new Array();
					var record_proc =  {
							"attr_id" 		: 	'19' 							, // 19表示服务单打回 说明
							"attr_value" 	: 	diposeFlowRecord 				,
							"busi_id" 		: 	data.serviceInst.service_id 	,
							"attr_group" 	: 	'19'
					      } ;
					var record_proc1 =  {
							"attr_id" 		: 	'20' 							, // 20表示服务单打回时间
							"attr_value" 	: 	"newDate" 						,
							"busi_id" 		: 	data.serviceInst.service_id 	,
							"attr_group" 	: 	'20'
					      } ;
					record_list.push(record_proc);
					record_list.push(record_proc1);
					var param = {
		 					"service" 	    : 	 JSON.stringify(service)			,
		 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
		 					"record_proc"   :    JSON.stringify(record_list)		,
		 					"otherInfo"		: 	 JSON.stringify(data.otherInfo),
		 					"smss_record"   :    JSON.stringify(smss_record)
		 				};
					$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('退单成功!',9);
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


