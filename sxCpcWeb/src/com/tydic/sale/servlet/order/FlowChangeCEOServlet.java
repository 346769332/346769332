package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
@WebServlet("/order/flowChangeCeo.do")
public class FlowChangeCEOServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(FlowChangeCEOServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public FlowChangeCEOServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object,Object> reqParamMap  = new HashMap<Object, Object>();
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String opt = request.getParameter("opt");
		String demand_id = request.getParameter("demand_id");
		String over_eval = request.getParameter("over_eval");
		String eval_time = request.getParameter("eval_time");
		String eval_atti = request.getParameter("eval_atti");
		String over_opinion = request.getParameter("over_opinion");
		String demand_theme = request.getParameter("demand_theme");
		String curr_node_id = request.getParameter("curr_node_id");
		String curr_node_name = request.getParameter("curr_node_name");
		String curr_record_id = request.getParameter("curr_record_id");
		String opt_id = request.getParameter("opt_id");
		String opt_name = request.getParameter("opt_name");
		String mob_tel = request.getParameter("mob_tel");
		reqParamMap.put("over_eval"     , over_eval);
		reqParamMap.put("over_opinion"  , over_opinion);
		reqParamMap.put("demand_theme"  , demand_theme);
		reqParamMap.put("demand_id"     , demand_id);
		reqParamMap.put("curr_record_id", curr_record_id);
		reqParamMap.put("curr_node_id"  , curr_node_id);
		reqParamMap.put("curr_node_name", curr_node_name);
		reqParamMap.put("opt_id"		, opt_id);
		reqParamMap.put("opt_name"		, opt_name);
		reqParamMap.put("mob_tel"		, mob_tel);

		String pase_opt_id = request.getParameter("pase_opt_id");
		String pase_opt_name = request.getParameter("pase_opt_name");
		String pase_opt_org =request.getParameter("pase_opt_org");
		String pase_mob_tel = request.getParameter("pase_mob_tel");
		String pase_staff_id=request.getParameter("pase_staff_id");
		String pase_org_id=request.getParameter("pase_org_id");
		String isProvince=request.getParameter("isProvince");
		reqParamMap.put("pase_opt_id"   , pase_opt_id);
		reqParamMap.put("pase_opt_name" , pase_opt_name);
		reqParamMap.put("pase_node_id"  , request.getParameter("pase_node_id"));
		reqParamMap.put("pase_node_name", request.getParameter("pase_node_name"));
		reqParamMap.put("pase_mob_tel"  , pase_mob_tel);
		
		Map<Object,Object> demand = new HashMap<Object,Object>();
		demand.put("demand_id"		, demand_id);
		demand.put("over_opinion"	, over_opinion);
		demand.put("demand_theme"	, demand_theme);
		String now = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
		Map<Object,Object> cpcFlowRecord = new HashMap<Object,Object>();
		cpcFlowRecord.put("busi_id"		, demand_id);
		cpcFlowRecord.put("opt_desc"	, over_opinion);
		cpcFlowRecord.put("curr_node_id", curr_node_id);
		cpcFlowRecord.put("curr_node_name", curr_node_name);
		cpcFlowRecord.put("opt_time"	, now);
		cpcFlowRecord.put("record_id"	, curr_record_id);
		//保存当前环节处理人信息
		cpcFlowRecord.put("staff_id", systemUser.getStaffId());
		cpcFlowRecord.put("staff_name", systemUser.getStaffName());
		cpcFlowRecord.put("department_id", systemUser.getOrgId());
		cpcFlowRecord.put("department_name", systemUser.getOrgName());
		cpcFlowRecord.put("mob_tel", systemUser.getMobTel());
		Map<Object,Object> reqMap = new HashMap<Object,Object>();
		if("1".equals(opt)){ //星级评价
			demand.put("eval_time", eval_time);
			demand.put("over_eval", over_eval);
			demand.put("eval_atti", eval_atti);
			demand.put("over_time", now);
			cpcFlowRecord.put("funTypeId", "100017");
			cpcFlowRecord.put("opt_id"   , opt_id);
			cpcFlowRecord.put("opt_name" , opt_name);
		}else if("-1".equals(opt)){	//打回
			cpcFlowRecord.put("funTypeId"   , "100016");
			cpcFlowRecord.put("nowLoginCode", systemUser.getLoginCode());
			String paseName=pase_opt_name;
			System.out.println("==============="+pase_opt_id+"============="+pase_opt_name);
			boolean idFlag = pase_opt_id.indexOf("-")>0;
			boolean nameFlag=pase_opt_name.indexOf("-")>0;
			if(idFlag){//西安的打回
				if(nameFlag)
				   paseName=pase_opt_name.split("-")[0];//取部门
			}else{
				if(nameFlag)
					   paseName=pase_opt_name.split("-")[1];//取员工
			}
			cpcFlowRecord.put("opt_id"		, pase_opt_id);
			cpcFlowRecord.put("opt_name"	, paseName);
		}
		reqMap.put("handleType"		, "demandFlow");
		reqMap.put("cpcDemand"		, demand);
		reqMap.put("cpcFlowRecord"	, cpcFlowRecord);
 		
		Map<Object,Object> resultMap = super.crmService.flowExchange(reqMap);
		
		//打回：成功发送短信
		if("-1".equals(opt)
				&& "0".equals(String.valueOf(resultMap.get("code")))){
			if(!Tools.isNull(pase_mob_tel)){
				try {
					Map<Object,Object> staffSearch = new HashMap<Object,Object>();
					staffSearch.put("staffId", pase_staff_id);
					staffSearch = this.crmService.getStaffInfo(staffSearch);
					if(!String.valueOf(staffSearch.get("code")).equals("0")){
						resultMap.put("msg", "未能发送短信通知处理人，用户：“"+pase_opt_name+"”的登录账号信息未查到，请联系管理员");
					}else{
						Map<Object,Object> staff = (java.util.Map<Object, Object>) staffSearch.get("staff");
						Long.valueOf(pase_mob_tel);
						Map<Object,Object> smsMap = new HashMap<Object,Object>();
						smsMap.put("busiNum"	, pase_mob_tel);
						smsMap.put("busiId"		, demand_id);
						smsMap.put("loginCode"	, staff.get("login_code"));
						smsMap.put("smsModelId"	, "DEMAND-XCEODH");
						if(demand_theme.length() > 20){
							smsMap.put("demandTheme", demand_theme.substring(0, 20) + "...");
						}else{
							smsMap.put("demandTheme", demand_theme);
						}
						resultMap.put("msg", crmService.sendSms(smsMap).get("msg"));
					}
				} catch (NumberFormatException e) {
					resultMap.put("msg", "未能发送短信通知处理人，用户：“"+pase_opt_name+"”手机号码非数字，请联系管理员");
				}
				
			}else{
				resultMap.put("msg", "未能发送短信通知处理人，无法定位：“"+pase_opt_name+"”手机号码，请联系管理员");
			}
			System.out.println("pase_org_id========开始发送短信============"+pase_org_id);
			String lastDeptName=null;
			//打回时发送越级短信
			if(!Tools.isNull(pase_org_id)){
				System.out.println("pase_org_id========开始发送短信============"+pase_org_id);
				Map<Object,Object> deptStaffInfo = new HashMap<Object,Object>();
				deptStaffInfo.put("org_id", pase_org_id);//上一环节的处理人部门
				deptStaffInfo = this.crmService.qryDeptStaffInfo(deptStaffInfo);
				if(!Tools.isNull(deptStaffInfo.get("staff"))){
					Map<Object,Object> boss = (java.util.Map<Object, Object>)deptStaffInfo.get("staff");
					lastDeptName=String.valueOf(boss.get("ORG_NAME"));
					Map<Object,Object> smsMap = new HashMap<Object,Object>();
					smsMap.put("busiNum"	, boss.get("LOGIN_CODE"));
					smsMap.put("busiId"		, demand_id);
					smsMap.put("secondName"	, boss.get("SECOND_NAME"));
					smsMap.put("orgName"	, boss.get("ORG_NAME"));
					smsMap.put("smsModelId"	, "DEMAND-CEO-BACK-DEPT");
					if(demand_theme.length() > 20){
						smsMap.put("demandTheme", demand_theme.substring(0, 20) + "...");
					}else{
						smsMap.put("demandTheme", demand_theme);
					}
					this.crmService.sendSms(smsMap);
				}
				
			}
			//有省公司的人处理的单子并且是西安本地的，要给省领导发送短信
			if("true".equals(isProvince)&&"290".equals(systemUser.getRegionCode())){
				System.out.println("pase_org_id========开始发送短信============"+pase_org_id);
				Map<Object,Object> deptStaffInfo = new HashMap<Object,Object>();
				deptStaffInfo.put("org_id", "18092880018");//总经理
				deptStaffInfo = this.crmService.qryDeptStaffInfo(deptStaffInfo);
				if(!Tools.isNull(deptStaffInfo.get("staff"))){
					Map<Object,Object> boss = (java.util.Map<Object, Object>) deptStaffInfo.get("staff");
					Map<Object,Object> smsMap = new HashMap<Object,Object>();
					smsMap.put("busiNum"	, boss.get("LOGIN_CODE"));
					smsMap.put("busiId"		, demand_id);
					smsMap.put("secondName"	, boss.get("SECOND_NAME"));
					smsMap.put("orgName"	, lastDeptName);
					smsMap.put("smsModelId"	, "DEMAND-CEO-BACK-DEPT");
					if(demand_theme.length() > 20){
						smsMap.put("demandTheme", demand_theme.substring(0, 20) + "...");
					}else{
						smsMap.put("demandTheme", demand_theme);
					}
					this.crmService.sendSms(smsMap);
				}
				
			}
		}
		//已撤回短息
		if("2".equals(opt)
				&& "0".equals(String.valueOf(resultMap.get("code")))){
			if(!Tools.isNull(mob_tel)){
				try {
					Map<Object,Object> staffSearch = new HashMap<Object,Object>();
					staffSearch.put("staffId", opt_id);
					staffSearch = this.crmService.getStaffInfo(staffSearch);
					if(!String.valueOf(staffSearch.get("code")).equals("0")){
						resultMap.put("msg", "未能发送短信通知处理人，用户：“"+opt_name+"”的登录账号信息未查到，请联系管理员");
					}else{
						Map<Object,Object> staff = (java.util.Map<Object, Object>) staffSearch.get("staff");
						Long.valueOf(mob_tel);
						Map<Object,Object> smsMap = new HashMap<Object,Object>();
						smsMap.put("busiNum"	, pase_mob_tel);
						smsMap.put("busiId"		, demand_id);
						smsMap.put("org", pase_opt_org);
						smsMap.put("pase_opt_name", opt_name);
						//smsMap.put("loginCode"	, staff.get("login_code"));
						smsMap.put("smsModelId"	, "DEMAND-XCEOCX");
						if(demand_theme.length() > 20){
							smsMap.put("demandTheme", demand_theme.substring(0, 20) + "...");
						}else{
							smsMap.put("demandTheme", demand_theme);
						}
						resultMap.put("msg", crmService.sendSms(smsMap).get("msg"));
					}
				} catch (NumberFormatException e) {
					resultMap.put("msg", "未能发送短信通知处理人，用户：“"+opt_name+"”手机号码非数字，请联系管理员");
				}
				
			}else{
				resultMap.put("msg", "未能发送短信通知处理人，无法定位：“"+opt_name+"”手机号码，请联系管理员");
			}
		}
		super.sendMessagesApp(request,response,  resultMap);
	}
}
