package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
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
import com.tydic.sale.utils.SaleUtil;


@WebServlet("/order/readJurisdiction.do")
public class ReadJurisdictionServlet extends AbstractServlet {

	private static final long serialVersionUID = 1107895169837504060L;
	
	private final static Logger logger = LoggerFactory
			.getLogger(ReadJurisdictionServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	   doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings({ "rawtypes", "unused", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if(logger.isDebugEnabled()){
			logger.debug("进入ReadJurisdictionServlet的post方法");
		}
		response.setCharacterEncoding("UTF-8");
		Map<String,Object> resultMap = new HashMap<String, Object>();
		try{
			// 获取员工基本信息
			SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			resultMap.put("funLst", systemUser.getFunLst());
			resultMap.put("menuLst", systemUser.getMenuLst());
			resultMap.put("homePageLst", systemUser.getHomePageLst());
			resultMap.put("region_code", systemUser.getRegionCode());
			resultMap.put("code", "0");
		}catch (Exception e) {
			resultMap.put("code", "1");
			resultMap.put("msg", "查询用户角色权限异常"+e);
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	
}
