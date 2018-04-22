package com.tydic.sso.util;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;

@WebServlet("/ssoWeb.do")
public class SSOWebAction extends AbstractServlet {

	/**
	 * serialVersionUID
	 */
	private static final long serialVersionUID = 3580344526673975282L;

	@Override
	protected void doGet(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		this.doPost(req, resp);
	}

	@SuppressWarnings({ "unused", "rawtypes" })
	@Override
	protected void doPost(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
		ISpringContext springInstance = SpringContextUtils.getInstance();
		MenuUrlClient menuUrlClient = (MenuUrlClient) springInstance.getBean("menuUrlClient");
		String indexUrl = menuUrlClient.getUrl("mangerWeb");
		String url = req.getParameter("url");
		String menuId = req.getParameter("menuId");
		String uniqueId = null;
		//SystemUser systemUser = getSysInstance(uniqueId);
		//String empeeId = systemUser.getStaffCode();
	//	String pwssWord = systemUser.getPassWord();
		String redirectUrl = indexUrl + "?url=" + url + "&menuId=" + menuId;
		resp.sendRedirect(redirectUrl);	

	}
}
