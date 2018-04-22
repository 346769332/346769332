
var SendMoney=new Function();

SendMoney.prototype={
		parentBody:null,
		monthNum : null,//本月可用金额
		sendSum : null,//本月已用总金额
		overNum : null,//余额
		init : function(parentBody){
			//
			this.parentBody = parentBody;
			this.searchUrgeOrgList();//查询初始化页面数据
			this.bindMethod();
		},
		
		bindMethod : function(){
			var parentThis = this;
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var urgeOrgObj="".findById("tbody","urgeOrgBody",this.parentBody)[0];
			document.addEventListener("deviceready", function(){
				document.addEventListener("backbutton", function(){
					common.go.back();
				}, false);
			
			}, false);
			
			"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
				common.go.back();
			});
			
			//提交
			/*"".findById("button", "submit", this.parentBody)[0].unbind().bind("click",function(){
				var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
				var newHtml='<button type="button" id="submitBack" class="btn btn-primary" data-dismiss="modal" aria-label="Close" style="width:30%;">返回</button>'+
				 '<button type="button" id="submitTow" class="btn btn-primary" style="width:30%;">确认提交</button>';
			    common.loadMsgDialog(showDialogDivObj,"请确认是否提交对领导班子的评价结果：",'',null,newHtml);
				//确认按钮
				"".findById("button","submitTow",parentThis.parentBody)[0].unbind().bind("click",function(){
					parentThis.submit();
				});		
				
			});*/
				
		},
		
		searchUrgeOrgList:function(){
			
			var parentThis = this;
			var param={"handleType":"qryUrgeOrg"};
			$.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
				var code=data.code;
				if("0"==code){
					var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
					scrollDivObj.height((document.documentElement.clientHeight-150)+"px");
					parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
						return;
					});
					parentThis.monthNum=data.month_num;
					if(data.send_sum==''||data.send_sum==null||data.send_sum==undefined){
						parentThis.sendSum='0';
					}else{
						parentThis.sendSum=data.send_sum;
					}
					
					parentThis.overNum=parentThis.monthNum-parentThis.sendSum;
					var str='您本月共有'+parentThis.monthNum+'元可供打赏：目前已使用'+parentThis.sendSum+'元，还有'+parentThis.overNum+'元可以打赏！';
					$('#eval_title').html(str);
					parentThis.setPageTable(data.orgList);
					parentThis.scroll.refresh();
				}else{
					var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
					common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg,function(){
						if(navigator.app)
							navigator.app.backHistory();
						else
							history.go(-1);
					});
				}
			}, param, true);
		},
		
		setPageTable:function(orgList){
			var parentThis=this;
			var urgeOrgObj="".findById("tbody","urgeOrgBody",this.parentBody)[0];
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
		    if(orgList.length>0){
		    	urgeOrgObj.show();
		    	$.each(orgList,function(i,obj){
		    		
		    		var html =[];
		    		var j=i+1;
		    		html.push('<tr id="openTr'+j+'" orgId="'+obj.org_id+'"><th>'+j+'</th>');
		    		html.push('<th>'+obj.org_name+'</th>');
		    		html.push('<th><span class="label label-primary pull-right"><i class="fa fa-angle-double-down"></i></span></th>');
		    		html.push('</tr>');
		    		html.push('<span id="trStaff'+j+'" style="display:none;">');
		    		var len=obj.staffList.length;
		    		if(len<=0){
		    			html.push('<tr name="trStaff_'+obj.org_id+'" style="display:none;"><th colspan="3">此部门下无员工</th></tr>');
		    		}else{
		    			
		    			$.each(obj.staffList,function(r,st){
		    				var staffInfo=JSON.stringify(st);//将json对象转换成json字符串
		    				html.push('<tr name="trStaff_'+obj.org_id+'" staffId="'+st.staff_id+'" staffName="'+st.staff_name+'" style="display:none;" >');
		    				if(r==0){
		    					html.push('<th rowspan="'+len+'">人员列表</th>');
		    				}
		    				html.push('<th>'+st.staff_name+'</th>');
		    				html.push('<th id="urge_'+st.staff_id+'" staffInfo='+staffInfo+'><i class="fa fa-angle-double-right"></i></th></tr>');
		    			});
		    			html.push('</span>');
		    		}
		 
		    		urgeOrgObj.append(html.join(''));
				});
		    	//事件
				$.each("".findById("tr", "^openTr", urgeOrgObj),function(i){
					var orgId = this.attr("orgId");
					var j=i+1;
					this.unbind().bind("click",function(){
						var trobjList=urgeOrgObj.find('tr[name="trStaff_'+orgId+'"]');
						$.each(trobjList,function(r){
							var trobj=trobjList[r];
							if($(trobj).is(":visible")){
								$(trobj).hide();
							}else{
								$(trobj).show();
							}
							
						});
						
						parentThis.scroll.refresh();
					});
				});
				//选中激励对象发放红包
				$.each("".findById("th","^urge_",urgeOrgObj),function(){
					var staffInfo=this.attr("staffInfo");
					this.unbind().bind('click',function(){
						
						common.go.next(encodeURI('choose_money.html?monthNum='+parentThis.monthNum+'&sendSum='+parentThis.sendSum+'&staffInfo='+staffInfo.toString()));
						/*var str='您目前已使用'+parentThis.sendSum+'元打赏，请选择打赏金额：';
						var content='<div><input type="radio" name="moneyNum" value="10" style="width:25%;">10';
						content+='<input type="radio" name="moneyNum" value="20" style="width:25%;">20';
						content+='<input type="radio" name="moneyNum" value="30" style="width:25%;">30</div>';
						content+='<div style="margin-top:10px;"><input id="desc" type="textarea" value="请输入打赏事由，最多150个字" style="width:100%;height:100px;"></div>';
						var newHtml='<button type="button" id="submitBack" class="btn btn-primary" data-dismiss="modal" aria-label="Close" style="width:30%;">返回</button>'+
						 '<button type="button" id="submit" class="btn btn-primary" style="width:30%;">提交</button>';
					    
						common.loadMsgDialog(showDialogDivObj,str,content,null,newHtml);
					    
					    "".findById("input","desc",parentThis.parentBody)[0].unbind().bind('click',function(){
					    	this.value='';
					    });
						//确认按钮
						"".findById("button","submit",parentThis.parentBody)[0].unbind().bind("click",function(){
							var moneyNum=showDialogDivObj.find("input[name=moneyNum]:checked").val();
							var desc=$('#desc').val();
							parentThis.submit(staffInfo,moneyNum,desc);
							
						});		*/
					});
				});
				
				
			}else{
				    urgeOrgObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
		    }
			
		},
};

$(function(){
	var sendMoney=new SendMoney();
	sendMoney.init($(this));
});