var ReleaseArea=new Function();

ReleaseArea.prototype={
		selector : "#releaseAreaPageDiv",
		pmId:"", 
		allSet:[],
		useSet:[],
		initSet:[],
		opt:null,
		latnId:"",
		init : function(){
			var parentThis = this ; 
			parentThis.pmId=common.utils.getHtmlUrlParam("pmId"); 
			parentThis.initPageInfoData(parentThis);
			parentThis.bindMethod(parentThis);
		} ,
		
		//绑定方法
		bindMethod : function(parentThis) {
			//关闭
			var closeBtnObj =parentThis.selector.findById("a","closeBtn")[0];
			closeBtnObj.unbind("click").bind("click",function(){
				var i = parent.layer.getFrameIndex();
				parent.layer.close(i);
			});
			
			//保存按钮
			var saveBtnObj =parentThis.selector.findById("a","saveBtn")[0];
			saveBtnObj.unbind("click").bind("click",function(){
				var releaseStr="";
				if(parentThis.latnId=='888' && parentThis.useSet.length==parentThis.allSet.length){
					releaseStr="宁夏全区";
				}else{
					$.each(parentThis.useSet,function(i,obj){
						
						if("PROV"==obj.type){
							releaseStr+=obj.prov_name;
						}else if("LATN"==obj.type){
							releaseStr+=obj.latn_name;
						}
						if(i!=parentThis.useSet.length-1){
							releaseStr+=",";
						}
					});
				}
				$("#release",window.parent.document).val(releaseStr);
				window.parent.useSet=parentThis.useSet;
				window.parent.allSet=parentThis.allSet;
				window.parent.latnId=parentThis.latnId;
				closeBtnObj.click();
			});
		},
		
		//初始化页面数据
		initPageInfoData:function(parentThis){
			
			parentThis.allSet=[];
			parentThis.useSet=[];
			parentThis.initSet=[];
			var releaseSet=window.parent.useSet;
			var allAreaSet=window.parent.allSet;
			parentThis.latnId=window.parent.latnId;
			if( null!=releaseSet && "null"!=releaseSet  && !common.utils.isNull(releaseSet)){
				$.each(allAreaSet,function(i,obj){
					parentThis.allSet.push(obj);
				});
				$.each(releaseSet,function(i,obj){
					parentThis.useSet.push(obj);
					parentThis.initSet.push(obj);
				});
				parentThis.initAllAreaUl(parentThis);
				parentThis.initUseAreaUl(parentThis);
			}else{
				var param={
						"pmId"		:	parentThis.pmId,
				};
				$.jump.ajax(URL_QUERY_AREA.encodeUrl(), function(json) {
					
					if(json.code == "0"){
						parentThis.latnId=json.latn_id;
						if(null!=json.allAreaList && json.allAreaList.length>0){
							$.each(json.allAreaList,function(i,obj){
								parentThis.allSet.push(obj);
							});
						}
						if(null!=json.useAreaList && json.useAreaList.length>0){
							$.each(json.useAreaList,function(i,obj){
								parentThis.useSet.push(obj);
								parentThis.initSet.push(obj);
							});
						}
						parentThis.initAllAreaUl(parentThis);
						parentThis.initUseAreaUl(parentThis);
					}else{
						layer.alert("获取区域数据异常",8);
					};
				}, param, true,false);
				
			}
		},
		initAllAreaUl:function(parentThis){
			var html=[];
			var provSet=[];
			var latnSet=[];
			var areaSet=[];
			$.each(parentThis.allSet,function(i,obj){
				var count=0;
				if(obj.level==2){
					var provObject={
							"type"		:	"PROV"	,
							"code"		:	obj.p_code,
							"name"		:	obj.p_name,
					};
					count=0;
					$.each(provSet,function(i,object){
						if(object.code==provObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						provSet.push(provObject);
					}
					
					var latnObject={
							"type"		:	"LATN"	,
							"code"		:	obj.area_code,
							"name"		:	obj.area_name,
							"p_code"	:	obj.p_code
					};
					
					count=0;
					$.each(latnSet,function(i,object){
						if(object.code==latnObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						latnSet.push(latnObject);
					}
				}else if(obj.level==3){
					var areaObject={
							"type"		:	"AREA"	,
							"code"		:	obj.area_code,
							"name"		:	obj.area_name,
							"p_code"	:	obj.p_code,
					};
					
					count=0;
					$.each(areaSet,function(i,object){
						if(object.code==areaObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						areaSet.push(areaObject);
					}
				}
			});
			$.each(provSet,function(i,prov){
				
				var provStyle='';
				var provFlag="true";
				$.each(parentThis.useSet,function(j,obj){
					if(prov.type==obj.type && prov.code==obj.prov){
						provStyle='style="display:none;"';
						provFlag="false";
						return false;
					}
				});
				if(parentThis.useSet.length<parentThis.allSet.length){
					provStyle='';
				}
				html.push('<li showFlag="'+provFlag+'"  '+provStyle+' class="cur">');
				html.push('<a   class="cur" nameLable="provA" type="'+prov.type+'" code="'+prov.code+'" name="'+prov.name+'"    href="javascript:void(0)">'+prov.name+'</a>');
				html.push('<ul nameLable="latnUl_'+prov.code+'" style="display:block;">');
				$.each(latnSet,function(i,latn){
					
					if(prov.code==latn.p_code){
						var latnStyle='';
						var latnFlag="true";
						$.each(parentThis.useSet,function(j,obj){
							if(latn.type==obj.type && latn.code==obj.latn){
								latnStyle='display:none;';
								latnFlag="false";
							}
						});
						if(provFlag=="false"){
							latnFlag="false";
						}
						html.push('<li showFlag="'+latnFlag+'"  style="display: list-item;'+latnStyle+'">');
						html.push('<a nameLable="latnA" type="'+latn.type+'" code="'+latn.code+'" name="'+latn.name+'"   href="javascript:void(0)">'+latn.name+'</a>');
						html.push('</li>');
					};
				});
				html.push('</ul>');
				html.push('</li>');
			});
			var firstDivObj=parentThis.selector.findById("div","first")[0];
			firstDivObj.find("ul[name=allAreaUl]").html(html.join('')); 
			
			
			var provAArr=firstDivObj.find("ul[name=allAreaUl]").find("a[nameLable=provA]");
			$.each(provAArr,function(i,obj){
				var liObj=$(this).parent("li");
				if(liObj.find("li[showFlag=true]").size()==0){
					liObj.hide();
				}
			});
			
			var allLatnTimer = null;
			firstDivObj.find("ul[name=allAreaUl]").find("a[nameLable=latnA]").unbind("click").bind("click",function(){
				var liObj=$(this).parent("li");
				if(allLatnTimer) {
			          window.clearTimeout(allLatnTimer);
			          allLatnTimer = null;
			      }
				allLatnTimer = window.setTimeout(function(){
						if(liObj.children("a").hasClass("cur")){
							liObj.children("a").removeClass("cur");
							liObj.children("ul").slideUp("fast");
						}else{
							liObj.parent("ul").children("li").children("a").removeClass("cur");
							liObj.children("a").addClass("cur");
							liObj.children("ul").slideDown("fast");
							liObj.siblings().children("ul").slideUp("fast");
						}
			      }, 300);
			});
			
			var allProvTimer=null;
			firstDivObj.find("ul[name=allAreaUl]").find("a[nameLable=provA]").unbind("click").bind("click",function(){
				var liObj=$(this).parent("li");
				if(allProvTimer) {
			          window.clearTimeout(allProvTimer);
			          clickTimer = null;
			      }
				allProvTimer = window.setTimeout(function(){
						if(liObj.children("a").hasClass("cur")){
							liObj.children("a").removeClass("cur");
							liObj.children("ul").slideUp("fast");
						}else{
							liObj.parent("ul").children("li").children("a").removeClass("cur");
							liObj.children("a").addClass("cur");
							liObj.children("ul").slideDown("fast");
							liObj.siblings().children("ul").slideUp("fast");
						}
			      }, 300);
			});
			
			if(parentThis.latnId=='888'){
				firstDivObj.find("ul[name=allAreaUl]").find("a[nameLable=provA]").unbind("dblclick").bind("dblclick",function(){
					var provAobj=$(this);
					var info={
							"type"		:	provAobj.attr("type"),
							"prov"		:	provAobj.attr("code"),
							"prov_name"	:	provAobj.attr("name"),
							"latn"		:	"",
							"latn_name"	:	"",
							"area"		:	"",
							"area_name"	:	""
					};
					parentThis.setUseSet(parentThis,info,"add");
				});
			}
			
			
			firstDivObj.find("ul[name=allAreaUl]").find("a[nameLable=latnA]").unbind("dblclick").bind("dblclick",function(){
				var latnAObject=$(this);
				var provAobj=$(this).parent("li").parent("ul").prev("a");
				var info={
						"type"		:	latnAObject.attr("type"),
						"prov"		:	provAobj.attr("code"),
						"prov_name"	:	provAobj.attr("name"),
						"latn"		:	latnAObject.attr("code"),
						"latn_name"	:	latnAObject.attr("name"),
						"area"		:	"",
						"area_name"	:	""
				};
				parentThis.setUseSet(parentThis,info,"add");
			});
		},
		initUseAreaUl:function(parentThis){
			var html=[];
			var provSet=[];
			var latnSet=[];
			var areaSet=[];
			$.each(parentThis.allSet,function(i,obj){
				var count=0;
				if(obj.level==2){
					var provObject={
							"type"		:	"PROV"	,
							"code"		:	obj.p_code,
							"name"		:	obj.p_name,
					};
					count=0;
					$.each(provSet,function(i,object){
						if(object.code==provObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						provSet.push(provObject);
					}
					var latnObject={
							"type"		:	"LATN"	,
							"code"		:	obj.area_code,
							"name"		:	obj.area_name,
							"p_code"	:	obj.p_code
					};
					
					count=0;
					$.each(latnSet,function(i,object){
						if(object.code==latnObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						latnSet.push(latnObject);
					}
				}else if(obj.level==3){
					var areaObject={
							"type"		:	"AREA"	,
							"code"		:	obj.area_code,
							"name"		:	obj.area_name,
							"p_code"	:	obj.p_code
					};
					
					count=0;
					$.each(areaSet,function(i,object){
						if(object.code==areaObject.code){
							count++;
							return false;
						}
					});
					if(count==0){
						areaSet.push(areaObject);
					}
				}
			});
			$.each(provSet,function(i,prov){
				
				var provStyle='style="display:none;"';
				var provFlag="false";
				$.each(parentThis.useSet,function(j,obj){
					if(prov.type==obj.type && prov.code==obj.prov){
						provStyle='';
						provFlag="true";
					}else if( prov.code==obj.prov) {
						provStyle='';
					}
				});
				html.push('<li showFlag="'+provFlag+'"  '+provStyle+'>');
				html.push('<a  class="cur" nameLable="provA" type="'+prov.type+'" code="'+prov.code+'" name="'+prov.name+'"    href="javascript:void(0)">'+prov.name+'</a>');
				html.push('<ul nameLable="latnUl_'+prov.code+'" style="display:block;">');
				$.each(latnSet,function(i,latn){
					if(prov.code==latn.p_code){
						var latnStyle='display:none;';
						var latnFlag=provFlag;
						$.each(parentThis.useSet,function(j,obj){
							if(latn.type==obj.type && latn.code==obj.latn){
								latnStyle='';
								latnFlag="true";
							}else if(latn.code==obj.latn){
								latnStyle='';
							}
						});
						if(provFlag=="true"){
							latnStyle='';
							latnFlag="true";
						}
						html.push('<li showFlag="'+latnFlag+'"  style="display: list-item;'+latnStyle+'">');
						html.push('<a nameLable="latnA" type="'+latn.type+'" code="'+latn.code+'" name="'+latn.name+'"   href="javascript:void(0)">'+latn.name+'</a>');
						html.push('</li>');
					};
				});
				html.push('</ul>');
				html.push('</li>');
			});
			var secondDivObj=parentThis.selector.findById("div","second")[0];
			secondDivObj.find("ul[name=useAreaUl]").html(html.join(''));
			
			var useLatnTimer = null;
			secondDivObj.find("ul[name=useAreaUl]").find("a[nameLable=latnA]").unbind("click").bind("click",function(){
				var liObj=$(this).parent("li");
				if(useLatnTimer) {
			          window.clearTimeout(useLatnTimer);
			          clickTimer = null;
			      }
				useLatnTimer = window.setTimeout(function(){
						if(liObj.children("a").hasClass("cur")){
							liObj.children("a").removeClass("cur");
							liObj.children("ul").slideUp("fast");
						}else{
							liObj.parent("ul").children("li").children("a").removeClass("cur");
							liObj.children("a").addClass("cur");
							liObj.children("ul").slideDown("fast");
							liObj.siblings().children("ul").slideUp("fast");
						}
			      }, 300);
			});
			
			var useProvTimer=null;
			secondDivObj.find("ul[name=useAreaUl]").find("a[nameLable=provA]").unbind("click").bind("click",function(){
				var liObj=$(this).parent("li");
				if(useProvTimer) {
			          window.clearTimeout(useProvTimer);
			          clickTimer = null;
			      }
				useProvTimer = window.setTimeout(function(){
						if(liObj.children("a").hasClass("cur")){
							liObj.children("a").removeClass("cur");
							liObj.children("ul").slideUp("fast");
						}else{
							liObj.parent("ul").children("li").children("a").removeClass("cur");
							liObj.children("a").addClass("cur");
							liObj.children("ul").slideDown("fast");
							liObj.siblings().children("ul").slideUp("fast");
						}
			      }, 300);
			});
			
			if(parentThis.latnId=="888"){
				secondDivObj.find("ul[name=useAreaUl]").find("a[nameLable=provA]").unbind("dblclick").bind("dblclick",function(){
					var provAobj=$(this);
					var info={
							"type"		:	provAobj.attr("type"),
							"prov"		:	provAobj.attr("code"),
							"prov_name"	:	provAobj.attr("name"),
							"latn"		:	"",
							"latn_name"	:	"",
							"area"		:	"",
							"area_name"	:	""
					};
					parentThis.setUseSet(parentThis,info,"delete");
				});
			}
			
			secondDivObj.find("ul[name=useAreaUl]").find("a[nameLable=latnA]").unbind("dblclick").bind("dblclick",function(){
				var latnAObject=$(this);
				var provAobj=$(this).parent("li").parent("ul").prev("a");
				var info={
						"type"		:	latnAObject.attr("type"),
						"prov"		:	provAobj.attr("code"),
						"prov_name"	:	provAobj.attr("name"),
						"latn"		:	latnAObject.attr("code"),
						"latn_name"	:	latnAObject.attr("name"),
						"area"		:	"",
						"area_name"	:	""
				};
				parentThis.setUseSet(parentThis,info,"delete");
			});
		},
		
		//设置已选资源
		setUseSet:function(parentThis,areaInfo,type){
			parentThis.opt=areaInfo;
			
			if("add"==type){
				 if(areaInfo.type=="PROV" || areaInfo.type=="LATN" ){
					var delArr=[];
					 $.each(parentThis.useSet,function(i,obj){
							 if(areaInfo.type=="PROV" && areaInfo.prov==obj.prov){
								 delArr.push(i);
							 }else if(areaInfo.type=="LATN" && areaInfo.latn==obj.latn){
								 delArr.push(i);
							 }
						});
					 	delArr=delArr.reverse();
						$.each(delArr,function(i,obj){
							 parentThis.useSet.remove(obj);
						});
					 
					 $.each(parentThis.allSet,function(i,obj){
						 var tempObj=obj;
						 if(tempObj.level=="2"){
							 tempObj={};
							 tempObj.type="LATN";
							 tempObj.prov=obj.p_code;
							 tempObj.prov_name=obj.p_name;
							 tempObj.latn=obj.area_code;
							 tempObj.latn_name=obj.area_name;
							 tempObj.area="";
							 tempObj.area_name="";
						 }else if (tempObj.level=="3"){
							 tempObj={};
							 tempObj.type="AREA";
							 tempObj.prov="";
							 tempObj.prov_name="";
							 tempObj.latn=obj.p_code;
							 tempObj.latn_name=obj.p_name;
							 tempObj.area=obj.area_code;
							 tempObj.area_name=obj.area_name;
						 }
						 if(areaInfo.type=="PROV" && areaInfo.prov==tempObj.prov){
							 tempObj.prov=areaInfo.prov;
							 tempObj.prov_name=areaInfo.prov_name;
							 parentThis.useSet.push(tempObj); 
						 }else if (areaInfo.type=="LATN" && tempObj.type=="LATN" && areaInfo.latn==tempObj.latn){
							 tempObj.prov=areaInfo.prov;
							 tempObj.prov_name=areaInfo.prov_name;
							 parentThis.useSet.push(tempObj); 
						 }
					 });
				 }else{
					 parentThis.useSet.push(areaInfo);
				 }
			}else if("delete"==type){
				var delArr=[];
				$.each(parentThis.useSet,function(i,obj){
					if(areaInfo.type=="PROV"){
						 if(areaInfo.prov==obj.prov)
							 delArr.push(i);
					 }else if(areaInfo.type=="LATN"){
						 if((areaInfo.latn==obj.latn)||(obj.type=="PROV" && areaInfo.prov==obj.prov))
							 delArr.push(i);
					 }else if(areaInfo.type=="AREA"){
						 if((areaInfo.area==obj.area)||(obj.type=="LATN" && areaInfo.latn==obj.latn)||(obj.type=="PROV" && areaInfo.prov==obj.prov))
						 delArr.push(i);
					 }
				});
				delArr=delArr.reverse();
				$.each(delArr,function(i,obj){
					 parentThis.useSet.remove(obj);
				});
			}
			parentThis.initUseAreaUl(parentThis);
			parentThis.initAllAreaUl(parentThis);
		}
};
$(document).ready(function(){
	var releaseArea = new ReleaseArea();
	releaseArea.init();
});