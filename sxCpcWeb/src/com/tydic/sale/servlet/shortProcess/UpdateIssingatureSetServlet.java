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
 * 会签节点设置
 * @author lt
 */
@WebServlet("/shortProcess/updateIssingatureSet.do")
public class UpdateIssingatureSetServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateIssingatureSetServlet() {
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String nodeId = request.getParameter("nodeId");
		String isSignature = request.getParameter("isSignature");
		reqMap.put("nodeId", nodeId);
		reqMap.put("isSignature", isSignature);
		reqMap.put("SERVER_NAME", "updateIssingatureSet");
		Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
