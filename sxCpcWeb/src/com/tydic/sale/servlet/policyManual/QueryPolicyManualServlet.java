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
import com.tydic.sale.utils.Tools;

@WebServlet("/policyManual/queryPolicyManual.do")
public class QueryPolicyManualServlet extends AbstractServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(QueryPolicyManualServlet.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryPolicyManualServlet() {
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
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize"); 
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();

		reqMap.put("promoters_id", systemUser.getStaffId());
		reqMap.put("promoters", systemUser.getStaffName());
		reqMap.put("latn_id", systemUser.getRegionId());
		
		
		resultMap.put("promoters_id", systemUser.getStaffId());
		resultMap.put("promoters", systemUser.getStaffName());
		//查询单个政策
		if(request.getParameter("id") != null){
 			reqMap.put("id", request.getParameter("id"));
			reqMap.put("source", "isnotnull"); 
			reqMap.put("queryType", "queryAll");
			reqMap.put("SERVER_NAME", "queryPolicyManualList");
 		}else{
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			
			reqMap.put("policyId",request.getParameter("policyId"));
			reqMap.put("polChilId", request.getParameter("polChilId"));
			reqMap.put("polContent", request.getParameter("polContent"));
			reqMap.put("endData", request.getParameter("endData"));
			reqMap.put("sendData", request.getParameter("sendData"));
			reqMap.put("SERVER_NAME", "queryPolicyManualList");
			
		}
		
		reqMap.put("state", request.getParameter("status"));
		
		Map<Object,Object> serMap = crmService.dealObjectFun(reqMap); 
		
		resultMap.put("code", "1");
		resultMap.put("latn_id",reqMap.get("latn_id"));
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
			
	}
}
