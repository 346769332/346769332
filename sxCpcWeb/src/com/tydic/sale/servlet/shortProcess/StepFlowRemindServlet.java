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
 * 新建短流程
 * @author dangzw 2016-10-08
 */
@WebServlet("/shortProcess/stepFlowRemind.do")
public class StepFlowRemindServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public StepFlowRemindServlet() {
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
	@SuppressWarnings("unchecked")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		 Map<Object,Object> resultMap = new HashMap<Object, Object>();
		// Map<Object,Object> paramMap = new HashMap<Object, Object>(); 
		String operatorId=request.getParameter("operator_Id");
		String operatorName=request.getParameter("operator_Name");
		String demandId=request.getParameter("demandId");
		String workflowName=request.getParameter("workflowName");
		String demandName=request.getParameter("demandName");
		Map<Object,Object> staffSearch = new HashMap<Object,Object>();
		//下一环节处理人Id
		staffSearch.put("staffId",operatorId);
		//处理人信息
		staffSearch = this.crmService.getStaffInfo(staffSearch);
		if(!String.valueOf(staffSearch.get("code")).equals("0")){
			resultMap.put("errorInfo", "未能发送短信通知处理人，用户：“"+operatorName+"”的登录账号信息未查到，请联系管理员");
			resultMap.put("code", "1");
		}else{
			//处理人信息接受
			Map<Object,Object> staff =(Map<Object, Object>) staffSearch.get("staff");
			//######登录工号
			String loginCode = String.valueOf(staff.get("login_code"));
			 if(!"".equals(loginCode)){											
					Map<Object,Object> smsMap = new HashMap<Object,Object>();							
					smsMap.put("busiNum"	, staff.get("mob_tel"));
					smsMap.put("busiId"		, demandId);
					smsMap.put("loginCode"	, loginCode);
					smsMap.put("smsModelId"	, "DEMAND-GDLZ");
					smsMap.put("workflowName",  workflowName);
					smsMap.put("demandName",  demandName);
					crmService.sendSms(smsMap);
					resultMap.put("code", "0");
				}else{
					resultMap.put("errorInfo", "未能发送短信通知处理人，用户：“"+operatorName+"”的登录账号信息未查到，请联系管理员");
					resultMap.put("code", "1");
				}
			 
		}					
			super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
