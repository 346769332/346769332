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
@WebServlet("/shortProcess/queryWorkFlowList.do")
public class QueryWorkFlowListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryWorkFlowListServlet() {
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
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String methodType = request.getParameter("methodType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		
		if("query".equals(methodType)) {
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			
			reqMap.put("latnId",request.getParameter("latnId"));
			reqMap.put("workflowState", request.getParameter("workflowState"));
			reqMap.put("workflowNbr", request.getParameter("workflowNbr"));
			reqMap.put("workflowName", request.getParameter("workflowName"));
			reqMap.put("selectWorkflowType", request.getParameter("selectWorkflowType"));
			reqMap.put("selectWorkflowSort", request.getParameter("selectWorkflowSort"));
			reqMap.put("regionId", systemUser.getRegionId());
			//reqMap.put("staffOrg", request.getParameter("staffOrg"));
			//reqMap.put("staffPhone", request.getParameter("staffPhone"));
			
			reqMap.put("SERVER_NAME", "queryActWorkflwoInfoList");
			
		}else{
			reqMap.put("regionId", systemUser.getRegionId());
			String workflowId=request.getParameter("workflowId");
			reqMap.put("SERVER_NAME", "getOneWorkflowData");
			reqMap.put("workflowId", workflowId);
		}
		Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
		resultMap.put("code", "1");
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
