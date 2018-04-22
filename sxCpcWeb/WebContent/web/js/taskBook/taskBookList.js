var TaskBookList=new Function();

TaskBookList.prototype={
		selector : "#taskBookListPage",
		staffTreeInfo : null,
		parentThis : null,
		fileList :[],
		init :function(){
			parentThis=this;
			this.bindMethod();
		},
		bindMethod:function(){
			var nowTime=new Date();
			var currYear=nowTime.getFullYear();
			var param = {
 					"dicType" 	: 		"taskYear"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						$('#yearDate').html("");
						$.each(json.dicSet,function(i,obj){
							if(currYear==obj.dic_value){
								html.push('<option dicId = '+obj.dic_code+' selected=selected>'+obj.dic_value+'</option>');
							}else{
							    html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
							}
						});
						$('#yearDate').html(html.join(''));
					}
				};
			}, param, false,false);
			//责任书类型
			var bookTypeObj=parentThis.selector.findById("select","bookType")[0];
			var param = {
 					"dicType" 	: 		"taskBookType"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						bookTypeObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						bookTypeObj.html(html.join(''));
					}
				};
			}, param, false,false);
			//责任书状态
			var bookStateObj=parentThis.selector.findById("select","bookState")[0];
			var param = {
 					"dicType" 	: 		"taskBookState"				,
 				};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
						bookStateObj.html("");
						html.push('<option dicId ="">全部</option>');
						$.each(json.dicSet,function(i,obj){
							html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
						});
						bookStateObj.html(html.join(''));
					}
				};
			}, param, false,false);
			//加载组织机构树
			 var setting = {
		                data : {
		                	key: {
		        				name: "NAME"
		        			},
		                    simpleData : {
		                        enable : true, //启用简单数据格式,其他参数可参照api自行设定（其实这样就行了）
		        				idKey: "ID",
		        				pIdKey: "PID",
		        				rootPId: "0"
		                    }
		                },
		                check: {
		    				enable: true,
		    			},
		    			callback: {
	        				onClick: this.zTreeOnClick//无复选框树结构点击按钮事件
							},
		        };
			 
			$.jump.ajax(URL_QUERY_GRID_TREE.encodeUrl(),function(json){
				if(json.code=="0"){
					 
					parentThis.staffTreeInfo=json.staffInfo;
					var level=json.staffInfo.TREE_LEVEL;
					var nodes = json.list;
					if("2"==level){
						for (var i in nodes){
							if(nodes[i]['LEVEL']==4){//表示最底层
								nodes[i]['isParent'] = false;//没有子节点
								nodes[i]['open'] = false;//是否要展开
							}else if(nodes[i]['LEVEL']==3){
								nodes[i]['isParent'] = true;
								nodes[i]['open'] = false;
							}else if(nodes[i]['LEVEL']==2){
								nodes[i]['isParent'] = true;
								nodes[i]['open'] = true;
							}
						}
					}else if("3"==level){
						for (var i in nodes){
							if(nodes[i]['LEVEL']==4){//
								nodes[i]['isParent'] = false;
								nodes[i]['open'] = false;
							}else if(nodes[i]['LEVEL']==3){
								nodes[i]['isParent'] = true;
								nodes[i]['open'] = true;
							}
						}
					}
					setting.check.enable = false;//去掉树里的复选框
					delete setting.callback.onCheck;
					setting.callback.onClick=parentThis.zTreeOnClick;
					
					$.fn.zTree.init($("#treeDemo"), setting, nodes);
				}
			},null,false,false);
			 var staffInfo=parentThis.staffTreeInfo;//登录者的树信息
			 
			var param={
					"handleType" : "queryList",
					"staffTreeInfo" : JSON.stringify(staffInfo),
					"year" : $('#yearDate').find('option:selected').attr('dicId'),
			};
			parentThis.queryTaskList(param);
			//检索责任书
			$('#search').unbind('click').bind('click',function(){
				
				$('#obu').val('');
				var year=$('#yearDate').find('option:selected').attr('dicId');
				var bookType=$('#bookType').find('option:selected').attr('dicId');
				var bookState=$('#bookState').find('option:selected').attr('dicId');
				var OBUName=$('#OBUName').val();
				var contractorName=$('#contractorName').val();
				var param={
						"handleType" : "queryList",
						"staffTreeInfo" : JSON.stringify(staffInfo),
						"year" : year,
						"bookType" : bookType,
						"bookState" : bookState,
						"OBUName" :OBUName,
						"contractorName" : contractorName,
				};
				parentThis.queryTaskList(param);
			});
		},
		//点击组织树的触发事件
		zTreeOnClick : function(){
			var zTree = $.fn.zTree.getZTreeObj("treeDemo");
			var	treeNode = zTree.getSelectedNodes();
			//alert(JSON.stringify(treeNode));
			//取得当前所点节点的参数
			var level = treeNode[0].LEVEL;
			var tree_id = treeNode[0].ID;
			var latn_id = treeNode[0].LATN_ID;
			var tree_name = treeNode[0].NAME;
			$('#obu').val(tree_name);
			var param={
					"handleType" : "queryListByTree",
					"level" : level,
					"tree_id" : tree_id,
					"latn_id" : latn_id,
			};
			parentThis.queryTaskList(param);
		},
		//查询列表
		queryTaskList : function(param){
			var bodyObj=$('#taskListBody');
			var footObj=$('#taskListFoot');
			bodyObj.html('');
			footObj.html('');
			common.pageControl.start(URL_QUERY_TASKBOOK_LIST.encodeUrl(),
					 0,
					 10,
					 param,
					 "data",
					 null,
					 footObj,
					 "",
					 function(data,dataSetName,showDataSpan){
                         parentThis.createLstHtml(data,bodyObj,footObj);
             });
		},
		createLstHtml : function(data,bodyObj,footObj){
			
			var html=[];
			var staffId=data.staffId;
			var dataLst = data.data;
			if(dataLst.length > 0 ){
				footObj.show();
				$.each(dataLst,function(i,obj){
					html.push('<tr >');
					html.push('<td taskCode="'+obj.task_code+'">'+obj.task_code+'</td>');
					html.push('<td taskCode="'+obj.task_code+'">'+obj.obu_name+'</td>');
					html.push('<td taskCode="'+obj.task_code+'">'+obj.promoters_name+'</td>');
					html.push('<td taskCode="'+obj.task_code+'">'+obj.mob_tel+'</td>');
					html.push('<td taskCode="'+obj.task_code+'">'+obj.task_type_name+'</td>');
					if(obj.curr_node_id==""||obj.curr_node_id==null||obj.curr_node_id==undefined){
						html.push('<td taskCode="'+obj.task_code+'"></td>');
					}else{
						html.push('<td taskCode="'+obj.task_code+'">'+obj.curr_node_name+'</td>');
					}
					html.push('<td><a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="senior" taskCode="'+obj.task_code+'" task_type="'+obj.task_type+'" promoters_id="'+obj.promoters_id+'">查看</a>');
					if(staffId==obj.promoters_id){
						if("100302"==obj.curr_node_id||obj.curr_node_id==""||obj.curr_node_id==null||obj.curr_node_id==undefined){
							//待修改和待填报
							html.push('<a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="report" taskCode="'+obj.task_code+'" task_type="'+obj.task_type+'" promoters_id="'+obj.promoters_id+'">填报</a>');
							html.push('<a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="send" taskCode="'+obj.task_code+'" currNodeId="'+obj.curr_node_id+'">发起审批</a>');
						}else if("100303"==obj.curr_node_id){//已发布
							html.push('<a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="download" taskCode="'+obj.task_code+'" task_type="'+obj.task_type+'" promoters_id="'+obj.promoters_id+'">下载</a>');
							html.push('<a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="upload" taskCode="'+obj.task_code+'">上传</a>');
						}
					}
					html.push('</td></tr>');
				});
			}else{
					footObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
			}
			bodyObj.html(html.join(''));
			//点击查询
			bodyObj.find("a[name=senior]").unbind("click").bind("click",function(){
				var taskCode=$(this).attr('taskCode');
				var task_type=$(this).attr('task_type');
				var promoters_id=$(this).attr('promoters_id');
				var param = {
						"taskType" 		: "taskBookQry",
						"taskCode" 		: taskCode ,
						"modelType"		: task_type,
						"promoters_id"	: promoters_id,
				};
				//去后台查询数据，并且生成taskBookQry.html文件
				$.jump.ajax(URL_CREATE_NORM_BOOK.encodeUrl(), function(data) {
					if(data.code=="0"){
						var dataMap = data.dataMap;
						 $.jump.loadHtmlForFun(("/web/html/taskBook/taskBookQry_"+taskCode+".html").encodeUrl(), function(pageHtml){
								$('#content').html(pageHtml);
								var taskBookQry=new TaskBookQry();
								taskBookQry.init(taskCode,dataMap,'1');
						 });
					}else{
						layer.alert("生成责任规范书异常",8);
					}
				}, param, false,false);
			});
			//填报
			bodyObj.find("a[name=report]").unbind("click").bind("click",function(){
				var taskCode=$(this).attr('taskCode');
				var task_type=$(this).attr('task_type');
				var promoters_id=$(this).attr('promoters_id');
				var param = {
						"taskType" 		: "reportTaskBook",
						"taskCode" 		: taskCode ,
						"modelType"		: task_type,
						"promoters_id"	: promoters_id,
				};
				$.jump.ajax(URL_CREATE_NORM_BOOK.encodeUrl(), function(data) {
					if(data.code=="0"){
						$.jump.loadHtmlForFun(("/web/html/taskBook/reportTaskBook_"+taskCode+".html").encodeUrl(), function(pageHtml){
							$('#content').html(pageHtml);
							var reportTaskBook=new ReportTaskBook();
							reportTaskBook.init(promoters_id, task_type);
						 });
					}else{
						layer.alert("生成责任规范书异常",8);
					}
				}, param, false,false);
			});
			//发起审批
			bodyObj.find("a[name=send]").unbind("click").bind("click",function(){
				 
				var taskCode=$(this).attr('taskCode');
                var currNodeId=$(this).attr('currNodeId');
	        	var msg = "您是否确认将责任书编号为"+taskCode+"的责任书发起审批？";
 				$.layer({
				    shade: [0],
				    area: ['auto','auto'],
				    dialog: {
				        msg: msg,
				        btns: 2,                    
				        type: 4,
				        btn: ['确定','取消'],
				        yes: function(){
				        	parentThis.sendTaskBook(taskCode,currNodeId);
				        },
				    },
				});
	        
			});
			//下载责任书
			bodyObj.find('a[name=download]').unbind('click').bind('click',function(){
				//生成word
				var task_type=$(this).attr('task_type');
				var promoters_id=$(this).attr('promoters_id');
				var taskCode=$(this).attr('taskCode');
				var param = {
						"taskType"	:	"exportWord" ,
						"taskCode" 		: taskCode ,
						"modelType"		: task_type,
						"promoters_id"	: promoters_id,
				};
				//去后台查询数据，并且生成exportWord.doc文档
				$.jump.ajax(URL_CREATE_NORM_WORD.encodeUrl(), function(data) {
					if(data.code=="0"){
						
						//附件下载
						var param={
								"fileName"     :	data.file_name,
								"downloadName" :    data.file_name,
								"filePath"	   :	data.file_path
						};	
						window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
					}else{
						layer.alert("下载责任书失败！",8);
					}
				}, param, false,false);
			});
			//上传附件
			bodyObj.find('a[name=upload]').unbind('click').bind('click',function(){
				var taskCode=$(this).attr('taskCode');
				var file_path="";
				var param={
						"handleType" : "getFilePath",
						"taskCode"   :  taskCode
				};
				$.jump.ajax(URL_SEND_TASK_BOOK.encodeUrl(),function(json){
					if(json.code=="0"){
						file_path=json.file_path;
					}else{
						layer.alert(json.msg,8);
					}
				},param,true,false);
				var html=[];
				html.push('<div class="tanchu_box" id="uploadFile"  style="width:600px;">');
				html.push('<h3 id="title">文件上传</h3>');
				html.push('<div >');
				html.push('<table width="100%" padding="0" cellspacing="0" cellpadding="0" class="tab5 mt10 lines">');
				html.push('<tr><td align="right" style="width:20%;">责任书填写照片</td>');
				html.push('<td style="width:80%;">');
				html.push('<form id="attachForm1" enctype="multipart/form-data" method="post">');
				html.push('<input type="file" style="width:70%;" name="attachment" id="attachment1">');
				html.push('<input type="button" class="but" id="upload1" style="width:20%;height:30px;" value="上传">');
				html.push('</form></td></tr>');
				html.push('<tr><td align="right" style="width:20%;">填写照片附件</td>');
				html.push('<td style="float:left;width:95%;border-right:0px;" id="attachmentInfo1"></td></tr>');
				
				html.push('<tr><td align="right" style="width:20%;">责任书签订照片</td>');
				html.push('<td style="width:80%;">');
				html.push('<form id="attachForm2" enctype="multipart/form-data" method="post">');
				html.push('<input type="file" style="width:70%;" name="attachment" id="attachment2">');
				html.push('<input type="button" class="but" id="upload2" style="width:20%;height:30px;" value="上传">');
				html.push('</form></td></tr>');
				html.push('<tr><td align="right" style="width:20%;">签订照片附件</td>');
				html.push('<td style="float:left;width:95%;border-right:0px;" id="attachmentInfo2"></td></tr>');
				html.push('<tr><td colspan="2" style="text-align:center;"><input type="button" class="but" id="submit" style="width:10%;height:30px;" value="提交"></td></tr>');
				html.push('</table>');
				html.push('</div>');
				html.push('</div>');
				var nromTypeInfoPage = $.layer({
					type : 1,
					title : false,
					area : [ 'auto', 'auto' ],
					border : [ 0 ], //去掉默认边框
//					shade: [0], //去掉遮罩
//					closeBtn: [0, false], //去掉默认关闭按钮
					shift : 'left', //从左动画弹出
					page : {
						html : html.join('')
					}
				});
				//附件上传与下载
				$("#upload1").unbind("click").bind("click",function(){
					var type=1;
					parentThis.uploadFile(taskCode,file_path,type);
				});	
				$("#upload2").unbind("click").bind("click",function(){
					var type=2;
					parentThis.uploadFile(taskCode,file_path,type);
				});	
				//点击提交，保存上传的文件
				$('#submit').unbind('click').bind('click',function(){
					var param={
							"handleType" : "saveFile",
							"taskCode" : taskCode,
							"fileList"   :   JSON.stringify(parentThis.fileList),
					};
					$.jump.ajax(URL_SEND_TASK_BOOK.encodeUrl(),function(json){
						//layer.alert("发起审批成功！",9);
						if(json.code=="0"){
							layer.alert("文件上传成功！",9);
							layer.close(nromTypeInfoPage);
						}else{
							layer.alert("文件上传失败！",  8);
						}
					},param,true,false);
				});
			});
		},
		sendTaskBook : function(taskCode,currNodeId){
			if(currNodeId==''||currNodeId==null||currNodeId==undefined){//首次发起审批
				var param1={
						"handleType" : "submitTask",
						"taskCode"   :  taskCode
				};
				$.jump.ajax(URL_SEND_TASK_BOOK.encodeUrl(),function(json){
					//layer.alert("发起审批成功！",9);
					if(json.code=="0"){
						layer.alert('发起审批成功！',9);
							//location.reload() ;
						$.jump.loadHtmlForFun("/web/html/taskBook/taskBookList.html".encodeUrl(), function(pageHtml){
							$('#content').html(pageHtml);
							var bookList=new TaskBookList();
							bookList.init();
						});
						
					}else{
						layer.alert(json.msg,8);
					}
				},param1,true,false);
			}else{
				//再次发起审批，先查询流程记录
				var param2={
						"taskCode" : taskCode,
				};
				
				$.jump.ajax(SEARCH_TASK_BOOK_INFO.encodeUrl(),function(json){
					
					if(json.code=="0"){//查询成功
						var taskInfo=json.taskInfo;
						var recordSet=json.recordSet;
						var currLength=recordSet.length-1;
						var param3={
								"busi_id" :  taskCode,
								"optRet"  :  "againSend",
								"optDesc" : "",
								//"promoters_id" : promoters_id,
								//"promoters_name" : promoters_name,
								"record_id" : recordSet[currLength].record_id,
								"opt_time" : recordSet[currLength].opt_time
						};
						$.jump.ajax(URL_TASK_FLOW_RECORD.encodeUrl(),function(json){
							//layer.alert("发起审批成功！",9);
							if(json.code=="0"){
								layer.alert('再次发起审批成功！', 9);
								$.jump.loadHtmlForFun("/web/html/taskBook/taskBookList.html".encodeUrl(), function(pageHtml){
									$('#content').html(pageHtml);
									var bookList=new TaskBookList();
									bookList.init();
								});
								
							}else{
								layer.alert(json.msg, 8);
							}
						},param3,true,false);
					}
				},param2,true,false);
			}
			
			
		},
		uploadFile : function(taskCode,file_path,type){
			
			var html=[];
			var fileName=$("#attachment"+type).val();
			if ( fileName==""||fileName==null||fileName==undefined) { 
				layer.alert("请选择一个文件，再点击上传。",8); 
				return; 
				} 
			var index= fileName.lastIndexOf("\\");
			var file_name = fileName.substring(index+1);
			
			var param1={"demand_id" : taskCode};
			var option = { 
            		url:URL_UPLOAD_FILE.encodeUrl()+"?"+$.param(param1), 
            		type:"post",
        			success: function () { 
						var file = $("#attachment"+type);
	   					file.after(file.clone()); //复制元素
	   					file.remove();//移除已存在
	   					var i=0;
						var obj={
								"attachment_name" :  file_name,
								"attachment_path" : file_path,
								"attachment_value" : taskCode,
								"attachment_type"  : "task"+type
						};
						//alert(JSON.stringify(obj));
						i=parentThis.fileList.length;
						parentThis.fileList.push(obj);
						var attachment_name = obj.attachment_name.split('.')[0];
							var filetype = obj.attachment_name.split('.')[1];
							if(attachment_name.length >10) {
								attachment_name = attachment_name.substr(0,10)+ "..." + filetype;
							}else {
								attachment_name = obj.attachment_name;
							}
							html.push('<div  id="divObj'+i+'" class="lable-title fl" style="width:30%"><a href="javascript:void(0)" name="attachment" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" style="color: #4782DD; text-decoration: underline;padding:0px 0px" title="'+obj.attachment_name+'">'+attachment_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmenta" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'"style="color: red;padding:0px 0px">×</a></div>');
							
	 					$("#attachmentInfo"+type).append(html.join(""));
	     				
	    				//下载
	    				$("#attachmentInfo"+type).find("a[name=attachment]").unbind("click").bind("click",function(){
	    					
	    					var param={
	    							"fileName":	$(this).attr("attachment_name"),
	    							"downloadName":$(this).attr("attachment_name"),
	    							"filePath":	$(this).attr("attachment_path")
	    					};
	    					window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
	    				});
	    				//删除
	    				$("#attachmentInfo"+type).find("a[name=attachmenta]").unbind("click").bind("click",function(){
	    					//获取删除按钮的ID
	    					var id=$(this).attr("id");
	    					var fileName=$(this).attr("attachment_name");
	    					
	    					//找到当前删除按钮所在的DIV层
	    					var divobj=$("#attachmentInfo"+type).find('div[id=divObj'+id+']');
	    					divobj.remove();
	    					for(var j=0;j<parentThis.fileList.length;j++){
	    						if(parentThis.fileList[j].attachment_name==fileName){
	    							parentThis.fileList.remove(j);
	    						}
	    					}
	         			});
			
    				}
            	};
			$('#attachForm'+type).ajaxSubmit(option); 
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
};