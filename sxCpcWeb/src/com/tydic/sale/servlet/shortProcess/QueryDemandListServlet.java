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
 * 短流程需求查询类
 * @author dangzw
 */
@WebServlet("/shortProcess/queryDemandList.do")
public class QueryDemandListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDemandListServlet() {
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
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		//需求编号
		String demandCode = request.getParameter("demandCode");
		//需求名称
		String demandName = request.getParameter("demandName");
		//需求状态
		String demandStatus = request.getParameter("demandStatus");
		//是否超时
		String overTime = request.getParameter("overTime"); 
		//所属短流程名称
		String  workflowName= request.getParameter("workflowName"); 
		String staffId=systemUser.getStaffId();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("demandCode", demandCode);
		reqMap.put("demandName",demandName );
		reqMap.put("demandStatus",demandStatus);
		reqMap.put("overTime", overTime);
		reqMap.put("promoters", workflowName);
		reqMap.put("pagenum", (Integer.parseInt(pageNum)));
		reqMap.put("pagesize", pageSize);
		String flag=request.getParameter("flag");
		reqMap.put("flags", request.getParameter("flags"));
		Map<Object,Object> demandMap=null;
		if(flag.equals("0")){
			//0 代表 短流程需求查询
			reqMap.put("staffId", staffId);
			reqMap.put("latn_id", systemUser.getRegionId());
			reqMap.put("SERVER_NAME", "queryDemandList");
			demandMap =crmService.dealObjectFun(reqMap);		
		}else if(flag.equals("1")){
			reqMap.put("staffId", staffId);
			reqMap.put("latn_id", systemUser.getRegionId());
			//1 代表 历史短流程需求查询
			reqMap.put("SERVER_NAME", "queryDemandHistoryList");
			demandMap =crmService.dealObjectFun(reqMap);
			//demandMap = crmService.queryDemandHistoryList(reqMap);
		}
		String code=String.valueOf(demandMap.get("code"));
		if(StringUtil.isNotEmpty(code) && code.equals("0")){
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap.put("code", "0");
			resultMap.put("staffId", staffId);
			resultMap.put("staffName", systemUser.getStaffName());
			resultMap.put("data", demandMap.get("list"));
			resultMap.put("totalSize", demandMap.get("sum"));
			resultMap.put("role", demandMap.get("role"));
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
