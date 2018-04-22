package com.tydic.sale.servlet.taskBook;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/taskBook/searchTaskInfo.do")
public class SearchTaskBookInfo extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(SearchTaskBookInfo.class);
	
	public SearchTaskBookInfo(){
		super();
	}
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		SystemUser sysUser=(SystemUser)request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap=new HashMap<Object,Object>();
		reqMap.put("taskCode", request.getParameter("taskCode"));
		reqMap.put("SERVER_NAME", "searchTaskInfo");
		resultMap = crmService.dealObjectFun(reqMap);
		resultMap.put("staff_id", sysUser.getStaffId());
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
