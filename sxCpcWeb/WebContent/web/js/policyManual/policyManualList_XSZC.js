var PolicyManualList_XSZC=new Function();
/**政策*/
PolicyManualList_XSZC.prototype = {
	selecter : "#policyManualXSZCPage",
	pageSize : 10,
	status    : null,
	parentJsThis : null,
	//初始化执行
	init : function(parentJsThis,param) {
		this.parentJsThis = parentJsThis;
		this.status = param;
		this.bindMetod(this);
		//初始数据查询
		this.showList(this,0);
		
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
		
		//初始化子政策
//		policyIdObj.unbind("onchange").bind("change",function(){
			var polChilldIdObj =parentThis.selecter.findById("select","polChilId")[0];
			var param={
					"dicType" 	: 		"xszcType"		
			};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						polChilldIdObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						polChilldIdObj.html(html.join(''));
					}
				}else{
					layer.alert(msg);
				};
			}, param, false,false);
//		})
		
		
			
		//查询绑定
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			parentThis.showList();
		});
		
		var changeObj =  parentThis.parentJsThis.selecter.findById("select","policyId")[0];
		changeObj.unbind("onchange").bind("change",function(){
			parentThis.showList();
		});
		
		//刪除政策
		var delPolicyManual = parentThis.selecter.findById("a","delPolicyManual")[0];
		delPolicyManual.unbind("click").bind("click",function(){
			var tbodyObj= parentThis.selecter.findById("tbody","policyManualListBody")[0];
			tbodyObj.find("input[type=checkbox][name=policyManualBox]").each(function(i,obj){
				var boxObj=$(this);
				if(boxObj.is(':checked')){
					var deleteParam={
							"type"		: 		"delete",
							"policyID"	:		obj.id,
					};
					parentThis.deletePolicyManual(parentThis,deleteParam);
				}
			});
	
		});
		//新增绑定
		var addObj =  parentThis.selecter.findById("a","addPolicyManual")[0];
		addObj.unbind("click").bind("click",function(){
			var contentObj = $("#content");
			$.jump.loadHtmlForFun("/web/html/policyManual/addPolicyManual.html".encodeUrl(),function(menuHtml){
				contentObj.html(menuHtml);
				var addPM = new AddPolicyManual();
				addPM.init(parentThis,'add',null);
			});
		});
		
		//发布政策
		var delPolicyManual = parentThis.selecter.findById("a","relPolicyManual")[0];
		delPolicyManual.unbind("click").bind("click",function(){
			
			var tbodyObj= parentThis.selecter.findById("tbody","policyManualListBody")[0];
			tbodyObj.find("input[type=checkbox][name=policyManualBox]").each(function(i,obj){
				var boxObj=$(this);
				if(boxObj.is(':checked')){
					var trObj=$(this).parent().parent("tr[name=policyManual]");
					var state = trObj.attr("polState");
					var policyInfo={
							"type"          :       "release",
							"policyID"		:	 	obj.id,
					};
					if(state=='待发布'){
						var confirm=layer.confirm("确定发布此政策？？？", function(){
							
							$.jump.ajax(URL_DELETE_POLICYMANUAL_LIST.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.close(confirm);
									parentThis.showList();
								}else{
									layer.alert("删除失败!");	
								}
							}, policyInfo, false,false);
						});
					}else{
						layer.alert("政策处于"+state+"状态，不能发布！！！");
					}
				}
			});
	
		});
	},
	showList : function(){
		var parentThis = this;
		var policyIdObj = parentThis.parentJsThis.selecter.findById("select","policyId")[0]; //政策类型
		var policyId = policyIdObj.find('option:selected').attr('dicId');
		var polChilIdObj = parentThis.selecter.findById("select","polChilId")[0];//政策子类
		var polChilId = polChilIdObj.find('option:selected').attr('dicId');
		var polNameObj=parentThis.selecter.findById("input","polContent")[0];   //政策内容
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
		var endDateObj = parentThis.selecter.findById("input","endDate")[0]; //截止时间
		var endData = endDateObj.val();
		var sendData = sendDateObj.val();
		var status = this.status;
		
		if(this.status == 'N'){
			var policyObj = parentThis.parentJsThis.selecter.findById("div","operButtion")[0]; //政策类型
			policyObj.hide();
		}
		
//		if(policyId == null || policyId == '' || policyId == undefined){
//			layer.alert("政策类型不能为空",8);
//		}
		if(sendData > endData && sendData != "" && endData != ""){
			layer.alert("截止时间必须大于发起时间",8);
			return;
		}
		
		var param = {
			"policyId"					:		policyId				,
			"polChilId"					:		polChilId				,
			"polContent"				:		polNameObj.val()		,
			"endData"					:		endData					,
			"sendData"					:		sendData		        ,
			"status"                    :       status
		};
		var listFootObj = parentThis.selecter.findById("div","policyManualListFoot")[0];
		
		parentThis.parentJsThis.queryPageList(param,listFootObj,function(data){
			var listBodyObj = parentThis.selecter.findById("tbody","policyManualListBody")[0];
			listBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
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
		})
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","policyManualListFoot")[0];
		var showObject={
				"ZTQD"	:	"",
				"XXMD"	:	"",
				"MBKH"	:	"",
				"XSXT"  :   "",
				"ZCMD"  :   ""
			};
		
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="policyManual" policyId="'+obj.id+'"  polState="'+obj.state+'" >');
				html.push('<td ><input id="'+obj.id+'" name="policyManualBox" type="checkbox" ></td>');
				html.push('<td >'+obj.type+'</td>');
				html.push('<td >'+obj.detailType+'</td>');
				$.each(obj.infoAttr, function (j, objs) {
					
					var tempKey=objs.attr_id;
					showObject[tempKey]=objs.attr_value;
				});
				html.push('<td >'+showObject.XSMD+'</td>');
				html.push('<td >'+showObject.ZTQD+'</td>');
				html.push('<td >'+showObject.MBKH+'</td>');
				html.push('<td >'+showObject.XSXT+'</td>');
				html.push('<td >'+showObject.ZCMD+'</td>');
				
				html.push('<td >');
				html.push('<a  style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="policyManualInfo">詳情</a>');
				html.push('</td>');
				html.push('<td >'+obj.beginDate+'</td>');				
				html.push('<td >'+obj.endDate+'</td>');
				html.push('<td >'+obj.state+'</td>');
				html.push('<td ></td>');
				html.push('<td ></td>');
			});
			
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div> 无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		//查看詳情
		var tbodyObj= parentThis.selecter.findById("tbody","policyManualListBody")[0];
		tbodyObj.find("a[name=policyManualInfo]").unbind("click").bind("click",function(){
		var trObj=$(this).parent().parent("tr[name=policyManual]");
		var cont = trObj.attr("policyId")
//			alert(trObj.attr("polContent"));
		window.open("../web/html/policyManual/policyManualInfo.html?policyId="+cont);
		});

	},
	//删除政策手冊数据
	deletePolicyManual:function(parentThis,policyInfo){
		
			$.jump.ajax(URL_DELETE_POLICYMANUAL_LIST.encodeUrl(), function(json) {
				if(json.code == "0" ){
					parentThis.showList();
				}else{
					layer.alert("删除失败!");	
				}
			}, policyInfo, false,false);
	},
	
};