var SearchReportPublic = new Function();

SearchReportPublic.prototype={
		
	selecter : "#searchReportPublicContent",
	
	param : null,
	
	init : function(param){
		debugger;
		
		/*this.selecter.findById("input", "cycleMonth")[0].datetimepicker({
			format: 'Ym',
	         autoclose: true,  
	         ShowUpDown: true,  
	         language: 'zh-CN'  
		});
*/
		this.param = eval("("+param+")");
		this.bindMethod();
		this.defaultShow();
		//this.loadLatnSlt();
		this.searchReportConfig();
	},
	bindMethod : function(){
		
		var parentThis = this;
		//查询按钮
		this.selecter.findById("a", "searchReportA")[0].unbind().bind("click",function(){
			debugger;
			var searchReportPublicHeadObj = parentThis.selecter.findById("thead", "searchReportPublicHead")[0];
			var searchReportPublicBodyObj = parentThis.selecter.findById("tbody", "searchReportPublicBody")[0];
			var divFooterObj = parentThis.selecter.findById("div", "demandReportFooter")[0];
			
			searchReportPublicHeadObj.html("");
			searchReportPublicBodyObj.html("");
			
			parentThis.searchReprot(searchReportPublicHeadObj,searchReportPublicBodyObj,divFooterObj);
		});
		
		//查询按钮
		this.selecter.findById("a", "excelReportA")[0].unbind().bind("click",function(){
			debugger;
			var confirm=layer.confirm('确定按当前条件导出Excel？', function(){
				debugger;
				parentThis.outExeclReprot();
				layer.close(confirm);
			});
			
		});
		
	},
	loadLatnSlt : function(){
		//初始化本地网
		var latnIdObj =this.selecter.findById("select","latnId")[0];
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			debugger;
			if(json.code == "0" ){
				if(json.latnSet.length > 0){
					var html = [];
					latnIdObj.html("");
					$.each(json.latnSet,function(i,obj){
						html.push('<option value = '+obj.REGION_ID+' latnId = '+obj.REGION_ID+'>'+obj.REGION_NAME+'</option>');
					});
					latnIdObj.html(html.join(''));
				}
			}else{
				layer.alert(json.msg);
			};
		}, null, false,false);
	},
	searchReportConfig : function(){
		var parentThis = this;
		$.jump.ajax( URL_SEARCH_REPORT_CONFIG.encodeUrl(),function(data){
			debugger;
			if(data.code == 0){
				//控件显示
				parentThis.control.setControl(parentThis,data);
				//打印判断
				parentThis.control.printControl(parentThis,data);
				
				
			}else{
				layer.alert(data.msg);
			}
		},this.param,true);
	},
	control : {
		/**控件显示*/
		setControl : function(parentThis,data){
			
			parentThis.selecter.findById("h2", "titleH")[0].html(data.reprotConfig.report_name);
			
			if(null == data.controlSet || data.controlSet.length==0){
				return;
			}
			
			var controlUl = parentThis.selecter.findById("ul", "controlUl")[0];
			
			$.each(data.controlSet,function(){
				
				var liObj = $('<li>'+this.control_name+'</li>');
				if(this.control_type == "SELECT"){
					liObj.append(parentThis.control.createSltHtml(this));
					controlUl.append(liObj);
				}
				else if(this.control_type.indexOf("INPUT")>=0){
					var input = parentThis.control.createInputHtml(this);
					liObj.append(input);
					controlUl.append(liObj);
					if(this.control_base == "date"){
						obj.datetimepicker({
			 				lang		:	'ch',
			 				minDate		: 	newDate,
			 				minTime		:	newDate
			 			});
					}
				}
				
				
			});
		},
		createSltHtml : function(control){
			
			var defaultVal = control.default_value;
			
			var option = "";
			$.each(control.baseSet,function(){
				var slt = "";
				if(this.VALUE == defaultVal){
					slt = "selected";
				}
				option += "<option "+slt+" value='"+this.VALUE+"'>"+this.TEXT+"</option>";
			});
			
			var select = "";
			select += "<select id='"+control.control_id+"' name='"+control.control_id+"' class='w100'>";
			select += option;
			select += "</select >";
			
			return $(select);
		},
		createInputHtml : function(control){
			var contTypes = control.control_type.split(":");
			var type = "text";
			if(contTypes.length  == 2){
				type = contTypes[1];
			}
			var input = $("<input style='width:120px' defaultValue='"+control.default_value+"' type='"+type+"' id='"+control.control_id+"' name='"+control.control_id+"' value='"+control.default_value+"' class='w100'/>");
			
			return input;
		},
		/** 打印控制*/
		printControl : function(parentThis,data){
			if(data.reprotConfig.has_print && data.reprotConfig.has_print =="Y"){
				var printReprotA = parentThis.selecter.findById("a", "printReportA")[0];
				printReprotA.css("display","");
				printReprotA.unbind().bind("click",function(){
					debugger;
					var reportBody = parentThis.selecter.findById("tbody", "searchReportPublicBody")[0];
					
					if(reportBody.children().length<=0 || reportBody.children()[0].tagName == "TD"){
						layer.alert("请先查询需要打印的报表数据，再进行打印！");
						return;
					}
					var confirm=layer.confirm('确定打印当前页？', function(){
						debugger;
						layer.close(confirm);
						parentThis.printReport();
						
					});
					
				});
				
			}
		}
	},
	defaultShow : function(){
		var searchReportPublicBodyObj = this.selecter.findById("tbody", "searchReportPublicBody")[0];
		searchReportPublicBodyObj.html("<td>--无数据，请点击查询进行检索--</td>");
	},
	getParam : function(param){
		
		var params = {};
		common.utils.jsonPush(params,param);
		
		debugger;
		
		var form = this.selecter.findById("form", "controlForm")[0];
		
		$.each(form.get(0),function(){
			params[this.id] = this.value;
		});
		
		return params;
	},
	validate : function(){
		
		var cycleMonth = this.selecter.findById("input", "cycleMonth")[0];
		
		var cycleMonthVal = cycleMonth.val().replace("-","");
		
		if(cycleMonthVal.length<=0){
			layer.alert("请先填写“查询月份”再进行查询检索！");
			return false;
		}
		
		if(cycleMonthVal.length != 6 || isNaN(cycleMonthVal)){
			layer.alert("请先填写正确的“查询月份”，再进行查询检索！");
			return false;
		}
		
		var year = cycleMonthVal.substr(0,2);
		if(year!="20"){
			layer.alert("请先填写正确的“查询月份”，再进行查询检索！");
			return false;
		}
		var month = cycleMonthVal.substr(4,6);
		if(month>12){
			layer.alert("请先填写正确的“查询月份”，再进行查询检索！");
			return false;
		}
		
		return true;
	},
	outExeclReprot : function(){
		//if(!this.validate()){
		//	return;
		//}
		var param = this.getParam(this.param);
		param["outExcel"] = "Y";
		debugger;
		
		var execlForm = this.selecter.findById("form", "execlForm")[0];
		execlForm.attr("action",URL_SEARCH_REPORT.encodeUrl());
		execlForm.attr("method","post");
		execlForm.html("");
		for(var item in param){
			execlForm.append($("<input type='hidden' name='"+item+"' value='"+param[item]+"'/>"));
		}
		execlForm.submit();
	},
	searchReprot : function(searchReportPublicHeadObj,searchReportPublicBodyObj,divFooterObj,hidParam){
		var parentThis = this;
		//if(!this.validate()){
		//	return;
		//}
		var params = this.getParam(this.param);
		params["outExcel"] = "N";
		if(hidParam) 
			common.utils.jsonPush(params,hidParam);
		debugger;
		// 分页查询
		common.pageControl.start(URL_SEARCH_REPORT.encodeUrl(),
				 0,
				 0,
				 params,
				 "searchReportSet",
				 null,
				 divFooterObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					debugger;
					if(data.code == "0"){
						parentThis.showList(data, searchReportPublicHeadObj, searchReportPublicBodyObj);
					}else{
						layer.alert(data.msg);
					}
				}
		);
	},
	showList : function(searchReport,searchReportPublicHeadObj,searchReportPublicBodyObj){
		var parentThis = this;
		if(!searchReport.headSet || searchReport.headSet.length == 0){
			this.defaultShow();
			return;
		}
		
		var width = 1/searchReport.headSet.length*100;
		var head = "<tr>";
		//绘制头部
		$.each(searchReport.headSet,function(){
			var headName = this.toString();
			if(headName.indexOf("hid_") != 0){
				head += "<td style='width:"+width+"%;'>"+headName+"</td>";
			}
		});
		head+= "</tr>";
		searchReportPublicHeadObj.html(head);
		//绘制内容
		if(searchReport.headSet.length>0){
			contentWidth = $($(searchReportPublicHeadObj.children()[0]).children()[0]).width();
		}
		var html = "";
		var sub_report_id = this.param.report_id;
		$.each(searchReport.searchReportSet,function(row){
			var reportImem = this;

			html += "<tr >";
			var hidParam = {};
			$.each(searchReport.headSet,function(col){
				var headName = this.toString();
				var colValue = reportImem[headName];
				
				var hidName = headName.indexOf("hid_");
				if(hidName == 0){
					hidParam[headName.split("hid_")[1]] = colValue;
					return;
				}
				var subRelObj = null;
				$.each(searchReport.subRelSet,function(){
					if(headName == this.column_id){
						hidParam["report_id"] = this.sub_report_id;
						sub_report_id = this.sub_report_id;
						subRelObj = this;
						return false;
					}
				});
				
				var colStr = "";
				if(null != subRelObj){
					colStr = "<a href='javascript:void(0);' hidparam='"+JSON.stringify(hidParam)+"' id='a_col_"+subRelObj.report_id+"_"+row+"_"+col+"'>"+colValue+"</a>";
				}else{
					colStr = colValue;
				}
				
				html += "<td style='word-break: break-all;white-space: nowrap;overflow: hidden; text-overflow: ellipsis;' title='"+reportImem[this.toString()]+"'>"+colStr+"</td>";
			});
			html += "</tr>";
		});
		searchReportPublicBodyObj.html(html);
		
		//创建事件 parentThis.showList(data, searchReportPublicHeadObj, searchReportPublicBodyObj);
		$.each(this.selecter.findById("a", "^a_col_"),function(){
			this.unbind("click").bind("click",function(){
				debugger;
				var a = $(this);
				var aId = a.attr("id");
				var trId = "sub_tr_"+aId;
				//隐藏下级全部
				var rowTopId = aId.substr(0,aId.lastIndexOf("_"));
				var hasExists = false;
				$.each(parentThis.selecter.findById("tr", "^sub_tr_"+rowTopId),function(){
					if(this.attr("id") == trId){
						if(this.is(":hidden")){
							this.show();
						}else{
							this.hide();
						}
						hasExists = true;
					}else{
						this.hide();
					}
					
				});
				//是否已经存在，无需查询
				if(hasExists){
					return;
				}
				//不存在需要创建
				parentThis.createSubReport(parentThis,trId,a);
			});
		});
	},
	//创建子报表显示
	createSubReport : function(parentThis,trId,a){
		var hidParamStr = a.attr("hidparam");
		var aId = a.attr("id");
		var hidParam = eval("("+hidParamStr+")");
		var theadId = "sub_thead_"+aId;
		var tbodyId = "sub_tbody_"+aId;
		var subDivId = "sub_div_"+aId;
		var divFooterId = "sub_footer_"+aId;

		var tr = a.parent().parent();
		var len = tr.children().length;
		var newTr = $("<tr id='"+trId+"'></tr>");
		tr.after(newTr);
		newTr.html("<td colspan='"+len+"'><div id='"+subDivId+"' style='margin-top:3px;'></div></td>");
		
		var subFormat = '<table width="100%" border="0" cellspacing="0" cellpadding="0" class="tab2 mt10" style="table-layout:fixed">';
		subFormat += '<thead id="'+theadId+'"></thead>';
		subFormat += '<tbody id="'+tbodyId+'"></tbody>';
		subFormat += '</table>';
		subFormat += '<div class="page mt10" id="'+divFooterId+'">';
		
		var subDiv = parentThis.selecter.findById("div", subDivId)[0];
		subDiv.html(subFormat);
		
		//开始执行查询
		var searchReportPublicHeadObj = parentThis.selecter.findById("thead", theadId)[0];
		var searchReportPublicBodyObj = parentThis.selecter.findById("tbody", tbodyId)[0];
		var divFooterObj = parentThis.selecter.findById("div", divFooterId)[0];
		
		parentThis.searchReprot(searchReportPublicHeadObj,searchReportPublicBodyObj,divFooterObj,hidParam);
	},
	printReport : function(){
		
		$("#topHeader").css("display","none");
		var demandReportFooter = this.selecter.findById("div", "demandReportFooter")[0];
		var printReportA = this.selecter.findById("a", "printReportA")[0];
		var excelReportA = this.selecter.findById("a", "excelReportA")[0];
		
		demandReportFooter.css("display","none");
		printReportA.css("display","none");
		excelReportA.css("display","none");
		
		var searchReportPublicBodyObj = this.selecter.findById("tbody", "searchReportPublicBody")[0];
		$.each(searchReportPublicBodyObj.children(),function(){
			$.each($(this).children(),function(){
				$(this).css("overflow","");
				$(this).css("white-space","");
			});
		});
		
		//开始
		window.print();
		
		//结束
		$("#topHeader").css("display","");
		demandReportFooter.css("display","");
		printReportA.css("display","");
		excelReportA.css("display","");
		
		$.each(searchReportPublicBodyObj.children(),function(){
			$.each($(this).children(),function(){
				$(this).css("overflow","hidden");
				$(this).css("white-space","nowrap");
			});
		});
	}
};