var NeedEvalList=new Function();
/**评价*/
NeedEvalList.prototype = {
	selecter : "#needEvalListPage",
	pageSize : 4,
	//初始化执行
	init : function() {
		this.bindMetod(this);
		this.QryOrderLst("senior",this,0);
	},
	bindMetod : function(parentThis) {
		
		var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0];
		parentThis.dateBind(overLimitBeginDateObj,0);
		overLimitBeginDateObj.val("");
		var clearOverLimitBeginDateObj = parentThis.selecter.findById("img","clearOverLimitBeginDate")[0];
		clearOverLimitBeginDateObj.unbind("click").bind("click",function(){
			overLimitBeginDateObj.val("");
		});
		
		var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0];
		parentThis.dateBind(overLimitEndDateObj,0);
		overLimitEndDateObj.val("");
		var clearOverLimitEndDateObj = parentThis.selecter.findById("img","clearOverLimitEndDate")[0];
		clearOverLimitEndDateObj.unbind("click").bind("click",function(){
			overLimitEndDateObj.val("");
		});
		
		//查询绑定
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			var serviceLstBodyObj = parentThis.selecter.findById("tbody","serviceLstBody")[0];
			serviceLstBodyObj.html("");
			parentThis.QryOrderLst("senior",parentThis,0);
		});
		
		//初始化最新状态
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
		
		//提交绑定
		var submitObj =  parentThis.selecter.findById("a","submit")[0];
		submitObj.unbind("click").bind("click",function(){
			var serviceLstBodyObj = parentThis.selecter.findById("tbody","serviceLstBody")[0];
			serviceLstBodyObj.html("");
			parentThis.evalSubmit(parentThis);
		});
		
	},
	
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.val(d.getFullYear() + "-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate()));
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
	
	//检索销售单
	QryOrderLst : function(queryType,parentThis,pageIndex) {
		var demandIdObj = parentThis.selecter.findById("input","demandId")[0]; //单号
		var demandTypeObj = parentThis.selecter.findById("select","demandType")[0];//需求类型
		var demandType = demandTypeObj.find('option:selected').attr('dicId');
		var overLimitBeginDateObj = parentThis.selecter.findById("input","overLimitBeginDate")[0]; //办结开始时间
		var overLimitEndDateObj = parentThis.selecter.findById("input","overLimitEndDate")[0]; //办结截止时间
		var param = {
			"demandId"					:		demandIdObj.val()				,
			"demandType"				:		demandType						,
			"overLimitBeginDate"		:		overLimitBeginDateObj.val()		,
			"overLimitEndDate"			:		overLimitEndDateObj.val()		,
		};
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		
		common.pageControl.start(URL_QUERY_NEED_EVAL_LIST.encodeUrl(),
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
	
	//创建HTML
	createLstHtml : function(parentThis,data,orderLstBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var orderLstFootObj = parentThis.selecter.findById("div","orderLstFoot")[0];
		if(dataLst.length > 0 ){
			orderLstFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="demandInfo" demandId="'+obj.demand_id+'" departmentId="'+obj.department_id+'" department="'+obj.department+'" serviceIds="'+obj.serviceIds+'">');
				html.push('<td style="color:#141DE6;cursor: pointer;text-decoration:underline">'+obj.demand_id+'</td>');
				html.push('<td >'+splitStr(obj.demand_theme,10)+'</td>');
				html.push('<td >'+obj.create_time+'</td>');
				html.push('<td >'+obj.over_time+'</td>');
				html.push('<td >'+obj.summary+'</td>');
				html.push('<td >'+obj.over_eval+'</td>');
				html.push('<td >'+obj.over_opinion+'</td>');
				html.push('<td >');
				html.push(obj.department);
				html.push('   <a name="departmentLink" style="color: #141DE6;text-decoration:underline" href="javascript:void(0)">查 看</a> ');
				html.push('</td>');
				html.push('<td>');
				for (var int = 0; int < 5; int++) {
					html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
				}
				html.push('</td>');
				html.push('<td name="" ><input type="text" class=" w130" style="width:90%;" name="evalContent" maxlength="500"/></td>');
				html.push('</tr>');
			});
		}else{
				orderLstFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		orderLstBodyObj.html(html.join(''));
		var orderLstBodyObjHeight=orderLstBodyObj.height();
		var tableContentObject=parentThis.selecter.findById("div","tableContentHeight")[0];
		var tableContentObjectHeight=tableContentObject.height();
		if(orderLstBodyObjHeight>=200){
			tableContentObject.hide();
		}else{
			tableContentObject.show();
			tableContentObjectHeight=200-orderLstBodyObjHeight;
			tableContentObject.height(tableContentObjectHeight);
		}
		
		
		var tbodyObj= parentThis.selecter.findById("tbody","orderLstBody")[0];
		tbodyObj.find("a[name=evalStar]").unbind("click").bind("click",function(){
			
			var thisAObj=$(this);
			thisAObj.parent().children("a[name=evalStar]").removeClass();
			thisAObj.prevAll().addClass("evalStarYellow");
			thisAObj.addClass("evalStarYellow");
			thisAObj.parent().parent("tr").attr("index",thisAObj.attr("index"));
			thisAObj.nextAll().addClass("evalStarGrey");
		});
		
		//行点击事件
		tbodyObj.find("tr[name=demandInfo]").find("td:lt(7)").unbind("click").bind("click",function(){
			 var demandId=$(this).parent("tr[name=demandInfo]").attr("demandId");
			window.open('html/orderDetail/recordOfDemandView.html?demandId='+demandId+'&isHistory=Y&handleType=query');
		});
		
		//查看服务单
		tbodyObj.find("a[name=departmentLink]").unbind("click").bind("click",function(){
			 var trObj=$(this).parent().parent("tr[name=demandInfo]");
			 var departmentId=trObj.attr("departmentId");
			 var serviceIds=trObj.attr("serviceIds");
			 parentThis.queryServiceData(parentThis,departmentId,serviceIds);
		});
		
	},
	
	//评价数据保存
	evalSubmit:function(parentThis){
		
		var evalSet=[];
		var tempCount=0;
		var tempStr="";
		var tbodyObj= parentThis.selecter.findById("tbody","orderLstBody")[0];
		tbodyObj.find("tr[name=demandInfo]").each(function(i) {
			
			var trObj=$(this);
			var demandId=trObj.attr("demandId");
			var departmentId=trObj.attr("departmentId");
			var department=trObj.attr("department");
			var serviceIds=trObj.attr("serviceIds");
			var xxImgSet=trObj.find("a[name=evalStar][class=evalStarYellow]");
			var evalContent=trObj.find("input[name=evalContent]").val();
			if(""!=evalContent && 0==xxImgSet.length){
				tempCount++;
				tempStr+="需求单号："+demandId+",参与部门："+department+"<br/>";
			}
			if(xxImgSet.length>0){
				var eavlObjInfo={
						"o_type"			:		"ORG"				,
						"demandId"			:		demandId			,
						"departmentId"		:		departmentId		,
						"serviceIds"		:		serviceIds			,
						"evalStar"			:		xxImgSet.length		,
						"evalContent"		:		evalContent	
				};
				evalSet.push(eavlObjInfo);
			}
        });
		
		//未选择星型评价填写评价数据
		if(tempCount>0){
			tempStr+="评价信息填写未满足要求";
			layer.alert(tempStr,8);
			return false;
		}
		//未填写需求单数据
		if(evalSet.length==0){
			layer.alert("请填写评价信息后提交",8);
			return false;
		}
		var param={
				"evalSet"	:	JSON.stringify(evalSet)
		};
		$.jump.ajax(URL_SAVE_EVAL_DATA.encodeUrl(), function(json) {
			if(json.code == "0"){
//				layer.alert("评价成功",9);
				parentThis.QryOrderLst("senior",parentThis,0);
			}else{
				layer.alert("评价失败 ",8);
			}
		}, param, false,false);
	},
	
	/**查询服务单数据信息*/
	queryServiceData:function(parentThis,departmentId,serviceIds){
		
		var param={
				"serviceIds"		:		serviceIds		
		};
		$.jump.ajax(URL_QUERY_NEED_EVAL_SERVICE_INFO.encodeUrl(), function(json) {
			if(json.code == "0"){
				var serviceLstBodyObj = parentThis.selecter.findById("tbody","serviceLstBody")[0];
				serviceLstBodyObj.html("");
				parentThis.createServiceListHtml(parentThis,json,serviceLstBodyObj);
			}else{
				layer.alert('获取数据异常',8);
			}
		}, param,  false,false);
	},
	
	/**创建服服务单数据*/
	createServiceListHtml:function(parentThis,data,serviceLstBodyObj){
		var html=[];
		var dataLst = data.data;
		
		if(dataLst.length > 0 ){
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.service_id+'</td>');
				html.push('<td>'+obj.service_desc+'</td>');
				html.push('<td>'+common.date.diffDateTimeReturnStr(obj.send_time,obj.over_limit)+'</td>');
				html.push('<td>'+obj.send_time+'</td>');
				html.push('<td>'+obj.over_time+'</td>');
				html.push('<td>'+common.date.diffDateTimeReturnStr(obj.send_time,obj.over_time)+'</td>');
				html.push('<td>'+obj.summary+'</td>');
				html.push('</tr>');
			});
		}else{
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
		}
		serviceLstBodyObj.html(html.join(''));
	},
};