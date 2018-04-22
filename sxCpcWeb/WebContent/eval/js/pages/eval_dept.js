/***
 * 月度综合评价（专业部门）
 * */
var EvalDept=new Function();

EvalDept.prototype={
		parentBody:null,
		
		deptInfo:null,
		
		staff_id:"",
		
		satisfy:null,
		
		checkedNum : 0,
		limitNum :null,
	
		init : function(parentBody){
			//
			this.parentBody = parentBody;
			this.searchDeptInfo();//查询初始化页面数据
			this.bindMethod();
			this.satisfy=common.utils.getHtmlUrlParam("satisfy");
			if('A'==this.satisfy){
				$('#eval_title').html('请您选出您上月最满意的支撑部门：');
				this.limitNum=5;
			}else if('D'==this.satisfy){
				$('#eval_title').html('请您选出您上月最不满意的支撑部门：');
				this.limitNum=3;
			}
			
			
			
		},
		
		bindMethod : function(){
			var parentThis = this;
			var evalDeptObj="".findById("tbody","evalDeptInfoBody",parentThis.parentBody)[0];
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
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
				
				parentThis.checkedNum=0;
				var chooseDeptList=evalDeptObj.find('input[name=reverseEval]:checked');
				if(chooseDeptList.length>0){
					$.each(chooseDeptList,function(i,obj){
						obj.checked=false;
					});
				}
			});
	    	
			//提交
			"".findById("button", "submit", this.parentBody)[0].unbind().bind("click",function(){
				var chooseDeptList=evalDeptObj.find('input[name=reverseEval]:checked');
				var pageName='';
				if('D'==parentThis.satisfy){
					//common.loadMsgDialog(showDialogDivObj,"消息提示","最不满意的部门最多可选3个。");
					pageName='最不满意';
				}else if('A'==parentThis.satisfy){
					pageName='最满意';
				}
				var strDept="";
				 if(chooseDeptList.length>0){
					 
					 strDept='<ol >';
				    	$.each(chooseDeptList,function(i,obj){
				    		var orgName=obj.getAttribute("orgname");
				    		//strDept+=j+". "+orgName+"  ";
				    		strDept+='<li style="list-style-type: decimal;">'+orgName+'</li>';
				    	});
				       strDept+='</ol>';
				    }else{
				    	strDept="没有"+pageName+"的部门";
				    }
				//确认是否提交
				 var newHtml='<button type="button" id="submitBack" class="btn btn-primary" data-dismiss="modal" aria-label="Close" style="width:30%;">返回</button>'+
					 '<button type="button" id="submitTow" class="btn btn-primary" style="width:30%;">确认提交</button>';
				common.loadMsgDialog(showDialogDivObj,"你选出的"+pageName+"的部门有：",strDept,null,newHtml);
				
				//确认按钮
				"".findById("button","submitTow",parentThis.parentBody)[0].unbind().bind("click",function(){
					parentThis.submit(chooseDeptList);
				});	
			});
				
		},
		
		searchDeptInfo:function(){
			
			var parentThis = this;
			var param={"handleType":"qryEvalDept"};
			$.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
				var code=data.code;
				if("0"==code){
					var scrollDivObj = "".findById("div", "scrollDiv", parentThis.parentBody)[0];
					scrollDivObj.height((document.documentElement.clientHeight-150)+"px");
					parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
						return;
					});
					parentThis.setPageTable(data.deptList);
					parentThis.scroll.refresh();
				}else{
					var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
					var newHtml='<button id="dialogClose" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
					common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg,function(){
						if(navigator.app)
							navigator.app.backHistory();
						else
							history.go(-1);
					},newHtml);
				}
			}, param, true);
		},
		
		setPageTable:function(deptList){
			var parentThis=this;
			var evalDeptObj="".findById("tbody","evalDeptInfoBody",this.parentBody)[0];
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var newHtml='<button id="dialogClose" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
		    if(deptList.length>0){
		    	evalDeptObj.show();
		    	$.each(deptList,function(i,obj){
		    		
		    		var html =[];
		    		var j=i+1;
		    		html.push('<tr><th>'+j+'</th>');
		    		html.push('<th>'+obj.org_name+'</th>');
		    		html.push('<th><input name="reverseEval" type="checkbox" orgname="'+obj.org_name+'" value="'+obj.org_id+'"/></th>');
		    		html.push('</tr>');
					evalDeptObj.append(html.join(''));
				});
		    	//添加事件
		    	$.each(evalDeptObj.find('input[name=reverseEval]'),function(i,obj){
		    		$(obj).unbind().bind('click',function(){
		    			
		    			if($(obj).is(':checked')){
	    					if(parentThis.checkedNum<parentThis.limitNum){
	    						parentThis.checkedNum+=1;
	    					}else{
	    						if('D'==parentThis.satisfy){
	    							common.loadMsgDialog(showDialogDivObj,"消息提示","最不满意的部门最多可选3个,已经选择了3个",null,newHtml);
		    						obj.checked=false;
	    						}else if('A'==parentThis.satisfy){
	    							common.loadMsgDialog(showDialogDivObj,"消息提示","最满意的部门最多可选5个,已经选择了5个",null,newHtml);
		    						obj.checked=false;
	    						}
	    						
	    					}
		    				
		    			}else{
		    				parentThis.checkedNum-=1;
		    			}
		    		});
		    		
		    	});
			}else{
				    evalDeptObj.hide();
					html.push('<div>');
					html.push('<div>无相关数据</div>');
					html.push('<div>');
		    }
			
		},

		submit : function(chooseDeptList){
			
			var parentThis = this;
			var showDialogDivObj = "".findById("div","showDialogDiv",parentThis.parentBody)[0];
			var newHtml='<button id="dialogClose" type="button" class="btn btn-default" data-dismiss="modal">关闭</button>';
			var evalDept=[];
		    if(chooseDeptList.length>0){
		    	$.each(chooseDeptList,function(i){
		    		var obj=chooseDeptList[i];
		    		var dept={
		    				"eval_id" : obj.value,
		    				"eval_name" : obj.getAttribute("orgname"),
		    				"eval_value" : parentThis.satisfy,
		    				"eval_type"  : "dept"
		    		};
		    		evalDept.push(dept);
		    	});
		    	
		    }else if(chooseDeptList.length==0){
		    	var dept={
	    				"eval_value" : parentThis.satisfy,
	    				"eval_type"  : "dept"
	    		   };
	    		evalDept.push(dept);
		    	//common.loadMsgDialog(showDialogDivObj,"消息提示","您没有选择要评价的部门，不需要提交",null,newHtml);
		    }
		    var param={
		    		"handleType" : "submitEvalReverse",
		    		"webList" : JSON.stringify(evalDept)
		    };
		    $.jump.ajax(URL_SHOW_EVAL_PAGE, function(data){
		    	if("0"==data.code){
		    		if('D'==parentThis.satisfy){//最不满意的评价
		    			common.go.next("eval_dept.html?satisfy=A");
		    		}else if('A'==parentThis.satisfy){//最满意的评价
		    			common.go.next("home.html?hasSession=yes");
		    		}
		    	}else{
		    		common.loadMsgDialog(showDialogDivObj,"消息提示",data.msg,null,newHtml);
		    	}
		    }, param, true);
		}

};

$(function(){
	var evalDept=new EvalDept();
	evalDept.init($(this));
});