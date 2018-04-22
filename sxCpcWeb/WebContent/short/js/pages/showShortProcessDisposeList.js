var ShortProcessDisposeList = new Function();

ShortProcessDisposeList.prototype = {

	parentBody : null,
	
	data : null,
	
	scroll : null,
	
	pages : {
		pagenum  : 0,
		pagesize : 20
	},
	
	flowType: null,
	
	isSearch : false,
	init : function(parentBody) {
		
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.bindMethod();
		this.searchShortProcessList('N');
	},
	
	bindMethod : function() {
		var parentThis = this;
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);

		"".findById("a", "backB", this.parentBody)[0].unbind().bind("click",function(){
			new AppService().closeApp();
		});

		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
		/*"".findById("div", "shortProcessListInfo", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("shortProcessListInfo.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
		});
		"".findById("div", "editor", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("editor.html?flowType=ZH&comeFrom="+parentThis.comeFrom);
		});*/
	},
	getPageParam : function(){
		
		var param = {
					"handleType"   : 		2005,
					"flags"		   : 		"chuli",
		};
		return param;
	},
	searchShortProcessList :function(isDelete){
		var parentThis = this;
		parentThis.isSearch = true;
		var param = parentThis.getPageParam();
		param["limit"] = parentThis.pages.pagenum;
		param["pageSize"] = parentThis.pages.pagesize;
		
		$.jump.ajax(URL_SHORT_PROCESS,function(data){
			if(data.code == 0){
				//添加滚动条
				var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
				scrollDivObj.height((document.documentElement.clientHeight-20)+"px");
				parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
					if(!parentThis.isSearch)
						parentThis.searchShortProcessList('N');
				});
				parentThis.data = data;
				parentThis.setPageList(data.data,"todayTable","短流程待处理列表",isDelete);
				var len = data.totalSize;//data.totalSize;
				
				if(len>=parentThis.pages.pagesize){
					parentThis.pages.pagenum += 1;
					parentThis.isSearch = false;
					if(data.data.length>0){
						$("#ups").css("visibility","visible");	
					}else{
						$("#ups").css("visibility","hidden");
					}
				}else{
					//除了搜索 刷频  不运行再次查询
					parentThis.isSearch = true;
	
				}
				parentThis.scroll.refresh();
			}
		},param,true);
	},
	setPageList : function(list,id,desc,isDelete){
		var parentThis = this;
		var shortProcessListShowDivObject = "".findById("div", "shortProcessListShowDiv", this.parentBody)[0];
		var tableObj = "".findById("div", id, shortProcessListShowDivObject)[0];
		if(common.utils.isNull(tableObj))
			this.createTableModel(shortProcessListShowDivObject,id,desc);
		else if(common.utils.isNull(list)){
			if(isDelete == "Y")
			tableObj.html("");
			return;
		}
		tableObj = "".findById("div", id, shortProcessListShowDivObject)[0];
		if(isDelete == "Y")
			tableObj.html("");
			$.each(list,function(){
				parentThis.createTbodyModel(tableObj,this);
			});
		if(common.utils.isNull(list)){
		      var tableHtml="<table width='87%' border='0' cellspacing='0' cellpadding='0' class='wybz_table'>";
			  tableHtml+="<tr style='line-height:40px;'>";
		      tableHtml+="<td style='text-align:center;'>--无数据--</td>";
		      tableHtml+="</tr></table>";
		      tableObj.append(tableHtml);
		}
	},
	createTableModel : function(parentObj,id,desc){
		var html="<div id="+id+" class='wybz_list' style='margin-top:55px;'></div>";
		parentObj.append(html);
	},
	createTbodyModel : function(tableObj,obj){
		var parentThis = this;
		var html="<div class='srys'><dl class='srys_box'>";
		html+="<dt>"+obj.DEMAND_NAME+"</dt><dd> </dd></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>短流程名称：</div><div class='wcz'style='width: 75%;'>"+obj.WORKFLOW_NAME+"</div></dt></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>需求编号：</div><div class='wcz'style='width: 75%;'>"+obj.DEMAND_CODE+"</div></dt></dl>";
		var demandStatus="";
		if(obj.DEMAND_STATUS=='1000'){
			demandStatus = "审批中";
		}else if (obj.DEMAND_STATUS=='1001'){
			demandStatus = "审批完结";
		}else if (obj.DEMAND_STATUS=='1002'){
			demandStatus = "草稿";
		}
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>需求状态：</div><div class='wcz'style='width: 75%;'>"+demandStatus+"</div></dt></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>所属短流程：</div><div class='wcz'style='width: 75%;'>"+obj.WORKFLOW_NAME+"</div></dt></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>当前处理人：</div><div class='wcz'style='width: 75%;'>"+obj.OPERATOR_NAME+"</div></dt></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>当前处理部门：</div><div class='wcz' style='width: 75%;'>"+obj.OPERATOR_DEPT+"</div></dt></dl>";
		var date = new Date();
		var year = date.getFullYear();
		var month = date.getMonth()+1;
		var day = date.getDate();
		var hour = date.getHours();
		var minute = date.getMinutes();
		var second = date.getSeconds();
		var a=year+'-'+month+'-'+day+'- '+hour+':'+minute+':'+second;
		var b=obj.END_TIME;
		a = a.replace("-","/");
		b = b.replace("-","/");
	    var aDate = new Date(a);
	    var bDate = new Date(b);
	    var isTimeout="";
	    if( bDate.getTime()<aDate.getTime()){
	    	isTimeout = "是";
	    }else {
	    	isTimeout = "否";
	    }				
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>是否超时：</div><div class='wcz'style='width: 75%;'>"+isTimeout+"</div></dt></dl>";
		html+="<dl class='list'><dt><div class='wcz' style='width: 25%;'>附件查看：</div><div class='wcz'style='width: 75%;' id='dowFile"+obj.DEMAND_ID+"'></div></dt></dl>";
		
		if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""){
			if(obj.IS_SINGATURE=="2"){
					html+="<dl class='list_last'><dt><div class='btn_f' id='dispose"+obj.DEMAND_ID+"'>处理</div></dt></dl>";
			}else{
				if(obj.ERA_OPERATOR_ID==parentThis.data.staffId&&obj.AUTHOR_STATUS!=0){
					html+="<dl class='list_last'><dt><div class='btn_f' style='background: #999; border: solid 1px #999;'>已授权</div></dt></dl>";
				}else{
					html+="<dl class='list_last'><dt><div class='btn_f' id='dispose"+obj.DEMAND_ID+"'>处理</div></dt></dl>";
				}
			}
		}else{
				html+="<dl class='list_last'><dt><div class='btn_f' id='dispose"+obj.DEMAND_ID+"'>处理</div></dt></dl>";
		}
		
		html+="</div>";
		tableObj.append(html);
		//这里要单独查询每条需求的附件信息
		var indexm=0;
		var downObj="".findById("div", "dowFile"+obj.DEMAND_ID, tableObj)[0];
		$.each(obj.fileList,function(i,objj){
				//alert("demaind2:"+obj.DEMAND_ID+"::filename:"+this.OTHER_ATTACHMENT_NAME);
				parentThis.createDownLoadFileBody(downObj,this,indexm);
				indexm++;
		});
