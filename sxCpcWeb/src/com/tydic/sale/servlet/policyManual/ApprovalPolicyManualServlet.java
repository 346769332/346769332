package com.tydic.sale.servlet.policyManual;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
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

@WebServlet("/policyManual/approvalPolicyManual.do")
public class ApprovalPolicyManualServlet extends AbstractServlet {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(DeletePolicyManualServlet.class);
	private final static SimpleDateFormat sdfyms=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");	
	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ApprovalPolicyManualServlet() {
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
		resultMap.put("code", "1");
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String policyId= request.getParameter("policyId");
		reqMap.put("PMId",policyId );
//		reqMap.put("policyId",policyId );
		reqMap.put("spState",request.getParameter("spState") );
		
		ArrayList<Map<String,Object>> attrSet=new ArrayList<Map<String,Object>>();
		
		Map mp1=new HashMap<String, Object>();
		mp1.put("PMId", policyId);
		mp1.put("attr_id", "SPRID");
		mp1.put("attr_value", systemUser.getStaffId());
		attrSet.add(mp1);
		
		Map mp2=new HashMap<String, Object>();
		mp2.put("PMId", policyId);
		mp2.put("attr_id", "SPRNAME");
		mp2.put("attr_value", systemUser.getStaffName());
		attrSet.add(mp2);
		
		Map mp3=new HashMap<String, Object>();
		mp3.put("PMId", policyId);
		mp3.put("attr_id", "SPDATE");
		mp3.put("attr_value", sdfyms.format(new Date()));
		attrSet.add(mp3);
		
		Map mp4=new HashMap<String, Object>();
		mp4.put("PMId", policyId);
		mp4.put("attr_id", "SPSTAE");
		mp4.put("attr_value", request.getParameter("spState"));
		attrSet.add(mp4);
		
		Map mp5=new HashMap<String, Object>();
		mp5.put("PMId", policyId);
		mp5.put("attr_id", "SPDESC");
		mp5.put("attr_value",  request.getParameter("spDesc"));
		attrSet.add(mp5);
		
		reqMap.put("AttrSet",attrSet );
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
			serMap = crmService.approvalPolicyManual(reqMap);
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
			
	}
}

