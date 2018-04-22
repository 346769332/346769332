package com.tydic.sale.servlet.common;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.shiro.crypto.hash.Sha512Hash;

import com.alibaba.fastjson.JSON;
import com.tydic.auth.client.utils.AuthConfigManagerClient;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.Pool;
import com.tydic.sale.servlet.domain.Role;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/sale/authLogin.do")
public class AuthLogin extends AbstractServlet{
	
	private static char[] base64EncodeChars = new char[] { 'A', 'B', 'C', 'D',  
        'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q',  
        'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd',  
        'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q',  
        'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '0', '1', '2', '3',  
        '4', '5', '6', '7', '8', '9', '+', '/', };  
  
	private static byte[] base64DecodeChars = new byte[] { -1, -1, -1, -1, -1,  
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  
        -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,  
        -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59,  
        60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9,  
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1,  
        -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37,  
        38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1,  
        -1, -1 
     };  

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");

		String empeeCode = request.getParameter("empeeCode");
		String password = request.getParameter("password");
		String verifyCode = request.getParameter("verifyCode");
		String cpcAndroid = "";

		//手机端做单独处理 
		Map<Object, Object> dataMap = null;
		if(request.getParameter("data") != null && !"".equals(request.getParameter("data"))){
			dataMap = super.getReqParamMap(request);
			empeeCode = (String)dataMap.get("empeeCode") ;
			password = String.valueOf(dataMap.get("password"));
			cpcAndroid = (String)dataMap.get("cpcAndroid") ;
			//进行解密
			if(!Tools.isNull(empeeCode)){
				empeeCode=new String(decode(empeeCode));
			}
			if(!Tools.isNull(cpcAndroid)){
				cpcAndroid=new String(decode(cpcAndroid));
			}
		}else {
			SystemUser sysSesstion = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			/*if(sysSesstion != null){
				Map<String,Object> retMap = new HashMap<String,Object>(); 
				retMap.put("code", "1");
				retMap.put("msg", "浏览器里面已经有用户登录,退出其他用户重新登录或者重新打开浏览器登录");
				response.getWriter().println(JSON.toJSONString(retMap));
				return ;
			}*/
		}
		
		//if("tydic!!!".equals(password)){
		//	cpcAndroid = "androidCpcCall";
		//}
		
