package com.tydic.sale.service.crm.service.impl;

import java.text.DecimalFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.FlowService;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.crm.service.SearchService;
import com.tydic.sale.service.crm.service.UseAuthService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;
import com.tydic.sale.service.util.WeekdayUtil;
import com.tydic.sale.utils.StringUtils;

public class FlowServiceImpl implements FlowService{
	private final static Logger logger = LoggerFactory.getLogger(FlowServiceImpl.class);
	
	private WebApplicationContext springContext;
	
	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	@Override
	public Map<String, Object> saveDemand(Map<String, Object> reqMap,String handleType) {
		logger.info("进行需求单保存,操作类型为："+handleType);
		Map<String,Object> respMap = new HashMap<String,Object>();//返回
		respMap.put("code", "0");//失败
		respMap.put("msg", "成功");
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		String demandId=String.valueOf(reqMap.get("demand_id"));
		sqlReqMap.put("demand_id", demandId);
		Map<String,Object> demInfo= new HashMap<String, Object>();
		try {
			 demInfo= cpcDao.qryMapInfo("flow", "qry_demand_info", sqlReqMap);
		} catch (Exception e1) {
			logger.error("查询需求单信息异常"+e1);
			e1.printStackTrace();
		}
		if("1".equals(handleType)&&!Tools.isNull(demInfo)){//草稿箱发起
			handleType="3";
		}
		if("1".equals(handleType)){ //发起
			
			sqlReqMap = new HashMap<String, Object>();
			String record_id = ""; //流转过程表ID
			String demand_id = ""; //需求单ID
			if(StringUtils.isEmpty(demandId)){
				try {
					//查询序列获取需求单表ID
					demand_id = (String) cpcDao.qryObject("flow", "qry_demandId", sqlReqMap);
					String appId = "";
					int index=4;
					for(int i = 0; i< (index - demand_id.length());i++){
						appId = appId+"0";
					};
					demand_id = appId+demand_id;
					SimpleDateFormat dfs = new SimpleDateFormat("yyMMddHH");
					Date nowTime = new Date();
					String date = dfs.format(nowTime);
					demand_id = "D"+date+demand_id;
				} catch (Exception e) {
					respMap.put("code", "1");//失败
					respMap.put("msg", "查询seq_demand_id异常");
					logger.error("查询seq_demand_id异常", e);
					e.printStackTrace();
					return respMap;
				}
			}else{
				demand_id = demandId;
			}
			try {
				//查询序列获取流转过程表ID
				record_id = (String) cpcDao.qryObject("flow", "qry_recordId", sqlReqMap);
			} catch (Exception e) {
				respMap.put("code", "1");//失败
				respMap.put("msg", "查询seq_demand_id异常");
				logger.error("查询seq_record_id异常", e);
				e.printStackTrace();
				return respMap;
			}
			
			//保存需求单
			Map<String,String> saveDemMap = this.saveDemand(reqMap,demand_id,""); 
			
			if("0".equals(saveDemMap.get("code"))){ //需求单保存成功调流程过程保存
				Map<String,String> saveFlowMap = this.saveFlow(reqMap, demand_id, record_id,"tb_cpc_demand","");
				if(!"0".equals(saveFlowMap.get("code"))){
					respMap.put("code", "1");//失败
					respMap.put("msg", saveFlowMap.get("msg"));
					respMap.put("demandId","");
					return respMap;
				}
				
				sqlReqMap = new HashMap<String, Object>();
				sqlReqMap.put("demand_id", demand_id);
				Map<String,Object> demInfoMap = new HashMap<String, Object>();
				try {
					 demInfoMap = cpcDao.qryMapInfo("flow", "qry_demand_info", sqlReqMap);
				} catch (Exception e1) {
					logger.error("查询需求单信息异常"+e1);
					e1.printStackTrace();
				}
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
				String calim_limit = "";
//		    	if("290".equals(String.valueOf(reqMap.get("region_code")))){
//			    	calim_limit = WeekdayUtil.addTimeHour("yyyy-MM-dd HH:mm:ss",String.valueOf(demInfoMap.get("create_time")),Integer.parseInt(String.valueOf(saveFlowMap.get("def_calim_limit"))));
//		    	}else{
		    		calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",String.valueOf(demInfoMap.get("create_time")),Float.parseFloat(String.valueOf(saveFlowMap.get("def_calim_limit"))),String.valueOf(reqMap.get("region_code")));
		    	//}
				if("0".equals(saveFlowMap.get("code"))){
					sqlReqMap = new HashMap<String, Object>();
					sqlReqMap.put("curr_record_id", String.valueOf(saveFlowMap.get("curr_record_id")));
					sqlReqMap.put("demand_id", demand_id);
					sqlReqMap.put("calim_limit", calim_limit);
					try {
						cpcDao.update("flow", "update_demandInfo", sqlReqMap);
					} catch (Exception e) {
						logger.error("修改需求单表curr_record_id异常"+e);
						e.printStackTrace();
					}
					
					
					respMap.put("code", "0");//失败
					respMap.put("msg", "成功");
					respMap.put("demandId",demand_id);
				}else{
					respMap.put("code", "1");//失败
					respMap.put("msg", "流程过程保存失败");
					respMap.put("demandId","");
				}
			}else{
				respMap.put("code", "1");//失败
				respMap.put("msg", "需求单保存失败");
				respMap.put("demandId","");
			}
			return respMap;
			
		}else if("2".equals(handleType)){ //暂存
			sqlReqMap = new HashMap<String, Object>();
			String demand_id = String.valueOf(reqMap.get("demand_id")); //需求单ID
			if(Tools.isNull(demand_id)){
				try {
					//查询序列获取需求单表ID
					demand_id = (String) cpcDao.qryObject("flow", "qry_demandId", sqlReqMap);
					String appId = "";
					int index=4;
					for(int i = 0; i< (index - demand_id.length());i++){
						appId = appId+"0";
					};
					demand_id = appId+demand_id;
					SimpleDateFormat dfs = new SimpleDateFormat("yyMMddHH");
					Date nowTime = new Date();
					String date = dfs.format(nowTime);
					demand_id = "D"+date+demand_id;
				} catch (Exception e) {
					respMap.put("code", "1");//失败
					respMap.put("msg", "查询seq_demand_id异常");
					logger.error("查询seq_demand_id异常", e);
					e.printStackTrace();
					return respMap;
				}
			}
			Map<String,String> saveDemMap = this.saveDemand(reqMap, demand_id, "");
			if("0".equals(saveDemMap.get("code"))){
				respMap.put("code", "0");//成功
				respMap.put("msg", "成功");
				respMap.put("demandId", demand_id);
			}else{
				respMap.put("code", "1");//失败
				respMap.put("msg", "需求单保存失败");
				respMap.put("demandId", "");
			}
			
		}else if("3".equals(handleType)){ //草稿发起
			sqlReqMap = new HashMap<String, Object>();
			String record_id = ""; //流转过程表ID
			try {
				//查询序列获取流转过程表ID
				record_id = (String) cpcDao.qryObject("flow", "qry_recordId", sqlReqMap);
			} catch (Exception e) {
				respMap.put("code", "1");//失败
				respMap.put("msg", "查询seq_demand_id异常");
				logger.error("查询seq_record_id异常", e);
				e.printStackTrace();
				return respMap;
			}
			String demand_id = String.valueOf(reqMap.get("demand_id"));
			if(StringUtils.isEmpty(demand_id)){
				respMap.put("code", "1");//失败
				respMap.put("msg", "demand_id不能为空");
				return respMap;
			}else{
				Map<String,String> saveFlowMap = this.saveFlow(reqMap, demand_id, record_id,"tb_cpc_demand","");
				if(!"0".equals(saveFlowMap.get("code"))){
					respMap.put("code", "1");//失败
					respMap.put("msg", saveFlowMap.get("msg"));
					return respMap;
				}
				sqlReqMap = new HashMap<String, Object>();
				sqlReqMap.put("demand_id", demand_id);
				Map<String,Object> demInfoMap = new HashMap<String, Object>();
				try {
					 demInfoMap = cpcDao.qryMapInfo("flow", "qry_demand_info", sqlReqMap);
				} catch (Exception e1) {
					logger.error("查询需求单信息异常"+e1);
					e1.printStackTrace();
				}
				SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
				String calim_limit = "";
//				if("290".equals(String.valueOf(reqMap.get("region_code")))){
//			    	calim_limit = WeekdayUtil.addTimeHour("yyyy-MM-dd HH:mm:ss",String.valueOf(demInfoMap.get("create_time")),Integer.parseInt(String.valueOf(saveFlowMap.get("def_calim_limit"))));
//		    	}else{
		    		calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",String.valueOf(demInfoMap.get("create_time")),Float.parseFloat(String.valueOf(saveFlowMap.get("def_calim_limit"))),String.valueOf(reqMap.get("region_code")));
		    	//}
			   
				
				if("0".equals(saveFlowMap.get("code"))){
					sqlReqMap = new HashMap<String, Object>();
					sqlReqMap.put("curr_record_id", saveFlowMap.get("curr_record_id"));
					sqlReqMap.put("demand_id", demand_id);
					sqlReqMap.put("demand_theme", reqMap.get("demand_theme"));
					sqlReqMap.put("demand_details", reqMap.get("demand_details"));
					sqlReqMap.put("calim_limit", calim_limit);
					sqlReqMap.put("promoters_id", reqMap.get("promoters_id"));
					sqlReqMap.put("promoters", reqMap.get("promoters"));
					String optTime=sdf.format(new Date());
					sqlReqMap.put("create_time", optTime);//重新修改发起时间
					sqlReqMap.put("operator_id", reqMap.get("optId"));
					sqlReqMap.put("operator_name", reqMap.get("optName"));
					sqlReqMap.put("rank_id", reqMap.get("rankId"));
					sqlReqMap.put("rank_name", reqMap.get("rankName"));
					try {
						cpcDao.update("flow", "update_demandInfo", sqlReqMap);
					} catch (Exception e) {
						logger.error("修改需求单表curr_record_id异常"+e);
						e.printStackTrace();
						respMap.put("code", "1");//失败
						respMap.put("msg", "修改需求单表curr_record_id异常");
						return respMap;
					}
					respMap.put("code", "0");
					respMap.put("msg", "成功");
					respMap.put("demandId", demand_id);
				}else{
					respMap.put("code", "1");//失败
					respMap.put("msg", "流程过程保存失败");
					respMap.put("demandId", "");
				}
			}
		}else{//异常
			logger.info("未知操作类型，返回失败信息");
			respMap.put("code", "1");//失败
			respMap.put("msg", "未知操作类型");
			respMap.put("demandId", "");
		}
		return respMap;
	}
	
	
	/**
	 * 保存需求单
	 * @return
	 */
	private Map<String,String> saveDemand(Map<String, Object> reqMap,String demand_id,String record_id){
		Map<String,String> respMap = new HashMap<String,String>();//返回
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		sqlReqMap.put("demand_id", demand_id);
		sqlReqMap.put("demand_theme", reqMap.get("demand_theme"));
		sqlReqMap.put("demand_details", reqMap.get("demand_details"));
		sqlReqMap.put("promoters_id", reqMap.get("promoters_id"));
		sqlReqMap.put("promoters", reqMap.get("promoters"));
		sqlReqMap.put("department_id", reqMap.get("department_id"));
		sqlReqMap.put("department", reqMap.get("department"));
		sqlReqMap.put("tel", reqMap.get("tel"));
		sqlReqMap.put("record_id", record_id);
		sqlReqMap.put("up_photo_names", String.valueOf(reqMap.get("up_photo_names")));
		if(!Tools.isNull(reqMap.get("optId"))){//西安的保存接单人和发单等级
			sqlReqMap.put("operator_id", reqMap.get("optId"));
			sqlReqMap.put("operator_name", reqMap.get("optName"));
			sqlReqMap.put("rank_id", reqMap.get("rankId"));
			sqlReqMap.put("rank_name", reqMap.get("rankName"));
		}
		
		try {
			cpcDao.insert("flow", "save_demand_info", sqlReqMap);
		} catch (Exception e) {
			logger.error("保存需求单失败"+e);
			e.printStackTrace();
			respMap.put("code", "1");//失败
			respMap.put("msg", "保存需求单失败");
			return respMap;
		}
		respMap.put("code", "0");//失败
		respMap.put("msg", "保存成功");
		return respMap;
	}
	
	
	/**
	 * 保存流转信息
	 * @param reqMap
	 * @param demand_id
	 * @param record_id
	 * @return
	 */
	private Map<String,String> saveFlow(Map<String, Object> reqMap,String demand_id,String record_id,String sort_table,String deRecordId){
		Map<String,String> respMap = new HashMap<String,String>();//返回
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		
		Map<String,Object> flowMap = new HashMap<String, Object>();
		try {
			//取流程信息
			flowMap = this.qryFlowInfo(reqMap,sort_table);//
		} catch (Exception e) {
			logger.error("查询流程表数据异常"+e);
			e.printStackTrace();
			respMap.put("code", "1");//失败
			respMap.put("msg", "查询流程表数据异常");
			return respMap;
		}
		if(!"0".equals(flowMap.get("code"))){
			respMap.put("code", "1");//失败
			respMap.put("msg", String.valueOf(flowMap.get("msg")));
			return respMap;
		}
		
		List<Map<String,Object>> flowMapLst = new ArrayList<Map<String,Object>>();
		List flowLst = new ArrayList();
		List flowNodePolRelLst = (List) flowMap.get("flowNodePolRelLst");
		
		//节点信息数据
		List<Map<String,Object>> nodeInfoMapLst = new ArrayList<Map<String,Object>>();
		//节点信息
		Map<String,Object> nodeInfoMap = new HashMap<String, Object>();
		//下一步节点信息
		Map<String,Object> nextNodeInfoMap = new HashMap<String, Object>();
				
		List<Object> qryColSetLst = new ArrayList<Object>();
		sqlReqMap = new HashMap<String, Object>();
		for(int i =0 ;i< flowNodePolRelLst.size();i++){
			List<Map<String,Object>> flowNodePolRelMapLst = (List<Map<String, Object>>) flowNodePolRelLst.get(i);	
			for(Map map : flowNodePolRelMapLst ){
				Map<String,Object> tempMap = new HashMap<String, Object>();
				tempMap.put("node_id", String.valueOf(map.get("node_id")));
				qryColSetLst.add(tempMap);
			}
		}
		sqlReqMap.put("qryColSet", qryColSetLst);
		try {
			nodeInfoMapLst = cpcDao.qryMapListInfos("flow", "qry_node_info", sqlReqMap);
		} catch (Exception e2) {
			logger.error("查询节点信息异常"+e2);
			e2.printStackTrace();
		}
				
		for (int i =0 ;i< flowNodePolRelLst.size();i++){
			List<Map<String,Object>> flowNodePolRelMapLst = (List<Map<String, Object>>) flowNodePolRelLst.get(i);	
			for(Map map : flowNodePolRelMapLst ){
				if("tb_cpc_service".equals(sort_table)){
					if("100100".equals(String.valueOf(map.get("node_id")))){
						flowMapLst.add(map);
						flowLst.add("1");//发起
					}else if("100102".equals(String.valueOf(map.get("node_id")))){
						flowMapLst.add(map);
						flowLst.add("3");//待处理
					}else if ("100107".equals(String.valueOf(map.get("node_id")))){
						if(!reqMap.get("peoplename").equals("无")){
							flowMapLst.add(map);
							flowLst.add("7");//待处理
						}
						
					}
				}else if("tb_cpc_demand".equals(sort_table)){
					if("100100".equals(String.valueOf(map.get("node_id")))){
						flowMapLst.add(map);
						flowLst.add("1");//发起
					}else if("100101".equals(String.valueOf(map.get("node_id")))){
						flowMapLst.add(map);
						flowLst.add("2");//待认领
					}
				}else{
					if(!Tools.isNull(nodeInfoMapLst) && nodeInfoMapLst.size() > 0 ){
						for(Map nodeMap : nodeInfoMapLst){
							if("1".equals(nodeMap.get("node_level"))){
								flowLst.add("1");//发起
								nodeInfoMap = nodeMap;
							}else if("2".equals(nodeMap.get("node_level"))){
								nextNodeInfoMap = nodeMap;
							}
						}
					}else{
						respMap.put("code", "1");//失败
						respMap.put("msg", "无相关节点信息");
						return respMap;
					}
				}
			}
	    }
		
		if("tb_cpc_service".equals(sort_table)){
			if(!flowLst.contains("1") || !flowLst.contains("3")){
				respMap.put("code", "1");//失败
				respMap.put("msg", "发起待处理权限数据缺失");
				return respMap;
			}
		}else if("tb_cpc_demand".equals(sort_table)){
			if(!flowLst.contains("1") || !flowLst.contains("2")){
				respMap.put("code", "1");//失败
				respMap.put("msg", "发起待认领权限数据缺失");
				return respMap;
			}
		}else{
			if(!flowLst.contains("1") ){
				respMap.put("code", "1");//失败
				respMap.put("msg", "发起权限数据缺失");
				return respMap;
			}
		}
		
		List<Map<String,Object>> flowNodeLst = new ArrayList<Map<String,Object>>();
		String curr_record_id ="";
		String def_calim_limit = "" ;//默认认领时限
		String oaLoginCodes[] ={};
		String onRecordId = "";//上一步流程ID
		 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		 String flowOverTime = "";//流程结束时间
		for(int i = 0; i< flowLst.size() ; i++){
			String curr_node_id = "";//当前节点ID
			String curr_node_name = "";//当前节点name
			StringBuffer opt_id = new StringBuffer();
			StringBuffer opt_name = new StringBuffer();
			StringBuffer default_mob_tel =new StringBuffer();
			StringBuffer loginCode =new StringBuffer();
			String next_node_id = "";//下一节点ID
			String next_node_name = "";//下一节点name
			if("tb_cpc_service".equals(sort_table)){
				if(i ==0){
					curr_node_id = "100100";
					curr_node_name = "发起";
				}else if(i == 1){
					curr_node_id = "100102";
					curr_node_name = "待处理";
				}else if (i == 2){
					curr_node_id = "100107";
					curr_node_name = "待查看";
				}
			}else if("tb_cpc_demand".equals(sort_table)){
				if(i ==0){
					curr_node_id = "100100";
					curr_node_name = "发起";
				}else if(i == 1){
					curr_node_id = "100101";
					curr_node_name = "待认领";
				}
			}else{
				curr_node_id = String.valueOf(nodeInfoMap.get("node_id"));
				curr_node_name = String.valueOf(nodeInfoMap.get("node_name"));
			}
				
				List poolIsLst = new ArrayList();
				if("tb_cpc_service".equals(sort_table) || "tb_cpc_demand".equals(sort_table)){
					for(Map map : flowMapLst){
						if("100100".equals(String.valueOf(map.get("node_id")))){
							poolIsLst.add(String.valueOf(map.get("pool_id")));
						}
					}
				}else{
					for(Map map : flowMapLst){
						if(curr_node_id.equals(String.valueOf(map.get("node_id")))){
							poolIsLst.add(String.valueOf(map.get("pool_id")));
						}
					}
				}
				
				if(poolIsLst.size() == 0 ){
					respMap.put("code", "1");//失败
					respMap.put("msg", "未查询到权限关联的poolId");
					return respMap;
				}
				
				if("tb_cpc_service".equals(sort_table)){
					opt_id = new StringBuffer();
					opt_name = new StringBuffer();
					default_mob_tel  = new StringBuffer();
					loginCode = new StringBuffer();
					
					if( i==0){
						opt_id.append(String.valueOf(reqMap.get("promoters_id")));
						opt_name.append(String.valueOf(reqMap.get("promoters")));
						Map<String,Object> mobTelMap = this.queryMobTel(String.valueOf(reqMap.get("promoters_id")));
						if(!Tools.isNull(mobTelMap)){
							default_mob_tel.append(String.valueOf(mobTelMap.get("MOB_TEL")));
						}
					}else if(i==2){
						opt_id.append(String.valueOf(reqMap.get("staffIds")));
						opt_name.append(String.valueOf(reqMap.get("peoplename")));
						default_mob_tel.append(String.valueOf(reqMap.get("mobTels")));
					}
					else{
						opt_id.append(String.valueOf(reqMap.get("default_opt_id")));
						opt_name.append(String.valueOf(reqMap.get("default_opt_name")));
						Map<String,Object> mobTelMap = this.queryMobTel(String.valueOf(reqMap.get("default_opt_id")));
						if(!Tools.isNull(mobTelMap)){
							default_mob_tel.append(String.valueOf(mobTelMap.get("MOB_TEL")));
						}
					}
				}else{
					List<Map<String,Object>> poolMapLst = new ArrayList<Map<String,Object>>();
					try {
						poolMapLst = this.qryPolInfo(poolIsLst);//查询对象节点的单池
					} catch (Exception e1) {
						respMap.put("code", "1");//失败
						respMap.put("msg", "查询单池信息:"+e1);
						return respMap;
					} 
					if(i == 1){
						opt_id = new StringBuffer();
						opt_name = new StringBuffer();
						if(poolMapLst.size() > 0){
							for(int j = 0 ;j <poolMapLst.size(); j++){
								Map<String,Object>  poolMap = poolMapLst.get(j);
								if(j+1 < poolMapLst.size()){
									opt_id.append(String.valueOf(poolMap.get("pool_id"))+",");
									opt_name.append(String.valueOf(poolMap.get("pool_name"))+",");
									default_mob_tel.append(String.valueOf(poolMap.get("default_mob_tel"))+",");
									loginCode.append(String.valueOf(poolMap.get("login_code"))+",");
								}else{
									opt_id.append(String.valueOf(poolMap.get("pool_id")));
									opt_name.append(String.valueOf(poolMap.get("pool_name")));
									def_calim_limit=String.valueOf(poolMap.get("calim_limit"));
									default_mob_tel.append(String.valueOf(poolMap.get("default_mob_tel")));
									loginCode.append(String.valueOf(poolMap.get("login_code")));
								}
							}
//							//直接给所选部门到流程信息中
//							if(reqMap.get("optId") !=null){
//								opt_id = opt_id.append(String.valueOf(reqMap.get("optId")));
//								opt_name = opt_name.append(String.valueOf(reqMap.get("optName")));
//								
//							}
									
						}else{
							respMap.put("code", "1");//失败
							respMap.put("msg", "权限管理poolid未查询到相关单池");
							return respMap;
						}
					}else{
						if(poolMapLst.size() > 0){
							for(int j = 0 ;j <poolMapLst.size(); j++){//多个单池时去最后一个单池的认领超时配置
								Map<String,Object>  poolMap = poolMapLst.get(j);
								if(j+1 < poolMapLst.size()){
									opt_id = new StringBuffer();
									opt_name = new StringBuffer();
									opt_id.append(String.valueOf(reqMap.get("promoters_id")));
									opt_name.append(String.valueOf(reqMap.get("promoters")));
								}else{
									opt_id = new StringBuffer();
									opt_name = new StringBuffer();
									opt_id.append(String.valueOf(reqMap.get("promoters_id")));
									opt_name.append(String.valueOf(reqMap.get("promoters")));
									def_calim_limit=String.valueOf(poolMap.get("calim_limit"));
								}
							}
							Map<String,Object> mobTelMap = this.queryMobTel(String.valueOf(reqMap.get("promoters_id")));
							if(!Tools.isNull(mobTelMap)){
								default_mob_tel.append(String.valueOf(mobTelMap.get("MOB_TEL")));
							}
						}else{
							respMap.put("code", "1");//失败
							respMap.put("msg", "权限管理poolid未查询到相关单池");
							return respMap;
						}
					}
				}
					
				if("tb_cpc_service".equals(sort_table)){
					if(i ==0){
						next_node_id = String.valueOf("100102");
						next_node_name = String.valueOf("待处理");
					}else if(i == 1){
						next_node_id = String.valueOf("100104");
						next_node_name = String.valueOf("已归档");
					}else if (i == 2){
						next_node_id = String.valueOf("100107");
						next_node_name = String.valueOf("待查看");
					}
				}else if("tb_cpc_demand".equals(sort_table)){
					if(i ==0){
						next_node_id = String.valueOf("100101");
						next_node_name = String.valueOf("待认领");
					}else if(i == 1){
						next_node_id = String.valueOf("100102");
						next_node_name = String.valueOf("待处理");
					}
				}else{
					next_node_id = String.valueOf(nextNodeInfoMap.get("node_id"));
					next_node_name = String.valueOf(nextNodeInfoMap.get("node_name"));
				}
				
				
			if(i!=0){
				try {
					//查询序列获取流转过程表ID
					record_id = (String) cpcDao.qryObject("flow", "qry_recordId", sqlReqMap);
				} catch (Exception e) {
					respMap.put("code", "1");//失败
					respMap.put("msg", "查询seq_demand_id异常");
					logger.error("查询seq_record_id异常", e);
					e.printStackTrace();
					return respMap;
				}
			}
			if(i+1 == flowLst.size()){
				curr_record_id = record_id;
			}else{
				onRecordId = record_id;
			}
			
			//流转过程记录
			sqlReqMap = new HashMap<String, Object>();
			sqlReqMap.put("record_id", record_id);
			if(i+1 == flowLst.size()){
				sqlReqMap.put("on_record_id", onRecordId);
			}else{
				if(!Tools.isNull(deRecordId)){
					sqlReqMap.put("on_record_id", deRecordId);
				}
			}
			sqlReqMap.put("curr_node_id", curr_node_id);
			sqlReqMap.put("curr_node_name", curr_node_name);
			sqlReqMap.put("opt_id", String.valueOf(opt_id));
			sqlReqMap.put("opt_name",String.valueOf(opt_name));
			if(i==0){
				String nowTime = dfs.format(new Date());
				flowOverTime = nowTime;
				sqlReqMap.put("opt_time",String.valueOf(flowOverTime));
			}else{
				sqlReqMap.put("opt_time",String.valueOf(dfs.format(new Date())));
			}
			sqlReqMap.put("next_node_id",next_node_id);
			sqlReqMap.put("next_node_name",next_node_name);
			if("tb_cpc_demand".equals(sort_table)){
				sqlReqMap.put("default_opt_id", "");
				sqlReqMap.put("default_opt_name", "");
			}else{
				sqlReqMap.put("default_opt_id", reqMap.get("default_opt_id"));
				sqlReqMap.put("default_opt_name", reqMap.get("default_opt_name"));
			}
			sqlReqMap.put("time_count", 0);
			sqlReqMap.put("busi_id", demand_id);
			sqlReqMap.put("opt_desc", "");
			sqlReqMap.put("mobTel", String.valueOf(default_mob_tel));
			if(i==1){
				sqlReqMap.put("record_status", "0");
			}else if (i==2){
				sqlReqMap.put("record_status", "0");
				
			}else{
				sqlReqMap.put("record_status", "1");
			}
			try {
				cpcDao.insert("flow", "save_record_info", sqlReqMap);
			} catch (Exception e) {
				logger.error("保存流转记录异常"+e);
				e.printStackTrace();
				respMap.put("code", "1");//失败
				respMap.put("msg", "保存流转记录异常");
				return respMap;
			}
			
			if(i+1 == flowLst.size()){
				/*************结束流程时间保存*****************/
				   Map<String,Object> recordProcMap = new HashMap<String, Object>();
				   recordProcMap.put("attr_value", String.valueOf(flowOverTime));
				   recordProcMap.put("record_id", onRecordId);
				   recordProcMap.put("attr_id", "18");
				   recordProcMap.put("attr_group", "18");
				   recordProcMap.put("busi_id", demand_id);
				   try {
					cpcDao.insert("flow", "save_cpc_record_proc", recordProcMap);
				} catch (Exception e1) {
					e1.printStackTrace();
					logger.error("保存流程时间异常"+e1);
				}
			  /*************结束流程时间保存*****************/
			}
			if("tb_cpc_demand".equals(sort_table) && "100101".equals(curr_node_id)){
				String orgId=String.valueOf(reqMap.get("optId"));
				if(!Tools.isNull(orgId)){//选择接单的部门
					Map<String,Object> param=new HashMap<String,Object>();
					param.put("orgId", orgId);
					try {
						List<Map<String,Object>> loginCodeSet=cpcDao.qryMapListInfos("search", "select_login_code_list", param);
						if(!Tools.isNull(loginCodeSet)&&loginCodeSet.size()>0){
							for(int z=0;z<loginCodeSet.size();z++){
								Map<String,Object> innerMap = new HashMap<String,Object>();
								innerMap.put("busiId", demand_id);
								innerMap.put("busiNum",loginCodeSet.get(z).get("mob_tel"));
								innerMap.put("loginCode", loginCodeSet.get(z).get("login_code"));
								innerMap.put("smsModelId", "DEMAND-XCEOFQ");
								innerMap.put("demandTheme", String.valueOf(reqMap.get("demand_theme")));
								innerMap.put("promoters", String.valueOf(reqMap.get("promoters")));
								innerMap.put("promoters_tel", String.valueOf(reqMap.get("tel")));//发起人的联系电话
								ISpringContext springInstance = SpringContextUtils.getInstance();
								SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
								sMSService.sendNodeMessage(innerMap);
							}
						}
					} catch (Exception e) {
						e.printStackTrace();
						logger.error("查询所属部门的员工信息异常"+e);
					}

				}else{
					String[] loginCodes = String.valueOf(loginCode).split(",");
					oaLoginCodes = loginCodes;
					String[] defaultMobTels = String.valueOf(default_mob_tel).split(",");
					for(int z = 0; z< loginCodes.length;z++){
						Map<String,Object> innerMap = new HashMap<String,Object>();
						innerMap.put("busiId", demand_id);
						innerMap.put("busiNum",defaultMobTels[z]);
						innerMap.put("loginCode", loginCodes[z]);
						innerMap.put("smsModelId", "DEMAND-XCEOFQ");
						innerMap.put("demandTheme", String.valueOf(reqMap.get("demand_theme")));
						ISpringContext springInstance = SpringContextUtils.getInstance();
						SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
						sMSService.sendNodeMessage(innerMap);
					}
				}
				
				
			}
		}
		respMap.put("code", "0");//失败
		respMap.put("msg", "成功");
		respMap.put("curr_record_id", curr_record_id);
		respMap.put("def_calim_limit", def_calim_limit);
		return respMap;
	}
	/**
	 * 取流程信息
	 * @param sortTbale
	 * @return
	 * @throws Exception
	 */
	private Map<String,Object> qryFlowInfo(Map<String,Object> reqMap,String sortTbale) throws Exception{
		Map<String,Object> resultMap = new HashMap<String,Object>();
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		sqlReqMap.put("sort_table", sortTbale);
		String orgId=String.valueOf(reqMap.get("optId"));
		//流程发起条件表信息
		
		Map<String,Object> flowLimitMap  =  new HashMap<String,Object>();
		List<Map<String,Object>> flowLimitGroupMapLst = new ArrayList<Map<String,Object>>();
		List flowLimitMapLst = new ArrayList();
				
		List limitIdLst = new ArrayList(); //条件匹配的约束ID
		
		if(!Tools.isNull(orgId)){//西安市有接单部门
			List<Map<String,Object>> colSetLst = new ArrayList<Map<String,Object>>();
			Map<String,Object> temp = new HashMap<String,Object>();
			temp.put("relType", "dept");
			temp.put("relValue", orgId);
			colSetLst.add(temp);
			sqlReqMap.put("qryPoolColSet", colSetLst);
			flowLimitGroupMapLst = cpcDao.qryMapListInfos("search", "qryPoolOpts", sqlReqMap);
			limitIdLst.add(flowLimitGroupMapLst.get(0).get("pool_id"));
		}else{
			List<Map<String,Object>> flowLimitGroupIdMapLst = new ArrayList<Map<String,Object>>();
			flowLimitGroupIdMapLst = cpcDao.qryMapListInfos("flow", "qry_flow_limit_groupId", sqlReqMap);
			if(flowLimitGroupIdMapLst != null && flowLimitGroupIdMapLst.size()>0){
				for(Map map : flowLimitGroupIdMapLst){
					sqlReqMap = new HashMap<String, Object>();
					sqlReqMap.put("sort_table", sortTbale);
					sqlReqMap.put("limit_group", map.get("limit_group"));
					flowLimitGroupMapLst = cpcDao.qryMapListInfos("flow", "qry_flow_limit", sqlReqMap);
					boolean flag = true;
					for(Map flowLimitGroupMap : flowLimitGroupMapLst){
						if(!String.valueOf(flowLimitGroupMap.get("limit_value")).equals(String.valueOf(reqMap.get(flowLimitGroupMap.get("limit_attr"))))){
							flag =false;
							break;
						}
					}
					if(flag){
						limitIdLst.add(flowLimitGroupMapLst.get(0).get("limit_id"));
					}
				}
			}
		}
		
		List<Object> flowNodePolRelLst = new ArrayList<Object>();
		List<Map<String,Object>> flowNodePolRelMapLst = new ArrayList<Map<String,Object>>();
		if(limitIdLst != null && limitIdLst.size() >0){
			for(int i = 0; i<limitIdLst.size();i++){
				sqlReqMap = new HashMap<String, Object>();
				sqlReqMap.put("limit_id", limitIdLst.get(i));
				flowNodePolRelMapLst = cpcDao.qryMapListInfos("flow", "qry_pol_rel", sqlReqMap);
				if(flowNodePolRelMapLst!=null && flowNodePolRelMapLst.size() >0){
					flowNodePolRelLst.add(flowNodePolRelMapLst);
				}
			}
		}else{
			resultMap.put("code", "1");
			resultMap.put("msg", "无流程流转权限");
			return resultMap;
		}
		//权限是否有单池关系
		if(flowNodePolRelLst.size() > 0  ){
			resultMap.put("code", "0");
			resultMap.put("flowNodePolRelLst", flowNodePolRelLst);
		}else{
			resultMap.put("code", "99");
			if(!Tools.isNull(reqMap.get("default_opt_name"))){
				String msg = String.valueOf(reqMap.get("default_opt_name")) +"无流程流转权限";
				resultMap.put("msg", msg);
			}else{
				resultMap.put("msg", "无流程流转权限");
			}
			return resultMap;
		}
		
		return resultMap;
	}
	
