var TransitShortProcessList = new Function();

TransitShortProcessList.prototype = {

	parentBody : null,
	
	data : null,

	flowType : null,

	scroll : null,

	pages : {
		pagenum  : 0,
		pagesize : 20
	},

	isSearch : false,
	init : function(parentBody) {
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.bindMethod();
		this.searchTransitProcessList('N');
	},
	
	bindMethod : function() {
		var parentThis = this;
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);

		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.next("./home.html?hasSession=yes&helpTel=1183600");
		});
		"".findById("button", "searchBtn", this.parentBody)[0].bind("click",function(){
			parentThis.pages.pagenum = 1;
			var meter1 =setTimeout(function(){parentThis.searchTransitProcessList('Y');
			clearTimeout(meter1);
			}, 200);
		});
		var param={
				"handleTypecom"  :"qryLst",
				"handleType"     : 2018,
				"sqlName"    	: "queryWorkflwoType"
		};
		$.jump.ajax(URL_SHORT_PROCESS, function(json){
			if(json.code=='0'){
				var html=[];
				if(json.data.length>0){
					html.push('<option value="">全部</option>');
					$.each(json.data,function(i,obj){
						html.push('<option value="'+obj.ACT_WORKFLOW_TYPE_ID+'">'+obj.ACT_WORKFLOW_TYPE_NAME+'</option>');
					});
					$("#workflowType").html(html.join(''));
				}
			}
		}, param, false, false);
	},
	
	getPageParam : function(){
		
		var demandName = $("#demandName").val();
		var demandStatus = $('#demandStatus option:selected').val();
		var workflowType = $('#workflowType option:selected').val();
		var param = {
					"handleTypecom"		: "qryLst",
					"handleType"     	: 2018,
					"sqlName"   		: "getSolveProcessList",
					"demandName"   		: demandName,
					"demandStatus"   	: demandStatus,
					"workflowType"   	: workflowType
		};
		return param;
	},
	searchTransitProcessList :function(isDelete){
		var parentThis = this;
		parentThis.isSearch = true;
		var param = parentThis.getPageParam();
		param["pagenum"] = parentThis.pages.pagenum;
		param["pagesize"] = parentThis.pages.pagesize;
		$.jump.ajax(URL_SHORT_PROCESS,function(data){
			
			
			if(data.code == 0){
				//添加滚动条
				var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
//				scrollDivObj.height((document.documentElement.clientHeight-60)+"px");
				scrollDivObj.height((document.documentElement.clientHeight-(document.documentElement.clientHeight*0.15))+"px"); 
				parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
					if(!parentThis.isSearch)
						parentThis.searchTransitProcessList('N');
				});
				parentThis.data = data;
				parentThis.setPageList(data.data,"todayTable","在途需求列表",isDelete);
				
				var len = data.totalSize;//data.totalSize;
				if(len>=parentThis.pages.pagesize){
					parentThis.pages.pagenum += 1;
					parentThis.isSearch = false;
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
		var transitListShowDivObj = "".findById("div", "transitListShowDiv", this.parentBody)[0];
		var tableObj = "".findById("div", id, transitListShowDivObj)[0];
		if(common.utils.isNull(tableObj))
			this.createTableModel(transitListShowDivObj,id,desc);
		else if(common.utils.isNull(list)){
			if(isDelete == "Y")
			tableObj.html("");
			return;
		}
		tableObj = "".findById("div", id, transitListShowDivObj)[0];
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
		var html="<div id="+id+" class='wybz_list' style='margin:0px;'></div>";
		parentObj.append(html);
	},
	createTbodyModel : function(tableObj,obj){
		//alert("demaind:"+obj.DEMAND_ID+"fileList::"+obj.fileList);
		var parentThis = this;
//		var html="<div class='srys' style='margin-top: 10px;'>";
//		html+="<dl class='srys_box' id='demand"+obj.DEMAND_ID+"'><dt>"+obj.DEMAND_NAME+" </dt><dd></dd></dl>";
//        html+="<dl class='list'><dt><div class='wcz'>需求描述："+obj.DEMAND_DESC+"</div></dt><dd><div class='dxf'>发起时间："+obj.DCREATE_TIME+"</div></dd></dl>";
//        html+="<dl class='list'><dt>";
//        //1000：需求审批中 1001：需求审批完结 1002：需求保存为草稿
//        if(obj.DEMAND_STATUS=="1000"){
//        	html+="<div class='wcz'>需求状态：审批中</div>";
//        }else if(obj.DEMAND_STATUS=="1001"){
//        	html+="<div class='wcz'>需求状态：审批完结</div>";
//        }else if(obj.DEMAND_STATUS=="1002"){
//        	html+="<div class='wcz'>需求状态：保存为草稿</div>";
//        }
//        html+="</dt><dd><div class='dxf'>当前处理人："+obj.OPERATOR_NAME+"</div></dd></dl>";
		var html="<div class='srys' style='margin-top: 10px;'>";
		html+="<dl style='width=100%' class='srys_box' id='demand"+obj.DEMAND_ID+"'><dt>"+obj.DEMAND_NAME+" </dt><div class='btn_f' id='showDetail"+obj.DEMAND_ID+"'>流程查看</div></dl>";
        html+="<dl class='list' style='min-height: 40px;'><dt><div class='wczwcz'>需求描述：</div></dt><dd><div class='dxfdxf'>"+obj.DEMAND_DESC+"</div></dd></dl>";
        html+="<dl class='list'><dt><div class='wczwcz'>发起时间：</div></dt><dd><div class='dxfdxf'>"+(obj.DCREATE_TIME).substring(0,16)+"</div></dd></dl>";
        html+="<dl class='list'><dt><div class='wczwcz'>需求状态：</div></dt>";
        //1000：需求审批中 1001：需求审批完结 1002：需求保存为草稿
        if(obj.DEMAND_STATUS=="1000"){
        	html+="<dd><div class='dxfdxf'>审批中</div></dd></dl>";
        }else if(obj.DEMAND_STATUS=="1001"){
        	if(obj.IS_EVALUATE=="0"){
        		html+="<dd><div class='dxfdxf'>审批完结</div></dd></dl>";
        	}else{
        		html+="<dd><div class='dxfdxf'>审批完结</div></dd></dl>";
        	}
        }else if(obj.DEMAND_STATUS=="1002"){
        	html+="<dd><div class='dxfdxf'>保存为草稿</div></dd></dl>";
        }
        if(obj.DEMAND_STATUS=="1001"&&obj.IS_EVALUATE=="1"){
        	html+="<dl class='list'><dt><div class='wczwcz'>评价状态：</div></dt><dd><div class='dxfdxf'>已评价</div></dd></dl>";
        }else if(obj.DEMAND_STATUS=="1001"&&obj.IS_EVALUATE=="0"){
        	html+="<dl class='list'><dt><div class='wczwcz'>评价状态：</div></dt><dd><div class='dxfdxf'>待评价</div></dd></dl>";
        }
//        if(obj.DEMAND_STATUS=="1000"){
//        	 html+="<dl class='list'><dt><div class='wczwcz'>当前处理人：</div></dt><dd><div class='dxfdxf'>"+obj.SUBMIT_NAME+"</div></dd></dl>";
//        }
        html+="<dl class='list'><dt><div class='wczwcz'>附件查看：</div></dt><dd><div class='dxfdxf' id='dowFile"+obj.DEMAND_ID+"'></div></dd></dl>";
		tableObj.append(html);
		//查询需求对应的附件信息
		var downObj="".findById("div", "dowFile"+obj.DEMAND_ID, tableObj)[0];
		var indexm=0;
		$.each(obj.fileList,function(i,objj){
				//alert("demaind2:"+obj.DEMAND_ID+"::filename:"+this.OTHER_ATTACHMENT_NAME);
				parentThis.createDownLoadFileBody(downObj,this,indexm);
				indexm++;
			});
		//这里要单独查询每条需求的附件信息
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
//	 			$.each(dataList,function(i,objj){
//	 				alert("demaind2:"+obj.DEMAND_ID+"::filename:"+this.OTHER_ATTACHMENT_NAME);
//	 				parentThis.createDownLoadFileBody(downObj,this,indexm);
//	 				indexm++;
//	 			});
//	 		}
//	 	}, fileParam, true);
		//添加事件
		"".findById("dl","demand"+obj.DEMAND_ID,tableObj)[0].unbind().bind("click",function(){
			var url="";
			if(obj.WORKFLOW_SINGLE_TYPE=="3"){//末梢库存流程
				url="materialDemandInfo.html?pageType=transit&demand_status="+obj.DEMAND_STATUS+"&demand_id="+obj.DEMAND_ID;
			}else{
				url="transitShortProcessListInfo.html?demand_id="+obj.DEMAND_ID+"&workflow_id="+obj.WORKFLOW_ID+"&demand_code="+obj.DEMAND_CODE+"&demand_status="+obj.DEMAND_STATUS+"&demand_name="+obj.DEMAND_NAME+"&is_evaluate="+obj.IS_EVALUATE;
			}
			common.go.next(encodeURI(url,'utf-8'));
		});
		//绑定查看明细事件 showDetail
		"".findById("div","showDetail"+obj.DEMAND_ID,tableObj)[0].unbind().bind("click",function(){
			var url="";
			if(obj.WORKFLOW_SINGLE_TYPE=="3"){//末梢库存流程
				url="materialDemandInfo.html?pageType=transit&demand_status="+obj.DEMAND_STATUS+"&demand_id="+obj.DEMAND_ID;
			}else{
				url="transitShortProcessListInfo.html?demand_id="+obj.DEMAND_ID+"&workflow_id="+obj.WORKFLOW_ID+"&demand_code="+obj.DEMAND_CODE+"&demand_status="+obj.DEMAND_STATUS+"&demand_name="+obj.DEMAND_NAME+"&is_evaluate="+obj.IS_EVALUATE;
			}
			common.go.next(encodeURI(url,'utf-8'));
		});
	},
	//创建显示下载附件
	createDownLoadFileBody: function(downObj,obj,indexm){
		var newdex=obj.ATTACHMENT_VALUE+indexm;
		var str=obj.ATTACHMENT_NAME;
		var array=str.split(".");
		var att_names=array[array.length-1];
		var newhtml="<a class='downloaddiv' style='display: inline-block;width: 100%;line-height: 30px;' id='download_file"+newdex+"' file_path='"+obj.ATTACHMENT_PATH+"' file_name='"+obj.ATTACHMENT_NAME+"' file_other_name='"+obj.OTHER_ATTACHMENT_NAME+"' file_Type='"+att_names+"'>"+obj.ATTACHMENT_NAME+"</a>";
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
//			     var filePath1 = $(this).attr("file_path");
//			     var file_names = $(this).attr("file_name");
			    if(att_name=='jpg'||att_name=='png'||att_name=='bmp'||att_name=='gif'||att_name=='jpeg'||att_name=='tiff'||att_name=='pcx'||att_name=='tga'||att_name=='exif'||att_name=='fpx'||att_name=='svg'||att_name=='psd'||att_name=='cdr'||att_name=='pcd'||att_name=='dxf'||att_name=='ufo'||att_name=='eps'||att_name=='ai'||att_name=='raw'){
			    	var url="";
			    	url="fileDownInfo.html?file_path="+file_pathImg;
			    	common.go.next(encodeURI(url,'utf-8'));
			    }else{
			    	
//					var parama={					
//							"handleType"     : 2024,
//							"filePath"       : filePath1,
//							"fileName"       : file_names,
//							"downloadName"   : file_other_name,
//					};			
//					$.jump.ajax(URL_SHORT_PROCESS, function(json) {
//						
//							if(json.code == "0"){
//								
//								file_path = "http://117.32.232.208"+json.file_path;
//								new AppService().readerFile(file_path,function(msg){showAlert(msg);},function(err){showAlert(err);});
//							}
//						}, parama, false,false);
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
	var transitShortProcessList = new TransitShortProcessList();
	transitShortProcessList.init($(this));
});
