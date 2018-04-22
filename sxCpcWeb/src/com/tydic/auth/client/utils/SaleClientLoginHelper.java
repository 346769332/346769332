package com.tydic.auth.client.utils;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.taobao.tair.DataEntry;
import com.taobao.tair.Result;
import com.taobao.tair.TairManager;
import com.tydic.crm.spec.IServiceProvider;
import com.tydic.crm.spec.domain.Request;
import com.tydic.crm.spec.domain.Response;
import com.tydic.crm.spec.domain.SOO;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.Constants;
import com.tydic.sale.utils.SaleUtil;

public class SaleClientLoginHelper {

	private final static Logger logger = LoggerFactory.getLogger(SaleClientLoginHelper.class);
	private static TairManager orderTairManager;
	private static IServiceProvider sp;
	private SaleClientLoginHelper(){}
	public static void init() {
		if(sp==null){
			synchronized(SaleClientLoginHelper.class){
				if(sp==null){
					ISpringContext springInstance = SpringContextUtils.getInstance();
					sp = (IServiceProvider) springInstance.getBean(Constants.SPRINT_BEAN_SERVICE);
					orderTairManager = (TairManager) springInstance.getBean(Constants.SPRINT_BEAN_TAIL_ORDER);
				}
			}
		}
		
	}

	public static void setLocalSession(String svcToken, String appId, HttpServletRequest request,
			HttpServletResponse response, Map<String, Object> userMap) throws IOException {
		HttpSession session = request.getSession();
		if (null != session.getAttribute(SaleUtil.SYSTEMUSER)) {
			return;
		}

		SystemUser systemUser = buildSystemUser(userMap);// (SystemUser)
															// SaleUtil.json2Obj((String)userMap.get("SYSTEM_USER"),
															// SystemUser.class);
		if (null != systemUser) {	
			CookiesUtils.setCookie(response, com.tydic.auth.client.utils.Constants.SERVICE_TOKEN_KEY, svcToken, -1);
			HashMap map = toHashMap(userMap);
			session.setAttribute(SaleUtil.SYSTEMUSER, systemUser);
			session.setAttribute("userList", map);
			
			
			resetSystemInfoIntoCache(svcToken, request, response);
		}
	}

	private static HashMap toHashMap(Map useMap){
		HashMap map = new HashMap();
		Iterator<Map.Entry<String, String>> it = useMap.entrySet().iterator();
		while (it.hasNext()) {
		   Map.Entry<String, String> entry = it.next();
		   map.put(entry.getKey(), entry.getValue());
		}
		return  map;
	}
	
	private static SystemUser buildSystemUser(Map<String, Object> userMap) {
		SystemUser systemUser = new SystemUser();
		systemUser.setStaffId(String.valueOf(userMap.get("staff_id")));
		systemUser.setStaffName(String.valueOf(userMap.get("staff_name")));
		systemUser.setLoginCode(String.valueOf(userMap.get("login_code")));
		systemUser.setRegionId(String.valueOf(userMap.get("region_id")));
		systemUser.setDepartmentCode(String.valueOf(userMap.get("department_code")));
		return systemUser;

	}

	/**
	 * 如果session有效，更新分布式缓存的默认时间
	 * 
	 * @param svcToken
	 * @param request
	 * @param response
	 */
	public static void resetSystemInfoIntoCache(String svcToken, HttpServletRequest request, HttpServletResponse response) {
		HttpSession session = request.getSession();
		if (null != session.getAttribute(SaleUtil.SYSTEMUSER)) {
			orderTairManager.put(Constant.SYSTEM_USER, SaleUtil.getTairKey(svcToken, SaleUtil.SYSTEMUSER),
					(SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER), Constant.CACHE_VERSION,
					Constant.CACHE_EXPIRE_TIME);
		}

		if (null != session.getAttribute(SaleUtil.ORG)) {
			orderTairManager.put(Constant.TB_PTY_INTER_ORG, SaleUtil.getTairKey(svcToken, SaleUtil.ORG), 
					(SOO) session.getAttribute(SaleUtil.ORG), Constant.CACHE_VERSION, Constant.CACHE_EXPIRE_TIME);
		}

		if (null != session.getAttribute(SaleUtil.PRIVILEGE)) {
			orderTairManager.put(Constant.PRIVILEGE, SaleUtil.getTairKey(svcToken, SaleUtil.PRIVILEGE), 
					(SOO) session.getAttribute(SaleUtil.PRIVILEGE), Constant.CACHE_VERSION, Constant.CACHE_EXPIRE_TIME);
		}
		if(null != session.getAttribute("userList")){
			orderTairManager.put(Constant.USERMAP, SaleUtil.getTairKey(svcToken, SaleUtil.USERMAP), 
					(HashMap)session.getAttribute("userList"), Constant.CACHE_VERSION, Constant.CACHE_EXPIRE_TIME);	
		}

	}

