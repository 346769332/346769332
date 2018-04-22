var StayDisposeShortProcessDemand = new Function();
StayDisposeShortProcessDemand.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
 	node_executor : null,
 	node_execute_depart : null,
 	node_executor_id : null,
 	node_execute_depart_id : null,
	staff_ids : [], 
    staff_names: [], 
    department_names : [], 
    department_codes: [],
    next_node_id: [],
    now_node_id: null,
    type :null,
    demo : null,
    falg :1,
    taskId : null,  
    isEndTime : null,  
    timeLimit : null,  
    urgeCount : null,  
    urgeTime  : null,  
    nodecount : null,  
    up_node_id : null,  
    taskNums   : null,  
    submitInfos   : null,  
    huiqianNodeId  : [],  
    nodeIds  : "",  
    workflow_st : null,  
    totaskId  : "",  
    isIndex : -1,
    workflow_type : "",
    endNodeId  : null,
	line_Name  : null,
	to_node_Id : null,
	Sign_staffId : [],  //会签人ID
	Sign_staffName : [], //会签人名称
	Sign_staffDeptId : [], //会签人部门ID
	Sign_staffDeptName : [], //会签人部门名称
    ear_staff_ids : [], //被授权人ID
    ear_staff_names: [], //被授权人名称
    ear_department_names : [], //被授权人部门
    ear_department_codes: [],//被授权人部门ID
    now_ear_staff_ids : null, //被授权人ID
    now_ear_staff_names: null, //被授权人名称
    now_ear_department_names : null, //被授权人部门
    now_ear_department_codes: null,//被授权人部门ID
    base:null,
    fileList:[],
    dfileLength:0,
	// 初始化执行
	init : function(param) {
		base=this;
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		//加载模板属性
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "queryTemplataInfo",
				"demandId"  :  parentThis.demandInfo.demandId,
				"templateId":  parentThis.demandInfo.templateId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				var html =[];
				$.each(json.data,function(i,obj){
					debugger;
					

					if(obj.ATTR_TYPE=="radio"){
						if(i==0){
							html.push('<tr>');
							html.push('<td>个性规则</td>');
							html.push('<td colspan="3">');
						}
						html.push('<input id='+obj.ATTR_ONAME+' tempId='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' name="radios" style="width: 2%;" disabled="disabled">'+obj.ATTR_NAME+'');
						parentThis.templateType = obj.ATTR_TYPE;
						if(i==(json.data.length-1)){
							html.push('</td></tr>');
						}
					}else{
						html.push('<tr>');
						html.push('<td>'+obj.ATTR_NAME+'</td>');
						html.push('<td colspan="3">');
						html.push('<input id='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' style="width: 95%;" disabled="disabled"></td>');
						html.push('</tr>');
					}
					
					
					//if(obj.ATTR_TYPE=='text' && obj.ATTR_NAME=='金额'){
					//}
				});
				$("#templateInfos tr:eq(5)").before(html.join(''));
			}
		}, params, false,false);
		// 取消返回
		var backObj=parentThis.selecter.findById("a","backInfo")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var noSolveProcessList=new NoSolveProcessList();
				noSolveProcessList.init();
				});

		});
		//流程单类型
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryWorkflowType",
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){
			 			parentThis.workflow_st = obj.WORKFLOW_SINGLE_TYPE;
			 		});
				}
			}, params, false,false);
		//发起人及部门
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "queryDeptPno",
				"demandId"  :  parentThis.demandInfo.demandId,
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
			 		$("#releasePersonName").val(obj.DEMAND_SUMIT_PNAME);
			 		$("#releaseDeptName").val(obj.dept_name);
			 		$("#releasePersonNum").val(obj.DEMAND_SUMIT_PNO);
				});
			}
		}, params, false,false);
		//打回根节点/上一步
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryDangQiaTaskId",
				"demandId"  :  parentThis.demandInfo.demandId,
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
					parentThis.totaskId = obj.TASKID;
				});
			}
		}, params, false,false);
		var parama={};
		if(parentThis.demandInfo.ear_operatop_id!=""){
			//当前节点ID及任务ID
			parama={								
					"handleType"		: "qryLst",
					"dataSource"		: "",
					"nameSpace" 		: "shortProcess",
					"sqlName"   		: "qryTaskId",
					"demandId"  		: parentThis.demandInfo.demandId,
					"workflowId"		: parentThis.demandInfo.workflowId,
					"ear_operatop_id"	: parentThis.demandInfo.ear_operatop_id,
			};
		}else{
			//当前节点ID及任务ID
			parama={								
					"handleType": "qryLst",
					"dataSource": "",
					"nameSpace" : "shortProcess",
					"sqlName"   : "qryTaskId",
					"demandId"  : parentThis.demandInfo.demandId,
					"workflowId": parentThis.demandInfo.workflowId,
			};
		}	
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.taskId = obj.TASK_ID;
			 			parentThis.now_node_id = obj.NODE_ID;
			 			parentThis.urgeTime = obj.LIMITTIME;
			 			parentThis.urgeCount = obj.URGE_COUNT;
			 		});
				}
			}, parama, false,false);
		//下一节点个数
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"qryNodeCount",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			
			 			parentThis.nodecount = obj.NODECOUNT;
			 		});
				}
			}, parama, false,false);
		
		//下一节点ID
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"getNextNodeList",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.nodeIds +=obj.NEXT_NODE_ID+",";
			 		});
				}
			}, parama, false,false);
		//审批动作
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryCaozuoType",
				"workflowId"  : parentThis.demandInfo.workflowId,
				"nodeId"      : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
					var html ="";
			 		$.each(json.data,function(i,obj){
			 			 if(obj.IS_SIGNATURE=="1"){//是否允许会签
			 				html+='<input name="disposeRadio" type="radio" value="sign" style="width: 5%;">会签 ';
			 			 }
			 			 
			 			html+='<input name="disposeRadio" type="radio" value="agree" style="width: 5%;">通过 ';
			 			html+='<input name="disposeRadio" type="radio" value="toPrev" style="width: 5%;">打回上一节点';
			 			html+='<input name="disposeRadio" type="radio" value="toStart" style="width: 5%;">打回发起节点 ';
			 			//html+='<input name="disposeRadio" type="radio" value="toCancle" style="width: 5%;">作废 ';
			 			$("#disposeRadio").html(html);
			 		});
				}
			}, parama, false,false);
		//获取时限
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryGuoShiTime",
				"demandId"    : parentThis.demandInfo.demandId,
				"workflowId"  : parentThis.demandInfo.workflowId,
				"nodeId"      : parentThis.now_node_id,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.timeLimit = obj.TIME_LIMIT;
						var d = new Date();
						var endtime =new   Date(Date.parse(obj.ENDTIME.replace(/-/g,"/")));
			 			if(endtime>d){
			 				parentThis.isEndTime = 0;	
			 			}else{
			 				parentThis.isEndTime = 1;	
			 			}
			 		});
				}
			}, parama, false,false);
		//结束流程
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "qryEndNode",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
					parentThis.submitInfos = json.data.length;
					if(json.data.length>0){
						parentThis.endNodeId = json.data[0].ENDNODEID;
					}
					
				}
			}, parama, false,false);
		//获取下一节点处理人信息
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "showNextNodeDeptInfo",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
				$.each(json.data,function(i,obj){
					var disposeDeptName;
					var disposePersonName;
							parentThis.huiqianNodeId.push(obj.NODE_ID);
							if(obj.NODE_EXECUTOR_ID!=""){
								parentThis.staff_ids.push(obj.NODE_EXECUTOR_ID);				
								parentThis.staff_names.push(obj.NODE_EXECUTOR);
								parentThis.department_names.push(obj.NODE_EXECUTE_DEPART);
								parentThis.department_codes.push(obj.NODE_EXECUTE_DEPART_ID);
							}
							disposeDeptName = parentThis.department_names.join(",");
							disposePersonName = parentThis.staff_names.join(",");
					$("#disposeDeptName").val(disposeDeptName);
					$("#disposePersonName").val(disposePersonName);
				});
				}
			}, parama, false,false);
		//获取单选规则属性模板
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"qrySelectedRadioInfo",
				"nodeId"      : parentThis.now_node_id
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			debugger;
				if(json.code == "0"){
					var html =[];
					html.push('<tr>');
					for(var i=0;i<json.data.length;i++){
						debugger;
						if(i==0){
							html.push('<td>'+json.data[i].RADIO_NAME+'</td>');
							html.push('<td  colspan="3">');
						}
						if(i<(json.data.length-1)){
							html.push('<input id='+json.data[i].CONTENT_ID+' radioContentId='+json.data[i].CONTENT_ID+' name="radioContent" type="radio" value='+json.data[i].CONTENT_VALUE+' style="width:2%;">'+json.data[i].CONTENT_NAME+'');		
						}else{
							//html.push('<td>');
							html.push('<input id='+json.data[i].CONTENT_ID+' radioContentId='+json.data[i].CONTENT_ID+' name="radioContent" type="radio" value='+json.data[i].CONTENT_VALUE+' style="width: 2%;">'+json.data[i].CONTENT_NAME+'</td>');
						}
						
					}
					html.push('</tr>');
					$("#templateInfos tr:eq(5)").before(html.join(''));}
			}, parama, false,false);
		//获取本节点处理人信息
		var parama={								
				"handleType"  : "qryLst",
				"dataSource"  : "",
				"nameSpace"   : "shortProcess",
				"sqlName"     : "showNowNodeDeptInfo",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0"){
				$.each(json.data,function(i,obj){
							parentThis.now_ear_staff_ids = obj.NODE_EXECUTOR_ID;				
							parentThis.now_ear_staff_names=obj.NODE_EXECUTOR;
							parentThis.now_ear_department_names=obj.NODE_EXECUTE_DEPART;
							parentThis.now_ear_department_codes=obj.NODE_EXECUTE_DEPART_ID;
				});
				}
			}, parama, false,false);
		// 发起需求
		var backObj=parentThis.selecter.findById("a","submitInfo")[0];
		backObj.unbind("click").bind("click",function(){
				parentThis.submitInfo(parentThis);
		});
		//add 2017-11-13 处理流程时增加附件上传
		parentThis.selecter.findById("input","attachSub")[0].unbind("click").bind("click",function(){

			//common.loadding("open");
			debugger;
			var html=[];
			var fileName=$("#attachment").val();
			if ( fileName==""||fileName==null||fileName==undefined) { 
				layer.alert("请选择一个文件，再点击上传。",8); 
				return; 
				} 
			var index= fileName.lastIndexOf("\\");
			var file_name = fileName.substring(index+1);
			//这里判断，如果是excel文件，提示用户不能上传带有图片的excel
			var suffix = file_name.substring(file_name.lastIndexOf(".") + 1);
			
			
			var demand_id =parentThis.demandInfo.demandId;
			
			//查询文件保存的地址
			var file_path="";
			var param1={
					"handleType" : "getFilePath",
					"taskCode"   :  demand_id
			};
			$.jump.ajax(URL_SEND_TASK_BOOK.encodeUrl(),function(json){
				if(json.code=="0"){
					file_path=json.file_path;
				}else{
					layer.alert(json.msg,8);
				}
			},param1,true,false);
			//上传文件
			var param={
					"demand_id" :demand_id
			};
			
			var option = { 
            		url:URL_UPLOAD_FILE.encodeUrl()+"?"+$.param(param), 
            		type:"post",
        			success: function (json) {
        				debugger;
        				    var datajson=eval("("+json+")");
            				var file = $("#attachment");
            				var other_attachment_name=datajson.other_attachment_name;
            				file_path=datajson.attachment_path;
           					file.after(file.clone()); //复制元素
           					file.remove();//移除已存在
           					var i=0;
        					var obj={
        							"attachment_name" : file_name,
        							"attachment_path" : file_path,
        							"attachment_value" : demand_id,
        							"other_attachment_name":other_attachment_name,
        							"attachment_type"  : "shortProcess",
        							"upload_person_name":parentThis.demandInfo.staffName
        					};
        					//alert(JSON.stringify(obj));
        					i=base.fileList.length;
        					base.fileList.push(obj);
        					var attachment_name = obj.attachment_name.split('.')[0];
 							var type = obj.attachment_name.split('.')[1];
 							if(attachment_name.length >10) {
 								attachment_name = attachment_name.substr(0,10)+ "..." + type;
 							}else {
 								attachment_name = obj.attachment_name;
 							}
        					var parama={								
        							"attachment_name"  : obj.attachment_name,
        							"attachment_path"  : file_path,
        							"attachment_value" : demand_id,
        							"other_attachment_name":other_attachment_name,
        							"attachment_type"  : "shortProcess",
        							"hanleType"        : "goverInsertAttach"
        					};			
        					$.jump.ajax(URL_QUERY_GOVER_ENTER.encodeUrl(), function(json) {
        							if(json.code == "0"){
        								layer.alert("上传成功！",9);
        								$("#attachment").val("");
        							}
        					}, parama, false,false);
 							html.push('<div   id="divObj'+i+'" class="lable-title fl" style="width:20%;"><a href="javascript:void(0)" name="attachment" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_attachment_name="'+other_attachment_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="上传人：'+obj.upload_person_name+',文件名：'+obj.attachment_name+'">'+attachment_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmenta" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_attachment_name="'+other_attachment_name+'" style="color: red;width:200px;">×</a></div>');
 							
 							if($('#nofile').length > 0){
 								$('#nofile').remove();
 							}
 							$("#attachmentFile").append(html.join());
             				
            				//下载
            				$("#demandDetailInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
	        					debugger;
	        					var fileNames = $(this).attr("attachment_name");
	        					var downloadName = $(this).attr("other_attachment_name");
	        					var param={
	        							"fileName":	$(this).attr("attachment_name"),
	        							"downloadName":$(this).attr("other_attachment_name"),
	        							"filePath":	$(this).attr("attachment_path")
	        					};
	    						$.jump.ajax(URL_SHORT_DOWN_FILE.encodeUrl(), function(json) {
	    							debugger;
	    							if(json.code == "0"){
	    								var params={
	    										"fileName"     :	fileNames,
	    										"downloadName" :    downloadName,
	    										"filePath"	   :	json.file_path
	    								};	
	    								window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(params));
	    							}
	    					}, param, false,false);
	        				});
            				//删除
            				$("#demandDetailInfo").find("a[name=attachmenta]").unbind("click").bind("click",function(){
            					//获取删除按钮的ID
            					var id=$(this).attr("id");
            					var fileName=$(this).attr("attachment_name");
            					var downloadName = $(this).attr("other_attachment_name");
            					var filePath = $(this).attr("attachment_path");
            					debugger;
            					//找到当前删除按钮所在的DIV层
            					var divobj=$("#attachmentFile").find('div[id=divObj'+id+']');
            					divobj.remove();
            					var parama={								
            							"attachment_name"  : fileName,
            							"attachment_path"  : filePath,
            							"attachment_value" : parentThis.demandInfo.demandId,
            							"other_attachment_name":downloadName,
            							"attachment_type"  : "shortProcess",
            							"hanleType"        : "deleteFiles"
            					};			
            					$.jump.ajax(URL_COMMON_DELETE_FILE.encodeUrl(), function(json) {
            						debugger;
            							if(json.code == "0"){
            								layer.alert("删除成功！",9);
            							}
            					}, parama, false,false);
            				});
        			}
            	};
			$('#attachForm').ajaxSubmit(option); 
