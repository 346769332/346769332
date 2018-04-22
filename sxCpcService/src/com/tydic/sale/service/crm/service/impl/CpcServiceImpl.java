package com.tydic.sale.service.crm.service.impl;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.service.AppVersionService;
import com.tydic.sale.service.crm.service.CommonMethodService;
import com.tydic.sale.service.crm.service.CpcService;
import com.tydic.sale.service.crm.service.EvalMonService;
import com.tydic.sale.service.crm.service.FlowService;
import com.tydic.sale.service.crm.service.LeadStrokeService;
import com.tydic.sale.service.crm.service.LeaveService;
import com.tydic.sale.service.crm.service.MeetService;
import com.tydic.sale.service.crm.service.NotificationService;
import com.tydic.sale.service.crm.service.OutcommonService;
import com.tydic.sale.service.crm.service.PolicyManualService;
import com.tydic.sale.service.crm.service.ReportService;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.crm.service.SearchService;
import com.tydic.sale.service.crm.service.ShortProcessService;
import com.tydic.sale.service.crm.service.SysManageService;
import com.tydic.sale.service.crm.service.TaskBookService;
import com.tydic.sale.service.crm.service.UseAuthService;
import com.tydic.sale.service.util.Tools;

public class CpcServiceImpl implements CpcService {

	private WebApplicationContext springContext;

	private SearchService searchService;

	private FlowService flowService;

	private SMSService sMSService;

	private UseAuthService useAuthService;

	private SysManageService sysManageService;

	private ReportService reportService;

	private PolicyManualService policyManualService;

	private AppVersionService appVersionService;

	private EvalMonService evalMonService;

	private TaskBookService taskBookService;

	private ShortProcessService shortProcessService;
	
	private CommonMethodService commonMethodService;
	
	private NotificationService notificationService;
	
	private LeadStrokeService leadStrokeService;

	private LeaveServiceImpl leaveService;
	
	private MeetService meetService;
	
	private OutcommonService outcommonService;
	
	
	public OutcommonService getOutcommonService() {
		outcommonService = (OutcommonService) this.springContext
				.getBean("outcommonService");
		return outcommonService;
	}
	public MeetService getMeetService() {
		meetService = (MeetServiceImpl) this.springContext.getBean("meetService");
		return meetService;
	}


