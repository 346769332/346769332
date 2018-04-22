var OrderSendzsave = new Function() ;
OrderSendzsave.prototype = {
		
		selecter : "#orderSendPage",
		regionCode :null,
		temp : null  ,
		base : null,
		pageSize : 10,
		//初始化执行
		init : function(statusparam) {
			if(!common.utils.isNull(statusparam)){
				this.regionCode=eval("("+statusparam+")").regionCode;
			}
			this.bindMetod(this);
		},
		//绑定事件
		bindMetod : function(parentThis){
			var sendDateObj = parentThis.selecter.findById("input","sendDate")[0];
			parentThis.dateBind(sendDateObj,0);
			var clearSendDateObj = parentThis.selecter.findById("img","clearSendDate")[0];
			clearSendDateObj.unbind("click").bind("click",function(){
				sendDateObj.val("");
			});			
			/************日期查询绑定*********/		
			var seniorObj = parentThis.selecter.findById("a","senior")[0];
			    seniorObj.unbind("click").bind("click",function(){
				parentThis.queryPageList(parentThis,0);
			});
		
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];
			sendUserNameObj.unbind("click").bind("click",function(){

				
				common.loadding("open");
				  var parentObj =this ;
					$.jump.loadHtml("sysRegionDiv","html/orderDetail/SysRegion.html",function(){
						common.loadding("close");
						
						$("#sysRegionDiv").show();
						$("#topHeader").hide();
						$("#content").hide();
						parentObj.sysRegion = new SysRegion();
						
						parentObj.sysRegion.init(1,parentThis,function(){
							
							
							var staffName = '' ;
							var staffId = '' ;
							
	 						$("#sysRegionDiv").hide();
				 			$("#topHeader").show();
				 			$("#content").show();
	 			 			$.each(this.getChooseStaffs(),function(key,obj){
				 				staffName = staffName + obj.staff_name + ',';
				 				staffId  = staffId + obj.staff_id + ',';
				 				
				 				
							});
	 			 			sendUserNameObj.val(staffName.substring(0, staffName.length-1));
	 			 			sendUserNameObj.attr("staffId",staffId.substring(0, staffId.length-1));
	 			 			
	   			 			parentThis = temp.parentObj;
						},'AAA');
					},null);
			
			});		
			//查看并发起操作
			var sendObj = parentThis.selecter.findById("a","send")[0]; 
			sendObj.unbind("click").bind("click",function(){
				var authInfo="";
				var demand_id="";
				var tbodyObj= parentThis.selecter.findById("tbody","authListBody")[0];
				tbodyObj.find("input[type=checkbox][name=authInfoBox]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						var trObj=boxObj.parent().parent("tr[name=authInfo]");
						demand_id=trObj.attr("id");
						//获取选中需求单的ID，名称等信息
						 authInfo={
								"demand_id"			    :		trObj.attr("id"),
								"demand_theme"			:		trObj.attr("demand_theme"),
								"demand_details"		:		trObj.attr("demand_details"),
								"department"			:		trObj.attr("department"),
								"promoters"		        :		trObj.attr("promoters"),
								"department_id"			:		trObj.attr("department_id"),
								"promoters_id"		    :		trObj.attr("promoters_id"),
								"tel"                   :       trObj.attr("tel"),
								"operator_id"           :       trObj.attr("operator_id"),
								"operator_name"         :       trObj.attr("operator_name"),
								"rank_id"               :       trObj.attr("rank_id"),//发单等级
								"regionCode"  :   parentThis.regionCode
						};
						
					}
				});
				if(demand_id.length==0){
					layer.alert("请选择需求主题",8);
					return false;
				}
				$.jump.loadHtmlForFun("/web/html/orderSend/orderSends.html".encodeUrl(),function(menuHtml){
					$("#content").html(menuHtml);
					var orderSends =new OrderSends();
					orderSends.init(authInfo);
				});	
				
			});
			//删除操作
			var deleteObj= parentThis.selecter.findById("a","delete")[0]; 
			deleteObj.unbind("click").bind("click",function(){
				var demand_id="";			
				var tbodyObj= parentThis.selecter.findById("tbody","authListBody")[0];
				tbodyObj.find("input[type=checkbox][name=authInfoBox]").each(function(i,obj){
					var boxObj=$(this);
					if(boxObj.is(':checked')){
						var trObj=boxObj.parent().parent("tr[name=authInfo]");
						//获取选中需求单的ID，名称等信息
						demand_id=trObj.attr("id");	
						
					}
					});	 
				if(demand_id.length==0){
					layer.alert("请选择需求主题",8);
					return false;
				}
				params={
						"demand_id": demand_id,
						"handleType"	:	"deleteDemand"
				};
				var confirm=layer.confirm('您是否确认删除？', function(){
					
					$.jump.ajax(SHOW_DEMAND_DRAFT_LIST_LST.encodeUrl(), function(json) {
						if(json.code == "0" ){
							layer.close(confirm);							
							parentThis.queryPageList(parentThis,0);
						}else{
							layer.msg("删除失败!");	
						};
					}, params, false,false);
				});
				
			});
