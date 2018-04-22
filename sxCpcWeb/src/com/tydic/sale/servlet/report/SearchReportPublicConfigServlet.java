package com.tydic.sale.servlet.report;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.DownExcel;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/searchReportPublicConfig.do")
public class SearchReportPublicConfigServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(SearchReportPublicConfigServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchReportPublicConfigServlet() {
		super();
		// TODO Auto-generated constructor stub
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
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		
		//获取页面参数
		Map<Object,Object> paramMap = new HashMap<Object, Object>();
		for(Iterator it = request.getParameterMap().keySet().iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			paramMap.put(key, request.getParameter(key));
		}
		
		//查询报表配置信息
		resultMap = super.crmService.queryReportPublicConfig(paramMap);
		
		if(!Tools.isNull(resultMap.get("reprotConfig"))){
			Map<String,Object> reprotConfigMap = (Map<String, Object>) resultMap.get("reprotConfig");
			reprotConfigMap.put("search_sql","");
			paramMap.put("report_id", reprotConfigMap.get("report_id") );
		}
		
		//查询页面条件参数
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		
		paramMap.put("staffId", systemUser.getStaffId());
		paramMap.put("loginCode", systemUser.getLoginCode());
		paramMap.put("orgId", systemUser.getOrgId());
		paramMap.put("latnId", systemUser.getRegionId());
		
		Map<Object, Object> reportControlMap = this.crmService.qryReportControl(paramMap);
		if(!Tools.isNull(reportControlMap) 
				&& String.valueOf(reportControlMap.get("code")).equals("0")){
			resultMap.put("controlSet", reportControlMap.get("controlSet"));
		}
		
		super.sendMessages(response, JSON.toJSONString(resultMap));		
	}
}
