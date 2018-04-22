var OrderTurnSent = new Function() ;

OrderTurnSent.prototype = {
		orderTurnSentDiv : null ,
		tempOrderTurnSent : null  ,
		init : function (detailData,callBackFun,parentObj){
			tempOrderTurnSent = this ;
			tempOrderTurnSent.orderTurnSentDiv = $("#orderTurnSent");
			tempOrderTurnSent.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			var recordSetLength = detailData.recordSet.length-1;
			//组织机构
	 			tempOrderTurnSent.orderTurnSentDiv.find("#chooseStaff").unbind("click").bind("click",function(){
	 				//
	  			    var parentObj =this ;
	  			    //alert(JSON.stringify(detailData.regionCode));
	  			    //西安市和其他地市不同
// 					if("290"==detailData.regionCode){
	  			    //其他地市和省级不同
	  			    
 					if("888"!=detailData.regionCode){
	  				   $.jump.loadHtml("sysRegionDiv","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
	 					    $("#demandInfo_list_main").hide();
	 					    parentObj.sysRegion = new SysRegion();
	 					   temp.busi_id=detailData.recordSet[recordSetLength].busi_id;//查询部门内部人员
	 					   temp.deptType=detailData.orgFlag;
	 					   temp.deptId=detailData.orgId;
	 						parentObj.sysRegion.init(1,temp,function(){
	 							var orgId= '';
	 							var orgName='';
	 							var pid = '';
	 							$("#sysRegion").hide();
		  			 			$("#demandInfo_list_main").show();
	 					 		$.each(this.getChooseStaffs(),function(key,obj){
	 				 				orgId = orgId + obj.org_id +',';
	 				 				orgName = orgName + obj.org_name +',';
	 				 				pid+=obj.pid+',';
	 							});
	 					 		$('#to_name').val(orgName.substring(0, orgName.length-1));
	 					 		$('#to_name').attr("orgid",orgId.substring(0, orgId.length-1));
	 					 		$('#to_name').attr("pid",pid.substring(0, pid.length-1));
	 					 		temp = temp.parentObj;

	 						},'centerDept');
	  				     },null);
	 				}else{
 						$.jump.loadHtml("sysRegionDiv","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
	 					    $("#demandInfo_list_main").hide();
	 					    parentObj.sysRegion = new SysRegion();
		 					if(detailData.recordSet[recordSetLength].curr_node_id == '200102'){
		 						temp.staff_style = 2 ; //只查询区综支中心
		 					}else{
		 						temp.wstaff_style = 1 ; //只查询综支中心
		 					}
		 					temp.busi_id=detailData.recordSet[recordSetLength].busi_id;//查询部门内部人员
		 					parentObj.sysRegion.init(1,temp,function(){
		 						var staffName = '' ;
		 						var staffs = '' ;
		 						var loginCode = '';
			 					var mobTel = '';
		   						$("#sysRegion").hide();
		  			 			$("#demandInfo_list_main").show();
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
	 				}
	 	 		});
	 		
			tempOrderTurnSent.orderTurnSentDiv.find("#toA").unbind("click").bind("click",function(){
 				var to_name = $("#to_name").val();
 				if(to_name == null || to_name.length < 1){
 					layer.alert("请选择转派人",8);
 					return ;
 				}
 				var to_desc = $("#to_desc").val();
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
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : '3'
 				      } ;
 				var record_proc_2 =  {"attr_id" : '10' , 
 						"attr_value" : to_desc ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : '3'
 				      } ;
 				record_list.push(record_proc_1);
 				record_list.push(record_proc_2);
 				var default_opt_id = '' ;
 				var default_opt_name = '' ;
 				var opt_name="";
 				var org_id='';
 				var loginCode='';
 				var mobTel='';
 				
//               if("290"==detailData.regionCode){
        	   if("888" != detailData.regionCode){
            	   org_id=$("#to_name").attr("orgid");
            	   opt_name=$("#to_name").val();
 				}else{
 					var staffStr=$("#to_name").attr("staffs").split(',');
 					loginCode = $("#to_name").attr("loginCode");
 	 				mobTel = $("#to_name").attr("mobTel");
 	 				default_opt_id = staffStr[1];
 	 				default_opt_name = staffStr[0] ;
 	 				org_id = staffStr[2];
 	 				opt_name='转派到单池';
 				}
 				//转派参数
  				var param1 = {"orgId" : org_id,"staffId": default_opt_id,"handleType":"qryPoolRel","regionCode":detailData.regionCode};
 				var pool_id = '';
 				var calim_limit = '';
 				
 				var demand = {"demand_id" : detailData.demandInst.demand_id,
 						"tel" : detailData.demandInst.tel,
 						"demand_theme":detailData.demandInst.demand_theme,
 						};
// 				if("290"==detailData.regionCode){//西安的转派给指定部门到待处理环节
				if("888" != detailData.regionCode){//西安的转派给指定部门到待处理环节
 					var flow_record = { 
 							"next_node_id"   			: 		"100102"								,
 							"urge_count"   				: 		"0"										,
 							"busi_id"   				: 		detailData.demandInst.demand_id			,
 							"opt_desc"   				: 		to_desc										,
 							"opt_time"   				: 		detailData.recordSet[recordSetLength].opt_time								,
 							"default_opt_id" 			: 		default_opt_id							,
 							"default_opt_name" 			:		default_opt_name						,
 							"record_id" 				: 		detailData.recordSet[recordSetLength].record_id								,
 							"opt_id" 					: 		org_id 	,
 							"opt_name" 					: 		opt_name								,
 							"funTypeId"					:		"100112"								,
 							"currNode_id"				:		detailData.recordSet[recordSetLength].curr_node_id,
 							"region_code"               :       detailData.regionCode,
 							"promoters"                 : detailData.demandInst.promoters,//为了发送短信而添加的
							"promoters_tel"             : detailData.demandInst.tel,//为了发送短信而添加的
 							"org_id"                    :       org_id
 					};
 					
 					var param = {
 							"handleType"	:	"3"								 ,//转派
 							"demand" 	    : 	 JSON.stringify(demand	)		 ,
 							"flow_record"	:	 JSON.stringify(flow_record	)    ,
 							"record_proc"   :    JSON.stringify(record_list)	 
 						};
 					$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
 						if(json.code == 0){
 							layer.alert('转派成功!',9);
 							$("#to_name").val('');
							$("#to_name").removeAttr("orgid");
 							location.reload() ;
 						}else{
 							layer.alert(json.msg,8);
 						}
 					}, param, true);
 				}else{
 					$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(data) {
 	  					
 	  					if(data.code == 0){
 	  						if(data.poolLst !=null && data.poolLst.length > 0){
 	  							$.each(data.poolLst,function(key,obj){
 	  		 						pool_id = pool_id +obj.pool_id+ ',';
 	  		 						calim_limit = obj.calim_limit;
 	  							});
 	   							var flow_record = { 
 	   									"next_node_id"   			: 		"100101"								,
 	   									"calim_limit"				:		calim_limit								,
 	  									"next_node_name"   			: 		"待认领"									,
 	  									"urge_count"   				: 		"0"										,
 	  									"busi_id"   				: 		detailData.demandInst.demand_id			,
 	  									"opt_desc"   				: 		''										,
 	  									"opt_time"   				: 		detailData.recordSet[recordSetLength].opt_time								,
 	  									"default_opt_id" 			: 		default_opt_id							,
 	  									"default_opt_name" 			:		default_opt_name						,
 	  									"record_id" 				: 		detailData.recordSet[recordSetLength].record_id								,
 	  									"opt_id" 					: 		pool_id.substring(0,pool_id.length-1) 	,
 	  									"opt_name" 					: 		opt_name								,
 	  									"opt_type" 					: 		"liuzhuan"								,
 	  									"funTypeId"					:		"100007"								,
 	  									"currNode_id"				:		detailData.recordSet[recordSetLength].curr_node_id,
 	  									"region_code"               :       detailData.regionCode,
 	  									"promoters"                 : detailData.demandInst.promoters,//为了发送短信而添加的
 	  									"promoters_tel"             : detailData.demandInst.tel,//为了发送短信而添加的
 	  									"org_id"                    : org_id  //为了发送短信而添加的
 	  		 					};
 	  		 				
 		  		 				var param = {
 		  		 						"handleType"	:	"3"								 ,
 		  		 	 					"demand" 	    : 	 JSON.stringify(demand	)		 ,
 		  		 	 					"flow_record"	:	 JSON.stringify(flow_record	)    ,
 		  		 	 					"record_proc"   :    JSON.stringify(record_list)	 ,
 		  		 	 					"loginCode"		:	 loginCode						 ,
 		  		 	 				    "mobTel"		:	 mobTel							 ,
 		  		 	 				    "to_name"		:	 default_opt_name
 		  		 	 				};
 		  		 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
 		  							if(json.code == 0){
 		  								layer.alert('转派成功!',9);
 		  								$("#to_name").val('');
 		  								$("#to_name").removeAttr("staffs");
 		  								location.reload() ;
 		  							}else{
 		  								layer.alert(json.msg,8);
 		  							}
 		  						}, param, true);
 	  						}else {
 	  							layer.alert("该员工没有归属单池,不能转派!",8);
 	  							flag = true ;
 	  						}
 							
 	 					}else{
 							layer.alert(data.msg,8);
 							flag = true ;
 						}
 					}, param1, true);
 				}
  			  
 	 		});
			
			if(callBackFun != undefined){
				callBackFun();
			};
		}
};


