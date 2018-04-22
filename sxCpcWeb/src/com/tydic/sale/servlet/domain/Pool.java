package com.tydic.sale.servlet.domain;

import java.io.Serializable;

public class Pool implements Serializable {
	private String poolId;
	
	private String poolName;
	
	private int calimLimit;
	
	private int urgeSpanTime;
	
	private int defaultEvalTime;
	
	private int defaultEval;
	
	private int defaultMobTel;

	public String getPoolId() {
		return poolId;
	}

	public void setPoolId(String poolId) {
		this.poolId = poolId;
	}

	public String getPoolName() {
		return poolName;
	}

	public void setPoolName(String poolName) {
		this.poolName = poolName;
	}

	public int getCalimLimit() {
		return calimLimit;
	}

	public void setCalimLimit(int calimLimit) {
		this.calimLimit = calimLimit;
	}

	public int getUrgeSpanTime() {
		return urgeSpanTime;
	}

	public void setUrgeSpanTime(int urgeSpanTime) {
		this.urgeSpanTime = urgeSpanTime;
	}

	public int getDefaultEvalTime() {
		return defaultEvalTime;
	}

	public void setDefaultEvalTime(int defaultEvalTime) {
		this.defaultEvalTime = defaultEvalTime;
	}

	public int getDefaultEval() {
		return defaultEval;
	}

	public void setDefaultEval(int defaultEval) {
		this.defaultEval = defaultEval;
	}

	public int getDefaultMobTel() {
		return defaultMobTel;
	}

	public void setDefaultMobTel(int defaultMobTel) {
		this.defaultMobTel = defaultMobTel;
	}
	
	
}
