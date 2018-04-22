package com.tydic.sale.utils;

import java.lang.reflect.Type;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.StringTokenizer;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.parser.ParserConfig;


public class SaleUtil {
	
	public final static ParserConfig DEFAULT_PARSER_CONFIG =  new ParserConfig();
	
	
	/**
	 * 服务种类：产品
	 */
	public static final String SERVICE_ORDER_CD_PROD = "1300";
	
	/**
	 * 服务种类：销售品、促销、可选包
	 */
	public static final String SERVICE_ORDER_CD_PKG = "1200";
	
	/**
	 * 销售单关系：销售品、促销、可选包
	 */
	public static final String ORDER_REL_TYPE_PKG = "11";
	
	/**
	 * 销售单关系：产品
	 */
	public static final String ORDER_REL_TYPE_PROD = "10";
	
	/**
	 * 服务类型：  新装
	 * 销售品、促销、可选包
	 */
	public static final String SERVICE_ORDER_ID_PKG_NEW = "250";
	
	/**
	 * 服务类型：  新装
	 * 产品
	 */
	public static final String SERVICE_ORDER_ID_PROD_NEW = "28";
	
	/**产品类型为手机*/
	public static final String CDMA = "8800588";
	
	/**CDMA产品ID**/
	public static final String CDMAID = "41010300";
	
	/**固话产品ID**/
	public static final String PHONEID = "42010100";
	
	/**裸机销售产品ID**/
	public static final String LJ_PROD_ID = "60000008"; 
	
	/**裸机终端属性ID**/
	public static final String LJ_RES_ID_ATTR_ID = "1514";
	/**裸机终端名称属性ID**/
	public static final String LJ_RES_NAME_ATTR_ID = "1515";
	/**裸机终端价格属性ID**/
	public static final String LJ_RES_PRICE_ATTR_ID = "1517";
	/**裸机终端串号属性ID**/
	public static final String LJ_RES_CODE_ATTR_OD = "13";
	/**终端资源**/
	public static final String OBJ_INST_TYPE = "A4"; 
	
	/**产品/套餐/可选包...新装类型 ：新装*/
	public static final String NEWFLAG = "1";
	
	/**产品/套餐/可选包... 退订*/
	public static final String REMOVEFLAG = "2";
	
	/** 来源pc:709,pad:708 */
	public static final String SOURCE_SYS_PC = "709"; 
	public static final String SOURCE_SYS_PAD = "708"; 
	
	
	
	
	/**********【陕西】以下尚未用到***********/
	
	
	
	
	/**小前台系统id*/
	public static final String SALEWEB_SYS_ID = "2068";
	
	/**调销账系统id*/
	public static final String SYS_ID_XZ = "1019";
	
	/**登录员工信息对应的标识*/
	public static final String SYSTEMUSER = "E";
	
	/**密码找回随机码*/
	public static final String RANDOM = "RANDOM";
	
	/**登录员工信息对应的标识*/
	public static final String ORG = "O";
	
	public static final String VERIFYCODE = "V";
	
	/**是否已经选择org*/
	public static final String CHOOSE_ORG_FLAG = "COF";
	
	/**登录员工信息对应的标识*/
	public static final String PRIVILEGE = "P";
	
	public static final String USERMAP = "UP";
	
	
	
	
	/**产品类型为固话*/
	public static final String PHONE = "362";
	
	/**产品类型为宽带*/
	public static final String ADSL = "427";
	
	/**套餐入口*/
	public static final String ENTRVAR_MEAL = "20";
	/**活动入口*/
	public static final String ENTRVAR_ACTIVITY = "21";
	/**终端入口*/
	public static final String ENTRVAR_TERMINAL = "22";
	/**销售单编辑入口*/
	public static final String ENTRVAR_EDIT = "23";
	
	/**C网套餐入口*/
	public static final String ENTRY_SINGLE = "26";
	
	public static final String ENTRY_COMBINATION = "27";
	
	/**产品密码修改*/
	public static final String ENTRVAR_PRODPWD = "31";
	/**宽带拨号密码修改*/
	public static final String ENTRVAR_ADSLPWD = "32";
	/**融合A拨号密码修改*/
	public static final String ENTRVAR_CFBAPWD = "33";
	/**翼支付密码修改*/
	public static final String ENTRVAR_YZFPWD = "34";
	/**主套餐标识*/
	public static final String OFFER_TYPE = "11";
	/**主套餐标识*/
	public static final String OFFER_TYPE_ID = "7";
	
