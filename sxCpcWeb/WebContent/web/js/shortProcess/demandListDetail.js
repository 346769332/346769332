var DemandListDeatil = new Function();
DemandListDeatil.prototype = {
	selecter : "#demandDetailInfo",
	pageSize : 10,
	now_node_id:"",
	// 初始化执行
	init : function(param) {
		this.demandInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		var parama={								
				"handleType": "qryLst",
				"dataSource": "",
				"nameSpace" : "shortProcess",
				"sqlName"   : "qryTaskId",
				"demandId"  : parentThis.demandInfo.demandId,
				"workflowId": parentThis.demandInfo.workflowId,
		};			
		$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
			debugger;
				if(json.code == "0"){
			 		$.each(json.data,function(i,obj){
			 			parentThis.taskId = obj.TASK_ID;
			 			parentThis.now_node_id = obj.NODE_ID;
			 			parentThis.urgeTime = obj.LIMITTIME;
			 			parentThis.urgeCount = obj.URGE_COUNT;
			 		});
				}
			}, parama, false,false);
		
		if("act"==parentThis.demandInfo.flag){//综支人员
			$('#search').hide();
		}else{
			//审批完结后才可以加载评价五颗星
			if(parentThis.demandInfo.demandStatus=='1001'){
				var demandInfo=parentThis.demandInfo;
				$('#evalInfoShow').show();
				if(demandInfo.starEvaluate!=''&&demandInfo.starEvaluate!=null&&demandInfo.starEvaluate!=undefined){	
					//已评价过不要再显示评价按钮
					var num=demandInfo.starEvaluate;
					$('#starEvaluate').attr('index',num);
					var currObj=$('#starEvaluate').find('a[name=evalStar][index='+num+']');
					currObj.parent().children("a[name=evalStar]").removeClass();
					currObj.prevAll().addClass("evalStarYellow");
					currObj.addClass("evalStarYellow");
					currObj.nextAll().addClass("evalStarGrey");
					$('#evaluateInfo').val(demandInfo.evaluateInfo);
					$('#evaluateInfo').attr("readonly",true);
				}else{
					$('#evaluate').show();//没有评价显示评价按钮
					parentThis.loadEvalStar(parentThis);
				}
			}
		}
		
		// 取消返回
		var backObj=parentThis.selecter.findById("a","back")[0];
		backObj.unbind("click").bind("click",function(){
			$.jump.loadHtmlForFun("/web/html/shortProcess/demandList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
				var demandList=new DemandList();
				demandList.init();
			});
		});
		if(parentThis.demandInfo.demandStatus=='1001'||parentThis.demandInfo.demandStatus=='1002'){
			var searchObj=parentThis.selecter.findById("a","search")[0];
			searchObj.css("background", "#999");
			searchObj.remove("name");
		}
		// 催单
		var searchObj=parentThis.selecter.findById("a","search")[0];
		searchObj.unbind("click").bind("click",function(){
			if(parentThis.demandInfo.demandStatus=='1000'){
				
			
			var urge_time=parentThis.demandInfo.urge_time;
			
			var param={				
					"opt_id" :parentThis.demandInfo.opt_id,
					"opt_name" :parentThis.demandInfo.opt_name,
		    		"demand_id"  :parentThis.demandInfo.demandId,	
		    		"demand_name"  :parentThis.demandInfo.demandName,	
			};
			debugger;
			if(!parentThis.validate(parentThis,urge_time)){
				return false;
			}
			$.jump.ajax(URL_UPDATE_DEMANDINFO.encodeUrl(), function(json) {	
				debugger;
				if (json.code == "0") {
					layer.alert('催单成功！！！',8);		
					$.jump.loadHtmlForFun("/web/html/shortProcess/demandList.html".encodeUrl(),function(pageHtml){
						$("#content").html(pageHtml);
						var demandList=new DemandList();
						demandList.init();
					});
				}else{
					layer.alert(json.cuo);
				};
			}, param, false, false);	
			}
			
		});
		// 详细页面加载数据
		parentThis.loadDemandDetail(parentThis);
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
				var workflowId=parentThis.demandInfo.workflowId;
				var demandId=parentThis.demandInfo.demandId;
				var demandStatus=parentThis.demandInfo.demandStatus;
				/***********************************************审批中标记节点颜色*******************************************/
				if(demandStatus=="1000"){
					//审批中当前节点
					var currentNodeParam={
							"workflowId"	:	workflowId,	
							"demandId"		:	demandId,
							"task_id"		:	parentThis.taskId,
							"flag"			:	"1"
					};
					var currentId="";
					$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
						if(json.code=="0"){
							var dataObj=json.data;
							currentId=dataObj.NODE_ID;
						}
					},currentNodeParam,null,false,false);
					//审批中走过的节点
					var confrimedNodeParam={
							"workflowId"	:	workflowId,	
							"demandId"		:	demandId,
							"task_id"		:	parentThis.taskId,
							"flag"			:	"0"
					};
					var dataConfirmedObj="";
					$.jump.ajax(URL_QUERY_REDNODE_EXAMINE.encodeUrl(), function(json) {
						if(json.code=="0"){
							dataConfirmedObj=json.data;
						}
					},confrimedNodeParam,null,false,false);
				}
				/******************************************审批中标记节点颜色************************************************/
				
				param={"workflowId":workflowId};
				// 后台获取"节点数据"和"线数据",组装流程格式
			 	$.jump.ajax(URL_QUERY_WORKFLOW.encodeUrl(), function(json) {
			 		var nodeNum=json.nodeNum;
			 		var nodeData=json.data.nodes;
			 		var jsonnodes="";
			 		$.each(json.data.nodes,function(i,obj){
			 			var type="";
			 			if(obj.NODE_TYPE=="0"){
			 				// 开始节点
			 				type="start round";
			 			}else if(obj.NODE_TYPE=="1"){
			 				// 自由节点
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
			  			$("#workflow .GooFlow_item").attr("flag","1");
			  			$("#draw_workflow g").attr("flag","1");
			  			parentThis.addColorForCurrentNode(currentId);
			  			parentThis.addColorForEndNode(dataConfirmedObj,currentId);
			  		}else{
			  			layer.alert("加载失败");
			  		};
			 	}, param, true);
				
				
//				demo.onItemFocus=function(id,model){
//					//id 表示节点id
//					if(model=="node"){
//						param={"nodeId":id};
//						//取值
//						$.jump.ajax(URL_QUERY_NODEINFO.encodeUrl(), function(json) {
//							$.each(json.data,function(i,obj){
//								/***********************回显数据*********************/
//								//流程环节
//								$("#nodeName").text(obj.NODE_NAME);
//								//流程环节处理要求(处理部门、处理人、处理动作、处理时限)
//								$("#nodeExecuteDepart").val(obj.NODE_EXECUTE_DEPART);
//								$("#nodeExecutor").val(obj.NODE_EXECUTOR);
//								$("#disposeAction").val(obj.DISPOSE_ACTION);
//								$("#timeLimit").val(obj.TIME_LIMIT);
//								//下环节流转要求
//								$("#toNextnodeCondition").text(obj.TO_NEXTNODE_CONDITION);
//								//流程环节支撑情况
//								if(obj.TO_NEXTNODE_CONDITION==null || obj.TO_NEXTNODE_CONDITION==""){
//									$("#stateDetail").val("未处理");
//								}else{
//									$("#stateDetail").val("已处理:"+obj.TO_NEXTNODE_CONDITION);
//								}
//								$("#tloverTime").val(obj.TLOVER_TIME);
//								
//							});
//						},param,true);
//						//画页面
//						  parentThis.viewNodeDetail(parentThis);
//
//					}
//				};
/** ******************************************加载流程图end************************************************** */
	},
	addColorForCurrentNode:function(currentId){
		$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[class='GooFlow_item'][id="+currentId+"]").css("background-color","red");
	},
	addColorForEndNode:function(dataConfirmedObj,currentId){
		$.each(dataConfirmedObj,function(i,obj){
			debugger;
			if(obj.NODE_TYPE=="1" && obj.NODE_ID<currentId){
				//任务节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			} 
			if(obj.NODE_TYPE=="0"){
				//开始节点
				$("#workflow").find("div[class='GooFlow_work']").find("div[class='GooFlow_work_inner']").find("div[id="+obj.NODE_ID+"]").css("background-color","#98FB98");
			}
		});
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
		});
	},
	loadDemandDetail : function(parentThis) {
		var demandInfo=parentThis.demandInfo;
		
	
		if(demandInfo!="" && demandInfo!=undefined && demandInfo!=null){
			$('#workflowName').val(demandInfo.workflowName);
			$('#demandName').val(demandInfo.demandName);
			$('#demandDesc').val(demandInfo.demandDesc);
			$("#releasePersonName").val(demandInfo.demand_sumit_pname);
			$("#releaseDeptName").val(demandInfo.department);
			
		}
		//文档名称
		var html=[];
		var downParam = {
				"hanleType" 	: 		"qryDownloadPath" ,
				"proId"			:		parentThis.demandInfo.demandId
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
	loadEvalStar : function(parentThis){
		$('#starEvaluate').find("a[name=evalStar]").unbind("click").bind("click",function(){
			var thisAObj=$(this);
			thisAObj.parent().children("a[name=evalStar]").removeClass();
			thisAObj.prevAll().addClass("evalStarYellow");
			thisAObj.addClass("evalStarYellow");
			$('#starEvaluate').attr("index",thisAObj.attr("index"));
			thisAObj.nextAll().addClass("evalStarGrey");
		});
		$('#evaluate').unbind('click').bind('click',function(){
			debugger;
			var evalStar=$('#starEvaluate').attr('index');
			if(evalStar=="0"){
				layer.alert('评价前请选择评价星级',8);
				return;
			}
			var evalDesc=$('#evaluateInfo').val();
			if(evalDesc==""||evalDesc==null||evalDesc==undefined){
				layer.alert('评价说明不能为空',8);
				return;
			}
			var param={
					"handleType" 	: "upd",
					"dataSource" 	: "",
					"nameSpace"  	: "shortProcess",
					"sqlName"    	: "update_demand_eval_info",
					"evalStar"      : evalStar,
					"evalDesc"      : evalDesc,
					"demandId"      : parentThis.demandInfo.demandId
			};
			$.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json){
				if(json.code=="0"){
					layer.alert("评价成功！",9);
					$.jump.loadHtmlForFun("/web/html/shortProcess/demandList.html".encodeUrl(),function(pageHtml){
						$("#content").html(pageHtml);
						var demandList=new DemandList();
						demandList.init();
					});
				}else{
					layer.alert(json.msg,8);
				}
			}, param, false, false);
		});
	},
	// 添加获取修改权限
	viewNodeDetail:function(parentThis){
		var html = [];
		html.push('<div  id="viewNodeDetailPage"  >');
		//html.push('<h3 id="title"></h3>');
		html.push('<table border="1" width="600"  cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse">');
		debugger;
		html.push('<tr height="50" bgcolor="#89cff0">');         
		html.push('<th>流程环节</th>');         
		html.push('<th>流程环节处理要求</th> ');         
		html.push('<th>下环节流转要求</th> ');         
		html.push('<th>流程环节支撑情况</th>');         
		html.push('</tr>');
		
		html.push('<tr >');         
		html.push('<td id="nodeName" rowspan="6" ></td>');         
		html.push('</tr>'); 
		
		html.push('<tr style="height:50px">');         
		html.push('<td>处理部门:<input type="text" name="nodeExecuteDepart" id="nodeExecuteDepart" style="width:180px" readonly></td>');         
		html.push('<td rowspan="5" id="toNextnodeCondition"></td>');         
		html.push('<td rowspan="5"><input type="text" name="stateDetail" id="stateDetail" style="width:180px" readonly><br/><br/><br/><input type="text" name="tloverTime" id="tloverTime" style="width:180px" readonly></td>');           
		html.push('</tr>'); 
		
		html.push('<tr style="height:50px">');         
		html.push('<td>处理人&nbsp;&nbsp;&nbsp;:<input type="text" name="nodeExecutor" id="nodeExecutor" style="width:180px" readonly></td>');         
		html.push('</tr>');   
		
		html.push('<tr style="height:50px"> ');         
		html.push('<td>处理动作:<input type="text" name="disposeAction" id="disposeAction" style="width:180px" readonly></td>');         
		html.push('</tr>');    
		
		html.push('<tr style="height:50px"> ');         
		html.push('<td>处理时限:<input type="text" name="timeLimit" id="timeLimit" style="width:180px" readonly></td>');         
		html.push('</tr>');        
		
		html.push('<tr style="height:50px"> ');         
		html.push('<td>是否支撑:<input type="text" name="isOrNotZhicheng" id="isOrNotZhicheng" style="width:180px" readonly></td>');         
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
		// 关闭
		viewNodeDetailPage.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		
	},
	validate : function(parentThis,urge_time){
		debugger;		
		if(urge_time && parentThis.countDay(urge_time,common.date.nowDate()) ==-1){
			layer.alert("消息提示,今天处理人员已经收到您的催单短信，正在处理，请稍后!");
			return false;
		}
		return true;
	},
	countDay : function (a,b){
		a = a.replace("-","/");
		b = b.replace("-","/");
	    var aDate = new Date(a);
	    var bDate = new Date(b);
	    var dif = bDate.getTime() - aDate.getTime();
	    var day = Math.floor(dif / (1000 * 60 * 60 * 24));
	    return day;
	},
};