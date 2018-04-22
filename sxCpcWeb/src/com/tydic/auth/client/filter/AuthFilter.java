package com.tydic.auth.client.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.auth.client.utils.AuthConfigManagerClient;
import com.tydic.auth.client.utils.Constants;
import com.tydic.auth.client.utils.CookiesUtils;
import com.tydic.auth.client.utils.SaleClientLoginHelper;
import com.tydic.auth.crm.spec.IServiceProvider;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.CrmService;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;
import com.tydic.wss.util.RequestUtil;

public class AuthFilter extends AbstractAuthFilter {
	private static final Log log = LogFactory.getLog(AuthFilter.class);
	private static final Set<String> NoFilterUrlSet = new HashSet<String>();
	private static Boolean flag = false;
	private AuthConfigManagerClient configManager;

	@Override
	public void destroy() {

	}

	public void init(FilterConfig arg0) throws ServletException {
		ISpringContext springInstance = SpringContextUtils.getInstance();
		configManager = (AuthConfigManagerClient) springInstance
				.getBean("configManager");
		initFlag(arg0);
		initNoFilterUrln(arg0);
		super.init(arg0);
	}

	/** 初始化不过滤的URL */
	private void initNoFilterUrln(FilterConfig arg0) {
		String temp = arg0.getInitParameter("NoFilterUrl");
		if (temp != null) {
			StringTokenizer st = new StringTokenizer(temp, ",");
			while (st.hasMoreElements()) {
				String ele = (String) st.nextElement();
				if (null != ele && !"".equals(ele)) {
					NoFilterUrlSet.add(ele.trim());
				}
			}
			log.info("不需要会话验证，放过的URLs:" + NoFilterUrlSet);
		}

	}
	
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		response.setContentType("text/html; charset=UTF-8");

		HttpServletRequest req = ((HttpServletRequest) (request));
		HttpServletResponse res = ((HttpServletResponse) (response));

		Map<String, Object> errorMessage = new HashMap<String, Object>();
		errorMessage.put("error", "unkown error");

		// 0. 判断是否需要认证，若开放访问则不检测
		if (!isAuthRequired(req, res)) {
			chain.doFilter(request, response);
			return;
		}
		
		HttpSession session = req.getSession();
		SystemUser systemUser = (SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		if(systemUser == null){
			errorMessage.put("error", "st is blank");
			authFail(req, res, errorMessage);
		}else{
			chain.doFilter(request, response);
			// 登入成功
//			if(!this.checkIsLogin(req,res)){
//				chain.doFilter(request, response);
//			}else{
//				String reqUrl=String.valueOf(req.getRequestURL());
//				reqUrl=reqUrl.substring(reqUrl.lastIndexOf("/")+1,reqUrl.length());
//				if("saveOptInfo.do".equals(reqUrl) || "logout.do".equals(reqUrl)) {
//					errorMessage.put("isLogout", "Y");
//				}
//				errorMessage.put("error", "该用户已在其他地方登陆");
//				errorMessage.put("ajaxRetCode", "-1");				
//				authFail(req, res, errorMessage);
//			}
			return;
		}
	}
	
	private boolean checkIsLogin(HttpServletRequest request,HttpServletResponse response){
		
		//手机不做异地登录过滤
		if(this.isAppReq( request)){
			return false;
		}
		
		SystemUser sysUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String userCode = sysUser.getLoginCode();
		Map reqMap = new HashMap();
		HttpSession session = request.getSession();
		String sessionId = session.getId();
		
		
		
		reqMap.put("sessionId", sessionId);
		
		reqMap.put("loginCode", userCode);
		reqMap.put("SERVER_NAME", "checkIsLogin");
		
		ISpringContext springInstance = SpringContextUtils.getInstance();
		//	orderTairManager 	= (TairManager)springInstance.getBean(Constants.SPRINT_BEAN_TAIL_ORDER			);
		CrmService	crmService = (CrmService) springInstance.getBean(com.tydic.sale.utils.Constants.SPRINT_BEAN_CRM_SERVICE		);
		Map resultMap = crmService.dealObjectFun(reqMap);
		if(!"0".equals(String.valueOf(resultMap.get("code")))) {
			return true;
		}else{
			return false;
		}
		
		
	}
	
	private boolean isAppReq(HttpServletRequest request){
		try {
			String data = URLDecoder.decode(request.getParameter("data"), "UTF-8");
			data = URLDecoder.decode(data, "UTF-8");
			Map<Object, Object> reqMap = (Map<Object, Object>) JSON.parse(data);
			if(!Tools.isNull(reqMap)){
				return true;
			}
		} catch (Exception e) {
			return false;
		}
		
		return false;
	}

	/** 就否开启最右模糊匹配 */
	private void initFlag(FilterConfig arg0) {
		flag = Boolean.valueOf(arg0.getInitParameter("flag"));
	}

	/** 验证用户的请求，验证不需要会话拦截的url请求 */
	private static boolean chkReqUrl(String requestUrl) {
		if (NoFilterUrlSet.contains(requestUrl)) {
			return true;
		}
		return rightMacth(requestUrl);
	}

