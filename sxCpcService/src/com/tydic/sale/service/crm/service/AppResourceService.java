package com.tydic.sale.service.crm.service;

import org.springframework.stereotype.Service;


public interface AppResourceService {

	/**
	 * 查询账户信息
	 * @return soap
	 */
	public String getUserSecondaryList();
	/**
	 * 主要用于向4A管理平台提供对帐号同步的功能
	 * @param paString
	 * @return soap
	 */
	public String setUserSecondaryList(String paString);
	/**
	 * 主要用于对外部应用提供对资源角色查询的功能
	 * @param paString
	 * @return soap 
	 */
	public String getResourceRoleList();
	
	/**
	 * 主要用于对外部应用提供对资源角色同步的功能
	 * @param paString
	 * @return
	 */
	public String setResourceRoleList(String paString);
	/**
	 * 主要用于对外部应用提供对资源角色与从帐号关系查询的功能
	 * @return
	 */
	public String getResRoleUsersecondaryList();
	/**
	 * 主要用于对外部应用提供对资源角色与从帐号关系同步的功能
	 * @param paString
	 * @return soap
	 */
	public String setResRoleUsersecondaryList(String paString);
	/**
	 * 查询组织
	 * @param paString
	 * @return
	 */
	public String getOrganizationList();
	/**
	 * 主要用于向4A管理平台提供对组织同步的功能
	 * @param paString
	 * @return soap
	 */
	public String setOrganizationList(String paString);


}
