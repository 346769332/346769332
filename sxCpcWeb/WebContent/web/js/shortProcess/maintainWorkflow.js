var MaintainWorkflow = new Function();
MaintainWorkflow.prototype = {
	selecter : "#maintainWorkflowPage",
	workflowType1:"",
	regionId:"",
	//初始化执行
	init : function(param) {
		this.workflowInfo=param;
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
		
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
			regionId=json.regionId;
			parentThis.regionId=json.regionId;
			regionName=json.regionName;
		},null,null,false,false);
		//隐藏 流程定制类型-- 市定制
//		if(regionId!="888"){
//			$("#wlan").attr("width",63);
//		}else{
//			$("#workflowCustomType_2").hide();
//			$("#wlan").attr("width",63);
//		}
		
		//加载流程数据
		parentThis.loadWorkFlowData(parentThis,regionId);
		//返回
		$("#back").unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var workFlowList=new WorkFlowList();
				workFlowList.init();
			});
		});
		//给"作废"绑定事件  
		$("#maintainWorkflowPage").find("a[id=discard]").unbind("click").bind("click",function(){
			var workflowId=parentThis.workflowInfo.workflowId;
			var confirm=layer.confirm("确定要作废该流程吗?", function(){
				//更新流程状态到作废
				var discardParam={
						"workflowId"	:	workflowId
				};
				layer.close(confirm);
				$.jump.ajax(URL_UPDATEWORKFLOWSTATUS_TO_DISCARD.encodeUrl(), function(json) {
					if(json.code!="0"){
						layer.alert("作废失败");
					}else{
						$.jump.loadHtmlForFun("/web/html/shortProcess/workFlowList.html".encodeUrl(), function(menuHtml){
							$('#content').html(menuHtml);
							var workFlowList=new WorkFlowList();
							workFlowList.init();
						});
						layer.msg("作废成功",3);
					}
				},discardParam,null,false,false);
			});
		});	
		

		//保存
		$("#save").unbind("click").bind("click",function(){
			var workflowId=parentThis.workflowInfo.workflowId;
			var wlanId=parentThis.workflowInfo.wlanId;
			var param={
					"workflowId"	:	workflowId,
					"wlanId"		:	wlanId
			};
			
			$.jump.loadHtmlForFun("/web/html/shortProcess/workflowPublish.html".encodeUrl(), function(menuHtml){
				$('#content').html(menuHtml);
				var workflowPublish=new WorkflowPublish();
				workflowPublish.init(param);
			});
		});
		
		var chooseTemplateObj =  parentThis.selecter.findById("a","chooseTemplate")[0];
		//选择模板
//		chooseTemplateObj.unbind("click").bind("click",function(){
//			parentThis.queryTemplateList(parentThis);
//		});
		var saveDraftObj =  parentThis.selecter.findById("a","saveDraft")[0];

		//保存草稿
