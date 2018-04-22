
var common = {
		/**初始启动common空间*/
		init:function(){
			common.loadLodding();
		},
		/**退出*/
		loginOut : function(){
			
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
			},
			returnStr:function(str){
				if(common.utils.isNull(str)){
					return "";
				}
				return str;
			},
			//获取字符串中的数字
			getNumber:function(text){
				var value= text.replace(/[^0-9]/ig,"");
				return Number(value);
			},
			jsonPush : function(param,subParam){
				for(var item in subParam){  
					param[item] = subParam[item];
				} 
				return param;
			},//获取字符串中的数字
			getNumber:function(text){
				var value= text.replace(/[^0-9]/ig,"");
				return Number(value);
			},
			cutstr : function(str, len) {  
				   if (str == null || str == "") {
					   return "";
				   }
				  	var str_length = 0;  
				  	var str_len = 0;  
				  	str_cut = new String();  
				  	str_len = str.length;  
				      for(var i = 0;i<str_len;i++){  
				      	a = str.charAt(i);  
				          str_length++;  
				          if(escape(a).length > 4){  
				           //中文字符的长度经编码之后大于4  
				          	str_length++;  
				          }  
				          str_cut = str_cut.concat(a);  
				          if(str_length>=len){  
				          	str_cut = str_cut.concat("...");  
				           return str_cut;  
				          }  
				      }  
				      //如果给定字符串小于指定长度，则返回源字符串；  
				      if(str_length<len){  
				      	return  str;  
				      }  
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
			    day += 1;
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
			},
			
			/**
			 * 当前时间:含时分秒
			 */
			yearAfterNowTime:function(){
				var date = new Date();
				var currYear = date.getFullYear()+1;
				var month = date.getMonth() + 1 ;
				var	currMonth= month< 10 ? "0" + month: month;
				var currDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				//this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
				var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				return currYear+"-"+currMonth+"-"+currDate+" "+hour+":"+minute+":"+second;
			},
			/**
			 * 当前时间:含时分秒
			 */
			maxTime:function(){ 
				return "9999-12-31 23:59:59";
			},
			/**
			 * 当前时间:含时分秒
			 */
			nowTime:function(){
				var date = new Date();
				var currYear = date.getFullYear()+1;
				var month = date.getMonth() + 1 ;
				var	currMonth= month< 10 ? "0" + month: month;
				var currDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				//this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
				var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				return currYear+"-"+currMonth+"-"+currDate+" "+hour+":"+minute+":"+second;
			},
			/**
			 * 当前时间:不含年
			 */
			nowTimeNotYear:function(){
				var date = new Date();
//				var currYear = date.getFullYear();
				var month = date.getMonth() + 1 ;
				var	currMonth= month< 10 ? "0" + month: month;
				var currDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
				//this.day = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")[date.getDay()];
				var hour = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
				var minute = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
				var second = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
				return currMonth+""+currDate+""+hour+""+minute+""+second;
			},
			//时间比较：格式yyyy-MM-dd
			compareDate:function(date1, date2) {
			    var arr = date1.split("-");
			    var starttime = new Date(arr[0], arr[1], arr[2]);
			    var starttimes = starttime.getTime();

			    var arrs = date2.split("-");
			    var lktime = new Date(arrs[0], arrs[1], arrs[2]);
			    var lktimes = lktime.getTime();

			    if (starttimes >= lktimes) {
			        return false;
			    } else{
			    	return true;
			    }
			},
			//时间比较：yyyy-MM-dd hh:mm:ss 
			compareTime:function(time1,time2){
				var beginTimes = time1.substring(0, 10).split('-');
			    var endTimes = time2.substring(0, 10).split('-');

			   var beginTime = beginTimes[1] + '-' + beginTimes[2] + '-' + beginTimes[0] + ' ' + time1.substring(10, 19);
			   var endTime = endTimes[1] + '-' + endTimes[2] + '-' + endTimes[0] + ' ' + time2.substring(10, 19);
			   
			    var a = (Date.parse(endTime) - Date.parse(beginTime)) / 3600 / 1000;
			    if (a < 0) {
			        return false;
			    } else if (a >= 0) {
			    	return  true;
			    }  
			},
			/*
			 * 计算时间差
			 * */
			diffDateTimeReturnStr : function (a,b){
				a = a.replace("-","/");
				b = b.replace("-","/");
			    var aDate = new Date(a);
			    var bDate = new Date(b);
			    var date3 = bDate.getTime() - aDate.getTime();
			    var hours=Math.floor(date3/(3600*1000));//得到小时数;
			    var leave2=date3%(3600*1000)  ;      //计算小时数后剩余的毫秒数
			    var minutes=Math.floor(leave2/(60*1000));
			    return hours+"小时 "+minutes+" 分钟";
			},
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
				//var limit = pageIndex*pageSize;
				var limit = pageIndex;
				var maxLt = limit + pageSize;
				
				param["limit"] 		= limit;
				param["pageSize"] 	= pageSize;
				param["setName"] 	= dataSetName;
				
				var dataSet = (data && typeof(data[dataSetName]) == "Array") ? data[dataSetName] : null;
				
				var dataSpan = null != dataSet ? dataSet.slice(limit,maxLt) : null;
				if(dataSpan && dataSpan.length>0){
					dataSpan = common.pageControl.searchLogicPages(dataSet,param);
					var showDataSpan = dataSpan.slice(limit,maxLt);
					//显示分页控件
					common.pageControl.showPageButton(pageUl,pageIndex,dataSpan.length,pageSize,function(index){
						common.pageControl.start(url,index,pageSize,param,dataSetName,data,pageUl,pageType,showTbodyHtml);
					});
					//显示结果集
					showTbodyHtml(data,dataSetName,showDataSpan);
				}else{
					param["pageSize"] 	= pageType == "logic" ? 9999 : pageSize;
					if(!common.utils.isNull(url)){
						$.jump.ajax(url, function(data) { 
							if(data.code != "0"){alert(data.msg);return;}
							if(!data.totalSize && data.totalSize < 0) alert("无法显示分页控件，请在分页请求后台配置“totalSize”参数!");
							if(data.pageSize &&  data.pageSize >0 ) pageSize = data.pageSize;
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
				if(maxLt>totalSize){
					dataSpan = dataSet;
				}else{
					dataSpan = dataSet.slice(limit,maxLt);
				}
				
				//显示分页控件
				common.pageControl.showPageButton(pageUl,pageIndex,totalSize,pageSize,function(index){
					common.pageControl.start(url,index,pageSize,param,dataSetName,data,pageUl,pageType,showTbodyHtml);
				});
				
				showTbodyHtml(data,dataSetName,dataSpan);
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
				pagesHtml += '<span id="totalSizeSpan">    共'+totalSize+'条</span>';
				
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
				if(document.getElementById('Layer_Loading'))
					document.getElementById('Layer_Loading').style.visibility='';
				$("#_SysDialogBGDiv").css({"height":$(document).height(),"z-index":"999999"}).show();
			}else{
				if(document.getElementById('Layer_Loading'))
					document.getElementById('Layer_Loading').style.visibility='hidden';
				$("#_SysDialogBGDiv").hide();
			}
		},
		
		/**
		 * 对象数组排序
		 * @param propertyName  对象属性
		 * @param sortType 		排序类型  DESC--倒序; ASC--顺序
		 * @returns {Function}
		 */
		objectCompare:function(propertyName,sortType){
			 if("DESC"==sortType){
					return function (object1, object2) { 
						var value1 = object1[propertyName]; 
						var value2 = object2[propertyName];  
						if (value2 < value1) { 
							return -1; 
						} else if (value2 > value1) { 
							return 1; 
						}  else { 
							return 0; 
						} 
					};
			   }else if("ASC"==sortType){
					return function (object1, object2) { 
						var value1 = object1[propertyName]; 
						var value2 = object2[propertyName];  
						if (value2 < value1) { 
							return 1; 
						} else if (value2 > value1) { 
							return -1; 
						}  else { 
							return 0; 
						} 
					};
			   }
		},
		//弹出
		showLayer : function(date,tempLayer,type){ // type 1 新增  2 修改 3 查看
 			var html = [];
			html.push('<div style="width:400px;background:#3f7aaa;">');
			if(type == 2){
				html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">修改值班        '+date.format()+'</h2>');
			}else if(type ==1){
				html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">新增值班        '+date.format()+'</h2>');
			}else if(type == 3){
				html.push('<h2 style="color: #333;background: #fff;line-height: 40px;font-weight: 100;font-family: "微软雅黑";">查看值班        '+date.format()+'</h2>');
			}
			html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"  style="margin-right:auto;margin-left:auto;border-radius:5px;background:#3f7aaa;padding:10px 30px;">');
			html.push('<tr>');
			html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;">值班人员安排：</td>');
 			if(tempLayer != null && (tempLayer.calltype == 2 ||tempLayer.call_type == 2)){
					html.push('<td  align="left" style="font-size:16px;text-align:left;font-family:微软雅黑;color:#FFF;width:100px;"><input type="radio" style="width:30px;" name="calltime" value = 1 />上午  <input type="radio" style="width:30px;"  checked=checked   name="calltime" value = 2 />下午</td>');
			}else{ 
					html.push('<td  align="left" style="font-size:16px;text-align:left;font-family:微软雅黑;color:#FFF;width:100px;"><input type="radio" style="width:30px;" checked=checked    name="calltime" value = 1 />上午  <input type="radio" style="width:30px;" name="calltime" value = 2 />下午</td>');
			}
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td align="center" style="margin-top:10px;font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;">值班人员姓名：</td>');
			html.push('<td width="200px;" align="left"><input type="text"');
			if(tempLayer != null){
				html.push(' id="callName" class="input" style="margin-top:10px;" value='+tempLayer.staff_name+' ></td>');
			}else{
				html.push(' id="callName" class="input" style="margin-top:10px;"  ></td>');
			}
			html.push('</tr>');
			html.push('<tr>');
			html.push('<td align="center" style="font-size:16px;text-align:right;font-family:微软雅黑;color:#FFF;width:100px;">值班人员电话：</td>');
			html.push('<td width="200px;" align="left"><input type="text"');
			if(tempLayer == null){
				html.push(' id="callPhone" class="input" style="margin-top:10px;"  ></td>');
			}else{
				html.push(' id="callPhone" class="input" style="margin-top:10px;" value='+tempLayer.mob_tel+' ></td>');
			}
			html.push('</tr>');
			html.push('<tr style="height:80px;">');
			html.push('<td align="center" colspan="2">');
			if(type != 3){
				html.push('<a class="but" id="saveCall">确定</a>');
			}
			html.push('</tr>');
			html.push('</table>');

			html.push('</div>');
			return html.join('');
		} 
		
};


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
	return CTX+this;
};


String.prototype.trim = function() 
{ 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
} ;

String.prototype.lTrim = function() 
{ 
	return this.replace(/(^\s*)/g, ""); 
} ;

String.prototype.rTrim = function() 
{ 
	return this.replace(/(\s*$)/g, ""); 
};

Array.prototype.remove = function(index){
	if(index<0)
		return this;
	else
		return this.splice(index,1); 
};

String.prototype.replaceAll = function(s1,s2) { 
    return this.replace(new RegExp(s1,"gm"),s2); 
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

/**
 * 截取字符串
 * @param context //内容
 * @param length //保留长度
 */
function splitStr(context,length){
	if(context.length > length){
		return context.substring(0,length) + "...";
	}else{
		return context;
	}
};


function isContains(allStr,str){
	//if(allStr.indexOf(str) > 0 )
	if(allStr.indexOf(str) > -1)
	{
	    return true;
	}else{
		return false;
	}
}


//下拉菜单
var timeout         = 500;
var closetimer		= 0;
var ddmenuitem      = 0;

function jsddm_open()
{	
	jsddm_canceltimer();
	jsddm_close();
	ddmenuitem = $(this).find('ul').eq(0).css('visibility', 'visible');}

function jsddm_close()
{	if(ddmenuitem) ddmenuitem.css('visibility', 'hidden');}

function jsddm_timer()
{	closetimer = window.setTimeout(jsddm_close, timeout);}

function jsddm_canceltimer()
{	if(closetimer)
	{	window.clearTimeout(closetimer);
		closetimer = null;}}

document.onclick = jsddm_close;

////滑动菜单
//$( ".sidebar li" ).hover(
//	function() {
//		$(this).children("a").css("color","#FFF");
//	    $(this).children("span").stop().animate(
//	    	{
//	    		width:"100%",
//	    		opacity:"1"
//	    	}, 
//	    	600, 
//	    	function () {
//	    	});
//  	}, 
//  	function() {
//		$(this).children("a").css("color","#555");
//		$(this).children("span").stop().animate({
//  				width:"0%",
//  				opacity:"0"
//  			}, 600, function () {
//  			});
//  	}
//);