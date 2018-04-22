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
import javax.servlet.http.HttpSession;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.zk.ZKUtil;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sale/singleSignOn.do111")
public class CopyOfsingleSignOn extends AbstractServlet{
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		//String addr ="http://133.64.97.162:8089/4aauth/Venus4A/services/Venus4AService";
		/*String addr=ReadProperties.readProperties().getProperty("com.tydic.webservice.address");
		System.out.println("addr:_________________________________"+addr);
		String userName = request.getParameter("userName");
		String signature = request.getParameter("signature");
		String resID = request.getParameter("resID");
		int resID1=Integer.parseInt(resID);
		System.out.println("values:_________________________________:"+userName+"__:"+signature+"__:"+resID);*/

		try{
		//调用4A接口
		/*String xmlStr=null;
		String webServiceURL =addr;
		String authMethodName = "userSecondarySignatureLogin";
		Service service = new Service();
		Call call = (Call) service.createCall();
		URL url = new URL(webServiceURL);
		call.setTargetEndpointAddress(url);
		call.setOperationName(authMethodName); // webservice接口提供方法名称	
		Object[] param ={resID1,userName,signature};
		xmlStr = (String) call.invoke(param);
		System.out.println("receive_____________________________:"+xmlStr);
	    Document document = null;
			try {
				document = DocumentHelper.parseText(xmlStr);
			} catch (DocumentException e) {
				e.printStackTrace();
			}
	        Element root=document.getRootElement();//获取根节点  
	        String xmluserName=root.element("UserName").getTextTrim();
	        String result=root.element("Result").getTextTrim();*/
		        //if("1".equals(result)){
		        	if("0".equals("0")){//供测试，试完删
		        		//System.out.println("customer-zczlog:________________________________________"+xmluserName);
		        		//查询用户的基本信息
		        		Map<Object, Object> par = new HashMap<Object, Object>();
		        		//par.put("login_code", xmluserName);
		        		par.put("login_code", "15339200601");
		        		Map<Object, Object> respMap = crmService.getStaffInfo(par);
		        		
		        		System.out.println("respMap-zczlog1:_______________________1____________________"+respMap.toString());
		        		if("0".equals(respMap.get("code"))){
		        			Map<String,Object> staffMap=(Map<String,Object>)respMap.get("staff");
		        			SystemUser systemUser=new SystemUser();
		        			systemUser.setStaffId(String.valueOf(staffMap.get("staff_id")));
		        			systemUser.setStaffName(String.valueOf(staffMap.get("staff_name")));
		        			systemUser.setLoginCode(String.valueOf(staffMap.get("login_code")));
		        			systemUser.setRegionId(String.valueOf(staffMap.get("region_code")));
		        			systemUser.setDepartmentCode(String.valueOf(staffMap.get("department_code")));
		        			systemUser.setMobTel(String.valueOf(staffMap.get("mob_tel")));
		        			HttpSession session = request.getSession();
		        			session.setAttribute(SaleUtil.SYSTEMUSER, systemUser);
		        			//
					}else{
						System.out.println("_________________session__null__________________");
						response.sendRedirect("/CpcWeb/web/error.html");
						return;
					}
					response.sendRedirect("/CpcWeb/web/singlesignon.html");
		      }else{
		    	  System.out.println("111111111111111111111111111111111111111");
		    	  response.sendRedirect("/CpcWeb/web/error.html");
		        }
			
			}catch(Exception e){
				System.out.println("22222222222222222222222222222222222222222");
				response.sendRedirect("/CpcWeb/web/error.html");
				e.printStackTrace();
			}
	}
}