//		saveDraftObj.unbind("click").bind("click",function(){
//			var workflowNameObj =  parentThis.selecter.findById("input","workflowName")[0];
//			var workflowClassObj =  parentThis.selecter.findById("input","workflowClass")[0];
//			var workflowTypeObj =  parentThis.selecter.findById("input","workflowType")[0];
//			
//			var localNetObj=$("#maintainWorkflowPage").find("input[type=checkbox][id!='all']:checked");
//			var localNet="";
//			localNetObj.each(function(index, element) { 
//				localNet+=element.value+",";
//			});
//			localNet=localNet.substring(0, localNet.length-1);
//		
//	 		var param={
//	 				"pagePara"	:	"0",//表示从维护页面保存草稿
//	 				"workflowId":parentThis.workflowInfo.workflowId,
//	 				"workflowName":workflowNameObj.val(),
//	 				"workflowClass":workflowClassObj.val(),
//	 				"workflowType":workflowTypeObj.val()
//	 		};
//			$.jump.ajax(URL_ADD_WORKFLOW.encodeUrl(), function(json) {
//				if(json.code==0){
//					layer.alert("保存草稿成功");
//				}else{
//					layer.alert("保存草稿失败");
//				}
//			},param,true)
//		});
			
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
	
	//生成模板页面
	queryTemplateList : function(parentThis){
		var html = [];
		html.push('<div class="tanchu_box" id="templateListPage" style="width:700px;">');
		html.push('<h3>模板选择</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>需求模板名称：<input type="text" name="templateName" class="w100"></li>');
		html.push('<li>适用需求类型:<select name="demandType" id="demandType" class="w100"><option value="1">类型1</option></select></li>');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('</ul>');
		html.push('</div>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">模板需求名称</th>');         
		html.push('<th style="text-align:center">适用需求类型</th> '); 
		html.push('<th style="text-align:center">发布单位</th>');         
		html.push('<th style="text-align:center">发布部门</th> '); 
		html.push('<th style="text-align:center">发布人</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="templateListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="templateListFoot"></div>');
		html.push('</div>');
		
		var templateListPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		
		parentThis.templateListPage=templateListPage;
		var templateListPageDiv = $("#templateListPage");
		
		var seniorObj = templateListPageDiv.find("a[name=senior]");
		seniorObj.unbind("click").bind("click",function(){
			
			parentThis.queryTemplateLists(parentThis);
		});
		parentThis.queryTemplateLists(parentThis);
	},
	//查询模板信息
	queryTemplateLists : function(parentThis) {
		
		var templateListPageDiv = $("#templateListPage");
		//需求模板名称
		var templateNameObj = templateListPageDiv.find("input[name=templateName]");
		//适用需求类型
		var demandTypeObj=templateListPageDiv.find("select[name=demandType]");
		var demandType = demandTypeObj.find('option:selected').attr('demandType');
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"templateName" : templateNameObj.val(),
				"demandType" : demandType
			};
			var templateListFootObj = templateListPageDiv.find("div[name=templateListFoot]");
			
			common.pageControl.start(URL_QUERY_ORG_LIST.encodeUrl(),
									 pageIndex,
									 pageSize,
									 param,
									 "data",
									 null,
									 templateListFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = templateListPageDiv.find("tbody[name=templateListBody]");
				listBodyObj.html("");
				parentThis.createTemplateListHtml(parentThis,data,listBodyObj);
			});
	},
	//显示数据
	createTemplateListHtml : function(parentThis,data,listBodyObj) {
		
		var html=[];
		var dataLst = data.data;
		var templateListPageDiv = $("#templateListPage");
		var listFootObj = templateListPageDiv.find("div[name=templateListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="orgInfo" orgId="'+obj.ORG_ID+'" orgName="'+obj.ORG_NAME+'" orgState="'+obj.STATE +'" orgStateName="'+obj.STATE +'" latnId="'+obj.REGION_ID +'" >');
				html.push('<td >'+obj.ORG_ID+'</td>');
				html.push('<td >'+obj.ORG_NAME+'</td>');
				html.push('<td >'+obj.PID_NAME+'</td>');
				html.push('<td >'+obj.STATE_NAME+'</td>');
				html.push('<td >'+obj.STATE_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
	},
	
	loadWorkFlowData:function(parentThis,regionId){
		//显示流程信息
		
		var workflowName=parentThis.workflowInfo.workflowName;
		var workflowSort=parentThis.workflowInfo.workflowSort;
		var workflowType=parentThis.workflowInfo.workflowType;
		var workflowSingleType=parentThis.workflowInfo.workflowSingleType;
		var workflowCustomType=parentThis.workflowInfo.workflowCustomType;
		parentThis.workflowType1=workflowType
		var regionName=parentThis.workflowInfo.regionName;
		$("#workflowName").val(workflowName);
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
//		if(workflowSingleType=="0"){
//			$("#workflowSingleType").val("渠道工号审批流程");
//		}else if(workflowSingleType=="1"){
//			$("#workflowSingleType").val("会签流程");
//		}else if(workflowSingleType=="2"){
//			$("#workflowSingleType").val("内联单流程");
//		}else{
//			$("#workflowSingleType").val("");
//		}
//		if(regionId!="888"){
//			$("input[name='workflowCustomType'][value!="+workflowCustomType+"]").parent().hide();
//			$("input[name='workflowCustomType'][value="+workflowCustomType+"]").attr("checked","checked");
//		}else{
//			$("input[name='workflowCustomType'][value="+workflowCustomType+"]").attr("checked","checked");
//			$("input[name='workflowCustomType'][value!="+workflowCustomType+"]").parent().hide();
//		}
		//回显本地网
		var html="";
		html+="适用本地网<input type='checkbox' style='width: 3%;'  checked='checked' disabled='disabled'>"+regionName+"";
		$("#wlan").append(html);
		
		/** ******************************************加载流程图begin********************************************** */
		var property={
				width:1200,
				height:470,
				toolBtns:["start round","end round","task round","node","chat","state","plug","join","fork","complex mix"],
				haveHead:true,
				headBtns:["new","open","save","undo","redo","reload"],// 如果haveHead=true，则定义HEAD区的按钮
				haveTool:true,
				haveGroup:true,
				useOperStack:true
			};
			var remark={
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
			};
			var demo;
				demo=$.createGooFlow($("#workflow"),property);
				demo.setNodeRemarks(remark);
				demo.onItemDel=function(id,type){
					return confirm("确定要删除该单元吗?");
				}
				param={"workflowId":parentThis.workflowInfo.workflowId}
				// 后台获取"节点数据"和"线数据",组装流程格式
				
			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
			 		var nodeNum=json.nodeNum;
			 		var nodeData=json.data.nodes;
			 		var jsonnodes="";
			 		
			 		/*$.each(json.data1,function(i,obj){
			 			alert(obj.WF_ID);
			 		});*/
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
			 			//add by dangzw begin 2016-12-01
			 			var lineName="";
			 			if(obj.LINE_NAME=="1"){
			 				lineName="串行";
			 			}else if(obj.LINE_NAME=="2"){
			 				lineName="并行";
			 			}else{
			 				lineName="";
			 			}
			 			//add by dangzw end 2016-12-01
			 			//var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+""+'"'+"}";
			 			var lines='"'+obj.LINE_ID+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'""'+"}";
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
			  			$("#workflow .GooFlow_item").attr("flag","2");
			  			$("#draw_workflow g").attr("flag","2");
			  			//add by dagnzw begin 2016-11-29
			  			//$("#workflow .GooFlow_item").attr("workflowCustomType",workflowCustomType);
			  			//$("#draw_workflow g").attr("workflowCustomType",workflowCustomType);
			  			$("#workflow .GooFlow_item").attr("regionId",regionId);
			  			$("#draw_workflow g").attr("regionId",regionId);
			  			//加载完流程图后,给一个节点加加点类型
			  			$.each(json.data.nodes,function(i,obj){
			  				$("#"+obj.NODE_ID).attr("nodeType",obj.NODE_TYPE);
			  			});
			  			//add by dagnzw end 2016-11-29
			  			$.each(json.data.nodes,function(i,obj){ //悬浮
			  				var executer=obj.NODE_EXECUTOR;
			  				var depart=obj.NODE_EXECUTE_DEPART;
				 			var operat_agree = obj.OPERAT_AGREE;
				 			var timeLimit = obj.TIME_LIMIT;
				 			var isSignature = obj.IS_SIGNATURE;
				 			if(isSignature==0){
				 				isSignature="否";
				 			}else if(isSignature==1){
				 				isSignature="是";
				 			}else{
				 				isSignature="无";
				 			}
				 			if(timeLimit==""){
				 				timeLimit="无";
				 			}
			  				if(executer==""){
			  					executer="无";
			  				}
			  				if(depart==""){
			  					depart="无";
			  				}
				 			 if(operat_agree!=1){
				 				operat_agree = "";
				 			 }else{
				 				operat_agree = "通过";
				 			 }
					 		var to_prev_node = obj.TO_PREV_NODE;
					 			 if(to_prev_node!=2){
					 				to_prev_node = "";
					 			 }else{
					 				to_prev_node = "打回上一节点";
					 			 }
						 	var to_begin_node = obj.TO_BEGIN_NODE;
						 			 if(to_begin_node!=3){
						 				to_begin_node = "";
						 			 }else{
						 				to_begin_node = "打回发起节点";
						 			 }
						 	if(to_prev_node=="" && to_begin_node==""){
						 		to_prev_node="无";
						 	}
						 	//var titles ="处理人："+obj.NODE_EXECUTOR+"  处理部门："+obj.NODE_EXECUTE_DEPART+"  处理通过动作："+operat_agree+"    处理不通过动作："+to_prev_node + "  "+to_begin_node+"   处理时限："+obj.TIME_LIMIT+"";
						 	var titles ="处理人："+executer+" \n处理部门："+depart+"\n是否会签:"+isSignature+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + "  "+to_begin_node+"\n处理时限："+timeLimit+"";
						 	$("#td_"+obj.NODE_ID+"").attr("title",titles);
			  			});
			  			
			  		}else{
			  			layer.alert("加载失败");
			  		};
			 	}, param, true);
				 if(regionId=="888"){
						demo.onItemFocus=function(id,model){
							if(model=="line"){
								parentThis.viewFlowRuleDetail(parentThis,id);
							}else if(model=="node"){
							var nodeParam={
									"nodeId"		:	id
							};
								//判断该节点是否是会签节点begin
								var isSignature="0";
								$.jump.ajax(URL_QUERY_IS_SIGNATURE.encodeUrl(), function(json) {
									if(json.code=="0"){
										isSignature="1";
									}
								},nodeParam,null,false,false);								
								//判断该节点是否是会签节点end
								var type="";
								$.jump.ajax(URL_QUERY_NODETYPE.encodeUrl(), function(json) {
									if(json.code=="0"){
										type=json.nodeType;
									}
								},nodeParam,null,false,false);
								//开始和结束节点不让它出来 弹出框
								if(type!="0" && type!="2"){
									$.jump.ajax(URL_QUERY_NODEINFO.encodeUrl(), function(json) {
										$.each(json.data,function(i,obj){
											debugger;
											/***********************回显数据*********************/
											//流程环节
											$("#nodesName").text(obj.NODE_NAME);
											$("#nodesNamez").text(obj.NODE_NAME);
											$("#nodesNamezs").text(obj.NODE_NAME);
											$("#nodesNamezsb").text(obj.NODE_NAME);
											$("#nodesNamezsbd").text(obj.NODE_NAME);
											//流程环节处理要求(处理部门、处理人、处理动作、处理时限)
											$("#nodeExecutorId").val(obj.NODE_EXECUTOR_ID);
											$("#nodeExecuteDepartId").val(obj.NODE_EXECUTE_DEPART_ID);
											$("#nodeExecuteDepart").val(obj.NODE_EXECUTE_DEPART);
											$("#nodeExecutor").val(obj.NODE_EXECUTOR);
											$("input[type=radio][name=isSignature][value='"+obj.IS_SIGNATURE+"']").attr("checked","checked");
											if(obj.TO_PREV_NODE!=""){
												$("input[type=checkbox][name=reject][value=2]").attr("checked","checked");
											}
											if(obj.TO_BEGIN_NODE!=""){
												$("input[type=checkbox][name=reject][value=3]").attr("checked","checked");
											}
											$("#timeLimit").val(obj.TIME_LIMIT);
											$("#timeLimitz").val(obj.TIME_LIMIT);
										});
									},nodeParam,true);
									//画页面
									parentThis.viewNodeDetail(parentThis,id,isSignature);
								}
							}
						};
				 }
				 if(regionId!="888"){
						demo.onItemFocus=function(id,model){
							if(model=="line"){
								//画页面
								parentThis.viewFlowRuleDetail(parentThis,id);
							}else if(model=="node"){
								var nodeParam={
										"nodeId"		:	id
								};
								//判断该节点是否是会签节点begin
								var isSignature="0";
								$.jump.ajax(URL_QUERY_IS_SIGNATURE.encodeUrl(), function(json) {
									if(json.code=="0"){
										isSignature="1";
									}
								},nodeParam,null,false,false);								
								//判断该节点是否是会签节点end
								var type=";"
								$.jump.ajax(URL_QUERY_NODETYPE.encodeUrl(), function(json) {
									if(json.code=="0"){
										type=json.nodeType;
									}
								},nodeParam,null,false,false);
								//开始和结束节点不让它出来 弹出框
								if(type!="0" && type!="2"){
									$.jump.ajax(URL_QUERY_NODEINFO.encodeUrl(), function(json) {
										$.each(json.data,function(i,obj){
											/***********************回显数据*********************/
											//流程环节
											$("#nodesName").text(obj.NODE_NAME);
											$("#nodesNamez").text(obj.NODE_NAME);
											$("#nodesNamezs").text(obj.NODE_NAME);
											$("#nodesNamezsb").text(obj.NODE_NAME);
											$("#nodesNamezsbd").text(obj.NODE_NAME);
											//流程环节处理要求(处理部门、处理人、处理动作、处理时限)
											$("#nodeExecutorId").val(obj.NODE_EXECUTOR_ID);
											$("#nodeExecuteDepartId").val(obj.NODE_EXECUTE_DEPART_ID);
											$("#nodeExecuteDepart").val(obj.NODE_EXECUTE_DEPART);
											$("#nodeExecutor").val(obj.NODE_EXECUTOR);
											if(obj.TO_PREV_NODE!=""){
												$("input[type=checkbox][name=reject][value=2]").attr("checked","checked");
											}
											if(obj.TO_BEGIN_NODE!=""){
												$("input[type=checkbox][name=reject][value=3]").attr("checked","checked");
											}
											$("#timeLimit").val(obj.TIME_LIMIT);
											$("#timeLimitz").val(obj.TIME_LIMIT);
										});
									},nodeParam,true);
									//画页面
									parentThis.viewNodeDetail(parentThis,id,isSignature);
								}
							}
						};					 
				 }				 
				
