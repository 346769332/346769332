var ReportTaskBook=new Function();
ReportTaskBook.prototype={
		temp : null,
		promoters_id : null,
		task_type : null,
		init : function(promoters_id, task_type){
			temp=this;
			temp.promoters_id=promoters_id;
			temp.task_type=task_type;
			temp.bindMethod(this);
		},
		bindMethod : function(parentThis){
			parentThis.dateBind($("#column67"),0);
			$("#clearSendDate").unbind("click").bind("click",function(){
				$("#column67").val("");
			});
			
			parentThis.dateBind($("#column68"),3);
			$("#clearEndDate").unbind("click").bind("click",function(){
				$("#column68").val("");
			});
			
			//保存填报的信息
			$('#save').unbind('click').bind('click',function(){
				//定义一个集合
				var colNames = document.getElementsByName("column_name");
				var colIds = ""; //获取input框的所有id
				var colValues = ""; //获取input框所对应的内容
				for(var i=0; i<colNames.length; i++){
					if(colIds == ""){
						colIds = colNames[i].id;
					}else{
						colIds = colIds + "," + colNames[i].id;
					}
					if(colValues == ""){
						colValues = colNames[i].value;
					}else{
						colValues = colValues + "," + colNames[i].value;
					}
				}
				var colParam={
						"handleType"	:   "saveNormBookInfo",
						"colIds"		:	colIds,
						"colValues"		:	colValues,
						"modelType"		:	temp.task_type,
						"promoters_id"	:	temp.promoters_id,
				};
				$.jump.ajax(URL_EDIT_NORMBOOK_INFO.encodeUrl(), function(data) {
					if(data.code=="0"){
						layer.alert("编辑规格书信息成功",9);
					}else{
						layer.alert("编辑规格书信息失败！",8);
					}
				}, colParam,true);
			});
			//返回
			$('#goback').unbind('click').bind('click',function(){
				$.jump.loadHtmlForFun("/web/html/taskBook/taskBookList.html".encodeUrl(), function(pageHtml){
					$('#content').html(pageHtml);
					var queryBook=new TaskBookList();
					queryBook.init();
				});
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
};