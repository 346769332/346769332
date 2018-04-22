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
/**
 * 短流程需求查询详细类
 * @author dangzw
 */
@WebServlet("/shortProcess/queryRedNode.do")
public class QueryRedNodeServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryRedNodeServlet() {
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String workflowId=request.getParameter("workflowId");
		String demandId=request.getParameter("demandId");
		String flag=request.getParameter("flag");
		reqMap.put("workflowId", workflowId);
		reqMap.put("demandId", demandId);
		reqMap.put("flag", flag);
		reqMap.put("SERVER_NAME", "queryRedNode");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
