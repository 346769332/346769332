package com.tydic.auth.client.servlet;

import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import com.taobao.tair.TairManager;
import com.tydic.auth.client.utils.SessionMappingUtils;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.utils.Constants;
import com.tydic.sale.utils.SaleUtil;


@WebServlet("/logout.do")
public class ClientLogoutServlet extends AbstractLogoutServlet {


	private static final long serialVersionUID = -2842888680633658120L;

	@Override
	public void clearLocalSessionInfo(String sessionId, String svcToken, HttpServletRequest request, HttpServletResponse response) {
		
		//清缓存中数据
		
		ISpringContext springInstance = SpringContextUtils.getInstance();
		TairManager orderTairManager 	= (TairManager)			springInstance.getBean(Constants.SPRINT_BEAN_TAIL_ORDER			);
		
		//清session信息

		HttpSession session = SessionMappingUtils.getSession(sessionId);
		if(null != session){
			session.invalidate();
		}
		
		
		
	}

}
