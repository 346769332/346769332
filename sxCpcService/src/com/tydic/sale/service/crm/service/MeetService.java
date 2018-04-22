package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface MeetService {
	

	/**
	 * 插入
	 */
	public Map<String,Object> addMeetInfo(Map<String,Object> param) ;
	

	/**
	 * 查询
	 */
	public Map<String,Object> qryMeetInfo(Map<String,Object> param) ;
	
	/**
	 * 更新
	 */
	public Map<String,Object> updMeetInfo(Map<String,Object> param) ;
	
	
	
}
