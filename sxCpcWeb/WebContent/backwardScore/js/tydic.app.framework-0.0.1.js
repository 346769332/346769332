
/*************************************
 * ZommImg 手指两点触摸【缩放图片】
 * create by:xingkai
 * update：2015-09-19 by:xingkai
 *
 *************************************/
(function($){
	
	var ZoomImg = function(){};
	ZoomImg.prototype = {
		imgW : 0, imgH : 0,
		imgObj : null,
		spanX : 0, spanY : 0,
		init :function(canvas){
			this.imgObj = canvas;
			var imgJSObj = this.imgObj.get(0);
			var parentThis = this;
			
			this.imgW = this.imgObj.width();
			this.imgH = this.imgObj.height();
			
		    var touchable = 'createTouch' in document;
		    if (touchable) {
		    	imgJSObj.addEventListener('touchstart', function(event){parentThis.onTouchStart(event,parentThis)}, false);
		    	imgJSObj.addEventListener('touchmove', function(event){parentThis.onTouchMove(event,parentThis)}, false);
		    	imgJSObj.addEventListener('touchend', function(event){parentThis.onTouchEnd(event,parentThis)}, false);
		    }else{
		    	alert("手势缩放图片初始化失败，当前设备不支持触摸！");
		    }
		},
		onTouchStart : function(event,parentThis) {
		    //do stuff
			event.preventDefault();
			if(event.touches.length<=1){
		    	return;
		    }
		   	
			parentThis.spanX = parentThis.getAbsX(event);
			parentThis.spanY = parentThis.getAbsY(event);
		},
		//获取绝对值
		getAbsX : function(event,parentThis){
			var x1= Math.abs(event.touches[0].clientX);
			var x2 = Math.abs(event.touches[1].clientX);
		
			var xT = 0;
			if(x1>x2){
				xT = x2;
				x2 = x1;
				x1 = xT;
			}
			return x2-x1;
		},
		//获取绝对值
		getAbsY : function(event){
			var y1= Math.abs(event.touches[0].clientY);
			var y2 = Math.abs(event.touches[1].clientY);
			
			var yT = 0;
			if(y1>y2){
				yT = y2;
				y2 = y1;
				y1 = yT;
			}
			return y2-y1;
		},
		onTouchMove : function(event,parentThis) {

		    event.preventDefault();
			if(event.touches.length<=1){
		    	return;
		    }
			
			if(parentThis.freezeSize(parentThis)){
				return;
			}
			
			var nSpanX = parentThis.getAbsX(event);
			var nSpanY = parentThis.getAbsY(event);
			
			if((nSpanX-parentThis.spanX)>5 || (nSpanY-parentThis.spanY)>5){
				
				parentThis.imgObj.width(parentThis.imgObj.width()+15);
				parentThis.imgObj.height(parentThis.imgObj.height()+15);
				
				parentThis.spanX = nSpanX;
				parentThis.spanY = nSpanY;
			}
			else if((nSpanX-parentThis.spanX)<-5 || (nSpanY-parentThis.spanY)<-5){
				parentThis.imgObj.width(parentThis.imgObj.width()-15);
				parentThis.imgObj.height(parentThis.imgObj.height()-15);
				
				parentThis.spanX = nSpanX;
				parentThis.spanY = nSpanY;
				
			}
		},
		onTouchEnd : function(event,parentThis) {
			if(parentThis.freezeSize(parentThis)){
				parentThis.imgObj.width(parentThis.imgW);
				parentThis.imgObj.height(parentThis.imgH);
			}
		},
		//固定尺寸
		freezeSize : function(parentThis){
			var nImgW = parentThis.imgObj.width();
			var nImgH = parentThis.imgObj.height();
			
			if(nImgW<(parentThis.imgW-20) 
					|| nImgH<(parentThis.imgH-20)){
				return true;
			}
			
			return false;
		}
	}
	$.fn.zoomImg = function(){
		$.zoomImg = new ZoomImg;
		$.zoomImg.init(this);
	};
	
})(jQuery);