//			if(suffix=="xls"||suffix=="xlsx"){
//				layer.confirm('请确认上传的excel文件中不含有图片，否则无法上传成功！', function(){
//					$('#attachForm').ajaxSubmit(option); 
//				});
//			}else{
//			$('#attachForm').ajaxSubmit(option); 
//			}	
		});
		    //这里显示原上传的附件信息
		    debugger;
 			var param={
 					"demandId" :  parentThis.demandInfo.demandId,
 					"fileType" :  "shortProcess",
 			};
 			$.jump.ajax(URL_QRY_ATTACH_INFO.encodeUrl(),function(json){
 				debugger;
				if(json.code=="0"){
					var fileList1=json.fileList;
					var fileInfoObj=$('#attachmentFile');
					var html=[];
					if(fileList1.length>0){
						dfileLength=fileList1.length;
						//附件
						$.each(fileList1,function(i,obj){
								var pointIndex = obj.attachment_name.lastIndexOf(".");
								var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
								var file_name="";
								if(obj.attachment_name.length >13) {
									file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
								}else {
									file_name = obj.attachment_name;
								}
								var other_file_name=obj.OTHER_ATTACHMENT_NAME;
								//如果附件上传人与当前处理人相同，可以对该附件进行删除
								if(obj.upload_person==parentThis.demandInfo.staffId){
									html.push('<div id="divvObj'+i+'" class="lable-title fl" style="width:20%;"><a href="javascript:void(0)" id="file'+i+'" name="attachmentInfo" file_name="'+obj.attachment_name+
											'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="上传人：'+obj.upload_person_name+',文件名：'+obj.attachment_name+'">'+file_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmentdel" file_name="'+obj.attachment_name+'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: red;width:200px;">×</a>');
									html.push('</div>');	
								}else{
									html.push('<div id="divvObj'+i+'" class="lable-title fl" style="width:20%;"><a href="javascript:void(0)" id="file'+i+'" name="attachmentInfo" file_name="'+obj.attachment_name+
											'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="上传人：'+obj.upload_person_name+',文件名：'+obj.attachment_name+'">'+file_name+'</a>');
									html.push('</div>');
								}
								
						});
					}else{
						html.push('<div id="nofile">该流程单没有附件</div>');
					}
					fileInfoObj.html(html.join(''));
					
					//附件下载
					$('#demandDetailInfo').find('a[name=attachmentInfo]').unbind("click").bind("click",function(){
						debugger;
						var downloadName="";
						if($(this).attr("other_file_name")!=null&&$(this).attr("other_file_name")!=""&&$(this).attr("other_file_name")!="undefined"){
							downloadName=$(this).attr("other_file_name");
						}else{
							downloadName=$(this).attr("file_name");
						}
						var fileNames= $(this).attr("file_name");
						var param={
								"fileName"     :	$(this).attr("file_name"),
								"downloadName" :    downloadName,
								"filePath"	   :	$(this).attr("file_path")
						};	
						$.jump.ajax(URL_SHORT_DOWN_FILE.encodeUrl(), function(json) {
							debugger;
							if(json.code == "0"){
								var params={
										"fileName"     :	fileNames,
										"downloadName" :    downloadName,
										"filePath"	   :	json.file_path
								};	
								window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(params));
							}
					}, param, false,false);
						//window.location.href=URL_SHORT_DOWN_FILE+"?"+encodeURI($.param(param));
					});
					//删除
    				$("#demandDetailInfo").find("a[name=attachmentdel]").unbind("click").bind("click",function(){
    					//获取删除按钮的ID
    					var id=$(this).attr("id");
    					var fileName=$(this).attr("file_name");
    					var downloadName = $(this).attr("other_file_name");
    					var filePath = $(this).attr("file_path");
    					debugger;
    					//找到当前删除按钮所在的DIV层
    					var divobj=$("#attachmentFile").find('div[id=divvObj'+id+']');
    					divobj.remove();
    					var parama={								
    							"attachment_name"  : fileName,
    							"attachment_path"  : filePath,
    							"attachment_value" : parentThis.demandInfo.demandId,
    							"other_attachment_name":downloadName,
    							"attachment_type"  : "shortProcess",
    							"hanleType"        : "deleteFiles"
    					};			
    					$.jump.ajax(URL_COMMON_DELETE_FILE.encodeUrl(), function(json) {
    						debugger;
    							if(json.code == "0"){
    								layer.alert("删除成功！",9);
    							}
    					}, parama, false,false);
    				});
				}else{
					layer.alert(json.msg,  8);
				}
			},param,true,false);
		//会签点击事件
		 $("input:radio[name=disposeRadio]").click(function(){
				var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();  //获取审批动作
				if(disposeRadio=='sign'&&parentThis.workflow_st==1&&parentThis.staff_names.length==0){
					$("#disposeDesc").attr('disabled','disabled');
					parentThis.signAndStaff(parentThis);
				}
			 });
		 //单选规则事件
		 $("input:radio[name=radioContent]").click(function(){
			 debugger;
			 var radioContentRadio=$('input:radio[name=radioContent]:checked').val();  //获取单选规则属性
			 var radioContentId = $('input:radio[name=radioContent]:checked').attr("radioContentId");
			 //查询单选规则下一步
				var paramsd={								
						"handleType" 		 : "qryLst",
						"dataSource" 		 : "",
						"nameSpace"  		 : "shortProcess",
						"sqlName"    		 : "qrySelectedRadioInfoDispose",
						"workflowId" 		 :  parentThis.demandInfo.workflowId,
						"nodeId"   	 		 :  parentThis.now_node_id,//当前节点
						"radioContentId"   	 :  radioContentId//单选规则属性ID
				};
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					debugger;
					parentThis.staff_ids = [];
					parentThis.staff_names = [];
					parentThis.department_names = [];
					parentThis.department_codes = [];
					parentThis.nodeIds = [];
					parentThis.huiqianNodeId = [];
						if(json.code == "0" ){
							parentThis.staff_ids.push(json.data[0].NODE_EXECUTOR_ID);				
							parentThis.staff_names.push(json.data[0].NODE_EXECUTOR);
							parentThis.department_names.push(json.data[0].NODE_EXECUTE_DEPART);
							parentThis.department_codes.push(json.data[0].NODE_EXECUTE_DEPART_ID);
		                	parentThis.next_node_id=json.data[0].NEXTNODEID;
		                	parentThis.nodeIds.push(json.data[0].NEXTNODEID);
		                	parentThis.huiqianNodeId.push(json.data[0].NEXTNODEID);
							$("#disposeDeptName").val(json.data[0].NODE_EXECUTE_DEPART);
							$("#disposePersonName").val(json.data[0].NODE_EXECUTOR);
							parentThis.nodecount =json.data.length; 
						}
					}, paramsd, false,false);
		 });
		//parentThis.bindUpAndDown(parentThis);
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
		/** ******************************************加载流程图begin********************************************** */
		var property={
				width:1200,
				height:600,
				toolBtns:["start round","end round","task round","node","chat","state","plug","join","fork","complex mix"],
				haveHead:true,
				headBtns:["new","open","save","undo","redo","reload"],// 如果haveHead=true，则定义HEAD区的按钮
				haveTool:true,
				haveGroup:true,
				useOperStack:true
			};
