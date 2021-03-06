var OrderList = new Function();

OrderList.prototype = {
	selecter : "#orderLstPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	//查询销售单
	loadSaleOrderLst : function(queryType,parentThis,pageIndex,orderType) {
		var param = {
			"queryType" 	: 		queryType		,
			"queryStatusCd"	:		"100101"		, //查询状态
			"orderType"		:		"dairen"
		};
		var orderLstBodyObj = parentThis.selecter.findById("tbody","orderLstBody")[0];
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		orderLstBodyObj.html("");
		orderLstFootObj.html("");
		common.pageControl.start(URL_QUERY_ORDER.encodeUrl(),
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
		var latnId=data.latnId;
		if("290"==latnId  || true){
			$('#sendRank').show();
		}
		
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		if(dataLst.length > 0 ){
			orderLstFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr >');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.demand_id+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+splitStr(obj.demand_theme,10)+'</td>');
				if("290"==latnId){
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.rank_name+'</td>');
				}
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.promoters+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.tel+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.department+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.create_time+'</td>');
				if(obj.flag == "1"){
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'"><font color="red">'+obj.calimSurplusTime+'<font></td>');
				}else{
					html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.calimSurplusTime+'</td>');
				}
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.default_opt_name+'</td>');
				html.push('<td name="demandInfo" demandId="'+obj.demand_id+'">'+obj.urge_count+'</td>');
				
				if(obj.default_opt_id == ""){
					html.push('<td><a href="#" type="allHandle" class="but" name="chuli" demandId="'+obj.demand_id+'">处理</a></td>');
				}else{
					if(obj.default_opt_id == data.sysUserId){
						html.push('<td><a href="#" type="onlyClaim" class="but" name="chuli" demandId="'+obj.demand_id+'">处理</a></td>');	
					}
				}
				
				html.push('</tr>');
			});
		}else{
				orderLstFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		orderLstBodyObj.html(html.join(''));
		
		$("#orderLstPage").find("a[name=chuli]").unbind("click").bind("click",function(){
			
			if($(this).attr("type") == "allHandle"){
				window.open('html/orderDetail/orderDetail.html?demandId='+$(this).attr("demandId")+'&isHistory=N&handleType=allHandle'); 
			}else if($(this).attr("type") == "onlyClaim"){
				window.open('html/orderDetail/orderDetail.html?demandId='+$(this).attr("demandId")+'&isHistory=N&handleType=onlyClaim'); 
			}
		});
		$("#orderLstPage").find("td[name=demandInfo]").unbind("click").bind("click",function(){
			window.open('html/orderDetail/orderDetail.html?demandId='+$(this).attr("demandId")+'&isHistory=Y&handleType=query'); 
		});
	},
	//检索销售单
	QryOrderLst : function(queryType,parentThis,pageIndex,orderType) {
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
		var endDateObj = parentThis.selecter.findById("input","endDate")[0]; //截止时间
		var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
		var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
		var endData = endDateObj.val();
		var sendData = sendDateObj.val();
		if(sendData > endData && sendData != "" && endData != ""){
			layer.alert("认领截止时间必须大于发起时间",8);
			return;
		}
		var param = {
			"queryType" 	: 		queryType						,
			"queryStatusCd"	:		"100101"						, //查询状态
			"sendDate"		:		sendDateObj.val()				,
			"endDate"		:		endDateObj.val()				,
			"themeSeach"	:		themeSeachObj.val()				,
			"sendUserName"	:		sendUserNameObj.attr("staffid")	,
			"orderType"		:		"dairen"
		};
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		
		common.pageControl.start(URL_QUERY_ORDER.encodeUrl(),
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
		
		var overMonthObj =  parentThis.selecter.findById("a","overMonth")[0];
		parentThis.dateQryBind(overMonthObj,parentThis);
		
		var listAllObj=parentThis.selecter.findById("a","listAll")[0];
		parentThis.dateQryBind(listAllObj,parentThis);
		
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		parentThis.dateQryBind(seniorObj,parentThis);
		/************日期查询绑定*********/
		
		/************tab查询绑定*********
		var jiedanTabObj =  parentThis.selecter.findById("li","jiedan")[0];
		parentThis.tabQryBind(jiedanTabObj,parentThis);
		
		var dairenTabObj =  parentThis.selecter.findById("li","dairen")[0];
		parentThis.tabQryBind(dairenTabObj,parentThis);
		/************tab查询绑定*********/
		
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
					},'AAA');
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
	//时间绑定
	endDateBind : function(obj,AddDayCount){
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
	//	var tabObj =  parentThis.selecter.findById("div","orderTab")[0];
		obj.unbind("click").bind("click",function(){
			
			//tabObj.find("li").attr("class","");
			//tabObj.find("li[id=jiedan]").attr("class","hover");
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
	
//	//tab查询绑定
//	tabQryBind : function(obj,parentThis){
//		var dateQueryObj = parentThis.selecter.findById("div","dateQuery")[0];
//		var orderTabObj = parentThis.selecter.findById("div","orderTab")[0];
//		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
//		obj.unbind("click").bind("click",function(){
//			orderTabObj.find("li").attr("class","");
//			$(this).attr("class","hover");
//			var objId = "";
//			if(seniorObj.attr("class") == "but"){
//				objId = seniorObj.attr("id");
//			}
//			if(objId == ""){
//				var dateObj = dateQueryObj.find("a[class=but]");
//				objId = dateObj.attr("id");
//			}
//			if(objId == "senior"){
//				parentThis.QryOrderLst(objId,parentThis,0,obj.attr("id"));
//			}else{
//				parentThis.loadSaleOrderLst(objId,parentThis,0,obj.attr("id"));
//			}
//		});
//	}
};
