package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/app/searchCEOInfo.do")
public class SearchCEOInfoServlet extends AbstractServlet{
	private final static Logger logger = LoggerFactory
			.getLogger(SubmitStarEvalServlet.class);
	private static final long serialVersionUID = 1L;
	
	public SearchCEOInfoServlet(){
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
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		HttpSession session = request.getSession();
		SystemUser systemUser = 
				(com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		reqParamMap.put("staff_id", systemUser.getStaffId());
		//查询
		Map<Object,Object> resultMap = super.crmService.searchUserInfo(reqParamMap);

		super.sendMessagesApp(request,response,  resultMap);
	}

}
