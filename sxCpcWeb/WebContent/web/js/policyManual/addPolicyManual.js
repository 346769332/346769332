var AddPolicyManual =new Function();
var useSet=null;
var allSet=null;
var latnId=null;
AddPolicyManual.prototype = {
		temp:  null ,
		selecter : "#showAddPolicyManual",
		editor : null,
		PM : null ,// 政策 包括 政策 子政策  政策属性 
		pmId:"",
		statusparam:null,
		dealType:null,
		init : function(parent,dealType,pmId,statusparam){
			
			temp  = this ;
			temp.pmId=pmId;
			temp.statusparam=statusparam;
			temp.dealType=dealType;
			useSet=null;
			allSet=null;
			temp.bingMethod();
			if('add' == dealType){
				$("#addPM").show();
				temp.initMenu("XSZC");
				//时间插件
				temp.dateBind(temp.selecter.findById("input","addSendDate")[0],null,0);
				temp.dateBind(temp.selecter.findById("input","addEndDate")[0],"M",3);
				CKEDITOR.config.readOnly = false;
				temp.editor = CKEDITOR.replace('editor1'); 
			}else if('update' == dealType){
				$("#updatePM").show();
 				//获取政策  政策属性 政策区域
				var param={
						"id" 	: 		pmId	
				};
				$.jump.ajax(URL_QUERY_POLICYMANUAL_LIST.encodeUrl(), function(json) {
	 				if(json.code == "0" ){
	 					
	 					temp.PM =json.data[0];
	 					temp.initMenu(temp.PM.o_type);
	 					useSet=temp.PM.releaseArea;
	 					//时间插件
	 					$("#addSendDate").val(temp.PM.beginDate);
	 					$("#addSendDate").datetimepicker({
	 						lang:'ch',
	 						timepicker:false,
	 						format:'Y-m-d',
	 						formatDate:'Y-m-d',
	 					});
	 					
	 					$("#addEndDate").val(temp.PM.endDate);
	 					$("#addEndDate").datetimepicker({
	 						lang:'ch',
	 						timepicker:false,
	 						format:'Y-m-d',
	 						formatDate:'Y-m-d',
	 					});
	 					
	 					//发布区域
	 					var releaseArea=temp.PM.releaseArea;
	 					var releaseAreaStr="";
	 					if(null!=releaseArea && releaseArea.length){
	 						$.each(releaseArea,function(i,obj){
	 							if("PROV"==obj.o_type){
	 								releaseAreaStr+=obj.prov_name;
	 							}else if("LATN"==obj.o_type){
	 								releaseAreaStr+=obj.latn_name;
	 							}else if("AREA"==obj.o_type){
	 								releaseAreaStr+=obj.area_name;
	 							}
	 							if(i!=releaseArea.length-1){
	 								releaseAreaStr+=",";
	 							}
	 						});
	 					}
	 					$("#release").val(releaseAreaStr);
	 					
	 					//主题
	 					$("#PMtheme").val(temp.PM.theme);

	 					//主图
	 					$("#updateImg").html('<img id="imgfile" src='+temp.PM.picture+' style="max-width:80px;max-height:80px;border:0px;"/>');
	 					
	 					//正文
	 					$("#PMtheme").val(temp.PM.theme);
	 					//html 编辑器
	 					CKEDITOR.config.readOnly = false;
	 					temp.editor = CKEDITOR.replace('editor1'); 
	 					temp.editor.setData(temp.PM.content) ; 
	 					
					}else{
						layer.alert(json.msg);
					};
				}, param, true,false);
				
			}else if('shenpi' == dealType){
				var param={
						"id" 	: 		pmId	
				};
				$.jump.ajax(URL_QUERY_POLICYMANUAL_LIST.encodeUrl(), function(json) {
	 				if(json.code == "0" ){
	 					
	 					temp.PM =json.data[0];
	 					temp.initMenu(temp.PM.o_type);
	 					//时间插件
	 					$("#addSendDate").val(temp.PM.beginDate);
	 					
	 					$("#addEndDate").val(temp.PM.endDate);

	 					//主图
	 					$("#updateImg").html('<img id="imgfile" src='+temp.PM.picture+' style="max-width:80px;max-height:80px;border:0px;"/>');
	 					
	 					//发布区域
	 					var releaseArea=temp.PM.releaseArea;
	 					var releaseAreaStr="";
	 					if(null!=releaseArea && releaseArea.length){
	 						$.each(releaseArea,function(i,obj){
	 							if("PROV"==obj.o_type){
	 								releaseAreaStr+=obj.prov_name;
	 							}else if("LATN"==obj.o_type){
	 								releaseAreaStr+=obj.latn_name;
	 							}else if("AREA"==obj.o_type){
	 								releaseAreaStr+=obj.area_name;
	 							}
	 							if(i!=releaseArea.length-1){
	 								releaseAreaStr+=",";
	 							}
	 						});
	 					}
	 					$("#release").val(releaseAreaStr);
	 					//正文
	 					$("#PMtheme").val(temp.PM.theme);
	 					//html 编辑器
	 					CKEDITOR.config.readOnly = true;
	 					temp.editor = CKEDITOR.replace('editor1'); 
	 					temp.editor.setData(temp.PM.content) ; 
	 					$("#addEndDate").attr("disabled",true);
	 					$("#addSendDate").attr("disabled",true);
	 					$("#savePM").hide();
	 					$("#tijiaoPM").hide();
	 					$("#release").attr("disabled",true);
	 					$("#PMA").attr("disabled",true);
	 					$("#PMZ").attr("disabled",true);
	 					$("#PMtheme").attr("disabled",true);
	 					$("#PMpicture").hide();
	 					var attrArr=$("#showAttr").find("input");
	 					$.each(attrArr,function(){
	 						$(this).attr("disabled",true);
	 					});
	 					
					}else{
						layer.alert(json.msg);
					};
				}, param, true,false);
			}
		},
		initMenu : function(o_type){//初始化政策
  			var param={
					"dicType" 	: 		"policyType"	
			};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
 				if(json.code == "0" ){
					if(json.dicSet.length > 0){
						var html = [];
  						$.each(json.dicSet,function(i,obj){
  							if(o_type == obj.dic_code){
  								html.push('<option selected value = '+obj.dic_code+' >'+obj.dic_value+'</option>');
  							}else{
  								html.push('<option value = '+obj.dic_code+' >'+obj.dic_value+'</option>');
  							}
						});
 						$("#PMA").html(html.join(''));
 		 				if(temp.PM == null ){
 		 					temp.initChildMenu( o_type.toLocaleLowerCase()+"Type", null) ;
 	 		 				temp.initPolicyAttr( o_type.toLocaleLowerCase()+"Param",null);
 		 				}else{
 		 					temp.initChildMenu( o_type.toLocaleLowerCase()+"Type",temp.PM.o_type_d) ;
 	 		 				temp.initPolicyAttr( o_type.toLocaleLowerCase()+"Param",temp.PM.infoAttr);
 		 				}
  					}
				}else{
					layer.alert(json.msg);
				};
			}, param, false,false);
		},
		initChildMenu : function(xszcType,childPM){
			$("#PMZ").html("");
			var param={
					"dicType" 	: 		xszcType		
			};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					var html = [];
					if(json.dicSet.length > 0){
						$("#PMZ").parent().show();
 						$.each(json.dicSet,function(i,obj){
 							if(childPM == obj.dic_code){
 								html.push('<option selected value = '+obj.dic_code+'>'+obj.dic_value+'</option>');
 							}else{
 								html.push('<option value = '+obj.dic_code+'>'+obj.dic_value+'</option>');
 							}
						});
 						$("#PMZ").html(html.join(''));
					}else{
						$("#PMZ").parent().hide();
					}
				}else{
					layer.alert(msg);
				};
			}, param, true,false);
		},
		bingMethod : function(){
			
			$("#release").unbind("click").bind("click",function(){
				if('update' == temp.dealType){
					useSet=null;
					temp.dealType=null;
				}
				var url='/web/html/policyManual/releaseArea.html?pmId='+temp.pmId;
				$.layer({
		               type: 2,
		               shadeClose: false,
		               title: '组织结构选取',
		               closeBtn: [0, true],
		               shade: [0.8, '#000'],
		               border: [0],
		               offset: ['20px', ''],
		               area: ['1000px', '600px'],
		               iframe:{ src: url.encodeUrl()}
		           });
			});
			//政策change
			$("#PMA").unbind("change").bind("change",function(){
				
				var pmaType=$("#PMA").val();
				temp.initChildMenu(pmaType.toLocaleLowerCase() +"Type") ;
  				temp.initPolicyAttr(pmaType.toLocaleLowerCase() +"Param");
			});
			
			$("#PMpicture").unbind("change").bind("change",function(){
				var file = $(this).prop('files')[0];
			    if(!/image\/\w+/.test(file.type)){ 
			    	layer.alert("请确保文件为图像类型",8);
			       return false;
			    }
			    var reader = new FileReader();
		        reader.readAsDataURL(file);
		        reader.onload = function(evt){
		        	var fileString = evt.target.result;
		        	$("#updateImg").html('<img id="imgfile" src='+fileString+' style="max-width:80px;max-height:80px;border:0px;"/>');
		        };
			});
			
			
			//"save"
			$("#savePM").click(function(){
				temp.saveData("S");
			});
			
			//"save"
			$("#tijiaoPM").click(function(){
				temp.saveData("O");
			});
		},
		
		saveData:function(optType){
			var addSendDate = $("#addSendDate").val();
			 if(addSendDate == ''){
				 layer.alert("政策开始时间不能为空",8);
				 return ;
			 }
			 var addEndDate = $("#addEndDate").val();
			 if(addEndDate == ''){
				 layer.alert("政策结束时间不能为空",8);
				 return ;
			 }
			 var PMtheme = $("#PMtheme").val();
			 if(PMtheme == ''){
				 layer.alert("政策主题不能为空",8);
				 return ;
			 }
			 var PMpicture = $("input[id=PMpicture]").prop('files')[0];
			 if(temp.PM == null){
				if(PMpicture == null) {
					layer.alert("政策图标不能为空",8);
					 return ;
				 }
	             if(!/image\/\w+/.test(PMpicture.type)){ 
	            	layer.alert("请确保文件为图像类型",8);
	               	return  ;
	     	     }
			 }
			 var param_attrs = [];
			 var attrs = $(".pmattr") ;
			 var flag = false ;
 			 $.each(attrs,function(key,obj){
				 if(obj.value == ''){
					 flag =true ;
					 return false ;
				 }
				 var tempp = {"attr_id":obj.getAttribute("code"),"attr_value":obj.value};
				 param_attrs.push(tempp);
			 });
			 if(flag){
				layer.alert("政策属性不能为空",8);
				 return ;
			 }
			 var content =  temp.editor.getData() ; 
			 
			 if(content == ''){
				 layer.alert("政策内容不能为空",8);
				 return ;
			 }
			 
			 var releaseObj=$("#release");
			 if(""==releaseObj.val()|| common.utils.isNull(useSet)){
				 layer.alert("请选择发布区域",8);
				 return ;
			 }
			 
			 var PMAVal=$("#PMA option:selected").val();
			 var PMZVal=$("#PMZ option:selected").val();
			 var PMAName=$("#PMA option:selected").text();
			 var PMZName=$("#PMZ option:selected").text();
			 
			 var param ={
					 "state"		:	optType,
					 "PMA" 			: 	PMAVal,
					 "PMAName" 		: 	PMAName,
					 "PMZ" 			: 	PMZVal,
					 "PMZName" 		: 	PMZName,
					 "addSendDate" 	: 	addSendDate,
					 "addEndDate"  	:	addEndDate,
					 "PMtheme"  	: 	PMtheme,
					 "pmAttr" 		: 	JSON.stringify(param_attrs),
					 "content" 		: 	content,
					 "releaseSet"	:	JSON.stringify(useSet)
					 
			 } ;
			 if(temp.PM != null){
				 param.type = 'update' ;
				 param.id = temp.PM.id ;
			 }else{
				 param.type = 'add' ;
			 }
			 if(PMpicture == null){
				 param.imgfile = $("#imgfile").attr("src");
				 $.jump.ajax(URL_ADD_POLICYMANUAL.encodeUrl(), function(json) {
     				if(json.code == "0" ){ 
     					var contentObj = $("#content");
     					$.jump.loadHtmlForFun("/web/html/policyManual/policyManualList.html".encodeUrl(),function(menuHtml){
							contentObj.html(menuHtml);
							var policyManualList = new PolicyManualList();
							policyManualList.init(JSON.stringify(temp.statusparam));
						});
    				}else{
    					layer.alert(json.msg,8);
    				};
    			}, param, true,true);
			 }else{
	          	 var reader = new FileReader();
	             reader.readAsDataURL(PMpicture);
	             reader.onload = function(evt){
	             param.PMpicture = evt.target.result;
	             $.jump.ajax(URL_ADD_POLICYMANUAL.encodeUrl(), function(json) {
	         				if(json.code == "0" ){ 
	         					var contentObj = $("#content");
	        					if(temp.PM == null){
	        						var confirm=layer.confirm("新增政策成功,是否进行添加", function(){
	        							layer.close(confirm);
	        							$.jump.loadHtmlForFun("/web/html/policyManual/addPolicyManual.html".encodeUrl(),function(menuHtml){
	        								contentObj.html(menuHtml);
	        								var addPM = new AddPolicyManual();
	        								addPM.init(temp,'add',null,temp.statusparam);
	        							});
	        						},function(){
	        							layer.close(confirm);
	        							$.jump.loadHtmlForFun("/web/html/policyManual/policyManualList.html".encodeUrl(),function(menuHtml){
	        								contentObj.html(menuHtml);
	        								var policyManualList = new PolicyManualList();
	        								policyManualList.init(JSON.stringify(temp.statusparam));
	        							});
	        						});
	        					}else{
	        						$.jump.loadHtmlForFun("/web/html/policyManual/policyManualList.html".encodeUrl(),function(menuHtml){
       								contentObj.html(menuHtml);
       								var policyManualList = new PolicyManualList();
       								policyManualList.init(JSON.stringify(temp.statusparam));
       							});
	        					}
	        				}else{
	        					layer.alert(json.msg,8);
	        				};
	        			}, param, true,true);
	             };
			 }
		},
		
		//初始化 政策属性
		initPolicyAttr : function(type,attrvalues){
			var param={
					"dicType" 	: 		type		
			};
			$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
				
				if(json.code == "0" ){
					$("#showAttr").html("");
					var html = [];
					if(json.dicSet.length > 0){
 						$.each(json.dicSet,function(i,obj){
 							if( i%2 ==0){
								html.push("<tr style='padding: 5px 15px;'>");
							}
							html.push("<td>&nbsp;&nbsp;&nbsp;"+obj.dic_value +"</td>");
							if(attrvalues != null){
								$.each(attrvalues,function(key1,obj1){
									if(obj1.attr_id == obj.dic_code){
										html.push("<td>&nbsp;&nbsp;"+"<input value="+obj1.attr_value+"  type='text'  class='pmattr' style='width: 200px;' code="+obj.dic_code+">"+"</td>");
										return false ;
									}
								});
							}else{
 								html.push("<td>&nbsp;&nbsp;"+"<input type='text' class='pmattr' style='width: 200px;' code="+obj.dic_code+" >"+"</td>");
							}
							if(i%2 ==1){
								html.push("</tr>");
							}
 						});
 						if(json.dicSet.length%2 == 1){
 							html.push("<td></td>");
							html.push("<td></td>");
							html.push("</tr>");
 						}
					}
					$("#showAttr").html(html.join(''));

				}else{
					layer.alert(json.msg,8);
				};
			}, param, false,false);
		},
		//时间绑定
		dateBind : function(obj,type,AddCount){
			var d = new Date();
			if("Y"==type){
				d.setYear(d.getFullYear()+AddCount);	
			}else if ("M"==type){
				d.setMonth(d.getMonth()+AddCount);
			}else{
				d.setDate(d.getDate()+AddCount);
			}
			obj.val(d.getFullYear() + "-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate()));
			obj.datetimepicker({
				lang:'ch',
				timepicker:false,
				format:'Y-m-d',
				formatDate:'Y-m-d',
			});
		}
};
 

 