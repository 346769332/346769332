package com.tydic.sale.servlet.domain;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * 组织机构信息
 * @author lyw
 *
 */
public class InterOrg implements Serializable {
	
	/**
	 * 组织结构ID
	 */
	@JSONField(name="INTER_ORG_ID")
	private String interOrgId;
	
	/**
	 * 组织结构编码
	 */
	@JSONField(name="INTER_ORG_CODE")
	private String interOrgCode;
	
	/**
	 * 组织结构描述
	 */
	@JSONField(name="INTER_ORG_DESC")
	private String interOrgDesc;
	
	/**
	 * 组织结构名称
	 */
	@JSONField(name="INTER_ORG_NAME")
	private String interOrgName;
	
	/**
	 * 组织结构大类
	 */
	@JSONField(name="INTER_ORG_TYPE_ID")
	private String interOrgTypeId;
	
	/**
	 * 组织结构大类名称
	 */
	@JSONField(name="INTER_ORG_TYPE_NAME")
	private String interOrgTypeName;
	
	/**
	 * 营业区ID
	 */
	@JSONField(name="AREA_ID")
	private String areaId;
	
	/**
	 * 创建时间
	 */
	@JSONField(name="CRT_DATE")
	private String crtDate;
	
	/**
	 * 有效时间
	 */
	@JSONField(name="EFF_DATE")
	private String effDate;
	
	/**
	 * 有效状态
	 */
	@JSONField(name="EFF_STATE")
	private String effState;
	
	/**
	 * 失效时间
	 */
	@JSONField(name="EXP_DATE")
	private String expDate;
	
	/**
	 * 本地网
	 */
	@JSONField(name="LATN_ID")
	private String latnId;
	
	/**
	 * 修改时间
	 */
	@JSONField(name="MOD_DATE")
	private String modDate;
	
	/**
	 * 组织结构小类
	 */
	@JSONField(name="INTER_ORG_STRUC_ID")
	private String orgTypeId;
	
	/**
	 * 组织结构小类名称
	 */
	@JSONField(name="INTER_ORG_STRUC_NAME")
	private String orgTypeName;
	
	/**
	 * 参与人ID
	 */
	@JSONField(name="PTY_ID")
	private String ptyId;

	public String getInterOrgId() {
		return interOrgId;
	}

	public void setInterOrgId(String interOrgId) {
		this.interOrgId = interOrgId;
	}

	public String getInterOrgCode() {
		return interOrgCode;
	}

	public void setInterOrgCode(String interOrgCode) {
		this.interOrgCode = interOrgCode;
	}

	public String getInterOrgDesc() {
		return interOrgDesc;
	}

	public void setInterOrgDesc(String interOrgDesc) {
		this.interOrgDesc = interOrgDesc;
	}

	public String getInterOrgName() {
		return interOrgName;
	}

	public void setInterOrgName(String interOrgName) {
		this.interOrgName = interOrgName;
	}

	public String getInterOrgTypeId() {
		return interOrgTypeId;
	}

	public void setInterOrgTypeId(String interOrgTypeId) {
		this.interOrgTypeId = interOrgTypeId;
	}

	public String getInterOrgTypeName() {
		return interOrgTypeName;
	}

	public void setInterOrgTypeName(String interOrgTypeName) {
		this.interOrgTypeName = interOrgTypeName;
	}

	public String getAreaId() {
		return areaId;
	}

	public void setAreaId(String areaId) {
		this.areaId = areaId;
	}

	public String getCrtDate() {
		return crtDate;
	}

	public void setCrtDate(String crtDate) {
		this.crtDate = crtDate;
	}

	public String getEffDate() {
		return effDate;
	}

	public void setEffDate(String effDate) {
		this.effDate = effDate;
	}

	public String getEffState() {
		return effState;
	}

	public void setEffState(String effState) {
		this.effState = effState;
	}

	public String getExpDate() {
		return expDate;
	}

	public void setExpDate(String expDate) {
		this.expDate = expDate;
	}

	public String getLatnId() {
		return latnId;
	}

	public void setLatnId(String latnId) {
		this.latnId = latnId;
	}

	public String getModDate() {
		return modDate;
	}

	public void setModDate(String modDate) {
		this.modDate = modDate;
	}

	public String getOrgTypeId() {
		return orgTypeId;
	}

	public void setOrgTypeId(String orgTypeId) {
		this.orgTypeId = orgTypeId;
	}

	public String getOrgTypeName() {
		return orgTypeName;
	}

	public void setOrgTypeName(String orgTypeName) {
		this.orgTypeName = orgTypeName;
	}

	public String getPtyId() {
		return ptyId;
	}

	public void setPtyId(String ptyId) {
		this.ptyId = ptyId;
	}

}