//			
			parentThis.queryPageList(parentThis,0);
			
		},
		
		queryPageList : function(parentThis,pageIndex) {	
			var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
			var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
			var sendUserNameObj = parentThis.selecter.findById("input","sendUserName")[0];//发起人
		
			 param={
					      "handleType"	        :	    "getDemandALL",
						  "sendDate"		    :		sendDateObj.val()				,					
						  "themeSeach"	        :		themeSeachObj.val()				,
						  "sendUserName"	    :		sendUserNameObj.attr("staffid")	,
						
			 };
			 
			var listFootObj = parentThis.selecter.findById("div","authListFoot")[0];
			common.pageControl.start(SHOW_DEMAND_DRAFT_LIST_LST.encodeUrl(),
									 pageIndex,
									 parentThis.pageSize,
									 param,
									 "data",
									 null,
									 listFootObj,
									 "",
									 function(data,dataSetName,showDataSpan){
				var listBodyObj = parentThis.selecter.findById("tbody","authListBody")[0];
				listBodyObj.html("");
				parentThis.createLstHtml(parentThis,data,listBodyObj);
			});
		},
		//创建HTML
		createLstHtml : function(parentThis,data,listBodyObj){
			var html=[];
			var dataLst = data.data;
			
			var listFootObj = parentThis.selecter.findById("div","authListFoot")[0];
			if(dataLst.length > 0 ){
				listFootObj.show();
				$.each(data.data,function(i,obj){
					html.push('<tr name="authInfo" id="'+obj.demand_id+'" demand_theme="'+obj.demand_theme+'" demand_details="'+obj.demand_details+'" department="'+obj.department+'" promoters="'+obj.promoters+'" tel="'+obj.tel+'" promoters_id="'+obj.promoters_id+'" department_id="'+obj.department_id+'"  operator_id="'+obj.operator_id+'" operator_name="'+obj.operator_name+'" rank_id="'+obj.rank_id+'" rank_name="'+obj.rank_name+'">');
					html.push('<td  ><input id="authInfoBox_'+obj.demand_id+'" name="authInfoBox" type="checkbox" ></td>');
					html.push('<td  >'+obj.demand_theme+'</td>');
					html.push('<td  >无</td>');
					html.push('<td  >'+obj.create_time+'</td>');					
					html.push('<td  >无限期</td>');	
					html.push('<td >');				
					html.push('</tr>');
				});
			}else{
				listFootObj.hide();
				html.push('<div>');
				html.push('<div>无相关数据</div>');
				html.push('<div>');
			}
			listBodyObj.html(html.join(''));
			
			var tbodyObj= parentThis.selecter.findById("tbody","authListBody")[0];
			tbodyObj.find("input[type=checkbox][name=authInfoBox]").unbind("click").bind("click",function(){
				var id=$(this).attr("id");
				var flag=$(this).is(':checked');
				tbodyObj.find("input[type=checkbox][name=authInfoBox]").each(function(i,obj){
					if(id==$(obj).attr("id")){
						$(obj).attr('checked',flag);
					}else{
						$(obj).attr('checked',false);
					}
				});
			});
		},
		//时间绑定
		dateBind : function(obj,AddDayCount){
			var d = new Date();
			d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
			//obj.val(d.getFullYear() + "-"+(d.getMonth()+1)+"-"+d.getDate());
			obj.datetimepicker({
				
				lang:'ch',
				minView: "month",
				timepicker:false,
				format:'Y-m-d',
				formatDate:'Y-m-d',
			});
		},
};


