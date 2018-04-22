var Dialog = new Function();
Dialog.prototype = {
	
	init : function(msg){
		"#myModal".findById("div", "msg")[0].html(msg);
	}
};