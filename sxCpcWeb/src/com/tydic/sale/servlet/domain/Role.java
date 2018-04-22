package com.tydic.sale.servlet.domain;

import java.io.Serializable;

import com.alibaba.fastjson.annotation.JSONField;

public class Role implements Serializable {
	
	private int roleId;
	
	private String roleName;
	
	private String roleDesc;
	
	private String status ;


	public int getRoleId() {
		return roleId;
	}

	public void setRoleId(int roleId) {
		this.roleId = roleId;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public String getRoleDesc() {
		return roleDesc;
	}

	public void setRoleDesc(String roleDesc) {
		this.roleDesc = roleDesc;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
	

}