	/**
	 * 查询单池信息
	 * @param nodeId
	 * @return
	 * @throws Exception 
	 */
	private List<Map<String,Object>> qryPolInfo (List poolIdLst) throws Exception{
		List<Map<String,Object>> resultLst = new ArrayList<Map<String,Object>>();
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		for(int i =0;i<poolIdLst.size();i++){
			sqlReqMap = new HashMap<String, Object>();
			sqlReqMap.put("pool_id", poolIdLst.get(i));
			//单池信息
			Map<String,Object> cpcPoolMap = new HashMap<String, Object>();
			cpcPoolMap = cpcDao.qryMapInfo("flow", "qry_cpc_pool", sqlReqMap);
			if(cpcPoolMap.size() > 0){
				if(resultLst.size() > 0){
					boolean flag =true;
					for(Map map : resultLst){
						if(map.get("pool_id").equals(cpcPoolMap.get("pool_id"))){
							flag = false;
							break;
						}
					}
					if(flag){
						resultLst.add(cpcPoolMap);
					}
				}else{
					resultLst.add(cpcPoolMap);
				}
			}
		}
			return resultLst;
	}

	@Override
	public Map<String, Object> flowExchange(Map<String,Object> flowRecordMap,Map<String,Object> demandMap,Map<String,Object> serviceMap,List<Map<String,Object>> recordProcMapLst,String handleType) {
		Map<String,Object> respMap = new HashMap<String,Object>();
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		String regionName = String.valueOf(flowRecordMap.get("regionName"));
		String regionCode=String.valueOf(flowRecordMap.get("region_code"));
		SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				
		String record_id = ""; //流转过程表ID
		try {
			sqlReqMap.put("seqName", "seq_record_id");
			//查询序列获取流转过程表ID
			record_id = (String) cpcDao.qryObject("flow", "qry_recordId", sqlReqMap);
		} catch (Exception e) {
			respMap.put("code", "1");//失败
			respMap.put("msg", "查询seq_record_id异常"+e);
			logger.error("查询seq_record_id异常", e);
			return respMap;
		}
		String loginCode = "";
		boolean goBackFlag = false;
		String funTypeId ="";
		boolean isOverFlow = false;
		String nowLoginCode = String.valueOf(flowRecordMap.get("nowLoginCode"));
		System.out.println("nowLoginCode===>"+nowLoginCode);
		System.out.println("flowRecordMap===>"+JSONObject.fromObject(flowRecordMap).toString());
				
		try{
				Map<String,Object> nextNodeMap = new HashMap<String, Object>();
				
				boolean genjin_flag = false; //type_flag
				if(flowRecordMap.containsKey("type_flag") && "genjin".equals(String.valueOf(flowRecordMap.get("type_flag")))){
					genjin_flag = true;
				}
						
				if(flowRecordMap != null && !Tools.isNull(flowRecordMap.get("funTypeId")) && !genjin_flag){ //判断功能是否需要走流程
					 funTypeId = String.valueOf(flowRecordMap.get("funTypeId")); //请求操作功能
					String def_calim_limit = String.valueOf(flowRecordMap.get("calim_limit"));
					//根据功能操作获取单池以及当前操作对应的流程ID
					Map<String,Object> nodeInfoMap = new HashMap<String, Object>();
					nodeInfoMap = this.getNodeInfo(funTypeId);//获取操作流程节点信息
					List<Map<String,Object>> nodeLst = new ArrayList<Map<String,Object>>();
					
					boolean isQflag = false; //判断当前单子流程是否区综支流程 默认flase 不是区综支的 
					
					//是需求的时候先查询单子当前流程是属于市综支还是区综支
					if("demandFlow".equals(handleType)){
						sqlReqMap.put("demandId", demandMap.get("demand_id"));
						sqlReqMap.put("record_status", "0");
						List<Map<String,Object>> recordNewSet = this.cpcDao.qryMapListInfos("search", "select_flow_record", sqlReqMap);
						
						sqlReqMap = new HashMap<String, Object>();
						sqlReqMap.put("demandId", demandMap.get("demand_id"));
						sqlReqMap.put("record_status", "1");
						List<Map<String,Object>> recordOldSet = this.cpcDao.qryMapListInfos("search", "select_flow_record", sqlReqMap);
						
						List<Map<String,Object>> recordSet = new ArrayList<Map<String,Object>>();
						if(!Tools.isNull(recordOldSet) && recordOldSet.size() > 0){
							recordSet = recordOldSet;
							recordSet.add(recordNewSet.get(0));//将当前流程添加到历史流程中
						}
						for(Map recordMap :  recordSet){ //循环流程找找是否有区综支的待处理
							if("200102".equals(String.valueOf(recordMap.get("curr_node_id")))){ //包涵区综支第一步流程待认领流程认为当前是区综支的流
								isQflag = true; 
								goBackFlag = true;
							}
							if(!String.valueOf(recordNewSet.get(0).get("curr_node_id")).startsWith("2")){ //当前流程ID不是2开头的就认为是市综支的处理
								isQflag = false; 
								break;
							}
						}
						
						if("100001".equals(funTypeId)){ //如果是认领操作,先判断单子状态是否正确
							if(!isQflag){ //市综支流程
								 if(!"100101".equals(String.valueOf(recordNewSet.get(0).get("curr_node_id")))){
									 	respMap.put("code", "1");//失败
										respMap.put("msg", "该需求单已被他人认领，状态非待认领无法认领");
										return respMap;
									}
							}
						}
						
					}
					
					String default_mob_tel ="";
/*							if(!Tools.isNull(flowRecordMap.get("opt_id"))&&!"290".equals(regionCode)){
								Map<String,Object> mobTelMap = this.queryMobTel(String.valueOf(flowRecordMap.get("opt_id")));
								if(!Tools.isNull(mobTelMap)){
									default_mob_tel = String.valueOf(mobTelMap.get("MOB_TEL"));
								}
							}*/
					
					
					if("0".equals(String.valueOf(nodeInfoMap.get("code")))){
							nodeLst = (List<Map<String, Object>>) nodeInfoMap.get("nodeLst");
							Map<String,Object> nodeMap = new HashMap<String, Object>();
							if(nodeLst.size() > 1){ //这个功能区市两级都有操作的时候根据单子当前流程判断是走区的流程还是市的流程
								for(Map map : nodeLst ){
									if(isQflag){ //区综支
										if("1000".equals(String.valueOf(map.get("flow_id")))){ //区综支流程以1000开头
											nodeMap = map;
											break;
										}
									}else{
										if("100".equals(String.valueOf(map.get("flow_id")))){ //市综支流程以100开头
											nodeMap = map;
											break;
										}
									}
								}
							}else{
								nodeMap = nodeLst.get(0);
							}
							
							if("100006".equals(funTypeId)){ //修改处理人为单池值班人
								flowRecordMap.put("opt_id", nodeMap.get("staffId"));
								flowRecordMap.put("opt_name", nodeMap.get("staffName"));
								default_mob_tel = String.valueOf(nodeMap.get("default_mob_tel"));
								
								sqlReqMap = new HashMap<String, Object>();
								sqlReqMap.put("staffId", flowRecordMap.get("opt_id"));
								try {
									 loginCode = (String) cpcDao.qryMapInfo("flow", "qryLoginCodeById", sqlReqMap).get("LOGIN_CODE");
								} catch (Exception e1) {
									e1.printStackTrace();
								}
							}
							
							flowRecordMap.put("next_node_id", nodeMap.get("node_id"));
							flowRecordMap.put("next_node_name", nodeMap.get("node_name"));
							
						
						/*************保存流程*************/
						String flagType = String.valueOf(flowRecordMap.get("flagType"));
						
						sqlReqMap = new HashMap<String, Object>();
						sqlReqMap.put("nodeId", flowRecordMap.get("next_node_id"));
						nextNodeMap = qryNextNodeInfo(sqlReqMap); 
						
						sqlReqMap = new HashMap<String, Object>();
						String currNodeId=String.valueOf(flowRecordMap.get("next_node_id"));
						sqlReqMap.put("record_id", record_id);
						sqlReqMap.put("on_record_id", flowRecordMap.get("record_id"));
						sqlReqMap.put("curr_node_id", currNodeId);
						sqlReqMap.put("curr_node_name", flowRecordMap.get("next_node_name"));
						sqlReqMap.put("opt_id", flowRecordMap.get("opt_id"));
						String orgId=String.valueOf(flowRecordMap.get("opt_id"));
						if(!Tools.isNull(orgId)&&orgId.indexOf("-")>0){
							String org_name=(String)this.cpcDao.qryObject("flow", "qry_org_name", sqlReqMap);
							sqlReqMap.put("opt_name", org_name);
						}else{
							sqlReqMap.put("opt_name", flowRecordMap.get("opt_name"));
						}
						
						String optTime = String.valueOf(dfs.format(new Date()));
						sqlReqMap.put("opt_time", optTime);
						sqlReqMap.put("time_count", "0");
						sqlReqMap.put("busi_id", flowRecordMap.get("busi_id"));
						//sqlReqMap.put("opt_desc", flowRecordMap.get("opt_desc"));
						sqlReqMap.put("mobTel", default_mob_tel);
						if(Tools.isNull(flowRecordMap.get("default_opt_id"))){
							sqlReqMap.put("default_opt_id","" );
						}else{
							sqlReqMap.put("default_opt_id", flowRecordMap.get("default_opt_id"));
						}
						if(Tools.isNull(flowRecordMap.get("default_opt_name"))){
							sqlReqMap.put("default_opt_name","" );
						}else{
							sqlReqMap.put("default_opt_name", flowRecordMap.get("default_opt_name"));
						}
						if(!StringUtils.isEmpty(nextNodeMap) ){
							String nodeId=String.valueOf(nextNodeMap.get("node_id"));
							sqlReqMap.put("next_node_id", nodeId);
							sqlReqMap.put("next_node_name", nextNodeMap.get("node_name"));
							sqlReqMap.put("record_status", "0");
							if("100004".equals(funTypeId)&&"100103".equals(currNodeId)){//评价处理时限为两天
								String chooseTime="15";//两天15个小时
								String opt_limit=WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",optTime,Float.parseFloat(chooseTime),regionCode);
								sqlReqMap.put("opt_limit", opt_limit);
							}
						}else{
							sqlReqMap.put("record_status", "1");
							sqlReqMap.put("next_node_id", "-1");
							sqlReqMap.put("next_node_name", "结束");
							isOverFlow = true; //是最后一步流程
						}
						cpcDao.insert("flow", "save_record_info", sqlReqMap);
						
						/*************结束流程时间保存*****************/
						   Map<String,Object> recordProcMap = new HashMap<String, Object>();
						   recordProcMap.put("attr_value", String.valueOf(optTime));
						   recordProcMap.put("record_id", flowRecordMap.get("record_id"));
						   recordProcMap.put("attr_id", "18");
						   recordProcMap.put("attr_group", "18");
						   recordProcMap.put("busi_id", flowRecordMap.get("busi_id"));
						   try {
							cpcDao.insert("flow", "save_cpc_record_proc", recordProcMap);
						} catch (Exception e1) {
							e1.printStackTrace();
							logger.error("保存流程时间异常"+e1);
						}
					  /*************结束流程时间保存*****************/
						
						try{
							//更新当前节点状态为1失效
							DecimalFormat df2 = new DecimalFormat("###.00");
							/*String hour = "";
							if(!Tools.isNull(flowRecordMap.get("opt_time"))){
							   Date begin = dfs.parse(String.valueOf(flowRecordMap.get("opt_time")));
							   Date end = dfs.parse(dfs.format(new Date()));
							   double between=(end.getTime()-begin.getTime())/1000;//除以1000是为了转换成秒
							   hour =  df2.format(between/3600);
							   if(hour.startsWith(".")){
								   hour = "0"+hour;
							   }
							}*/
							int min=0;//计算当前环节的耗时工作时间
							if(!Tools.isNull(flowRecordMap.get("opt_time"))){
								String begin=String.valueOf(flowRecordMap.get("opt_time"));
								String endTime=dfs.format(new Date());
								min=WeekdayUtil.betweenTowTime(begin, endTime);
							}
							String recordId = String.valueOf(flowRecordMap.get("record_id"));
							String nextNodeId = String.valueOf(flowRecordMap.get("next_node_id"));
							String nextNodeName = String.valueOf(flowRecordMap.get("next_node_name"));
							String optDesc = (String) flowRecordMap.get("opt_desc");
							sqlReqMap = new HashMap<String,Object>();
							sqlReqMap.put("record_id", recordId);
							Map<String,Object> recordInfo=this.cpcDao.qryMapInfo("flow", "qry_next_flow", sqlReqMap);//查询流程信息
							if(!Tools.isNull(flagType)){
								sqlReqMap.put("record_status", flagType);
							}else{
								sqlReqMap.put("record_status", "1");
							}
							sqlReqMap.put("next_node_id", nextNodeId);
							sqlReqMap.put("next_node_name",nextNodeName);
							sqlReqMap.put("opt_desc",optDesc);
							sqlReqMap.put("time_count", min);//min
							sqlReqMap.put("fun_id", funTypeId);
							String optId=String.valueOf(recordInfo.get("opt_id"));
							if(!Tools.isNull(optId)&&optId.indexOf("-")>0){
								String opt_name=String.valueOf(recordInfo.get("opt_name"));
								String staffName=String.valueOf(flowRecordMap.get("staff_name"));
								
								if(opt_name.indexOf("-")<0){
									sqlReqMap.put("opt_name", opt_name+"-"+staffName);	
								}
							}
							//将环节处理人的信息保存起来
							sqlReqMap.put("staff_id", flowRecordMap.get("staff_id"));
							sqlReqMap.put("staff_name", flowRecordMap.get("staff_name"));
							sqlReqMap.put("department_id", flowRecordMap.get("department_id"));
							sqlReqMap.put("department_name", flowRecordMap.get("department_name"));
							sqlReqMap.put("mob_tel", flowRecordMap.get("mob_tel"));
							sqlReqMap.put("opt_time", dfs.format(new Date()));//修改环节处理的准确时间
							this.updateFlowRecord(sqlReqMap);
							
							if(!Tools.isNull(flagType) && "1".equals(flagType)){ //解锁
								sqlReqMap = new HashMap<String, Object>();
								sqlReqMap.put("busi_id", demandMap.get("demand_id"));
								sqlReqMap.put("record_status", "3");
								sqlReqMap.put("recordStatus", "1");
								this.unlock(sqlReqMap);
							}
						}catch (Exception e) {
							logger.error("更新流程表状态"+e);
							e.printStackTrace();
							respMap.put("code", "1");//失败
							respMap.put("msg", "更新流程表状态"+e);
							return respMap;
						}
						
						try{
							//修改业务实例
							if("demandFlow".equals(handleType) && !Tools.isNull(demandMap)){
								demandMap.put("curr_record_id", record_id);
								if("100007".equals(funTypeId) && !Tools.isNull(def_calim_limit)){ //转派
								 String newDate = dfs.format(new Date());
								 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,Float.parseFloat(def_calim_limit),regionCode);
								demandMap.put("calim_limit", calim_limit);
								}
								if(isOverFlow){
									demandMap.put("over_time", optTime);
								}
								this.updateDemand(demandMap);
							}else if("serviceFlow".equals(handleType) && !Tools.isNull(serviceMap)){
								if(isOverFlow){
									serviceMap.put("over_time", optTime);
								}
								serviceMap.put("curr_record_id", record_id);
								this.updateService(serviceMap);
							}
						}catch (Exception e) {
							logger.error("更新业务实例表信息"+e);
							e.printStackTrace();
							respMap.put("code", "1");//失败
							respMap.put("msg", "更新业务表状态"+e);
							return respMap;
						}
					
					/*************保存流程*************/
				    }else if(flowRecordMap != null && flowRecordMap.size() >1){ //不走流程直接就是update
				    	flowRecordMap.remove("funTypeId");
				    	flowRecordMap.remove("nowLoginCode");
				    	flowRecordMap.remove("promoters");
				    	flowRecordMap.remove("promoters_tel");
						this.updateFlowRecord(flowRecordMap);
					}
					
					/***********上报发短信***********/
					if("100006".equals(funTypeId)){
						Map<String,Object> innerMap = new HashMap<String,Object>();
						innerMap.put("busiId", demandMap.get("demand_id"));
						innerMap.put("latn_code", regionName);
						innerMap.put("busiNum",nodeLst.get(0).get("default_mob_tel"));
						innerMap.put("loginCode",nodeLst.get(0).get("login_code"));
						innerMap.put("smsModelId", "DEMAND-SZZSB");
						innerMap.put("busiTheme", String.valueOf(demandMap.get("demand_theme")));
						ISpringContext springInstance = SpringContextUtils.getInstance();
						SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
						sMSService.sendNodeMessage(innerMap);
					}
					/***********上报发短信***********/
				}
							
			//保存属性信息  跟进等操作不走流程流转故直接取当前的流程ID
			if(recordProcMapLst != null && recordProcMapLst.size() > 0 && flowRecordMap != null && !flowRecordMap.containsKey("next_node_id")){
				for(Map recordProcMap : recordProcMapLst){
					if("newDate".equals(recordProcMap.get("attr_value"))){
						   String newDate = dfs.format(new Date());
						   recordProcMap.put("attr_value", newDate);
					}
					recordProcMap.put("record_id", flowRecordMap.get("record_id"));
					cpcDao.insert("flow", "save_cpc_record_proc", recordProcMap);
				}
			}else {
				if(recordProcMapLst != null && recordProcMapLst.size() > 0){
					for(Map recordProcMap : recordProcMapLst){
						if("newDate".equals(recordProcMap.get("attr_value"))){
							   String newDate = dfs.format(new Date());
							   recordProcMap.put("attr_value", newDate);
						}
						recordProcMap.put("record_id", record_id);
						cpcDao.insert("flow", "save_cpc_record_proc", recordProcMap);
						
						
					}
					/* String newDate = dfs.format(new Date());
					 //省市回单
					 if("100034".equals(funTypeId)){
							Map<String,Object> innerMap = new HashMap<String,Object>();
							//需求单ID
							innerMap.put("busiId", flowRecordMap.get("demand_id"));
							 //当前登录人部门
							innerMap.put("busiNum", flowRecordMap.get("tel"));
							innerMap.put("org", flowRecordMap.get("org_name"));
							
							//当前处理时间
							innerMap.put("datee", newDate);
							innerMap.put("loginCode", flowRecordMap.get("tel"));
							
							innerMap.put("smsModelId", "DEMAND-ZYHD");										
							ISpringContext springInstance = SpringContextUtils.getInstance();
							SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
							sMSService.sendNodeMessage(innerMap);
						}
					 //退单给省市综支
					 else if("100080".equals(funTypeId)||"100096".equals(funTypeId)){
						 Map<String,Object> innerMap = new HashMap<String,Object>();
							//需求单ID
							innerMap.put("busiId", flowRecordMap.get("demand_id"));
							 //当前登录人部门
							innerMap.put("busiNum", flowRecordMap.get("tel"));
							innerMap.put("org", flowRecordMap.get("org_name"));
							
							//当前处理时间
							innerMap.put("datee", newDate);
							innerMap.put("loginCode", flowRecordMap.get("tel"));
							
							innerMap.put("smsModelId", "DEMAND-ZYTD");										
							ISpringContext springInstance = SpringContextUtils.getInstance();
							SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
							sMSService.sendNodeMessage(innerMap);
					 }*/
					 
					 
				}
				
			}
		}catch (Exception e) {
			e.printStackTrace();
			respMap.put("code", "1");//失败
			respMap.put("msg", "系统异常"+e);
			return respMap;
		}
	
