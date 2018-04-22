package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface CpcService {

	/**
	 * 新增工号信息
	 * 
	 * @param param
	 * @return
	 */
	public String addStaffInfo(String param);

	/**
	 * 查询staffID最大值
	 * 
	 * @param param
	 * @return
	 */
	public String qryMaxStaffId(String param);

	/**
	 * 校验loginCode唯一性
	 * 
	 * @param param
	 * @return
	 */
	public String checkLoginCode(String param);

	/**
	 * 修改工号状态
	 * 
	 * @param param
	 * @return
	 */
	public String updateStaffState(String param);

	/**
	 * 查询组织机构
	 * 
	 * @param param
	 * @return
	 */
	public String queryOrganisationList(String param);

	/**
	 * 保存附件信息
	 * 
	 * @param param
	 * @return
	 */
	public String insertAttachInfo(String param);

	/**
	 * 获取附件信息
	 * 
	 * @param param
	 * @return
	 */
	public String getAttachInfo(String param);

	/**
	 * 删除附件信息
	 * 
	 * @param param
	 * @return
	 */
	public String deleteFile(String param);

	/**
	 * 组织机构修改权限
	 * 
	 * @param param
	 * @return
	 */
	public String saveOrgAuthInfo(String param);

	/**
	 * 查询组织机构角色权限
	 * 
	 * @param param
	 * @return
	 */
	public String qryOrgAuthInfo(String param);

	/**
	 * 新增组织机构
	 * 
	 * @param param
	 * @return
	 */
	public String addOrgInfo(String param);

	/**
	 * 查询用户基本信息
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchUserInfo(String param) throws Exception;

	/**
	 * 保存月度综合评价(综支中心)
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String saveEvalMonZZ(String param) throws Exception;

	/**
	 * 保存月度综合评价（专业部门）
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String saveEvalDept(String param) throws Exception;

	/**
	 * 查询专业部门的基本信息
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchDeptInfo(String param) throws Exception;

	/**
	 * 查询需求单草稿箱集合
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String demandDraftSet(String param) throws Exception;

	/**
	 * 查询需求单详情
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchDemandInfo(String param) throws Exception;

	/**
	 * 查询服务单详情
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchServiceInfo(String param) throws Exception;

	/**
	 * 查询专业系统详情
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchSysInfo(String param) throws Exception;

	/**
	 * 保存需求单
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String saveDemandInfo(String param) throws Exception;

	/**
	 * 查询需求单ID
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String getDemandId(String param) throws Exception;

	/**
	 * 流程流转
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String flowExchange(String param) throws Exception;

	/**
	 * 查询需求单列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String getDemandList(String param) throws Exception;

	/**
	 * 查询服务单列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String getServiceList(String param) throws Exception;

	/**
	 * 查询专业系统列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String getSysList(String param) throws Exception;

	/**
	 * 按环节统计每个功能总量
	 * */
	public String getRecordSumList(String param);

	/**
	 * 
	 * 催单
	 * **/
	public String urgedDemand(String param);

	/**
	 * 根据流程节点查流程下的所有节点
	 * 
	 * **/
	public String getAllFlowNode(String param);

	/**
	 * 过程处理属性保存
	 * 
	 * */
	public String saveRecordProc(String param);

	/**
	 * 需求单实例变更
	 * 
	 * */
	public String updateDemand(String param);

	/**
	 * 获取基础数据
	 * 
	 * @param param
	 * @return
	 */
	public String dic(String param);

	/**
	 * 获取基础数据
	 * 
	 * @param param
	 * @return
	 */
	public String getLatnData(String param);

	/**
	 * 批量删除草稿箱
	 * 
	 * @param param
	 * @return
	 */
	public String removeDemandDraftLst(String param);

	/**
	 * 登陆
	 * 
	 * @param param
	 * @return
	 */
	public String login(String param);

	/**
	 * 查询员工信息
	 * 
	 * @param param
	 * @return
	 */
	public String getStaffInfo(String param);

	/**
	 * 通用组织机构树
	 * */
	public String getSysOrg(String param);

	/**
	 * 根据最底层节点获取员工信息
	 * */
	public String getStaffByOrgId(String param);

	/**
	 * 查询单池管理人员关系
	 * 
	 * @param param
	 * @return
	 */
	public String qryPoolOpts(String param);

	/**
	 * 统计需求中当前记录id为空数量
	 * 
	 * @param param
	 * @return
	 */
	public String selectDraftCount(String param);

	/**
	 * 发送流程环节
	 * 
	 * @param param
	 * @return
	 */
	public String sendFlowNode(String param);

	/**
	 * 密码修改
	 * 
	 * @param param
	 * @return
	 */
	public String updatePwd(String param);

	/**
	 * 查询外系统流程列表[分页]
	 * 
	 * @param param
	 * @return
	 */
	public String qryOutSysFlowSet(String param);

	/**
	 * 查询外系统流程记录详情
	 * 
	 * @param param
	 * @return
	 */
	public String getOutSysFlowRecord(String param);

	/**
	 * [校验]业务流程单保存关系 是否存在
	 * 
	 * @param param
	 * @return
	 */
	public String valiBusiFlowRel(String param);

	/**
	 * 保存系统关系
	 * 
	 * @param param
	 * @return
	 */
	public String saveBusiFlowRel(String param);

	/**
	 * 保存服务单信息
	 * 
	 * @param param
	 * @return
	 */
	public String saveServiceInfo(String param);

	/**
	 * 查询单池
	 * 
	 * @param param
	 * @return
	 */
	public String getPool(String param);

	/**
	 * 查询短消息
	 * 
	 * @param param
	 * @return
	 */
	public String qryNews(String param);

	/**
	 * 变更短消息查看状态
	 * 
	 * @param param
	 * @return
	 */
	public String updateLookNews(String param);

	/**
	 * 查看短消息详情【根据类型】
	 * 
	 * @param param
	 * @return
	 */
	public String qryNewsInfoByType(String param);

	/**
	 * 月度星级评价
	 * 
	 * @param param
	 * @return
	 */
	public String starEvalOnMonth(String param);

	/**
	 * 查询未读短消息数量
	 * 
	 * @param param
	 * @return
	 */
	public String getNotLookNewsCount(String param);

	/**
	 * 查询用户拥有的功能
	 * 
	 * @param param
	 * @return
	 */
	public String getFun(String param);

	/**
	 * 查询用户拥有的角色和单池信息
	 * 
	 * @param param
	 * @return
	 */
	public String getUserRolePoolInfo(String param);

	/**
	 * 查询用户信息
	 * 
	 * @param param
	 * @return
	 */
	public String querySysUserInfo(String param);

	/**
	 * 待评价的需求单查询
	 * 
	 * @param param
	 * @return
	 */
	public String queryNeedEvalList(String param);

	/**
	 * 待评价的需求单查询
	 * 
	 * @param param
	 * @return
	 */
	public String queryNeedEvalServiceList(String param);

	/**
	 * 待评价的需求单查询
	 * 
	 * @param param
	 * @return
	 */
	public String saveEvalData(String param);

	/**
	 * 获取时间配置参数
	 * 
	 * @param param
	 * @return
	 */
	public String getDateConfigData(String param);

	/**
	 * 根据数据配置角色查询员工
	 * 
	 * @param param
	 * @return
	 */
	public String queryStaffByData(String param);

	/**
	 * 动态查询报表
	 * 
	 * @param param
	 * @return
	 */
	public String queryReportPublic(String param);

	/**
	 * 获取角色集合
	 * 
	 * @param param
	 * @return
	 */
	public String queryRoleList(String param);

	/**
	 * 增加角色集合
	 * 
	 * @param param
	 * @return
	 */
	public String addRoleInfo(String param);

	/**
	 * 修改角色集合
	 * 
	 * @param param
	 * @return
	 */
	public String updateRoleInfo(String param);

	/**
	 * 判断角色是否使用
	 * 
	 * @param param
	 * @return
	 */
	public String queryRoleUseCount(String param);

	/**
	 * 删除角色集合
	 * 
	 * @param param
	 * @return
	 */
	public String deleteRoleInfo(String param);

	/*-------20150423权限集合begin------*/
	/**
	 * 获取权限集合
	 * 
	 * @param param
	 * @return
	 */
	public String queryAuthList(String param);

	/**
	 * 增加权限集合
	 * 
	 * @param param
	 * @return
	 */
	public String addAuthInfo(String param);

	/**
	 * 修改权限集合
	 * 
	 * @param param
	 * @return
	 */
	public String updateAuthInfo(String param);

	/**
	 * 删除权限集合
	 * 
	 * @param param
	 * @return
	 */
	public String deleteAuthInfo(String param);

	/**
	 * 
	 * @param param
	 * @return
	 */
	public String queryAuthUseCount(String param);

	public String queryAssignAuthInfo(String param);

	/**
	 * 保存角色权限数据
	 * 
	 * @param param
	 * @return
	 */
	public String saveAssignAuthInfo(String param);

	/*-------20150423权限集合end------*/
	/**
	 * 获取角色权限数据
	 * 
	 * @param param
	 * @return
	 */
	public String queryRoleAuthInfo(String param);

	/**
	 * 保存角色权限数据
	 * 
	 * @param param
	 * @return
	 */
	public String saveRoleAuthInfo(String param);

	/**
	 * 获取角色用户数据
	 * 
	 * @param param
	 * @return
	 */
	public String queryRoleUserInfo(String param);

	/**
	 * 保存角色用户数据
	 * 
	 * @param param
	 * @return
	 */
	public String saveRoleUserInfo(String param);

	/**
	 * 查询公共报表配置
	 * 
	 * @param param
	 * @return
	 */
	public String queryReportPublicConfig(String param);

	/**
	 * 查询小ceo部门信息
	 * 
	 * @param param
	 * @return
	 */
	public String getCeoSysOrg(String param);

	/**
	 * 查询专业部门信息
	 * 
	 * @param param
	 * @return
	 */
	public String getDeptSysOrg(String param);

	/**
	 * 修改登录标记
	 * 
	 * @param param
	 * @return
	 */
	public String updateLoginState(String param);

	/**
	 * 记录用户操作日志
	 * 
	 * @param param
	 * @return
	 */
	public String saveOptRecordInfo(String param);

	/**
	 * 检查用户是否登录
	 * 
	 * @param param
	 * @return
	 */
	public String checkIsLogin(String param);

	/**
	 * 值班安排
	 * 
	 * @param param
	 * @return
	 */
	public String addCallSchedule(String param);

	/**
	 * 值班安排
	 * 
	 * @param param
	 * @return
	 */
	public String queryCallSchedule(String param);

	/**
	 * 值班更新
	 * 
	 * @param param
	 * @return
	 */
	public String updateCallSchedule(String param);

	/**
	 * 查询报表控件
	 * 
	 * @param param
	 * @return
	 */
	public String qryReportControl(String param);

	/**
	 * 查询政策手册类型数据
	 * 
	 * @param param
	 * @return
	 */
	public String searchPolicyManualTypeList(String param);

	/**
	 * 获取政策手册类型详细列表
	 * 
	 * @param reqMap
	 * @return
	 */
	public String searchPolicyManualTypeDetailList(String param);

	/**
	 * 获取政策手册列表
	 * 
	 * @param reqMap
	 * @return
	 */
	public String searchPolicyManualInfoList(String param);

	/**
	 * 查询政策手册列表
	 * 
	 * @param param
	 * @return
	 */
	public String queryPolicyManualList(String param);

	/**
	 * 刪除政策手册列表
	 * 
	 * @param param
	 * @return
	 */
	public String deletePolicyManual(String param);

	/**
	 * 发布政策手册列表
	 * 
	 * @param param
	 * @return
	 */
	public String releasePolicyManual(String param);

	/**
	 * 审批政策
	 * 
	 * @param param
	 * @return
	 */
	public String approvalPolicyManual(String param);

	/**
	 * APP-版本更新验证
	 * 
	 * @param param
	 * @return
	 */
	public String appValdateVersion(String param);

	/**
	 * 新增政策手册
	 * 
	 * @param param
	 * @return
	 */
	public String insertPolicyManual(String param);

	/**
	 * 修改政策手册
	 * 
	 * @param param
	 * @return
	 */
	public String updatePolicyManual(String param);

	/**
	 * 修改政策手册状态
	 * 
	 * @param param
	 * @return
	 */
	public String updatePolicyManualInfoState(String param);

	/**
	 * 获取区域数据
	 * 
	 * @param param
	 * @return
	 */
	public String queryAreaData(String param);

	/**
	 * 获取PC端需求草稿
	 * 
	 * @param param
	 * @return
	 */
	public String getDemandsaveLst(String param);

	/**
	 * 获取领导信息
	 * 
	 * @param param
	 * @return
	 */
	public String showStaff(String param);

	/**
	 * 领导留言
	 * 
	 * @param param
	 * @return
	 */
	public String updateflow(String param);

	/**
	 * 根据部门id获取所属员工的loginCode
	 * 
	 * @param param
	 * @return
	 */
	public String getLoginCodeList(String param);

	String qryPoolInfo(String param);

	public String qryServiceInfo(String param);

	public String updateServiceInfo(String param);

	String qryStaffInfo(String param);

	String updatePoolInfo(String param);

	/**
	 * 查询部门以及部门的状态
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String searchDeptmentInfo(String param) throws Exception;

	/**
	 * 查询部门所对应的指标
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String searchIndexInfo(String param) throws Exception;

	/**
	 * 评价部门的各个指标
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String updateAssessInfo(String param) throws Exception;

	/**
	 * 查询责任书列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String qryTaskBookList(String param) throws Exception;

	/**
	 * 责任书审批发起
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String submitTaskBook(String param) throws Exception;

	/**
	 * 责任书详情
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String searchTaskInfo(String param) throws Exception;

	/**
	 * 责任书流程流转
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	String flowTaskBook(String param) throws Exception;

	/**
	 * 查询部门以及领导信息
	 * 
	 * @param param
	 * @return
	 */
	public String qryDeptAndStaffInfo(String param);

	/**
	 * 查询责任书规范书信息
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String searchTaskBookInfo(String param) throws Exception;

	/**
	 * 保存规范书信息
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String insertTaskBookInfo(String param) throws Exception;

	/**
	 * 查询组织机构树
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String queryStaffTree(String param) throws Exception;

	/**
	 * 查询责任书定制时的列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String qryTaskModelList(String param) throws Exception;

	/**
	 * 查询责任书定制时的列表
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String releaseTaskBook(String param) throws Exception;

	/**
	 * 查询责任书上传的文件
	 * 
	 * @param param
	 * @return
	 * @throws Exception
	 */
	public String qryAttachInfo(String param) throws Exception;

	/**
	 * 短流程需查询
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandList(String param) throws Exception;
	
	/**
	 * 流程配置列表
	 * 
	 * @param param
	 * @return
	 */
	public String queryActWorkflwoInfoList(String param) throws Exception;

	/**
	 * 历史短流程需查询
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandHistoryList(String param) throws Exception;

	/**
	 * 历史短流程需求详细查询
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandHistoryListDetail(String param) throws Exception;

	/**
	 * 短流程需求节点信息
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkflowNodeInfo(String param) throws Exception;

	/**
	 * 新建流程
	 * 
	 * @param param
	 * @return
	 */
	public String addWorkflow(String param) throws Exception;

	/**
	 * 根据流程di获取数据
	 * 
	 * @param param
	 * @return
	 */
	public String getOneWorkflowData(String param) throws Exception;

	/**
	 * 模板信息
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandTemplateInfo(String param) throws Exception;

	/**
	 * 查询父流程
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkflowPublishParentList(String param) throws Exception;

	/**
	 * 查询父流程
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkflowPublishSonList(String param) throws Exception;

	/**
	 * 更新流程状态为草稿
	 * 
	 * @param param
	 * @return
	 */
	public String updateStatusToDraft(String param) throws Exception;

	/**
	 * 更新流程状态为发布
	 * 
	 * @param param
	 * @return
	 */
	public String updateStatusToPublish(String param) throws Exception;

	/**
	 * 查询本地网
	 * 
	 * @param
	 * @return
	 */
	public String querySysRegion(String param) throws Exception;

	/**
	 * /** 查询系统生成需求ID
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkFlowNeedId(String param) throws Exception;

	/**
	 * 新建流程
	 * 
	 * @param param
	 * @return
	 */
	public String addWorkflowNeed(String param) throws Exception;

	public String addWorkflowNeedd(String param) throws Exception;

	public String addWorkflowNeeddd(String param) throws Exception;

	public String addWorkflowNeedddd(String param) throws Exception;

	public String addWorkflowBack(String param) throws Exception;
	
	public String cancleWorkflowNoed(String param) throws Exception;

	/**
	 * 催单
	 * 
	 * @param param
	 * @return
	 */
	public String updatedemandinfo(String param) throws Exception;

	public String queryRedNode(String param) throws Exception;

	public String updateNodeData(String param) throws Exception;

	/**
	 * 更新流程状态到暂停
	 * 
	 * @param param
	 * @return
	 */
	public String updateWFStatusToStop(String param) throws Exception;

	/**
	 * 查询子流程数据量及流程处理所需的平均工时
	 * 
	 * @param param
	 * @return
	 */
	public String querySonWFNumAndTimeLimit(String param) throws Exception;

	/**
	 * 更新流程 数据
	 * 
	 * @param param
	 * @return
	 */
	public String updateWorkflow(String param) throws Exception;

	/**
	 * 更新流程状态为废弃
	 * 
	 * @param param
	 * @return
	 */
	public String updateWorkflowToDiscard(String param) throws Exception;

	/**
	 * 查询每个节点是否设置了处理时限
	 * 
	 * @param param
	 * @return
	 */
	public String queryEveryNodeTimeLimit(String param) throws Exception;

	/**
	 * 查询流程实例状态
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkflowExampleStatus(String param) throws Exception;

	/**
	 * 查询节点类型
	 * 
	 * @param param
	 * @return
	 */
	public String queryNodeType(String param) throws Exception;

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	public String queryWorkflwoSortAndType(String param) throws Exception;

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	public String queryWisUpdate(String param) throws Exception;

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	public String queryIsOrNotPublish(String param) throws Exception;

	/**
	 * 查询模板属性
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandTemplateAttr(String param) throws Exception;

	/**
	 * 查询需求是否处理完结
	 * 
	 * @param param
	 * @return
	 */
	public String queryDemandFinsh(String param) throws Exception;

	/**
	 * 查询节点是否会签
	 * 
	 * @param param
	 * @return
	 */
	public String queryNodeIsSingature(String param) throws Exception;

	/**
	 * 会签节点设置
	 * 
	 * @param param
	 * @return
	 */
	public String updateIssingatureSet(String param) throws Exception;

	/**
	 * 会签新建
	 * 
	 * @param param
	 * @return
	 */
	public String addWorkflowSign(String param) throws Exception;

	/**
	 * 会签代办
	 * 
	 * @param param
	 * @return
	 */
	public String queryNoSingatureDemandList(String param) throws Exception;

	/**
	 * 会签需求处理
	 * 
	 * @param param
	 * @return
	 */
	public String singatureDeal(String param);
	

	/**
	 * 公共方法查询
	 * @param param
	 * @return
	 */
	public String qryCommonMethod(String param) throws Exception;
	/**
	 * 公共方法删除
	 * @param param
	 * @return
	 */
	public String delCommonMethod(String param) throws Exception;
	/**
	 * 公共方法更新
	 * @param param
	 * @return
	 */
	public String updCommonMethod(String param) throws Exception;
	/**
	 * 公共方法新增
	 * @param param
	 * @return
	 */
	public String addCommonMethod(String param) throws Exception;
	/**
	 * 公共方法查询列表
	 * @param param
	 * @return
	 */
	public String qryLstCommonMethod(String param) throws Exception;
	/**
	 * 查询文件路径
	 */
	public String qryDownloadPath(String param) throws Exception;
	/**
	 * 文件上传  author：wangshimei
	 * @param param
	 * @return
	 */
	public String goverInsertAttach(String param) throws Exception;
	/**
	 * 附件信息  author：wangshimei
	 */
	public String getGoverAttachInfo(String param) throws Exception;
	/**
	 * 随机生成attachmentId
	 */
	public String getAttachmentId(String param) throws Exception;
	/**
	 * 文件删除
	 */
	public String dealFileNameInfo(String param) throws Exception;
	/**
	 * 查询流程规则
	 */
	public String queryFlowRuleInfo(String param) throws Exception;
	/**
	 * 短流程评价信息
	 */
	public String addEvalInfo(String param) throws Exception;
	/**
	 * 短流程授权新增
	 */
	public String addAuthorInfo(String param) throws Exception;
	/**
	 * 短流程授权查询
	 */
	public String qrySubmitAuthorInfo(String param) throws Exception;
	/**
	 * 流程环节的查询
	 */
	public String qryHistoryRecord(String param) throws Exception;
	/**
	 * 部门领导信息的查询
	 */
	public String qryDeptStaffInfo(String param) throws Exception;
	
	public String querySolveProcessList(String param) throws Exception;
	/**
	 * 修改发起信息
	 */
	public String updateWorkflowNeed(String param) throws Exception;
	/**
	 * 删除文件
	 */
	public String deleteFileInfos(String param) throws Exception;
	/**
	 * 查询文件序列
	 */
	public String qry_FileInfoId(String param) throws Exception;
	/**
	 * 查询bbs评论的需求类型
	 */
	public String queryDemandShortType(String param) throws Exception;
	/**
	 * 新增bbs评论
	 */
	public String addBBsCommentInfo(String param) throws Exception;
	/**
	 * 查询bbs评论列表
	 */
	public String queryCommentList(String param) throws Exception;
	/**
	 * 查询bbs跟帖列表
	 */
	public String qryCommentInfoList(String param) throws Exception;
	/**
	 * 保存bbs跟帖信息
	 */
	public String saveEvalComment(String param) throws Exception;
	/**
	 * 保存上传的多图片
	 */
	public String uploadDemandImages(String param) throws Exception;
	/**
	 * 咸阳逆评信息的查询
	 */
	public String queryReverseEvalInfo(String param) throws Exception;
	/**
	 * 查询PUSH消息推送
	 */
	public String qryPushInfo(String param) throws Exception;
	/**
	 * 新增PUSH推送消息
	 */
	public String addPushInfo(String param) throws Exception;
	/**
	 * 完结流程pdf打印流水记录
	 */
	public String addPrintDemandInfo(String param) throws Exception;
	/**
	 * 领导行程安排保存草稿
	 */
	public String sendSaveLeadStrokeInfo(String param) throws Exception;
	/**
	 * 领导行程安排从草稿箱发布
	 */
	public String submitLeadStrokeInfo(String param) throws Exception;
	/**
	 * 手机端流程流转明细查询
	 * @param param
	 * @return
	 * @throws Exception
	 */
    public String qryLstTaskLogDetailList(String param) throws Exception;
    
    /**
     * 当前登录者本地网信息查询
     * @param param
     * @return
     * @throws Exception
     */
    public String queryCurrentStaffLant(String param) throws Exception;
    

	/**
	 * 查询
	 */
	public String queryLeaveFlowId(String param)  throws Exception;
	
	/**
	 * 查询
	 */
	public String queryLeaveType(String param)  throws Exception;
	

    public String saveDamand(String param) throws Exception;
    
    
    public String querySavelList(String param) throws Exception;
    
    public String qryLeaveDemandInfo(String param) throws Exception;
    
    public String handComment(String param) throws Exception;

    public String queryListOld(String param) throws Exception;
    
    public String cancleDamand(String param) throws Exception;
    public String qryDateCount(String param) throws Exception;
    
    public String saveDocuPaperApply(String param)throws Exception;
    
    public String duePaperApply(String param)throws Exception;
    public String queryDocApplyTask(String param)throws Exception;
    public String toPrevPaperApply(String param)throws Exception;
    public String queryApplyDetail(String param)throws Exception;
    
    
    public String addMeetInfo(String param)throws Exception;
    public String qryMeetInfo(String param)throws Exception;
    public String updMeetInfo(String param)throws Exception;
    public String checkHoliyday(String param)throws Exception;
    
    /**
	 * 得到代办数
	 */
	public String getOrderCount(String param) throws Exception;;
    
}