/** ******************************************加载流程图end************************************************** */		
	},
	// 节点详细---选人界面
	viewNodeDetail:function(parentThis,nodeId,isSignature){
		var workflowSingleType=parentThis.workflowInfo.workflowSingleType;
		var html = [];
		html.push('<div  id="viewNodeDetailPage" class="tanchu_box"  style="width:800px;">');
		html.push('<h3 id="title">节点详细</h3>');
		html.push('<div name="usertables" style="margin-left: 10px;">'); 
		html.push('<input type="radio" value="1" name="radio" style=" width: 17px;" checked="checked">处理人员<input type="radio" value="2" name="radio" style=" width: 17px;">经营单位<input type="radio" value="3" name="radio" style=" width: 17px;">管控部门<input type="radio" value="4" name="radio" style=" width: 17px;">发起部门<input type="radio" value="5" name="radio" style=" width: 17px;">发起部门领导'); 
		html.push('</div>'); 
		html.push('<div name="usertable">'); 
		
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');                
		html.push('</tr>');		
		html.push('<tr>');         
		html.push('<td  id="nodesName" rowspan="9" ></td>');         
		html.push('</tr>'); 
		html.push('<tr>');   		
		html.push('<td style="height:45px">处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:250px" readonly><input type="hidden" name="nodeExecuteDepartId" id="nodeExecuteDepartId" style="width:180px" readonly>');         
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="cancel">取消</a>');
		html.push('</td>'); 
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理人&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:250px" readonly><input type="hidden" name="nodeExecutorId" id="nodeExecutorId" style="width:180px" readonly></td>');         
		html.push('</tr>');   
		
		html.push('<tr>');         
		html.push('<td>联系电话:<input type="text" name="nodeExecutorTel" id="nodeExecutorTel" style="width:250px" readonly></td>');         
		html.push('</tr>');
		
		//html.push('<tr>');         
		//html.push('<td>是否会签&nbsp;&nbsp;&nbsp;:<input type="radio" name="isSignature"  style="width:10px" value="1">是&nbsp;&nbsp;<input type="radio" name="isSignature"  style="width:10px" checked="checked" value="0">否</td>');         
		//html.push('</tr>');
		
		html.push('<tr> ');         
		html.push('<td>处理通过动作:<input type="radio" name="agree"  checked="checked" value="1" style="width:10px" disabled="disabled"/>通过 ');         
		html.push('</td>');    
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理不通过动作:<input type="checkbox" name="reject"  value="2" style="width:10px"/>打回上一节点');         
		html.push('<input type="checkbox" name="reject"  value="3" style="width:10px"/>打回发起节点</td>');
		//html.push('<input type="checkbox" name="reject"  value="4" style="width:10px" checked="checked"/>作废</td>');
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理规则:<select id="workflowRadioInfo" name="workflowRadioInfo" style="width:120px;height: 25px">');   
		html.push('<option selected="selected">请选择</option></select></td>');    
		html.push('</tr>');  
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
	
		html.push('</table>');      
		html.push('</div>'); 
		
		//区县级-----------------------------------------------------------------------------------------------------------------------------
		html.push('<div name="usertablez"style="display:none;width:800px;height:400px;overflow-x:hidden;overflow-y:auto;">'); 
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');                
		html.push('</tr>');		
		html.push('<tr>');         
		html.push('<td  id="nodesNamez" rowspan="9" >'); 
		html.push('</td>');         
		html.push('</tr>'); 
		html.push('<tr rowspan="3">');         
		html.push('<td  id="nodesztres">'); 
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10">'); 
		html.push('<thead>'); 
		html.push('<tr>'); 
		html.push('<th style="width:2%;text-align: right;"></th>'); 
		html.push('<td style="width:10%;">节点名称</td>'); 				
		html.push('</tr>'); 
		html.push('</thead>'); 
		html.push('<tbody id="roleListBody">'); 
		html.push('</tbody>'); 
		html.push('</table>'); 
		html.push('<div class="page mt10" id="roleListFoot"></div>'); 
		html.push('</td>');         
		html.push('</tr>');
		
		html.push('<tr>');   		
		html.push('<td style="height:45px">处理部门及岗位:<input type="text" name="disposeDeptAndJob" id="disposeDeptAndJob" disType="2" style="width:250px" readonly><input type="hidden" name="disposeDeptAndJobId" id="disposeDeptAndJobId" style="width:180px" readonly>');         
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="cancel">取消</a>');
		html.push('</td>'); 
		html.push('</tr>');
		
		html.push('<tr> ');         
		html.push('<td>处理通过动作:<input type="radio" name="agree"  checked="checked" value="1" style="width:10px" disabled="disabled"/>通过 ');         
		html.push('</td>');    
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理不通过动作:<input type="checkbox" name="reject"  value="2" style="width:10px"/>打回上一节点');         
		html.push('<input type="checkbox" name="reject"  value="3" style="width:10px"/>打回发起节点</td>');    
		//html.push('<input type="checkbox" name="reject"  value="4" style="width:10px" checked="checked"/>作废</td>');
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimitz" id="timeLimitz" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理规则:<select id="workflowRadioInfo" name="workflowRadioInfo" style="width:120px;height: 25px">');   
		html.push('<option selected="selected">请选择</option></select></td>');    
		html.push('</tr>');  
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
	
		html.push('</table>');      
		html.push('</div>'); 
		
		//市级-----------------------------------------------------------------------------------------------------------------------------
		html.push('<div name="usertablez1"style="display:none;width:800px;height:400px;overflow-x:hidden;overflow-y:auto;">'); 
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');                
		html.push('</tr>');		
		html.push('<tr>');         
		html.push('<td  id="nodesNamezs" rowspan="9" >'); 
		html.push('</td>');         
		html.push('</tr>'); 
		html.push('<tr rowspan="3">');         
		html.push('<td  id="nodesztres">'); 
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10">'); 
		html.push('<thead>'); 
		html.push('<tr>'); 
		html.push('<th style="width:2%;text-align: right;"></th>'); 
		html.push('<td style="width:10%;">节点名称</td>'); 				
		html.push('</tr>'); 
		html.push('</thead>'); 
		html.push('<tbody id="roleListBody">'); 
		html.push('</tbody>'); 
		html.push('</table>'); 
		html.push('<div class="page mt10" id="roleListFoot"></div>'); 
		html.push('</td>');         
		html.push('</tr>');
		
		html.push('<tr>');   		
		html.push('<td style="height:45px">处理部门及岗位:<input type="text" name="disposeDeptAndJob" id="disposeDeptAndJob" disType="1" style="width:250px" readonly><input type="hidden" name="disposeDeptId" id="disposeDeptId" style="width:180px" readonly>');         
		html.push('<input type="hidden" name="disposeJobId" id="disposeJobId" style="width:180px" readonly>');
		html.push('<input type="hidden" name="disposeJobId" id="disposeDeptLevel" style="width:180px" readonly>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="cancel">取消</a>');
		html.push('</td>'); 
		html.push('</tr>');
		
		html.push('<tr> ');         
		html.push('<td>处理通过动作:<input type="radio" name="agree"  checked="checked" value="1" style="width:10px" disabled="disabled"/>通过 ');         
		html.push('</td>');    
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理不通过动作:<input type="checkbox" name="reject"  value="2" style="width:10px"/>打回上一节点');         
		html.push('<input type="checkbox" name="reject"  value="3" style="width:10px"/>打回发起节点</td>');    
		//html.push('<input type="checkbox" name="reject"  value="4" style="width:10px" checked="checked"/>作废</td>');
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimitz" id="timeLimitz" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理规则:<select id="workflowRadioInfo" name="workflowRadioInfo" style="width:120px;height: 25px">');   
		html.push('<option selected="selected">请选择</option></select></td>');    
		html.push('</tr>');  
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
	
		html.push('</table>');      
		html.push('</div>'); 
		//本部门-----------------------------------------------------------------------------------------------------------------------------
		html.push('<div name="usertablez2"style="display:none;width:800px;height:400px;overflow-x:hidden;overflow-y:auto;">'); 
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');                
		html.push('</tr>');		
		html.push('<tr>');         
		html.push('<td  id="nodesNamezsb" rowspan="9" >'); 
		html.push('</td>');         
		html.push('</tr>'); 
		html.push('<tr rowspan="3">');         
		html.push('<td  id="nodesztres">'); 
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10">'); 
		html.push('<thead>'); 
		html.push('<tr>'); 
		html.push('<th style="width:2%;text-align: right;"></th>'); 
		html.push('<td style="width:10%;">节点名称</td>'); 				
		html.push('</tr>'); 
		html.push('</thead>'); 
		html.push('<tbody id="roleListBody">'); 
		html.push('</tbody>'); 
		html.push('</table>'); 
		html.push('<div class="page mt10" id="roleListFoot"></div>'); 
		html.push('</td>');         
		html.push('</tr>');
		
		html.push('<tr>');   		
		html.push('<td style="height:45px">处理部门及岗位:<input type="text" name="disposeDeptAndJob" id="disposeDeptAndJob" disType="3" style="width:250px" readonly><input type="hidden" name="disposeDeptId" id="disposeDeptId" style="width:180px" readonly>');         
		html.push('<input type="hidden" name="disposeJobId" id="disposeJobId" style="width:180px" readonly>');
		html.push('<input type="hidden" name="disposeJobId" id="disposeDeptLevel" style="width:180px" readonly>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="cancel">取消</a>');
		html.push('</td>'); 
		html.push('</tr>');
		
		html.push('<tr> ');         
		html.push('<td>处理通过动作:<input type="radio" name="agree"  checked="checked" value="1" style="width:10px" disabled="disabled"/>通过 ');         
		html.push('</td>');    
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理不通过动作:<input type="checkbox" name="reject"  value="2" style="width:10px"/>打回上一节点');         
		html.push('<input type="checkbox" name="reject"  value="3" style="width:10px"/>打回发起节点</td>');    
		//html.push('<input type="checkbox" name="reject"  value="4" style="width:10px" checked="checked"/>作废</td>');
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimitz" id="timeLimitz" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理规则:<select id="workflowRadioInfo" name="workflowRadioInfo" style="width:120px;height: 25px">');   
		html.push('<option selected="selected">请选择</option></select></td>');    
		html.push('</tr>');  
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
	
		html.push('</table>');      
		html.push('</div>'); 
		//发起部门领导-----------------------------------------------------------------------------------------------------------------------------
		html.push('<div name="usertablez3"style="display:none;width:800px;height:400px;overflow-x:hidden;overflow-y:auto;">'); 
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');                
		html.push('</tr>');		
		html.push('<tr>');         
		html.push('<td  id="nodesNamezsbd" rowspan="9" >'); 
		html.push('</td>');         
		html.push('</tr>'); 
		html.push('<tr rowspan="3">');         
		html.push('<td  id="nodesztres">'); 
		html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10">'); 
		html.push('<thead>'); 
		html.push('<tr>'); 
		html.push('<th style="width:2%;text-align: right;"></th>'); 
		html.push('<td style="width:10%;">节点名称</td>'); 				
		html.push('</tr>'); 
		html.push('</thead>'); 
		html.push('<tbody id="roleListBody">'); 
		html.push('</tbody>'); 
		html.push('</table>'); 
		html.push('<div class="page mt10" id="roleListFoot"></div>'); 
		html.push('</td>');         
		html.push('</tr>');
		
		html.push('<tr>');   		
		html.push('<td style="height:45px">处理部门及岗位:<input type="text" name="disposeDeptAndJob" id="disposeDeptAndJob" disType="4" style="width:250px" readonly><input type="hidden" name="disposeDeptId" id="disposeDeptId" style="width:180px" readonly>');         
		html.push('<input type="hidden" name="disposeJobId" id="disposeJobId" style="width:180px" readonly>');
		html.push('<input type="hidden" name="disposeJobId" id="disposeDeptLevel" style="width:180px" readonly>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="cancel">取消</a>');
		html.push('</td>'); 
		html.push('</tr>');
		
		html.push('<tr> ');         
		html.push('<td>处理通过动作:<input type="radio" name="agree"  checked="checked" value="1" style="width:10px" disabled="disabled"/>通过 ');         
		html.push('</td>');    
		html.push('</tr>');  
		
		html.push('<tr> ');         
		html.push('<td>处理不通过动作:<input type="checkbox" name="reject"  value="2" style="width:10px"/>打回上一节点');         
		html.push('<input type="checkbox" name="reject"  value="3" style="width:10px"/>打回发起节点</td>');    
		//html.push('<input type="checkbox" name="reject"  value="4" style="width:10px" checked="checked"/>作废</td>');
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimitz" id="timeLimitz" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理规则:<select id="workflowRadioInfo" name="workflowRadioInfo" style="width:120px;height: 25px">');   
		html.push('<option selected="selected">请选择</option></select></td>');    
		html.push('</tr>');  
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
	
		html.push('</table>');      
		html.push('</div>'); 
		html.push('</div>');
		
		var authInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], // 去掉默认边框
		     //shade: [0], //去掉遮罩
		    // closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', // 从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var viewNodeDetailPage=$("#viewNodeDetailPage");
		var workflowId=parentThis.workflowInfo.workflowId;
		
		var workflowRadioInfoObj =viewNodeDetailPage.find("select[name='workflowRadioInfo']");
		var paramType = {
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",		
	    		"sqlName":"queryWorkflowRadioInfo",	
			};
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				
				if (json.code == "0") {
					debugger;
					if (json.data.length > 0) {
						var html = [];
						workflowRadioInfoObj.html("");
						html.push('<option workflowRadioInfo ="">请选择</option>');
						$.each(json.data, function(i, obj) {
							html.push('<option workflowRadioInfo = ' + obj.radio_Id + '>' + obj.radio_Name + '</option>');
						});
						workflowRadioInfoObj.html(html.join(''));
					}
				};
			}, paramType, false, false);
		viewNodeDetailPage.find("input[name='radio']").bind("click",function(){
			debugger;
			var niw=viewNodeDetailPage.find("div[name='usertable']");//选人
			var nzw=viewNodeDetailPage.find("div[name='usertablez']");//区县级
			var nuw=viewNodeDetailPage.find("div[name='usertablez1']");//市级
			var nbw=viewNodeDetailPage.find("div[name='usertablez2']");//本部门   add 2017-09-14
			var nlw=viewNodeDetailPage.find("div[name='usertablez3']");//本部门领导 add 2017-10-23
			
			var check_circle=$("#viewNodeDetailPage").find("input[name=radio]:checked").val();
			if(check_circle=='1'){
				niw.show();
				nzw.hide();
				nuw.hide();
				nlw.hide();
				nbw.hide();
			}else if(check_circle=='2'){
				niw.hide();
				nzw.show();
				nuw.hide();
				nlw.hide();
				nbw.hide();
				param=
				{	
						"handleType":"qry",
			    		"dataSource":"",
			    		"nameSpace":"shortProcess",		
			    		"sqlName":"querynodesListPage",	
				     	"node_Id":nodeId,
					    "workflowId" :workflowId,
					
				};
				parentThis.querynodesLists(parentThis,param,viewNodeDetailPage);			
			}else if(check_circle=='3'){
				niw.hide();
				nzw.hide();
				nbw.hide();
				nlw.hide();
				nuw.show();
				param=
				{	
						"handleType":"qry",
			    		"dataSource":"",
			    		"nameSpace":"shortProcess",		
			    		"sqlName":"querynodesListPage",	
				     	"node_Id":nodeId,
				     	"workflowId" :workflowId,
					
				};
				parentThis.querynodesLists(parentThis,param,viewNodeDetailPage);			
			}else if(check_circle=='4'){//新加的本部门现在是写死的，没有在关系表中配置，岗位也写死，只有总经理和副总经理
				niw.hide();
				nzw.hide();
				nuw.hide();
				nlw.hide();
				nbw.show();
				param=
				{	
						"handleType":"qry",
			    		"dataSource":"",
			    		"nameSpace":"shortProcess",		
			    		"sqlName":"querynodesListPage",	
				     	"node_Id":nodeId,
				     	"workflowId" :workflowId,
					
				};
				parentThis.querynodesLists(parentThis,param,viewNodeDetailPage);
			}else if(check_circle=='5'){//
				niw.hide();
				nzw.hide();
				nuw.hide();
				nbw.hide();
				nlw.show();
				param=
				{	
						"handleType":"qry",
			    		"dataSource":"",
			    		"nameSpace":"shortProcess",		
			    		"sqlName":"querynodesListPage",	
				     	"node_Id":nodeId,
				     	"workflowId" :workflowId
					
				};
				parentThis.querynodesLists(parentThis,param,viewNodeDetailPage);
			}
		});
		//他部门选择部门
		var nodeExecuteDepartObj = $("#viewNodeDetailPage").find("input[id='disposeDeptAndJob']");
			nodeExecuteDepartObj.unbind("click").bind("click",function(){
			var disType = $(this).attr("disType");
			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="disposeJobInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择部门级岗位</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div>');
			xthtml.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
			xthtml.push('<tr><td>');
			//xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but" name="selectOrgNameSearch">查询</a>');
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
			xthtml.push('<th style="width:10%;">部门</th>');
			xthtml.push('<th style="width:10%;">岗位</th>');
			
			xthtml.push('</tr>');
			xthtml.push('</thead>');
			xthtml.push('<tbody id="chooseDeptAndExecuterBody"></tbody>');
			xthtml.push('</table>');
			xthtml.push('<div class="page mt10" id="chooseDeptAndExecuterFoot"></div>');
			xthtml.push('</div>');
			xthtml.push('</div>');
			xthtml.push('</div>');

			var disposeJobIdInfoPages = $.layer({
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
			var roleInfoPageDiv=$("#disposeJobInfoPage");
			//关闭
			roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(disposeJobIdInfoPages);
			});
			//选中
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				debugger;
				var POST_ID;
				var POST_NAME;
				var DEPT_LEVEL;
				var DEPT_TYPE_ID;
				var DEPT_TYPE_NAME;
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
						POST_NAME=trObj.attr("POST_NAME");
						DEPT_TYPE_NAME=trObj.attr("DEPT_TYPE_NAME");
						DEPT_TYPE_ID=trObj.attr("DEPT_TYPE_ID");
						POST_ID=trObj.attr("POST_ID");
						DEPT_LEVEL=trObj.attr("DEPT_LEVEL");
						if(boxObj.length==0){
							layer.alert("请选择处理部门及岗位!",8);
							return false;
						}
						debugger;//disposeDeptId  disposeJobId
						var disposeDeptAndJob = DEPT_TYPE_NAME+"--"+POST_NAME;
						$("#viewNodeDetailPage").find("input[id='disposeDeptId']").val(DEPT_TYPE_ID);//虚拟部门id
						$("#viewNodeDetailPage").find("input[id='disposeJobId']").val(POST_ID);//岗位id
						$("#viewNodeDetailPage").find("input[id='disposeDeptLevel']").val(DEPT_LEVEL);//层级
						$("#viewNodeDetailPage").find("input[id='disposeDeptAndJob']").val(disposeDeptAndJob);
						layer.close(disposeJobIdInfoPages);
					}
				});
			});
			//parentThis.queryWorkflow(parentThis);
			parentThis.queryClockDeptInfo(parentThis,disType);

		});
		viewNodeDetailPage.find("input[name='radioz']").bind("click",function(){
			var niw=viewNodeDetailPage.find("div[name='usertable']");
			var nzw=viewNodeDetailPage.find("div[name='usertablez']");
			var nuw=viewNodeDetailPage.find("div[name='usertablez1']");
			var nbw=viewNodeDetailPage.find("div[name='usertablez2']");
			var nlw=viewNodeDetailPage.find("div[name='usertablez3']");
			var check_circle=$("#viewNodeDetailPage").find("input[name=radioz]:checked").val();
			if(check_circle=='1'){
				niw.show();
				nzw.hide();
				nuw.hide();
				nbw.hide();
				nlw.hide();
			}else if(check_circle=='2'){
				niw.hide();
				nzw.show();
				nuw.hide();
				nbw.hide();
				nlw.hide();
			}else if(check_circle=='3'){
				niw.hide();
				nzw.hide();
				nuw.show();
				nbw.hide();
				nlw.hide();
			}else if(check_circle=='4'){
				niw.hide();
				nzw.hide();
				nuw.hide();
				nbw.show();
				nlw.hide();
			}else if(check_circle=='5'){
				niw.hide();
				nzw.hide();
				nuw.hide();
				nbw.hide();
				nlw.show();
			}
			
		
		
		});
		$("#viewNodeDetailPage").find("a[name='infoSubmit']").bind("click",function(){
			var check_circle=$("#viewNodeDetailPage").find("input[name=radio]:checked").val();
			var workflowRadioInfoObj =$("#viewNodeDetailPage").find("select[name='workflowRadioInfo']");
			var workflowRadioInfo = workflowRadioInfoObj.find('option:selected').attr('workflowRadioInfo');
			if(check_circle=='1'){				
				var timeLimit=$("#viewNodeDetailPage #timeLimit").val();
				var reg=/^[1-9][0-9]?$/;
				if(timeLimit!=""){
					if(!reg.test(timeLimit)){
						layer.alert("处理时限为正整数且只能介于1到99");
						return false;
					}
				}			
				//var isSignature=$('input:radio[name=isSignature]:checked').val();
				var isSignature=0;
				var isSingaturePara={
						"workflowId"		:	workflowId,
						"nodeId"			:	nodeId,
						"isSignature"		:	isSignature
				};
				if(isSignature!=undefined && isSignature=="0"){
					//不走会签
					$.jump.ajax(URL_UPDATE_ISSINGATURE_SET.encodeUrl(), function(json) {
						
					},isSingaturePara,null,false,false);								
				}
				if(isSignature!=undefined && isSignature=="1"){
					//走会签
					$.jump.ajax(URL_UPDATE_ISSINGATURE_SET.encodeUrl(), function(json) {
						
					},isSingaturePara,null,false,false);								

				}
				//指定节点处理人和处理部门后,进行更新数据
				var nodeExecuteDepartId=$("#viewNodeDetailPage #nodeExecuteDepartId").val();
				var nodeExecuteDepart=$("#viewNodeDetailPage #nodeExecuteDepart").val();
				var nodeExecutor=$("#viewNodeDetailPage #nodeExecutor").val();
				var nodeExecutorId=$("#viewNodeDetailPage #nodeExecutorId").val();
				var nodeExecutorTel=$("#viewNodeDetailPage #nodeExecutorTel").val();
				var opertionAgree=$('input:radio[name=agree]:checked').val();
				
				if(isSignature==0){
					isSignatureAlis="否";
				}else if(isSignature==1){
					isSignatureAlis="是";
				}else{
					isSignatureAlis="其他";
				}
				var operat_agree="";
				if(opertionAgree=="1"){
					operat_agree="通过";
				}
				var rejectObj=$("#viewNodeDetailPage").find("input[type=checkbox][name=reject]:checked");
				var reject="";
				rejectObj.each(function(index, element) { 
					reject+=element.value+",";
				});
				if(reject!=""){
					reject=reject.substring(0, reject.length-1);
				}
				var to_prev_node="";
				var to_begin_node="";
				
				if(reject!=""){
					if(reject.indexOf(",")==-1){
						if(reject=="2"){
							to_prev_node="打回上一节点";
						}else{
							to_begin_node="打回发起节点";
						}
					}else{
						to_prev_node="打回上一节点";
						to_begin_node="打回发起节点";
					}
				}
				if(to_prev_node=="" && to_begin_node==""){
					to_prev_node="无";
				}
				if(timeLimit==""){
					var titles ="处理人："+nodeExecutor+" \n是否会签:"+isSignatureAlis+" \n处理部门："+nodeExecuteDepart+" \n联系方式："+nodeExecutorTel+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + "  "+to_begin_node+"\n处理时限：无";
				}else{
					//var titles ="处理人："+nodeExecutor+" \n处理部门："+nodeExecuteDepart+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + "  "+to_begin_node+"\n处理时限："+timeLimit+"";
					var titles ="处理人："+nodeExecutor+" \n是否会签:"+isSignatureAlis+" \n处理部门："+nodeExecuteDepart+" \n联系方式："+nodeExecutorTel+"\n处理通过动作："+operat_agree+"\n处理不通过动作："+to_prev_node + "  "+to_begin_node+"\n处理时限："+timeLimit+"";
				}
			 	$("#td_"+nodeId+"").attr("title",titles);
				
				var nodeParam={
						"workflowId"			:	workflowId,
						"nodeId"				:	nodeId,
						"nodeExecuteDepart"		:	nodeExecuteDepart,
						"nodeExecuteDepartId"	:	nodeExecuteDepartId,
						"nodeExecutor"			:	nodeExecutor,
						"nodeExecutorId"		:	nodeExecutorId,
						"nodeExecutorTel"		:	nodeExecutorTel,
						"opertionAgree"			:	opertionAgree,
						"reject"				:	reject,
						"timeLimit"				:	timeLimit,
						"workflowRadioInfo"		:	workflowRadioInfo,
						"isSignature"			:	isSignature
				};
				$.jump.ajax(URL_UPDATE_NODEDATA.encodeUrl(), function(json) {
					if(json.code=="0"){
						layer.close(authInfoPage);
					}
				},nodeParam,true);
			
			}else if(check_circle=='2'||check_circle=='3'||check_circle=='4'||check_circle=='5'){
				var zid='';
				var zidObj=$("#viewNodeDetailPage").find("input[type=checkbox][name=nodesInfoBox]:checked");		
				if(!$("#viewNodeDetailPage").find("input[type=checkbox][name=nodesInfoBox]").is(":checked")){	
					layer.alert("请选择节点");
					return ;
				}
				zid=zidObj.attr("zid");					
				var timeLimit=$("#viewNodeDetailPage #timeLimitz").val();
				var reg=/^[1-9][0-9]?$/;
				if(timeLimit!=""){
					if(!reg.test(timeLimit)){
						layer.alert("处理时限为正整数且只能介于1到99");
						return false;
					}
				}	
				var disposeDeptId=$("#viewNodeDetailPage #disposeDeptId").val();
				var disposeJobId=$("#viewNodeDetailPage #disposeJobId").val();
				var disposeDeptLevel=$("#viewNodeDetailPage #disposeDeptLevel").val();
	            var opertionAgree=$('input:radio[name=agree]:checked').val();
				
				if(isSignature==0){
					isSignatureAlis="否";
				}else if(isSignature==1){
					isSignatureAlis="是";
				}else{
					isSignatureAlis="其他";
				}
				var operat_agree="";
				if(opertionAgree=="1"){
					operat_agree="通过";
				}
				var rejectObj=$("#viewNodeDetailPage").find("input[type=checkbox][name=reject]:checked");
				var reject="";
				rejectObj.each(function(index, element) { 
					reject+=element.value+",";
				});
				if(reject!=""){
					reject=reject.substring(0, reject.length-1);
				}
				var to_prev_node="";
				var to_begin_node="";
				
				if(reject!=""){
					if(reject.indexOf(",")==-1){
						if(reject=="2"){
							to_prev_node="打回上一节点";
						}else{
							to_begin_node="打回发起节点";
						}
					}else{
						to_prev_node="打回上一节点";
						to_begin_node="打回发起节点";
					}
				}
				if(to_prev_node=="" && to_begin_node==""){
					to_prev_node="无";
				}
				var nodeParam={
						"workflowId"			:	workflowId,
						"nodeId"				:	nodeId,
						"nodeExecuteDepart"		:	"",
						"nodeExecuteDepartId"	:	"",
						"nodeExecutor"			:	"",
						"nodeExecutorId"		:	"",
						"nodeExecutorTel"		:	"",
						"opertionAgree"			:	opertionAgree,
						"reject"				:	reject,
						"timeLimit"				:	timeLimit,
						"isSignature"			:	"",
						"disposeDeptId"			:	disposeDeptId,
						"disposeJobId"			:	disposeJobId,
						"disposeDeptLevel"		:	disposeDeptLevel,
						"workflowRadioInfo"		:	workflowRadioInfo,
						"nodesId"               :   zid
				};
				$.jump.ajax(URL_UPDATE_NODEDATA.encodeUrl(), function(json) {
					if(json.code=="0"){
						layer.close(authInfoPage);
					}
				},nodeParam,true);
				
				}
			
		
		});
	
		// 关闭
		viewNodeDetailPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		// 取消
		viewNodeDetailPage.find("a[name=cancel]").unbind("click").bind("click",function(){
			$("#viewNodeDetailPage #nodeExecuteDepartId").val("");
			$("#viewNodeDetailPage #nodeExecuteDepart").val("");
			$("#viewNodeDetailPage #nodeExecutor").val("");
			$("#viewNodeDetailPage #nodeExecutorId").val("");
			$("#viewNodeDetailPage #nodeExecutorTel").val("");
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
			xthtml.push('<tr><td>部门名称:&nbsp;&nbsp;&nbsp;<input type="text" id="selectOrgName" placeholder="请输入部门名称" style="width:200px;" >');
			xthtml.push('&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)"  class="but" name="selectOrgNameSearch">查询</a>');
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
			xthtml.push('<th style="width:15%;">联系电话</th>');
			
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
			var staff_ids; var staff_names; var DEPARTMENT_NAMES; var DEPARTMENT_CODES;var DEPARTMENT_ID;var MOB_TEL;
			//关闭
			roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
				layer.close(selectStaffInfoPage);
			});
			roleInfoPageDiv.find("a[name=selectOrgNameSearch]").unbind("click").bind("click",function(){
				var selectOrgName = $("#selectOrgName").val();
				if(selectOrgName==null||selectOrgName==undefined||selectOrgName==""){
					parentThis.queryWorkflow(parentThis);
				}else{
				var param={								
						"handleType":"qryLst",
						"dataSource":"",
						"nameSpace":"shortProcess",
						"sqlName":"searchdeppt",
						"region_id": parentThis.regionId,
						"org_Name": selectOrgName
				};
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						if(json.code == "0" ){
							var html=[];
							if(json.data.length > 0) {
								$.each(json.data,function(i,obj){
									html.push('<div id="'+obj.ORG_ID+'" name="divzi" style="font-size:12px;cursor:pointer;position:relative;left:25px;margin-top: 5px;">'+obj.ORG_NAME+'</div>');
								});
								$("#processDiv").html(html.join(''));
							};
						};
				}, param, false,false);
				
					//点击子级触发事件 部门
					$("#processDiv").find("div[name='divzi']").each(function(index){
						var ziId=$(this).attr("id");
						$("#"+ziId+"").click(function(e){
							//里边的<div>点击，但是不触发外层的<div>
							e.stopPropagation();
							//显示查询数据DIV					
							parentThis.queryPeopleList(parentThis,ziId);
						});
					});
				}
			});
			
			//选中
			roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
				
				roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						trObj = $(this).parent().parent("tr[name=staffInfo]");
						staff_ids = trObj.attr("staff_id");				
						staff_names=trObj.attr("staff_name");
						DEPARTMENT_NAMES=trObj.attr("DEPARTMENT_NAME");
						DEPARTMENT_CODES=trObj.attr("DEPARTMENT_CODE");
						DEPARTMENT_ID=trObj.attr("DEPARTMENT_ID");
						MOB_TEL=trObj.attr("MOB_TEL");
						if(boxObj.length==0){
							layer.alert("请选择处理人及部门!",8);
							return false;
						}
						debugger
						$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(staff_names);
						$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(staff_ids);
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(DEPARTMENT_ID);
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(DEPARTMENT_NAMES);
						$("#viewNodeDetailPage").find("input[id='nodeExecutorTel']").val(MOB_TEL);
						layer.close(selectStaffInfoPage);
					}
				});
			});
			parentThis.queryWorkflow(parentThis);

		});
			
	},
	
	querynodesLists : function(parentThis,param,viewNodeDetailPage) {
		debugger;
		viewNodeDetailPage.find("tbody[id=roleListBody]").html("");
	
		var templateListFootObj = viewNodeDetailPage.find("div[id=roleListFoot]");
		
		var pageIndex = 0;
		var pageSize =2;
		common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								pageIndex,
								pageSize,
								 param,
								 "data",
								 null,
								 templateListFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = viewNodeDetailPage.find("tbody[id=roleListBody]");
			listBodyObj.html("");
			parentThis.createnodeListHtml(parentThis,data,listBodyObj,templateListFootObj);
		});
	
	},
		createnodeListHtml : function(parentThis,data,listBodyObj,templateListFootObj) {
		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			templateListFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="orgInfo" node_name="'+obj.NODE_NAME+'" workflow_id="'+obj.WORKFLOW_ID+'" now_node_id="'+obj.NOW_NODE_ID +'" now_node_id="'+obj.NEXT_NODE_ID +'">');
				html.push('<td ><input id="nodesInfoBox_'+obj.NOW_NODE_ID+'" zid="'+obj.NOW_NODE_ID+'" name="nodesInfoBox" type="checkbox" style=" width: 15px;"></td>');
				html.push('<td >'+obj.NODE_NAME+'</td>');
			
				html.push('</tr>');
			});
		}else{
			templateListFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
	
		listBodyObj.find("input[type=checkbox][name=nodesInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			listBodyObj.find("input[type=checkbox][name=nodesInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
	},
	queryWorkflow:function(parentThis){
		
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
				//html1.push('<div id="888" name="divfu" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian888"  src="images/ico+.gif" alt="">省公司</div>');
				$.each(json.latnSet,function(i,obj){
					if(obj.REGION_ID!='888'){						
						html1.push('<div id ="'+obj.REGION_ID+'" orgName="'+obj.REGION_NAME+'" name="divfu" latnCode = "'+obj.REGION_CODE+'" style="font-size:15px;cursor:pointer;margin-top: 5px;"><img id="tupian'+obj.REGION_ID+'"  src="images/ico+.gif" alt="">'+obj.REGION_NAME+'</div>');								
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
				"region_id": fuId,
				"org_Name": ""
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
					parentThis.queryPeopleList(parentThis,ziId);
				});
			});
		});
		});
	},
	//查询专家数据
	queryPeopleList : function(parentThis,ziId) {	
		
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
				
				html.push('<tr name="staffInfo" mob_tel="'+obj.MOB_TEL+'" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_ID="'+obj.DEPARTMENT_ID+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
				html.push('<td><input type="radio" name="dept"  style="width: 10%;" ></td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');		
				html.push('<td>'+obj.ORG_NAME+'</td>');
				html.push('<td>'+obj.MOB_TEL+'</td>');
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
	//选择规则
	viewFlowRuleDetail : function(parentThis,id){
		
		var html = [];
		html.push('<div  id="viewFlowRuleDetailPage" class="tanchu_box"  style="width:850px;height:530px;">');
		html.push('<h3 id="title">规则配置</h3>');
		html.push('<div style="margin-bottom: 10px;">');
		html.push('<a href="#tabs-1" style="padding:2px 15px;color: #000;" class="but" name="basicInfoShow" id="basicInfoShow">模板规则配置</a>');
		html.push('<a href="#tabs-2" style="padding:2px 15px" class="but" name="indicatorsCAL" id="indicatorsCAL">单选规则配置</a>');
		html.push('</div>');
		html.push('<div id="tabs-1" style="overflow: auto;height:400px;">');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead>');
		html.push('<h4 style="padding-left: 20px;line-height: 15px;">已选规则及模板属性</h4>');
		html.push('<tr >');         
		html.push('<td>节点名称：<input type="text"  id="flowLineNodeName" style="width:100px" readonly>');
		html.push('</td>');        
		html.push('<td>规则名称：<input type="text"  id="flowLineRuleName" style="width:100px" readonly>');
		html.push('</td>');         
		html.push('<td>模板属性名称：<input type="text"  id="flowLineTemplateName" style="width:100px" readonly>');
		html.push('</td>'); 
		html.push('</tr>'); 
		html.push('</thead>');
		html.push('</table>'); 
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead>');
		html.push('<tr >');         
		html.push('<td>流程规则名称：<input type="text" name="flowRuleName"style="width:100px"> ');    
		html.push('<a href="javascript:void(0)"  class="but" name="senior">查询</a>');
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="reset">重置</a>'); 
		//html.push('<a href="javascript:void(0)"  class="but ml10"  style="background: #BB7444;" name="confirm">选择确定</a>');
		html.push('</td>'); 
		html.push('</tr>'); 
		html.push('</thead>');
		html.push('</table>'); 
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<h4 style="padding-left: 20px;line-height: 15px;">流程模板属性</h4>');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">选择</th>');              
		html.push('<th style="text-align:center">流程模板属性名称</th>');         
		html.push('<th style="text-align:center">流程模板属性元素</th>');         
		html.push('<th style="text-align:center">流程模板属性元素名称</th>');
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="flowTemplateListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="flowTemplateListFoot"></div>');  
		html.push('</table>'); 
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<h4 style="padding-left: 20px;line-height: 15px;">选择规则</h4>');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">选择</th>');         
		html.push('<th style="text-align:center">流程规则编号</th>');         
		html.push('<th style="text-align:center">流程规则名称</th>');         
		html.push('<th style="text-align:center">流程规则内容</th>');         
		html.push('<th style="text-align:center">流程规则描述</th>');
		html.push('<th style="text-align:center">状态</th> ');
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="flowRuleListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="flowRuleListFoot"></div>');   
		html.push('</div>');
		
		html.push('<div id="tabs-2" style="overflow: auto;height:400px;display: none;">');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead>');
		html.push('<h4 style="padding-left: 20px;line-height: 15px;">已选规则信息</h4>');
		html.push('<tr >');         
		html.push('<td>流程单选规则名称：<input type="text"  id="flowLineRadioName" style="width:100px" readonly>');
		html.push('</td>');        
		html.push('<td>流程单选规则属性名称：<input type="text"  id="flowLineRadioContentName" style="width:100px" readonly>');
		html.push('</td>');         
		html.push('</tr>'); 
		html.push('</thead>');
		html.push('</table>'); 
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<h4 style="padding-left: 20px;line-height: 15px;">单选规则配置</h4>');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">选择</th>');              
		html.push('<th style="text-align:center">流程单选规则名称</th>');
		html.push('<th style="text-align:center">流程单选规则属性名称</th>');
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="flowRadioListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('</div>');
		
		
		
		
		html.push('<table border="0" id="tabs-1Table" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse;">');
		html.push('<tr>'); 
		html.push('<td style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
		html.push('</table>');  
		
		html.push('<table border="0" id="tabs-2Table" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse;display: none;">');
		html.push('<tr>'); 
		html.push('<td style="text-align:center;">');   
		html.push('<a href="javascript:void(0)"  class="but" name="radioInfoSubmit">确认</a>');
		 
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="radioInfoCloses">关闭</a>'); 
		html.push('</td>'); 
		html.push('</tr>'); 
		html.push('</table>');
		html.push('</div>');
		
		var authInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], // 去掉默认边框
		     //shade: [0], //去掉遮罩
		    // closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', // 从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var viewFlowRuleDetailPage=$("#viewFlowRuleDetailPage");
		var workflowId=parentThis.workflowInfo.workflowId;
		var line_id="";
		var flowRuleCode="";
		var flowRuleName="";
		var templateId="";
		var attr_value="";
		var attr_Id="";
		var currentNodeId="";
		var nextNodeId="";
		var param={								
				"handleType"	:	"qryLst",
	    		"dataSource"	:	"",
	    		"nameSpace"		:	"shortProcess",
	    		"sqlName"		:	"getNextLineInfo",			    		
	    		"currentNodeId"	:	id,			    		
	    		"workflowId"	:	workflowId,			    		
		};
		//查询节点线的下一节点信息
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if (json.code == "0") {	
				line_id=json.data[0].LINE_ID;
				currentNodeId=json.data[0].FROM_NODE_ID;
				nextNodeId=json.data[0].TO_NODE_ID;
			}else{
				layer.alert(msg);
			};
		}, param, false, false);
		//模板规则配置
		viewFlowRuleDetailPage.find("a[name=basicInfoShow]").unbind("click").bind("click",function(){
			$("#basicInfoShow").css("color",function(){
			    return "#000000";
		    });
			$("#indicatorsCAL").css("color","");
			$("#indicatorsShow").css("color","");
			$("#tabs-1").show();
			$("#tabs-1Table").show();
			$('#tabs-2').hide();
			$("#tabs-2Table").hide();
		});
		var radioType="";
		
		//单选规则配置
		viewFlowRuleDetailPage.find("a[name=indicatorsCAL]").unbind("click").bind("click",function(){
			var selectedRadio="";
			$("#indicatorsCAL").css("color",function(){
				return "#000000";
			});
			$("#basicInfoShow").css("color","");
			$("#indicatorsShow").css("color","");
			$("#tabs-1").hide();
			$("#tabs-1Table").hide();
			$("#tabs-2Table").show();
			$('#tabs-2').show();
			
			var paramLine={								
					"handleType"	:	"qryLst",
					"dataSource"	:	"",
					"nameSpace"		:	"shortProcess",
					"sqlName"		:	"queryRadioLineInfo",			    		
					"LineId"		:	id,			    		
					"workflowId"	:	workflowId		    		
			};
			//显示模板规则配置 
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				debugger;
				if (json.code == "0") {
					 if(json.data.length >0){
						 //radioType = "update"; 
						 $("#flowLineRadioName").val(json.data[0].RADIO_NAME);
						 $("#flowLineRadioContentName").val(json.data[0].CONTENT_NAME);
						
					 }else{
						 //radioType = "add";  
					 }
				}else{
					layer.alert("查无数据!");
				};
			}, paramLine, false, false);
			
