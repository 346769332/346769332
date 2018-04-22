package com.tydic.sale.service.crm.service;

import java.util.Map;

/**
 * 查询类的接口
 * @author xkarvy
 *
 */
public interface SearchService {
	
	
	/**
	 * 保存附件信息
	 * @param param
	 * @return
	 */
	public Map<String, Object> insertAttachInfo(Map<String, Object> param);
	/**
	 * 获取附件信息
	 * @param param
	 * @return
	 */
	public Map<String, Object> getAttachInfo(Map<String, Object> param);
	/**
	 * 删除附件信息
	 * @param param
	 * @return
	 */
	public Map<String, Object> deleteFile(Map<String, Object> param);
	/**
	 * 查询草稿箱集合
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> demandDraftSet(Map<String,Object> paramMap);
	
	/**
	 * 查询字典
	 * @param dicType  [可为空]
	 * @param dicCode  [可为空]
	 * @return
	 */
	public Map<String,Object> dic(Map<String,Object> param);
	
	/**
	 * 查询需求单详情
	 * @param demandId
	 * @param isHistory
	 * @return
	 */
	public Map<String,Object> demandInfo(String demandId ,String isHistory);
	
	/**
	 * 查询服务单详情
	 * @param demandId
	 * @param isHistory
	 * @return
	 */
	public Map<String,Object> serviceInfo(String serviceId ,String isHistory);
	
	
	/**
	 * 查询专业系统单详情
	 * @param flowRecordId
	 * @param isHistory
	 * @return
	 */
	public Map<String,Object> sysInfo(String flowRecordId,String isHistory);
	
	/**
	 * 查询处理集合
	 * @param recordId
	 * @return
	 */
	public Map<String,Object> recordProcSet(String recordId);
	
	/**
	 *  需求单列表查询
	 * */
	public Map getDemandList(Map<String,Object> param);
	
	/**
	 * 服务单列表查询
	 * @param param
	 * @return
	 */
	public Map getServiceList(Map<String,Object> param);
	
	/**
	 * 专业系统列表查询
	 * @param param
	 * @return
	 */
	public Map getSysList(Map<String,Object> param);
	
	
	/**
	 *  按环节统计每个功能总量
	 * */
	public Map getRecordSumList(Map param);
	
	 
	/**
	 * 
	 * 催单
	 * **/
	public Map urgedDemand(Map param);
	
	/**
	 * 根据流程节点查流程下的所有节点
	 * 
	 * **/
	public Map getAllFlowNode(Map param);
	
	
	/**
	 * 过程处理属性保存
	 * 
	 * */
	public Map saveRecordProc(Map param);
	
	/**
	 * 需求单实例变更
	 * 
	 * */
	public Map updateDemand(Map param);
	
	
	/**
	 * 批量删除需求草稿单
	 * @param param
	 * @return
	 */
	public Map<String,Object> removeDemandDraftLst(Map<String,Object> param);
	/**
	 * 获取本地网
	 * @param param
	 * @return
	 */
	public Map<String,Object>  getLatnData(Map<String,Object> param);
	
	/**
	 * 登陆
	 * @param param
	 * @return
	 */
	public Map<String,Object> login(Map<String,Object> param);
	
	/**
	 * 查询员工信息
	 * @param paramMap
	 * @return
	 */
	public Map<String,Object> getStaffInfo(Map<String,Object> paramMap);
	
	
	/**
	 * 通用组织机构树
	 * */
	public Map<String,Object> getSysOrg(Map<String,Object> param); 
	
	/**
	 * 根据最底层节点获取员工信息
	 * */
	public Map<String,Object> getStaffByOrgId(Map<String,Object> param);
	
	/**
	 * 查询单池处理人员关系
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryPoolOpts(Map<String,Object> param);
	
	/**
	 * 统计需求中当前记录id为空数量 
	 * @param param
	 * @return
	 */
	public Map<String,Object> selectDraftCount(Map<String,Object> param);
	
	
	/**
	 * 外系统[专业系统]流程记录单
	 * @param param
	 */
	public Map<String,Object> insertOutSysFlowRecord(Map<String,Object> param);
	
	/**
	 * 查询[专业系统]外系统流程
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryOutSysFlow(Map<String,Object> param);
	
	/**
	 * 查询[专业系统]外系统流程记录
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryOutSysFlowRecord(Map<String,Object> param);

	/**
	 * [校验]业务流程单保存关系 是否存在
	 * @param param
	 * @return
	 */
	public Map<String,Object> validateBusiFlowRel(Map<String,Object> param);
	
	/**
	 * 业务流程单关系保存
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveBusiFlowRel(Map<String,Object> param);
	
	/**
	 * 修改密码
	 * @param param
	 * @return
	 */
	public Map<String, Object> updatePwd(Map<String, Object> param) ;
	
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
	
	
	/**
	 * 根据功能查询节点
	 * @param param
	 * @return
	 */
	public Map<String, Object> queryNodeByFunId(String funId);
	
	
	/**
	 * 查询用户信息
	 * @param param
	 * @return
	 */
	public Map<String,Object> querySysUserInfo (Map<String, Object> param);
	
	/**
	 * 待评价的需求单查询
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryNeedEvalList(Map<String,Object> param);
	/**
	 * 获取需求单的服务单数据
	 * @param param
	 * @return
	 */
	public Map<String,Object> queryNeedEvalServiceList(Map<String,Object> param);
	/**
	 *	保存评价数据
	 * @param param
	 * @return
	 */
	public Map<String,Object> saveEvalData(Map<String,Object> param);
	/**
	 * 待评价的需求单查询
	 * @param param
	 * @return
	 */
	public Map<String,Object> getDateConfigData(Map<String,Object> param);
	
	/**
	 * 查询小CEO部门
	 * @param param
	 * @return
	 */
	public Map<String, Object> getCeoSysOrg(Map<String, Object> param);
	
	/**
	 * 查询专业部门
	 * @param param
	 * @return
	 */
	public Map<String, Object> getDeptSysOrg(Map<String, Object> param);
	
	/**
	 * 修改登录标记
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateLoginState(Map<String, Object> param);
	
	/**
	 * 检查是否登录
	 * @param param
	 * @return
	 */
	public Map<String, Object> checkLogin(Map<String, Object> param);
	/**
	 * 获取PC端需求草稿
	 * @param param
	 * @return
	 */
	public Map<String, Object> getDemandsaveLst(Map<String, Object> inputParam);
	/**
	 * 获取省市领导工号
	 * @param param
	 * @return
	 */
	public Map<String, Object> showStaff(Map<String, Object> inputParam);
	/**
	 * 省市领导留言
	 * @param param
	 * @return
	 */
	public Map<String, Object> updateflow(Map<String, Object> inputParam);
	/**
	 * 根据部门id获取所属员工的loginCode
	 * @param param
	 * @return
	 */
	public Map<String, Object> getLoginCodeList(Map<String, Object> inputParam);
	/**
	 * 查询需求单流程记录
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryHistoryRecord(Map<String,Object> param);
	/**
	 * 查询部门领导的信息
	 * @param param
	 * @return
	 */
	public Map<String,Object> qryDeptStaffInfo(Map<String,Object> param);
	/**
	 * 保存上传的多图片
	 * @param param
	 * @return
	 */
	public Map<String,Object> uploadDemandImages(Map<String,Object> param);
}
