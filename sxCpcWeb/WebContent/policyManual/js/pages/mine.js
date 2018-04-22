var Mine = new Function();

Mine.prototype = {
	
	parentBody 	: null,
	scroll:null,
	
	init : function(parentBody){
		
		var parentThis = this;
		this.parentBody = parentBody;
	
	},
	
	scrollRefresh:function(parentThis){
		if(null!=parentThis.scroll){
			parentThis.scroll.destroy();
			parentThis.scroll=null;
		}
		var scrollDivObj = "".findById("div", "scrollDiv",parentThis.parentBody)[0];
		scrollDivObj.height((document.documentElement.clientHeight-120)+"px");
		parentThis.scroll = common.addScroll(parentThis.scroll,scrollDivObj,function(){
			alert('up');
		},function(){
			alert('down');
		},function(){
			
		});
		setTimeout(function () { 
			parentThis.scroll.refresh();
		 }, 500);
	},
};


$(document).ready(function(){
	var mine  =new Mine();
	mine.init($(this));
});