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
 * 更新节点信息类
 * @author dangzw
 */
@WebServlet("/shortProcess/updateWorkflowStatusToStop.do")
public class UpdateWFStatusToStopServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateWFStatusToStopServlet() {
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
		reqMap.put("SERVER_NAME", "updateWFStatusToStop");
		reqMap.put("workflowId", workflowId);
		if(workflowId!=null && !workflowId.equals("")){
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
			}
		}else{
			resultMap.put("code", "1");
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
