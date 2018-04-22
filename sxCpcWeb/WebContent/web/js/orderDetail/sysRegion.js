/**
 * 组织结构
 * */
var SysRegion = new Function();


SysRegion.prototype  = {
	AllRegion : null ,
	temp : null ,
	currSelector : null,
	chooseStaffs : [],
	callBackFun : null ,
	parentObj : null ,
	chooseNum :null,//单选还是多选
	pds:null,
 	init : function( chooseNum,parentObj,callBackFun,pds) {
 		
 		
   		temp = this ;
   		//alert(JSON.stringify(parentObj));
   		temp.chooseNum = chooseNum ;
  		temp.callBackFun = callBackFun; 	
  		temp.parentObj = parentObj; 
  		temp.pds = pds; 
  		
     	currSelector  = $("#sysRegion");
 		temp.getAllRegion();
		temp.searchStaff(); 
		//temp.rebackStaff();
		temp.goBack();
		
		if(temp.parentObj.isShowUserLst == "true"){ //显示选中员工
			
			currSelector.find("#checkUserLst").show();
			if(temp.parentObj.chooseStaffs != undefined && temp.parentObj.chooseStaffs.length > 0){
				$.each(temp.parentObj.chooseStaffs,function(i,obj){
					var html = [];
					html.push('<a name="staffInfo" style="margin:20px 20px;color:#93CFFC;" staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'>'+obj.staff_name+'</a>');
					currSelector.find("#checkUserLst").append(html.join(''));
				});
				currSelector.find("#submitButton").show();
				temp.bindConf();//绑定确认和删除人员事件
				temp.chooseStaffs = temp.parentObj.chooseStaffs;
			}
		}
		
 	},
	//获取全部数据
	getAllRegion : function(){	
		var param = { "method" : "getSysOrg" ,"pid" : ""};	
		if(temp.parentObj.staff_style!=undefined&&temp.parentObj.staff_style== 2){ //只查询区综支
			param["isProvince"] = "true";
			//param["org_flag"] = "3";
		}
		if('AAA'==temp.pds||temp.parentObj.ceoType == "ceoType") {
			param["ceoType"] = "true";
		}
		if(temp.parentObj.proDept=="proDept"){//内部转派显示专业部门
			param["proDept"] ="true";
		}
		if(temp.pds=="zzDept"){//获取中心的下派部门
			param.pid=temp.parentObj.deptId;
			param["fourCenter"]="true";
		}
		if(temp.parentObj.qryType != undefined) {
			param["qryType"] = temp.parentObj.qryType;
		}
		
		$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {
			temp.AllRegion = data.data ;
			
			var html = [];
				$.each(temp.AllRegion,function(key,obj){
					
					if("centerDept"==temp.pds||"zzDept"==temp.pds){//西安市内部转派
						html.push('<tr name="dept" org_id='+obj.org_id+' style="font-weight:bold" ><td align="left"><span id="one'+obj.org_id+'" class="close_span" attr1=false></span>'+obj.org_name+'</td>');
					}else{
						if((temp.parentObj.staff_style != null && (temp.parentObj.staff_style== 1 || temp.parentObj.staff_style== 2))||temp.parentObj.busi_id!=null||temp.parentObj.demandId!=null) {
							if(temp.parentObj.busi_id.substring(0,1)=='S'){//服务单只显示内部的专业部门
								html.push('<tr name="dept" islower=islower org_id='+obj.org_id+' style="font-weight:bold" ><td align="left"><span id="one'+obj.org_id+'" class="close_span" attr1=false></span>'+obj.org_name+'</td>');
							}else{
							$.each(obj.childNode,function(key1,obj1){
								if(obj1.org_flag==3){
									html.push('<tr name="dept" islower=islower org_id='+obj1.org_id+' style="font-weight:bold" ><td align="left"><span id="four'+obj1.org_id+'" class="close_span" attr1=false></span>'+obj1.org_name+'</td>');
								}
							});
							}
						}else {
							html.push('<tr name="dept" org_id='+obj.org_id+' style="font-weight:bold" ><td align="left"><span id="one'+obj.org_id+'" class="close_span" attr1=false></span>'+obj.org_name+'</td>');
					    }
					}
				});
			
			currSelector.find("#sysRegionInfo").append(html.join(""));
			temp.getSubInfo();
			if(temp.parentObj.staff_style != null && temp.parentObj.staff_style== 1) {
				temp.getStaffByOrgId();
			}					
		}, param, true);
							
	},
	
	//钻取
	getSubInfo : function(){
		currSelector.find("#sysRegionInfo").find("tr[name=dept]").unbind("click").bind("click",function(obj){
			
				var org_id = obj.currentTarget.getAttribute("org_id");				
				var open = obj.currentTarget.getAttribute("open");
				var m_left = obj.currentTarget.getAttribute("m_left");
				if("open" == open){
					currSelector.find("#sysRegionInfo").find("tr[islower=islower]").remove();//删除子节点
					//currSelector.find("#sysRegionInfo").find("tr[pid="+org_id+"]").remove();//删除子节点
					currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").removeAttr("open");
					currSelector.find("#sysRegionInfo").find("tr[name=staff]").remove();
					currSelector.find("#one"+obj.currentTarget.getAttribute("org_id")).removeClass("open_span");
					currSelector.find("#one"+obj.currentTarget.getAttribute("org_id")).addClass("close_span");
					
				}else{
					currSelector.find("#one"+obj.currentTarget.getAttribute("org_id")).removeClass("close_span");
					currSelector.find("#one"+obj.currentTarget.getAttribute("org_id")).addClass("open_span");	
					
					var html = [];
					if(m_left ==null || m_left == undefined){
						m_left = 20 ;
					}
					
	 				$.each(temp.AllRegion,function(key,obj){
						if(obj.org_id == org_id  ){
							if(obj.childNode.length == 0){
								currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").attr("isLower","isLower");
							}else{
								$.each(obj.childNode,function(key1,obj1){
									
									var isLower = 'islower=islower  m_left='+m_left;
									
									if(obj1.childNode.length > 0&&"zzDept"!=temp.pds&&"getUser"!=temp.pds&&"centerDept"!=temp.pds&&'AAA'!=temp.pds){
										html.push('<tr name="dept" '+isLower+' showType="all" org_id='+obj1.org_id+' pid='+org_id+' style="font-weight:bold" ><td align="left"><span style="margin-left:'+(20+parseInt(m_left))+'px;">'+obj1.org_name+'</span></td></tr>');
										$.each(obj1.childNode,function(key2,obj2){
											html.push('<tr name="deptNode" '+isLower+' pid='+obj1.org_id+' org_id='+obj2.org_id+' style="font-weight:bold;display: none;" ><td align="left"><span style="margin-left:'+(20+parseInt(m_left))+'px;">'+obj2.org_name+'</span></tr>');
										});
										
									}else if(temp.pds=='AAA'&&obj1.org_flag!=3){
										//显示小CEO人员
										html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+' style="font-weight:bold"><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
									}else if(temp.pds=='ZZZ'){
										//显示小CEO人员和综支人员
											if(obj1.has_professional==0||obj1.org_flag==3){
										html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+' style="font-weight:bold"><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
											}

									}else if("getUser"==temp.pds){
										//发单时选择接单部门
										if(obj1.org_flag==3||obj1.org_flag==4||(obj1.region_code=='290'&&obj1.org_flag==5)){
												html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
										}
										
									}else if("centerDept"==temp.pds){
										
										if(temp.parentObj.deptType==3){//综支人员转派时
											if(obj1.org_flag==4||obj1.org_flag==5){
												html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
											}												
										}else if(temp.parentObj.deptType==4){//四中心转派
											if((obj1.org_flag==3||obj1.org_flag==4)&&temp.parentObj.deptId!=obj1.org_id){
												html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
											}												
										}else if(temp.parentObj.deptType==5){//七部门的转派
											if(obj1.org_flag==3){
												html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
											}												
										}
									}else if("zzDept"==temp.pds){//显示四中心的下派部门
										html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
									}else{
										//显示的是专业人员
										if(obj1.org_flag!=3){
											html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+' style="font-weight:bold"><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');	
										}
									}
		 						});
							}
						}  
					});
	 				
	 				var param ={"method" : "getStaffByOrgId" , "org_id": org_id};
					if('AAA'==temp.pds||temp.parentObj.ceoType == "ceoType") {
						param["ceoType"] = "true";
					}
					if(temp.parentObj.qryType != undefined) {
						param["qryType"] = temp.parentObj.qryType;
					}
					if(temp.parentObj.proDept=="proDept"){//内部转派显示专业部门
						param["proDept"] ="true";
					}
					if(temp.parentObj.optDefault=="optDefault"){//专业部门只显示默认接单人
						param["optDefault"] ="true";
					}
					
					$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {
					     if(data.code == '0'&&"zzDept"!=temp.pds&&"getUser"!=temp.pds&&"centerDept"!=temp.pds){
							$.each(data.data,function(key,obj){//显示部门下的员工
								html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel="'+obj.mob_tel+'"  org_name='+obj.org_name+' staff_id='+obj.staff_id+' pid='+obj.org_id+' m_left='+obj.m_left+' staff_name='+obj.staff_name+'><td align="left"><span style="margin-left:'+(parseInt(m_left))+'px;">'+obj.staff_name+'</span></td>');
							});
							
					     }else if(data.code!="0"){
					    	 alert(data.msg);
					     }
					     currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").after(html.join(""));
		  				 currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").attr("open","open");
		  				 temp.rebackStaff();
		  				if("getUser"==temp.pds||"centerDept"==temp.pds||"zzDept"==temp.pds){
							temp.rebackDept();
						}else{
							temp.getStaffByOrgId();
						}
					}, param, true);
	 				
	 				
//	  				currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").after(html.join(""));
//	  				if(temp.parentObj.staff_style == null || temp.parentObj.staff_style!= 1){
//	  					currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").attr("open","open");
//	  				}
// 					temp.getStaffByOrgId();
	  				 
				}
			});

	},
	//根据最底层节点获取员工信息
	getStaffByOrgId : function(){
		currSelector.find("#sysRegionInfo").find("tr[islower=islower]").unbind("click").bind("click",function(obj){
			var org_id = obj.currentTarget.getAttribute("org_id"); 
			var org_name = obj.currentTarget.getAttribute("org_name"); 
			var open = obj.currentTarget.getAttribute("open");
			var m_left = obj.currentTarget.getAttribute("m_left");
			var param = {"method" : "getStaffByOrgId" , "org_id": org_id};
			if('AAA'==temp.pds||temp.parentObj.ceoType == "ceoType") {
				param["ceoType"] = "true";
			}
			if(temp.parentObj.qryType != undefined) {
				param["qryType"] = temp.parentObj.qryType;
			}
			if(temp.parentObj.proDept=="proDept"){//内部转派显示专业部门
				param["proDept"] ="true";
			}
			if(temp.parentObj.optDefault=="optDefault"){//专业部门只显示默认接单人
				param["optDefault"] ="true";
			}
			var islowerObj =$(this);
			if("open" == open){
				currSelector.find("#two"+obj.currentTarget.getAttribute("org_id")).removeClass("open_span");
				currSelector.find("#two"+obj.currentTarget.getAttribute("org_id")).addClass("close_span");
				currSelector.find("#four"+obj.currentTarget.getAttribute("org_id")).removeClass("open_span");
				currSelector.find("#four"+obj.currentTarget.getAttribute("org_id")).addClass("close_span");
				currSelector.find("#three"+obj.currentTarget.getAttribute("org_id")).removeClass("open_span");
				currSelector.find("#three"+obj.currentTarget.getAttribute("org_id")).addClass("close_span");
				currSelector.find("#x"+obj.currentTarget.getAttribute("org_id")).removeClass("open_span");
				currSelector.find("#x"+obj.currentTarget.getAttribute("org_id")).addClass("close_span");
				currSelector.find("#sysRegionInfo").find("tr[pid="+org_id+"]").hide();//删除子节点
				var staffObjs= currSelector.find("#sysRegionInfo").find("tr[name=staff]");
				if(staffObjs.length>0){
					$.each(staffObjs,function(key,staff){
						if($(staff).attr("pid") == org_id){
							$(staff).remove();
						};
					});
				}
			    //currSelector.find("#sysRegionInfo").find("tr[name=staff pid="+org_id+"]").remove();
				currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").removeAttr("open");
			}else {
				currSelector.find("#two"+obj.currentTarget.getAttribute("org_id")).removeClass("close_span");
				currSelector.find("#two"+obj.currentTarget.getAttribute("org_id")).addClass("open_span");	
				currSelector.find("#four"+obj.currentTarget.getAttribute("org_id")).removeClass("close_span");
				currSelector.find("#four"+obj.currentTarget.getAttribute("org_id")).addClass("open_span");	
				currSelector.find("#three"+obj.currentTarget.getAttribute("org_id")).removeClass("close_span");
				currSelector.find("#three"+obj.currentTarget.getAttribute("org_id")).addClass("open_span");	
				currSelector.find("#x"+obj.currentTarget.getAttribute("org_id")).removeClass("close_span");
				currSelector.find("#x"+obj.currentTarget.getAttribute("org_id")).addClass("open_span");	
				$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {
					     if(data.code == '0'){
								var html = [];
								if(m_left ==null || m_left == undefined){
									m_left = 20 ;
								}
								if(islowerObj.attr("showtype") == "all"){
									
									var nodePid = islowerObj.attr("org_id");
									currSelector.find("#sysRegionInfo").find("tr[pid="+nodePid+"]").show();
								}
								$.each(data.data,function(key,obj){
									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel="'+obj.mob_tel+'"  org_name='+obj.org_name+' staff_id='+obj.staff_id+' pid='+obj.org_id+' m_left='+obj.m_left+' staff_name='+obj.staff_name+'><td align="left"><span style="margin-left:'+(20+parseInt(m_left))+'px;">'+obj.staff_name+'</span></td>');
								});
				  				currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").after(html.join(""));
				  				currSelector.find("#sysRegionInfo").find("tr[org_id="+org_id+"]").attr("open","open");
				  				//temp.chooseStaff();
				  				temp.rebackStaff();
					     }else{
					    	 alert(data.msg);
					     }
				}, param, true);
			}
		});
	},
	//模糊查询
	searchStaff : function(){
		currSelector.find("#sysRegionInfo").find("#choose").unbind("click").bind("click",function(obj){
				
				var search_staff_name = currSelector.find("#search_staff_name").val();					
				var search_org_name = currSelector.find("#search_org_name").val();			
				var search_staff_phone = currSelector.find("#search_staff_phone").val();
				currSelector.find("#sysRegionInfo").find("tr[name=dept]").remove();
				currSelector.find("#sysRegionInfo").find("tr[name=staff]").remove();
				currSelector.find("#sysRegionInfo").find("tr[name=deptNode]").remove();
				var staff_flag = temp.parentObj.staff_flag;
				if((search_staff_name != null && search_staff_name !='') || (search_staff_phone != null && search_staff_phone !='')){
				    var param = {"method" : "getStaffByOrgId" , "staff_name": search_staff_name,"pid": 'search',"staff_phone":search_staff_phone,"staff_flag":staff_flag,"qryType":temp.parentObj.qryType};
					//alert(JSON.stringify(temp.parentObj.ceoType));
				    if('AAA'==temp.pds||temp.parentObj.ceoType == "ceoType") {
						param["ceoType"] = "true";
					}
				    if(temp.parentObj.proDept=="proDept"){
					   param['proDept']="true";
				    }
				    if(temp.parentObj.optDefault=="optDefault"){//专业部门只显示默认接单人
						param["optDefault"] ="true";
					}
					$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {
						if(data.code == '0'){
							
							var flag = 0;
							var html = [];
							
							if(temp.parentObj.busi_id!=null||temp.parentObj.demandId!=null){
								if(temp.parentObj.busi_id.substr(0,1)=='S'){
									$.each(data.data,function(i,obj){
	 									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel='+obj.mob_tel+' org_name='+obj.org_name+' staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'><td align="left">'+obj.staff_name+'</td>');
									});
								}else{
									$.each(data.data,function(key,obj){
		 								if(obj.org_flag==3){
		 									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel='+obj.mob_tel+' org_name='+obj.org_name+' staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'><td align="left">'+obj.staff_name+'</td>');
		 								}
		 							
									});
								}
								
								
							}else if(temp.pds=='AAA'){//展示小CEO人员
								$.each(data.data,function(key,obj){
	 								
	 								if(obj.org_flag!=3){
	 									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel='+obj.mob_tel+' org_name='+obj.org_name+' staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'><td align="left">'+obj.staff_name+'</td>');
	 								}
	 							
								});
							}else if(temp.pds=='ZZZ'){//展示小CEO人员和综支人员
								
								$.each(data.data,function(key,obj){
	 								
	 								if(obj.personnel_type!='professional'||obj.org_flag==3){
	 									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel='+obj.mob_tel+' org_name='+obj.org_name+' staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'><td align="left">'+obj.staff_name+'</td>');
	 								}
	 							
								});
							}else{
								$.each(data.data,function(key,obj){
	 								
	 								if(obj.org_flag!=3){
	 									html.push('<tr name="staff" login_code='+obj.login_code+' org_id='+obj.org_id+' mob_tel='+obj.mob_tel+' org_name='+obj.org_name+' staff_id='+obj.staff_id+' staff_name='+obj.staff_name+'><td align="left">'+obj.staff_name+'</td>');
	 								}
	 							
								});
								
								
							}
 						
 							if(html.length == 0){
 								html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
 								flag = 1;
 							}
							currSelector.find("#sysRegionInfo").append(html.join(""));
							//temp.chooseStaff();
							if(flag == 0 ){
								temp.rebackStaff();
							}
				     }else{
				    	 alert(data.msg);
				     }
					}, param, false,false);
				}else if(search_org_name != null && search_org_name !=''){
					
					var param = {"method" : "getSysOrg" , "search_org_name": search_org_name,"pid":'search'};
					
					if((temp.parentObj.busi_id!=undefined&&temp.parentObj.busi_id.substr(0,1)=='D')||temp.parentObj.demandId!=null){
						
						$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {
							//alert(data.code);
							
							 if(data.code == '0' && data.data.length > 0){
								var html = [];
								var result="no";
	  							$.each(data.data,function(key1,obj1){
	 								var isLower = 'islower=islower  m_left=0';
	 									$.each(temp.AllRegion,function(key3,obj3){
		 									
		 									if(obj3.org_id == obj1.org_id ){
		 										
		 										if(obj3.childNode.length > 0&&temp.parentObj.qryType!='professional'&&obj1.org_flag==3&& result=='no'&& obj1.org_id !=""){
		 											result='yes';
		 											html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' ><td align="left"><span id="three'+obj1.org_id+'" class="close_span" attr1=false></span><span>'+obj1.org_name+'</span></td>');
		 										
		 										}else if(obj3.childNode.length > 0&&temp.parentObj.qryType!='professional'&&obj1.org_flag==2&& result=='no'){
		 											result ='yes';
		 											
		 											 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
		 											 
		 										}else{
		 											if(obj1.org_flag==3){
		 												
		 												html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' org_name='+obj1.org_name+'><td align="left"><span ><span id="x'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span><span  >'+obj1.org_name+'</span</td>');
		 											}
		 	 									}
		 	 								}
		 								});
	 								
								});
								currSelector.find("#sysRegionInfo").append(html.join(""));
								//temp.getSubInfo();
								temp.getStaffByOrgId();
					     }else if(data.code != '0'){
					    	 alert(data.msg);
					     }else{
					    	 var html = [];
					    	 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
					    	 currSelector.find("#sysRegionInfo").append(html.join(""));
					     }
						}, param, true);
					}else if((temp.parentObj.busi_id!=undefined&&temp.parentObj.busi_id.charAt(0)=='S')&&temp.parentObj.proDept=="proDept"){//服务单内部转派的组织机构
						param['proDept']="true";
						param['pid']="";
						$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data){
							if(data.code == '0' && data.data.length > 0){
							var html = [];
							$.each(data.data,function(i,obj){
								if(obj.org_name.indexOf(search_org_name)!=-1){
								    html.push('<tr name="dept" islower=islower org_id='+obj.org_id+' style="font-weight:bold" ><td align="left"><span id="four'+obj.org_id+'" class="close_span" attr1=false></span>'+obj.org_name+'</td>');
								}
								currSelector.find("#sysRegionInfo").append(html.join(""));
								temp.getStaffByOrgId();
							});
							
							}else if(data.code != '0'){
						    	 alert(data.msg);
						    }else{
						    	 var html = [];
						    	 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
						    	 currSelector.find("#sysRegionInfo").append(html.join(""));
						     }
						},param,true);
						
					}else if (temp.pds=='AAA'){
						$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {					
							 if(data.code == '0' && data.data.length > 0){
								var html = [];
	  							$.each(data.data,function(key1,obj1){
	 								var isLower = 'islower=islower  m_left=0';
	 								$.each(temp.AllRegion,function(key3,obj3){
	 									
	 									if(obj3.org_id = obj1.org_id ){
	 										
	 										if(obj3.childNode.length > 0&&temp.parentObj.qryType!='professional'&&obj1.org_flag==2&&obj1.has_professional==0){
	 											
	 											html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' ><td align="left"><span id="three'+obj1.org_id+'" class="close_span" attr1=false></span><span>'+obj1.org_name+'</span></td>');
	 										}else if(obj1.org_flag!=3){
 												html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' org_name='+obj1.org_name+'><td align="left"><span ><span id="x'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span><span  >'+obj1.org_name+'</span</td>');
	 										}else{
	 											if(obj1.org_flag==2&&obj1.has_professional==0){
	 											
	 												html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' org_name='+obj1.org_name+'><td align="left"><span ><span id="x'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span><span  >'+obj1.org_name+'</span</td>');
	 											}
	 	 									}
	 	 								}
	 								});
	 								
								});
								currSelector.find("#sysRegionInfo").append(html.join(""));
								//temp.getSubInfo();
								temp.getStaffByOrgId();
					     }else if(data.code != '0'){
					    	 alert(data.msg);
					     }else{
					    	 var html = [];
					    	 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
					    	 currSelector.find("#sysRegionInfo").append(html.join(""));
					     }
						}, param, true);
					
						
					}else if(temp.pds=='ZZZ'){

						$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {					
							 if(data.code == '0' && data.data.length > 0){
								var html = [];
	  							$.each(data.data,function(key1,obj1){
	 								var isLower = 'islower=islower  m_left=0';
	 								$.each(temp.AllRegion,function(key3,obj3){
	 									
	 									if(obj3.org_id = obj1.org_id ){
	 										
	 										if(obj3.childNode.length > 0&&temp.parentObj.qryType!='professional'&&obj1.org_flag==2&&obj1.has_professional==0&&obj1.org_flag==3){
	 											
	 											html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' ><td align="left"><span id="three'+obj1.org_id+'" class="close_span" attr1=false></span><span>'+obj1.org_name+'</span></td>');
	 										}else if(temp.parentObj.qryType=='professional'&&obj1.has_professional==0){
	 										
	 										}else{
	 											if(obj1.org_flag==3||obj1.has_professional==0){
	 											
	 												html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' org_name='+obj1.org_name+'><td align="left"><span ><span id="x'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span><span  >'+obj1.org_name+'</span</td>');
	 											}
	 	 									}
	 	 								}
	 								});
	 								
								});
								currSelector.find("#sysRegionInfo").append(html.join(""));
								//temp.getSubInfo();
								temp.getStaffByOrgId();
					     }else if(data.code != '0'){
					    	 alert(data.msg);
					     }else{
					    	 var html = [];
					    	 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
					    	 currSelector.find("#sysRegionInfo").append(html.join(""));
					     }
						}, param, true);
					
						
					}else{
						//alert("param="+JSON.stringify(param));
						$.jump.ajax(URL_REGION_STAFF.encodeUrl(), function(data) {					
							 if(data.code == '0' && data.data.length > 0){
								var html = [];
	  							$.each(data.data,function(key1,obj1){
	 								var isLower = 'islower=islower  m_left=0';
	 								$.each(temp.AllRegion,function(key3,obj3){
	 									
	 									if(obj3.org_id = obj1.org_id ){
	 										
	 										if(obj3.childNode.length > 0&&temp.parentObj.qryType!='professional'&&obj1.org_flag==2&&obj1.has_professional!=1){
	 											html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' style="font-weight:bold"><td align="left"><span id="three'+obj1.org_id+'" class="close_span" attr1=false></span><span>'+obj1.org_name+'</span></td>');
	 										}else if(temp.parentObj.qryType=='professional'&&obj1.has_professional==0){
	 										
	 										}else if("getUser"==temp.pds){
	 											//发单时选择接单人
	 											if(obj1.org_flag==3||obj1.org_flag==4||obj1.org_flag==5){
	 												html.push('<tr name="defaultDept"  '+isLower +' org_id='+obj1.org_id+' pid='+org_id+' org_name='+obj1.org_name+'><td align="left"><span style="margin-left:20px;"><span id="two'+obj1.org_id+'" attr1=false>&nbsp;</span>'+obj1.org_name+'</span</td></tr>');
	 											}
	 										}else{
	 											if(obj1.org_flag==2){
	 												html.push('<tr name="dept" '+isLower +' org_id='+obj1.org_id+' pid='+obj3.pid+' org_name='+obj1.org_name+' style="font-weight:bold"><td align="left"><span ><span id="x'+obj1.org_id+'" class="close_span" attr1=false>&nbsp;</span><span  >'+obj1.org_name+'</span</td>');
	 											}
	 	 									}
	 	 								}
	 								});
	 								
								});
								currSelector.find("#sysRegionInfo").append(html.join(""));
								//temp.getSubInfo();
								temp.getStaffByOrgId();
					     }else if(data.code != '0'){
					    	 alert(data.msg);
					     }else{
					    	 var html = [];
					    	 html.push('<tr name="staff"><td align="left" style="color:red;">未查到相关信息</td>');
					    	 currSelector.find("#sysRegionInfo").append(html.join(""));
					     }
						}, param, true);
					}
					
				}else if(search_staff_name =='' && search_org_name == ''){
					temp.getAllRegion();
				}
		});
	},
	//选中员工
	chooseStaff : function (){
		currSelector.find("#sysRegionInfo").find("tr[name=staff]").unbind("click").bind("click",function(obj){
			var staff_id = obj.currentTarget.getAttribute("staff_id");
			var style = obj.currentTarget.getAttribute("style");
			if(1 == temp.chooseNum){
				//只选择一个员工
				if(style != null){
					currSelector.find("#sysRegionInfo").find("tr[staff_id="+staff_id+"]").removeAttr("style");
				}else{
					currSelector.find("#sysRegionInfo").find("tr[name=staff]").removeAttr("style");
					currSelector.find("#sysRegionInfo").find("tr[staff_id="+staff_id+"]").attr("style","background-color: aquamarine;");
				}
			}else{
				if(style != null){
					currSelector.find("#sysRegionInfo").find("tr[staff_id="+staff_id+"]").removeAttr("style");
				}else{
					currSelector.find("#sysRegionInfo").find("tr[staff_id="+staff_id+"]").attr("style","background-color: aquamarine;");
				}
			}
			
		});
	},
	//双击员工
	rebackStaff : function (){
		currSelector.find("#sysRegionInfo").find("tr[name=staff]").unbind("dblclick").bind("dblclick",function(){
			
 			var staffName = '';
 			temp.chooseStaffs = [];
				var staff_id = $(this).attr('staff_id');
				var staff_name = $(this).attr('staff_name');
				var org_name = $(this).attr('org_name');
				var org_id = $(this).attr('org_id'); 
				var mob_tel = $(this).attr('mob_tel');
				var login_code = $(this).attr('login_code');
				if(temp.parentObj.isShowUserLst == "true"){
					var html = [];
					html.push('<a name="staffInfo" style="margin:20px 20px;color:#93CFFC;" staff_id='+staff_id+' staff_name='+staff_name+' login_code='+login_code+' mob_tel='+mob_tel+'>'+staff_name+'</a>');
					currSelector.find("#checkUserLst").append(html.join(''));
					currSelector.find("#submitButton").show();
					temp.bindConf();//绑定确认和删除人员事件
				}else{
					var param  ={ "staff_id" : staff_id,
						      "staff_name" :staff_name ,
						      "org_id" : org_id,
						      "org_name" : org_name,
						       "mob_tel" : mob_tel,
						       "login_code" : login_code};
				temp.chooseStaffs = [];
				temp.chooseStaffs.push(param);
				temp.callBackFun();
				}
		});
	},
	//双击部门
	rebackDept : function(){
		$("#sysRegionInfo").find("tr[name=defaultDept]").unbind("dblclick").bind("dblclick",function(){
			
 			temp.chooseStaffs = [];
				var org_name = $(this).attr('org_name');
				var org_id = $(this).attr('org_id'); 
				var pid = $(this).attr('pid');
				if(temp.parentObj.isShowUserLst == "true"){
					var html = [];
					html.push('<a name="deptInfo" style="margin:20px 20px;color:#93CFFC;" org_id='+org_id+' org_name='+org_name+' pid='+pid+'>'+org_name+'</a>');
					currSelector.find("#checkUserLst").append(html.join(''));
					currSelector.find("#submitButton").show();
					temp.bindConf();//绑定确认和删除人员事件
				}else{
					var param  ={
						      "org_id" : org_id,
						      "org_name" : org_name,
						       "pid" : pid
						       };;
				temp.chooseStaffs = [];
				temp.chooseStaffs.push(param);
				temp.callBackFun();
				}
		});
	},
	//绑定删除选定人员
	bindConf : function(){
		currSelector.find("a[name=staffInfo]").unbind("dblclick").bind("dblclick",function(){
			
			$(this).remove();
			if(currSelector.find("a[name=staffInfo]").length == 0){
				
				if(temp.parentObj.chooseStaffs == undefined  || temp.parentObj.chooseStaffs.length == 0){
					currSelector.find("#submitButton").hide();
				}
			}
		});
		currSelector.find("#submit").unbind("click").bind("click",function(){
			temp.chooseStaffs = [];
			var staffInfoLst = currSelector.find("a[name=staffInfo]");
			$.each(staffInfoLst,function(i,obj){
				var param = {
					"staff_id" 		: 	$(obj).attr("staff_id")		,
					"staff_name" 	:	$(obj).attr("staff_name") 	,	
					"mob_tel"		:	$(obj).attr("mob_tel") 	,
					"login_code"	:	$(obj).attr("login_code")	,
				};
				temp.chooseStaffs.push(param);
			});
			temp.callBackFun();
		});
	},
	
	//返回组织机构查询
	backOrg : function(){
		
		currSelector.find("#backOrg").unbind("click").bind("click",function(){
			temp.getAllRegion();
		});
	},
	getChooseStaffs : function(){
		return temp.chooseStaffs;
	},
	//直接返回
	goBack : function (){
		currSelector.find("#return").unbind("click").bind("click",function(obj){
 			temp.callBackFun();
		});
	}
};
