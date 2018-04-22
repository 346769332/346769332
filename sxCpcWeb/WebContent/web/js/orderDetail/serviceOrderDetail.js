var ServiceOrderDetail = new Function() ;

ServiceOrderDetail.prototype = {
		serviceId : null ,
		isHistory : null ,
		handleType : null,
		currSelector : null ,
		detailData : null,
		temp : null  ,
		opt_time : null ,
		chooseStaff : null ,
		sysRegion : null,
		record_id : null ,
		staff_style : null ,
		serviceOrderBackOrder : null,//回单
		serviceOrderFollowUp  : null,//跟进
		serviceOrderInnerSend :null,//内部转派
		message:null,//留言
		init : function (){
			temp = this ;
 			temp.GetRequest();
			currSelector = $("#serviceInfo")
			if(temp.handleType != 'dispose'){
				currSelector.find("div[id="+temp.handleType+"]").show();
			}
			if(temp.handleType == "query"){
				currSelector.find("span[name=flowName]").text("查看");
			}else if (temp.handleType == "allHandle" || temp.handleType == "onlyClaim"){
				currSelector.find("span[name=flowName]").text("待认领");
			}else if(temp.handleType == "dispose"){
				currSelector.find("span[name=flowName]").text("待处理");
			}
			temp.serviceInfo();
			currSelector.find("a[name=recordOfServiceDetailInfoView]").unbind("click").bind("click",function(){
				window.open(CTX+'/web/html/orderDetail/recordOfServiceView.html?serviceId='+temp.serviceId+'&isHistory=Y&handleType=query');
			});
		},
		GetRequest : function (){
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			var str = url.substr(1);
		      strs = str.split("&");
		      for(var i = 0; i < strs.length; i ++) {
		         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		      }
		      temp.serviceId = theRequest['serviceId'];
		     
		      temp.isHistory = 'Y'; //默认全部展示
		      temp.handleType = theRequest['handleType'];
		      if(temp.handleType.indexOf("service")>=0){
		    	  busiType = temp.handleType.replace("service", "");
				  var busiTypeFirst = busiType.substring(0,1).toLowerCase();
				  temp.handleType = busiTypeFirst + busiType.substring(1);
		      }
 		},
 		serviceInfo : function(){
 			var param = {
 					"serviceId" 	: 		temp.serviceId				,
 					"isHistory"		:		temp.isHistory	
 					
 				};
 			
 				$.jump.ajax(URL_QUERY_SERVICE_INFO.encodeUrl(), function(data) {
				var funLst = data.funLst;
				var thisDiv="";
					//权限限制
				if(temp.handleType=='query'){
					
					 thisDiv = currSelector.find("div[id=dispose]");
				}else{
					 thisDiv = currSelector.find("div[id="+temp.handleType+"]");
					
				}
					
					thisDiv.show();
					
					if('dispose' == temp.handleType&&data.serviceInst.region_id!='888'){
						//市部门退回单
						$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderBackOrder.html".encodeUrl(),function(serviceOrderBackOrderHtml){
							thisDiv.find('div[name=serviceBackOrder]').html(serviceOrderBackOrderHtml);
							temp.serviceOrderBackOrder = new ServiceOrderBackOrder();
							temp.serviceOrderBackOrder.init(data,function(){
									$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderCallBack.html".encodeUrl(),function(serviceOrderCallBackHtml){
										thisDiv.find('div[name=serviceCallBack]').html(serviceOrderCallBackHtml);
										temp.serviceOrderCallBack = new serviceOrderCallBack();	
										temp.serviceOrderCallBack.init(data,function(){
											$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderInnerSend.html".encodeUrl(),function(serviceOrderInnerSendHtml){
												thisDiv.find('div[name=serviceInnerSend]').html(serviceOrderInnerSendHtml);
												temp.serviceOrderInnerSend = new ServiceOrderInnerSend();
										
												if(data.serviceInst.demand_type == '10015'){ //跟踪单
													temp.serviceOrderInnerSend.init(data,function(){
					 									$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderFollowUp.html".encodeUrl(),function(serviceOrderFollowUpHtml){
					 										thisDiv.find('div[name=serviceFollowUp]').html(serviceOrderFollowUpHtml);
					 										temp.serviceOrderFollowUp = new ServiceOrderFollowUp();
					 										temp.serviceOrderFollowUp.init(data);
					 		 							});
					 								},null);
												}else{
													temp.serviceOrderInnerSend.init(data);
												}
											});
										},null);
	
		 							});
								},null);
						});
					}else if('dispose' == temp.handleType&&data.serviceInst.region_id=='888'){
							//省部门退回单
						
						$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderBackOrder.html".encodeUrl(),function(serviceOrderBackOrderHtml){
							thisDiv.find('div[name=serviceBackOrder]').html(serviceOrderBackOrderHtml);
							
							temp.serviceOrderBackOrder = new ServiceOrderBackOrder();
							temp.serviceOrderBackOrder.init(data,function(){
									$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderCallBackz.html".encodeUrl(),function(serviceOrderFollowUpHtml){
										thisDiv.find('div[name=serviceCallBackk]').html(serviceOrderFollowUpHtml);
										temp.serviceOrderCallBackz = new ServiceOrderCallBackz();
										temp.serviceOrderCallBackz.init(data,function(){
											$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderInnerSends.html".encodeUrl(),function(serviceOrderInnerSendHtml){
												thisDiv.find('div[name=serviceInnerSend]').html(serviceOrderInnerSendHtml);
												temp.serviceOrderInnerSends = new ServiceOrderInnerSends();
												
											if(data.serviceInst.demand_type == '10015'){ //跟踪单
												temp.serviceOrderInnerSends.init(data,function(){
				 									$.jump.loadHtmlForFun("/web/html/orderDetail/serviceOrderFollowUp.html".encodeUrl(),function(serviceOrderFollowUpHtml){
				 										thisDiv.find('div[name=serviceFollowUp]').html(serviceOrderFollowUpHtml);
				 										temp.serviceOrderFollowUp = new ServiceOrderFollowUp();
				 										temp.serviceOrderFollowUp.init(data);
				 		 							});
				 								},null);
											}else{
												temp.serviceOrderInnerSends.init(data);
											}
											});
										},null);
										
										
		 							});
								},null);
						});
					}else if ('query' == temp.handleType){					
						$.jump.loadHtmlForFun("/web/html/orderDetail/message.html".encodeUrl(),function(serviceOrderBackOrderHtml){
							
							thisDiv.find('div[name=message]').html(serviceOrderBackOrderHtml);							
							temp.message = new message();
							
							temp.message.init(data);
//							temp.message.init(data,function(){	
//							},null);
						});
						
					}
					$.each(funLst,function(i,obj){ //功能节点打开
						
					var thisLi="";
					if('query' == temp.handleType){
						param={
								"methodtype"        :"query"	,
								"busi_id"			:data.serviceInst.service_id,
						}
						$.jump.ajax(UPDATE_FLOW_RECORD.encodeUrl(), function(json) {
							if(json.code == 0){
								
								if(json.opt_desc==""||json.opt_desc==null){								
									 thisLi= thisDiv.find("li[name=message]");//功能对应的li
									 thisDiv.find('div[name=message]').show(); //显示tab对应的div
								}	else {
									 thisLi= thisDiv.find("li[name=message]");//功能对应的li
									thisLi.hide();
									 thisDiv.find('div[name=message]').hide(); //隐藏tab对应的div
									 currSelector.find("#dispose").html("该服务单已留言");
								}					
							}else{
								
								alert(json.msg);
							}
						}, param, true);
					
					}else{
						
						if(obj.fun_url!='message'){
							
							thisLi = thisDiv.find('li[name='+obj.fun_url+']');//功能对应的li
							thisLi.show(); //显示tab
							thisLi.attr("isShow",true);//表示这个功能具备权限
							if(thisLi.attr("class") == "hover"){
								thisDiv.find('div[name='+obj.fun_url+']').show(); //显示tab对应的div
							}
						}
						
					}
						
						
						
					});
					//不是跟踪单隐藏跟进
					if(data.serviceInst.demand_type != '10015'){
						thisDiv.find('li[name=serviceFollowUp]').hide();
					}
 					
  					currSelector.find("#service_id").html(data.serviceInst.service_id) ;
 					currSelector.find("#create_time").html(data.serviceInst.send_time) ;
 					currSelector.find("#promoters").html(data.serviceInst.promoters) ;
 					currSelector.find("#department").html(data.serviceInst.department) ;
 					currSelector.find("#tel").html(data.serviceInst.tel) ;
 					currSelector.find("#over_time").html(data.serviceInst.over_time) ;
 					currSelector.find("#over_eval").html(data.serviceInst.over_eval) ;
 					currSelector.find("#demand_promoters").html(data.serviceInst.demand_promoters) ;
 					currSelector.find("#demand_tel").html(data.serviceInst.demand_tel) ;	
 					currSelector.find("#demand_promoters").html(data.serviceInst.demand_promoters) ;
 					currSelector.find("#demand_tel").html(data.serviceInst.demand_tel) ;
 					currSelector.find("#service_details").html("小CEO诉求："+data.serviceInst.demand_details+'</br>'+"综支处理意见："+data.serviceInst.service_desc) ; 				
 					currSelector.find("#service_theme").html('服务主题：'+data.serviceInst.service_theme) ;
					if(data.serviceInst.flag == "1"){
 						currSelector.find("#calimSurplusTime").html('&nbsp;&nbsp;&nbsp;<font color="red">'+data.serviceInst.calimSurplusTime+'</font>');
 					}else{
 						currSelector.find("#calimSurplusTime").html('&nbsp;&nbsp;&nbsp;<font>'+data.serviceInst.calimSurplusTime+'</font>');
 					}
					
					if(data.serviceInst.up_photo_names != "null" && data.serviceInst.up_photo_names != "" && data.serviceInst.up_photo_names !=undefined){
 						temp.showFileFun(currSelector,data.serviceInst);
 					}
					
					
 					var recordSet = data.recordSet ;
 					var html = [];
 					var currNode_id = null ;
 					var record_id = null ;
 					currSelector.find("#recordOfServiceInfo").find("tr[name=service_info]").remove();
 					var staffId = data.staffId;
 					var optId="";
 					var xhNum=0;
 					$.each(recordSet,function(key,obj){
 						if(obj.curr_node_id != "100100"){//发起的不用展示
 							xhNum++;
 						html.push('<tr name="service_info">');
 						html.push('<td align="left">'+xhNum+'</td>') ;
 						if(obj.curr_node_id == "100104"){
 							html.push('<td >已处理</td>') ;
 						}else{
 							html.push('<td >'+obj.curr_node_name+'</td>') ;
 						}
 							html.push('<td  >'+obj.opt_name+'</td>') ;
 						if(key == recordSet.length-1){
 							if(obj.next_node_id=='-1'){
 								html.push('<td >'+obj.opt_time+'</td>') ;
 							}else{
 								html.push('<td  ></td>') ;
 							}
 	 						
 						}else{
 	 						html.push('<td  >'+recordSet[key].opt_time+'</td>') ;
 						}
 						html.push('<td  >'+obj.time_count+'</td>') ;
 						html.push('<td  >'+obj.urge_count+'</td>') ;
 						html.push('</tr>');
 						if(key == recordSet.length-1){
 							currNode_id = obj.curr_node_id;
 							record_id  = obj.record_id ;
 						}
 							temp.opt_time = obj.opt_time ;
 							optId = obj.opt_id;
 						}
  					});
 					currSelector.find("#recordOfServiceInfo").append(html.join(''));
 					temp.detailData = data;//详单数据
 					temp.bindMetod();//绑定事件
 					//判断当前流程表最后环节是不是已认领 是的话可以确认回单
 					
 					if(100107!=currNode_id){
 						
 					
 					if((100102 !=currNode_id &&200102!=currNode_id)||staffId!=optId){
 						currSelector.find("#dispose").html("该服务单已处理");
 					}
// 					if(100102 ==currNode_id&&staffId!=optId){
// 						currSelector.find("#dispose").hide();
// 					}
 					}
 				}, param, true,false);
  				
 		},
 		//显示显示图片
 		showFileFun:function(currSelector,data){
 			
 			var html=[];
			var fileString="data:image/jpeg;base64,"+data.up_photo_names;
			html.push('<div name="photoGird" class="grid item" imgSrc="'+fileString+'" ><img src="'+fileString+'"/></div>');
 			currSelector.find("#demand_img").html(html.join(''));
 			currSelector.find("div[name=photoGird]").unbind("dblclick").bind("dblclick",function(){
 				
 				var imgSrc = $(this).attr("imgSrc");
 				var imgHtml = [];
 				imgHtml.push('<div style="margin:20px 20px 20px 35px;"><img src="'+imgSrc+'"></div>');
 				//页面层
 				$.layer({
 				    type: 1,
 				    title: '图片查看',
 				    area: ['450px', '580px'], //宽高
 				    offset: ['20px', ''],
 				    shade: [0.8, '#000'],
 				    closeBtn: [0, true],
 				    shadeClose: false,
 				    page: {
 				        html: imgHtml
 				    }
 				});
 	       });
 		},
 		
 		//绑定方法
 		bindMetod : function(){
	 			
	 			var thisObj = currSelector.find("div[id="+temp.handleType+"]"); //当前div
 				allHandleUlObj = thisObj.find("ul[name="+temp.handleType+"]");
 				allHandleUlObj.find("li").unbind("click").bind("click",function(){
 					
 					allHandleUlObj.find("li").removeClass("hover");
 					$(this).addClass("hover");
 					thisObj.find("div[class=tctj]").hide();
 					thisObj.find("div[name="+$(this).attr("name")+"]").show();
 				});
 		}
};
$(document).ready(function(){
	var serviceOrderDetail = new ServiceOrderDetail();
	serviceOrderDetail.init();
});

