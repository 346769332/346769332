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
import com.tydic.sale.utils.JSONUtil;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;

@WebServlet("/sysManage/dealOrgAuthInfo.do")
public class DealOrgAuthInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(DealOrgAuthInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public DealOrgAuthInfoServlet() {
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String type=request.getParameter("type");
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String opt_id = systemUser.getStaffId();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("dealType",request.getParameter("dealType"));
		reqMap.put("id",request.getParameter("id"));
		
		Map<Object,Object> serMap =new HashMap<Object, Object>();
		if("query".equals(type)){
			reqMap.put("SERVER_NAME", "qryOrgAuthInfo");
			serMap = crmService.dealObjectFun(reqMap);
		}else if("save".equals(type)){
			reqMap.put("roleAuthInfoSet", request.getParameter("orgAuthInfoSet"));
			String newRoleAuthInfoStr = request.getParameter("orgAuthInfoSet");
			String oldRoleAuthInfoStr = request.getParameter("oldOrgAuthInfoSet");
			String new_content="";
			String old_content="";
			if(StringUtil.isNotEmpty(newRoleAuthInfoStr)){
				new_content=newRoleAuthInfoStr;
			}
			if(StringUtil.isNotEmpty(oldRoleAuthInfoStr)){
				old_content=oldRoleAuthInfoStr;
			}
			reqMap.put("opt_id", opt_id);
			reqMap.put("roleId", reqMap.get("role_id"));
			reqMap.put("opt_type", "UPDATE");
			reqMap.put("new_content",new_content);
			reqMap.put("old_content",old_content);
			reqMap.put("opt_desc", "组织机构权限指派");
			
			serMap = this.saveRoleAuthInfo(reqMap);
		}
		resultMap.putAll(serMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	/**
	 * 保存权限数据
	 * @param param
	 * @return
	 */
	private Map<Object,Object> saveRoleAuthInfo(Map<Object,Object> param){
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		resultMap.put("code", "1");
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("SERVER_NAME", "saveOrgAuthInfo");
		
		reqMap.put("id", param.get("id"));
		reqMap.put("dealType", param.get("dealType"));
		
		reqMap.put("rel_id", param.get("id"));
		reqMap.put("sys_type", param.get("dealType"));
		reqMap.put("opt_type", param.get("opt_type"));
		reqMap.put("new_content", param.get("new_content"));
		reqMap.put("old_content", param.get("old_content"));
		reqMap.put("opt_id", param.get("opt_id"));
		reqMap.put("opt_desc", param.get("opt_desc"));
		
		
		Object object= param.get("roleAuthInfoSet");
		if(StringUtil.objIsNotEmpty(object)){
			List<Map<String,Object>> roleAuthInfoList=new ArrayList<Map<String,Object>>();
			ArrayList<Map<String,Object>> tempRoleAuthList=(ArrayList<Map<String, Object>>) this.toList(object.toString(), Map.class);
			for (Map<String, Object> tempMap : tempRoleAuthList) {
				Map <String, Object> roleAuthMap=new HashMap<String, Object>();
				roleAuthMap.put("role_id", tempMap.get("ROLE_ID"));
				roleAuthMap.put("o_rel_id", reqMap.get("id"));
				roleAuthMap.put("o_type", reqMap.get("dealType"));
				roleAuthInfoList.add(roleAuthMap);
			}
			reqMap.put("roleAuthInfoSet", roleAuthInfoList);
			reqMap.put("roleAuthInfoSetSize", roleAuthInfoList.size());
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
