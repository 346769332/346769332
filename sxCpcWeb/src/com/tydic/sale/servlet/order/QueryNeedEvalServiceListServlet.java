package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.utils.StringUtils;

@WebServlet("/order/queryNeedEvalServiceList.do")
public class QueryNeedEvalServiceListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryNeedEvalServiceListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryNeedEvalServiceListServlet() {
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String serviceIds=request.getParameter("serviceIds");
		reqMap.put("serviceIds", serviceIds);
		Map<Object,Object> serMap =crmService.queryNeedEvalServiceList(reqMap);
		resultMap.put("code", "1");
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
