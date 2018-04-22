package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.HashMap;
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
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/comprehensive/forgetPassWord.do")
public class ForgetPassWordServlet extends AbstractServlet {

	private static final long serialVersionUID = 1107895169837504060L;
	
	private final static Logger logger = LoggerFactory
			.getLogger(ForgetPassWordServlet.class);

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
	@SuppressWarnings({ "rawtypes", "unused", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if(logger.isDebugEnabled()){
			logger.debug("进入ReadJurisdictionServlet的post方法");
		}
		response.setCharacterEncoding("UTF-8");
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		
		String handleType = request.getParameter("handleType");//操作类型
		String userCode = request.getParameter("userCode");
		if("get".equals(handleType)){ //获取随机码
			Map<Object,Object> param = new HashMap<Object, Object>();
			param.put("login_code", userCode);
			Map<Object,Object> respMap = crmService.getStaffInfo(param);
			if("0".equals(respMap.get("code"))){
				Map<String,Object> staffMap = (Map<String, Object>) respMap.get("staff");
				String mobTel = String.valueOf(staffMap.get("mob_tel"));
				if(!Tools.isNull(mobTel) && mobTel.length() == 11){
					int random = (int)((Math.random()*9+1)*100000);
					Map<Object,Object> reqMap = new HashMap<Object,Object>();
					reqMap.put("loginCode", userCode);
					reqMap.put("busiNum",mobTel);
					reqMap.put("randrom",random);
					reqMap.put("smsModelId", "WJMM-SJMXF");
					crmService.sendSms(reqMap);
					HttpSession session = request.getSession();
					session.setAttribute(SaleUtil.RANDOM, random); 
					String userMobTel = mobTel.substring(0, 3)+"****"+mobTel.substring(7, 11);
					resultMap.put("code", "0");
					resultMap.put("msg", "短信已下发到您"+userMobTel+"的手机号码上，请注意查收。");
				}else{
					resultMap.put("code", "1");
					resultMap.put("msg", "未查询到您的手机号码，无法进行短信下发，请联系管理员进行处理。");
				}
			}else{
				resultMap.put("code", respMap.get("code"));
				resultMap.put("msg", respMap.get("msg"));
			}
		}else if("check".equals(handleType)){//校验随机码
			//int random = Integer.parseInt(request.getParameter("random"));
			//int oldRandom =  (Integer) request.getSession().getAttribute(SaleUtil.RANDOM);
			String random=String.valueOf(request.getParameter("random"));
			String oldRandom=String.valueOf(request.getSession().getAttribute(SaleUtil.RANDOM));
			if(random.equals(oldRandom)){
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
			}else{
				resultMap.put("code", "1");
				resultMap.put("msg", "随机码错误，请重新输入");
			}
		}else if("update".equals(handleType)){ //密码修改
			String newPassWord = request.getParameter("newPwd").trim();
			newPassWord = new Sha512Hash(newPassWord).toBase64();
			Map<Object,Object> reqMap = new HashMap<Object,Object>();
			reqMap.put("passWord", newPassWord);
			reqMap.put("login_code", userCode);
			resultMap = crmService.updatePwd(reqMap);
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	
}
