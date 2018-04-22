package com.tydic.sale.service.crm.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tydic.sale.service.crm.CrmService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.Tools;
import com.tydic.sale.webService.client.CpcServiceClient;

public class CrmServiceImpl implements CrmService {
	private final static Logger logger = LoggerFactory.getLogger(CrmServiceImpl.class);
	
	private CpcServiceClient cpcServiceClient;

	public CpcServiceClient getCpcServiceClient() {
		return cpcServiceClient;
	}

	public void setCpcServiceClient(CpcServiceClient cpcServiceClient) {
		this.cpcServiceClient = cpcServiceClient;
	}

	@Override
	public Map<Object, Object> submitDemandInfo(Map<Object, Object> demandInfo,
			String demandType) {
		
		Map<Object, Object> param = new HashMap<Object, Object>();
		param.put("demandInfo", demandInfo);
		param.put("demandType", demandType);
		
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "saveDemandInfo");
		
		return resultMap;
	}
	

	@Override
	public Map<Object, Object> updateDemandInst(String demandId,
			Map<Object, Object> demandInfo) {
		
		Map<Object, Object> resultMap = null;
		
		if(Tools.isNull(demandId)){
			resultMap = new HashMap<Object,Object>();
			resultMap.put("code", "-998");
			resultMap.put("msg", "需求单不存在或为空！");
			
			return resultMap;
		}
		
		demandInfo.put("demand_id", demandId);
		
		resultMap = this.cpcServiceClient.callCpcService(demandInfo, "updateDemand");
		
		return resultMap;
	}
