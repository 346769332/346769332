var PolicyManualList = new Function();

PolicyManualList.prototype = {
	parentBody:null,	
	selecter : "#policyManualListPage",
	pageSize : 10,
	policyType:"",
	policyTypeName:"",
	policyTypeParam:null,
	policyTypeDParam:null,
	scroll:null,
	
	init : function(parentBody){
		this.parentBody =parentBody;
		this.policyType = common.utils.getHtmlUrlParam("policyType");
		var policyTypeName = common.utils.getHtmlUrlParam("policyTypeName");
		this.policyTypeName=decodeURI(policyTypeName);
		this.initPageData(this);
		this.bindMethod(this);
	},
    
	scrollRefresh:function(parentThis){
		if(null!=parentThis.scroll){
			parentThis.scroll.destroy();
			parentThis.scroll=null;
		}
		var scrollDivObj = "".findById("div", "scrollDiv",parentThis.parentBody)[0];
		scrollDivObj.height((document.documentElement.clientHeight-120)+"px");
		parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,
			function(){
			});
		parentThis.scroll.refresh();
	},
	
	bindMethod:function(parentThis){
		
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);
		}, false);
		
		"".findById("a", "backA", parentThis.parentBody)[0].unbind("click").bind("click",function(){
			navigator.app.backHistory();
		});
		
		"".findById("a", "homeEnvelope", parentThis.parentBody)[0].unbind("click").bind("click",function(){
			common.go.next("home.html");
		});
	},
	
	initPageData:function(parentThis){
		var headerObj="".findById("div", "header", parentThis.parentBody)[0];
		headerObj.find("#headerTitle").html(parentThis.policyTypeName);
		
		var policyTypeParam={
				"type"			:	"menu",
				"policyType"	:	parentThis.policyType
		 };
		parentThis.initDetailTypePage(parentThis,policyTypeParam,1);
	},
	
	initDetailTypePage:function(parentThis,policyTypeParam,pageIndex){
		parentThis.policyTypeParam=policyTypeParam;
		var footHtml=[];
		
		var param={
				"policyType"	:	 policyTypeParam.policyType,
				"pageIndex" 	:	 pageIndex,
				"pageSize" 		:	 parentThis.pageSize,
		};
		
		$.jump.ajax(URL_SEARCH_POLICY_MANUAL_TYPE_DETAIL_LIST, function(data) {
			if (data.code == 0) {
				if(null!=data.list && data.list.length==0){
					footHtml.push('<div   class="text-center" style="padding: 0;">');
					footHtml.push('<nav class="navbar navbar-static-top currbtn" role="orderList" style="margin-bottom: 0">');
					footHtml.push('<h3 class="text-center p-xs m-b-none">政策列表</h3>');
					footHtml.push('</nav>');
					footHtml.push('</div>');
					var footDivObj="".findById("div", "foot", parentThis.parentBody)[0];
					footDivObj.html(footHtml.join(''));
			   		parentThis.initInfoPage(parentThis,policyTypeParam,1);
			   		
					footDivObj.find("nav[role=orderList]").unbind().bind("click",function(){
						var contentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
						contentDivObj.html('');
						var policyTypeParam={
								"type"			:	"menu",
								"policyType"	:	parentThis.policyType
						 };
						parentThis.initInfoPage(parentThis,policyTypeParam,1);
					});
				}else{
					footHtml.push('<div class="col-xs-6 text-center" style="padding: 0;border-right: 2px solid #d1dade;">');
					footHtml.push('<nav class="navbar navbar-static-top currbtn" role="orderType"  style="margin-bottom: 0">');
					footHtml.push('<h3 class="text-center p-xs m-b-none">政策类型</h3>');
					footHtml.push('</nav>');
					footHtml.push('</div>');
					footHtml.push('<div   class="col-xs-6 text-center" style="padding: 0;">');
					footHtml.push('<nav class="navbar navbar-static-top" role="orderList" style="margin-bottom: 0">');
					footHtml.push('<h3 class="text-center p-xs m-b-none">政策列表</h3>');
					footHtml.push('</nav>');
					footHtml.push('</div>');
					var footDivObj="".findById("div", "foot", parentThis.parentBody)[0];
					footDivObj.html(footHtml.join(''));
					
					footDivObj.find("nav[role=orderType]").unbind().bind("click",function(){
						var contentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
						contentDivObj.html('');
						var nvaArr=footDivObj.find("nav");
						if(nvaArr.size()>0){
							$.each(nvaArr,function(){
								nvaArr.removeClass("currbtn");
							});
						}
						$(this).addClass("currbtn");
						var policyTypeParam={
								"type"			:	"menu",
								"policyType"	:	parentThis.policyType
						 };
						parentThis.initDetailTypePage(parentThis,policyTypeParam,1);
					});
					
					footDivObj.find("nav[role=orderList]").unbind().bind("click",function(){
						var contentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
						contentDivObj.html('');
						var nvaArr=footDivObj.find("nav");
						if(nvaArr.size()>0){
							$.each(nvaArr,function(){
								nvaArr.removeClass("currbtn");
							});
						}
						$(this).addClass("currbtn");
						var policyTypeParam={
								"type"			:	"menu",
								"policyType"	:	parentThis.policyType
						 };
						parentThis.initInfoPage(parentThis,policyTypeParam,1);
					});
					
					
					parentThis.createDetailTypeHtml(parentThis,data,pageIndex,parentThis.policyTypeParam);
				}
			} else {
				common.loadMsgDialog(common.showDialogDivObj, "消息提示", data.msg);
			}
		}, param, true,true);
	},

	createDetailTypeHtml:function(parentThis,data,pageIndex,policyTypeParam){
		
		var html=[];
		if(1==pageIndex){
			html.push('<table class="table" id="table">');
		}
		if(null!=data.list && data.list.length>0){
			$.each(data.list,function(i,obj){
				html.push('<tr name="collapseTypeD_'+pageIndex+'_'+i+'" >');
				html.push('<td style="vertical-align: middle;">');
				html.push(obj.policyTypeDName);
				html.push('<span name="policyTypeD" class="label label-primary pull-right">');
				html.push("&nbsp;[&nbsp;");
				html.push(obj.num);
				html.push("&nbsp;]&nbsp;&nbsp;");
				html.push('<i collapseId="collapseTypeD_'+pageIndex+'_'+i+'" name="policyTypeD" class="glyphicon glyphicon-chevron-down"  policyType="'+policyTypeParam.policyType+'"   policyTypeD="'+obj.policyTypeD+'" > </i>');
				html.push('</span>');
				html.push('</td>');
				html.push('</tr>');
			});
			if(data.list.length==parentThis.pageSize){
				html.push('<tr>');
				html.push('<td style="text-align:center;vertical-align: middle;">');
				html.push('<a name="detailTypepageContorlA"   policyType="'+policyTypeParam.policyType+'"   pageIndex="'+(pageIndex+1)+'" style="background:none;font-size: 12px;color: blue;text-decoration: underline;" href="javascript:void(0);" >更多</a>');
				html.push('</td>');
				html.push('</tr>');
			}
		}
		var contentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
		if(1==pageIndex){
			html.push('</table>');
			contentDivObj.html(html.join(''));
		}else{
			contentDivObj=parentContentDivObj.find('table[name=table]') ;
			contentDivObj.append(html.join(''));
		}
		
		parentThis.scrollRefresh(parentThis);
		
		var liTimer=null;
		contentDivObj.find('i[name=policyTypeD]').parent("span[name=policyTypeD]").parent("td").parent("tr").unbind("click").bind("click",function(){
			
			var iObj=$(this).children().children().children("i[name=policyTypeD]");
			var policyType=iObj.attr("policyType");
			var policyTypeD=iObj.attr("policyTypeD");
			var divId=iObj.attr("collapseId");
			var collapseId=iObj.attr("collapseId");
			var policyTypeDParam={
					"type"			:	"D"	,
					"divId"			:	divId,
					"policyTypeD"	:	policyTypeD,
					"policyType"	:	policyType
			 };
			if(liTimer) {
		          window.clearTimeout(liTimer);
		          liTimer = null;
		      }
			liTimer = window.setTimeout(function(){
				if(iObj.hasClass("glyphicon-chevron-down")){
					var upArr=contentDivObj.find('i[name=policyTypeD][class*=glyphicon-chevron-up]');
					if(upArr.size()>0){
						$.each(upArr,function(i,obj){
							var id=$(this).attr("collapseId");
							if(id!=collapseId){
								$(this).parent("span[name=policyTypeD]").parent("td").parent("tr").click();
							}
						});
					}
					if(contentDivObj.find('tr[id=info_'+divId+']').size()==0){
						parentThis.initInfoPage(parentThis,policyTypeDParam,1);
					}else{
						contentDivObj.find('tr[id=info_'+divId+']').show();
						parentThis.scrollRefresh(parentThis);
					}
					iObj.removeClass("glyphicon-chevron-down");
					iObj.addClass("glyphicon-chevron-up");
				}else{
					iObj.removeClass("glyphicon-chevron-up");
					iObj.addClass("glyphicon-chevron-down");
					contentDivObj.find('tr[id="info_'+divId+'"]').hide();
					parentThis.scrollRefresh(parentThis);
				}
			  }, 300);
		});
		contentDivObj.find('a[name=detailTypepageContorlA]').parent("td").parent("tr").unbind("click").bind("click",function(){
			var pageContorlA=$(this).children().children();
			var  pageIndex=pageContorlA.attr("pageIndex");
			var policyType=pageContorlA.attr("policyType");
			$(this).remove();
			var policyTypeParam={
					"policyType"	:	policyType
			 };
			 parentThis.initDetailTypePage(parentThis,policyTypeParam,parseInt(pageIndex));
		});
	},
	
	initInfoPage:function(parentThis,policyTypeDParam,pageIndex){
		parentThis.policyTypeDParam=policyTypeDParam;
		
		var param={
				"policyType"	:	 policyTypeDParam.policyType,
				"policyTypeD"	:	 policyTypeDParam.policyTypeD,
				"pageIndex" 	:	 pageIndex,
				"pageSize" 		:	 parentThis.pageSize,
		};
		
		$.jump.ajax(URL_SEARCH_POLICY_MANUAL_INFO_LIST, function(data) {
			
			if (data.code == 0) {
				parentThis.createInfoHtml(parentThis,data,pageIndex,parentThis.policyTypeDParam);
			} else {
				common.loadMsgDialog(common.showDialogDivObj, "消息提示", data.msg);
			}
		}, param, true,true);
	},
	
	createInfoHtml:function(parentThis,data,pageIndex,policyTypeDParam){
		
		var html=[];
		var divId=policyTypeDParam.divId;
		var type=policyTypeDParam.type;
		if(pageIndex==1 ){
			if("menu"==type){
				html.push('<table class="table" name="infoTable">');
			}
		}
		if(null!=data.list && data.list.length>0){
			$.each(data.list,function(i,obj){
				html.push('<tr id="info_'+divId+'">');
				html.push('<td style="padding:0px;vertical-align: middle;">');
				html.push('<ul>');
				html.push('<li class="list-group-item t_left" style="border:0px;margin:0px;">');
				html.push('<div class="checkbox ">');
				html.push('<img  src="'+obj.policyPicture+'" style="float:right;width:50px;max-height:50px;"/>');
				html.push('<span class="h3_title" style="float:right;margin-right:3px;">'+obj.createTime+'</span>');
				html.push('<h3 class="h3_title">'+obj.optName+'</h3>');
				html.push('<p class="p_content" name="p_content" pmId="'+obj.id+'" style="margin-top:5px;" name="policyTheme" >'+obj.policyTheme+'</p>');
				html.push('</div>');
				html.push('</li>');
				html.push('</ul>');
				html.push('</td>');
				html.push('</tr>');
			});
			if(data.list.length==parentThis.pageSize){
				html.push('<tr id="info_'+divId+'">');
				html.push('<td  style="text-align:center;vertical-align: middle;">');
				html.push('<a name="infopageContorlA" type="'+policyTypeDParam.type+'"  divId="'+divId+'"  policyType="'+policyTypeDParam.policyType+'"  policyTypeD="'+policyTypeDParam.policyTypeD+'"   pageIndex="'+(pageIndex+1)+'" style="background:none;font-size: 12px;color: blue;text-decoration: underline;" href="javascript:void(0);">更多</a>');
				html.push('</td>');
				html.push('</tr>');
			}
		}
		if(pageIndex==1 ){
			 if("menu"==type){
				html.push('</table>');
				html.push('<br/>');
				html.push('<br/>');
				html.push('<br/>');
				html.push('<br/>');
				html.push('<br/>');
			}
		}
		var parentContentDivObj="".findById("div", "contentDiv", parentThis.parentBody)[0];
		var contentDivObj=parentContentDivObj.find("tr[name="+divId+"]");
		if("D"==type){
			if(pageIndex==1){
				contentDivObj.after(html.join(''));
			}else{
				contentDivObj=parentContentDivObj.find('tr[id=info_'+divId+']:last') ;
				contentDivObj.after(html.join(''));
			}
		}
		if("menu"==type){
			if(pageIndex==1){
				parentContentDivObj.html(html.join(''));
			}else{
				contentDivObj=parentContentDivObj.find('table[name=infoTable]') ;
				contentDivObj.append(html.join(''));
			} 
		}
		parentThis.scrollRefresh(parentThis);
		
		parentContentDivObj.find('p[name=p_content]').parent("div").unbind("click").bind("click",function(){
			var pObj=$(this).children('p[name=p_content]');
			var url="policyManualInfo.html?pmId="+pObj.attr("pmId");
			common.go.next(url);
		});
		
		parentContentDivObj.find('a[name=infopageContorlA]').parent("td").parent("tr").unbind("click").bind("click",function(){
			var pageContorlA=$(this).children().children();
			var  pageIndex=pageContorlA.attr("pageIndex");
			var policyType=pageContorlA.attr("policyType");
			var policyTypeD=pageContorlA.attr("policyTypeD");
			if(undefined==policyTypeD || "undefined"==policyTypeD ||common.utils.isNull(policyTypeD)){
				policyTypeD="";
			}
			var divId=pageContorlA.attr("divId");
			$(this).remove();
			var policyTypeDParam={
					"type"			:	type,
					"divId"			:	divId,
					"policyType"	:	policyType,
					"policyTypeD"	:	policyTypeD
			 };
			parentThis.initInfoPage(parentThis,policyTypeDParam,parseInt(pageIndex));
		});
	}
};
$(document).ready(function(){
	var policyManualList  =new PolicyManualList();
	policyManualList.init($(this));
});