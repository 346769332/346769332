var CTX="/CpcWeb";

var URL_IMG = "http://222.83.4.69:9001/upLoadImg/"; //图片路径
var URL_LOGIN_CHECKRAND =  "/sale/checkRand.do";	//	验证码校验
var URL_LOGIN	= "/sale/authLogin.do";
var URL_QRY_STAFFORG     =  "/sale/qryStaffOrg.do";
var URL_TGTVALIDATE     =  "/tgtValidate.do";


/************************基础数据查询*****************************/
var URL_QUERY_DIC_DATA	="/cpc/queryDicData.do"; //查询dic字典表数据
var URL_QUERY_LATN_DATA	="/cpc/queryLatnData.do"; //查询本地网数据




var URL_LOGOUT              =  "/sale/logout.do";
var URL_SYSUSERINFO_QUERY 	=  "/sale/sysUserInfoQuery.do";      // 查询员工登录信息
var URL_REGION_STAFF = "/order/QueryRegionStaff.do"; //组织结构

var URL_READ_JURISDICTION ="/order/readJurisdiction.do";//读取权限

/************************基础数据查询*****************************/

/******************************需求单bengin******************************************/
var URL_QUERY_ORDER    = "/order/QueryOderLst.do";//需求单列表查询
var URL_QUERY_DEMAND_INFO = "/order/QueryDemandInfo.do"; //需求单详情
var URL_SAVE_DEMAND_INFO = "/order/saveDemand.do";//需求代发
var URL_CLAIM_DEMAND =  "/order/claimDemand.do";//认领
var URL_FLOW_RECORD = "/order/FlowRecord.do"; //流程流转
var URL_QUERY_DEMAND_IMG = "/order/QueryDemandImg.do";//查询需求单图片
var URL_QUERY_POOL_LIST	= "/sysManage/queryPoolList.do";//接单池值班管理
var URL_QUERY_SERVICE_LIST="/sysManage/queryServiceList.do";
var SHOW_DEMAND_DRAFT_LIST_LST ="/order/searchDemandDraftList.do";
/******************************需求单end********************************************/


/******************************服务单bengin******************************************/
var URL_SAVE_SERVICE_INFO ="/order/saveService.do";//服务单保存
var URL_QUERY_SERVICE_ORDER = "/order/QueryServiceOderLst.do";//服务单列表查询
var URL_QUERY_SERVICE_INFO ="/order/QueryServiceInfo.do";//服务单详情查询
var URL_SERICE_FLOW = "/order/serviceFlow.do";//服务单流转
var SHOW_LINGDAO = "/order/showlingdao.do";//查询上一级领导工号信息内容
var UPDATE_FLOW_RECORD ="/order/updateflowrecord.do";//查询上一级领导工号信息内容
var URL_EVAL_DEMAND = "/order/flowChangeCeo.do"; //我要帮助工单评价和打回

/******************************服务单end********************************************/

/*****************************专业系统bengin****************************************/
var URL_QUERY_SYS_ORDER = "/order/QuerySysOderLst.do";//专业系统列表查询
var URL_QUERY_SYS_INFO = "/order/QuerySysInfo.do";//专业系统单详情查询
/*****************************专业系统end*******************************************/


/******************************综合bengin******************************************/
var URL_COMPREHENSIVE_QUERY	= "/order/ComprehensiveQry.do";//综合查询
var URL_PWD_UPDATE = "/comprehensive/pwdUpdate.do"; //密码修改
var URL_FORGET_PASSWORD = "/comprehensive/forgetPassWord.do";//忘记密码
var URL_LOGIN_RANDOM = "/comprehensive/loginMsg.do";//登录短信随机码
var URL_SAVE_OPT_INFO = "/comprehensive/saveOptInfo.do";//保存操作记录
/*****************************综合end*********************************************/

/********************************评价bengin******************************************/
var URL_QUERY_NEED_EVAL_LIST	= "/order/queryNeedEvalList.do";//查询待评价数据
var URL_QUERY_NEED_EVAL_SERVICE_INFO	= "/order/queryNeedEvalServiceList.do";//查询服务单数据
var URL_SAVE_EVAL_DATA = "/order/saveEvalData.do"; //保存评价数据
/********************************评价end******************************************/

