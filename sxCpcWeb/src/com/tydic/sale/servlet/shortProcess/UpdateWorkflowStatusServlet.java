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
 * 更新流程状态类
 * @author dangzw
 */
@WebServlet("/shortProcess/updateWorkflowStatus.do")
public class UpdateWorkflowStatusServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateWorkflowStatusServlet() {
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
		String methodType=request.getParameter("methodType");
		String authority=request.getParameter("authority");
		String workflowId=request.getParameter("workflowId");
		String wlanId=request.getParameter("wlanId");
		//methodType 表示 保存草稿
		if(methodType.equals("saveDraft")){
			reqMap.put("SERVER_NAME", "updateStatusToDraft");
		}else{
			reqMap.put("SERVER_NAME", "updateStatusToPublish");
		}
		reqMap.put("wlanId", wlanId);
		reqMap.put("authority", authority);
		reqMap.put("workflowId", workflowId);
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
