package com.tydic.auth.client.utils;

import java.util.Date;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class ObjectIsNull
{
  public static boolean check(Object obj)
  {
    if (obj == null) return true;

    if ((obj instanceof String)) {
      return checkString((String)obj);
    }

    if ((obj instanceof Integer)) {
      return checkInteger((Integer)obj);
    }

    if ((obj instanceof Long)) {
      return checkLong((Long)obj);
    }

    if ((obj instanceof Double)) {
      return checkDouble((Double)obj);
    }

    if ((obj instanceof Date)) {
      return checkDate((Date)obj);
    }

    if ((obj instanceof List)) {
      return checkList((List)obj);
    }

    if ((obj instanceof String[])) {
      return checkDate((String[])obj);
    }

    return false;
  }

  private static boolean checkDate(String[] strings)
  {
    return strings.length <= 0;
  }

  private static boolean checkList(List list)
  {
    return list.size() <= 0;
  }

  private static boolean checkDate(Date date)
  {
    return date == null;
  }

  private static boolean checkDouble(Double double1)
  {
    return double1.doubleValue() == 0.0D;
  }

  private static boolean checkLong(Long long1)
  {
    return (long1.longValue() == 0L) || (long1.longValue() == -1L);
  }

  private static boolean checkInteger(Integer integer)
  {
    return (integer.intValue() == 0) || (integer.intValue() == -1);
  }

  private static boolean checkString(String string)
  {
    return (string.trim().length() <= 0) || ("null".equalsIgnoreCase(string));
  }
  
  public static boolean isNumeric(String str) {
		Pattern pattern = Pattern.compile("[0-9]*");
		Matcher isNum = pattern.matcher(str);
		if (!isNum.matches()) {
			return false;
		}
		return true;
	}
}