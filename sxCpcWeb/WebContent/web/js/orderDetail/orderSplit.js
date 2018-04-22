var OrderSplit = new Function() ;

OrderSplit.prototype = {
		orderSplitDiv : null ,
		tempOrderSplit : null  ,
		qryType : null,
		isShowUserLst : null,
		date : null,
		init : function (detailData,callBackFun,parentObj){
			tempOrderSplit = this ;
			tempOrderSplit.orderSplitDiv = $("#orderSplit");
			tempOrderSplit.bindMetod(detailData,callBackFun); //方法绑定
		
		},
		//绑定方法
		bindMetod : function(detailData,callBackFun){
			tempOrderSplit.date = detailData;
			tempOrderSplit.serviceDateBind(currSelector.find("input[name=overLimit]"), 0);//绑定时间控件
			
			tempOrderSplit.loadServiceLst(detailData);
			var recordSetLength = detailData.recordSet.length-1;
		
			tempOrderSplit.orderSplitDiv.find("input[name=name]").unbind("click").bind("click",function(){ 
				var splitInfos =  tempOrderSplit.orderSplitDiv.find("tr[name=splitInfo]");
				
				var staffId="";
				$.each(splitInfos,function(i,obj){
					staffId = tempOrderSplit.orderSplitDiv.find("input[id=0]").attr("staffId");					
				});
					var boxObj = $(this);

					if(staffId!=''&&staffId!=undefined&&staffId!=null){
						if(boxObj.is(':checked')){	 	 				
	 	 				param={
	 	 						"staff_id":staffId,
	 	 						"methodtype": "shi"
	 	 				};
	 	 			
	 	 				$.jump.ajax(SHOW_LINGDAO.encodeUrl(), function(data) {
	 						if(data.code == 0){
	 							$.each(data.data,function(i,obj){
	 								tempOrderSplit.orderSplitDiv.find('input[name=peoplename0]').val(obj.STAFF_NAME);
	 								tempOrderSplit.orderSplitDiv.find('input[name=dept0]').val(obj.DEPARTMENT);
	 								tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos0]').attr("tel", obj.MOB_TEL);
 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos0]').attr("staffId", obj.STAFF_ID);
 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos0]').attr("peoplename", obj.STAFF_NAME);
 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos0]').attr("dept", obj.DEPARTMENT);
	 							});
	 						
	 						}
	 					}, param,true);
	 	 					
							}
					}else{
						layer.alert("拆分人员不能为空",8);
						return;
					}
				
					
				});
			
			
			tempOrderSplit.orderSplitDiv.find("a[name=addSplit]").unbind("click").bind("click",function(){
 				var flag = true;
 				var splitInfos =  tempOrderSplit.orderSplitDiv.find("tr[name=splitInfo]");
 				$.each(splitInfos,function(i,obj){
 					var splitName = $(obj).find("input[name=splitName]").val();
 					var isSave = $(obj).find("input[name=splitName]").attr("isSave");
 					var overLimit = $(obj).find("input[name=overLimit]").val();
 					if((splitName == "" || overLimit =="") && isSave == "true"){
 						flag = false;
 						layer.alert("拆分人员与办结时间不能为空",8);
 						return false;
 					};
 				});
 				if(flag){
 					var html=[];
 	 				html.push('<tr name="splitInfo" id="'+splitInfos.length+'">');
 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</br><img src="../../../web/images/delete.png" alt="" name="delSplitInfo" ></td>');
 	 				html.push('<td style="width:200px;text-align:center"><input  id="'+splitInfos.length+'" name="splitName" isSave="true" type="text" disabled="disabled" style="width:80px;"><a href="#" class="but" name="splitStaff" isMoreFlag="true">选择</a></td>');
 	 				html.push('<td style="width:200px;text-align:center"><textarea name="splitDesc" type="text" style="width: 150px;"></textarea></td>');
 	 				html.push('<td style="width:150px;text-align:center"><input name="overLimit" type="text" readonly style="width:140px;"></td>');
 	 				html.push('</tr>');
 	 				html.push('<tr name="splitInfos" id="'+splitInfos.length+'">');
 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</td>');
 	 				html.push('<td style="width:150px;text-align:center"><input type="checkbox" name="name" zdid="'+splitInfos.length+'">抄送部门领导</td>');
 	 				html.push('<td style="width:200px;text-align:center"><input name="peoplename'+splitInfos.length+'" type="text" readonly style="width:140px;"></td>');
 	 				html.push('<td style="width:150px;text-align:center"><input name="dept'+splitInfos.length+'" type="text" readonly style="width:140px;"></td>'); 	 				
 	 				html.push('</tr>');
// 	 				html.push('<tr name="splitInfoes'+splitInfos.length+'" id="'+splitInfos.length+'">');
// 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</td>');
// 	 				html.push('<td style="width:150px;text-align:center"><input type="checkbox" name="names" id="'+splitInfos.length+'">抄送省市部门领导</td>');
// 	 				html.push('<td style="width:200px;text-align:center"><input name="shpeoplenames" type="text" readonly style="width:140px;"></td>');
// 	 				html.push('<td style="width:150px;text-align:center"><input name="shdepts" type="text" readonly style="width:140px;"></td>'); 	 				
// 	 				html.push('</tr>');
 	 				
 	 				tempOrderSplit.orderSplitDiv.find("tr[name=handleInfo]").before(html.join(''));
 	 				
 	 				
 	 				tempOrderSplit.serviceDateBind(tempOrderSplit.orderSplitDiv.find("input[name=overLimit]"), 0);
 	 				//删除该行信息
 	 				tempOrderSplit.orderSplitDiv.find("img[name=delSplitInfo]").unbind("click").bind("click",function(){
 	 					//加入ID，获取到ID
 	 					var id = $(this).parents("tr[name=splitInfo]").attr("id");
 	 					
 	 					tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos][id="'+id+'"]').remove(); 
 	 			
 	 					$(this).parents("tr[name=splitInfo]").remove(); 
 	 				});
 	 				tempOrderSplit.orderSplitDiv.find("input[name=name]").unbind("click").bind("click",function(){ 	 					
 	 					var boxObj = $(this);
 	 					var id =boxObj.attr("zdid");
 				
 	 					
 	 					var staffId = tempOrderSplit.orderSplitDiv.find('input[id='+id+']').attr("staffId");
 	 					
 	 					if(staffId!=''&&staffId!=undefined&&staffId!=null){
 	 						if(boxObj.is(':checked')){
 	 	 	 					var id = $(this).attr("zdid");
 	 	 	 					
 	 	 	 				param={
 	 	 	 						"staff_id":staffId,
 	 	 	 						"methodtype": "shi"
 	 	 	 				};
 	 	 	 			
 	 	 	 				$.jump.ajax(SHOW_LINGDAO.encodeUrl(), function(data) {
 	 	 						if(data.code == 0){
 	 	 							$.each(data.data,function(i,obj){
 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=peoplename'+id+']').val(obj.STAFF_NAME);
 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=dept'+id+']').val(obj.DEPARTMENT);

	 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("tel", obj.MOB_TEL);
	 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("staffId", obj.STAFF_ID);
	 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("peoplename", obj.STAFF_NAME);
	 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("dept", obj.DEPARTMENT);
	 	 	 							
	 	 	 							
 	 	 							});
 	 	 						
 	 	 						}
 	 	 					}, param,true);
 	 	 	 					
 	 							}
 	 					}else{
 	 						layer.alert("拆分人员不能为空",8);
 	 						return;
 	 					}
						
 	 					
 	 				});
 	 				
 	 				tempOrderSplit.bindSplitStaff(detailData);//拆分人员选择
 				}
 			});
			
			tempOrderSplit.bindSplitStaff(detailData);//拆分人员选择
 			tempOrderSplit.orderSplitDiv.find("a[name=conSplit]").unbind("click").bind("click",function(){
 				var splitInfos =  tempOrderSplit.orderSplitDiv.find("tr[name=splitInfo]");
 				
 				var conSplitName = "";
 				var serviceInfoLst = [];
 				var servicelingdaoLst = [];
 				var flag = true; //是否提示
 				var saveProcFlag = true;
 				var isShowAlert = true; //是否进行alert提示
 				var moreTime = []; //大于需求单办结截止时间
 				var deOverLimit = detailData.demandInst.over_limit; //需求单办结时间
 				
 				
 				$.each(splitInfos,function(a,obj){
 					
 					
 					var splitName = $(obj).find("input[name=splitName]").val();
 					var isSave = $(obj).find("input[name=splitName]").attr("isSave");
 					var overLimit = $(obj).find("input[name=overLimit]").val();
 					var splitDesc = $(obj).find("textarea[name=splitDesc]").val();
 					if(splitName == ""){
 						isShowAlert = false;
 						layer.alert("拆分人员不能为空",8);
 						return;
 					}
 					
 					if(overLimit != undefined ){
 						if(overLimit == ""){
 	 						isShowAlert = false;
 	 						layer.alert("请选择办结时间",8);
 	 						return;
 	 					}
 	 					var overTime = new Date(overLimit.replace(/-/g,"/"));
 						var nowDate = new Date(detailData.nowDate.replace(/-/g,"/"));
 						var newoverLimit = new Date(detailData.demandInst.over_limit.replace(/-/g,"/"));
 						if(overTime <= nowDate){
 							overLimit = "";
 							layer.alert("办结截止时间不能小于当前时间");
 							isShowAlert = false;
 							return;
 						}
 						if(overTime >= newoverLimit){
 							moreTime.push(overLimit);
 							layer.alert("您当前选择的办结截止时间，大于需求单办结截止");
 						}
 					}
 					
 					if(splitDesc == ""){
 						isShowAlert = false;
						flag = false;
						layer.alert("服务标题不能为空",8);
						return;
					}
					if(splitDesc.length > 6000){
						isShowAlert = false;
						flag = false;
						layer.alert("服务标题不能超过6000字",8);
						return;
					}
					//拆分人员不能重复
//					var Name =document.getElementsByName("splitName");
//					for (var i = 0, j = Name.length; i < j; i++){							
//						for(var z=i+1, y=Name.length;z < y; z++){						
//							if(Name[i].value==Name[z].value){
//								isShowAlert = false;
//								flag = false;
//								layer.alert("拆分人员不能重复",8);
//								return false;
//							}
//							
//						}
//						}
					
					var peoplename=""; var dept="";var staffIds="";var mobTels="";
					
					var chk =tempOrderSplit.orderSplitDiv.find('input[type=checkbox][zdid='+a+']');
					
					if(chk.is(':checked')){
						
						 peoplename =tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+a+']').attr("peoplename");
	 					 dept = tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+a+']').attr("dept");
	 					mobTels=tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+a+']').attr("tel");
	 					staffIds=tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+a+']').attr("staffId");
					}else{
						
						peoplename="无";
 						dept="无";
 						mobTels="无";
 						staffIds="无";
					}
	 					
	 					
