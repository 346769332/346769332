package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface LeaveService {
	
	/**
	 * 查询
	 */
	public Map<String, Object> queryLeaveFlowId(Map<String,Object> param) ;
	
	/**
	 * 查询
	 */
	public Map<String, Object> queryLeaveType(Map<String,Object> param) ;

	/**
	 * 插入
	 */
	public String addLeaveDemandFlowInfo(Map<String,Object> param) ;
	
	
	public Map<String, Object> saveDamand(Map<String,Object> param) ;
	
	/**
	 * 获取待审批请假列表
	 */
	public Map<String, Object> querySavelList(Map<String,Object> param) ;
	
	
	public Map<String, Object> qryLeaveDemandInfo(Map<String,Object> param);
	
	
	public Map<String, Object> handComment(Map<String,Object> param);
	
	public Map<String, Object> queryListOld(Map<String,Object> param);
	
	public Map<String, Object> cancleDamand(Map<String,Object> param);
	
	public Map<String, Object> qryDateCount(Map<String,Object> param);
	
	public Map<String, Object> checkHoliyday(Map<String,Object> param);
}