	/**
	 * 最右模糊匹配验证
	 * 
	 * @param requestUrl
	 *            - 请求的url
	 * @param temp
	 *            - 查找菜单集合
	 * @return
	 */
	private static boolean rightMacth(String requestUrl) {
		if (flag) {// 是否开启NoFilterUrlDependOnSession的【最右通配符*】匹配
			/** 进行模糊匹配 */
			Iterator<String> it = NoFilterUrlSet.iterator();
			while (it.hasNext()) {
				// 配置的url，比如：/agent/aaaa/bbb/*
				// requestUrl为：/agent/aaaa/xxx.do 或 /agent/aaaa/bbb/dd/ad.do
				String nfurl = it.next();
				int index = nfurl.indexOf("*");
				if (index > 0) {
					nfurl = nfurl.substring(0, index);// 取出/agent/aaaa/bbb/
					if (requestUrl.startsWith(nfurl)) {// 验证是否是以通配符路径下的请求url,区分大小写
						return true;
					}
				}
			}// end while
		}

		return false;
	}

	@Override
	public String getAuthServerUrl() {
		return configManager.getProperty(AUTH_SERVER_URL);
	}

	@Override
	public String getAuthInnerServerUrl() {
		return configManager.getProperty(AUTH_INNER_SERVER_URL);
	}
	
	@Override
	public String getClientAppId() {
		return configManager.getProperty(CLIENT_APP_ID);
	}

	@Override
	public String getClientLoginUrl() {
		return configManager.getProperty(CLIENT_LOGIN_URL);
	}

	@Override
	public String getClientLogoutUrl() {
		return configManager.getProperty(CLIENT_LOGOUT_URL);
	}


	/**
	 * 认证失败处理方法
	 */
	@Override
	public void authFail(HttpServletRequest req, HttpServletResponse response,
			Map<String, Object> errorMessage) {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		Map<String, Object> msgMap = new HashMap<String, Object>();

		try {
			out = response.getWriter();
			msgMap.put("message", "登入认证失败!");
			msgMap.put("ajaxRetCode", "0");
			msgMap.put("authUrl", getAuthUrl(req));
			msgMap.put("showTip", "0");
			if(!Tools.isNull(errorMessage.get("ajaxRetCode"))){
				msgMap.put("ajaxRetCode", errorMessage.get("ajaxRetCode"));
				msgMap.put("message", errorMessage.get("error"));
				msgMap.put("isLogout", errorMessage.get("isLogout"));
			}
			msgMap.put("details", errorMessage.get("error"));
			msgMap.put("appId", getClientAppId());

			log.warn(errorMessage);

			out.println(JSON.toJSON(msgMap));
		} catch (IOException e) {
			if (log.isDebugEnabled()) {
				log.debug("获取PrintWriter异常：" + e.getMessage());
			}
		}

		out.close();
	}

	/**
	 * ST已经超时处理方法
	 */
	@Override
	public void authExpire(HttpServletRequest request,
			HttpServletResponse response) {
		response.setContentType("text/html; charset=UTF-8");
		PrintWriter out = null;
		Map<String, Object> msgMap = new HashMap<String, Object>();

		try {
			out = response.getWriter();
			msgMap.put("message", "登入认证已经超时，请重新登入!");
			msgMap.put("ajaxRetCode", "0");
			msgMap.put("authUrl", getAuthUrl(request));
			msgMap.put("showTip", "1");
			msgMap.put("appId", getClientAppId());
			log.warn("登入认证超时");

			out.println(JSON.toJSON(msgMap));
		} catch (IOException e) {
			e.printStackTrace();
			if (log.isDebugEnabled())
				log.debug("获取PrintWriter异常：" + e.getMessage());
		}

		out.close();
	}

	@Override
	public boolean isAuthed(String svcToken, HttpServletRequest req,
			HttpServletResponse res) {

		HttpSession session = req.getSession();

		if (session != null
				&& null != session.getAttribute(SaleUtil.SYSTEMUSER)) {

			// session中还有用户信息
			SaleClientLoginHelper.resetSystemInfoIntoCache(svcToken, req, res);

			return true;
		} else {
			// session已经失效
			return SaleClientLoginHelper.chkSystemInfoFromCache(
					getClientAppId(), svcToken, req, res);
		}
	}

	@Override
	public boolean isAuthRequired(HttpServletRequest req,
			HttpServletResponse res) {

		String url = RequestUtil.getFullURL(req);

		if (url.contains("?")) {
			int index = url.indexOf("?");
			url = url.substring(0, index);
		}

		if (log.isDebugEnabled()) {
			log.debug("current request url： " + url);
			log.debug("request from: " + req.getRemoteAddr());
		}

		if (chkReqUrl(url)) {
			log.info("authentication is not required!");
			return false;
		}

		return true;
	}

	@Override
	public IServiceProvider getServiceProvider() {

		return (IServiceProvider) SpringContextUtils.getInstance().getBean(
				Constants.SPRING_BEAN_AUTH);
	}

	@Override
	public void authSuccess(HttpServletRequest arg0, HttpServletResponse arg1,
			Map<String, Object> arg2) {
		
	}

}
