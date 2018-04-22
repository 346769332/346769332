var  FullBusinessProcessList = new Function();

FullBusinessProcessList.prototype = {
	
	selecter : "#fullBusinessProcessPage",
	pageSize : 10,
	//初始化执行
	init : function(fullBusiObj) {
	    debugger;
	      this.paramObj=fullBusiObj;
		  this.bindMetod(this);
		 
	},
	bindMetod : function(parentThis) {
		var fullBusinessProcessBody = $("#fullBusinessProcessBody");
		parentThis.showPointHtml(parentThis,"",fullBusinessProcessBody);
		
		
		
		
		//查询功能
		var searchObj =  parentThis.selecter.findById("a","search")[0];
		parentThis.dataQryBind(searchObj,parentThis);
		
		//清空功能 
		/*var resetObj=parentThis.selecter.findById("a","reset")[0];
		resetObj.unbind("click").bind("click",function(){
			$("#userType").val("0");
			$("#areaNo").val("");
			$("#billingNo").val("");
		});*/
		
		
		var userType=parentThis.paramObj.userType;
	    var areaNo=parentThis.paramObj.areaNo;
	    var billingNo=parentThis.paramObj.billingNo;
	    if(typeof(userType)!='undefined'&&typeof(areaNo)!='undefined'&&typeof(billingNo)!='undefined'){
	    	$("#reUserType").val(userType);
		    $("#reAreaNo").val(areaNo);
		    $("#reBillingNo").val(billingNo);
		  parentThis.backFullBusinessProcessList(parentThis,userType,areaNo,billingNo);
	    }
		
		
		$('#orderInfor').unbind("click").bind("click",function(){
		  
		   
			var mainsnObj=$('#fullBusinessProcessBody').find('input[name=mainIds]:checked').attr('MAINSN');
			var mainidObj=$('#fullBusinessProcessBody').find('input[name=mainIds]:checked').attr('MAINID');
			
			var userType= $("#reUserType").val();
			var areaNo= $("#reAreaNo").val();
			var billingNo= $("#reBillingNo").val();
			if(typeof(mainsnObj)!='undefined'&&typeof(mainidObj)!='undefined'){
				$.jump.loadHtmlForFun("/web/html/shortProcess/orderInforList.html".encodeUrl(),function(pageHtml){
					$("#content").html(pageHtml);
					orderInfor = {
								"mainsnObj"	:	mainsnObj,
								"mainidObj"	:	mainidObj,
								"userType"	:   userType,
								"areaNo"	:   areaNo,
								"billingNo"	:   billingNo
						};
					var orderInforList=new OrderInforList();
					 orderInforList.init(orderInfor);
			   });
			}else{
				
				layer.alert("请您选择查询数据后,再点击工单信息!!!",8);
			}
			
			
		});
		
		
		
		
		
	},
	//查询绑定
	dataQryBind : function(searchObj,parentThis){
		searchObj.unbind("click").bind("click",function(){
			parentThis.fullBusinessProcessList(parentThis,0);
		});
	},
	
	
	
	//返回查询短流程
	backFullBusinessProcessList : function(parentThis,userType,areaNo,billingNo) {
		  var param = {
				"userType"	 :	userType,
				"areaNo"	 :	areaNo,
				"billingNo"	 :	billingNo,
				"flags"	 :	"fullBus"
		  };
		var fullBusinessProcessBody = $("#fullBusinessProcessBody");
		var fullBusinessProcessyFoot = parentThis.selecter.findById("div","fullBusinessProcessyListFoot")[0];
		fullBusinessProcessyFoot.html("");
		common.pageControl.start(URL_QUERY_FULL_BUSINESS_PROCESS.encodeUrl(),
								 '0',
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 fullBusinessProcessyFoot,
								 "",
								 function(data,dataSetName,showDataSpan){
		     fullBusinessProcessBody.html("");
		     fullBusinessProcessBody.show();
			 parentThis.createLstHtml(parentThis,data,fullBusinessProcessBody);
		   });
		   
     },
	
	
	
	
	//查询短流程
	fullBusinessProcessList : function(parentThis,pageIndex) {
		var userType = parentThis.selecter.findById("select","userType")[0].val();
		var areaNo = parentThis.selecter.findById("select","areaNo")[0].val();
		var billingNo = parentThis.selecter.findById("input","billingNo")[0].val();
		$("#reUserType").val(userType);
		$("#reAreaNo").val(areaNo);
		$("#reBillingNo").val(billingNo);
		
		if(userType!=""&&areaNo!=""&&billingNo!=""){
		  var param = {
				"userType"	 :	userType,
				"areaNo"	 :	areaNo,
				"billingNo"	 :	billingNo,
				"flags"	 :	"fullBus"
		  };
		var fullBusinessProcessBody = $("#fullBusinessProcessBody");
		var fullBusinessProcessyFoot = parentThis.selecter.findById("div","fullBusinessProcessyListFoot")[0];
		fullBusinessProcessyFoot.html("");
		common.pageControl.start(URL_QUERY_FULL_BUSINESS_PROCESS.encodeUrl(),
								 '0',
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 fullBusinessProcessyFoot,
								 "",
								 function(data,dataSetName,showDataSpan){
		     fullBusinessProcessBody.html("");
		     fullBusinessProcessBody.show();
			 parentThis.createLstHtml(parentThis,data,fullBusinessProcessBody);
		   });
		   
		}else{
			layer.alert("'号码类型'、'区号'、'查询值'三个为必填项，请注意填写！！",8);
		}
		
     },
     
	showPointHtml: function(parentThis,data,fullBusinessProcessBody){
		var html=[];
		var dataLst = data.data;
		var fullBusinessProcessyFoot = parentThis.selecter.findById("div","fullBusinessProcessyListFoot")[0];
			fullBusinessProcessBody.hide();
			html.push('<div>');
			html.push('<div>无相关数据,请点击查询!!!</div>');
			html.push('<div>');
	      fullBusinessProcessyFoot.html(html.join(''));
	  },
	  
	 createLstHtml: function(parentThis,data,fullBusinessProcessBody){
		var html=[];
		var dataLst = data.data;
		var fullBusinessProcessyFoot = parentThis.selecter.findById("div","fullBusinessProcessyListFoot")[0];
		if(dataLst.length > 0 ){
		  fullBusinessProcessyFoot.show();
			var obj = eval("("+dataLst+")");
			debugger;
			
			$.each(obj,function(i,obj1){
				html.push();
				html.push('<tr id="ids"'+i+'>');
				html.push('<td><input id="mainIds'+i+'" type="checkbox" name="mainIds"  MAINID='+obj1.MAINID+'  MAINSN='+obj1.MAINSN+'></td>');
				var mainsn = obj1.MAINSN;
			  /*  if(mainsn.length>6){
					mainsn = mainsn.substring(0,6);	
				}*/
				html.push('<td title='+obj1.MAINSN+'>'+mainsn+'</td>');
				var mainTitle = obj1.MAINTITLE;
			    if(mainTitle.length>6){
					mainTitle = mainTitle.substring(0,6);	
				}
				html.push('<td title='+obj1.MAINTITLE+'>'+mainTitle+'</td>');
				var billingno = obj1.BILLINGNO;
			    if(billingno.length>6){
					billingno = billingno.substring(0,6);	
				}
				html.push('<td title='+obj1.BILLINGNO+'>'+billingno+'</td>');
				var type = obj1.TYPE;
			    if(type.length>6){
					type = type.substring(0,6);	
				}
				html.push('<td title='+obj1.BILLINGNO+'>'+type+'</td>');
				
				var state = obj1.STATE;
			    if(state.length>6){
					state = state.substring(0,6);	
				}
				html.push('<td title='+obj1.STATE+'>'+state+'</td>');
				var serve = obj1.SERVE;
			    if(serve.length>6){
					serve = serve.substring(0,6);	
				}
				html.push('<td title='+obj1.SERVE+'>'+serve+'</td>');
				var CustBillCode = obj1.CUSTBILLCODE;
			    if(CustBillCode.length>10){
					CustBillCode = CustBillCode.substring(0,10);	
				}
				html.push('<td title='+obj1.CUSTBILLCODE+'>'+CustBillCode+'</td>');
				
				var ApplyTime = obj1.APPLYTIME;
			    if(ApplyTime.length>10){
					ApplyTime = ApplyTime.substring(0,10);	
				}
				html.push("<td title='"+obj1.APPLYTIME+"'>"+ApplyTime+"</td>");
				
				var area = obj1.AREA;
			    if(area.length>6){
					area = area.substring(0,6);	
				}
				html.push('<td title='+obj1.AREA+'>'+area+'</td>');
				
				var region = obj1.REGION;
			    if(region.length>6){
					region = region.substring(0,6);	
				}
				html.push('<td title='+obj1.REGION+'>'+region+'</td>');
				var receiver = obj1.RECEIVER;
			    if(receiver.length>6){
					receiver = receiver.substring(0,6);	
				}
				html.push('<td title='+obj1.RECEIVER+'>'+receiver+'</td>');
				
				var telephone = obj1.TELEPHONE;
			    if(telephone.length>6){
					telephone = telephone.substring(0,6);	
				}
				html.push('<td title='+obj1.TELEPHONE+'>'+telephone+'</td>');
				
				html.push('</tr>');	
				
			});
		}else{
				fullBusinessProcessyFoot.hide();
				html.push('<tr>');
				html.push('<td  colspan="12">无相关数据</td>');
				html.push('</tr>');
		}
	   fullBusinessProcessBody.html(html.join(''));
	   
		var tbodyObj= parentThis.selecter.findById("tbody","fullBusinessProcessBody")[0];
		 tbodyObj.find("input[type=checkbox][name=mainIds]").unbind("click").bind("click",function(){
			var id=$(this).attr("id");
			var flag=$(this).is(':checked');
			tbodyObj.find("input[type=checkbox][name=mainIds]").each(function(i,obj){
				if(id==$(obj).attr("id")){
					$(obj).attr('checked',flag);
				}else{
					$(obj).attr('checked',false);
				}
			});
		});
	 }
  
	
};