package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
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
import com.sun.corba.se.impl.orbutil.closure.Constant;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.Pool;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * Servlet implementation class QuerySaleOderList
 */
@WebServlet("/order/showlingdao.do")
public class ShowstaffLstServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(ShowstaffLstServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ShowstaffLstServlet() {
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
		Map<Object,Object> resultMap = null;
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
			String  staff_id=request.getParameter("staff_id");
			String methodtype=request.getParameter("methodtype");
			 
			if("shi".equals(methodtype)){
				reqMap.put("methodtype", methodtype);
				reqMap.put("staff_id", staff_id);
				
			resultMap = crmService.showStaff(reqMap);
				
			resultMap.put("data", resultMap.get("list")) ;
			resultMap.put("code", "0") ;
			
				
			}else if ("sheng".equals(methodtype)){
			
				reqMap.put("staff_id", staff_id);
				reqMap.put("methodtype", methodtype);
				
				resultMap = crmService.showStaff(reqMap);
					
				resultMap.put("data", resultMap.get("list")) ;
				resultMap.put("code", "0") ;
			}
	
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
