package com.tydic.sale.service.crm.po;

import java.io.Serializable;
import java.util.List;
import java.util.Map;
 

public class PolicyManualInfoBean implements Serializable {
	private String id;
	private String policyTheme;
	private String type;
	private String detailType;
	private String beginDate;
	private String endDate;
	private String content;
	private String optId;
	private String optName;
	private String createTime;
	private String state;
	private String stateName;
	private String o_type;
	private String picture;
	private String o_type_d;
	private String theme ;
	private List<Map<String,Object>> infoAttr;
	private List<Map<String,Object>> releaseArea;
	
	
	public String getPolicyTheme() {
		return policyTheme;
	}
	public void setPolicyTheme(String policyTheme) {
		this.policyTheme = policyTheme;
	}
	public String getOptName() {
		return optName;
	}
	public void setOptName(String optName) {
		this.optName = optName;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getDetailType() {
		return detailType;
	}
	public void setDetailType(String detailType) {
		this.detailType = detailType;
	}
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getOptId() {
		return optId;
	}
	public void setOptId(String optId) {
		this.optId = optId;
	}
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public String getState() {
		return state;
	}
	public void setState(String state) {
		this.state = state;
	}
	public String getO_type() {
		return o_type;
	}
	public void setO_type(String o_type) {
		this.o_type = o_type;
	}
	public String getStateName() {
		return stateName;
	}
	public void setStateName(String stateName) {
		this.stateName = stateName;
	}
	public String getPicture() {
		return picture;
	}
	public void setPicture(String picture) {
		this.picture = picture;
	}
	public String getO_type_d() {
		return o_type_d;
	}
	public void setO_type_d(String o_type_d) {
		this.o_type_d = o_type_d;
	}
	public String getTheme() {
		return theme;
	}
	public void setTheme(String theme) {
		this.theme = theme;
	}
	public List<Map<String, Object>> getInfoAttr() {
		return infoAttr;
	}
	public void setInfoAttr(List<Map<String, Object>> infoAttr) {
		this.infoAttr = infoAttr;
	}
	public List<Map<String, Object>> getReleaseArea() {
		return releaseArea;
	}
	public void setReleaseArea(List<Map<String, Object>> releaseArea) {
		this.releaseArea = releaseArea;
	}
	
	
 
}
