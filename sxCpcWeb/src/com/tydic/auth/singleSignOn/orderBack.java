package com.tydic.auth.singleSignOn;

import java.io.IOException;
import java.net.URL;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;

@WebServlet("/sale/orderBack.do")
public class orderBack extends AbstractServlet{
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		String name = request.getParameter("name");
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("SERVER_NAME", "getOrderCount");
		reqMap.put("name", name);
		serMap = crmService.dealObjectFun(reqMap);
		System.out.println("________________________"+serMap.get("data"));
		//Map resultMap=new HashMap();
		Object s=0;
		if(!"".equals(serMap.get("data"))){
			//resultMap.put("code", "0000");//成功
	    	//resultMap.put("count", serMap.get("data"));//数量
			s=serMap.get("data");
		}else{
			//resultMap.put("code", "0001");//失败
			s="0";
		}    	
    	//response.getWriter().println(JSON.toJSONString(resultMap));
		response.getWriter().println(s.toString());
	}
		
}
