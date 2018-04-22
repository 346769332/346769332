var OrderDetail = new Function() ;

OrderDetail.prototype = {
		demandId : null ,
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
		staff_flag : null,
		init : function (){
			temp = this ;
 			temp.GetRequest();
			currSelector = $("#demandInfo");
//			if(temp.handleType != 'dispose'){
//				currSelector.find("div[id="+temp.handleType+"]").show();
//			}
			if(temp.handleType == "query"){
				currSelector.find("span[name=flowName]").text("查看");
			}else if (temp.handleType == "allHandle" || temp.handleType == "onlyClaim"){
				currSelector.find("span[name=flowName]").text("待认领");
			}else if(temp.handleType == "dispose"){
				currSelector.find("span[name=flowName]").text("待处理");
			}
			temp.demandInfo();
			currSelector.find("a[name=recordOfDemandDetailInfoView]").unbind("click").bind("click",function(){
				window.open('recordOfDemandView.html?demandId='+temp.demandId+'&isHistory=Y&handleType=query');
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
		      temp.demandId = theRequest['demandId'];
		      temp.isHistory = 'Y'; //默认全部展示
		      temp.handleType = theRequest['handleType'];
 		},
 		demandInfo : function(){
 			var param = {
 					"demandId" 	: 		temp.demandId				,
 					"isHistory"	:		temp.isHistory				 
 				};
 				$.jump.ajax(URL_QUERY_DEMAND_INFO.encodeUrl(), function(data) {
 					
 					var funLst = data.funLst;
 					var latnId=data.regionCode;
 					if("290"==latnId  || true){
 						$('#sendRank').show();
 					}
 					//权限限制
 						var thisDiv = currSelector.find("div[id="+temp.handleType+"]");
 						thisDiv.show();
 						
 						if('onlyClaim' == temp.handleType){
 								$.jump.loadHtmlForFun("/web/html/orderDetail/orderClaim.html".encodeUrl(),function(contentHtml){
 									if(thisDiv.html() != "该需求单已被认领"){
	 									thisDiv.html(contentHtml);
	 	 								var orderClaim = new OrderClaim();
	 	 								orderClaim.init(data);
 									}
 	 							});
 						}
 						
 						if('allHandle' == temp.handleType){
								$.jump.loadHtmlForFun("/web/html/orderDetail/orderClaim.html".encodeUrl(),function(orderClaimHtml){
									if(thisDiv.html() != "该需求单已被认领"){
									thisDiv.find('div[name=claim]').html(orderClaimHtml);
	 								temp.orderClaim = new OrderClaim();
	 								temp.orderClaim.init(data,function(){
	 									$.jump.loadHtmlForFun("/web/html/orderDetail/orderToSend.html".encodeUrl(),function(orderToSendHtml){
	 										thisDiv.find('div[name=toSend]').html(orderToSendHtml);
	 										temp.orderToSend = new OrderToSend();
	 										temp.orderToSend.init(data);
	 		 							});
	 								});
									}
	 							});
 						}else if("opted"==temp.handleType){//西安的添加再处理意见
// 							var len = data.recordSet.length-1;
// 		 					if(data.recordSet[len].curr_node_id== "100102"){
								$.jump.loadHtmlForFun("/web/html/orderDetail/addOptDesc.html".encodeUrl(),function(addDescHtml){
									thisDiv.html(addDescHtml);
		 						    var addOptDesc = new AddOptDesc();
		 						    addOptDesc.init(data);
								});
// 		 					}else{
// 		 						thisDiv.html('该状态下不能再添加处理意见');
// 		 					}
 						}
 						
 						if('dispose' == temp.handleType){
							$.jump.loadHtmlForFun("/web/html/orderDetail/orderBackOrder.html".encodeUrl(),function(orderBackOrderHtml){
 								thisDiv.find('div[name=backOrder]').html(orderBackOrderHtml);
 								temp.orderBackOrder = new OrderBackOrder();
 								temp.orderBackOrder.init(data,function(){
 									$.jump.loadHtmlForFun("/web/html/orderDetail/orderFollowUp.html".encodeUrl(),function(orderFollowUpHtml){
 										thisDiv.find('div[name=followUp]').html(orderFollowUpHtml);
 										temp.orderFollowUp = new OrderFollowUp();
 										temp.orderFollowUp.init(data,function(){
 											$.jump.loadHtmlForFun("/web/html/orderDetail/orderTurnSent.html".encodeUrl(),function(orderTurnSentHtml){
 		 										thisDiv.find('div[name=turnSent]').html(orderTurnSentHtml);
 		 										
 		 										temp.orderTurnSent = new OrderTurnSent();
 		 										temp.orderTurnSent.init(data,function(){
 		 											$.jump.loadHtmlForFun("/web/html/orderDetail/orderSplit.html".encodeUrl(),function(orderSplitHtml){
 		 		 										thisDiv.find('div[name=split]').html(orderSplitHtml);
 		 		 										temp.orderSplit = new OrderSplit();
 		 		 										temp.orderSplit.init(data,function(){
 		 		 											$.jump.loadHtmlForFun("/web/html/orderDetail/orderGoBack.html".encodeUrl(),function(orderGoBackHtml){
	 		 		 												
	 		 		 												thisDiv.find('div[name=goBack]').html(orderGoBackHtml);
	 		 		 		 										temp.orderGoBack = new OrderGoBack();
	 		 		 		 										temp.orderGoBack.init(data,function(){
		 		 		 		 										$.jump.loadHtmlForFun("/web/html/orderDetail/followSent.html".encodeUrl(),function(followSentHtml){
		 	 		 		 												
		 	 		 		 												thisDiv.find('div[name=followSent]').html(followSentHtml);
		 	 		 		 		 										temp.followSent = new FollowSent();
		 	 		 		 		 										temp.followSent.init(data,function(){
		 		 		 		 		 										$.jump.loadHtmlForFun("/web/html/orderDetail/orderSport.html".encodeUrl(),function(orderSportHtml){
		 		 	 		 		 												
		 		 	 		 		 												thisDiv.find('div[name=sport]').html(orderSportHtml);
		 		 	 		 		 		 										temp.orderSport = new OrderSport();
		 		 	 		 		 		 										temp.orderSport.init(data);
		 		 	 		 		 		 		 							});
		 	 		 		 		 										},null);
		 			 		 		 									});
	 		 		 		 										},null);
	 		 		 		 		 							});
 		 		 										},null);
 		 		 		 							});
 		 										},null);
 		 		 							});
 										},null);
 		 							});
 								},null);
 							});
 						}
 						
 						$.each(funLst,function(i,obj){ //功能节点打开
 							var thisLi = thisDiv.find('li[name='+obj.fun_url+']');//功能对应的li
 							thisLi.show(); //显示tab
 							thisLi.attr("isShow",true);//表示这个功能具备权限
 							if(thisLi.attr("class") == "hover"){
 								thisDiv.find('div[name='+obj.fun_url+']').show(); //显示tab对应的div
 							}
 						});
 						
  					currSelector.find("#demand_id").html(data.demandInst.demand_id) ;
 					currSelector.find("#create_time").html(data.demandInst.create_time) ;
 					currSelector.find("#promoters").html(data.demandInst.promoters) ;
 					currSelector.find("#department").html(data.demandInst.department) ;
 					currSelector.find("#tel").html(data.demandInst.tel) ;
 					currSelector.find("#over_time").html(data.demandInst.over_time) ;
 					currSelector.find("#over_eval").html(data.demandInst.over_eval) ;
 					currSelector.find("#demand_details").html(data.demandInst.demand_details) ; 
 					currSelector.find("#demand_type").html(data.demandInst.demand_type_name) ; 
 					currSelector.find("#urge_count").html('已催'+data.demandInst.urge_count+'次');
 					currSelector.find("#demandRank").html(data.demandInst.rank_name);//发单等级
 					//展示上传的文件
 					temp.showFileList(data.imgList);
 					var recordSetLength = data.recordSet.length-1;
 					if(data.recordSet[recordSetLength].curr_node_id != "100101"){
 						if(data.demandInst.flag != undefined&& data.demandInst.flag == "1"){
 	 						currSelector.find("#calimSurplusTime").html('&nbsp;&nbsp;&nbsp;<font color="red">'+data.demandInst.calimSurplusTime+'</font>');
 	 					}else if (data.demandInst.flag != undefined){
 	 						currSelector.find("#calimSurplusTime").html('&nbsp;&nbsp;&nbsp;<font>'+data.demandInst.calimSurplusTime+'</font>');
 	 					}
 						currSelector.find("#limit_time").html(data.demandInst.limit_time+"小时");
 					}
 					currSelector.find("#demand_theme").html('需求主题：'+data.demandInst.demand_theme) ;
 					
 					/*if(data.demandInst.up_photo_names != "null" && data.demandInst.up_photo_names != "" && data.demandInst.up_photo_names !=undefined){
 						currSelector.find("#demand_img").attr("src",URL_QUERY_DEMAND_IMG="?demandId="+data.demandInst.demand_id+"&isHistory=N");
 					}*/
 					

 					currSelector.find("#limit_time").html(data.demandInst.limit_time+"小时") ;
 					var recordSet = data.recordSet ;
 					var html = [];
 					var currNode_id = null;
 					var record_id = null ;
 					currSelector.find("#recordOfDemandInfo").find("tr[name^='demand_info']").remove();
 					var optId = "";//市综支上报人ID，回单功能用
 					var otpName = "";//市综支上报人NAME，回单功能用
 					var newOptId= "";//当前处理人
 					var newDefOptId = "";//默认处理人
 					var reportFlag = true;//是否可上报
 					var tempSet=[];
 					
 					$.each(recordSet,function(key,obj){
 						var tempObj=obj;
 						if(key == recordSet.length-1){
 							currNode_id = obj.curr_node_id;
 							record_id  = obj.record_id ;
 							tempObj.opt_time = obj.opt_time ;
 							tempObj.new_record_id=tempObj.record_id+1000000;
							tempObj.new_opt_time=common.date.yearAfterNowTime();
 						}else{
 							tempObj.opt_time=recordSet[key].opt_time;
 							tempObj.new_opt_time=recordSet[key].opt_time;
 						}
 						
 						if("100102" == obj.curr_node_id){ //区综支上报
 							optId = obj.opt_id;
 							otpName = obj.opt_name;
 						}
 						if(obj.default_opt_id != "" && obj.default_opt_id !=undefined){
 							newOptId = obj.default_opt_id;
 							newDefOptId = obj.default_opt_id;
 						}else{
 							newOptId = obj.opt_id;
 						}
 						if('200102' == obj.curr_node_id){ //
 							reportFlag = false;
 						}
 						tempObj.orderBy=common.utils.getNumber(tempObj.new_opt_time);
 						tempSet.push(tempObj);
  					});
 					
 					//服务单数据处理
 					var recordServiceSet=data.recordServiceSet ;
 					var tempRecordServiceSet=[];
 					if(null!=recordServiceSet && undefined!=recordServiceSet ){
 						var recordServiceArr=[];
 						$.each(recordServiceSet,function(key,obj){
 							obj.new_opt_time=obj.opt_time;
 							var tempCount=0;
	 						$.each(recordServiceArr,function(tempKey,tempObj){
	 							if(obj.busi_id==tempObj.busi_id){
	 								tempCount++; 
		 						 } 
	 	 					});
	 						if(tempCount==0){
	 							recordServiceArr.push(obj);
	 						};
 						});
	 					$.each(recordServiceArr,function(key,obj){
	 						obj.orderBy=common.utils.getNumber(obj.new_opt_time);
	 						tempSet.push(obj);
	 					});
	 					
	 					//将服务单数据重组按服务单归类
	 					$.each(recordServiceArr,function(i,obj1){
	 						var tempRecordServiceArrSet=[];
	 						 $.each(recordServiceSet,function(j,obj2){
	 							  if(obj1.busi_id==obj2.busi_id){
	 								 tempRecordServiceArrSet.push(obj2); 
	 							  }
	 						 });
	 						 
	 						 $.each(tempRecordServiceArrSet,function(key,obj){
	 							var tempObj=obj;
	 	 						if(key == tempRecordServiceArrSet.length-1){
	 	 							if(obj.next_node_id!='-1'){
	 	 								tempObj.new_opt_time='';
	 	 							}else{
	 	 								tempObj.new_opt_time=obj.opt_time;
	 	 							}
	 	 						}else{
	 	 							//tempObj.new_opt_time=tempRecordServiceArrSet[key+1].opt_time;
	 	 							tempObj.new_opt_time=tempRecordServiceArrSet[key].opt_time;
	 	 						}
	 	 						tempRecordServiceSet.push(tempObj);
	 						 });
	 					});
 					}
 					
 					//跟进数据添加
 					var recordProcSet=orderDealData.dealFollowUpInfo(data.recordProcSet);
 					$.each(recordProcSet,function(i,obj){
 						obj.new_opt_time=obj.opt_time;
 						obj.orderBy=common.utils.getNumber(obj.new_opt_time);
 						tempSet.push(obj);
 					});
 					tempSet.sort(common.objectCompare("orderBy", "ASC"));

 					var xhNum=0;
 					var dXhNum=0;
 					var xhCount=0;
 					$.each(tempSet,function(key,obj){
 						xhCount++;
 						if(obj.busi_id.charAt(0)!="S"){
 							xhNum++;
 							xhCount--;
 							if(obj.busi_id.charAt(0)=="D"){
 								dXhNum++;
 								xhCount=0;
 								html.push('<tr name="demand_info_'+dXhNum+'" dXhNum="'+dXhNum+'">');
 							}else{
 								html.push('<tr>');
 							}
							html.push('<td align="left">'+xhNum+'</td>') ;
							html.push('<td  >'+obj.curr_node_name+'</td>') ;
							
							html.push('<td  >'+obj.fun_name+'</td>') ;
							if(obj.default_opt_name != "" && obj.default_opt_name !=undefined){
								html.push('<td  >'+obj.default_opt_name+'</td>') ;
							}else{
								html.push('<td  >'+obj.opt_name+'</td>') ;
							}
							if(obj.record_id==record_id && obj.busi_id.charAt(0)=="D"){
								if(key!==tempSet.length-1 && tempSet[key].busi_id.charAt(0)=="S"){
									//html.push('<td  >'+tempSet[key+1].new_opt_time+'</td>') ;
									html.push('<td  >'+tempSet[key].new_opt_time+'</td>') ;
								}else{
									if(obj.next_node_id=='-1'){
										html.push('<td>'+obj.opt_time+'</td>') ;
									}else{
										html.push('<td></td>') ;
									}
								}
							}else{
								html.push('<td  >'+obj.new_opt_time+'</td>') ;
							}
							html.push('<td  >'+obj.time_count+'</td>') ;
							html.push('<td  >'+obj.urge_count+'</td>') ;
							html.push('</tr>');
 						}else{
 							var sXhNum=0;
							html.push('<tr name="demand_info_service_'+dXhNum+'">');
							html.push('<td colspan="7"  style="padding:0;">') ;
							html.push('<table width="100%" border="0" cellspacing="0" cellpadding="0"  class="tab5 lines f14" >');	
							html.push('<thead>');	
							html.push('<tr name="demand_service_tr_'+obj.busi_id+'" busi_id="'+obj.busi_id+'" style="cursor: pointer;">');
							html.push('<td colspan="7" ><strong>拆分</strong> '+obj.busi_id+'--服务单子流程</td>');;
							html.push('</tr>');
							html.push('</thead>');	
							html.push('<tbody name="demand_service_info_tbody_'+obj.busi_id+'">');	
 							$.each(tempRecordServiceSet ,function(sKey,sObj){
 								if(obj.busi_id==sObj.busi_id && sObj.curr_node_id!='100100' && sObj.curr_node_id!='100101'){
 									sXhNum++;
 									html.push('<tr >');
 									html.push('<td style="width: 10%; align="center">'+xhNum+"."+xhCount+"."+sXhNum+'</td>');
 									html.push('<td style="width: 12%;">') ;
 									if(sObj.curr_node_id=='100104'){
 										html.push('已处理') ;	
 									}else{
 										html.push(sObj.curr_node_name) ;	
 									}
 									html.push('</td>') ;
 									html.push('<td style="width: 10%;">'+sObj.fun_name+'</td>') ;
									html.push('<td style="width: 24%;" >'+sObj.opt_name+'</td>') ;
 									html.push('<td style="width: 20%;" >'+sObj.new_opt_time+'</td>') ;
 									html.push('<td style="width: 10%;">'+sObj.time_count+'</td>') ;
 									html.push('<td style="width: 10%;">'+sObj.urge_count+'</td>') ;
 									html.push('</tr>');
 								}
 							});
 							html.push('</tbody>');	
 							html.push('</table>');	
							html.push('</td>');
							html.push('</tr>');
 						}
 					});
 					currSelector.find("#recordOfDemandInfo").append(html.join(''));
 					currSelector.find("#recordOfDemandInfo").find("tbody[name^='demand_service_info_tbody_']").hide();
 					currSelector.find("#recordOfDemandInfo").find("tr[name^='demand_service_tr_']").unbind("click").bind("click",function(){
 						var busi_id=$(this).attr("busi_id");
 						var array=currSelector.find("#recordOfDemandInfo").find("tbody[name='demand_service_info_tbody_"+busi_id+"']");
 						$.each(array,function(key,obj){
 							if($(obj).is(":hidden")){
 								currSelector.find("#recordOfDemandInfo").find("tbody[name^='demand_service_info_tbody_']").hide();
 								$(obj).show();
 	 						}else{
 	 							$(obj).hide();
 	 						}
 						});
 					});
 					
 					temp.detailData = data;//详单数据
 					temp.bindMetod(temp.detailData,temp.opt_time);//绑定事件
 					
 					
 					//判断当前流程表最后环节是不是已认领 是的话可以确认回单
 					if( '100102' == currNode_id && 'dispose' == temp.handleType && (newOptId == data.optId||newOptId == data.orgId)){//市综支待处理
 						
// 						if(!reportFlag){ // 是否已经上报过了
// 							currSelector.find("ul[name=dispose]").find("li[name=sport]").hide(); //隐藏上报
// 							currSelector.find("#dispose").find("div[name=sport]").hide(); //隐藏上报
// 							currSelector.find("ul[name=dispose]").find("li[name=followUp]").hide(); //隐藏跟进
// 							currSelector.find("#dispose").find("div[name=followUp]").hide(); //隐藏跟进
// 							currSelector.find("ul[name=dispose]").find("li[name=turnSent]").hide(); //隐藏转派
// 							currSelector.find("#dispose").find("div[name=turnSent]").hide(); //隐藏转派
// 							currSelector.find("ul[name=dispose]").find("li[name=split]").hide(); //隐藏拆分
// 							currSelector.find("#dispose").find("div[name=split]").hide(); //隐藏拆分
// 						}
// 	 					temp.dateBind(currSelector.find("#opt_date"), 0);
 	 					//清空
 					}else if ('200102' ==currNode_id && 'dispose' == temp.handleType && newOptId == data.optId){ //区综支待处理没有上报
 						currSelector.find("ul[name=dispose]").find("li[name=sport]").hide(); //隐藏上报
						currSelector.find("#dispose").find("div[name=sport]").hide(); //隐藏上报
 	 					
 					}else{
 						
 						currSelector.find("#dispose").hide();
 						if( newDefOptId !=""){
 							currSelector.find("#allHandle").hide();
 						}
 						if('200102' == currNode_id && newOptId == data.optId){
 							currSelector.find("#dispose").html("已上报，处理操作被暂停!");
 							currSelector.find("#dispose").addClass("color","red");
 							currSelector.find("#dispose").show();
 							currSelector.find("#allHandle").hide();
 							return;
 						}
 					}
 					if( '100101' != currNode_id  && ('allHandle' == temp.handleType || 'onlyClaim' == temp.handleType)){
 						currSelector.find("div[id="+temp.handleType+"]").html("该需求单已被认领");
 						currSelector.find("div[id="+temp.handleType+"]").addClass("color","red");
 					}
 					if(data.serviceInst != null && data.serviceInst.length>0){
 						var flag = false;
 						$.each(data.serviceInst,function(i,obj){
 							if(obj.curr_node_id != "100104"){
 								flag = true;
 								return false;
 							}
 						});
 						if(flag){
 							currSelector.find("ul[name=dispose]").find("li[name=sport]").hide(); //隐藏上报
 							currSelector.find("#dispose").find("div[name=sport]").hide(); //隐藏上报
 							currSelector.find("ul[name=dispose]").find("li[name=turnSent]").hide(); //隐藏转派
 							currSelector.find("#dispose").find("div[name=turnSent]").hide(); //隐藏转派
 							currSelector.find("ul[name=dispose]").find("li[name=backOrder]").hide(); //隐藏回单
 							currSelector.find("#dispose").find("div[name=backOrder]").hide(); //隐藏回单
 						}
 					}
 				}, param, true,false);
 		},
 		//查询上传的文件
 		showFileList : function(fileList){
 			var html=[];
 			var fileInfoObj=$('#fileInfo');
 			if(fileList.length>0){
				//附件
				$.each(fileList,function(i,obj){
					var pointIndex = obj.attachment_name.lastIndexOf(".");
					var fileType = obj.attachment_name.substring(pointIndex+1, obj.attachment_name.length);
					var file_name="";
					if(obj.attachment_name.length >13) {
						file_name = obj.attachment_name.substr(0,13)+ "...." + fileType;
					}else {
						file_name = obj.attachment_name;
					}
					var other_file_name=obj.OTHER_ATTACHMENT_NAME;
					html.push('<div id="file'+i+'" class="lable-title fl" style="width:30%;"><a href="javascript:void(0)" name="attachment" file_name="'+obj.attachment_name+
							'" file_path="'+obj.attachment_path+'" other_file_name="'+other_file_name+'" style="color: #4782DD; text-decoration: underline;width:200px;" title="'+obj.attachment_name+'">'+file_name+'</a>');
					html.push('</div>');
				});
				fileInfoObj.html(html.join(''));
				//附件下载
				fileInfoObj.find('a[name=attachment]').unbind("click").bind("click",function(){
					var otherName=$(this).attr("other_file_name");
					var downLoadName="";
					if(otherName==""||otherName==undefined||otherName==null){
						downLoadName=$(this).attr("file_name");
					}else{
						downLoadName=otherName;
					}
					var param={
							"fileName"     :	$(this).attr("file_name"),
							"downloadName" :    downLoadName,
							"filePath"	   :	$(this).attr("file_path")
					};	
					window.location.href=URL_DOWN_FILE+"?"+encodeURI($.param(param));
				});
 			}else{
 				html.push('<div>无上传的附件</div>');
 				fileInfoObj.html(html.join(''));
 			}
 			
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
				allHandleUlObj.find("li").bind("click").bind("click",function(){
					
					allHandleUlObj.find("li").removeClass("hover");
					$(this).addClass("hover");
					thisObj.find("div[class=tctj]").hide();
					thisObj.find("div[name="+$(this).attr("name")+"]").show();
				});
		},
		//时间绑定
 		dateBind : function(obj,AddDayCount){
 			var d = new Date();
 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
 			var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
 			obj.val(newDate);
 		},
 		//时间绑定
 		serviceDateBind : function(obj,AddDayCount){
 			var d = new Date();
 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
 			var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes());
 			$.each(obj,function(i,input){
 				if($(this).val() == ""){
 					$(this).val(newDate);
 				}
 			});
 			obj.datetimepicker({
 				lang		:	'ch',
 				minDate		: 	newDate,
 				minTime		:	newDate
 			});
 		}
// 		//确认回单
// 		flowRecord : function(data, optId,optName,currNode_id){
// 			currSelector.find("#diposeFlowRecordA").unbind("click").bind("click",function(){
// 				var diposeFlowRecord = currSelector.find("#diposeFlowRecord").val();
// 				
// 				if(diposeFlowRecord == null || diposeFlowRecord.length < 1) {
// 					layer.alert("请填写回单说明",8);
// 					return;
// 				}
// 				var demand = {"demand_id" : data.demandInst.demand_id,"summary" : currSelector.find("#diposeFlowRecord").val(),"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
// 				var flow_record = { 
// 									"flagType"			:	"1"								, //解锁单子
// 									"urge_count"   		: 	"0"								,
// 									"busi_id"    		: 	data.demandInst.demand_id		,
// 									"opt_desc"   		: 	diposeFlowRecord				,
// 									"opt_time"   		: 	temp.opt_time					,
// 									"record_id" 		: 	data.demandInst.curr_record_id	,
// 									"opt_id"			: 	data.demandInst.promoters_id	,
// 									"opt_name"			: 	data.demandInst.promoters		,
// 									"funTypeId"			:	"100004"				
// 				};
// 				if("200102" == currNode_id){
// 					flow_record["opt_id"] = optId;
// 					flow_record["opt_name"] = optName;
// 					flow_record["smsFlag"] = "1"; //发区综支短信
// 				}
// 				var record_list = new Array();
// 				var record_proc =  {
// 						"attr_id" : '4' , // 4表示回单说明  map_code 
// 						"attr_value" : diposeFlowRecord ,
// 						"busi_id" : data.demandInst.demand_id ,
// 						"attr_group" : '1'
// 				      } ;
// 				record_list.push(record_proc);
// 				var param = {
// 						"handleType"	:	"2"									,
// 	 					"demand" 	    : 	 JSON.stringify(demand)				,
// 	 					"flow_record"	:	 JSON.stringify(flow_record)	    ,
// 	 					"record_proc"   :    JSON.stringify(record_list)
// 	 				};
// 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
//					if(json.code == 0){
//						layer.alert('回单成功!',9);
//						temp.init();
//					}else{
//						layer.alert(json.msg,8);
//					}
//				}, param, true);
// 	 		});
// 		},
// 		//跟进
// 		recordProc : function(demand_id,record_id,data){
// 			currSelector.find("#addRecordProcA").unbind("click").bind("click",function(){
// 				var opt_name = currSelector.find("#opt_name").val();
// 				var opt_status = currSelector.find("#opt_status").val();
// 				var opt_date = currSelector.find("#opt_date").val();
// 				var opt_desc = currSelector.find("#opt_desc").val();
// 				if(opt_desc ==null || opt_desc.length<1) {
// 					layer.alert("请填写处理说明",8);
// 					return;
// 				}
// 				var record_list = new Array();
// 				var temp_attr_group="2"+common.date.nowTimeNotYear();
// 				var record_proc_1 =  {"attr_id" : '7' ,  
// 						"attr_value" : opt_status ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : temp_attr_group
// 				      } ;
// 				var record_proc_2 =  {"attr_id" : '8' , 
// 						"attr_value" : opt_date ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : temp_attr_group
// 				      } ;
// 				var record_proc_3 =  {"attr_id" : '9' ,  
// 						"attr_value" : opt_name ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : temp_attr_group
// 				      } ;
// 				var record_proc_4 =  {"attr_id" : '11' ,  
// 						"attr_value" : opt_desc ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : temp_attr_group
// 				      } ;
// 				record_list.push(record_proc_1);
// 				record_list.push(record_proc_2);
// 				record_list.push(record_proc_3);
// 				record_list.push(record_proc_4);
// 				var demand = {"demand_id" : data.demandInst.demand_id,"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
// 				var flow_record = { "record_id"   : data.demandInst.curr_record_id};
// 				var param = {
// 						"handleType"	:	"4"								,
// 	 					"demand" 	    : 	 JSON.stringify(demand)			,
// 	 					"flow_record"	:	 JSON.stringify(flow_record)	,
// 	 					"record_proc"   :    JSON.stringify(record_list)
// 	 				};
// 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
//					if(json.code == 0){
//						layer.alert('跟进成功!',9);
//						location.reload();
//					}else{
//						layer.alert(json.msg,8);
//					}
//				}, param, true);
// 	 		});
// 		},
// 		//时间绑定
// 		dateBind : function(obj,AddDayCount){
// 			var d = new Date();
// 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
// 			var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
// 			obj.val(newDate);
// 		},
// 		//时间绑定
// 		serviceDateBind : function(obj,AddDayCount){
// 			var d = new Date();
// 			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
// 			//var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
// 			var newDate = d.getFullYear()+"/"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"/"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes());
// 			$.each(obj,function(i,input){
// 				if($(this).val() == ""){
// 					$(this).val("请选择办结时间");
// 				}
// 			});
// 			obj.datetimepicker({
// 				lang		:	'ch',
// 				minDate		: 	newDate
// 			});
// 		},
// 		//转派
// 		recordProc_2 : function(demand_id,opt_time,record_id,data,currNode_id){
// 			currSelector.find("#toA").unbind("click").bind("click",function(){
// 				var to_name = $("#to_name").attr("staffs");
// 				var loginCode = $("#to_name").attr("loginCode");
// 				var mobTel = $("#to_name").attr("mobTel");
// 				if(to_name == null || to_name.length < 1){
// 					layer.alert("请选择转派人",8);
// 					return ;
// 				}
// 				var to_desc = $("#demandInfo").find("#to_desc").val();
// 				
// 				if(to_desc == null || to_desc.length < 1) {
// 					layer.alert("请填写转派说明",8);
// 					return;
// 				}
// 				var record_list = new Array();
// 				var record_proc_1 =  {"attr_id" : '6' ,  
// 						"attr_value" : to_name ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : '3'
// 				      } ;
// 				var record_proc_2 =  {"attr_id" : '10' , 
// 						"attr_value" : to_desc ,
// 						"busi_id" : demand_id ,
// 						"attr_group" : '3'
// 				      } ;
// 				record_list.push(record_proc_1);
// 				record_list.push(record_proc_2);
// 				var default_opt_id = '' ;
// 				var default_opt_name = '' ;
// 				var staffStr  = to_name.split(',');
// 				default_opt_id = staffStr[1];
// 				default_opt_name = staffStr[0] ;
// 				var org_id = staffStr[2];
//  				var param1 = {"orgId" : org_id,"staffId": default_opt_id,"handleType":"qryPoolRel"};
// 				var pool_id = '';
// 				var calim_limit = '';
// 				var flag = false ;
// 				var demand = {"demand_id" : data.demandInst.demand_id,"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
//  				$.jump.ajax(URL_CLAIM_DEMAND.encodeUrl(), function(data) {
//  					if(data.code == 0){
//  						if(data.poolLst !=null && data.poolLst.length > 0){
//  							$.each(data.poolLst,function(key,obj){
//  		 						pool_id = pool_id +obj.pool_id+ ',';
//  		 						calim_limit = obj.calim_limit;
//  							});
//   							var flow_record = { 
//   									"next_node_id"   			: 		"100101"								,
//   									"calim_limit"				:		calim_limit								,
//  									"next_node_name"   			: 		"待认领"									,
//  									"urge_count"   				: 		"0"										,
//  									"busi_id"   				: 		demand_id								,
//  									"opt_desc"   				: 		''										,
//  									"opt_time"   				: 		opt_time								,
//  									"default_opt_id" 			: 		default_opt_id							,
//  									"default_opt_name" 			:		default_opt_name						,
//  									"record_id" 				: 		record_id								,
//  									"opt_id" 					: 		pool_id.substring(0,pool_id.length-1) 	,
//  									"opt_name" 					: 		'转派到单池'								,
//  									"opt_type" 					: 		"liuzhuan"								,
//  									"funTypeId"					:		"100007"								,
//  									"currNode_id"				:		currNode_id
//  		 					};
//  		 				
//  		 				var param = {
//  		 						"handleType"	:	"3"								 ,
//  		 	 					"demand" 	    : 	 JSON.stringify(demand	)		 ,
//  		 	 					"flow_record"	:	 JSON.stringify(flow_record	)    ,
//  		 	 					"record_proc"   :    JSON.stringify(record_list)	 ,
//  		 	 					"loginCode"		:	 loginCode						 ,
//  		 	 				    "mobTel"		:	 mobTel							 ,
//  		 	 				    "to_name"		:	 default_opt_name
//  		 	 				};
//  		 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
//  							if(json.code == 0){
//  								layer.alert('转派成功!',9);
//  								$("#to_name").val('');
//  								$("#to_name").removeAttr("staffs");
//  								location.reload() ;
//  							}else{
//  								layer.alert(json.msg,8);
//  							}
//  						}, param, true);
//  						}else {
//  							layer.alert("该员工没有归属单池,不能转派!",8);
//  							flag = true ;
//  						}
//						
// 					}else{
//						layer.alert(data.msg,8);
//						flag = true ;
//					}
//				}, param1, true);
//  			  
// 	 		});
// 		},
// 		
// 		//拆分
// 		splitDemand : function(demand_id,opt_time,record_id,data){
// 			currSelector.find("a[name=addSplit]").unbind("click").bind("click",function(){
// 				
// 				var flag = true;
// 				var splitInfos =  currSelector.find("tr[name=splitInfo]");
// 				$.each(splitInfos,function(i,obj){
// 					var splitName = $(obj).find("input[name=splitName]").val();
// 					var isSave = $(obj).find("input[name=splitName]").attr("isSave");
// 					var overLimit = $(obj).find("input[name=overLimit]").val();
// 					if((splitName == "" || overLimit =="") && isSave == "true"){
// 						flag = false;
// 						layer.alert("拆分人员与办结时间不能为空",8);
// 						return false;
// 					};
// 				});
// 				if(flag){
// 					var html=[];
// 	 				html.push('<tr name="splitInfo">');
// 	 				html.push('<td style="width:50px;text-align:center">'+(splitInfos.length)+'</br><img src="../../../web/images/delete.png" alt="" name="delSplitInfo"></td>');
// 	 				html.push('<td style="width: 200px;text-align:center"><input name="splitName" isSave="true" type="text" disabled="disabled" style="width:100px;"><a href="#" class="but" name="splitStaff">选择</a></td>');
// 	 				html.push('<td style="width:200px;text-align:center"><textarea name="splitDesc" type="text" style="width: 150px;"></textarea></td>');
// 	 				html.push('<td style="width:150px;text-align:center"><input name="overLimit" type="text" readonly style="width:140px;"></td>');
// 	 				html.push('</tr>');
// 	 				currSelector.find("tr[name=handleInfo]").before(html.join(''));
// 	 				
// 	 				temp.serviceDateBind(currSelector.find("input[name=overLimit]"), 0);
// 	 				//删除该行信息
// 	 				currSelector.find("img[name=delSplitInfo]").unbind("click").bind("click",function(){
// 	 					$(this).parents("tr[name=splitInfo]").remove(); 
// 	 				});
// 	 				temp.bindSplitStaff();//拆分人员选择
// 				}
// 			});
// 			temp.bindSplitStaff();//拆分人员选择
// 			currSelector.find("a[name=conSplit]").unbind("click").bind("click",function(){
// 				var splitInfos =  currSelector.find("tr[name=splitInfo]");
// 				var conSplitName = "";
// 				var serviceInfoLst = [];
// 				var flag = true; //是否提示
// 				var saveProcFlag = true;
// 				$.each(splitInfos,function(i,obj){
// 					var splitName = $(obj).find("input[name=splitName]").val();
// 					var isSave = $(obj).find("input[name=splitName]").attr("isSave");
// 					var overLimit = $(obj).find("input[name=overLimit]").val();
// 					var splitDesc = $(obj).find("textarea[name=splitDesc]").val();
// 					if(splitName != "" && isSave == "true" && overLimit != ""){
// 						
// 						if(splitDesc == ""){
// 							flag = false;
// 							layer.alert("服务标题不能为空",8);
// 							return;
// 						}
// 						
// 						if(overLimit == "" || overLimit == "请选择办结时间"){
// 							flag = false;
// 							layer.alert("请选择办结时间",8);
// 							return;
// 						}
// 						var splits =$(obj).find("input[name=splitName]").attr("staffs").split(',');
// 						var loginCode = $(obj).find("input[name=splitName]").attr("logincode");
// 						var mobTel = $(obj).find("input[name=splitName]").attr("mob_tel"); 
// 						conSplitName = conSplitName+splitName+",";
// 						var param = {
// 								"splitId"		:	splits[1]		,
// 								"splitName"		:	splitName		,
// 								"splitDesc"		:	splitDesc		,
// 								"overLimit"		:	overLimit		,
// 								"loginCode"		:	loginCode		,
// 								"mobTel"		:	mobTel
// 						};
// 						serviceInfoLst.push(param);
// 					}else if(isSave != "true" && saveProcFlag){
// 						saveProcFlag = false;
// 					}
// 				});
// 				var record_list = new Array();
// 				var d = new Date();
// 	 			var newDate = d.getFullYear()+"-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
// 				if(saveProcFlag){
// 					var record_proc =  {
//	 						"attr_id" 			: 		'15' ,  
//	 						"attr_value" 		: 		newDate ,
//	 						"busi_id" 			: 		demand_id ,
//	 						"attr_group" 		: 		'6'
//	 				      } ;
//	 			   record_list.push(record_proc);
// 				}
// 				
// 				if(flag){
// 					if(serviceInfoLst.length == 0){
// 						layer.alert("无新服务单，无需拆分",8);
// 	 					return;
// 					}
// 				}else{
// 					return;
// 				}
// 				var msg = "您是否确认将需求单拆分给如下人员："+"</br>";
// 				msg +=conSplitName.substring(0, conSplitName.length-1);
// 				$.layer({
//				    shade: [0],
//				    area: ['auto','auto'],
//				    dialog: {
//				        msg: msg,
//				        btns: 2,                    
//				        type: 4,
//				        btn: ['确定','取消'],
//				        yes: function(){
//	  		 				var param = {
//	  		 	 					"serviceInfo" 	    : 	 JSON.stringify(serviceInfoLst)		,
//	  		 	 					"record_proc"   	:    JSON.stringify(record_list)	 	,
//	  		 	 					"demandId"			:	 demand_id							,
//	  		 	 					"record_id"			:	 record_id
//	  		 				};
//	  		 				$.jump.ajax(URL_SAVE_SERVICE_INFO.encodeUrl(), function(json) {
//	  							if(json.code == 0){
//	  								layer.alert('拆分成功!',9);
//	  								location.reload() ;
//	  							}else{
//	  								layer.alert(json.msg,8);
//	  							}
//	  						}, param, true);
//				        }
//				    }
//				});
// 	 		});
// 		},
// 		//拆分绑定人员选择
// 		bindSplitStaff : function(){
// 			currSelector.find("a[name=splitStaff]").unbind("click").bind("click",function(){
//				 var parentObj =this ;
//  				$.jump.loadHtml("sysRegionDiv","SysRegion.html",function(){
// 					$("#demandInfo_list_main").hide();
// 					parentObj.sysRegion = new SysRegion();
// 					//temp.staff_style = 0 ; //只查询综支中心
// 					parentObj.sysRegion.init(1,temp,function(){
// 						var staffName = '' ;
// 						var staffs = '' ;
// 						var loginCode = '';
// 						var mob_tel = '';
//   						$("#sysRegion").hide();
//  			 			$("#demandInfo_list_main").show();
//   			 			$.each(this.getChooseStaffs(),function(key,obj){
//  			 				staffName = staffName + obj.staff_name + ',';
//  			 				staffs  = staffs + obj.staff_name + ','+ obj.staff_id + ','+ obj.org_id + ',';
//  			 				loginCode = obj.login_code;
//  			 				mob_tel = obj.mob_tel;
//  						});
//   			 			var parentTdObj = $(parentObj).parent();
//   			 			parentTdObj.find("input[name=splitName]").val(staffName.substring(0, staffName.length-1));
//   			 			parentTdObj.find("input[name=splitName]").attr("staffs", staffs.substring(0, staffs.length-1));
//   			 			parentTdObj.find("input[name=splitName]").attr("loginCode", loginCode);
//   			 			parentTdObj.find("input[name=splitName]").attr("mob_tel", mob_tel);
//   			 			temp = temp.parentObj;
//   			 			currSelector = $("#demandInfo");
// 					});
// 				},null);
//			});
// 		},
// 		//组织机构
// 		sys_region : function(currNode_id){
// 			currSelector.find("#chooseStaff").unbind("click").bind("click",function(){
// 				
//  			    var parentObj =this ;
//  				$.jump.loadHtml("sysRegionDiv","SysRegion.html",function(){
// 					$("#demandInfo_list_main").hide();
// 					parentObj.sysRegion = new SysRegion();
// 					if(currNode_id == '200102'){
// 						temp.staff_style = 2 ; //只查询区综支中心
// 					}else{
// 						temp.staff_style = 1 ; //只查询综支中心
// 					}
// 					temp.staff_flag = "true";
// 					parentObj.sysRegion.init(1,temp,function(){
// 						var staffName = '' ;
// 						var staffs = '' ;
// 						var loginCode = '';
//	 					var mobTel = '';
//   						$("#sysRegion").hide();
//  			 			$("#demandInfo_list_main").show();
//   			 			$.each(this.getChooseStaffs(),function(key,obj){
//  			 				staffName = staffName + obj.staff_name + ',';
//  			 				staffs  = staffs + obj.staff_name + ','+ obj.staff_id + ','+ obj.org_id + ',';
//  			 				loginCode = obj.login_code;
//  			 				mobTel = obj.mob_tel;
//  						});
//  			 			$("#to_name").val(staffName.substring(0, staffName.length-1));
//  			 			$("#to_name").attr("staffs", staffs.substring(0, staffs.length-1));
//  			 			$("#to_name").attr("loginCode", loginCode);
//  			 			$("#to_name").attr("mobTel", mobTel);
//   			 			temp = temp.parentObj;
// 					});
// 				},null);
// 				 
// 	 		});
// 		},
// 		//上报绑定
// 		toReportBind : function(demand_id,opt_time,record_id,data){
// 			currSelector.find("a[name=toReport]").unbind("click").bind("click",function(){
// 				var reportExplain = currSelector.find("textarea[name=reportExplain]").val();
// 				if(reportExplain == null || reportExplain.length < 1) {
// 					layer.alert("请填写上报说明",8);
// 					return;
// 				}
// 				var record_list = new Array();
// 				var record_proc =  {
// 						"attr_id" 			: 		'13' 				,  
// 						"attr_value" 		: 		reportExplain 		,
// 						"busi_id" 			: 		demand_id 			,
// 						"attr_group" 		: 		'3'
// 				      } ;
// 				record_list.push(record_proc);
// 				var d = new Date();
// 	 			var newDate = d.getFullYear()+"-"+((d.getMonth()+1)<10 ? "0" + (d.getMonth()+1) : (d.getMonth()+1))+"-"+(d.getDate()<10 ? "0"+ d.getDate() : d.getDate())+" "+(d.getHours()<10 ? "0"+ d.getHours() : d.getHours())+":"+(d.getMinutes()<10 ? "0" + d.getMinutes() : d.getMinutes())+":"+(d.getSeconds()<10 ? "0" + d.getSeconds() : d.getSeconds());
// 				var record_proc =  {
// 						"attr_id" 			: 		'14' 				,  
// 						"attr_value" 		: 		newDate 		,
// 						"busi_id" 			: 		demand_id 			,
// 						"attr_group" 		: 		'3'
// 				      } ;
// 				record_list.push(record_proc);
// 				
// 				var demand = {"demand_id" : data.demandInst.demand_id,"tel" : data.demandInst.tel,"demand_theme":data.demandInst.demand_theme};
// 	 			var flow_record = {
// 	 						"funTypeId"				:   "100006"   		,//上报
// 	 						"urge_count"   			: 	"0"				,
// 							"busi_id"    			: 	demand_id		,
// 							"opt_desc"   			: 	''				,
// 							"opt_time"   			: 	opt_time		,
// 							"record_id" 			: 	record_id		,
// 							"flagType"				:	"3"				, //锁单
// 							"regionName"			:	data.regionName
// 					};
// 				
// 				var param = {
// 						"handleType"	:	"5"								 ,
// 						"demand" 	    : 	 JSON.stringify(demand	)		 ,
// 						"flow_record"	:	 JSON.stringify(flow_record	)    ,
// 						"record_proc"   :    JSON.stringify(record_list)	 ,
// 					};
// 				$.jump.ajax(URL_FLOW_RECORD.encodeUrl(), function(json) {
// 					if(json.code == 0){
// 						layer.alert('上报成功!',9);
// 						location.reload() ;
// 					}else{
// 						layer.alert(json.msg,8);
// 					}
// 				}, param, true);
// 			});
// 			
// 		}
};
 


$(document).ready(function(){
	var orderDetail = new OrderDetail();
	orderDetail.init();
});

