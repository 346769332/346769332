package com.tydic.sale.servlet.order;

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

@WebServlet("/order/qryAttachInfo.do")
public class QueryAttachInfoServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(QueryAttachInfoServlet.class);
	
	public QueryAttachInfoServlet() {
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
		
		String demandId = request.getParameter("demandId");
		String type = request.getParameter("fileType");
				
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("attachment_type", type);
		reqMap.put("attachment_value", demandId);
		reqMap.put("SERVER_NAME", "qryAttachInfo");
		//reqMap.put("SERVER_NAME", "getAttachInfo");
		
		resultMap = crmService.dealObjectFun(reqMap);
		
		System.out.println("resultMapresultMapresultMap");
		System.out.println("resultMap================"+resultMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));


	}


}
