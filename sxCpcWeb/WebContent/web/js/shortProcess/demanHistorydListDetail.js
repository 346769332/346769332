var DemanHistorydListDetail = new Function();
DemanHistorydListDetail.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
	// 初始化执行
	init : function(param) {
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		// 取消返回
		var backObj=parentThis.selecter.findById("a","back")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/demandHistoryList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var demandHistoryList=new DemandHistoryList();
				demandHistoryList.init();
			});
		});
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
/** ******************************************加载流程图begin********************************************** */
//		var property={
//				width:1200,
//				height:600,
//				toolBtns:["start round","end round","task round","node","chat","state","plug","join","fork","complex mix"],
//				haveHead:true,
//				headBtns:["new","open","save","undo","redo","reload"],// 如果haveHead=true，则定义HEAD区的按钮
//				haveTool:true,
//				haveGroup:true,
//				useOperStack:true
//			};
//			var remark={
//				cursor:"选择指针",
//				direct:"结点连线",
//				start:"入口结点",
//				"end":"结束结点",
//				"task":"任务结点",
//				node:"自动结点",
//				chat:"决策结点",
//				state:"状态结点",
//				plug:"附加插件",
//				fork:"分支结点",
//				"join":"联合结点",
//				"complex mix":"复合结点",
//				group:"组织划分框编辑开关"
//			};
//			var demo;
//				demo=$.createGooFlow($("#workflow"),property);
//				demo.setNodeRemarks(remark);
//				demo.onItemDel=function(id,type){
//					return confirm("确定要删除该单元吗?");
//				}
//				param={"workflowId":parentThis.demandInfo.workflowId}
//				// 后台获取"节点数据"和"线数据",组装流程格式
//			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
//			 		var nodeNum=json.nodeNum;
//			 		var nodeData=json.data.nodes;
//			 		var jsonnodes="";
//			 		$.each(json.data.nodes,function(i,obj){
//			 			var type="";
//			 			if(obj.NODE_TYPE=="0"){
//			 				// 开始节点
//			 				type="start round";
//			 			}else if(obj.NODE_TYPE=="1"){
//			 				// 自由节点
//			 				type="node";
//			 			}else{
//			 				// 结束节点
//			 				type="end round";
//			 			}
//			 			//var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
//			 			var nodes='"'+obj.NODE_ID+'":'+"{"+'"name":'+'"'+obj.NODE_NAME+'"'+","+'"left":'+ obj.TO_LEFT+","+'"top":'+obj.TO_TOP+","+'"type":'+'"'+type+'"'+","+'"width":'+obj.NODE_WIDTH+","+'"height":'+obj.NODE_HEIGHT+","+'"alt":'+true+"}";
//			 			jsonnodes+=nodes+",";
//			 		});
//			 		jsonnodes="{"+jsonnodes.substring(0,jsonnodes.length-1)+"}";
//			 		var jsonnodesObj=eval("("+jsonnodes+")");
//			 		
//			 		var lineNum=json.lineNum;
//			 		var jsonlines="";
//			 		$.each(json.data.lines,function(i,obj){
//			 			var lines='"'+i+'":' +"{"+'"type":'+'"'+obj.LINE_TYPE +'"'+","+'"M":'+ '"'+obj.M+'"'+","+'"from":'+obj.FROM_NODE_ID+","+'"to":'+obj.TO_NODE_ID+","+'"name":'+'"'+obj.LINE_NAME+'"'+"}";
//			 			jsonlines+=lines+",";
//			 		});
//			 		jsonlines="{"+jsonlines.substring(0,jsonlines.length-1)+"}";
//			 		var jsonlinesObj=eval("("+jsonlines+")");
//			  		if(json.code == "0" ){
//			  			// 成功
//			  			var workflow={
//		  				        "nodes": 	jsonnodesObj,
//		  				        "lines":	jsonlinesObj	
//			  			};
//			  			demo.loadData(workflow);
//			  		}else{
//			  			layer.alert("加载失败");
//			  		};
//			 	}, param, true);
//				
//				demo.onItemFocus=function(id,model){
//					//ID 表示节点ID
//					IF(MODEL=="NODE"){
//						VAR DEMAND_ID=PARENTTHIS.DEMANDINFO.DEMAND_ID;
//						
//						PARAM={
//								"HANDLETYPE":"QRYLST",
//					    		"DATASOURCE":"ORA",
//					    		"NAMESPACE":"SHORTPROCESS",
//					    		"SQLNAME":"QRYLIUCHENGINFO",
//								"NODEID" :ID,
//								"DEMANDID" : DEMAND_ID					
//						}
//						//取值
//						$.JUMP.AJAX(URL_QUERY_COMMON_METHOD.ENCODEURL(), FUNCTION(JSON) {
//							$.EACH(JSON.DATA,FUNCTION(I,OBJ){
//								DEBUGGER;
//								/***********************回显数据*********************/
//								$("#NODEEXECUTEDEPART").VAL(OBJ.OPERATOR_DEPT);
//								$("#NODEEXECUTOR").VAL(OBJ.OPERATOR_NAME);
//								$("#TIMELIMIT").VAL(OBJ.TIME_LIMIT);
//								$("#DISPOSEACTION").VAL(OBJ.DISPOSE_ACTION);
//								IF(OBJ.IS_SUPPORT==1){
//									$("#ISORNOTZHICHENG").VAL('是');
//								}ELSE{
//									$("#ISORNOTZHICHENG").VAL('否');
//								}
//								$("#TONEXTNODECONDITION").VAL(OBJ.TO_NEXTNODE_CONDITION);
//								IF(OBJ.OPERAT_AGREE==1){
//									$("#STATEDETAIL").VAL('审批通过');
//								}ELSE{
//									
//									$("#STATEDETAIL").VAL('审批不通过');
//								}
//								
//							});
//						},PARAM,TRUE);
//						//画页面
//					
//						PARENTTHIS.VIEWNODEDETAIL(PARENTTHIS,ID,DEMAND_ID);
//
//					}
//				};
/** ******************************************加载流程图end************************************************** */
	},
	// 时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',  
		})
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		debugger;
		
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);			
			$('#evaluateInfo').val(demandInfo.evaluateInfo);
			$('#zhiChengTime').val(demandInfo.expect_time);	
			$('#releasePersonName').val(demandInfo.demand_sumit_pname);		
			$('#releaseDeptName').val(demandInfo.department);		
		}
		
		var params={								
				"handleType":"qryLst",
				"dataSource":"ora",
				"nameSpace" :"shortProcess",
				"sqlName"   :"queryshortp_sum",
				"demandId"  :demandInfo.demand_id,
				"workflowId" :demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {			
			var html=[];		
			var operation_info='';
				if(json.code == "0" ){
			 		$.each(json.data,function(i,obj){			 			
			 			if(obj.OPERATION=='同意'){
			 				operation_info='同意';
			 			}
			 			else if(obj.OPERATION=='打回根节点') {
			 				operation_info='不同意&nbsp;&nbsp;&nbsp;打回根节点';
			 			}else if(obj.OPERATION=='打回上一步') {
			 				operation_info='不同意&nbsp;&nbsp;&nbsp;打回上一步';
			 			}else {
			 				operation_info="";
			 			}
			 			html.push('<div style="margin: 10px 0;"><span>'+obj.APPCREATE_TIME+'&nbsp;&nbsp;&nbsp;'+obj.NODE_EXECUTE_DEPART+'---'+obj.OPERATOR_NAME+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+operation_info+'&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+obj.TLOVER_TIME+'</span></div>');

			 		});
					$('#processRecord').append(html.join(''));
				}
			}, params, false,false);
		
		//文档名称
		var html=[];
		var downParam = {
				"hanleType" 	: 		"qryDownloadPath" ,
				"proId"			:		demandInfo.demand_id,
		};
		$.jump.ajax(URL_QUERY_GOVER_ENTER.encodeUrl(), function(json) {
			debugger;
			//取出文件的路径
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
		//模板属性
//		var params={								
//				"handleType":"qryLst",
//				"dataSource":"ora",
//				"nameSpace" :"shortProcess",
//				"sqlName"   :"qryTemplateAttr",
//				"demandId"  :demandInfo.demand_id
//		};			
//		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
//			debugger;
//				if(json.code == "0" ){
//			 		$.each(json.data,function(i,obj){
//			 			$("#terminalPurchase").html(obj.ATTR_STR);
//			 		});
//				}
//			}, params, false,false);
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
	},
	//绑定删除&下载事件
	bindUpAndDown : function(parentThis){
		//删除文件
//		$("#goverUpdatePage").find("a[name=deleteFile]").unbind("click").bind("click",function(){});
		//下载文件
		$("#demandDetailInfo").find("a[name=attachment]").unbind("click").bind("click",function(){
			var param={
					"fileName": $(this).attr("attachment_name")     ,	
					"downloadName" : $(this).attr("otherName"),
					"filePath":	$(this).attr("attachment_path")     ,
			};
			window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		});
	},
	//评价星级的加载
//	loadEvalStar : function(parentThis){
//		var html=[];
//		for (var int = 0; int < 5; int++) {
//			html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
//		}
//		$('#starEvaluate').html(html.join(''));
//		$('#starEvaluate').find("a[name=evalStar]").unbind("click").bind("click",function(){
//			var thisAObj=$(this);
//			thisAObj.parent().children("a[name=evalStar]").removeClass();
//			thisAObj.prevAll().addClass("evalStarYellow");
//			thisAObj.addClass("evalStarYellow");
//			$('#starEvaluate').attr("index",thisAObj.attr("index"));
//			thisAObj.nextAll().addClass("evalStarGrey");
//		});
//	},
	// 添加获取修改权限
//	viewNodeDetail:function(parentThis,id,demand_id){
//		var html = [];
//		html.push('<div  id="viewNodeDetailPage"  >');
//		//html.push('<h3 id="title"></h3>');
//		html.push('<table border="1" width="600"  cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
//		debugger;
//		html.push('<tr height="50" bgcolor="#89cff0">');         
//		html.push('<th>流程环节</th>');         
//		html.push('<th>流程环节处理要求</th> ');         
//		html.push('<th>下环节流转要求</th> ');         
//		html.push('<th>流程环节支撑情况</th>');         
//		html.push('</tr>');
//		
//		html.push('<tr >');         
//		html.push('<td id="nodeName" rowspan="6" ></td>');         
//		html.push('</tr>'); 
//		
//		html.push('<tr style="height:50px">');         
//		html.push('<td>处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:180px" readonly></td>');         
//		html.push('<td rowspan="5" ><div style="width:185px,height:240px;"name="toNextnodeCondition" id="toNextnodeCondition" ></div></td>');         
//		html.push('<td rowspan="5"><div style="width:185px,height:240px;"name="stateDetail" id="stateDetail" ></div></td>');           
//		html.push('</tr>'); 
//		
//		html.push('<tr style="height:50px">');         
//		html.push('<td>处理人&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:180px" readonly></td>');         
//		html.push('</tr>');   
//		
//		html.push('<tr style="height:50px"> ');         
//		html.push('<td>处理动作:<input type="text" name="disposeAction" id="disposeAction" style="width:180px" readonly></td>');         
//		html.push('</tr>');    
//		
//		html.push('<tr style="height:50px"> ');         
//		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:180px" readonly></td>');         
//		html.push('</tr>');        
//		
//		html.push('<tr style="height:50px"> ');         
//		html.push('<td>是否支撑:<input type="text" name="isOrNotZhicheng" id="isOrNotZhicheng" style="width:180px" readonly></td>');         
//		html.push('</tr>');         
//		html.push('</table>');         
//		html.push('</div>');
//		
//		var authInfoPage = $.layer({
//		    type: 1,
//		    title: false,
//		    area: ['auto', 'auto'],
//		    border: [0], // 去掉默认边框
//		    // shade: [0], //去掉遮罩
//		    // closeBtn: [0, false], //去掉默认关闭按钮
//		     shift: 'left', // 从左动画弹出
//		    page: {
//		        html: html.join('')
//		    }
//		});
//		
//		var viewNodeDetailPage=$("#viewNodeDetailPage");
//		// 关闭
//		viewNodeDetailPage.find("a[name=infoClose]").unbind("click").bind("click",function(){
//			layer.close(authInfoPage);
//		});
//		paramz={
//				"handleType":"qryLst",
//	    		"dataSource":"ora",
//	    		"nameSpace":"shortProcess",
//	    		"sqlName":"qryLiuChengInfo",
//				"nodeid" :id,
//				"demandid" : demand_id					
//		}
//		
//		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {	
//			debugger;
//				if(json.code =="0"){	
//					if(json.data.length > 0) {
//						$.each(json.data,function(i,obj){			
//				viewNodeDetailPage.find("input[id=nodeExecuteDepart]").val(obj.OPERATOR_DEPT);
//				viewNodeDetailPage.find("input[id=nodeExecutor]").val(obj.OPERATOR_NAME);
//				viewNodeDetailPage.find("input[id=timeLimit]").val(obj.time_limit);
//				viewNodeDetailPage.find("input[id=disposeAction]").val(obj.DISPOSE_ACTION);
//				if(obj.IS_SUPPORT==1){
//					viewNodeDetailPage.find("input[id=isOrNotZhicheng]").val('是');
//				}else{
//					viewNodeDetailPage.find("input[id=isOrNotZhicheng]").val('否');
//				}
//				viewNodeDetailPage.find("div[id=toNextnodeCondition]").val(obj.TO_NEXTNODE_CONDITION);
//				if(obj.OPERAT_AGREE==1){
//					viewNodeDetailPage.find("div[id=stateDetail]").val('审批通过');
//				}else{
//					
//					viewNodeDetailPage.find("div[id=stateDetail]").val('审批不通过');
//				}
//						});
//					}
//				}else{			
//					layer.alert("查询失败,",8);	
//						
//			}
//		}, paramz, false,false);
//		
//		
//	}
};