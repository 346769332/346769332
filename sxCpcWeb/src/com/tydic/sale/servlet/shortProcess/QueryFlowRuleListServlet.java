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
import com.tydic.sale.utils.StringUtil;
/**
 * 规则查询类
 * @author simon
 */
@WebServlet("/shortProcess/flowRule.do")
public class QueryFlowRuleListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryFlowRuleListServlet() {
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

		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String hanleType = request.getParameter("hanleType");
		//规则名称
		String flowRuleName = request.getParameter("flowRuleName");
		if("qryFlowRuleInfo".equals(hanleType)){
			String pageSize = request.getParameter("pageSize");
			String pageNum = request.getParameter("limit");
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("flowRuleName", flowRuleName);
			reqMap.put("pagesize", pageSize);
			reqMap.put("pagenum", (Integer.parseInt(pageNum)));
			reqMap.put("SERVER_NAME", "queryFlowRuleInfo");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);

			String code=String.valueOf(serMap.get("code"));
			if(StringUtil.isNotEmpty(code) && code.equals("0")){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
		}
		//往前台发送消息
		sendMessages(response, JSON.toJSONString(resultMap));
	}
}
