package com.tydic.sale.servlet.shortProcess;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
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
 * 修改短流程
 * @author simon 2017-09-25
 */
@WebServlet("/shortProcess/updateWorkflowneed.do")
public class UpdateWorkflowNeedServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateWorkflowNeedServlet() {
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
		/**********************************需求******************************************/
		//获取需求ID
		Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
		reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
		Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
		List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
		//本地网
		String latnId=systemUser.getRegionId();
		String latnName=systemUser.getRegionName();
		
		//需求ID
        String type=request.getParameter("type");
	    int demandId=Integer.parseInt(request.getParameter("demandId"));

		//需求名称
		String demandName=request.getParameter("demandName");
		//需求状态
		String demandState="1000";
		//需求编码
		String demandCode=request.getParameter("demandCode");		
		//需求描述
		String demandDesc=request.getParameter("demandDesc");
		//是否统一认证
		String isCertification=request.getParameter("isCertification");
		//所属短流程ID
		String workflowId=request.getParameter("workflowId");
		//是否超时
		String isNotTime="0";
		//需求结束流转时间 
		
		//需求发起人ID
		String StaffId = systemUser.getStaffId();
		//需求发起人名称
		String StaffName = systemUser.getStaffName();
		//需求发起人名称
		String phone = request.getParameter("phone");
		//是否平价
		String isNotPingJia="0";

		/**********************************需求任务******************************************/
		//任务ID
		int questId=(Integer) list.get(0).get("QUESTID");

		//节点ID1
		String node1 = request.getParameter("now_node_id");
		String now_node_id = request.getParameter("now_node_id");
		//节点ID2
		String node2 = request.getParameter("next_node_id");
		//处理人ID1
		String chulirenid1 = systemUser.getStaffId(); 
		//处理人ID2
		String chulirenid2 = request.getParameter("operator_Id");
		//处理人被授权人ID2
		String ear_chulirenid2 = request.getParameter("ear_operator_Id");
		//处理人名称1
		String chulirenname1 = systemUser.getStaffName(); 
		//处理人名称2
		String chulirenname2 = request.getParameter("operator_Name");
		//处理人被授权人名称2
		String ear_chulirenname2 = request.getParameter("ear_operator_Name");
		//处理人部门ID1
		String chulideptid1 = systemUser.getOrgId(); 
		//处理人部门ID2
		String chulideptid2 = request.getParameter("operator_dept_Id");
		//处理人被授权人部门ID2
		String ear_chulideptid2 = request.getParameter("ear_operator_dept_Id");
		//处理人部门名称1
		String chulideptname1 = systemUser.getOrgName(); 
		//处理人部门名称2
		String chulideptname2 = request.getParameter("operator_dept_Name");
		//处理人被授权人部门名称2
		String ear_chulideptname2 = request.getParameter("ear_operator_dept_Name");
		//任务类型
		String questtype=request.getParameter("questtype");;
		/**********************************需求模板实例化表******************************************/
	    //模板实例ID
		int templateid=(Integer) list.get(0).get("TEMPLATEID");

		//模板属性
		String attrName=request.getParameter("attrName");
		String attrId=request.getParameter("attrId");
		String attrOname=request.getParameter("attrOname");
		String attrValue=request.getParameter("attrValue");
		String templateId=request.getParameter("templateId");
		//获取第二部 处理时限
		
		/**********************************参数存入map******************************************/
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("latnId", latnId);
		reqMap.put("latn_id", systemUser.getRegionId());
		reqMap.put("latnName", latnName);
		reqMap.put("demandId", demandId);
		reqMap.put("demandName", demandName);
		reqMap.put("demandState", demandState);
		reqMap.put("demandCode", demandCode);
		reqMap.put("demandDesc", demandDesc);
		reqMap.put("isCertification", isCertification);
		reqMap.put("workflowId", workflowId);
		reqMap.put("isNotTime", isNotTime);
		reqMap.put("StaffId", StaffId);
		reqMap.put("StaffName", StaffName);
		reqMap.put("phone", phone);
		reqMap.put("isNotPingJia", isNotPingJia);
		reqMap.put("questId", questId);
		reqMap.put("node1", node1);
		reqMap.put("node2", node2);
		reqMap.put("now_node_id", now_node_id);
		reqMap.put("chulirenid1", chulirenid1);
		reqMap.put("chulirenid2", chulirenid2);
		reqMap.put("ear_chulirenid2", ear_chulirenid2);
		reqMap.put("chulirenname1", chulirenname1);
		reqMap.put("chulirenname2", chulirenname2);
		reqMap.put("ear_chulirenname2", ear_chulirenname2);
		reqMap.put("chulideptid1", chulideptid1);
		reqMap.put("chulideptid2", chulideptid2);
		reqMap.put("ear_chulideptid2", ear_chulideptid2);
		reqMap.put("chulideptname1", chulideptname1);
		reqMap.put("chulideptname2", chulideptname2);
		reqMap.put("ear_chulideptname2", ear_chulideptname2);
		reqMap.put("questtype", questtype);
		reqMap.put("templateId", templateId);
		reqMap.put("attrValue", attrValue);
		reqMap.put("attrId", attrId);
		reqMap.put("attrOname", attrOname);
		reqMap.put("attrName", attrName);
		reqMap.put("type", type);
		reqMap.put("SERVER_NAME", "updateWorkflowNeed");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);

		String code=String.valueOf(serMap.get("code"));
		if(StringUtil.isNotEmpty(code) && code.equals("0")){
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap.put("code", "0");
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