/**公共区 begin ================================================================================= */
var URL_VERIFYCODE 		= CTX + "/images/VerifyCode.do"		;	//	验证码
var URL_PRIVILEGE 		= "/index/privilegeQuery.do"	;	//	菜单权限查询
var URL_SUB_PRIVILEGE 	= "/sale/subPrivilegeQuery.do";	//	子菜单权限查询
var URL_COMMONQUERY 	= "/sale/commonQuery.do"		;	//	下拉框查询
var URL_SELECTINGERORG 	= "/sale/selectIngerOrg.do";      // 选择组织机构

/**公共区 end =================================================================================== */


/********************************系统管理bengin******************************************/
var URL_QUERY_ROLE_LIST	= "/sysManage/queryRoleList.do";//查询角色集合
var URL_DEAL_ROLE_INFO	= "/sysManage/dealRoleInfo.do";//新增和修改角色
var URL_DELETE_ROLE_INFO	= "/sysManage/deleteRoleInfo.do";//新增和修改角色
var URL_QUERY_AUTH_LIST	= "/sysManage/queryAuthList.do";//查询权限集合
var URL_DEAL_AUTH_INFO = "/sysManage/dealAuthInfo.do";//新增和修改权限
var URL_DELETE_AUTH_INFO ="/sysManage/deleteAuthInfo.do";//删除权限
var URL_DEAL_ROLE_AUTH_INFO	= "/sysManage/dealRoleAuthInfo.do";//角色授权
var URL_DEAL_ROLE_USER_INFO	= "/sysManage/dealRoleUserInfo.do";//角色授权
var URL_SYSMANAGE_DOWNLOAD	= "/sysManage/sysManageDownload.do";//角色授权
var URL_DEAL_ASSIGN_AUTH_INFO	= "/sysManage/dealAssignAuthInfo.do";//新增和修改角色
var URL_QUERY_CALL_SCHEDULE      = "/sysManage/callSchedule.do" ; // 值班安排
var URL_QUERY_ORG_LIST	= "/sysManage/queryOrganisationList.do";//组织机构
var URL_DEAL_ORG_AUTH_INFO	= "/sysManage/dealOrgAuthInfo.do";//组织机构
var URL_QUERY_STAFF_LIST	= "/sysManage/queryStaffList.do";//工号管理

/********************************系统管理end******************************************/


/********************************系统报表bengin******************************************/
var URL_SEARCH_REPORT_CONFIG ="/order/searchReportPublicConfig.do";//报表配置文件
var URL_SEARCH_REPORT ="/order/searchReportPublic.do";//公共报表
var URL_DOWN_FILE=CTX +"/order/helpFile.do";//文档下载
var URL_DOWN_IOS =CTX +"/downLoad/2016-6-19 v1.0.2.8.ipa";//公共报表
var URL_UPLOAD_FILE="/order/upLoad.do";//文档上传
var URL_QRY_ATTACH_INFO="/order/qryAttachInfo.do";//附件信息
var URL_DELETE_FILE="/order/deleteFile.do";//删除附件
/********************************系统报表bengin******************************************/


/********************************政策手册bengin******************************************/
var URL_QUERY_POLICYMANUAL_LIST ="/policyManual/queryPolicyManual.do";//政策手册信息
var URL_DELETE_POLICYMANUAL_LIST ="/policyManual/deletePolicyManual.do";//删除政策手册
var URL_ADD_POLICYMANUAL  ="/policyManual/addPolicyManual.do";//新增政策手册信息
var URL_APPROVAL_POLICYMANUAL ="/policyManual/approvalPolicyManual.do";//发布政策手册
var URL_QUERY_AREA="/policyManual/queryArea.do";//获取区域
/********************************政策手册bengin******************************************/
/********************************责任书*****************************/
var URL_QUERY_TASKBOOK_LIST="/taskBook/queryTaskBook.do";//责任书列表显示
var URL_SEND_TASK_BOOK="/taskBook/sendTaskBook.do";//责任书发起
var SEARCH_TASK_BOOK_INFO="/taskBook/searchTaskInfo.do";//查询责任书详情
var URL_TASK_FLOW_RECORD="/taskBook/flowTaskBook.do";//责任书流程流转
var URL_QUERY_GRID_TREE="/taskBook/queryTreeId.do";//查询登录者的组织机构
var URL_CREATE_NORM_BOOK="/taskBook/createNormBook.do"; //生成责任书规范书
var URL_CREATE_NORM_WORD="/taskBook/createNormBookWord.do"; //生成责任书规范书
var URL_EDIT_NORMBOOK_INFO="/taskBook/editNormBookInfo.do"; //保存修改后的规格书信息
var URL_QRY_MODEL_LIST="/taskBook/qryModelList.do";//查询要发布的责任书模板