	/**
	 * 判断缓存中是否有系统用户信息
	 * 
	 * @param svcToken
	 * @param request
	 * @param response
	 * @return
	 */
	public static boolean chkSystemInfoFromCache(String appId, String svcToken, HttpServletRequest request,
			HttpServletResponse response) {
		boolean isExist = false;
		if (null == svcToken || "".equals(svcToken)) {
			return false;
		}
		SystemUser systemUser = null;
		Result<DataEntry> result = orderTairManager.get(Constant.SYSTEM_USER,
				SaleUtil.getTairKey(svcToken, SaleUtil.SYSTEMUSER));
		if (result.isSuccess()) {
			DataEntry dataEnty = result.getValue();
			if (null != dataEnty && null != dataEnty.getValue()) {
				systemUser = (SystemUser) dataEnty.getValue();
				isExist = true;
			}
		}
		if (isExist) {
			HttpSession session = request.getSession(true);
			session.setAttribute(SaleUtil.SYSTEMUSER, systemUser);

/*			if (!chkOrgInfoFromCache(svcToken, request, response)) {
				queryStaffOrgInfo(request, systemUser);
			}

			if (!chkPrivilegeInfoFromCache(svcToken, request, response)) {
				queryPrivilegeInfo(request, systemUser, appId);
			}*/

		}

		return isExist;
	}

	/**
	 * 判断缓存中是否有org信息
	 * 
	 * @param svcToken
	 * @param request
	 * @param response
	 * @return
	 */
	public static boolean chkOrgInfoFromCache(String svcToken, HttpServletRequest request, HttpServletResponse response) {
		boolean isExist = false;
		HttpSession session = request.getSession(true);
		Result<DataEntry> orgResult = orderTairManager.get(Constant.TB_PTY_INTER_ORG,
				SaleUtil.getTairKey(svcToken, SaleUtil.ORG));
		SOO orgData = null;
		if (orgResult.isSuccess()) {
			DataEntry orgDataEnty = orgResult.getValue();
			if (null != orgDataEnty && null != orgDataEnty.getValue()) {
				orgData = (SOO) orgDataEnty.getValue();
				isExist = true;
			}
		}
		if (isExist) {
			session.setAttribute(SaleUtil.ORG, orgData);
		}

		return isExist;
	}

	/**
	 * 判断缓存中是否有权限信息
	 * 
	 * @param svcToken
	 * @param request
	 * @param response
	 * @return
	 */
	public static boolean chkPrivilegeInfoFromCache(String svcToken, HttpServletRequest request, HttpServletResponse response) {
		boolean isExist = false;
		HttpSession session = request.getSession(true);
		Result<DataEntry> privResult = orderTairManager.get(Constant.PRIVILEGE,
				SaleUtil.getTairKey(svcToken, SaleUtil.PRIVILEGE));
		SOO privData = null;
		if (privResult.isSuccess()) {
			DataEntry privDataEnty = privResult.getValue();
			if (null != privDataEnty && null != privDataEnty.getValue()) {
				privData = (SOO) privDataEnty.getValue();
				isExist = true;
			}
		}

		if (isExist) {
			session.setAttribute(SaleUtil.PRIVILEGE, privData);
		}

		return isExist;
	}



}
