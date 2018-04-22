package com.tydic.sale.servlet;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import javax.servlet.Servlet;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.zk.ZKUtil;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.alibaba.fastjson.JSON;
import com.taobao.tair.DataEntry;
import com.taobao.tair.Result;
import com.taobao.tair.TairManager;
import com.tydic.auth.client.utils.CookiesUtils;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.CrmService;
import com.tydic.sale.service.crm.EvalTimer;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.Constants;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.webService.client.CpcServiceClient;
import com.tydic.wss.util.RequestUtil;

/**
 * 
 * @author zhangxb@20120510
 *
 */
public class AbstractServlet extends HttpServlet implements Observer{
	protected final Map confMap = new HashMap();//读取configuration.propertites 文件
	protected CrmService crmService;	
	
	private Logger log = Logger.getLogger(this.getClass());

	/** 获取当前的http request对象 */
	protected static HttpServletRequest getServletRequest() {
		HttpServletRequest request = RequestUtil.getServletRequest();
		if (request == null) {
			request =  (( ServletRequestAttributes)RequestContextHolder.currentRequestAttributes()).getRequest();
		}

		return request;
	}
	
	TairManager orderTairManager;
	
	private EvalTimer evalTimer;
	
	public TairManager getOrderTairManager() {
		return orderTairManager;
	}

	
	public CrmService getCrmService() {
		return crmService;
	}
	  
	
	public EvalTimer getEvalTimer() {
		return evalTimer;
	}


	public void setEvalTimer(EvalTimer evalTimer) {
		this.evalTimer = evalTimer;
	}


	/**
	 * @see Servlet#init(ServletConfig)
	 */
	public void init(ServletConfig config) throws ServletException {
		confMap.putAll(ZKUtil.addObserver("/config", this));
		ISpringContext springInstance = SpringContextUtils.getInstance();
	//	orderTairManager 	= (TairManager)springInstance.getBean(Constants.SPRINT_BEAN_TAIL_ORDER			);
		crmService 			= (CrmService) springInstance.getBean(Constants.SPRINT_BEAN_CRM_SERVICE		);
		evalTimer 			= (EvalTimer) springInstance.getBean("evalTimer"		);
		
	}
	/**
	 * 获取需求单代发 附件上传路径
	 * @return
	 */
	public String getDemSendUpDirPath(){
		return String.valueOf(this.confMap.get("com.tydic.upLoad.demSend.filePath"));
		
	}
	/**
	 * 获取需求单代发 附件下载路径
	 * @return
	 */
	public String getDownLoadDirPath(){
		return String.valueOf(this.confMap.get("com.tydic.download.demSend.filePath"));
	}

	
	/**
	 * 获取手机图片上传
	 * @return
	 */
	public String getAppUpDirPath(){
		return String.valueOf(this.confMap.get("com.tydic.upLoad.app.ImgDir"));
	}
	
	/**
	 * 综合资源地址[标准地址]
	 * @return
	 */
	public String getAuthURL(){
		return  String.valueOf(this.confMap.get("com.tydic.auth.innerserver.urls"));
	}
	
	/**
	 * 获取附件上传时限制上传的文件类型
	 * @return
	 */
	public String getLimitFileType(){
		return String.valueOf(this.confMap.get("com.tydic.upload.file.type"));
		
	}
	
	public String getUpLoadIp(){
		return String.valueOf(this.confMap.get("com.tydic.upLoad.ip"));
	}
    public String getUpLoadPort(){
    	return String.valueOf(this.confMap.get("com.tydic.upLoad.port"));
	}
    public String getUpLoadPath(){
    	return String.valueOf(this.confMap.get("com.tydic.upLoad.path"));
	}
    public String getUpLoadUsername(){
    	return String.valueOf(this.confMap.get("com.tydic.upLoad.username"));
	}
     public String getUpLoadPassword(){
    	 return String.valueOf(this.confMap.get("com.tydic.upLoad.password"));
	}
	/**
	 * 获取请求入参
	 * UTF-8转码
	 * @param request
	 * @return
	 */
	public Map<Object,Object> getReqParamMap(HttpServletRequest request){
		 Map<Object,Object> reqMap = new HashMap<Object,Object>();
		try {
			String data = URLDecoder.decode(request.getParameter("data"), "UTF-8");
			data = URLDecoder.decode(data, "UTF-8");
			reqMap = (Map<Object, Object>) JSON.parse(data);
			
			String notEncodeData = request.getParameter("notEncodeData");
			reqMap.putAll((Map<Object, Object>)JSON.parse(notEncodeData));
			
		} catch (UnsupportedEncodingException e) {
			log.error("入参转换异常", e);
		}
		
		return reqMap;
	}
	
