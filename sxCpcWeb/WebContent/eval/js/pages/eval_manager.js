
var EvalManager=new Function();

EvalManager.prototype={
		parentBody:null,
		
		managerList:null,
		
		staff_id:"",
	
		init : function(parentBody){
			//
			this.parentBody = parentBody;
			this.searchManagerInfo();//查询初始化页面数据
			this.bindMethod();
		},
		
		bindMethod : function(){
			var parentThis = this;
			var managerObj="".findById("tbody","managerInfoBody",parentThis.parentBody)[0];
			document.addEventListener("deviceready", function(){
				document.addEventListener("backbutton", function(){
					common.go.back();
				}, false);
			
			}, false);
			
			"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
				common.go.back();
			});
			"".findById("button", "goBack", this.parentBody)[0].unbind().bind("click",function(){
				history.go(-1);
			});
			
			//重置
			"".findById("button", "reset", this.parentBody)[0].unbind().bind("click",function(){
				
				$.each(parentThis.managerList,function(i,obj){
					
					var id="trEval_"+obj.staff_id;
					var trObj="".findById("tr",id,managerObj)[0];
					var j=i+1;
					var inputId='b'+obj.staff_id;
					//$('#'+inputId).attr('checked','checked');
					//var inputObj="".findById("input",inputId,managerObj)[0];
					var inputName='manager'+j;
					var inputObj=managerObj.find('input[name="'+inputName+'"][value=B]')[0];
					inputObj.checked=true;
				});
			});
			//提交
			"".findById("button", "submit", this.parentBody)[0].unbind().bind("click",function(){
				var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
				var closeObj="".findById("button","dialogClose",showDialogDivObj)[0];
				closeObj.hide();
				var valueStr='<ol>';
				$.each(parentThis.managerList,function(i,obj){
					var j=i+1;
					var inputName='manager'+j;
					var descId=managerObj.find('input[name="'+inputName+'"]:checked').attr('id');
					var desc=managerObj.find('label[for='+descId+']').text();
					valueStr+='<li style="list-style-type: decimal;">'+obj.staff_name+':  '+desc+'</li>';
				});
				valueStr+='</ol>';
				var newHtml='<button type="button" id="submitBack" class="btn btn-primary" data-dismiss="modal" aria-label="Close" style="width:30%;">返回</button>'+
				 '<button type="button" id="submitTow" class="btn btn-primary" style="width:30%;">确认提交</button>';
			    common.loadMsgDialog(showDialogDivObj,"请确认是否提交对领导班子的评价结果：",valueStr,null,newHtml);
				//确认按钮
				"".findById("button","submitTow",parentThis.parentBody)[0].unbind().bind("click",function(){
					parentThis.submit();
				});		
				
			});
				
		},
		
		searchManagerInfo:function(){
			
			var parentThis = this;
			var param={"handleType":"qryEvalManager"};
			$.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
				var code=data.code;
				if("0"==code){
					var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
					scrollDivObj.height((document.documentElement.clientHeight-150)+"px");
					parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
						return;
					});
					parentThis.managerList=data.managerList;
					parentThis.setPageTable(data.managerList);
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
		
		setPageTable:function(managerList){
			var parentThis=this;
			var managerObj="".findById("tbody","managerInfoBody",this.parentBody)[0];
		    if(managerList.length>0){
		    	managerObj.show();
		    	$.each(managerList,function(i,obj){
		    		
		    		var html =[];
		    		var j=i+1;
		    		html.push('<tr id="openTr'+j+'" staffId="'+obj.staff_id+'"><th>'+j+'</th>');
		    		html.push('<th>'+obj.staff_name+'</th>');
		    		html.push('<th><span class="label label-primary pull-right"><i class="fa fa-angle-double-down"></i></span></th>');
		    		html.push('</tr>');
		    		html.push('<tr id="trEval_'+obj.staff_id+'" style="display:none;"><th colspan="3">');
		    		html.push('<input type="radio" id="a'+obj.staff_id+'" name="manager'+j+'" value="A" style="width:20px;"/><label for="a'+obj.staff_id+'" style="width:15%;">非常满意</label>');
		    		html.push('<input type="radio" id="b'+obj.staff_id+'" name="manager'+j+'" value="B" style="width:20px;" checked="checked"/><label for="b'+obj.staff_id+'" style="width:15%;">满意</label>');
		    		html.push('<input type="radio" id="c'+obj.staff_id+'" name="manager'+j+'" value="C" style="width:20px;"/><label for="c'+obj.staff_id+'" style="width:15%;">基本满意</label>');
		    		html.push('<input type="radio" id="d'+obj.staff_id+'" name="manager'+j+'" value="D" style="width:20px;"/><label for="d'+obj.staff_id+'" style="width:15%;">不满意</label>');
		    		html.push('</th></tr>');
					managerObj.append(html.join(''));
				});
		    	//事件
				$.each("".findById("tr", "^openTr", managerObj),function(){
					var staffId = this.attr("staffId");
					this.unbind().bind("click",function(){
						var tr = "".findById("tr", "trEval_"+staffId, managerObj)[0];
						if(tr.is(":visible")){
							tr.hide(500);
						}else{
							tr.show(500);
						}
						parentThis.scroll.refresh();
					});
				});
		    	
			}else{
				    managerObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
		    }
			
		},

		submit : function(){
			
			var parentThis = this;
			var managerObj="".findById("tbody","managerInfoBody",parentThis.parentBody)[0];
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var evalManager=[];
			$.each(parentThis.managerList,function(i,obj){
				var j=i+1;
				var inputName='manager'+j;
				var desc=managerObj.find('input[name="'+inputName+'"]:checked').val();
				var manager={
						"eval_id" : obj.staff_id,
						"eval_name" : obj.staff_name,
						"eval_value" : desc,
						"eval_type"  : "manager"
				};
				evalManager.push(manager);
			});
		    var param={
		    		"handleType" : "submitEvalReverse",
		    		"webList" : JSON.stringify(evalManager)
		    };
		    $.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
		    	if("0"==data.code){
		    		common.loadMsgDialog(showDialogDivObj,"消息提示",'领导班子评价完成');
		    		common.go.next("home.html?hasSession=yes");
		    	}else{
		    		common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg);
		    	}
		    }, param, true);
		}

};

$(function(){
	var evalManager=new EvalManager();
	evalManager.init($(this));
});