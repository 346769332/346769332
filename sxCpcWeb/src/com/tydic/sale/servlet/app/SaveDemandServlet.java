package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryOderLstServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/app/saveDemand.do")
public class SaveDemandServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SaveDemandServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveDemandServlet() {
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
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		
		//是否对专业系统催单
		String outSysCui = String.valueOf(reqParamMap.get("isOutSysCui"));
		boolean isOutSysCui =false;
		if(!Tools.isNull(outSysCui)
				&& "Y".equals(outSysCui)){
			isOutSysCui = true;
		}
		Map<Object,Object> saveMap = new HashMap<Object,Object>();
		if(isOutSysCui){
			reqParamMap.put("tel",systemUser.getMobTel());
			reqParamMap.put("depName",systemUser.getOrgName());
			saveMap.put("out_flow_record_id", reqParamMap.get("flowRecordId"));
			Map<Object,Object> validateMap = this.crmService.valiBusiFlowRel(saveMap);
			//无需发单，退出
			if(Tools.isNull(validateMap) 
					|| !"0".equals(String.valueOf(validateMap.get("code")))){
				if(("0".equals(String.valueOf(validateMap.get("code"))) 
						&& "true".equals(String.valueOf(validateMap.get("code"))))){
					validateMap.put("msg", "无需生成，已经生成紧急催单，请在“流程流转中”跟进查看！");
				}
				super.sendMessagesApp(request,response,  validateMap);
				return;
			}
		}
		
		Map<Object,Object> demandInfo  = new HashMap<Object,Object>();
		
		String demandId = String.valueOf(reqParamMap.get("demandId"));
		demandInfo.put("demand_id", demandId);
		
		demandInfo.put("up_photo_names", String.valueOf(reqParamMap.get("up_photo_names")));
		
		demandInfo.put("demand_theme", String.valueOf(reqParamMap.get("theme")));
		demandInfo.put("demand_details", String.valueOf(reqParamMap.get("desc"))); 
		demandInfo.put("tel", String.valueOf(reqParamMap.get("tel")));
		demandInfo.put("department", String.valueOf(reqParamMap.get("depName")));
		demandInfo.put("optId", String.valueOf(reqParamMap.get("operator_id")));
		demandInfo.put("optName", String.valueOf(reqParamMap.get("operator_name")));
		demandInfo.put("rankId", String.valueOf(reqParamMap.get("rank_id")));
		demandInfo.put("rankName", String.valueOf(reqParamMap.get("rank_name")));
		demandInfo.put("department_id", systemUser.getDepartmentCode());
		demandInfo.put("promoters_id", systemUser.getStaffId());
		demandInfo.put("promoters", systemUser.getStaffName());
		demandInfo.put("region_code",systemUser.getRegionId());
		
		String demandType = String.valueOf(reqParamMap.get("demandType"));
		
		//发起前需求单号已经生成，草稿箱发起的和正常发起的无区别
		/*if(demandType.equals("1") && !Tools.isNull(demandId)){
			demandType = "3";
		}*/
		System.out.println(demandInfo);
		Map<Object,Object> resultMap = super.crmService.submitDemandInfo(demandInfo, demandType);
		
		demandId = String.valueOf(resultMap.get("demandId"));
		//记录催单需求单与专业系统关联关系
		if(isOutSysCui){
			saveMap.put("demand_id", demandId);//
			super.crmService.saveBusiFlowRel(saveMap);
		}
		//工单提交成功后，保存附件
		 if("0".equals(resultMap.get("code"))){
			 String fileListInfo=String.valueOf(reqParamMap.get("fileList"));
			 List<Map<Object,Object>> fileList=new ArrayList<Map<Object,Object>>();
			 if(!Tools.isNull(fileListInfo)){
				 fileList=this.toList(fileListInfo, Map.class);
				 for(Map<Object,Object> map:fileList){
						map.put("SERVER_NAME", "uploadDemandImages");
						crmService.dealObjectFun(map);
				 }
			 }
		 }
		/*//非草稿 发短信
		if(!"3".equals(demandType)){
			//this.c
			Map<Object,Object> demandInfoMap = this.crmService.searchDemandInfo(demandId, "N");
			if(!Tools.isNull(demandInfoMap) && String.valueOf(demandInfoMap.get("code")).equals("0")){
				Map<Object,Object> demandInst = (Map<Object, Object>) demandInfoMap.get("demandInst");
				List<Map<Object,Object>> recordSet = (List<Map<Object, Object>>) demandInfoMap.get("recordSet");
				Map<Object,Object> recordMap = recordSet.get(0);
				try {
					String mobTel = String.valueOf(recordMap.get("mob_tel"));
					Long.valueOf(mobTel);
					Map<Object,Object> smsMap = new HashMap<Object,Object>();
					smsMap.put("busiNum"	, mobTel);
					smsMap.put("busiId"		, demandId);
					smsMap.put("loginCode"	, systemUser.getLoginCode());
					smsMap.put("smsModelId"	, "DEMAND-XCEOFQ");
					smsMap.put("demandTheme", demandInst.get("demand_theme"));
					resultMap.put("msg", crmService.sendSms(smsMap).get("msg"));
				} catch (NumberFormatException e) {
					resultMap.put("msg", "发送成功，未能发短信通知处理人，用户：“"+recordMap.get("curr_node_name")+"”手机号码非数字，请联系管理员");
				}
			}
		}*/
		
		super.sendMessagesApp(request,response,  resultMap);
	}
	private static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
	}
}
