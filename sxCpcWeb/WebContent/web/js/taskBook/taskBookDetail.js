var TaskBookDetail=new Function();
TaskBookDetail.prototype={
		temp :null,
		taskCode : null,
		taskInfo :null,
		recordSet : null,
		init : function(){
			
			temp=this;
			temp.getRequest();
			temp.bindMethod(temp);
		},
		getRequest: function(){
			var url=location.search; //获取url中"?"符后的字串
			var paramReq=new Object();
			var str=url.substr(1);
			strs=str.split('&');
			for(var i=0;i<strs.length;i++){
				var param=strs[i].split('=');
				paramReq[param[0]]=param[1];
			}
			temp.taskCode=paramReq['taskCode'];
		},
		bindMethod : function(temp){
			var param={
					"taskCode" : temp.taskCode,
			};
			
			$.jump.ajax(SEARCH_TASK_BOOK_INFO.encodeUrl(),function(json){
				
				if(json.code=="0"){//查询成功
					var taskInfo=json.taskInfo;
					var recordSet=json.recordSet;
					temp.taskInfo=taskInfo;
					temp.recordSet=recordSet;
					if(recordSet!==""&&recordSet!=null&&recordSet!=undefined){
						var currLength=recordSet.length-1;
						var curr_node_id=recordSet[currLength].curr_node_id;
						var opt_id=recordSet[currLength].opt_id;
						if("100301"==curr_node_id&&opt_id==json.staff_id){
							$('#approval').show();
						}
					}
					//temp.setPageParam(taskInfo);
					temp.setFlowTable(recordSet);
					
				}
			},param,true,false);
			//提交审批意见
			$('#submit').unbind('click').bind('click',function(){
				var optRet=$('#approval').find('input[name=optRet]:checked').val();
				var optDesc=$('#optDesc').val();
				if("nopass"==optRet){//审批不通过时必须填写审批意见
					if(""==optDesc||optDesc==null||optDesc==undefined){
						layer.alert("审批不通过时必须填写审批意见",8);
						return;
					}
				}
				var currLength=temp.recordSet.length-1;
				var promoters_id="";
				var promoters_name="";
				var record_id=""
				if(temp.taskInfo!==""&&temp.taskInfo!=null&&temp.recordSet!=""&&temp.recordSet!=null){
					promoters_id=temp.taskInfo.promoters_id;
					promoters_name=temp.taskInfo.promoters_name;
					record_id=temp.recordSet[currLength].record_id;
				}
				var param={
						"busi_id" :  temp.taskCode,
						"optRet"  :  optRet,
						"optDesc" : optDesc,
						"promoters_id" : promoters_id,
						"promoters_name" : promoters_name,
						"record_id" : record_id,
						"opt_time" : temp.recordSet[currLength].opt_time
				};
				$.jump.ajax(URL_TASK_FLOW_RECORD.encodeUrl(),function(json){
					if(json.code=="0"){
						layer.alert(json.msg,9);
						location.reload();
					}else{
						layer.alert(json.msg,8);
					}
				},param,true,false);
			});
		},
		setFlowTable : function(recordSet){
			
			var flowDiv=$('#recordOfTaskInfo');
			var html=[];
			var recordLength=recordSet.length-1;
			$.each(recordSet,function(i,obj){
				html.push('<tr>');
				html.push('<td style="width: 10%;">'+(i+1)+'</td>');
				html.push('<td style="width: 15%;">'+obj.curr_node_name+'</td>');
				html.push('<td style="width: 20%;">'+obj.fun_name+'</td>');
				html.push('<td style="width: 15%;">'+obj.opt_name+'</td>');
				if(i==recordLength&&"100303"!=obj.curr_node_id){
					html.push('<td style="width: 20%;"></td>');
				}else{
					html.push('<td style="width: 20%;">'+obj.opt_time+'</td>');
				}
				
				//html.push('<td style="width: 10%;">'+obj.next_node_name+'</td>');
				html.push('<td style="width: 20%;">'+obj.opt_desc+'</td>');
				html.push('</tr>');
			});
			flowDiv.append(html.join(''));
		},
};

$(document).ready(function(){
	var taskDetail = new TaskBookDetail();
	taskDetail.init();
});