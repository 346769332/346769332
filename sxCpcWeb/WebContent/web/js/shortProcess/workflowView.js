var WorkflowView = new Function();
workflowView.prototype = {
	selecter : "#maintainWorkflowPage",
	//初始化执行
	init : function(param) {
		this.workflowInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		//加载流程数据
		parentThis.loadWorkFlowData(parentThis);

		var chooseTemplateObj =  parentThis.selecter.findById("a","chooseTemplate")[0];
		//选择模板
		chooseTemplateObj.unbind("click").bind("click",function(){
			parentThis.queryTemplateList(parentThis);
		});
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
			debugger;
			parentThis.queryTemplateLists(parentThis);
		});
		parentThis.queryTemplateLists(parentThis);
	},
	//查询模板信息
	queryTemplateLists : function(parentThis) {
		debugger;
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
			debugger;
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
		debugger;
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
	
	loadWorkFlowData:function(parentThis){
		//显示流程信息
		$.jump.ajax(URL_QUERY_WORKFLOWlIST.encodeUrl(), function(json) {
			var obj=json.data;
			debugger;
			$("#workflowName").val(obj.WORKFLOW_NAME);
			$("#workflowClass").val(obj.WORKFLOW_SORT);
			$("#workflowType").val(obj.WORKFLOW_TYPE);
			//回显本地网
			var html=[];
			html.push("适用本地网&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
			html.push("<input type='checkbox' style='width:2%'  checked='checked' disabled='disabled'>"+obj.REGION_NAME+"");
			$("#wlan").html(html.join(''));
		},param,true);
		
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
				debugger;
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
			 			//var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
			 			var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
			 			jsonnodes+=nodes+",";
			 		});
			 		jsonnodes="{"+jsonnodes.substring(0,jsonnodes.length-1)+"}";
			 		var jsonnodesObj=eval("("+jsonnodes+")");
			 		
			 		var lineNum=json.lineNum;
			 		var jsonlines="";
			 		$.each(json.data.lines,function(i,obj){
			 			//var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+""+'"'+"}";
			 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+obj.LINE_NAME+'"'+"}";
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
			  			debugger;
			  			console.log($("#workflow div div div#1095"))
			  			$("#workflow div div div#1095").unbind("moveNode");
			  		}else{
			  			layer.alert("加载失败");
			  		};
			 	}, param, true);
			 
			 	
				demo.onItemFocus=function(id,model){
					var nodeParam={
							"nodeId"	:	id
					};
					if(model=="node"){
						$.jump.ajax(URL_QUERY_NODEINFO.encodeUrl(), function(json) {
							$.each(json.data,function(i,obj){
								/***********************回显数据*********************/
								//流程环节
								$("#nodesName").text(obj.NODE_NAME);
								//流程环节处理要求(处理部门、处理人、处理动作、处理时限)
								$("#nodeExecuteDepart").val(obj.NODE_EXECUTE_DEPART);
								$("#nodeExecutor").val(obj.NODE_EXECUTOR);
								$("#disposeAction").val(obj.DISPOSE_ACTION);
								$("#timeLimit").val(obj.TIME_LIMIT);
								var isSupport=obj.IS_SUPPORT;
								$("#isOrNotZhicheng option").each(function(){
									if($(this).val()==toPrevNode){
										$(this).attr("selected","selected");
									}
								});
								var toPrevNode=obj.TO_PREV_NODE;
								$("#toPrevNode option").each(function(){
									if($(this).val()==toPrevNode){
										$(this).attr("selected","selected");
									}
								});
								var toBeginNode=obj.TO_BEGIN_NODE;
								$("#toBeginNode option").each(function(){
									if($(this).val()==toBeginNode){
										$(this).attr("selected","selected");
									}
								});
								//下环节流转要求
								$("#toNextnodeCondition").text(obj.TO_NEXTNODE_CONDITION);//
								//流程环节支撑情况
								if(obj.TO_NEXTNODE_CONDITION==null || obj.TO_NEXTNODE_CONDITION==""){
									$("#stateDetail").val("未处理");
								}else{
									$("#stateDetail").val("已处理:"+obj.TO_NEXTNODE_CONDITION);
								}
								$("#tloverTime").val(obj.TLOVER_TIME);
								
							});
						},nodeParam,true);
						//画页面
						parentThis.viewNodeDetail(parentThis,id);
					}
				};
				
