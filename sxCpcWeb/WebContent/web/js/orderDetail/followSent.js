var FollowSent = new Function() ;
//四中心的下派功能
FollowSent.prototype = {
		followSentDiv : null ,
		tempFollowSent : null  ,
		init : function (detailData,callBackFun,parentObj){
			
			tempFollowSent = this ;
			tempFollowSent.followSentDiv = $("#followSent");
			tempFollowSent.bindMetod(detailData,callBackFun); //方法绑定
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			var recordSetLength = detailData.recordSet.length-1;
			//组织机构
	 			tempFollowSent.followSentDiv.find("#chooseDept").unbind("click").bind("click",function(){
	 				//
	  			    var parentObj =this;
	  			    //alert(JSON.stringify(detailData.regionCode));
	  			    //西安市和其他地市不同
 					if("290"==detailData.regionCode  || true){
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
	 					 		$('#dept_name').val(orgName.substring(0, orgName.length-1));
	 					 		$('#dept_name').attr("orgid",orgId.substring(0, orgId.length-1));
	 					 		$('#dept_name').attr("pid",pid.substring(0, pid.length-1));
	 					 		temp = temp.parentObj;

	 						},"zzDept");
	  				     },null);
	 				}
	 	 		});
	 		
			tempFollowSent.followSentDiv.find("#toSent").unbind("click").bind("click",function(){
 				var dept_name = $("#dept_name").val();
 				if(dept_name == null || dept_name.length < 1){
 					layer.alert("请选择指派人",8);
 					return ;
 				}
 				var sent_desc = $("#sent_desc").val();
 				if(sent_desc == null || sent_desc.length < 1) {
 					layer.alert("请填写指派说明",8);
 					return;
 				}
 				if(sent_desc.length > 1000){
 					layer.alert("指派说明不能超过1000字",8);
 					return false;
 				}
 				var record_list = new Array();
 				var record_proc_1 =  {"attr_id" : '6' ,  
 						"attr_value" : dept_name ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : '3'
 				      } ;
 				var record_proc_2 =  {"attr_id" : '10' , 
 						"attr_value" :sent_desc ,
 						"busi_id" : detailData.demandInst.demand_id ,
 						"attr_group" : '3'
 				      } ;
 				record_list.push(record_proc_1);
 				record_list.push(record_proc_2);
 				var default_opt_id = '' ;
 				var default_opt_name = '' ;
 				var opt_name="";
 				var org_id='';
 			    org_id=$("#dept_name").attr("orgid");
 				opt_name=$("#dept_name").val();
			    var demand = {"demand_id" : detailData.demandInst.demand_id,"tel" : detailData.demandInst.tel,"demand_theme":detailData.demandInst.demand_theme};
			    var flow_record = { 
						"next_node_id"   			: 		"100102"								,
						"urge_count"   				: 		"0"										,
						"busi_id"   				: 		detailData.demandInst.demand_id			,
						"opt_desc"   				: 	    sent_desc										,
						"opt_time"   				: 		detailData.recordSet[recordSetLength].opt_time								,
						"default_opt_id" 			: 		default_opt_id							,
						"default_opt_name" 			:		default_opt_name						,
						"record_id" 				: 		detailData.recordSet[recordSetLength].record_id								,
						"opt_id" 					: 		org_id 	,
						"opt_name" 					: 		opt_name								,
						"funTypeId"					:		"100100"								,
						"currNode_id"				:		detailData.recordSet[recordSetLength].curr_node_id,
						"region_code"               :       detailData.regionCode,
						"org_id"                    :       org_id,
						"promoters"                 :       detailData.demandInst.promoters,//为了发送短信而添加的
						"promoters_tel"             :       detailData.demandInst.tel//为了发送短信而添加的
				};
				
				var param = {
						"handleType"	:	"3"								 ,//指派
						"demand" 	    : 	 JSON.stringify(demand	)		 ,
						"flow_record"	:	 JSON.stringify(flow_record	)    ,
						"record_proc"   :    JSON.stringify(record_list)	 
					};
				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
					if(json.code == 0){
						layer.alert('指派成功!',9);
						$("#dept_name").val('');
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


