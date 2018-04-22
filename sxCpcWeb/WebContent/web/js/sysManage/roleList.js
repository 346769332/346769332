var RoleList=new Function();
/**评价*/
RoleList.prototype = {
	selecter : "#roleListPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		var exportObj=parentThis.selecter.findById("a","export")[0];
		exportObj.unbind("click").bind("click",function(){
			
			var latnIdObj = parentThis.selecter.findById("select","latnId")[0]; //本地网
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			var roleNameObj=parentThis.selecter.findById("input","roleName")[0];
			var roleTypeObj = parentThis.selecter.findById("select","roleType")[0];//角色类型
			var roleType = roleTypeObj.find('option:selected').attr('dicId');
			var roleStateObj = parentThis.selecter.findById("select","roleState")[0];//角色类型
			var roleState = roleStateObj.find('option:selected').attr('dicId');
			
			var param = {
				"latnId"					:		latnId					,
				"roleName"					:		roleNameObj.val()		,
				"roleType"					:		roleType				,
				"roleState"					:		roleState		
			};
			var exportForm=parentThis.selecter.findById("form","roleListPageForm")[0];
			exportForm.attr("action",(URL_SYSMANAGE_DOWNLOAD+"?param="+JSON.stringify(param)).encodeUrl());
			exportForm.attr("method","post");
			exportForm.submit();
		});
		//初始化本地网
		var latnIdObj =parentThis.selecter.findById("select","latnId")[0];
		$.jump.ajax(URL_QUERY_LATN_DATA.encodeUrl(), function(json) {
			
			if(json.code == "0" ){
				if(json.latnSet.length > 0){
					var html = [];
					latnIdObj.html("");
					$.each(json.latnSet,function(i,obj){
						html.push('<option latnId = '+obj.REGION_ID+' latnCode = '+obj.REGION_CODE+'>'+obj.REGION_NAME+'</option>');
					});
					latnIdObj.html(html.join(''));
					
//					var tempLatnId=json.currUser.regionId;
//					latnIdObj.find("option[latnId='"+tempLatnId+"']").attr("selected",true);
				}
			}else{
				layer.alert(msg);
			};
		}, null, false,false);
		
		//初始化类型
		var roleTypeObj =  parentThis.selecter.findById("select","roleType")[0];
		var param = {
					"dicType" 	: 		"roleType"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					roleTypeObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					roleTypeObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化状态
		var roleStateObj =  parentThis.selecter.findById("select","roleState")[0];
		var param = {
					"dicType" 	: 		"roleState"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					roleStateObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					roleStateObj.html(html.join(''));
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
			var roleNameObj=parentThis.selecter.findById("input","roleName")[0];
			roleNameObj.val('');
			var roleTypeObj = parentThis.selecter.findById("select","roleType")[0];//角色类型
			roleTypeObj.find("option[dicId='']").attr("selected",true);
			var roleStateObj = parentThis.selecter.findById("select","roleState")[0];//角色类型
			roleStateObj.find("option[dicId='']").attr("selected",true);
		});
		
		var addRoleInfoObj= parentThis.selecter.findById("a","addRoleInfo")[0];
		addRoleInfoObj.unbind("click").bind("click",function(){
			var roleInfo={
					"type"			:      "add",
					"latnId"		:		"",
					"roleId"		:	 	"",
					"roleName"		:		"",
					"roleDesc"		:		"",
					"roleState"		:		"",
					"roleType"		:		"",
			};
			parentThis.addOrUpdateRoleInfo(parentThis,roleInfo);
		});
		parentThis.queryPageList(parentThis,0);
		
		
		//权限指派
		var roleAuthBtnObj= parentThis.selecter.findById("a","roleAuthBtn")[0];
			roleAuthBtnObj.unbind("click").bind("click",function(){
				
				var roleInfo={};
				var roleId="";
				var roleState="N";
				var tbodyObj= parentThis.selecter.findById("tbody","roleListBody")[0];
					tbodyObj.find("input[type=checkbox][name=roleInfoBox]").each(function(i,obj){
						var boxObj=$(this);
						if(boxObj.is(':checked')){
							var trObj=boxObj.parent().parent("tr[name=roleInfo]");
							roleId=trObj.attr("roleId");
							roleState=trObj.attr("roleState");
							roleInfo={
									"latnId"			:	 	trObj.attr("latnId"),
									"roleId"			:		roleId,
									"roleName"			:		trObj.attr("roleName"),
									"roleDesc"			:		trObj.attr("roleDesc"),
									"roleState"			:		trObj.attr("roleState"),
									"roleStateName"		:		trObj.attr("roleStateName"),
									"roleType"			:		roleType
							};
						}
					});
				if(roleId.length==0){
					layer.alert("请选择角色",8);
					return false;
				}
				
				if("N"==roleState){
					layer.alert("选中角色为失效状态不能指派权限",8);
					return false;
				}
				parentThis.dealRoleAuthInfo(parentThis,roleInfo);
			});
		
		//工号指派
		var roleUserBtnObj= parentThis.selecter.findById("a","roleUserBtn")[0];
			roleUserBtnObj.unbind("click").bind("click",function(){
				
				var roleInfo={};
				var roleId="";
				var roleState="N";
				var tbodyObj= parentThis.selecter.findById("tbody","roleListBody")[0];
					tbodyObj.find("input[type=checkbox][name=roleInfoBox]").each(function(i,obj){
						var boxObj=$(this);
						if(boxObj.is(':checked')){
							var trObj=boxObj.parent().parent("tr[name=roleInfo]");
							roleId=trObj.attr("roleId");
							roleState=trObj.attr("roleState");
							roleInfo={
									"latnId"			:	 	trObj.attr("latnId"),
									"roleId"			:		roleId,
									"roleName"			:		trObj.attr("roleName"),
									"roleDesc"			:		trObj.attr("roleDesc"),
									"roleState"			:		trObj.attr("roleState"),
									"roleStateName"		:		trObj.attr("roleStateName"),
									"roleType"			:		roleType
							};
						}
					});
				if(roleId.length==0){
					layer.alert("请选择角色",8);
					return false;
				}
				
				if("N"==roleState){
					layer.alert("选中角色为失效状态不能指派工号",8);
					return false;
				}
				parentThis.dealRoleUserInfo(parentThis,roleInfo);
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
	
	//检索角色
	queryPageList : function(parentThis,pageIndex) {
		
		var latnIdObj = parentThis.selecter.findById("select","latnId")[0]; //本地网
		var latnId = latnIdObj.find('option:selected').attr('latnId');
		var roleNameObj=parentThis.selecter.findById("input","roleName")[0];
		var roleTypeObj = parentThis.selecter.findById("select","roleType")[0];//角色类型
		var roleType = roleTypeObj.find('option:selected').attr('dicId');
		var roleStateObj = parentThis.selecter.findById("select","roleState")[0];//角色类型
		var roleState = roleStateObj.find('option:selected').attr('dicId');
		
		var param = {
			"latnId"					:		latnId					,
			"roleName"					:		roleNameObj.val()		,
			"roleType"					:		roleType				,
			"roleState"					:		roleState		
		};
		var listFootObj = parentThis.selecter.findById("div","roleListFoot")[0];
		
		common.pageControl.start(URL_QUERY_ROLE_LIST.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = parentThis.selecter.findById("tbody","roleListBody")[0];
			listBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","roleListFoot")[0];
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="roleInfo" roleId="'+obj.role_id+'" roleName="'+obj.role_name+'" roleDesc="'+obj.role_desc +'" roleState="'+obj.role_status +'" roleStateName="'+obj.role_status_name +'"  roleType="'+obj.role_type +'" latnId="'+obj.latn_id +'" >');
				html.push('<td ><input id="roleInfoBox_'+obj.role_id+'" name="roleInfoBox" type="checkbox" ></td>');
				html.push('<td >'+obj.role_id+'</td>');
				html.push('<td >'+obj.role_name+'</td>');
				html.push('<td >'+obj.role_type_name+'</td>');
				html.push('<td >'+obj.latn_name+'</td>');
				html.push('<td >'+obj.role_status_name+'</td>');
				html.push('<td >');
				html.push('<a  style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="updateRoleInfo">修改</a>');
				html.push('&nbsp;&nbsp;&nbsp;');
				html.push('<a style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="deleteRoleInfo">删除</a>');
				html.push('</td>');
				html.push('</tr>');
			});
		}else{
			listFootObj.hide();
			html.push('<div>');
			html.push('<div>无相关数据</div>');
			html.push('<div>');
		}
		listBodyObj.html(html.join(''));
		
		var tbodyObj= parentThis.selecter.findById("tbody","roleListBody")[0];
		tbodyObj.find("input[type=checkbox][name=roleInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=roleInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
		
		//修改角色
		tbodyObj.find("a[name=updateRoleInfo]").unbind("click").bind("click",function(){
			
			var trObj=$(this).parent().parent("tr[name=roleInfo]");
			var roleInfo={
					"type"			:   	 "update",
					"latnId"		:	 	trObj.attr("latnId"),
					"roleId"		:		trObj.attr("roleId"),
					"roleName"		:		trObj.attr("roleName"),
					"roleDesc"		:		trObj.attr("roleDesc"),
					"roleState"		:		trObj.attr("roleState"),
					"roleType"		:		trObj.attr("roleType")
			};
			parentThis.addOrUpdateRoleInfo(parentThis,roleInfo);
		});
		
		//删除角色
		tbodyObj.find("a[name=deleteRoleInfo]").unbind("click").bind("click",function(){
			var trObj=$(this).parent().parent("tr[name=roleInfo]");
			var roleInfo={
					"latnId"		:	 	trObj.attr("latnId"),
					"roleId"		:		trObj.attr("roleId"),
					"roleName"		:		trObj.attr("roleName"),
			};
			parentThis.deleteRoleInfo(parentThis,roleInfo);
		});
	},
	// 添加获取修改角色
	addOrUpdateRoleInfo:function(parentThis,roleInfo){
		var html = [];
		html.push('<div class="tanchu_box" id="addOrUpdateRoleInfoPage"  style="width:600px;">');
		html.push('<h3>新增角色</h3>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>角色名称：</th>');         
		html.push('<td><input name="roleName" type="text" class="w150"></td>');         
		html.push('<th><span style="color:red;">*</span>状态：</th> ');         
		html.push('<td><select name="roleState" class="w160"> <option>选择</option></select></td>');         
		html.push('</tr>');         
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>角色类型：</th> ');         
		html.push('<td><select name="roleType" class="w160"> <option>选择</option></select></td>');          
		html.push('<th><span style="color:red;">*</span>本地网：</th>');         
		html.push('<td><select name="latnId" class="w160"> <option>选择</option></select></td>');         
		html.push('</tr>');         
		html.push('<tr>');         
		html.push('<th>备注：</th>');         
		html.push('<td colspan="3"><textarea name="roleDesc" cols="" rows="5" style="width:98%"  ></textarea></td>');         
		html.push('</tr>');         
		html.push('<tr> ');         
		html.push('<th></th> ');         
		html.push('<td colspan="3" style="text-align:center;">');         
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">提交</a>');      
		if("add"==roleInfo.type){
			html.push('<a href="javascript:void(0)"  class="but btn-success ml10" name="infoClear">清空</a>');         
		}
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a>');         
		html.push('</td>');         
		html.push('</tr>');         
		html.push('</table>');         
		html.push('</div>');
		
		var roleInfoPage = $.layer({
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
		var roleInfoPageDiv=$("#addOrUpdateRoleInfoPage");
		
		//关闭
		roleInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(roleInfoPage);
		});
		
		roleInfoPageDiv.find("a[name=infoClear]").unbind("click").bind("click",function(){
			roleInfoPageDiv.find('input[name=roleName]').val(roleInfo.roleName);
			roleInfoPageDiv.find("select[name=roleState]").find("option[dicId='"+roleInfo.roleState+"']").attr("selected",true);
			roleInfoPageDiv.find("select[name=roleType]").find("option[dicId='"+roleInfo.roleType+"']").attr("selected",true);
			roleInfoPageDiv.find("select[name=latnId]").find("option[latnId='"+roleInfo.latnId+"']").attr("selected",true);
			roleInfoPageDiv.find('textarea[name=roleDesc]').val(roleInfo.roleDesc);
		});
		
		
		//初始化本地网
		var latnIdObj =roleInfoPageDiv.find("select[name=latnId]");
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
		
		//初始化类型
		var roleTypeObj = roleInfoPageDiv.find("select[name=roleType]");
		var param = {
					"dicType" 	: 		"roleType"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					roleTypeObj.html("");
					html.push('<option dicId ="">请选择</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					roleTypeObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化状态
		var roleStateObj =   roleInfoPageDiv.find("select[name=roleState]");
		var param = {
					"dicType" 	: 		"roleState"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					roleStateObj.html("");
					html.push('<option dicId ="">请选择</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					roleStateObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化数据
		roleInfoPageDiv.find('input[name=roleName]').val(roleInfo.roleName);
		roleInfoPageDiv.find("select[name=roleState]").find("option[dicId='"+roleInfo.roleState+"']").attr("selected",true);
		roleInfoPageDiv.find("select[name=roleType]").find("option[dicId='"+roleInfo.roleType+"']").attr("selected",true);
		roleInfoPageDiv.find("select[name=latnId]").find("option[latnId='"+roleInfo.latnId+"']").attr("selected",true);
		roleInfoPageDiv.find('textarea[name=roleDesc]').val(roleInfo.roleDesc);
		
		//提交
		roleInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			var roleNameObj=roleInfoPageDiv.find('input[name=roleName]');
			var roleName=roleNameObj.val().trim();
			var roleStateObj=roleInfoPageDiv.find("select[name=roleState]");
			var roleState = roleStateObj.find('option:selected').attr('dicId');
			var roleTypeObj=roleInfoPageDiv.find("select[name=roleType]");
			var roleType = roleTypeObj.find('option:selected').attr('dicId');
			var latnIdObj=roleInfoPageDiv.find("select[name=latnId]");
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			var roleDescObj=roleInfoPageDiv.find('textarea[name=roleDesc]');
			var roleDesc=roleDescObj.val().trim();
			
			//校验数据
			if(roleName.length==0 || roleState.length==0 || roleType.length==0 || latnId.length==0 ){
				layer.alert("角色信息填写不完整 ",8);
				return false;
			}
			
			var param={
					"type"			:		roleInfo.type,
					"roleId"		:		roleInfo.roleId,
					"latnId"		:	 	latnId,
					"roleName"		:		roleName,
					"roleDesc"		:		roleDesc,
					"roleState"		:		roleState,
					"roleType"		:		roleType	
			};
			
			var confirm=layer.confirm('您是否确认提交？', function(){
				
				$.jump.ajax(URL_DEAL_ROLE_INFO.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						layer.close(roleInfoPage);
						parentThis.queryPageList(parentThis,0);
					}else{
						layer.msg("保存失败!");	
					};
				}, param, false,false);
			});
		});
	},
	//删除角色数据
	deleteRoleInfo:function(parentThis,roleInfo){
		var checkParam={
				"type"		: 		"check",
				"roleId"	:		roleInfo.roleId,
				"latnId"	:		roleInfo.latnId
		};
		$.jump.ajax(URL_DELETE_ROLE_INFO.encodeUrl(), function(json) {
			if(json.code == "0" ){
				var content="";
				
				if(json.sum == "0"){
					content=roleInfo.roleName+"未使用,您确定是否删除？";
				}else{
					content=roleInfo.roleName+"使用中,删除后该角色相应的权限则收回,您确定是否删除？";
				}
				var confirm=layer.confirm(content, function(){
					var deleteParam={
							"type"		: 		"delete",
							"roleId"	:		roleInfo.roleId,
							"latnId"	:		roleInfo.latnId,	
					}
					
					$.jump.ajax(URL_DELETE_ROLE_INFO.encodeUrl(), function(json) {
						if(json.code == "0" ){
							layer.close(confirm);
							parentThis.queryPageList(parentThis,0);
						}else{
							layer.alert("删除失败!");	
						}
					}, deleteParam, false,false);
				});
			}else{
				layer.alert("判断"+roleInfo.roleName+"是否正在使用异常!");	
			}
		}, checkParam, false,false);
	},
	
	/**权限分配*/
	dealRoleAuthInfo:function(parentThis,roleInfo){
		var url='/web/html/sysManage/roleAuthInfo.html?roleId='+roleInfo.roleId+'&roleName='+roleInfo.roleName+'&roleStateName='+roleInfo.roleStateName;
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
	/**工号指派*/
	dealRoleUserInfo:function(parentThis,roleInfo){
		var url='/web/html/sysManage/roleUserInfo.html?roleId='+roleInfo.roleId+'&roleName='+roleInfo.roleName+'&roleStateName='+roleInfo.roleStateName;
		$.layer({
               type: 2,
               shadeClose: false,
               title: '工号指派',
               closeBtn: [0, true],
               shade: [0.8, '#000'],
               border: [0],
               offset: ['20px', ''],
               area: ['1000px', '600px'],
               iframe:{ src: url.encodeUrl()}
           });
	},
};