	/**促销标识*/
	public static final String OFFER_TYPE_ID_PROMOTION = "88";
	/**主卡标识*/
	public static final String MAINCARD = "511";
	/**副卡标识*/
	public static final String SECONDCARD = "512";
	/**资源返回的号码ID*/
	public static final String PHONUMID = "";
	
	//销售单ID
	public static final String SALE_ORDER_ID_4MAN="24";
	
	//提示CODE
	public static final String PROMPT_CODE ="0001";
	
	//拒绝CODE
	public static final String REFUSE_CODE ="0002";
	
	

	/**
	 * json转对象{"对象的字段名称":"字段值"}
	 * @param json
	 * @param type
	 * @return
	 */
	public static Object json2Obj(String json,Type type){
		return JSON.parseObject(json, type, DEFAULT_PARSER_CONFIG, 0);
	}
	
	
//	/**
//	 * 基础包对象转换
//	 * @param basePg
//	 */
//	@SuppressWarnings("unchecked")
//	public static void convertBasePg(BasePg basePg) {
//		if (basePg.getProdOfferList() != null && basePg.getProdOfferList().size() > 0) {
//			basePg.setProdOfferList(JSONUtil.toList(basePg.getProdOfferList(), ProdOffer.class));
//		}
//		
//		if (basePg.getProdList() != null && basePg.getProdList().size() > 0) {
//			basePg.setProdList(JSONUtil.toList(basePg.getProdList(), Product.class));
//			
//			List<Product> prodList = basePg.getProdList();
//			for (Product product : prodList) {
//				convertProduct(product);
//			}
//		}
//	}
	
//	/**
//	 * 加装包对象转换
//	 * @param basePg
//	 */
//	@SuppressWarnings("unchecked")
//	public static void convertAddPg(AddPg addPg) {
//		if (addPg.getProdList() != null && addPg.getProdList().size() > 0) {
//			addPg.setProdList(JSONUtil.toList(addPg.getProdList(), Product.class));
//			
//			List<Product> prodList = addPg.getProdList();
//			for (Product product : prodList) {
//				convertProduct(product);
//			}
//		}
//	}
	
 
	
//	/**
//	 * 产品对象转换
//	 * @param product
//	 */
//	@SuppressWarnings("unchecked")
//	public static void convertProduct(Product product) {
//		
//		if (product.getAttrList() != null && product.getAttrList().size() > 0) {
//			product.setAttrList(JSONUtil.toList(product.getAttrList(), ProductAttr.class));
//		}
//		
//		if (product.getOptionList() != null && product.getOptionList().size() > 0) {
//			product.setOptionList(JSONUtil.toList(product.getOptionList(), Option.class));
//		}
//		
//		if (product.getAddVList() != null && product.getAddVList().size() > 0) {
//			product.setAddVList(JSONUtil.toList(product.getAddVList(), AddV.class));
//		}
//		
//		if (product.getSaleResLst() != null && product.getSaleResLst().size() > 0) {
//			product.setSaleResLst(JSONUtil.toList(product.getSaleResLst(), SaleRes.class));
//		}
//	}
	/**
	 * 公用方法，生成序列
	 * @return
	 */
	public static String getInstIdRandom(){
		String sRand ="";
		String randString = "0123456789";
		for (int i = 0; i < 12; i++) {
			char ch = randString.charAt((int)(Math.random()*10 + 0));
			sRand += ch;
		}
		return "$-" + sRand + "$";
	}
	
	/**
	 * 获取缓存存放的KEY值
	 * @param sessionId
	 * @param bussType
	 * @return
	 */
	public static String getTairKey(String sessionId, String bussType) {
		return sessionId + bussType;
	}
	