/*			var remark={
				cursor:"选择指针",
				direct:"结点连线",
				start:"入口结点",
				"end":"结束结点",
				"task":"任务结点",
				node:"自动结点",
				chat:"决策结点",
				state:"状态结点",
				plug:"附加插件",
				fork:"分支结点",
				"join":"联合结点",
				"complex mix":"复合结点",
				group:"组织划分框编辑开关"
			};*/
			//var demo;
			parentThis.demo=$.createGooFlow($("#workflow"),property);
/*			parentThis.demo.setNodeRemarks(remark);
			parentThis.demo.onItemDel=function(id,type){
					return confirm("确定要删除该单元吗?");
				};*/
			var workflowId=parentThis.demandInfo.workflowId;
			var demandId=parentThis.demandInfo.demandId;
			var demandStatus=1000;
			/***********************************************审批中标记节点颜色*******************************************/
			if(demandStatus=="1000"){
				debugger;
				//审批中当前节点
				var currentNodeParam={
						"workflowId"	:	workflowId,	
						"demandId"		:	demandId,
						"task_id"       :   parentThis.taskId,
						"flag"			:	"1"
				};
				var currentId="";
				$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
					if(json.code=="0"){
						var dataObj=json.data;
						currentId=dataObj.NODE_ID;
					}
				},currentNodeParam,null,false,false);
				//审批中走过的节点
				var confrimedNodeParam={
						"workflowId"	:	workflowId,	
						"demandId"		:	demandId,
						"task_id"       :   parentThis.taskId,
						"flag"			:	"0"
				};
				var dataConfirmedObj="";
				$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
					if(json.code=="0"){
						dataConfirmedObj=json.data;
					}
				},confrimedNodeParam,null,false,false);
			}
			var post_id;
			var dept_type_id;
			var dept_level;
			var selectNodeId;
				param={"workflowId":parentThis.demandInfo.workflowId};
				// 后台获取"节点数据"和"线数据",组装流程格式
			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
			 		var workFlowTypeCode; 
			 		debugger;
			 		$.each(json.data0,function(i,obj){
			 			parentThis.workflow_type = obj.WORKFLOW_TYPE;
			 			workFlowTypeCode = obj.ACT_WORKFLOW_TYPE_CODE;
			 			$("#workflowSort").val(obj.ACT_WORKFLOW_TYPE_NAME);
			 		});
			 		var nodeNum=json.nodeNum;
			 		var nodeData=json.data.nodes;
			 		var jsonnodes="";
			 		$.each(json.data.nodes,function(i,obj){
			 			var type="";
			 			if(obj.NODE_TYPE=="0"){
			 				// 开始节点
			 				type="start round";
			 			}else if(obj.NODE_TYPE=="1"){
			 				// 任务节点
			 				type="node";
			 			}else{
			 				// 结束节点
			 				type="end round";
			 			}
			 			var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
					 	jsonnodes+=nodes+",";
			 		});
			 		jsonnodes="{"+jsonnodes.substring(0,jsonnodes.length-1)+"}";
			 		var jsonnodesObj=eval("("+jsonnodes+")");
			 		
			 		var lineNum=json.lineNum;
			 		var jsonlines="";
			 		var dataLine=json.data.lines;
			 		$.each(json.data.lines,function(i,obj){
			 			
			 			var lineName="";
			 			if(obj.LINE_NAME=="1"){
			 				lineName="串行";
			 			}else if(obj.LINE_NAME=="2"){
			 				lineName="并行";
			 			}else if(obj.LINE_NAME=="3"){
			 				lineName="无效";
			 			}
//			 			var dats=''+"{"+'"node_Id" : '+'"'+obj.FROM_NODE_ID+'"'+","+'"line_Name" :'+'"'+obj.LINE_NAME+'"}';
//			 			dataLine+=dats+",";
			 			//add by dangzw end 2016-12-01
			 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'""'+"}";
			 			jsonlines+=lines+",";
			 		});
			 		jsonlines="{"+jsonlines.substring(0,jsonlines.length-1)+"}";
			 		var jsonlinesObj=eval("("+jsonlines+")");
			  		if(json.code == "0" ){
			  			// 成功
			  			var workflow={
		  				        "nodes": 	jsonnodesObj,
		  				        "lines":	jsonlinesObj	
			  			};
			  			parentThis.demo.loadData(workflow);
			  			$("#workflow .GooFlow_item").attr("flag","3");
			  			$("#draw_workflow g").attr("flag","3");
			  			debugger;
			  			parentThis.addColorForCurrentNode(currentId);
			  			parentThis.addColorForEndNode(dataConfirmedObj,parentThis);
			  			$.each(json.data.nodes,function(i,obj){ //悬浮
			  				debugger
				 			var operat_agree = obj.OPERAT_AGREE;
				 			 if(operat_agree!=1){
				 				operat_agree = "";
				 			 }else{
				 				operat_agree = "通过";
				 			 }
					 		var to_prev_node = obj.TO_PREV_NODE;
					 			 if(to_prev_node!=2){
					 				to_prev_node = "";
					 			 }else{
					 				to_prev_node = "允许打回上一步";
					 			 }
						 	var to_begin_node = obj.TO_BEGIN_NODE;
						 			 if(to_begin_node!=3){
						 				to_begin_node = "";
						 			 }else{
						 				to_begin_node = "允许打回根节点";
						 			 }
						 	var titles ="处理人："+obj.NODE_EXECUTOR+"\n处理部门："+obj.NODE_EXECUTE_DEPART+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + ""+to_begin_node+"\n处理时限："+obj.TIME_LIMIT+"";
						 	$("#td_"+obj.NODE_ID+"").attr("title",titles);
			  			});
			  		}else{
			  			layer.alert("加载失败");
			  		};
					debugger;
					var parama={								
							"handleType"  		: 	"qryLst",
							"dataSource"  		: 	"",
							"nameSpace"   		: 	"shortProcess",
							"sqlName"     		: 	"qrySumitLeadIdByDisDeptInfo",
							"nodeId"      		: 	parentThis.huiqianNodeId.join(","),
							"workflowId"  		: 	parentThis.demandInfo.workflowId
					};	
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0"){
							$.each(json.data,function(i,obj){
					 			post_id = obj.POST_ID;
					 			dept_type_id = obj.DEPT_TYPE_ID;
					 			dept_level = obj.DEPT_LEVEL;
					 			selectNodeId = obj.SELECTNODE_ID;
					 			if(dept_level=="4"){//modify 2017-10-23 如果dept_level层级是4，说明流程配置的时候是按照发起人部门领导来配置的，此规则时，需要重新查询应该按照哪个层级来做
					 			var paramm={
					 					"handleType"  		: 	"qryLst",
										"dataSource"  		: 	"",
										"nameSpace"   		: 	"shortProcess",
										"sqlName"     		: 	"qryRealDeptLevel",
										"nodeId"      		: 	parentThis.huiqianNodeId.join(","),
										"workflowId"  		: 	parentThis.demandInfo.workflowId,
										"selectNodeId"      :   selectNodeId,
										"flag"              :   "1",
										"demandId"          :   parentThis.demandInfo.demandId
					 			};
					 			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					 				if(json.code == "0"){
					 					if(json.data.length>0){
					 						dept_level = json.data[0].dept_level;
											dept_type_id=json.data[0].dept_type_id;
					 					}
					 				}
					 			}, paramm, false,false);
					 			
					 			}
							  });
							}
						}, parama, false,false);
					if(parentThis.staff_ids.length==0){
						//获取下一节点处理人信息
//						var parama={								
//								"handleType"  : "qryLst",
//								"dataSource"  : "",
//								"nameSpace"   : "shortProcess",
//								"sqlName"     : "qrySumitLeadIdByDept",
//								"flag"        : "1",
//								"nodeId"      : parentThis.huiqianNodeId.join(","),
//								"workflowId"  : parentThis.demandInfo.workflowId
//						};		
						var parama={								
								"handleType"  		: 	"qryLst",
								"dataSource"  		: 	"",
								"nameSpace"   		: 	"shortProcess",
								"sqlName"     		: 	"qrySumitLeadIdByDisDept",
								"post_id"     		: 	post_id,
								"flag"       		: 	"1",
								"dept_type_id"     	: 	dept_type_id,
								"dept_level"     	: 	dept_level,
								"nodeId"      		: 	parentThis.huiqianNodeId.join(","),
								"workflowId"  		: 	parentThis.demandInfo.workflowId,
								"demandId"          :   parentThis.demandInfo.demandId, 
								"selectNodeId"      :   selectNodeId, 
								"workFlowTypeCode"  : 	workFlowTypeCode
						};	
						$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
								if(json.code == "0"){
								$.each(json.data,function(i,obj){
									debugger;
									var disposeDeptName;
									var disposePersonName;
											parentThis.staff_ids.push(obj.STAFF_ID);				
											parentThis.staff_names.push(obj.STAFF_NAME);
											parentThis.department_names.push(obj.DEPT_NAME);
											parentThis.department_codes.push(obj.DEPT_ID);
											disposeDeptName = parentThis.department_names.join(",");
											disposePersonName = parentThis.staff_names.join(",");
									$("#disposeDeptName").val(disposeDeptName);
									$("#disposePersonName").val(disposePersonName);
								});
								}
							}, parama, false,false);
					}
			 	}, param, true);
			 	
