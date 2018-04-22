
var common = {
		/**初始启动common空间*/
		init:function(){
			common.loadLodding();
		},
		exec : null,
		execGap: function(succ,fail,gap,action,jsonArray){
			if(!common.exec){
				common.exec = cordova.require('cordova/exec');
			}
			common.exec(succ,fail,gap,action,jsonArray);
		},
		jsessionid : null,
		setJsessionid : function(sessionId){
			common.jsessionid = sessionId;
		},
		isAndroid : false,
		go : {
			next : function(path){
				
				
				var idx = path.indexOf("?");
				var firstUrl = idx == "-1" ? path : path.substr(0,idx);
				var param = idx == "-1" ? "" : "&"+ path.substr(idx+1,path.length);
				var newURl = firstUrl +"?jsessionid="+common.jsessionid+param;

				if(navigator.app)
					window.location.href = "./"+newURl;
				//navigator.app.loadUrl("file:///android_asset/www/html/"+path);
				else
					window.location.href = "./"+newURl;
			},
			back : function(){
				
				if(navigator.app){
					var ua = navigator.userAgent.toLowerCase();  
					if (/iphone|ipad|ipod/.test(ua)) {       
					  history.go(-1);
					} else if (/android/.test(ua)) {   
					  navigator.app.backHistory() ;
					}else{
						history.go(-1);
					}
				}else{
					history.go(-1);
				}
			}
		},
		addScroll : function(myscorll,scrollBodyObj,onScrollEndCall){
			if(!common.utils.isNull(myscorll))
				return myscorll;
			var spanVal = 0;
			myscorll = new iScroll(scrollBodyObj.get(0), {
				scrollbarClass: 'myScrollbar', /* 重要样式 */
				useTransition: false, /* 此属性不知用意，本人从true改为false */
				onTouchEnd: function () {
					var newSpan = (this.y - this.maxScrollY);
					if (newSpan <= 0 && newSpan != spanVal) {   
						spanVal = (this.y - this.maxScrollY);
						onScrollEndCall();
		            }  
				},
				onBeforeScrollStart: function (e) { 
					var target = e.target; 
					while (target.nodeType != 1) target = target.parentNode; 
					if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') 
						e.preventDefault(); 
				} 
			});
			return myscorll;
		},
		loadMsgDialog: function(parentObj,dialogTitle,dialogMsg,hideFun,newButtonHtml){
			var myModalDIV = "".findById("div","myModal_1",parentObj)[0];
			var dialogTitleObj = "".findById("h4","dialogTitle",myModalDIV)[0];
			dialogTitleObj.html(dialogTitle);
			var dialogMsgObj = "".findById("div","dialogMsg",myModalDIV)[0];
			dialogMsgObj.html(dialogMsg);
			myModalDIV.modal('toggle');
			myModalDIV.on('hide.bs.modal', function () {
				 if(hideFun)
					 hideFun();
			});
			
			var newButtonDiv = "".findById("div","myModel_newButton",myModalDIV)[0];
			if(newButtonDiv && newButtonHtml){
				newButtonDiv.html("");
				newButtonDiv.html(newButtonHtml);
			}
		},
		/**退出*/
		loginOut : function(){
			window.location.href = "./login.html";
		},
		showMsgHtml : function(state,msg){
			
			
			var imgPath = "";
			switch(state){
				case "success":
					imgPath = "/web/images/ico5.png".encodeUrl();
					break;
				case "faild": 
					imgPath = "/web/images/ico6.png".encodeUrl();
					break;
			}
			var html = "<img src='"+imgPath+"'/>";
			html += "<span>"+msg+"</span>";
			
			return html;
		},
		/*********************************************
		 * 常用：
		 * 1数字校验
		 * 2克隆
		 * 3是否包含样式
		 * 4获取html中属性
		 * 5.空判断
		 * ******************************************/
		utils : {
			//keyPress事件[数字校验]
			keyPress : function() {  
			    var keyCode = event.keyCode;  
			    if ((keyCode >= 48 && keyCode <= 57) || keyCode == 8 || (keyCode >= 96 && keyCode <= 105))  
			    {  
			        event.returnValue = true;  
			    } else {  
			        event.returnValue = false;  
			    }  
			},
			clone : function(param){
				var newObj = {};
				for(var item in param){  
					newObj[item] = param[item];
				} 
				return newObj;
			},
			hasStyle : function(jqObj,key){
				var style = jqObj.attr("style");
				if(typeof(style) != "undefined" && style.indexOf(key)>=0){
					return true;
				}
				return false;
			},
			/*获取html传参值*/
			getHtmlUrlParam : function(key){
				var uri = window.location.search;
		        var re = new RegExp(""+key+"=([^&?]*)", "ig");
		        return ((uri.match(re))?(uri.match(re)[0].substr(key.length+1)):null); 
			},
			//空判断
			isNull : function (str) {
				if(null != str && typeof(str) != 'undefined' && '' != str){
					return false;
				}
//				if(common.getVarType(str) == 'array' && str.length>0){
//					return false;
//				}
//				if(common.getVarType(str) == 'object'){
//					return false;
//				}
				return true;
			},
			nullReturn : function(str,resultInfo){
				
				if(common.utils.isNull(str)){
					return resultInfo;
				}
				return str;
			}
		},
		
		/******************************************
		 * selecterObj 添加到父级对象
		 * dialogId 被添加的对话框ID
		 * innerHtml 对话框显示内容
		 * param 对话框执行属性
		 * initPageFun 初始化页面后执行
		 * buttons 添加下面的button事件
		 * ***************************************/
		dialog : function(selecterObj,dialogId,innerHtml,param,initPageFun,buttons){
						
			var dialogObj = $("#"+dialogId);
			
			if(!dialogObj || typeof(dialogObj) == "undefined" || dialogObj.size() == 0){
				var loadHtml = '<div id="'+dialogId+'" align="center" title="Basic modal dialog">'+'</div>';
				selecterObj.append(loadHtml);
			}else{
				if(dialogObj.html() == "" && "" != innerHtml)
					dialogObj.html(innerHtml);
				if(param.isOpen)
					dialogObj.dialog('open');
				else
					dialogObj.dialog('close');
				// 触发初始化
				if(typeof(initPageFun) !="undefined")
					initPageFun(dialogObj);
				
				return;
			}
			
			dialogObj = "".findById("div",dialogId,selecterObj)[0];
			dialogObj.html(innerHtml);
			
			if(typeof(initPageFun) !="undefined")
				initPageFun(dialogObj);
			
			dialogObj.dialog({
				title	: param.title,
				autoOpen: param.isOpen, 
				width  	: param.width,
				height 	: param.height,
				modal  	: true,
				buttons	: buttons
			});
		},
		/****************************************************
		 * 日期处理
		 ***************************************************/
		date : {
			/*
			 * 获取两日期间天数
			 * */
			countDay : function (a,b){
				a = a.replace("-","/");
				b = b.replace("-","/");
			    var aDate = new Date(a);
			    var bDate = new Date(b);
			    var dif = bDate.getTime() - aDate.getTime();
			    var day = Math.floor(dif / (1000 * 60 * 60 * 24));
			    return day;
			},
			/*
			 * 获取当前日期[删除]
			 * */
			nowDate : function (formatStr) { 
				
				var formats = null;
				if(typeof(formatStr) != "undefined" && "" != formatStr){
					formats = formatStr.split(" ");
				}
				
		        var now = new Date();
		       
		        var year = now.getFullYear();       //年
		        var month = now.getMonth() + 1;     //月
		        var day = now.getDate();            //日
		       
		        var hh = now.getHours();            //时
		        var mm = now.getMinutes();          //分
		       
		        var clock = year + "-";
		       
		        if(month < 10)
		            clock += "0";
		       
		        clock += month + "-";
		        
		        if(day < 10)
		            clock += "0";
		        clock += day;
		        if(null != formats && formats.length>1){
		        	clock += " ";
			        if(hh < 10)
			            clock += "0";
			        clock += hh + ":";
			        if (mm < 10) clock += '0'; 
			        clock += mm; 
		        }
		        
		        return(clock); 
		    } ,
		    /*
		     * 根据类型获取日期段
		     * */
			getDayByType : function(date,type){
				var day = "";
				switch(type){
					case "year" :
						day = date.getFullYear();
						break;
					case "month" :
						day = date.getMonth()+1;
						break;
					case "date" :
						day = date.getDate();
						break;
				}
				
				return day;
			},
			/*
			 * 日期加几天
			 * */
			addDay : function(ds,count) {  
			    // 参数表示在当前日期下要增加的天数  
				ds = ds.replace("-","/");
			    var date = new Date(ds);
			    // + 1 代表日期加，- 1代表日期减  
			    date.setDate(date.getDate() + count);  
			    var year = date.getFullYear();  
			    var month = date.getMonth() + 1;  
			    var day = date.getDate();  
			    if (month < 10) {  
			        month = '0' + month;  
			    }  
			    if (day < 10) {  
			        day = '0' + day;  
			    }  
			
			    return year + '-' + month + '-' + day;  
			}
		},
		/*******************************************************************
		 * 【日期控件组件】
		 * 1初始化
		 * 2调用
		 * *****************************************************************/
		datepicker : {
			/*日期控件*/
			datepickerConfig : function(minDate,maxDate,onSelectMethod){
				var yearFrom=new Date().getYear()-60+1900;
		        var yearTo=new Date().getYear()-18+1900;      
		        var config = {  
			       dateFormat: 'yy-mm-dd',
			       numberOfMonths: 2,
			       showButtonPanel: false,
			       yearRange: yearFrom+':'+yearTo,
			       clearText:'清除',
			       closeText:'关闭',
			       prevText:'前一月',
			       nextText:'后一月',
			       currentText:' ',
			       monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
			       minDate: minDate, 
			       maxDate: maxDate,
			       onSelect : function(selectDate){
			    	   if(onSelectMethod && typeof(onSelectMethod) != "undefined"){
			    		   onSelectMethod(selectDate);
			    	   }
			       }
		        };
		        return config;
			},
			/*
			 * 创建日期控件
			 * innDateId   开始时间
			 * outDateId   结束时间
			 * defalutShow 默认显示：true,false
			 */
			initDatepicker : function(innDate,outDate,defalutShow){
				
				var nowDate  = common.nowDate("yyyy-MM-dd");
				var nextDate = common.addDay(nowDate,1);
				//初始化
				if(defalutShow){
					innDate.val(nowDate);
					outDate.val(nextDate);
				}
		 		//控件
				innDate.datepicker(common.datepickerConfig("","",function(){
					var count = common.countDay(innDate.val(),outDate.val());
					outDate.datepicker('option', 'minDate', common.addDay(innDate.val(),1));
					if(count<0){
						outDate.val(common.addDay(innDate.val(),1));
					}
				})); 
				outDate.datepicker(common.datepickerConfig("","",function(){
				})); 
				outDate.datepicker('option', 'minDate', nextDate);
			}
		},
		
		/*******************************************************************
		 * 【分页控件】
		 * url 		: 请求地址。
		 * pageIndex: 请求页开始值。
		 * pageSize	: 请求一页大小。
		 * param 	： 查询条件。
		 * dataSetName: 后台返回的集合名词
		 * data		: 集合对象名称【实际分页可为空，逻辑分页必须存在】
		 * pageUl	： 显示页面分页控件
		 * pageType	: 页面分页类型：logic 逻辑分页
		 * showTbodyHtml : 显示分页结果执行function
		 * ****************************************************************/
		pageControl : {
			start : function(url,pageIndex,pageSize,param,dataSetName,data,pageUl,pageType,showTbodyHtml){
				
				if(common.utils.isNull(pageIndex))
					pageIndex = 0;
				if(common.utils.isNull(pageSize))
					pageSize = 0;
				var limit = pageIndex*pageSize;
				var maxLt = limit + pageSize;
				
				param["limit"] 		= limit;
				param["pageSize"] 	= pageSize;
				param["setName"] 	= dataSetName;
				
				var dataSet = (data && typeof(data[dataSetName]) == "Array") ? data[dataSetName] : null;
				
				var dataSpan = null != dataSet ? dataSet.slice(limit,maxLt) : null;
				if(dataSpan && dataSpan.length>0){
					dataSpan = common.pageControl.searchLogicPages(dataSet,param);
					var showDataSpan = dataSpan.slice(limit,maxLt);
					//显示结果集
					showTbodyHtml(data,dataSetName,showDataSpan);
					//显示分页控件
					common.pageControl.showPageButton(pageUl,pageIndex,dataSpan.length,pageSize,function(index){
						common.pageControl.start(url,index,pageSize,param,dataSetName,data,pageUl,pageType,showTbodyHtml);
					});
				}else{
					param["pageSize"] 	= pageType == "logic" ? 9999 : pageSize;
					if(!common.utils.isNull(url)){
						$.jump.ajax(url, function(data) { 
							if(!data.totalSize) alert("无法显示分页控件，请在分页请求后台配置“totalSize”参数!");
							common.pageControl.firstShowData(url,limit,maxLt,param,data,dataSetName,data.totalSize,pageType,pageUl,pageSize,pageIndex,showTbodyHtml);
						},param,true);
					}else{
						common.pageControl.firstShowData(url,limit,maxLt,param,data,dataSetName,dataSet.length,pageType,pageUl,pageSize,pageIndex,showTbodyHtml);
					}
				}
			},
			//首次查询
			firstShowData : function(url,limit,maxLt,param,data,dataSetName,totalSize,pageType,pageUl,pageSize,pageIndex,showTbodyHtml){
				
				var dataSet = data[dataSetName];
				//显示结果集
				dataSpan = dataSet.slice(limit,maxLt);
				showTbodyHtml(data,dataSetName,dataSpan);
				//显示分页控件
				common.pageControl.showPageButton(pageUl,pageIndex,totalSize,pageSize,function(index){
					
					common.pageControl.start(url,index,pageSize,param,dataSetName,data,pageUl,pageType,showTbodyHtml);
				});
			},
			/*逻辑查找*/
			searchLogicPages : function(dataSet,param){
				var resultSet = [];
				
				$.each(dataSet,function(){
					var data = this;
					var bool = true;
					for(var item in param){  
						if(typeof param[item]  == 'string'
							&& data[item]){
							if(data[item].indexOf(param[item])<0 && param[item] != ""){
								bool = false;
								break;
							}
					    }
					}  
					if(bool){
						resultSet.push(data);
					}
				});
				
				return resultSet;
			},
			/*绘制分页按钮*/
			showPageButton : function(parentObject,index,totalSize,pageSize,callFun){
				var pageCount = Math.ceil(totalSize/pageSize);
				var rightExp = parseInt(index)-4;
				var leftExp  = parseInt(index)+4;
				var pagesHtml = '<a id="prev" href="javascript:void(0)" title="">&lt;</a>';
				var isOmissionMin = false,isOmissionMax = false;
				var pageSet = new Array(pageCount);
				$.each(pageSet,function(i){
					if(i == index){
						pagesHtml += '<a id="pageA'+i+'" index="'+i+'" href="javascript:void(0)" title="" class="curr">'+(i+1)+'</a>';
					}else if(i == 0 ){
						pagesHtml += '<a id="pageA'+i+'" index="'+i+'" href="javascript:void(0)" title="">'+(i+1)+'</a>';
					}else if(i == (pageSet.length-1)){
						pagesHtml += '<a id="pageA'+i+'" index="'+i+'" href="javascript:void(0)" title="">'+(i+1)+'</a>';
					}else if(i < rightExp && !isOmissionMin){
						isOmissionMin = true;
						pagesHtml += '  ...  ';
					}else if(i > leftExp && !isOmissionMax){
						isOmissionMax = true;
						pagesHtml += '  ...  ';
					}else if(i >= rightExp && i <= leftExp){
						pagesHtml += '<a id="pageA'+i+'" index="'+i+'" href="javascript:void(0)"  title="">'+(i+1)+'</a>';
					}
				});
				pagesHtml += '<a id="next" href="javascript:void(0)" title="">&gt;</a>';
	
				parentObject.html(pagesHtml);
				
				//设置事件
				var pageASet = "".findById("a", "^pageA", parentObject);
				$.each(pageASet,function(){
					var index = this.attr("index");
					this.unbind().bind("click",function(){
						
						if(!common.utils.isNull(callFun)){
							callFun(index);
						}
					});
				});
				
				//设置上下页
				"".findById("a", "prev", parentObject)[0].unbind().bind("click",function(){
					
					if(index == 0) return;
					callFun(parseInt(index)-1);
				});
				"".findById("a", "next", parentObject)[0].unbind().bind("click",function(){
					
					if(index == (pageSet.length-1)) return;
					callFun(parseInt(index)+1);
				});
			}
		},
		/*******************************************************************
		 * 【按钮选择控件】
		 * 选中
		 * 初始化创建
		 * 激发事件
		 *******************************************************************/
		choiceBtn : {
			/*创建选择控件html*/
			createBtnHtml : function(btnId,className,textVal,param){
				var paramHtml = '';
				for(var x in param){
					paramHtml += x + '="' + param[x] +'" ';
				}
				var html = '<a id="'+btnId+'" '+paramHtml+' class="'+className+'" initClass="'+className+'">'+textVal+'</a>';
				return html;
			},
			/*选择按钮事件 **/
			evtChoiceBtn : function(btnSet){
				$.each(btnSet,function(){
					this.unbind().bind("click",function(){
						if($(this).attr("class") == "defaultBack"){
							$(this).attr("class",$(this).attr("initClass"));
						}else{
							$(this).attr("class","defaultBack");
						}
					});
				});
			},
			/*获取选中的按钮*/
			getChoiceBtn	: function(btnSet){
				var supperSet = [];
				$.each(btnSet,function(){
					if($(this).attr("class") == $(this).attr("initClass")){
						supperSet.push($(this));
					}
				});
				return supperSet;
			}
		},
		loadLodding : function(){
			
			var loadHtml = '<div id="dialog-modal" align="center" title="Basic modal dialog">'
						+'<img src="../images/elements/loaders/7.gif" style="float: left;width:100%;height:15px; margin: 6px 0px 0px 0px;" alt="">'
						+'</div>';
			
			$(document.body).append(loadHtml);	
			
			$('#dialog-modal').dialog({
				closeOnEscape: false,
				width: 180,
				height: 90,
				resizable: false,
				draggable: false,
				modal: true,
				title: "lodding...",
				//隐藏默认的关闭按钮
				open: function (event, ui) {
					$(".ui-dialog-titlebar-close", $(this).parent()).hide();
				}
			});
		},
		//显示等待loadding
		loadding : function(status){
			
			if(status == "open"){
				$("#lockScreen").show();
			}else{
				$("#lockScreen").hide();
			}
		}
};