/** **********************短流程begin**************************** */
/**
 * 查询短流程需求的URL
 */
var URL_QUERY_SHORTPROCESS = "/shortProcess/queryDemandList.do";
var URL_QUERY_WORKFLOWlIST = "/shortProcess/queryWorkFlowList.do";
var URL_QUERY_GOVER_ENTER = "/shortProcess/queryGoverEnterList.do";
var URL_GOVER_UPLOAD_FILE= "/shortProcess/goverupLoad.do";//文档上传
var URL_GOVER_ATTACH_INFO="/shortProcess/qryAttachInfo.do";//附件信息
var URL_DOWN_PDF_DEMAND=CTX +"/order/downLoadPdf.do";//打印pdf报表
/**
 * 查询短流程详细的URL 
 */
var URL_QUERY_WORKFLOW = "/shortProcess/queryDemandListDetail.do";
/**
 * 查询短流程节点信息的URL 
 */
var URL_QUERY_NODEINFO = "/shortProcess/queryWorkflowNodeInfo.do";
/**
 * 新建流程 
 */
var URL_ADD_WORKFLOW = "/shortProcess/addWorkflow.do";
/**
 * 新建需求 
 */
var URL_ADD_WORKFLOWNEED = "/shortProcess/addWorkflowneed.do";
var URL_ADD_WORKFLOWNEEDD = "/shortProcess/addWorkflowneedd.do";
var URL_ADD_WORKFLOWNEEDDD = "/shortProcess/addWorkflowneeddd.do";
var URL_ADD_WORKFLOWNEEDDDD = "/shortProcess/addWorkflowneedddd.do";
var URL_ADD_WORKFLOWBACK = "/shortProcess/addWorkflowback.do";
//add 2017-11-10 处理过程中的作废工单
var URL_ADD_WORKFLOWACANCLE="/shortProcess/cancleWorkflownode.do";
/**
 * 短流程需求模板查询 
 */
var URL_QUERY_DEMANDTEMPLATE = "/shortProcess/queryDemandTemplateList.do";

/**
 * 发布流程时,用于回显数据 
 */
var URL_QUERY_PUBLISH_WORKFLOWDATA = "/shortProcess/queryWorkflowPublishList.do";

/**
 * 更新流程状态 
 */
var URL_UPDATE_WORKFLOWSTATUS = "/shortProcess/updateWorkflowStatus.do";

/**
 * 查询本地网 
 */

var URL_QUERY_SYS_REGION = "/shortProcess/querySysRegion.do";
/**
 * 更新节点数据 
 */
var URL_UPDATE_NODEDATA = "/shortProcess/updateNodeData.do";

/**
 * 获取要标红的节点 
 */
var URL_QUERY_REDNODE_EXAMINE = "/shortProcess/queryRedNode.do";
/**
 * 催单 催单 
 */
var URL_UPDATE_DEMANDINFO = "/shortProcess/updateDemandInfo.do";

/**
 * 查询当前登录人属于本地网还是省公司 
 */
var URL_QUERY_CURRENTLOGIN_BELONGTO = "/shortProcess/queryCurrentBelongTo.do";

/**
 * 更新流程状态到暂停 
 */
var URL_UPDATEWORKFLOWSTATUS_TO_STOP = "/shortProcess/updateWorkflowStatusToStop.do";

/**
 * 查询子流程数据量及流程处理所需的平均工时 
 */
var URL_QUERY_SONWORKFLOW_TIMELIMIT = "/shortProcess/querySonWFNumAndTimeLimit.do";

/**
 * 更新流程数据 
 */
var URL_UPDATE_WORKFLOWDATA = "/shortProcess/updateWorkflow.do";

