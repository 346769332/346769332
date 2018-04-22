var AuthorityShortProcessList = new Function();

AuthorityShortProcessList.prototype = {
	selecter : "#authorityShortProcessPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
	
		//清空功能
		var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#workflow_sort").val(""); //需求状态
			$("#workflow_type").val(""); //需求状态
			$("#sendBeginDate").val(""); //需求状态
			$("#sendEndDate").val(""); //需求状态
			$("#authorityStaff").val(""); //所属短流程名称
			$("#authorityStaffId").val(""); //所属短流程名称
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
		//流程大类
		var sortParam={
				"flag"	:	1	
			};
			var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
			$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
				var html = [];
				workflowClassObj.html("");
				if(json.code=="0"){
					var dataObj=json.data;
					if(dataObj.length > 0 ){
						html.push('<option sort_id ="">请选择</option>');
						$.each(dataObj,function(i,obj){
							html.push("<option sort_id='"+obj.ACT_WORKFLOW_SORT_ID+"' value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
							//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
						});
					}
					html.push('</div>');
					workflowClassObj.html(html.join(''));	
				}
			},sortParam,null,false,false);
		//流程小类
			var teamselectInfo = $("#workflow_sort");
			var teamselectInfos = $("#workflow_type");
			var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
			var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
			var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
			var sortParam={
					"flag"			:	2,	
					"workflowClass"	:	workflow_sort
				};
				$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
					var html = [];
					if(json.code=="0"){
						var dataObj=json.data;
						workflow_typeObj.html("");
						if(dataObj.length > 0 ){
							html.push('<option type_id ="">请选择</option>');
							$.each(dataObj,function(i,obj){
								html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
								//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
							});
						}
						html.push('</div>');
						workflow_typeObj.html(html.join(''));	
						//parentThis.createWorkflowSortHtml(parentThis,dataObj);
					}
				},sortParam,null,false,false);
				teamselectInfo.change("change", function() {

					var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
					var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
					var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
					if(workflow_sort==""){
						workflow_typeObj.html('<option type_id ="">请选择</option>');
					}else{
						var sortParam={
								"flag"			:	2,	
								"workflowClass"	:	workflow_sort
							};
							$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
								var html = [];
								if(json.code=="0"){
									var dataObj=json.data;
									workflow_typeObj.html("");
									if(dataObj.length > 0 ){
										html.push('<option type_id ="">请选择</option>');
										$.each(dataObj,function(i,obj){
											html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
										});
									}
									html.push('</div>');
									workflow_typeObj.html(html.join(''));	
									
								}
							},sortParam,null,false,false);
					}
				});
				teamselectInfos.change("change", function() {
					parentThis.getWorkFlowInfo(parentThis);
				});
				$("#authority").css("color",function(){
				    return "#1592ff";
			    });
				$("#authority").css("border-bottom",function(){
					return "2px solid rgb(32, 151, 255)";
				});
				
				//tab选项事件
				//授权点击事件
				var authorityObj = parentThis.selecter.findById("a", "authority")[0];
				authorityObj.unbind("click").bind("click", function() {
					debugger;
					$("#authority").css("color",function(){
					    return "#1592ff";
				    });
					$("#authority").css("border-bottom",function(){
						return "2px solid rgb(32, 151, 255)";
					});
					$("#isAuthority").css("border-bottom",function(){
						return "0px";
					});
					$("#isAuthority").css("color","");
					$('#tabs-1').show();
					$('#tabs-2').hide();
					
					
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
					//流程大类
					var sortParam={
							"flag"	:	1	
						};
						var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
						$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
							var html = [];
							workflowClassObj.html("");
							if(json.code=="0"){
								var dataObj=json.data;
								if(dataObj.length > 0 ){
									html.push('<option sort_id ="">请选择</option>');
									$.each(dataObj,function(i,obj){
										html.push("<option sort_id='"+obj.ACT_WORKFLOW_SORT_ID+"' value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
										//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
									});
								}
								html.push('</div>');
								workflowClassObj.html(html.join(''));	
							}
						},sortParam,null,false,false);
					//流程小类
						var teamselectInfo = $("#workflow_sort");
						var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
						var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
						var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
						var sortParam={
								"flag"			:	2,	
								"workflowClass"	:	workflow_sort
							};
							$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
								var html = [];
								if(json.code=="0"){
									var dataObj=json.data;
									workflow_typeObj.html("");
									if(dataObj.length > 0 ){
										html.push('<option type_id ="">请选择</option>');
										$.each(dataObj,function(i,obj){
											html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
											//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
										});
									}
									html.push('</div>');
									workflow_typeObj.html(html.join(''));	
									//parentThis.createWorkflowSortHtml(parentThis,dataObj);
								}
							},sortParam,null,false,false);
					
							teamselectInfo.change("change", function() {

								var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
								var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
								var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
								if(workflow_sort==""){
									workflow_typeObj.html('<option type_id ="">请选择</option>');
								}else{
									var sortParam={
											"flag"			:	2,	
											"workflowClass"	:	workflow_sort
										};
										$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
											var html = [];
											if(json.code=="0"){
												var dataObj=json.data;
												workflow_typeObj.html("");
												if(dataObj.length > 0 ){
													html.push('<option type_id ="">请选择</option>');
													$.each(dataObj,function(i,obj){
														html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
														//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
													});
												}
												html.push('</div>');
												workflow_typeObj.html(html.join(''));	
												//parentThis.createWorkflowSortHtml(parentThis,dataObj);
											}
										},sortParam,null,false,false);
								}
							});
				});
				
				//取消授权点击事件
				var isAuthorityObj = parentThis.selecter.findById("a", "isAuthority")[0];
				isAuthorityObj.unbind("click").bind("click", function() {
					$("#isAuthority").css("color",function(){
					    return "#1592ff";
				    });
					$("#isAuthority").css("border-bottom",function(){
						return "2px solid rgb(32, 151, 255)";
					});
					$("#authority").css("border-bottom",function(){
						return "0px";
					});
					$("#authority").css("color","");
					$('#tabs-1').hide();
					$('#tabs-2').show();
					
					//发起开始时间
					var sendBeginDateObj = parentThis.selecter.findById("input","isAuthor_sendBeginDate")[0];
					parentThis.dateBind(sendBeginDateObj,0);
					var clearSendBeginDateObj = parentThis.selecter.findById("img","isAuthor_clearSendBeginDate")[0];
					clearSendBeginDateObj.unbind("click").bind("click",function(){
						sendBeginDateObj.val("");
					});
					
					//发起结束时间
					var sendEndDateObj = parentThis.selecter.findById("input","isAuthor_sendEndDate")[0];
					parentThis.dateBind(sendEndDateObj,0);
					var clearSendEndDateObj = parentThis.selecter.findById("img","isAuthor_clearSendEndDate")[0];
					clearSendEndDateObj.unbind("click").bind("click",function(){
						sendEndDateObj.val("");
					});
					//流程大类
					var sortParam={
							"flag"	:	1	
						};
						var workflowClassObj =  parentThis.selecter.findById("select","isAuthor_workflow_sort")[0];
						$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
							var html = [];
							workflowClassObj.html("");
							if(json.code=="0"){
								var dataObj=json.data;
								if(dataObj.length > 0 ){
									html.push('<option sort_id ="">请选择</option>');
									$.each(dataObj,function(i,obj){
										html.push("<option sort_id='"+obj.ACT_WORKFLOW_SORT_ID+"' value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
										//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
									});
								}
								html.push('</div>');
								workflowClassObj.html(html.join(''));	
							}
						},sortParam,null,false,false);
					//流程小类
						var teamselectInfo = $("#isAuthor_workflow_sort");
						var workflow_typeObj =  parentThis.selecter.findById("select","isAuthor_workflow_type")[0];
						var workflowClassObj =  parentThis.selecter.findById("select","isAuthor_workflow_sort")[0];
						var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
						var sortParam={
								"flag"			:	2,	
								"workflowClass"	:	workflow_sort
							};
							$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
								var html = [];
								if(json.code=="0"){
									var dataObj=json.data;
									workflow_typeObj.html("");
									if(dataObj.length > 0 ){
										html.push('<option type_id ="">请选择</option>');
										$.each(dataObj,function(i,obj){
											html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
											//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
										});
									}
									html.push('</div>');
									workflow_typeObj.html(html.join(''));	
									//parentThis.createWorkflowSortHtml(parentThis,dataObj);
								}
							},sortParam,null,false,false);
					
							teamselectInfo.change("change", function() {

								var workflow_typeObj =  parentThis.selecter.findById("select","isAuthor_workflow_type")[0];
								var workflowClassObj =  parentThis.selecter.findById("select","isAuthor_workflow_sort")[0];
								var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
								if(workflow_sort==""){
									workflow_typeObj.html('<option type_id ="">请选择</option>');
								}else{
									var sortParam={
											"flag"			:	2,	
											"workflowClass"	:	workflow_sort
										};
										$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
											var html = [];
											if(json.code=="0"){
												var dataObj=json.data;
												workflow_typeObj.html("");
												if(dataObj.length > 0 ){
													html.push('<option type_id ="">请选择</option>');
													$.each(dataObj,function(i,obj){
														html.push("<option type_id='"+obj.ACT_WORKFLOW_TYPE_ID+"' value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
														//html.push('<div id ="'+obj.ACT_WORKFLOW_SORT_ID+'" name="divfu" sort_Id = "'+obj.ACT_WORKFLOW_SORT_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.ACT_WORKFLOW_SORT_ID+'"  src="images/ico+.gif" alt="">'+obj.ACT_WORKFLOW_SORT_NAME+'</div>');
													});
												}
												html.push('</div>');
												workflow_typeObj.html(html.join(''));	
												//parentThis.createWorkflowSortHtml(parentThis,dataObj);
											}
										},sortParam,null,false,false);
								}
							});
							debugger;
							parentThis.qrysubmitAuthorInfo(parentThis,0); 
				});
		//加载数据
		//parentThis.qrysubmitAuthorInfo(parentThis,0); 
		
		//点击选择被授权人
		var authorityStaffObj =  parentThis.selecter.findById("input","authorityStaff")[0];
		authorityStaffObj.unbind("click").bind("click",function(){
					parentThis.selectStaffInfo(parentThis);
		});
		//点击确认
		var submitInfoObj =  parentThis.selecter.findById("a","submitInfo")[0];
		submitInfoObj.unbind("click").bind("click",function(){
			debugger;
			var workflowCodeValArr = new Array;
			var workflowIdValArr = new Array;
	        $("#workFlowInfoBody :checkbox:checked").each(function(i){
	        	var trObj = $(this).parent().parent("tr[name=addauthorInfo]");
	        	workflowCodeValArr[i] = trObj.attr("workflowCode");
	        	workflowIdValArr[i] = trObj.attr("workflowId");
	        });
			var workflowCode = workflowCodeValArr.join(',');
			var workflowId = workflowIdValArr.join(',');
			parentThis.submitInfoAuthor(parentThis,workflowCode,workflowId);
		});
		
		//取消授权
		var deleteNormTypeObj= parentThis.selecter.findById("a","isAuthorBtn")[0];
		deleteNormTypeObj.unbind("click").bind("click",function(){
			var roleInfo={};
			var roleId="";
			var tbodyObj= parentThis.selecter.findById("tbody","isAuthorityShortProcessBody")[0];
			tbodyObj.find("input[type=checkbox][name=authorInfoBox]").each(function(i,obj){
				var boxObj=$(this);
				if(boxObj.is(':checked')){
					var trObj = $(this).parent().parent("tr[name=authorInfo]");
					roleId=trObj.attr("workflowId");
					roleInfo = {
							"type"			 	:   	 "deleteAuthorInfo",
							"workflowCode"   	: trObj.attr("workflowCode"),
							"workfowName"   	: trObj.attr("workfowName"),
							"ear_staffName"     : trObj.attr("ear_staffName"),
					};
				}
			});
			if(roleId.length==0){
				layer.alert("请选择需取消授权信息",8);
				return false;
			}
			parentThis.deleteAuthorInfo(parentThis,roleInfo);
		});
		
		parentThis.getWorkFlowInfo(parentThis);
	},
	//查询所属短流程类型的流程
	getWorkFlowInfo : function(parentThis){
		var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
		var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
		var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
		var workflow_type = workflow_typeObj.find('option:selected').attr('type_id');
		var pageSize = 15;
		var param={								
				"handleType" 	: "qry",
				"dataSource" 	: "",
				"nameSpace"  	: "shortProcess",
				"sqlName"    	: "getWorkFlowByTypeInfo",
				"workflow_sort" :  workflow_sort,
				"workflow_type" :  workflow_type
		};
		var listFootObj =$("#workFlowInfoFoot");
		common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								 '0',
								 pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = $("#workFlowInfoBody");
			listBodyObj.html("");
			//展示列表
			parentThis.createWorkFlowInfoHtml(parentThis,data,listBodyObj);
		});
