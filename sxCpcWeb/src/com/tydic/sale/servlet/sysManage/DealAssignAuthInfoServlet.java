package com.tydic.sale.servlet.sysManage;

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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;

@WebServlet("/sysManage/dealAssignAuthInfo.do")
public class DealAssignAuthInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DealAssignAuthInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DealAssignAuthInfoServlet() {
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
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String type=request.getParameter("type");
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("opt_id",systemUser.getStaffId());
		reqMap.put("auth_id",request.getParameter("authId"));
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		if("query".equals(type)){
			reqMap.put("SERVER_NAME", "queryAssignAuthInfo");
			serMap = crmService.dealObjectFun(reqMap);
		}
		else if("save".equals(type)){
			reqMap.put("assignAuthInfoSet", request.getParameter("assignAuthInfoSet"));
			serMap = this.saveAssignAuthInfo(reqMap);
		}
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	/**
	 * 保存数据
	 * @param param
	 * @return
	 */
	private Map<Object, Object> saveAssignAuthInfo(Map<Object, Object> param) {
		// TODO Auto-generated method stub
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		resultMap.put("code", "1");
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("SERVER_NAME", "saveAssignAuthInfo");
		reqMap.put("opt_id", param.get("opt_id"));
		reqMap.put("auth_id", param.get("auth_id"));
		Object object= param.get("assignAuthInfoSet");
		if(StringUtil.objIsNotEmpty(object)){
			List<Map<String,Object>> assignAuthInfoList=new ArrayList<Map<String,Object>>();
			ArrayList<Map<String,Object>> tempAssignAuthList=(ArrayList<Map<String, Object>>) this.toList(object.toString(), Map.class);
			for (Map<String, Object> tempMap : tempAssignAuthList) {
				Map <String, Object> assignAuthMap=new HashMap<String, Object>();
				assignAuthMap.put("a_id", reqMap.get("auth_id"));
				assignAuthMap.put("f_rel_id", tempMap.get("data_id"));
				assignAuthMap.put("f_type", tempMap.get("data_type"));
				assignAuthMap.put("f_status", "Y");
				assignAuthInfoList.add(assignAuthMap);
			}
			reqMap.put("assignAuthInfoSet", assignAuthInfoList);
			reqMap.put("assignAuthInfoSetSize", assignAuthInfoList.size());
			resultMap=crmService.dealObjectFun(reqMap);
		}
		return resultMap;
	}
	private  List toList(String jsonString, Class cla) {
		jsonString=jsonString.replaceAll("\"\"\"\"", "\"\'\'\"");
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}
		return lists;
	}

}