/** ******************************************加载流程图end************************************************** */		
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);
			//alert(demandInfo.unifiedAuthentication);
			$("input[type='radio'][name='isCertification'][value='"+demandInfo.unifiedAuthentication+"']").attr("checked",true);
		}
	},
	
	submitInfo : function(parentThis){
		debugger;
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();  //获取审批动作
		var flowRuleMin;
		var flowRuleMax;
		var flowRuleNextNodeId;
		if(disposeRadio=="agree"){
				var count;//步骤中其他子节点待办条数
				var task_snum;
				var endPrveNodeId;  //最后节点的上级节点数
				var otherSum;  //查询当前节点是否存在同一级其他节点数
				var paramNode={								
						"handleType" : "qryLst",
						"dataSource" : "",
						"nameSpace"  : "shortProcess",
						"sqlName"    : "qryParallelSum",
						"workflowId" :  parentThis.demandInfo.workflowId,
						"nodeId"     :  parentThis.now_node_id,
						"task_id"    :  parentThis.totaskId,
						"demandId"   :  parentThis.demandInfo.demandId,
				};	
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					
						if(json.code == "0" ){
							count = json.data[0].sums;
						}
					}, paramNode, false,false);
				//步骤中子节点处理条数
				var paramsd={								
						"handleType" : "qryLst",
						"dataSource" : "",
						"nameSpace"  : "shortProcess",
						"sqlName"    : "qryTaskNum",
						"workflowId" :  parentThis.demandInfo.workflowId,
						"upNodeId"   :  parentThis.up_node_id,
						"task_id"    :  parentThis.totaskId,
						"demandId"   :  parentThis.demandInfo.demandId,
				};	
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						if(json.code == "0" ){
							task_snum =json.data[0].TASK_SNUM;
						}
					}, paramsd, false,false);
					
					//规则获取并判断下一节点
					var paramRule={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "getFlowRuleToNextNodeInfo",
							"workflowId" :  parentThis.demandInfo.workflowId,
							"nodeId"   	 :  parentThis.now_node_id,//当前节点
					};	
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						debugger;
							if(json.code == "0" ){
								if(json.data.length>0){
									flowRuleMin =json.data[0].FLOWRULEMIN;
									flowRuleMax =json.data[0].FLOWRULEMAX;
									flowRuleNextNodeId =json.data[0].NEXTNODEID;	
								}
							}
						}, paramRule, false,false);
					debugger;
					//并行向下
					var cTask_num;
					var paramsds={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryCTaskNum",
							"workflowId" :  parentThis.demandInfo.workflowId,
							"demandId"   :  parentThis.demandInfo.demandId,
							"nodeId"   	 :  parentThis.now_node_id,//当前节点
					};	
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								cTask_num =json.data.length;
							}
						}, paramsds, false,false);
					//查询流程最后一个节点ID及最后节点的上一节点
					var paramsd={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryEndNodeIdAndPrveNodeId",
							"workflowId" :  parentThis.demandInfo.workflowId,
					};
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								endPrveNodeId =json.data.length;	
							}
						}, paramsd, false,false);
					//查询当前节点是否存在同一级其他节点数
					var paramsd={								
							"handleType" : "qryLst",
							"dataSource" : "",
							"nameSpace"  : "shortProcess",
							"sqlName"    : "qryNowNodeIdOtherNodeInfoSum",
							"nodeId"   	 :  parentThis.now_node_id,//当前节点
							"demandId"   :  parentThis.demandInfo.demandId,
					};
					debugger;
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						debugger;
						if(json.code == "0" ){
							otherSum =json.data[0].otherSum;	
						}
					}, paramsd, false,false);
					//被授权人信息
					var params={};
					params.handleType="qryLst";
					params.dataSource="";
					params.nameSpace="shortProcess";
					params.sqlName="getWorkflowAuthorStaffInfo";
					params.workflowId=parentThis.demandInfo.workflowId;
					params.next_node_id=parentThis.huiqianNodeId.join(",");
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						if(json.code == "0" ){
							if(json.data.length > 0){
								$.each(json.data,function(i,obj){
									 parentThis.ear_staff_ids.push(obj.ERA_OPERATOR_ID);
									 parentThis.ear_staff_names.push(obj.ERA_OPERATOR_NAME);
									 parentThis.ear_department_names.push(obj.ERA_OPERATOR_DEPTNAME);
									 parentThis.ear_department_codes.push(obj.ERA_OPERATOR_DEPTID);
								});
//								 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
//								 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
//								 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
//								 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
							}
						};
					}, params, false,false);
					//规则与模板数据对比，判断下一节点
					var ruleInfo=0;
					var ruleInfoData;
					var params={};
					params.handleType="qryLst";
					params.dataSource="";
					params.nameSpace="shortProcess";
					params.sqlName="queryFlowRuleNextNodeInfo";
					params.workflowId=parentThis.demandInfo.workflowId;
					params.now_node_id=parentThis.now_node_id,//当前节点;
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						if(json.code == "0" ){
							debugger;
							if(json.data.length > 0){
								ruleInfo =json.data.length;
								ruleInfoData = json.data;
							}else{
								ruleInfo = 0;
							}
						};
					}, params, false,false);
				//规则判断下一节点走哪种方法？
			   if(ruleInfo==1){
				   //ruleInfoData.ATTR_VALUE; //输出入的条件值
				   //ruleInfoData.FLOWRULEMIN;//金额最小值
				  // ruleInfoData.FLOWRULEMAX;//金额最大值
				  // ruleInfoData.NEXTNODEID;//下一节点
				   if(parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
						   parentThis.next_node_id.push(parentThis.endNodeId);
					       parentThis.submitEndInfo(parentThis);
					 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)&&parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
						   parentThis.next_node_id.push(parentThis.endNodeId);
						   arentThis.submitEndInfo(parentThis); 
					 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)){//小于最小审批金额(符合流程结束)
						   parentThis.next_node_id.push(parentThis.endNodeId);
					       parentThis.submitEndInfo(parentThis);
					 }else {
						 parentThis.next_node_id.push(ruleInfoData[0].NEXTNODEID);
						 parentThis.submitPostInfo(parentThis);
					 }
			   }else if(ruleInfo>1){
				   var isOverRule="";
					$.each(ruleInfoData,function(i,obj){
						debugger;
						   if(parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
							   parentThis.next_node_id=parentThis.endNodeId;
							   isOverRule = "1";
							   return false;
							   //parentThis.submitEndInfo(parentThis);
						 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)>=parseInt(obj.FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
							   parentThis.next_node_id=parentThis.endNodeId;
							   isOverRule = "1";
							   return false;
							   //parentThis.submitEndInfo(parentThis); 
						 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)){//小于最小审批金额(符合流程结束)
							   parentThis.next_node_id=parentThis.endNodeId;
							   isOverRule = "1";
							   return false;
						       //parentThis.submitEndInfo(parentThis);
						 }else if(parseInt(obj.FLOWRULEMIN)<=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)<parseInt(obj.FLOWRULEMAX)||parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMIN)||parseInt(obj.ATTR_VALUE)>=parseInt(obj.FLOWRULEMAX)){
							 parentThis.next_node_id.push(obj.NEXTNODEID);
							 isOverRule = "0";
							 return false;
							 //parentThis.submitPostInfo(parentThis);
						 }
					});
					if(isOverRule=="0"){
						parentThis.submitPostInfo(parentThis);
					}else{
						parentThis.submitEndInfo(parentThis);
					}
			   }else if(ruleInfo==0){
				   parentThis.next_node_id = parentThis.huiqianNodeId;
					//判断下一节点是不是最后的节点
				   if(parentThis.endNodeId!=parentThis.next_node_id){
				    	if(cTask_num!=1){
				    		 parentThis.taskNums = 1;
				    		 parentThis.submitAndUpdateInfo(parentThis); 
				    	}else{
				    		if(otherSum>1){
				    			parentThis.taskNums = 1;//会签所有的处理未完 为1
								parentThis.submitAndUpdateInfo(parentThis);
				    		}else{
				    			parentThis.submitPostInfo(parentThis);
				    		}
				    	}
				   }else{
						//判断下一节点是不是最后的节点
					    if(parentThis.endNodeId!=parentThis.next_node_id){  //不是最后节点
					    	if(cTask_num!=1){
					    		parentThis.taskNums = 1;
					    		parentThis.submitAndUpdateInfo(parentThis); 
					    	}else{
						    	parentThis.submitPostInfo(parentThis);
					    	}
					    }else{
					    	if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum==0){
						    	parentThis.next_node_id = parentThis.endNodeId;
						    	parentThis.submitOrEndInfo(parentThis);	
						    }else if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum>1){
				    			parentThis.taskNums = 1;//会签所有的处理未完 为1
								parentThis.submitAndUpdateInfo(parentThis);
				    		}else {
							    	parentThis.next_node_id = parentThis.endNodeId;
							    	parentThis.submitEndInfo(parentThis);	
						   }
					    }
				   }
			   }
		}else if(disposeRadio=="toStart"){
      		//处理不通过
      		var nextParam = {
      				"handleType"   :  "qryLst",
      				"dataSource"   :  "",
      				"nameSpace"    :  "shortProcess",
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.demandInfo.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandInfo.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
       			debugger;
      			if(json.code == "0" ){
      		 		$.each(json.data,function(i,obj){
      		 			  parentThis.falg="0";
	                	  parentThis.staff_ids=obj.OPERATOR_ID;
	                	  parentThis.staff_names=obj.OPERATOR_NAME;
	                	  parentThis.department_codes=obj.OPERATOR_DEPT_ID;
	                	  parentThis.department_names=obj.OPERATOR_DEPT;
	                	  parentThis.next_node_id=obj.NODE_ID;
      		 		});
      			}
      		}, nextParam, false,false);
			 parentThis.submitPostInfo(parentThis);
		}else if(disposeRadio=="toPrev"){
      		//处理不通过
      		var nextParam = {
      				"handleType"   :  "qryLst",
      				"dataSource"   :  "",
      				"nameSpace"    :  "shortProcess",
      				"sqlName"      :  "qryOldNode",
      				"workflowId"   :  parentThis.demandInfo.workflowId,
      				"nodeId"       :  parentThis.now_node_id,
      				"demandId"     :  parentThis.demandInfo.demandId,
      				"task_id"      :  parentThis.totaskId,
      				"caozuo"       :  disposeRadio,
      		};
      		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
       			debugger;
      			if(json.code == "0" ){
      		 		$.each(json.data,function(i,obj){
      		 			  parentThis.falg="0";
	                	  parentThis.staff_ids=obj.OPERATOR_ID;
	                	  parentThis.staff_names=obj.OPERATOR_NAME;
	                	  parentThis.department_codes=obj.OPERATOR_DEPT_ID;
	                	  parentThis.department_names=obj.OPERATOR_DEPT;
	                	  parentThis.next_node_id=obj.NODE_ID;
      		 		});
      			}
      		}, nextParam, false,false);
          
			parentThis.submitAndDeleteInfo(parentThis);
		}
		//	else if(disposeRadio=="toCancle"){
