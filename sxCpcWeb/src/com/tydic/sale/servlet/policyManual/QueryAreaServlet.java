package com.tydic.sale.servlet.policyManual;

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
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/policyManual/queryArea.do")
public class QueryAreaServlet extends AbstractServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(QueryAreaServlet.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryAreaServlet() {
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
		Map<Object,Object> resultMap =new HashMap<Object, Object>();

 		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("pmId",request.getParameter("pmId"));
		reqMap.put("PMId", request.getParameter("pmId"));
		reqMap.put("serch_type",request.getParameter("serch_type"));
		
		reqMap.put("pageIndex",request.getParameter("pageIndex"));
		reqMap.put("pageSize",request.getParameter("pageSize"));
		if(StringUtil.objIsNotEmpty(request.getParameter("limit"))){
			reqMap.put("limit",request.getParameter("limit"));
		}
		reqMap.put("latn_id", systemUser.getRegionId());
		reqMap.put("SERVER_NAME", "queryAreaData");
		resultMap = crmService.dealObjectFun(reqMap);
		resultMap.put("latn_id",reqMap.get("latn_id"));
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