		respMap.put("code", "0");//成功
		respMap.put("msg", "成功");
		return respMap;
	};
	
	private Map updateDemand(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String demand_id = param.get("demand_id").toString();
		param.remove("demand_id");
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
        }
		param.put("demand_id", demand_id);
		param.put("updateColSet", list);
		this.cpcDao.update("search", "updateDemand",param);
		result.put("code", "0");
		result.put("msg", "成功");
		return result;
	}
	
	private Map updateService(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String service_id = param.get("service_id").toString();
		param.remove("service_id");
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
        }
		param.put("service_id", service_id);
		param.put("updateColSet", list);
		this.cpcDao.update("search", "updateService",param);
		result.put("code", "0");
		result.put("msg", "成功");
		return result;
	}
	
	private Map updateFlowRecord(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String record_id = param.get("record_id").toString();
		param.remove("record_id");
		param.remove("ohertInfoMap");
		param.remove("region_code");
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
			
        }
		param.put("record_id", record_id);
		param.put("updateColSet", list);
		if(list.size()>0){
			this.cpcDao.update("flow", "updateFlowRecord",param);
		}
		return result;
	}
	
	private Map unlock(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String busi_id = param.get("busi_id").toString();
		String record_status = param.get("record_status").toString();
		String recordStatus =  param.get("recordStatus").toString();
		param.remove("busi_id");
		param.remove("record_status");
		param.remove("recordStatus");
		param.put("record_status", recordStatus);
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
			
        }
		param.put("busi_id", busi_id);
		param.put("recordStatus", record_status);
		param.put("updateColSet", list);
		this.cpcDao.update("flow", "updateFlowRecord",param);
		return result;
	}
	
	/**
	 * 查询下个节点信息
	 * @param nodeId
	 * @return
	 * @throws Exception 
	 */
	private Map<String,Object> qryNextNodeInfo (Map<String,Object> sqlReqMap) throws Exception{
		Map<String,Object> nextNodeMap = new HashMap<String, Object>();
		nextNodeMap = cpcDao.qryMapInfo("flow", "qry_next_node_info", sqlReqMap);
		
		return nextNodeMap;
	}

	@Override
	public Map<String, Object> getDemandId(Map<String, Object> reqMap) {
		Map<String,Object> respMap = new HashMap<String,Object>();
		String demand_id = ""; //需求单表ID
		try {
			//查询序列获取流转过程表ID
			demand_id = (String) cpcDao.qryObject("flow", "qry_demandId",reqMap);
			respMap.put("code",Const.SUCCESS);
			respMap.put("msg","成功");
			respMap.put("demandId", demand_id);
		} catch (Exception e) {
			respMap.put("code", "1");//失败
			respMap.put("msg", "查询seq_demand_id异常"+e.getMessage());
			logger.error("查询seq_record_id异常", e);
			e.printStackTrace();
		}
		return respMap;
	}

	@Override
	public Map<String, Object> saveService(Map<String, Object> reqMap) {
		logger.info("进行服务单保存");
		Map<String,Object> respMap = new HashMap<String,Object>();//返回
		List<Map<String,Object>> serviceInfoLst = new ArrayList<Map<String,Object>>();
		serviceInfoLst = (List<Map<String, Object>>) reqMap.get("serviceLst");
		List<Map<String,Object>> recordProcMapLst = new ArrayList<Map<String,Object>>();
		recordProcMapLst = (List<Map<String, Object>>) reqMap.get("recordProc");
		List<Map<String,Object>> lingdaoservice = new ArrayList<Map<String,Object>>();
		recordProcMapLst = (List<Map<String, Object>>) reqMap.get("lingdaoservice");
		String demandId = String.valueOf(reqMap.get("demandId"));
		String deRecordId = String.valueOf(reqMap.get("recordId"));
		respMap.put("code", "0");//失败
		respMap.put("msg", "成功");
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		ISpringContext springInstance = SpringContextUtils.getInstance();
		SearchService searchService = (SearchService) springInstance.getBean("searchService");
		
		if(!Tools.isNull(serviceInfoLst)){
			for(Map serviceInfoMap : serviceInfoLst){
				sqlReqMap = new HashMap<String, Object>();
				String record_id = ""; //流转过程表ID
				String service_id = ""; //服务单ID
				if(StringUtils.isEmpty(serviceInfoMap.get("serviceId"))){
					try {
						//查询序列获取服务单表ID
						service_id = (String) cpcDao.qryObject("flow", "qry_service_Id", sqlReqMap);
						String appId = "";
						int index=4;
						for(int i = 0; i< (index - service_id.length());i++){
							appId = appId+"0";
						};
						service_id = appId+service_id;
						SimpleDateFormat dfs = new SimpleDateFormat("yyMMddHH");
						Date nowTime = new Date();
						String date = dfs.format(nowTime);
						service_id = "S"+date+service_id;
					} catch (Exception e) {
						respMap.put("code", "1");//失败
						respMap.put("msg", "查询seq_demand_id异常");
						logger.error("查询seq_demand_id异常", e);
						e.printStackTrace();
						return respMap;
					}
				}else{
					service_id = serviceInfoMap.get("serviceId").toString();
				}
				try {
					//查询序列获取流转过程表ID
					record_id = (String) cpcDao.qryObject("flow", "qry_recordId", sqlReqMap);
				} catch (Exception e) {
					respMap.put("code", "1");//失败
					respMap.put("msg", "查询seq_demand_id异常");
					logger.error("查询seq_record_id异常", e);
					e.printStackTrace();
					return respMap;
				}
				
				//保存服务单
				Map<String,String> saveDemMap = this.saveService(serviceInfoMap,service_id); 
				
				if("0".equals(saveDemMap.get("code"))){ //服务单保存成功调流程过程保存
					Map<String,String> saveFlowMap = this.saveFlow(serviceInfoMap, service_id, record_id,"tb_cpc_service",deRecordId);
					if(!"0".equals(saveFlowMap.get("code"))){
						respMap.put("code", "1");//失败
						respMap.put("msg", saveFlowMap.get("msg"));
						respMap.put("demandId","");
						return respMap;
					}
				    
					if("0".equals(saveFlowMap.get("code"))){
						String curr_record_ids=  String.valueOf(saveFlowMap.get("curr_record_id"));
						sqlReqMap = new HashMap<String, Object>();
						sqlReqMap.put("curr_record_ids", curr_record_ids);
						
						
						
						
						try {
							
							String nums = (String) this.cpcDao.qryObject("flow", "getServiceList_states", sqlReqMap);
							String busi_id = (String) this.cpcDao.qryObject("flow", "getServiceList_states_busi_id", sqlReqMap);
							String mob_tel = (String) this.cpcDao.qryObject("flow", "getServiceList_states_mob_tel", sqlReqMap);
							String opt_name = (String) this.cpcDao.qryObject("flow", "getServiceList_states_opt_name", sqlReqMap);
					
							if(nums.equals("100107")){
								SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
								String newDate = dfs.format(new Date());
								Map<String,Object> innerMap = new HashMap<String,Object>();							
								innerMap.put("busiId", busi_id);								
								innerMap.put("busiNum", mob_tel);
								innerMap.put("org", opt_name);								
								innerMap.put("datee", newDate);
								innerMap.put("loginCode", mob_tel);								
								innerMap.put("smsModelId", "SERVICE-BTZD");										
								ISpringContext springInstance1 = SpringContextUtils.getInstance();
								SMSService	sMSService = (SMSService) springInstance1.getBean("sMSService");
								sMSService.sendNodeMessage(innerMap);
//								
								String on_recod_id = (String) this.cpcDao.qryObject("flow", "getServiceList_states_on", sqlReqMap);
								sqlReqMap.put("curr_record_id",on_recod_id);
								sqlReqMap.put("service_id", service_id);
								
							}else{
								sqlReqMap.put("curr_record_id", String.valueOf(saveFlowMap.get("curr_record_id")));
								sqlReqMap.put("service_id", service_id);
							}
							
							
							cpcDao.update("flow", "update_service_info", sqlReqMap);
						} catch (Exception e) {
							logger.error("修改服务单表curr_record_id异常"+e);
							e.printStackTrace();
						}
						Map<String,Object> paramMap = new HashMap<String,Object>();
						paramMap.put("demand_id", demandId);
						paramMap.put("service_id", service_id);
						searchService.saveBusiFlowRel(paramMap);
						
						
						Map<String,Object> innerMap = new HashMap<String,Object>();
						innerMap.put("busiId", service_id);
						innerMap.put("busiNum",serviceInfoMap.get("mobTel"));
						innerMap.put("loginCode", serviceInfoMap.get("loginCode"));
						innerMap.put("smsModelId", "SERVICE-ZZZXCFXQD");
						SMSService	sMSService = (SMSService) springInstance.getBean("sMSService");
						sMSService.sendNodeMessage(innerMap);
						
						respMap.put("code", "0");//失败
						respMap.put("msg", "成功");
						respMap.put("serviceId",service_id);
					}else{
						respMap.put("code", "1");//失败
						respMap.put("msg", "流程过程保存失败");
						respMap.put("serviceId","");
					}
				}else{
					respMap.put("code", "1");//失败
					respMap.put("msg", "服务单保存失败");
					respMap.put("serviceId","");
				}
			}
		}
		
		SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		if(!Tools.isNull(recordProcMapLst)){
			for(Map recordProcMap : recordProcMapLst){
				recordProcMap.put("record_id", deRecordId);
				if("newDate".equals(recordProcMap.get("attr_value"))){
					   String newDate = dfs.format(new Date());
					   recordProcMap.put("attr_value", newDate);
				}
				try {
					cpcDao.insert("flow", "save_cpc_record_proc", recordProcMap);
				} catch (Exception e) {
					respMap.put("code", "1");//失败
					respMap.put("msg", "保存拆分属性异常"+e);
					logger.error("保存拆分属性异常"+e);
					e.printStackTrace();
				}
			}
		}
		
		return respMap;
	}
	
	/**
	 * 保存服务单
	 * @param reqMap
	 * @param demand_id
	 * @param record_id
	 * @return
	 */
	private Map<String,String> saveService(Map<String, Object> reqMap,String service_id){
		Map<String,String> respMap = new HashMap<String,String>();//返回
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		sqlReqMap.put("service_id", service_id);
		sqlReqMap.put("service_theme", reqMap.get("service_theme"));
		sqlReqMap.put("service_desc", reqMap.get("service_desc"));
		sqlReqMap.put("promoters_id", reqMap.get("promoters_id"));
		sqlReqMap.put("promoters", reqMap.get("promoters"));
		
		sqlReqMap.put("department_id", reqMap.get("department_id"));
		sqlReqMap.put("department", reqMap.get("department"));
		sqlReqMap.put("tel", reqMap.get("tel"));
		String overLimit = String.valueOf(reqMap.get("over_limit"));
		if(!Tools.isNull(overLimit)){
			overLimit = overLimit +":59";
			overLimit =overLimit.replace("/", "-");
			sqlReqMap.put("over_limit", overLimit);
		}else{
			sqlReqMap.put("over_limit", "");
		}
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
		String nowDate = sdf.format(new Date());
		long limit_time = WeekdayUtil.getDiffDateTime(nowDate, overLimit);
		sqlReqMap.put("limit_time", limit_time);
		sqlReqMap.put("send_time", nowDate);
		try {
			cpcDao.insert("flow", "save_service_info", sqlReqMap);
		} catch (Exception e) {
			logger.error("保存服务单失败"+e);
			e.printStackTrace();
			respMap.put("code", "1");//失败
			respMap.put("msg", "保存服务单失败"+e);
			return respMap;
		}
		respMap.put("code", "0");//失败
		respMap.put("msg", "保存成功");
		return respMap;
	}
	
	
	/**
	 * 查询员工联系号码
	 * @param staffId
	 * @return
	 */
	private Map<String,Object> queryMobTel(String staffId){
		//单池联系电话信息
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		sqlReqMap.put("staff_id", staffId);
		Map<String, Object> mobTelMap = new HashMap<String, Object>();
		try {
			mobTelMap = cpcDao.qryMapInfo("flow", "query_mobTel", sqlReqMap);
		} catch (Exception e) {
			logger.error("查询人员联系号码失败"+e);
			e.printStackTrace();
		}
		return mobTelMap;
	}

	@Override
	public Map<String, Object> getPool(Map<String, Object> reqMap) {
		
		Map<String,Object> sqlReqMap = new HashMap<String, Object>();
		
		try {
			
			Map<String,Object> poolMap = cpcDao.qryMapInfo("flow", "qry_cpc_pool", reqMap);
			sqlReqMap.put("code", "0");
			sqlReqMap.put("msg", "成功");
			sqlReqMap.put("pool", poolMap);
		} catch (Exception e) {
			sqlReqMap.put("code", "-1");
			sqlReqMap.put("msg", "查询单池失败");
			logger.error("查询单池失败"+e);
			e.printStackTrace();
		}
		return sqlReqMap;
	}
	
