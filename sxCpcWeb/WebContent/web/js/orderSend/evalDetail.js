var EvalDetail = new Function() ;

EvalDetail.prototype = {
	selecter : "#evalDetailPage",
	demandInst : null,
	recordSet : null,
	evalNum : 0,
	init : function (demandId,recordId){
		parentThis = this ;
		this.demandId = demandId;
		this.recordId = recordId;
		this.bindMetod(parentThis);
	    parentThis.demandInfo(parentThis.demandId, parentThis.recordId);
	},
	
	bindMetod : function(parentThis) {
		 //回退
	    $("#ceoTurnBack").unbind('click').bind("click",function(){
	    	
			parentThis.changeDemand("-1", "需求打回");
	    });
	    //评价
	    $("#ceoEvalBtn").unbind('click').bind("click",function(){
	    	parentThis.changeDemand("1", "星级评价");
	    });
	    //返回
	    $("#goBackBtn").unbind('click').bind("click",function(){
	    	$.jump.loadHtmlForFun("/web/html/orderSend/evalDemandList.html".encodeUrl(),function(menuHtml){
				$("#content").html(menuHtml);
				var evalDemandList=new EvalDemandList();
				evalDemandList.init();
			});
	    });
	},
	
	//需求流转中列表信息详情
	demandInfo : function(demandId, recordId){
		var param = {
				"handleType"		:	"demandDetailInfo",
				"isHistory"			: 	"Y",
				"isNodeIntercept"	: 	"Y",
    			"demand_id"			: 	demandId,
    			"recordId"			:	recordId,
    	};
		$.jump.ajax(SHOW_DEMAND_DRAFT_LIST_LST.encodeUrl(),function(data){
			if(data.code == 0){
				parentThis.demandInst = data.demandInst;
				parentThis.recordSet = data.recordSet;
				parentThis.showDemandInfo(data.demandInst);
				//展示附件信息
				parentThis.showAttachmentInfo(data.imgList);
				parentThis.showRecordInfo(data.recordSet);
			}
		},param,true);
	},
	//展示需求单详细信息
	showDemandInfo : function(param){
		$("#demand_theme").html('需求主题：'+param.demand_theme);
		$("#demand_id").html(param.demand_id); //需求单号
		$("#create_time").html(param.create_time); // 发起时间
		$("#promoters").html(param.promoters); //发单人
		$("#department").html(param.department); // 发单部门
		$("#tel").html(param.tel);
		$("#demand_type").html(param.demand_type_name);//需求类型 
//		$("#over_time").html(param.over_time); //办结时间
		if(!(param.limit_time=="" || param.limit_time==null)){
			$("#limit_time").html(param.limit_time+'小时'); //处理时限
		}
		$("#demand_details").html(param.demand_details); //需求描述
		//星级评价
		var html=[];
		for (var int = 0; int < 5; int++) {
			html.push('<a name="evalStar" index="'+(int+1)+'" class="evalStarGrey" href="javascript:void(0)"/>');
		}
		$("#time_eval").html(html.join(''));
		$("#over_eval").html(html.join(''));
		$("#attitude_eval").html(html.join(''));
//		var num = param.over_eval;
//		for(var j = 0; j < num; j++){
//			var starobj=$("#over_eval").find('a[name=evalStar][index='+(j+1)+']');
//			starobj.removeClass();
//			starobj.addClass("evalStarYellow");
//		}
		$("#time_eval").find("a[name=evalStar]").unbind("click").bind("click",function(){
			debugger;
			var thisAObj=$(this);
			parentThis.showChooseStar(thisAObj);
		});
		$("#over_eval").find("a[name=evalStar]").unbind("click").bind("click",function(){
			debugger;
			var thisAObj=$(this);
			parentThis.showChooseStar(thisAObj);
		});
		$("#attitude_eval").find("a[name=evalStar]").unbind("click").bind("click",function(){
			debugger;
			var thisAObj=$(this);
			parentThis.showChooseStar(thisAObj);
		});
		
	},
	showChooseStar  :  function(thisAObj){
		thisAObj.parent().children("a[name=evalStar]").removeClass();
		thisAObj.prevAll().addClass("evalStarYellow");
		thisAObj.addClass("evalStarYellow");
		thisAObj.parent().attr("index",thisAObj.attr("index"));
		thisAObj.nextAll().addClass("evalStarGrey");
		parentThis.evalNum = thisAObj.parent().attr('index'); 
	},
	showAttachmentInfo : function(fileList){
 			var html=[];
 			var fileInfoObj=$('#attachment');
 			if(fileList.length>0){
				//附件
				$.each(fileList,function(i,obj){
					var pointIndex = obj.attachment_name.lastIndexOf(".");
					var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
					var file_name="";
					if(obj.attachment_name.length >13) {
						file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
					}else {
						file_name = obj.attachment_name;
					}
					var other_file_name=obj.OTHER_ATTACHMENT_NAME;
					html.push('<div id="file'+i+'" class="lable-title fl" style="width:30%;"><a href="javascript:void(0)" name="attachment" file_name="'+obj.attachment_name+
							'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="'+obj.attachment_name+'">'+file_name+'</a>');
					html.push('</div>');
				});
				fileInfoObj.html(html.join(''));
				//附件下载
				fileInfoObj.find('a[name=attachment]').unbind("click").bind("click",function(){
					var otherName=$(this).attr("other_file_name");
					var downLoadName="";
					if(otherName==""||otherName==undefined||otherName==null){
						downLoadName=$(this).attr("file_name");
					}else{
						downLoadName=otherName;
					}
					var param={
							"fileName"     :	$(this).attr("file_name"),
							"downloadName" :    downLoadName,
							"filePath"	   :	$(this).attr("file_path")
					};	
					window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
				});
 			}else{
 				html.push('<div>无上传的附件</div>');
 				fileInfoObj.html(html.join(''));
 			}
	},
	//展示流程信息
	showRecordInfo : function(list){
		var html = [];
		$.each(list,function(i,obj){
			html.push('<tr style="text-align: center;">');
			html.push('<td>'+(i+1)+'</td>');
			html.push('<td id='+obj.curr_node_id+'>'+obj.curr_node_name+'</td>');
			html.push('<td id="'+obj.opt_id+'">'+obj.opt_name+'</td>');
			html.push('<td>'+obj.opt_time+'</td>');
			html.push('<td title="'+obj.opt_desc+'">'+splitStr(obj.opt_desc,20)+'</td>');
			html.push('<td>'+obj.time_count+'</td>');
			html.push('<td>'+obj.urge_count+'</td>');
			html.push('</tr>');
		});
		$("#recordOfDemandInfo").html(html.join(''));
	},
	
	changeDemand : function(opt, desc){
		if(!this.validate(opt)){
			return;
		}
		var param = parentThis.getPageParam();
		param.opt = opt;
		$.jump.ajax(URL_EVAL_DEMAND.encodeUrl(),function(data){
			if(data.code == 0){
				layer.alert(desc + '成功！',9);
				$.jump.loadHtmlForFun("/web/html/orderSend/evalDemandList.html".encodeUrl(),function(menuHtml){
					$("#content").html(menuHtml);
					var evalDemandList=new EvalDemandList();
					evalDemandList.init();
				});
			}else{
				layer.alert(desc + '失败！',8);
			}
		},param,true);
	},
	validate : function(opt){
		var evalDesc = $("#over_opinion").val();
		var overEval=$("#over_eval").attr("index");
		var timeEval=$("#time_eval").attr("index");
		var attiEval=$("#attitude_eval").attr("index");
		if(evalDesc.trim().length==""&&opt=="-1"){
			layer.alert('需求回退时，务必填写打回意见！',8);
			return false;
		}
		if(evalDesc.trim().length==""&&opt=="1"){
			layer.alert('评价时，务必填写评价意见！',8);
			return false;
		}
		if(evalDesc.trim().length>700){
			layer.alert('意见不能超过700字！',8);
			return false;
		}
		if(opt=="1"&&timeEval=="0"){
			layer.alert('确认评价时，请先选择时间评价星级！',8);
			return false;
		}
		if(opt=="1"&&overEval=="0"){
			layer.alert('确认评价时，请先选择结果评价星级！',8);
			return false;
		}
		if(opt=="1"&&attiEval=="0"){
			layer.alert('确认评价时，请先选择态度评价星级！',8);
			return false;
		}
		return true;
	},
	getPageParam : function(parentThis){
		var demandList = this.demandInst;
		var recordLen = this.recordSet.length;
		var currRecord = this.recordSet[recordLen-1];
		var paseRecord = this.recordSet[recordLen-2];
		var opt_name=currRecord.opt_name;
		var pase_opt_name=paseRecord.opt_name;
		if(opt_name!=''&&opt_name!=null&&opt_name.indexOf('-')>0){
			opt_name=opt_name.split('-')[1];
		}
		if(pase_opt_name!=''&&pase_opt_name!=null&&pase_opt_name.indexOf('-')>0){
			pase_opt_name=pase_opt_name.split('-')[1];
		}
		var overEval=$("#over_eval").attr("index");
		var timeEval=$("#time_eval").attr("index");
		var attiEval=$("#attitude_eval").attr("index");
		var param = {
				"over_eval" 	: overEval,//结果评价
				"eval_time"     : timeEval,//时间评价
				"eval_atti"     : attiEval,//态度评价
				"over_opinion" 	: $("#over_opinion").val(),
				"demand_theme"	: demandList.demand_theme,
				"demand_id"		: demandList.demand_id,
				"curr_record_id": currRecord.record_id ,
				"curr_node_id"	: currRecord.curr_node_id,
				"curr_node_name": currRecord.curr_node_name,
				"opt_id"		: currRecord.opt_id,
				"opt_name"		: opt_name,
				"mob_tel"		: currRecord.mob_tel,
				
				"pase_opt_id"	: paseRecord.opt_id,
				"pase_opt_name"	: pase_opt_name,
				"pase_node_id"	: paseRecord.curr_node_id,
				"pase_node_name": paseRecord.curr_node_name,
				"pase_mob_tel"	: paseRecord.mob_tel,
				"pase_staff_id"  : paseRecord.staff_id,
				"pase_org_id"   : paseRecord.department_id
		};
		return param;
	},
	
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
		obj.val(newDate);
	},
};
