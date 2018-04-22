var OrderToSend = new Function() ;

OrderToSend.prototype = {
		orderToSendDiv : null ,
		tempOrderToSend : null  ,
		init : function (detailData,callBackFun){
			tempOrderToSend = this ;
			tempOrderToSend.orderToSendDiv = $("#orderToSend");
			tempOrderToSend.bindMetod(detailData); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData){
			//绑定分发
				tempOrderToSend.orderToSendDiv.find("a[name=confirmTosend]").unbind("click").bind("click",function(){
					var mobTel = tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("mob_tel");
					var login_code = tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("login_code");
					var demand = {"demand_id" : detailData.demandInst.demand_id,
							 "login_code" : login_code ,
							 "tel" : mobTel,
							 "demand_theme":detailData.demandInst.demand_theme,
							 };
					var toSendDetail = tempOrderToSend.orderToSendDiv.find("textarea[name=toSendDetail]");
 					if(toSendDetail == null || toSendDetail.length < 1) {
 	 					layer.alert("请填写转派说明",8);
 	 					return;
 	 				}
					var flow_record = {	
 							"record_id" 	 	 : 		detailData.demandInst.curr_record_id 					,
 							"default_opt_id"     : 		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("staffId")	,
 							"default_opt_name"	 :		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").val()			,
 							"funTypeId"			 :       "100000",
 							"promoters"           : detailData.demandInst.promoters,//为了发送短信而添加的
							"promoters_tel"       : detailData.demandInst.tel,//为了发送短信而添加的
 				};
 				var record_procLst = [];
 				var record_proc1 = {
 						"attr_id"		:	"10"												,
						"attr_value"	:	tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").val()		,
						"busi_id"		:	detailData.demandInst.demand_id						,
						"attr_group"	:	"4"
 				};
 				var record_proc2 = {
 						"attr_id"		:	"6"													,
						"attr_value"	:	tempOrderToSend.orderToSendDiv.find("textarea[name=toSendDetail]").val()	,
						"busi_id"		:	detailData.demandInst.demand_id						,
						"attr_group"	:	"4"
 				};
 				var record_proc3 = {
 						"attr_id"		:	"17"												,
						"attr_value"	:	"newDate"											,
						"busi_id"		:	detailData.demandInst.demand_id						,
						"attr_group"	:	"4"
 				};
 				record_procLst.push(record_proc1);
 				record_procLst.push(record_proc2);
 				record_procLst.push(record_proc3);
 				var param = {
 						"handleType"		:	 "1"								,//分发
 	 					"demand" 	    	: 	 JSON.stringify(demand)				,
 	 					"flow_record"		:	 JSON.stringify(flow_record)	    ,
 	 					"record_proc"   	:    JSON.stringify(record_procLst)
 	 				};
 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(data) {
					if(data.code == 0){ 
					  layer.alert('分发成功!',9);
					   window.open('orderDetail.html?demandId='+detailData.demandInst.demand_id+'&isHistory=Y&handleType=query');
					  window.close();
					}else{
						layer.alert("分发失败："+data.msg,8);
					}
				}, param,true);
			});	
				
			//转派人选择
			tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").unbind("click").bind("click",function(){
				
				var parentObj =this ;
  				$.jump.loadHtml("sysRegionDiv","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
  					var currSelector = $("#demandInfo");
 					currSelector.find("#demandInfo_list_main").hide();
 					parentObj.sysRegion = new SysRegion();
 					temp.staff_style = 1 ; //只查询综支中心
 					temp.busi_id=detailData.demandInst.demand_id;
 					parentObj.sysRegion.init(1,temp,function(){
 						var staffName = '' ;
 						var staffId = '' ;
 						var mob_tel  ='';
   						$("#sysRegion").hide();
  			 			$("#demandInfo_list_main").show();
   			 			$.each(this.getChooseStaffs(),function(key,obj){
  			 				staffName = staffName + obj.staff_name + ',';
  			 				staffId  = staffId + obj.staff_id + ',';
  			 				mob_tel = obj.mob_tel;
  			 				login_code = obj.login_code;
  						});
   			 		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").val(staffName.substring(0, staffName.length-1));
   			 		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("staffId", staffId.substring(0, staffId.length-1));
   			 		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("mob_tel", mob_tel);
   			 		tempOrderToSend.orderToSendDiv.find("input[name=toSendUser]").attr("login_code", login_code);
 					});
 				},null);
 				 
			});
			
			if(callBackFun != undefined){
				callBackFun();
			};
		}
};


