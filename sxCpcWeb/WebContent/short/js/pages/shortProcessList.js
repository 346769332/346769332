var ShortProcessList = new Function();

ShortProcessList.prototype = {

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
					"handleType"   : 2009,
					"workflowState": 1000
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
				parentThis.setPageList(data.data,"todayTable","短流程列表",isDelete);
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
		var html="<div class='srys'><dl class='srys_box'>";
		html+="<dt>"+obj.WORKFLOW_NAME+"</dt><dd></dd></dl>";
		html+="<dl class='list'><dt><div class='wcz'>短流程编码：</div><div class='wcz'>"+obj.WORKFLOW_CODE+"</div></dt>";
		html+="<dd><div class='dxf'></div><div class='dxf'></div></dd></dl>";
		html+="<dl class='list_last'><dt><div class='btn_f' id='editor"+obj.WORKFLOW_ID+"'>发起</div></dt>";
		html+="<dd><div class='btn_x' id='shortProcessListInfo"+obj.WORKFLOW_ID+"'>详情</div></dd>";
		html+="</dl></div>";
		tableObj.append(html);
		//添加事件encodeURI(encodeURI(login_name))
		"".findById("div","shortProcessListInfo"+obj.WORKFLOW_ID,tableObj)[0].unbind().bind("click",function(){
			var url="shortProcessListInfo.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&workflow_SingleType="+obj.WORKFLOW_SINGLE_TYPE+"&workflow_Type="+obj.WORKFLOW_TYPE+"&workflow_Type_Name="+obj.ACT_WORKFLOW_TYPE_NAME;
			common.go.next(encodeURI(url,'utf-8'));
		});
		"".findById("div", "editor"+obj.WORKFLOW_ID,tableObj)[0].unbind().bind("click",function(){
			var url="editor.html?workflow_id="+obj.WORKFLOW_ID+"&workflow_Name="+obj.WORKFLOW_NAME+"&workflow_Type="+obj.WORKFLOW_TYPE+"&workflow_Type_Name="+obj.ACT_WORKFLOW_TYPE_NAME+"&templateId="+obj.TEMPLATE_ID;
				common.go.next(encodeURI(url,'utf-8'));
			});
		}	
};
$(document).ready(function() {
	var shortProcessList = new ShortProcessList();
	shortProcessList.init($(this));
});