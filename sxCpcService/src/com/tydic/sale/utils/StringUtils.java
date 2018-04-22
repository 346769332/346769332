package com.tydic.sale.utils;

import java.io.UnsupportedEncodingException;
import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Collection;
import java.util.Date;
import java.util.StringTokenizer;

public class StringUtils {
	// static DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	// 判断字符串是否为数字
	public static boolean isDigit(String str) {
		if (isEmpty(str))
			return false;
		char[] c = str.toCharArray();
		for (int i = 0; i < c.length; i++) {
			if (!Character.isDigit(c[i])){
				return false;
			}
		}
		return true;
	}

	/**
	 * 特殊字符替换
	 * <br/>例如：&amp; -->  &
	 * @param value
	 * @return
	 */
	public static String replaceTS(String value){
		
		String tepm1 = value.replaceAll("&amp;","&");
		String tepm2 = tepm1.replaceAll("&lt;","<");
		String tepm3 = tepm2.replaceAll("&gt;",">");
		String tepm4 = tepm3.replaceAll("&apos;","'");
		String tepm5 = tepm4.replaceAll("&quot;","\"");

		return tepm5;
		
	}
	public static boolean isEquals(String val, String defaultVal) {
		if (val == null) {
			if (defaultVal == null) {
				return true;
			}
			return false;
		}
		if (val.equals(defaultVal)) {
			return true;
		}
		return false;
	}

