package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.auth.client.utils.CookiesUtils;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sale/clearSession.do")
public class ClearSessionServlet extends AbstractServlet {

	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory
			.getLogger(LogoutServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
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
	@SuppressWarnings({ "rawtypes", "unused" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		Cookie cookie = CookiesUtils.getCookie(request, com.tydic.auth.client.utils.Constants.SERVICE_TOKEN_KEY);
		if(null != cookie){
			String svcToken = cookie.getValue();
			//清缓存中数据
//			ISpringContext springInstance = SpringContextUtils.getInstance();
//			TairManager orderTairManager 	= (TairManager)			springInstance.getBean(Constants.SPRINT_BEAN_TAIL_ORDER			);
			
			getOrderTairManager().delete(Constant.SYSTEM_USER, SaleUtil.getTairKey(svcToken, SaleUtil.SYSTEMUSER));
			
			getOrderTairManager().delete(Constant.TB_PTY_INTER_ORG, SaleUtil.getTairKey(svcToken, SaleUtil.ORG));
			
			getOrderTairManager().delete(Constant.PRIVILEGE, SaleUtil.getTairKey(svcToken, SaleUtil.PRIVILEGE));
			
		}
		
		HttpSession oldSession = request.getSession(false);
		if(oldSession != null ){
			oldSession.invalidate();
		}
		CookiesUtils.invalidAllCookies(request, response);
		
		Map map = new HashMap();
		map.put("code", "0");
		String json = JSON.toJSONString(map);
		response.getWriter().println(json);
		
	}
	
	
}
