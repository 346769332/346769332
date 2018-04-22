var CallSchedule = new Function();

CallSchedule.prototype = {
		temp : null  ,
		selecter : "#schedule",
		sysRegion : null , //组织机构
		staff_style : null ,
		dealWorks : [] ,//日程数组
 		init : function() {
			temp = this ;
			this.initLatnId(this);
			this.bindMethod(this);
			
			//初始化加载当年值班情况
//			this.initCurrStaffs(this);
			
			// 初始化日历
			this.initfullcalendar(this);
		},
		initLatnId : function(parentThis){
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
						
					}
				}else{
					layer.alert(msg);
				};
			}, null, false,false);
		},
		bindMethod : function(parentThis){
			// 初始化当年
		},
		initCurrStaffs : function(parentThis){
			var param = {"selectType" : "init"};
			$.jump.ajax(URL_QUERY_CALL_SCHEDULE.encodeUrl(), function(json) {
 				if(json.code == "0" ){
					if(json.latnSet.length > 0){
						var html = [];
						 
					}
				}else{
					layer.alert(msg);
				};
			}, param, false,false);
		},
		initfullcalendar : function(parentThis){
			$('#calenderDemo').fullCalendar({
				header: {
	                left: 'prev,next today',
	                center: 'title',
	                right: ''
	            },
	            buttonText: {
	                today: '本月',
	                month: '月',
	                prev: '上一月',
	                next: '下一月'
	            },
 				 allDayText: '全天',
				 monthNames: ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
				 monthNamesShort: ['1','2','3','4','5','6','7','8','9','10','11','12'],
				 dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
				 dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
				 editable: false,
 				 dayClick: function(date, allDay, jsEvent, view) {
    				if($('#calenderDemo').fullCalendar('getDate').dayOfYear() > date.dayOfYear()){
   						 alert("之前的日期不能添加值班");
   	  					 return ;
  					 }
   					 //已经有2条日程 不能再添加
					var count = 0 ;
    				$.each(dealWorks,function(key,obj){
    					if(date.format() == obj.start){
    						count ++ ;
    					}
    					
    				})	; 
    				if(count == 2){
    					alert("今天日程已满");
  	  					return ;
    				}
   					 
  					 var newCall = $.layer({
						    type: 1,
						    title: false,
						    area: ['auto', 'auto'],
						    border: [0], 
 						    page: {
						        html: common.showLayer(date,null,1) 
						    }
						});
  					 temp.selectStaff(date,newCall,1);
 					 
				 },
				 eventClick: function(event) { 
					 //日程项事件
					 var type = 2 ; // type 1 新增  2 修改 3 查看
 					 if($('#calenderDemo').fullCalendar('getDate').dayOfYear() > event.start.dayOfYear()){
						 type = 3 ;
  					 } 
 					 var updateCall = $.layer({
						    type: 1,
						    title: false,
						    area: ['auto', 'auto'],
						    border: [0], //去掉默认边框
						    page: {
						        html: common.showLayer(event.start,event,type) 
						    }
						});
	  					temp.selectStaff(event.start,updateCall,2,event.id);

 				 },
				 events:function(start, end, timezone,callback){
					  
 					 // 初始化  title_type 1上午 2 下午
  					 var currDate = $('#calenderDemo').fullCalendar('getDate');
  					 var currStr = '';
  					 if(currDate.month() >8){
  						currStr= currDate.year()+'-'+(currDate.month()+1);
  					 }else{
  						currStr = currDate.year()+'-0'+(currDate.month()+1); 
  					 }
 					 var events = [];
 					 var param = {"selectType" : "init","month":currStr};
				    	$.jump.ajax(URL_QUERY_CALL_SCHEDULE.encodeUrl(), function(json) {
			 				if(json.code == "0" ){
								if(json.callWorks.length > 0){
  									$.each(json.callWorks,function(key,obj){
 										if(obj.call_type ==1){
 											obj.title = '上午   '+obj.staff_name;
 										}else{
 											obj.title = '下午   '+obj.staff_name;
 										}
  										events.push(obj);
									});
								}
							}else{
								layer.alert(json.msg);
							};
						}, param, false,false);
				    	 dealWorks = events;
 						 callback(events);
				    },
				    //初始化
				    loading : function(isLoading, view){ 
				    	
				    }
				    
				});
			 
		},
		selectStaff : function(date,newCall,dotype,call_id){
			//dotype  1 新增 2 修改 
			//值班人选择
			 $("input[id=callName]").unbind("click").bind("click",function(){
				  //当前数据保存起来
				 var calltype = $("input[name='calltime']:checked").val() ;
				 // 新增 判断当天上午 下午日程是否已经被安排
				 if(dotype != 2){
					 var flag = false ;
						$.each(dealWorks,function(key,obj){
						if(date.format() == obj.start && obj.call_type == calltype ){
							flag = true ;
							return false ;
						}
					});
					if(flag && calltype ==1){
						alert("今天上午值班已安排");
		  					return ;
					}else if(flag && calltype ==2){
						alert("今天下午值班已安排");
		  					return ;
					}
				 }
				
				 var callName = $("#callName").val();
				 var callPhone = $("#callPhone").val();
				 var tempLayer = {"calltype" : calltype,"staff_name" : callName, "mob_tel" : callPhone,"tempLayerDate": date};
				   layer.close(newCall);
				   $("#pageTopDiv").hide();
				   $("#pageTopMenu").hide();
				   $("#schedule").hide(); 
				   $("#sysRegionDiv1").show();
	 					var parentObj =this ;
	 					parentObj.tempLayer = tempLayer; 
	 					parentObj.temp = temp ;
	 	  				$.jump.loadHtml("sysRegionDiv1","/CpcWeb/web/html/orderDetail/SysRegion.html",function(){
	  					parentObj.sysRegion = new SysRegion();
	 					temp.staff_style = 1 ; //只查询综支中心
	 					parentObj.sysRegion.init(1,temp,function(){ 
 	 					 //回调 
	 					   $("#pageTopDiv").show();
						   $("#pageTopMenu").show();
						   $("#schedule").show();
						   $("#sysRegionDiv1").hide();
						   
							var staffName = '' ;
	 						var staffId = '' ;
	 						var mob_tel  ='';
	   			 			$.each(this.getChooseStaffs(),function(key,obj){
	  			 				staffName = staffName + obj.staff_name + ',';
	  			 				staffId  = staffId + obj.staff_id  ;
	  			 				mob_tel = obj.mob_tel;
 	  						});
 						  var tempLayer = {"calltype" : parentObj.tempLayer.calltype,"staff_name" : staffName.substring(0, staffName.length-1), "mob_tel" : mob_tel,"tempLayerDate": parentObj.tempLayer.tempLayerDate,"id":parentObj.tempLayer.id};
	 						  var newCall = $.layer({
							    type: 1,
							    title: false,
							    area: ['auto', 'auto'],
							    border: [0], 
	 						    page: {
							        html: common.showLayer(date, tempLayer,dotype) 
							    }
							});
		 						temp =parentObj.temp;
		 	  					temp.selectStaff(date,newCall,1);
 						  //确定保存
						 $("#saveCall").unbind("click").bind("click",function(){ 
							layer.close(newCall);
							var obj = {};
							if( tempLayer.calltype == 1){
								obj.title='上午     '+staffName.substring(0, staffName.length-1)  ;
							}else{
								obj.title='下午     '+staffName.substring(0, staffName.length-1)  ;
							}
 							obj.start=date.format();
 							obj.call_type = tempLayer.calltype;
 							obj.staff_name = staffName.substring(0, staffName.length-1) ;
 							obj.mob_tel = mob_tel ;
 							var param = {"selectType" : "add","create_Date":date.format(),"call_type":tempLayer.calltype,"staff_id":staffId};
 							if(dotype ==2 ){
 								param.selectType = "update" ;
 								param.call_id = call_id ;
 							}
 					    	$.jump.ajax(URL_QUERY_CALL_SCHEDULE.encodeUrl(), function(json) {
 				 				if(json.code == "0" ){ 
 				 					obj.id = json.call_id ;
 				 					 if(dotype ==1){
 				 						dealWorks.push(obj);
 				 					 }else {
 				 						 //修改
 				 						 $.each(dealWorks,function(key,obj2){
 				 							 if(obj.id = call_id && obj.call_type ==obj2.call_type){
 				 								obj2.staff_name = staffName.substring(0, staffName.length-1) ;
 				 								obj2.mob_tel = mob_tel ;
 				 							 }
 				 						 });
  	 				 					$('#calenderDemo').fullCalendar( 'removeEvents' ,[call_id] );
 				 					 }
	 				 					$("#calenderDemo").fullCalendar('renderEvent',obj,true); 
 				 				}else{
 									layer.alert(json.msg);
 								};
 							}, param, false,false);
						 });
						  
	 					});
	 				},null);
			 });
		}	
};


//events.push({
//title:1,
//start:"2015-06-28",
//end:"2015-06-29",
//id:1
//});