	/**
	 * @param obj
	 * @return boolean 是否为空
	 */
	public static boolean isNull(Object obj) {
		/*为空*/
		if(obj==null) return true;
		/*String*/
		if(obj instanceof String){
			return checkString((String)obj);
		}
		/*Integer*/
		if(obj instanceof Integer){
			return checkInteger((Integer)obj);
		}
		/*Long*/
		if(obj instanceof Long){
			return checkLong((Long)obj);
		}
		/*Double*/
		if(obj instanceof Double){
			return checkDouble((Double)obj);
		}
		/*Date*/
		if(obj instanceof Date){
			return checkDate((Date)obj);
		}
		/*List*/
		if(obj instanceof List){
			return checkList((List)obj);
		}
		/*Set*/
		if(obj instanceof Set){
			return checkSet((Set)obj);
		}
		/*Map*/
		if(obj instanceof Map){
			return checkMap((Map)obj);
		}
		
		return false;
	}
	
	private static boolean checkString(String string) {
		if( string.trim().length()<=0 || "null".equalsIgnoreCase(string)){
			return true;
		}
		return false;
	}
	
	private static boolean checkList(List list) {
		if( list.size()<=0)
			return true;
		return false;
	}
	
	private static boolean checkObjects(Object[] objs) {
		if( objs.length <= 0 )
			return true;
		return false;
	}
	
	private static boolean checkSet(Set set) {
		if(set.isEmpty() || set.size()<=0)
			return true;
		return false;
	}
	
	private static boolean checkMap(Map set) {
		if(set.isEmpty() || set.size()<=0)
			return true;
		return false;
	}
	
	private static boolean checkDate(String[] strings) {
		if(strings.length<=0)
			return true;
		return false;
	}
	private static boolean checkDate(Date date) {
		if(date == null ){
			return true;
		}
		return false;
	}

	private static boolean checkDouble(Double double1) {
		if( double1.doubleValue()==0){
			return true;
		}
		return false;
	}

	private static boolean checkLong(Long long1) {
		if( long1.longValue()==0 || long1.longValue()==-1L ){
			return true;
		}
		return false;
	}

	private static boolean checkInteger(Integer integer) {
		if( integer.intValue()==0 || integer.intValue()==-1 ){
			return true;
		}
		return false;
	}
	
	/**
	 * 计算当天加减
	 * 获取 根据指定格式 计算指定类型
	 * @param format 格式：如"yyyy-MM-dd"
	 * @param type   类型 如:Calendar.YEAR,Calendar.MONTH,Calendar.DATE
	 * @param add    具体家的值
	 * @return String 
	 */
	public static String addDate(String format,int type,int add){
		Calendar cal = Calendar.getInstance();
		int newYear  = cal.get(Calendar.YEAR);
		int newMonth = cal.get(Calendar.MONTH);
		int newDay   = cal.get(Calendar.DATE);
		int newHour  = cal.get(Calendar.HOUR_OF_DAY);
		int newMinute= cal.get(Calendar.MINUTE);
		int newSecond= cal.get(Calendar.SECOND);
		switch(type){
			case Calendar.YEAR:
				newYear += add; 
				break;
			case Calendar.MONTH:
				newMonth += add; 
				break;
			case Calendar.DATE:
				newDay += add; 
				break;
			case Calendar.HOUR_OF_DAY:
				newHour += add; 
				break;
			case Calendar.MINUTE:
				newMinute += add; 
				break;
			case Calendar.SECOND:
				newSecond += add; 
				break;
		}	
		cal.set(newYear, newMonth, newDay,newHour,newMinute,newSecond);
		SimpleDateFormat simpDate = new SimpleDateFormat(format);
		return simpDate.format(cal.getTime());
	}
	