/*
	@Override
	public Map<Object, Object> searchDemandInfo(String demandId,
			String isHistory) {
		Map<Object, Object> resultMap = null;
		
		if(Tools.isNull(demandId)){
			resultMap = new HashMap<Object,Object>();
			resultMap.put("code", "-998");
			resultMap.put("msg", "需求单不存在或为空！");
			
			return resultMap;
		}
		Map<Object, Object> paramMap = new HashMap<Object,Object>();
		paramMap.put("demandId", demandId);
		paramMap.put("isHistory", isHistory);
		
		resultMap = this.cpcServiceClient.callCpcService(paramMap, "searchDemandInfo");
		
		return resultMap;
	}
	*/
	@Override
	public Map<Object, Object> searchDemandInfo(String demandId,String isHistory, String isCEO) {
		Map<Object,Object> resultMap=null;
		if(Tools.isNull(demandId)){
			resultMap=new HashMap<Object,Object>();
			resultMap.put("code", "-998");
			resultMap.put("msg", "需求单不存在或为空！");
			return resultMap;
		}
		Map<Object,Object> paramMap=new HashMap<Object,Object>();
		paramMap.put("demandId", demandId);
		paramMap.put("isHistory", isHistory);
		paramMap.put("isCEO", isCEO);
		resultMap = this.cpcServiceClient.callCpcService(paramMap, "searchDemandInfo");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> searchSysInfo(String flowRecordId,String isHistory) {
		Map<Object, Object> resultMap = null;
		
		if(Tools.isNull(flowRecordId)){
			resultMap = new HashMap<Object,Object>();
			resultMap.put("code", "-998");
			resultMap.put("msg", "专业系统单不存在或为空！");
			
			return resultMap;
		}
		
		
		Map<Object, Object> paramMap = new HashMap<Object,Object>();
		paramMap.put("flowRecordId", flowRecordId);
		paramMap.put("isHistory", isHistory);
		
		resultMap = this.cpcServiceClient.callCpcService(paramMap, "searchSysInfo");
		
		return resultMap;
	}

	@Override
	public Map<Object, Object> getDemandLst(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "getDemandList");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> getServiceLst(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "getServiceList");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> getSysLst(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "getSysList");
		return resultMap;
	}

	@Override
	public Map<Object, Object> searchCurrNodeCount(List<Map<Object, Object>> paramSet,String promotersId) {
		
		Map<Object, Object> resultMap = null;
		
		
		Map<Object, Object> paramMap = new HashMap<Object,Object>();
		paramMap.put("promoters_id", promotersId);
		paramMap.put("list", paramSet);
		
		resultMap = this.cpcServiceClient.callCpcService(paramMap, "getRecordSumList");
		
		return resultMap;
	}

	@Override
	public Map<Object, Object> getDemandInfo(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "searchDemandInfo");
		return resultMap;
	}
	
	
	@Override
	public Map<Object, Object> getServiceInfo(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "searchServiceInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getDemandId(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "getDemandId");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getdic(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "dic");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> getLatnData(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "getLatnData");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> flowExchange(Map<Object, Object> reqMap) {
		Map<Object, Object> resultMap = null;
		resultMap = this.cpcServiceClient.callCpcService(reqMap, "flowExchange");
		return resultMap;
	}
	
	public Map<Object, Object> updateDemandInfo(Map<Object, Object> demandInfo) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(demandInfo, "updateDemand");
		return resultMap;
	}

	@Override
	public Map<Object, Object> urgedDemand(Map<Object, Object> demandInfo) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(demandInfo, "urgedDemand");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getDemandDraftLst(Map<Object, Object> demandInfo) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(demandInfo, "demandDraftSet");
		return resultMap;
	}

	@Override
	public Map<Object, Object> removeDemandDraftLst(
			Map<Object, Object> demandInfo) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(demandInfo, "removeDemandDraftLst");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getSysOrg(Map<Object, Object> param) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(param, "getSysOrg");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getStaffByOrgId(Map<Object, Object> param) {
		Map<Object, Object> resultMap = this.cpcServiceClient.callCpcService(param, "getStaffByOrgId");
		return resultMap;
	}

	@Override
	public Map<Object, Object> sendSms(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "sendSMSmessage");
		return resultMap;
	}

	@Override
	public Map<Object, Object> login(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "login");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryPoolRel(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryPoolOpts");
		return resultMap;
	}

	@Override
	public Map<Object, Object> selectDraftCount(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "selectDraftCount");
		return resultMap;
	}

	@Override
	public Map<Object, Object> updatePwd(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updatePwd");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getStaffInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getStaffInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryOutSysFlowSet(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryOutSysFlowSet");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getOutSysFlowRecord(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getOutSysFlowRecord");
		return resultMap;
	}

	@Override
	public Map<Object, Object> saveBusiFlowRel(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "saveBusiFlowRel");
		return resultMap;
	}

	@Override
	public Map<Object, Object> saveServiceInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "saveServiceInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> valiBusiFlowRel(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "valiBusiFlowRel");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getPool(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getPool");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getUserRolePool(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getUserRolePoolInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryNews(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryNews");
		return resultMap;
	}

	@Override
	public Map<Object, Object> updateLookNews(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updateLookNews");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryNewsInfoByType(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryNewsInfoByType");
		return resultMap;
	}

	@Override
	public Map<Object, Object> starEvalOnMonth(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "starEvalOnMonth");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getNotLookNewsCount(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getNotLookNewsCount");
		return resultMap;
	}

	@Override
	public Map<Object, Object> querySysUserInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "querySysUserInfo");
		return resultMap;
	}

	@Override
	public Map<Object,Object> queryNeedEvalList(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryNeedEvalList");
		return resultMap;
	}
	@Override
	public Map<Object,Object> queryNeedEvalServiceList(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryNeedEvalServiceList");
		return resultMap;
	}
	@Override
	public Map<Object,Object> saveEvalData(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "saveEvalData");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> getDateConfigData(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "getDateConfigData");
		return resultMap;
	}

	@Override
	public Map<Object, Object> queryStaffByData(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryStaffByData");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> queryRoleList(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryRoleList");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> addRoleInfo(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "addRoleInfo");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> updateRoleInfo(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updateRoleInfo");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> queryRoleUseCount(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryRoleUseCount");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> deleteRoleInfo(Map<Object,Object> param){
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "deleteRoleInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> queryReportPublicConfig(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryReportPublicConfig");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> queryReportPublic(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryReportPublic");
		return resultMap;
	}
	
	@Override
	public Map<Object,Object> dealObjectFun(Map<Object,Object> param){
		Map resultMap=new HashMap<Object, Object>();
		Object serFunName=param.get("SERVER_NAME");
		 if(StringUtil.objIsNotEmpty(serFunName)){
			 resultMap = this.cpcServiceClient.callCpcService(param, serFunName.toString()); 
		 }else{
			 resultMap.put("code", Const.EXP);
			 resultMap.put("msg", "调用服务名称异常");
		 }
		return  resultMap;
	}

	@Override
	public Map<Object, Object> addAuthInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "addAuthInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> deleteAuthInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "deleteAuthInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> queryAuthList(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryAuthList");
		return resultMap;
	}

	@Override
	public Map<Object, Object> queryAuthUseCount(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryAuthUseCount");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> updateAuthInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updateAuthInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> queryCallSchedule(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "queryCallSchedule");
		return resultMap;
	}

	@Override
	public Map<Object, Object> updateCallSchedule(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updateCallSchedule");
		return resultMap;
	}

	@Override
	public Map<Object, Object> addCallSchedule(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "addCallSchedule");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryReportControl(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryReportControl");
		return resultMap;
	}

	@Override
	public Map<Object, Object> appValdateVersion(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "appValdateVersion");
		return resultMap;
	}

	@Override
	public Map<Object, Object> deletePolicyManual(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "deletePolicyManual");
		return resultMap;
	}

	@Override
	public Map<Object, Object> insertPolicyManual(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "insertPolicyManual");
		return resultMap;
	}

	@Override
	public Map<Object, Object> updatePolicyManual(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "updatePolicyManual");
		return resultMap;
	}

	@Override
	public Map<Object, Object> releasePolicyManual(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "releasePolicyManual");
		return resultMap;
	}

	@Override
	public Map<Object, Object> approvalPolicyManual(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "approvalPolicyManual");
		return resultMap;
	}

	@Override
	public Map<Object, Object> searchDeptInfo(Map<Object, Object> paramMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(paramMap, "searchDeptInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> saveEvalMonZZ(Map<Object, Object> paramMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(paramMap, "saveEvalMonZZ");
		return resultMap;
	}

	@Override
	public Map<Object, Object> saveEvalDept(Map<Object, Object> paramMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(paramMap, "saveEvalDept");
		return resultMap;
	}

	@Override
	public Map<Object, Object> searchUserInfo(Map<Object, Object> paramMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(paramMap, "searchUserInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> addOrgInfo(Map<Object, Object> param){ 
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "addOrgInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> getDemandsaveLst(Map<Object, Object> reqParamMap) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(reqParamMap, "getDemandsaveLst");
		return resultMap;
	}

	@Override
	public Map<Object, Object> showStaff(Map<Object, Object> reqMap) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(reqMap, "showStaff");
		return resultMap;
	}

	@Override
	public Map<Object, Object> updateflow(Map<Object, Object> reqMap) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(reqMap, "updateflow");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> searchDeptmentInfo(Map<Object, Object> reqParamMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(reqParamMap, "searchDeptmentInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> searchIndexInfo(Map<Object, Object> reqParamMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(reqParamMap, "searchIndexInfo");
		return resultMap;
	}
	
	@Override
	public Map<Object, Object> updateAssessInfo(Map<Object, Object> reqParamMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(reqParamMap, "updateAssessInfo");
		return resultMap;
	}
	@Override
	public Map<Object, Object> dealDeptAndStaffInfo(Map<Object, Object> reqParamMap) {
		Map<Object,Object> resultMap=this.cpcServiceClient.callCpcService(reqParamMap, "qryDeptAndStaffInfo");
		return resultMap;
	}
	@Override
	public Map<Object, Object> submitTask(Map<Object, Object> reqParamMap,String handleType) {
		Map<Object, Object> param = new HashMap<Object, Object>();
		param.put("taskInfo", reqParamMap);
		param.put("handleType", handleType);
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "submitTaskBook");
		
		return resultMap;
		
	}

	@Override
	public Map<Object, Object> commonMothed(Map<Object, Object> paramMap) {
		Map<Object, Object> resultMap =  new HashMap<Object, Object>();;
		Object dataSource = paramMap.get(Constant.SERVER_NAME);
		if(StringUtil.objIsNotEmpty(dataSource)){
			resultMap = this.cpcServiceClient.callCpcService(paramMap, dataSource.toString());
		 }else{
			 resultMap.put("code", Const.EXP);
			 resultMap.put("msg", "调用服务名称异常");
		 }
		return resultMap;
	}
	
	/**
	 * 短流程需求查询
	 * @author simon
	 * @date 2017-05-11
	 * @param reqParaMap 条件
	 * @return Map<Object, Object>
	 */
	@Override
	public Map<Object, Object> queryDemandList(Map<Object, Object> reqParaMap) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(reqParaMap, "queryDemandList");
		return resultMap;
	}
	
	/**
	 * 短流程需求查询
	 * @author simon
	 * @date 2017-05-11
	 * @param reqParaMap 条件
	 * @return Map<Object, Object>
	 */
	@Override
	public Map<Object, Object> queryDemandHistoryList(Map<Object, Object> reqParaMap) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(reqParaMap, "queryDemandHistoryList");
		return resultMap;
	}

	@Override
	public Map<Object, Object> qryDeptStaffInfo(Map<Object, Object> param) {
		Map<Object,Object> resultMap = this.cpcServiceClient.callCpcService(param, "qryDeptStaffInfo");
		return resultMap;
	}

	@Override
	public Map<Object, Object> dealGoverAndEnter(Map<Object, Object> param) {
		Map<Object, Object> resultMap=new HashMap<Object, Object>();
		Object dealGoverInfo = param.get(Constant.SERVER_NAME);
		 if(StringUtil.objIsNotEmpty(dealGoverInfo)){
			 resultMap = this.cpcServiceClient.callCpcService(param, dealGoverInfo.toString());
		 }else{
			 resultMap.put("code", Const.EXP);
			 resultMap.put("msg", "调用服务名称异常");
		 }
		return  resultMap;
	}

	@Override
	public Map<Object, Object> querySolveProcessList(Map<Object, Object> param) {
		// TODO Auto-generated method stub
		Map<Object, Object> resultMap =  new HashMap<Object, Object>();;
		Object dataSource = param.get(Constant.SERVER_NAME);
		if(StringUtil.objIsNotEmpty(dataSource)){
			resultMap = this.cpcServiceClient.callCpcService(param, dataSource.toString());
		 }else{
			 resultMap.put("code", Const.EXP);
			 resultMap.put("msg", "调用服务名称异常");
		 }
		return resultMap;
	}
}