package com.tydic.sale.servlet.policyManual.app;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.report.SearchReportPublicConfigServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/app/searchPolicyManualInfo.do")
public class SearchPolicyManualInfoServlet extends AbstractServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(SearchPolicyManualInfoServlet.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchPolicyManualInfoServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

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
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		//查询
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		reqParamMap.put("latn_id", systemUser.getRegionId());
		
		reqParamMap.put("id", reqParamMap.get("id"));
		reqParamMap.put("source", "isnotnull"); 
		reqParamMap.put("queryType", "queryAll");
		reqParamMap.put("SERVER_NAME", "queryPolicyManualList");
		Map<Object,Object> resultMap = super.crmService.dealObjectFun(reqParamMap);
		super.sendMessagesApp(request,response,  resultMap);
	}
}
