package com.tydic.sale.servlet.common;

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

@WebServlet("/cpc/queryDicData.do")
public class QueryDicDataServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(QueryDicDataServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDicDataServlet() {
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
		String dicType = request.getParameter("dicType");
		//查询字典表数据
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("dicType", dicType);
		resultMap = crmService.getdic(reqMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
