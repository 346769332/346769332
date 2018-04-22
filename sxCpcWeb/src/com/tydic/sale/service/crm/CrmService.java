package com.tydic.sale.service.crm;

import java.util.List;
import java.util.Map;

public interface CrmService {
	
	
	/**
	 * 新增组织机构
	 * @param param
	 * @return
	 */
	public Map<Object, Object> addOrgInfo(Map<Object, Object> param);
	/**
	 * 查询专业部门的详情
	 * @return
	 */
	public Map<Object,Object> searchDeptInfo(Map<Object,Object> paramMap);
	
	/**
	 * 保存月度综合评价（综支中心）
	 * @return
	 */
	public Map<Object,Object> saveEvalMonZZ(Map<Object,Object> paramMap);
	
	/**
	 * 保存月度综合评价（专业部门）
	 * @return
	 */
	public Map<Object,Object> saveEvalDept(Map<Object,Object> paramMap);
	
	/**
	 * 查询登录详情
	 * @return
	 */
	public Map<Object,Object> searchUserInfo(Map<Object,Object> paramMap);
	
	/**
	 * 查询当前环节需求单数量
	 * @return
	 */
	public Map<Object,Object> searchCurrNodeCount(List<Map<Object, Object>> paramSet,String promoters_id);
	 
	/**
	 * 查询需求单详情 
	 * @param demandId
	 * @param isHistory
	 * @return
	 */
	//public Map<Object,Object> searchDemandInfo(String demandId,String isHistory);
	/**
	 * 查询需求单详情，处理人名根据情况而定
	 * */
	public Map<Object,Object> searchDemandInfo(String demandId,String isHistory,String isCEO);
	/**
	 * 查询专业系统单详情
	 * @param flowRecordId
	 * @param isHistory
	 * @return
	 */
	public Map<Object,Object> searchSysInfo(String flowRecordId,String isHistory);
	
	
	/**
	 * 需求单发起
	 * 1发起
	 * 2暂存
	 * 3草稿发起
	 * @return
	 */
	public Map<Object,Object> submitDemandInfo(Map<Object,Object> demandInfo,String demandType);
	
	/**
	 * 修改需求单详情实例内容
	 * @param demandId
	 * @param demandInfo
	 * @return
	 */
	public Map<Object,Object> updateDemandInst(String demandId,Map<Object,Object> demandInfo);
	
	/**
	 * 需求单列表查询
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getDemandLst(Map<Object,Object> reqMap);
	
	/**
	 * 服务单列表查询
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getServiceLst(Map<Object,Object> reqMap);
	
	/**
	 * 专业系统列表查询
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getSysLst(Map<Object,Object> reqMap);
	
	/**
	 * 需求详单查询 
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getDemandInfo(Map<Object,Object> reqMap);
	
	/**
	 * 服务单详情查询
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getServiceInfo(Map<Object,Object> reqMap);
	
	/**
	 * 获取需求单ID
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getDemandId(Map<Object,Object> reqMap);
	
	
	/**
	 * 获取基础数据
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getdic(Map<Object,Object> reqMap);
	
	/**
	 * 获取本地网
	 * @param reqMap
	 * @return
	 */
	public Map<Object,Object> getLatnData(Map<Object,Object> reqMap);
	
	/**
	 * 流程流程
	 * @param reqMap
	 * @return
	 */
	public Map<Object, Object> flowExchange(Map<Object, Object> reqMap);
	
	/**
	 * 需求单实例变更
	 * @return
	 */
	public Map<Object,Object> updateDemandInfo(Map<Object, Object> demandInfo);
	
	/**
	 * 催单变更
	 * @return
	 */
	public Map<Object,Object> urgedDemand(Map<Object, Object> demandInfo);
	
	/**
	 * 查询需求单草稿箱
	 * @return
	 */
	public Map<Object,Object> getDemandDraftLst(Map<Object, Object> demandInfo);
	
	
	/**
	 * 删除草稿箱内容
	 * @return
	 */
	public Map<Object,Object> removeDemandDraftLst(Map<Object, Object> demandInfo);
	
	/**
	 * 通用组织机构树
	 * */
	public Map<Object,Object> getSysOrg(Map<Object,Object> param); 
	
