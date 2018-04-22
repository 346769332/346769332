var DistalRepertory = new Function();
DistalRepertory.prototype = {
	selecter : "#distalRepertory",
	// 初始化执行
	init : function(param) {
		this.paramInfo=param;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		$.jump.ajax(URL_QUERY_CURRENTLOGIN_BELONGTO.encodeUrl(), function(json) {
			var staffId=json.staffId;
			var staffName=json.staffName;
			var orgName=json.orgName;
			var mobtel=json.mobtel;
			var orgId=json.orgId;
			$("#releasePersonId").val(staffId);
			$("#releasePersonName").val(staffName);
			$("#releaseDeptName").val(orgName);
			$("#releaseDeptId").val(orgId);
			$("#releasePersonNum").val(mobtel);
		}, null, false,false);
		//查询支局名称
		$.jump.ajax(URL_QUERY_SUBOFFICENAME.encodeUrl(), function(json) {
			if(json.code=="0"){
				var dataList=json.data;
				var subofficeNameObj =  parentThis.selecter.findById("select","subofficeName")[0];
				parentThis.createHtml(parentThis,dataList,subofficeNameObj);
			}
		}, null, false,false);
		var subofficeNameObj = parentThis.selecter.findById("select","subofficeName")[0];
		subofficeNameObj.bind("change",function(){
			var centerRepositoryName=$(this).find("option:selected").attr("centerRepositoryName");
			$("#centerRepositoryName").val(centerRepositoryName);
		});
		//选择物料
		$("#chooseMaterial").bind("click",function(){
			parentThis.createMaterialHtml(parentThis);
		});
		//删除物料
		$("#delete").bind("click",function(){
			var checkboxObj=$("#materialInfo").find("tr:not(:first)").find("td:eq(0)").find("input[type='checkbox']:checked");
			if(checkboxObj.length==0){
				layer.alert("请选中要删除的物料!",8);
			}else{
				var confirm=layer.confirm('您确认要删除吗？', function(){
					checkboxObj.parent().parent().remove();
					layer.close(confirm);
				});
			}
		});
		//选中所有的物料
		$("#all").bind("click",function(){
			if($(this).prop("checked")){
				$("input[type='checkbox'][name='materialCheckbox']").prop("checked",true);
			}else{
				$("input[type='checkbox'][name='materialCheckbox']").prop("checked",false);
			}
		});
		//发起需求
		$("#submit").bind("click",function(){
			var tr01Obj=$("#materialInfo").find("tr:eq(1)");
			if(tr01Obj.length==0){
				layer.alert("请选择物品!");
				return false;
			}
			var flag=true;
			var tdObj=$("#materialInfo").find("tr:not(:first)").find("td:eq(5)");
			$.each(tdObj,function(i,obj){
				var materialNum=$(this).find("input[name='materialNum']").val();
				if(materialNum==""){
					flag=false;
					return false;
				}
			});
			if(flag==false){
				layer.alert("请填写物品数量");
				return false;
			}
			/******************************************需求信息***************************************************/
			var workflowName=$("#workflowName").val();
			var workflowId=parentThis.paramInfo.workflowId;
			//发单人id
			var releasePersonId=$("#releasePersonId").val();
			var releasePersonName=$("#releasePersonName").val();
			var releasePersonNum=$("#releasePersonNum").val();
			//发单人部门id
			var releaseDeptId=$("#releaseDeptId").val();
			var releaseDeptName=$("#releaseDeptName").val();
			//支局id
			var subofficeId=$("#subofficeName").find("option:selected").attr("value");
			//支局名称
			var subofficeName=$("#subofficeName").find("option:selected").attr("subofficeName");
			//所属中心库名称
			var centerRepositoryName=$("#subofficeName").find("option:selected").attr("centerRepositoryName");
			var remark=$("#remark").val();
			/******************************************需求信息***************************************************/
			
			/******************************************物料信息***************************************************/
			var tdsObj=$("#materialInfo").find("tr:not(:first)");
			var materialIds="";
			var materialCounts="";
			$.each(tdsObj,function(){
				var materialId=$(this).find("td:eq(0)").find("input[type='hidden']").val();
				var materialCount=$(this).find("td:eq(5)").find("input[name='materialNum']").val();
				materialIds+=materialId+",";
				materialCounts+=materialCount+",";
			});
			materialIds=materialIds.substring(0, materialIds.length-1);
			materialCounts=materialCounts.substring(0, materialCounts.length-1);
			
			/******************************************物料信息***************************************************/
			var distalParam={
					"workflowId"				:		workflowId,
					"workflowName"				:		workflowName,
					"releasePersonId"			:		releasePersonId,
					"releasePersonName"			:		releasePersonName,
					"releasePersonNum"			:		releasePersonNum,
					"releaseDeptId"				:		releaseDeptId,
					"releaseDeptName"			:		releaseDeptName,
					"subofficeId"				:		subofficeId,
					"subofficeName"				:		subofficeName,
					"centerRepositoryName"		:		centerRepositoryName,
					"remark"					:		remark,
					"materialIds"				:		materialIds,
					"materialCounts"			:		materialCounts
			};
			//末梢库存需求发起
			$.jump.ajax(URL_ADD_DISTALREPERTORITY.encodeUrl(), function(json) {
				if(json.code=="0"){
					layer.alert("发起成功!",9);
					$.jump.loadHtmlForFun("/web/html/shortProcess/demandList.html".encodeUrl(), function(menuHtml){
						$('#content').html(menuHtml);
						var demandList=new DemandList();
						demandList.init();
					});
				}
			}, distalParam, false,false);
			
		});

	},
	createHtml:function(parentThis,dataList,subofficeNameObj){
		var html = [];
		if(dataList.length > 0 ){
			html.push("<option value=''></option>");
			$.each(dataList,function(i,obj){
				html.push("<option value='"+obj.SUBOFFICE_ID+"' centerRepositoryName='"+obj.CENTER_REPOSITORY_NAME+"' subofficeName='"+obj.SUBOFFICE_NAME+"'>"+obj.SUBOFFICE_NAME+"</option>");
			});
		}
		subofficeNameObj.html(html.join(''));
	},
	createMaterialHtml : function(parentThis){
		var html = [];
		html.push('<div class="tanchu_box" id="materialListPage" style="width:850px;height:550px">');
		html.push('<h3>物料选择</h3>');
		html.push('<div class="seach-box mt20" align="center">');
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li>物料名称：<input type="text" name="materialName" class="w130"></li>');
		html.push('<li>物料编码：<input type="text" name="materialCode" class="w130"></li>');
		html.push('<li>物料类型：<select class="w150">');
		html.push('<option></option>');
		html.push('<option>猫</option>');
		html.push('<option>机顶盒</option>');
		html.push('<option>悦Me盒子</option>');
		html.push('<option>装维材料</option>');
		html.push('</select></li>');
		html.push('</ul>');
		html.push('</div>');
		
		html.push('<div  align="center">');
		
		html.push('<ul class="hx-list  clearfix">');
		html.push('<li><a href="#" class="but ml20" name="senior">查询</a></li>');
		html.push('<li><a href="#" class="but ml20" name="reset">重置</a></li>');
		html.push('</ul>');
		html.push('</div>');
		
		
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');         
		html.push('<th style="text-align:center">物料编码</th>');         
		html.push('<th style="text-align:center;width:20%">物料名称</th>');         
		html.push('<th style="text-align:center">物料规则型号</th>');         
		html.push('<th style="text-align:center">物料类型</th> '); 
		html.push('<th style="text-align:center;width:15%"">操作</th> '); 
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody name="materialListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" name="materialListFoot"></div>');
		html.push('<br/>');
		html.push('<div style="text-align:center;">');
		html.push('<a href="#" class="but ml20" name="back">返回</a></div>');
		html.push('</div>');
		
		var materialListPage = $.layer({
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
		
		parentThis.materialListPage=materialListPage;
		var materialListPageDiv = $("#materialListPage");
		
		var seniorObj = materialListPageDiv.find("a[name=senior]");
		seniorObj.unbind("click").bind("click",function(){
			parentThis.queryMaterialList(parentThis);
		});
		var resetObj = materialListPageDiv.find("a[name=reset]");
		resetObj.unbind("click").bind("click",function(){
			$("input[name=materialName]").val("");
			$("input[name=materialCode]").val("");
			$("select").val("");
		});
		var backObj = materialListPageDiv.find("a[name=back]");
		backObj.unbind("click").bind("click",function(){
			layer.close(parentThis.materialListPage);
		});
//		var confirmObj = materialListPageDiv.find("a[name=confirm]");
//		confirmObj.unbind("click").bind("click",function(){
//			
//		});
		
		parentThis.queryMaterialList(parentThis);
	},
	queryMaterialList : function(parentThis) {
		var tr01Obj=$("#materialInfo").find("tr:eq(1)");
		var materialIds="";
		if(tr01Obj.length>0){
			var tdObj=$("#materialInfo").find("tr").find("td:eq(0)");
			$.each(tdObj,function(i,obj){
				var materialId=$(this).find("input[type='hidden']").val();
				materialIds+=materialId+",";
			});
		}
		materialIds=materialIds.substring(0, materialIds.length-1);
		
		var materialListPageDiv = $("#materialListPage");
		var materialNameObj = materialListPageDiv.find("input[name=materialName]");
		var materialCodeObj = materialListPageDiv.find("input[name=materialCode]");
		var materialType = materialListPageDiv.find("select option:selected").val();
		var pageIndex = 0;
		var pageSize = 5;
		var param = {
				"materialName" : materialNameObj.val(),
				"materialCode" : materialCodeObj.val(),
				"materialType" : materialType
		};
		var materialListFootObj = materialListPageDiv.find("div[name=materialListFoot]");
		debugger;
		common.pageControl.start(URL_QUERY_MATERIALLIST.encodeUrl(),
								 pageIndex,
								 pageSize,
								 param,
								 "data",
								 null,
								 materialListFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = materialListPageDiv.find("tbody[name=materialListBody]");
			listBodyObj.html("");
			parentThis.createMaterialListHtml(parentThis,data,listBodyObj,materialIds);
		});
	},
	//显示数据
	createMaterialListHtml : function(parentThis,data,listBodyObj,materialIds) {
		var tr01Obj=$("#materialInfo").find("tr:eq(1)");
		var materialIds="";
		if(tr01Obj.length>0){
			var tdObj=$("#materialInfo").find("tr").find("td:eq(0)");
			$.each(tdObj,function(i,obj){
				var materialId=$(this).find("input[type='hidden']").val();
				materialIds+=materialId+",";
			});
		}
		materialIds=materialIds.substring(0, materialIds.length-1);
		var html=[];
		var dataLst = data.data;
		var materialListPageDiv = $("#materialListPage");
		var listFootObj = materialListPageDiv.find("div[name=materialListFoot]");
		if(dataLst.length > 0 ){
			listFootObj.show();
			$.each(data.data,function(i,obj){
				html.push('<tr>');
				html.push('<td >'+obj.MATERIAL_CODE+'</td>');
				html.push('<td >'+obj.MATERIAL_NAME+'</td>');
				html.push('<td >'+obj.MATERIAL_KIND+'</td>');
				html.push('<td >'+obj.MATERIAL_TYPE+'</td>');
				html.push('<td>');
				if(materialIds.indexOf(obj.MATERIAL_ID)>=0){
					html.push('<a href="#" class="but hs_bg"  materialId="'+obj.MATERIAL_ID+'" materialCode="'+obj.MATERIAL_CODE+'" materialName="'+obj.MATERIAL_NAME+'" materialKind="'+obj.MATERIAL_KIND+'" materialType="'+obj.MATERIAL_TYPE+'">添加</a>');
				}else{
					html.push('<a href="#" class="but" name="addMaterial" materialId="'+obj.MATERIAL_ID+'" materialCode="'+obj.MATERIAL_CODE+'" materialName="'+obj.MATERIAL_NAME+'" materialKind="'+obj.MATERIAL_KIND+'" materialType="'+obj.MATERIAL_TYPE+'">添加</a>');
				}
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
		$("#materialListPage").find("a[name=addMaterial]").unbind("click").bind("click",function(){
			var tr01Obj=$("#materialInfo").find("tr:eq(1)");
			var materialId=$(this).attr("materialId");
			var materialCode=$(this).attr("materialCode");
			var materialName=$(this).attr("materialName");
			var materialKind=$(this).attr("materialKind");
			var materialType=$(this).attr("materialType");
			
			var str="<tr>";
			str+='<td align="center"><input type="checkbox" name="materialCheckbox"><input type="hidden" value="'+materialId+'"></td>';
			str+='<td align="center">'+materialCode+'</td>';
			str+='<td align="center">'+materialName+'</td>';
			str+='<td align="center">'+materialKind+'</td>';
			str+='<td align="center">'+materialType+'</td>';
			str+='<td align="center" style="width:100px"><input type="text" id="materialNum"  name="materialNum"/></td>';
			str+='<td align="center"><a href="#" class="but" id="deleteOne" materialId="'+materialId+'">删除</a></td>';
			str+='</tr>';
			if(tr01Obj.length==0){
				$("#materialInfo").append(str);
			}else{
				tr01Obj.before(str);
			}
			$(this).unbind("click");
			$(this).addClass("but hs_bg");
			$("#materialInfo").find("a[id=deleteOne]").unbind("click").bind("click",function(){
				$(this).parent().parent().remove();
			});
			$("#materialNum").blur(function(){
				var materialNum=$(this).val();
				materialNum=materialNum.replace(/\s/g,"");
				var reg=/^[1-9][0-9]*$/;
				if(materialNum!=""){
					if(!reg.test(materialNum)){
						layer.alert("请填写正整数!");
						$(this).val("");
						return false;
					}
				}
			});
		});
	}
};