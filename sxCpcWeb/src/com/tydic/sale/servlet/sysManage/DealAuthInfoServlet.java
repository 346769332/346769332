package com.tydic.sale.servlet.sysManage;

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
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sysManage/dealAuthInfo.do")
public class DealAuthInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DealAuthInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DealAuthInfoServlet() {
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
		String type=request.getParameter("type");
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("opt_id",systemUser.getStaffId());
		reqMap.put("latn_id",request.getParameter("latnId"));
		reqMap.put("a_name", request.getParameter("authName"));
		reqMap.put("a_type", request.getParameter("authType"));
		reqMap.put("a_state", request.getParameter("authState"));
		reqMap.put("a_desc",request.getParameter("authDesc"));
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		reqMap.put("a_id",request.getParameter("authId"));
		if("add".equals(type)){
			serMap = crmService.addAuthInfo(reqMap);
		}else if("update".equals(type)){
			serMap = crmService.updateAuthInfo(reqMap);
		}
		resultMap.put("code", "1");
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}

}
