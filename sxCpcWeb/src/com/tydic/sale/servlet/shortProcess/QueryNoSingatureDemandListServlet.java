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
 * 会签待处理类
 * @author dangzw
 * @date 2017-01-09
 */
@WebServlet("/shortProcess/queryNoSingatureDemandList.do")
public class QueryNoSingatureDemandListServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryNoSingatureDemandListServlet() {
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
		//所属短流程名称
		String  workflowName= request.getParameter("workflowName"); 
		//需求状态
		String  demandStatus= request.getParameter("demandStatus"); 
		String staffId=systemUser.getStaffId();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("demandCode", demandCode);
		reqMap.put("demandName",demandName );
		reqMap.put("workflowName", workflowName);
		reqMap.put("demandStatus", demandStatus);
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize", pageSize);
		String flag=request.getParameter("flag");
		reqMap.put("flag", flag);
		Map<Object,Object> serMap=null;
		reqMap.put("staffId", staffId);
		reqMap.put("latn_id", systemUser.getRegionId());
		reqMap.put("SERVER_NAME", "queryNoSingatureDemandList");
		serMap = crmService.dealObjectFun(reqMap);
		String code=String.valueOf(serMap.get("code"));
		if(StringUtil.isNotEmpty(code) && code.equals("0")){
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
			//往前台发送消息
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
}
