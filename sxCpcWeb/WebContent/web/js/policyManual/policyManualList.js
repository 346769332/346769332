var PolicyManualList=new Function();
/**政策*/
PolicyManualList.prototype = {
	selecter : "#policyManualListPage",
	pageSize : 10,
	status    : null,
	statusparam:null,
	//初始化执行
	init : function(statusparam) {
		var parentThis=this;
		this.statusparam=eval("("+statusparam+")");
		this.status = eval("("+statusparam+")").state;
		this.initpolicyType(this);
		this.bindMetod(this);
		
		if(parentThis.status == 'N'){
			var policyObj = parentThis.selecter.findById("div","operButtion")[0]; //政策类型
			policyObj.hide();
		}
		if(parentThis.status == 'Y'){
			var relPolicyManualObj = parentThis.selecter.findById("a","relPolicyManual")[0];
			relPolicyManualObj.hide();
		}
		if(parentThis.status=="P"){
			var addPolicyManualObj = parentThis.selecter.findById("a","addPolicyManual")[0];
			addPolicyManualObj.hide();
			var delPolicyManualObj = parentThis.selecter.findById("a","delPolicyManual")[0];
			delPolicyManualObj.hide();
		}
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
		
		//初始数据查询
		parentThis.showList(parentThis,0);
			
		//查询绑定
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			parentThis.showList(parentThis,0);
		});
		
		var changeObj =  parentThis.selecter.findById("select","policyId")[0];
		changeObj.unbind("change").bind("change",function(){
			var pType=changeObj.find('option:selected').attr('dicId'); 
			parentThis.initChildType(parentThis,pType);
		});
		//刪除政策
		var delPolicyManual = parentThis.selecter.findById("a","delPolicyManual")[0];
		delPolicyManual.unbind("click").bind("click",function(){
			var ids="";
			var tbodyObj= parentThis.selecter.findById("tbody","policyManualListBody")[0];
			tbodyObj.find("input[type=checkbox][name=policyManualBox]").each(function(i,obj){
				var boxObj=$(this);
				if(boxObj.is(':checked')){
					ids+=obj.id+",";
				}
			}); 
			var confirm=layer.confirm("您确定要删除选中的政策手册？", function(){
				var deleteParam={
						"type"		: 		"delete",
						"policyID"	:		 ids,
				};
				$.jump.ajax(URL_DELETE_POLICYMANUAL_LIST.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						parentThis.showList(parentThis,0);
					}else{
						layer.alert("删除失败!");	
						layer.close(confirm);
					}
				}, deleteParam, true,true);
			});
		});
		
		//新增绑定
		var addObj =  parentThis.selecter.findById("a","addPolicyManual")[0];
		addObj.unbind("click").bind("click",function(){
			var contentObj = $("#content");
			$.jump.loadHtmlForFun("/web/html/policyManual/addPolicyManual.html".encodeUrl(),function(menuHtml){
				contentObj.html(menuHtml);
				var addPM = new AddPolicyManual();
				addPM.init(parentThis,'add',null,parentThis.statusparam);
			});
		});
		
		//发布政策
		var delPolicyManual = parentThis.selecter.findById("a","relPolicyManual")[0];
		delPolicyManual.unbind("click").bind("click",function(){
			
			var checkNum=null;
			var tbodyObj= parentThis.selecter.findById("tbody","policyManualListBody")[0];
			tbodyObj.find("input[type=checkbox][name=policyManualBox]:checked").each(function(i,obj){
				checkNum+=1;
			});
			tbodyObj.find("input[type=checkbox][name=policyManualBox]:checked").each(function(i,obj){
				if(checkNum>1){
					layer.alert("审批操作不支持多选!!！");	
					return;
				}else{
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						var trObj=$(this).parent().parent("tr[name=policyManual]");
						var stateName = trObj.attr("polStateName");
						var state = trObj.attr("polState");
						var policyInfo={
								"type"          :       "release",
								"policyID"		:	 	obj.id,
						};
						if(state=='S'){
							var confirm=layer.confirm("确定发布此政策？？？", function(){
								
								$.jump.ajax(URL_DELETE_POLICYMANUAL_LIST.encodeUrl(), function(json) {
									if(json.code == "0" ){
										layer.close(confirm);
										parentThis.showList(parentThis,0);
									}else{
										layer.alert("发布失败!");	
									}
								}, policyInfo, true,false);
							});
						}else if(state=='O'){
							var policyManualPage = $("#policyManualListPage");
							var shenpiPage = "".findById("div", "shenpiPage",policyManualPage.parent())[0];
							
							$.jump.loadHtmlForFun("/web/html/policyManual/approvalPolicyManual.html".encodeUrl(),function(menuHtml){
								
								policyManualPage.hide();
								shenpiPage.html(menuHtml);
								var shenpi = new Shenpi();
								shenpiPage.show();
								shenpi.init(parentThis,obj.id,function(){
									parentThis.showList(parentThis,0);
									shenpiPage.hide();
									policyManualPage.show();
								});
							});
						}
					}
				}

			});
				
		});
	},
	
	initpolicyType:function(parentThis){
		var policyIdObj =parentThis.selecter.findById("select","policyId")[0];
		var param={
				"dicType" 	: 		"policyType"		
		};
		var html = [];
		policyIdObj.html("");
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					policyIdObj.html(html.join(''));
				}
				parentThis.initChildType(parentThis,"");
			}else{
				layer.alert(msg);
			};
		}, param, true,false);
	},
	
	initChildType:function(parentThis,pType){
		var html = [];
		var childTypeLi=parentThis.selecter.findById("li","childLi")[0];
		var polChilldIdObj =parentThis.selecter.findById("select","polChilId")[0];
		polChilldIdObj.html("");
		if(""==pType){
			childTypeLi.hide();
			return ;
		}else{
			childTypeLi.show();
		}
		var param={
				"dicType" 	: 		pType.toLocaleLowerCase()+"Type"		
		};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					polChilldIdObj.html(html.join(''));
				}else{
					childTypeLi.hide();
				}
			}else{
				layer.alert(msg);
			};
		}, param, true,false);
	},
	
	showList : function(parentThis,pageIndex){
		var policyIdObj = parentThis.selecter.findById("select","policyId")[0]; //政策类型
		var policyId = policyIdObj.find('option:selected').attr('dicId');
		var polChilIdObj = parentThis.selecter.findById("select","polChilId")[0];//政策子类
		var polChilId = polChilIdObj.find('option:selected').attr('dicId');
		var polNameObj=parentThis.selecter.findById("input","polContent")[0];   //政策内容
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
		var endDateObj = parentThis.selecter.findById("input","endDate")[0]; //截止时间
		var endData = endDateObj.val();
		var sendData = sendDateObj.val();
		var status = this.status;
		
		if(parentThis.status == 'N'){
			var policyObj = parentThis.selecter.findById("div","operButtion")[0]; //政策类型
			policyObj.hide();
		}
		if(parentThis.status == 'Y'){
			var relPolicyManualObj = parentThis.selecter.findById("a","relPolicyManual")[0];
			relPolicyManualObj.hide();
		}
		if(parentThis.status=="P"){
			var addPolicyManualObj = parentThis.selecter.findById("a","addPolicyManual")[0];
			addPolicyManualObj.hide();
			var delPolicyManualObj = parentThis.selecter.findById("a","delPolicyManual")[0];
			delPolicyManualObj.hide();
		}
		
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
		
		common.pageControl.start(URL_QUERY_POLICYMANUAL_LIST.encodeUrl(),
			 pageIndex,
			 parentThis.pageSize,
			 param,
			 "data",
			 null,
			 listFootObj,
			 "",
			 function(data,dataSetName,showDataSpan){
				var listBodyObj = parentThis.selecter.findById("tbody","policyManualListBody")[0];
				listBodyObj.html("");
				parentThis.createLstHtml(parentThis,data,listBodyObj);
			});
	},
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","policyManualListFoot")[0];
		
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				showObject={};
				if(null!=obj.infoAttr && undefined!=obj.infoAttr){
					$.each(obj.infoAttr, function (j, objs) {
						var tempKey=objs.attr_id;
						showObject[tempKey]=objs.attr_value;
					});
				}
				html.push('<tr name="policyManual" policyId="'+obj.id+'"  polState="'+obj.state+'" polStateName="'+obj.stateName+'" >');
				html.push('<td>');
				if("Y"!=obj.state && "E"!=obj.state && "N"!=parentThis.status){
					html.push('<input id="'+obj.id+'" name="policyManualBox" type="checkbox" >');
				}
				html.push('</td>');
				html.push('<td >'+obj.type+'</td>');
				html.push('<td style="word-break:break-all;cursor: pointer;text-align:left;"><a title="'+common.utils.returnStr(obj.policyTheme)+'">'+common.utils.cutstr(common.utils.returnStr(obj.policyTheme),40)+'</a></td>');
				
				html.push('<td >');
				html.push('<a  style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="policyManualInfo">详情</a>');
				html.push('</td>');
				html.push('<td >'+obj.createTime+'</td>');	
				html.push('<td >'+obj.optName+'</td>');	
				if(obj.optId==data.promoters_id && ("E"==obj.state || "S"==obj.state )&& "P"!=parentThis.status && "N"!=parentThis.status){
					html.push('<td style="word-break:break-all;cursor: pointer;">');
					html.push('<a style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" pmId="'+obj.id+'" name="editManualInfo">修改</a>');
					html.push('</td>');
				}else{
					html.push('<td >'+obj.stateName+'</td>');
				}
				html.push('<td >'+common.utils.returnStr(showObject.SPSTAE)+'</td>');
				html.push('<td style="word-break:break-all;cursor: pointer;"><a title="'+common.utils.returnStr(showObject.SPDESC)+'">'+common.utils.cutstr(common.utils.returnStr(showObject.SPDESC),25)+'</a></td>');
			});
		}else{
			listFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="15">');
			html.push('<div>');
			html.push('<div	style="width:120px;"> 无相关数据</div>');
			html.push('<div>');
			html.push('</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
		
		//查看詳情
		listBodyObj.find("a[name=policyManualInfo]").unbind("click").bind("click",function(){
			var trObj=$(this).parent().parent("tr[name=policyManual]");
			var cont = trObj.attr("policyId");
			window.open("../web/html/policyManual/policyManualInfo.html?policyId="+cont);
		});
		

		listBodyObj.find("a[name=editManualInfo]").unbind("click").bind("click",function(){
			var trObj=$(this).parent().parent("tr[name=policyManual]");
			var contentObj = $("#content");
			$.jump.loadHtmlForFun("/web/html/policyManual/addPolicyManual.html".encodeUrl(),function(menuHtml){
				contentObj.html(menuHtml);
				var addPM = new AddPolicyManual();
				addPM.init(parentThis,'update',trObj.attr("policyId"),parentThis.statusparam);
			});
			
		});
	}
	
};