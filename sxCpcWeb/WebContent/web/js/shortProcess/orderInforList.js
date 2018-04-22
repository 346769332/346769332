var  OrderInforList= new Function();

OrderInforList.prototype = {
	
	selecter : "#orderInforPage",
	pageSize : 10,
	//初始化执行
	init : function(orderInfor) {
	     debugger;
	    this.paramObj=orderInfor;
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
	  parentThis.orderInforList(parentThis,0);
	  
	 var backObj=parentThis.selecter.findById("a","back")[0];
		backObj.unbind("click").bind("click",function(){
			  var userType=parentThis.paramObj.userType;
			  var areaNo=parentThis.paramObj.areaNo;
			  var billingNo=parentThis.paramObj.billingNo;
			$.jump.loadHtmlForFun("/web/html/shortProcess/fullBusinessProcessList.html".encodeUrl(),function(pageHtml){
				$("#content").html(pageHtml);
			var	fullBusiObj ={
					"userType"	: userType,
					"areaNo"	: areaNo,
					"billingNo"	: billingNo
					
				};
				var fullBusinessProcessList=new FullBusinessProcessList();
				fullBusinessProcessList.init(fullBusiObj);
			});
		});
		
		
	},
	
	
	
	//查询短流程
	orderInforList : function(parentThis,pageIndex) {
		var mainsn=parentThis.paramObj.mainsnObj;
		var mainid=parentThis.paramObj.mainidObj;
		  var param = {
				"mainsn"	 :	mainsn,
				"mainid"	 :	mainid,
				"flags"	 :	"orderInfor"
		  };
		var orderInforListBody = $("#orderInforListBody");
		var orderInforListFoot = $("#orderInforListFoot");
		common.pageControl.start(URL_QUERY_FULL_BUSINESS_PROCESS.encodeUrl(),
								 pageIndex,
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 orderInforListFoot,
								 "",
								 function(data,dataSetName,showDataSpan){
		     orderInforListBody.html("");
			 parentThis.createListHtml(parentThis,data,orderInforListBody);
		   });
		   
		
		
     },
     
	 createListHtml: function(parentThis,data,orderInforListBody){
		var html=[];
		var dataLst = data.data;
		var orderInforListFoot = $("#orderInforListFoot");
		if(dataLst.length > 0 ){
		  orderInforListFoot.show();
			var obj = eval("("+dataLst+")");
			$.each(obj,function(i,obj1){
				html.push();
				html.push('<tr id="ids"'+i+'>');
				/*var orderId = obj1.ORDERID;
			    if(orderId.length>6){
					orderId = orderId.substring(0,6);	
				}*/
				html.push('<td title='+obj1.ORDERID+'>'+obj1.ORDERID+'</td>');
				
				var orderLink = obj1.ORDERLINK;
			    if(orderLink.length>6){
					orderLink = orderLink.substring(0,6);	
				}
				html.push('<td title='+obj1.ORDERLINK+'>'+orderLink+'</td>');
				
				var orderServe = obj1.ORDERSERVE;
			    if(orderServe.length>6){
					orderServe = orderServe.substring(0,6);	
				}
				html.push('<td title='+obj1.ORDERSERVE+'>'+orderServe+'</td>');
				
				var orderState = obj1.ORDERSTATE;
			    if(orderState.length>6){
					orderState = orderState.substring(0,6);	
				}
				html.push('<td title='+obj1.ORDERSTATE+'>'+orderState+'</td>');
				
				var orderType = obj1.ORDERTYPE;
			    if(orderType.length>6){
					orderType = orderType.substring(0,6);	
				}
				html.push('<td title='+obj1.ORDERTYPE+'>'+orderType+'</td>');
				
				var receiver = obj1.RECEIVER;
			    if(receiver.length>6){
					receiver = receiver.substring(0,6);	
				}
				html.push('<td title='+obj1.RECEIVER+'>'+receiver+'</td>');
				
				var executor = obj1.EXECUTOR;
			    if(executor.length>6){
					executor = executor.substring(0,6);	
				}
				html.push('<td title='+obj1.EXECUTOR+'>'+executor+'</td>');
				
				html.push('<td>'+obj1.CONTACT+'</td>');
				
				var orderResult = obj1.ORDERRESULT;
			    if(orderResult.length>6){
					orderResult = orderResult.substring(0,6);	
				}
				html.push('<td title='+obj1.ORDERRESULT+'>'+orderResult+'</td>');
				
				var starteTime = obj1.STARTETIME;
			    if(starteTime.length>10){
					starteTime = starteTime.substring(0,10);	
				}
			    
			    html.push("<td title='"+obj1.STARTETIME+"'>"+starteTime+"</td>");
				var endTime = obj1.ENDTIME;
			    if(endTime.length>10){
					endTime = endTime.substring(0,10);	
				}
				html.push("<td title='"+obj1.ENDTIME+"'>"+endTime+"</td>");
				
				html.push('</tr>');	
				
			});
		}else{
				orderInforListFoot.hide();
				html.push('<tr>');
				html.push('<td  colspan="11">无相关数据</td>');
				html.push('</tr>');
		}
	     orderInforListBody.html(html.join(''));
	 
		
	  }
  
	
};