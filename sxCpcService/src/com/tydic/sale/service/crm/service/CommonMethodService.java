package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface CommonMethodService {
	/**
	 * 新增数据-公共方法
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> addCommonMethod(Map<String, Object> inputParam) throws Exception;

	/**
	 * 删除数据-公共方法
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> delCommonMethod(Map<String, Object> inputParam) throws Exception;
	
	
	/**
	 * 更新数据-公共方法
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> updCommonMethod(Map<String, Object> inputParam) throws Exception;


	/**
	 * 查询数据-公共方法
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> qryCommonMethod(Map<String, Object> inputParam) throws Exception;
	
	
	/**
	 * 查询数据列表-公共方法
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public Map<String,Object> qryLstCommonMethod(Map<String, Object> inputParam) throws Exception;
	/**
	 * 查询某一数据
	 * @param param
	 * @return
	 * @throws Exception
	 */
	//public Map<String,Object> qryObjCommonMethod(Map<String, Object> inputParam) throws Exception;		
}
