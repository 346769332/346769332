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
/**
 * 短流程需求查询详细类
 * @author dangzw
 */
@WebServlet("/shortProcess/queryDemandListDetail.do")
public class QueryDemandListDetailServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDemandListDetailServlet() {
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
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String staffname=systemUser.getStaffName();
		String regionname=systemUser.getOrgName();
		String staffpno=systemUser.getMobTel();
		String workflowId=request.getParameter("workflowId");
		reqMap.put("workflowId", workflowId);
		reqMap.put("SERVER_NAME", "queryDemandHistoryListDetail");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
			resultMap.put("staffname", staffname);
			resultMap.put("staffId", systemUser.getStaffId());
			resultMap.put("regionname", regionname);
			resultMap.put("staffpno", staffpno);
			resultMap.put("nodeNum", serMap.get("nodeNum"));
			resultMap.put("lineNum", serMap.get("lineNum"));
			
			resultMap.put("data", serMap.get("list"));
			resultMap.put("data0", serMap.get("list0"));
			resultMap.put("data1", serMap.get("list1"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
