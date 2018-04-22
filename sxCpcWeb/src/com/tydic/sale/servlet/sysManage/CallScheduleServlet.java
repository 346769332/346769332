package com.tydic.sale.servlet.sysManage;

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

@WebServlet("/sysManage/callSchedule.do")
public class CallScheduleServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(CallScheduleServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CallScheduleServlet() {
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
		String type=request.getParameter("selectType");
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		Map<Object,Object> result =new HashMap<Object, Object>();

		try {
			if(type.equals("init")){
				reqMap.put("region_id",systemUser.getRegionId());
				reqMap.put("month",request.getParameter("month"));
				serMap = crmService.queryCallSchedule(reqMap);
			}else if(type.equals("add")){
				reqMap.put("region_id",systemUser.getRegionId());
				reqMap.put("create_Date",request.getParameter("create_Date"));
				reqMap.put("call_type",request.getParameter("call_type"));
				reqMap.put("staff_id",request.getParameter("staff_id"));
 				serMap = crmService.addCallSchedule(reqMap);
			}else if(type.equals("update")){
				reqMap.put("region_id",systemUser.getRegionId());
				reqMap.put("staff_id",request.getParameter("staff_id"));
 				reqMap.put("call_id",request.getParameter("call_id"));
				serMap = crmService.updateCallSchedule(reqMap);
			}
		} catch (Exception e) {
 			e.printStackTrace();
			serMap.put("code", 1);
			serMap.put("data", e);
		}
		 
		 
		super.sendMessages(response, JSON.toJSONString(serMap));
	}

}
