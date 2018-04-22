package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface SysManageService {
	

	/**
	 * 新增工号信息
	 * @param param
	 * @return
	 */
	public Map<String, Object> addStaffInfo(Map<String, Object> param);
	
	/**
	 * 查询staffId最大值
	 * @param param
	 * @return
	 */
	public Map<String, Object> qryMaxStaffId(Map<String, Object> param);
	
	/**
	 * 校验loginCode唯一性
	 * @param param
	 * @return
	 */
	public Map<String, Object> checkLoginCode(Map<String, Object> param);
	/**
	 * 修改工号状态
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateStaffState(Map<String, Object> param);
	
	/**
	 * 组织机构
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryOrganisationList(Map<String,Object> param);
	/**
	 * 查询角色集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryRoleList(Map<String,Object> param);
	/**
	 * 增加角色集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> addRoleInfo(Map<String,Object> param);
	/**
	 * 修改角色集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> updateRoleInfo(Map<String,Object> param);
	/**
	 * 判断角色是否使用
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryRoleUseCount(Map<String,Object> param);
	/**
	 * 删除角色集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> deleteRoleInfo(Map<String,Object> param);
	/**
	 * 获取角色权限资源
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryRoleAuthInfo(Map<String,Object> param);
	/**
	 * 保存角色权限
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveRoleAuthInfo(Map<String,Object> param);
	
	
	/*-----20150424权限集合begin------*/
	/**
	 * 查询权限集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryAuthList(Map<String,Object> param);
	/**
	 * 增加权限集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> addAuthInfo(Map<String,Object> param);
	/**
	 * 修改权限集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> updateAuthInfo(Map<String,Object> param);
	/**
	 * 判断权限是否使用
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryAuthUseCount(Map<String,Object> param);
	/**
	 * 删除权限集合
	 * @param param
	 * @return
	 */
	public Map<String,Object> deleteAuthInfo(Map<String,Object> param);
	
	public Map<String,Object> queryAssignAuthInfo(Map<String,Object> param);
	
	public Map<String,Object> saveAssignAuthInfo(Map<String,Object> param);

	
	/*-----20150424权限集合end------*/
	
	
	/**
	 * 获取角色用户资源
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryRoleUserInfo(Map<String,Object> param);
	/**
	 * 保存角色用户
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveRoleUserInfo(Map<String,Object> param);
	
	/**
	 * 记录用户操作日志
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveOptRecordInfo(Map<String,Object> param);
	
	/**
	 * xinzeng值班安排
	 * @param param
	 * @return
	 */
	public Map<String,Object> addCallSchedule(Map<String,Object> param);
	
	/**
	 * 值班安排
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryCallSchedule(Map<String,Object> param);
	
	/**
	 * 新增组织机构
	 * @param param
	 * @return
	 */
	public Map<String,Object> addOrgInfo(Map<String,Object> param);
	
	/**
	 * 值班更新
	 * @param param
	 * @return
	 */
	public Map<String,Object> updateCallSchedule(Map<String,Object> param);
	

	/**
	 * 接单池查询
	 * @param param
	 * @return
	 */
	public Map<String, Object> qryPoolListPage(Map<String, Object> param);
	public Map<String, Object> qryServiceListPage(Map<String, Object> param);
	public Map<String, Object> qryStaffInfo(Map<String, Object> param);
	public Map<String, Object> updatePoolInfo(Map<String, Object> param);
	public Map<String, Object> updateServiceInfo(Map<String, Object> param);
	

	/**
	 * 查询组织机构角色信息
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryOrgAuthInfo(Map<String,Object> param);
	/**
	 * 组织机构修改权限
	 * @param param
	 * @return
	 */
	public Map<String, Object> saveOrgAuthInfo(Map<String, Object> param);
	
}