	/**
	 * 往前台发送消息
	 * @param response
	 * @param json
	 * @return
	 */
	public String sendMessages(HttpServletResponse response, String json) {
		response.setContentType("application/json");
		response.setContentType("text/json; charset=utf-8");

		response.setCharacterEncoding("UTF-8");
		try {
			response.getWriter().print(json);
			System.out.println(json);
		} catch (IOException e) {
			log.error("返回前台请求异常", e);
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 往前台发送消息【跨域】
	 * @param response
	 * @param json
	 * @return
	 */
	public String sendMessagesApp(HttpServletRequest request,HttpServletResponse response, Map<Object,Object> reqParamMap) {
		response.setContentType("application/json");
		response.setContentType("text/json; charset=utf-8");

		response.setCharacterEncoding("UTF-8");
		try {
			reqParamMap.put("jsessionid", request.getSession(false).getId());
			response.getWriter().print(JSON.toJSONString(reqParamMap));
			//response.getWriter().print("callbackName("+json+")");
		} catch (IOException e) {
			log.error("返回前台请求异常", e);
			e.printStackTrace();
		}
		return null;
	}
	
	/**
	 * 获取相应对象值
	 * @param RANDNUM_KEY 随机数
	 * @return
	 */
	public Result<DataEntry> getResult(int RANDNUM_KEY, String sessionId){
		return getOrderTairManager().get(RANDNUM_KEY, sessionId);
	}
	
	/**
	 * 获取登录员工基本信息
	 * @return 返回员工对象
	 */
	public  SystemUser getSysInstance(HttpServletRequest request){
		HttpSession session = request.getSession();
		SystemUser systemUser = (SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		return systemUser;
	}
	

	
	
	
	/**
	 * 封装COMMON_REQ节点
	 * @param sessionId
	 * @return
	 */
//	public Map getCommonReqMap(String sessionId){
//		//获取登录员工基本信息
//		SystemUser systemUser = getSysInstance(sessionId);
//		Map commonReqMap=new HashMap();
//		commonReqMap.put("SYSTEM_USER_ID",systemUser.getSystemUserId()); //工号ID
//		commonReqMap.put("IN_ORG_ID",  systemUser.getOrgId());//营业点ID  orgLst.get(0).getInterOrgId()
//		commonReqMap.put("COMMON_REGION_ID", systemUser.getAreaId());//员工营业区ID orgLst.get(0).getAreaId()
//		commonReqMap.put("STAFF_LATN_ID", systemUser.getLatnId()); //员工本地网
//		commonReqMap.put("LATN_ID", systemUser.getLatnId()); //员工本地网
//		return commonReqMap;
//	}
	
	/**
	 * 从cookie中获取tokenId
	 * @return
	 */
	public String getTokenIdFromCookie(String type){
		String tokenId = "";
		HttpServletRequest request = getServletRequest();
		Cookie cookie = CookiesUtils.getCookie(request, com.tydic.auth.client.utils.Constants.SERVICE_TOKEN_KEY);
		if(null != cookie){
			tokenId = SaleUtil.getTairKey(cookie.getValue(), type);
		}
		
		return tokenId;
	}
	
	public synchronized void init() {
		confMap.putAll(ZKUtil.addObserver("/config", this));
	}
	
	@Override
	public void update(Observable o, Object arg) {
		Map<String, Object> m = (Map) arg;
		boolean isupdate = false;
	    Object newValue = m.get("com.tydic.marketing.server.url");
		Object oldValue = confMap.get("com.tydic.marketing.server.url");
		if(oldValue==null || !newValue.equals(oldValue)) {
				isupdate = true;
				confMap.put("com.tydic.marketing.server.url", newValue);
		}
		if (isupdate) {
			init();
		}
	}
	
}
