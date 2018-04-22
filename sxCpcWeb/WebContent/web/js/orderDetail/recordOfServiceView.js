var RecordOfServiceView = new Function() ;

RecordOfServiceView.prototype = {
		serviceId : null ,
		isHistory : null ,
		handleType : null,
		currSelector : null ,
		temp : null  ,
		init : function (){
			temp = this ;
 			temp.GetRequest();
			currSelector = $("#recordOfServiceViewInfo");
			temp.serviceInfo();
		},
		GetRequest : function (){
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			var str = url.substr(1);
		      strs = str.split("&");
		      for(var i = 0; i < strs.length; i ++) {
		         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		      }
		      temp.serviceId = theRequest['serviceId'];
		      temp.isHistory = 'Y'; //默认全部展示
		      temp.handleType = theRequest[' '];
 		},
 		
		serviceInfo : function(){
			var param = {
 					"serviceId" 	: 		temp.serviceId				,
 					"isHistory"		:		temp.isHistory				 
 				};
 				$.jump.ajax(URL_QUERY_SERVICE_INFO.encodeUrl(), function(data) {
 					
 					var tempSet=[];
 					var html = [];
 					var recordSet = data.recordSet ;
 					$.each(recordSet,function(key,obj){
 						var tempObj=obj;
 						if(key == recordSet.length-1){
 							temp.opt_time = obj.opt_time ;
 							tempObj.new_record_id=tempObj.record_id+1000000;
							tempObj.new_opt_time=common.date.maxTime();
 						}else{
 							/*tempObj.opt_time=recordSet[key+1].opt_time;
 							tempObj.new_opt_time=recordSet[key+1].opt_time;*/
 							tempObj.opt_time=recordSet[key].opt_time;
 							tempObj.new_opt_time=recordSet[key].opt_time;
 						}
// 						tempObj.orderBy=common.utils.getNumber(tempObj.record_id+" "+tempObj.opt_time);
 						tempObj.orderBy=common.utils.getNumber(tempObj.new_opt_time);
 						tempSet.push(tempObj);
 					});
 					
 					
 					var recordProcSet=orderDealData.dealFollowUpInfo(data.recordProcSet);	
 					
 					$.each(recordProcSet,function(i,obj){
// 						obj.orderBy=common.utils.getNumber(obj.record_id+" "+obj.opt_time);
 						obj.new_opt_time=obj.opt_time;
 						obj.orderBy=common.utils.getNumber(obj.new_opt_time);
 						tempSet.push(obj);
 					});
 					
 					tempSet.sort(common.objectCompare("orderBy", "ASC"));
 					
 					
 					var xhNum=0;
 					$.each(tempSet,function(key,obj){
 						
 						xhNum++;
 						html.push('<tr name="service_info">');
 						html.push('<td align="left">'+xhNum+'</td>') ;
 						html.push('<td >'+obj.curr_node_name+'</td>') ;
 						
 						html.push('<td  >'+obj.opt_name+'</td>') ;
 						if(key == tempSet.length-1){
 							if(obj.next_node_id=='-1'){
 								html.push('<td >'+obj.opt_time+'</td>') ;
 							}else{
 								html.push('<td ></td>') ;
 							}
 						}else{
 							html.push('<td  >'+obj.opt_time+'</td>') ;
 						}
 						html.push('<td >'+obj.mob_tel+'</td>') ;
 						html.push('<td >'+obj.time_count+'</td>') ;
 						html.push('<td >'+obj.urge_count+'</td>') ;
 						html.push('<td >'+obj.record_status_name+'</td>') ;
						html.push('</tr>');
						html.push('<tr>');
						html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">处理意见:'+obj.opt_desc+'</td>') ;
						html.push('</tr>');
  					});
 					
 					
 					currSelector.find("#tableDataTbody").html(html.join(''));
 				}, param, true,false);
 		},
 		
};

$(document).ready(function(){
	var recordOfServiceView = new RecordOfServiceView();
	recordOfServiceView.init();
});

