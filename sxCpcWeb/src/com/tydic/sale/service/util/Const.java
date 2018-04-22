package com.tydic.sale.service.util;

/**
 * @author wuym
 */
public interface Const {

	/**用户会话key*/
	public static final String USER_SESSION_KEY = "userInfo";
	
	/**会话中用户名*/
	public static final String USER_NAME_SESSION_KEY = "user.name";
	
	/**样式基路径*/
	public static final String STYLE_BASE_PATH = "style_base_path";
	
	/**随机码key*/
	public static final String RANDNUM_KEY = "RANDNUM_KEY";
	
	/**Action方法的参数名*/
	public static final String PARAMETER = "action";

	/**system switch key*/
	public final static String SYSTEM_SWITCH = "switch";
	
	/**on flag*/
	public final static String SYSTEM_ON = "on";
	
	/**off flag*/
	public final static String SYSTEM_OFF = "off";
	
	/**formbean中用的错误信息key*/
	public final static String ERROR_KEY = 	"org.apache.struts.action.ERROR";
	
	/**action中用的消息key*/
	public final static String MESSAGE_KEY = "org.apache.struts.action.ACTION_MESSAGE";
	
	/**地址栏中的方法分隔符号*/
	public static final String SIGN = "!";
	
	/**根菜单key*/
	public static final String ROOT_MENU_URL = "ROOT_MENU_URL";
	
	/**操作系统目录分隔符*/
	public final static String FILE_SEP = System.getProperty("file.separator");
	
	/**系统换行符*/
	public final static String NEXT_LINE = System.getProperty("line.separator");
	
	/**agent web系统ID*/
	public static final String SYSID_ID = "10000";
	
	/**成功*/
	public static final String SUCCESS = "0";
	
	/**失败*/
	public static final String FAIL = "1";
	
	/**失败*/
	public static final String EXP = "-9";
	
	/**参数key*/
	public static final String PARAMS_KEY = "params.key";
	
	/**本地网ID key*/
	public static final String LATN_ID_KEY = "LATN_ID_KEY";
	
	/**省份的本地网Id(latnId)*/
	public static final String DEFAULT_LATNID = "999";
	
	/**本地网*/
	public static final String AREA_CODE = "areaCode";
	
	/**请求body*/
	public static final String CONTRACT_BODY = "contractBody";
	
	/**调用亚联接口参数*/
	/**新增账户*/
	public static final String AILK_SRC_CREATE_PARTY = "createParty";
	
	/**已有客户新增账户*/
	public static final String AILK_SRC_CREATE_ACCT = "createAccountForOldParty";

	/**根据业务号码查询客户信息*/
	public static final String QUERY_CUST_INFO_BY_TEL = "queryService";
	
	/**根据证件查询客户信息*/
	public static final String QUERY_CUST_INFO_BY_ID = "queryCustInfoByIDNum";
	
	/**UIM卡号校验*/
	public static final String CHECK_TERMINAL_DEVICE_INFO = "checkTerminalDeviceInfo";
	
	/**含有主副卡套餐的接口服务名*/
	public static final String SAVEANDCOMMITORDERLIST = "saveAndCommitOrderList";
	
	/**不含有主副卡套餐的接口服务名*/
	public static final String BUSINESSSERVICE = "businessService";
	
	public static final String DEALTERMINALSALE = "dealTerminalSale";
	
	
}
