package com.tydic.sale.servlet.policyManual;

import java.io.IOException;
import java.util.HashMap;
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
import com.tydic.sale.utils.CommonUtil;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/policyManual/addPolicyManual.do")
public class AddPolicyManualServlet extends AbstractServlet{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(AddPolicyManualServlet.class);
	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddPolicyManualServlet() {
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
		
 
		String PMA = request.getParameter("PMA");
		String PMZ = request.getParameter("PMZ"); 
		String busiTypeName = request.getParameter("PMAName");
		String busiChildTypeName = request.getParameter("PMZName"); 
		String addSendDate = request.getParameter("addSendDate"); 

		String addEndDate = request.getParameter("addEndDate"); 
		String PMtheme = request.getParameter("PMtheme"); 
		String content = request.getParameter("content"); 
		String pmAttr = request.getParameter("pmAttr"); 
		String PMpicture = request.getParameter("PMpicture"); 
		if(PMA == null || PMA.equals("")){
			resultMap.put("code", "1");
			resultMap.put("msg", "页面数据为空");
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}

 		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);

		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("theme", PMtheme);
		reqMap.put("picture", PMpicture);
		reqMap.put("busiTypeName", busiTypeName);
		reqMap.put("busiChildTypeName", busiChildTypeName);
		reqMap.put("o_type", PMA);
		reqMap.put("o_type_d", PMZ);
		reqMap.put("o_begin_date", addSendDate);
		reqMap.put("o_end_date", addEndDate);
		reqMap.put("o_content", content);
		reqMap.put("opt_id", systemUser.getStaffId());
		reqMap.put("promoters_id", systemUser.getStaffId());
		reqMap.put("promoters", systemUser.getStaffName());
		reqMap.put("department_id", systemUser.getDepartmentCode());
		reqMap.put("department", systemUser.getOrgName());
		reqMap.put("tel",systemUser.getMobTel());
		if(pmAttr!= null && !pmAttr.equals("")){
			reqMap.put("AttrSet", CommonUtil.toList(pmAttr, Map.class));
		}else{
			reqMap.put("AttrSet", null);
		}
		String releaseSet = request.getParameter("releaseSet"); 
		if(releaseSet!= null && !releaseSet.equals("")){
			reqMap.put("releaseSet", CommonUtil.toList(releaseSet, Map.class));
		}else{
			reqMap.put("releaseSet", null);
		}
		
		String type = request.getParameter("type");
		if(type.equals("add")){
			Map<Object,Object> serMap = crmService.insertPolicyManual(reqMap);
		}else{
			reqMap.put("PMId", request.getParameter("id"));
			reqMap.put("pmId", request.getParameter("id"));
			String imgfile = request.getParameter("imgfile");
			if(imgfile  != null){ //没有修改主图
				reqMap.put("picture", imgfile);
			}
			Map<Object,Object> serMap = crmService.updatePolicyManual(reqMap);

		}
		resultMap.put("code", "0");
		super.sendMessages(response, JSON.toJSONString(resultMap));
			
	}
}
