package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface EvalMonService {
	/**
	 * 查询用户信息
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> searchUserInfo(Map<String,Object> paramMap);
	
	/**
	 * 查询专业部门的信息
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> searchDeptInfo(Map<String,Object> paramMap);
	
	/**
	 * 保存月度综合评价综支中心
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> saveEvalMonZZ(Map<String,Object> paramMap);

	/**
	 * 保存月度综合评价专业部门
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> saveEvalDept(Map<String,Object> paramMap);
	
	/**
	 * 查询评价积分
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> searchScoreInfo(Map<String,Object> paramMap);

	/**
	 * 查询月度综合评价时限
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> searchDate();

	//展示部门
	Map<String, Object> searchDeptmentInfo(Map<String, Object> paramMap);
	//展示部门所对应的指标
	Map<String, Object> searchIndexInfo(Map<String, Object> paramMap);
	//评分
	Map<String, Object> updateAssessInfo(Map<String, Object> paramMap);

	//查询部门和领导信息（逆向打分）
	public Map<String, Object> qryDeptAndStaffInfo(Map<String, Object> paramMap);
	/**
	 * 查询bbs评论的需求类型
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryDemandShortType(Map<String,Object> param);
	/**
	 * 新增bbs评论
	 * @param param
	 * @return
	 */
	public Map<String,Object> addBBsCommentInfo(Map<String,Object> param);
	/**
	 * 查询bbs评论列表
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryCommentList(Map<String,Object> param);
	/**
	 * 查询bbs跟帖列表
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryCommentInfoList(Map<String,Object> param);
	/**
	 * 保存bbs跟帖信息
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveEvalComment(Map<String,Object> param);
	/**
	 * 咸阳逆评信息的查询
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryReverseEvalInfo(Map<String,Object> param);
}