	/**
	 * 根据最底层节点获取员工信息
	 * */
	public Map<Object,Object> getStaffByOrgId(Map<Object,Object> param);
	
	
	/**
	 * 短信发送
	 * @param param
	 * @return
	 */
	public Map<Object,Object> sendSms (Map<Object,Object> param);
	
	
	/**
	 * 登录
	 * @param param
	 * @return
	 */
	public Map<Object,Object> login(Map<Object,Object> param);
	
	
	/**
	 * 查询单池管理关系
	 * @param param
	 * @return
	 */
	public Map<Object,Object> qryPoolRel(Map<Object,Object> param);
	
	
	/**
	 *  统计需求中当前记录id为空数量 
	 * @param param
	 * @return
	 */
	public Map<Object,Object> selectDraftCount(Map<Object,Object> param);
	
	/**
	 * 查询员工信息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getStaffInfo(Map<Object,Object> param);
	
	/**
	 * 修改密码
	 * @param param
	 * @return
	 */
	public Map<Object,Object> updatePwd(Map<Object,Object> param);
	
	
	/**
	 * 查询外系统流程集合[分页]
	 * @param param
	 * @return
	 */
	public Map<Object,Object> qryOutSysFlowSet(Map<Object,Object> param);
	
	/**
	 *  查询外系统流程记录详情
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getOutSysFlowRecord(Map<Object,Object> param);
	
	
	/**
	 * [校验]保存系统关系 是否存在
	 * @param param
	 * @return
	 */
	public Map<Object,Object> valiBusiFlowRel(Map<Object,Object> param);
	
	/**
	 * 保存系统关系
	 * @param param
	 * @return
	 */
	public Map<Object,Object> saveBusiFlowRel(Map<Object,Object> param);
	
	/**
	 * 服务单保存
	 * @param param
	 * @return
	 */
	public Map<Object,Object> saveServiceInfo(Map<Object,Object> param);
	

	/**
	 * 查询单池
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getPool(Map<Object,Object> param);
	
	
	/**
	 * 查询用户角色单池信息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getUserRolePool(Map<Object,Object> param);
	
	
	/**
	 * 查询短消息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> qryNews(Map<Object,Object> param);
	
	/**
	 * 改变查看状态  短消息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> updateLookNews(Map<Object,Object> param);
	
	/**
	 * 根据类型查看短消息详情  短消息
	 * 如：五星评价信息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> qryNewsInfoByType(Map<Object,Object> param);
	
	/**
	 * 批量星级评价
	 * @param param
	 * @return
	 */
	public Map<Object,Object> starEvalOnMonth(Map<Object,Object> param);
	
	
	/**
	 * 查询未读短消息数量
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getNotLookNewsCount(Map<Object,Object> param);
	
	
	/**
	 * 查询用户信息
	 * @param param
	 * @return
	 */
	public Map<Object, Object> querySysUserInfo(Map<Object, Object> param);
	
	/**
	 * 待评价的需求单查询
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryNeedEvalList(Map<Object,Object> param);
	/**
	 * 获取需求单的服务单数据
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryNeedEvalServiceList(Map<Object,Object> param);
	/**
	 *	保存评价数据
	 * @param param
	 * @return
	 */
	public Map<Object,Object> saveEvalData(Map<Object,Object> param);
	
	
	/**
	 * 获取时间配置参数
	 * @param param
	 * @return
	 */
	public Map<Object,Object> getDateConfigData(Map<Object,Object> param);
	
	/**
	 * 查询角色集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryRoleList(Map<Object,Object> param);
	/**
	 * 增加角色集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> addRoleInfo(Map<Object,Object> param);
	/**
	 * 修改角色集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> updateRoleInfo(Map<Object,Object> param);
	/**
	 * 判断角色是否使用
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryRoleUseCount(Map<Object,Object> param);

	/**
	 * 删除角色集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> deleteRoleInfo(Map<Object,Object> param);
	/*-----20150423权限集合begin------*/
	/**
	 * 查询权限集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryAuthList(Map<Object,Object> param);
	/**
	 * 增加权限集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> addAuthInfo(Map<Object,Object> param);
	/**
	 * 修改权限集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> updateAuthInfo(Map<Object,Object> param);
	/**
	 * 判断权限是否使用
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryAuthUseCount(Map<Object,Object> param);
	/**
	 * 删除权限集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> deleteAuthInfo(Map<Object,Object> param);
	/**
	 * 查询公共报表[配置信息]
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryReportPublicConfig(Map<Object,Object> param);
	
	/*-----20150423权限集合begin------*/
	/**
	 * 查询公共报表
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryReportPublic(Map<Object,Object> param);
	
	
	/**
	 * 公共处理方法
	 * @param param
	 * @return
	 */
	public Map<Object,Object> dealObjectFun(Map<Object,Object> param);
	
