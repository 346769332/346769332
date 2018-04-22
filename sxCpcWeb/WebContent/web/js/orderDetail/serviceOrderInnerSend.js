var ServiceOrderInnerSend = new Function() ;

ServiceOrderInnerSend.prototype = {
		orderTurnSentDiv : null ,
		tempOrderTurnSent : null  ,
		init : function (detailData,callBackFun,parentObj){
			
			tempOrderTurnSent = this ;
			tempOrderTurnSent.orderTurnSentDiv = $("#orderTurnSent");
			tempOrderTurnSent.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			
			var staffId=detailData.staffId;
			var recordSetLength = detailData.recordSet.length-1;
			//组织机构
	 			tempOrderTurnSent.orderTurnSentDiv.find("#chooseStaff").unbind("click").bind("click",function(){
	 				//
	  			    var parentObj =this ;
	  				$.jump.loadHtml("sysRegionDiv","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
	 					$("#serviceInfo_list_main").hide();//将之前的html部分内容隐藏
	 					parentObj.sysRegion = new SysRegion();
	 					temp.proDept = "proDept";  //根据登录人展示所属的专业部门
						
	 					
	 					temp.busi_id=detailData.recordSet[recordSetLength].busi_id;//查询部门内部人员
	 					parentObj.sysRegion.init(1,temp,function(){
	 						var staffName = '' ;
	 						var staffs = '' ;
	 						var loginCode = '';
		 					var mobTel = '';
	   						$("#sysRegion").hide();
	  			 			$("#serviceInfo_list_main").show();
	   			 			$.each(this.getChooseStaffs(),function(key,obj){
	  			 				staffName = staffName + obj.staff_name + ',';
	  			 				staffs  = staffs + obj.staff_name + ','+ obj.staff_id + ','+ obj.org_id + ',';
	  			 				loginCode = obj.login_code;
	  			 				mobTel = obj.mob_tel;
	  						});
	  			 			$("#to_name").val(staffName.substring(0, staffName.length-1));
	  			 			$("#to_name").attr("staffs", staffs.substring(0, staffs.length-1));
	  			 			$("#to_name").attr("loginCode", loginCode);
	  			 			$("#to_name").attr("mobTel", mobTel);
	   			 			temp = temp.parentObj;
	 					});
	 				},null);
	 				 
	 	 		});
	 		
			tempOrderTurnSent.orderTurnSentDiv.find("#toA").unbind("click").bind("click",function(){
				
 				var to_name = $("#to_name").attr("staffs");
 				var loginCode = $("#to_name").attr("loginCode");
 				var mobTel = $("#to_name").attr("mobTel");
 				var to_desc = $("#to_desc").val();
 				if(to_name == null || to_name.length < 1){
 					layer.alert("请选择转派人",8);
 					return ;
 				}
 				var default_opt_id = '' ;
 				var default_opt_name = '' ;
 				var staffStr  = to_name.split(',');
 				default_opt_id = staffStr[1];
 				default_opt_name = staffStr[0] ;
 				var org_id = staffStr[2];
 				
 				if(staffStr[1]==staffId){
 					layer.alert("转派人不能是本人",8);
 					return ;
 				}
 				if(to_desc == null || to_desc.length < 1) {
 					layer.alert("请填写转派说明",8);
 					return;
 				}
 				if(to_desc.length > 1000){
 					layer.alert("转派说明不能超过1000字",8);
 					return false;
 				}
 				var record_list = new Array();
 				var record_proc_1 =  {"attr_id" : '6' ,  
 						"attr_value" : to_name ,
 						"busi_id" : detailData.serviceInst.service_id ,
 						"attr_group" : '3'
 				      } ;
 				var record_proc_2 =  {"attr_id" : '10' , 
 						"attr_value" : to_desc ,
 						"busi_id" : detailData.serviceInst.service_id,
 						"attr_group" : '3'
 				      } ;
 				record_list.push(record_proc_1);
 				record_list.push(record_proc_2);
 				
 				//转派参数
 				var calim_limit = '';
 				
				var service = {"service_id" : detailData.serviceInst.service_id,"service_theme":detailData.serviceInst.service_theme,"tel" : detailData.serviceInst.tel};
 			//	var demand = {"demand_id" : detailData.serviceInst.service_id,"tel" : detailData.serviceInst.tel,"demand_theme":detailData.serviceInst.service_theme};
//  				$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(data) {
//  					
//  					if(data.code == 0){
//  						if(data.poolLst !=null && data.poolLst.length > 0){}else {
//  							layer.alert("该员工没有归属单池,不能转派!",8);
//  							flag = true ;
//  						}
//						
// 					}else{
//						layer.alert(data.msg,8);
//						flag = true ;
//					}
//				}, param1, true);
//					$.each(data.poolLst,function(key,obj){
//						pool_id = pool_id +obj.pool_id+ ',';
//						calim_limit = obj.calim_limit;
//					});
 				
					var flow_record = { 
//							"next_node_id"   			: 		"100101"								,
//							"calim_limit"				:		calim_limit								,
//							"next_node_name"   			: 		"待认领"									,
							"urge_count"   				: 		"0"										,
							"busi_id"   				: 		detailData.serviceInst.service_id		,
							"opt_desc"   				: 		''										,
							"opt_time"   				: 		detailData.recordSet[recordSetLength].opt_time								,
							"default_opt_id" 			: 		default_opt_id							,
							"default_opt_name" 			:		default_opt_name						,
							"record_id" 				: 		detailData.recordSet[recordSetLength].record_id								,
							"opt_id" 					: 		default_opt_id	,
							"opt_name" 					: 		default_opt_name								,
							"opt_type" 					: 		"liuzhuan"								,
							"funTypeId"					:		"10007777"								,
							"currNode_id"				:		detailData.recordSet[recordSetLength].curr_node_id
					};
				
				var param = {
						"handleType"	:	"3"								 ,
	 					"service" 	    : 	 JSON.stringify(service	)		 ,
	 					"flow_record"	:	 JSON.stringify(flow_record	)    ,
	 					"record_proc"   :    JSON.stringify(record_list)	 ,
	 					"loginCode"		:	 loginCode						 ,
	 				    "mobTel"		:	 mobTel							 ,
	 				    "to_name"		:	 default_opt_name
	 				};
				$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('转派成功!',9);
						$("#to_name").val('');
						$("#to_name").removeAttr("staffs");
						location.reload() ;
					}else{
						layer.alert(json.msg,8);
					}
				}, param, true);
				
  			  
 	 		});
			
			if(callBackFun != undefined){
				callBackFun();
			};
		}
};


