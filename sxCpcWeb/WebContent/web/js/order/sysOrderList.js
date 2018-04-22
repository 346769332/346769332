var SysOrderList = new Function();

SysOrderList.prototype = {
	selecter : "#sysOrderLstPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,orderLstBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		if(dataLst.length > 0 ){
			orderLstFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr >');
				html.push('<td >'+obj.flow_record_id+'</td>');
				html.push('<td >'+obj.flow_theme+'</td>');
				html.push('<td >'+obj.opter_name+'</td>');
				html.push('<td >'+obj.node_name+'</td>');
				html.push('<td >'+obj.create_time+'</td>');
				html.push('<td >'+obj.opter_org_name+'</td>');
				html.push('<td >'+obj.out_sys_name+'</td>');
				html.push('<td >'+obj.opt_status+'</td>');
				html.push('<td><a href="#" class="but" name="chakan" flowRecordId="'+obj.flow_record_id+'">查看</a></td>');
				
				html.push('</tr>');
			});
		}else{
				orderLstFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		orderLstBodyObj.html(html.join(''));
		
		$("#sysOrderLstPage").find("a[name=chakan]").unbind("click").bind("click",function(){
			window.open('html/orderDetail/sysOrderDetail.html?flowRecordId='+$(this).attr("flowRecordId")+'&isHistory=Y&handleType=query'); 
		});
	},
	//检索销售单
	QryOrderLst : function(queryType,parentThis,pageIndex) {
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
		var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
		var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
		var sysLstObj =  parentThis.selecter.findById("select","sysId")[0]; 
		var sysId = sysLstObj.find('option:selected').attr('dicId');
		var param = {
			"handleType" 	: 		"queryOrderLst"					,
			"queryTime"		:		sendDateObj.val()				,
			"themeSeach"	:		themeSeachObj.val()				,
			"sendUserName"	:		sendUserNameObj.val()			,
			"out_sys_id"	:		sysId
		};
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		
		common.pageControl.start(URL_QUERY_SYS_ORDER.encodeUrl(),
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
		
		/************日期查询绑定*********/
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		parentThis.dateQryBind(seniorObj,parentThis);
		/************日期查询绑定*********/
		
		
		var sysIdObj =  parentThis.selecter.findById("select","sysId")[0];
		var param = {
					"handleType" 	: 		"queryData"				,
				};
		$.jump.ajax(URL_QUERY_SYS_ORDER.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					sysIdObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					sysIdObj.html(html.join(''));
				}
				
			};
		}, param, false,false);
	},
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.val(d.getFullYear() + "-"+(d.getMonth()+1)+"-"+d.getDate());
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
	//日期查询绑定
	dateQryBind : function(obj,parentThis){
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		obj.unbind("click").bind("click",function(){
			seniorObj.attr("class","butInit");
			$(this).attr("class","but");
			var objId = $(this).attr("id");
			if(objId == "senior"){
				parentThis.QryOrderLst(objId,parentThis,0,"");
			}
		});
	},
};
