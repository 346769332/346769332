var OrderClaim = new Function() ;

OrderClaim.prototype = {
		orderClaimDiv : null ,
		tempOrderClaimOrderClaim : null  ,
		init : function (detailData,callBackFun){
			tempOrderClaim = this ;
			tempOrderClaim.orderClaimDiv = $("#orderClaim");
			tempOrderClaim.bindMetod(detailData); //方法绑定
			tempOrderClaim.bindBaseData(detailData,callBackFun); //基础数据加载
		},
		//绑定方法
		bindMetod : function(detailData){
			//绑定认领
				tempOrderClaim.orderClaimDiv.find("a[name=confirmClaim]").unbind("click").bind("click",function(){
					
	 				var demand_type = tempOrderClaim.orderClaimDiv.find("select[name=demandType]").find('option:selected').attr('dicId');
	 				var chooseTime = tempOrderClaim.orderClaimDiv.find("select[name=processingTime]").find('option:selected').attr('dicValue');
	 				if(demand_type == ""){
	 					layer.alert("请选择需求类型",8);
	 					return false;
	 				}
	 				var overTime = tempOrderClaim.orderClaimDiv.find("td[name=endTime]").text();
	 				if(overTime == ""){
	 					layer.alert("请选择办理时限");
	 					return false;
	 				}
	 				if(chooseTime == ""){
	 					chooseTime = tempOrderClaim.orderClaimDiv.find("td[name=endTime]").attr("limitTime");
	 				}
	 				var recordSetLength = detailData.recordSet.length-1;
	 				var demand_type_name = tempOrderClaim.orderClaimDiv.find("select[name=demandType]").val();
					var demand = {
								"demand_id" 			: 	detailData.demandInst.demand_id					,
								"demand_type"			:   demand_type										,
								"demand_type_name"		:	demand_type_name								,
								"over_limit"			:	overTime										,
								"demand_theme"			:	detailData.demandInst.demand_theme				,
								"tel"					:	detailData.demandInst.tel						,
								"limit_time"			:	chooseTime
								};
	 				var flow_record = {	
	 							"record_id" 		: 		detailData.demandInst.curr_record_id 		,
	 							"next_node_name"   	: 		"待处理"										,
	 							"urge_count"   		: 		"0"											,
	 							"busi_id"    		: 		detailData.demandInst.demand_id				,
	 							"opt_time"			: 	 	detailData.recordSet[recordSetLength].opt_time	,
	 							"opt_desc"			:		"" 											,
	 							"funTypeId"			:       "100001"
	 				};
	 				var record_procLst = [];
	 				var param = {
	 						"handleType"	:	"0"									,	
	 	 					"demand" 	    : 	 JSON.stringify(demand)				,
	 	 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
	 	 					"record_proc"   :    JSON.stringify(record_procLst)
	 	 				};
	 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(data) {
						if(data.code == 0){
							layer.alert('认领成功!',9);
							location.replace('orderDetail.html?demandId='+detailData.demandInst.demand_id+'&isHistory=Y&handleType=dispose');
							
						}else{
							layer.alert("认领失败："+data.msg,8);
						}
					}, param,true);
				});
				
				//小型工程处理
 				tempOrderClaim.orderClaimDiv.find("select[name=demandType]").unbind("change").bind("change",function(){
 					var selectedId = $(this).find('option:selected').attr('dicId');
 					var overTimeObj = tempOrderClaim.orderClaimDiv.find("input[name=overTime]");
 					var processingTimeObj = tempOrderClaim.orderClaimDiv.find("select[name=processingTime]");
 					if( selectedId == "10004"){
 						processingTimeObj.show();
 						tempOrderClaim.orderClaimDiv.find("div[name=isXygcDiv]").show();
 						tempOrderClaim.bindCheckBox(detailData);
 					}else if (selectedId == "10015"){
 						overTimeObj.show();
 						processingTimeObj.hide();
 						tempOrderClaim.dateBind(overTimeObj,0);
 						overTimeObj.unbind("blur").bind("blur",function(){
 							
 							var param = {
 		 							"handleType" 		: 		"computeDate"						,
 		 							"overTime"			:		overTimeObj.val()					
 		 					};
 		 					$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
 		 						if(json.code =="0"){
 		 							if(json.flag == 1){
 		 								layer.alert("办结时间小于当前时间，请重新选择办理时限",8);
 		 								overTimeObj.val("");
 		 								return false;
 		 							}else{
 		 								tempOrderClaim.orderClaimDiv.find("td[name=endTime]").text(overTimeObj.val());
 	 		 							tempOrderClaim.orderClaimDiv.find("td[name=endTime]").attr("limitTime",json.limitTime);
 	 		 							if(json.flag == 1){
 	 		 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").html('<font color="red">'+json.surplusTime+'</font>');
 	 		 							}else{
 	 		 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").text(json.surplusTime);
 	 		 							}
 		 							}
 		 						}else{
 		 							layer.alert(json.msg,8);
 		 						}
 		 						}, param, true);
 						});
 					}else{
 						overTimeObj.hide();
 						processingTimeObj.show();
 						if(tempOrderClaim.orderClaimDiv.find("input[name=isXygc]").is(':checked')){
 							tempOrderClaim.orderClaimDiv.find("input[name=isXygc]").click();
 						}
 						tempOrderClaim.orderClaimDiv.find("div[name=isXygcDiv]").hide();
 					}
 				});
		},
		
		//小型工程选中事件
 		bindCheckBox : function(detailData){
 			tempOrderClaim.orderClaimDiv.find("input[name=isXygc]").unbind("click").bind("click",function(){
					if($(this).is(':checked')){
						tempOrderClaim.orderClaimDiv.find("select[name=processingTime]").val("7天");
						tempOrderClaim.orderClaimDiv.find("select[name=processingTime]").attr("disabled",true); 
						var timeSelObj = tempOrderClaim.orderClaimDiv.find("select[name=processingTime]");
						var chooseTime = timeSelObj.find('option:selected').attr('dicValue');
						var param = {
	 							"handleType" 	: 		"dateCompute"		,
	 							"chooseTime"	:		chooseTime			,
	 							"createDate"	:		detailData.demandInst.create_time,
	 							"regionCode"    :       detailData.regionCode
	 					};
	 					$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
	 						if(json.code =="0"){
	 							tempOrderClaim.orderClaimDiv.find("td[name=endTime]").text(json.overTime);
	 							if(json.flag == 1){
	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").html('<font color="red">'+json.surplusTime+'</font>');
	 							}else{
	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").text(json.surplusTime);
	 							}
	 						}else{
	 							layer.alert(json.msg,8);
	 						}
	 						}, param, true);
					}else{
						tempOrderClaim.orderClaimDiv.find("select[name=processingTime]").val("4小时");
						tempOrderClaim.orderClaimDiv.find("select[name=processingTime]").attr("disabled",false); 
						var timeSelObj =tempOrderClaim.orderClaimDiv.find("select[name=processingTime]");
						var chooseTime = timeSelObj.find('option:selected').attr('dicValue');
						var param = {
	 							"handleType" 	: 		"dateCompute"		,
	 							"chooseTime"	:		chooseTime			,
	 							"createDate"	:		detailData.demandInst.create_time,
	 							"regionCode"    :       detailData.regionCode
	 					};
	 					$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
	 						if(json.code =="0"){
	 							tempOrderClaim.orderClaimDiv.find("td[name=endTime]").text(json.overTime);
	 							if(json.flag == 1){
	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").html('<font color="red">'+json.surplusTime+'</font>');
	 							}else{
	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").text(json.surplusTime);
	 							}
	 						}else{
	 							layer.alert(json.msg,8);
	 						}
	 						}, param, true);
					}
				});
 		},
		
		//绑定基础数据
		bindBaseData : function(detailData,callBackFun){
 			var timeSelObj = tempOrderClaim.orderClaimDiv.find("select[name=processingTime]");
 			var param = {
 					"handleType" 	: 		"qryData"				,
 					"regionCode"    :       detailData.regionCode,//获取本地网的工作时间信息
 				};
 			$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
					var demandType = json.demandTypeMap;
					if(demandType.code == "0" ){
						if(demandType.dicSet.length > 0){
							var html = [];
							tempOrderClaim.orderClaimDiv.find("select[name=demandType]").html("");
							html.push('<option dicId = "">请选择</option>');
							$.each(demandType.dicSet,function(i,obj){
								html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
							});
							tempOrderClaim.orderClaimDiv.find("select[name=demandType]").html(html.join(''));
						}
						
					};
 					var processingTime = json.processingTimeMap;
 					var workLength=json.workLength;
					if(processingTime.code == "0" ){
						if(processingTime.dicSet.length > 0){
							timeSelObj.html("");
							var html = [];
							html.push('<option dicId ="" dicValue="">请选择</option>');
							$.each(processingTime.dicSet,function(i,obj){
								var num=obj.dic_value.substring(0,1);
								var unit=obj.dic_value.substring(1,2);
								var optlimit = "";
								if('h'==unit){
									optlimit=num+"小时";
									html.push('<option dicId = '+obj.dic_code+' dicValue='+num+'>'+optlimit+'</option>');
								}else if('d'==unit){
									if("290"==detailData.regionCode  || true){
										optlimit=num+'*'+workLength/60+"小时";
										num=num*workLength/60;
									}else{
										optlimit=num+"天";
										num=num*workLength/60;
									}
									html.push('<option dicId = '+obj.dic_code+' dicValue='+num+'>'+optlimit+'</option>');
								}
							});
							timeSelObj.html(html.join(''));
						}
					}
					
					if(callBackFun != undefined){
						
	 					callBackFun();
	 				}
				}, param, true);
 				var timeSelObj = tempOrderClaim.orderClaimDiv.find("select[name=processingTime]");
 				
 				//时间选择绑定
 				timeSelObj.unbind("change").bind("change",function(){
 					
 					var chooseTime = timeSelObj.find('option:selected').attr('dicValue');
 					if(chooseTime != "" && chooseTime != undefined){
 						var param = {
 	 							"handleType" 	: 		"dateCompute"				,
 	 							"chooseTime"	:		chooseTime					,
 	 							"createDate"	:		detailData.demandInst.create_time,
 	 							"regionCode"    :       detailData.regionCode
 	 					};
 	 					$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
 	 						if(json.code =="0"){
 	 							tempOrderClaim.orderClaimDiv.find("td[name=endTime]").text(json.overTime);
 	 							if(json.flag == 1){
 	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").html('<font color="red">'+json.surplusTime+'</font>');
 	 							}else{
 	 								tempOrderClaim.orderClaimDiv.find("td[name=surplus]").text(json.surplusTime);
 	 							}
 	 						}else{
 	 							layer.alert(json.msg,8);
 	 						}
 	 						}, param, true,false);
 					}else{
 						tempOrderClaim.orderClaimDiv.find("td[name=surplus]").html('');
 						tempOrderClaim.orderClaimDiv.find("td[name=endTime]").html('');
 					}
 					
 				});
		},
		//时间绑定
 		dateBind : function(obj,AddDayCount){
 			var d = new Date();
 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
 			obj.datetimepicker({
 				lang		:	'ch'
 			});
 		}
};


