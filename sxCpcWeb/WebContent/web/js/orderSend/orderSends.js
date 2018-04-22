var OrderSends = new Function() ;
OrderSends.prototype = {
		
		selecter : "#orderSendPagez",
		temp : null  ,
		base : null,
		fileList : [],
		//初始化执行
		init : function(param) {
			base=this;
			this.regionCode=param.regionCode;
			this.demand_id=param.demand_id;
			this.demand_theme=param.demand_theme;
			this.demand_details=param.demand_details;
			this.department=param.department;
			this.promoters=param.promoters;
			this.department_id=param.department_id;
			this.promoters_id=param.promoters_id;
			this.operator_id=param.operator_id;
			this.operator_name=param.operator_name;
			this.tel=param.tel;
			this.rank_id=param.rank_id;
			this.bindMetod(this);
		},
		//绑定事件
		bindMetod : function(parentThis){
			
			if("290"==parentThis.regionCode  || true){
				$('#getUser').show();
				//查询发单等级
				var param = {
	 					"dicType" 	: 		"demandRank"
	 				};
				$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
					if(json.code == "0" ){
						if(json.dicSet.length > 0){
							var html = [];
							$('#demandRank').html("");
							html.push('<option dicId ="">请选择</option>');
							$.each(json.dicSet,function(i,obj){
								html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
							});
							$('#demandRank').html(html.join(''));
						}
					};
				}, param, false,false);
				//选择接单人
				parentThis.loadRegionDiv(parentThis);
			}
			var myDate = new Date();
			var year = myDate.getFullYear();
			var menth = myDate.getMonth(); 
			var day = myDate.getDate();    
			var createTimeObj = parentThis.selecter.findById("td","createTime")[0]; //填充日期
			createTimeObj.text(year+"年"+(menth+1)+"月"+day+"日");
			var demandIdObj = parentThis.selecter.findById("td","demandId")[0];
			demandIdObj.text(this.demand_id);
			parentThis.bindSend("success",parentThis);
			var demand_themeObj = parentThis.selecter.findById("input","demand_theme")[0];
			demand_themeObj.val(this.demand_theme);		
			var demand_detailsObj = parentThis.selecter.findById("textarea","medDetail")[0];
			demand_detailsObj.val(this.demand_details);		
			var orgNameObj = parentThis.selecter.findById("td","sendOrgName")[0];
			orgNameObj.text(this.department);
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];
		    sendUserNameObj.val(this.promoters);
	 		sendUserNameObj.attr("staffId",	this.promoters_id);
	 		sendUserNameObj.attr("orgId",this.department_id);
	 		sendUserNameObj.attr("orgName",this.department);
	 		$('#getUserName').val(this.operator_name);
	 		$('#getUserName').attr("orgid",this.operator_id);
	 		$("#tel").val(this.tel);
	 		if(this.rank_id!=""&&this.rank_id!=null&&this.rank_id!=undefined){
	 			$('#demandRank').find('option[dicId='+this.rank_id+']').attr("selected",true);
	 		}
			parentThis = temp.parentObj;
			
			var medDetailObj = $("#orderSendPagez").find("textarea[id=medDetail]");
			medDetailObj.bind("cut copy paste", function(e) {  
                 if($(this).val().length >= 500){
 					layer.alert('输入内容限定500字内!',8);
 					$(this).val($(this).val().substring(0,500));
 					return false;
 				}
             }); 
			//附件上传与下载
			$("#attachSubs").unbind("click").bind("click",function(){
				
				var html=[];
				var fileName=$("#attachment").val();
				if ( fileName==""||fileName==null||fileName==undefined) { 
					layer.alert("请选择一个文件，再点击上传。",8); 
					return; 
					} 
				var index= fileName.lastIndexOf("\\");
				var file_name = fileName.substring(index+1);
				var demand_id =$("#orderSendPagez").find("td[id=demandId]").text();
				
				//上传文件
				var param={
						"demand_id" :demand_id
				};
				
				var option = { 
	            		url:URL_UPLOAD_FILE.encodeUrl()+"?"+$.param(param), 
	            		type:"post",
	        			success: function (json) { 
	            				var file = $("#attachment");
	            				 var datajson=eval("("+json+")");
	            				 var other_file_name=datajson.other_attachment_name;
	             				file_path=datajson.attachment_path;
	           					file.after(file.clone()); //复制元素
	           					file.remove();//移除已存在
	           					var i=0;
            					var obj={
            							"attachment_name" :  file_name,
            							"attachment_path" : file_path,
            							"attachment_value" : demand_id,
            							"other_attachment_name":other_file_name,
            							"attachment_type"  : "demand"
            					};
            					//alert(JSON.stringify(obj));
            					i=base.fileList.length;
            					base.fileList.push(obj);
            					var attachment_name = obj.attachment_name.split('.')[0];
     							var type = obj.attachment_name.split('.')[1];
     							if(attachment_name.length >10) {
     								attachment_name = attachment_name.substr(0,10)+ "..." + type;
     							}else {
     								attachment_name = obj.attachment_name;
     							}
     							
     							html.push('<div  id="divObj'+i+'" class="lable-title fl" style="width:220px;"><a href="javascript:void(0)" name="attachment" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="'+obj.attachment_name+'">'+attachment_name+'</a><a  id="'+i+'" href="javascript:void(0)" name="attachmenta" attachment_name="'+obj.attachment_name+'" attachment_path="'+obj.attachment_path+'"style="color: red;width:200px;">×</a></div>');
     							
             					$("#attachmentInfoY").append(html.join());
	             				
	            				//下载
	            				$("#attachmentInfoY").find("a[name=attachment]").unbind("click").bind("click",function(){
	            					var otherName=$(this).attr("other_file_name");
	    							var downLoadName="";
	    							if(otherName==""||otherName==undefined||otherName==null){
	    								downLoadName=$(this).attr("attachment_name");
	    							}else{
	    								downLoadName=otherName;
	    							}
		        					var param={
		        							"fileName":	$(this).attr("attachment_name"),
		        							"downloadName":downLoadName,
		        							"filePath":	$(this).attr("attachment_path")
		        					};
		        					window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
		        				});
	            				//删除
	            				$("#attachmentInfoY").find("a[name=attachmenta]").unbind("click").bind("click",function(){
	            					//获取删除按钮的ID
	            					
	            					var id=$(this).attr("id");
	            					var fileName=$(this).attr("attachment_name");
	            					
	            					//找到当前删除按钮所在的DIV层
	            					var divobj=$("#attachmentInfoY").find('div[id=divObj'+id+']');
	            					divobj.remove();
	            					for(var j=0;j<base.fileList.length;j++){
	            						if(base.fileList[j].attachment_name==fileName){
	            							base.fileList.remove(j);
	            						}
	            					}
	            				});
	        			}
	            	};
				$('#attachForm').ajaxSubmit(option); 
			});	
		},
		//加载组织机构
	    loadRegionDiv : function(parentThis){
	    	$('#getUserName').unbind('click').bind('click',function(){
				var parentObj=this;
				$.jump.loadHtml("sysRegionDiv","html/orderDetail/SysRegion.html",function(){
					common.loadding("close");
					$("#sysRegionDiv").show();
					$("#topHeader").hide();
					$("#content").hide();
					parentObj.sysRegion = new SysRegion();
					parentObj.sysRegion.init(1,parentObj,function(){
						var orgId= '';
						var orgName='';
						var pid = '';
						$("#sysRegionDiv").hide();
			 			$("#topHeader").show();
			 			$("#content").show();
				 		$.each(this.getChooseStaffs(),function(key,obj){
			 				orgId = orgId + obj.org_id +',';
			 				orgName = orgName + obj.org_name +',';
			 				pid+=obj.pid+',';
						});
				 		$('#getUserName').val(orgName.substring(0, orgName.length-1));
				 		$('#getUserName').attr("orgid",orgId.substring(0, orgId.length-1));
				 		$('#getUserName').attr("pid",pid.substring(0, pid.length-1));
				 		parentThis = temp.parentObj;

					},'getUser');
				},null);
			});
	    	
	    },
		//绑定发起
		bindSend : function(flag,parentThis){
		
			var sendObj = parentThis.selecter.findById("a","send")[0]; 
			
			if(flag == "success"){
				sendObj.unbind("click").bind("click",function(){
					var flag = parentThis.checkData(parentThis);
					
					if(flag){
						
						
						var param ={
								"handleType"		: 		"draftsend"		,
								"demand_theme"		:		 $("#orderSendPagez").find("input[id=demand_theme]").val(), 
						 		"demandId"			:	     $("#orderSendPagez").find("td[id=demandId]").text(),
								"promotersId"		:	     $("#orderSendPagez").find("input[id=sendUserName]").attr("staffId"),
								"promotersName"		:		 $("#orderSendPagez").find("input[id=sendUserName]").val(),
								"departmentId"		:		 $("#orderSendPagez").find("input[id=sendUserName]").attr("orgId"),
								"departmentName"	:		 $("#orderSendPagez").find("input[id=sendUserName]").attr("orgName"),
								"tel"				:		 $("#orderSendPagez").find("input[id=tel]").val(),
								"medDetail"			:		 $("#orderSendPagez").find("textarea[id=medDetail]").val(),
								"order_type"		:		 "tb_cpc_demand",
								"fileList"          :        JSON.stringify(base.fileList)
							};
						    if("290"==parentThis.regionCode  || true){//属于西安市的代发需求
								var optId=$('#getUserName').attr("orgid");
								param['optId']=optId;
								var optname=$('#getUserName').val();
								param['optName']=optname;
								param['rankId']=$('#demandRank').find('option:selected').attr('dicId');//等级id
								param['rankName']=$('#demandRank').find('option:selected').val();//等级名
						    }
							$.jump.ajax(URL_SAVE_DEMAND_INFO.encodeUrl(), function(data) {
								if(data.code == "0"){
									layer.alert("需求单提交成功",9);
										$.jump.loadHtmlForFun("/web/html/orderSend/orderSendzsave.html".encodeUrl(),function(menuHtml){
											$("#content").html(menuHtml);
											var orderSendzsave = new OrderSendzsave();
											var statusCd='{"regionCode":'+parentThis.regionCode+'}';
											orderSendzsave.init(statusCd);
										});
								}else{
									var demandIdObj = parentThis.selecter.findById("td","demandId")[0];
									layer.alert(data.msg,8);
									demandIdObj.text("");
									var param = {
											"handleType"	:	"getDemandId"
									};
									$.jump.ajax(URL_SAVE_DEMAND_INFO.encodeUrl(), function(data) {
										if(data.code == "0"){
											debugger ;
											demandIdObj.text(data.demandId);
						 				}else{
											layer.alert("获取需求单号失败",8);
										}
									}, param, true,false);
								}
							}, param, true);
					}
				});
			}else{
				sendObj.attr("class","butInit");
				sendObj.unbind("click").bind("click",function(){
					layer.alert("获取需求单号异常，无法提交订单",8);
				});
			}
	var backObj = parentThis.selecter.findById("a","back")[0]; 
	backObj.unbind("click").bind("click",function(){
		$.jump.loadHtmlForFun("/web/html/orderSend/orderSendzsave.html".encodeUrl(),function(menuHtml){
			$("#content").html(menuHtml);
			var orderSendzsave = new OrderSendzsave();
			var statusCd='{"regionCode":'+parentThis.regionCode+'}';
			orderSendzsave.init(statusCd);
		});
	
	});
			
		},
		
		//提交数据校验
		checkData : function(parentThis){
			var demandTheme = $("#orderSendPagez").find("input[id=demand_theme]").val();
			if(demandTheme == ""){
				layer.alert("需求单主题不能为空",8);
				return false;
			}
			var reg = new RegExp("^[0-9]*$");  
			var tel = $("#orderSendPagez").find("input[id=tel]").val();
			if(tel == ""){
				layer.alert("联系号码不能为空",8);
				return false;
			}
		    if(!reg.test(tel)){  
		        layer.alert("联系号码只能为数字",8);
		        return false;
		    }  
		    
		    var sendUser = $("#orderSendPagez").find("input[id=sendUser]").val();
		    if(sendUser == ""){
		    	layer.alert("发单人不能为空",8);
		    	return false;
		    }
		    
		    var sendOrgName = $("#orderSendPagez").find("input[id=sendOrgName]").val();
		    if(sendOrgName == ""){
		    	layer.alert("发单部门不能为空",8);
		    	return false;
		    }
		    if("290"==parentThis.regionCode  || true){//西安市的必须有接单部门
		    	var getUser=$('#getUserName').val();
			    if(getUser==""){
			    	layer.alert("接单人不能为空",8);
			    	return false;
			    }
		    }
		    var medDetail = $("#orderSendPagez").find("textarea[id=medDetail]").val();
		    if(medDetail == ""){
		    	layer.alert("需求单详情不能为空",8);
		    	return false;
		    };
		    var sendUserName = $("#orderSendPagez").find("#sendUserName").val();
		    if(sendUserName == ""){
		    	layer.alert("发单人不能为空",8);
		    	return false;
		    };
		    return true;
		}
};


