package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.Map;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import sun.misc.BASE64Decoder;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;


@WebServlet("/order/QueryDemandImg.do")
public class QueryDemandImgServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryDemandImgServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDemandImgServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		  String demandId = request.getParameter("demandId"); 
		  String isHistory = request.getParameter("isHistory"); 
 		  Map<Object,Object> reqMap = new HashMap<Object, Object>();
		  reqMap.put("demandId", demandId);
		  reqMap.put("isHistory", isHistory);
		 Map<Object,Object> demMap = crmService.getDemandInfo(reqMap);
		 Map<String,Object> demandInstMap = new HashMap<String, Object>(); 
		 demandInstMap = (Map<String, Object>) demMap.get("demandInst");
		 byte[] b = new BASE64Decoder().decodeBuffer(String.valueOf(demandInstMap.get("up_photo_names")));
		 PrintWriter out = response.getWriter();
		 OutputStream outputStream = response.getOutputStream();// 从response中获取getOutputStream
		 outputStream.write(b);// 写
		 outputStream.close();
	}
	 
	
}