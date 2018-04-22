var Editor = new Function();

Editor.prototype = {

	parentBody : null,

	demandId : "",
	
	flowType : null,
	
	demandInst : null,
	
	workflow_id : "",
	
	workflow_Name : "",
	
	workflow_Type : "",
	
 	node_executor : "",
 	
 	node_execute_depart : "",
 	
 	node_executor_id : "",
 	
 	node_execute_depart_id : "",
 	
	staff_ids : "", 
	
    staff_names: "", 
    
    department_names : "", 
    
    department_codes: "",
	
	flag : 0,
	
	comeFrom   : null,
	
	type : "",
	
	now_node_id : "",
	
	next_node_id : "",
	
	workflow_Type_Name : "",
	
	templateId : "",
	
    ear_staff_ids : "", //被授权人ID
    
    ear_staff_names: "", //被授权人名称
    
    ear_department_names : "", //被授权人部门
    
    ear_department_codes: "",//被授权人部门ID
	
    imgsArr : [],
    allstart_staffId :"",

    fileList:[],
    templateType:"",
	init : function(parentBody) {
		
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.comeFrom = common.utils.getHtmlUrlParam("comeFrom");
		this.workflow_id = common.utils.getHtmlUrlParam("workflow_id"); 
		this.workflow_Name =decodeURI(common.utils.getHtmlUrlParam("workflow_Name")); 
		this.workflow_Type =decodeURI(common.utils.getHtmlUrlParam("workflow_Type")); 
		this.workflow_Type_Name =decodeURI(common.utils.getHtmlUrlParam("workflow_Type_Name")); 
		this.templateId =decodeURI(common.utils.getHtmlUrlParam("templateId")); 
		this.bindMethod();
		

	},
	delImg : function(delId){
		$("#container_"+delId+"").remove();
	},
	bindMethod : function() {
		var parentThis = this;

		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
				
		//生成需求ID
		var param={"handleType" : 2015,};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code == "0" ){
				if(json.data.length > 0){
					 parentThis.demandId=json.data[0].WORKFLOWNEEDID;
				}
			};
		}, param, false,false);
		var templateId=parentThis.templateId;
		if(templateId!=""&&templateId!=null&&templateId!=undefined){
			var attrParam={
					"handleTypecom"  : "qryLst",
					"handleType"     : 2018,
					"sqlName"     	 : "queryDemandTemplateAttr",
					"templateId"	 :	templateId
			};
			$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
					if(json.code == "0" ){
						var dataList=json.data;
						var html=[];
						$.each(dataList,function(i,obj){
							if(obj.ATTR_TYPE=="radio"){
								if(i==0){
									html.push('<dl class="xq_content">');
									html.push('<dt>个性规则</dt>');
									html.push('<dt style="color:#888;width: 80%;">');
								}
								html.push('<input id='+obj.ATTR_ONAME+' tempId='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' name="radios" style="width: 9%;">'+obj.ATTR_NAME+'');
								parentThis.templateType = obj.ATTR_TYPE;
								if(i==(dataList.length-1)){
									html.push('</dt></dl>');
								}
							}else{
								html.push('<dl class="xq_content">');
								html.push('<dt>'+obj.ATTR_NAME+'</dt>');
								html.push('<dt style="color:#888;">');
								html.push('<input id='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' style="width: 95%;">');
								html.push('</dl>');
							}
						});
						$("#templateInfos").before(html.join(''));
					};
				}, attrParam, false,false);
		}
		 var formdatas = new FormData();//这里是用了装imag文件的  安卓获取文件
		 var j=0;
		 var m=0;
		"".findById("input", "imgUpload", this.parentBody)[0].unbind().bind("change",function(e){
			
			for (var i = 0; i < e.target.files.length; i++) {
				
				 j=j+1;
				var file = e.target.files.item(i);
				//data = new FormData(file);
				formdatas.append('upload_file'+j, file);
				//允许文件MIME类型 也可以在input标签中指定accept属性
				//console.log(/^image\/.*$/i.test(file.type));
				if (!(/^image\/.*$/i.test(file.type))) {
					continue; //不是图片 就跳出这一次循环
				}
				
				//实例化FileReader API
				var freader = new FileReader();
				freader.readAsDataURL(file);
				freader.onload = function(e) {
					m=m+1;
					
					
					var img = '<div id="container'+m+'" class="container"><div  id="'+m+'" class="close">×</div><div style="width:80px;height:80px;overflow:hidden;margin-left: -15px;"><img src="' + e.target.result
							+ '" style="width:80px;height:80px" id="pic1"/></div></div>';
					$("#destination").append(img);
				};
			}
			
		});
		//删除图片事件
		$(document).on('click', '.close', function(e) {
			
			var id=$(this).attr("id");
			$("#container"+id).remove();
            //删除formData中的数据
			var formdata;//因delete方法无法使用，只能将删除的文件过滤掉重新放在一个data里面
			formdata = new FormData();
			var i = formdatas.entries();
			for(var n=0;n<j;n++){//每删除一次，数据就少一个
				var valueInfo=i.next();
				if(!valueInfo.done&&(valueInfo.value)[0]!="upload_file"+id){
				formdata.append((valueInfo.value)[0],(valueInfo.value)[1]);
				}	
			}
			formdatas=formdata;
			j=j-1;
			});
		//提交图片上传
		"".findById("a", "submitUpload", this.parentBody)[0].unbind().bind("click",function(){ 
		var ua = navigator.userAgent.toLowerCase();  
		if (/iphone|ipad|ipod/.test(ua)) {
			var formData = new FormData($( "#attachForm" )[0]);  //ios获取文件
			$.ajax({
			    url:URL_UPLOAD_IMG+"?"+"demand_id="+parentThis.demandId+"&type=shortProcess&pro_id="+parentThis.demandId+"&staffId="+parentThis.allstart_staffId,
			    type:'POST',
			    data: formData,
	          	async: false,  
	          	cache: false,  
	          	contentType: false,  
	          	processData: false,
	          	dataType:'json',
			    error: function(msg) {
			    	 alert("上传失败！"+JSON.stringify(msg));
			    	 //alert("状态1："+XMLHttpRequest.status);
			    	 //alert("状态2："+XMLHttpRequest.readyState);
			    	 //alert("错误信息："+textStatus);
			    },
			
			    success:function (msg) {
			        alert("上传成功！");
			    	document.getElementById("attachForm").reset(); 
			    	//parentThis.submitInfoData(parentThis);
			    }
			});
		} else if (/android/.test(ua)) {
			 $.ajax({
			    url:URL_UPLOAD_IMG+"?"+"demand_id="+parentThis.demandId+"&type=shortProcess&pro_id="+parentThis.demandId+"&staffId="+parentThis.allstart_staffId,
			    type:'POST',
			    data: formdatas,
	          	async: false,  
	          	cache: false,  
	          	contentType: false,  
	          	processData: false,
	          	dataType:'json',
			    error: function(msg) {
			    	 alert("上传失败！"+JSON.stringify(msg));
			    	 //alert("状态1："+XMLHttpRequest.status);
			    	 //alert("状态2："+XMLHttpRequest.readyState);
			    	 //alert("错误信息："+textStatus);
			    },
			
			    success:function (msg) {
			        alert("上传成功！");
			    	document.getElementById("attachForm").reset(); 
			    	//parentThis.submitInfoData(parentThis);
			    }
			});
		}
		});
		"".findById("a", "submitInfo", this.parentBody)[0].unbind().bind("click",function(){
			parentThis.submitInfoData(parentThis);
			
		});
		$("#workflow_Name").text(parentThis.workflow_Name);
		$("#workflowSort").text(parentThis.workflow_Type_Name);

		"".findById("button", "submitBtn", this.parentBody)[0].unbind().bind("click",function(){
			 $("#myModal").hide();
				$("#searchList").find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
						parentThis.staff_ids = trObj.attr("staff_id");				
						parentThis.staff_names=trObj.attr("staff_name");
						parentThis.department_names=trObj.attr("DEPARTMENT_NAME");
						parentThis.department_codes=trObj.attr("DEPARTMENT_CODE");
						if(boxObj.length==0){
							layer.alert("请选择处理人及部门!",8);
							return false;
						}
						$("#disposeDeptName").val(trObj.attr("DEPARTMENT_NAME"));
						$("#disposePersonName").text(trObj.attr("staff_name"));
					}
				});
		});
		"".findById("button", "searchBtn", this.parentBody)[0].unbind().bind("click",function(){
			parentThis.getSearchDisposePerson();

		});
		//parentThis.showDy_templates();
		parentThis.searchWorkFlowInfo();
		parentThis.loaded();
	},
	
	loaded :  function(){
		var myScroll;
		myScroll = new iScroll('wrapper', {
		scrollbarClass: 'myScrollbar',
		onBeforeScrollStart: function (e) {
			var target = e.target;
			while (target.nodeType != 1) target = target.parentNode;

			if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
				e.preventDefault();
			}
		});
	},
	showDy_templates :function(){
		var parentThis = this;
		var param ={
				"handleType" : 2017,
				"templateId" : parentThis.templateId
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
	 		var html="";
			$.each(json.data,function(i,obj){
				if(obj.ATTR_TYPE=='text'&&obj.ATTR_NAME=='工单主题'){
					html+='<dl class="xq_content"><dt>'+obj.ATTR_NAME+':</dt>';
				    html+='<dt style="color:#888;"><input id="demandName"/></dt></dl>';
				}
				if(obj.ATTR_TYPE=='radio'&&obj.ATTR_NAME=='是否统一认证'){
					html+='<dl class="xq_content"><dt>'+obj.ATTR_NAME+'</dt>';
				    html+='<dt style="color:#888;"><input name="isCertification" type="radio" checked="checked" value="'+obj.ATTR_VALUE+'">是&nbsp;&nbsp;&nbsp;&nbsp;<input name="isCertification" type="radio" value="0">否</dt></dl>';
				}
//				if(obj.ATTR_TYPE=='select'&&obj.ATTR_NAME=='定制类型'){
//					html+='<dl class="xq_content"><dt>'+obj.ATTR_NAME+'</dt>';
//				    html+='<dt style="color:#888;"><select id="customType"></select></dt></dl>';
//				}
				if(obj.ATTR_TYPE=='radio'&&obj.ATTR_NAME=='是否发送区公司审批'){
					html+='<dl class="xq_content"><dt>'+obj.ATTR_NAME+'</dt>';
					html+='<dt style="color:#888;"><input name="isCertification" type="radio" checked="checked" value="'+obj.ATTR_VALUE+'">是&nbsp;&nbsp;&nbsp;&nbsp;<input name="isCertification" type="radio" value="0">否</dt></dl>';
				}
				if(obj.ATTR_TYPE=='textarea'&&obj.ATTR_NAME=='工单内容'){
					html+='<div class="wbk" style="font-size:12px;padding: 10px 10px;">';
					html+='<dt style="margin:5px 0px;">'+obj.ATTR_NAME+':</dt><div class="wbk_yj" >';
					html+='<textarea id="demandDesc" rows="2" class="wby" style="margin:0px" placeholder="请输入文档描述"></textarea>';
					html+='</div></div>';
				}
			});
			$("#Dy_templates").html(html);
			 parentThis.loaded();
	 	}, param, true);	
	},
	getSearchDisposePerson : function(){
		var parentThis = this;
		var showDialogDivObj = "".findById("div", "showDialogDiv",this.parentBody)[0];
	    if($("#searchName").val()==""||$("#searchName").val()==null||$("#searchName").val()==undefined){
		common.loadMsgDialog(showDialogDivObj, "消息提示", "“用户名称”请务必填写",null,null,{style:{height:"50px"}});
		return false;
		}
		var param ={
				"handleType" : 2014,
				"name" : $("#searchName").val()
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			common.loadding("open");
	 		var html="";
			$.each(json.data,function(i,obj){
				html+='<tr name="staffInfo"  staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'"><td style="width :5%">';
				html+='<input type="radio" name="sex"></td>';
				html+='<td>'+obj.STAFF_NAME+'</td><td>'+obj.ORG_NAME+'</td><td>'+obj.REGION_NAME+'</td></tr>';
			});
			$("#searchList").html(html);
			common.loadding("close");
			 parentThis.loaded();
	 	}, param, true);	
	},
	searchWorkFlowInfo: function(){
		
		var parentThis = this;
		var next_node_ids = "";
		var post_id;//岗位
		var dept_type_id;
		var dept_level;
		var workFlowTypeCode;
		var start_staffId;
		param={"handleType" : 2013,"workflowId":parentThis.workflow_id};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
	 		$("#releasePersonName").text(json.staffname);
	 		$("#releasePersonNum").text(json.staffpno);
	 		start_staffId=json.staff_id;
			parentThis.allstart_staffId = json.staff_id;
	 		$.each(json.data0,function(i,obj){
	 			workFlowTypeCode = obj.ACT_WORKFLOW_TYPE_CODE;
	 		});
	 		$.each(json.data1,function(i,obj){
	 			
	 			parentThis.now_node_id =""+obj.NOW_NODE_ID+"";
	 			parentThis.next_node_id =""+obj.NEXT_NODE_ID+"";
	 			next_node_id = obj.NEXT_NODE_ID;
	 			post_id = obj.POST_ID;
	 			dept_type_id = obj.DEPT_TYPE_ID;
	 			dept_level = obj.DEPT_LEVEL;
	 			if(obj.NODE_EXECUTOR==""){
	 				parentThis.node_executor = " ";
	 			}else {
	 				parentThis.node_executor = obj.NODE_EXECUTOR;
	 			}
	 			if(obj.NODE_EXECUTE_DEPART==""){
	 				parentThis.node_execute_depart = " ";
	 			}else {
	 				parentThis.node_execute_depart = obj.NODE_EXECUTE_DEPART;
	 			}
	 			if(obj.NODE_EXECUTOR_ID==""){
	 				parentThis.node_executor_id ="";
	 			}else {
	 				parentThis.node_executor_id = obj.NODE_EXECUTOR_ID;
	 			}
	 			if(obj.NODE_EXECUTE_DEPART_ID==""){
	 				parentThis.node_execute_depart_id = "";
	 			}else {
	 				parentThis.node_execute_depart_id = obj.NODE_EXECUTE_DEPART_ID;
	 			}
	 		});
			if(parentThis.node_executor_id==""||parentThis.node_executor_id==undefined||parentThis.node_executor_id==null){
                
				//查询发起人部门领导人
                if(dept_level=="4"){//按照本部门领导规则进行选择下一处理人 
					var paramma={
							"handleType"  : 2018,
							"handleTypecom"  : "qryLst",
							"dataSource"  : "",
							"nameSpace"   : "shortProcess",
							"sqlName"     		: 	"qryRealDeptLevel",
							"staff_id"          :    start_staffId,
							"flag"        : "0"	
					};
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						if(json.code == "0"){
							if(json.data.length>0){
								dept_level=json.data[0].dept_level;
								dept_type_id=json.data[0].dept_type_id;
							}
							var parama={								
									"handleType"  : 2018,
									"handleTypecom"  : "qryLst",
									"dataSource"  : "",
									"nameSpace"   : "shortProcess",
									//"sqlName"     : "qrySumitLeadIdByDept",
									"sqlName"     		: 	"qrySumitLeadIdByDisDept",
									"post_id"     		: 	post_id,
									"dept_type_id"     	: 	dept_type_id,
									"dept_level"     	: 	dept_level,
									"workFlowTypeCode"  : 	workFlowTypeCode,
									"staff_id"          :    start_staffId,
									"flag"        : "0"
							};
							$.jump.ajax(URL_SHORT_PROCESS, function(json) {
								
								if(json.code == "0"){
									
									if(json.data.length>0){
								 		 parentThis.node_executor_id = json.data[0].STAFF_ID;
								 		 parentThis.node_executor = json.data[0].STAFF_NAME;
								 		 parentThis.node_execute_depart = json.data[0].DEPT_NAME;
								 	     parentThis.node_execute_depart_id = json.data[0].DEPT_ID;
								 	    $("#disposeDeptName").text(parentThis.node_execute_depart);
										$("#disposePersonName").text(parentThis.node_executor);
									}
								}
							}, parama, false,false);
						}
					}, paramma, false,false);
				}else{
					var parama={								
							"handleType"  : 2018,
							"handleTypecom"  : "qryLst",
							"dataSource"  : "",
							"nameSpace"   : "shortProcess",
							//"sqlName"     : "qrySumitLeadIdByDept",
							"sqlName"     		: 	"qrySumitLeadIdByDisDept",
							"post_id"     		: 	post_id,
							"dept_type_id"     	: 	dept_type_id,
							"dept_level"     	: 	dept_level,
							"workFlowTypeCode"  : 	workFlowTypeCode,
							"staff_id"          :    start_staffId,
							"flag"        : "0"
					};
				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
					if(json.code == "0"){
						
						if(json.data.length>0){
					 		 parentThis.node_executor_id = json.data[0].STAFF_ID;
					 		 parentThis.node_executor = json.data[0].STAFF_NAME;
					 		 parentThis.node_execute_depart = json.data[0].DEPT_NAME;
					 	     parentThis.node_execute_depart_id = json.data[0].DEPT_ID;
					 	    $("#disposeDeptName").text(parentThis.node_execute_depart);
							$("#disposePersonName").text(parentThis.node_executor);
						}
					}
				}, parama, false,false);
				}
			}else{
					parentThis.flag =0;
			 		parentThis.type ="1";
			 		parentThis.staff_ids  = parentThis.node_executor_id ;
			 		parentThis.staff_names = parentThis.node_executor ;
			 		parentThis.department_names = parentThis.node_execute_depart;
			 		parentThis.department_codes = parentThis.node_execute_depart_id ;
					$("#disposeDeptName").text(parentThis.node_execute_depart);
					$("#disposePersonName").text(parentThis.node_executor);
			}
			//被授权人信息
			var params={};
			params.handleTypecom="qryLst";
			params.handleType=2018;
			params.sqlName="getWorkflowAuthorStaffInfo";
			params.workflowId=parentThis.workflow_id;
			params.next_node_id=next_node_id;
			$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0" ){
					if(json.data.length > 0){
						 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
						 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
						 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
						 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
					}
				};
			}, params, false,false);
	 	}, param, true);
	},
	submitInfoData :function(parentThis){
		//结束流程
		var parama={								
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     	 : "qryEndNode",
				"nodeId"      	 : parentThis.now_node_id,
				"workflowId"  	 : parentThis.workflowId
		};			
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
				if(json.code == "0"){
					parentThis.submitInfos = json.data.length;
					if(json.data.length>0){
						parentThis.endNodeId = json.data[0].ENDNODEID;
					}
					
				}
			}, parama, false,false);
		//规则与模板数据对比，判断下一节点
		var isOverRule="";
		var params={
				"handleTypecom"  : "qryLst",
				"handleType"     : 2018,
				"sqlName"     	 : "queryFlowRuleNextNodeInfo",
				"nodeId"      	 : parentThis.now_node_id,
				"workflowId"  	 : parentThis.workflowId
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
			if(json.code == "0" ){
				
				if(json.data.length > 0){
					
					var templateAttrNames;
					var templateAttrName;
					var templateAttrId;
					if(parentThis.templateType=="radio"){
						templateAttrId = $('input:radio[name="radios"]:checked').attr("tempId");
					}else{
						templateAttrNames = $("#"+json.data[0].ATTR_ONAME+"").val();
						templateAttrName = parseInt(templateAttrNames);
					}
					$.each(json.data,function(i,obj){
						if(json.data.length>0){

							if(templateAttrName>=parseInt(obj.FLOWRULEMIN)&&templateAttrName<parseInt(obj.FLOWRULEMAX)){
								 parentThis.next_node_id=obj.NEXTNODEID;
							 	 parentThis.staff_ids  = obj.NODE_EXECUTOR_ID ;
							 	 parentThis.staff_names =obj.NODE_EXECUTOR ;
							 	 parentThis.department_names =obj.NODE_EXECUTE_DEPART;
							 	 parentThis.department_codes =obj.NODE_EXECUTE_DEPART_ID ;
								 isOverRule = "0";
								 return false; 
							 }else if(templateAttrId.trim()==obj.ATTR_ONAME.trim()){
								 parentThis.next_node_id=obj.NEXTNODEID;
							 	 parentThis.staff_ids  = obj.NODE_EXECUTOR_ID ;
							 	 parentThis.staff_names =obj.NODE_EXECUTOR ;
							 	 parentThis.department_names =obj.NODE_EXECUTE_DEPART;
							 	 parentThis.department_codes =obj.NODE_EXECUTE_DEPART_ID ;
								 isOverRule = "0";
								 return false; 
							 }
						}
					});

					
					if(isOverRule=="0"){
						//被授权人信息
						var params={
								"handleTypecom"  : "qryLst",
								"handleType"     : 2018,
								"sqlName"     	 : "getWorkflowAuthorStaffInfo",
								"next_node_id"   : parentThis.next_node_id,
								"workflowId"  	 : parentThis.workflowId
						};
						$.jump.ajax(URL_SHORT_PROCESS, function(json) {
							if(json.code == "0" ){
								if(json.data.length > 0){
									 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
									 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
									 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
									 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
								}
							};
						}, params, false,false);
						parentThis.sunmitDemandInfo(parentThis);
					}
				}else{
					//被授权人信息
					var params={
							"handleTypecom"  : "qryLst",
							"handleType"     : 2018,
							"sqlName"     	 : "getWorkflowAuthorStaffInfo",
							"next_node_id"   : parentThis.next_node_id,
							"workflowId"  	 : parentThis.workflowId
					};
					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
						if(json.code == "0" ){
							if(json.data.length > 0){
								 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
								 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
								 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
								 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
							}
						};
					}, params, false,false);
			 		parentThis.staff_ids  = parentThis.node_executor_id ;
			 		parentThis.staff_names = parentThis.node_executor ;
			 		parentThis.department_names = parentThis.node_execute_depart;
			 		parentThis.department_codes = parentThis.node_execute_depart_id ;
					$("#disposeDeptName").val(parentThis.node_execute_depart);
					$("#disposePersonName").val(parentThis.node_executor);
					parentThis.sunmitDemandInfo(parentThis);
				}
			};
		}, params, false,false);
	},
	sunmitDemandInfo : function(){
		
		var parentThis = this;
		var showDialogDivObj = "".findById("div", "showDialogDiv",this.parentBody)[0];
		if($("#demandName").val()==null||$("#demandName").val()==undefined||$("#demandName").val()==""){
			common.loadMsgDialog(showDialogDivObj, "消息提示", "“需求名称”请务必填写",null,null,{style:{height:"50px"}});
			return false;
		}
		if(parentThis.staff_ids==null||parentThis.staff_ids==undefined||parentThis.staff_ids==""){
			common.loadMsgDialog(showDialogDivObj, "消息提示", "处理人必选",null,null,{style:{height:"50px"}});
			return false;
		}
		
		 var  ear_operator_Id   = parentThis.ear_staff_ids;   //下一步代（授权）处理人ID
		 var  ear_operator_Name  = parentThis.ear_staff_names;//下一步代（授权）处理人名称
		 var  ear_operator_dept_Id  = parentThis.ear_department_codes;//下一步代（授权）处理部门ID
		 var  ear_operator_dept_Name  = parentThis.ear_department_names;//下一步代（授权）处理部门名称
			var attrIds=[];
			var attrNames=[];
			var attrOnames=[];
			var attrValues=[];
			var attrParam={
						"handleTypecom"  : "qryLst",
						"handleType"     : 2018,
						"sqlName"     	 : "queryDemandTemplateAttr",
						"templateId"	 :	parentThis.templateId
				};
				$.jump.ajax(URL_SHORT_PROCESS, function(json) {
					
					if(json.code == "0" ){
						var dataList=json.data;
						$.each(dataList,function(i,obj){
							
							attrOnames.push(obj.ATTR_ONAME);
							attrNames.push( obj.ATTR_NAME);
							attrIds.push(obj.ATTR_ID);
							attrValues.push(  $("#"+obj.ATTR_ONAME+"").val());
						});
					};
				}, attrParam, false,false);
				attrId = attrIds.join(",");
				attrOname = attrOnames.join(",");
				attrName = attrNames.join(",");
				attrValue = attrValues.join(",");
		var param ={
				"handleType" 				: 	2012,
				"demandId" 					: 	parentThis.demandId,
				"demandName" 				: 	$("#demandName").val(),
				"demandDesc" 				: 	$("#demandDesc").val(),
				"workflowId" 				: 	parentThis.workflow_id,
				"phone"						: 	$("#releasePersonNum").text(),
				"now_node_id" 				: 	parentThis.now_node_id,
				"next_node_id" 				: 	parentThis.next_node_id,
				"operator_Id" 				: 	parentThis.staff_ids,
				"operator_Name" 			: 	parentThis.staff_names,
				"operator_dept_Id" 			: 	parentThis.department_codes,
				"operator_dept_Name" 		: 	parentThis.department_names,
				"questtype"          		: 	$("#workflowSort").text(),
				"type"               		:	parentThis.type,
				"ear_chulirenid2"          	:  ear_operator_Id,
				"ear_chulirenname2"        	:  ear_operator_Name,
				"ear_chulideptid2"    	 	:  ear_operator_dept_Id,
				"ear_chulideptname2"   		:  ear_operator_dept_Name,
				 "templateId"          		:  parentThis.templateId,
				 "attrId"          			:  attrId,
				 "attrOname"          		:  attrOname,
				 "attrValue"          		:  attrValue,
				 "attrName"          		:  attrName,
				 "start_type"                :  "save"
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
	 		
	 		if(json.code == "0" ){
	 			$("#dialogMsg").css("margin-left","0px");
				common.loadMsgDialog(showDialogDivObj, "消息提示","发起成功！",null,null,{style:{height:"50px"}});
	 			$("#submitInfo").css("visibility","hidden");
	 			$("#imgUpload").attr("disabled",true);
	 		}
	 	}, param, true);	
	
	},
	//上传附件
