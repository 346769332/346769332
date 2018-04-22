package com.tydic.sale.servlet.shortProcess;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
/**
 * 短流程需求查询类
 * @author lt
 */
@WebServlet("/shortProcess/queryWorkflwoSortAndType.do")
public class QueryWorkflwoSortAndTypeServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryWorkflwoSortAndTypeServlet() {
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		String flag = request.getParameter("flag");
		String workflowClass = request.getParameter("workflowClass");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("SERVER_NAME", "queryWorkflwoSortAndType");
		reqMap.put("flag", flag);
		reqMap.put("workflowClass", workflowClass);
		Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
