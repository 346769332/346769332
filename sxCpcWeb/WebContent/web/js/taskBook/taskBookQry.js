var TaskBookQry=new Function();
TaskBookQry.prototype={
		selector:"#taskBookQryPage",
		temp : null,
		checkNum : null,
		taskCode : null,
		modelId : null,
		dataMap : null,
		init: function(code, dataMap, checkNum){
			temp=this;
			if(checkNum=='1'){
				temp.taskCode=code;
			}else if(checkNum=='2'){
				temp.modelId=code;
			}
			temp.dataMap=dataMap;
			temp.checkNum=checkNum;
			this.bindMethod();
			$('#bookInfo').click();
		},
		bindMethod : function(){
			$("#bookInfo").focus(); //责任书按钮默认选中
			if(temp.checkNum=='2'){ //责任书制定
				$('#bookInfoDiv').show();
				$('#fillBlankDiv').hide();
				$('#flowInfoDiv').hide();
				$('#signedPhoneDiv').hide();
				$("#bookInfo").show();
				$("#fillBlank").hide();
				$("#flowInfo").hide();
				$('#signedPhone').hide();
			}
			$('#bookInfo').unbind('click').bind('click',function(){ //责任书
				$('#bookInfoDiv').show();
				$('#fillBlankDiv').hide();
				$('#flowInfoDiv').hide();
				$('#signedPhoneDiv').hide();
			});
			$('#fillBlank').unbind('click').bind('click',function(){ //责任书填写照片
				$('#bookInfoDiv').hide();
				$('#fillBlankDiv').show();
				$('#flowInfoDiv').hide();
				$('#signedPhoneDiv').hide();
				var type="task1";
				temp.searchUploadFile(type);
			});
			$('#signedPhone').unbind('click').bind('click',function(){ //责任书签订照片
				
				$('#bookInfoDiv').hide();
				$('#signedPhoneDiv').show();
				$('#flowInfoDiv').hide();
				$('#fillBlankDiv').hide();
				var type="task2";
				temp.searchUploadFile(type);
			}); 
			$('#flowInfo').unbind('click').bind('click',function(){ //责任书流程信息
				$('#bookInfoDiv').hide();
				$('#fillBlankDiv').hide();
				$('#flowInfoDiv').show();
				$('#signedPhoneDiv').hide();
				temp.searchFlowInfo();
			});
//			$('#exportWord').unbind('click').bind('click',function(){ //责任书的下载
//				$('#bookInfoDiv').show();
//				$('#fillBlankDiv').hide();
//				$('#flowInfoDiv').hide();
////				$("#bookInfoDiv").wordExport();
//				//生成word
//				var param = {
//						"taskType"	:	"exportWord" ,
//						"taskCode"	:	temp.taskCode ,
//						"modelId"	:	temp.modelId ,
//						"dataMap" 	:	JSON.stringify(temp.dataMap),
//				};
//				//去后台查询数据，并且生成exportWord.doc文档
//				$.jump.ajax(URL_CREATE_NORM_WORD.encodeUrl(), function(data) {
//					if(data.code=="0"){
//						
//						//附件下载
//						var param={
//								"fileName"     :	data.file_name,
//								"downloadName" :    data.file_name,
//								"filePath"	   :	data.file_path
//						};	
//						window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
//					}else{
//						layer.alert("下载责任书失败！",8);
//					}
//				}, param, false,false);
//			}); 
			$('#goback').unbind('click').bind('click',function(){
				if(temp.checkNum=='2'){ //责任书制定
					$.jump.loadHtmlForFun("/web/html/taskBook/makeTaskBook.html".encodeUrl(),function(contentHtml){
						$('#content').html(contentHtml);
						var makeTaskBook=new MakeTaskBook();
						makeTaskBook.init();
					});
				}else if(temp.checkNum=='1'){ //责任书查询
					common.loadding("open");
					$.jump.loadHtmlForFun("/web/html/taskBook/taskBookList.html".encodeUrl(),function(contentHtml){
						common.loadding("close");
						$('#content').html(contentHtml);
						var bookList=new TaskBookList();
						bookList.init();
					});
				}
			});
		},
		searchFlowInfo : function(){
			var param={
					"taskCode" : temp.taskCode,
			};
			
			$.jump.ajax(SEARCH_TASK_BOOK_INFO.encodeUrl(),function(json){
				
				if(json.code=="0"){//查询成功
					var taskInfo=json.taskInfo;
					var recordSet=json.recordSet;
					temp.taskInfo=taskInfo;
					temp.recordSet=recordSet;
					temp.setFlowTable(recordSet);
					
				}
			},param,true,false);
		},
		setFlowTable : function(recordSet){
			
			var flowDiv=$('#flowTable');
			if(recordSet!=null&&recordSet!=''){
				var html=[];
				var recordLength=recordSet.length-1;
				$.each(recordSet,function(i,obj){
					html.push('<tr>');
					html.push('<td style="width: 10%;">'+(i+1)+'</td>');
					html.push('<td style="width: 15%;">'+obj.curr_node_name+'</td>');
					html.push('<td style="width: 20%;">'+obj.fun_name+'</td>');
					html.push('<td style="width: 15%;">'+obj.opt_name+'</td>');
					if(i==recordLength&&"100303"!=obj.curr_node_id){
						html.push('<td style="width: 20%;"></td>');
					}else{
						html.push('<td style="width: 20%;">'+obj.opt_time+'</td>');
					}
					html.push('<td style="width: 20%;">'+obj.opt_desc+'</td>');
					html.push('</tr>');
				});
				flowDiv.html(html.join(''));
			}
		},
		//查看上传的图片
		searchUploadFile : function(type){
			var param={
					"handleType" : "queryFileInfo",
					"taskCode" : temp.taskCode,
					"fileType" : type,
			};
			$.jump.ajax(URL_SEND_TASK_BOOK.encodeUrl(),function(json){
				//layer.alert("发起审批成功！",9);
				if(json.code=="0"){
					var fileList=json.fileList;
					if(fileList.length>0){
						//附件
						var html=[];
						$.each(fileList,function(i,obj){
							var pointIndex = obj.attachment_name.lastIndexOf(".");
							var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
							var file_name="";
							if(obj.attachment_name.length >13) {
								file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
							}else {
								file_name = obj.attachment_name;
							}
							html.push('<div id="file'+i+'" class="lable-title fl" style="width:220px;"><a href="javascript:void(0)" name="attachment" file_name="'+obj.attachment_name+
									'" file_path="'+obj.attachment_path+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="'+obj.attachment_name+'">'+file_name+'</a>');
							html.push('</div>');
						});
						var fileInfoObj="";
						if("task1"==type){
							fileInfoObj=$('#fileInfoDiv');
						}else if("task2"==type){
							fileInfoObj=$('#signedInfoDiv');
						}
						fileInfoObj.html(html.join(''));
						//附件下载
						fileInfoObj.find('a[name=attachment]').unbind("click").bind("click",function(){
							var param={
									"fileName"     :	$(this).attr("file_name"),
									"downloadName" :    $(this).attr("file_name"),
									"filePath"	   :	$(this).attr("file_path")
							};	
							window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
						});
					}
				}else{
					layer.alert(json.msg,  8);
				}
			},param,true,false);
			
		   
		},
};