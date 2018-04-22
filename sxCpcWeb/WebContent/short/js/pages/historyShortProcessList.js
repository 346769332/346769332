var HistoryShortProcessList = new Function();

HistoryShortProcessList.prototype = {

	parentBody : null,
	
	data : null,

	flowType : null,

	scroll : null,
	ratingOp : null,

	pages : {
		pagenum  : 0,
		pagesize : 20
	},

	isSearch : false,
	init : function(parentBody) {
		this.parentBody = parentBody;
		this.flowType = common.utils.getHtmlUrlParam("flowType");
		this.bindMethod();
		this.searchHistoryProcessList('N');
	},
	
	bindMethod : function() {
		var parentThis = this;
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);
		
		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
		
		"".findById("button", "searchBtn", this.parentBody)[0].bind("click",function(){
			parentThis.pages.pagenum = 1;
			var meter1 =setTimeout(function(){parentThis.searchHistoryProcessList('Y');
			clearTimeout(meter1);
			}, 200);
		});
		parentThis.deteTime();
	},
	
	getPageParam : function(){
		
		var demandName = $("#demandName").val();
		var appStartDate = $("#appStartDate").val();
		var appEndDate = $("#appEndDate").val();
		var workflowType = $('#workflowType option:selected').val();
		var param = {
					"handleType"   :		2006 ,
					"demandName"   :		demandName,
					"workflowType" :	    workflowType,
					"appStartDate" :	    appStartDate,
					"appEndDate"   :	    appEndDate,
		};
		return param;
	},
	searchHistoryProcessList :function(isDelete){
		var parentThis = this;
		parentThis.isSearch = true;
		var param = parentThis.getPageParam();
		param["limit"] = parentThis.pages.pagenum;
		param["pageSize"] = parentThis.pages.pagesize;
		
		$.jump.ajax(URL_SHORT_PROCESS,function(data){
			if(data.code == 0){
				//添加滚动条
				var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
//				scrollDivObj.height((document.documentElement.clientHeight-60)+"px");
				scrollDivObj.height((document.documentElement.clientHeight-(document.documentElement.clientHeight*0.15))+"px");
				parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
					if(!parentThis.isSearch)
						parentThis.searchHistoryProcessList('N');
				});
				parentThis.data = data;
				parentThis.setPageList(data.data,"todayTable","历史短流程需求列表",isDelete);
				
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
		var historyListShowDivObj = "".findById("div", "historyListShowDiv", this.parentBody)[0];
		var tableObj = "".findById("div", id, historyListShowDivObj)[0];
		if(common.utils.isNull(tableObj))
			this.createTableModel(historyListShowDivObj,id,desc);
		else if(common.utils.isNull(list)){
			if(isDelete == "Y")
			tableObj.html("");
			return;
		}
		tableObj = "".findById("div", id, historyListShowDivObj)[0];
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
		var html="<div class='srys'>";
		html+="<dl class='srys_box' id='demand"+obj.DEMAND_ID+"'><dt>"+obj.DEMAND_NAME+"</dt><dd></dd></dl>";
		html+="<dl class='list' style='min-height: 40px;'><dt><div class='wczwcz'>需求描述：</div></dt><dd><div class='dxfdxf'>"+obj.DEMAND_DESC+"</div></dd></dl>";
		html+="<dl class='list' style='min-height: 40px;'><dt><div class='wczwcz'>流程类型：</div></dt>";
        if(obj.WORKFLOW_SINGLE_TYPE=="0"){
        	html+="<dd><div class='dxfdxf'>渠道工号审批流程</div></dd></dl>";
        }else if(obj.WORKFLOW_SINGLE_TYPE=="1"){
        	html+="<dd><div class='dxfdxf'>签报流程</div></dd></dl>";	
        }else if(obj.WORKFLOW_SINGLE_TYPE=="2"){
        	html+="<dd><div class='dxfdxf'>内联单流程</div></dd></dl>";	
        }else{
        	html+="<dd><div class='dxfdxf'>其他流程</div></dd></dl>";	
        }
		html+="<dl class='list'><dt><div class='wczwcz'>发起时间：</div></dt><dd><div class='dxfdxf'>"+(obj.DCREATE_TIME).substring(0,16)+"</div></dd></dl>";
		html+="<dl class='list'><dt><div class='wczwcz'>流程状态：</div></dt>";
		//1000：需求审批中 1001：需求审批完结 1002：需求保存为草稿
		if(obj.DEMAND_STATUS=="1000"){
			html+="<dd><div class='dxfdxf'>审批中</div></dd></dl>";
        }else if(obj.DEMAND_STATUS=="1001"){
        	html+="<dd><div class='dxfdxf'>审批完结</div></dd></dl>";
        }else if(obj.DEMAND_STATUS=="1002"){
        	html+="<dd><div class='dxfdxf'>保存草稿</div></dd></dl>";
        }
		html+="<dl class='list'><dt><div class='wczwcz'>评价说明：</div></dt><dd><div class='dxfdxf'>"+obj.EVALUATE_INFO+"</div></dd></dl>";
		html+="<dl class='list' style='border-bottom: none;'><dt><div class='wczwcz'>评价打分：</div></dt>";
		html+="<dd><div class='xj_box'>";
		var starLevel = 0;
        for(var i=0; i<obj.STAR_EVALUATE;i++){
    		html+="<a><img src='../images/xx_03.png'></a>";
    		starLevel++;
        }
        for(var j=0;j<5-starLevel;j++){
        	html+="<a><img src='../images/xx_06.png'></a>";
        }
        html+="</div></dd></dl>";
//      html+="<dl class='list_last'><dt><div class='btn_f' id=comeAgain"+obj.WORKFLOW_ID+">再来一单</div></dt></dl>";
        html+="</div>";
        tableObj.append(html);
        // 添加事件
		"".findById("dl","demand"+obj.DEMAND_ID,tableObj)[0].unbind().bind("click",function(){
			var url="";
			if(obj.WORKFLOW_SINGLE_TYPE=="3"){//末梢库存流程
				url="materialDemandInfo.html?pageType=history&demand_id="+obj.DEMAND_ID+"&starNum="+obj.STAR_EVALUATE;
			}else{
				url="historyShortProcessListInfo.html?demand_id="+obj.DEMAND_ID+"&workflow_id="+obj.WORKFLOW_ID+"&demand_code="+obj.DEMAND_CODE+"&demand_name="+obj.DEMAND_NAME;
			}
			common.go.next(encodeURI(url,'utf-8'));
		});
//		"".findById("div","comeAgain"+obj.WORKFLOW_ID,tableObj)[0].unbind().bind("click",function(){
//			common.go.next("comeAgainhistoryShortProcessList.html?demandId="+obj.DEMAND_ID+"&latn_id="+obj.WLATN_ID);
//		});
	},
	deteTime : function(){
		var parentThis = this;
		var currYear = (new Date()).getFullYear();	
		var opt={};
		opt.date = {preset : 'date'};
		opt.datetime = {preset : 'datetime'};
		opt.time = {preset : 'time'};
		opt.default = {
			theme: 'android-ics light', //皮肤样式
	        display: 'modal', //显示方式 
	        mode: 'scroller', //日期选择模式
			dateFormat: 'yyyy-mm-dd',
			lang: 'zh',
			showNow: true,
	        startYear: currYear - 10, //开始年份
	        endYear: currYear + 10 //结束年份
		};

	  	$("#appStartDate").mobiscroll($.extend(opt['date'], opt['default']));
	  	$("#appEndDate").mobiscroll($.extend(opt['date'], opt['default']));
	},
};
$(document).ready(function() {
	var historyShortProcessList = new HistoryShortProcessList();
	historyShortProcessList.init($(this));
});