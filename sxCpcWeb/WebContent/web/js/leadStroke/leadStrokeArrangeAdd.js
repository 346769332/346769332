var LeadStrokeArrangeAdd = new Function();
LeadStrokeArrangeAdd.prototype = {
	selecter : "#leadStrokeArrangeAddPage",
	dateInfo : "",
	headlineInfo : "",
	ascriptionLaedId : "",
	ascriptionLaedName : "",
	ascriptionLaedPosition : "",
	headlineInfo : "",
	startDate : "",
	endDate   : "",
	// 初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {

		// 加载本周模板
		parentThis.leadAuthInfo(parentThis);
		// 保存之草稿箱
		var sendSaveObj = parentThis.selecter.findById("a", "sendSave")[0];
		sendSaveObj.unbind("click").bind("click", function() {
			parentThis.sendSaveInfo(parentThis);
		});
		// 发布
		var sendSaveObj = parentThis.selecter.findById("a", "submitInfo")[0];
		sendSaveObj.unbind("click").bind("click", function() {
			parentThis.submitSaveInfo(parentThis);
		});
	},
	validateLeadAuthInfo :function(parentThis){
		 var cells = parentThis.selecter.findById("tbody","leadStrokeAddInfo")[0];
		  var clen = 7;
	      var currentFirstDate;
	      var html="";
	      var formatDate = function(date){       
	        var year = date.getFullYear();
	        var month = (date.getMonth()+1);
	        var day = date.getDate();
	        weeks = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')'; 
	 
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
		          if(formatDate1!=parentThis.startDate){
		        	  html+="<tr><td rowspan='2' style='text-align: center;' ><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;'readonly value='"+formatDate1+"\n"+weeks+"'>"+formatDate1+"\n"+weeks+"</textarea></td><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"'>"+formatDate1+"</textarea></td><td style='text-align: center;' ><textarea style='text-align: center;width: 87%;border-style: none;overflow: hidden;'readonly value='1'>上午</textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td></tr>";
			          html+="<tr><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"\n"+weeks+"'>"+formatDate1+"\n"+weeks+"</textarea></td><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"'>"+formatDate1+"</textarea></td><td style='text-align: center;' ><textarea style='text-align: center;width: 87%;border-style: none;overflow: hidden;'readonly value='0'>下午</textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td></tr>";
			       
		          }
		          if(i==0){
		        	  parentThis.dateInfo+= formatDate1+"-";
		        	  parentThis.startDate= formatDate1;
		          }
		          if(i==6){
		        	  parentThis.dateInfo+= formatDate1;
		        	  parentThis.endDate= formatDate1;
		        	  $("#dateInfos").html(parentThis.dateInfo);
		          }
	          
	          } 
	         
		      var params={
		  				"handleType"			:   "qryLst",
						"dataSource"			:   "",
						"nameSpace" 			:   "leadStroke",
						"sqlName"   			:   "validateLeadAuthInfo",
						"ascriptionLaedId"   	:   parentThis.ascriptionLaedId,
		  				"startDate"				:	parentThis.startDate,
		  				"endDate"				:	parentThis.endDate
				};
				 $.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
						if(json.code == "0" ){	
							if(json.data.length>0){
								layer.alert("该周行程已经新增，请在草稿箱进行修改!");
								$("#dateInfos").html(parentThis.dateInfo);
							}else{
								$("#dateInfos").html(parentThis.dateInfo);
								cells.html(html);
								//parentThis.thisWeekModel(parentThis);
							}
						 }else{
							layer.alert("查询领导行程异常!");	
						 }
				 }, params, false,false);
	      };
	     //$("#dateInfos").html(parentThis.dateInfo);
	      document.getElementById('lastWeek').onclick = function(){
	    	   parentThis.dateInfo = "";
	    	   html = "";
	    	   $("#dateInfos").html("");
		       cells.html("");
	          setDate(addDate(currentFirstDate,-7));
	          //cells.html(html);
	        };       
	       document.getElementById('nextWeek').onclick = function(){
	        	parentThis.dateInfo = "";
	        	html = "";
	        	$("#dateInfos").html("");
		       cells.html("");
	          setDate(addDate(currentFirstDate,7));
	         // $("#dateInfos").html(parentThis.dateInfo);
			   // cells.html(html);
	        }; 
	      setDate(new Date());     
	},
	leadAuthInfo : function(parentThis){
		var param={
				"handleType"	:  "qryLst",
				"dataSource"	:  "",
				"nameSpace" 	:  "leadStroke",
				"sqlName"   	:  "qryLeadAuthInfo"
		};
		 $.jump.ajax(URL_QUERY_COMMON_METHOD.encodeUrl(), function(json) {
				if(json.code == "0" ){	
					if(json.data.length==1){
						parentThis.ascriptionLaedId = json.data[0].TARGETID;
						parentThis.ascriptionLaedName = json.data[0].TARGETNAME;
						parentThis.ascriptionLaedPosition = json.data[0].TARGETPOSITION;
						parentThis.headlineInfo = "公司领导行程安排计划表("+json.data[0].TARGETNAME+"  "+json.data[0].TARGETPOSITION+")";
						$("#headlineInfo").html("公司领导行程安排计划表("+json.data[0].TARGETNAME+" "+json.data[0].TARGETPOSITION+")");
						parentThis.validateLeadAuthInfo(parentThis);
					}else if(json.data.length>1){
						var xthtml = [];
						xthtml.push('<div class="tanchu_box" id="disposeJobInfoPage"  style="width:660px;height:400px;overflow-x:hidden;overflow-y:auto;">');
						xthtml.push('<h3>选择领导</h3>');
						xthtml.push('<div style="overflow:hidden;width:100%;height:auto">');
						xthtml.push('<div id="executerInfo" style="border:1px solid #dedede;" >');         
						xthtml.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"class="tab2 mt10">'); 
						xthtml.push('<thead>');         
						xthtml.push('<tr>'); 
						xthtml.push('<th style="width:10%;">选择</th>');
						xthtml.push('<th style="width:20%;">姓名</th>');
						xthtml.push('<th style="width:20%;">职务</th>');
						
						xthtml.push('</tr>');
						xthtml.push('</thead>');
						xthtml.push('<tbody id="chooseDeptAndExecuterBody"></tbody>');
						xthtml.push('</table>');
						xthtml.push('<div class="page mt10" id="chooseDeptAndExecuterFoot"></div>');
						xthtml.push('<table border="0" id="tabs-1Table" class="table1" cellspacing="0" cellpadding="0" style="border-width:0;border-collapse:collapse;">');
						xthtml.push('<tr>'); 
						xthtml.push('<td style="text-align:center;">');   
						xthtml.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">确认</a>');
						 
						xthtml.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a>'); 
						xthtml.push('</td>'); 
						xthtml.push('</tr>'); 
						xthtml.push('</table>');  
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
						roleInfoPageDiv.find("tbody[id=roleListBody]").html("");
						
						var templateListFootObj = roleInfoPageDiv.find("div[id=chooseDeptAndExecuterFoot]");
						
						var pageIndex = 0;
						var pageSize =5;
						var params=
						{	
								"handleType"	:	"qry",
					    		"dataSource"	:	"",
								"nameSpace" 	:   "leadStroke",
								"sqlName"   	:   "qryLeadAuthInfos"
							
						};
						common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
												pageIndex,
												pageSize,
												 params,
												 "data",
												 null,
												 templateListFootObj,
												 "",
												 function(data,dataSetName,showDataSpan){
							var listBodyObj = roleInfoPageDiv.find("tbody[id=chooseDeptAndExecuterBody]");
							listBodyObj.html("");
							parentThis.createnodeListHtml(parentThis,data,listBodyObj,templateListFootObj);
						});
						
						//选中
						roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
							
							roleInfoPageDiv.find("input[type=radio]").each(function(i,obj){
								var boxObj=$(this);
								if(boxObj.is(':checked')){
									trObj = $(this).parent().parent("tr[name=staffInfo]");
									targetId = trObj.attr("targetId");				
									targetName=trObj.attr("targetName");
									targetPosition=trObj.attr("targetPosition");
									if(boxObj.length==0){
										layer.alert("请选择领导!",8);
										return false;
									}
									parentThis.ascriptionLaedId = targetId;
									parentThis.ascriptionLaedName = targetName;
									parentThis.ascriptionLaedPosition = targetPosition;
									parentThis.headlineInfo = "公司领导行程安排计划表("+targetName+"  "+targetPosition+")";
									$("#headlineInfo").html("公司领导行程安排计划表("+targetName+" "+targetPosition+")");
									parentThis.validateLeadAuthInfo(parentThis);
									layer.close(disposeJobIdInfoPages);
								}
							});
						});
					}
				 }else{
					layer.alert("查询领导权限异常!");	
				 }
		 }, param, false,false);

	},
	createnodeListHtml : function(parentThis,data,listBodyObj,templateListFootObj) {
		
		var html=[];
		var dataLst = data.data;
		if(dataLst.length > 0 ){
			//templateListFootObj.show();
			templateListFootObj.hide();
			$.each(data.data,function(i,obj){
				html.push('<tr name="staffInfo" targetName="'+obj.TARGETNAME+'" targetId="'+obj.TARGETID+'" targetPosition="'+obj.TARGETPOSITION+'">');
				html.push('<td ><input type="radio" name="dept"  style="width: 10%;"></td>');
				html.push('<td >'+obj.TARGETNAME+'</td>');
				html.push('<td >'+obj.TARGETPOSITION+'</td>');
				html.push('</tr>');
			});
		}else{
			templateListFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
	},
	thisWeekModel: function(parentThis) {
	      var cells = parentThis.selecter.findById("tbody","leadStrokeAddInfo")[0];
	      var weeks;
	      var clen = 7;
	      var currentFirstDate;
	      var html = "";
	      var formatDate = function(date){       
	        var year = date.getFullYear();
	        var month = (date.getMonth()+1);
	        var day = date.getDate();
	        weeks = '('+['星期天','星期一','星期二','星期三','星期四','星期五','星期六'][date.getDay()]+')'; 
	 
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
	          }
	          if(i==6){
	        	  parentThis.dateInfo+= formatDate1;
	        	  parentThis.endDate= formatDate1;
	          }
	          
	          html+="<tr><td rowspan='2' style='text-align: center;' ><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;'readonly value='"+formatDate1+"\n"+weeks+"'>"+formatDate1+"\n"+weeks+"</textarea></td><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"'>"+formatDate1+"</textarea></td><td style='text-align: center;' ><textarea style='text-align: center;width: 87%;border-style: none;overflow: hidden;'readonly value='1'>上午</textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td></tr>";
	          html+="<tr><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"\n"+weeks+"'>"+formatDate1+"\n"+weeks+"</textarea></td><td style='text-align: center;display: none;'><textarea style='text-align: center;width: 95%;border-style: none;overflow: hidden;' value='"+formatDate1+"'>"+formatDate1+"</textarea></td><td style='text-align: center;' ><textarea style='text-align: center;width: 87%;border-style: none;overflow: hidden;'readonly value='0'>下午</textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td><td><textarea  style='width: 97%;border-style: none;overflow: hidden;'></textarea></td></tr>";
	        } 
	        $("#dateInfos").html(parentThis.dateInfo);
	        cells.html(html);
	      };
	       document.getElementById('lastWeek').onclick = function(){
	    	   parentThis.dateInfo = "";
	    	   html = "";
	    	   $("#dateInfos").html("");
		        cells.html("");
	          setDate(addDate(currentFirstDate,-7));     
	        };       
	        document.getElementById('nextWeek').onclick = function(){
	        	parentThis.dateInfo = "";
	        	html = "";
	        	$("#dateInfos").html("");
		        cells.html("");
	          setDate(addDate(currentFirstDate,7));
	        }; 
	      setDate(new Date());
	},
	sendSaveInfo : function(parentThis) {
		debugger;
		var dataStr = "";
		var trels = $("#leadStrokeAddInfo").children('tr');//获取行数
		for(var i=0;i<trels.length;i++){
			debugger;
			var sum="";
			var els =  trels[i].children;//获取列数
			 for(var j =0; j<els.length;j++){
				 debugger;
				 if(els[j].children[0].value!=undefined&&els[j].children[0].value!=null&&els[j].children[0].value!=""){
					 if(j==2){
						 if(els[2].children[0].value=="上午"){
							 sum +="1"+",";
						 }else{
							 sum +="0"+","; 
						 }
						 
					 }else{
						 sum +=els[j].children[0].value+",";
					 }
					 
				 }else{
					 sum +=" "+",";
				 }
				
			 }
				dataStr +=";"+sum;
		}
		var param={
				"dataArr"         			:  dataStr.substring(1, dataStr.length),
				"ascriptionLaedId"      	:  parentThis.ascriptionLaedId,//领导ID
				"ascriptionLaedName"    	:  parentThis.ascriptionLaedName,//领导名称
				"ascriptionLaedPosition"    :  parentThis.ascriptionLaedPosition,//领导职务
				"headlineInfo"          	:  parentThis.headlineInfo,//标题
				"saveType"          	    :  "send",//操作类型
//				"startDate"          	    :  parentThis.startDate,//起始时间
//				"endDate"          	    	:  parentThis.endDate,//结束时间
				"methodType"      			: "sendSaveLeadStrokeInfo" 
		};
		 $.jump.ajax(URL_COMMON_LEADSTROKE_LIST.encodeUrl(), function(json) {
				if(json.code == "0" ){	
					var confirm=layer.confirm('保存草稿成功!', function(){
						layer.closeAll('dialog');
						$.jump.loadHtmlForFun("/web/html/leadStroke/leadStrokeArrangeDrafts.html".encodeUrl(),function(pageHtml){
							$("#content").html(pageHtml);
							var leadStrokeArrangeDrafts=new LeadStrokeArrangeDrafts();
							leadStrokeArrangeDrafts.init();
						});
					});
				 }else{
					layer.alert("新增领导行程异常!");	
				 }
		 }, param, false,false);
	},
	submitSaveInfo : function(parentThis) {
		debugger;
		var dataStr = "";
		var trels = $("#leadStrokeAddInfo").children('tr');//获取行数
		for(var i=0;i<trels.length;i++){
			debugger;
			var sum="";
			var els =  trels[i].children;//获取列数
			 for(var j =0; j<els.length;j++){
				 debugger;
				 if(els[j].children[0].value!=undefined&&els[j].children[0].value!=null&&els[j].children[0].value!=""){
					 if(j==2){
						 if(els[2].children[0].value=="上午"){
							 sum +="1"+",";
						 }else{
							 sum +="0"+","; 
						 }
						 
					 }else{
						 sum +=els[j].children[0].value+",";
					 }
				 }else{
					 sum +=" "+",";
				 }
				
			 }
				
				dataStr +=";"+sum;
		}
		var param={
				"dataArr"         			:  dataStr.substring(1, dataStr.length),
				"ascriptionLaedId"      	:  parentThis.ascriptionLaedId,//领导ID
				"ascriptionLaedName"    	:  parentThis.ascriptionLaedName,//领导名称
				"ascriptionLaedPosition"    :  parentThis.ascriptionLaedPosition,//领导职务
				"headlineInfo"          	:  parentThis.headlineInfo,//标题
				"saveType"          	    :  "submit",//操作类型
//				"startDate"          	    :  parentThis.startDate,//起始时间
//				"endDate"          	    	:  parentThis.endDate,//结束时间
				"methodType"      			: "sendSaveLeadStrokeInfo" 
		};
		var confirm=layer.confirm('是否确认发布行程信息？', function(){
			 $.jump.ajax(URL_COMMON_LEADSTROKE_LIST.encodeUrl(), function(json) {
					if(json.code == "0" ){	
						var confirm=layer.confirm('发布成功!', function(){
							layer.closeAll('dialog');
							$.jump.loadHtmlForFun("/web/html/leadStroke/leadStrokeArrangeShow.html".encodeUrl(),function(pageHtml){
								$("#content").html(pageHtml);
								var leadStrokeArrangeShow=new LeadStrokeArrangeShow();
								leadStrokeArrangeShow.init();
							});
						});
					 }else{
						layer.alert("新增领导行程异常!");	
					 }
			 }, param, false,false);
			});
	},
};
