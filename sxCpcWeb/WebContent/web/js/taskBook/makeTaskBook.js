var MakeTaskBook=new Function();
MakeTaskBook.prototype={
		selector : '#makeTaskBookPage',
		parentThis : null,
		init : function(){
			parentThis=this;
			parentThis.bindMethod();
		},
		bindMethod : function(){
			var nowTime=new Date();
			$('#yearDate').val(nowTime.getFullYear());
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
			
			//本地网五类责任书列表展示
			var param={
					"handleType" : "qryModelList",
			};
			parentThis.qryModelList(param);
			//检索列表
			$('#search').unbind('click').bind('click',function(){
				var taskType=$('#bookType').find('option:selected').attr('dicId');
				var taskState=$('#bookState').find('option:selected').attr('dicId');
				var param={
						"handleType" : "qryModelList",
						"year" : $('#yearDate').val(),
						"taskType" : taskType,
						"taskState" : taskState,
				};
				parentThis.qryModelList(param);
			});
			//点击查看
			$('#taskListBody').find('a[name=senior]').unbind('click').bind('click',function(){
				var modelId=$(this).attr('modelId');
				var param = {
						"taskType" : "taskBookQry",
						"modelId"  : modelId ,
				};
				//去后台查询数据，并且生成taskBookQry.html文件
				$.jump.ajax(URL_CREATE_NORM_BOOK.encodeUrl(), function(data) {
					if(data.code=="0"){
						var dataMap = data.dataMap;
						 $.jump.loadHtmlForFun(("/web/html/taskBook/taskBookQry_"+modelId+".html").encodeUrl(), function(pageHtml){
								$('#content').html(pageHtml);
								var taskBookQry=new TaskBookQry();
								taskBookQry.init(modelId,dataMap,'2');
						 });
					}else{
						layer.alert("生成责任规范书异常",8);
					}
				}, param, false,false);
			});
			//点击发布
			$('#taskListBody').find('a[name=release]').unbind('click').bind('click',function(){
				var modelId=$(this).attr('modelId');
				var taskTypeName=$(this).attr('taskTypeName');
                var currYear=$('#yearDate').val();
	        	var msg = "您是否确认对'"+currYear+"年','"+taskTypeName+"'类型的CEO责任书进行发布操作？";
 				$.layer({
				    shade: [0],
				    area: ['auto','auto'],
				    dialog: {
				        msg: msg,
				        btns: 2,                    
				        type: 4,
				        btn: ['确定','取消'],
				        yes: function(){
				        	var param={
									"handleType" : "releaseTask",
									"modelId" : modelId,
							};
							$.jump.ajax(URL_QRY_MODEL_LIST.encodeUrl(),function(json){
								if(json.code=="0"){
									layer.alert("发布成功！",9);
									$.jump.loadHtmlForFun("/web/html/taskBook/makeTaskBook.html".encodeUrl(),function(contentHtml){
										$('#content').html(contentHtml);
										var makeTaskBook=new MakeTaskBook();
										makeTaskBook.init();
									});
								}
							},param,true,false);
				        },
				    },
				});
			});	
				
		},
		//查询列表
		qryModelList : function(param){
			$.jump.ajax(URL_QRY_MODEL_LIST.encodeUrl(),function(json){
				var html=[];
				if("0"==json.code){
					var modelList=json.taskModelList;
					if(modelList!=""&&modelList!=null){
						$('#taskListBody').html('');
						$.each(modelList,function(i,obj){
							html.push('<tr style="border-bottom:1px solid #dedede">');
							html.push('<td><input type="radio" name="taskBook"></td>');
							html.push('<td >'+obj.task_type_name+'</td>');
							if(obj.state=="0"){
								html.push('<td state="0">待发布</td>');
								html.push('<td><a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="senior" modelId="'+obj.model_id+'" task_type="'+obj.task_type+'">查看</a>');
								html.push('<a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="release" modelId="'+obj.model_id+'" taskTypeName="'+obj.task_type_name+'">发布</a>');
								html.push('</td>');
							}else if(obj.state=="1"){
								html.push('<td state="1">已发布</td>');
								html.push('<td><a href="#" style="color:blue;text-decoration:underline;margin-right:10px;" name="senior" modelId="'+obj.model_id+'">查看</a>');
								html.push('</td>');
							}
							html.push('</tr>');
						});
						
					}else{
						html.push('<div>');
						html.push('<div>无相关数据</div>');
						html.push('<div>');
					}
					$('#taskListBody').html(html.join(''));
				}
			},param,true,false);
		},
};