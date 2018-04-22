package com.tydic.sale.servlet.domain;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import com.alibaba.fastjson.annotation.JSONField;

/**
 * 员工信息
 * @author lyw
 *
 */
public class SystemUser implements Serializable {
	
	private String staffId ;
	
	private String staffName;
	
	private String loginCode;
	
	private String passWord;
	
	private String regionId;
	
	private String departmentCode;
	
	private String mobTel;
	
	private String controlNumber;
	
	private String pid;
	
	private String regionName;
	
	private String regionCode;
	
	private List<Map> orgSet;
	
	private String orgId;
	
	private String orgName;
	
	private String helpTel;
	
	private String orgFlag;

	private List<Map> roleLst;
	
	private List<Map> poolLst;
	
	private List<Map> funLst; 
	
	private List<Map> menuLst;
	
	private List<Map> dataLst;
	
	private List<Map> homePageLst;
	
	private String leaderDataLst;
	
	
	public String getPassWord() {
		return passWord;
	}

	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}

	public String getHelpTel() {
		return helpTel;
	}

	public void setHelpTel(String helpTel) {
		this.helpTel = helpTel;
	}

	public String getOrgId() {
		return orgId;
	}

	public void setOrgId(String orgId) {
		this.orgId = orgId;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public List<Map> getOrgSet() {
		return orgSet;
	}

	public void setOrgSet(List<Map> orgSet) {
		this.orgSet = orgSet;
	}

	public String getStaffId() {
		return staffId;
	}

	public void setStaffId(String staffId) {
		this.staffId = staffId;
	}

	public String getStaffName() {
		return staffName;
	}

	public void setStaffName(String staffName) {
		this.staffName = staffName;
	}

	public String getLoginCode() {
		return loginCode;
	}

	public void setLoginCode(String loginCode) {
		this.loginCode = loginCode;
	}

	public String getRegionId() {
		return regionId;
	}

	public void setRegionId(String regionId) {
		this.regionId = regionId;
	}

	public String getDepartmentCode() {
		return departmentCode;
	}

	public void setDepartmentCode(String departmentCode) {
		this.departmentCode = departmentCode;
	}

	public String getPid() {
		return pid;
	}

	public void setPid(String pid) {
		this.pid = pid;
	}

	public String getRegionName() {
		return regionName;
	}

	public void setRegionName(String regionName) {
		this.regionName = regionName;
	}

	public String getRegionCode() {
		return regionCode;
	}

	public void setRegionCode(String regionCode) {
		this.regionCode = regionCode;
	}

	public String getMobTel() {
		return mobTel;
	}

	public void setMobTel(String mobTel) {
		this.mobTel = mobTel;
	}

	public String getControlNumber() {
		return controlNumber;
	}

	public void setControlNumber(String controlNumber) {
		this.controlNumber = controlNumber;
	}

	public List<Map> getRoleLst() {
		return roleLst;
	}

	public void setRoleLst(List<Map> roleLst) {
		this.roleLst = roleLst;
	}

	public List<Map> getPoolLst() {
		return poolLst;
	}

	public void setPoolLst(List<Map> poolLst) {
		this.poolLst = poolLst;
	}

	public List<Map> getFunLst() {
		return funLst;
	}

	public void setFunLst(List<Map> funLst) {
		this.funLst = funLst;
	}

	public List<Map> getMenuLst() {
		return menuLst;
	}

	public void setMenuLst(List<Map> menuLst) {
		this.menuLst = menuLst;
	}

	public List<Map> getDataLst() {
		return dataLst;
	}

	public void setDataLst(List<Map> dataLst) {
		this.dataLst = dataLst;
	}

	public String getLeaderDataLst() {
		return leaderDataLst;
	}

	public void setLeaderDataLst(String leaderDataLst) {
		this.leaderDataLst = leaderDataLst;
	}

	public List<Map> getHomePageLst() {
		return homePageLst;
	}

	public void setHomePageLst(List<Map> homePageLst) {
		this.homePageLst = homePageLst;
	}
	
	public String getOrgFlag() {
		return orgFlag;
	}

	public void setOrgFlag(String orgFlag) {
		this.orgFlag = orgFlag;
	}

}
