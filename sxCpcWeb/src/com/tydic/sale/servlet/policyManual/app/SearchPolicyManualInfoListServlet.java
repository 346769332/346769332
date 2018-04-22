package com.tydic.sale.servlet.policyManual.app;

import java.io.IOException;
import java.util.HashMap;
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
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/app/searchPolicyManualInfoList.do")
public class SearchPolicyManualInfoListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(SearchPolicyManualInfoListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchPolicyManualInfoListServlet() {
		super(); 
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
//		String pageNum = String.valueOf(reqParamMap.get("pageIndex"));
//		reqParamMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqParamMap.put("limit", reqParamMap.get("pageIndex"));
		reqParamMap.put("pagenum", reqParamMap.get("pageIndex"));
		reqParamMap.put("pagesize", reqParamMap.get("pageSize"));
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		reqParamMap.put("latn_id", systemUser.getRegionId());
		//查询
		reqParamMap.put("SERVER_NAME", "searchPolicyManualInfoList");
		Map<Object,Object> resultMap = super.crmService.dealObjectFun(reqParamMap);
		
		super.sendMessagesApp(request,response,  resultMap);
	}
	
}
