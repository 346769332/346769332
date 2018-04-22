package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

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
import com.tydic.sale.utils.Tools;

@WebServlet("/app/searchStarEvalList.do")
public class SearchStarEvalListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchStarEvalListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchStarEvalListServlet() {
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
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		reqParamMap.put("staff_name", systemUser.getStaffName());
		Map<Object,Object> newsInfo = new HashMap<Object,Object>();
		//查询短消息
		Map<Object,Object> newsMap = super.crmService.qryNews(reqParamMap);
		if(String.valueOf(newsMap.get("code")).equals("0")){
			List<Map<Object,Object>> newsSet = (List<Map<Object, Object>>) newsMap.get("newsSet");
			if(newsSet.size()>0){
				newsInfo = newsSet.get(0);
			}
		}
		//查询评价信息
		reqParamMap.put("news_type", newsInfo.get("news_type"));
		Map<Object,Object> resultMap = super.crmService.qryNewsInfoByType(reqParamMap);
		resultMap.put("newsInfo",newsInfo );
		
		super.sendMessagesApp(request,response,  resultMap);
	}
	
}
