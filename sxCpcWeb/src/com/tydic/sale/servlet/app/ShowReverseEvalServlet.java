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

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
@WebServlet("/app/showEvalInfo.do")
public class ShowReverseEvalServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(ShowReverseEvalServlet.class);
	private static final long serialVersionUID = 1L;

	public ShowReverseEvalServlet() {
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
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

        HttpSession session = request.getSession();
        SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		String handleType = (String) reqParamMap.get("handleType");
		String latn_id=(String)systemUser.getRegionId();//(String)reqParamMap.get("latn_id")
		System.out.println("latn_id================"+latn_id);
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		if("qryHomePageInfo".equals(handleType)||"qryEvalDept".equals(handleType)){
			reqParamMap.put("SERVER_NAME", "queryReverseEvalInfo");
			reqParamMap.put("handleType", handleType);
			reqParamMap.put("latn_id", latn_id);
			//查询
			resultMap= super.crmService.dealObjectFun(reqParamMap);
		}else if("qryEvalManager".equals(handleType)||"qryUrgeOrg".equals(handleType)){//查询待评价的领导班子
			reqParamMap.put("SERVER_NAME", "queryReverseEvalInfo");
			reqParamMap.put("handleType", handleType);
			reqParamMap.put("latn_id", latn_id);
			reqParamMap.put("staff_id", systemUser.getStaffId());
			//查询
			resultMap= super.crmService.dealObjectFun(reqParamMap);
		}else if("submitEvalReverse".equals(handleType)){//提交评价结果
			Map<Object,Object> reqMap=new HashMap<Object, Object>();
			List<Map<String,Object>> evalList=new ArrayList<Map<String,Object>>();
			reqMap.put("SERVER_NAME", "queryReverseEvalInfo");
			reqMap.put("handleType", handleType);
			String webList=(String)reqParamMap.get("webList");
			List<Map> reverseList=null;
			if(!Tools.isNull(webList)){
				reverseList=this.toList(webList, Map.class);
				for(Map map:reverseList){
					Map<String, Object> parMap=new HashMap<String, Object>();
					parMap.put("eval_id", map.get("eval_id"));
					parMap.put("eval_name", map.get("eval_name"));
					parMap.put("eval_value", map.get("eval_value"));
					parMap.put("eval_type", map.get("eval_type"));
					parMap.put("opt_id", systemUser.getStaffId());
					parMap.put("opt_name", systemUser.getStaffName());
					parMap.put("latn_id", latn_id);
					evalList.add(parMap);
				}
			}
			reqMap.put("evalList", evalList);
			resultMap= super.crmService.dealObjectFun(reqMap);//提交评价结果
		}else if("sendUrgeMoney".equals(handleType)){//红包发放
			String staffName=String.valueOf(systemUser.getStaffName());
			reqParamMap.put("SERVER_NAME", "queryReverseEvalInfo");
			reqParamMap.put("send_id", systemUser.getStaffId());
			reqParamMap.put("send_name", staffName);
			reqParamMap.put("latn_id", latn_id);
			resultMap= super.crmService.dealObjectFun(reqParamMap);
			//发放成功后给激励员工发送短信
			String code=(String)resultMap.get("code");
			String unitName=(String)resultMap.get("unitName");
			if("0".equals(code)){
				Map<Object,Object> reqMap=new HashMap<Object, Object>();
				String mobTel=String.valueOf(reqParamMap.get("urge_mob_tel"));
				if(!Tools.isNull(mobTel)&&mobTel.length()==11){
					reqMap.put("busiNum", mobTel);
					reqMap.put("dept_name", unitName);
					reqMap.put("send_name", staffName);
					reqMap.put("money_num", reqParamMap.get("money_num"));
					reqMap.put("urge_desc", reqParamMap.get("urge_desc"));
					reqMap.put("smsModelId", "URGE-MONEY-NOTICE");
					Map map = crmService.sendSms(reqMap);
				}
				
			}
		}
		super.sendMessagesApp(request, response, resultMap);
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
