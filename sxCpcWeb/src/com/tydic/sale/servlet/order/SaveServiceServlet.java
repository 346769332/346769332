package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryOderLstServlet;
import com.tydic.sale.utils.CommonUtil;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/saveService.do")
public class SaveServiceServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SaveServiceServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveServiceServlet() {
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
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String serviceInfo = request.getParameter("serviceInfo");
		String demandId = request.getParameter("demandId");
		String servicelingdaoLst = request.getParameter("servicelingdaoLst");
		String recordId	= request.getParameter("record_id");
		String record_proc = request.getParameter("record_proc"); 
		List<Map<String,Object>> serviceLst = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> servicelingdaoLs = new ArrayList<Map<String,Object>>();
 		if(!StringUtils.isEmpty(serviceInfo)){
 			serviceLst = Tools.toList(serviceInfo, Map.class);
 		}
 		if(!StringUtils.isEmpty(servicelingdaoLst)){
 			servicelingdaoLs = Tools.toList(servicelingdaoLst, Map.class);
 		}
 		
 		List recordProcLst = new ArrayList();
 		if(!StringUtils.isEmpty(record_proc)){
 			 recordProcLst = CommonUtil.toList(record_proc, Map.class);
 		}
 		
 		List<Map<String,Object>> serviceInfoLst = new ArrayList<Map<String,Object>>();
 		for(Map map : serviceLst){
 			Map<String,Object> serviceMap = new HashMap<String, Object>(); 
 			if(map.get("peoplename").equals("无")){
 				serviceMap.put("service_theme", "需求单拆分");
 				serviceMap.put("peoplename", "无");				
 	 			serviceMap.put("service_desc", map.get("splitDesc"));
 	 			serviceMap.put("promoters_id", systemUser.getStaffId());
 	 			serviceMap.put("promoters", systemUser.getStaffName());
 	 			serviceMap.put("department_id", systemUser.getOrgId());
 	 			serviceMap.put("department", systemUser.getOrgName());
 	 			serviceMap.put("default_opt_id", map.get("splitId"));
 	 			serviceMap.put("default_opt_name", map.get("splitName"));
 	 			serviceMap.put("tel", systemUser.getMobTel());
 	 			serviceMap.put("over_limit", map.get("overLimit"));
 	 			serviceMap.put("loginCode", map.get("loginCode"));
 	 			serviceMap.put("mobTel", map.get("mobTel"));
 			}else{	
 			serviceMap.put("service_theme", "需求单拆分");
 			serviceMap.put("service_desc", map.get("splitDesc"));
 			serviceMap.put("promoters_id", systemUser.getStaffId());
 			serviceMap.put("promoters", systemUser.getStaffName());
 			serviceMap.put("department_id", systemUser.getOrgId());
 			serviceMap.put("department", systemUser.getOrgName());
 			serviceMap.put("default_opt_id", map.get("splitId"));
 			serviceMap.put("default_opt_name", map.get("splitName"));
 			serviceMap.put("tel", systemUser.getMobTel());
 			serviceMap.put("over_limit", map.get("overLimit"));
 			serviceMap.put("loginCode", map.get("loginCode"));
 			serviceMap.put("mobTel", map.get("mobTel"));
 			serviceMap.put("staffIds", map.get("staffIds"));
 			serviceMap.put("mobTels", map.get("mobTels"));
 			serviceMap.put("dept", map.get("dept"));
 			serviceMap.put("peoplename", map.get("peoplename"));
 			}
 			serviceInfoLst.add(serviceMap);
 		};

		Map<Object,Object> reqMap = new HashMap<Object,Object>();
		if(recordProcLst.size()>0){
 			reqMap.put("recordProc", recordProcLst);
 		}
		
		reqMap.put("serviceLst", serviceInfoLst);	
		reqMap.put("demandId", demandId);
		reqMap.put("recordId", recordId);
		resultMap = super.crmService.saveServiceInfo(reqMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
