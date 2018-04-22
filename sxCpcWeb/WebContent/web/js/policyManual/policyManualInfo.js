var PolicyInfo = new Function();

PolicyInfo.prototype = {
	selecter : "#contentInfo",
	temp:  null ,
	editor : null,
	PM : null ,// 政策 包括 政策 子政策  政策属性 
	init : function(){
		temp  = this ;
		
		this.saveOptInfo(this);
	},
	saveOptInfo : function(parentThis) {
		var coent=common.utils.getHtmlUrlParam("policyId");  
		var selectParam={
				"id"	:	coent,
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
				layer.alert("查询详情异常！");	
			}
		}, selectParam, true,true);
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
						$.each(json.dicSet,function(i,obj){
							if(childPM == obj.dic_code){
								html.push('<option selected value = '+obj.dic_code+'>'+obj.dic_value+'</option>');
							}else{
								html.push('<option value = '+obj.dic_code+'>'+obj.dic_value+'</option>');
							}
					});
				}else{
					$("#childLi").hide();
				}
				$("#PMZ").html(html.join(''));
			}else{
				layer.alert(msg);
			};
		}, param, false,false);
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
	}
};

$(document).ready(function(){
	var policy = new PolicyInfo();
	policy.init();
});
