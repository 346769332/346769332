var StaffList = new Function();
/**评价*/
StaffList.prototype = {
	selecter : "#staffListPage",
	pageSize : 10,
	pOrgInfoPage	: null,
	departmentCode : null,
	
	//初始化执行
	init : function() {
		this.bindMetod(this);
		departmentCode ="";
	},
	bindMetod : function(parentThis) {
		
		//初始化本地网
		var latnIdObj = parentThis.selecter.findById("select","latnId")[0];
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.latnSet.length > 0){
					var html = [];
					latnIdObj.html("");
					$.each(json.latnSet,function(i,obj){
						html.push('<option latnId = '+obj.REGION_ID+' latnCode = '+obj.REGION_CODE+'>'+obj.REGION_NAME+'</option>');
					});
					latnIdObj.html(html.join(''));
				}
			}else{
				layer.alert(msg);
			};
		}, null, false,false);
		
		//初始化状态
		var orgStateObj = parentThis.selecter.findById("select","staffState")[0];
		var param = {
			"dicType" : "staffState"
		};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					orgStateObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					orgStateObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//查询绑定
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			parentThis.queryPageList(parentThis,0);
		});
		
		//重置
		var resetObj =  parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			var loginCodeObj=parentThis.selecter.findById("input","loginCode")[0];//登陆Code
			loginCodeObj.val('');
			var staffNameObj = parentThis.selecter.findById("input","staffName")[0];//员工姓名
			staffNameObj.val('');
			var staffOrgObj = parentThis.selecter.findById("input","staffOrg")[0];//所属部门
			staffOrgObj.val('');
		});
		
		//新增组织机构
		var addStaffInfoObj= parentThis.selecter.findById("a","addStaffInfo")[0];
		addStaffInfoObj.unbind("click").bind("click",function(){
			var staffInfo = {
				"type" : "add",
				"latnId" : "",
				"staffId" : "",
				"staffName" : "",
				"state"	: "",
				"tel"	: "",
				"email"	: "",
				"loginCode"	: "",
				"pwd" : "",
				"departmentName" : "",
				"departmentCode" : ""
			};
			parentThis.addOrUpdateOrgInfo(parentThis,staffInfo);
		});
		
		var updateStaffStateObj= parentThis.selecter.findById("a","updateStaffStateBtn")[0];
		updateStaffStateObj.unbind("click").bind("click",function(){
			
			var staffInfo = {};
			var staffId="";
			var state = "0";
			var tbodyObj = parentThis.selecter.findById("tbody","staffListBody")[0];
				tbodyObj.find("input[type=checkbox][name=staffInfoBox]").each(function(i,obj){
					var boxObj = $(this);
					if(boxObj.is(':checked')){
						var trObj = boxObj.parent().parent("tr[name=staffInfo]");
						staffId = trObj.attr("staffId");
						state = trObj.attr("state");
	
						staffInfo = {
								"type" : "update",
								"latnId" : trObj.attr("latnId"),
								"staffId" : staffId,
								"staffName" : trObj.attr("staffName"),
								"state"	: trObj.attr("state"),
								"stateName"	: trObj.attr("stateName"),
								"tel"	: trObj.attr("tel"),
								"email"	: trObj.attr("email"),
								"loginCode"	: trObj.attr("loginCode"),
								"pwd" : trObj.attr("pwd"),
								"departmentName" : trObj.attr("departmentName"),
								"departmentCode":trObj.attr("departmentCode")
								
							
						};
					}
				});
			if(staffId.length==0){
				layer.alert("请选择工号",8);
				return false;
			}
			parentThis.addOrUpdateOrgInfo(parentThis,staffInfo);
		});
		
		parentThis.queryPageList(parentThis,0);
		
		//权限指派
		var orgAuthBtnObj= parentThis.selecter.findById("a","staffAuthBtn")[0];
		orgAuthBtnObj.unbind("click").bind("click",function(){
			
			var staffInfo = {};
			var staffId="";
			var state = "0";
			var tbodyObj = parentThis.selecter.findById("tbody","staffListBody")[0];
				tbodyObj.find("input[type=checkbox][name=staffInfoBox]").each(function(i,obj){
					var boxObj = $(this);
					if(boxObj.is(':checked')){
						var trObj = boxObj.parent().parent("tr[name=staffInfo]");
						staffId = trObj.attr("staffId");
						state = trObj.attr("state");
						staffInfo = {
								"latnId"			:	 	trObj.attr("latnId"),
								"staffId"			:		staffId,
								"staffName"			:		trObj.attr("staffName"),
								"state"			    :		trObj.attr("state"),
								"stateName"		:		trObj.attr("stateName")
						};
					}
				});
			if(staffId.length==0){
				layer.alert("请选择工号",8);
				return false;
			}
			
			if("0"==state){
				layer.alert("选中工号为失效状态不能指派权限",8);
				return false;
			}
			parentThis.dealStaffAuthInfo(parentThis,staffInfo);
		});
		
	},
	
	dealStaffAuthInfo : function(parentThis,staffInfo) {
		var url='/web/html/sysManage/orgAuthInfo.html?dealType=STAFF&id='+staffInfo.staffId+'&name='+staffInfo.staffName+'&stateName='+staffInfo.stateName;
		$.layer({
               type: 2,
               shadeClose: false,
               title: '权限指派',
               closeBtn: [0, true],
               shade: [0.8, '#000'],
               border: [0],
               offset: ['20px', ''],
               area: ['1000px', '600px'],
               iframe:{ src: url.encodeUrl()}
           });
	},
		
	
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.val(d.getFullYear() + "-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate()));
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
	
	//查询组织机构
	queryPageList : function(parentThis,pageIndex) {
		
		var latnIdObj = parentThis.selecter.findById("select","latnId")[0]; //本地网
		var latnId = latnIdObj.find('option:selected').attr('latnId');
		var loginCodeObj=parentThis.selecter.findById("input","loginCode")[0];//登陆编码
		var staffNameObj = parentThis.selecter.findById("input","staffName")[0];//工号姓名
		var staffOrgObj = parentThis.selecter.findById("input","staffOrg")[0];//所属部门
		
		var stateObj = parentThis.selecter.findById("select","staffState")[0];//状态
		var state = stateObj.find('option:selected').attr('dicId');
		
		
		var param = {
			"latnId" : latnId,
			"state" : state,
			"loginCode" : loginCodeObj.val(),
			"staffName" : staffNameObj.val(),
			"staffOrg" : staffOrgObj.val(),
			"methodType" : "query"
		};
		var listFootObj = parentThis.selecter.findById("div","staffListFoot")[0];
		
		common.pageControl.start(URL_QUERY_STAFF_LIST.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = parentThis.selecter.findById("tbody","staffListBody")[0];
			listBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","staffListFoot")[0];
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				
			
				
				html.push('<tr name="staffInfo" staffId="'+obj.STAFF_ID+'" staffName="'+obj.STAFF_NAME+'" loginCode="'+obj.LOGIN_CODE 
						+'" state="'+obj.STATE +'"StateName="'+obj.STATE_NAME +'" latnId="'+obj.REGION_ID +'"  tel="'+obj.MOB_TEL
						+'" email="'+obj.EMAIL+'"departmentName="'+obj.DEPARTMENT+'"departmentCode="'+obj.DEPARTMENT_CODE+'" pwd="123456">');
				html.push('<td ><input id="staffInfoBox_'+obj.STAFF_ID+'" name="staffInfoBox" type="checkbox" ></td>');
				html.push('<td >'+obj.STAFF_ID+'</td>');
				html.push('<td >'+obj.LOGIN_CODE+'</td>');
				html.push('<td >'+obj.STAFF_NAME+'</td>');
				html.push('<td >'+obj.MOB_TEL+'</td>');
				html.push('<td >'+obj.EMAIL+'</td>');
				html.push('<td >'+obj.DEPARTMENT+'</td>');
				html.push('<td >'+obj.REGION_NAME+'</td>');
				html.push('<td >'+obj.STATE_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div  style="width:130px;">无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		var tbodyObj= parentThis.selecter.findById("tbody","staffListBody")[0];
		tbodyObj.find("input[type=checkbox][name=staffInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=staffInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
		
	},
	//新增组织机构
	addOrUpdateOrgInfo:function(parentThis,staffInfo){
		var html = [];
		html.push('<div class="tanchu_box" id="addOrUpdateOrgInfoPage"  style="width:700px;">');
		if("add"==staffInfo.type) {
			html.push('<h3>新增工号信息</h3>');
		} else if("update"==staffInfo.type) {
			html.push('<h3>工号资料变更</h3>');
		}
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>员工姓名：</th> ');         
		html.push('<td><input name="staffName" type="text" class="w160"></td>'); 
		html.push('<th><span style="color:red;">*</span>部门：</th>');         
		html.push('<td><input name="department" type="text" class="w160" readonly="readonly"> <input name="departmentCode" type="hidden" class="w160" readonly="readonly"> </td>'); 
		html.push('</tr>'); 
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>员工编码：</th> ');
		if("add"==staffInfo.type) {
			html.push('<td><input name="loginCode" type="text" class="w160"></td>');
		} else if("update"==staffInfo.type) {
			html.push('<td><input name="loginCode" type="text" class="w160" disabled="disabled"></td>');
		}
		html.push('<th><span style="color:red;">*</span>登录密码：</th>');   
		if("add"==staffInfo.type) {
			html.push('<td><input name="pwd" type="password" class="w160"></td>'); 
		} else if("update"==staffInfo.type) {
			html.push('<td><input name="pwd" type="password" class="w160" disabled="disabled"></td>'); 
		}
		html.push('</tr>');   
		html.push('<tr>');         
		html.push('<th>tel：</th>');         
		html.push('<td><input name="tel" type="text" class="w160"></td>');         
		html.push('<th>email：</th>');         
		html.push('<td><input name="email" type="text" class="w160"></td>');         
		html.push('</tr>'); 
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>状态：</th> ');         
		html.push('<td><select name="state" class="w160"> <option>选择</option></select></td>');
		html.push('<th><span style="color:red;">*</span>本地网：</th>');         
		html.push('<td><select name="latnId" class="w160"> <option>选择</option></select></td>');         
		html.push('</tr>');         
		html.push('<tr> ');         
		html.push('<td colspan="4" style="text-align:center;">');         
		html.push('<a href="#"  class="but" name="infoSubmit">提交</a>');      
		if("add"==staffInfo.type){
			html.push('<a href="#"  class="but btn-success ml10" name="infoClear">清空</a>');         
		}
		html.push('<a href="#"  class="but hs_bg ml10"  name="infoClose">关闭</a>');         
		html.push('</td>');         
		html.push('</tr>');         
		html.push('</table>');         
		html.push('</div>');
		
		var staffInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var staffInfoPageDiv=$("#addOrUpdateOrgInfoPage");
		
		//关闭
		staffInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(staffInfoPage);
		});
		
		//清空
		staffInfoPageDiv.find("a[name=infoClear]").unbind("click").bind("click",function(){
			staffInfoPageDiv.find("input[name=staffName]").val("");
			staffInfoPageDiv.find('input[name=department]').val("");
			staffInfoPageDiv.find("input[name=loginCode]").val("");
			staffInfoPageDiv.find("input[name=pwd]").val("");
			staffInfoPageDiv.find('input[name=tel]').val("");
			staffInfoPageDiv.find("input[name=email]").val("");
			staffInfoPageDiv.find("select[name=state]").find("option[dicId='']").attr("selected",true);
			staffInfoPageDiv.find("select[name=latnId]").find("option[latnId='']").attr("selected",true);
			departmentCode = "";
		});
		
		//初始化本地网
		var latnIdObj =staffInfoPageDiv.find("select[name=latnId]");
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.latnSet.length > 0){
					var html = [];
					latnIdObj.html("");
					$.each(json.latnSet,function(i,obj){
						html.push('<option latnId = '+obj.REGION_ID+' latnCode = '+obj.REGION_CODE+'>'+obj.REGION_NAME+'</option>');
					});
					latnIdObj.html(html.join(''));
				}
			}else{
				layer.alert(msg);
			};
		}, null, false,false);
		
		//部门选择
		
		if(staffInfo.type=='add'){
			var departObj = staffInfoPageDiv.find("input[name=department]");
			departObj.unbind("click").bind("click",function(){
				var latnIdObj=staffInfoPageDiv.find("select[name=latnId]");
				var latnId = latnIdObj.find('option:selected').attr('latnId');
				var staffParam = {
					"latnId" : latnId	
				};
				parentThis.queryPOrgInfo(parentThis,staffParam);
			});
		}else{
			var departObj = staffInfoPageDiv.find("input[name=department]");
			departObj.unbind("click").bind("click",function(){
				var latnIdObj=staffInfoPageDiv.find("select[name=latnId]");
				var latnId = latnIdObj.find('option:selected').attr('latnId');
				var staffParam = {
					"latnId" : latnId	
				};
				parentThis.queryPOrgInfos(parentThis,staffParam);
			});
		}
		
		
		//初始化状态
		var orgStateObj =   staffInfoPageDiv.find("select[name=state]");
		var param = {
					"dicType" : "staffState"
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					orgStateObj.html("");
					html.push('<option dicId ="">请选择</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					orgStateObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化数据
		staffInfoPageDiv.find('input[name=staffName]').val(staffInfo.staffName);
		staffInfoPageDiv.find('input[name=department]').val(staffInfo.departmentName);
		staffInfoPageDiv.find('input[name=departmentCode]').val(staffInfo.departmentCode);
		staffInfoPageDiv.find('input[name=loginCode]').val(staffInfo.loginCode);
		staffInfoPageDiv.find('input[name=pwd]').val(staffInfo.pwd);
		staffInfoPageDiv.find('input[name=tel]').val(staffInfo.tel);
		staffInfoPageDiv.find('input[name=email]').val(staffInfo.email);
		staffInfoPageDiv.find("select[name=state]").find("option[dicId='"+staffInfo.state+"']").attr("selected",true);
		staffInfoPageDiv.find("select[name=latnId]").find("option[latnId='"+staffInfo.latnId+"']").attr("selected",true);
		
//		if("update"==staffInfo.type) {
//			staffInfoPageDiv.find('input[name=staffName]').attr({readonly:"true"});
//			staffInfoPageDiv.find('input[name=department]').attr({readonly:"true"});
//			staffInfoPageDiv.find('input[name=loginCode]').attr({readonly:"true"});
//			staffInfoPageDiv.find('input[name=pwd]').attr({readonly:"true"});
//			staffInfoPageDiv.find('input[name=tel]').attr({readonly:"true"});
//			staffInfoPageDiv.find('input[name=email]').attr({readonly:"true"});
//		}
		
		//提交
		staffInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			
			var staffNameObj = staffInfoPageDiv.find('input[name=staffName]');
			var staffName = staffNameObj.val().trim();
			var loginCodeObj=staffInfoPageDiv.find('input[name=loginCode]');
			var loginCode=loginCodeObj.val().trim();
			var pwdObj = staffInfoPageDiv.find('input[name=pwd]');
			var pwd = pwdObj.val().trim();
			var telObj = staffInfoPageDiv.find('input[name=tel]');
			var tel = telObj.val().trim();
			var emailObj = staffInfoPageDiv.find('input[name=email]');
			var email = emailObj.val().trim();
			var departmentObj = staffInfoPageDiv.find('input[name=department]');
			var department = departmentObj.val().trim();			
			var departmentCodeObj = staffInfoPageDiv.find('input[name=departmentCode]');
			var departmentCode = departmentCodeObj.val().trim();			
			
			//var departmentCode = departmentCode;
			var stateObj=staffInfoPageDiv.find("select[name=state]");
			var state = stateObj.find('option:selected').attr('dicId');
			var latnIdObj=staffInfoPageDiv.find("select[name=latnId]");
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			
			//校验数据
			if(staffName.length==0 || loginCode.length==0 || pwd.length==0 || department.length==0 || state.length ==0 ){
				layer.alert("工号信息填写不完整 ",8);
				return false;
			}
			if(pwd.length!=6) {
				layer.alert("请填写六位密码",8);
				return false;
			}
			
			var new_content = {};
			var old_content = {};
			if("update"==staffInfo.type) {
				new_content = {
						"staffId" : staffInfo.staffId,
						"staffName" : staffName,
						"tel" : tel,
						"email" : email,
						"department" : department,
						"departmentCode" :departmentCode,						
						"state" : state	
				};
				
				old_content = {
						"staffId" : staffInfo.staffId,
						"staffName" : staffInfo.staffName,
						"tel" : staffInfo.tel,
						"email" : staffInfo.email,
						"department" : staffInfo.department,
						"departmentCode" :staffInfo.departmentCode,
						"state" : staffInfo.state
				};
				
			}
			
			
			var param = {
				"staffId" : staffInfo.staffId,
				"staffName" : staffName,
				"loginCode" : loginCode,
				"pwd" : pwd,
				"tel" : tel,
				"email" : email,
				"department" : department,
				"departmentCode" : departmentCode,
				"state" : state,
				"latnId" : latnId,
				"new_content" : JSON.stringify(new_content),
				"old_content" : JSON.stringify(old_content),
				"methodType" : staffInfo.type
			};
			
			var confirm=layer.confirm('您是否确认提交？', function(){
				
				$.jump.ajax(URL_QUERY_STAFF_LIST.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						layer.close(staffInfoPage);
						parentThis.queryPageList(parentThis,0);
					}else{
						layer.alert(json.msg,8);	
					};
				}, param, false,false);
			});
		});
	},
	
	queryPOrgInfo : function(parentThis,orgParam){
		var html = [];
		html.push('<div class="tanchu_box" id="pOrgInfoPage" style="width:700px;">');
		html.push('<h3>父级组织机构</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>组织机构名称：<input type="text" name="orgName" class="w100"></li>');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('</ul>');
		html.push('</div>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">组织机构ID</th>');         
		html.push('<th style="text-align:center">组织机构名称</th> '); 
		html.push('<th style="text-align:center">父级组织机构</th>');         
		html.push('<th style="text-align:center">状态</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="pOrgInfobody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="pOrgListFoot"></div>');
		html.push('</div>');
		
		var pOrgInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		
		parentThis.pOrgInfoPage=pOrgInfoPage;
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		
		var seniorObj = pOrgInfoPageDiv.find("a[name=senior]");
		seniorObj.unbind("click").bind("click",function(){
			
			parentThis.quertPOrgInfo(parentThis,orgParam);
		});
		parentThis.quertPOrgInfo(parentThis,orgParam);
	},
	queryPOrgInfos : function(parentThis,orgParam){
		var html = [];
		html.push('<div class="tanchu_box" id="pOrgInfoPage" style="width:700px;">');
		html.push('<h3>父级组织机构</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>组织机构名称：<input type="text" name="orgName" class="w100"></li>');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('</ul>');
		html.push('</div>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">组织机构ID</th>');         
		html.push('<th style="text-align:center">组织机构名称</th> '); 
		html.push('<th style="text-align:center">父级组织机构</th>');         
		html.push('<th style="text-align:center">状态</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="pOrgInfobody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="pOrgListFoot"></div>');
		html.push('</div>');
		
		var pOrgInfoPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		
		parentThis.pOrgInfoPage=pOrgInfoPage;
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		
		var seniorObj = pOrgInfoPageDiv.find("a[name=senior]");
		seniorObj.unbind("click").bind("click",function(){
			
			parentThis.quertPOrgInfos(parentThis,orgParam);
		});
		parentThis.quertPOrgInfos(parentThis,orgParam);
	},
	//查询部门
	quertPOrgInfo : function(parentThis,orgParam) {
		
		
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		var orgNameObj = pOrgInfoPageDiv.find("input[name=orgName]");//组织机构名称
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"latnId" : orgParam.latnId,
				"orgName" : orgNameObj.val(),
				"org_flag" : "3",
				"professional" :"professional",
				"methodType" : "queryOrg"
			};
	
			var listFootObj = pOrgInfoPageDiv.find("div[name=pOrgListFoot]");
			
			common.pageControl.start(URL_QUERY_ORG_LIST.encodeUrl(),
									 pageIndex,
									 pageSize,
									 param,
									 "data",
									 null,
									 listFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = pOrgInfoPageDiv.find("tbody[name=pOrgInfobody]");
				listBodyObj.html("");
				parentThis.createpOrgLstHtml(parentThis,data,listBodyObj);
			});
	},
	quertPOrgInfos : function(parentThis,orgParam) {
		
		
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		var orgNameObj = pOrgInfoPageDiv.find("input[name=orgName]");//组织机构名称
		var pageIndex = 0;
		var pageSize = 5;
		
		var param = {
				"latnId" : orgParam.latnId,
				"orgName" : orgNameObj.val(),				
				"methodType" : "queryOrg"
			};
	
			var listFootObj = pOrgInfoPageDiv.find("div[name=pOrgListFoot]");
			
			common.pageControl.start(URL_QUERY_ORG_LIST.encodeUrl(),
									 pageIndex,
									 pageSize,
									 param,
									 "data",
									 null,
									 listFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = pOrgInfoPageDiv.find("tbody[name=pOrgInfobody]");
				listBodyObj.html("");
				parentThis.createpOrgLstHtmls(parentThis,data,listBodyObj);
			});
	},
	//生成新增加选择部门数据
	createpOrgLstHtml : function(parentThis,data,listBodyObj) {
		
		
		var html=[];
		var dataLst = data.data;
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		
		var listFootObj = pOrgInfoPageDiv.find("div[name=pOrgListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				if(obj.ORG_FLAG=="3"||obj.professional=="1"){				
				html.push('<tr name="orgInfo" orgId="'+obj.ORG_ID+'" orgName="'+obj.ORG_NAME+'" orgState="'+obj.STATE +'" orgStateName="'+obj.STATE +'" latnId="'+obj.REGION_ID +'" >');
				html.push('<td >'+obj.ORG_ID+'</td>');
				html.push('<td >'+obj.ORG_NAME+'</td>');
				html.push('<td >'+obj.PID_NAME+'</td>');
				html.push('<td >'+obj.STATE_NAME+'</td>');
				html.push('</tr>');
				}				
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		pOrgInfoPageDiv.find("tr[name=orgInfo]").unbind("click").bind("click",function(){
			
			 var pOrgName = $(this).attr("orgName");
			 var pOrgId = $(this).attr("orgId");
			 $("#addOrUpdateOrgInfoPage").find("input[name=department]").val(pOrgName);
			 layer.close(parentThis.pOrgInfoPage);
			 $("#addOrUpdateOrgInfoPage").find("input[name=orgId]").hide();
			 departmentCode = pOrgId;
			 $("#addOrUpdateOrgInfoPage").find("input[name=departmentCode]").val(pOrgId);
		});
	},
	//修改部门数据
	createpOrgLstHtmls : function(parentThis,data,listBodyObj) {
		
		
		var html=[];
		var dataLst = data.data;
		var pOrgInfoPageDiv = $("#pOrgInfoPage");
		
		var listFootObj = pOrgInfoPageDiv.find("div[name=pOrgListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
							
				html.push('<tr name="orgInfo" orgId="'+obj.ORG_ID+'" orgName="'+obj.ORG_NAME+'" orgState="'+obj.STATE +'" orgStateName="'+obj.STATE +'" latnId="'+obj.REGION_ID +'" >');
				html.push('<td >'+obj.ORG_ID+'</td>');
				html.push('<td >'+obj.ORG_NAME+'</td>');
				html.push('<td >'+obj.PID_NAME+'</td>');
				html.push('<td >'+obj.STATE_NAME+'</td>');
				html.push('</tr>');
				
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		pOrgInfoPageDiv.find("tr[name=orgInfo]").unbind("click").bind("click",function(){
			
			 var pOrgName = $(this).attr("orgName");
			 var pOrgId = $(this).attr("orgId");
			 $("#addOrUpdateOrgInfoPage").find("input[name=department]").val(pOrgName);
			 layer.close(parentThis.pOrgInfoPage);
			 $("#addOrUpdateOrgInfoPage").find("input[name=orgId]").hide();
			 departmentCode = pOrgId;
			 $("#addOrUpdateOrgInfoPage").find("input[name=departmentCode]").val(pOrgId);
		});
	},
	
};