//      		//作废流程
//
//			var count;//步骤中其他子节点待办条数
//			var task_snum;
//			var endPrveNodeId;  //最后节点的上级节点数
//			var otherSum;  //查询当前节点是否存在同一级其他节点数
//			var paramNode={								
//					"handleType" : "qryLst",
//					"dataSource" : "",
//					"nameSpace"  : "shortProcess",
//					"sqlName"    : "qryParallelSum",
//					"workflowId" :  parentThis.demandInfo.workflowId,
//					"nodeId"     :  parentThis.now_node_id,
//					"task_id"    :  parentThis.totaskId,
//					"demandId"   :  parentThis.demandInfo.demandId,
//			};	
//			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//				
//					if(json.code == "0" ){
//						count = json.data[0].sums;
//					}
//				}, paramNode, false,false);
//			//步骤中子节点处理条数
//			var paramsd={								
//					"handleType" : "qryLst",
//					"dataSource" : "",
//					"nameSpace"  : "shortProcess",
//					"sqlName"    : "qryTaskNum",
//					"workflowId" :  parentThis.demandInfo.workflowId,
//					"upNodeId"   :  parentThis.up_node_id,
//					"task_id"    :  parentThis.totaskId,
//					"demandId"   :  parentThis.demandInfo.demandId,
//			};	
//			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//					if(json.code == "0" ){
//						task_snum =json.data[0].TASK_SNUM;
//					}
//				}, paramsd, false,false);
//				
//				//规则获取并判断下一节点
//				var paramRule={								
//						"handleType" : "qryLst",
//						"dataSource" : "",
//						"nameSpace"  : "shortProcess",
//						"sqlName"    : "getFlowRuleToNextNodeInfo",
//						"workflowId" :  parentThis.demandInfo.workflowId,
//						"nodeId"   	 :  parentThis.now_node_id,//当前节点
//				};	
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//					debugger;
//						if(json.code == "0" ){
//							if(json.data.length>0){
//								flowRuleMin =json.data[0].FLOWRULEMIN;
//								flowRuleMax =json.data[0].FLOWRULEMAX;
//								flowRuleNextNodeId =json.data[0].NEXTNODEID;	
//							}
//						}
//					}, paramRule, false,false);
//				debugger;
//				//并行向下
//				var cTask_num;
//				var paramsds={								
//						"handleType" : "qryLst",
//						"dataSource" : "",
//						"nameSpace"  : "shortProcess",
//						"sqlName"    : "qryCTaskNum",
//						"workflowId" :  parentThis.demandInfo.workflowId,
//						"demandId"   :  parentThis.demandInfo.demandId,
//						"nodeId"   	 :  parentThis.now_node_id,//当前节点
//				};	
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//						if(json.code == "0" ){
//							cTask_num =json.data.length;
//						}
//					}, paramsds, false,false);
//				//查询流程最后一个节点ID及最后节点的上一节点
//				var paramsd={								
//						"handleType" : "qryLst",
//						"dataSource" : "",
//						"nameSpace"  : "shortProcess",
//						"sqlName"    : "qryEndNodeIdAndPrveNodeId",
//						"workflowId" :  parentThis.demandInfo.workflowId,
//				};
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//						if(json.code == "0" ){
//							endPrveNodeId =json.data.length;	
//						}
//					}, paramsd, false,false);
//				//查询当前节点是否存在同一级其他节点数
//				var paramsd={								
//						"handleType" : "qryLst",
//						"dataSource" : "",
//						"nameSpace"  : "shortProcess",
//						"sqlName"    : "qryNowNodeIdOtherNodeInfoSum",
//						"nodeId"   	 :  parentThis.now_node_id,//当前节点
//						"demandId"   :  parentThis.demandInfo.demandId,
//				};
//				debugger;
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//					debugger;
//					if(json.code == "0" ){
//						otherSum =json.data[0].otherSum;	
//					}
//				}, paramsd, false,false);
//				//被授权人信息
//				var params={};
//				params.handleType="qryLst";
//				params.dataSource="";
//				params.nameSpace="shortProcess";
//				params.sqlName="getWorkflowAuthorStaffInfo";
//				params.workflowId=parentThis.demandInfo.workflowId;
//				params.next_node_id=parentThis.huiqianNodeId.join(",");
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//					if(json.code == "0" ){
//						if(json.data.length > 0){
//							$.each(json.data,function(i,obj){
//								 parentThis.ear_staff_ids.push(obj.ERA_OPERATOR_ID);
//								 parentThis.ear_staff_names.push(obj.ERA_OPERATOR_NAME);
//								 parentThis.ear_department_names.push(obj.ERA_OPERATOR_DEPTNAME);
//								 parentThis.ear_department_codes.push(obj.ERA_OPERATOR_DEPTID);
//							});
////							 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
////							 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
////							 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
////							 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
//						}
//					};
//				}, params, false,false);
//				
//				//规则与模板数据对比，判断下一节点
//				var ruleInfo=0;
//				var ruleInfoData;
//				var params={};
//				params.handleType="qryLst";
//				params.dataSource="";
//				params.nameSpace="shortProcess";
//				params.sqlName="queryFlowRuleNextNodeInfo";
//				params.workflowId=parentThis.demandInfo.workflowId;
//				params.now_node_id=parentThis.now_node_id,//当前节点;
//				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//					if(json.code == "0" ){
//						debugger;
//						if(json.data.length > 0){
//							ruleInfo =json.data.length;
//							ruleInfoData = json.data;
//						}else{
//							ruleInfo = 0;
//						}
//					};
//				}, params, false,false);
//			//规则判断下一节点走哪种方法？
//		   if(ruleInfo==1){
//			   //ruleInfoData.ATTR_VALUE; //输出入的条件值
//			   //ruleInfoData.FLOWRULEMIN;//金额最小值
//			  // ruleInfoData.FLOWRULEMAX;//金额最大值
//			  // ruleInfoData.NEXTNODEID;//下一节点
//			   if(parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
//					   parentThis.next_node_id.push(parentThis.endNodeId);
//				      
//				 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)&&parseInt(ruleInfoData[0].ATTR_VALUE)<=parseInt(ruleInfoData[0].FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
//					   parentThis.next_node_id.push(parentThis.endNodeId);
//					   
//				 }else if(parseInt(ruleInfoData[0].FLOWRULEMIN)>=parseInt(ruleInfoData[0].ATTR_VALUE)){//小于最小审批金额(符合流程结束)
//					   parentThis.next_node_id.push(parentThis.endNodeId);
//				      
//				 }else {
//					 parentThis.next_node_id.push(ruleInfoData[0].NEXTNODEID);
//					
//				 }
//		   }else if(ruleInfo>1){
//			   var isOverRule="";
//				$.each(ruleInfoData,function(i,obj){
//					debugger;
//					   if(parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMAX)){//小于最大审批金额(符合流程结束)
//						   parentThis.next_node_id=parentThis.endNodeId;
//						   isOverRule = "1";
//						   return false;
//					 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)>=parseInt(obj.FLOWRULEMAX)){//小于最小审批金额大于最大审批金额(符合流程结束)
//						   parentThis.next_node_id=parentThis.endNodeId;
//						   isOverRule = "1";
//						   return false;
//						  
//					 }else if(parseInt(obj.FLOWRULEMIN)>=parseInt(obj.ATTR_VALUE)){//小于最小审批金额(符合流程结束)
//						   parentThis.next_node_id=parentThis.endNodeId;
//						   isOverRule = "1";
//						   return false;
//					      
//					 }else if(parseInt(obj.FLOWRULEMIN)<=parseInt(obj.ATTR_VALUE)&&parseInt(obj.ATTR_VALUE)<parseInt(obj.FLOWRULEMAX)||parseInt(obj.ATTR_VALUE)<=parseInt(obj.FLOWRULEMIN)||parseInt(obj.ATTR_VALUE)>=parseInt(obj.FLOWRULEMAX)){
//						 parentThis.next_node_id.push(obj.NEXTNODEID);
//						 isOverRule = "0";
//						 return false;
//						 
//					 }
//				});
//				
//		   }else if(ruleInfo==0){
//			   parentThis.next_node_id = parentThis.huiqianNodeId;
//				//判断下一节点是不是最后的节点
//			   if(parentThis.endNodeId!=parentThis.next_node_id){
//			    	if(cTask_num!=1){
//			    		 parentThis.taskNums = 1;
//			    		 
//			    	}else{
//			    		if(otherSum>1){
//			    			parentThis.taskNums = 1;//会签所有的处理未完 为1
//							
//			    		}
//			    	}
//			   }else{
//					//判断下一节点是不是最后的节点
//				    if(parentThis.endNodeId!=parentThis.next_node_id){  //不是最后节点
//				    	if(cTask_num!=1){
//				    		parentThis.taskNums = 1;
//				    	}
//				    }else{
//				    	if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum==0){
//					    	parentThis.next_node_id = parentThis.endNodeId;
//					    	
//					    }else if(task_snum==0&&count>0&&endPrveNodeId>1&&otherSum>1){
//			    			parentThis.taskNums = 1;//会签所有的处理未完 为1
//						
//			    		}else {
//						    	parentThis.next_node_id = parentThis.endNodeId;
//						   	
//					   }
//				    }
//			   }
//		   }
//	
//      		parentThis.submitCancleInfo(parentThis);//相当于结束
//		}
		else if(parentThis.workflow_st==1&&disposeRadio=="sign"){//会签
			debugger;
			parentThis.submitSignInfo(parentThis);
	    }

	},
	submitPostInfo :function(parentThis){  //提交信息（并行or串行）
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			if(disposeRadio!="agree"){
				if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
					layer.alert("请选择审批意见!");
					return false;
				}
			}

			var  workflowId =parentThis.demandInfo.workflowId;
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			var  ear_operator_Id; //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			if(disposeRadio=="agree"){
				chulirenid2    = parentThis.staff_ids.join(",");
				chulirenname2   = parentThis.staff_names.join(",");
				chulideptid2    = parentThis.department_codes.join(",");
				chulideptname2  = parentThis.department_names.join(",");
				node2 = parentThis.next_node_id.join(",");
				if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
				}else{
					ear_operator_Id     = parentThis.ear_staff_ids;
					ear_operator_Name   = parentThis.ear_staff_names;
					ear_operator_dept_Id    = parentThis.ear_department_codes;
					ear_operator_dept_Name  = parentThis.ear_department_names;
				}
			}else{
				chulirenid2     = parentThis.staff_ids;
				chulirenname2   = parentThis.staff_names;
				chulideptid2    = parentThis.department_codes;
				chulideptname2  = parentThis.department_names;
				
				ear_operator_Id     = parentThis.ear_staff_ids;
				ear_operator_Name   = parentThis.ear_staff_names;
				ear_operator_dept_Id    = parentThis.ear_department_codes;
				ear_operator_dept_Name  = parentThis.ear_department_names;
				node2 = parentThis.next_node_id;
			}
			
			var  questtype  = parentThis.workflow_type;
			debugger;
			var  countersign;//会签
			if(disposeRadio=="agree"){
				if(parentThis.nodecount>1){
					countersign = "0";//0代表并行流程
				}else{
					countersign = "1";//1代表串行流程
				}
			}else{
				countersign = "1";//1代表串行流程
			}

		 var param = {
				 "workflowId"           					:  workflowId,//流程ID
				 "demandId"             					:  parentThis.demandInfo.demandId, //需求ID
				 "demandName"           					:  parentThis.demandInfo.demandName, //需求名称
				 "demandCode"           					:  parentThis.demandInfo.demandCode, //需求编码
				 "chulirenid2"          					:  chulirenid2,//下一步处理人ID
				 "chulirenname2"        					:  chulirenname2,//下一步处理人名称
				 "chulideptid2"         					:  chulideptid2,//下一步处理部门ID
				 "chulideptname2"       					:  chulideptname2,//下一步处理部门名称
				 "questtype"            					:  questtype,//任务类型		 
				 "node2"                					:  node2,//下一节点ID 
				 "now_node_id"          					:  parentThis.now_node_id,//本节点ID
				 "taskId"               					:  parentThis.taskId,//本节点任务ID
				 "isEndTime"            					:  parentThis.isEndTime,//是否超时
				 "timeLimit"            					:  parentThis.timeLimit,//处理时限
				 "disposeRadio"         					:  disposeRadio,//审批结果
				 "disposeDesc"          					:  disposeDesc,//审批意见
				 "urgeCount"            					:  parentThis.urgeCount,//催单次数
				 "urgeTime"             					:  parentThis.urgeTime,//催单时间
				 "countersign"          					:  countersign,//流程类型
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
		 };
		 
		 $.jump.ajax(URL_ADD_WORKFLOWNEEDD.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
		}, param, false,false);
		 //add by dangzw begin 2016-12-09
