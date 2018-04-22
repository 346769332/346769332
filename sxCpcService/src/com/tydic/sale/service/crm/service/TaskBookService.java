package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface TaskBookService {
	/**
	 * 查询责任书列表
	 * @param param
	 * @return
	 */
	public Map<String, Object> qryTaskBookList(Map<String, Object> param);
	/**
	 * 责任书审批发起
	 * @param param
	 * @return
	 */
	public Map<String,Object> submitTaskBook(Map<String, Object> param,String handleType);
	/**
	 * 查询责任书详情
	 * @param param
	 * @return
	 */
	public Map<String, Object> searchTaskInfo(Map<String, Object> param);
	/**
	 * 责任书流程流转
	 * @param param
	 * @return
	 */
	public Map<String, Object> flowTaskBook(Map<String, Object> param);
	/**
	 * 查询责任书规范书信息
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> searchTaskBookInfo(Map<String, Object> inputParam);
	/**
	 * 保存规范书信息
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> insertTaskBookInfo(Map<String, Object> inputParam);
	/**
	 * 查询组织机构树
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> queryStaffTree(Map<String, Object> inputParam);
	/**
	 * 查询责任书定制时的列表
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> qryTaskModelList(Map<String, Object> inputParam);
	/**
	 * 查询责任书定制时的列表
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> releaseTaskBook(Map<String, Object> inputParam);
	/**
	 * 查询责任书上传的文件
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> qryAttachInfo(Map<String, Object> inputParam);
}
