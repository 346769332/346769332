var AuthList=new Function();
/**评价*/
AuthList.prototype = {
	selecter : "#authListPage",
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
			var authNameObj=parentThis.selecter.findById("input","authName")[0];
			var authTypeObj = parentThis.selecter.findById("select","authType")[0];//角色类型
			var authType = authTypeObj.find('option:selected').attr('dicId');
			var authStateObj = parentThis.selecter.findById("select","authState")[0];//角色类型
			var authState = authStateObj.find('option:selected').attr('dicId');
			var param = {
				"latnId"					:		latnId					,
				"authName"					:		authNameObj.val()		,
				"authType"					:		authType				,
				"authState"					:		authState		
			};
			var exportForm=parentThis.selecter.findById("form","authListPageForm")[0];
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
		var authTypeObj =  parentThis.selecter.findById("select","authType")[0];
		var param = {
					"dicType" 	: 		"authType"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					authTypeObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					authTypeObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化状态
		var authStateObj =  parentThis.selecter.findById("select","authState")[0];
		var param = {
					"dicType" 	: 		"authState"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					authStateObj.html("");
					html.push('<option dicId ="">全部</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					authStateObj.html(html.join(''));
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
			var authNameObj=parentThis.selecter.findById("input","authName")[0];
			authNameObj.val('');
			var authTypeObj = parentThis.selecter.findById("select","authType")[0];//权限类型
			authTypeObj.find("option[dicId='']").attr("selected",true);
			var authStateObj = parentThis.selecter.findById("select","authState")[0];//权限类型
			authStateObj.find("option[dicId='']").attr("selected",true);
		});
		
		var addAuthInfoObj= parentThis.selecter.findById("a","addAuthInfo")[0];
		addAuthInfoObj.unbind("click").bind("click",function(){
			var authInfo={
					"type"		:    "add",
					"latnId"		:		"",
					"authId"		:	 	"",
					"authName"		:		"",
					"authDesc"		:		"",
					"authState"		:		"",
					"authType"		:		"",
			};
			parentThis.addOrUpdateAuthInfo(parentThis,authInfo);
		});
		parentThis.queryPageList(parentThis,0);
		
		
		//权限指派
	
		var assignAuthBtnObj= parentThis.selecter.findById("a","assignAuthBtn")[0];
			assignAuthBtnObj.unbind("click").bind("click",function(){
				
				var authInfo={};
				var authId="";
				var authState="N";
				
				var tbodyObj= parentThis.selecter.findById("tbody","authListBody")[0];
					tbodyObj.find("input[type=checkbox][name=authInfoBox]").each(function(i,obj){
						var boxObj=$(this);
						if(boxObj.is(':checked')){
							var trObj=boxObj.parent().parent("tr[name=authInfo]");
							authId=trObj.attr("authId");
							authState=trObj.attr("authState");
							authInfo={
									"latnId"			:	 	trObj.attr("latnId"),
									"authId"			:		authId,
									"authName"			:		trObj.attr("authName"),
									"authDesc"			:		trObj.attr("authDesc"),
									"authState"			:		trObj.attr("authState"),
									"authStateName"		:		trObj.attr("authStateName"),
									"authType"			:		authType
							};
							
						}
					});
				if(authId.length==0){
					layer.alert("请选择权限",8);
					return false;
				}
				
				if("N"==authState){
					layer.alert("选中权限为失效状态不能分配",8);
					return false;
				}
				parentThis.dealAssignAuthInfo(parentThis,authInfo);
			
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
	
	//检索权限
	queryPageList : function(parentThis,pageIndex) {
	
		var latnIdObj = parentThis.selecter.findById("select","latnId")[0]; //本地网
		var latnId = latnIdObj.find('option:selected').attr('latnId');
		var authNameObj=parentThis.selecter.findById("input","authName")[0];
		var authTypeObj = parentThis.selecter.findById("select","authType")[0];//角色类型
		var authType = authTypeObj.find('option:selected').attr('dicId');
		var authStateObj = parentThis.selecter.findById("select","authState")[0];//角色类型
		var authState = authStateObj.find('option:selected').attr('dicId');
		
		var param = {
			"latnId"					:		latnId					,
			"authName"					:		authNameObj.val()		,
			"authType"					:		authType				,
			"authState"					:		authState		
		};
		var listFootObj = parentThis.selecter.findById("div","authListFoot")[0];
		common.pageControl.start(URL_QUERY_AUTH_LIST.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = parentThis.selecter.findById("tbody","authListBody")[0];
			listBodyObj.html("");
			parentThis.createLstHtml(parentThis,data,listBodyObj);
		});
	},
	
	//创建HTML
	createLstHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		
		var listFootObj = parentThis.selecter.findById("div","authListFoot")[0];
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr name="authInfo" authId="'+obj.a_id+'" authName="'+obj.a_name+'" authDesc="'+obj.a_desc +'" authState="'+obj.a_status +'" authStateName="'+obj.a_status_name +'"  authType="'+obj.a_type +'" latnId="'+obj.latn_id +'" >');
				html.push('<td ><input id="authInfoBox_'+obj.a_id+'" name="authInfoBox" type="checkbox" ></td>');
				html.push('<td >'+obj.a_id+'</td>');
				html.push('<td >'+obj.a_name+'</td>');
				
				html.push('<td >'+obj.a_type_name+'</td>');
				html.push('<td >'+obj.latn_name+'</td>');				
				html.push('<td >'+obj.a_status_name+'</td>');
				
				html.push('<td >');
				html.push('<a  style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="updateAuthInfo">修改</a>');
				html.push('&nbsp;&nbsp;&nbsp;');
				html.push('<a style="color:#141DE6;cursor: pointer;text-decoration:underline" href="javascript:void(0)" name="deleteAuthInfo">删除</a>');
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
		
		var tbodyObj= parentThis.selecter.findById("tbody","authListBody")[0];
		tbodyObj.find("input[type=checkbox][name=authInfoBox]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=authInfoBox]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
		//修改权限
		tbodyObj.find("a[name=updateAuthInfo]").unbind("click").bind("click",function(){
			var trObj=$(this).parent().parent("tr[name=authInfo]");
			var authInfo={
					"type"			:   	 "update",
					"latnId"		:	 	trObj.attr("latnId"),
					"authId"		:		trObj.attr("authId"),
					"authName"		:		trObj.attr("authName"),
					"authDesc"		:		trObj.attr("authDesc"),
					"authState"		:		trObj.attr("authState"),
					"authType"		:		trObj.attr("authType")
			};
			parentThis.addOrUpdateAuthInfo(parentThis,authInfo);
		});
		
		//删除权限
		tbodyObj.find("a[name=deleteAuthInfo]").unbind("click").bind("click",function(){
			var trObj=$(this).parent().parent("tr[name=authInfo]");
			var authInfo={
					"latnId"		:	 	trObj.attr("latnId"),
					"authId"		:		trObj.attr("authId"),
					"authName"		:		trObj.attr("authName"),
			};
			parentThis.deleteAuthInfo(parentThis,authInfo);
		});
	},
	
	// 添加获取修改权限
	addOrUpdateAuthInfo:function(parentThis,authInfo){
		var html = [];
		html.push('<div class="tanchu_box" id="addOrUpdateAuthInfoPage"  style="width:600px;">');
		html.push('<h3>新增权限</h3>');
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>权限名称：</th>');         
		html.push('<td><input name="authName" type="text" class="w150"></td>');         
		html.push('<th><span style="color:red;">*</span>状态:</th> ');         
		html.push('<td><select name="authState" class="w160"> <option>选择</option></select></td>');         
		html.push('</tr>');         
		html.push('<tr>');         
		html.push('<th><span style="color:red;">*</span>权限类型：</th> ');         
		html.push('<td><select name="authType" class="w160"> <option>选择</option></select></td>');          
		html.push('<th><span style="color:red;">*</span>本地网:</th>');         
		html.push('<td><select name="latnId" class="w160"> <option>选择</option></select></td>');         
		html.push('</tr>');         
		html.push('<tr>');         
		html.push('<th>备注：</th>');         
		html.push('<td colspan="3"><textarea name="authDesc" cols="" rows="5" style="width:98%"  ></textarea></td>');         
		html.push('</tr>');         
		html.push('<tr> ');         
		html.push('<th></th> ');         
		html.push('<td colspan="3" style="text-align:center;">');         
		html.push('<a href="javascript:void(0)"  class="but" name="infoSubmit">提交</a>'); 
		if("add"==authInfo.type){
		html.push('<a href="javascript:void(0)"  class="but btn-success ml10" name="infoClear">清空</a>'); 
		}
		html.push('<a href="javascript:void(0)"  class="but hs_bg ml10"  name="infoClose">关闭</a>');         
		html.push('</td>');         
		html.push('</tr>');         
		html.push('</table>');         
		html.push('</div>');
		
		var authInfoPage = $.layer({
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
		var authInfoPageDiv=$("#addOrUpdateAuthInfoPage");

		//关闭
		authInfoPageDiv.find("a[name=infoClose]").unbind("click").bind("click",function(){
			layer.close(authInfoPage);
		});
		
		authInfoPageDiv.find("a[name=infoClear]").unbind("click").bind("click",function(){
			authInfoPageDiv.find('input[name=authName]').val(authInfo.authName);
			authInfoPageDiv.find("select[name=authState]").find("option[dicId='"+authInfo.authState+"']").attr("selected",true);
			authInfoPageDiv.find("select[name=authType]").find("option[dicId='"+authInfo.authType+"']").attr("selected",true);
			authInfoPageDiv.find("select[name=latnId]").find("option[latnId='"+authInfo.latnId+"']").attr("selected",true);
			authInfoPageDiv.find('textarea[name=authDesc]').val(authInfo.authDesc);
		});
		
		
		//初始化本地网
		var latnIdObj =authInfoPageDiv.find("select[name=latnId]");
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
		var authTypeObj = authInfoPageDiv.find("select[name=authType]");
		var param = {
					"dicType" 	: 		"authType"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					authTypeObj.html("");
					html.push('<option dicId ="">请选择</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					authTypeObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化状态
		var authStateObj =   authInfoPageDiv.find("select[name=authState]");
		var param = {
					"dicType" 	: 		"authState"				,
				};
		$.jump.ajax(URL_QUERY_DIC_DATA.encodeUrl(), function(json) {
			if(json.code == "0" ){
				if(json.dicSet.length > 0){
					var html = [];
					authStateObj.html("");
					html.push('<option dicId ="">请选择</option>');
					$.each(json.dicSet,function(i,obj){
						html.push('<option dicId = '+obj.dic_code+'>'+obj.dic_value+'</option>');
					});
					authStateObj.html(html.join(''));
				}
			};
		}, param, false,false);
		
		//初始化数据
		authInfoPageDiv.find('input[name=authName]').val(authInfo.authName);
		authInfoPageDiv.find("select[name=authState]").find("option[dicId='"+authInfo.authState+"']").attr("selected",true);
		authInfoPageDiv.find("select[name=authType]").find("option[dicId='"+authInfo.authType+"']").attr("selected",true);
		authInfoPageDiv.find("select[name=latnId]").find("option[latnId='"+authInfo.latnId+"']").attr("selected",true);
		authInfoPageDiv.find('textarea[name=authDesc]').val(authInfo.authDesc);
		
		//提交
		authInfoPageDiv.find("a[name=infoSubmit]").unbind("click").bind("click",function(){
			var authNameObj=authInfoPageDiv.find('input[name=authName]');
			var authName=authNameObj.val().trim();
			var authStateObj=authInfoPageDiv.find("select[name=authState]");
			var authState = authStateObj.find('option:selected').attr('dicId');
			var authTypeObj=authInfoPageDiv.find("select[name=authType]");
			var authType = authTypeObj.find('option:selected').attr('dicId');
			var latnIdObj=authInfoPageDiv.find("select[name=latnId]");
			var latnId = latnIdObj.find('option:selected').attr('latnId');
			var authDescObj=authInfoPageDiv.find('textarea[name=authDesc]');
			var authDesc=authDescObj.val().trim();
			
			//校验数据
			if(authName.length==0 || authState.length==0 || authType.length==0 || latnId.length==0 ){
				layer.alert("权限信息填写不完整 ",8);
				return false;
			}
			
			var param={
					"type"			:		authInfo.type,
					"authId"		:		authInfo.authId,
					"latnId"		:	 	latnId,
					"authName"		:		authName,
					"authDesc"		:		authDesc,
					"authState"		:		authState,
					"authType"		:		authType	
			};
			
			var confirm=layer.confirm('您是否确认提交？', function(){
				
				$.jump.ajax(URL_DEAL_AUTH_INFO.encodeUrl(), function(json) {
					if(json.code == "0" ){
						layer.close(confirm);
						layer.close(authInfoPage);
						parentThis.queryPageList(parentThis,0);
					}else{
						layer.msg("保存失败!");	
					};
				}, param, false,false);
			});
		});
	},
	//删除权限数据
	deleteAuthInfo:function(parentThis,authInfo){
		
		var checkParam={
				"type"		: 		"check",
				"authId"	:		authInfo.authId,
				"latnId"	:		authInfo.latnId
		};
		$.jump.ajax(URL_DELETE_AUTH_INFO.encodeUrl(), function(json) {
			if(json.code == "0" ){
				var content="";
				
				if(json.sum == "0"){
					content=authInfo.authName+"未使用,您确定是否删除？";
				}else{
					content=authInfo.authName+"使用中,删除后该权限则收回,您确定是否删除？";
				}
				var confirm=layer.confirm(content, function(){
					var deleteParam={
							"type"		: 		"delete",
							"authId"	:		authInfo.authId,
							"latnId"	:		authInfo.latnId,	
					}
					
					$.jump.ajax(URL_DELETE_AUTH_INFO.encodeUrl(), function(json) {
						if(json.code == "0" ){
							layer.close(confirm);
							parentThis.queryPageList(parentThis,0);
						}else{
							layer.alert("删除失败!");	
						}
					}, deleteParam, false,false);
				});
			}else{
				layer.alert("判断"+authInfo.authName+"是否正在使用异常!");	
			}
		}, checkParam, false,false);
	},
	
	/**权限分配*/
	dealAssignAuthInfo:function(parentThis,authInfo){
		var url='/web/html/sysManage/assignAuthInfo.html?authId='+authInfo.authId+'&authName='+authInfo.authName+'&authStateName='+authInfo.authStateName;
	
		var assignAuthInfoPage=$.layer({
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
};