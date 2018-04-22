package com.tydic.sale.service.crm.service;

import java.util.Map;

/**
 * 短流程需求接口
 * @author dangzw
 *
 */
public interface ShortProcessService {
	/**
	 * 短流程需求查询
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> queryDemandList(Map<String,Object> paramMap);
	
	/**
	 * 历史短流程需求查询
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String, Object> queryDemandHistoryList(Map<String, Object> paramMap) ;
	
	/**
	 * 短流程流程配置列表
	 */
	public  Map<String, Object> qryActWorkflwoInfoList(Map<String, Object> paramMap) ;
	
	/**
	 * 短流程需求详细查询
	 * @param
	 * @return 
	 */
	public Map<String, Object> queryDemandHistoryListDetail(Map<String, Object> paramMap) ;
	
	/**
	 * 短流程需求节点信息
	 * @param
	 * @return 
	 */
	public Map<String, Object> queryWorkflowNodeInfo(Map<String, Object> paramMap) ;
	
	/**
	 * 模板信息
	 * @param
	 * @return 
	 */
	public Map<String, Object> queryDemandTemplateInfo(Map<String, Object> paramMap) ;
	
	/**
	 * 新建流程
	 * @param
	 * @return 
	 */
	public Map<String, Object> addWorkflow(Map<String, Object> paramMap) ;
	
	/**
	 * 根据流程id获取数据
	 * @param 
	 * @return
	 */
	public Map<String,Object> getOneWorkflowData(Map<String, Object> paramMap);
	
	/**
	 * 查询父流程
	 * @param 
	 * @return
	 */
	public Map<String,Object> queryWorkflowPublishParentList(Map<String, Object> paramMap);
	
	/**
	 * 查询父流程
	 * @param 
	 * @return
	 */
	public Map<String,Object> queryWorkflowPublishSonList(Map<String, Object> paramMap);
	
	/**
	 * 更新流程状态为草稿
	 * @author 
	 * @param 
	 */
	public Map<String,Object> updateStatusToDraft(Map<String, Object> paramMap);
	
	/**
	 * 更新流程状态为发布
	 * @author 
	 * @param 
	 */
	public Map<String,Object> updateStatusToPublish(Map<String, Object> paramMap);
	
	/**
	 * 查询本地网
	 * @author 
	 * @param
	 */
	public Map<String,Object> querySysRegion(Map<String, Object> paramMap);

	
	/**
	 * 更新节点信息
	 * @author 
	 * @param 
	 */
	public Map<String,Object> updateNodeData(Map<String, Object> paramMap);

	/**
	 * 查询系统生成需求ID
	 * @param param
	 * @return
	 */
	public Map<String, Object> queryWorkFlowNeedId(Map<String, Object> paramMap);
	/**
	 * 新建需求
	 * @param
	 * @return 
	 */
	public Map<String, Object> addWorkflowNeed(Map<String, Object> paramMap) ;
	public Map<String, Object> addWorkflowNeedd(Map<String, Object> paramMap) ;
	public Map<String, Object> addWorkflowNeeddd(Map<String, Object> paramMap) ;
	public Map<String, Object> addWorkflowNeedddd(Map<String, Object> paramMap) ;
	public Map<String, Object> addWorkflowBack(Map<String, Object> paramMap) ;

	/**
	 * 查询要标红的节点信息
	 * @param 
	 * @return
	 */
	public Map<String, Object> queryRedNode(Map<String, Object> paramMap) ;
	/**
	 * 催单
	 * @param
	 * @return 
	 */
	public Map<String, Object> updatedemandinfo(Map<String, Object> paramMap) ;
	
	/**
	 * 更新流程状态为暂停
	 * @param
	 * @return 
	 */
	public Map<String, Object> updateWFStatusToStop(Map<String, Object> paramMap) ;
	
