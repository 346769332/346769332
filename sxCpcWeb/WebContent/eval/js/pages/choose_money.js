
var ChooseMoney=new Function();

ChooseMoney.prototype={
		parentBody:null,
		
		latnId : null,
		monthNum : null,//本月可用金额
		sendSum : null,//本月已用总金额
		overNum : null,//余额
		staffInfo : null,//被激励者
		init : function(parentBody){
			
			this.parentBody = parentBody;
			this.monthNum = common.utils.getHtmlUrlParam("monthNum");
			this.sendSum = common.utils.getHtmlUrlParam("sendSum");
			this.staffInfo = decodeURI(common.utils.getHtmlUrlParam("staffInfo"));
			this.overNum=this.monthNum-this.sendSum;

			this.bindMethod(this);
		},
		
		bindMethod : function(ts){
			var parentThis = ts;
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var title='您目前已使用'+parentThis.sendSum+'元打赏，请选择打赏金额：';
			$('#eval_title').html(title);
			document.addEventListener("deviceready", function(){
				document.addEventListener("backbutton", function(){
					common.go.back();
				}, false);
			
			}, false);
			
			"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
				history.go(-1);
			});
			"".findById("button", "goBack", this.parentBody)[0].unbind().bind("click",function(){
				history.go(-1);
			});
			"".findById("input","desc",parentThis.parentBody)[0].unbind().bind('click',function(){
		    	this.value='';
		    });
			//提交
			"".findById("button", "submit", this.parentBody)[0].unbind().bind("click",function(){
				parentThis.submit(parentThis);
			});
				
		},
		

		submit : function(parentThis){
			
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var moneyDiv="".findById('div',"moneyDiv",parentThis.parentBody)[0];
			var moneyNum=moneyDiv.find("input[name=moneyNum]:checked").val();
			var desc=$('#desc').val();
			if(''==moneyNum||moneyNum==undefined||moneyNum==null){
				common.loadMsgDialog(showDialogDivObj,"消息提示",'请先选择打赏金额');
				return;
			}
			if(moneyNum>parentThis.overNum){
				common.loadMsgDialog(showDialogDivObj,"消息提示",'对不起，打赏余额不足');
				return;
			}
			if('请输入打赏事由，最多150个字'==desc||''==desc){
				common.loadMsgDialog(showDialogDivObj,"消息提示",'请输入打赏事由');
				return;
			}
			//staffInfo被激励人信息
			var staffObj=JSON.parse(parentThis.staffInfo);//将json字符串转换成json对象
			var param={
					"handleType" : "sendUrgeMoney",
					"money_num" : moneyNum,
					"urge_desc"     :  desc,
					"urge_id" : staffObj.staff_id,
					"urge_name" : staffObj.staff_name,
					"urge_mob_tel" : staffObj.mob_tel,
					"urge_dept_id" : staffObj.department_id,
					"urge_dept_name" : staffObj.department
			};
			
		    $.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
		    	if("0"==data.code){
		    		common.loadMsgDialog(showDialogDivObj,"消息提示",'已打赏，谢谢！');
		    		common.go.next("send_money.html");
		    		
		    	}else{
		    		common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg);
		    	}
		    }, param, true);
		}

};

$(function(){
	var chooseMoney=new ChooseMoney();
	chooseMoney.init($(this));
});