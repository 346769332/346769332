
var ValidateTel = {  
  
        isTel: function (s) {  
            var patrn = /^((\+?86)|(\+86))?\d{3,4}-\d{7,8}(-\d{3,4})?$/  
                if (!patrn.exec(s)) return false  
                return true  
        },  
  
        isMobile: function (value) {  
                var validateReg = /^((\+?86)|(\+86))?1\d{10}$/;  
            return validateReg.test(value);  
        },  
        cellPhone: function (cellPhoneNumber) {  
        	var msg = "";
			if (!ValidateTel.isMobile(cellPhoneNumber)) {  
				msg = "手机号码格式不正确"; 
			}
			
			return msg;
        },  
		  
        telePhone: function (telePhoneNumber) {  
        	var msg = "";
            if (!ValidateTel.isTel(telePhoneNumber)) {  
            	msg = "电话号码格式不正确";  
			}
            return msg;
        }  
}  