	public static String backBigMoney(String ls) {
		String fu = "";
		if (!StringUtil.isEmpty(ls) && ls.charAt(0) == '-') {
			fu = "负";
		}
		ls = ls.replaceAll("-", "");
		StringTokenizer tokens = new StringTokenizer(ls, ".");
		while (tokens.hasMoreTokens()) {
			// TODO:modifier.songfq.010112 : String 组装修改
			StringBuffer eles = new StringBuffer();
			String t1 = tokens.nextToken();
			if (tokens.hasMoreTokens()) {
				String t2 = tokens.nextToken();
				if (t2.length() == 1){
					eles.append(t2).append("0");
				}
				if (t2.length() >= 2) {
					for (int e1 = 0; e1 < t2.length(); e1++) {
//						if (e1 >= 2) {
//							// eles = eles; //FindBugs zhaiph 20081215
//						} else {
//							eles.append(t2.charAt(e1));
//						}
						
						if (e1 < 2) {
							eles.append(t2.charAt(e1));
						} 
						
					}
				}
				if (t2.length() < 1){
					eles.append("00");
				}
				ls = t1 + eles.toString();
			} else {
				ls = t1 + "00";
			}
		}
		// TODO:modifier.songfq.010113 : 大写转换错误问题
		String name = "";
		String lan = "";
		int n = ls.length();
		for (int l = ls.length() - 1; l > -1; l--) {
			if ("0".equals(ls.charAt(l) + "")) {
				name = "零";
			} else if ("1".equals(ls.charAt(l) + "")) {
				name = "壹";
			} else if ("2".equals(ls.charAt(l) + "")) {
				name = "贰";
			} else if ("3".equals(ls.charAt(l) + "")) {
				name = "叁";
			} else if ("4".equals(ls.charAt(l) + "")) {
				name = "肆";
			} else if ("5".equals(ls.charAt(l) + "")) {
				name = "伍";
			} else if ("6".equals(ls.charAt(l) + "")) {
				name = "陆";
			} else if ("7".equals(ls.charAt(l) + "")) {
				name = "柒";
			} else if ("8".equals(ls.charAt(l) + "")) {
				name = "捌";
			} else if ("9".equals(ls.charAt(l) + "")) {
				name = "玖";
			} else {
				name = "";
			}
			if (!"零".equals(name) || name != "零") {
				if (l == (n - 1) && n <= ls.length()){
					name = name + "分";
				}
				if (l == (n - 2) && n <= ls.length()){
					name = name + "角";
				}
				if (l == (n - 3) && n <= ls.length()){
					name = name + "元";
				}
				if (l == (n - 4) && n <= ls.length()){
					name = name + "拾";
				}
				if (l == (n - 5) && n <= ls.length()){
					name = name + "佰";
				}
				if (l == (n - 6) && n <= ls.length()){
					name = name + "仟";
				}
				if (l == (n - 7) && n <= ls.length()){
					name = name + "万";
				}
				if (l == (n - 8) && n <= ls.length()){
					name = (lan.indexOf("万") == -1) ? name + "拾万" : name + "拾";
				}
				if (l == (n - 9) && n <= ls.length()){
					name = (lan.indexOf("万") == -1) ? name + "佰万" : name + "佰";
				}
				if (l == (n - 10) && n <= ls.length()){
					name = (lan.indexOf("万") == -1) ? name + "仟万" : name + "仟";
				}
				if (l == (n - 11) && n <= ls.length()){
					name = name + "亿";
				}
				if (l == (n - 12) && n <= ls.length()){
					name = (lan.indexOf("万") == -1) ? name + "拾亿" : name + "拾";
				}
				if (l == (n - 13) && n <= ls.length()){
					name = (lan.indexOf("万") == -1) ? name + "佰亿" : name + "佰";
				}
			}
			lan = name + lan;

		}
		String back = "";
		for (int s = 0; s < lan.length(); s++) {
			if ("零".equals(lan.charAt(0) + "")){
				back = back + "";
			}
			if (s + 1 == lan.length()) {
				if ("零".equals(lan.charAt(s) + "")){
					back = back + "";
				}else{
					back = back + lan.charAt(s);
				}
			} else {
				if ("零".equals(lan.charAt(s) + "") && "零".equals(lan.charAt(s + 1) + "")){
					back = back + "";
				}else{
					back = back + lan.charAt(s);
				}
			}
		}
		if ("".equals(back) || "" == back){
			back = "零元整";
		}
		else {
			if (!back.endsWith("分") && !back.endsWith("角") && !back.endsWith("元")){
				back = back + "元整";
			}
			if (back.endsWith("元")){
				back = back + "整";
			}
			if (back.startsWith("零")){
				// back = back.toString().substring(1,
				// back.toString().length()); //FindBugs zhaiph 20081215
				back = back.substring(1, back.length()); // zhaiph 20081215
			}
		}
		// //System.out.println(back);
		return fu + back;
	}
	
	
}
