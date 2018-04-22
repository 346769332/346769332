package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.util.HashMap;
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
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;


@WebServlet("/order/QuerySysInfo.do")
public class QuerySysDetailServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QuerySysDetailServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QuerySysDetailServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String flowRecordId = request.getParameter("flowRecordId"); 
		String isHistory = request.getParameter("isHistory"); 
		try {
			Map<Object,Object> demMap = crmService.searchSysInfo(flowRecordId,isHistory);
			if("0".equals(demMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
				resultMap.put("sysInst", demMap.get("sysInst"));
				resultMap.put("recordSet", demMap.get("recordSet"));
			}else{
				resultMap.put("code", "-1");
				resultMap.put("msg", "系统异常");
			}
		} catch (Exception e) {
			resultMap.put("code", "-1");
			e.printStackTrace();
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	 
	
}