//		var fileParam={
//				"handleType" 				: 	2023,
//				"demandId"                  :   obj.DEMAND_ID,
//				"handleTypecom"             :   "qryLst",
//				"workflow_id"               :    obj.WORKFLOW_ID
//		};
//		$.jump.ajax(URL_SHORT_PROCESS, function(json) {
//	 		
//	 		if(json.code == "0" ){
//	 			var dataList=json.data;
//	 			var downObj="".findById("div", "dowFile"+obj.DEMAND_ID, tableObj)[0];
//	 			var indexm=0;
//	 			$.each(dataList,function(i,obj){
//	 				parentThis.createDownLoadFileBody(downObj,this,indexm);
//	 				indexm++;
//	 			});
//	 		}
//	 	}, fileParam, true);
		//处理
		var url="";
			if(obj.ERA_OPERATOR_ID==parentThis.data.staffId&&obj.AUTHOR_STATUS!=0){
				
			}else{
				"".findById("div","dispose"+obj.DEMAND_ID,tableObj)[0].unbind().bind("click",function(){
					if(obj.REPULSE_TYPE=="1"){//说明此任务是打回发起人，当前处理者就是发起人
						url="updateDisposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID+"&workflow_type_name="+obj.WORKFLOW_TYPE_NAME;
					}else{
						url="disposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID;
					}
					if(obj.IS_SINGATURE!="2"&&obj.ERA_OPERATOR_ID!=parentThis.data.staffId&&obj.AUTHOR_STATUS!=0){
						html+="<dl class='list_last'><dt>已授权</dt>";
					}
//					if(obj.ERA_OPERATOR_NAME!=""&&obj.ERA_OPERATOR_DEPT!=""){
//						if(obj.IS_SINGATURE=="2"){
//							url="disposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID;
//						}else{
//							if(obj.ERA_OPERATOR_ID!=parentThis.data&&obj.AUTHOR_STATUS!=0){
//								html+="<dl class='list_last'><dt>已授权</dt>";
//							}else{
//								url="disposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID;
//							}
//						}
//					}else{
//						if(obj.IS_SINGATURE=="2"){
//							url="disposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID;
//						}else{
//							url="disposeShortInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&demandId="+obj.DEMAND_ID+"&demandName="+obj.DEMAND_NAME+"&demandCode="+obj.DEMAND_CODE+"&starEvaluate="+obj.STAR_EVALUATE+"&evaluateInfo="+obj.EVALUATE_INFO+"&demandDesc="+obj.DEMAND_DESC+"&ear_operatop_id="+obj.ERA_OPERATOR_ID+"&templateId="+obj.TEMPLATE_ID;
//						}
//					}
					
					common.go.next(encodeURI(url,'utf-8'));
					});
			}
		
		},
		//创建显示下载附件
		createDownLoadFileBody: function(downObj,obj,indexm){
			var newdex=obj.ATTACHMENT_VALUE+indexm;
			var str=obj.ATTACHMENT_NAME;
			var array=str.split(".");
			var att_names=array[array.length-1];
			var newhtml="<a class='downloaddiv' style='display: inline-block;width: 100%;line-height: 30px;' id='download_file"+newdex+"' file_path='"+obj.ATTACHMENT_PATH+"' file_other_name='"+obj.OTHER_ATTACHMENT_NAME+"' file_name='"+obj.ATTACHMENT_NAME+"' file_Type='"+att_names+"'>"+obj.ATTACHMENT_NAME+"</a>";
			 downObj.append(newhtml);
			 //添加事件
			//点击文件下载
			   "".findById("a", "download_file"+newdex, downObj)[0].unbind().bind("click",function(){
					
					//这里调用门户接口对附件进行查看 
					var file_other_name=$(this).attr("file_other_name");
					var file_path=$(this).attr("file_path")+file_other_name;
					var att_name=$(this).attr("file_Type");
					file_path=file_path.substring(file_path.indexOf("/upLoadFile"),file_path.length);
					 var file_pathImg = file_path;
				     file_path="http://117.32.232.208"+file_path;
//				     var filePath1 = $(this).attr("file_path");
//				     var file_names = $(this).attr("file_name");
					//new AppService().readerFile(file_path,function(msg){showAlert(msg);},function(err){showAlert(err);}); 
					    if(att_name=='jpg'||att_name=='png'||att_name=='bmp'||att_name=='gif'||att_name=='jpeg'||att_name=='tiff'||att_name=='pcx'||att_name=='tga'||att_name=='exif'||att_name=='fpx'||att_name=='svg'||att_name=='psd'||att_name=='cdr'||att_name=='pcd'||att_name=='dxf'||att_name=='ufo'||att_name=='eps'||att_name=='ai'||att_name=='raw'){
					    	var url="";
					    	url="fileDownInfo.html?file_path="+file_pathImg;
					    	common.go.next(encodeURI(url,'utf-8'));
					    }else{
					    	
//							var parama={					
//									"handleType"     : 2024,
//									"filePath"       : filePath1,
//									"fileName"       : file_names,
//									"downloadName"   : file_other_name,
//							};			
//							$.jump.ajax(URL_SHORT_PROCESS, function(json) {
//								
//									if(json.code == "0"){
//										
//										file_path = "http://117.32.232.208"+json.file_path;
//										new AppService().readerFile(file_path,function(msg){showAlert(msg);},function(err){showAlert(err);});
//									}
//								}, parama, false,false);
					    	new AppService().readerFile(file_path,function(msg){showAlert(msg);},function(err){showAlert(err);});
							
					    }
				});
		}
};
//window.onerror = function(msg, url, line) {
//    var idx = url.lastIndexOf("/");
//    if(idx > -1) {
//        url = url.substring(idx+1);
//    }
//    alert("ERROR in " + url + " (line #" + line + "): " + msg);
//    return false;
//};
$(document).ready(function() {
	var shortProcessDisposeList = new ShortProcessDisposeList();
	shortProcessDisposeList.init($(this));
});