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
 * 授权类
 * @author simon
 */
@WebServlet("/shortProcess/authorityList.do")
public class QueryAuthorityListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryAuthorityListServlet() {
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
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String hanleType = request.getParameter("hanleType");
		if("submitAuthorInfo".equals(hanleType)){
			String workflow_sort = request.getParameter("workflow_sort");
			String workflow_type = request.getParameter("workflow_type");
			String sendBeginDate = request.getParameter("sendBeginDate");
			String sendEndDate 	= request.getParameter("sendEndDate");
			String authorityStaff = request.getParameter("authorityStaff");
			String authorityStaffId = request.getParameter("authorityStaffId");
			String authorityStaffDeptId = request.getParameter("authorityStaffDeptId");
			String authorityStaffDeptName = request.getParameter("authorityStaffDeptName");
			String workflowCodes = request.getParameter("workflowCodes");
			String workflowIds = request.getParameter("workflowIds");
			String flag = request.getParameter("flag");
			reqMap.put("workflow_sort", workflow_sort);
			reqMap.put("workflow_type", workflow_type);
			reqMap.put("workflowCodes", workflowCodes);
			reqMap.put("workflowIds", workflowIds);
			reqMap.put("flag", flag);
			reqMap.put("sendBeginDate", sendBeginDate);
			reqMap.put("sendEndDate", sendEndDate);
			reqMap.put("authorityStaff", authorityStaff);
			reqMap.put("authorityStaffId", authorityStaffId);
			reqMap.put("authorityStaffDeptId", authorityStaffDeptId);
			reqMap.put("authorityStaffDeptName", authorityStaffDeptName);
			reqMap.put("latnId", systemUser.getRegionId());
			reqMap.put("thisStaffId", systemUser.getStaffId());
			reqMap.put("thisStaffName", systemUser.getStaffName());
			reqMap.put("SERVER_NAME", "addAuthorInfo");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);

			String code=String.valueOf(serMap.get("code"));
			if(StringUtil.isNotEmpty(code) && code.equals("0")){
				resultMap.put("code", "0");
			}
		}else if("qrysubmitAuthorInfo".equals(hanleType)){
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			String workflow_sort = request.getParameter("workflow_sort");
			String workflow_type = request.getParameter("workflow_type");
			String sendBeginDate = request.getParameter("sendBeginDate");
			String sendEndDate 	= request.getParameter("sendEndDate");
			reqMap.put("workflow_sort", workflow_sort);
			reqMap.put("workflow_type", workflow_type);
			reqMap.put("sendBeginDate", sendBeginDate);
			reqMap.put("sendEndDate", sendEndDate);
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			reqMap.put("staffId", systemUser.getStaffId());
			reqMap.put("SERVER_NAME", "qrySubmitAuthorInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
		}
		//往前台发送消息
		sendMessages(response, JSON.toJSONString(resultMap));
	}
}
