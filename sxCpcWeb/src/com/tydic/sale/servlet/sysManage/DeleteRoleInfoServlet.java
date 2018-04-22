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

@WebServlet("/sysManage/deleteRoleInfo.do")
public class DeleteRoleInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DealRoleInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DeleteRoleInfoServlet() {
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
		String roleId=request.getParameter("roleId");
		reqMap.put("role_id", roleId);
		String latnId=request.getParameter("latnId");
		reqMap.put("latn_id", latnId);
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		if("check".equals(type)){
			serMap = crmService.queryRoleUseCount(reqMap);
		}else if("delete".equals(type)){
			serMap = crmService.deleteRoleInfo(reqMap);
		}
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}

}
