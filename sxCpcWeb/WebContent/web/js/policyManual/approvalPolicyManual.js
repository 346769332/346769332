var Shenpi=new Function();

Shenpi.prototype={
		temp:  null ,
		selecter : "#shenpiPage",
		parentObj:null,
		pmId:"",
		callBack : null,
		init:function(parentObj,pmId,callBack){
			temp=this;
			this.callBack = callBack;
			this.parentObj=parentObj;
			this.pmId=pmId;
			this.initPolicyManualInfoPage(this);
			this.bindMetod(this);
		},

		initPolicyManualInfoPage:function(parentThis){
			
			var contentObj = $("#infoContent");
			$.jump.loadHtmlForFun("/web/html/policyManual/addPolicyManual.html".encodeUrl(),function(menuHtml){
				contentObj.html(menuHtml);
				var addPM = new AddPolicyManual();
				addPM.init(parentThis,'shenpi',parentThis.pmId);
			});
		},
		
		bindMetod : function(parentThis) {
			//提交审批
			var delPolicyManual = parentThis.selecter.findById("a","approvalPolicyManual")[0];
			delPolicyManual.unbind("click").bind("click",function(){
				var tbodyObj= parentThis.selecter.findById("div","afasld")[0];
				var JieLun =tbodyObj.find("input[type=radio][name=Fruit]:checked").val();
				var YiJian = tbodyObj.find("textarea[name=YiJian]").val();
				if(JieLun == null|| JieLun == '' || JieLun == undefined) {
					layer.alert("审批结论不能为空！！！");
					return;
				 };
//				 if(YiJian == null) {
//					 layer.alert("！！！");
//				 	return;
//				 };
				
				var param={
						"policyId" 	: 		parentThis.pmId,
						"spState"    :       JieLun,
						"spDesc"    :       YiJian
				};
				 
				$.jump.ajax(URL_APPROVAL_POLICYMANUAL.encodeUrl(), function(json) {
					
					if(json.code == "0" ){
						parentThis.callBack();
					}else{
						layer.alert("审批失败!");	
					}
				}, param, false,false);
			});
			
			
			//返回
			var delPolicyManual = parentThis.selecter.findById("a","callBack")[0];
			delPolicyManual.unbind("click").bind("click",function(){
				parentThis.callBack();
			})
			
		}
};