	@Override
	public String insertAttachInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService()
				.insertAttachInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveOrgAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.saveOrgAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryOrgAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.qryOrgAuthInfo(inputParam);
		return this.out(outParam);
	}

	public EvalMonService getEvalMonService() {
		evalMonService = (EvalMonService) this.springContext
				.getBean("evalMonService");
		return evalMonService;
	}

	@Override
	public String qryStaffInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService().qryStaffInfo(
				inputParam);
		return this.out(outParam);
	}

	public AppVersionService getAppVersionService() {
		appVersionService = (AppVersionService) this.springContext
				.getBean("appVersionService");
		return appVersionService;
	}

	@Override
	public String qryPoolInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.qryPoolListPage(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryServiceInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.qryServiceListPage(inputParam);
		return this.out(outParam);
	}

	public PolicyManualService getPolicyManualService() {
		policyManualService = (PolicyManualService) this.springContext
				.getBean("policyManualService");
		return policyManualService;
	}

	public ReportService getReportService() {
		reportService = (ReportService) this.springContext
				.getBean("reportService");
		return reportService;
	}

	public SMSService getsMSService() {
		sMSService = (SMSService) this.springContext.getBean("sMSService");
		return sMSService;
	}

	/**
	 * 得到短流程需求接口
	 * 
	 * @return ShortProcessService
	 */
	public ShortProcessService getShortProcessService() {
		shortProcessService = (ShortProcessService) this.springContext
				.getBean("shortProcessService");
		return shortProcessService;
	}
	
	public CommonMethodService getCommonMethodService() {
		commonMethodService = (CommonMethodService) this.springContext.getBean("commonMethodService");
		return commonMethodService;
	}
	public NotificationService getNotificationService() {
		notificationService = (NotificationService) this.springContext.getBean("notificationService");
		return notificationService;
	}
	public LeadStrokeService getLeadStrokeService() {
		leadStrokeService = (LeadStrokeService) this.springContext.getBean("leadStrokeService");
		return leadStrokeService;
	}
	
	public LeaveService getLeaveService() {
		leaveService = (LeaveServiceImpl) this.springContext.getBean("leaveServiceImpl");
		return leaveService;
	}
	
	
	@Override
	public String updatePoolInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.updatePoolInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateServiceInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.updateServiceInfo(inputParam);
		return this.out(outParam);
	}

	public FlowService getFlowService() {
		flowService = (FlowService) this.springContext.getBean("flowService");
		return flowService;
	}

	public SearchService getSearchService() {
		searchService = (SearchService) this.springContext
				.getBean("searchService");
		return searchService;
	}

	public UseAuthService getUseAuthService() {
		useAuthService = (UseAuthService) this.springContext
				.getBean("useAuthService");
		return useAuthService;
	}

	public SysManageService getSysManageService() {
		sysManageService = (SysManageService) this.springContext
				.getBean("sysManageService");
		return sysManageService;
	}

	public CpcServiceImpl() {
		springContext = ContextLoader.getCurrentWebApplicationContext();
	}

	public TaskBookService getTaskBookService() {
		taskBookService = (TaskBookService) this.springContext
				.getBean("taskBookService");
		return taskBookService;
	}

	/**
	 * 公共入参转换方法
	 * 
	 * @param json
	 * @return
	 * @throws IOException
	 * @throws JsonMappingException
	 * @throws JsonParseException
	 */
	public Map<String, Object> input(String json) {
		ObjectMapper mapper = new ObjectMapper();
		Map<String, Object> input = new HashMap<String, Object>();
		try {
			input = mapper.readValue(json, Map.class);
		} catch (Exception e) {
			e.printStackTrace();
		}// 转成map
		return input;
	}

	/**
	 * 输出
	 * 
	 * @param param
	 * @return
	 */
	public String out(Map<String, Object> param) {
		String out = JSON.toJSONString(param,
				SerializerFeature.WriteMapNullValue);
		return out.replaceAll("null", "\"\"");
	}

	@Override
	public String saveDemandInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		ISpringContext springInstance = SpringContextUtils.getInstance();
		flowService = (FlowService) springInstance.getBean("flowService");
		Map<String, Object> outMap = this.flowService.saveDemand(
				(Map<String, Object>) inputParam.get("demandInfo"),
				String.valueOf(inputParam.get("demandType")));

		return this.out(outMap);
	}

	@Override
	public String getDemandId(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		ISpringContext springInstance = SpringContextUtils.getInstance();
		flowService = (FlowService) springInstance.getBean("flowService");
		Map<String, Object> outMap = this.flowService.getDemandId(inputParam);
		return this.out(outMap);
	};

	public String flowExchange(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		ISpringContext springInstance = SpringContextUtils.getInstance();
		flowService = (FlowService) springInstance.getBean("flowService");
		Map<String, Object> outMap = this.flowService.flowExchange(
				(Map<String, Object>) inputParam.get("cpcFlowRecord"),
				(Map<String, Object>) inputParam.get("cpcDemand"),
				(Map<String, Object>) inputParam.get("cpcService"),
				(List<Map<String, Object>>) inputParam.get("recordProc"),
				String.valueOf(inputParam.get("handleType")));
		return this.out(outMap);
	}

	@Override
	public String saveRecordProc(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.searchService
				.saveRecordProc(inputParam);

		return this.out(result);
	}

	@Override
	public String updateDemand(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.getSearchService().updateDemand(
				inputParam);
		return this.out(result);
	}

	@Override
	public String searchDemandInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.getSearchService().demandInfo(
				String.valueOf(inputParam.get("demandId")),
				String.valueOf(inputParam.get("isHistory")));
		return this.out(result);
	}

	@Override
	public String qryMaxStaffId(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.qryMaxStaffId(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchServiceInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.getSearchService().serviceInfo(
				String.valueOf(inputParam.get("serviceId")),
				String.valueOf(inputParam.get("isHistory")));
		return this.out(result);
	}

	@Override
	public String searchSysInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.getSearchService().sysInfo(
				String.valueOf(inputParam.get("flowRecordId")),
				String.valueOf(inputParam.get("isHistory")));
		return this.out(result);
	}

	@Override
	public String getDemandList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getDemandList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String getServiceList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getServiceList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String getSysList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getSysList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String getRecordSumList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getRecordSumList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String urgedDemand(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().urgedDemand(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String getAllFlowNode(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getAllFlowNode(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String dic(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().dic(inputParam);
		return this.out(outMap);
	}

	@Override
	public String getLatnData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getLatnData(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String demandDraftSet(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().demandDraftSet(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String removeDemandDraftLst(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService()
				.removeDemandDraftLst(inputParam);
		return this.out(outMap);
	}

	public String sendSMSmessage(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getsMSService().sendNodeMessage(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String login(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().login(inputParam);
		return this.out(outMap);
	}

	@Override
	public String getSysOrg(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getSysOrg(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String getStaffByOrgId(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getStaffByOrgId(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryPoolOpts(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().qryPoolOpts(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String selectDraftCount(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> result = this.getSearchService().selectDraftCount(
				inputParam);
		return this.out(result);
	}

	@Override
	public String sendFlowNode(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService()
				.insertOutSysFlowRecord(inputParam);

		return this.out(outParam);
	}

	@Override
	public String qryOutSysFlowSet(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().qryOutSysFlow(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String getOutSysFlowRecord(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService()
				.qryOutSysFlowRecord(inputParam);

		return this.out(outParam);
	}

	@Override
	public String getStaffInfo(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().getStaffInfo(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String saveBusiFlowRel(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().saveBusiFlowRel(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String valiBusiFlowRel(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService()
				.validateBusiFlowRel(inputParam);

		return this.out(outParam);
	}

	@Override
	public String updatePwd(String param) {
		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().updatePwd(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String saveServiceInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getFlowService().saveService(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String getPool(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getFlowService()
				.getPool(inputParam);
		return this.out(outParam);
	}

	@Override
	public String getFun(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getUseAuthService().queryFun(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String getUserRolePoolInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getUseAuthService()
				.queryUserRolePoolInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryNews(String param) {
		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().qryNews(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String updateLookNews(String param) {
		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().updateLookNews(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String starEvalOnMonth(String param) {
		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService().starEvalOnMonth(
				inputParam);

		return this.out(outParam);
	}

	@Override
	public String qryNewsInfoByType(String param) {
		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService()
				.qryNewsInfoByType(inputParam);

		return this.out(outParam);
	}

	@Override
	public String getNotLookNewsCount(String param) {

		Map<String, Object> inputParam = this.input(param);

		Map<String, Object> outParam = this.getSearchService()
				.getNotLookNewsCount(inputParam);

		return this.out(outParam);
	}

	@Override
	public String querySysUserInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService()
				.querySysUserInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryNeedEvalList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService()
				.queryNeedEvalList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryNeedEvalServiceList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService()
				.queryNeedEvalServiceList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveEvalData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService().saveEvalData(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String getDateConfigData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService()
				.getDateConfigData(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryStaffByData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getUseAuthService()
				.queryStaffByData(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryRoleList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryRoleList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addRoleInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService().addRoleInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateRoleInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.updateRoleInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryRoleUseCount(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryRoleUseCount(inputParam);
		return this.out(outParam);
	}

	@Override
	public String deleteRoleInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.deleteRoleInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryRoleAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryRoleAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveRoleAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.saveRoleAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryReportPublic(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getReportService()
				.searchReportPublic(inputParam);
		return this.out(outParam);
	}

	/*----20150427权限集合begin-------*/
	@Override
	public String addAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService().addAuthInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String deleteAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.deleteAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryAuthList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryAuthList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.updateAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryAuthUseCount(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryAuthUseCount(inputParam);
		return this.out(outParam);
	}

	public String queryAssignAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryAssignAuthInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveAssignAuthInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.saveAssignAuthInfo(inputParam);
		return this.out(outParam);
	}

	/*------20150427权限结合end------*/

	@Override
	public String queryRoleUserInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryRoleUserInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveRoleUserInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.saveRoleUserInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryReportPublicConfig(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getReportService()
				.queryReportPublicConfig(inputParam);
		return this.out(outParam);
	}

	@Override
	public String getCeoSysOrg(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getCeoSysOrg(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String updateLoginState(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().updateLoginState(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String saveOptRecordInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSysManageService()
				.saveOptRecordInfo(inputParam);
		return this.out(outMap);
	}

	@Override
	public String checkIsLogin(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().checkLogin(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String queryCallSchedule(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSysManageService()
				.queryCallSchedule(inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryReportControl(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getReportService()
				.searchReportPublicControl(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchPolicyManualTypeList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.searchPolicyManualTypeList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchPolicyManualTypeDetailList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.searchPolicyManualTypeDetailList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchPolicyManualInfoList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.searchPolicyManualInfoList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String getAttachInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService().getAttachInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String checkLoginCode(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.checkLoginCode(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addStaffInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService().addStaffInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateStaffState(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.updateStaffState(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryOrganisationList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService()
				.queryOrganisationList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateCallSchedule(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSysManageService()
				.updateCallSchedule(inputParam);
		return this.out(outMap);
	}

	@Override
	public String addCallSchedule(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSysManageService()
				.addCallSchedule(inputParam);
		return this.out(outMap);
	}

	@Override
	public String queryPolicyManualList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getPolicyManualService()
				.queryPolicyManualList(inputParam);
		return this.out(outMap);
	}

	@Override
	public String deletePolicyManual(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.deletePolicyManualList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String appValdateVersion(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getAppVersionService()
				.valdateVersion(inputParam);
		return this.out(outMap);
	}

	@Override
	public String insertPolicyManual(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getPolicyManualService()
				.insertPolicyManual(inputParam);
		return this.out(outMap);
	}

	@Override
	public String updatePolicyManual(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getPolicyManualService()
				.updatePolicyManual(inputParam);
		return this.out(outMap);
	}

	@Override
	public String updatePolicyManualInfoState(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getPolicyManualService()
				.updatePolicyManualInfoState(inputParam);
		return this.out(outMap);
	}

	@Override
	public String queryAreaData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getPolicyManualService()
				.queryAreaData(inputParam);
		return this.out(outMap);
	}

	@Override
	public String releasePolicyManual(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.releasePolicyManualList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String approvalPolicyManual(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getPolicyManualService()
				.approvalPolicyManualList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchUserInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().searchUserInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveEvalMonZZ(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().saveEvalMonZZ(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveEvalDept(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().saveEvalDept(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchDeptInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().searchDeptInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String getDeptSysOrg(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getDeptSysOrg(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String addOrgInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSysManageService().addOrgInfo(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String getDemandsaveLst(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getDemandsaveLst(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String showStaff(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().showStaff(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String updateflow(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().updateflow(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String searchDeptmentInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService()
				.searchDeptmentInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String searchIndexInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService()
				.searchIndexInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateAssessInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService()
				.updateAssessInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String getLoginCodeList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().getLoginCodeList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String deleteFile(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getSearchService().deleteFile(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryTaskBookList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().qryTaskBookList(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String submitTaskBook(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().submitTaskBook(
				(Map<String, Object>) inputParam.get("taskInfo"),
				String.valueOf(inputParam.get("handleType")));
		return this.out(outMap);
	}

	@Override
	public String searchTaskInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().searchTaskInfo(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String flowTaskBook(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().flowTaskBook(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryDeptAndStaffInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getEvalMonService()
				.qryDeptAndStaffInfo(inputParam);
		return this.out(outMap);
	}

	@Override
	public String searchTaskBookInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService()
				.searchTaskBookInfo(inputParam);
		return this.out(outMap);
	}

	@Override
	public String insertTaskBookInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService()
				.insertTaskBookInfo(inputParam);
		return this.out(outMap);
	}

	@Override
	public String queryStaffTree(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().queryStaffTree(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryTaskModelList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService()
				.qryTaskModelList(inputParam);
		return this.out(outMap);
	}

	@Override
	public String releaseTaskBook(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().releaseTaskBook(
				inputParam);
		return this.out(outMap);
	}

	@Override
	public String qryAttachInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outMap = this.getTaskBookService().qryAttachInfo(inputParam);
		return this.out(outMap);
	}

	/**
	 * 短流程需查询
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 历史短流程需查询
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandHistoryList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandHistoryList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 流程配置列表
	 * 
	 * @param param
	 * @return
	 */
	public String queryActWorkflwoInfoList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.qryActWorkflwoInfoList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 短流程需求详细查询
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandHistoryListDetail(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandHistoryListDetail(inputParam);
		return this.out(outParam);
	}

	/**
	 * 短流程需求节点信息
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkflowNodeInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkflowNodeInfo(inputParam);
		return this.out(outParam);
	}

	/**
	 * 根据流程di获取数据
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String getOneWorkflowData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.getOneWorkflowData(inputParam);
		return this.out(outParam);
	}

	/**
	 * 模板信息
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandTemplateInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandTemplateInfo(inputParam);
		return this.out(outParam);
	}

	/**
	 * 新建流程
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String addWorkflow(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflow(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询父流程
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkflowPublishParentList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkflowPublishParentList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询子流程
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkflowPublishSonList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkflowPublishSonList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新流程状态为草稿
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateStatusToDraft(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateStatusToDraft(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新流程状态为发布
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateStatusToPublish(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateStatusToPublish(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询本地网
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String querySysRegion(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.querySysRegion(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新节点数据
	 * 
	 * @param param
	 * @return
	 */

	/**
	 * 短流程流程信息
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkFlowNeedId(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkFlowNeedId(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addWorkflowNeed(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowNeed(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询要标红的节点
	 * 
	 * @param param
	 * @return
	 */

	@Override
	public String addWorkflowNeedd(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowNeedd(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addWorkflowNeeddd(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowNeeddd(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updatedemandinfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updatedemandinfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addWorkflowNeedddd(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowNeedddd(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryRedNode(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryRedNode(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateNodeData(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateNodeData(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新流程状态到暂停
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateWFStatusToStop(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateWFStatusToStop(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addWorkflowBack(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowBack(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询子流程数据量及流程处理所需的平均工时
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String querySonWFNumAndTimeLimit(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.querySonWFNumAndTimeLimit(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新流程数据
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateWorkflow(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateWorkflow(inputParam);
		return this.out(outParam);
	}

	/**
	 * 更新流程状态为废弃
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateWorkflowToDiscard(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateWorkflowToDiscard(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询每个节点是否设置了处理时限
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryEveryNodeTimeLimit(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryEveryNodeTimeLimit(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询流程实例状态
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkflowExampleStatus(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkflowExampleStatus(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询节点类型
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryNodeType(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryNodeType(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWorkflwoSortAndType(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWorkflwoSortAndType(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryWisUpdate(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryWisUpdate(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询流程分类和类型
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryIsOrNotPublish(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryIsOrNotPublish(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询模板属性
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandTemplateAttr(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandTemplateAttr(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询需求是否处理完结
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryDemandFinsh(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryDemandFinsh(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询节点是否会签
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryNodeIsSingature(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryNodeIsSingature(inputParam);
		return this.out(outParam);
	}

	/**
	 * 会签节点设置
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String updateIssingatureSet(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.updateIssingatureSet(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addWorkflowSign(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addWorkflowSign(inputParam);
		return this.out(outParam);
	}

	/**
	 * 会签代办
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String queryNoSingatureDemandList(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.queryNoSingatureDemandList(inputParam);
		return this.out(outParam);
	}

	/**
	 * 会签需求处理
	 * 
	 * @param param
	 * @return
	 */
	@Override
	public String singatureDeal(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.singatureDeal(inputParam);
		return this.out(outParam);
	}
	/**
	 * 公共方法查询
	 * @param param
	 * @return
	 */
	@Override
	public String qryCommonMethod(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param);
		Map<String,Object> outParam = this.getCommonMethodService().qryCommonMethod(inputParam);
		return this.out(outParam);
	}
	/**
	 * 公共方法删除
	 * @param param
	 * @return
	 */
	@Override
	public String delCommonMethod(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param);
		Map<String,Object> outParam = this.getCommonMethodService().delCommonMethod(inputParam);
		return this.out(outParam);
	}
	/**
	 * 公共方法更新
	 * @param param
	 * @return
	 */
	@Override
	public String updCommonMethod(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param);
		Map<String,Object> outParam = this.getCommonMethodService().updCommonMethod(inputParam);
		return this.out(outParam);
	}
	/**
	 * 公共方法新增
	 * @param param
	 * @return
	 */
	@Override
	public String addCommonMethod(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param);
		Map<String,Object> outParam = this.getCommonMethodService().addCommonMethod(inputParam);
		return this.out(outParam);
	}
	/**
	 * 公共方法查询列表
	 * @param param
	 * @return
	 */
	@Override
	public String qryLstCommonMethod(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param);
		Map<String,Object> outParam = this.getCommonMethodService().qryLstCommonMethod(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询文件路径
	 */
	@Override
	public String qryDownloadPath(String param) {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().qryDownloadPath(inputParam);
		return this.out(outParam);
	}

	/**
	 * 文件上传 author:wangshimei
	 */
	@Override
	public String goverInsertAttach(String param) {
	    System.out.print("================param=============="+param);
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().goverInsertAttach(inputParam);
		return this.out(outParam);
	}

	/**
	 * 附件信息 author:wangshimei
	 */
	@Override
	public String getGoverAttachInfo(String param) {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().getGoverAttachInfo(inputParam);
		return this.out(outParam);
	}
	
	/**
	 * 随机产生一个attachmentId
	 */
	@Override
	public String getAttachmentId(String param) {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().getAttachmentId(inputParam);
		return this.out(outParam);
	}

	/**
	 * 删除文件
	 */
	@Override
	public String dealFileNameInfo(String param) {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().dealFileNameInfo(inputParam);
		return this.out(outParam);
	}

	/**
	 * 查询流程规则
	 */
	@Override
	public String queryFlowRuleInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().queryFlowRuleInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addEvalInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().addEvalInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addAuthorInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().addAuthorInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qrySubmitAuthorInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().qrySubmitAuthorInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryHistoryRecord(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService().qryHistoryRecord(
				inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryDeptStaffInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService().qryDeptStaffInfo(inputParam);
		return this.out(outParam);
	}
	public String querySolveProcessList(String param) throws Exception{
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().querySolveProcessList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String updateWorkflowNeed(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().updateWorkflowNeed(inputParam);
		return this.out(outParam);
	}

	@Override
	public String deleteFileInfos(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().deleteFileInfos(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qry_FileInfoId(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().qry_FileInfoId(inputParam);
		return this.out(outParam);
	}
	@Override
	public String queryDemandShortType(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().queryDemandShortType(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addBBsCommentInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().addBBsCommentInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryCommentList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().queryCommentList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryCommentInfoList(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().qryCommentInfoList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveEvalComment(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().saveEvalComment(inputParam);
		return this.out(outParam);
	}

	@Override
	public String uploadDemandImages(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getSearchService().uploadDemandImages(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryReverseEvalInfo(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getEvalMonService().queryReverseEvalInfo(inputParam);
		return this.out(outParam);
	}
	@Override
	public String qryPushInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getNotificationService().qryPushInfo(inputParam);
		return this.out(outParam);
	}
	@Override
	public String addPushInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getNotificationService().addPushInfo(inputParam);
		return this.out(outParam);
	}
	@Override
	public String addPrintDemandInfo(String param) {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.addPrintDemandInfo(inputParam);
		return this.out(outParam);
	}
    /**
     * 短流程处理中的流程作废
     */
	@Override
	public String cancleWorkflowNoed(String param) throws Exception {
		Map<String, Object> inputParam = this.input(param);
		Map<String, Object> outParam = this.getShortProcessService()
				.cancleWorkflowNoed(inputParam);
		return this.out(outParam);
	}

	@Override
	public String sendSaveLeadStrokeInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getLeadStrokeService().sendSaveLeadStrokeInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String submitLeadStrokeInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getLeadStrokeService().submitLeadStrokeInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryLstTaskLogDetailList(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().qryLstTaskLogDetailList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryCurrentStaffLant(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().queryCurrentStaffLant(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryLeaveFlowId(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().queryLeaveFlowId(inputParam);
		return  this.out(outParam);
	}

	@Override
	public String queryLeaveType(String param)
			throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().queryLeaveType(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveDamand(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().saveDamand(inputParam);
		return this.out(outParam);
	}

	@Override
	public String querySavelList(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().querySavelList(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryLeaveDemandInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().qryLeaveDemandInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String handComment(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().handComment(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryListOld(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().queryListOld(inputParam);
		return this.out(outParam);
	}

	@Override
	public String cancleDamand(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().cancleDamand(inputParam);
		return this.out(outParam);
	}

	@Override
	public String saveDocuPaperApply(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().saveDocuPaperApply(inputParam);
		return this.out(outParam);
	}

	@Override
	public String duePaperApply(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().duePaperApply(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryDocApplyTask(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().queryDocApplyTask(inputParam);
		return this.out(outParam);
	}

	@Override
	public String toPrevPaperApply(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().toPrevPaperApply(inputParam);
		return this.out(outParam);
	}

	@Override
	public String queryApplyDetail(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String,Object> outParam = this.getShortProcessService().queryApplyDetail(inputParam);
		return this.out(outParam);
	}

	@Override
	public String qryDateCount(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().qryDateCount(inputParam);
		return this.out(outParam);
	}

	@Override
	public String addMeetInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getMeetService().addMeetInfo(inputParam);
		return this.out(outParam);
	}


	@Override
	public String qryMeetInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getMeetService().qryMeetInfo(inputParam);
		return this.out(outParam);
	}


	@Override
	public String updMeetInfo(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getMeetService().updMeetInfo(inputParam);
		return this.out(outParam);
	}

	@Override
	public String checkHoliyday(String param) throws Exception {
		Map<String,Object> inputParam = this.input(param); 
		Map<String, Object> outParam = this.getLeaveService().checkHoliyday(inputParam);
		return this.out(outParam);
	}
	@Override
	public String getOrderCount(String param) throws Exception  {
		Map<String,Object> inputParam = this.input(param); 
		//Map<String,Object> outParam =this.getOutcommonService().getOrderCount(inputParam);
		Map<String,Object> outParam =this.getOutcommonService().getOrderCount(inputParam);
		return this.out(outParam);
	}
}