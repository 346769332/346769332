var ComprehensiveQryS = new Function();

ComprehensiveQryS.prototype = {
		selecter : "#comprehensiveQrySPage",
		pageSize : 10,
		//初始化执行
		init : function() {
			this.bindMetod(this);
		},
		//创建HTML
		createLstHtml : function(parentThis,data,orderLstBodyObj){
			var html=[];
			var dataLst = data.data;
			
			var comprehensiveQryObj = parentThis.selecter.findById("div","comprehensiveQryFoot")[0];
			if(dataLst.length > 0 ){
				comprehensiveQryObj.show();
//				$("#totalSizeSpan").html("   共"+data.totalSize+"条");
				$.each(data.data,function(i,obj){
					html.push('<tr >');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.service_id+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+splitStr(obj.service_theme,10)+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.promoters+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.create_time+'</td>');
					if(obj.flag == "1"){
						html.push('<td name="demandInfo" demandId="'+obj.service_id+'"><font color="red">'+obj.surplusTime+'<font></td>');
					}else{
						html.push('<td name="demandInfo" demandId="'+obj.service_id+'">'+obj.surplusTime+'</td>');
					}
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.over_time+'</td>');
					html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.opt_name+'</td>');
					if(obj.curr_node_id == '100104'){
						html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">已处理</td>');
					}else{
						html.push('<td name="serviceInfo" serviceId="'+obj.service_id+'">'+obj.curr_node_name+'</td>');
					}
					
					html.push('</tr>');
				});
			}else{
					comprehensiveQryObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
			}
			orderLstBodyObj.html(html.join(''));
			
			$("#comprehensiveQrySPage").find("td[name=serviceInfo]").unbind("click").bind("click",function(){
				window.open('html/orderDetail/serviceOrderDetail.html?serviceId='+$(this).attr("serviceId")+'&isHistory=Y&handleType=query'); 
			});
		},
		//检索销售单
		QryOrderLst : function(parentThis,pageIndex,orderType) {
			var latnIdObj = parentThis.selecter.findById("select","latnId")[0];//本地网
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0]; //发起开始时间
			var sendEndDateObj = parentThis.selecter.findById("input","sendEndDate")[0]; //发起结束时间
			var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0]; //办结开始时间
			var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0]; //办结结束时间
			var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
			var newStatusCdObj = parentThis.selecter.findById("select","newStatusCd")[0];//最新状态
			var newStatusCd = newStatusCdObj.find('option:selected').attr('dicId');
			var timeOutFlagObj =  parentThis.selecter.findById("select","timeOutFlag")[0]; //超时标识
			var timeOutFlag = timeOutFlagObj.find('option:selected').attr('dicId');
			var serviceIdObj = parentThis.selecter.findById("input","serviceId")[0];//服务单号
			var demandIdObj = parentThis.selecter.findById("input","demandId")[0];//需求单号
			var param = {
				"hanleType"						:		"service"						,
				"latnId"						:		latnId							,
				"serviceId"						:	    serviceIdObj.val()				,
				"demandId"						:		demandIdObj.val()				,
				"sendBeginDate"					:		sendBeginDateObj.val()			,
				"sendEndDate"					:		sendEndDateObj.val()			,
				"overLimitBeginDate"			: 		overLimitBeginDateObj.val()		,
				"overLimitEndDate"				: 		overLimitEndDateObj.val()		,
				"themeSeach"					:		themeSeachObj.val()				,
				"sendUserName"					:		sendUserNameObj.attr("staffid")	,
				"orderType"						:		orderType						,
				"timeOutFlag"					:		timeOutFlag						,
				"newStatusCd"					:		newStatusCd						,
			};
			var comprehensiveQryObj = parentThis.selecter.findById("div","comprehensiveQryFoot")[0];
			common.pageControl.start(URL_COMPREHENSIVE_QUERY.encodeUrl(),
									 pageIndex,
									 parentThis.pageSize,
									 param,
									 "data",
									 null,
									 comprehensiveQryObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var orderLstBodyObj = parentThis.selecter.findById("tbody","orderLstBody")[0];
				orderLstBodyObj.html("");
//				$("#totalSizeSpan").html('');
				parentThis.createLstHtml(parentThis,data,orderLstBodyObj);
			});
		},

		bindMetod : function(parentThis) {
			var exportObj=parentThis.selecter.findById("a","export")[0];
			exportObj.unbind("click").bind("click",function(){
				var latnIdObj = parentThis.selecter.findById("select","latnId")[0];//本地网
				var latnId = latnIdObj.find('option:selected').attr('latnId');
				var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0]; //发起开始时间
				var sendEndDateObj = parentThis.selecter.findById("input","sendEndDate")[0]; //发起结束时间
				var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0]; //办结开始时间
				var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0]; //办结结束时间
				var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
				var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
				var newStatusCdObj = parentThis.selecter.findById("select","newStatusCd")[0];//最新状态
				var newStatusCd = newStatusCdObj.find('option:selected').attr('dicId');
				var timeOutFlagObj =  parentThis.selecter.findById("select","timeOutFlag")[0]; //超时标识
				var timeOutFlag = timeOutFlagObj.find('option:selected').attr('dicId');
				var serviceIdObj = parentThis.selecter.findById("input","serviceId")[0];//服务单号
				var demandIdObj = parentThis.selecter.findById("input","demandId")[0];//需求单号
				var param = {
					"hanleType"						:		"service"						,
					"latnId"						:		latnId							,
					"serviceId"						:	    serviceIdObj.val()				,
					"demandId"						:		demandIdObj.val()				,
					"sendBeginDate"					:		sendBeginDateObj.val()			,
					"sendEndDate"					:		sendEndDateObj.val()			,
					"overLimitBeginDate"			: 		overLimitBeginDateObj.val()		,
					"overLimitEndDate"				: 		overLimitEndDateObj.val()		,
					"themeSeach"					:		themeSeachObj.val()				,
					"sendUserName"					:		sendUserNameObj.attr("staffid")	,
					"timeOutFlag"					:		timeOutFlag						,
					"newStatusCd"					:		newStatusCd						,
				};
				var exportForm=parentThis.selecter.findById("form","exportForm")[0];
				exportForm.attr("action",(URL_SYSMANAGE_DOWNLOAD+"?param="+JSON.stringify(param)).encodeUrl());
				exportForm.attr("method","post");
				exportForm.submit();
			});
			
			//发起开始时间
			var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0];
			parentThis.dateBind(sendBeginDateObj,0);
			var  clearSendBeginDateObj = parentThis.selecter.findById("img","clearSendBeginDate")[0];
			clearSendBeginDateObj.unbind("click").bind("click",function(){
				sendBeginDateObj.val("");
			});
			
			//发起结束时间
			var sendEndDateObj = parentThis.selecter.findById("input","sendEndDate")[0];
			parentThis.dateBind(sendEndDateObj,0);
			var clearSendEndDateObj = parentThis.selecter.findById("img","clearSendEndDate")[0];
			clearSendEndDateObj.unbind("click").bind("click",function(){
				sendEndDateObj.val("");
			});
			
			//办结开始时间
			var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0];
			parentThis.dateBind(overLimitBeginDateObj,3);
			var clearOverLimitBeginDateObj = parentThis.selecter.findById("img","clearOverLimitBeginDate")[0];
			clearOverLimitBeginDateObj.unbind("click").bind("click",function(){
				overLimitBeginDateObj.val("");
			});
			
			//办结结束时间
			var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0];
			parentThis.dateBind(overLimitEndDateObj,3);
			var clearOverLimitEndDateObj = parentThis.selecter.findById("img","clearOverLimitEndDate")[0];
			clearOverLimitEndDateObj.unbind("click").bind("click",function(){
				overLimitEndDateObj.val("");
			});
			
			/************日期查询绑定*********/
			var seniorObj =  parentThis.selecter.findById("a","senior")[0];
			parentThis.dateQryBind(seniorObj,parentThis);
			/************日期查询绑定*********/
			
			//初始化本地网
			var latnIdObj =parentThis.selecter.findById("select","latnId")[0];
			var param={};
			$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
				
				if(json.code == "0"&&json.orgid=="888" ){
					if(json.latnSet.length > 0){
						var html = [];
						latnIdObj.html("");
						html.push('<option latnId = "" latnCode = "合计">合计</option>');
						$.each(json.latnSet,function(i,obj){
							html.push('<option latnId = '+obj.REGION_ID+' latnCode = '+obj.REGION_CODE+'>'+obj.REGION_NAME+'</option>');
						});
						latnIdObj.html(html.join(''));
						
//						var tempLatnId=json.currUser.regionId;
//						latnIdObj.find("option[latnId='"+tempLatnId+"']").attr("selected",true);
					}
				}else{

					if(json.latnSet.length > 0){
						var html = [];
						latnIdObj.html("");
					
						$.each(json.latnSet,function(i,obj){
							html.push('<option latnId = '+obj.REGION_ID+' latnCode = '+obj.REGION_CODE+'>'+obj.REGION_NAME+'</option>');
						});
						latnIdObj.html(html.join(''));
						
//						var tempLatnId=json.currUser.regionId;
//						latnIdObj.find("option[latnId='"+tempLatnId+"']").attr("selected",true);
					}
				
					
				};
			}, param, false,false);
			
			
			
			//初始化最新状态
			var newStatusCdObj =  parentThis.selecter.findById("select","newStatusCd")[0];
			var param = {
 					"dicType" 	: 		"serviceStatusCd"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						newStatusCdObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						newStatusCdObj.html(html.join(''));
					}
				};
			}, param, false,false);
			
			var timeOutFlagObj =  parentThis.selecter.findById("select","timeOutFlag")[0]; //超时标识
			timeOutFlagObj.unbind("change").bind("change",function(){
				var nowId = timeOutFlagObj.find('option:selected').attr('dicId');
				if(nowId != ""){
					newStatusCdObj.prop("disabled", true);
					newStatusCdObj.find("option[dicid='100102']").attr("selected",true);
				}else{
					newStatusCdObj.prop("disabled", false);
				}
			});
			
			var timeOutFlagObj =  parentThis.selecter.findById("select","timeOutFlag")[0];
			var param = {
 					"dicType" 	: 		"timeOutFlag"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						timeOutFlagObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						timeOutFlagObj.html(html.join(''));
					}
				};
			}, param, false,false);
			
			
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
	 			 			
	 			 			sendUserNameObj.val(staffName.substring(0, staffName.length-1));
	 			 			sendUserNameObj.attr("staffId",staffId.substring(0, staffId.length-1));
	   			 			parentThis = temp.parentObj;
						});
					},null);
			});
			
			
		},
		//时间绑定
		dateBind : function(obj,AddDayCount){
//			var d = new Date();
//			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
//			obj.val(d.getFullYear() + "-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate()));
			obj.datetimepicker({
				lang:'ch',
				timepicker:false,
				format:'Y-m-d',
				formatDate:'Y-m-d',
			});
		},
		//日期查询绑定
		dateQryBind : function(obj,parentThis){
			obj.unbind("click").bind("click",function(){
				parentThis.QryOrderLst(parentThis,0,"");
			});
		},
	};
