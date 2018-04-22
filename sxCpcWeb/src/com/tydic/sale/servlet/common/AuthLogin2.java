package com.tydic.sale.servlet.common;

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

@WebServlet("/sale/authLogin2.do")
public class AuthLogin2 extends AbstractServlet{
	
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
			empeeCode = String.valueOf(dataMap.get("empeeCode")) ;
			password = String.valueOf(dataMap.get("password")) ;
			cpcAndroid = String.valueOf(dataMap.get("cpcAndroid")) ;
		}else {
			SystemUser sysSesstion = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			if(sysSesstion != null){
				Map<String,Object> retMap = new HashMap<String,Object>(); 
				retMap.put("code", "1");
				retMap.put("msg", "浏览器里面已经有用户登录,退出其他用户重新登录或者重新打开浏览器登录");
				response.getWriter().println(JSON.toJSONString(retMap));
				return ;
			}
		}
		
		 
		String rand = (String)request.getSession().getAttribute("RANDNUM_KEY");
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
			reqMap.put("cpcAndroid", cpcAndroid);
			
			SystemUser systemUser = new SystemUser();
			
			Map<Object,Object> resultMap = new HashMap<Object,Object>();
			resultMap = crmService.login(reqMap);
			
			if(resultMap != null && "0".equals(resultMap.get("code"))){
				if(!Tools.isNull(dataMap)){//针对手机版需要取出组织信息
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
				}
				
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
		}
	}
	 
	
}
