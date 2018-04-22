var UpdateShortProcessDemandInitiate = new Function();
UpdateShortProcessDemandInitiate.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
 	node_executor : null,
 	node_execute_depart : null,
 	node_executor_id : null,
 	node_execute_depart_id : null,
	staff_ids : null, 
    staff_names: null, 
    department_names : null, 
    department_codes: null,
    ear_staff_ids : null, //被授权人ID
    ear_staff_names: null, //被授权人名称
    ear_department_names : null, //被授权人部门
    ear_department_codes: null,//被授权人部门ID
    next_node_id: null,
    now_node_id: null,
    endNodeId: null,
    type :null,
    demandId : "",
    workflow_type : "",
    falg :1,
    base:null,
    fileList:[],
	// 初始化执行
	init : function(param) {
	  debugger;
	  	base=this;
		this.demandInfo=param;
		this.bindMetod(this);
		
	},
	bindMetod : function(parentThis) {
		debugger;
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryshortProcessDeptInfo"
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			debugger;
				if(json.code == "0" ){
					$("#releaseDeptName").val(json.data[0].dept_name);
				}
			}, params, false,false);
		//加载模板属性
		var templateId=parentThis.demandInfo.templateId;
		if(templateId!=null&&templateId!=""&&templateId!=undefined){
			var attrParam={
					"templateId"	:	templateId
			};
			$.jump.ajax(URL_QUERY_DEMANDTEMPLATE_ATTR.encodeUrl(), function(json) {
				debugger;
				if(json.code == "0" ){
					var dataList=json.data;
					var html=[];
					$.each(dataList,function(i,obj){
						debugger;
						html.push('<tr>');
						html.push('<td>'+obj.ATTR_NAME+'</td>');
						html.push('<td colspan="3">');
						html.push('<input id='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' style="width: 95%;"></td>');
						html.push('</tr>');
						//if(obj.ATTR_TYPE=='text' && obj.ATTR_NAME=='金额'){
						//}
					});
					$("#templateInfos tr:eq(5)").before(html.join(''));
				};
			}, attrParam, false,false);
		}
 			var param={
 					"demandId" :  parentThis.demandInfo.demandId,
 					"fileType" :  "shortProcess",
 			};
 			$.jump.ajax(URL_QRY_ATTACH_INFO.encodeUrl(),function(json){
 				debugger;
				if(json.code=="0"){
					var fileList=json.fileList;
					var fileInfoObj=$('#attachmentInfo');
					var html=[];
					if(fileList.length>0){
						//附件
						$.each(fileList,function(i,obj){
								var pointIndex = obj.attachment_name.lastIndexOf(".");
								var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
								var file_name="";
								if(obj.attachment_name.length >13) {
									file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
								}else {
									file_name = obj.attachment_name;
								}
								var other_file_name=obj.OTHER_ATTACHMENT_NAME;
								html.push('<div  id="divObj'+i+'"  class="lable-title fl" style="width:15%;"><a href="javascript:void(0)" id="file'+i+'" name="attachmentInfo" file_name="'+obj.attachment_name+
										'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="上传人：'+obj.upload_person_name+',文件名：'+obj.attachment_name+'">'+file_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmenta" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_attachment_name="'+other_file_name+'" style="color: red;width:200px;">×</a></div>');
								html.push('</div>');
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
						var param={
								"fileName"     :	$(this).attr("file_name"),
								"downloadName" :    downloadName,
								"filePath"	   :	$(this).attr("file_path")
						};	
						window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
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
    					var divobj=$("#attachmentInfo").find('div[id=divObj'+id+']');
    					divobj.remove();
    					for(var j=0;j<base.fileList.length;j++){
    						if(base.fileList[j].attachment_name==fileName){
    							base.fileList.remove(j);
    						}
    					}
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
		//附件上传与展示
		
		parentThis.selecter.findById("input","attachSub")[0].unbind("click").bind("click",function(){
			common.loadding("open");
			debugger;
//		  var inputElement = document.getElementById("input");    
//			 inputElement.addEventListener("change", handleFiles, false); 
			var html=[];
			var fileName=$("#attachment").val();
			if ( fileName==""||fileName==null||fileName==undefined) { 
				layer.alert("请选择一个文件，再点击上传。",8); 
				return; 
				} 
			var index= fileName.lastIndexOf("\\");
			var file_name = fileName.substring(index+1);
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
        							"upload_person_name": parentThis.demandInfo.staffName
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
 							html.push('<div id="divObj'+i+'"  class="lable-title fl" style="width:15%;"><a href="javascript:void(0)"  name="attachment" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_attachment_name="'+other_attachment_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="上传人：'+obj.upload_person_name+',文件名：'+obj.attachment_name+'">'+attachment_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmenta" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_attachment_name="'+other_attachment_name+'" style="color: red;width:200px;">×</a></div>');
 							if($('#nofile').length > 0){
 								$('#nofile').remove();
 							}
 							$("#attachmentInfo").append(html.join());
             				
            				//下载
            				$("#demandDetailInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
	        					debugger;
	        					var param={
	        							"fileName":	$(this).attr("attachment_name"),
	        							"downloadName":$(this).attr("other_attachment_name"),
	        							"filePath":	$(this).attr("attachment_path")
	        					};
	        					window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
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
            					var divobj=$("#attachmentInfo").find('div[id=divObj'+id+']');
            					divobj.remove();
            					for(var j=0;j<base.fileList.length;j++){
            						if(base.fileList[j].attachment_name==fileName){
            							base.fileList.remove(j);
            						}
            					}
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
		});
		// 取消返回
		var backObj=parentThis.selecter.findById("a","backInfo")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var noSolveProcessList=new NoSolveProcessList();
				noSolveProcessList.init();
				});
		});
		// 发起需求
		var backObj=parentThis.selecter.findById("a","submitInfo")[0];
		backObj.unbind("click").bind("click",function(){
			parentThis.submitInfoData(parentThis);
			
		});
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
			var demo;
				demo=$.createGooFlow($("#workflow"),property);
/*				demo.setNodeRemarks(remark);
				demo.onItemDel=function(id,type){
					return confirm("确定要删除该单元吗?");
				};*/
				param={"workflowId":parentThis.demandInfo.workflowId};
				// 后台获取"节点数据"和"线数据",组装流程格式
				var next_node_ids = "";
				var now_node_ids = "";
				var post_id;
				var dept_type_id;
				var dept_level;
				var start_staffId;
			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
			 		debugger;
			 		$("#releasePersonName").val(json.staffname);
			 		//$("#releaseDeptName").val(json.regionname);
			 		$("#releasePersonNum").val(json.staffpno);
			 		start_staffId=json.staffId;
			 		$.each(json.data1,function(i,obj){
			 			parentThis.now_node_id =   obj.NOW_NODE_ID;
			 			parentThis.next_node_id =  obj.NEXT_NODE_ID;
			 			next_node_ids = obj.NEXT_NODE_ID;
			 			now_node_ids = obj.NOW_NODE_ID;
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
			 		var workFlowTypeCode; 
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
			 		$.each(json.data.lines,function(i,obj){
			 			debugger;
			 			//alert(obj.LINE_NAME);
			 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+""+'"'+"}";
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
			  			demo.loadData(workflow);
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
						 	var titles ="处理人："+obj.NODE_EXECUTOR+"\n处理部门："+obj.NODE_EXECUTE_DEPART+"\n联系电话："+obj.NODE_EXECUTORTEL+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + ""+to_begin_node+"\n处理时限："+obj.TIME_LIMIT+"";
						 	$("#td_"+obj.NODE_ID+"").attr("title",titles);
			  			});
			  		}else{
			  			layer.alert("加载失败");
			  		};
			  		debugger;
			  	//判断下一节点的处理人及处理部门是否存在
				 	if(parentThis.node_executor_id==""){
						//查询发起人部门领导人
						var parama={								
								"handleType"  		: 	"qryLst",
								"dataSource"  		: 	"",
								"nameSpace"   		: 	"shortProcess",
								"sqlName"     		: 	"qrySumitLeadIdByDisDept",
								"post_id"     		: 	post_id,
								"dept_type_id"     	: 	dept_type_id,
								"dept_level"     	: 	dept_level,
								"workFlowTypeCode"  : 	workFlowTypeCode,
								"staff_id"          :   start_staffId,
								//"sqlName"     	: 	"qrySumitLeadIdByDept",
								"flag"        		: 	"0"
						};			
						$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							debugger;
							if(json.code == "0"){
								if(json.data.length>0){
							 		 parentThis.node_executor_id = json.data[0].STAFF_ID;
							 		 parentThis.node_executor = json.data[0].STAFF_NAME;
							 		 parentThis.node_execute_depart = json.data[0].DEPT_NAME;
							 	     parentThis.node_execute_depart_id = json.data[0].DEPT_ID;
							 	    $("#disposeDeptName").val(parentThis.node_execute_depart);
									$("#disposePersonName").val(parentThis.node_executor);
								}
							}
						}, parama, false,false);
				 	}else{
				 		parentThis.type = 1;
				 		parentThis.staff_ids  = parentThis.node_executor_id ;
				 		parentThis.staff_names = parentThis.node_executor ;
				 		parentThis.department_names = parentThis.node_execute_depart;
				 		parentThis.department_codes = parentThis.node_execute_depart_id ;
						$("#disposeDeptName").val(parentThis.node_execute_depart);
						$("#disposePersonName").val(parentThis.node_executor);
				 	}
			 	}, param, true);
	
/** ******************************************加载流程图end************************************************** */		
	},
	//绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		//删除文件
		$("#attachmentInfo").find("a[name=deleteFile]").unbind("click").bind("click",function(){
			//获取删除按钮的ID
			var id=$(this).attr("id");
			//找到当前删除按钮所在的DIV层
			var divobj=$("#attachmentInfo").find('div[id=divObj'+id+']');
			//后台文件删除
			var param = {
					"hanleType"			:	 	"delFileName"			      , //操作类型
					"attachment_value"	:		$(this).attr("attachment_value"),//文件id
					"fileName": $(this).attr("attachment_name")     ,//文件名稱
			};
			$.jump.ajax(URL_QUERY_GOVER_ENTER.encodeUrl(), function(json) {
				if(json.code == "0" ){
					layer.alert("删除成功",9);
				}else{
					layer.alert(json.msg,8);
				};
			}, param, true);
			//移除掉DIV层
			divobj.remove();
		});
		//下载文件
		$("#attachmentInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
			var param={
					"fileName": $(this).attr("attachment_name")     ,	
					"downloadName" : $(this).attr("attachment_name"),
					"filePath":	$(this).attr("attachment_path")     ,
			};
			//alert( $(this).attr("attachment_name1") );
			//alert( $(this).attr("attachment_name") );
			//alert( $(this).attr("attachment_path") );
			
			window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		});
	},
	// 节点详细
	viewNodeDetail:function(parentThis,nodeId){
		var html = [];
		html.push('<div  id="viewNodeDetailPage" class="tanchu_box"  style="width:600px;">');
		html.push('<h3 id="title">节点详细</h3>');
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td>流程环节处理要求</td> ');                
		html.push('</tr>');
		
		html.push('<tr>');         
		html.push('<td  id="nodesNames" rowspan="6" ></td>');         
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:180px" readonly><input type="hidden" name="nodeExecuteDepartId" id="nodeExecuteDepartId" style="width:180px" readonly></td>');         
		//html.push('<td rowspan="5" id="toNextnodeCondition"></td>');         
		//html.push('<td rowspan="5"><input type="text" name="stateDetail" id="stateDetail" style="width:180px" readonly><br/><br/><br/><input type="text" name="tloverTime" id="tloverTime" style="width:180px" readonly></td>');           
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理人:&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:180px" readonly><input type="hidden" name="nodeExecutorId" id="nodeExecutorId" style="width:180px" readonly></td>');         
		html.push('</tr>');   
		
		html.push('<tr>');         
		html.push('<td>联系电话:&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:180px" readonly><input type="hidden" name="nodeExecutorId" id="nodeExecutorId" style="width:180px" readonly></td>');         
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理动作:<input type="text" name="disposeAction" id="disposeAction" style="width:180px" readonly></td>');         
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:180px" readonly></td>');         
		html.push('</tr>');   
		html.push('<tr> '); 
		html.push('<td colspan="4" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a></td>'); 
		html.push('</tr>'); 
		html.push('</table>');         
		html.push('</div>');
		
		var authInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], // 去掉默认边框
		    // shade: [0], //去掉遮罩
		    // closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', // 从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var viewNodeDetailPage=$("#viewNodeDetailPage");
		
		
		// 关闭
		viewNodeDetailPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		$("#viewNodeDetailPage").find("a[name='infoSubmit']").bind("click",function(){
				layer.close(authInfoPage);
		});

		//选择节点部门
		var nodeExecuteDepartObj = $("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']");
			nodeExecuteDepartObj.unbind("click").bind("click",function(){

			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择部门</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div>');
			xthtml.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
			xthtml.push('<tr><td>部门名称:&nbsp;&nbsp;&nbsp;<input type="text" id="selectNameOrTel" placeholder="请输入部门名称" style="width:200px;" >');
			xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but" name="selectNameOrTelSearch">查询</a>');
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
			//选中
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				debugger;
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
						parentThis.staff_ids = trObj.attr("staff_id");				
						parentThis.staff_names=trObj.attr("staff_name");
						parentThis.department_names=trObj.attr("DEPARTMENT_NAME");
						parentThis.department_codes=trObj.attr("DEPARTMENT_CODE");
						var DEPARTMENT_ID=trObj.attr("DEPARTMENT_ID");
						if(boxObj.length==0){
							layer.alert("请选择处理人及部门!",8);
							return false;
						}
						debugger
						$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(trObj.attr("staff_name"));
						$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(trObj.attr("staff_id"));
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(DEPARTMENT_ID);
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(trObj.attr("DEPARTMENT_NAME"));
						$("#disposeDeptName").val(trObj.attr("DEPARTMENT_NAME"));
						$("#disposePersonName").val(trObj.attr("staff_name"));
						layer.close(selectStaffInfoPage);
					}
				});
			});
			parentThis.queryWorkflow(parentThis);

		});	
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
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'" DEPARTMENT_ID="'+obj.DEPARTMENT_ID+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" style="width: 10%;" ></td>');
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
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);
		}
	},
	submitInfoData :function(parentThis){
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
			debugger;
				if(json.code == "0"){
					parentThis.submitInfos = json.data.length;
					if(json.data.length>0){
						parentThis.endNodeId = json.data[0].ENDNODEID;
					}
					
				}
			}, parama, false,false);
		//规则与模板数据对比，判断下一节点
		var isOverRule="";
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
					debugger;
					var templateAttrNames = $("#"+json.data[0].ATTR_ONAME+"").val();
					var templateAttrName =parseInt(templateAttrNames);
					$.each(json.data,function(i,obj){
						if(templateAttrName>parseInt(obj.FLOWRULEMIN)&&templateAttrName<parseInt(obj.FLOWRULEMAX)){
							 parentThis.next_node_id=obj.NEXTNODEID;
						 	 parentThis.staff_ids  = obj.NODE_EXECUTOR_ID ;
						 	 parentThis.staff_names =obj.NODE_EXECUTOR ;
						 	 parentThis.department_names =obj.NODE_EXECUTE_DEPART;
						 	 parentThis.department_codes =obj.NODE_EXECUTE_DEPART_ID ;
							 isOverRule = "0";
							 return false; 
						 }
					});

					
					if(isOverRule=="0"){
						//被授权人信息
						var params={};
						params.handleType="qryLst";
						params.dataSource="";
						params.nameSpace="shortProcess";
						params.sqlName="getWorkflowAuthorStaffInfo";
						params.workflowId=parentThis.demandInfo.workflowId;
						params.next_node_id=parentThis.next_node_id;
						$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){
								if(json.data.length > 0){
									 parentThis.ear_staff_ids=json.data[0].ERA_OPERATOR_ID;
									 parentThis.ear_staff_names=json.data[0].ERA_OPERATOR_NAME;
									 parentThis.ear_department_names=json.data[0].ERA_OPERATOR_DEPTNAME;
									 parentThis.ear_department_codes=json.data[0].ERA_OPERATOR_DEPTID;
								}
							};
						}, params, false,false);
						parentThis.submitInfo(parentThis);
					}
				}else{
					//被授权人信息
					var params={};
					params.handleType="qryLst";
					params.dataSource="";
					params.nameSpace="shortProcess";
					params.sqlName="getWorkflowAuthorStaffInfo";
					params.workflowId=parentThis.demandInfo.workflowId;
					params.next_node_id=parentThis.next_node_id;
					$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
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
					parentThis.submitInfo(parentThis);
				}
			};
		}, params, false,false);
	},
	submitInfo : function(parentThis){
		debugger;
		var  workflowName =parentThis.demandInfo.workflowName;  //流程ID
		 var  workflowId =parentThis.demandInfo.workflowId;  //流程ID
		 var  demandName = $("#demandName").val();  //需求名称
		 var  demandDesc = $("#demandDesc").val();  //需求说明
		 var  workflowSort  = parentThis.workflow_type;    //工单流程类型
		 var  releasePersonNum  = $("#releasePersonNum").val();    //工单流程类型
		 var  operator_Id   = parentThis.staff_ids;   //下一步处理人ID
		 var  operator_Name  = parentThis.staff_names;//下一步处理人名称
		 var  operator_dept_Id  = parentThis.department_codes;//下一步处理部门ID
		 var  operator_dept_Name  = parentThis.department_names;//下一步处理部门名称
		 var  ear_operator_Id   = parentThis.ear_staff_ids;   //下一步代（授权）处理人ID
		 var  ear_operator_Name  = parentThis.ear_staff_names;//下一步代（授权）处理人名称
		 var  ear_operator_dept_Id  = parentThis.ear_department_codes;//下一步代（授权）处理部门ID
		 var  ear_operator_dept_Name  = parentThis.ear_department_names;//下一步代（授权）处理部门名称
		 var  next_node_id  = parentThis.next_node_id; //下一节点ID
		 var  now_node_id  = parentThis.now_node_id;  // 当前节点ID
		 var  isCertification=$("input[type=radio][name='isCertification']:checked").val();
		 if(isCertification==undefined){
			 isCertification="";
		 }
		 if(operator_Id==""||operator_Id==null||operator_Id==undefined){
			 layer.alert("请选择下一节点处理人!");	
			 return false;
		 }
		 if(demandName==""||demandName==null||demandName==undefined){
			 layer.alert("请填写工单主题!");	
			 return false;
		 }
		 	var attrName;
			var attrId;
			var attrOname;
			var attrValue;
			var templateId=parentThis.demandInfo.templateId;
			var attrIds=[];
			var attrNames=[];
			var attrOnames=[];
			var attrValues=[];
			var attrParam={
						"templateId"	:	templateId
				};
				$.jump.ajax(URL_QUERY_DEMANDTEMPLATE_ATTR.encodeUrl(), function(json) {
					debugger;
					if(json.code == "0" ){
						var dataList=json.data;
						$.each(dataList,function(i,obj){
							debugger;
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
		 var param = {
				 "workflowId"          		:  workflowId,
				 "workflowName"        		:  workflowName,
				 "demandId"            		:  parentThis.demandInfo.demandId,
				 "demandCode"            	:  parentThis.demandInfo.demandCode,
				 "demandName"          		:  demandName,
				 "demandDesc"         		:  demandDesc,
				 "questtype"           		:  workflowSort,
				 "phone"               		:  releasePersonNum,
				 "operator_Id"         		:  operator_Id,
				 "operator_Name"       		:  operator_Name,
				 "operator_dept_Id"    		:  operator_dept_Id,
				 "operator_dept_Name"  		:  operator_dept_Name,
				 "ear_operator_Id"          :  ear_operator_Id,
				 "ear_operator_Name"        :  ear_operator_Name,
				 "ear_operator_dept_Id"     :  ear_operator_dept_Id,
				 "ear_operator_dept_Name"   :  ear_operator_dept_Name,
				 "next_node_id"  	   		:  next_node_id,
				 "now_node_id"         		:  now_node_id,
				 "type"                		:  parentThis.type,
				 "templateId"          		:  parentThis.demandInfo.templateId,
				 "attrId"          			:  attrId,
				 "attrOname"          		:  attrOname,
				 "attrValue"          		:  attrValue,
				 "attrName"          		:  attrName,
				 "isCertification"     		:  isCertification
				 };
		 $.jump.ajax(URL_UPD_WORKFLOWNEED.encodeUrl(), function(json) {
				if(json.code == "0" ){
					layer.alert("发起成功",1);
					$.jump.loadHtmlForFun("/web/html/shortProcess/noSolveProcessList.html".encodeUrl(),function(pageHtml){
						$("#content").html(pageHtml);
						var noSolveProcessList=new NoSolveProcessList();
						noSolveProcessList.init();
						});
					}else{
						layer.alert("发起失败!");	
					}
			}, param, false,false); 
	}
};