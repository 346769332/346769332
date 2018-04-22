package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface BackService {

	
	/**
	 * 定时评价
	 */
	public void starEvalOnTime(Map<String,Object> param) ;
	
	/**
	 * 关闭消息[将短消息失效]
	 */
	public void overNewsOnTime();
	
	
	/**
	 * 主任定时监控短信
	 */
	public void dirMonitorSmsOnTime(Map<String,Object> param);
	
	
	/**
	 * 定时任务 根据值班安排同步工单池默认员工
	 */
	public void updatePoolStaff(Map<String,Object> param);
	
	
	/**
	 * 需求单 时限过半提醒
	 * @param param
	 */
	public void halfLimitSmsOnTime(Map<String,Object> param);
	
}
