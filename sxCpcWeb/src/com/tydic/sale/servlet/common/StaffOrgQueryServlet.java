package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.taobao.tair.DataEntry;
import com.taobao.tair.Result;
import com.tydic.crm.spec.domain.Request;
import com.tydic.crm.spec.domain.Response;
import com.tydic.crm.spec.domain.SOO;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

@WebServlet("/sale/qryStaffOrg.do")
public class StaffOrgQueryServlet extends AbstractServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1107895169837504060L;
	
	
	private final static Logger logger = LoggerFactory
			.getLogger(StaffOrgQueryServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doDelete(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	   doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings({ "rawtypes", "unused", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		if(logger.isDebugEnabled()){
			logger.debug("进入StaffOrgQueryServlet的post方法");
		}
		
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		String ret = "";
		String userName = "";
		String orgName= "";
		String interOrgId = request.getParameter("interOrgId");
		boolean flag = false;
		Map returnMap = new HashMap();
		boolean flg = getResultForChooseFlag(request);
		//将操作员转化为SystemUser对象
		SystemUser sysUser = getSysInstance(request);
		if(flg){
			returnMap.put("isChoose", "2");// 已经选择过工号，不需要再选择
		}else{
				returnMap.put("isChoose", "2");
				userName = sysUser.getStaffName();
				Map staffMap = new HashMap();
				Map<String,Object> orgInfo = new HashMap<String, Object>();
				orgInfo=(Map<String, Object>) request.getSession().getAttribute("orgInfo");
				List orgLst = null;
				if(orgInfo != null){
					 orgLst = (List) orgInfo.get("list") ;
				}
				
				if(orgInfo ==null || orgInfo.size() == 0 || orgLst == null || orgLst.size() == 0){
					 staffMap = queryOrgInfo(request,interOrgId);
				}else{
					staffMap = orgInfo;
				}
				
				if(staffMap !=null && "0".equals(staffMap.get("code")) && staffMap.get("list") != null){
					List<Map> staffLst = (List<Map>) staffMap.get("list");
					if(!StringUtils.isEmpty(interOrgId)){
						for(Map map : staffLst){
							if(interOrgId.equals(map.get("org_id"))){
								staffLst = new ArrayList<Map>();
								staffLst.add(map);
							}
						}
					}
					
					if(staffLst.size() > 1){
						returnMap.put("isShow", true);
						returnMap.put("staffLst", staffLst);
					}else if (staffLst.size() == 0){
						returnMap.put("noOrg", true);
					}else{
						Map staff = staffLst.get(0);
						sysUser.setOrgId(String.valueOf(staff.get("org_id")));
						sysUser.setPid(String.valueOf(staff.get("pid")));
						sysUser.setOrgName(String.valueOf(staff.get("org_name")));
						sysUser.setRegionCode(String.valueOf(staff.get("region_code")));
						sysUser.setRegionName(String.valueOf(staff.get("region_name")));
						sysUser.setControlNumber(String.valueOf(staff.get("control_number")));
					}
				};
				
				Map<Object,Object> userRolePoolMap = new HashMap<Object, Object>();
				List<Map<String,Object>> colSetLst = new ArrayList<Map<String,Object>>();
				Map<String,Object> temp = new HashMap<String,Object>();
				temp.put("relType", "STAFF");
				temp.put("relValue", sysUser.getStaffId());
				colSetLst.add(temp);
				temp = new HashMap<String,Object>();
				temp.put("relType", "ORG");
				temp.put("relValue", sysUser.getDepartmentCode());
				colSetLst.add(temp);
				
				Map<Object,Object> reqMap = new HashMap<Object, Object>();
				reqMap.put("qryUserColSet", colSetLst);
				reqMap.put("regionCode", sysUser.getRegionCode());
				userRolePoolMap = crmService.getUserRolePool(reqMap);
				
				List<Map> roleLst = new ArrayList<Map>();
				List<Map> poolLst = new ArrayList<Map>();
				List<Map> funLst = new ArrayList<Map>();
				List<Map> menuLst = new ArrayList<Map>();
				List<Map> dataLst = new ArrayList<Map>();
				List<Map> homePageLst = new ArrayList<Map>();
 				if("0".equals(userRolePoolMap.get("code"))){
					roleLst =  (List<Map>) userRolePoolMap.get("roleLst");
					poolLst =   (List<Map>) userRolePoolMap.get("poolLst");
					funLst  = (List<Map>) userRolePoolMap.get("funLst");
					menuLst = (List<Map>) userRolePoolMap.get("menuLst");
					dataLst = (List<Map>) userRolePoolMap.get("dataLst");
					homePageLst = (List<Map>) userRolePoolMap.get("homePageLst");
					
				}
				sysUser.setPoolLst(poolLst);
				sysUser.setRoleLst(roleLst);
				sysUser.setFunLst(funLst);
				sysUser.setMenuLst(menuLst);
				sysUser.setDataLst(dataLst);
				sysUser.setHomePageLst(homePageLst);
				
				List<Map> allDataLst = sysUser.getDataLst();//获取数据配置
				dataLst = new ArrayList<Map>();//订单查询的数据配置
				if(!Tools.isNull(allDataLst) && allDataLst.size() > 0){
					for(Map map : allDataLst){
						if(com.tydic.sale.utils.Constant.QUERY_ORDER_LEADER.equals(String.valueOf(map.get("data_type")))){
							dataLst.add(map);
						}
					}
				}
				
				sysUser.setLeaderDataLst(this.getOptIds(dataLst, sysUser));
				
				request.getSession().setAttribute(SaleUtil.SYSTEMUSER, sysUser);
				orgName = sysUser.getOrgName();
				returnMap.put("region_name", sysUser.getRegionName());
				returnMap.put("region_code", sysUser.getRegionCode());
		}
		
		returnMap.put("userName",userName);
		returnMap.put("orgName", orgName);
		ret = JSON.toJSONString(returnMap);
		if(logger.isDebugEnabled()){
			logger.debug("ret["+ret+"]");
		}
		if(out != null ){
			out.print(ret);
			out.close();
		}
	}
	
	private String getOptIds (List<Map> dataLst,SystemUser systemUser){
		String optIds = "";
		String dataIds = "";
		List<Object> staffLst = new ArrayList<Object>();
		if(!Tools.isNull(dataLst) && dataLst.size()>0){
			for(Map map : dataLst){
				dataIds += String.valueOf(map.get("data_id"))+",";
			}
			dataIds = dataIds.substring(0, dataIds.length()-1);
			Map<Object,Object> sqlMap  = new HashMap<Object, Object>();
			sqlMap.put("data_id", dataIds);
			Map<Object,Object> staffLstMap = crmService.queryStaffByData(sqlMap);
			if("0".equals(String.valueOf(staffLstMap.get("code")))){
				staffLst = (List<Object>) staffLstMap.get("staffLst");
			}
			if(!Tools.isNull(staffLst)&&staffLst.size() > 0){
				for(int i = 0 ; i<staffLst.size();i++){
					optIds += staffLst.get(i)+",";
				}
				optIds = optIds.substring(0,optIds.length()-1);
			}
		}
		if(!Tools.isNull(optIds)){
			if(!optIds.contains(systemUser.getStaffId())){
				optIds += ","+systemUser.getStaffId();
			}
		}else{
			optIds = systemUser.getStaffId();
		}
		return optIds;
	}
	
	public boolean getResultForChooseFlag(HttpServletRequest request){
		HttpSession session = request.getSession();
		Object flag = null;
		if(null != session){
			flag = session.getAttribute(SaleUtil.CHOOSE_ORG_FLAG);
		}
		if(flag != null){
			return (Boolean)flag;
		}
		String tokenId = getTokenIdFromCookie(SaleUtil.CHOOSE_ORG_FLAG);
		if(tokenId != null && !"".equals(tokenId)){
			Result<DataEntry> result = getOrderTairManager().get(Constant.TB_PTY_INTER_ORG, tokenId);
			if(result.isSuccess()){
				DataEntry entry = result.getValue();
				if(null != entry){
					flag = entry.getValue();
				}
			}
		}
		if(flag != null){
			return (Boolean)flag;
		}else{
			return false;
		}
	}
	
	/**
	 * 获取组织机构
	 * 
	 * @param request
	 * @return
	 */
	@SuppressWarnings({ "rawtypes", "unchecked" })
	private Map queryOrgInfo(HttpServletRequest request,String interOrgId) {
		SystemUser systemUser = getSysInstance(request);
		Map<Object,Object> orgInfoMap = new HashMap<Object,Object>(); 
		Map<Object,Object> reqMap = new HashMap<Object,Object>();
		  reqMap.put("org_code", systemUser.getDepartmentCode());
		  orgInfoMap = crmService.getSysOrg(reqMap);

		  HttpSession session = request.getSession();
		  session.setAttribute("orgInfo", orgInfoMap);
		if ("0".equals(orgInfoMap.get("code"))) {
			return orgInfoMap;
		}
		return null;
	}
}
