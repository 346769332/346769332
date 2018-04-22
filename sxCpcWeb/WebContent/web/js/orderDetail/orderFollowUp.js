var OrderFollowUp = new Function() ;

OrderFollowUp.prototype = {
		orderFollowUpDiv : null ,
		tempOrderFollowUp : null  ,
		init : function (detailData,callBackFun,parentObj){
			tempOrderFollowUp = this ;
			tempOrderFollowUp.orderFollowUpDiv = $("#orderFollowUp");
			tempOrderFollowUp.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			tempOrderFollowUp.dateBind(tempOrderFollowUp.orderFollowUpDiv.find("#opt_date"), 0);
			
			tempOrderFollowUp.orderFollowUpDiv.find("#addRecordProcA").unbind("click").bind("click",function(){
				
 				var opt_name = tempOrderFollowUp.orderFollowUpDiv.find("#opt_name").val();
 				var opt_status = tempOrderFollowUp.orderFollowUpDiv.find("#opt_status").val();
 				var opt_date = tempOrderFollowUp.orderFollowUpDiv.find("#opt_date").val();
 				var opt_desc = tempOrderFollowUp.orderFollowUpDiv.find("#opt_desc").val();
 				if(opt_desc.length > 1000){
 					layer.alert("处理说明不能超过1000字",8);
 					return false;
 				}
 				if(opt_desc ==null || opt_desc.length < 1) {
 					layer.alert("请填写处理说明",8);
 					return;
 				}
 				var record_list = new Array();
 				var temp_attr_group="2"+common.date.nowTimeNotYear();
 				var record_proc_1 =  {"attr_id" : '7' ,  
 						"attr_value" : opt_status ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_2 =  {"attr_id" : '8' , 
 						//"attr_value" : opt_date ,
 						"attr_value" : "newDate" ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_3 =  {"attr_id" : '9' ,  
 						"attr_value" : opt_name ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				var record_proc_4 =  {"attr_id" : '11' ,  
 						"attr_value" : opt_desc ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : temp_attr_group
 				      } ;
 				record_list.push(record_proc_1);
 				record_list.push(record_proc_2);
 				record_list.push(record_proc_3);
 				record_list.push(record_proc_4);
 				var demand = {"demand_id" : detailData.demandInst.demand_id,"tel" : detailData.demandInst.tel,"demand_theme":detailData.demandInst.demand_theme};
 				var flow_record = { "record_id"   : detailData.demandInst.curr_record_id,"funTypeId" : "100002"};
 				var param = {
 						"handleType"	:	"4"								,
 	 					"demand" 	    : 	 JSON.stringify(demand)			,
 	 					"flow_record"	:	 JSON.stringify(flow_record)	,
 	 					"record_proc"   :    JSON.stringify(record_list)
 	 				};
 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
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


