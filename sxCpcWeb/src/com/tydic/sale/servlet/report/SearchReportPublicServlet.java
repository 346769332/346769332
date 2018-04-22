package com.tydic.sale.servlet.report;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
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
import com.tydic.sale.utils.DownExcel;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/searchReportPublic.do")
public class SearchReportPublicServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(SearchReportPublicServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchReportPublicServlet() {
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
		//矫正乱码
		request.setCharacterEncoding("utf-8");
		Map<Object,Object> paramMap = new HashMap<Object, Object>();
		for(Iterator it = request.getParameterMap().keySet().iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			paramMap.put(key, request.getParameter(key));
		}
		resultMap = super.crmService.queryReportPublic(paramMap);
		
		//导出Excel
		if(!Tools.isNull(paramMap.get("outExcel")) 
				&& String.valueOf(paramMap.get("outExcel")).equals("Y")
				&& String.valueOf(resultMap.get("code")).equals("0")){
			List<String> headSet = (List<String>) resultMap.get("headSet");
			List<Map<String,Object>> contentSet = (List<Map<String, Object>>) resultMap.get("searchReportSet");
			DownExcel.exec( response, "report.xls", headSet, contentSet);
		}
		//普通查询响应
		else{
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
		
	}
}
