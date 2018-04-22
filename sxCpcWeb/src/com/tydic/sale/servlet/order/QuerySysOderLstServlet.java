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

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/QuerySysOderLst.do")
public class QuerySysOderLstServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(QuerySysOderLstServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QuerySysOderLstServlet() {
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
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String handleType =request.getParameter("handleType");
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		
		
		if("queryOrderLst".equals(handleType)){
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			reqMap.put("flow_theme", request.getParameter("themeSeach"));
			String queryTime = request.getParameter("queryTime");
			reqMap.put("start_create_time", String.valueOf(queryTime+" 00:00:00"));
			reqMap.put("end_create_time", String.valueOf(queryTime+" 23:59:59"));
			reqMap.put("opter_name", request.getParameter("sendUserName"));
			reqMap.put("out_sys_id", request.getParameter("out_sys_id"));
			Map<Object,Object> respMap = crmService.getSysLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(respMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", respMap.get("list"));
				resultMap.put("totalSize", respMap.get("sum"));
			}
		}else if("queryData".equals(handleType)){
			reqMap = new HashMap<Object, Object>();
			reqMap.put("dicType", "outSysId");
			Map<Object,Object> sysLstRespMap = crmService.getdic(reqMap);
			resultMap.put("code", sysLstRespMap.get("code"));
			resultMap.put("dicSet", sysLstRespMap.get("dicSet"));
		}
		
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	// 获取三个时间选项时间
	private Map getDate() {
		Map<String, Object> datemap = new HashMap<String, Object>();
		java.util.Calendar c = java.util.Calendar.getInstance();
		java.text.SimpleDateFormat f = new java.text.SimpleDateFormat(
				"yyyy-MM-dd");
		java.util.Calendar calendar = java.util.Calendar.getInstance();
		calendar.add(Calendar.DATE, +1); // 得到前一天
		String nextDay = f.format(calendar.getTime()); // 前一天
		String day = f.format(c.getTime()); // 本日
		c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) - 6);
		String week = f.format(c.getTime()); // 最近一周
		java.util.Calendar cc = java.util.Calendar.getInstance();
		cc.set(Calendar.MONTH, cc.get(Calendar.MONTH) - 1);
		String month = f.format(cc.getTime());
		datemap.put("nextDay", nextDay);
		datemap.put("day", day);
		datemap.put("week", week);
		datemap.put("month", month);
		return datemap;
	}
	
	/*
	 * 查询单池关系数据
	 */
	private Map<Object,Object> qryPoolRel (Map<Object,Object> reqMap){
		Map<Object,Object> respMap = new HashMap<Object,Object>();
		respMap = crmService.qryPoolRel(reqMap);
		return respMap;
	}
	public String sendMessages(HttpServletResponse response, String json) {
		response.setContentType("application/json");
		response.setContentType("text/json; charset=utf-8");

		response.setCharacterEncoding("UTF-8");
		try {
			response.getWriter().print(json);
		} catch (IOException e) {
			logger.error("返回前台请求异常", e);
			e.printStackTrace();
		}
		return null;
	}
	
}
