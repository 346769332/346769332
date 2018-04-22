package com.tydic.sso.util;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.MD5Encrypt;
import com.tydic.wss.remote.client.HttpRequestClient;
/**SSO工具类*/
public class SSO2_0Util{

	/**
	 * 
	 */
	private static final long serialVersionUID = 34543535L;

	private static final Log log = LogFactory.getLog(SSO2_0Util.class);

	private static HttpRequestClient httpClient = (HttpRequestClient)SpringContextUtils.getInstance().getBean("httpClient");


	/** 获取sso token */
	public static String getSSOToken(HttpServletRequest request,Map userInfo,String url)
			throws Exception {
		HttpSession session = request.getSession();
		String token = (String) session.getAttribute(Constant.SSO_TOKEN_VALUE);
		if (null==token||"".equals(token)) {
			// 登录工号
			String jobNumber =(String)userInfo.get("jobNumber");
			// 登录密码
			String password = MD5Encrypt.MD5Encode((String)userInfo.get("password"));
			// 本地网
			// String areaCode = "550";
			String areaCode = (String)userInfo.get("areaCode");

			/**
			 * 请求Json格式报文在这指定
			 * 代理商登录的员工工号EMPEE_ACCT
			 * 和密码EMPEE_PWD
			 */
			StringBuffer reqJson = new StringBuffer();
			reqJson.append("{\"SvcCont\":{\"SOO\"").append(":[{");//
	        reqJson.append("\"EMPEE_ACCT\"").append(":").append("\"").append(jobNumber).append("\"").append(",");
	        reqJson.append("\"EMPEE_PWD\"").append(":").append("\"").append(password).append("\"").append(",");
	        reqJson.append("\"LATN_CD\"").append(":").append("\"").append(areaCode).append("\"");
	        reqJson.append(",\"PUB_REQ\": {\"TYPE\": \"AUTH_SYSTEM_USER\"}");
	        reqJson.append("}]");
	        reqJson.append("},");
	        reqJson.append("\"TcpCont\": {\"ActionCode\": \"1\",\"ServiceCode\": \"1\",\"ServiceContractVer\": \"1\",\"SrcSysID\": \"310\", \"TransactionID\": \"1\"}}");
	        // 获取SSOToken标识Url
	        //"http://192.168.128.101:6201/portal/sso/servlet/OutSSOServlet"
			String ssoTokenUrl =url; //获取
			// 打印请求报文和Url
			if (log.isDebugEnabled()) {
				log.info("SSO2.2请求报文：" + reqJson.toString());
				log.debug("ssoTokenUrl:" + ssoTokenUrl);
			}
			// 设置请求字符编码为UTF-8
			httpClient.setEncode("UTF-8");
			String text = httpClient.doPost(ssoTokenUrl, reqJson.toString());
			// 用完之后恢复成为GBK
			httpClient.setEncode("GBK");
			if(text.indexOf("TOKEN\":")==-1){
				token="";
			}else{
			token = text.substring(text.indexOf("TOKEN\":") + 8, text.indexOf("URL_MAPPING\":") - 3);
			session.setAttribute(Constant.SSO_TOKEN_VALUE, token);
			
			}
		}

		return token;
	}
	
	
}