		//String rand = (String)request.getSession().getAttribute("RANDNUM_KEY");
		String rand = String.valueOf(request.getSession().getAttribute(SaleUtil.RANDOM));
		if(verifyCode!=null && !"".equals(verifyCode) && !verifyCode.equals(rand)){
			Map<String,Object> retMap = new HashMap<String,Object>(); 
			retMap.put("code", "1");
			retMap.put("msg", "验证码错误");
			response.getWriter().println(JSON.toJSONString(retMap));
		}else{
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			password = new Sha512Hash(password).toBase64();
			reqMap.put("PASSWORD", password);
			reqMap.put("LOGIN_CODE", empeeCode);
			reqMap.put("cpcAndroid", "androidCpcCall");
			
			SystemUser systemUser = new SystemUser();
			
			Map<Object,Object> resultMap = new HashMap<Object,Object>();
			resultMap = crmService.login(reqMap);
			
			if(resultMap != null && "0".equals(resultMap.get("code"))){
				//if(!Tools.isNull(dataMap)){//针对手机版需要取出组织信息
					Map<Object,Object> orgInfoMap = null;
					reqMap.put("org_code", resultMap.get("DEPARTMENT_CODE"));
					orgInfoMap = crmService.getSysOrg(reqMap);
					if(Tools.isNull(orgInfoMap) 
							|| Tools.isNull(orgInfoMap.get("list")) 
							|| !(orgInfoMap.get("list") instanceof List)){
						resultMap.put("code", "1");
						resultMap.put("msg", "该员工没有组织机构，不能登录");
					}else{
						List<Map> orgSet = (List<Map>)orgInfoMap.get("list");
						systemUser.setOrgId(String.valueOf(orgSet.get(0).get("org_id")));
						systemUser.setOrgName(String.valueOf(orgSet.get(0).get("org_name")));
						systemUser.setHelpTel(String.valueOf(orgSet.get(0).get("control_number")));
						systemUser.setOrgFlag((String.valueOf(orgSet.get(0).get("org_flag"))));
						systemUser.setOrgSet(orgSet);
						resultMap.put("helpTel", String.valueOf(orgSet.get(0).get("control_number")));
					}
				//}
				
				ISpringContext springInstance = SpringContextUtils.getInstance();
				AuthConfigManagerClient configManager = (AuthConfigManagerClient) springInstance.getBean("configManager");
				String initialPwd = configManager.getProperty("com.tydic.initial.pwd");
				initialPwd = new Sha512Hash(initialPwd).toBase64();
				if(initialPwd.equals(password)) {
					resultMap.put("initialPwdChanged", "N");
				}else {
					resultMap.put("initialPwdChanged", "Y");
				}
				
				systemUser.setStaffId(String.valueOf(resultMap.get("STAFF_ID")));
				systemUser.setStaffName(String.valueOf(resultMap.get("STAFF_NAME")));
				systemUser.setLoginCode(String.valueOf(resultMap.get("LOGIN_CODE")));
				systemUser.setPassWord(String.valueOf(password));
				systemUser.setRegionId(String.valueOf(resultMap.get("REGION_ID")));
				systemUser.setDepartmentCode(String.valueOf(resultMap.get("DEPARTMENT_CODE")));
				systemUser.setMobTel(String.valueOf(resultMap.get("MOB_TEL")));
				

				HttpSession session = request.getSession();
				session.setAttribute(SaleUtil.SYSTEMUSER, systemUser); 
 			}
			
			if(!Tools.isNull(dataMap)){
				super.sendMessagesApp(request,response,  resultMap);
			}else{
				response.getWriter().println(JSON.toJSONString(resultMap));
			}
			
			//readed
			/*if(!Tools.isNull(dataMap)){
				if(resultMap != null && "0".equals(resultMap.get("code"))){
					Map<Object,Object> orgInfoMap = null;
					reqMap.put("org_code", resultMap.get("DEPARTMENT_CODE"));
					orgInfoMap = crmService.getSysOrg(reqMap);
					if(Tools.isNull(orgInfoMap) 
							|| Tools.isNull(orgInfoMap.get("list")) 
							|| !(orgInfoMap.get("list") instanceof List)){
						resultMap.put("code", "1");
						resultMap.put("msg", "该员工没有组织机构，不能登录");
					}else{
						List<Map> orgSet = (List<Map>)orgInfoMap.get("list");
						systemUser.setOrgId(String.valueOf(orgSet.get(0).get("org_id")));
						systemUser.setOrgName(String.valueOf(orgSet.get(0).get("org_name")));
						systemUser.setHelpTel(String.valueOf(orgSet.get(0).get("control_number")));
						systemUser.setOrgSet(orgSet);
						resultMap.put("helpTel", String.valueOf(orgSet.get(0).get("control_number")));
					}
					
					systemUser.setStaffId(String.valueOf(resultMap.get("STAFF_ID")));
					systemUser.setStaffName(String.valueOf(resultMap.get("STAFF_NAME")));
					systemUser.setLoginCode(String.valueOf(resultMap.get("LOGIN_CODE")));
					systemUser.setPassWord(String.valueOf(password));
					systemUser.setRegionId(String.valueOf(resultMap.get("REGION_ID")));
					systemUser.setDepartmentCode(String.valueOf(resultMap.get("DEPARTMENT_CODE")));
					systemUser.setMobTel(String.valueOf(resultMap.get("MOB_TEL")));
					
					HttpSession session = request.getSession();
					session.setAttribute(SaleUtil.SYSTEMUSER, systemUser); 
					
					Map<Object, Object> loginReqMap = new HashMap<Object, Object>();

					SystemUser sysUser = (SystemUser) request.getSession().getAttribute(
							SaleUtil.SYSTEMUSER);
					String userCode = sysUser.getLoginCode();
					String funId = "login";
					String optAttr = "LOGININ";
					String latnId = sysUser.getRegionId();
					String optFrom = "APP";
					String sysId = String.valueOf(dataMap.get("sys_id"));

					loginReqMap.put("userCode", userCode);
					loginReqMap.put("funId", funId);
					loginReqMap.put("optAttr", optAttr);
					loginReqMap.put("latnId", latnId);
					loginReqMap.put("optFrom", optFrom);
					loginReqMap.put("sysId", sysId);

					loginReqMap.put("SERVER_NAME", "saveOptRecordInfo");
					
					crmService.dealObjectFun(loginReqMap);
					
	 			}
				
				//版本校验
				if(!Tools.isNull(dataMap.get("APP_VALDATE_VERSION"))){
					Map<Object,Object> versionMap = this.crmService.appValdateVersion(dataMap);
					if(String.valueOf(versionMap.get("code")).equals("0")){
						resultMap.put("APP_VERSION",versionMap.get("appVersion"));
					}
				}
				
				super.sendMessagesApp(request,response,  resultMap);
			}else{
				response.getWriter().println(JSON.toJSONString(resultMap));
			}*/
		}
	}
	
	/** 
	 * 解密 
	 * @param str 
	 * @return 
	 */  
	public static byte[] decode(String str) {  
	    byte[] data = str.getBytes();  
	    int len = data.length;  
	    ByteArrayOutputStream buf = new ByteArrayOutputStream(len);  
	    int i = 0;  
	    int b1, b2, b3, b4;  
	  
	    while (i < len) {  
	        do {  
	            b1 = base64DecodeChars[data[i++]];  
	        } while (i < len && b1 == -1);  
	        if (b1 == -1) {  
	            break;  
	        }  
	  
	        do {  
	            b2 = base64DecodeChars[data[i++]];  
	        } while (i < len && b2 == -1);  
	        if (b2 == -1) {  
	            break;  
	        }  
	        buf.write((int) ((b1 << 2) | ((b2 & 0x30) >>> 4)));  
	  
	        do {  
	            b3 = data[i++];  
	            if (b3 == 61) {  
	                return buf.toByteArray();  
	            }  
	            b3 = base64DecodeChars[b3];  
	        } while (i < len && b3 == -1);  
	        if (b3 == -1) {  
	            break;  
	        }  
	        buf.write((int) (((b2 & 0x0f) << 4) | ((b3 & 0x3c) >>> 2)));  
	  
	        do {  
	            b4 = data[i++];  
	            if (b4 == 61) {  
	                return buf.toByteArray();  
	            }  
	            b4 = base64DecodeChars[b4];  
	        } while (i < len && b4 == -1);  
	        if (b4 == -1) {  
	            break;  
	        }  
	        buf.write((int) (((b3 & 0x03) << 6) | b4));  
	    }  
	    return buf.toByteArray();  
	}
	 
	
}
