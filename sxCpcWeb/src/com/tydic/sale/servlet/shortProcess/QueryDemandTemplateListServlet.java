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
 * 模板查询类
 * @author dangzw
 */
@WebServlet("/shortProcess/queryDemandTemplateList.do")
public class QueryDemandTemplateListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDemandTemplateListServlet() {
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
		String pageSize = request.getParameter("pageSize");
		String pageNum = request.getParameter("limit");
		//需求模板名称
		String demandTemplateName = request.getParameter("templateName");
		//发布人
		String sendUserName = request.getParameter("sendUserName");
		//适用短流程类型
		String applyWorkflowType = request.getParameter("applyWorkflowType");
		//发布单位
		String departName = request.getParameter("departName");
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("demandTemplateName", demandTemplateName);
		reqMap.put("sendUserName",sendUserName);
		reqMap.put("applyWorkflowType",applyWorkflowType );
		reqMap.put("departName",departName );
		reqMap.put("pagesize", pageSize);
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("SERVER_NAME", "queryDemandTemplateInfo");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);

		String code=String.valueOf(serMap.get("code"));
		if(StringUtil.isNotEmpty(code) && code.equals("0")){
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
