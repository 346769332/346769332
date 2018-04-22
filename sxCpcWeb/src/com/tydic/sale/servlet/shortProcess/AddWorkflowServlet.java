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
 * 新建短流程
 * @author dangzw 2016-10-08
 */
@WebServlet("/shortProcess/addWorkflow.do")
public class AddWorkflowServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddWorkflowServlet() {
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
		String pagePara=request.getParameter("pagePara");
		//点击 维护 时用
		String workflowId=request.getParameter("workflowId");

		/**********************************流程信息begin******************************************/
		//流程创建人
		String wcreatorId=systemUser.getStaffId();
		//省级  wlan_id
		String regionId=systemUser.getRegionId();
		//流程名称
		String workflowName = request.getParameter("workflowName");
		//流程分类
		String workflowClass = request.getParameter("workflowClass");
		//流程类型
		String workflowType = request.getParameter("workflowType"); 
		//流程单类型
		String workflowSingleType = request.getParameter("workflowSingleType"); 
		//流程定制类型
		String workflowCustomType = request.getParameter("workflowCustomType"); 
		//使用本地网
		String localNet = request.getParameter("localNet");
		//短流程需求模板
		String workflowTemplateId = request.getParameter("workflowTemplateId");
		/**********************************流程信息end******************************************/
		
		/**********************************节点信息begin******************************************/
		String workflowAlias=request.getParameter("workflowAlias");
		String nodeNames=request.getParameter("nodeNames");
		String nodeTypes=request.getParameter("nodeTypes");
		String nodeTops=request.getParameter("nodeTops");
		String nodeLefts=request.getParameter("nodeLefts");
		String nodeWidths=request.getParameter("nodeWidths");
		String nodeHeights=request.getParameter("nodeHeights");
		/**********************************节点信息end******************************************/
		
		/**********************************线信息begin******************************************/
		String lineFroms=request.getParameter("lineFroms");
		String lineTos=request.getParameter("lineTos");
		String lineTypes=request.getParameter("lineTypes");
		String lineMs=request.getParameter("lineMs");
		String lineNames=request.getParameter("lineNames");
		
		/**********************************线信息end******************************************/
				
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("workflowId", workflowId);
		
		reqMap.put("wcreatorId", wcreatorId);
		reqMap.put("workflowName", workflowName);
		reqMap.put("workflowClass",workflowClass );
		reqMap.put("workflowType",workflowType);
		reqMap.put("workflowSingleType",workflowSingleType);
		reqMap.put("workflowCustomType",workflowCustomType);
		reqMap.put("localNet", localNet);
		reqMap.put("regionId", regionId);
		reqMap.put("workflowTemplateId", workflowTemplateId);
		
		reqMap.put("workflowAlias", workflowAlias);
		reqMap.put("nodeNames", nodeNames);
		reqMap.put("nodeTypes", nodeTypes);
		reqMap.put("nodeTops", nodeTops);
		reqMap.put("nodeLefts", nodeLefts);
		reqMap.put("nodeWidths", nodeWidths);
		reqMap.put("nodeHeights", nodeHeights);
		
		reqMap.put("lineFroms", lineFroms);
		reqMap.put("lineTos", lineTos);
		reqMap.put("lineTypes", lineTypes);
		reqMap.put("lineMs", lineMs);
		reqMap.put("lineNames", lineNames);
		
		reqMap.put("SERVER_NAME", "addWorkflow");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);

		String code=String.valueOf(serMap.get("code"));
		if(StringUtil.isNotEmpty(code) && code.equals("0")){
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap.put("code", "0");
			resultMap.put("workflowId", serMap.get("workflowId"));
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
