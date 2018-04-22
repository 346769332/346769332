var LeadStrokeArrangeShow = new Function();
LeadStrokeArrangeShow.prototype = {
	selecter : "#leadStrokeArrangeShowPage",
	dateInfo : "",//二级时间标题
	ascriptionLaedName : "",//领导名称
	headlineInfo : "",//标题
	startDate : "",//开始时间
	endDate   : "",//结束时间
	weekSum   : "",//第几周
	yearSum   : "",//年份
	storkeListInfo:"",//行数据
	storkeheadlineInfo:"",//列数据
	uploadHeadLine:"",
	endDate6:"",
	endDate7:"",
	stroketCount1:"",//周天数据判断值
	stroketCount:"",//周六数据判断值
	leadStroketAllCount:"",//所有领导数
	// 初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {

		// 加载本周模板
		parentThis.thisWeekModel(parentThis);
		// 导出
		var sendSaveObj = parentThis.selecter.findById("span", "dataUpload")[0];
		sendSaveObj.unbind("click").bind("click", function() {
			parentThis.dataUploadInfo(parentThis);
		});
	},
	weekOfYear : function(year,month,day){
		var parentThis = this;
		 var   date1   =   new   Date(year,   0,   1);   
         var   date2   =   new   Date(year,   month-1,   day,   1);   
         var   dayMS   =   24*60*60*1000;   
         var   firstDay   =   (7-date1.getDay())*dayMS;   
         var   weekMS   =   7*dayMS;   
         date1   =   date1.getTime();   
         date2   =   date2.getTime();   
         return   Math.ceil((date2-date1-firstDay)/weekMS)+1;   
	},
	thisWeekModel: function(parentThis) {
	      var weeks;
	      var clen = 7;
	      var currentFirstDate;
	      var html = "";
	      var formatDate = function(date){       
	        var year = date.getFullYear();
	        var month = (date.getMonth()+1);
	        var day = date.getDate();
	        weeks = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')'; 
	        parentThis.weekSum =  parentThis.weekOfYear(year,month,day);
	        parentThis.yearSum =  year;
	        return year+'/'+month+'/'+day;
	      };
	      var addDate= function(date,n){    
	        date.setDate(date.getDate()+n);    
	        return date;
	      };
	      var setDate = function(date){       
	        var week = date.getDay()-1;
	        date = addDate(date,week*-1);
	        currentFirstDate = new Date(date);
	        var formatDate1;
	        for(var i = 0;i<clen;i++){
	        	
	          formatDate1 = formatDate(i==0 ? date : addDate(date,1));
	          if(i==0){
	        	  parentThis.dateInfo+= formatDate1+"-";
	        	  parentThis.startDate= formatDate1;
	  			/**
	  			 * 标题
	  			 **/
	  	       $("#headlineInfo").html(parentThis.yearSum+"年第"+parentThis.weekSum+"周领导行程安排计划表");
	  	      parentThis.uploadHeadLine = parentThis.yearSum+"年第"+parentThis.weekSum+"周领导行程安排计划表";
	          }
	          if(i==5){
	        	  parentThis.endDate6 = formatDate1+"\n"+weeks;
	          }
	          if(i==6){
	        	  parentThis.endDate7 = formatDate1+"\n"+weeks;
	        	  parentThis.dateInfo+= formatDate1;
	        	  parentThis.endDate= formatDate1;
			      var params={
			  				"handleType"			:   "qryLst",
							"dataSource"			:   "",
							"nameSpace" 			:   "leadStroke",
							"sqlName"   			:   "judgmentWeekendsIsNull",
			  				"startDate"				:	parentThis.startDate,
			  				"endDate"				:	parentThis.endDate
					};
					 $.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
							if(json.code == "0" ){	
								if(json.data.length>0){
									debugger;
									parentThis.stroketCount1 = json.data[0].stroketCount1;
									parentThis.stroketCount = json.data[0].stroketCount;
									parentThis.leadStroekListInfo(parentThis);
								}
							 }else{
								layer.alert("查询领导行程异常!");	
							 }
					 }, params, false,false);
	        	  
	          }
	        }
	        $("#dateInfos").html(parentThis.dateInfo);//
	      };
	       document.getElementById('lastWeek').onclick = function(){
	    	   parentThis.dateInfo = "";
	    	   $("#dateInfos").html("");
	          setDate(addDate(currentFirstDate,-7));
	          
	        };       
	        document.getElementById('nextWeek').onclick = function(){
	        	parentThis.dateInfo = "";
	        	$("#dateInfos").html("");
	          setDate(addDate(currentFirstDate,7));
	        }; 
	      setDate(new Date());
	},
	leadStroekListInfo : function(parentThis){
		var html="";
		$("#leadStrokeList").html("");
		var rowSum;
  		var param={
  				"handleType"	:  "qryLst",
				"dataSource"	:  "",
				"nameSpace" 	:  "leadStroke",
				"sqlName"   	:  "qryLeadStorkeheadlineInfo",
  				"startDate"		:	parentThis.startDate,
  				"endDate"		:	parentThis.endDate
		};
		 $.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){	
					if(json.data.length>0){
						var dataLst = json.data;
						rowSum = dataLst.length;
						html+='<table width="100%" cellspacing="0" class="table_c mt20"><thead class="header"><tr><th  width="50">日期</th><th width="30">时段</th>';
						$.each(dataLst,function(i,obj){	
							html+='<th>'+obj.ASCRIPTIONLAEDNAME+'<br/><div class="zi2">'+obj.ASCRIPTIONLAEDPOSITION+'</div></th>';
						});
						html+='</tr></thead><tbody>';
					}
				 }else{
					layer.alert("查询领导行程异常!");	
				 }
		 }, param, false,false);
  		var param={
  				"handleType"		:  "qryLst",
				"dataSource"		:  "",
				"nameSpace" 		:  "leadStroke",
				"sqlName"   		:  "qryLeadStorkeListInfo",
  				"startDate"			:	parentThis.startDate,
  				"endDate"			:	parentThis.endDate,
  				"endDate6"			:	parentThis.endDate6,
  				"endDate7"			:	parentThis.endDate7,
  				"stroketCount1"		:	parentThis.stroketCount1,
  				"stroketCount"		:	parentThis.stroketCount
		};
		 $.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){	
					if(json.data.length>0){
						var dataLst = json.data;
						for(var j = 0;j<=(dataLst.length-rowSum);){
							html+='<tr>';
							if(j%(rowSum*2)==0){
								html+='<td rowspan="2"><div class="zi1">'+dataLst[j].STROKETIME+'</div></td>';
							}
							for(var i = j; i<(j+rowSum);i++){
								if(i==j){
									html+='<td><div class="zi1">'+dataLst[i].PERIODTIME+'</div></td>';
								}
								if(dataLst[i].PERIODTIME=="上午"&&dataLst[i].STROKEINFO==dataLst[i+rowSum].STROKEINFO){
									html+='<td rowspan="2"><div class="zi1">'+dataLst[i].STROKEINFO+'</div></td>';
								}else if(dataLst[i].PERIODTIME=="下午"&&dataLst[i].STROKEINFO==dataLst[i-rowSum].STROKEINFO){
									
								}else{
									html+='<td><div class="zi1">'+dataLst[i].STROKEINFO+'</div></td>';
								}
								
							}
							j = j+rowSum;
							html+='</tr>';
						}
						$("#leadStrokeList").html(html);
					}
				 }else{
					layer.alert("查询领导行程异常!");	
				 }
		 }, param, false,false);
	},
	dataUploadInfo : function(parentThis){
		var param={
  				"dateInfo"				:	parentThis.dateInfo,
  				"uploadHeadLine"		:	parentThis.uploadHeadLine,
  				"endDate6"				:	parentThis.endDate6,
  				"endDate7"				:	parentThis.endDate7,
  				"stroketCount1"			:	parentThis.stroketCount1,
  				"stroketCount"			:	parentThis.stroketCount,
  				"startDate"				:	parentThis.startDate,
  				"endDate"				:	parentThis.endDate
		};
		//
		window.location.href=URL_DOWN_PDF_LEADSTORKE+"?"+encodeURI($.param(param));
	}
};