/*var goLogin = {
	ajax : function(url, callbackName, data, asyn, isMask, errorFun) {
		if (data == null) data = {};
		$.ajax({
			url : url,
			async : asyn == null ? true : asyn,
			contentType : "application/x-www-form-urlencoded;charset=utf-8",
			dataType : "json",
			type : "POST",
			data : data,
			cache : false,
			success : function(json) {
				// 如果没有登录,则返回登录页面
				try {
					if (json.ajaxRetCode != null
							&& json.ajaxRetCode == '0') {
						if (json.showTip == '1') {
							alert(json.message);
						}
						if (json.appId == '708') {
							//location.href = '/SaleWeb/www/html/login.html';
						} else {
							window.location.href = json.authUrl;
						}
						return;
					}
				} catch (e) {
				}

				if (callbackName != undefined && callbackName != "") {
					callbackName(json);
				}
			},
			error : function(xhtp, err) {
				*//** 异常回调 *//*
				if (errorFun != undefined && errorFun != null
						&& errorFun != "") {
					errorFun();
					return;
				}
				var alertMessage = '请求内部异常';
				alert(alertMessage);
			}
		});
	}
};

*/

/**自定义选择器*/
String.prototype.findById =  function(dom,Id,parent){
	var objArr = [];
	
	var selecter = $(this.toString());
	
	if(parent && null != parent){
		selecter = parent;
	}
	
	//如果为空，则表示使用筛选器。
	if(dom == ""){
		dom = Id;
	}
	
	//左边匹配
	var leftMatch = false;
	if(Id.indexOf("^") == 0){
		Id = Id.replace("^","");
		leftMatch = true;
	}
	
	$.each(selecter.find(dom),function(){
		
		if(this.id == Id 
				|| dom == Id
				|| (leftMatch && this.id.indexOf(Id)==0)){
			objArr.push($(this));
		}
	});
	
	return objArr;
};

