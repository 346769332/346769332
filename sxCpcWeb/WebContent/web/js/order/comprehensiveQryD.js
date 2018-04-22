var ComprehensiveQryD = new Function();

ComprehensiveQryD.prototype = {
		selecter : "#comprehensiveQryDPage",
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
					var evalStar='';
					if(obj.over_eval!=''&&obj.over_eval!=null&&obj.over_eval!=undefined){
						evalStar=obj.over_eval+'星';
					}
					var evalTime='';
					if(obj.eval_time!=''&&obj.eval_time!=null&&obj.eval_time!=undefined){
						evalTime=obj.eval_time+'星';
					}
					var evalAtti='';
					if(obj.eval_atti!=''&&obj.eval_atti!=null&&obj.eval_atti!=undefined){
						evalAtti=obj.eval_atti+'星';
					}
					html.push('<tr >');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.demand_id+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+splitStr(obj.demand_theme,10)+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.demand_type_name+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.promoters+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.create_time+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.opt_name+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.curr_node_name+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.pool_name+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.department+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.tree_name+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+evalStar+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+evalTime+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+evalAtti+'</td>');
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.over_time+'</td>');
					/*if(obj.calimflag == "1"){
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">是</td>');
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.surplusCalimTime+'</td>');
					}else{
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">否</td>');
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">无</td>');
					}*/
					if(obj.optflag == "1"){
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">是</td>');
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.surplusOptTime+'</td>');
					}else{
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">否</td>');
						html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">无</td>');
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
			
			
			$("#comprehensiveQryDPage").find("td[name=demandInfo]").unbind("click").bind("click",function(){
				window.open('html/orderDetail/orderDetail.html?demandId='+$(this).attr("demandId")+'&isHistory=Y&handleType=query'); 
			});
		},
		//检索销售单
		QryOrderLst : function(parentThis,pageIndex,orderType) {
			
			var param=parentThis.getParam(parentThis);
			param['orderType']=orderType;
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
				
				var param=parentThis.getParam(parentThis);
				var exportForm=parentThis.selecter.findById("form","exportForm")[0];
				exportForm.attr("action",(URL_SYSMANAGE_DOWNLOAD+"?param="+JSON.stringify(param)).encodeUrl());
				exportForm.attr("method","post");
				exportForm.submit();
			});
			
			//发起开始时间
			var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0];
			parentThis.dateBind(sendBeginDateObj,0);
			var clearSendBeginDateObj = parentThis.selecter.findById("img","clearSendBeginDate")[0];
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
			
			//认领开始时间
			var calimLimitBeninDateObj = parentThis.selecter.findById("input","calimLimitBeginDate")[0];
			parentThis.dateBind(calimLimitBeninDateObj,3);
			var clearCalimLimitBeninDateObj = parentThis.selecter.findById("img","clearCalimLimitBeginDate")[0];
			clearCalimLimitBeninDateObj.unbind("click").bind("click",function(){
				calimLimitBeninDateObj.val("");
			});
			
			//认领结束时间
			var calimLimitEndDateObj = parentThis.selecter.findById("input","calimLimitEndDate")[0];
			parentThis.dateBind(calimLimitEndDateObj,3);
			var clearCalimLimitEndDateObj = parentThis.selecter.findById("img","clearCalimLimitEndDate")[0];
			clearCalimLimitEndDateObj.unbind("click").bind("click",function(){
				calimLimitEndDateObj.val("");
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
				}else if(json.code == "0"&&json.orgid!="888"){

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
				
				}
				else{
					layer.alert(msg);
				};
			}, null, false,false);
			//初始化工单首问部门
			var param={
					"handleType" : "qryPoolInfo",
					"latnId" : $('#latnId').find("option:selected").attr('latnId'),
			};
			$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json){
				if("0"==json.code){
					if(json.list.length>0){
						var html=[];
						html.push('<option poolId="">全部</option>');
						$.each(json.list,function(i,obj){
							html.push('<option poolId="'+obj.POOL_ID+'">'+obj.POOL_NAME+'</option>');
						});
						$('#firstOptDept').html(html.join(''));
					}
				}
			}, param, false, false);
			//初始化工单评价结果
			var param = {
 					"dicType" 	: 		"evalType"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						$('#evalResult').html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						$('#evalResult').html(html.join(''));
					}
				};
			}, param, false,false);
			//初始化需求类型
			var demandTypeObj =  parentThis.selecter.findById("select","demandType")[0];
			var param = {
 					"handleType" 	: 		"qryData"				,
 				};
			$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(json) {
				var demandType = json.demandTypeMap;
				if(demandType.code == "0" ){
					if(demandType.dicSet.length > 0){
						var html = [];
						demandTypeObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(demandType.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						demandTypeObj.html(html.join(''));
					}
					
				};
			}, param, false,false);
			//初始化最新状态
			var newStatusCdObj =  parentThis.selecter.findById("select","newStatusCd")[0];
			var param = {
 					"dicType" 	: 		"statusCd"				,
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
			
			var calimTimeOutFlagObj =  parentThis.selecter.findById("select","calimTimeOutFlag")[0]; //认领超时标识
			var overTimeOutFlagObj =  parentThis.selecter.findById("select","overTimeOutFlag")[0]; //办结超时标识
			/*calimTimeOutFlagObj.unbind("change").bind("change",function(){
				var nowId = calimTimeOutFlagObj.find('option:selected').attr('dicId');
				if(nowId != ""){
					overTimeOutFlagObj.prop("disabled", true);
					newStatusCdObj.prop("disabled", true);
					newStatusCdObj.find("option[dicid='100101']").attr("selected",true);
				}else{
					overTimeOutFlagObj.prop("disabled", false);
					newStatusCdObj.prop("disabled", false);
				}
			});
			
			overTimeOutFlagObj.unbind("change").bind("change",function(){
				var nowId = overTimeOutFlagObj.find('option:selected').attr('dicId');
				if(nowId != ""){
					calimTimeOutFlagObj.prop("disabled", true);
					newStatusCdObj.prop("disabled", true);
					newStatusCdObj.find("option[dicid='100102']").attr("selected",true);
				}else{
					calimTimeOutFlagObj.prop("disabled", false);
					newStatusCdObj.prop("disabled", false);
				}
			});*/
			//认领或办结超时标识
			/*var param = {
 					"dicType" 	: 		"calimTimeOutFlag"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						calimTimeOutFlagObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						calimTimeOutFlagObj.html(html.join(''));
					}
				};
			}, param, false,false);*/
			//认领或办结超时标识
			var param = {
 					"dicType" 	: 		"overTimeOutFlag"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						overTimeOutFlagObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						overTimeOutFlagObj.html(html.join(''));
					}
				};
			}, param, false,false);
			
			//加载发起人
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
		getParam : function(parentThis){
			
			var latnIdObj = parentThis.selecter.findById("select","latnId")[0];//本地网
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0]; //发起开始时间
			var sendEndDateObj = parentThis.selecter.findById("input","sendEndDate")[0]; //发起结束时间
			var calimLimitBeginDateObj = parentThis.selecter.findById("input","calimLimitBeginDate")[0];//认领开始时间
			var calimLimitEndDateObj = parentThis.selecter.findById("input","calimLimitEndDate")[0];//认领结束时间
			var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0]; //办结开始时间
			var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0]; //办结结束时间
			var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
			var newStatusCdObj = parentThis.selecter.findById("select","newStatusCd")[0];//最新状态
			var newStatusCd = newStatusCdObj.find('option:selected').attr('dicId');
			//var calimTimeOutFlagObj =  parentThis.selecter.findById("select","calimTimeOutFlag")[0]; //认领超时标识
			//var calimTimeOutFlag = calimTimeOutFlagObj.find('option:selected').attr('dicId');
			var overTimeOutFlagObj =  parentThis.selecter.findById("select","overTimeOutFlag")[0]; //办结超时标识
			var overTimeOutFlag = overTimeOutFlagObj.find('option:selected').attr('dicId');
			var demandTypeObj = parentThis.selecter.findById("select","demandType")[0];//需求类型
			var demandType = demandTypeObj.find('option:selected').attr('dicId');
			var demandIdObj = parentThis.selecter.findById("input","demandId")[0];//需求ID
			var poolId=$('#firstOptDept').find('option:selected').attr("poolId");
			var evalStar=$('#evalResult').find('option:selected').attr('dicId');
			var param = {
				"hanleType"						:		"demand"						,
				"latnId"						:		latnId							,
				"demandId"						:		demandIdObj.val()				,
				"sendBeginDate"					:		sendBeginDateObj.val()			,
				"sendEndDate"					:		sendEndDateObj.val()			,
				"calimLimitBeginDate"			:		calimLimitBeginDateObj.val()	,
				"calimLimitEndDate"			    :		calimLimitEndDateObj.val()		,
				"overLimitBeginDate"			: 		overLimitBeginDateObj.val()		,
				"overLimitEndDate"				: 		overLimitEndDateObj.val()		,
				"themeSeach"					:		themeSeachObj.val()				,
				"sendUserName"					:		sendUserNameObj.attr("staffid")	,
				//"calimTimeOutFlag"				:		calimTimeOutFlag				,
				"overTimeOutFlag"				:		overTimeOutFlag					,
				"newStatusCd"					:		newStatusCd						,
				"demandType"					:		demandType                      ,
				"demandDetails"				    :		$('#contentSearch').val()	    ,
				"sendUserTel"				    :		$('#sendUserTel').val()			,
				"sendUserDept"					:		$('#sendUserDept').val()		,
				"sendUserArea"					:		$('#sendUserArea').val()		,
				"optName"				        :		$('#optName').val()			    ,
				"optTel"					    :		$('#optTel').val()		        ,
				"optDept"				    	:		$('#optDept').val()		        ,
				"poolId"                        :       poolId                          ,
				"evalStar"                      :       evalStar                        ,
			};
			return param;
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
