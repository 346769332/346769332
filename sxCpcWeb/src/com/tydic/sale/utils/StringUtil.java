package com.tydic.sale.utils;

import java.net.URLDecoder;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.axis.wsdl.symbolTable.Undefined;

public class StringUtil {
	

	
	public static boolean isNotEmpty(String str){
		if(str!=null&&!"".equals(str)&&!"null".equals(str)){
			return true;
		}else{
			return false;
		}
	}
	
	public static boolean isEmpty(String str){
		return !isNotEmpty(str);
	}
	
	public static boolean objIsNotEmpty(Object obj){
		if(obj!=null&&!"".equals(obj)&& !"undefined".equals(obj)&& !"null".equals(obj)){
			return true;
		}else{
			return false;
		}
	}
	  public static String replaceTab(String str){  
		   String dest = "";
	        if (str!=null) {
	            Pattern p = Pattern.compile("\\t|\r|\n");
	            Matcher m = p.matcher(str);
	            dest = m.replaceAll("").trim();
	        }
	        return dest; 
	    } 
	  public static String replaceTab2(String str){  
		   String dest = "";
	        if (str!=null) {
	            Pattern p = Pattern.compile("\\t|\r|\n");
	            Matcher m = p.matcher(str);
	            dest = m.replaceAll(" ");
	        }
	        return dest; 
	    } 	
	
	/**
	 * 针对传入的中文，有特殊符号（%、+等）的，优化处理
	 * 
	 * @author liguohu (ligh@tydic.com)
	 * @param inParam
	 * @return
	 */
	public static String decodeParam(String data) {
		try {
			StringBuffer tempBuffer = new StringBuffer();
			int incrementor = 0;
			int dataLength = data.length();
			while (incrementor < dataLength) {
				char charecterAt = data.charAt(incrementor);
				if (charecterAt == '%') {
					tempBuffer.append("<percentage>");
				} else if (charecterAt == '+') {
					tempBuffer.append("<plus>");
				} else {
					tempBuffer.append(charecterAt);
				}
				incrementor++;
			}
			data = tempBuffer.toString();
			
			data = URLDecoder.decode(data, "UTF-8");
			data = new String(data.getBytes("ISO8859-1"),"UTF-8");
			data = data.replaceAll("<percentage>", "%");
			data = data.replaceAll("<plus>", "+");
		} catch (Exception e) {
			e.printStackTrace();
		}
		return data;
	}
	
	
	/**
	 * 把时间格式化为后台需要格式yyyyMMdd
	 * @return
	 * @throws ParseException 
	 */
	public static String formatDateForBack(String dateStr) {
		if (isNotEmpty(dateStr)) {
			return dateStr.replaceAll("-", "");
		}

		return dateStr;

	}
	
	public static String checkLatnId(String latnId){
		
		if(StringUtil.isEmpty(latnId)){
			System.out.println("latn warning:latnId is null,that's a mistake,please check!");
			//默认给563
			latnId="888";
			
			try {
				throw new Exception("latn warning:latnId is null,that's a mistake,please check!");
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		
			
		}
		
		return latnId;
	}
	
	
	/**
	 * 获取下一天
	 * @param currentDay
	 * @return
	 */
	public static String getNextDay(String currentDay) {
		String rlt = "";
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		try {
			Date d = sdf.parse(currentDay);
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(d);
			calendar.add(Calendar.DAY_OF_YEAR, 1);
			rlt = new SimpleDateFormat("yyyyMMdd").format(calendar.getTime());
		} catch (ParseException e) {
			e.printStackTrace();
		}
		return rlt;
	}


	
}
