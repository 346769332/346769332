package com.tydic.sale.servlet.domain;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;

public class Privilege implements Serializable {
	
	/**
	 * 权限ID
	 */
	@JSONField(name="PRIVILEGE_ID")
	private String privilegeId;
	
	/**
	 * 权限编码
	 */
	@JSONField(name="PRIVILEGE_CODE")
	private String privilegeCode;
	
	/**
	 * 权限名称
	 */
	@JSONField(name="PRIVILEGE_NAME")
	private String privilegeName;
	
	/**
	 * 权限描述
	 */
	@JSONField(name="PRIVILEGE_DESC")
	private String privilegeDesc;
	
	/**
	 * 父权限编码
	 */
	@JSONField(name="SUPER_CODE")
	private String superCode;
	
	/**
	 * 权限类型
	 */
	@JSONField(name="PRIVILEGE_TYPE")
	private String privilegeType;
	
	/**
	 * 页面URL
	 */
	@JSONField(name="URL")
	private String url;
	
	/**
	 * 权限状态
	 */
	@JSONField(name="STATUS_CD")
	private String statusCd;
	
	@JSONField(name="POSITION")
	private String position;
	
	@JSONField(name="LAYER")
	private String layer;
	
	@JSONField(name="MENU_TARGET")
	private String menuTarget;
	
	/**
	 * 系统标志
	 */
	@JSONField(name="APP_ID")
	private String appId;
	
	/**
	 * 父权限ID
	 */
	@JSONField(name="PARENT_PRIVILEGE_ID")
	private String parentPrivilegeId;
	
	/**
	 * 割接标志
	 */
	@JSONField(name="TYPE")
	private String type;
	
	/**
	 * 是否叶子节点
	 */
	@JSONField(name="IS_LEAF")
	private String isLeaf;
	
	/**
	 * 状态时间
	 */
	@JSONField(name="STATUS_DATE")
	private String statusDate;
	
	/**
	 * 创建时间
	 */
	@JSONField(name="CREATE_DATE")
	private String createDate;
	
	/**
	 * 级别ID
	 */
	@JSONField(name="LEVEL_ID")
	private String levelId;

	public String getPrivilegeId() {
		return privilegeId;
	}

	public void setPrivilegeId(String privilegeId) {
		this.privilegeId = privilegeId;
	}

	public String getPrivilegeCode() {
		return privilegeCode;
	}

	public void setPrivilegeCode(String privilegeCode) {
		this.privilegeCode = privilegeCode;
	}

	public String getPrivilegeName() {
		return privilegeName;
	}

	public void setPrivilegeName(String privilegeName) {
		this.privilegeName = privilegeName;
	}

	public String getPrivilegeDesc() {
		return privilegeDesc;
	}

	public void setPrivilegeDesc(String privilegeDesc) {
		this.privilegeDesc = privilegeDesc;
	}

	public String getSuperCode() {
		return superCode;
	}

	public void setSuperCode(String superCode) {
		this.superCode = superCode;
	}

	public String getPrivilegeType() {
		return privilegeType;
	}

	public void setPrivilegeType(String privilegeType) {
		this.privilegeType = privilegeType;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public String getStatusCd() {
		return statusCd;
	}

	public void setStatusCd(String statusCd) {
		this.statusCd = statusCd;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getLayer() {
		return layer;
	}

	public void setLayer(String layer) {
		this.layer = layer;
	}

	public String getMenuTarget() {
		return menuTarget;
	}

	public void setMenuTarget(String menuTarget) {
		this.menuTarget = menuTarget;
	}

	public String getAppId() {
		return appId;
	}

	public void setAppId(String appId) {
		this.appId = appId;
	}

	public String getParentPrivilegeId() {
		return parentPrivilegeId;
	}

	public void setParentPrivilegeId(String parentPrivilegeId) {
		this.parentPrivilegeId = parentPrivilegeId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getIsLeaf() {
		return isLeaf;
	}

	public void setIsLeaf(String isLeaf) {
		this.isLeaf = isLeaf;
	}

	public String getStatusDate() {
		return statusDate;
	}

	public void setStatusDate(String statusDate) {
		this.statusDate = statusDate;
	}

	public String getCreateDate() {
		return createDate;
	}

	public void setCreateDate(String createDate) {
		this.createDate = createDate;
	}

	public String getLevelId() {
		return levelId;
	}

	public void setLevelId(String levelId) {
		this.levelId = levelId;
	}

}