//	/**
//	 * 根据人员ID、部门ID以及功能ID获取流程节点信息
//	 * @param optId
//	 * @param departmentId
//	 * @param funId
//	 * @return
//	 */
//	private Map<String,Object> getNodeInfo(String optId,String departmentId ,String funId){
//		ISpringContext springInstance = SpringContextUtils.getInstance();
//		UseAuthService useAuthService =  (UseAuthService) springInstance.getBean("useAuthService");
//		Map<String,Object> param = new HashMap<String, Object>();
//		List<Object> colSetLst = new ArrayList<Object>();
//		
//		Map temp = new HashMap();
//		temp.put("relType", "STAFF");
//		temp.put("relValue", optId);
//		colSetLst.add(temp);
//		temp = new HashMap();
//		temp.put("relType", "ORG");
//		temp.put("relValue", departmentId);
//		colSetLst.add(temp);
//		param.put("qryUserColSet", colSetLst);
//		Map<String,Object> resultMap =new HashMap<String, Object>();
//		resultMap = useAuthService.queryFun(param);
//		List<Map<String,Object>> funLst = new ArrayList<Map<String,Object>>();
//		funLst = (List<Map<String, Object>>) resultMap.get("funLst");
//		boolean flag = false;//默认用户无当前操作功能权限
//		if("0".equals(String.valueOf(resultMap.get("code"))) && !Tools.isNull(funLst) && funLst.size() > 0){
//			for(Map<String,Object> map : funLst){
//				if(funId.equals(String.valueOf(map.get("fun_id")))){
//					flag = true;
//					break;
//				}
//			}
//			if(flag){ //判断用户是否具备当前操作功能权限
//				SearchService searchService =  (SearchService) springInstance.getBean("searchService");
//				Map<String,Object> nodeInfo = searchService.queryNodeByFunId(funId);
//				List<Map<String,Object>> nodeLst = (List<Map<String, Object>>) nodeInfo.get("nodeLst");
//				if("0".equals(nodeInfo.get("code")) && !Tools.isNull(nodeLst) && nodeLst.size()> 0){
//					resultMap = nodeInfo;
//				}else{
//					resultMap.put("code", "1");
//					resultMap.put("msg", "当前操作无流程节点配置");
//				}
//			}else{
//				resultMap.put("code", "1");
//				resultMap.put("msg", "用户无当前操作功能权限");
//			}
//		}else{
//			resultMap.put("code", "1");
//			resultMap.put("msg", "用户无功能权限信息配置");
//		}
//		return resultMap;
//	}
	
	
	/**
	 * 根据功能查询流程节点
	 * @param funId
	 * @return
	 */
	private Map<String,Object> getNodeInfo(String funId){
		
		ISpringContext springInstance = SpringContextUtils.getInstance();
		UseAuthService useAuthService =  (UseAuthService) springInstance.getBean("useAuthService");
		Map<String,Object> resultMap =new HashMap<String, Object>();
		SearchService searchService =  (SearchService) springInstance.getBean("searchService");
		Map<String,Object> nodeInfo = searchService.queryNodeByFunId(funId);
		List<Map<String,Object>> nodeLst = (List<Map<String, Object>>) nodeInfo.get("nodeLst");
		if("0".equals(nodeInfo.get("code")) && !Tools.isNull(nodeLst) && nodeLst.size()> 0){
			resultMap = nodeInfo;
		}else{
			resultMap.put("code", "1");
			resultMap.put("msg", "当前操作无流程节点配置");
		}
		return resultMap;
	}

}