//			var paramLine={								
//					"handleType"	:	"qryLst",
//					"dataSource"	:	"",
//					"nameSpace"		:	"shortProcess",
//					"sqlName"		:	"queryRadioLineInfo",	
//					"currentNodeId"	:	id,
//					"workflowId"	:	workflowId		    		
//			};
//			//显示模板规则配置 
//			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//				debugger;
//				if (json.code == "0") {	
//					
//					 if(json.data.length >0){
//						 radioType = "update"; 
//						 selectedRadio = json.data[0].CONTENT_ID;
//					 }else{
//						 radioType = "add";  
//					 }
//				}else{
//					layer.alert("查无数据!");
//				};
//			}, paramLine, false, false);
			
			var listBodyObj = viewFlowRuleDetailPage.find("tbody[name=flowRadioListBody]");
			listBodyObj.html("");
			radioType = "add";
			if(radioType=="add"){
				debugger;
				var param={								
						"handleType"	:	"qryLst",
			    		"dataSource"	:	"",
			    		"nameSpace"		:	"shortProcess",
			    		"sqlName"		:	"getWorkFlowRadioInfo",			    		
			    		"currentNodeId"	:	id,			    		
			    		"workflowId"	:	workflowId,			    		
				};
				//查询上节点单选规则ID及属性  flowRadioListBody
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					debugger;
					var html=[];
					var dataLst = json.data;
					if(dataLst.length > 0 ){
						var param={								
								"handleType"	:	"qryLst",
					    		"dataSource"	:	"",
					    		"nameSpace"		:	"shortProcess",
					    		"sqlName"		:	"getWorkFlowRadioInfo1",			    		
					    		"currentNodeId"	:	id,			    		
					    		"workflowId"	:	workflowId,			    		
						};
						//查询上节点单选规则ID及属性  flowRadioListBody
						$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							var dataLsts = json.data;
							if(dataLsts.length > 0 ){
								for(var i=0;i<dataLst.length;i++){
									var isExist = false;
									var obj = dataLst[i];
									for(var j=0;j<dataLsts.length;j++){
										if(dataLst[i].CONTENT_ID==dataLsts[j].CONTENT_ID){
											isExist = true;
								            break;
										}
									}
									if(!isExist){
										html.push('<tr radio_Content_Value='+obj.CONTENT_VALUE+' radio_Content_Id='+obj.CONTENT_ID+' radio_Id='+obj.RADIO_ID+'>');
										html.push('<td ><input type="radio" name="flowRuleRadio" style="width:6%" /></td>');
										html.push('<td >'+obj.RADIO_NAME+'</td>');
										html.push('<td >'+obj.CONTENT_NAME+'</td>');
										html.push('</tr>');
								    }
								}
							}else{
								for(var i=0;i<dataLst.length;i++){
									var obj = dataLst[i];
									html.push('<tr radio_Content_Value='+obj.CONTENT_VALUE+' radio_Content_Id='+obj.CONTENT_ID+' radio_Id='+obj.RADIO_ID+'>');
									html.push('<td ><input type="radio" name="flowRuleRadio" style="width:6%" /></td>');
									html.push('<td >'+obj.RADIO_NAME+'</td>');
									html.push('<td >'+obj.CONTENT_NAME+'</td>');
									html.push('</tr>');
								}
							}
						}, param, false, false);
					}else{
						html.push('<tr>');
						html.push('<td colspan="3">无相关数据</td>');
						html.push('</tr>');
					}
					listBodyObj.html(html.join(''));
				}, param, false, false);
			}else{
				debugger;
				var param={								
						"handleType"	:	"qryLst",
			    		"dataSource"	:	"",
			    		"nameSpace"		:	"shortProcess",
			    		"sqlName"		:	"getWorkFlowRadioInfo",			    		
			    		"currentNodeId"	:	id,			    		
			    		"workflowId"	:	workflowId,			    		
				};
				//查询上节点单选规则ID及属性  flowRadioListBody
				$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
					debugger;
					var html=[];
					var dataLst = json.data;
					if(dataLst.length > 0 ){
						$.each(dataLst,function(i,obj){
							var param={								
									"handleType"	:	"qryLst",
						    		"dataSource"	:	"",
						    		"nameSpace"		:	"shortProcess",
						    		"sqlName"		:	"getWorkFlowRadioInfo1",			    		
						    		"currentNodeId"	:	id,			    		
						    		"workflowId"	:	workflowId,			    		
							};
							//查询上节点单选规则ID及属性  flowRadioListBody
							$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
								var dataLsts = json.data;
								if(dataLsts.length > 0 ){
									$.each(dataLsts,function(i,obj1){
										debugger;//selectedRadio!=obj.CONTENT_ID
										
										if(obj.CONTENT_ID!=obj1.CONTENT_ID){
												html.push('<tr radio_Content_Value='+obj.CONTENT_VALUE+' radio_Content_Id='+obj.CONTENT_ID+' radio_Id='+obj.RADIO_ID+'>');
												html.push('<td ><input type="radio" name="flowRuleRadio" style="width:6%" /></td>');
												html.push('<td >'+obj.RADIO_NAME+'</td>');
												html.push('<td >'+obj.CONTENT_NAME+'</td>');
												html.push('</tr>');
										}
									});
								}else{
									html.push('<tr>');
									html.push('<td colspan="3">无相关数据</td>');
									html.push('</tr>');
								}
								listBodyObj.html(html.join(''));
							}, param, false, false);
						});
					}else{
						html.push('<tr>');
						html.push('<td colspan="3">无相关数据</td>');
						html.push('</tr>');
					}
					listBodyObj.html(html.join(''));
				}, param, false, false);
			}

		});
		
		var type="";
		var paramLine={								
				"handleType"	:	"qryLst",
				"dataSource"	:	"",
				"nameSpace"		:	"shortProcess",
				"sqlName"		:	"queryFlowLineRuleInfo",			    		
				"LineId"		:	id,			    		
				"workflowId"	:	workflowId,			    		
		};
		//显示当前节点线，规则 
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			if (json.code == "0") {	
				 if(json.data.length >0){
					 type = "update"; 
					 $("#flowLineNodeName").val(json.data[0].NODE_NAME);
					 $("#flowLineRuleName").val(json.data[0].FLOWRULECONTENT);
					 $("#flowLineTemplateName").val(json.data[0].ATTR_NAME);
				 }else{
					 type = "add";  
				 }
			}else{
				layer.alert(msg);
			};
		}, paramLine, false, false);		
		//确认模板规则配置
		$("#viewFlowRuleDetailPage").find("a[name='infoSubmit']").bind("click",function(){	
			debugger;
			var listBodyObj = viewFlowRuleDetailPage.find("tbody[name=flowRuleListBody]");
			var radios=listBodyObj.find("tr").find("td input[type='radio']");
			var count=0;
			$.each(radios,function(){
				if($(this).prop("checked")){
					count++;
					var flowRuleCodes=$(this).parent().parent().attr("flowRuleCode");
					var flowRuleNames=$(this).parent().parent().attr("flowRuleName");
					flowRuleCode=flowRuleCodes;
					flowRuleName=flowRuleNames;
				}
			});
			debugger;
			if(count==0){
				layer.alert('请选择规则!',8);
				return false;
			}
			var listBodyObj = viewFlowRuleDetailPage.find("tbody[name=flowTemplateListBody]");
			var radios=listBodyObj.find("tr").find("td input[type='radio']");
			var counts=0;
			$.each(radios,function(){
				if($(this).prop("checked")){
					counts++;
					var attr_Ids=$(this).parent().parent().attr("attr_Id");
					var attr_Values=$(this).parent().parent().attr("attr_Value");
					var templateIds=$(this).parent().parent().attr("templateId");
					attr_Id=attr_Ids;
					attr_value=attr_Values;
					templateId=templateIds;
				}
			});
			if(counts==0){
				layer.alert('请选择模板属性!',8);
				return false;
			}
			var nodeParam={};
			if(type=="update"){
				nodeParam={
						"handleType"			:	"upd",
			    		"dataSource"			:	"",
			    		"nameSpace"				:	"shortProcess",
			    		"sqlName"				:	"updateFlowRuleLine",
						"workflowId"			:	workflowId,
						"flowRuleCode"			:	flowRuleCode,
						"flowRuleName"			:	flowRuleName,
						"attr_Id"				:	attr_Id,
						"attr_value"			:	attr_value,
						"templateId"			:	templateId,
						"line_id"				:	line_id
				};
			}else{
				 nodeParam={
						"handleType"			:	"add",
			    		"dataSource"			:	"",
			    		"nameSpace"				:	"shortProcess",
			    		"sqlName"				:	"addFlowRuleLine",
						"workflowId"			:	workflowId,
						"flowRuleCode"			:	flowRuleCode,
						"flowRuleName"			:	flowRuleName,
						"currentNodeId"			:	currentNodeId,
						"nextNodeId"			:	nextNodeId,
						"attr_Id"				:	attr_Id,
						"attr_value"			:	attr_value,
						"templateId"			:	templateId,
						"line_id"				:	line_id
				};
			}
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code=="0"){
					layer.alert("配置成功",1);
					layer.close(authInfoPage);
				}else{
					layer.alert("配置失败",8);
				}
			},nodeParam,true);
		});
		
		//确认单选规则配置
		$("#viewFlowRuleDetailPage").find("a[name='radioInfoSubmit']").bind("click",function(){
			var listBodyObj = viewFlowRuleDetailPage.find("tbody[name=flowRadioListBody]");
			var radios=listBodyObj.find("tr").find("td input[type='radio']");
			var counts=0;
			var radio_Id;
			var radio_Content_Id;
			var radio_Content_Value;
			$.each(radios,function(){
				if($(this).prop("checked")){
					counts++;
					var radio_Ids=$(this).parent().parent().attr("radio_Id");
					var radio_Content_Ids=$(this).parent().parent().attr("radio_Content_Id");
					var radio_Content_Values=$(this).parent().parent().attr("radio_Content_Value");
					radio_Id=radio_Ids;
					radio_Content_Id=radio_Content_Ids;
					radio_Content_Value=radio_Content_Values;
				}
			});
			if(counts==0){
				layer.alert('请选择规则属性!',8);
				return false;
			}// radioType = "update"; 
			//var checks =0;
			var param={								
					"handleType"		:	"qryLst",
		    		"dataSource"		:	"",
		    		"nameSpace"			:	"shortProcess",
		    		"sqlName"			:	"checkWorkFlowRadioInfo",			    		
		    		"currentNodeId"		:	id,			    		
		    		"radio_Content_Id"	:	radio_Content_Id,			    		
			};
			//查询上节点单选规则ID及属性  flowRadioListBody
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				debugger;
				if(json.data.length > 0){
					layer.alert('该属性已选择，请重新选择属性!',8);
					return false;
				}
			}, param, false, false);
			//if(checks!=0){
				var nodeParam={};
