package com.tydic.sale.service.crm.service;

import java.util.Map;

/**
 * 领导行程安排
 * @author simon
 *
 */
public interface LeadStrokeService {
	/**
	 * 领导行程安排保存草稿
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> sendSaveLeadStrokeInfo(Map<String,Object> paramMap);
	/**
	 * 领导行程安排从草稿箱发布
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> submitLeadStrokeInfo(Map<String,Object> paramMap);
}
