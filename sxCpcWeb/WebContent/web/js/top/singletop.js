var Top1 = new Function();
Top1.prototype = {
	
	selecter : "#pageTopDiv",
	
	topMenu1 : null,
	
	regionCode : null,
	
	contentDiv : null,
	
	init : function(contentDiv){
		this.contentDiv = contentDiv;
		this.loadStaffOrg();
		//this.windows_close();
	},
	bindMethod : function(){
		debugger;
		var parentThis = this;
		//加载menuHtml
		var pageTopMenuObj = $("#pageTopMenu");//parentThis.selecter.findById("div", "pageTopMenu")[0];
		$.jump.loadHtmlForFun("/web/html/menu/singlemenu.html".encodeUrl(),function(menuHtml){
			debugger;
			pageTopMenuObj.html(menuHtml);
			parentThis.topMenu = new TopMenu1();
			parentThis.topMenu.init(parentThis.contentDiv);
		});
		//退出
		var loginOutObj = parentThis.selecter.findById("a", "loginOut")[0];
		loginOutObj.unbind("click").bind("click",function(){
			debugger
			parentThis.gotoLoginOut();
			
			var optParam = {
					"funId" : "index",
					"optFrom" : "PC",
					"optAttr" : "LOGINOUT"
				};
			var index = new CenterIndex1();
			index.saveOptInfo(optParam);
			
			$.jump.ajax(URL_LOGOUT.encodeUrl(), function(data) {
				location.href=CTX+'/web/login.html';
				return;
		    }, null,true,false);
		});
		
	},
	//加载组织结构
	loadStaffOrg : function(){
		debugger;
		var parentThis = this;
		$.jump.ajax(URL_QRY_STAFFORG.encodeUrl(), function(data) {
			debugger;
			parentThis.regionCode=data.region_code;
			if(data.noOrg){
				layer.alert("您暂无组织机构，无法操作请联系管理员");
				$("#pageTopDiv").find("div[name=topInfo]").html('<span class="cRed" name="userName">'+data.userName+'</span><a href="#" id="loginOut"><img src="images/ico3.png" alt=""></a>');
				
				//退出
				var loginOutObj = parentThis.selecter.findById("a", "loginOut")[0];
				loginOutObj.unbind("click").bind("click",function(){
					
					parentThis.gotoLoginOut();
					$.jump.ajax(URL_LOGOUT.encodeUrl(), function(data) {
						location.href=CTX+'/web/login.html';
						return;
				    }, null,false,false);
				});
				return false;
			}
			var isShow = data.isShow;
 			$("#pageTopDiv").find("div[name=topInfo]").html(''+data.region_name+'--'+data.orgName+':<span class="cRed" name="userName">'+data.userName+'</span><a href="#" id="loginOut"><img src="images/ico3.png" alt=""></a>');
			if(isShow){
				var html = [];
				html.push('<table width="95%" border="0" cellspacing="1" cellpadding="8" bgcolor="#ccc" style="margin:auto" class="table1 yj">');
				html.push('<tr bgcolor="#ebebeb" align="center">');
				html.push('<th width="50%">组织ID</th>');
				html.push('<th width="50%">组织名称</th>');
	            html.push('</tr>');
	            $.each(data.staffLst, function(i, obj) {
	    			html.push('<tr bgcolor="#FFFFFF" class="staffInfo" name="interOrgInfo" interOrgId="'+obj.org_id+'"align="center" >');
	    			html.push('<td width="50%"><img src="images/ll.png"></img>'+obj.org_id+'</th>');
	    			html.push('<td width="50%">'+obj.org_name+'</th>');
	                html.push('</tr>');
	            });
	            html.push('</table>');
				em.showDialog("dialog_showStaff","组织选择",html.join(""),true,false,false,600,400);
				
				 $("#dialog_showStaff").find("tr[name=interOrgInfo]").unbind("click").bind("click",function(){
		            	var param = {
		        				"interOrgId"		: $(this).attr("interOrgId")
		        		};
		            	$.jump.ajax(URL_QRY_STAFFORG.encodeUrl(), function(data) {
		            		alert(JSON.stringify(data));
		            		$("#pageTopDiv").find("div[name=topInfo]").html(''+data.region_name+'--'+data.orgName+':<span class="cRed" name="userName">'+data.userName+'</span><a href="#" id="loginOut"><img src="images/ico3.png" alt=""></a>');
		            		em.hideDialog("dialog_showStaff");
		            		parentThis.bindMethod();
		            	},param,false);
		            });
			}else{
				parentThis.bindMethod();
			}
    }, null,false,false);
	},
	
	gotoLoginOut : function(){
		
		var param = {
				"loginState":"N",
				"handleType":"updateLoginState"
		};
		$.jump.ajax(URL_LOGIN_RANDOM.encodeUrl(), function(data) {
			
		}, param, false,false);
	},
	
};

