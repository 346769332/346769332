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
 * 要发布的流程信息查询
 * @author dangzw
 */
@WebServlet("/shortProcess/queryWorkflowPublishList.do")
public class QueryWorkflowPublishListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryWorkflowPublishListServlet() {
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
		String flag=String.valueOf(request.getParameter("flag"));
		if(!flag.equals("null")){
			//1      查询父流程的标识
			if(flag.equals("1")){
				reqMap.put("SERVER_NAME", "queryWorkflowPublishParentList");
			}else{
				reqMap.put("SERVER_NAME", "queryWorkflowPublishSonList");
			}
			String workflowId=request.getParameter("workflowId");
			reqMap.put("workflowId", workflowId);
		}
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
