package com.tydic.sale.service.crm.service;

import java.util.List;
import java.util.Map;


/**
 * 
 * @author zhangjin
 *
 */
public interface FlowService {
	
	/**
	 * 保存需求单
	 * @param reqMap
	 * @param handleType
	 * @return
	 */
	public Map<String,Object> saveDemand(Map<String,Object> reqMap,String handleType);
	
	/**
	 * 流程流程
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> flowExchange(Map<String,Object> flowRecordMap,Map<String,Object> demandMap,Map<String,Object> serviceMap,List<Map<String,Object>> recordProcMapLst,String handleType);
	
	
	/**
	 *获取需求单号
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> getDemandId(Map<String,Object> reqMap);
	
	
	/**
	 * 保存服务单
	 */
	public Map<String,Object> saveService(Map<String,Object> reqMap);
	
	
	/**
	 * 获取单池
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> getPool(Map<String,Object> reqMap);
}
