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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/app/updateDemandInfo.do")
public class UpdateDemandInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(UpdateDemandInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateDemandInfoServlet() {
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
		
		Map<Object,Object> resultMap = super.crmService.urgedDemand(reqParamMap);
		
		
		//发送【催单】短信
		if(!Tools.isNull(reqParamMap.get("isUrge"))
				&& "Y".equals(String.valueOf(reqParamMap.get("isUrge")))){
			if(!Tools.isNull(reqParamMap.get("curr_mob_tel"))){
				try {
					String currOptId = String.valueOf(reqParamMap.get("curr_opt_id"));
					if(!Tools.isNull(reqParamMap.get("default_opt_id"))){
						currOptId = String.valueOf(reqParamMap.get("default_opt_id"));
					}
					
					Map<Object,Object> staffSearch = new HashMap<Object,Object>();
					staffSearch.put("staffId", currOptId);
					staffSearch = this.crmService.getStaffInfo(staffSearch);
					if(!String.valueOf(staffSearch.get("code")).equals("0")){
						resultMap.put("msg", "未能发送短信通知处理人，用户：“"+reqParamMap.get("curr_opt_name")+"”的登录账号信息未查到，请联系管理员");
					}else{
						String loginCode = "";
						//是否员工
						if(!Tools.isNull(staffSearch.get("staff"))
								&& staffSearch.get("staff") instanceof Map){
							Map<Object,Object> staff = (java.util.Map<Object, Object>) staffSearch.get("staff");
							loginCode = String.valueOf(staff.get("login_code"));
						}
						//是否综支中心
						else{
							staffSearch.put("pool_id", reqParamMap.get("curr_opt_id"));
							Map<Object,Object> poolMap = this.crmService.getPool(staffSearch);
							if(String.valueOf(poolMap.get("code")).equals("0")
									&& !Tools.isNull(poolMap.get("pool"))
									&& (poolMap.get("pool") instanceof Map)){
								Map<Object,Object> pool = (java.util.Map<Object, Object>) poolMap.get("pool");
								loginCode = String.valueOf(pool.get("login_code"));
							}
						}
						
						if(!"".equals(loginCode)){
							Long.valueOf(String.valueOf(reqParamMap.get("curr_mob_tel")));
							Map<Object,Object> smsMap = new HashMap<Object,Object>();
							String demandTheme = String.valueOf(reqParamMap.get("demand_theme"));
							demandTheme = demandTheme.length()>20 ? demandTheme.substring(0, 20) + "..." : demandTheme;
							smsMap.put("busiNum"	, reqParamMap.get("curr_mob_tel"));
							smsMap.put("busiId"		, reqParamMap.get("demand_id"));
							smsMap.put("loginCode"	, loginCode);
							smsMap.put("smsModelId"	, "DEMAND-XCEOCD");
							smsMap.put("demandTheme", demandTheme);
							resultMap.put("msg", crmService.sendSms(smsMap).get("msg"));
						}else{
							resultMap.put("msg", "未能发送短信通知处理人，用户：“"+reqParamMap.get("curr_opt_name")+"”的登录账号信息未查到，请联系管理员");
						}
					}
				} catch (NumberFormatException e) {
					resultMap.put("msg", "未能发送短信通知处理人，用户：“"+reqParamMap.get("curr_opt_name")+"”手机号码非数字，请联系管理员");
				}
				
			}else{
				resultMap.put("msg", "未能发送短信通知处理人，无法定位：“"+reqParamMap.get("curr_opt_name")+"”手机号码，请联系管理员");
			}
		}
		 
		super.sendMessagesApp(request,response,  resultMap);
	}
}