/** ******************************************加载流程图end************************************************** */		
	},
	// 节点详细
	viewNodeDetail:function(parentThis,nodeId){
		var html = [];
		html.push('<div  id="viewNodeDetailPage" class="tanchu_box"  style="width:800px;">');
		html.push('<h3 id="title">节点详细</h3>');
		html.push('<table border="0" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		html.push('<tr  style="background: #ebf6ff;">');         
		html.push('<td style="width:20%;">流程环节</td>');         
		html.push('<td style="width:50%">流程环节处理要求</td> ');         
		html.push('<td style="width:35%;">下环节流转要求</td> ');         
		html.push('<td>流程环节支撑情况</td>');         
		html.push('</tr>');
		
		html.push('<tr>');         
		html.push('<td  id="nodesName" rowspan="8" ></td>');         
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td style="height:45px">处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:250px" readonly><input type="hidden" name="nodeExecuteDepartId" id="nodeExecuteDepartId" style="width:180px" readonly></td>');         
		html.push('<td rowspan="7" id="toNextnodeCondition"></td>');         
		html.push('<td rowspan="7"><input type="text" name="stateDetail" id="stateDetail" style="width:180px" readonly><br/><br/><br/><input type="text" name="tloverTime" id="tloverTime" style="width:180px" readonly></td>');           
		html.push('</tr>'); 
		
		html.push('<tr>');         
		html.push('<td>处理人&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:250px" readonly><input type="hidden" name="nodeExecutorId" id="nodeExecutorId" style="width:180px" readonly></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>处理动作:<input type="text" name="disposeAction" id="disposeAction" style="width:250px" ></td>');         
		html.push('</tr>');    
		
		html.push('<tr> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:250px" ></td>');         
		html.push('</tr>');   
		
		html.push('<tr> ');         
		html.push('<td>是否支撑:<select name="isOrNotZhicheng" id="isOrNotZhicheng"><option value="1">是</option><option value="0">否</option></select></td>');        
		html.push('</tr>'); 
		
		html.push('<tr> ');         
		html.push('<td>是否返回上一步:<select name="toPrevNode" id="toPrevNode"><option value="1">是</option><option value="0">否</option></select></td>');        
		html.push('</tr>'); 
		
		html.push('<tr> ');         
		html.push('<td>是否返回初始节点:<select name="toBeginNode" id="toBeginNode"><option value="1">是</option><option value="0">否</option></select></td>');        
		html.push('</tr>'); 
		
		html.push('<tr> '); 
		html.push('<td colspan="6" style="text-align:center;">');   
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
		var workflowId=parentThis.workflowInfo.workflowId
		$("#viewNodeDetailPage").find("a[name='infoSubmit']").bind("click",function(){
			//指定节点处理人和处理部门后,进行更新数据
			var nodeExecuteDepart=$("#viewNodeDetailPage #nodeExecuteDepart").val();
			var nodeExecuteDepartId=$("#viewNodeDetailPage #nodeExecuteDepartId").val();
			var nodeExecutor=$("#viewNodeDetailPage #nodeExecutor").val();
			var nodeExecutorId=$("#viewNodeDetailPage #nodeExecutorId").val();
			var disposeAction=$("#viewNodeDetailPage #disposeAction").val();
			var timeLimit=$("#viewNodeDetailPage #timeLimit").val();
			var isOrNotZhichengObj=$("#viewNodeDetailPage").find("select[name=isOrNotZhicheng]");
			var isOrNotZhicheng = isOrNotZhichengObj.find('option:selected').attr('value');
			var toPrevNodeObj=$("#viewNodeDetailPage").find("select[name=toPrevNode]");
			var toPrevNode = toPrevNodeObj.find('option:selected').attr('value');
			var toBeginNodeObj=$("#viewNodeDetailPage").find("select[name=toBeginNode]");
			var toBeginNode = toBeginNodeObj.find('option:selected').attr('value');
			var nodeParam={
					"workflowId"			:	workflowId,
					"nodeId"				:	nodeId,
					"nodeExecuteDepart"		:	nodeExecuteDepart,
					"nodeExecuteDepartId"	:	nodeExecuteDepartId,
					"nodeExecutor"			:	nodeExecutor,
					"nodeExecutorId"		:	nodeExecutorId,
					"disposeAction"			:	disposeAction,
					"timeLimit"				:	timeLimit,
					"isOrNotZhicheng"		:	isOrNotZhicheng,
					"toPrevNode"			:	toPrevNode,
					"toBeginNode"			:	toBeginNode
			};
			$.jump.ajax(URL_UPDATE_NODEDATA.encodeUrl(), function(json) {
				if(json.code=="0"){
					layer.close(authInfoPage);
				}
			},nodeParam,true);
		});
		
		// 关闭
		viewNodeDetailPage.find("a[name=infoCloses]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		//选择节点部门
		var nodeExecuteDepartObj = $("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']");
			nodeExecuteDepartObj.unbind("click").bind("click",function(){

			var xthtml = [];
			xthtml.push('<div class="tanchu_box" id="selectXTStaffInfoPage"  style="width:850px;height:400px;overflow-x:hidden;overflow-y:auto;">');
			xthtml.push('<h3>选择部门</h3>');
			xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
			xthtml.push('<div style="margin-top: 20px;"><a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
			xthtml.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a></div>');  
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
			var staff_ids; var staff_names; var DEPARTMENT_NAMES; var DEPARTMENT_CODES;var DEPARTMENT_ID;
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
						staff_ids = trObj.attr("staff_id");				
						staff_names=trObj.attr("staff_name");
						DEPARTMENT_NAMES=trObj.attr("DEPARTMENT_NAME");
						DEPARTMENT_CODES=trObj.attr("DEPARTMENT_CODE");
						DEPARTMENT_ID=trObj.attr("DEPARTMENT_ID");
						if(boxObj.length==0){
							layer.alert("请选择处理人及部门!",8);
							return false;
						}
						debugger
						$("#viewNodeDetailPage").find("input[id='nodeExecutor']").val(staff_names);
						$("#viewNodeDetailPage").find("input[id='nodeExecutorId']").val(staff_ids);
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepartId']").val(DEPARTMENT_ID);
						$("#viewNodeDetailPage").find("input[id='nodeExecuteDepart']").val(DEPARTMENT_NAMES);
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
	    		"dataSource":"ora",
	    		"nameSpace":"shortProcess",
	    		"sqlName":"searchland",			    		
		};
		//查询本地网
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
	
			if (json.code == "0") {
				regionName=json.currUser.regionName;
				regionId=json.currUser.regionId;
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
	    		"dataSource":"ora",
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
				html.push('<tr name="staffInfo" staff_id="'+obj.STAFF_ID+'" staff_name="'+obj.STAFF_NAME+'" DEPARTMENT_ID="'+obj.DEPARTMENT_ID+'" DEPARTMENT_NAME="'+obj.ORG_NAME+'"  DEPARTMENT_CODE="'+obj.DEPARTMENT_CODE+'" MOB_TEL="'+obj.MOB_TEL+'" >');
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
		//单选
		noticeLstBodyObj.find("input[type=radio]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			noticeLstBodyObj.find("input[type=radio]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
		
	}
};