//根据上下文获取绝对地址
String.prototype.encodeUrl = function(){
	
	return CONTEXT+this;
};


String.prototype.trim = function() 
{ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
} 

String.prototype.lTrim = function() 
{ 
	return this.replace(/(^\s*)/g, ""); 
} 

String.prototype.rTrim = function() 
{ 
	return this.replace(/(\s*$)/g, ""); 
} 


Array.prototype.remove = function(index){
	if(index<0)
		return this;
	else
		return this.splice(index,1); 
};

Date.prototype.pattern=function(fmt) {           
    var o = {           
    "M+" : this.getMonth()+1, //月份           
    "d+" : this.getDate(), //日           
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时           
    "H+" : this.getHours(), //小时           
    "m+" : this.getMinutes(), //分           
    "s+" : this.getSeconds(), //秒           
    "q+" : Math.floor((this.getMonth()+3)/3), //季度           
    "S" : this.getMilliseconds() //毫秒           
    };           
    var week = {           
    "0" : "/u65e5",           
    "1" : "/u4e00",           
    "2" : "/u4e8c",           
    "3" : "/u4e09",           
    "4" : "/u56db",           
    "5" : "/u4e94",           
    "6" : "/u516d"          
    };           
    if(/(y+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));           
    }           
    if(/(E+)/.test(fmt)){           
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);           
    }           
    for(var k in o){           
        if(new RegExp("("+ k +")").test(fmt)){           
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));           
        }           
    }           
    return fmt;           
};   

