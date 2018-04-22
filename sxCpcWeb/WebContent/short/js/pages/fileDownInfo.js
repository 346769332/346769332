var FileDownInfo = new Function();

FileDownInfo.prototype = {
	parentBody : null,
	file_path  : null,
	init : function(parentBody) {
		
		this.parentBody = parentBody;
		this.file_path = common.utils.getHtmlUrlParam("file_path");
		this.bindMethod();

	},
	
	bindMethod : function() {
		var parentThis = this;
		document.addEventListener("deviceready", function() {
			document.addEventListener("backbutton", function() {
				navigator.app.backHistory();
			}, false);

		}, false);

		"".findById("a", "backA", this.parentBody)[0].unbind().bind("click",function(){
			common.go.back();
		});
		console.log(parentThis.file_path);
		//var  file_paths="http://117.32.232.208/upLoadFile/1-150320153914V3.jpg";//+parentThis.file_path;
		var  file_paths="http://117.32.232.208/"+parentThis.file_path;
		$("#fileDownImgInfo").attr("src",file_paths);
		parentThis.targetObj();
	},
	targetObj : function(){
			        var $targetObj = $('#fileDownImgInfo');
			//初始化设置
			cat.touchjs.init($targetObj, function (left, top, scale, rotate) {
			    $targetObj.css({
			        left: left,
			        top: top,
			        'transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)',
			        '-webkit-transform': 'scale(' + scale + ') rotate(' + rotate + 'deg)'
			    });
			});
			//初始化缩放手势（不需要就注释掉）
			cat.touchjs.scale($targetObj, function (scale) {
			});
			//初始化拖动手势（不需要就注释掉）
			cat.touchjs.drag($targetObj, function (left, top) {
			});
	}
};
$(document).ready(function() {
	var fileDownInfo = new FileDownInfo();
	fileDownInfo.init($(this));
});