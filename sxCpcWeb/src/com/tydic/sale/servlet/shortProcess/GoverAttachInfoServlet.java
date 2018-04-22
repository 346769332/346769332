package com.tydic.sale.servlet.shortProcess;

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

@WebServlet("/shortProcess/qryAttachInfo.do")
public class GoverAttachInfoServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(GoverAttachInfoServlet.class);
	
	public GoverAttachInfoServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		request.setCharacterEncoding("utf-8"); // 设置编码
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=UTF-8");
		
		String demandId = request.getParameter("demand_id");
		String type = request.getParameter("type");
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("attachment_type", type);
		reqMap.put("attachment_value", demandId);
		reqMap.put("SERVER_NAME", "getGoverAttachInfo");
		resultMap = crmService.dealObjectFun(reqMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
