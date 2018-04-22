package com.tydic.sale.service.crm.service;

import java.util.Map;

/**
 * PUSH推送消息接口
 * @author simon
 *
 */
public interface NotificationService {
	
	/**
	 * 查询PUSH消息推送
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> qryPushInfo(Map<String,Object> paramMap);
	/**
	 * 新增PUSH推送消息
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> addPushInfo(Map<String,Object> paramMap);
}
