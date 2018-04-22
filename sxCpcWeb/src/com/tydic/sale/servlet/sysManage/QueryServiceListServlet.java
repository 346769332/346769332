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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.sun.org.apache.bcel.internal.generic.NEW;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.MD5Encrypt;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sysManage/queryServiceList.do")
public class QueryServiceListServlet extends AbstractServlet{

	private final static Logger logger = LoggerFactory.getLogger(QueryServiceListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryServiceListServlet() {
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
			reqMap.put("personnel_service", request.getParameter("personnel_service"));
			reqMap.put("personnel_type", request.getParameter("personnel_type"));
			reqMap.put("regionId",request.getParameter("latnId"));							
			reqMap.put("SERVER_NAME", "qryServiceInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
			
		}else if("update".equals(methodType)) {
			String poolId = request.getParameter("poolId");
			String loginCode = request.getParameter("loginCode");
			String mobTel = request.getParameter("mobTel");
			String personnel_service=request.getParameter("personnel_service");
			String new_content = request.getParameter("new_content");
			String old_content = request.getParameter("old_content");
			String old_logincode=old_content.split(",")[2].split(":")[1].replace("\"","");
			String old_service="";
			
			reqMap.clear();
			reqMap.put("poolId", poolId);
			reqMap.put("loginCode", loginCode);
			reqMap.put("mobTel", mobTel);
			reqMap.put("old_service", old_service);
			reqMap.put("old_logincode", old_logincode);
			reqMap.put("SERVER_NAME", "updateServiceInfo");
			
			reqMap.put("rel_id", poolId);
			reqMap.put("personnel_service", personnel_service);
			reqMap.put("sys_type", "POOL");
			reqMap.put("opt_type", "UPDATE");
			reqMap.put("new_content", new_content);
			reqMap.put("old_content", old_content);
			
			reqMap.put("opt_id", opt_id);
			reqMap.put("opt_desc", "修改接单池值班信息");
			
			Map<Object,Object> addMap = crmService.dealObjectFun(reqMap);
			if(!"0".equals(addMap.get("code"))) {
				resultMap.put("code", "1");
				resultMap.put("msg", "接单池值班信息修改失败");
			}else {
				resultMap.put("code", "0");
			}
		}
		
		super.sendMessages(response, JSON.toJSONString(resultMap));
		
	}
}
