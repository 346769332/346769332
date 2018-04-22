package com.tydic.sale.servlet.sysManage;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.shiro.crypto.hash.Sha512Hash;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.sun.org.apache.bcel.internal.generic.NEW;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.MD5Encrypt;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sysManage/queryStaffList.do")
public class QueryStaffListServlet extends AbstractServlet{

	private final static Logger logger = LoggerFactory.getLogger(QueryStaffListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryStaffListServlet() {
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

		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String opt_id = systemUser.getStaffId();
		
		String methodType = request.getParameter("methodType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		
		if("query".equals(methodType)) {
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			
			reqMap.put("regionId",request.getParameter("latnId"));
			
			reqMap.put("orgId",request.getParameter("orgId"));
			
			reqMap.put("state", request.getParameter("state"));
			reqMap.put("loginCode", request.getParameter("loginCode"));
			reqMap.put("staffName", request.getParameter("staffName"));
			reqMap.put("department", request.getParameter("staffOrg"));
			
			reqMap.put("SERVER_NAME", "qryStaffInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
			
		}else if("add".equals(methodType)) {
			String staffName = request.getParameter("staffName");
			String loginCode = request.getParameter("loginCode");
			String password = request.getParameter("pwd");
			String tel = request.getParameter("tel");
			String email = request.getParameter("email");
			String departmentName = request.getParameter("department");
			String departmentCode = request.getParameter("departmentCode");
			String state = request.getParameter("state");
			String latnId = request.getParameter("latnId");

			//校验loginCode唯一性
			reqMap.clear();
			reqMap.put("SERVER_NAME", "checkLoginCode");
			reqMap.put("loginCode", loginCode);
			Map<Object, Object> checkLoginCodeMap = crmService.dealObjectFun(reqMap);
			if(!"0".equals(checkLoginCodeMap.get("code"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "校验登陆账号异常");
				super.sendMessages(response, JSON.toJSONString(resultMap));
				return;
			}
			if(!"0".equals(checkLoginCodeMap.get("count"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "账号已存在");
				super.sendMessages(response, JSON.toJSONString(resultMap));
				return;
			}
			
			//生成staffId
			int staffId ;
			reqMap.clear();
			reqMap.put("SERVER_NAME", "qryMaxStaffId");
			Map<Object, Object> qryMaxStaffIdMap = crmService.dealObjectFun(reqMap);
			if(!"0".equals(qryMaxStaffIdMap.get("code"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "查询工号异常");
				super.sendMessages(response, JSON.toJSONString(resultMap));
				return;
			}
			int stfId = Integer.parseInt(String.valueOf(qryMaxStaffIdMap.get("maxStaffId")));
			if(stfId < 40000) {
				staffId = 40001;
			}else {
				staffId = stfId + 1;
			}
			
			String pwd = new Sha512Hash(password).toBase64();
			
			//生成新增工号数据
			reqMap.clear();
			reqMap.put("staffId", staffId);
			reqMap.put("staffName", staffName);
			reqMap.put("loginCode", loginCode);
			reqMap.put("pwd", pwd);
			reqMap.put("tel", tel);
			reqMap.put("email", email);
			reqMap.put("departmentName", departmentName);
			reqMap.put("departmentCode", departmentCode);
			reqMap.put("state", state);
			reqMap.put("latnId", latnId);
			reqMap.put("SERVER_NAME", "addStaffInfo");
			
			reqMap.put("rel_id", loginCode);
			reqMap.put("sys_type", "STAFF");
			reqMap.put("opt_type", "ADD");
			reqMap.put("new_content", "");
			reqMap.put("old_content", "");
			reqMap.put("opt_id", opt_id);
			reqMap.put("opt_desc", "新增工号信息");
			
			Map<Object,Object> addMap = crmService.dealObjectFun(reqMap);
			if(!"0".equals(addMap.get("code"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "保存失败");
			}else {
				resultMap.put("code", "0");
			}
			
		}else if("update".equals(methodType)) {
			String staffId = request.getParameter("staffId");
			String staffName = request.getParameter("staffName");
			String tel = request.getParameter("tel");
			String email = request.getParameter("email");
			String department = request.getParameter("department");
			String departmentCode = request.getParameter("departmentCode");
			String state = request.getParameter("state");
			
			String new_content = request.getParameter("new_content");
			String old_content = request.getParameter("old_content");
			
			reqMap.clear();
			reqMap.put("staffId", staffId);
			reqMap.put("staffName", staffName);
			reqMap.put("tel", tel);
			reqMap.put("email", email);
			reqMap.put("department", department);
			reqMap.put("departmentCode", departmentCode);
			reqMap.put("state", state);
			reqMap.put("SERVER_NAME", "updateStaffState");
			
			reqMap.put("rel_id", staffId);
			reqMap.put("sys_type", "STAFF");
			reqMap.put("opt_type", "UPDATE");
			reqMap.put("new_content", new_content);
			reqMap.put("old_content", old_content);
			reqMap.put("opt_id", opt_id);
			reqMap.put("opt_desc", "修改工号状态");
			
			Map<Object,Object> addMap = crmService.dealObjectFun(reqMap);
			if(!"0".equals(addMap.get("code"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "工号状态修改失败");
			}else {
				resultMap.put("code", "0");
			}
		}
		
		super.sendMessages(response, JSON.toJSONString(resultMap));
		
	}
}
