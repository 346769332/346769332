package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface UseAuthService {

	/**
	 * 查询权限功能
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryFun(Map<String, Object> param);
	
	
	/**
	 * 查询用户角色单池信息
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryUserRolePoolInfo(Map<String,Object> param);
	
	
	/**
	 * 根据数据配置角色查询员工
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryStaffByData(Map<String,Object> param);
	
}
