var SingatureDemandSolve = new Function();
SingatureDemandSolve.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
	// 初始化执行
	init : function(param) {
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		// add by dangzw beign 2016-12-08
		// 加载模板属性
		var templateId=parentThis.demandInfo.templateId;
		var attrParam={
				"templateId"	:	templateId
		};
		$.jump.ajax(URL_QUERY_DEMANDTEMPLATE_ATTR.encodeUrl(), function(json) {
			if(json.code == "0" ){
				var dataList=json.data;
				$.each(dataList,function(i,obj){
					if(obj.ATTR_TYPE=='text' && obj.ATTR_NAME=='工单主题'){
						 $("#ccc").after("<td>工单主题</td><td style='width:440px' colspan='3'><input id='demandName' readonly='readonly' type='text' style='width: 95%;'></td>");
					}
					if(obj.ATTR_TYPE=='textarea' && obj.ATTR_NAME=='工单内容'){
						 $("#aaa").after("<tr style='width:440px' colspan='3'><td>工单内容</td><td style='width:440px' colspan='3'><textarea id='demandDesc' readonly='readonly' style='line-height:25px;width: 95%;' maxlength='500'></textarea></td><tr/>");
					}
				});
			};
		}, attrParam, false,false);
		// add by dangzw end 2016-12-08
		// 取消返回
		var backObj=parentThis.selecter.findById("a","backInfo")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/singatureNoSolveProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var singatureNoSolveProcessList=new SingatureNoSolveProcessList();
				singatureNoSolveProcessList.init();
			});

		});
		// 流程单类型
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "ora",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "qryWorkflowType",
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){
			 			debugger;
			 			parentThis.workflow_st = obj.WORKFLOW_SINGLE_TYPE;
			 		});
				}
			}, params, false,false);
		// 发起人及部门
		var params={								
				"handleType":  "qryLst",
				"dataSource":  "ora",
				"nameSpace" :  "shortProcess",
				"sqlName"   :  "queryDeptPno",
				"demandId"  :  parentThis.demandInfo.demandId,
				"workflowId":  parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if(json.code == "0" ){
				$.each(json.data,function(i,obj){
					debugger;
			 		$("#releasePersonName").val(obj.DEMAND_SUMIT_PNAME);
			 		$("#releaseDeptName").val(obj.DEPARTMENT);
			 		$("#releasePersonNum").val(obj.DEMAND_SUMIT_PNO);
				});
			}
		}, params, false,false);
		// 下一节点个数
		var parama={								
				"handleType"  :"qryLst",
				"dataSource"  :"ora",
				"nameSpace"   :"shortProcess",
				"sqlName"     :"qryNodeCount",
				"nodeId"      : parentThis.now_node_id,
				"workflowId"  : parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			debugger;
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			
			 			parentThis.nodecount = obj.NODECOUNT;
			 		});
				}
			}, parama, false,false);


		// 发起需求
		var backObj=parentThis.selecter.findById("a","submitInfo")[0];
		backObj.unbind("click").bind("click",function(){
				parentThis.submitInfo(parentThis);
		});
		// 文档名称
		var html=[];
		var downParam = {
				"hanleType" 	: 		"qryDownloadPath" ,
				"proId"			:		parentThis.demandInfo.demandId,
		};
		$.jump.ajax(URL_QUERY_GOVER_ENTER.encodeUrl(), function(json) {
			debugger;
			// 取出文件的路径
			if(json.code == "0"){
				if(json.list.length>0){
					$.each(json.list,function(i,obj){
						html.push('<div id="divObj'+i+'" class="lable-title fl" style="width:250px;"><a id="txtObj'+i+'" href="javascript:void(0)" name="attachment" attachment_name="'+obj.ATTACHMENT_NAME+'" otherName="'+obj.OTHER_ATTACHMENT_NAME+'" attachment_path="'+obj.ATTACHMENT_PATH+'" style="color: #4782DD; text-decoration: underline;width:400px;">'+obj.ATTACHMENT_NAME+'</a>&nbsp;&nbsp;</div>');
					});
				}else {
					html.push('<div >该需求单没有附件</div>');
				}
				
				$("#attachment").html(html);
			}
		}, downParam, false,false);
		
		parentThis.bindUpAndDown(parentThis);
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);
			$('#disposePersonName').val(demandInfo.singatureUser);
			$('#disposeDeptName').val(demandInfo.singatureDepart);
			$('#workflowType').val(demandInfo.workflowType);
		}
	},
	// 绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		// 删除文件
// $("#goverUpdatePage").find("a[name=deleteFile]").unbind("click").bind("click",function(){});
		// 下载文件
		$("#demandDetailInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
			var param={
					"fileName": $(this).attr("attachment_name"),	
					"downloadName" : $(this).attr("otherName"),
					"filePath":	$(this).attr("attachment_path"),
			};
			window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		});
	},
	
	//提交功能
	//add by dangzw by begin 2017-01-13
	submitInfo:function(parentThis){
		var disposeDesc=$("#disposeDesc").val();
		if(disposeDesc==null || disposeDesc==""){
			layer.alert("请填写处理意见!");
			return false;
		}
		//会签需求处理
		debugger;
		var demandId=parentThis.demandInfo.demandId;
		var taskId=parentThis.demandInfo.taskId;
		var singaturePara={
				"demandId"	    :	demandId,
				"taskId"	    :	taskId
		};
		$.jump.ajax(URL_QUERY_SINGATURE_DEAL.encodeUrl(), function(json) {
			if(json.code=="0"){
				$.jump.loadHtmlForFun("/web/html/shortProcess/singatureNoSolveProcessList.html".encodeUrl(),function(pageHtml){
					$("#content").html(pageHtml);
					var singatureNoSolveProcessList=new SingatureNoSolveProcessList();
					singatureNoSolveProcessList.init();
				});
				layer.alert("处理成功",1);
			}else{
				layer.alert("处理失败!");	
			}
		}, singaturePara, false,false);		
	}
	//add by dangzw by end 2017-01-13
};