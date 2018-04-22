package com.tydic.sale.servlet.shortProcess;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
/**
 * 新建短流程
 * @author dangzw 2016-10-08
 */
@WebServlet("/shortProcess/updateDemandInfo.do")
public class UpdateDemandInfoServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateDemandInfoServlet() {
		super();
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		 Map<Object,Object> resultMap = new HashMap<Object, Object>();
		 //####################催单
		 Map<Object,Object> paramMap = new HashMap<Object, Object>(); 			
			//遍历前台js传递参数
			for(Iterator<String> it = request.getParameterMap().keySet().iterator(); it.hasNext();){
				String key = String.valueOf(it.next());
				paramMap.put(key, request.getParameter(key));
			}	
			 paramMap.put("SERVER_NAME", "updatedemandinfo");
				Map<Object,Object> serMap=crmService.dealObjectFun(paramMap);			
				if(serMap.get("code").equals("0")){	
					resultMap.put("code", serMap.get("code"));
					Map<Object,Object> staffSearch = new HashMap<Object,Object>();
					//处理人Id
					staffSearch.put("staffId", paramMap.get("opt_id").toString());
					//处理人信息
					staffSearch = this.crmService.getStaffInfo(staffSearch);
					 //####################催单发短信
					if(!String.valueOf(staffSearch.get("code")).equals("0")){
						resultMap.put("cuo", "未能发送短信通知处理人，用户：“"+paramMap.get("opt_name")+"”的登录账号信息未查到，请联系管理员");
					}else{
						//处理人信息接受
						Map<Object,Object> staff = (java.util.Map<Object, Object>) staffSearch.get("staff");
						//######登录工号
						String loginCode = String.valueOf(staff.get("login_code"));
						 if(!"".equals(loginCode)){											
								Map<Object,Object> smsMap = new HashMap<Object,Object>();							
								smsMap.put("busiNum"	, staff.get("mob_tel"));
								smsMap.put("busiId"		, paramMap.get("demand_id"));
								smsMap.put("loginCode"	, loginCode);
								smsMap.put("smsModelId"	, "DEMAND-CUIDAN");
								smsMap.put("demandTheme",  paramMap.get("demand_name"));
								crmService.sendSms(smsMap);
								
							}
						 else{
								resultMap.put("cuo", "未能发送短信通知处理人，用户：“"+paramMap.get("opt_name")+"”的登录账号信息未查到，请联系管理员");
							}
						 
					}					
					
				}else{
					resultMap.put("code", "1");
					resultMap.put("cuo", "催单异常");
				}
				super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