//文字无限扩展tab切换
function selectTag(showContent,selfObj){
	var tag = document.getElementById("tags").getElementsByTagName("li");
	var taglength = tag.length;
	for(i=0; i<taglength; i++){
		tag[i].className = "";
	}
	selfObj.parentNode.className = "hover";
	for(i=0; j=document.getElementById("tagContent"+i); i++){
		j.style.display = "none";
	}
	document.getElementById(showContent).style.display = "block";
}



//滑动菜单
$( ".sidebar li" ).hover(
 function() {
    $(this).find("a").css("color","#FFF");
    $(this).find("span").stop().animate({
     width:"100%",
    opacity:"1",
    }, 600, function () {
    })
  }, function() {
     $(this).find("a").css("color","#555");
      $(this).find("span").stop().animate({
     width:"0%",
    opacity:"0",
    }, 600, function () {
    })
 }
);


//文字无限扩展tab切换
function selectTag(showContent,selfObj){
	var tag = document.getElementById("tags").getElementsByTagName("li");
	var taglength = tag.length;
	for(i=0; i<taglength; i++){
		tag[i].className = "";
	}
	selfObj.parentNode.className = "hover";
	for(i=0; j=document.getElementById("tagContent"+i); i++){
		j.style.display = "none";
	}
	document.getElementById(showContent).style.display = "block";
}

function selectTag1(showContent,selfObj){
	var tag = document.getElementById("tags").getElementsByTagName("li");
	var taglength = tag.length;
	for(i=0; i<taglength; i++){
		tag[i].className = "";
	}
	selfObj.parentNode.className = "hover";
	for(i=3; j=document.getElementById("tagContent"+i); i++){
		j.style.display = "none";
	}
	document.getElementById(showContent).style.display = "block";
}

//隐藏菜单
$(".showmenu").hover(
	function(){
		$("#tab1").show();
	},
	function(){
		$("#tab1").hide();	
	}
);
//初始化 sessionId
$(document).ready(function(){
	common.setJsessionid(common.utils.getHtmlUrlParam("jsessionid"));
});
//滑动菜单
$( ".sidebar li" ).hover(
 function() {
    $(this).find("a").css("color","#FFF");
    $(this).find("span").stop().animate({
     width:"100%",
    opacity:"1",
    }, 600, function () {
    })
  }, function() {
     $(this).find("a").css("color","#555");
      $(this).find("span").stop().animate({
     width:"0%",
    opacity:"0",
    }, 600, function () {
    })
 }
);