	/**
	 * 查询子流程数据量及流程处理所需的平均工时
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> querySonWFNumAndTimeLimit(Map<String, Object> paramMap) ;
	
	/**
	 * 更新流程数据
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> updateWorkflow(Map<String, Object> paramMap) ;
	
	/**
	 * 更新流程状态为废弃
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> updateWorkflowToDiscard(Map<String, Object> paramMap) ;
	
	/**
	 * 查询每个节点是否设置了处理时限
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryEveryNodeTimeLimit(Map<String, Object> paramMap) ;
	
	/**
	 * 查询流程实例状态
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryWorkflowExampleStatus(Map<String, Object> paramMap) ;
	
	/**
	 * 查询节点类型
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryNodeType(Map<String, Object> paramMap) ;
	
	
	/**
	 * 查询流程分类和类型
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryWorkflwoSortAndType(Map<String, Object> paramMap) ;
	
	/**
	 * 查询子流程权限维护
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryWisUpdate(Map<String, Object> paramMap) ;
	
	/**
	 * 查询子流程权限维护
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryIsOrNotPublish(Map<String, Object> paramMap) ;
	
	/**
	 * 查询需求模板属性
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryDemandTemplateAttr(Map<String, Object> paramMap) ;
	
	/**
	 * 查询需求是否处理完结
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryDemandFinsh(Map<String, Object> paramMap) ;
	
	/**
	 * 环节超时提醒
	 * @param
	 * @reutrn
	 */
	public void demandOverTimeRemind(Map<String, Object> param) ;

	
	/**
	 * 查询支局名称
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> querySubofficeName(Map<String, Object> paramMap) ;
	
	/**
	 *查询物料
	 *@param
	 *@return
	 */
	public Map<String, Object> qryMaterialList(Map<String, Object> param) ;


	/**
	 * 更新末梢库存需求状态
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> updateDistalDemandStatus(Map<String, Object> paramMap) ;
	
	/**
	 * 末梢库存需求添加 
	 * @param param
	 * @return
	 */
	public Map<String,Object> addDistalRepetority(Map<String, Object> paramMap);
	
	/**
	 * 查询物料通过需求id
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryMaterialListByDemandId(Map<String, Object> paramMap) ;
	
	/**
	 * 查询节点是否会签
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> queryNodeIsSingature(Map<String, Object> paramMap) ;
	
	/**
	 * 会签节点设置
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> updateIssingatureSet(Map<String, Object> paramMap) ;

	
	/**
	 * 会签新建
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> addWorkflowSign(Map<String, Object> paramMap) ;

	
	/**
	 * 会签待处理列表
	 * @param
	 * @return
	 */
	public Map<String, Object> queryNoSingatureDemandList(Map<String, Object> param) ;

	/**
	 * 会签需求处理
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> singatureDeal(Map<String, Object> paramMap) ;
	
	/**
	 * 查询文件路径
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> qryDownloadPath(Map<String, Object> inputParam);
	/**
	 * 文件上传  author:wangshimei
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> goverInsertAttach(Map<String, Object> inputParam);
	/**
	 * 附件信息 author：wangshimei
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> getGoverAttachInfo(Map<String, Object> inputParam);
	/**
	 * 随机生成attachmentId
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> getAttachmentId(Map<String, Object> inputParam);
	/**
	 * 文件删除
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> dealFileNameInfo(Map<String, Object> inputParam);
	/**
	 * 查询流程规则
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> queryFlowRuleInfo(Map<String, Object> inputParam);
	/**
	 * 短流程评价信息
	 * @param inputParam
	 * @return
	 */
	public Map<String, Object> addEvalInfo(Map<String, Object> inputParam);
	/**
	 * 短流程授权新增
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> addAuthorInfo(Map<String, Object> paramMap) ;
	/**
	 * 短流程授权查询
	 * @param
	 * @reutrn
	 */
	public Map<String, Object> qrySubmitAuthorInfo(Map<String, Object> paramMap) ;

	public Map<String, Object> querySolveProcessList(Map<String, Object> inputParam);
	/**
	 * 修改发起信息
	 */
	public Map<String, Object> updateWorkflowNeed(Map<String, Object> inputParam);
	/**
	 * 删除文件
	 */
	public Map<String, Object> deleteFileInfos(Map<String, Object> inputParam);
	/**
	 * 查询文件序列
	 */
	public Map<String, Object> qry_FileInfoId(Map<String, Object> inputParam);
	/**
	 * 新增打印流水信息
	 */
	public Map<String, Object> addPrintDemandInfo(Map<String, Object> paramMap) ;
    /**
     * 处理流程时的作废操作
     * @param inputParam
     * @return
     */
	public Map<String, Object> cancleWorkflowNoed(Map<String, Object> inputParam);

	public Map<String, Object> qryLstTaskLogDetailList(Map<String, Object> inputParam);

	public Map<String, Object> queryCurrentStaffLant(Map<String, Object> inputParam);

	public Map<String, Object> saveDocuPaperApply(Map<String, Object> inputParam);

	public Map<String, Object> duePaperApply(Map<String, Object> inputParam);

	public Map<String, Object> queryDocApplyTask(Map<String, Object> inputParam);

	public Map<String, Object> toPrevPaperApply(Map<String, Object> inputParam);

	public Map<String, Object> queryApplyDetail(Map<String, Object> inputParam);
}
