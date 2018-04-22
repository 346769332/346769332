package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
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

@WebServlet("/app/searchListCount.do")
public class SearchListCountServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchListCountServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchListCountServlet() {
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
		
		List<Map<Object, Object>> paramSet = new ArrayList<Map<Object, Object>>();
		String nodeIds = String.valueOf(reqParamMap.get("nodeIds"));
		for(String nodeId : nodeIds.split(",")){
			Map<Object, Object> nodeD = new HashMap<Object, Object>();
			nodeId = "".equals(nodeId) ? "-1" : nodeId;
			nodeD.put("node_id", nodeId);
			if("100104".equals(nodeId)){
				nodeD.put("record_status", 1);
			}else{
				nodeD.put("record_status", 0);
			}
			paramSet.add(nodeD);
		}
		
		
		String promoters_id = systemUser.getStaffId();
		Map<Object,Object> resultMap = super.crmService.searchCurrNodeCount(paramSet, promoters_id);
		
		//查询草稿箱
		reqParamMap.put("promoters_id", promoters_id);
		Map<Object,Object>  draftCountMap = super.crmService.selectDraftCount(reqParamMap);
		
		if(!Tools.isNull(draftCountMap) && "0".equals(String.valueOf(draftCountMap.get("code")))){
			resultMap.put("draftCountSet", draftCountMap.get("draftCountSet"));
		}
		
		//查询短消息
		Object obj = reqParamMap.get("newsList");
		if(!Tools.isNull(obj) && String.valueOf(obj).equals("Y")){
			reqParamMap.put("staff_id", promoters_id);
			Map<Object,Object>  notLookCountMap = super.crmService.getNotLookNewsCount(reqParamMap);
			if(!Tools.isNull(notLookCountMap) && "0".equals(String.valueOf(notLookCountMap.get("code")))){
				resultMap.put("newsCount", notLookCountMap.get("notLookNewsCount"));
			}else{
				resultMap.put("newsCount", 0);
			}
		}
		
		super.sendMessagesApp(request,response,  resultMap);
	}
}