//		 var mobileInfoParam = {
//				 "workflowName"        :  parentThis.demandInfo.workflowName,
//				 "demandId"            :  parentThis.demandInfo.demandId,
//				 "demandName"          :  parentThis.demandInfo.demandName,
//				 "operator_Id"         :  chulirenid2,
//				 "operator_Name"       :  chulirenname2
//		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
//		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
//			 if(json.code=="1"){
//				 layer.alert(json.errorInfo,8);
//			 }
//		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
		 
		 //add by dangzw begin 2016-12-09
		 //工单处理完成到待评价时，需要给发起人进行短信提醒。
//		 debugger;
//		 var wcreatorId=parentThis.demandInfo.wcreatorId;
//		 var demandFinishPara={
//				"wcreatorId"	:	wcreatorId,
//				"demandId"      :  	parentThis.demandInfo.demandId,
//		 };
//		 $.jump.ajax(URL_DEMAND_FINISH.encodeUrl(), function(json) {
//			 if(json.code=="1"){
//				 layer.alert(json.errorInfo,8);
//			 }
//		 }, demandFinishPara, false,false);
		 //add by dangzw end 2016-12-09
	},
	submitAndUpdateInfo :function(parentThis){  //并行处理方法
		debugger;
		var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
		var  disposeDesc   = $("#disposeDesc").val(); 
		if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
			layer.alert("请选择审批结果!");
			return false;
		}
		if(disposeRadio!="agree"){
			if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
				layer.alert("请选择审批意见!");
				return false;
			}
		}
		var  workflowId =parentThis.demandInfo.workflowId;  
		var  chulirenid2;
		var  node2;
		var  chulirenname2;
		var  chulideptid2;
		var  chulideptname2;
		var  ear_operator_Id;   //下一步代（授权）处理人ID
		var  ear_operator_Name;//下一步代（授权）处理人名称
		var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
		var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
		var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
		var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
		var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
	    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			 chulirenid2    = parentThis.staff_ids.join(",");
			 chulirenname2   = parentThis.staff_names.join(",");
			 chulideptid2    = parentThis.department_codes.join(",");
			 chulideptname2  = parentThis.department_names.join(",");
			 node2 = parentThis.next_node_id.join(",");
		  if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
						ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
						ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
						ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
						ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
		 }else{
						ear_operator_Id     = parentThis.ear_staff_ids;
						ear_operator_Name   = parentThis.ear_staff_names;
						ear_operator_dept_Id    = parentThis.ear_department_codes;
						ear_operator_dept_Name  = parentThis.ear_department_names;
		  }
		debugger;
		var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "demandName"           :  parentThis.demandInfo.demandName, //需求名称
				 "demandCode"           :  parentThis.demandInfo.demandCode, //需求编码
				 "chulirenid2"          :  chulirenid2,//上一步处理人ID
				 "chulirenname2"        :  chulirenname2,//上一步处理人名称
				 "chulideptid2"         :  chulideptid2,//上一步处理部门ID
				 "chulideptname2"       :  chulideptname2,//上一步处理部门名称
				 "questtype"            :  questtype,//任务类型		 
				 "node2"                :  node2,//下一节点ID 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "taskNums"             :  parentThis.taskNums,//标识
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
		 };
		$.jump.ajax(URL_ADD_WORKFLOWNEEDDD.encodeUrl(), function(json) {
				if(json.code == "0" ){
					layer.alert("审批成功",1);
					$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
						$("#content").html(pageHtml);
						var noSolveProcessList=new NoSolveProcessList();
						noSolveProcessList.init();
						});
					}else{
				layer.alert("审批失败!");	
				}
			}, param, false,false);/* */
		 //add by dangzw begin 2016-12-09
