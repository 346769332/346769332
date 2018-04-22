package com.tydic.sale.servlet.sysManage;

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

@WebServlet("/sysManage/queryRoleList.do")
public class QueryRoleListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryRoleListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryRoleListServlet() {
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
		
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize", pageSize);
		
		reqMap.put("latnId",request.getParameter("latnId"));
		reqMap.put("roleName", request.getParameter("roleName"));
		reqMap.put("roleType", request.getParameter("roleType"));
		reqMap.put("roleState", request.getParameter("roleState"));
		Map<Object,Object> serMap = crmService.queryRoleList(reqMap);
		resultMap.put("code", "1");
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}

}
