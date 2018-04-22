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

@WebServlet("/sysManage/dealRoleUserInfo.do")
public class DealRoleUserInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DealRoleUserInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DealRoleUserInfoServlet() {
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("role_id",request.getParameter("roleId"));
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		if("query".equals(type)){
			reqMap.put("serch_type",request.getParameter("serch_type"));
			reqMap.put("latnId",request.getParameter("latnId"));
			reqMap.put("departmentId",request.getParameter("departmentId"));
			reqMap.put("departmentName",request.getParameter("departmentName"));
			reqMap.put("staffName",request.getParameter("staffName"));
			reqMap.put("pageIndex",request.getParameter("pageIndex"));
			reqMap.put("pageSize",request.getParameter("pageSize"));
			if(StringUtil.objIsNotEmpty(request.getParameter("limit"))){
				reqMap.put("limit",request.getParameter("limit"));
			}
			reqMap.put("SERVER_NAME", "queryRoleUserInfo");
			serMap = crmService.dealObjectFun(reqMap);
		}else if("save".equals(type)){
			reqMap.put("roleUserInfoSet", request.getParameter("roleUserInfoSet"));
			serMap = this.saveRoleUserInfo(reqMap);
		}
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	/**
	 * 保存权限数据
	 * @param param
	 * @return
	 */
	private Map<Object,Object> saveRoleUserInfo(Map<Object,Object> param){
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		resultMap.put("code", "1");
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("SERVER_NAME", "saveRoleUserInfo");
		reqMap.put("opt_id", param.get("opt_id"));
		reqMap.put("role_id", param.get("role_id"));
		Object object= param.get("roleUserInfoSet");
		if(StringUtil.objIsNotEmpty(object)){
			List<Map<String,Object>> roleUserInfoList=new ArrayList<Map<String,Object>>();
			ArrayList<Map<String,Object>> tempRoleUserList=(ArrayList<Map<String, Object>>) this.toList(object.toString(), Map.class);
			for (Map<String, Object> tempMap : tempRoleUserList) {
				Map <String, Object> roleUserMap=new HashMap<String, Object>();
				roleUserMap.put("role_id", reqMap.get("role_id"));
				roleUserMap.put("o_rel_id", tempMap.get("data_id"));
				roleUserMap.put("o_type", tempMap.get("data_type"));
				roleUserInfoList.add(roleUserMap);
			}
			reqMap.put("roleUserInfoSet", roleUserInfoList);
			reqMap.put("roleUserInfoSetSize", roleUserInfoList.size());
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
