package com.tydic.sale.servlet.taskBook;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@WebServlet("/taskBook/queryTreeId.do")
public class QueryGridTreeServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryGridTreeServlet.class);
	private static final long serialVersionUID = 1L;

	public QueryGridTreeServlet() {
		super();
	}
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		// 获取登录员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String staffId = systemUser.getStaffId();
		String regionId=systemUser.getRegionId();
		reqMap.put("SERVER_NAME", "queryStaffTree");
		reqMap.put("staffId", staffId);
		reqMap.put("regionId", regionId);
		resultMap = crmService.dealObjectFun(reqMap);
		
		
		
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
