package com.tydic.sale.service.crm.service;

import java.util.Map;

import org.springframework.stereotype.Repository;


public interface OutcommonService {

	/**
	 * 查询账户信息
	 */
	public Map<String, Object> selectUserSecondaryList(Map<String, Object> param);
	/**
	 * 新增工号信息
	 * @param param
	 * @return
	 */
	public Map<String, Object> addStaffInfoOut(Map<String, Object> param);
	/**
	 * 更新工号信息
	 */
	public Map<String, Object> updateUserInfo(Map<String, Object> param);
	/**
	 * 删除信息
	 */
	public Map<String, Object> delUserInfo(Map<String, Object> param);
	/**
	 * 查询角色信息
	 */
	public Map<String, Object> selectroleInfo(Map<String, Object> param);
	/**
	 * 增加角色信息
	 */
	public Map<String, Object> insertroleInfo(Map<String, Object> param);
	/**
	 * 更新角色信息
	 */
	public Map<String, Object> updateroleInfo(Map<String, Object> param);
	/**
	 * 删除角色信息
	 */
	public Map<String, Object> deleteroleInfo(Map<String, Object> param);
	/**
	 * 调用接口查询资源角色与从帐号关系信息。getResRoleUsersecondaryList
	 */
	public Map<String, Object> selectroleInfosecondaryList(Map<String, Object> param);
	/**
	 * selectOrganizationList
	 */
	public Map<String, Object> selectOrganizationList(Map<String, Object> param);
	/**
	 * 
	 */
	public Map<String, Object> insertResRoleUsersecondaryList(Map<String, Object> param);
	/**
	 * 
	 */
	public Map<String, Object> updateResRoleUsersecondaryList(Map<String, Object> param);
	/**
	 * 
	 */
	public Map<String, Object> deleteResRoleUsersecondaryList(Map<String, Object> param);
	
	/**
	 * 得到代办数
	 * @param smsModelMap
	 * @return 
	 */
	public Map<String,Object> getOrderCount(Map<String,Object> param);
}
