var SolveProcessDetail = new Function();
SolveProcessDetail.prototype = {
	selecter : "#solveProcessInfo",
	pageSize : 10,
	// 初始化执行
	init : function(param) {
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
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
						html.push('<input id='+obj.ATTR_ONAME+' tempId='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' name="radios" style="width: 2%;"disabled="disabled">'+obj.ATTR_NAME+'');
						parentThis.templateType = obj.ATTR_TYPE;
						if(i==(dataList.length-1)){
							html.push('</td></tr>');
						}
					}else{
						html.push('<tr>');
						html.push('<td>'+obj.ATTR_NAME+'</td>');
						html.push('<td colspan="3">');
						html.push('<input id='+obj.ATTR_ONAME+' type='+obj.ATTR_TYPE+' style="width: 95%;"disabled="disabled"></td>');
						html.push('</tr>');
					}
					
					
					//if(obj.ATTR_TYPE=='text' && obj.ATTR_NAME=='金额'){
					//}
				});
				$("#templateInfos tr:eq(5)").before(html.join(''));
			}
		}, params, false,false);
		// 取消返回
		$('#back').unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/hasSolveProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var hasSolveProcessList=new HasSolveProcessList();
				hasSolveProcessList.init();
			});
		});
		
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);		
			$('#evaluateInfo').val(demandInfo.evaluateInfo);
			$('#zhiChengTime').val(demandInfo.expect_time);	
			$('#releasePersonName').val(demandInfo.demand_sumit_pname);				
			//$('#releaseDeptName').val(demandInfo.department);
			var demand_status="";
			if(demandInfo.demand_status=='1000'){
				demand_status= "审批中";
			}else if (demandInfo.demand_status=='1001'){
				demand_status= "审批完结";
			}else if (demandInfo.demand_status=='1002'){
				demand_status= "草稿";
			}
			$('#demand_status').val(demand_status);	
				
		}
		//评价
		var params={								
				"handleType":"qryLst",
				"dataSource":"",
				"nameSpace" :"shortProcess",
				"sqlName"   :"qryStartNodeIdInfo",
				"demandId"  :demandInfo.demand_id
		};
		if(demandInfo.is_EvalInfo=='0'){
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			debugger;
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){
			 			debugger;
			 			
				 			if(obj.OPERATOR_ID == json.staffId&&demandInfo.demand_status=='1001'){
				 				$("#evalSubmit").show();
				 				$('#evalSubmit').unbind("click").bind("click",function(){
					 				//加载评价五颗星
					 				parentThis.loadEvalStar(parentThis);	
				 				});
				 			}else{
				 				$("#evalSubmit").hide();
			 			}
			 		});
				}
			}, params, false,false);
		}else{
			$("#evalSubmit").hide();
			$("#evalTr").show();//已经评价显示评价信息
			var evalhtml="";
			for (var int = 0; int < 5; int++) {
				evalhtml+='<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>';
			}
			$("#evalNum").html(evalhtml);
			//查询评价信息表
			var param={								
					"handleType":"qryLst",
					"dataSource":"",
					"nameSpace" :"shortProcess",
					"sqlName"   :"qryshortProcessEvalInfo",
					"demandId"  :demandInfo.demand_id,
					"workflowId" :demandInfo.workflowId,
			};			
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code=="0"&&json.data.length>0){
					debugger;
					var evalInfo=json.data[0];
					$("#evalDesc").val(evalInfo.EVALUATE_INFO);
					var star=evalInfo.STAR_EVALUATE;
					var thisAObj=$('#evalNum').find('a[name=evalStar][index='+star+']');
					thisAObj.parent().children("a[name=evalStar]").removeClass();
					thisAObj.prevAll().addClass("evalStarYellow");
					thisAObj.addClass("evalStarYellow");
					thisAObj.nextAll().addClass("evalStarGrey");
				}
			},param, false,false);
		}
		var html=[];
		for (var int = 0; int < 5; int++) {
			html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
		}
		$("#starEvaluate").html(html.join(''));
		var num=demandInfo.starEvaluate;
		for(var j=1;j<=num;j++){
			var starobj=$("#starEvaluate").find('a[name=evalStar][index='+j+']');
			starobj.removeClass();
			starobj.addClass("evalStarYellow");
		}
		var params={								
				"handleType":"qryLst",
				"dataSource":"",
				"nameSpace" :"shortProcess",
				"sqlName"   :"queryshortp_sum",
				"demandId"  :demandInfo.demand_id,
				"workflowId" :demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {			
			var html=[];	
			//var demand_status =  demandInfo.demand_status
			var operation_info='';//节点
				if(json.code == "0" ){
			
			 		$.each(json.data,function(i,obj){	
			 			var length=json.data.length;
			 			var flag=length-i;
			 			debugger;
			 			html.push('<tr>');
			 			if(obj.OPERATION=='同意'){
			 				operation='通过';
			 			}
			 			else if(obj.OPERATION=='打回根节点') {
			 				operation='打回发起节点';
			 			}else if(obj.OPERATION=='打回上一步') {
			 				operation='打回上一节点';
			 			}else if(obj.OPERATION=='作废') {
			 				operation='作废';
			 			}else {
			 				operation="";
			 			}
			 			var operation_Info="";
			 			if(obj.OPERATION_INFO!=""){
			 				operation_Info = obj.OPERATION_INFO
			 			}
			 			if(json.data.length==1||(json.data.length!=1&&1==flag)){
			 					if(operation_info==""&&obj.NOTE_NAME=="开始"){
			 						html.push('<td >'+(i+1)+'</td>');
			 						html.push('<td >'+obj.NODE_NAME+'</td>');
			 						if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""){
				 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
				 						html.push('<td >'+obj.ERA_OPERATOR_NAME+'&nbsp;代&nbsp;['+obj.OPERATOR_NAME+']</td>');
			 						}else{
				 						html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'</td>');
			 						}
			 						html.push('<td >'+obj.APPCREATE_TIME+'</td>');
			 						
			 						if(obj.TASK_STATUS==1){
			 							html.push('<td ></td>');
				 						html.push('<td ></td>');
				 						html.push('<td ></td>');
				 						html.push('<td >待处理</td>');
			 							//html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						//html.push('<td >'+obj.OPERATOR_NAMES+'</td>');
			 						}else{
			 							html.push('<td >发起</td>');
				 						html.push('<td >通过</td>');
				 						html.push('<td >未超时</td>');
				 						html.push('<td >已处理</td>');
			 							$("#conductorInfo").hide();
			 							$("#conductorInfos").hide();
			 						}
			 						
			 						html.push('</tr>');
			 					}else{
			 						html.push('<td >'+(i+1)+'</td>');
			 						html.push('<td >'+obj.NODE_NAME+'</td>');
			 						if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""&&obj.ERA_OPERATOR_ID!=obj.OPERATOR_ID){
				 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
				 						html.push('<td >'+obj.ERA_OPERATOR_NAME+'&nbsp;代&nbsp;['+obj.OPERATOR_NAME+']</td>');
			 						}else{
				 						html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'</td>');
			 						}
			 						html.push('<td >'+obj.APPCREATE_TIME+'</td>');
			 						html.push('<td >'+operation+'</td>');
			 						html.push('<td >'+operation_Info+'</td>');
			 						if(obj.OPERATION=='作废'){
			 							html.push('<td >未超时</td>');	
			 						}else{
			 						html.push('<td >'+obj.TLOVER_TIME+'</td>');
			 						}
			 						if(obj.TASK_STATUS==1){
			 							html.push('<td >待处理</td>');
			 							//html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						//html.push('<td >'+obj.OPERATOR_NAMES+'</td>');
			 						}else{
			 							html.push('<td >已处理</td>');
			 							$("#conductorInfo").hide();
			 							$("#conductorInfos").hide();
			 						}
			 						html.push('</tr>');
			 					}
			 				}else {
			 					if(obj.OPERATION_INFO!=""&&obj.NOTE_NAME!="开始"&&obj.TASK_STATUS!=1){
			 						html.push('<td >'+(i+1)+'</td>');
			 						html.push('<td >'+obj.NODE_NAME+'</td>');
			 						if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""&&obj.ERA_OPERATOR_ID!=obj.OPERATOR_ID){
				 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'&nbsp;代&nbsp;['+obj.ERA_OPERATOR_NAME+']</td>');
			 						}else{
				 						html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'</td>');
			 						}
			 						html.push('<td >'+obj.APPCREATE_TIME+'</td>');
			 						html.push('<td >'+operation+'</td>');
			 						html.push('<td >'+operation_Info+'</td>');
			 						if(obj.OPERATION=='作废'){
			 							html.push('<td >未超时</td>');	
			 						}else{
			 						html.push('<td >'+obj.TLOVER_TIME+'</td>');
			 						}
			 						if(obj.TASK_STATUS==1){
			 							html.push('<td >待处理</td>');
			 							//html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						//html.push('<td >'+obj.OPERATOR_NAMES+'</td>');
			 						}else{
			 							html.push('<td >已处理</td>');
			 							$("#conductorInfo").hide();
			 							$("#conductorInfos").hide();
			 						}
			 					}else if(obj.NOTE_NAME!="开始"&&obj.TASK_STATUS!=1){
			 						html.push('<td >'+(i+1)+'</td>');
			 						html.push('<td >'+obj.NODE_NAME+'</td>');
			 						if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""&&obj.ERA_OPERATOR_ID!=obj.OPERATOR_ID){
				 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'&nbsp;代&nbsp;['+obj.ERA_OPERATOR_NAME+']</td>');
			 						}else{
				 						html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'</td>');
			 						}
			 						html.push('<td >'+obj.APPCREATE_TIME+'</td>');
			 						html.push('<td >'+operation+'</td>');
			 						html.push('<td >'+operation_Info+'</td>');
			 						if(obj.OPERATION=='作废'){
			 							html.push('<td >未超时</td>');	
			 						}else{
			 						html.push('<td >'+obj.TLOVER_TIME+'</td>');
			 						}
			 						if(obj.TASK_STATUS==1){
			 							html.push('<td >待处理</td>');
			 							//html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						//html.push('<td >'+obj.OPERATOR_NAMES+'</td>');
			 						}else{
			 							html.push('<td >已处理</td>');
			 							$("#conductorInfo").hide();
			 							$("#conductorInfos").hide();
			 						}
			 					}else if(obj.TASK_STATUS!=1){
			 						html.push('<td >'+(i+1)+'</td>');
			 						html.push('<td >'+obj.NODE_NAME+'</td>');
			 						if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""&&obj.ERA_OPERATOR_ID!=obj.OPERATOR_ID){
				 						html.push('<td >'+obj.ERA_OPERATOR_DEPT+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'&nbsp;代&nbsp;['+obj.ERA_OPERATOR_NAME+']</td>');
			 						}else{
				 						html.push('<td >'+obj.OPERATOR_DEPTS+'</td>');
				 						html.push('<td >'+obj.OPERATOR_NAME+'</td>');
			 						}
			 						html.push('<td >'+obj.APPCREATE_TIME+'</td>');
			 						html.push('<td >发起</td>');
				 					html.push('<td >通过</td>');
				 					html.push('<td >未超时</td>');
				 					html.push('<td >已处理</td>');
			 						$("#conductorInfo").hide();
			 						$("#conductorInfos").hide();
			 					}
		 						html.push('</tr>');
			 					
			 				}
			 		});
					$('#processRecord').append(html.join(''));
				}
			}, params, false,false);
			var param={
 					"demandId" :  demandInfo.demand_id,
 					"fileType" :  "shortProcess",
 			};
 			$.jump.ajax(URL_QRY_ATTACH_INFO.encodeUrl(),function(json){
 				debugger;
				if(json.code=="0"){
					var fileList=json.fileList;
					var html=[];
					var fileInfoObj=$('#attachment');
					if(fileList.length>0){
						//附件
						$.each(fileList,function(i,obj){
							debugger;
								var pointIndex = obj.attachment_name.lastIndexOf(".");
								var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
								var file_name="";
								if(obj.attachment_name.length >13) {
									file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
								}else {
									file_name = obj.attachment_name;
								}
								var other_file_name=obj.OTHER_ATTACHMENT_NAME;
								html.push('<div  class="lable-title fl" style="width:15%;"><a href="javascript:void(0)" id="file'+i+'" name="attachmentInfo" file_name="'+obj.attachment_name+
										'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="'+obj.attachment_name+'">'+file_name+'</a>');
								html.push('</div>');
						});
					}else{
						html.push('<div >该流程单没有附件</div>');
					}
					fileInfoObj.html(html.join(''));
					
					//附件下载 solveProcessInfo
					$('#solveProcessInfo').find('a[name=attachmentInfo]').unbind("click").bind("click",function(){
						debugger;
						var downloadName="";
						if($(this).attr("other_file_name")!=null&&$(this).attr("other_file_name")!=""&&$(this).attr("other_file_name")!="undefined"){
							downloadName=$(this).attr("other_file_name");
						}else{
							downloadName=$(this).attr("file_name");
						}
						var fileNames = $(this).attr("file_name");
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
					});
				}else{
					layer.alert(json.msg,  8);
				}
			},param,true,false);
		//parentThis.bindUpAndDown(parentThis);
	},
	//绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		//下载文件
		//$('a[name="attachment"]').unbind("click").bind("click",function(){
		$("#solveProcessInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
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
	//评价星级的加载
	loadEvalStar : function(parentThis){
		debugger;
			var html=[];
			html.push('<div class="tanchu_box" id="evalAnswerBox"  style="width:600px;">');
			html.push('<h3 id="title">流程评价</h3>');
			html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table2">');
			html.push('<tr>');              
			html.push('<td style="text-align: right;">评价星级</td>');         
			html.push('<td id="evalNum">');
			for (var int = 0; int < 5; int++) {
				html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarYellow" href="javascript:void(0)"/>');
			}
			html.push('</td>');
			html.push('</tr><tr>');         
			html.push('<td style="text-align: right;">评价说明</td>');         
			html.push('<td><textarea name="splitDesc" id="opt_desc" placeholder="评价说明只能输入150字"  maxlength="200" type="text" style="width: 470px;height:120px;"></textarea></td>');               
			html.push('</tr><tr>');         
			html.push('<td colspan="2" style="text-align:center;">'); 
			html.push('<a href="javascript:void(0)"  class="but" name="saveEval">保存</a>');
			html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a>');         
			html.push('</td>');         
			html.push('</tr>'); 
			html.push('</table>');         
			html.push('</div>');
		
			var nromTypeInfoPage = $.layer({
				type : 1,
				title : false,
				area : [ 'auto', 'auto' ],
				border : [ 0 ], //去掉默认边框
				//shade: [0], //去掉遮罩
				//closeBtn: [0, false], //去掉默认关闭按钮
				shift : 'left', //从左动画弹出
				page : {
					html : html.join('')
				}
			});
			var boxObj=$('#evalAnswerBox');
			//关闭
			boxObj.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(nromTypeInfoPage);
			});
			$('#evalNum').attr("index",5);
			//星级加载
			boxObj.find("a[name=evalStar]").unbind("click").bind("click",function(){
				var thisAObj=$(this);
				thisAObj.parent().children("a[name=evalStar]").removeClass();
				thisAObj.prevAll().addClass("evalStarYellow");
				thisAObj.addClass("evalStarYellow");
				$('#evalNum').attr("index",thisAObj.attr("index"));
				thisAObj.nextAll().addClass("evalStarGrey");
			});
			//提交
			var evalDesc="";
			boxObj.find("a[name=saveEval]").unbind("click").bind("click",function(){
				debugger;
				starNum=$('#evalNum').attr('index');
				if(starNum=="0" || typeof(starNum) == "undefined"){
					layer.alert('评价星级必须填写!',8);
					return false;
				}
				evalDesc=boxObj.find('#opt_desc').val();
				if(evalDesc==null||evalDesc==""||evalDesc==undefined){
					layer.alert('请填写评价说明!',8);
					return false;
				}
				if(evalDesc.length>150){
					layer.alert('评价说明只能输入150字!',8);
					return false;
				}
				 var param = {
						 "workflowId"          :  parentThis.demandInfo.workflowId,
						 "demandId"            :  parentThis.demandInfo.demand_id,
						 "evalDesc"            :  evalDesc,
						 "starNum"             :  starNum,
						 "demand_Code"         :  parentThis.demandInfo.demand_Code,
						 "hanleType"           :  "addEvalInfo",
				 };
				 $.jump.ajax(URL_QUERY_EVAL_INFO.encodeUrl(), function(json) {
						if(json.code == "0" ){
							layer.close(nromTypeInfoPage);
							layer.alert("评价成功",1);
							$.jump.loadHtmlForFun("/web/html/shortProcess/hasSolveProcessList.html".encodeUrl(),function(pageHtml){
												$("#content").html(pageHtml);
												var hasSolveProcessList=new HasSolveProcessList();
												hasSolveProcessList.init();
										});
							}else{
								layer.alert("发起失败!");	
							}
					}, param, false,false);
			});	
		},
};