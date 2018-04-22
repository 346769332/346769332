package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.taobao.tair.DataEntry;
import com.taobao.tair.Result;
import com.tydic.crm.spec.domain.Request;
import com.tydic.crm.spec.domain.Response;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.ObjectUtils;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sale/checkRand.do")
public class CheckRand extends AbstractServlet{
	
	private Map<String, String>  sooRel = new HashMap<String, String>();
	private Map<String,Object> operationrRcordMap = new HashMap<String, Object>();
	
	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map rcordAttrMap = new HashMap();
		
		String rand = (String) request.getSession().getAttribute(Const.RANDNUM_KEY);
		// 获取登录页面输入的验证码
		String verifyCode = request.getParameter("verifyCode");
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		String ret = null;
		if(null == rand || "".equals(rand)){
			String token = getTokenIdFromCookie(SaleUtil.VERIFYCODE);
			// 放入缓存中
			Result<DataEntry> result = getOrderTairManager().get(Constant.VERIFYCODE, token);
			if(result.isSuccess()){
				DataEntry entry = result.getValue();
				if(null != entry){
					rand = (String) entry.getValue();
				}
			}			
		}
		if (rand == null || "".equals(rand)) {
			ret = "{\"message\":\"验证码已过期\",\"success\":\"false\",\"appId\":\""+"getAppId()"+"\"}";
			rcordAttrMap.put("ATTR_VALUE", "1001002"); 
		} else if (null == verifyCode || !verifyCode.equals(rand)) {
			 ret = "{\"message\":\"验证码错误\",\"success\":\"false\",\"appId\":\""+"getAppId()"+"\"}";
			 rcordAttrMap.put("ATTR_VALUE", "1001002"); 
		}else{
			 ret = "{\"message\":\"验证码正确\",\"success\":\"true\",\"appId\":\""+"getAppId()"+"\"}";
			 rcordAttrMap.put("ATTR_VALUE", "1001001"); 
		}
		
		if(null != out){
			out.println(ret);			
			out.close();
		}
	}
	
	
	
}
