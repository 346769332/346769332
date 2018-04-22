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
 * 新建短流程
 * @author LuoTong 2016-10-22
 */
@WebServlet("/shortProcess/addWorkflowneedd.do")
public class AddWorkflowNeeddServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddWorkflowNeeddServlet() {
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
		/**********************************需求任务******************************************/
		//任务ID
		int questId=(Integer) list.get(0).get("QUESTID");
		//需求ID
        String demandId = request.getParameter("demandId");
        //需求主题
        String demandName = request.getParameter("demandName");
        //需求编码
        String demandCode = request.getParameter("demandCode");
		//流程ID
        String workflowId = request.getParameter("workflowId");
		//下一节点
		String node2 = request.getParameter("node2");
		//下一节点处理人ID
		String chulirenid2 = request.getParameter("chulirenid2");
		//下一节点处理人名称
		String chulirenname2 = request.getParameter("chulirenname2");
		//下一节点处理人部门ID
		String chulideptid2 = request.getParameter("chulideptid2");
		//下一节点处理人部门名称
		String chulideptname2 = request.getParameter("chulideptname2");
		
		//处理人被授权人ID2
		String ear_chulirenid2 = request.getParameter("ear_operator_Id");
		//处理人被授权人名称2
		String ear_chulirenname2 = request.getParameter("ear_operator_Name");
		//处理人被授权人部门ID2
		String ear_chulideptid2 = request.getParameter("ear_operator_dept_Id");
		//处理人被授权人名称2
		String ear_chulideptname2 = request.getParameter("ear_operator_dept_Name");
		
		//任务类型
		String questtype=request.getParameter("questtype");
		//日志任务ID
		String taskId=request.getParameter("taskId");
		//审批结果
		String disposeRadio=request.getParameter("disposeRadio");
		//审批意见
		String disposeDesc=request.getParameter("disposeDesc");
		//当前节点处理人ID
		String chulirenid1 =systemUser.getStaffId();
		//当前节点处理人名称
		String chulirenname1 = systemUser.getStaffName();
		//当前节点处理人部门ID
		String chulideptid1 = systemUser.getOrgId();
		//当前节点处理人部门名称
		//String chulideptname1 = systemUser.getOrgName();
		
		//本节点处理人ID
		String now_ear_chulirenid1 =request.getParameter("now_ear_operator_Id");
		//本节点处理人名称
		String now_ear_chulirenname1 = request.getParameter("now_ear_operator_Name");
		//本节点处理人部门ID
		String now_ear_chulideptid1 = request.getParameter("now_ear_operator_dept_Id");
		//本节点处理人部门名称
		String now_ear_chulideptname1 = request.getParameter("now_ear_operator_dept_Name");
		
		//当前节点ID
		String now_node_id=request.getParameter("now_node_id");
		//处理时限
		int timeLimit=Integer.parseInt(String.valueOf(request.getParameter("timeLimit")));
		//是否超时
		String isEndTime=request.getParameter("isEndTime");
		//催单次数
				String urgeCount=request.getParameter("urgeCount");
				//催单时间
				String urgeTime =request.getParameter("urgeTime");
		//会签标识
		String countersign=request.getParameter("countersign");
		/**********************************参数存入map******************************************/
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("questId", questId);
		reqMap.put("demandId", demandId);
		reqMap.put("demandName", demandName);
		reqMap.put("demandCode", demandCode);
		reqMap.put("workflowId", workflowId);
		reqMap.put("node2", node2);
		reqMap.put("chulirenid2", chulirenid2);
		reqMap.put("chulirenname2", chulirenname2);
		reqMap.put("chulideptid2", chulideptid2);
		reqMap.put("chulideptname2", chulideptname2);
		if(ear_chulirenid2==null){
			reqMap.put("ear_chulirenid2", "");
			reqMap.put("ear_chulirenname2", "");
			reqMap.put("ear_chulideptid2", "");
			reqMap.put("ear_chulideptname2", "");	
		}else{
			reqMap.put("ear_chulirenid2", ear_chulirenid2);
			reqMap.put("ear_chulirenname2", ear_chulirenname2);
			reqMap.put("ear_chulideptid2", ear_chulideptid2);
			reqMap.put("ear_chulideptname2", ear_chulideptname2);	
		}
		
		reqMap.put("questtype", questtype);
		reqMap.put("taskId", taskId);
		reqMap.put("latn_id", systemUser.getRegionId());
		reqMap.put("disposeRadio", disposeRadio);
		reqMap.put("disposeDesc", disposeDesc);
		
		reqMap.put("chulirenid1", chulirenid1);
		reqMap.put("chulirenname1", chulirenname1);
		reqMap.put("chulideptid1", chulideptid1);
		//reqMap.put("chulideptname1", chulideptname1);
		
		reqMap.put("ear_chulirenid1", now_ear_chulirenid1);
		reqMap.put("ear_chulirenname1", now_ear_chulirenname1);
		reqMap.put("ear_chulideptid1", now_ear_chulideptid1);
		reqMap.put("ear_chulideptname1", now_ear_chulideptname1);
		reqMap.put("now_node_id", now_node_id);
		reqMap.put("timeLimit", timeLimit);
		reqMap.put("isEndTime", isEndTime);
		reqMap.put("urgeCount", urgeCount);
		reqMap.put("urgeTime", urgeTime);
		reqMap.put("countersign", countersign);
		reqMap.put("SERVER_NAME", "addWorkflowNeedd");
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
