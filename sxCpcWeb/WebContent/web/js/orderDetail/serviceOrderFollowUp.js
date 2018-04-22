var ServiceOrderFollowUp = new Function() ;

ServiceOrderFollowUp.prototype = {
		serviceserviceOrderFollowUpDiv : null ,
		tempServiceOrderFollowUp : null  ,
		init : function (detailData,callBackFun,parentObj){
			tempServiceOrderFollowUp = this ;
			tempServiceOrderFollowUp.serviceOrderFollowUpDiv = $("#orderFollowUp");
			
			tempServiceOrderFollowUp.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(data,callBackFun){
			tempServiceOrderFollowUp.dateBind(tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#opt_date"), 0);
			tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#addRecordProcA").unbind("click").bind("click",function(){
				
 				var opt_name = tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#opt_name").val();
 				var opt_status = tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#opt_status").val();
 				var opt_date = tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#opt_date").val();
 				var opt_desc = tempServiceOrderFollowUp.serviceOrderFollowUpDiv.find("#opt_desc").val();
 				if(opt_desc.length > 1000){
 					layer.alert("处理说明不能超过1000字",8);
 					return false;
 				}
 				
 				var record_list = new Array();
 				var temp_attr_group="2"+common.date.nowTimeNotYear();
 				var record_proc_1 =  {"attr_id" : '7' ,  
 						"attr_value" : opt_status ,
 						"busi_id" : data.serviceInst.service_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_2 =  {"attr_id" : '8' , 
 						"attr_value" : "newDate" ,
 						"busi_id" : data.serviceInst.service_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_3 =  {"attr_id" : '9' ,  
 						"attr_value" : opt_name ,
 						"busi_id" : data.serviceInst.service_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_4 =  {"attr_id" : '11' ,  
 						"attr_value" : opt_desc ,
 						"busi_id" : data.serviceInst.service_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				record_list.push(record_proc_1);
 				record_list.push(record_proc_2);
 				record_list.push(record_proc_3);
 				record_list.push(record_proc_4);
 				var service = {"service_id" : data.serviceInst.service_id,"demand_type" : data.serviceInst.demand_type};
 				var flow_record = { "record_id"   : data.serviceInst.curr_record_id,"funTypeId" : "100076"};
 				var param = {
 	 					"service" 	    : 	 JSON.stringify(service)			,
 	 					"flow_record"	:	 JSON.stringify(flow_record)		,
 	 					"record_proc"   :    JSON.stringify(record_list)		,
 	 					"otherInfo"		:	 JSON.stringify(data.otherInfo)	
 	 				};
 				$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('跟进成功!',9);
						location.reload();
					}else{
						layer.alert(json.msg,8);
					}
				}, param, true);
 	 		});
			
			if(callBackFun != undefined){
				callBackFun();
			};
		},
		dateBind : function(obj,AddDayCount){
 			var d = new Date();
 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
 			var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
 			obj.val(newDate);
 		}
};


