var QryNotificationList = new Function();

QryNotificationList.prototype = {
	selecter : "#qryNotificationListPage",
	pageSize : 10,
	//初始化执行
	init : function() {
		this.bindMetod(this);
	},
	bindMetod : function(parentThis) {
		
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0];
		parentThis.dateBind(sendDateObj,0);
		var clearSendDateObj = parentThis.selecter.findById("img","clearSendDate")[0];
		clearSendDateObj.unbind("click").bind("click",function(){
			sendDateObj.val("");
		});
		
		var endDateObj = parentThis.selecter.findById("input","endDate")[0];
		parentThis.dateBind(endDateObj,3);
		var clearEndDateObj = parentThis.selecter.findById("img","clearEndDate")[0];
		clearEndDateObj.unbind("click").bind("click",function(){
			endDateObj.val("");
		});	
		parentThis.loadDemandList(parentThis,0);
		var seniorObj = parentThis.selecter.findById("a","senior")[0];
		seniorObj.unbind("click").bind("click",function(){
			parentThis.loadDemandList(parentThis,0);
		});
	},
	//查询短流程
	loadDemandList : function(parentThis,pageIndex) {
		
		var sendDateObj = parentThis.selecter.findById("input","sendDate")[0]; //发起时间
		var endDateObj = parentThis.selecter.findById("input","endDate")[0]; //截止时间
		var themeSeachObj = parentThis.selecter.findById("input","themeSeach")[0]; //主题检索
		
		var param = {
				"methodType"	:	 	"qryNotification", //操作类型
				"sendDate"		:		sendDateObj.val(),
				"endDate"		:		endDateObj.val(),
				"themeSeach"	:		themeSeachObj.val()
		};
		var pushLstFootObj = parentThis.selecter.findById("div","pushLstFoot")[0];
		common.pageControl.start(URL_PUSH_INFO.encodeUrl(),
				 pageIndex,
				 parentThis.pageSize,
				 param,
				 "data",
				 null,
				 pushLstFootObj,
				 "",
				 function(data,dataSetName,showDataSpan){
					var pushLstBodyObj = parentThis.selecter.findById("tbody","pushLstBody")[0];
					
					pushLstBodyObj.html("");
					parentThis.createLstHtml(parentThis,data,pushLstBodyObj);
		});
	},
	//创建HTML
	createLstHtml : function(parentThis,data,pushLstBodyObj){
		
		var html=[];
		var dataLst = data.data;
		var pushLstFootObj = parentThis.selecter.findById("div","pushLstFoot")[0];
		if(dataLst.length > 0 ){
			pushLstFootObj.show();
			$.each(data.data,function(i,obj){			
				html.push('<tr>');
				html.push('<td>'+(i+1)+'</td>');
				var pushTheme = obj.PUSHTHEME;
				var pushTheme1 = pushTheme.split(".")[0];
				if(pushTheme.length > 9){
					pushTheme = pushTheme.substring(0, 7) + "..."
					+ pushTheme1.substring(pushTheme1.length-2, pushTheme1.length)
					;
				}
				html.push('<td title='+obj.PUSHTHEME+'>'+pushTheme+'</td>');
				html.push('<td>'+obj.PUSHCONTENT+'</td>');
				html.push('<td>'+obj.DCREATE_TIME+'</td>');
				html.push('<td>'+obj.LOGIN_CODE+'</td>');		
				html.push('<td>'+obj.CREATERNAME+'</td>');		
				html.push('<td><a href="#"  class="but" name="query" sendToName="'+obj.SENDTONAME+'" sendToId="'+obj.SENDTOID+'" pushLevel="'+obj.PUSHLEVEL+'" >接收人查看</a>&nbsp;&nbsp;');
				html.push('</td>');
				html.push('</tr>');
			});
		}else{
				pushLstFootObj.hide();
				html.push('<tr>');
				html.push('<td colspan="7">无相关数据</td>');
				html.push('</tr>');
		}
		pushLstBodyObj.html(html.join(''));
		//点击查看
		$('#qryNotificationListPage').find('a[name=query]').unbind('click').bind('click',function(){
			var sendToIds = $(this).attr("sendToId");
			var pushLevels = $(this).attr("pushLevel");
			parentThis.qrySendToName(parentThis,sendToIds,pushLevels);
		});
		//点击"详细"事件
		//$('#qryNotificationListPage').find('a[name=detail]').unbind('click').bind('click',function(){});
	},
	qrySendToName : function(parentThis,sendToIds,pushLevels){

		var html = [];
		html.push('<div class="tanchu_box" id="sendToInfoListPage" style="width:650px;height:400px">');
		html.push('<h3>接收人信息</h3>');		
		html.push('<table  border="0" cellspacing="0" cellpadding="0" class="table1">');
		html.push('<thead align="center">');
		html.push('<tr >');               
		html.push('<th style="text-align:center">序号</th>');         
		html.push('<th style="text-align:center;">部门名称</th>');         
		html.push('<th style="text-align:center">人员名称</th>');         
		html.push('</tr>');
		html.push('</thead>');
		html.push('<tbody id="sendToInfoListBody" align="center">');
		html.push('</tbody>');
		html.push('</table>'); 
		html.push('<div class="page mt10" id="sendToInfoListFoot"></div>');
		html.push('<br/>');
		html.push('<div style="text-align:center;">');
		//html.push('<a href="#" class="but hs_bg" name="back">返回</a></div>');
		html.push('</div>');
		
		var sendToInfoListPage = $.layer({
		    type: 1,
		    title: false,
		    area: ['auto', 'auto'],
		    border: [0], //去掉默认边框
		    //shade: [0], //去掉遮罩
		    //closeBtn: [0, false], //去掉默认关闭按钮
		     shift: 'left', //从左动画弹出
		    page: {
		        html: html.join('')
		    }
		});
		var sendToInfoListPageDiv = $("#sendToInfoListPage");
		var backObj = sendToInfoListPageDiv.find("a[name=back]");
		backObj.unbind("click").bind("click",function(){
			layer.close(sendToInfoListPage);
		});		
		var param = {
				"handleType"	:	"qry",
	    		"dataSource"	:	"",
	    		"nameSpace"		:	"pushInfo",
	    		"sqlName"		:   "getSendToInfoList",
				"sendToIds"	    :	sendToIds,
				"pushLevels"	:	pushLevels
		};
		var listFootObj =$("#sendToInfoListFoot");
		common.pageControl.start(URL_QUERY_COMMON_METHOD.encodeUrl(),
								 '0',
								 parentThis.pageSize,
								 param,
								 "data",
								 null,
								 listFootObj,
								 "",
								 function(data,dataSetName,showDataSpan){
			var listBodyObj = $("#sendToInfoListBody");
			listBodyObj.html("");
			//展示列表
			parentThis.createLsSendToInfotHtml(parentThis,data,listBodyObj);
		});
	},
	//创建HTML
	createLsSendToInfotHtml : function(parentThis,data,listBodyObj){
		var html=[];
		var dataLst = data.data;
		var sendToInfoListFootObj = $("#sendToInfoListFoot");
		if(dataLst.length > 0 ){
			sendToInfoListFootObj.show();
			$.each(data.data,function(i,obj){
				
				html.push('<tr>');
				html.push('<td>'+(i+1)+'</td>');
			    html.push('<td>'+obj.DEPT_NAME+'</td>');
				html.push('<td>'+obj.STAFF_NAME+'</td>');
				html.push('</tr>');
			});
		}else{
			sendToInfoListFootObj.hide();
			html.push('<tr>');
			html.push('<td colspan="3">无相关数据</td>');
			html.push('</tr>');
		}
		listBodyObj.html(html.join(''));
	},
	//时间绑定
	dateBind : function(obj,AddDayCount){
		var d = new Date();
		d.setDate(d.getDate()+AddDayCount);//获取AddDayCount天后的日期 
		obj.datetimepicker({
			lang:'ch',
			timepicker:false,
			format:'Y-m-d',
			formatDate:'Y-m-d',
		});
	},
};