	public Map<Object, Object> queryStaffByData(Map<Object, Object> param);
	
 	/**
	 * 新增值班安排
	 * @param param
	 * @return
	 */
	public Map<Object,Object> addCallSchedule(Map<Object,Object> param);
	
	/**
	 * 值班安排
	 * @param param
	 * @return
	 */
	public Map<Object,Object> queryCallSchedule(Map<Object,Object> param);
	
	/**
	 * 值班更新
	 * @param param
	 * @return
	 */
	public Map<Object,Object> updateCallSchedule(Map<Object,Object> param);
	
 
	/**
	 * 查询报表控件配置
	 * @param param
	 * @return
	 */
	public Map<Object, Object> qryReportControl(Map<Object, Object> param);
	
	/**
	 * 查询报表控件配置
	 * @param param
	 * @return
	 */
	public Map<Object, Object> appValdateVersion(Map<Object, Object> param); 
	/**
	 * 新增政策
	 * @param param
	 * @return
	 */
	public Map<Object, Object> insertPolicyManual(Map<Object, Object> param); 
	
	/**
	 * 删除政策集合
	 * @param param
	 * @return
	 */
	public Map<Object,Object> deletePolicyManual(Map<Object,Object> param);
	/**
	 * 审批政策
	 * @param param
	 * @return
	 */
	public Map<Object,Object> approvalPolicyManual(Map<Object,Object> param);
	
	/**
	 * 发布政策
	 * @param param
	 * @return
	 */
	public Map<Object,Object> releasePolicyManual(Map<Object,Object> param);
	/**
	 * 更新政策
	 * @param param
	 * @return
	 */
	public Map<Object, Object> updatePolicyManual(Map<Object, Object> param);
	/**
	 * 查询PC端保存需求草稿
	 * @param param
	 * @return
	 */
	
	public Map<Object, Object> getDemandsaveLst(Map<Object, Object> reqParamMap);
	/**
	 * 查询省市领导
	 * @param param
	 * @return
	 */
	public Map<Object, Object> showStaff(Map<Object, Object> reqMap);
	/**
	 * 省市领导留言内容修改
	 * @param param
	 * @return
	 */
	public Map<Object, Object> updateflow(Map<Object, Object> reqMap);
	//查询部门以及部门状态
	public Map<Object, Object> searchDeptmentInfo(Map<Object, Object> reqParamMap);
	//查询部门指标
	public Map<Object, Object> searchIndexInfo(Map<Object, Object> reqParamMap);
	//修改部门指标评分
	public Map<Object, Object> updateAssessInfo(Map<Object, Object> reqParamMap);
	/**
	 * 发起填报好的责任书
	 * 
	 */
	public Map<Object,Object> submitTask(Map<Object,Object> param,String handleType);
	//查询部门和领导信息（逆向打分）
	public Map<Object, Object> dealDeptAndStaffInfo(Map<Object, Object> reqParamMap);
	/**
	 * 公共方法
	 * 
	 */
	public Map<Object, Object> commonMothed(Map<Object, Object> paramMap);
	/**
	 * 短流程需求查询
	 * 
	 */
	public Map<Object, Object> queryDemandList(Map<Object, Object> paramMap);	
	/**
	 * 短流程需求查询
	 * 
	 */
	public Map<Object, Object> queryDemandHistoryList(Map<Object, Object> paramMap);
	/**
	 * 查询部门领导信息
	 * @param param
	 * @return
	 */
	public Map<Object,Object> qryDeptStaffInfo(Map<Object,Object> param);
	/**
	 * 多文件上传
	 * @param param
	 * @return
	 */
	public Map<Object,Object> dealGoverAndEnter(Map<Object,Object> param);
	
	public Map<Object,Object> querySolveProcessList(Map<Object,Object> param);
}