//		if(chulirenid2!=""||chulirenid2!=null||chulirenid2!=undefined){
//		 var mobileInfoParam = {
//				 "workflowName"        :  parentThis.demandInfo.workflowName,
//				 "demandId"            :  parentThis.demandInfo.demandId,
//				 "demandName"          :  parentThis.demandInfo.demandName,
//				 "operator_Id"         :  chulirenid2,
//				 "operator_Name"       :  chulirenname2
//		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
//		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
//			 if(json.code=="1"){
//				 layer.alert(json.errorInfo,8);
//			 }
//		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
		 
		 //add by dangzw begin 2016-12-09
		 //工单处理完成到待评价时，需要给发起人进行短信提醒。
//		 var wcreatorId=parentThis.demandInfo.wcreatorId;
//		 var demandFinishPara={
//				"wcreatorId"	:	wcreatorId,
//				"demandId"      :  	parentThis.demandInfo.demandId,
//		 };
//		 $.jump.ajax(URL_DEMAND_FINISH.encodeUrl(), function(json) {
//			 if(json.code=="1"){
//				 layer.alert(json.errorInfo,8);
//			 }
//		 }, demandFinishPara, false,false);
		 //add by dangzw end 2016-12-09	
//		}
	},
	submitEndInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			if(disposeRadio!="agree"){
				if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
					layer.alert("请选择审批意见!");
					return false;
				}
			}
			var  workflowId =parentThis.demandInfo.workflowId;  
			var  ear_operator_Id;   //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
				}else{
					ear_operator_Id     = parentThis.ear_staff_ids;
					ear_operator_Name   = parentThis.ear_staff_names;
					ear_operator_dept_Id    = parentThis.ear_department_codes;
					ear_operator_dept_Name  = parentThis.ear_department_names;
			}
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			  debugger;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "demandName"           :  parentThis.demandInfo.demandName, //需求名称
				 "demandCode"           :  parentThis.demandInfo.demandCode, //需求编码
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "sendStaffName"        :  $('#releasePersonName').val(),//发起人名
				 "sendStaffTel"         :  $('#releasePersonNum').val() ,//发起人电话
				 "demandName"           : parentThis.demandInfo.demandName,
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
				 "flag"                 :  "0"
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWNEEDDDD.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
					}, param, false,false);
	},
//	submitCancleInfo:function(parentThis){
//		  debugger;
//			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
//			var  disposeDesc   = $("#disposeDesc").val(); 
//			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
//				layer.alert("请选择审批结果!");
//				return false;
//			}
//			if(disposeRadio!="agree"){
//				if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
//					layer.alert("请选择审批意见!");
//					return false;
//				}
//			}
//			var  workflowId =parentThis.demandInfo.workflowId;  
//			var  ear_operator_Id;   //下一步代（授权）处理人ID
//			var  ear_operator_Name;//下一步代（授权）处理人名称
//			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
//			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
//			if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
//					ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
//					ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
//					ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
//					ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
//				}else{
//					ear_operator_Id     = parentThis.ear_staff_ids;
//					ear_operator_Name   = parentThis.ear_staff_names;
//					ear_operator_dept_Id    = parentThis.ear_department_codes;
//					ear_operator_dept_Name  = parentThis.ear_department_names;
//			}
//			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
//			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
//			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
//		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
//			  debugger;
//		 var param = {
//				 "workflowId"           :  workflowId,//流程ID
//				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
//				 "demandName"           :  parentThis.demandInfo.demandName, //需求名称
//				 "demandCode"           :  parentThis.demandInfo.demandCode, //需求编码
//				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
//				 "taskId"               :  parentThis.taskId,//本节点任务ID
//				 "isEndTime"            :  parentThis.isEndTime,//是否超时
//				 "timeLimit"            :  parentThis.timeLimit,//处理时限
//				 "disposeRadio"         :  disposeRadio,//审批结果
//				 "disposeDesc"          :  disposeDesc,//审批意见
//				 "urgeCount"            :  parentThis.urgeCount,//催单次数
//				 "urgeTime"             :  parentThis.urgeTime,//催单时间
//				 "sendStaffName"        :  $('#releasePersonName').val(),//发起人名
//				 "sendStaffTel"         :  $('#releasePersonNum').val() ,//发起人电话
//				 "demandName"           : parentThis.demandInfo.demandName,
//				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
//				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
//				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
//				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
//				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
//				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
//				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
//				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
//				 "flag"                 :  "0"
//		 };
//		 $.jump.ajax(URL_ADD_WORKFLOWACANCLE.encodeUrl(), function(json) {
//								if(json.code == "0" ){
//									layer.alert("审批成功",1);
//									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
//										$("#content").html(pageHtml);
//										var noSolveProcessList=new NoSolveProcessList();
//										noSolveProcessList.init();
//										});
//									}else{
//								layer.alert("审批失败!");	
//								}
//					}, param, false,false);
//	
//	},
	submitAndDeleteInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			if(disposeRadio!="agree"){
				if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
					layer.alert("请选择审批意见!");
					return false;
				}
			}
			var  workflowId =parentThis.demandInfo.workflowId;  
			var  chulirenid2;
			var  node2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
			var  ear_operator_Id; //下一步代（授权）处理人ID
			var  ear_operator_Name;//下一步代（授权）处理人名称
			var  ear_operator_dept_Id;//下一步代（授权）处理部门ID
			var  ear_operator_dept_Name;//下一步代（授权）处理部门名称
			var  now_ear_operator_Id   = parentThis.now_ear_staff_ids;   //本节点处理人ID
			var  now_ear_operator_Name  = parentThis.now_ear_staff_names;//本节点处理人名称
			var  now_ear_operator_dept_Id  = parentThis.now_ear_department_codes;//本节点处理人部门ID
		    var  now_ear_operator_dept_Name  = parentThis.now_ear_department_names;//本节点处理人部门名称
			if(disposeRadio=="agree"){
				chulirenid2    = parentThis.staff_ids.join(",");
				chulirenname2   = parentThis.staff_names.join(",");
				chulideptid2    = parentThis.department_codes.join(",");
				chulideptname2  = parentThis.department_names.join(",");
				node2 = parentThis.next_node_id.join(",");
				if(parentThis.ear_staff_ids!=""&&parentThis.ear_staff_ids!=null){
						ear_operator_Id   = parentThis.ear_staff_ids.join(",");   //下一步代（授权）处理人ID
						ear_operator_Name  = parentThis.ear_staff_names.join(",");//下一步代（授权）处理人名称
						ear_operator_dept_Id  = parentThis.ear_department_codes.join(",");//下一步代（授权）处理部门ID
						ear_operator_dept_Name  = parentThis.ear_department_names.join(",");//下一步代（授权）处理部门名称
					}else{
						ear_operator_Id     = parentThis.ear_staff_ids;
						ear_operator_Name   = parentThis.ear_staff_names;
						ear_operator_dept_Id    = parentThis.ear_department_codes;
						ear_operator_dept_Name  = parentThis.ear_department_names;
				}
			}else{
				chulirenid2     = parentThis.staff_ids;
				chulirenname2   = parentThis.staff_names;
				chulideptid2    = parentThis.department_codes;
				chulideptname2  = parentThis.department_names;
				
				ear_operator_Id     = parentThis.ear_staff_ids;
				ear_operator_Name   = parentThis.ear_staff_names;
				ear_operator_dept_Id    = parentThis.ear_department_codes;
				ear_operator_dept_Name  = parentThis.ear_department_names;
				node2 = parentThis.next_node_id;
			}
			var  questtype  = parentThis.workflow_type;
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "demandName"           :  parentThis.demandInfo.demandName, //需求名称
				 "demandCode"           :  parentThis.demandInfo.demandCode, //需求编码
				 "chulirenid2"          :  chulirenid2,//上一步处理人ID
				 "chulirenname2"        :  chulirenname2,//上一步处理人名称
				 "chulideptid2"         :  chulideptid2,//上一步处理部门ID
				 "chulideptname2"       :  chulideptname2,//上一步处理部门名称
				 "questtype"            :  questtype,//任务类型		 
				 "node2"                :  node2,//上一节点ID 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
				 "isEndTime"            :  parentThis.isEndTime,//是否超时
				 "timeLimit"            :  parentThis.timeLimit,//处理时限
				 "disposeRadio"         :  disposeRadio,//审批结果
				 "disposeDesc"          :  disposeDesc,//审批意见
				 "urgeCount"            :  parentThis.urgeCount,//催单次数
				 "urgeTime"             :  parentThis.urgeTime,//催单时间
				 "ear_operator_Id"          				:  ear_operator_Id,//下一步代（授权）处理人ID
				 "ear_operator_Name"          				:  ear_operator_Name,//下一步代（授权）处理人名称
				 "ear_operator_dept_Id"          			:  ear_operator_dept_Id,//下一步代（授权）处理部门ID
				 "ear_operator_dept_Name"          			:  ear_operator_dept_Name,//下一步代（授权）处理部门名称
				 "now_ear_operator_Id"          			:  now_ear_operator_Id,//本节点处理人ID
				 "now_ear_operator_Name"         		 	:  now_ear_operator_Name,//本节点处理人名称
				 "now_ear_operator_dept_Id"          		:  now_ear_operator_dept_Id,//本节点处理人部门ID
				 "now_ear_operator_dept_Name"          		:  now_ear_operator_dept_Name,//本节点处理人部门名称
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWBACK.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("审批成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("审批失败!");	
								}
					}, param, false,false);
		 
		 //add by dangzw begin 2016-12-09
