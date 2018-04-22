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
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sysManage/queryOrganisationList.do")
public class QueryOrganisationListServlet extends AbstractServlet{

	private final static Logger logger = LoggerFactory.getLogger(QueryOrganisationListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryOrganisationListServlet() {
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
		
		if("queryOrg".equals(methodType)) {
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			
			reqMap.put("regionId",request.getParameter("latnId"));
			reqMap.put("orgId", request.getParameter("orgId"));
			reqMap.put("orgName", request.getParameter("orgName"));
			reqMap.put("orgState", request.getParameter("orgState"));
			reqMap.put("org_flag", request.getParameter("org_flag"));
			reqMap.put("professional", request.getParameter("professional"));
			
			reqMap.put("SERVER_NAME", "queryOrganisationList");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
			
		}else if("addOrg".equals(methodType)) {
			String pOrgId = request.getParameter("pOrgId");
			String latnId = request.getParameter("latnId");
			String orgName = request.getParameter("orgName");
			String orgState = request.getParameter("orgState");
			
			
			String orgId = null;
			
			reqMap.put("pid", pOrgId);
			reqMap.put("latnId", latnId);
			reqMap.put("orgName", orgName);
			reqMap.put("state", orgState);
			
			if(pOrgId == null || "".equals(pOrgId)) {
				orgId = request.getParameter("orgId");
				reqMap.put("orgId", orgId);
			}else {
				reqMap.put("SERVER_NAME", "qryMaxOrgId");
				Map<Object, Object> qryMaxOrgIdMap = crmService.dealObjectFun(reqMap);
				if(!"0".equals(qryMaxOrgIdMap.get("code"))) {
					resultMap.put("code", "1");
					super.sendMessages(response, JSON.toJSONString(resultMap));
					return;
				}else {
					int orgIdNew;
					if("".equals(qryMaxOrgIdMap.get("maxOrgId")) || qryMaxOrgIdMap.get("maxOrgId") == null) {
						orgId = pOrgId + "-001";
					}else {
						orgIdNew =  Integer.parseInt(String.valueOf(qryMaxOrgIdMap.get("maxOrgId")))+1;
						
						int len = new Integer(orgIdNew).toString().length();
						String orgIdNewStr = "";
				        switch (len) {
				        case 1:
				        	orgIdNewStr="00"+orgIdNew;
				            break;
				        case 2:
				        	orgIdNewStr="0"+orgIdNew;
				            break;
				        default:
				        	orgIdNewStr=orgIdNew+"";
				            break;
				        }
						orgId = pOrgId + "-" +orgIdNewStr;
					}
					reqMap.put("orgId", orgId);
				}
			}
			
			reqMap.put("rel_id", orgId);
			reqMap.put("sys_type", "ORG");
			reqMap.put("opt_type", "ADD");
			reqMap.put("new_content", "");
			reqMap.put("old_content", "");
			reqMap.put("opt_id", opt_id);
			reqMap.put("opt_desc", "新增组织机构");
			
			Map<Object,Object> addMap = crmService.addOrgInfo(reqMap);
			if(!"0".equals(addMap.get("code"))) {
				resultMap.put("code", "1");
			}else {
				resultMap.put("code", "0");
				
			}
			
		}
		
		super.sendMessages(response, JSON.toJSONString(resultMap));
		
	}
}