//				if(radioType=="update"){
//					nodeParam={
//							"handleType"			:	"upd",
//				    		"dataSource"			:	"",
//				    		"nameSpace"				:	"shortProcess",
//				    		"sqlName"				:	"updateRadioLineInfo",
//							"workflowId"			:	workflowId,
//							"radio_Id"				:	radio_Id,
//							"radio_Content_Id"		:	radio_Content_Id,
//							"radio_Content_Value"	:	radio_Content_Value,
//							"LineId"				:	id
//					};
				//}else{
					 nodeParam={
								"handleType"			:	"add",
					    		"dataSource"			:	"",
					    		"nameSpace"				:	"shortProcess",
					    		"sqlName"				:	"addRadioLineInfo",
								"workflowId"			:	workflowId,
								"radio_Id"				:	radio_Id,
								"radio_Content_Id"		:	radio_Content_Id,
								"radio_Content_Value"	:	radio_Content_Value,
								"nowNodeId"			    :	currentNodeId,
								"nextNodeId"			:	nextNodeId,
								"line_id"				:	id
						};
				//}
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code=="0"){
					layer.alert("配置成功",1);
					layer.close(authInfoPage);
				}else{
					layer.alert("配置失败",8);
				}
			},nodeParam,true);
			//}
		});
		
		// 关闭
		viewFlowRuleDetailPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		// 关闭
		viewFlowRuleDetailPage.find("a[name=radioInfoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		// 取消
		viewFlowRuleDetailPage.find("a[name=cancel]").unbind("click").bind("click",function(){
			$("input[name=flowRuleNames]").val("");
			$("input[name=flowRuleDescribe]").val("");
		});
		//查询
		viewFlowRuleDetailPage.find("a[name=senior]").unbind("click").bind("click",function(){
			parentThis.queryFlowRuleLists(parentThis);
		});
		parentThis.queryFlowRuleLists(parentThis);
	},
	//查询规则信息
	queryFlowRuleLists : function(parentThis) {
		
		var viewFlowRuleDetailPageDiv = $("#viewFlowRuleDetailPage");
		//规则名称
		var flowRuleNameObj = viewFlowRuleDetailPageDiv.find("input[name=flowRuleName]");
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"flowRuleName" 		: flowRuleNameObj.val(),
				 "hanleType"        : "qryFlowRuleInfo"
			};
			var flowRuleListFootObj = viewFlowRuleDetailPageDiv.find("div[name=flowRuleListFoot]");
			
			common.pageControl.start(URL_QUERY_FLOWRULE.encodeUrl(),
									 pageIndex,
									 pageSize,
									 param,
									 "data",
									 null,
									 flowRuleListFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = viewFlowRuleDetailPageDiv.find("tbody[name=flowRuleListBody]");
				listBodyObj.html("");
				parentThis.createFlowRuleListHtml(parentThis,data,listBodyObj);
			});
	},
	//显示数据
	createFlowRuleListHtml : function(parentThis,data,listBodyObj) {
		
		var html=[];
		var dataLst = data.data;
		var viewFlowRuleDetailPageDiv = $("#viewFlowRuleDetailPage");
		var listFootObj = viewFlowRuleDetailPageDiv.find("div[name=flowRuleListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				var flowRuleDescribe = obj.FLOWRULEDESCRIBE;
				var flowRuleDescribe1 = flowRuleDescribe.split(".")[0];
				if(flowRuleDescribe.length > 7){
					flowRuleDescribe = flowRuleDescribe.substring(0, 5) + "..."
					+ flowRuleDescribe1.substring(flowRuleDescribe1.length-2, flowRuleDescribe1.length)
					;
				}
				var flowRuleContent = obj.FLOWRULECONTENT;
				var flowRuleContent1 = flowRuleContent.split(".")[0];
				if(flowRuleContent.length > 7){
					flowRuleContent = flowRuleContent.substring(0, 5) + "..."
					+ flowRuleContent1.substring(flowRuleContent1.length-2, flowRuleContent1.length)
					;
				}
				html.push('<tr flowRuleCode='+obj.FLOWRULECODE+' flowRuleName='+obj.FLOWRULENAME+' flowRuleDescribe='+obj.FLOWRULEDESCRIBE+'>');
				html.push('<td ><input type="radio" name="flowRuleRadio" style="width:10%" /></td>');
				html.push('<td >'+obj.FLOWRULECODE+'</td>');
				html.push('<td >'+obj.FLOWRULENAME+'</td>');
				html.push('<td title='+obj.FLOWRULECONTENT+'>'+flowRuleContent+'</td>');
				html.push('<td title='+obj.FLOWRULEDESCRIBE+'>'+flowRuleDescribe+'</td>');
				if(obj.FLOWRULESTATUS=="1"){
					html.push('<td >有效</td>');
				}else{
					html.push('<td ></td>');
				}
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="6">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));

		parentThis.queryFlowTemplateLists(parentThis);
		//var listBodyObj = viewFlowRuleDetailPageDiv.find("tbody[name=flowRuleListFoot]");
	},
	//查询流程对应模板属性信息
	queryFlowTemplateLists : function(parentThis) {
		
		var viewFlowRuleDetailPageDiv = $("#viewFlowRuleDetailPage");
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"handleType"	:	"qry",
	    		"dataSource"	:	"",
	    		"nameSpace"		:	"shortProcess",
	    		"sqlName"		:   "getFlowTemplateList",
	    		"workflowId"	:	parentThis.workflowInfo.workflowId
			};
			//var listFootObj =$("#hasSolveProcessFoot");tbody[name=flowRuleListBody]
			var listFootObj = viewFlowRuleDetailPageDiv.find("div[name=flowTemplateListFoot]");
