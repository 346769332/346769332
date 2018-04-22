var RecordOfDemandView = new Function() ;

RecordOfDemandView.prototype = {
		demandId : null ,
		isHistory : null ,
		handleType : null,
		currSelector : null ,
		detailData : null,
		temp : null  ,
		opt_time : null ,
		chooseStaff : null ,
		sysRegion : null,
		record_id : null ,
		staff_style : null ,
		init : function (){
			temp = this ;
 			temp.GetRequest();
			currSelector = $("#recordOfDemandViewInfo");
			
			temp.demandInfo();
		},
		GetRequest : function (){
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			var str = url.substr(1);
		      strs = str.split("&");
		      for(var i = 0; i < strs.length; i ++) {
		         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		      }
		      temp.demandId = theRequest['demandId'];
		      temp.isHistory = 'Y'; //默认全部展示
		      temp.handleType = theRequest['handleType'];
 		},
 		
		demandInfo : function(){
 			var param = {
 					"demandId" 	: 		temp.demandId				,
 					"isHistory"	:		temp.isHistory				 
 				};
 				$.jump.ajax(URL_QUERY_DEMAND_INFO.encodeUrl(), function(data) {
 					
 					if("0"!=data.code){
 						return false;
 					}
 					//alert(JSON.stringify(data));
 					var recordSet = data.recordSet ;
 					var over_eval=data.demandInst.over_eval;
 					var html = [];
 					var currNode_id = null ;
 					var opt_time = null ;
 					var record_id = null ;
 					var tempSet=[];
 					//将流程信息添加
 					$.each(recordSet,function(key,obj){
 						var tempObj=obj;
 						if(key == recordSet.length-1){
 							currNode_id = obj.curr_node_id;
 							record_id  = obj.record_id ;
 							temp.opt_time = obj.opt_time ;
 							tempObj.new_record_id=tempObj.record_id+1000000;
							tempObj.new_opt_time=common.date.maxTime();
 						}else{
 							tempObj.opt_time=recordSet[key].opt_time;
 							tempObj.new_opt_time=recordSet[key].opt_time;
 						}
 						
 						var funId=obj.fun_id;
 						
 						if("100007"==funId && key != recordSet.length-1){
 							obj.next_record_id=recordSet[key+1].record_id;
						}else if("100006"==funId && key != recordSet.length-1){
							obj.next_record_id=recordSet[key+1].record_id;
						}
 						
// 						tempObj.orderBy=common.utils.getNumber(tempObj.record_id+" "+tempObj.opt_time);
 						tempObj.orderBy=common.utils.getNumber(tempObj.new_opt_time);
 						tempSet.push(tempObj);
 					});
 					
 					
 					//跟进数据添加
 					var recordProcSet=orderDealData.dealFollowUpInfo(data.recordProcSet);
 					$.each(recordProcSet,function(i,obj){
 						if(obj.busi_id.charAt(0)=="D"){
	// 						obj.orderBy=common.utils.getNumber(obj.record_id+" "+obj.opt_time);
	 						obj.new_opt_time=obj.opt_time;
	 						obj.orderBy=common.utils.getNumber(obj.new_opt_time);
	 						tempSet.push(obj);
 						}
 					});
 					
 					
 					//服务单数据处理
 					var recordServiceSet=data.recordServiceSet ;
 					if(null!=recordServiceSet && undefined!=recordServiceSet ){
 						
 						var recordServiceArr=[];
 						var tempRecordServiceSet=[];
 					 
 						$.each(recordServiceSet,function(key,obj){
 							obj.new_opt_time=obj.opt_time;
 							var tempCount=0;
	 						$.each(recordServiceArr,function(tempKey,tempObj){
	 							if(obj.busi_id==tempObj.busi_id){
	 								tempCount++; 
		 						 } 
	 	 					});
	 						if(tempCount==0){
	 							recordServiceArr.push(obj);
	 						};
 						});
	 					
	 					$.each(recordServiceArr,function(key,obj){
//	 						obj.orderBy=common.utils.getNumber(obj.record_id+" "+obj.opt_time);
	 						obj.orderBy=common.utils.getNumber(obj.new_opt_time);
	 						tempSet.push(obj);
	 					});
	 					
	 					//将服务单数据重组按服务单归类
	 					$.each(recordServiceArr,function(i,obj1){
	 						var tempRecordServiceArrSet=[];
	 						 $.each(recordServiceSet,function(j,obj2){
	 							  if(obj1.busi_id==obj2.busi_id){
	 								 tempRecordServiceArrSet.push(obj2); 
	 							  }
	 						 });
	 						 
	 						 $.each(tempRecordServiceArrSet,function(key,obj){
	 							var tempObj=obj;
	 	 						if(key == tempRecordServiceArrSet.length-1){
	 	 							if(obj.next_node_id!='-1'){
	 	 								tempObj.new_opt_time=common.date.maxTime();
	 	 							}else{
	 	 								tempObj.new_opt_time=obj.opt_time;
	 	 							}
	 	 						}else{
	 	 							tempObj.new_opt_time=tempRecordServiceArrSet[key+1].opt_time;
	 	 						}
	 	 						tempRecordServiceSet.push(tempObj);
	 						 });
	 					});
	 					 
 						$.each(recordProcSet,function(i,obj){
 							if(obj.busi_id.charAt(0)=="S"){
// 	 							obj.orderBy=common.utils.getNumber(obj.record_id+" "+obj.opt_time);
 								obj.new_opt_time=obj.opt_time;
 								tempRecordServiceSet.push(obj);
 							}
 	 					});
	 					tempRecordServiceSet.sort(common.objectCompare("new_opt_time", "ASC"));
 					}
  				
 					tempSet.sort(common.objectCompare("orderBy", "ASC"));
 					
 					
 					var xhNum=0;//序号
 					var dXhNum=0;//需求单序号
 					var xhCount=0;//需求单节点的服务单号
 					var view_busi_id="";
 					var serviceHeader="";
 					$.each(tempSet,function(key,obj){
 						
 						xhCount++;
 						if(obj.busi_id.charAt(0)!="S"){
 							xhNum++;
 							xhCount--;
 							if(obj.busi_id.charAt(0)=="D"){
 								view_busi_id=obj.busi_id;
 								serviceHeader=obj.curr_node_name+"--";
 								dXhNum++;
 								xhCount=0;
 								html.push('<tr name="demand_info_'+dXhNum+'" dXhNum="'+dXhNum+'">');
 							}else{
 								html.push('<tr>');
 							}
 							//评价流程添加评价星级
 							if("100103"==obj.curr_node_id&&''!=over_eval&&over_eval!=null){
 								html.push('<td align="left" rowspan="5">'+xhNum+'</td>') ;
 							}else{
 								html.push('<td align="left" rowspan="2">'+xhNum+'</td>') ;
 							}
							
							html.push('<td  >'+obj.curr_node_name+'</td>') ;
							html.push('<td  >'+obj.fun_name+'</td>') ;
							if(obj.default_opt_name != "" && obj.default_opt_name !=undefined){
								html.push('<td  >'+obj.default_opt_name+'</td>') ;
							}else{
								html.push('<td  >'+obj.opt_name+'</td>') ;
							}
							
							if(obj.record_id==record_id && obj.busi_id.charAt(0)=="D"){
								if(key!==tempSet.length-1 && tempSet[key].busi_id.charAt(0)=="S"){
									html.push('<td  >'+tempSet[key].opt_time+'</td>') ;
								}else{
									if(obj.next_node_id=='-1'){
										html.push('<td>'+obj.opt_time+'</td>') ;
									}else{
										html.push('<td></td>') ;
									}
								}
							}else{
								html.push('<td  >'+obj.opt_time+'</td>') ;
							}
							html.push('<td  >'+obj.mob_tel+'</td>') ;
							html.push('<td  >'+obj.time_count+'</td>') ;
							html.push('<td  >'+obj.urge_count+'</td>') ;
							html.push('<td  >'+obj.record_status_name+'</td>') ;
							html.push('</tr>');
							html.push('<tr>');
							html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">处理意见: &nbsp;&nbsp;') ;
							var funId=obj.fun_id;
							if("100007"==funId){
								$.each(data.recordProcSet,function(x,xObj){
									if("10"==xObj.attr_id && obj.next_record_id==xObj.record_id && view_busi_id==xObj.busi_id){
										html.push(xObj.attr_value) ;
									}
								});
							}else if("100006"==funId){
								$.each(data.recordProcSet,function(x,xObj){
									if("13"==xObj.attr_id && obj.next_record_id==xObj.record_id  && view_busi_id==xObj.busi_id ){
										html.push(xObj.attr_value) ;
									}
								});
							}else{
								var optedDesc=obj.opt_desc;
								if(optedDesc!=""&&optedDesc!=null&&optedDesc!=undefined){
									var descSet=optedDesc.split("*");
									$.each(descSet,function(i,obj){
										if(i==0){
											html.push(obj);
										}else{
										    html.push('<div>'+obj+'</div>');
										}
									});
								}
							}
							html.push('</td>') ;
							html.push('</tr>');
							//展示评价星级
							if("100103"==obj.curr_node_id&&''!=over_eval&&over_eval!=null){
								html.push('<tr>');
								html.push('<td style="width:8%;">时间评价星级: &nbsp;&nbsp;</td>') ;
								html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">') ;
								//星级评价
								for (var int = 0; int < 5; int++) {
									if(int<data.demandInst.eval_time){
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarYellow" href="javascript:void(0)"/>');
									}else{
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
									}
								}
								html.push('</td></tr>');
								html.push('<tr>');
								html.push('<td style="width:8%;">结果评价星级: &nbsp;&nbsp;</td>') ;
								html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">') ;
								//星级评价
								for (var int = 0; int < 5; int++) {
									if(int<data.demandInst.over_eval){
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarYellow" href="javascript:void(0)"/>');
									}else{
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
									}
								}
								html.push('</td></tr>');
								html.push('<tr>');
								html.push('<td style="width:8%;">态度评价星级: &nbsp;&nbsp;</td>') ;
								html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">') ;
								//星级评价
								for (var int = 0; int < 5; int++) {
									if(int<data.demandInst.eval_atti){
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarYellow" href="javascript:void(0)"/>');
									}else{
										html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
									}
								}
								html.push('</td></tr>');
							}
 						}else{
 							var sXhNum=0;
							html.push('<tr name="demand_service_info_'+dXhNum+'">');
							html.push('<td colspan="9" style="padding:0;">') ;
							html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"  class="tab5 lines f14">');	
							html.push('<thead>');	
							html.push('<tr>');
							html.push('<td colspan="9" ><strong>拆分</strong>  '+obj.busi_id+'--服务单子流程</td>');
							html.push('</tr>');
							html.push('</thead>');	
 							$.each(tempRecordServiceSet ,function(sKey,sObj){
 								if(obj.busi_id==sObj.busi_id && sObj.curr_node_id!='100100' && sObj.curr_node_id!='100101'){
 									sXhNum++;
 									html.push('<tr >');
 									html.push('<td  style="width: 4%;" rowspan="2">'+xhNum+"."+xhCount+"."+sXhNum+'</td>');
									html.push('<td  style="width: 6%;">') ;
									if(sObj.curr_node_id=='100104'){
 										html.push('已处理') ;	
 									}else{
 										html.push(sObj.curr_node_name) ;	
 									}
 									html.push('</td>') ;
 									html.push('<td  style="width: 6%;">'+sObj.fun_name+'</td>') ;
									html.push('<td  style="width: 15%;" >'+sObj.opt_name+'</td>') ;
 									html.push('<td  style="width: 15%;">'+sObj.opt_time+'</td>') ;
 									html.push('<td  style="width: 10%;">'+sObj.mob_tel+'</td>') ;
 									html.push('<td  style="width: 6%;">'+sObj.time_count+'</td>') ;
 									html.push('<td  style="width: 6%;">'+sObj.urge_count+'</td>') ;
 									html.push('<td  style="width: 8%;">'+sObj.record_status_name+'</td>') ;
 									html.push('</tr>');
 									
 									if(sObj.curr_node_id=='100107')
 										{	 									
 	 									html.push('<tr>');
 	 									html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">留言:'+sObj.opt_desc+'</td>') ;
 	 									html.push('</tr>');
 									}
 									else{
 										html.push('<tr>');
 										html.push('<td colspan="8" style="word-wrap: break-word;word-break:break-all;">处理意见:'+sObj.opt_desc+'</td>') ;
 										html.push('</tr>');
 									}
 								}
 							});
 							html.push('</table>');	
							html.push('</td>');
							html.push('</tr>');
 						}
 					});
 					
 					currSelector.find("#tableDataTbody").html(html.join(''));
 					 
 				}, param, true,false);
  				
 		}
 		
 		
 		
 		
};
 


$(document).ready(function(){
	var recordOfDemandView = new RecordOfDemandView();
	recordOfDemandView.init();
});