//		 var mobileInfoParam = {
//				 "workflowName"        :  parentThis.demandInfo.workflowName,
//				 "demandId"            :  parentThis.demandInfo.demandId,
//				 "demandName"          :  parentThis.demandInfo.demandName,
//				 "operator_Id"         :  chulirenid2,
//				 "operator_Name"       :  chulirenname2
//		};
		 //工单环节流转时，需要给下一环节处理人员进行短信提醒
//		 $.jump.ajax(URL_STEP_FLOW_REMIND.encodeUrl(), function(json) {
//			 if(json.code=="1"){
//				 layer.alert(json.errorInfo,8);
//			 }
//		 }, mobileInfoParam, false,false);
		 //add by dangzw end 2016-12-09
	},
	addColorForCurrentNode:function(currentId){
		$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[class='GooFlow_item'][id="+currentId+"]").css("background-color","red");
	},
	addColorForEndNode:function(dataConfirmedObj,parentThis){
		$.each(dataConfirmedObj,function(i,obj){
			if(obj.NODE_TYPE=="1"&&obj.NODE_ID<parentThis.now_node_id){
				//任务节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			} 
			if(obj.NODE_TYPE=="0"){
				//开始节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			}
		});
	},
	//绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		//下载文件
		//$('a[name="attachmentInfo"]').unbind("click").bind("click",function(){
		$('#attachment').find('a[name=attachmentInfo]').unbind("click").bind("click",function(){
			debugger;
			var downloadName="";
			if($(this).attr("other_file_name")!=null&&$(this).attr("other_file_name")!=""&&$(this).attr("other_file_name")!="undefined"){
				downloadName=$(this).attr("other_file_name");
			}else{
				downloadName=$(this).attr("file_name");
			}
			var param={
					"fileName"     :	$(this).attr("file_name"),
					"downloadName" :    downloadName,
					"filePath"	   :	$(this).attr("file_path")
			};
			window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		});
	},
	submitOrEndInfo :function(parentThis){
		  debugger;
			var disposeRadio=$('input:radio[name=disposeRadio]:checked').val();
			var  disposeDesc   = $("#disposeDesc").val(); 
			if(disposeRadio==""||disposeRadio==null||disposeRadio==undefined){
				layer.alert("请选择审批结果!");
				return false;
			}
			if(disposeRadio!="agree"){
				if(disposeDesc==""||disposeDesc==null||disposeDesc==undefined){
					layer.alert("请选择审批意见!");
					return false;
				}
			}
	var  workflowId =parentThis.demandInfo.workflowId;  
	 var param = {
			 "workflowId"           :  workflowId,//流程ID
			 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
			 "now_node_id"          :  "",//本节点ID
			 "taskId"               :  parentThis.taskId,//本节点任务ID
			 "isEndTime"            :  parentThis.isEndTime,//是否超时
			 "timeLimit"            :  parentThis.timeLimit,//处理时限
			 "disposeRadio"         :  disposeRadio,//审批结果
			 "disposeDesc"          :  disposeDesc,//审批意见
			 "urgeCount"            :  parentThis.urgeCount,//催单次数
			 "urgeTime"             :  parentThis.urgeTime,//催单时间
			 "flag"                 :  "1",
	 };
	 $.jump.ajax(URL_ADD_WORKFLOWNEEDDDD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								layer.alert("审批成功",1);
								$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
									$("#content").html(pageHtml);
									var noSolveProcessList=new NoSolveProcessList();
									noSolveProcessList.init();
									});
								}else{
							layer.alert("审批失败!");	
							}
				}, param, false,false);
	},
	//绑定会签事件
	signAndStaff : function(parentThis){
		debugger;
		//选择节点部门
			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择会签人员</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div id="staff_sign">');
			xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
			xthtml.push('<thead>');         
			xthtml.push('<tr>'); 
			xthtml.push('<th style="width:15%;">姓名</th>');
			xthtml.push('<th style="width:10%;">部门</th>');
			xthtml.push('</tr>');
			xthtml.push('</thead>');
			xthtml.push('<tbody id="staff_signBody"></tbody>');
			xthtml.push('</table>');
			xthtml.push('</div>');
			xthtml.push('<div style="margin-top: 20px;"><a href="javascript:void(0)"  class="but btn-info " name="infoSubmits">选择</a>');
			xthtml.push('<a href="javascript:void(0)"  class="but ml10" name="infoSubmit">确认</a><a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a></div>');  
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
			//关闭
			roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(selectStaffInfoPage);
			});
			var Sign_staffId=[];
			var Sign_staffName=[];
			var Sign_staffDeptId=[];
			var Sign_staffDeptName=[];
			//选择人员
			roleInfoPageDiv.find("a[name=infoSubmits]").unbind("click").bind("click",function(){
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					var html="";	
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");								
						html+='<tr name="staffInfo">';
						html+='<td>'+trObj.attr("staff_name")+'</td>';		
						html+='<td>'+trObj.attr("DEPARTMENT_NAME")+'</td>';
						html+='</tr>';
						Sign_staffId.push(trObj.attr("staff_id"));
						Sign_staffName.push(trObj.attr("staff_name"));
						Sign_staffDeptId.push(trObj.attr("DEPARTMENT_CODE"));
						Sign_staffDeptName.push(trObj.attr("DEPARTMENT_NAME"));
						$("#staff_signBody").append(html);
//							$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(trObj.attr("staff_name"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(trObj.attr("DEPARTMENT_NAME"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartName']").val(trObj.attr("DEPARTMENT_NAME"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecutorName']").val(trObj.attr("staff_name"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(trObj.attr("staff_id"));
//							$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(trObj.attr("DEPARTMENT_CODE"));
						//layer.close(selectStaffInfoPage);
					}
				});
			});
			//确定
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				 parentThis.Sign_staffId=Sign_staffId;
				 parentThis.Sign_staffName=Sign_staffName;
				 parentThis.Sign_staffDeptId=Sign_staffDeptId;
				 parentThis.Sign_staffDeptName=Sign_staffDeptName;
				layer.close(selectStaffInfoPage);
			});
			parentThis.queryWorkflows(parentThis);
	},
	queryWorkflows : function(parentThis){
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
						html1.push('<div id ="'+obj.REGION_ID+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
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
				"region_id": fuId
		};
		$("#"+fuId+"").unbind("click").bind("click",function(){
			
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					var html=[];
					if(json.data.length > 0) {
						$.each(json.data,function(i,obj){
							html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
						});
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
					parentThis.queryPeopleLists(parentThis,ziId);
				});
			});
		});
		});
	},
	//查询专家数据
	queryPeopleLists : function(parentThis,ziId) {	
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
				parentThis.createPeolpeHtmls(parentThis,data,noticeLstBodyObj,noticeLstFootObj);
			});	
	},
	//创建按查询展示专业人员
	createPeolpeHtmls : function(parentThis,data,noticeLstBodyObj,noticeLstFootObj){		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			noticeLstFootObj.show();
			$.each(data.data,function(i,obj){			
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" name="sd" style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
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
	submitSignInfo :function(parentThis){
			var  workflowId =parentThis.demandInfo.workflowId;  
			var  chulirenid2;
			var  chulirenname2;
			var  chulideptid2;
			var  chulideptname2;
				 chulirenid2    = parentThis.Sign_staffId.join(",");
				 chulirenname2   = parentThis.Sign_staffName.join(",");
				 chulideptid2    = parentThis.Sign_staffDeptId.join(",");
				 chulideptname2  = parentThis.Sign_staffDeptName.join(",");
			if(chulirenid2==""||chulirenid2==null||chulirenid2==undefined){
				layer.alert("请选择处理人!");
				return false;
			}
		 var param = {
				 "workflowId"           :  workflowId,//流程ID
				 "demandId"             :  parentThis.demandInfo.demandId, //需求ID
				 "chulirenid2"          :  chulirenid2,//会签处理人ID
				 "chulirenname2"        :  chulirenname2,//会签处理人名称
				 "chulideptid2"         :  chulideptid2,//会签处理部门ID
				 "chulideptname2"       :  chulideptname2,//会签处理部门名称	 
				 "now_node_id"          :  parentThis.now_node_id,//本节点ID
				 "taskId"               :  parentThis.taskId,//本节点任务ID
		 };
		 $.jump.ajax(URL_ADD_WORKFLOWSIGN.encodeUrl(), function(json) {
								if(json.code == "0" ){
									layer.alert("会签成功",1);
									$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
										$("#content").html(pageHtml);
										var noSolveProcessList=new NoSolveProcessList();
										noSolveProcessList.init();
										});
									}else{
								layer.alert("会签失败!");	
								}
					}, param, false,false);
		 },
};