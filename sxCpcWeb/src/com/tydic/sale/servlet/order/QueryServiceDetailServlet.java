package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;


@WebServlet("/order/QueryServiceInfo.do")
public class QueryServiceDetailServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryServiceDetailServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryServiceDetailServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String serviceId = request.getParameter("serviceId"); 
		String isHistory = request.getParameter("isHistory"); 
		String demandId =request.getParameter("demandId");
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
 		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("serviceId", serviceId);
		reqMap.put("isHistory", isHistory);
		
		try {
			Map<Object,Object> demMap = crmService.getServiceInfo(reqMap);
			if("0".equals(demMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
				boolean flag = false;
				String optTime = "";
				List<Map<String,Object>> recordSetLst = new ArrayList<Map<String,Object>>();
				recordSetLst = (List<Map<String, Object>>) demMap.get("recordSet");
				if(!Tools.isNull(recordSetLst) && recordSetLst.size()>0){
					for(Map recordSetMap : recordSetLst){
						if("-1".equals(String.valueOf(recordSetMap.get("next_node_id")))){
							flag = true;
							optTime = String.valueOf(recordSetMap.get("opt_time"));
							break;
						}
					}
				}
					Map<String,Object> serviceInstMap = new HashMap<String, Object>();
					serviceInstMap = (Map<String, Object>) demMap.get("serviceInst");
					SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					try {
						Date overLimit = dfs.parse(String.valueOf(serviceInstMap.get("over_limit")));//要求时间
						Date actualTime  = new Date();//实际时间
						if(flag){
							actualTime = dfs.parse(optTime);
						}
						long calimSurplusTime = (overLimit.getTime()-actualTime.getTime());
						long hour = (calimSurplusTime/(60*60*1000));
						long min=((calimSurplusTime/(60*1000))-hour*60);
						if(calimSurplusTime > 0){
							serviceInstMap.put("calimSurplusTime", "剩余"+String.valueOf(hour)+"小时"+String.valueOf(min)+"分钟");
							serviceInstMap.put("flag", "0");
						}else{
							serviceInstMap.put("calimSurplusTime","超时："+String.valueOf(hour).replaceAll("-", "")+"小时"+String.valueOf(min).replaceAll("-","")+"分钟");
							serviceInstMap.put("flag", "1");
						}
						
					} catch (ParseException e) {
						e.printStackTrace();
					}
				
				resultMap.put("serviceInst", serviceInstMap);
				resultMap.put("recordSet", demMap.get("recordSet"));
				resultMap.put("recordProcSet", demMap.get("recordProcSet"));
				resultMap.put("staffId", systemUser.getStaffId());
				resultMap.put("funLst", systemUser.getFunLst());
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