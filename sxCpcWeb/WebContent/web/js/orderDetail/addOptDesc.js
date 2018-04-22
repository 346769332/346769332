var AddOptDesc=new Function();
AddOptDesc.prototype={
		selecter : "#orderSendPage",
		tempAddDesc :null,
		init : function (detailData){
			
			tempAddDesc = this ;
			tempAddDesc.bindMethod(detailData); //方法绑定
		},
		bindMethod : function(data){
			//查询已处理的意见
			var loginId=data.optId;
			var orgId=data.orgId;
			var recordSetLength = data.recordSet.length-1;
			var optedDesc="";
			var recordId="";
			$.each(data.recordSet,function(i,obj){
				if(loginId==obj.opt_id||orgId==obj.opt_id){
					if(obj.opt_desc!=""&&obj.opt_desc!=null&&obj.opt_desc!=undefined){
					  optedDesc=obj.opt_desc;
					  recordId=obj.record_id;
					}
				}
			});
			
			if(optedDesc!=""&&optedDesc!=null&&optedDesc!=undefined){
				var descSet=optedDesc.split("*");
				var html=[];
				$.each(descSet,function(i,obj){
					html.push('<div>'+obj+'</div>');
				});
				$('#optedDesc').html(html.join(''));
			}
			//提交再处理意见
			$('#submitDesc').unbind('click').bind('click',function(){
				var newOptDesc=$('#addDesc').val();
				if(newOptDesc==""||newOptDesc==null){
					layer.alert('提交前必须添加再处理意见',8);
					return;
				}
				var param={
						"methodtype" :"updateDesc",
						"busi_id" :data.demandInst.demand_id,
						"record_id" : recordId,
						"opt_desc" : newOptDesc,
						"optedDesc" :optedDesc
				};
				$.jump.ajax(UPDATE_FLOW_RECORD.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('添加再处理意见成功!',9);
						location.reload();
					}else{
						layer.alert(json.msg,8);
					}
				}, param, true);
			});
		},
		
};