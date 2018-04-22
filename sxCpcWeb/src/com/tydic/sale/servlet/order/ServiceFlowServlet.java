package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * 服务单流程流转接口
 * **/
@WebServlet("/order/serviceFlow.do")
public class ServiceFlowServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(ServiceFlowServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ServiceFlowServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		
		String service = request.getParameter("service");  
		String flow_record = request.getParameter("flow_record"); 
		String record_proc = request.getParameter("record_proc"); 
		String smss_record=request.getParameter("smss_record");
 		Map<Object,Object> reqMap = new HashMap<Object, Object>();
 		Map<String,Object> serviceMap = this.toMap(service);
 		JSONObject  flowRecordJson  =null ;
 		if(flow_record != null &&flow_record.length() > 0){
 			flowRecordJson = JSONObject.fromObject(flow_record);
 		}
 		Map flowRecordMap = this.toMap(flow_record);
 		if(smss_record != null &&smss_record.length() > 0){
 			flowRecordJson = JSONObject.fromObject(smss_record);
 		}
 		Map smssRecordMap = this.toMap(smss_record);
 		String  handleType = String.valueOf(flowRecordMap.get("funTypeId"));//操作类型
 		// 获取员工基本信息
 	  SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
 	  SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
 		if(flowRecordMap != null && flowRecordMap.containsKey("next_node_id") && !"100102".equals(String.valueOf(flowRecordMap.get("next_node_id")))){
 			if(!flowRecordMap.containsKey("default_opt_id")){
 				flowRecordMap.put("default_opt_id", systemUser.getStaffId());
 				flowRecordMap.put("opt_id", systemUser.getStaffId());
 			}else {
 				flowRecordMap.put("opt_id", flowRecordMap.get("default_opt_id"));
 			}
 			if(!flowRecordMap.containsKey("default_opt_name")){
 				flowRecordMap.put("default_opt_name", systemUser.getStaffName());
 				flowRecordMap.put("opt_name", systemUser.getStaffName());
 			}else{
 				flowRecordMap.put("opt_name", flowRecordMap.get("default_opt_name"));
 			}
 		}
 		List recordProcLst = new ArrayList();
 		if(!StringUtils.isEmpty(record_proc)){
 		 	 recordProcLst = this.toList(record_proc, Map.class);
 		}
 		 String org_name=systemUser.getOrgName();
 		
 		reqMap.put("cpcService", serviceMap);
 		reqMap.put("cpcFlowRecord", flowRecordMap);
 		if(recordProcLst.size()>0){
 			reqMap.put("recordProc", recordProcLst);
 		}
 		
 		reqMap.put("handleType", "serviceFlow");
 		
  		try {
			Map<Object,Object> demMap = crmService.flowExchange(reqMap);
			resultMap = demMap;		
			if(demMap.get("code").equals("0")){
				 if("100034".equals(handleType) && smssRecordMap!=null){
				 String newDate = dfs.format(new Date());
				reqMap.put("org", org_name);
				reqMap.put("busiId", smssRecordMap.get("demand_id"));
				reqMap.put("busiNum", smssRecordMap.get("tel"));
				reqMap.put("datee", newDate);
				reqMap.put("loginCode",  smssRecordMap.get("tel"));
				
				reqMap.put("smsModelId", "DEMAND-ZYHD");
				crmService.sendSms(reqMap);
				
				 }else if("100080".equals(handleType)||"100096".equals(handleType)){
					 String newDate = dfs.format(new Date());
						reqMap.put("org", org_name);
						reqMap.put("busiId", smssRecordMap.get("demand_id"));
						reqMap.put("busiNum", smssRecordMap.get("tel"));
						reqMap.put("datee", newDate);
						reqMap.put("loginCode",  smssRecordMap.get("tel"));
						
						reqMap.put("smsModelId", "DEMAND-ZYTD");
						crmService.sendSms(reqMap);
					 
				 }
			}
			
			
			
		} catch (Exception e) {
			resultMap.put("code", "-1");
			e.printStackTrace();
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	};
	
	private static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
	}
	
	private static Map<String,Object> toMap(String s){
		if(s==null || s.length() < 1){return null; }
		Map<String,Object> map=new HashMap<String,Object>();
		JSONObject json=JSONObject.fromObject(s);
		Iterator keys=json.keys();
		while(keys.hasNext()){
			String key=(String) keys.next();
			String value=json.get(key).toString();
			if(value.startsWith("{")&&value.endsWith("}")){
				map.put(key, toMap(value));
			}else{
				map.put(key, value);
			}

		}
		return map;
	}
	 
	
}