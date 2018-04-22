package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.HashMap;
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


@WebServlet("/app/RegionStaff.do")
public class RegionStaffServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(RegionStaffServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public RegionStaffServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		Map<Object,Object> dataMap=super.getReqParamMap(request);
		//手机端作单独的处理
		reqMap.put("pid", String.valueOf(dataMap.get("pid")));
		String method=String.valueOf(dataMap.get("method"));
		String isProvince=String.valueOf(dataMap.get("isProvince"));
		String ceoType=String.valueOf(dataMap.get("ceoType"));
		String fourCenter=String.valueOf(dataMap.get("fourCenter"));//显示中心下的部门
		String qryType=String.valueOf(dataMap.get("qryType"));//显示专业部门
		String proDept=String.valueOf(dataMap.get("proDept"));//服务单内部转派时不显示当前登录人
		String optDefault=String.valueOf(dataMap.get("optDefault"));//只显示默认接单人
		HttpSession session = request.getSession();
		SystemUser sysUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
//		SystemUser sysUser = (SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> demMap = new HashMap<Object,Object>();
 		try {
			if ("getSysOrg".equals(method)) {
				//reqMap.put("region_code", sysUser.getRegionCode());
				reqMap.put("region_code", sysUser.getRegionId());
				reqMap.put("org_name", dataMap.get("search_org_name"));
				if(!Tools.isNull(qryType)){
					reqMap.put("qryType", qryType);
				}
				if ("true".equals(ceoType)){
					reqMap.put("SERVER_NAME", "getCeoSysOrg");
					demMap = crmService.dealObjectFun(reqMap);
				}else if("true".equals(proDept)){
					reqMap.put("org_id", sysUser.getOrgId());
					reqMap.put("SERVER_NAME", "getDeptSysOrg");
					demMap = crmService.dealObjectFun(reqMap);
				}else if("true".equals(fourCenter)){
					reqMap.put("deptType", "centerDept");
					reqMap.put("orgName", sysUser.getOrgName());
					demMap = crmService.getSysOrg(reqMap);
				} else {
					String org_flag = String.valueOf(dataMap.get("org_flag"));
					if (!Tools.isNull(org_flag)) {
						reqMap.put("org_flag", org_flag);
					}
					demMap = crmService.getSysOrg(reqMap);
				}

			} else if ("getStaffByOrgId".equals(method)) {
				String org_id = String.valueOf(dataMap.get("org_id"));
				String staff_flag = String.valueOf(dataMap.get("staff_flag"));
				if ("true".equals(staff_flag)) {
					org_id = sysUser.getDepartmentCode();
				}
				if ("true".equals(proDept)){
					org_id=sysUser.getOrgId();
					reqMap.put("proDept", proDept);
					reqMap.put("staff_id", sysUser.getStaffId());//服务单转派时，不显示当前登录人
				}
				if("true".equals(optDefault)){
					reqMap.put("optDefault", optDefault);//需求单拆分时，只显示默认接单人
				}
				if(!Tools.isNull(qryType)){
					reqMap.put("org_name",dataMap.get("search_org_name"));
				}
				reqMap.put("org_name", dataMap.get("search_org_name"));
				//reqMap.put("org_id", request.getParameter("org_id"));
				reqMap.put("org_id", org_id);
				reqMap.put("staff_name",dataMap.get("staff_name"));
				
				reqMap.put("staff_phone",dataMap.get("staff_phone"));
				reqMap.put("region_code", sysUser.getRegionCode());
				if ("true".equals(ceoType)) {
					reqMap.put("ceoType", ceoType);
				} 
				if(!Tools.isNull(qryType)){
					reqMap.put("qryType", qryType);
				}
				demMap = crmService.getStaffByOrgId(reqMap);
			}else if("getStaffByOrgId1".equals(method)){

				String org_id =String.valueOf(dataMap.get("org_id"));
				
				String staff_flag = String.valueOf(dataMap.get("staff_flag"));
				if ("true".equals(staff_flag)) {
					org_id = sysUser.getDepartmentCode();
				}
				if(!Tools.isNull(qryType)){
					reqMap.put("qryType", qryType);
					//reqMap.put("org_name", request.getParameter("search_org_name"));
				}
				reqMap.put("org_name", dataMap.get("search_org_name"));
				//reqMap.put("org_id", request.getParameter("org_id"));
				reqMap.put("org_id", org_id);
				reqMap.put("staff_name", dataMap.get("staff_name"));
				reqMap.put("staff_phone",dataMap.get("staff_phone"));
				reqMap.put("region_code", sysUser.getRegionCode());
				if ("true".equals(ceoType)) {
					reqMap.put("ceoType", ceoType);
				} 
				if(!Tools.isNull(qryType)){
					reqMap.put("qryType", qryType);
				}
				demMap = crmService.getStaffByOrgId(reqMap);
			
			}
			if ("0".equals(demMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
				resultMap.put("data", demMap.get("list"));
			} else {
				resultMap.put("code", "-1");
				resultMap.put("msg", "系统异常");
			}
		} catch (Exception e) {
			resultMap.put("code", "-1");
			e.printStackTrace();
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		 
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	 
	
}