/**
 * 更新流程状态为作废
 */
var URL_UPDATEWORKFLOWSTATUS_TO_DISCARD = "/shortProcess/updateWorkflowToDiscard.do";

/**
 * 判断每个节点是否设置了处理时限
 */
var URL_ISORNOT_SET_TIMELIMIT = "/shortProcess/queryEveryNodeTimeLimit.do";

/**
 * 维护流程时 判断该流程下面是否有流程实例 
 */
var URL_QUERY_WORKFLOWEXAMPLE_STATUS = "/shortProcess/queryWorkflowExampleStatus.do";

/**
 * 查询节点类型
 */
var URL_QUERY_NODETYPE = "/shortProcess/queryNodeType.do";

/**
 * 查询流程分类和类型
 */
var URL_QUERY_WORKFLOW_SORTANDTYPE = "/shortProcess/queryWorkflwoSortAndType.do";
var URL_QUERY_WIS_UPDATE = "/shortProcess/queryWisUpdate.do";
var URL_QUERY_ISORNOT_PUBLISH = "/shortProcess/queryIsOrNotPublish.do";
/**
 * 查询需求模板属性
 */
var URL_QUERY_DEMANDTEMPLATE_ATTR = "/shortProcess/queryDemandTemplateAttr.do";

/**
 * 环节流转短信提醒
 */
var URL_STEP_FLOW_REMIND = "/shortProcess/stepFlowRemind.do";
/**
 * 查询节点是否会签
 */
var URL_QUERY_IS_SIGNATURE = "/shortProcess/queryNodeIsSingature.do";

/**
 * 会签节点设置
 */
var URL_UPDATE_ISSINGATURE_SET = "/shortProcess/updateIssingatureSet.do";

/**
 * 会签发布
 */
var URL_ADD_WORKFLOWSIGN = "/shortProcess/addWorkflowSign.do";

/**
 * 会签代办
 */
var URL_QUERY_NOSINGATURE_DEMAND = "/shortProcess/queryNoSingatureDemandList.do";

/**
 * 会签需求处理
 */
var URL_QUERY_SINGATURE_DEAL = "/shortProcess/singatureDeal.do";
/**
 * 工单处理完成到待评价时，需要给发起人进行短信提醒 dangzw 2016-12-09
 */
var URL_DEMAND_FINISH = "/shortProcess/demandFinish.do";
/**
 * 规则类
 */
var URL_QUERY_FLOWRULE = "/shortProcess/flowRule.do";
/**
 * 评价类
 */
var URL_QUERY_EVAL_INFO = "/shortProcess/workFlowEvalInfo.do";
/**
 * 授权类
 */
var URL_QUERY_AUTHOR_INFO = "/shortProcess/authorityList.do";
/**
 * 下载水印
 * */
var URL_SHORT_DOWN_FILE="/shortProcess/helpFile.do";//文档下载
/** **********************短流程end**************************** */
/*******************************公共方法begin******************************/
var URL_QUERY_COMMON_METHOD="/common/commonMethod.do";
var URL_UPD_WORKFLOWNEED = "/shortProcess/updateWorkflowneed.do";
var URL_COMMON_DELETE_FILE="/common/deleteFile.do";//删除附件
/*******************************公共方法end******************************/
var URL_DEMAND_SHORT_TYPE="/bbs/demandShortType.do";//查询需求短流程类型
var URL_DEMAND_SHORT_COMMENT="/bbs/submitComment.do";//提交评论
var URL_QUERY_COMMENT_LIST="/bbs/queryCommentList.do";//查询评论列表
/*******************************公共方法end******************************/
/*******************************公共方法end******************************/

/*******************************推送消息begin******************************/
var URL_PUSH_INFO="/pushInfo/pushInfo.do";
/*******************************推送消息end******************************/

/*******************************领导行程begin******************************/
var URL_COMMON_LEADSTROKE_LIST="/leadStroke/commonLeadStroke.do";
var URL_DOWN_PDF_LEADSTORKE=CTX +"/leadStroke/downLoadPdf.do";
var URL_DOWN_PDF_DRAFTSLEADSTORKE=CTX +"/leadStroke/draftsDownLoadPdf.do";
/*******************************领导行程end******************************/