//	submitUploadData: function(parentThis,data){
//		//URL_UPLOAD_IMG
//		alert("上传附件::"+parentThis.demandId);
//		$.ajax({
//		    url:URL_UPLOAD_IMG+"?"+"demand_id="+parentThis.demandId+"&type=shortProcess&pro_id="+parentThis.demandId,
//		    type:"post",
//		    cache: false,
//		    data:data,
//		    processData: false,
//		    contentType: false,
//		    error: function(XMLHttpRequest, textStatus, errorThrown) {
//		    	 alert("上传失败！");
//		    	 //alert("状态1："+XMLHttpRequest.status);
//		    	 //alert("状态2："+XMLHttpRequest.readyState);
//		    	 //alert("错误信息："+textStatus);
//		    },
//		   
//		    success:function (msg) {
//		    	alert("上传成功！");
//		    	//parentThis.submitInfoData(parentThis);
//		    }
//		});
//		
//	}
	/*
	 * 异步上传图片【删除】
	 *
	 * upLoadImg : function(url, success) {
		
		if (this.cameraImgArr.length > 0) {
			var showDialogDivObj = "".findById("div", "showDialogDiv",
					this.parentBody)[0];
			$.jump.ajaxImgByCordova(this.cameraImgArr[0].imageURI, url,
					success, 
					function() {
						common.loadMsgDialog(showDialogDivObj, "消息提示",
								"提交失败，图片上传失！");
					},true);
		} else {
			var data = {
				code : "0",
				msg  : "无可上传，系统跳过上传图片",
				upPhotoNames:""
			};
			success(data);
		}

	}*/

	
};
$(document).ready(function() {
	var editor = new Editor();
	editor.init($(this));
});