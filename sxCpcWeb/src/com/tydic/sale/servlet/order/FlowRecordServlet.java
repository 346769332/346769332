package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.util.ArrayList;
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
 * 流程流转接口
 * **/
@WebServlet("/order/FlowRecord.do")
public class FlowRecordServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(FlowRecordServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FlowRecordServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		String handleType = String.valueOf(request.getParameter("handleType"));//操作类型
		String demand = request.getParameter("demand");  
		String flow_record = request.getParameter("flow_record"); 
		String record_proc = request.getParameter("record_proc"); 
 		Map<Object,Object> reqMap = new HashMap<Object, Object>();
 		Map demandMap = this.toMap(demand);
 		JSONObject  flowRecordJson  =null ;
 		if(flow_record != null &&flow_record.length() > 0){
 			flowRecordJson = JSONObject.fromObject(flow_record);
 		}
 		Map flowRecordMap = this.toMap(flow_record);
 		
 		// 获取员工基本信息
 	   SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		if (!Tools.isNull(flowRecordMap)
				&& !Tools.isNull(flowRecordMap.get("funTypeId"))
				&& !"100004".equals(flowRecordMap.get("funTypeId"))
				&& !"100007".equals(flowRecordMap.get("funTypeId"))
				&& !"100000".equals(flowRecordMap.get("funTypeId"))
				&& !"100002".equals(flowRecordMap.get("funTypeId"))
				&& !"1000777".equals(flowRecordMap.get("funTypeId"))
				&& !"10007777".equals(flowRecordMap.get("funTypeId"))
				&& !"100100".equals(flowRecordMap.get("funTypeId"))
				&& !"100112".equals(flowRecordMap.get("funTypeId"))
				&& !"100111".equals(flowRecordMap.get("funTypeId"))){
 			flowRecordMap.put("opt_id", systemUser.getStaffId());
 			flowRecordMap.put("opt_name", systemUser.getStaffName());
 			flowRecordMap.put("departmentId", systemUser.getOrgId());
 		}
 		//判断是区综支流程的时候处理人修改为选择的人
 		if(!Tools.isNull(flowRecordMap) && !Tools.isNull(flowRecordMap.get("funTypeId")) && "100007".equals(flowRecordMap.get("funTypeId")) && String.valueOf(flowRecordMap.get("currNode_id")).startsWith("2")){
 			flowRecordMap.put("opt_id", flowRecordMap.get("default_opt_id"));
 			flowRecordMap.put("opt_name", flowRecordMap.get("default_opt_name"));
 			flowRecordMap.remove("calim_limit");
 		}else if(!Tools.isNull(flowRecordMap) && !Tools.isNull(flowRecordMap.get("funTypeId"))&&"100111".equals(flowRecordMap.get("funTypeId"))){
 			Map<Object,Object> pidDept=new HashMap<Object,Object>();
 			reqMap.put("staff_id", systemUser.getStaffId());
 			pidDept=crmService.querySysUserInfo(reqMap);
 			if("0".equals(pidDept.get("code"))){
 				List<Map<String,Object>> sysUserLst = (List<Map<String, Object>>) pidDept.get("sysInfoLst");
				if(sysUserLst.size() > 0){
					Map<String,Object> sysUserMap = sysUserLst.get(0);
					flowRecordMap.put("opt_id",sysUserMap.get("PID"));//西安下派部门打回给他的上级部门
				}
 			}
 			
 		}
 		String region_code=String.valueOf(systemUser.getRegionCode());
 		if("290".equals(region_code)  || true){
 			flowRecordMap.put("staff_id", systemUser.getStaffId());//西安流程保存系统处理人
 	 		flowRecordMap.put("staff_name", systemUser.getStaffName());//西安流程保存系统处理人
 	 		flowRecordMap.put("region_code",region_code);
 	 		flowRecordMap.put("department_id", systemUser.getOrgId());
 	 		flowRecordMap.put("department_name", systemUser.getOrgName());
 	 		flowRecordMap.put("mob_tel", systemUser.getMobTel());
 		}
 		
 		//如果为跟进，增加标识
 		if("4".equals(handleType)){
 			flowRecordMap.put("type_flag", "genjin");	
 		}
 		
 		List recordProcLst = new ArrayList();
 		if(!StringUtils.isEmpty(record_proc)){
 			 recordProcLst = this.toList(record_proc, Map.class);
 		}
 		reqMap = new HashMap<Object, Object>();
 		reqMap.put("cpcDemand", demandMap);
 		reqMap.put("cpcFlowRecord", flowRecordMap);
 		
 		if(recordProcLst.size()>0){
 			reqMap.put("recordProc", recordProcLst);
 		}
 		
 		reqMap.put("handleType", "demandFlow");	
 		
 		
  		try {
			Map<Object,Object> demMap = crmService.flowExchange(reqMap);
			resultMap = demMap;
			if("0".equals(demMap.get("code"))){ //成功发短信
				if(demandMap!= null && demandMap.size()>0){
					reqMap = new HashMap<Object,Object>();
					reqMap.put("busiId", demandMap.get("demand_id"));
					reqMap.put("busiNum",demandMap.get("tel"));
					if(!Tools.isNull(demandMap.get("login_code"))){
						reqMap.put("loginCode",demandMap.get("login_code"));
					}
					
					String demandTheme = String.valueOf(demandMap.get("demand_theme"));
					if(demandTheme.length()>20){
						demandTheme = demandTheme.substring(0, 20) + "...";
					}
					reqMap.put("demandTheme",demandTheme);
					//发单人的信息
					String promoters=String.valueOf(flowRecordMap.get("promoters"));
					String promoters_tel=String.valueOf(flowRecordMap.get("promoters_tel"));
					reqMap.put("promoters", promoters);
					reqMap.put("promoters_tel", promoters_tel);
					
					String smsModelId = "";
					if("0".equals(handleType)){ //认领
						smsModelId = "DEMAND-ZZZXJD";//接单
						reqMap.put("optName",systemUser.getStaffName());
						reqMap.put("phone", systemUser.getMobTel());
						reqMap.put("overTime", demandMap.get("over_limit"));
					}else if("1".equals(handleType)){//分发
						smsModelId = "DEMAND-JDCFF";//分发
					}else if("2".equals(handleType)){//回单
						
						System.out.println("=========flowRecordMap========="+flowRecordMap);
						
						if("1".equals(flowRecordMap.get("smsFlag"))){ //发区综支模板
							Map<Object,Object> sqlReqMap = new HashMap<Object, Object>();
							sqlReqMap.put("staff_id", flowRecordMap.get("opt_id"));
							Map<Object,Object> sqlRespMap = new HashMap<Object, Object>();
							
							System.out.println("==============sqlReqMap========="+sqlReqMap);
							
							sqlRespMap =  crmService.querySysUserInfo(sqlReqMap);
							
							System.out.println("==============sqlRespMap========="+sqlRespMap);
							
							if("0".equals(sqlRespMap.get("code"))){
								List<Map<String,Object>> sysUserLst = (List<Map<String, Object>>) sqlRespMap.get("sysInfoLst");
								if(sysUserLst.size() > 0){
									Map<String,Object> sysUserMap = sysUserLst.get(0);
									reqMap.remove("loginCode");
									reqMap.remove("busiNum");
									reqMap.put("loginCode",sysUserMap.get("LOGIN_CODE"));
									reqMap.put("busiNum",sysUserMap.get("MOB_TEL"));
									smsModelId="DEMAND-QZZHD";//区综支回单
									
									System.out.println(smsModelId+"===================reqMap=================="+reqMap);
								}
							}
 						}else{
 							smsModelId = "DEMAND-ZZZXHD";//回单
						}
					}else if("3".equals(handleType)){//转派
						String regionCode=String.valueOf(systemUser.getRegionCode());
						String mobTel="";
						String toName="";
						if(!Tools.isNull(regionCode)){
							String orgId=String.valueOf(flowRecordMap.get("org_id"));
							toName=String.valueOf(flowRecordMap.get("opt_name"));
							 Map<Object,Object> loginRel=new HashMap<Object,Object>();
							 Map<Object,Object> parMap=new HashMap<Object,Object>();
							 List<Map> loginLst=new ArrayList<Map>();
							 parMap.put("orgId",orgId);//处理人为所选的部门
							 parMap.put("SERVER_NAME", "getLoginCodeList");
							 loginRel=crmService.dealObjectFun(parMap);
							 if("0".equals(loginRel.get("code"))){
								 loginLst=(List<Map>)loginRel.get("list");
								 if(!Tools.isNull(loginLst)&&loginLst.size()>0){
									 for(Map map:loginLst){
										 reqMap = new HashMap<Object, Object>();
										 smsModelId = "DEMAND-ZZZXZP";//转派
										 reqMap.put("busiId", demandMap.get("demand_id"));
										 reqMap.put("demandTheme",demandTheme);
									   	 reqMap.put("loginCode", map.get("login_code"));
										 reqMap.put("busiNum",map.get("mob_tel"));
										 reqMap.put("smsModelId", smsModelId);
										 reqMap.put("promoters", promoters);
										 reqMap.put("promoters_tel", promoters_tel);
										 crmService.sendSms(reqMap);
									 }
								 }
							 }
						}else{
							mobTel = request.getParameter("mobTel");
							toName= request.getParameter("to_name");
							smsModelId = "DEMAND-ZZZXZP";//转派
							String loginCode = request.getParameter("loginCode");
							reqMap.put("loginCode", loginCode);
							reqMap.put("busiNum",mobTel);
							reqMap.put("smsModelId", smsModelId);
							reqMap.put("promoters", promoters);
							reqMap.put("promoters_tel", promoters_tel);
							crmService.sendSms(reqMap);
						}
						
						reqMap = new HashMap<Object, Object>();
//						if(!Tools.isNull(regionCode)&&"290".equals(regionCode)){
						if(!Tools.isNull(regionCode)){
							smsModelId = "DEMAND-ZZZXZP-CEO-XA";//西安转派-给小CEO短信
						}else{
							smsModelId = "DEMAND-ZZZXZP-CEO";//转派-给小CEO短信
						}
						reqMap.put("busiId", demandMap.get("demand_id"));
						reqMap.put("busiNum",demandMap.get("tel"));
						reqMap.put("demandTheme",demandTheme);
						reqMap.put("optName",toName);
						reqMap.put("phone",mobTel);
						reqMap.put("smsModelId", smsModelId);
						crmService.sendSms(reqMap);
					}else if("4".equals(handleType)){//跟进
						smsModelId = "DEMAND-ZZZXGJ";//跟进
						reqMap.put("optName", systemUser.getStaffName());
						reqMap.put("phone", systemUser.getMobTel());
						for(Map map :(List<Map>)recordProcLst){
							//if("11".equals(map.get("attr_id")) && "2".equals(map.get("attr_group"))){
							if("11".equals(map.get("attr_id"))){
								String attr_value = String.valueOf(map.get("attr_value"));
								reqMap.put("attrValue", attr_value);
								break ;
							}
						}
					}else if("5".equals(handleType)){//下派部门打回给中心
						 Map<Object,Object> loginRel=new HashMap<Object,Object>();
						 Map<Object,Object> parMap=new HashMap<Object,Object>();
						 List<Map> loginLst=new ArrayList<Map>();
						 parMap.put("orgId",flowRecordMap.get("opt_id"));//处理人为所选的部门
						 parMap.put("SERVER_NAME", "getLoginCodeList");
						 loginRel=crmService.dealObjectFun(parMap);
						 if("0".equals(loginRel.get("code"))){
							 loginLst=(List<Map>)loginRel.get("list");
							 if(!Tools.isNull(loginLst)&&loginLst.size()>0){
								 for(Map map:loginLst){
									 reqMap = new HashMap<Object, Object>();
									 smsModelId = "DEMAND-SENDBACK";//转派
									 reqMap.put("busiId", demandMap.get("demand_id"));
									 reqMap.put("demandTheme",demandTheme);
								   	 reqMap.put("loginCode", map.get("login_code"));
									 reqMap.put("busiNum",map.get("mob_tel"));
									 reqMap.put("smsModelId", smsModelId);
									 reqMap.put("promoters", promoters);
									 reqMap.put("promoters_tel", promoters_tel);
									 crmService.sendSms(reqMap);
								 }
							 }
						 }
					}
					if(!Tools.isNull(smsModelId) && !"3".equals(handleType)&& !"5".equals(handleType)){
						
						System.out.println("============smsModelId==============="+smsModelId);
						
						reqMap.put("smsModelId", smsModelId);
						crmService.sendSms(reqMap);
					}
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