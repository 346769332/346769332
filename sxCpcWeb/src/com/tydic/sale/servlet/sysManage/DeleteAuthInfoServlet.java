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

@WebServlet("/sysManage/deleteAuthInfo.do")
public class DeleteAuthInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DeleteAuthInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DeleteAuthInfoServlet() {
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
		String type=request.getParameter("type");
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String authId=request.getParameter("authId");
		reqMap.put("a_id", authId);
		String latnId=request.getParameter("latnId");
		reqMap.put("latn_id", latnId);
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		if("check".equals(type)){
			serMap = crmService.queryAuthUseCount(reqMap);
		}else if("delete".equals(type)){
			serMap = crmService.deleteAuthInfo(reqMap);
		}
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}

}
