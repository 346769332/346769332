package com.tydic.sale.utils;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

/**
 * 常用日期工具类
 * 
 * @version 1.0
 * @author liguohu (ligh@tydic.com)
 * @see 2013-5-30
 */
public class DateUtil {
	static SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd");
	private static SimpleDateFormat sdf = new SimpleDateFormat();

	// 获取当月第一天值
	public static String getStartMonthDay() {

		// 获取当前月第一天：
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, 0);
		c.set(Calendar.DAY_OF_MONTH, 1);// 设置为1号,当前日期既为本月第一天
		String first = format.format(c.getTime());
		return first;
	}

	// 获取当前日期值
	public static String getCurrentMonthDay() {

		// 获取当前月第一天：
		Calendar c = Calendar.getInstance();
		c.add(Calendar.MONTH, 0);
		String first = format.format(c.getTime());
		return first;
	}

	/**
	 * @param cal
	 * @return String
	 */
	public static synchronized String getDateSecondFormat(java.util.Calendar cal) {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		return getDateFormat(cal, pattern);
	}

	/**
	 * @param date
	 * @return String
	 */
	public static synchronized String getDateSecondFormat(java.util.Date date) {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		return getDateFormat(date, pattern);
	}

	/**
	 * @param cal
	 * @return String
	 */
	public static synchronized String getDateFormat(java.util.Calendar cal) {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		return getDateFormat(cal, pattern);
	}

	/**
	 * @param date
	 * @return String
	 */
	public static synchronized String getDateFormat(java.util.Date date) {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		return getDateFormat(date, pattern);
	}

	/**
	 * @param strDate
	 * @return java.util.Date
	 */
	public static synchronized Date parseDateFormat(String strDate) {
		String pattern = "yyyy-MM-dd HH:mm:ss";
		return parseDateFormat(strDate, pattern);
	}

	/**
	 * @param cal
	 * @param pattern
	 * @return String
	 */
	public static synchronized String getDateFormat(java.util.Calendar cal,
			String pattern) {
		return getDateFormat(cal.getTime(), pattern);
	}

	/**
	 * @param date
	 * @param pattern
	 * @return String
	 */
	public static synchronized String getDateFormat(java.util.Date date,
			String pattern) {
		synchronized (sdf) {
			String str = null;
			sdf.applyPattern(pattern);
			str = sdf.format(date);
			return str;
		}
	}

	/**
    @param strDate
    @param pattern
    @return java.util.Date
    */
   public static synchronized Date parseDateFormat(String strDate, String pattern)
   {
       synchronized (sdf)
       {
           Date date = null;
           sdf.applyPattern(pattern);
           try
           {
               date = sdf.parse(strDate);
           }
           catch (Exception e)
           {
           }
           return date;
       }
   }

   /**
    * 获取今天的日期，格式如：2006-11-09
    * @return String - 返回今天的日期
    */
   public static String getToday() {
       Calendar now = Calendar.getInstance(TimeZone.getDefault());
       java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd");
       sdf.setTimeZone(TimeZone.getDefault());
       return (sdf.format(now.getTime()));
   }
}
