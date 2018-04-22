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
 * 短流程评价信息
 * @author simon   2017-06-13
 */
@WebServlet("/shortProcess/workFlowEvalInfo.do")
public class AddWorkflowEvalInfoServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddWorkflowEvalInfoServlet() {
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
		String hanleType = request.getParameter("hanleType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		
		if("addEvalInfo".equals(hanleType)){
			int workflowId =Integer.parseInt(String.valueOf(request.getParameter("workflowId")));
			int demandId=Integer.parseInt(String.valueOf(request.getParameter("demandId")));
			String evalDesc = request.getParameter("evalDesc");
			String starNum = request.getParameter("starNum");
			String demand_Code = request.getParameter("demand_Code");
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("staffId", systemUser.getStaffId());
			reqMap.put("staffName", systemUser.getStaffName());
			reqMap.put("workflowId", workflowId);
			reqMap.put("demandId", demandId);
			reqMap.put("demand_Code", demand_Code);
			reqMap.put("evalDesc", evalDesc);
			reqMap.put("starNum", starNum);
			reqMap.put("SERVER_NAME", "addEvalInfo");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			String code=String.valueOf(serMap.get("code"));
			if(StringUtil.isNotEmpty(code) && code.equals("0")){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