//		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//			if(json.code == "0" ){				
//				
//				var html=[];
//				var dataLst = json.data;
//				//var viewFlowRuleDetailPageDiv = $("#viewFlowRuleDetailPage");
//				//var listFootObj = viewFlowRuleDetailPageDiv.find("div[name=flowTemplateListFoot]");
//				var listBodyObj =  viewFlowRuleDetailPageDiv.find("tbody[name=flowTemplateListBody]")
//				if(dataLst.length > 0 ){
//					//listFootObj.show();
//					$.each(dataLst,function(i,obj){
//						html.push('<tr attr_Id='+obj.ATTR_ID+' attr_Value='+obj.ATTR_ONAME+' templateId='+obj.TEMPLATE_ID+'>');
//						html.push('<td ><input type="radio" name="flowTemplateRadio" style="width:7%" /></td>');
//						html.push('<td >'+obj.ATTR_NAME+'</td>');
//						html.push('<td >'+obj.ATTR_TYPE+'</td>');
//						html.push('<td >'+obj.ATTR_ONAME+'</td>');
//						html.push('</tr>');
//					});
//				}else{
//					//listFootObj.hide();
//					html.push('<tr>');
//					html.push('<td colspan="4">无相关数据</td>');
//					html.push('</tr>');
//				}
//				listBodyObj.html(html.join(''));
//				
//				//var listBodyObj = viewFlowRuleDetailPageDiv.find("tbody[name=flowRuleListFoot]");
//			
//			}
//		}, param, false,false);
			common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
					 pageIndex,
					 pageSize,
					 param,
					 "data",
					 null,
					listFootObj,
					 "",
					 function(data,dataSetName,showDataSpan){
						var listBodyObj =  viewFlowRuleDetailPageDiv.find("tbody[name=flowTemplateListBody]");
						listBodyObj.html("");
						//展示列表
						parentThis.createFlowTemplateLstHtml(parentThis,data,listBodyObj);
			});
	},
	//显示数据
	createFlowTemplateLstHtml : function(parentThis,data,listBodyObj) {
		
		var html=[];
		var dataLst = data.data;
		var viewFlowRuleDetailPageDiv = $("#viewFlowRuleDetailPage");
		var listFootObj = viewFlowRuleDetailPageDiv.find("div[name=flowTemplateListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr attr_Id='+obj.ATTR_ID+' attr_Value='+obj.ATTR_ONAME+' templateId='+obj.TEMPLATE_ID+'>');
				html.push('<td ><input type="radio" name="flowTemplateRadio" style="width:7%" /></td>');
				html.push('<td >'+obj.ATTR_NAME+'</td>');
				html.push('<td >'+obj.ATTR_TYPE+'</td>');
				html.push('<td >'+obj.ATTR_ONAME+'</td>');
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="4">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
		
		//var listBodyObj = viewFlowRuleDetailPageDiv.find("tbody[name=flowRuleListFoot]");
	},
	queryClockDeptInfo:function(parentThis,disType){
		debugger;
		
		var param={								
				"handleType":"qryLst",
	    		"dataSource":"",
	    		"nameSpace":"shortProcess",
	    		"sqlName":"searchClockDeptInfo",			    		
	    		"disType":disType		    		
		};
		
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				var html1=[];									
				html1.push('<div  style="overflow-x: auto; overflow-y: auto;height:480px;">');
				$.each(json.data,function(i,obj){	
					debugger;
						html1.push('<div id ="'+obj.DEPT_TYPE_ID+'" orgName="'+obj.DEPT_TYPE_NAME+'" name="divfu" latnCode = "'+obj.DEPT_TYPE_ID+'" style="font-size:15px;cursor:pointer;margin-top: 5px;">'+obj.DEPT_TYPE_NAME+'</div>');								
			});				
				html1.push('</div>');
				$("#processDiv").html(html1.join(''));		
			}else{
				layer.alert(msg);
			};
		}, param, false, false);	
		
		//点击本地网
		$("#processDiv").find("div[name='divfu']").each(function(index){
		debugger;
			var fuId=$(this).attr("id");
		    alert("fuId:"+fuId);
			$("#"+fuId+"").unbind("click").bind("click",function(){
				params={							
						"handleType":"qry",
			    		"dataSource":"",
			    		"nameSpace":"shortProcess",
			    		"dept_type_Id": fuId,
			    		"disType":disType,
			    		"sqlName":"searchDeptTypeId"	    	
				};	
				//下面展示数据
				var noticeLstFootObj=$("#chooseDeptAndExecuterFoot");						
					common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
										 '0',
										 '10',
										 params,
										 "data",
										 null,
										 noticeLstFootObj,
										 "",
											 function(data,dataSetName,showDataSpan){
						var noticeLstBodyObj=$("#chooseDeptAndExecuterBody");						
						noticeLstBodyObj.html("");
						parentThis.createDisTypeInfoHtml(parentThis,data,noticeLstBodyObj,noticeLstFootObj);
					});
			});
		});
	},
	//创建按查询展示部门及岗位
	createDisTypeInfoHtml : function(parentThis,data,noticeLstBodyObj,noticeLstFootObj){		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			noticeLstFootObj.show();
			$.each(data.data,function(i,obj){
				
				html.push('<tr name="staffInfo" POST_ID="'+obj.POST_ID+'" POST_NAME="'+obj.POST_NAME+'" DEPT_TYPE_ID="'+obj.DEPT_TYPE_ID+'" DEPT_LEVEL="'+obj.DEPT_LEVEL+'" DEPT_TYPE_NAME="'+obj.DEPT_TYPE_NAME+'">');
				html.push('<td><input type="radio" name="dept"  style="width: 8%;" ></td>');
				html.push('<td>'+obj.DEPT_TYPE_NAME+'</td>');
				html.push('<td>'+obj.POST_NAME+'</td>');		
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
};
