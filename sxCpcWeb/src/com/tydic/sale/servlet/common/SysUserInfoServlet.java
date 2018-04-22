package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletConfig;
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

@WebServlet("/sale/sysUserInfoQuery.do")
public class SysUserInfoServlet extends AbstractServlet {

	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory
			.getLogger(SysUserInfoServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
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
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");

		// 从缓存中获取当前登录员工的信息
		SystemUser systemUser = this.getSysInstance(request);
		
		Map resultMap = new HashMap();
		if (systemUser == null) {
			resultMap.put("success", "false");
		} else {
			resultMap.put("success", "true");
			resultMap.put("sysSourceId", SaleUtil.SALEWEB_SYS_ID);
			resultMap.put("systemUser", systemUser);
		}
		
		String json = JSON.toJSONString(resultMap);
		response.getWriter().println(json);
	}
}
