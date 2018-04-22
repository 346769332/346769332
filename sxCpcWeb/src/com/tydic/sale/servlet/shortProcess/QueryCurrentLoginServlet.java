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
/**
 * 判断当前登录人属于本地网还是省公司类
 * @author lt
 */
@WebServlet("/shortProcess/queryCurrentBelongTo.do")
public class QueryCurrentLoginServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryCurrentLoginServlet() {
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
		resultMap.put("regionId", systemUser.getRegionId());
		resultMap.put("regionName", systemUser.getRegionName());
		resultMap.put("staffId", systemUser.getStaffId());
		resultMap.put("staffName", systemUser.getStaffName());
		resultMap.put("orgName", systemUser.getOrgName());
		resultMap.put("orgId", systemUser.getOrgId());
		resultMap.put("mobtel", systemUser.getMobTel());
		
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
