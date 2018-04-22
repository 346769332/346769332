package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface ReportService {

	/**
	 * 批量定时执行
	 * @param param
	 */
	public void batchProcTimer(Map<String,Object> param);
	
	/**
	 * 执行存储过程
	 * @param param
	 */
	public void execReportProc(Map<String,Object> param);
	
	/**
	 * 查询报表配置【公共方式】
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryReportPublicConfig(Map<String,Object> param);
	
	
	/**
	 * 查询报表【公共方式】
	 * @param param
	 * @return
	 */
	public Map<String,Object> searchReportPublic(Map<String,Object> param);
	
	/**
	 * 查询报表查询控件【公共方式】
	 * @param param
	 * @return
	 */
	public Map<String,Object> searchReportPublicControl(Map<String,Object> param);
	
	
	/**
	 * 查询短消息
	 * @param param
	 * @return
	 */
	public Map<String, Object> qryNews(Map<String, Object> param);
	
	/**
	 * 查询未读短消息数量
	 * @param param
	 * @return
	 */
	public Map<String, Object> getNotLookNewsCount(Map<String, Object> param);
	
	
	/**
	 * 变更短消息查看状态
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateLookNews(Map<String, Object> param);
	
	
	/**
	 * 查看短消息详情【根据类型】
	 * @param param
	 * @return
	 */
	public Map<String, Object> qryNewsInfoByType(Map<String, Object> param);
	
	/**
	 * 月度星级评价
	 * @param param
	 * @return
	 */
	public Map<String, Object> starEvalOnMonth(Map<String, Object> param);
	
	
	
}
