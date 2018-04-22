var TaskBookApproval=new Function();

TaskBookApproval.prototype={
		selector : "#taskApprovalPage",
		parentThis : null,
		init :function(){
			parentThis=this;
			this.bindMethod();
		},
		bindMethod:function(){
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
			
			//初始化列表
			var param={
					"handleType" : "processing",
			};
			parentThis.queryTaskList(param);
			//检索责任书
			$('#search').unbind('click').bind('click',function(){
				
				var year=$('#yearDate').val();
				var bookType=$('#bookType').find('option:selected').attr('dicId');
				var param={
						"handleType" : "processing",
						"year" : year,
						"bookType" : bookType,
				};
				parentThis.queryTaskList(param);
			});
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
					html.push('<td taskCode="'+obj.task_code+'">'+obj.curr_node_name+'</td>');
					html.push('<td><a href="#" class="but" name="senior" taskCode="'+obj.task_code+'" task_type="'+obj.task_type+'" promoters_id="'+obj.promoters_id+'">审批</a>');
					html.push('</td></tr>');
				});
			}else{
					footObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('</div>');
			}
			bodyObj.html(html.join(''));
			//点击处理
			bodyObj.find("a[name=senior]").unbind("click").bind("click",function(){
				var taskCode=$(this).attr('taskCode');
				var task_type=$(this).attr('task_type');
				var promoters_id=$(this).attr('promoters_id');
				var param = {
						"taskType" 		: "taskBookDetail",
						"taskCode" 		: taskCode ,
						"modelType"		: task_type,
						"promoters_id"	: promoters_id,
				};
				//去后台查询数据，并且生成taskBookDetail.html文件
				$.jump.ajax(URL_CREATE_NORM_BOOK.encodeUrl(), function(data) {
					if(data.code=="0"){
						 window.open('html/taskBook/taskBookDetail_'+taskCode+'.html?taskCode='+taskCode);
					}else{
						layer.alert("生成责任规范书异常",8);
					}
				}, param, false,false);
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
			});
		},
};