//	 					 if(peoplename==undefined&&dept==undefined){
//	 						peoplename="无";
//	 						dept="无";
//	 						mobTels="无";
//	 						staffIds="无";
//	 					}
	 					 	
	 					
	 				
 					
 					if(splitName != "" && isSave == "true" && overLimit != ""){
 						var staffId =$(obj).find("input[name=splitName]").attr("staffId");
 						var loginCode = $(obj).find("input[name=splitName]").attr("logincode");
 						var mobTel = $(obj).find("input[name=splitName]").attr("mob_tel"); 
 						conSplitName = conSplitName+splitName+",";
 						
 						if(peoplename!='无'){
 							 param = {
 	 								"staffIds"		:	staffIds		,								
 	 								"mobTels"		:	mobTels,
 	 								"dept"          :   dept,
 	 								"peoplename"	:   peoplename,
 	 								"splitId"		:	staffId		,
 	 								"splitName"		:	splitName		,
 	 								"splitDesc"		:	splitDesc		,
 	 								"overLimit"		:	overLimit		,
 	 								"loginCode"		:	loginCode		,
 	 								"mobTel"		:	mobTel
 	 						};
 						}else{
 							param = {
 									"peoplename" 	:   peoplename,
 	 								"splitId"		:	staffId		,
 	 								"splitName"		:	splitName		,
 	 								"splitDesc"		:	splitDesc		,
 	 								"overLimit"		:	overLimit		,
 	 								"loginCode"		:	loginCode		,
 	 								"mobTel"		:	mobTel
 	 						};
 						}
 						
 						serviceInfoLst.push(param);
 					}else if(isSave != "true" && saveProcFlag){
 						saveProcFlag = false;
 					}
 					
 				});
 				if(!isShowAlert){
 					return false;
 				}
 				var record_list = new Array();
 				if(saveProcFlag){
 					var record_proc =  {
	 						"attr_id" 			: 		'15' ,  
	 						"attr_value" 		: 		"newDate" ,
	 						"busi_id" 			: 		detailData.demandInst.demand_id ,
	 						"attr_group" 		: 		'6'
	 				      } ;
	 			   record_list.push(record_proc);
 				}
 				
 				if(flag){
 					if(serviceInfoLst.length == 0){
 						layer.alert("无新服务单，无需拆分",8);
 	 					return;
 					}
 				};
 				
 				if(moreTime.length > 0 ){
 					var msg = "当前需求单要求办结时间为："+deOverLimit+"</br>"+"您选择的服务单办结时间晚于需求单办结时间，是否继续进行操作？"+"</br>";
	 				$.layer({
					    shade: [0],
					    area: ['auto','auto'],
					    dialog: {
					        msg: msg,
					        btns: 2,                    
					        type: 4,
					        btn: ['确定','取消'],
					        yes: function(){
					        	var msg = "您是否确认将需求单拆分给如下人员："+"</br>";
				 				msg +=conSplitName.substring(0, conSplitName.length-1);
				 				$.layer({
								    shade: [0],
								    area: ['auto','auto'],
								    dialog: {
								        msg: msg,
								        btns: 2,                    
								        type: 4,
								        btn: ['确定','取消'],
								        yes: function(){
					  		 				var param = {
					  		 	 					"serviceInfo" 	    : 	 JSON.stringify(serviceInfoLst)		,
					  		 	 					"servicelingdaoLst"  : 	 JSON.stringify(servicelingdaoLst)		,
					  		 	 					"record_proc"   	:    JSON.stringify(record_list)	 	,
					  		 	 					"demandId"			:	 detailData.demandInst.demand_id	,
					  		 	 					"record_id"			:	 detailData.recordSet[recordSetLength].record_id
					  		 				};
					  		 				$.jump.ajax(URL_SAVE_SERVICE_INFO.encodeUrl(), function(json) {
					  							if(json.code == 0){
					  								//layer.alert('拆分成功!',9);
//					  								layer.msg('拆分成功', 1, 1);
					  								layer.msg('拆分成功', 1, 9);
					  								location.reload() ;
					  							}else{
//					  								layer.alert(json.msg,8);
					  								layer.msg(json.msg, 1, 8);
					  							}
					  						}, param, true);
								        },
								    },
								});
					        }
					    },
					});
 				}else{
 					var msg = "您是否确认将需求单拆分给如下人员："+"</br>";
	 				msg +=conSplitName.substring(0, conSplitName.length-1);
	 				$.layer({
					    shade: [0],
					    area: ['auto','auto'],
					    dialog: {
					        msg: msg,
					        btns: 2,                    
					        type: 4,
					        btn: ['确定','取消'],
					        yes: function(){
		  		 				var param = {
		  		 	 					"serviceInfo" 	    : 	 JSON.stringify(serviceInfoLst)		,
		  		 	 					"record_proc"   	:    JSON.stringify(record_list)	 	,
		  		 	 				"servicelingdaoLst"  : 	 JSON.stringify(servicelingdaoLst)		,
		  		 	 					"demandId"			:	 detailData.demandInst.demand_id							,
		  		 	 					"record_id"			:	 detailData.recordSet[recordSetLength].curr_node_id
		  		 				};
		  		 				$.jump.ajax(URL_SAVE_SERVICE_INFO.encodeUrl(), function(json) {
		  							if(json.code == 0){
//		  								layer.alert('拆分成功!',9);
		  								layer.msg('拆分成功', 1, 9);
		  								location.reload();
		  							}else{
//		  								layer.alert(json.msg,8);
		  								layer.msg(json.msg, 1, 8);
		  							}
		  						}, param, true);
					        },
					    },
					});
 				}
 				
 	 		});
 			
 			if(callBackFun != undefined){
				callBackFun();
			};
		},
		
		//时间绑定
 		serviceDateBind : function(obj,AddDayCount){
 			
 			var d = new Date();
 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
 			obj.datetimepicker({
 				lang		:	'ch',
 				step		:	10

 			});
 		},
		//加载服务单数据
		loadServiceLst : function(data){
			var flag = false;
			$.each(data.serviceInst,function(i,obj){
				if(obj.promoters_id == data.optId){
					flag = true;
				}
			});
			
			if(data.serviceInst != null && data.serviceInst.length>0 && flag){
					var flag = false;
					$.each(data.serviceInst,function(i,obj){
						if(obj.curr_node_id != "100104"){
							flag = true;
							return false;
						}
					});
					if(flag){
						//有未结束服务单时的功能操作
						$.each($("#dispose").find("ul[name=dispose]").find("li"),function(i,obj){
							if(!$(obj).is(":hidden") && $(this).attr("isShow")){
								$(obj).show();
								$(obj).attr("class","hover");
								$("#dispose").find("div[name="+$(obj).attr("name")+"]").show();//显示跟进
								return false;
							}
						});
						tempOrderSplit.orderSplitDiv.find("#diposeFlowRecordA").unbind("click");
						tempOrderSplit.orderSplitDiv.find("#toA").unbind("click");
					}
					var html = [];
					html.push('<tbody>');
					if(data.serviceInst.length > 0 ){
						html.push('<tr>');
						html.push('<th  style="width:50px;">序号</th>');
						html.push('<th  style="width:200px;">拆分人员</th>');
						html.push('<th  style="width:200px;">服务标题</th>');
						html.push('<th  style="width:150px;">办结截止时间</th>');
						html.push('</tr>');
					}
					$.each(data.serviceInst,function(i,obj){
						
						
						if(obj.promoters_id == data.optId){
							html.push('<tr name="splitInfo">');
							if(obj.curr_node_id != "100104" && obj.curr_node_id != "100105"){ //不是已归档的
								if(obj.curr_node_id == "100107"){
								html.push('<td style="width:50px;text-align:center">'+i+'<a href="#" serviceId="'+obj.service_id+'" optTime="'+obj.opt_time+'" recordId="'+(parseFloat(obj.record_id)-parseFloat(1))+'" promotersId="'+obj.default_opt_id+'"  promotersName="'+obj.default_opt_name+'" name="overService" style="color:red;"></br>结束</a></td>');
								}else{
									
									html.push('<td style="width:50px;text-align:center">'+i+'<a href="#" serviceId="'+obj.service_id+'" optTime="'+obj.opt_time+'" recordId="'+obj.record_id+'" promotersId="'+obj.default_opt_id+'"  promotersName="'+obj.default_opt_name+'" name="overService" style="color:red;"></br>结束</a></td>');
								}
							}else if(obj.curr_node_id == "100105"){ //被打回的
								html.push('<td style="width:50px;text-align:center">'+i+'<a href="#" serviceId="'+obj.service_id+'" optTime="'+obj.opt_time+'" recordId="'+obj.record_id+'"  opt_id="'+obj.opt_id+'"  opt_name="'+obj.opt_name+'" opt_code="'+obj.opt_code+'" opt_mebTel="'+obj.opt_mebTel+'" name="reService" style="color:red;"></br>重分</a></td>');
							}else{
								html.push('<td style="width:50px;text-align:center">'+i+'</td>');
							}
							if(obj.curr_node_id == "100105"){ //被打回的
								html.push('<td style="width:200px;text-align:center"><input name="splitName" serviceId="'+obj.service_id+'" staffId="'+obj.opt_id+'"  staffName="'+obj.opt_name+'" opt_code="'+obj.opt_code+'" opt_mebTel="'+obj.opt_mebTel+'" type="text" disabled="disabled" style="width:100px;" value="'+obj.opt_name+'" oldOptId="'+obj.opt_id+'"  disabled="disabled" isSave="false"><a href="#" class="but" name="splitStaff" isMoreFlag="false" staffId="'+obj.opt_id+'"  staffName="'+obj.opt_name+'" loginCode="'+obj.opt_code+'" mob_tel="'+obj.opt_mebTel+'">选择</a></td>');
								html.push('<td style="width:200px;text-align:center"><textarea name="splitDesc" type="text" style="width: 150px;">'+obj.service_desc+'</textarea></td>');
								html.push('<td style="width:150px;text-align:center"><input timeName="reOverLimit" name="reOverLimit_'+obj.service_id+'" type="text" style="width:150px;"value="'+obj.over_limit+'" readonly></td>');
							}else{
								html.push('<td style="width:200px;text-align:center"><input name="splitName" type="text" disabled="disabled" style="width:130px;" value="'+obj.default_opt_name+'" promotersId="'+obj.default_opt_id+'" disabled="disabled" isSave="false"></td>');
								html.push('<td style="width:200px;text-align:center"><textarea name="splitDesc" type="text" style="width: 150px;" readonly>'+obj.service_desc+'</textarea></td>');
								html.push('<td style="width:150px;text-align:center"><input name="oldOverLimit" readonly type="text" style="width:150px;"value="'+obj.over_limit+'"></td>');
							}
							html.push('</tr>');
						}
					});
					html.push('<tr name="handleInfo"><td align="center" colspan="4" style="padding:10px;"><a href="#" class="but" name="addSplit">添加拆分信息</a> <a href="#" class="but" name="conSplit">确认拆分</a></td></tr>');
						
					html.push('</tbody>');
					tempOrderSplit.orderSplitDiv.html(html.join(''));
					
					tempOrderSplit.serviceDateBind(tempOrderSplit.orderSplitDiv.find("input[timeName=reOverLimit]"), 0);
					tempOrderSplit.bindSplitStaff(data);//拆分人员选择
					tempOrderSplit.reAndOver(data);
			 			
				};
		},
		
		//拆分绑定人员选择
 		bindSplitStaff : function(data){
 			//拆分绑定人员选择
 			tempOrderSplit.orderSplitDiv.find("a[name=splitStaff]").unbind("click").bind("click",function(){
 				var splitStaffObj = $(this);
 				tempOrderSplit.chooseStaffs= [];
 				if($(this).attr("staffId") != undefined && $(this).attr("staffId") != ""){
 					var param = {
 							"staff_id" 		: 	$(this).attr("staffId")		,
 							"staff_name" 	:	$(this).attr("staffName") 	,	
 							"mob_tel"		:	$(this).attr("loginCode") 	,
 							"login_code"	:	$(this).attr("mob_tel")		,
 						};
 		 			tempOrderSplit.chooseStaffs.push(param);
 				}
				 var parentObj =this ;
 				$.jump.loadHtml("sysRegionDiv","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
 					
					$("#demandInfo_list_main").hide();
					parentObj.sysRegion = new SysRegion();
					tempOrderSplit.isShowUserLst = "true";  //是否展示选中员工
					tempOrderSplit.qryType = "professional" ; //只查询专业人员
					//tempOrderSplit.optDefault="optDefault";//只显示默认接单人
					
					parentObj.sysRegion.init(1,tempOrderSplit,function(){
						var staffName = '' ;
						var staffs = '' ;
						var loginCode = '';
						var mob_tel = '';
  						$("#sysRegion").hide();
 			 			$("#demandInfo_list_main").show();
 			 			
 			 			var staffLst = this.getChooseStaffs();
 			 			if(staffLst.length == 1){
 			 				staffName = staffLst[0].staff_name;
 			 				staffId = staffLst[0].staff_id;
 			 				loginCode = staffLst[0].login_code;
 			 				mob_tel = staffLst[0].mob_tel;
 			 				var parentTdObj = $(parentObj).parent();
 	  			 			parentTdObj.find("input[name=splitName]").val(staffName);
 	  			 			parentTdObj.find("input[name=splitName]").attr("staffId", staffId);
 	  			 			parentTdObj.find("input[name=splitName]").attr("staffName", staffName);
 	  			 			parentTdObj.find("input[name=splitName]").attr("loginCode", loginCode);
 	  			 			parentTdObj.find("input[name=splitName]").attr("mob_tel", mob_tel);
 	  			 			
	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffId", staffId);
	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffName", staffName);
	  			 			parentTdObj.find("a[name=splitStaff]").attr("loginCode", loginCode);
	  			 			parentTdObj.find("a[name=splitStaff]").attr("mob_tel", mob_tel);
 	  			 			
 			 			}else if(staffLst.length > 1){
 			 				var splitInfos =  tempOrderSplit.orderSplitDiv.find("tr[name=splitInfo]");
 			 				var html=[];
 			 				$.each(staffLst,function(key,obj){
 			 					if(key == 0){
 			 						staffName = staffLst[0].staff_name;
 		 			 				staffId = staffLst[0].staff_id;
 		 			 				loginCode = staffLst[0].login_code;
 		 			 				mob_tel = staffLst[0].mob_tel;
 		 			 				var parentTdObj = $(parentObj).parent();
 		 	  			 			parentTdObj.find("input[name=splitName]").val(staffName);
 		 	  			 			parentTdObj.find("input[name=splitName]").attr("staffId", staffId);
 		 	  			 			parentTdObj.find("input[name=splitName]").attr("loginCode", loginCode);
 		 	  			 			parentTdObj.find("input[name=splitName]").attr("mob_tel", mob_tel);
 		 	  			 			
 		 	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffId", staffId);
 		 	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffName", staffName);
		 	  			 			parentTdObj.find("a[name=splitStaff]").attr("loginCode", loginCode);
		 	  			 			parentTdObj.find("a[name=splitStaff]").attr("mob_tel", mob_tel);
		 	  			 		tempOrderSplit.orderSplitDiv.find("input[name=name]").unbind("click").bind("click",function(){ 	 					
 	 		 	 					var boxObj = $(this);
 	 		 	 					var id =boxObj.attr("id");
// 	 		 	 					
 	 		 	 					
 	 		 	 					var staffId = tempOrderSplit.orderSplitDiv.find('input[id='+id+']').attr("staffId");
 	 		 	 					
 	 		 	 					if(staffId!=''&&staffId!=undefined&&staffId!=null){
 	 		 	 						if(boxObj.is(':checked')){
 	 		 	 	 	 					var id = $(this).attr("id");
 	 		 	 	 	 				
 	 		 	 	 	 				param={
 	 		 	 	 	 						"staff_id":staffId,
 	 		 	 	 	 						"methodtype": "shi"
 	 		 	 	 	 				};
 	 		 	 	 	 			
 	 		 	 	 	 				$.jump.ajax(SHOW_LINGDAO.encodeUrl(), function(data) {
 	 		 	 	 						if(data.code == 0){
 	 		 	 	 							$.each(data.data,function(i,obj){
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=peoplename'+id+']').val(obj.STAFF_NAME);
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=dept'+id+']').val(obj.DEPARTMENT);
 	 		 	 	 						

 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("tel", obj.MON_TEL);
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("staffId", obj.STAFF_ID);
 	 		 	 	 							});
 	 		 	 	 						
 	 		 	 	 						}
 	 		 	 	 					}, param,true);
 	 		 	 	 	 					
 	 		 	 							}
 	 		 	 					}else{
 	 		 	 						layer.alert("拆分人员不能为空",8);
 	 		 	 						return;
 	 		 	 					}
 	 								
 	 		 	 					
 	 		 	 				});
 			 					}else{
 			 						html.push('<tr name="splitInfo" id="'+(splitInfos.length)+'">');
 	 			 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</br><img src="../../../web/images/delete.png" alt="" name="delSplitInfo"></td>');
 	 			 	 				html.push('<td style="width: 200px;text-align:center"><input id="'+(splitInfos.length)+'" name="splitName" isSave="true" type="text" disabled="disabled" style="width:100px;" value="'+obj.staff_name+'" staffId="'+obj.staff_id+'" loginCode="'+obj.login_code+'" mob_tel="'+obj.mob_tel+'">');
 	 			 	 				html.push('<a href="#" class="but" name="splitStaff" staffName="'+obj.staff_name+'" staffId="'+obj.staff_id+'" loginCode="'+obj.login_code+'" mob_tel="'+obj.mob_tel+'">选择</a></td>');
 	 			 	 				html.push('<td style="width:200px;text-align:center"><textarea name="splitDesc" type="text" style="width: 150px;"></textarea></td>');
 	 			 	 				html.push('<td style="width:150px;text-align:center"><input name="overLimit" type="text" readonly style="width:140px;"></td>');
 	 			 	 				html.push('</tr>');
	 	 			 	 			html.push('<tr name="splitInfos" id="'+(splitInfos.length)+'">');
	 	 		 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</td>');
	 	 		 	 				html.push('<td style="width:150px;text-align:center"><input type="checkbox" name="name" id="'+(splitInfos.length)+'">抄送部门领导</td>');
	 	 		 	 				html.push('<td style="width:200px;text-align:center"><input name="peoplename'+(splitInfos.length)+'" type="text" readonly style="width:140px;"></td>');
	 	 		 	 				html.push('<td style="width:150px;text-align:center"><input name="dept'+(splitInfos.length)+'" type="text" readonly style="width:140px;"></td>'); 	 				
	 	 		 	 				html.push('</tr>');
//	 	 		 	 				html.push('<tr name="splitInfoes" id="'+(splitInfos.length)+'">');
//	 	 		 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</td>');
//	 	 		 	 				html.push('<td style="width:150px;text-align:center"><input type="checkbox" name="names" id="'+splitInfos.length+'">抄送省市部门领导</td>');
//	 	 		 	 				html.push('<td style="width:200px;text-align:center"><input name="peoplenames" type="text" readonly style="width:140px;"></td>');
//	 	 		 	 				html.push('<td style="width:150px;text-align:center"><input name="depts" type="text" readonly style="width:140px;"></td>'); 	 				
//	 	 		 	 				html.push('</tr>');
 	 			 	 				tempOrderSplit.orderSplitDiv.find("tr[name=handleInfo]").before(html.join(''));
 	 			 	 				tempOrderSplit.serviceDateBind(tempOrderSplit.orderSplitDiv.find("input[name=overLimit]"), 0);
 	 			 	 				//删除该行信息
 	 			 	 			tempOrderSplit.orderSplitDiv.find("img[name=delSplitInfo]").unbind("click").bind("click",function(){
 	 		 	 					//加入ID，获取到ID
 	 		 	 					var id = $(this).parents("tr[name=splitInfo]").attr("id");
 	 		 	 					
 	 		 	 					
 	 		 	 					tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos][id="'+id+'"]').remove(); 
// 	 		 	 					tempOrderSplit.orderSplitDiv.find('tr[name=splitInfoes][id="'+id+'"]').remove(); 
 	 		 	 					$(this).parents("tr[name=splitInfo]").remove(); 
 	 		 	 				});
 	 		 	 				tempOrderSplit.orderSplitDiv.find("input[name=name]").unbind("click").bind("click",function(){ 	 					
 	 		 	 					var boxObj = $(this);
 	 		 	 					var id =boxObj.attr("id");
 	 		 	 				
 	 		 	 					
 	 		 	 					var staffId = tempOrderSplit.orderSplitDiv.find('input[id='+id+']').attr("staffid");
 	 		 	 				
 	 		 	 					if(staffId!=''&&staffId!=undefined&&staffId!=null){
 	 		 	 						if(boxObj.is(':checked')){
 	 		 	 	 	 					var id = $(this).attr("id");
 	 		 	 	 	 				
 	 		 	 	 	 				param={
 	 		 	 	 	 						"staff_id":staffId,
 	 		 	 	 	 						"methodtype": "shi"
 	 		 	 	 	 				};
 	 		 	 	 	 			
 	 		 	 	 	 				$.jump.ajax(SHOW_LINGDAO.encodeUrl(), function(data) {
 	 		 	 	 						if(data.code == 0){
 	 		 	 	 							$.each(data.data,function(i,obj){
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=peoplename'+id+']').val(obj.STAFF_NAME);
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('input[name=dept'+id+']').val(obj.DEPARTMENT);

 	 		 	 	 							tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("tel", obj.MOB_TEL);
 	 		 	 	 								tempOrderSplit.orderSplitDiv.find('tr[name=splitInfos'+id+']').attr("staffId", obj.STAFF_ID);
 	 		 	 	 									});
 	 		 	 	 						
 	 		 	 	 						}
 	 		 	 	 					}, param,true);
 	 		 	 	 	 					
 	 		 	 							}
 	 		 	 					}else{
 	 		 	 						layer.alert("拆分人员不能为空",8);
 	 		 	 						return;
 	 		 	 					}
 	 								
 	 		 	 					
 	 		 	 				});
 	 			 	 				tempOrderSplit.bindSplitStaff();//拆分人员选择
 			 					}
 	 						});
 			 			}else if(staffLst.length == 0){
 			 					var parentTdObj = $(parentObj).parent();
 			 					parentTdObj.find("input[name=splitName]").val("");
	 	  			 			parentTdObj.find("input[name=splitName]").attr("staffId", "");
	 	  			 			parentTdObj.find("input[name=splitName]").attr("loginCode", "");
	 	  			 			parentTdObj.find("input[name=splitName]").attr("mob_tel", "");
	 	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffId", "");
	 	  			 			parentTdObj.find("a[name=splitStaff]").attr("staffName", "");
	 	  			 			parentTdObj.find("a[name=splitStaff]").attr("loginCode", "");
	 	  			 			parentTdObj.find("a[name=splitStaff]").attr("mob_tel", "");
 			 			}
  			 			temp = temp.parentObj;
  			 			tempOrderSplit.orderSplitDiv = $("#demandInfo");
  			 			tempOrderSplit.reAndOver(data);
					});
				},null);
 				
			});
 		},
 		//重发和结束绑定
 		reAndOver : function(data){
 			//重新发送服务单
			tempOrderSplit.orderSplitDiv.find("a[name=reService]").unbind("click").bind("click",function(){
				
				var infoObj = tempOrderSplit.orderSplitDiv.find("input[serviceId="+$(this).attr("serviceId")+"]");
				if($(infoObj).attr("staffId") =="" ){
					layer.alert("请选择专业人员",8);
					return false;
				}
				var flow_record = {	
							"record_id" 		: 		$(this).attr("recordId") 					,
							"urge_count"   		: 		"0"											,
							"busi_id"    		: 		$(this).attr("serviceId")					,
							"opt_time"   		: 		$(this).attr("optTime")						,
							"default_opt_id"	:	    $(infoObj).attr("staffId")					,
							"default_opt_name"	:		$(infoObj).attr("staffName")				,
							"opt_id"			:	    $(infoObj).attr("staffId")					,
							"opt_name"			:		$(infoObj).attr("staffName")				,	
							"opt_desc"			:		data.staffName+"重新分配" 				    	,
							"funTypeId"			:		"100084"
							   
				};
				var record_procLst = [];
				var overLimit = tempOrderSplit.orderSplitDiv.find("input[name=reOverLimit_"+$(this).attr("serviceId")+"]").val();
				var service = {
						"service_id"	: 	 $(this).attr("serviceId"),
						"over_limit"		:	 overLimit
				};
				var param = {
	 					"service" 	    : 	 JSON.stringify(service)				,
	 					"flow_record"	:	 JSON.stringify(flow_record)	    	,
	 					"record_proc"   :    JSON.stringify(record_procLst)
	 				};
				$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(data) {
					if(data.code == 0){
						layer.alert('重分成功!',9);
						location.reload();
					}else{
						layer.alert("重分失败："+data.msg,8);
					}
				}, param,true);
			});
		//结束服务单绑定
		tempOrderSplit.orderSplitDiv.find("a[name=overService]").unbind("click").bind("click",function(){
				var flow_record = {	
							"record_id" 		: 		$(this).attr("recordId") 					,
							"next_node_id"   	: 		"100104"									,
							"next_node_name"   	: 		"已归档"										,
							"urge_count"   		: 		"0"											,
							"busi_id"    		: 		$(this).attr("serviceId")					,
							"opt_time"			: 	 	$(this).attr("optTime")						,
							"default_opt_id"	:	    $(this).attr("promotersId")					,
							"default_opt_name"	:		$(this).attr("promotersName")				,
							"opt_desc"			:		data.staffName+"结束了该服务单" 					,
							"funTypeId"			:		"100034"
							   
				};
				var record_procLst = [];
				var service = {
						"service_id"	: 	 $(this).attr("serviceId")
				};
				var param = {
	 					"service" 	    : 	 JSON.stringify(service)				,
	 					"flow_record"	:	 JSON.stringify(flow_record)	    	,
	 					"record_proc"   :    JSON.stringify(record_procLst)
	 				};
				$.jump.ajax(URL_SERICE_FLOW.encodeUrl(), function(data) {
					if(data.code == 0){
						layer.alert('结束成功!',9);
						location.reload();
					}else{
						layer.alert("结束失败："+data.msg,8);
					}
				}, param,true);
		});
 		}
};


