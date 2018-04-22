package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.io.PrintWriter;
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

@WebServlet("/sale/logout.do")
public class LogoutServlet extends AbstractServlet {

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
		HttpSession oldSession = request.getSession(false);
		if(oldSession != null ){
			oldSession.invalidate();
		}
		PrintWriter writer = response.getWriter();
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("OK", "ok");
		writer.print(JSON.toJSONString(resultMap));
	}
	
}
