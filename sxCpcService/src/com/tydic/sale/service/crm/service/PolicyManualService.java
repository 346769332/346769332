package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface PolicyManualService {
	
	/**
	 * 获取政策手册类型列表
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> searchPolicyManualTypeList(Map<String,Object> reqMap);
	/**
	 * 获取政策手册类型详细列表
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> searchPolicyManualTypeDetailList(Map<String,Object> reqMap);
	/**
	 * 获取政策手册列表
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> searchPolicyManualInfoList(Map<String,Object> reqMap);
	
	/**
	 * 查询政策手册列表
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryPolicyManualList(Map<String, Object> param);
	
	/**
	 * 刪除政策手册列表
	 * @param param
	 * @return
	 */
	public Map<String,Object> deletePolicyManualList(Map<String, Object> param);
	
	/**
	 * 发布政策手册列表
	 * @param param
	 * @return
	 */
	public Map<String,Object> releasePolicyManualList(Map<String, Object> param);
	
	/**
	 * 审批政策
	 * @param param
	 * @return
	 */
	public Map<String,Object> approvalPolicyManualList(Map<String, Object> param);
	
	/**
	 * 新增政策手册
	 * @param param
	 * @return
	 */
	public Map<String,Object> insertPolicyManual(Map<String, Object> param);
	
	/**
	 * 更新政策手册
	 * @param param
	 * @return
	 */
	public Map<String,Object> updatePolicyManual(Map<String, Object> param);
	
	/**
	 * 更新政策手册状态
	 * @param param
	 * @return
	 */
	public Map<String,Object> updatePolicyManualInfoState(Map<String, Object> param);
	/**
	 *获取区域数据
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryAreaData(Map<String, Object> param);
}
