var CreateWorkflow = new Function();
CreateWorkflow.prototype = {
	selecter : "#createWorkflowPage",
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		$(".GooFlow_tool_div").css("height","360px");
		var regionId="";
		var regionName="";
		debugger;
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

		//下拉动态
		var workflowClass_Obj = $("#workflowClass");
		workflowClass_Obj.unbind("change").bind("change",function(){
			var workflowClassObj=$("#workflowClass");
			var workflowClass=workflowClassObj.find("option:selected").attr("value");
			debugger;
			//加载流程类型数据begin
			var typeParam={
				"flag"			:	2,	
				"workflowClass"	:	workflowClass	
			};
			$.jump.ajax(URL_QUERY_WORKFLOW_SORTANDTYPE.encodeUrl(), function(json) {
				if(json.code=="0"){
					var workflowTypeObj =  parentThis.selecter.findById("select","workflowType")[0];
					var dataObj=json.data;
					parentThis.createWorkflowTypeHtml(parentThis,dataObj,workflowTypeObj);
				}
			},typeParam,null,false,false);
			//加载流程类型数据end
		});
		
		
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
			regionId=json.regionId;
			regionName=json.regionName;
		},null,null,false,false);
		//隐藏 流程定制类型-- 市定制
//		if(regionId=="888"){
//			$("#workflowCustomType_2").hide();
//		}else{
//			$("#workflowCustomType_0").hide();
//			$("#workflowCustomType_1").hide();
//			
//		}
		if(regionId=="888"){
			//加载省级登录人员的本地网数据
			$.jump.ajax(URL_QUERY_SYS_REGION.encodeUrl(), function(json) {
				if(json.code==0){
					var allWlanObj =  parentThis.selecter.findById("td","allWlan")[0];
					var dataObj=json.data;
					parentThis.createSysRegionHtml(parentThis,dataObj,allWlanObj);
				}
			},null,true);
		}else{
			$("#workflowCustomType_2 input").attr("checked",true);
			var allWlanObj =  parentThis.selecter.findById("td","allWlan")[0];
			var html=[];
			html.push("<input  type='radio' style='width:3%;height: 15px;' value="+regionId+" regionName="+regionName+" name='localNet'>"+regionName+"");
			allWlanObj.html(html.join(''));
		}
		
		var chooseTemplateObj =  parentThis.selecter.findById("a","chooseTemplate")[0];
		//选择模板
		chooseTemplateObj.unbind("click").bind("click",function(){
			parentThis.queryTemplateList(parentThis);
		});
		var saveDraftObj =  parentThis.selecter.findById("a","saveDraft")[0];
		//保存草稿
		saveDraftObj.unbind("click").bind("click",function(){
		/**********************************校验流程信息begin***************************************/	
		var workflowName=$("#workflowName").val();
		if(workflowName==null || workflowName==""){
			layer.alert("请填写【流程名称】");
			return false;
		}
		var workflowClassObj=$("#workflowClass");
		var workflowClass=workflowClassObj.find("option:selected").attr("value");
		if(workflowClass==null || workflowClass==""){
			layer.alert("请选择【流程分类】");
			return false;
		}
		var workflowTypeObj=$("#workflowType");
		var workflowType=workflowTypeObj.find("option:selected").attr("value");
		if(workflowType==null || workflowType==""){
			layer.alert("请选择【流程类型】");
			return false;
		}
		//流程单类型
//		var workflowSingleType=$("input[type=radio][name=workflowSingleType]:checked").val();
//		if(workflowSingleType==undefined){
//			layer.alert("请选择【流程单类型】");
//			return false;
//		}
		//流程定制类型
//		var workflowCustomType=$("input[type=radio][name=workflowCustomType]:checked").val();
//		if(workflowCustomType==undefined){
//			layer.alert("请选择【流程定制类型】");
//			return false;
//		}
		//校验是否选择本地网
		var localCount=0;
		var localNetsObj=$("input[type=radio][name=localNet]");
		$.each(localNetsObj,function(i,obj){
			if($(this).prop("checked")==true){
				localCount++;
			}
		});
		if(localCount==0){
			layer.alert("请选择【本地网】");
			return false;
		}
		//add by dangzw begin 2016-12-05
		var workflowTemplateId=$("#workflowTemplateId").val();
		/*if(workflowTemplateId==null || workflowTemplateId==""){
			layer.alert("请选择【短流程需求模板】");
			return false;
		}*/
		//add by dangzw end 2016-12-05	
		/**********************************校验流程信息end***************************************/		
		/**********************************流程图校验begin***************************************/
			var jsonStr=JSON.stringify(demo.exportData());
			var jsonObj=eval("("+jsonStr+")");
			var startCount=0;
			var endCount=0;
			//自动节点数量
			var freeCount=0;
			$.each(jsonObj.nodes,function(i,obj){
				if(obj.type=="start round"){
					startCount++;
				}
				if(obj.type=="end round"){
					endCount++;
				}
				if(obj.type=="node"){
					freeCount++;
				}
			});
			if(startCount!=1){
				layer.alert("流程必须有且只有一个开始节点");
				return false;
			}
			if(freeCount==0){
				layer.alert("流程至少包含一个任务节点");
				return false;
			}
			if(endCount!=1){
				layer.alert("流程必须有且只有一个结束节点");
				return false;
			}
			//校验线的数量
			var jslength=0;
			var a=jsonObj.lines;
			for(var js2 in a){
				jslength++;
			}
			if(jslength==0){
				layer.alert("流程图不完整,请添加流程线!");
				return false;
			}
			//从节点出去线的数量
			var flagFrom=0;
			var fromB=true;
			$.each(jsonObj.nodes,function(i,objNode){
				var type=objNode.type;
				if(type!="end round"){
					$.each(jsonObj.lines,function(j,obj){
						if(obj.from==i){
							flagFrom++;
						}
					});
					if(flagFrom==0){
						fromB=false;
						return false;
					}else{
						flagFrom=0;
					}
				}
			});
			if(fromB==false){
				layer.alert("流程图不完整,请添加流程线!");
				return false;
			}
			//进入节点的线的数量
			var flagTo=0;
			var toB=true;
			$.each(jsonObj.nodes,function(i,objNode){
				var type=objNode.type;
				if(type!="start round"){
					$.each(jsonObj.lines,function(j,obj){
						if(obj.to==i){
							flagTo++;
						}
					});
					if(flagTo==0){
						toB=false;
						return false;
					}else{
						flagTo=0;
					}
				}
			});
			if(toB==false){
				layer.alert("流程图不完整,请添加流程线!");
				return false;
			}
			//校验节点上的名称
			var nameFlag=true;
			$.each(jsonObj.nodes,function(i,obj){
				debugger;
				var name=obj.name.replace(/\s/g,"");
				if(name=="任务名" || name==""){
					nameFlag=false;
					return false;
				}
			});
			if(nameFlag==false){
				layer.alert("节点名称不能为初始状态的【任务名】且不能为空!");
				return false;
			}	
		/*********************************流程图校验end*****************************************/
			
			var localNetObj=$("#createWorkflowPage").find("input[type=radio][name=localNet]:checked");
			var localNet=localNetObj.val();
			var regionName=localNetObj.attr("regionname");
			/*******************************节点数据begin************************************/
			var workflowAlias="";
			var nodeNames="";
			var nodeTypes="";
			var nodeLefts="";
			var nodeTops="";
			var nodeWidths="";
			var nodeHeights="";
	 		$.each(jsonObj.nodes,function(i,obj){
	 			/*"nodes": {
	 		        "demo_node_9": {
	 		            "name": "桂中区",
	 		            "left": 10,
	 		            "top": 10,
	 		            "type": "start round",
	 		            "width": 24,
	 		            "height": 24,
	 		            "alt": true
	 		        },
	 		        "demo_node_10": {
	 		            "name": "桂北区",
	 		            "left": 10,
	 		            "top": 81,
	 		            "type": "start round",
	 		            "width": 24,
	 		            "height": 24,
	 		            "alt": true
	 		        }
	 		    }
	 		    */
	 			//节点别名(例如上面中的demo_node_9和demo_node_10)
	 			workflowAlias+=i+",";
	 			nodeNames+=obj.name.replace(/[\r\n]/g,"")+",";
	 			nodeTypes+=obj.type+",";
	 			nodeLefts+=obj.left+",";
	 			nodeTops+=obj.top+",";
	 			nodeWidths+=obj.width+",";
	 			nodeHeights+=obj.height+",";
	 		});
	 		//截取最后一个逗号
	 		workflowAlias=workflowAlias.substring(0, workflowAlias.length-1);
	 		nodeNames=nodeNames.substring(0, nodeNames.length-1);
	 		nodeTypes=nodeTypes.substring(0, nodeTypes.length-1);
	 		nodeLefts=nodeLefts.substring(0, nodeLefts.length-1);
	 		nodeTops=nodeTops.substring(0, nodeTops.length-1);
	 		nodeWidths=nodeWidths.substring(0, nodeWidths.length-1);
	 		nodeHeights=nodeHeights.substring(0, nodeHeights.length-1);
			/*****************************节点数据end*****************************************/
			
			/*******************************线数据begin**************************************/
			var lineFroms="";
			var lineTos="";
			var lineTypes="";
			var lineMs="";
			var lineNames="";
	 		$.each(jsonObj.lines,function(i,obj){
	 			lineFroms+=obj.from+",";
	 			lineTos+=obj.to+",";
	 			lineTypes+=obj.type+",";
	 			lineMs+=obj.M+",";
	 			lineNames+=obj.name+",";
	 		});
	 		lineFroms=lineFroms.substring(0, lineFroms.length-1);
	 		lineTos=lineTos.substring(0, lineTos.length-1);
	 		lineTypes=lineTypes.substring(0, lineTypes.length-1);
	 		lineMs=lineMs.substring(0, lineMs.length-1);
	 		lineNames=lineNames.substring(0, lineNames.length-1);
			/*****************************线数据end******************************************/			
	 		var param={
	 				"pagePara"	:	"1",//表示从维护页面保存草稿
	 				"workflowName":workflowName,
	 				"workflowClass":workflowClass,
	 				"workflowType":workflowType,
	 				"workflowSingleType":0,
	 				"localNet":	localNet,
	 				"workflowTemplateId":	workflowTemplateId,
	 				
	 				"workflowAlias":workflowAlias,
	 				"nodeNames":nodeNames,
	 				"nodeTypes":nodeTypes,
	 				"nodeLefts":nodeLefts,
	 				"nodeTops":nodeTops,
	 				"nodeWidths":nodeWidths,
	 				"nodeHeights":nodeHeights,
	 				
	 				"lineFroms":lineFroms,
	 				"lineTos":lineTos,
	 				"lineTypes":lineTypes,
	 				"lineMs":lineMs,
	 				"lineNames":lineNames
	 		};
	 		debugger;
			$.jump.ajax(URL_ADD_WORKFLOW.encodeUrl(), function(json) {
				if(json.code==0){
					debugger;
					$.jump.loadHtmlForFun("/web/html/shortProcess/maintainWorkflow.html".encodeUrl(), function(menuHtml){
							$('#content').html(menuHtml);
							debugger;
							param={
									"workflowId"	:	json.workflowId,
									"workflowName"	:	workflowName,
									"workflowSort"	:	workflowClass,
									"workflowType"	:	workflowType,
									"workflowSingleType"	:	0,
									"regionName"	:	regionName,
									"wlanId"	    :	localNet,
									"methodType"	:	"getOneWorkflowData"
							};
							var maintainWorkflow=new MaintainWorkflow();
							maintainWorkflow.init(param);
						});
				}else{
					layer.alert("保存草稿失败");
				}
			},param,true);
		});
	},
	createWorkflowSortHtml:function(parentThis,dataObj,workflowClassObj){
		var html = [];
		html.push("<option value=''>==请选择==</option>");
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push("<option value='"+obj.ACT_WORKFLOW_SORT_ID+"'>"+obj.ACT_WORKFLOW_SORT_NAME+"</option>");
			});
		}
		workflowClassObj.html(html.join(''));
	},
	createWorkflowTypeHtml:function(parentThis,dataObj,workflowTypeObj){
		var html = [];
		html.push("<option value=''>==请选择==</option>");
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				html.push("<option value='"+obj.ACT_WORKFLOW_TYPE_ID+"'>"+obj.ACT_WORKFLOW_TYPE_NAME+"</option>");
			});
		}
		workflowTypeObj.html(html.join(''));
	},
	createSysRegionHtml:function(parentThis,dataObj,allWlanObj){
		var html = [];
//		html.push("使用本地网&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
		if(dataObj.length > 0 ){
			$.each(dataObj,function(i,obj){
				if(i==10){
					html.push("<br/>");
				}
				html.push("<input  type='radio' style='width:3%;height: 15px;' value="+obj.REGION_ID+" regionName="+obj.REGION_NAME+" name='localNet'>"+obj.REGION_NAME+"");
			});
		}else{
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		allWlanObj.html(html.join(''));
		/**********************************复选框的全选功能*******************************/
//		var checkObj =  parentThis.selecter.findById("input","all")[0];
//		checkObj.unbind("click").bind("click",function(){
//		    if($("#all").prop("checked") == true){
//		        $("input[name='localNet']").prop("checked",true);
//		    }else{
//		        $("input[name='localNet']").prop("checked",false);
//		    }
//		});
//		var wlanObj=$("input[name='localNet']");
//		$("input[name=localNet]").bind("click",function(){
//			if($("#all").prop("checked")== true){
//				$("#all").prop("checked",false);
//			}else{
//				var count=0;
//				$("input[name='localNet']").each(function(){
//					if($(this).prop("checked")== true){
//						count++;
//					}
//				});
//				if(count==dataObj.length){
//					$("#all").prop("checked",true);
//				}
//			}
//		});
		/**********************************复选框的全选功能*******************************/
	},
	//生成模板页面
	queryTemplateList : function(parentThis){
		var html = [];
		html.push('<div class="tanchu_box" id="templateListPage" style="width:850px;height:500px">');
		html.push('<h3>模板选择</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>模板名称：<input type="text" name="templateName" class="w150"></li>');
		html.push('<li>适用短流程类型:<select name="demandType" id="demandType" class="w150"><option value=""></option><option value="0">渠道工号流程</option><option value="1">签报单</option><option value="2">内联单</option></select></li>');
		html.push('<li>发布单位:<select name="departName" id="sendDepartName" class="w150"></select></li>');
		html.push('</ul>');
		
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>发布人:<input type="text" name="sendUserName" class="w150"></li>');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('<li><a href="#" class="but ml20" name="reset">重置</a></li>');
		html.push('</ul>');
		
		html.push('</div>');
				
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">选择</th>');         
		html.push('<th style="text-align:center">模板编号</th>');         
		html.push('<th style="text-align:center;width:20%">模板名称</th>');         
		html.push('<th style="text-align:center">发布单位</th>');         
		html.push('<th style="text-align:center">发布人</th> '); 
		html.push('<th style="text-align:center">发布时间</th> '); 
		html.push('<th style="text-align:center">状态</th> '); 
		html.push('<th style="text-align:center;width:15%"">适用短流程类型</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="templateListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="templateListFoot"></div>');
		html.push('<br/>');
		html.push('<div style="text-align:center;"><a href="#" class="but ml20" name="confirm">确定</a>&nbsp;&nbsp;');
		html.push('<a href="#" class="but hs_bg" name="back">返回</a></div>');
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
		
		//加载发布单位
		$.jump.ajax(URL_QUERY_SYS_REGION.encodeUrl(), function(json) {
			var wlansObj=json.data;
			var latnId=$("#sendDepartName");
			var html=[];
			html.push('<option value="">==请选择==</option>');
			html.push('<option value="888">省级</option>');
			if(wlansObj.length>0){
				$.each(wlansObj,function(i,obj){
					html.push('<option value="'+obj.REGION_ID+'">'+obj.REGION_NAME+'</option>');
				});
			}
			latnId.html(html.join(''));
		},null,null,false,false);
		
		parentThis.templateListPage=templateListPage;
		var templateListPageDiv = $("#templateListPage");
		
		var seniorObj = templateListPageDiv.find("a[name=senior]");
		seniorObj.unbind("click").bind("click",function(){
			parentThis.queryTemplateLists(parentThis);
		});
		var resetObj = templateListPageDiv.find("a[name=reset]");
		resetObj.unbind("click").bind("click",function(){
			$("input[name=templateName]").val("");
			$("input[name=sendUserName]").val("");
			$("select").val("");
		});
		var backObj = templateListPageDiv.find("a[name=back]");
		backObj.unbind("click").bind("click",function(){
			layer.close(parentThis.templateListPage);
		});
		var confirmObj = templateListPageDiv.find("a[name=confirm]");
		confirmObj.unbind("click").bind("click",function(){
			var listBodyObj = templateListPageDiv.find("tbody[name=templateListBody]");
			var radios=listBodyObj.find("tr").find("td input[type='radio']");
			var count=0;
			$.each(radios,function(){
				if($(this).prop("checked")){
					count++;
					layer.close(parentThis.templateListPage);
					var templateId=$(this).parent().parent().attr("templateId");
					var templateName=$(this).parent().parent().attr("templateName");
					$("#workflowTemplate").val(templateName);
					$("#workflowTemplateId").val(templateId);
				}
			});
			if(count==0){
				layer.alert('请选择模板!',8);
				return false;
			}
		});
		
		parentThis.queryTemplateLists(parentThis);
	},
	//查询模板信息
	queryTemplateLists : function(parentThis) {
		debugger;
		var templateListPageDiv = $("#templateListPage");
//		//需求模板名称
		var templateNameObj = templateListPageDiv.find("input[name=templateName]");
		//发布人
		var sendUserNameObj = templateListPageDiv.find("input[name=sendUserName]");
		//适用流程类型
		var demandTypeObj = templateListPageDiv.find("select[name=demandType]").find("option:selected");
		//发布单位
		var departNameObj = templateListPageDiv.find("select[name=departName]").find("option:selected");
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"templateName" 		: templateNameObj.val(),
				"sendUserName" 		: sendUserNameObj.val(),
				"applyWorkflowType" : demandTypeObj.val(),
				"departName" 		: departNameObj.val()
			};
			var templateListFootObj = templateListPageDiv.find("div[name=templateListFoot]");
			debugger;
			common.pageControl.start(URL_QUERY_DEMANDTEMPLATE.encodeUrl(),
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
				html.push('<tr templateId='+obj.TEMPLATE_ID+' templateName='+obj.TEMPLATE_NAME+'>');
				html.push('<td ><input type="radio" name="templateRadio" style="width:23%" /></td>');
				html.push('<td >'+obj.TEMPLATE_CODE+'</td>');
				html.push('<td >'+obj.TEMPLATE_NAME+'</td>');
				html.push('<td >'+obj.DEMAND_SUMIT_DEPART_NAME+'</td>');
				html.push('<td >'+obj.DEMAND_SUMIT_USER_NAME+'</td>');
				html.push('<td >'+obj.TEMPLATE_CTIME+'</td>');
				if(obj.TEMPLATE_STATUS=="1"){
					html.push('<td >有效</td>');
				}else{
					html.push('<td ></td>');
				}
				if(obj.APPLY_WORKFLOW_TYPE==0){
					html.push('<td >渠道工号流程</td>');
				}else if(obj.APPLY_WORKFLOW_TYPE==1){
					html.push('<td >签报单</td>');
				}else{
					html.push('<td >内联单</td>');
				}
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		var listBodyObj = templateListPageDiv.find("tbody[name=templateListBody]");
//		listBodyObj.find("tr").bind('click',function(){
//			layer.close(parentThis.templateListPage);
//			var templateId=$(this).attr("templateId");
//			var templateName=$(this).attr("templateName");
//			$("#workflowTemplate").val(templateName);
//			$("#workflowTemplateId").val(templateId);
//		});
	}
};
