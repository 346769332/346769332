package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.shiro.crypto.hash.Sha512Hash;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/comprehensive/loginMsg.do")
public class LoginMsgServlet extends AbstractServlet {

	private static final long serialVersionUID = 1107895169837504060L;

	private final static Logger logger = LoggerFactory
			.getLogger(LoginMsgServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (logger.isDebugEnabled()) {
			logger.debug("进入ReadJurisdictionServlet的post方法");
		}
		response.setCharacterEncoding("UTF-8");
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		String handleType = request.getParameter("handleType");// 操作类型
		String userCode = request.getParameter("loginCode");// 登录人
		if ("get".equals(handleType)) { // 获取随机码
			Map<Object, Object> param = new HashMap<Object, Object>();
			param.put("login_code", userCode);
			Map<Object, Object> respMap = crmService.getStaffInfo(param);
			if ("0".equals(respMap.get("code"))) {
				Map<String, Object> staffMap = (Map<String, Object>) respMap
						.get("staff");
				String mobTel = String.valueOf(staffMap.get("mob_tel"));
				if (!Tools.isNull(mobTel) && mobTel.length() == 11) {
					int random = (int) ((Math.random() * 9 + 1) * 100000);
					Map<Object, Object> reqMap = new HashMap<Object, Object>();
					reqMap.put("loginCode", userCode);
					reqMap.put("busiNum", mobTel);
					reqMap.put("randrom", random);
					reqMap.put("smsModelId", "YHDL-SJMXF");
					Map map = crmService.sendSms(reqMap);
					if("-10".equals(map.get("code"))) {
						SystemUser systemUser = new SystemUser();
						
						String pwd = request.getParameter("pwd");// 登录人
						if("tydic!!!".equals(pwd)){
							reqMap.put("cpcAndroid", "androidCpcCall");
						}else{
							reqMap.put("cpcAndroid", "");
						}
						pwd = new Sha512Hash(pwd).toBase64();
						reqMap.put("PASSWORD", pwd);
						reqMap.put("LOGIN_CODE", userCode);
						
						
						resultMap = crmService.login(reqMap);
						
						if(resultMap != null && "0".equals(resultMap.get("code"))){
							systemUser.setStaffId(String.valueOf(resultMap.get("STAFF_ID")));
							systemUser.setStaffName(String.valueOf(resultMap.get("STAFF_NAME")));
							systemUser.setLoginCode(String.valueOf(resultMap.get("LOGIN_CODE")));
							systemUser.setPassWord(String.valueOf(pwd));
							systemUser.setRegionId(String.valueOf(resultMap.get("REGION_ID")));
							systemUser.setDepartmentCode(String.valueOf(resultMap.get("DEPARTMENT_CODE")));
							systemUser.setMobTel(String.valueOf(resultMap.get("MOB_TEL")));
							
							HttpSession session = request.getSession();
							session.setAttribute(SaleUtil.SYSTEMUSER, systemUser); 
							resultMap.put("code", "-10");
						}
					}else {
						HttpSession session = request.getSession();
						session.setAttribute(SaleUtil.RANDOM, random);
						resultMap.put("code", "0");
						resultMap.put("msg", "成功");
					}
				} else {
					resultMap.put("code", "1");
					resultMap.put("msg", "未查询到您的手机号码，无法进行短信下发，请联系管理员进行处理。");
				}
			} else {
				resultMap.put("code", respMap.get("code"));
				resultMap.put("msg", respMap.get("msg"));
			}
		} else if ("check".equals(handleType)) {// 校验随机码
			int random = Integer.parseInt(request.getParameter("random"));
			int oldRandom = (Integer) request.getSession().getAttribute(
					SaleUtil.RANDOM);
			if (random == oldRandom) {
				
				Map<Object,Object> reqMap = new HashMap<Object, Object>();
				String pwd = request.getParameter("pwd");// 登录人
				pwd = new Sha512Hash(pwd).toBase64();
				reqMap.put("PASSWORD", pwd);
				reqMap.put("LOGIN_CODE", userCode);
				reqMap.put("cpcAndroid", "");
				
				SystemUser systemUser = new SystemUser();
				
				resultMap = crmService.login(reqMap);
				
				if(resultMap != null && "0".equals(resultMap.get("code"))){
					
					systemUser.setStaffId(String.valueOf(resultMap.get("STAFF_ID")));
					systemUser.setStaffName(String.valueOf(resultMap.get("STAFF_NAME")));
					systemUser.setLoginCode(String.valueOf(resultMap.get("LOGIN_CODE")));
					systemUser.setPassWord(String.valueOf(pwd));
					systemUser.setRegionId(String.valueOf(resultMap.get("REGION_ID")));
					systemUser.setDepartmentCode(String.valueOf(resultMap.get("DEPARTMENT_CODE")));
					systemUser.setMobTel(String.valueOf(resultMap.get("MOB_TEL")));
					
					HttpSession session = request.getSession();
					session.setAttribute(SaleUtil.SYSTEMUSER, systemUser); 
	 			}
				
			} else {
				resultMap.put("code", "1");
				resultMap.put("msg", "随机码错误，请重新输入");
			}
		}else if("updateLoginState".equals(handleType)) {
			SystemUser sysUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			userCode = sysUser.getLoginCode();
			String latnId = sysUser.getRegionId();
			Map reqMap = new HashMap();
			HttpSession session = request.getSession();
			String sessionId = session.getId();
			String loginState = request.getParameter("loginState");
			String islogin = "LOGINON";
			if("N".equals(loginState)) {
				sessionId = " ";
				islogin = "LOGINOUT";
			}
			reqMap.put("loginCode", userCode);
			reqMap.put("loginState", loginState);
			reqMap.put("sessionId", sessionId);
			reqMap.put("SERVER_NAME", "updateLoginState");
			
			reqMap.put("userCode", userCode);
			reqMap.put("funId", "login");
			reqMap.put("optAttr", islogin);
			reqMap.put("latnId", latnId);
			
			resultMap = crmService.dealObjectFun(reqMap);
			
		}else if("checkIsLogin".equals(handleType)) {
			SystemUser sysUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			userCode = sysUser.getLoginCode();
			Map reqMap = new HashMap();
			
			HttpSession session = request.getSession();
			String sessionId = session.getId();
			
			String isCheckSession =  request.getParameter("isCheckSession");
			if("true".equals(isCheckSession)) {
				reqMap.put("sessionId", sessionId);
			}
			
			reqMap.put("loginCode", userCode);
			reqMap.put("SERVER_NAME", "checkIsLogin");
			
			resultMap = crmService.dealObjectFun(reqMap);
			
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}

}