//		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//				if(json.code == "0" ){
//					var html = "";
//					//html='<li><input type="radio" name="wfInfo"  style="width: 10%;" >全选';
//					$.each(json.data,function(i,obj){
//						//html+='<input type="radio" name="wfInfo" workFlowId = '+obj.WORKFLOW_ID+' workFlowCode = '+obj.WORKFLOW_CODE+' style="width: 10%;" >'+obj.WORKFLOW_NAME+'';
//						debugger;
//						html.push('<tr name="addauthorInfo" workflowCode="'+obj.WORKFLOW_CODE+'" workfowName="'+obj.WORKFLOW_NAME+'" workflowId="'+obj.WORKFLOW_ID+'">');
//						html.push('<td ><input id="authorInfoBox_'+obj.WORKFLOW_ID+'" name="addauthorInfoBox" type="checkbox" ></td>');
//						html.push('<td >'+(i+1)+'</td>');
//						html.push('<td >'+obj.WORKFLOW_NAME+'</td>');
//						html.push('<td >'+obj.ACT_WORKFLOW_SORT_NAME+'</td>');
//						html.push('<td >'+obj.ACT_WORKFLOW_TYPE_NAME+'</td>');
//						html.push('</tr>');
//					
//					});
//					html+='</li>';
//					//html.join('')
//					$("#workFlowInfo").html(html);
//				}
//			}, param, false,false);
	},
	createWorkFlowInfoHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		var workFlowInfoFootObj = $("#workFlowInfoFoot");
		if(dataLst.length > 0 ){
			workFlowInfoFootObj.show();
			$.each(data.data,function(i,obj){
				debugger;
				html.push('<tr style="line-height: 20px;height: 10px;" name="addauthorInfo" workflowCode="'+obj.WORKFLOW_CODE+'" workfowName="'+obj.WORKFLOW_NAME+'" workflowId="'+obj.WORKFLOW_ID+'">');
				html.push('<td ><input id="authorInfoBox_'+obj.WORKFLOW_ID+'" name="addauthorInfoBox" type="checkbox" ></td>');
				html.push('<td >'+(i+1)+'</td>');
				html.push('<td >'+obj.WORKFLOW_CODE+'</td>');
				html.push('<td >'+obj.WORKFLOW_NAME+'</td>');
				html.push('</tr>');
			
			});
		}else{
			workFlowInfoFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="5">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
		$("#selectallAuthorInfo").click(function () {
			   $("#workFlowInfoBody :checkbox").prop("checked", true);  
		});
		$("#reverseAuthorInfo").click(function(){ 
		    $("#workFlowInfoBody :checkbox").each(function () {  
		        $(this).prop("checked", !$(this).prop("checked"));  
		    });
//			var chknum = $("#workFlowInfoBody :checkbox").size();//选项总个数
//			var chk = 0;
//			$("#workFlowInfoBody :checkbox").each(function () {  
//		        if($(this).prop("checked")==true){
//					chk++;
//				}
//		    });
//			if(chknum==chk){//全选
//				$("#selectallAuthorInfo").prop("checked",true);
//			}else{//不全选
//				$("#selectallAuthorInfo").prop("checked",false);
//			}
		});
	},
	submitInfoAuthor : function(parentThis,workflowCode,workflowId){
		var workflowCodes = workflowCode;
		var workflowIds   = workflowId;
		debugger;
		var flag="";
		if(workflowCodes.length>0){
			flag = "1"; 
		}else{
			flag = "0"; 
		}
		var workflow_typeObj =  parentThis.selecter.findById("select","workflow_type")[0];
		var workflowClassObj =  parentThis.selecter.findById("select","workflow_sort")[0];
		var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
		var workflow_type = workflow_typeObj.find('option:selected').attr('type_id');
		var sendBeginDateObj = parentThis.selecter.findById("input","sendBeginDate")[0]; //发起开始时间
		var sendEndDateObj = parentThis.selecter.findById("input","sendEndDate")[0]; //发起结束时间
		var beginEffDateObjDate =new   Date(Date.parse(sendBeginDateObj.val().replace(/-/g,"/")));
		var endEffDateObjDate =new   Date(Date.parse(sendEndDateObj.val().replace(/-/g,"/")));
		if(beginEffDateObjDate>endEffDateObjDate){
			layer.alert("授权终止时间必须大于授权起始时间!");
			return false;
		}
		var sendBeginDate = sendBeginDateObj.val();
		var sendEndDate = sendEndDateObj.val();
		var authorityStaff = $("#authorityStaff").val();
		if(authorityStaff==""||authorityStaff==undefined||authorityStaff==null){
			layer.alert("请选择被授权人!");
			return false;
		}
		var authorityStaffId = $("#authorityStaffId").val();
		var authorityStaffDeptId = $("#authorityStaffDeptId").val();
		var authorityStaffDeptName = $("#authorityStaffDeptName").val();
		return false;
		var param={
				"workflow_sort"  				: 		workflow_sort,
				"workflow_type" 		 		: 		workflow_type,
				"sendBeginDate"  				: 		sendBeginDate,
				"sendEndDate"  	 				: 		sendEndDate,
				"authorityStaff"  	 			: 		authorityStaff,
				"authorityStaffId"  	 		: 		authorityStaffId,
				"authorityStaffDeptId"  	 	: 		authorityStaffDeptId,
				"authorityStaffDeptName"  	 	: 		authorityStaffDeptName,
				"workflowCodes"  	 			: 		workflowCodes,
				"workflowIds"  	 				: 		workflowIds,
				"flag"  	 					: 		flag,
				"hanleType" 	 				: 		"submitAuthorInfo"
		};
		 $.jump.ajax(URL_QUERY_AUTHOR_INFO.encodeUrl(), function(json) {
				if(json.code == "0" ){
					layer.alert("授权成功",1);
					$.jump.loadHtmlForFun("/web/html/shortProcess/authorityShortProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var authorityShortProcessList=new AuthorityShortProcessList();
										authorityShortProcessList.init();
								});
								
					}else{
						layer.alert("授权失败!");	
					}
			}, param, false,false);
	},
	qrysubmitAuthorInfo : function(parentThis,pageIndex){
		var workflow_typeObj =  parentThis.selecter.findById("select","isAuthor_workflow_type")[0];
		var workflowClassObj =  parentThis.selecter.findById("select","isAuthor_workflow_sort")[0];
		var workflow_sort = workflowClassObj.find('option:selected').attr('sort_id');
		var workflow_type = workflow_typeObj.find('option:selected').attr('type_id');
		var sendBeginDateObj = parentThis.selecter.findById("input","isAuthor_sendBeginDate")[0]; //发起开始时间
		var sendEndDateObj = parentThis.selecter.findById("input","isAuthor_sendEndDate")[0]; //发起结束时间
		var beginEffDateObjDate =new   Date(Date.parse(sendBeginDateObj.val().replace(/-/g,"/")));
		var endEffDateObjDate =new   Date(Date.parse(sendEndDateObj.val().replace(/-/g,"/")));
		if(beginEffDateObjDate>endEffDateObjDate){
			layer.alert("授权终止时间必须大于授权起始时间!");
			return false;
		}
		var sendBeginDate = sendBeginDateObj.val();
		var sendEndDate = sendEndDateObj.val();
		var param={
				"workflow_sort"  				: 		workflow_sort,
				"workflow_type" 		 		: 		workflow_type,
				"sendBeginDate"  				: 		sendBeginDate,
				"sendEndDate"  	 				: 		sendEndDate,
				"hanleType" 	 				: 		"qrysubmitAuthorInfo"
		};
		var listFootObj =$("#isAuthorityShortProcessFoot");
		common.pageControl.start(URL_QUERY_AUTHOR_INFO.encodeUrl(),
									 '0',
									 parentThis.pageSize,
									 param,
									 "data",
									 null,
									 listFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = $("#isAuthorityShortProcessBody");
				listBodyObj.html("");
				//展示列表
				parentThis.createLstHtml(parentThis,data,listBodyObj);
			});
	},
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		var hasSolveProcessFootObj = $("#isAuthorityShortProcessFoot");
		if(dataLst.length > 0 ){
			hasSolveProcessFootObj.show();
			$.each(data.data,function(i,obj){
				debugger;
				html.push('<tr name="authorInfo" workflowCode="'+obj.WORKFLOW_CODE+'" ear_staffName="'+obj.ERA_OPERATOR_NAME+'" workfowName="'+obj.WORKFLOW_NAME+'" workflowId="'+obj.WORKFLOW_ID+'">');
				html.push('<td ><input id="authorInfoBox_'+obj.WORKFLOW_ID+'" name="authorInfoBox" type="checkbox" ></td>');
				html.push('<td >'+(i+1)+'</td>');
				html.push('<td >'+obj.WORKFLOW_NAME+'</td>');
				html.push('<td >'+obj.ACT_WORKFLOW_SORT_NAME+'</td>');
				html.push('<td >'+obj.ACT_WORKFLOW_TYPE_NAME+'</td>');
				html.push('<td >'+obj.AUTHORITY_START_TIME+'</td>');
				html.push('<td >'+obj.AUTHORITY_END_TIME+'</td>');
				html.push('<td >'+obj.ERA_OPERATOR_NAME+'</td>');
				html.push('<td >'+obj.MOB_TEL+'</td>');
				html.push('<td >'+obj.ERA_OPERATOR_DEPTNAME+'</td>');
				html.push('</tr>');
			});
		}else{
		    hasSolveProcessFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="9">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
		
		var tbodyObj = parentThis.selecter.findById("tbody", "isAuthorityShortProcessBody")[0];
		tbodyObj.find("input[type=checkbox][name=authorInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=authorInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
	},
	selectStaffInfo : function(parentThis){
		var xthtml = [];
		xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
		xthtml.push('<h3>选择部门</h3>');
		xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
		xthtml.push('<div>');
		xthtml.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		xthtml.push('<tr><td>部门名称:&nbsp;&nbsp;&nbsp;<input type="text" id="selectOrgName" placeholder="请输入部门名称" style="width:200px;" >');
		xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but" name="selectOrgNameSearch">查询</a>');
		xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a>');
		xthtml.push('</td></tr></table></div>');    
		xthtml.push('<div style="width:30%;height:520px; border:1px solid #dedede;margin: 10px;float:left;margin-left: 10px;margin-top: 20px;background-color:#f0f6e4;" class="list-main">');         
		xthtml.push('<div id="processDiv" style="margin-left:5px;" ></div> ');         
		xthtml.push('</div>'); 
		xthtml.push('<div id="executerInfo" style="width:65%;height:520px; border:1px solid #dedede;margin-top: 20px;float:right; class="fr">');         
		xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
		xthtml.push('<thead>');         
		xthtml.push('<tr>'); 
		xthtml.push('<th style="width:10%;">选择</th>');
		xthtml.push('<th style="width:15%;">姓名</th>');
		xthtml.push('<th style="width:10%;">部门</th>');
		xthtml.push('<th style="width:15%;">联系电话</th>');
		
		xthtml.push('</tr>');
		xthtml.push('</thead>');
		xthtml.push('<tbody id="chooseDeptAndExecuterBody"></tbody>');
		xthtml.push('</table>');
		xthtml.push('<div class="page mt10" id="chooseDeptAndExecuterFoot"></div>');
		xthtml.push('</div>');
		xthtml.push('</div>');
		xthtml.push('</div>');

		var selectStaffInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		    shift: 'right', //从右动画弹出
		    page: {
		        html: xthtml.join('')
		    }
		});
		var roleInfoPageDiv=$("#selectXTStaffInfoPage");
		var staff_ids; var staff_names; var DEPARTMENT_NAMES; var DEPARTMENT_CODES;var DEPARTMENT_ID;var MOB_TEL;
		//关闭
		roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(selectStaffInfoPage);
		});
		roleInfoPageDiv.find("a[name=selectOrgNameSearch]").unbind("click").bind("click",function(){
			var selectOrgName = $("#selectOrgName").val();
			if(selectOrgName==null||selectOrgName==undefined||selectOrgName==""){
				parentThis.queryWorkflow(parentThis);
			}else{
			var param={								
					"handleType":"qryLst",
					"dataSource":"",
					"nameSpace":"shortProcess",
					"sqlName":"searchdeppt",
					"region_id": "",
					"org_Name": selectOrgName
			};
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					if(json.code == "0" ){
						var html=[];
						if(json.data.length > 0) {
							$.each(json.data,function(i,obj){
								html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
							});
							$("#processDiv").html(html.join(''));
						};
					};
			}, param, false,false);
			
				//点击子级触发事件 部门
				$("#processDiv").find("div[name='divzi']").each(function(index){
					var ziId=$(this).attr("id");
					$("#"+ziId+"").click(function(e){
						//里边的<div>点击，但是不触发外层的<div>
						e.stopPropagation();
						//显示查询数据DIV					
						parentThis.queryPeopleList(parentThis,ziId);
					});
				});
			}
		});
		
		//选中
		roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			debugger;
			roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
				var boxObj=$(this);
				if(boxObj.is(':checked')){
					trObj = $(this).parent().parent("tr[name=staffInfo]");
					staff_ids = trObj.attr("staff_id");				
					staff_names=trObj.attr("staff_name");
					DEPARTMENT_NAMES=trObj.attr("DEPARTMENT_NAME");
					DEPARTMENT_CODES=trObj.attr("DEPARTMENT_CODE");
					DEPARTMENT_ID=trObj.attr("DEPARTMENT_ID");
					if(boxObj.length==0){
						layer.alert("请选择处理人及部门!",8);
						return false;
					}
					$("#authorityStaff").val(staff_names);
					$("#authorityStaffId").val(staff_ids);
					$("#authorityStaffDeptId").val(DEPARTMENT_CODES);
					$("#authorityStaffDeptName").val(DEPARTMENT_NAMES);
					layer.close(selectStaffInfoPage);
				}
			});
		});
		parentThis.queryWorkflow(parentThis);
	},
	queryWorkflow:function(parentThis){
		debugger;
		var param={								
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
	    		"sqlName":"searchland",			    		
		};
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				regionName=json.latnSet[0].REGION_CODE;
				regionId=json.latnSet[0].REGION_ID;
				var html1=[];									
		//		html1.push('<div class="main-nav" style="text-align:center;line-height: 44px;background:#eaf6ff;color:#0e5895;">部门查询</div>');
				html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
				html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" orgName="'+obj.REGION_NAME+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
					}
			});				
				html1.push('</div>');
				$("#processDiv").html(html1.join(''));		
			}else{
				layer.alert(msg);
			};
		}, param, false, false);									
		//点击本地网
		$("#processDiv").find("div[name='divfu']").each(function(index){
		var fuId=$(this).attr("id");			
		var param={								
				"handleType":"qryLst",
				"dataSource":"",
				"nameSpace":"shortProcess",
				"sqlName":"searchdeppt",
				"region_id": fuId,
				"org_Name": ""
		};
		$("#"+fuId+"").unbind("click").bind("click",function(){
			
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					var html=[];
					if(json.data.length > 0) {
						$.each(json.data,function(i,obj){
							html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
						});
						debugger;
						if($("#"+fuId+"").children().length == 1) {
							//为1 ，代表div中无值，为其赋值
							$("#"+fuId+"").append(html.join(''));
							var tupianObj=$("#tupian"+fuId+"");
							tupianObj.attr('src','images/ico-.gif');
						} else {
							//移除
							$("#"+fuId+"").children('div').remove();
							var tupianObj=parentThis.selecter.findById("img",'tupian'+fuId+'')[0];
							tupianObj.attr('src','images/ico+.gif');
						}
					}
				}
			}, param, false,false);
			//点击子级触发事件 部门
			$("#"+fuId).find("div[name='divzi']").each(function(index){
				var ziId=$(this).attr("id");
				$("#"+ziId+"").click(function(e){
					//里边的<div>点击，但是不触发外层的<div>
					e.stopPropagation();
					//子级流程的内容展示
						//显示查询数据DIV					
					parentThis.queryPeopleList(parentThis,ziId);
				});
			});
		});
		});
	},
	//查询专家数据
	queryPeopleList : function(parentThis,ziId) {	
		debugger;
		param={							
				"handleType":"qry",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
	    		"department_code":ziId,
	    		"sqlName":"qryStaffPage"	    	
		};	
		//下面展示数据
		var noticeLstFootObj=$("#chooseDeptAndExecuterFoot");						
			common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								 '0',
								 '10',
								 param,
								 "data",
								 null,
								 noticeLstFootObj,
								 "",
									 function(data,dataSetName,showDataSpan){
				var noticeLstBodyObj=$("#chooseDeptAndExecuterBody");						
				noticeLstBodyObj.html("");
				parentThis.createPeolpeHtml(parentThis,data,noticeLstBodyObj,noticeLstFootObj);
			});	
	},
	//创建按查询展示专业人员
	createPeolpeHtml : function(parentThis,data,noticeLstBodyObj,noticeLstFootObj){		
		var html=[];
		var dataLst = data.data;
		
		if(dataLst.length > 0 ){
			noticeLstFootObj.show();
			$.each(data.data,function(i,obj){
				debugger;
				html.push('<tr name="staffInfo" mob_tel="'+obj.MOB_TEL+'" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_ID="'+obj.DEPARTMENT_ID+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" name="dept"  style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
				html.push('<td>'+obj.MOB_TEL+'</td>');
				html.push('</tr>');
			
			});
		}else{
				noticeLstFootObj.hide();
				html.push('<div>');
				html.push('<div  style="width:130px;">无相关数据</div>');
				html.push('<div>');
		}
		noticeLstBodyObj.html(html.join(''));
		
	},
	//取消授权
	deleteAuthorInfo:function(parentThis,roleInfo){
			var checkParam={
							"handleType" 				: 		"upd",
							"dataSource" 				: 		"",
							"nameSpace"  				: 		"shortProcess",
							"sqlName"    				: 		"updateWorkflowIsAuthor",
							"workflowCode"		        :		roleInfo.workflowCode
					};
			var confirm=layer.confirm('您是否要取消流程名为'+roleInfo.workfowName+'，'+roleInfo.ear_staffName+'的授权？', function(){
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
								
									if(json.code == "0" ){
										layer.close(confirm);
										layer.alert("取消授权成功",1);
										parentThis.qrysubmitAuthorInfo(parentThis,0);
									}else{
										layer.alert("取消授权失败!");	
									}
			}, checkParam, false,false);
			});
	},
	//时间绑定
	dateBind : function(obj,AddDayCount){
//		var d = new Date();
//		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
//		obj.val(d.getFullYear() + "-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate()));
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
	}
};