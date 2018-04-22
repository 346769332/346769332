function Util() {
	/**当前对象的引用*/
	var temp = this;
	
	this.cost = {
		success : "0"
	};
	/**
	* 判断是否为空
	* param str 字符串
	* return boolean true为空
	*/
	this.isNull = function (str) {
		//如果str为boolean类型，将不支持后面的replace方法。
		if(typeof (str) == "boolean"){
			return false;
		}
		//如果str为number类型，将不支持后面的replace方法。
		if(typeof (str) == "number"){
			return false;
		}
		return (null == str || typeof (str) == "undefined" || str == "undefined" || str.replace(/(^\s*)|(\s*$)/g, "") == "");
	};
	/**
	 * 判断是否成功
	 * param str 编码
	 * return boolean true成功
	 */
	this.isSuccess = function(code){
		return this.cost.success == code;
	}; 
	/**
	* 设置提示消息
	* param id
	* param msg
	*/
	this.setMessage = function (id, msg) {
		$("#" + id).html(msg);
	};
	// 获取值
	this.getValue = function(value){
		return this.isNull(value) ? "" : value;
	};
	// 获取
	this.getObj = function(id){
		return document.getElementById(id);
	};
	// 
	this.getText = function(id){
		var obj = this.getObj(id);
		return obj.options[obj.selectedIndex].text;
	};
	/**
	 * @see  将json字符串转换为对象
	 * @param   json字符串
	 * @return 返回object,array,string等对象
	*/
	this.toObj = function (strJson) {
		return eval( "(" + strJson + ")");
	};
	
	/**
	 * 证件号码验证
	 */
	this.isCertNumber = function(v){
		var res = /^[A-Za-z0-9]{4,}$/;
		if (!res.test(v)) {
			return false;
		}
		return true;
	};
	
	/**
	 * 证件号码验证
	 */
	this.isEmailNumber = function(v){
		var res = /^\w+([-+.]\w+)*@\w+([-.]\\w+)*\.\w+([-.]\w+)*$/;
		if (!res.test(v)) {
			return false;
		}
		return true;
	};
	
	/**
	* 是否为数组
	* param obj
	* return boolean
	*/
	this.isArray = function(obj){
		return Object.prototype.toString.call(obj) === '[object Array]';    
	};
	/**
	* 数据是否为空
	* param obj
	* return boolean
	*/
	this.isNullArray = function(obj){
		if (util.isArray(obj)) {
			if (obj.length > 0) {
				return false;
			}
		}
		
		return true;
	};
	
	/**
	 * 判断字符串是否为空，如果为空是否需要设置默认值
	 * str 字符串
	 * v 默认值
	 **/
	this.isSetDefault = function (str, v) {
		return temp.isNull(str) ? v : str;
	};
	
	/**
	 * 判断是否是电信手机
	 */
	this.isMobileNum = function(obj) {
		var res = /^(13|15|18)+[0-9]{9}$/;
		if (!res.test(obj)) {
			return false;
		}
		return true;
	};
	
	/**联系人号码必须限制输入数字，且只能输入7位或8位或11位号码*/
	this.checkTel = function(str){
		 var re =/(^\d{11}$)|(^\d{7,8}$)/; 
		 if (re.test(str)) { 
			 return true; 
		 }else{ 
			 return false; 
		 } 
	};
	
	/**检查只有26个字母
	 * 返回值：0：含有 1：全部为字母
	*/
	this.checkIsChar = function(str){
		var strSource = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var ch;
		var i;
		var temp;
		for (i = 0; i <= (str.length - 1); i++) {
			ch = str.charAt(i);
			temp = strSource.indexOf(ch);
			if (temp == -1) {
				return 0;
			}
		}
		
		return 1;
	};
	
	/**验证是否是中文*/
	this.checkIsChina = function(str, len) {
		var flag = true;
		var _len = str.length;
		// 是否只是中文
		var s = str.replace(/[^\u4E00-\u9FA5]/g,'');;
		if (str != s) {
			flag = false;
		} else {
			if (!temp.isNull(len) && _len < len) {
				flag = false;
			}
		}
		
		return flag;
	};
	

	/**
	 * 得到字符串的字符长度（一个汉字占两个字符长） 将验证的函数改成128以类的为单字符。避免“·”符号
	 */
	this.getBytesLength = function(str) {
		var i;
		var sum = 0;
		for (i = 0; i < str.length; i++) {
			if ((str.charCodeAt(i) >= 0) && (str.charCodeAt(i) <= 128)) {
				sum = sum + 1;
			} else {
				sum = sum + 2;
			}
		}
		
		return sum;
	};

	/**
	 * 检查输入对像的长度是否合法
	 * @param {}
	 *            str 要检查的字符串
	 * @param {}
	 *            len 最大长度
	 * @return {Boolean}
	 */
	this.checkStrLength = function(str, len){
		if (temp.getBytesLength(str) > len) {
			return false;
		}
		return true;
	};
	
	/**
	 * @see 将javascript数据类型转换为json字符串
	 * @param 待转换对象,支持object,array,string,function,number,boolean,regexp
	 * @return 返回json字符串
	*/
	this.toJSON = function (object) {
		var type = typeof object;
		if ('object' == type) {
			if (Array == object.constructor)
				type = 'array';
			else if (RegExp == object.constructor)
				type = 'regexp';
			else
				type = 'object';
		}
		switch (type) {
			case 'undefined':
			case 'unknown': 
				return;
				break;
			case 'function':
			case 'boolean':
			case 'regexp':
				return object.toString();
				break;
			case 'number':
				return isFinite(object) ? object.toString() : 'null';
				break;
			case 'string':
				return '"' + object.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,
				function () {   
					var a = arguments[0];                   
					return  (a == '\n') ? '\\n':   
							(a == '\r') ? '\\r':   
							(a == '\t') ? '\\t': ""
							}) + '"';
					break;
			case 'object':
				if (object === null) return 'null';
				var results = [];
				for (var property in object) {
					var value = temp.toJSON(object[property]);
					if (value !== undefined)
						results.push(temp.toJSON(property) + ':' + value);
				}
				return '{' + results.join(',') + '}';
				break;
			case 'array':
				var results = [];
				for(var i = 0; i < object.length; i++) {
					var value = temp.toJSON(object[i]);
					if (value !== undefined) results.push(value);
				}
				return '[' + results.join(',') + ']';
				break;
		}
	};
	
	this.getQueryString = function(name) {
	    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
	    var r = window.location.search.substr(1).match(reg);
	    if (r != null) return unescape(r[2]); return null;
    };
    
    /**
     * 获取当前浏览器的url
     */
	this.getCurrentUrl = function(isNeedParam) {
	    var url = window.location.href;
	    if(url == null || url == undefined) return '';
	    if(!isNeedParam){
	    	return url.split('?')[0];
	    }
	    return url;
    };
    
    /**获取6位的随机数*/
    this.get6Random = function() {
    	var x = 999999;
		var y = 100000;
		return  parseInt(Math.random() * (x - y + 1) + y);
    };
    
   /**截取字符串，中英文都能用  
    *如果给定的字符串大于指定长度，截取指定长度返回，否者返回源字符串。  
    *字符串，长度  
   */
   this.cutstr = function(str, len) {  
	   if (str == null || str == "") {
		   return "";
	   }
	  	var str_length = 0;  
	  	var str_len = 0;  
	  	str_cut = new String();  
	  	str_len = str.length;  
	      for(var i = 0;i<str_len;i++){  
	      	a = str.charAt(i);  
	          str_length++;  
	          if(escape(a).length > 4){  
	           //中文字符的长度经编码之后大于4  
	          	str_length++;  
	          }  
	          str_cut = str_cut.concat(a);  
	          if(str_length>=len){  
	          	str_cut = str_cut.concat("...");  
	           return str_cut;  
	          }  
	      }  
	      //如果给定字符串小于指定长度，则返回源字符串；  
	      if(str_length<len){  
	      	return  str;  
	      }  
   }; 
   
   /**日期格式截取yyyy-mm-dd*/
   this.formatDate = function(str){
	   var date = " ";
	   if (str != null && str != "") {
		   date = str.substr(0, 10);
	   }
	   
	   return date;
   };
    
	this.getTerminalPortTypeName = function(key) {
		if ("1" == key) {
			return "ADSL接入";
		} else if ("2" == key) {
			return "LAN接入";
		} else if ("3" == key) {
			return "FTTH接入";
		} else if ("4" == key) {
			return "铜缆接入";
		} else {
			return "";
		}
	};
	
	this.getAbility = function(key) {
		if ("0" == key) {
			return "具备";
		} else if ("1" == key) {
			return "不具备";
		} else {
			return "";
		}
	};
	
	this.getPonType = function(key) {
		if ("1" == key) {
			return "EPON";
		} else if ("2" == key) {
			return "GPON";
		} else {
			return "";
		}
	};
	
	/**
	 * 获取URL中参数的名称
	 */
	this.getUrlParamValue = function(paramKey){
	    var url = window.location.href;  
	    var paraString = url.substring(url.indexOf("?") + 1, url.length).split("&");  
	    var paraObj = {};
	    for (i = 0; j = paraString[i]; i++) {  
	        paraObj[j.substring(0, j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=") + 1, j.length);  
	    }  
	    var returnValue = paraObj[paramKey.toLowerCase()];  
	    if (typeof (returnValue) == "undefined") {  
	        return "";  
	    } else {  
	        return returnValue;  
	    }  
	};
	
	this.showMsg = function(msg){
		alert(msg);
	};
	
	this.keyPress = function() {  
	    var keyCode = event.keyCode;  
	    if ((keyCode >= 48 && keyCode <= 57))  
	    {  
	        event.returnValue = true;  
	    } else {  
	        event.returnValue = false;  
	    }  
	} ;
	//只能输入数字
	this.terminalNumOnlyInputNum=function(obj){
		if(!(event.keyCode==46)&&!(event.keyCode==8)&&!(event.keyCode==37)&&!(event.keyCode==39))
		if(!((event.keyCode>=48&&event.keyCode<=57)||(event.keyCode>=96&&event.keyCode<=105)))
		event.returnValue=false;
	} ;
};

