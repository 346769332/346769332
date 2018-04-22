var orderDealData={
 		//处理跟进数据
 		dealFollowUpInfo:function(data){
 			var followUpSet=[];
 			var array=[];
 			if(null!=data && data.length>0){
 				//获取跟进次数
 				$.each(data,function(i,obj){
 					var count=0;
 					if(obj.attr_group.charAt(0)=="2"){
 						$.each(array,function(key,value){
 							if(value==obj.attr_group){
 								count++;
 							}
 						});
 						if(count==0){
 							array.push(obj.attr_group);
 						}
 					}
 				});
 				
 				if(array.length>0){
 					$.each(array,function(i,obj1){
 						var followUpObj={};
 						followUpObj.curr_flag="false";
 						followUpObj.curr_node_name="待处理";
 						followUpObj.fun_name="跟进";
 						followUpObj.busi_id="-";
 						followUpObj.mob_tel="-";
 						followUpObj.time_count="-";
 						followUpObj.urge_count="-";
 						followUpObj.record_status_name="-";
 						followUpObj.next_node_id="-1";
 						$.each(data,function(j,obj2){
 		 					if(obj2.attr_group==obj1){
 		 						followUpObj.busi_id=obj2.busi_id;
 		 						followUpObj.record_id=obj2.record_id;
 		 						var temp_attr_value=obj2.attr_value;
 		 						if("7"==obj2.attr_id){// 处理状态-暂未显示
 		  							//followUpObj.state=temp_attr_value;
 		 						} else if("8"==obj2.attr_id){//处理时间
 		 							followUpObj.opt_time=temp_attr_value.replaceAll("/","-");
 		 						} else if("9"==obj2.attr_id){//处理人
 		 							followUpObj.opt_name=temp_attr_value;
 		 						}else if("11"==obj2.attr_id){
 		 							followUpObj.opt_desc=temp_attr_value;
 		 						}
 		 					} 
 		 				});
 						followUpSet.push(followUpObj);
 					});
 				}
 			}
 			return  followUpSet;
 		}
};