	// 判断字符串是否为日期
	public static boolean isDate(String str) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
		if (isEmpty(str)){
			return false;
		}
		try {
			dateFormat.parse(str);
			return true;
		} catch (ParseException e) {
			return false;
		}
	}

	public static boolean isEquals(Long l1, Long l2) {
		if (l1 == null || l2 == null) {
			return false;
		}
		if (l1.toString().equals(l2.toString())) {
			return true;
		}
		return false;
	}

	// 取得字符串的长度
	public static int length(String str) {
		if (isEmpty(str)){
			return 0;
		}
		return str.trim().length();
	}

	public static String getPropertyWithColumn(String columnName) {
		String[] columnSplits = null;
		// TODO:modifier.songfq.010112 : String 组装修改
		StringBuffer returnString = new StringBuffer("get");
		if (columnName != null && columnName.indexOf('_') > 0) {
			columnSplits = columnName.trim().split("_");
			for (String varS : columnSplits) {
				returnString.append(varS.substring(0, 1).toUpperCase()).append(varS.substring(1).toLowerCase());
			}
			return returnString.toString();
		} else {
			if (columnName != null && columnName.trim().length() > 0) {
				returnString.append(columnName.substring(0, 1).toUpperCase()).append(
						columnName.substring(1).toLowerCase());
				return returnString.toString();
			} else {
				return null;
			}
		}
	}

	/**
	 * @Description：判断是否为空
	 * @param obj
	 * @return
	 */
	public static boolean isEmpty(Object obj) {
		if (obj == null) {
			return true;
		}
		if ("".equals(obj) || "null".equals(obj) || "NULL".equals(obj) || "".equals(obj.toString().trim())) {
			return true;
		}
		return false;
	}

	/**
	 * @Description：判断是否为空
	 * @param c
	 * @return
	 */
	@SuppressWarnings( { "unchecked", "static-access" })
	public static boolean isEmpty(Collection c) {
		if (c == null || c.size() <= 0) {
			return true;
		}
		return false;
	}

	/**
	 * @Description：转换为长整型
	 * @param obj
	 * @return
	 */
	public static long parseLong(String s) {
		if (!isEmpty(s)) {
			return Long.valueOf(s);
		}
		return -1;
	}

	/**
	 * @Description：转换为整型
	 * @param s
	 * @return
	 */
	public static int parseInt(String s) {
		if (!isEmpty(s)) {
			return Integer.valueOf(s);
		}
		return -1;
	}

	/**
	 * @Description：转换为short
	 * @param s
	 * @return
	 */
	public static short parseShort(String s) {
		if (!isEmpty(s)) {
			return Short.parseShort(s);
		}
		return -1;
	}

	/**
	 * @Description：解析目录树标志
	 * @param identifier
	 *            目录唯一值
	 * @return
	 */
	@SuppressWarnings("unused")
	public static String[] split(final String identifier, final String delim) {
		if (isEmpty(identifier) || isEmpty(delim)) {
			return null;
		}
		StringTokenizer toKen = new StringTokenizer(identifier, delim);
		String[] returnObj = new String[toKen.countTokens()];
		int i = 0;
		while (toKen.hasMoreTokens()) {
			returnObj[i] = toKen.nextToken();
			i++;
		}
		return returnObj;
	}

	public static String backBigMoney(String ls) {
		String fu = "";
		if (!StringUtils.isEmpty(ls) && ls.charAt(0) == '-') {
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

	/**
	 * 为字符串替换新的分隔符
	 * 
	 * @param str
	 *            替换的字符串值
	 * @param oldSeparator
	 *            字符串中存在的分隔符
	 * @param newSeparator
	 *            字符串中新的分隔符
	 * @return
	 */
	public static String replaceAll(String str, char oldSeparator, char newSeparator) {
		// TODO:modifier.songfq.010112 : String 组装修改
		StringBuffer v = new StringBuffer();
		for (int i = 0; i < str.length(); i++) {
			char c = str.charAt(i);
			v = (c == oldSeparator) ? v.append(newSeparator) : v.append(c);
		}
		return v.toString();
	}

	public static String getGBKCharacter(String str) {
		if (isEmpty(str)) {
			return str;
		}
		String obj = "";
		try {
			obj = new String(str.getBytes("GBK"), "GBK");
		} catch (UnsupportedEncodingException e) {
			return str;
		}
		return obj;
	}

	public static String getStrFromLong(Long l) {
		if (l == null) {
			return null;
		} else {
			return l.toString();
		}
	}

	public static Long parseLongObj(Object obj) {
		if (obj == null) {
			return null;
		}
		return Long.valueOf(obj.toString());
	}

	public static String toString(Object obj) {
		if (obj == null) {
			return null;
		}
		return obj.toString();
	}

	public static Date setDate(Date date) {
		if (date == null) {
			return null;
		}
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd");
		String str = df.format(date);
		str = str + " 23:59:59";
		SimpleDateFormat df1 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			return df1.parse(str);
		} catch (ParseException e) {
			return null;
		}
	}

	public static String formatDate(Date date, String format) {
		if (date == null || format == null || "".equals(format.trim())) {
			return "";
		}
		SimpleDateFormat df = new SimpleDateFormat(format);
		
			return df.format(date);
	}

	public static Date setDateMinTime(Date date) {
		if (date == null) {
			return null;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 00);
		cal.set(Calendar.MINUTE, 00);
		cal.set(Calendar.SECOND, 00);
		return cal.getTime();
	}

	public static Date setDateMaxTime(Date date) {
		if (date == null) {
			return null;
		}
		Calendar cal = Calendar.getInstance();
		cal.setTime(date);
		cal.set(Calendar.HOUR_OF_DAY, 23);
		cal.set(Calendar.MINUTE, 59);
		cal.set(Calendar.SECOND, 59);
		return cal.getTime();
	}

	/**
	 * 比较两个日期大小
	 * 
	 * @Description：
	 * @param param0
	 * @param param1
	 * @return
	 */
	public static boolean compareToDate(Date param0, Date param1) {
		if (param0 == null){
			return false;
		}
		if (param1 == null){
			return true;
		}
		DateFormat df = new SimpleDateFormat("yyyyMMdd");
		return Integer.parseInt(df.format(param0)) > Integer.parseInt(df.format(param1));
	}

	/**
	 * 判断两个日期年月是否相等
	 * 
	 * @Description：
	 * @param beginDate
	 * @param endDate
	 * @return
	 */
	public static boolean isMonthEquals(Date beginDate, Date endDate) {
		if (beginDate == null || endDate == null) {
			return false;
		}
		DateFormat df = new SimpleDateFormat("yyyyMM");
		return Integer.parseInt(df.format(beginDate)) == Integer.parseInt(df.format(endDate));
	}

	/**
	 * 比较两个日期是否同一天（套餐变更是否变更服务协议时间）
	 * 
	 * @Description：
	 * @param param0
	 * @param param1
	 * @return
	 */
	public static boolean equalsToDate(Date param0, Date param1) {
		if (param0 == null){
			return false;
		}
		if (param1 == null){
			return true;
		}
		DateFormat df = new SimpleDateFormat("yyyyMMdd");
		return Integer.parseInt(df.format(param0)) == Integer.parseInt(df.format(param1));
	}

	public static void main(String[] args) {
		System.out.println(StringUtils.backBigMoney("190000.12"));
	}
}
