package com.tydic.sale.utils;

import java.util.HashMap;
import java.util.Map;

public class Constant {
	
	public static Map cache = new HashMap();
	
	public static class Process{
		
		
		public static final String PROCESS_AUTH = "PROCESS_AUTH"; //流程用户信息
		
		public static final String CUR_USER_ID = "tiger"; //当前用户ID
		
		public static final String CUR_USER_NAME = "tiger"; //当前用户名称
	
	
	}
	
	public static final int CACHE_ORDER_INFO_WORKITEM = 0;//订单缓存namespace
	
	/**随机码key namespace*/
	public static final int RANDNUM_KEY = 0;
	
	public static int RANDUM_SPACE = 0;
	
	/**标准工号信息 namespace*/
	public static final int SYSTEM_USER = 0;
	
	/**菜单权限信息 namespace*/
	public static final int PRIVILEGE = 0;
	
	/**组织机构信息 namespace*/
	public static final int TB_PTY_INTER_ORG = 0;
	
	/**验证码 namespace*/
	public static final int VERIFYCODE = 0;	
	
	/**登录获取的员工信息*/
	public static final int USERMAP = 0;		
	
	public static final int CACHE_EXPIRE_TIME = 30*60;//缓存失效时间
	
	public static final int CACHE_VERSION = 0;  //缓存版本号
	public static final int SALE_ORDER_ID = 0;  //销售单ID
    /**登陆CRM会话信息*/
	public static final String SSO_TOKEN_VALUE="COM.TYDIC.SSO_AUTH_TOKEN";
	
    /**登陆CRM会话信息*/
	public static final String SALE_WEB_SSO_TOKEN_VALUE="COM.TYDIC.SSO_AUTH_TOKEN_SALE_WEB";
	
	public static final String SSO_AUTH_TOKEN_APPID="COM.TYDIC.SSO_AUTH_TOKEN_APPID";
	
	public static final String SYS_USER_KEY="SYS_USER_KEY";
	
	public static final int COOKIE_MAX_AGE_PAD=60*1000;
	
	public static final int COOKIE_MAX_AGE_PC=60;
	
	
	/**订单查询的组长权限**/
	public static final String QUERY_ORDER_LEADER ="Group_Leader";
	/**接口服务名称**/
	public static final String SERVER_NAME="SERVER_NAME";
	
}