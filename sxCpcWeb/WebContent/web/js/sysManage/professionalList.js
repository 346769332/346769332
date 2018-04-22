var ProfessionalList = new Function();
/**评价*/
ProfessionalList.prototype = {
	selecter : "#listPage",
	pageSize : 10,
	staffInfoPage	: null,
	loginCodeForUpdate : null,
	
	//初始化执行
	init : function() {
		this.bindMetod(this);
		departmentCode = "";
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
		
		//查询绑定
		var seniorObj =  parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			parentThis.queryPageList(parentThis,0);
		});
		
		//新增组织机构
		var addStaffInfoObj= parentThis.selecter.findById("a","updatePoolInfo")[0];
		addStaffInfoObj.unbind("click").bind("click",function(){
			
			var poolId = "";
			 
			var tbodyObj = parentThis.selecter.findById("tbody","listBody")[0];
			tbodyObj.find("input[type=checkbox][name=poolInfoBox]").each(function(i,obj){
				var boxObj = $(this);
				if(boxObj.is(':checked')){
					var trObj = boxObj.parent().parent("tr[name=poolInfo]");
					poolId = trObj.attr("poolId");
					poolInfo = {
							"type" : "update",
							"latnId" : trObj.attr("latnId"),
							"poolId" : poolId,
							"poolName" : trObj.attr("poolName"),
							"loginCode"	: trObj.attr("loginCode"),
							"loginName" : trObj.attr("loginName"),
							"mobTel" : trObj.attr("mobTel"),
							"orgId":trObj.attr("orgId")
					};
				}
			});
			
			if(poolId.length==0){
				layer.alert("请选择接单池",8);
				return false;
			}
			parentThis.updateStaffInfo(parentThis,poolInfo);
		});
		
		parentThis.queryPageList(parentThis,0);
		
		
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

		var param = {
			"latnId" : latnId,
			"personnel_service" : "service",
			"personnel_type" :"professional",
			"methodType" : "query"
				
		};
		
		var listFootObj = parentThis.selecter.findById("div","listFoot")[0];
		
		common.pageControl.start(URL_QUERY_SERVICE_LIST.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = parentThis.selecter.findById("tbody","listBody")[0];
			listBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","listFoot")[0];
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="poolInfo" poolId="'+obj.org_id+'" poolName="'+obj.org_name
						+'" loginCode="'+obj.LOGIN_CODE+'" loginName="'+obj.STAFF_NAME+'" latnId="'+obj.region_code+'" mobTel="'+obj.LOGIN_CODE+'" orgId="'+obj.org_id+'">');
				html.push('<td ><input id="poolInfoBox_'+obj.LOGIN_CODE+'" name="poolInfoBox" type="checkbox" ></td>');
				
				html.push('<td >'+obj.org_name+'</td>');
				
				html.push('<td >'+obj.STAFF_NAME+'</td>');
				html.push('<td >'+obj.LOGIN_CODE+'</td>');
				html.push('<td >'+obj.region_name+'</td>');
				html.push('<input type="hidden" id='+obj.ORG_ID+'>');
				html.push('</tr>');
				
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div  style="width:130px;">无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		var tbodyObj= parentThis.selecter.findById("tbody","listBody")[0];
		tbodyObj.find("input[type=checkbox][name=poolInfoBox]").unbind("click").bind("click",function(){
			
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=poolInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
		
	},
	//修改值班人信息
	updateStaffInfo:function(parentThis,poolInfo){
		
		
		
		var html = [];
		html.push('<div class="tanchu_box" id="updatePoolInfoPage"  style="width:700px;">');
		html.push('<h3>修改值班人信息</h3>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<tr>');         
		html.push('<th>单池ID：</th> ');         
		html.push('<td><input name="poolId" type="text" class="w160"></td>'); 
		html.push('<th>单池名称：</th>');         
		html.push('<td><input name="poolName" type="text" class="w160"></td>'); 
		html.push('</tr>'); 
		html.push('<tr>');         
		html.push('<th>值班人：</th> ');         
		html.push('<td><input name="loginName" type="text" class="w160" readonly="readonly"></td>'); 
		html.push('<th>值班电话：</th>');         
		html.push('<td><input name="mobTel" type="text" class="w160"></td>'); 
		
		
		html.push('</tr>');   
		html.push('<tr> ');         
		html.push('<td colspan="4" style="text-align:center;">');         
		html.push('<a href="#"  class="but" name="infoSubmit">提交</a>');      
		html.push('<a href="#"  class="but hs_bg ml10"  name="infoClose">关闭</a>');         
		html.push('</td>');         
		html.push('</tr>');         
		html.push('</table>');         
		html.push('</div>');
		
		var poolInfoPage = $.layer({
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
		var poolInfoPageDiv=$("#updatePoolInfoPage");
		
		//关闭
		poolInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(poolInfoPage);
		});
		
		//部门选择
		var loginNameObj = poolInfoPageDiv.find("input[name=loginName]");
		loginNameObj.unbind("click").bind("click",function(){
			
			var latnId = poolInfo.latnId;
			var orgId=poolInfo.orgId;
			
			var poolParam = {
				"orgId":orgId,
				"latnId" : latnId	
			};
			parentThis.queryStaffInfo(parentThis,poolParam);
		});
		
		//初始化数据
		poolInfoPageDiv.find('input[name=poolId]').val(poolInfo.poolId);
		poolInfoPageDiv.find('input[name=poolName]').val(poolInfo.poolName);
		poolInfoPageDiv.find('input[name=loginName]').val(poolInfo.loginName);
		poolInfoPageDiv.find('input[name=mobTel]').val(poolInfo.mobTel);
		
		if("update"==poolInfo.type) {
			poolInfoPageDiv.find('input[name=poolId]').attr({readonly:"true"});
			poolInfoPageDiv.find('input[name=poolName]').attr({readonly:"true"});
			poolInfoPageDiv.find('input[name=loginName]').attr({readonly:"true"});
		}
		
		//提交
		poolInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			
			var poolIdObj = poolInfoPageDiv.find('input[name=poolId]');
			var poolId = poolIdObj.val().trim();
			var loginCode = loginCodeForUpdate;
			var mobTelObj = poolInfoPageDiv.find('input[name=mobTel]');
			var mobTel = mobTelObj.val().trim();
			
			var new_content = {};
			var old_content = {};
			if("update"==poolInfo.type) {
				new_content = {
						"poolId" : poolInfo.poolId,
						"latnId" : poolInfo.latnId,
						"loginCode" : loginCode,
						"mobTel" : mobTel,
						"personnel_service" :"service"
				};
				
				old_content = {
						"poolId" : poolInfo.poolId,
						"latnId" : poolInfo.latnId,
						"loginCode" : poolInfo.loginCode,
						"mobTel" : poolInfo.mobTel,
						"personnel_service" :""
				};
			}
			
			var param = {
					"orgId"  : poolInfo.orgId,
					"personnel_service" :"service",
					"poolId" : poolInfo.poolId,
					"latnId" : poolInfo.latnId,
					"loginCode" : loginCode,
					"mobTel" : mobTel,
					"new_content" : JSON.stringify(new_content),
					"old_content" : JSON.stringify(old_content),
					"methodType" : poolInfo.type
			};
			
			var confirm=layer.confirm('您是否确认提交？', function(){
				
				$.jump.ajax(URL_QUERY_SERVICE_LIST.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						layer.close(poolInfoPage);
						parentThis.queryPageList(parentThis,0);
					}else{
						layer.alert(json.msg,8);	
					};
				}, param, false,false);
			});
		});
	},
	
	queryStaffInfo : function(parentThis,poolParam){
		var html = [];
		html.push('<div class="tanchu_box" id="staffInfoPage" style="width:700px;">');
		html.push('<h3>值班人员</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>值班人员姓名：<input type="text" name="staffName" class="w100"></li>');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('</ul>');
		html.push('</div>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">值班人ID</th>');         
		html.push('<th style="text-align:center">值班人姓名</th> '); 
		html.push('<th style="text-align:center">值班人部门</th>');         
		html.push('<th style="text-align:center">值班人电话</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="staffInfoBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="staffListFoot"></div>');
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
		
		var staffInfoPageDiv = $("#staffInfoPage");
		
		staffInfoPageDiv.find("a[name=senior]").unbind("click").bind("click",function(){
			parentThis.queryStaffInfoPage(parentThis,poolParam);
		});
		
		parentThis.staffInfoPage=staffInfoPage;
		parentThis.queryStaffInfoPage(parentThis,poolParam);
	},
	
	//查询值班人员
	queryStaffInfoPage : function(parentThis,poolParam) {
		
		var staffInfoPageDiv = $("#staffInfoPage");
		var pageIndex = 0;
		var pageSize = 5;
		
		var staffName = staffInfoPageDiv.find("input[name=staffName]");
		
		var param = {
				
				"latnId" : poolParam.latnId,
				"orgId":poolParam.orgId,
//				"state" : "1",
				"staffName" : staffName.val(),
				"methodType" : "query"
				
			};
		
			var listFootObj = staffInfoPageDiv.find("div[name=staffListFoot]");
			
			common.pageControl.start(URL_QUERY_STAFF_LIST.encodeUrl(),
									 pageIndex,
									 pageSize,
									 param,
									 "data",
									 null,
									 listFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = staffInfoPageDiv.find("tbody[name=staffInfoBody]");
				listBodyObj.html("");
				parentThis.createStaffLstHtml(parentThis,data,listBodyObj);
			});
	},
	
	//生成值班人员数据
	createStaffLstHtml : function(parentThis,data,listBodyObj) {
		
		var html=[];
		var dataLst = data.data;
		var staffInfoPageDiv = $("#staffInfoPage");
		
		var listFootObj = staffInfoPageDiv.find("div[name=staffListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr style="cursor: pointer;" name="staffInfo" staffName="'+obj.STAFF_NAME+'" loginCode="'+obj.LOGIN_CODE +'" mobTel="'+obj.MOB_TEL +'" >');
				html.push('<td >'+obj.LOGIN_CODE+'</td>');
				html.push('<td >'+obj.STAFF_NAME+'</td>');
				html.push('<td >'+obj.DEPARTMENT+'</td>');
				html.push('<td >'+obj.MOB_TEL+'</td>');
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		staffInfoPageDiv.find("tr[name=staffInfo]").unbind("click").bind("click",function(){
			
			 var loginCode = $(this).attr("loginCode");
			 var staffName = $(this).attr("staffName");
			 var mobTel = $(this).attr("mobTel");
			 $("#updatePoolInfoPage").find("input[name=loginName]").val(staffName);
			 $("#updatePoolInfoPage").find("input[name=mobTel]").val(mobTel);
			 loginCodeForUpdate = loginCode;
			 layer.close(parentThis.staffInfoPage);
		});
	},
	
};