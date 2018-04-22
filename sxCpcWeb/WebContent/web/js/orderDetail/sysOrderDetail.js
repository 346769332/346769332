var SysOrderDetail = new Function() ;

SysOrderDetail.prototype = {
		flowRecordId : null ,
		isHistory : null ,
		handleType : null,
		currSelector : null ,
		temp : null  ,
		init : function (){
			temp = this ;
 			temp.GetRequest();
			currSelector = $("#sysInfo");
			if(temp.handleType != 'dispose'){
				currSelector.find("div[id="+temp.handleType+"]").show();
			}
			if(temp.handleType == "query"){
				currSelector.find("span[name=flowName]").text("查看");
			}
			temp.demandInfo();
		},
		GetRequest : function (){
			var url = location.search; //获取url中"?"符后的字串
			var theRequest = new Object();
			var str = url.substr(1);
		      strs = str.split("&");
		      for(var i = 0; i < strs.length; i ++) {
		         theRequest[strs[i].split("=")[0]]=(strs[i].split("=")[1]);
		      }
		      temp.flowRecordId = theRequest['flowRecordId'];
		      temp.isHistory = 'Y'; //默认全部展示
		      temp.handleType = theRequest['handleType'];
 		},
 		demandInfo : function(){
 			var param = {
 					"flowRecordId" 	: 		temp.flowRecordId			,
 					"isHistory"		:		temp.isHistory				 
 				};
 				$.jump.ajax(URL_QUERY_SYS_INFO.encodeUrl(), function(data) {
  					currSelector.find("#flow_record_id").html(data.sysInst.flow_record_id) ;
 					currSelector.find("#create_time").html(data.sysInst.create_time) ;
 					currSelector.find("#opter_name").html(data.sysInst.opter_name) ;
 					currSelector.find("#opter_org_name").html(data.sysInst.opter_org_name) ;
 					currSelector.find("#opt_status").html(data.sysInst.opt_status) ;
 					currSelector.find("#out_sys_id").html(data.sysInst.out_sys_id) ;
 					currSelector.find("#opt_remark").html(data.sysInst.opt_remark) ;
 					currSelector.find("#flow_theme").html('需求主题：'+data.sysInst.flow_name) ;
 					var recordSet = data.recordSet ;
 					var html = [];
 					$.each(recordSet,function(key,obj){
 						html.push('<tr name="sys_info">');
 						html.push('<td align="left">'+(key+1)+'</td>') ;
 						html.push('<td  >'+obj.node_name+'</td>') ;
 						html.push('<td  >'+obj.opter_name+'</td>') ;
 						html.push('<td  >'+obj.opt_time+'</td>') ;
 						html.push('<td  >'+obj.opt_remark+'</td>') ;
 						html.push('<td  >'+obj.opter_org_name+'</td>') ;
 						html.push('<td  >'+obj.flow_status+'</td>') ;
 						html.push('</tr>');
  					});
 					currSelector.find("#recordOfSysInfo").append(html.join(''));
 				}, param, true,false);
 		}
};

$(document).ready(function(){
	var sysOrderDetail = new SysOrderDetail();
	sysOrderDetail.init();
});

