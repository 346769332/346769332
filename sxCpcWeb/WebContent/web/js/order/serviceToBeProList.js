var ServiceToBeProList = new Function();

ServiceToBeProList.prototype = {
		selecter : "#serviceToBeProLstPage",
		pageSize : 10,
		//初始化执行
		init : function() {
			this.bindMetod(this);
		},
		//查询销售单
		loadSaleOrderLst : function(queryType,parentThis,pageIndex,orderType) {
			var param = {
				"queryType" 	: 		queryType		,
				"queryStatusCd"	:		"100102"		, //查询状态
				"orderType"		:		orderType
			};
			var orderLstBodyObj = parentThis.selecter.findById("tbody","orderLstBody")[0];
			var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
			orderLstBodyObj.html("");
			orderLstFootObj.html("");
			
			common.pageControl.start(URL_QUERY_SERVICE_ORDER.encodeUrl(),
									 pageIndex,
									 parentThis.pageSize,
									 param,
									 "data",
									 null,
									 orderLstFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
					parentThis.createLstHtml(parentThis,data,orderLstBodyObj);
			});
		},
		
		//创建HTML
		createLstHtml : function(parentThis,data,orderLstBodyObj){
			var html=[];
			var dataLst = data.data;
			
			var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
			if(dataLst.length > 0 ){
				orderLstFootObj.show();
				$.each(data.data,function(i,obj){
					html.push('<tr>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.service_id+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+splitStr(obj.service_theme,10)+'</td>');
					//html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.service_type_name+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.promoters+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.tel+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.department+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.create_time+'</td>');
				
					if(obj.flag == "1"){
						html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'"><font color="red">'+obj.surplusTime+'<font></td>');
					}else{
						html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.surplusTime+'</td>');
					}
					//html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.urge_count+'</td>');
					html.push('<td><a href="#" class="but" name="chuli" serviceId="'+obj.service_id+'">处理</a></td>');
					html.push('</tr>');
				});
			}else{
					orderLstFootObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
			}
			orderLstBodyObj.html(html.join(''));
			
			$("#serviceToBeProLstPage").find("a[name=chuli]").unbind("click").bind("click",function(){
				window.open('html/orderDetail/serviceOrderDetail.html?serviceId='+$(this).attr("serviceId")+'&isHistory=N&handleType=dispose'); 
			});
			
			$("#serviceToBeProLstPage").find("td[name=serviceInfo]").unbind("click").bind("click",function(){
				window.open('html/orderDetail/serviceOrderDetail.html?serviceId='+$(this).attr("serviceId")+'&isHistory=Y&handleType=query'); 
			});
		},
		//检索销售单
		QryOrderLst : function(queryType,parentThis,pageIndex,orderType) {
			var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
			var endDateObj = parentThis.selecter.findById("input","endDate")[0]; //截止时间
			var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
		//	var serviceTypeObj =  parentThis.selecter.findById("select","serviceType")[0]; 
		//	var serviceType = serviceTypeObj.find('option:selected').attr('dicId');
			var endData = endDateObj.val();
			var sendData = sendDateObj.val();
			if(sendData > endData && sendData != "" && endData != ""){
				layer.alert("办结截止时间必须大于发起时间",8);
				return;
			}
			var param = {
				"queryType" 	: 		queryType				,
				"queryStatusCd"	:		"100102"				, //查询状态
				"sendDate"		:		sendDateObj.val()		,
				"endDate"		:		endDateObj.val()		,
				"themeSeach"	:		themeSeachObj.val()		,
				"sendUserName"	:		sendUserNameObj.attr("staffid")	,
		//		"serviceType"	:		serviceType				,
				"orderType"		:		orderType
			};
			var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
			
			common.pageControl.start(URL_QUERY_SERVICE_ORDER.encodeUrl(),
									 pageIndex,
									 parentThis.pageSize,
									 param,
									 "data",
									 null,
									 orderLstFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var orderLstBodyObj = parentThis.selecter.findById("tbody","orderLstBody")[0];
				
				orderLstBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,orderLstBodyObj);
			});
		},

		bindMetod : function(parentThis) {
			
			var sendDateObj = parentThis.selecter.findById("input","sendDate")[0];
			parentThis.dateBind(sendDateObj,0);
			var clearSendDateObj = parentThis.selecter.findById("img","clearSendDate")[0];
			clearSendDateObj.unbind("click").bind("click",function(){
				sendDateObj.val("");
			});
			
			var endDateObj = parentThis.selecter.findById("input","endDate")[0];
			parentThis.dateBind(endDateObj,3);
			var clearEndDateObj = parentThis.selecter.findById("img","clearEndDate")[0];
			clearEndDateObj.unbind("click").bind("click",function(){
				endDateObj.val("");
			});
			/************日期查询绑定*********/
			
			var todayObj =  parentThis.selecter.findById("a","today")[0];
			parentThis.dateQryBind(todayObj,parentThis);
			
			var weekObj =  parentThis.selecter.findById("a","week")[0];
			parentThis.dateQryBind(weekObj,parentThis);
			
			var monthObj =  parentThis.selecter.findById("a","month")[0];
			parentThis.dateQryBind(monthObj,parentThis);
			
			var seniorObj =  parentThis.selecter.findById("a","senior")[0];
			parentThis.dateQryBind(seniorObj,parentThis);
			/************日期查询绑定*********/
	
			
			
			/*var serviceTypeObj =  parentThis.selecter.findById("select","serviceType")[0];
			var param = {
 					"handleType" 	: 		"qryData"				,
 				};
			$.jump.ajax(URL_CLAIM_service.encodeUrl(), function(json) {
				var serviceType = json.serviceTypeMap;
				if(serviceType.code == "0" ){
					if(serviceType.dicSet.length > 0){
						var html = [];
						serviceTypeObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(serviceType.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						serviceTypeObj.html(html.join(''));
					}
					
				};
			}, param, false,false);*/
			
			
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];
			sendUserNameObj.unbind("click").bind("click",function(){
				
				common.loadding("open");
				  var parentObj =this ;
					$.jump.loadHtml("sysRegionDiv","html/orderDetail/SysRegion.html",function(){
						common.loadding("close");
						$("#sysRegionDiv").show();
						$("#topHeader").hide();
						$("#content").hide();
						parentObj.sysRegion = new SysRegion();
						parentObj.sysRegion.init(1,parentThis,function(){
							
							var staffName = '' ;
							var staffId = '' ;
	 						$("#sysRegionDiv").hide();
				 			$("#topHeader").show();
				 			$("#content").show();
	 			 			$.each(this.getChooseStaffs(),function(key,obj){
				 				staffName = staffName + obj.staff_name + ',';
				 				staffId  = staffId + obj.staff_id + ',';
							});
	 			 			
				 		//	$("#to_name").val();
	 			 			sendUserNameObj.val(staffName.substring(0, staffName.length-1));
	 			 			sendUserNameObj.attr("staffId",staffId.substring(0, staffId.length-1));
				 			//$("#to_name").attr("staffs", staffs.substring(0, staffs.length-1));
	 			 			parentThis = parentThis.parentObj;

						},'ZZZ');
					},null);
			});
			
			this.loadSaleOrderLst("today",this,0,""); //查询今日未认领单子
		},
		//时间绑定
		dateBind : function(obj,AddDayCount){
			var d = new Date();
			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
			//obj.val(d.getFullYear() + "-"+(d.getMonth()+1)+"-"+d.getDate());
			obj.datetimepicker({
				lang:'ch',
				timepicker:false,
				format:'Y-m-d',
				formatDate:'Y-m-d',
			});
		},
		//日期查询绑定
		dateQryBind : function(obj,parentThis){
			var dateQueryObj = parentThis.selecter.findById("div","dateQuery")[0];
			var seniorObj =  parentThis.selecter.findById("a","senior")[0];
			obj.unbind("click").bind("click",function(){
				
				dateQueryObj.find("a").attr("class","butInit");
				seniorObj.attr("class","butInit");
				$(this).attr("class","but");
				var objId = $(this).attr("id");
				if(objId == "senior"){
					parentThis.QryOrderLst(objId,parentThis,0,"");
				}else{
					parentThis.loadSaleOrderLst(objId,parentThis,0,"");
				}
			});
		},
		
		//tab查询绑定
		tabQryBind : function(obj,parentThis){
			
			var dateQueryObj = parentThis.selecter.findById("div","dateQuery")[0];
			var seniorObj =  parentThis.selecter.findById("a","senior")[0];
			obj.unbind("click").bind("click",function(){
				
				$(this).attr("class","hover");
				var objId = "";
				if(seniorObj.attr("class") == "but"){
					objId = seniorObj.attr("id");
				}
				if(objId == ""){
					var dateObj = dateQueryObj.find("a[class=but]");
					objId = dateObj.attr("id");
				}
				if(objId == "senior"){
					parentThis.QryOrderLst(objId,parentThis,0,obj.attr("id"));
				}else{
					parentThis.loadSaleOrderLst(objId,parentThis,0,obj.attr("id"));
				}
			});
		}
	};
