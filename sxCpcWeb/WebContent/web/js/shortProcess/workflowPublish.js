var WorkflowPublish = new Function();
WorkflowPublish.prototype = {
	selecter : "#workflowPublishPage",
	//初始化执行
	init : function(param) {
		this.paramObj=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		//加载流程分类数据begin
		var sortParam={
			"flag"	:	1	
		};
		$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
			if(json.code=="0"){
				var workflowClassObj =  parentThis.selecter.findById("select","workflowClass")[0];
				var dataObj=json.data;
				parentThis.createWorkflowSortHtml(parentThis,dataObj,workflowClassObj);
			}
		},sortParam,null,false,false);
		//加载流程分类数据end
		
		//加载流程类型数据begin
		var typeParam={
			"flag"	:	2	
		};
		$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
			if(json.code=="0"){
				var workflowTypeObj =  parentThis.selecter.findById("select","workflowType")[0];
				var dataObj=json.data;
				parentThis.createWorkflowTypeHtml(parentThis,dataObj,workflowTypeObj);
			}
		},typeParam,null,false,false);
		//加载流程类型数据end
		parentThis.loadData(parentThis);
		var wlanId=parentThis.paramObj.wlanId;
		if(wlanId!="888"){
			$("#wisUpdate").hide();
			$("#parentWorkflow").hide();
			$("#saveDraft").hide();
		}
		//返回上一步
		$("#back").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var workFlowList=new WorkFlowList();
				workFlowList.init();
			});

		});
		//保存草稿
//		$("#saveDraft").bind("click",function(){
//			var authorityMaintain=$("input[name='authorityMaintain']:checked");
//			if(authorityMaintain.val()==undefined){
//				layer.alert("请选择子流程维护权限!");
//				return false;
//			}
//			var workflowId=parentThis.paramObj.workflowId;
//			var authorityMaintainObj=$("#workflowPublishPage").find("input[name='authorityMaintain']:checked")
//			var param ={
//					"workflowId"	:	workflowId,
//					"authority"		:	authorityMaintainObj.val(),
//					"methodType"	:	"saveDraft"
//			};
//			$.jump.ajax(URL_UPDATE_WORKFLOWSTATUS.encodeUrl(), function(json) {
//				if(json.code=="0"){
//					$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(),function(pageHtml){
//						layer.alert("保存草稿成功!");
//						$("#content").html(pageHtml);
//						var workFlowList=new WorkFlowList();
//						workFlowList.init();
//					});
//				}else{
//					layer.alert("保存草稿失败");
//				}
//			},param,true);
//		});
		//发布
		$("#publish").bind("click",function(){
			var workflowId=parentThis.paramObj.workflowId;
			var wlanId=parentThis.paramObj.wlanId;
//			if(wlanId=="888"){
//				var authorityMaintainObj=$("#workflowPublishPage").find("input[name='authorityMaintain']:checked");
//				var authority=authorityMaintainObj.val();
//				if(authority==undefined){
//					layer.alert("请选择子流程维护权限");
//					return false;
//				}
//			}
			var param ={
					"workflowId"	:	workflowId,
					"authority"		:	"",
					"wlanId"		:	wlanId,
					"methodType"	:	"publish"
			};
			$.jump.ajax(URL_UPDATE_WORKFLOWSTATUS.encodeUrl(), function(json) {
				if(json.code=="0"){
					$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(),function(pageHtml){
						layer.alert("发布成功!",9);
						$("#content").html(pageHtml);
						var workFlowList=new WorkFlowList();
						workFlowList.init();
					});
				}else{
					layer.alert("发布失败");
				}
			},param,null,false,false);
		});

	},
	createWorkflowSortHtml:function(parentThis,dataObj,workflowClassObj){
		var html = [];
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push("<option value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
			});
		}
		workflowClassObj.html(html.join(''));
	},
	createWorkflowTypeHtml:function(parentThis,dataObj,workflowTypeObj){
		var html = [];
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push("<option value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
			});
		}
		workflowTypeObj.html(html.join(''));
	},	  
	loadData:function(parentThis){
		var workflowId=parentThis.paramObj.workflowId;
		//"parentFlag"	:	1      查询父流程的标识
		paramParent={
				"workflowId"	:	workflowId,
				"flag"			:	1
		}
		$.jump.ajax(URL_QUERY_PUBLISH_WORKFLOWDATA.encodeUrl(), function(json) {
			debugger;
			var obj=json.data;
			$("#workflowName").val(obj.WORKFLOW_NAME);
			var workflowSort=obj.WORKFLOW_SORT;
			var workflowType=obj.WORKFLOW_TYPE;
			$("#workflowClass option").each(function(){
				if($(this).val()==workflowSort){
					$(this).attr("selected","selected");
				}
			});
			$("#workflowType option").each(function(){
				if($(this).val()==workflowType){
					$(this).attr("selected","selected");
				}
			});
			//回显本地网
			var html=[];
			html.push("适用本地网&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			html.push("<input type='checkbox' style='width:2%'  checked='checked' disabled='disabled'>"+obj.REGION_NAME+"");
			$("#wlan").html(html.join(''));
			
		},paramParent,null,false,false);
		
		//回显 选中的 子流程维护权限
//		var wlanId=parentThis.paramObj.wlanId;
//		if(wlanId=="888"){
//			var wisUpdate="";
//			var wisUpdatePara={
//					"workflowId"	:	workflowId
//			};
//			$.jump.ajax(URL_QUERY_WIS_UPDATE.encodeUrl(), function(json) {
//				wisUpdate=json.wisUpdate;
//			},wisUpdatePara,null,false,false);
//			if(wisUpdate!=null && wisUpdate!=""){
//				$("input[type='radio'][name='authorityMaintain']").each(function(i,element){
//					if($(this).val()==wisUpdate){
//						$(this).attr("checked","checked");
//					}
//				});
//			}
//		}
		
		//"parentFlag"	:	0      查询子流程的标识
		paramSon={
				"workflowId"	:	workflowId,
				"flag"			:	0
		}
		$.jump.ajax(URL_QUERY_PUBLISH_WORKFLOWDATA.encodeUrl(), function(json) {
			var tbodyObj=parentThis.selecter.findById("tbody","sonWorkflow")[0];
			var dataObj=json.data;
			parentThis.createHtml(parentThis,dataObj,tbodyObj);
		},paramSon,true);
		
	},
	createHtml:function(parentThis,dataObj,tbodyObj){
		debugger;
		var html=[];
		if(dataObj.length > 0 ){
			html.push("<tr>");
			html.push("<td style='text-align:left'>");
			html.push("<font size='5'>子流程</font>");
			html.push("</td>");
			html.push("</tr>");
			
			html.push("<tr>");
			html.push("<td>流程名称</td>");
			html.push("<td>流程分类</td>");
			html.push("<td>流程类型</td>");
			html.push("<td>使用本地网</td>");
			html.push("</tr>");
			
			$.each(dataObj,function(i,obj){
				html.push('<tr>');
				html.push('<td>'+obj.WORKFLOW_NAME+'</td>');
				html.push('<td>'+obj.ACT_WORKFLOW_SORT_NAME+'</td>');
				html.push('<td>'+obj.ACT_WORKFLOW_TYPE_NAME+'</td>');
				html.push('<td>'+obj.REGION_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
				html.push('<div>');
				html.push('<div></div>');
				html.push('<div>');
		}
		tbodyObj.html(html.join(''));
	}
};
