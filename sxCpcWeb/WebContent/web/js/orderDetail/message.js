var message = new Function() ;

message.prototype = {
		serviceOrderCallBackrDiv : null ,
		tempServiceOrderCallBack : null  ,
		init : function (detailData,parentObj){
			
			tempServiceOrderCallBack = this ;
			tempServiceOrderCallBack.serviceOrderCallBackrDiv = $("#orderCallBack");
			tempServiceOrderCallBack.bindMetod(detailData); //方法绑定
		},
		//绑定方法
		bindMetod : function(data){
			var recordSetLength = data.recordSet.length-1;
			tempServiceOrderCallBack.serviceOrderCallBackrDiv.find("#confCallBack").unbind("click").bind("click",function(){
					var diposeFlowRecord = tempServiceOrderCallBack.serviceOrderCallBackrDiv.find("#callBackDesc").val();
					if(diposeFlowRecord.length == 0 ){
						layer.alert("请填写留言说明",8);
						return false;
					}
					if(diposeFlowRecord.length > 1000){
						layer.alert("留言说明不能超过1000字",8);
						return false;
					}			
					var param = {
							"methodtype"        :"update",
							"busi_id"    		: 	data.serviceInst.service_id								,
							"opt_desc"   		: 	diposeFlowRecord										,
						
		 				};
					$.jump.ajax(UPDATE_FLOW_RECORD.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('留言成功!',9);
						temp.init();
					}else{
						alert(json.msg);
					}
				}, param, true);
			});
			
		}
};


