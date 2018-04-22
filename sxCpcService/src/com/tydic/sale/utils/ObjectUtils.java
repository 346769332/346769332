package com.tydic.sale.utils;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSONObject;

@SuppressWarnings("unchecked")
public class ObjectUtils {

	private static final Logger log = Logger.getLogger(ObjectUtils.class);
	
	/**
	 * 将对象转换成Map
	 * @param obj
	 * @param getNull 是否需要null值的属性
	 * @return
	 */
	public static Object toMap(Object obj,boolean getNull){
	
		return ObjectUtils.reanderMap( obj,getNull);
	}
	
	/**
	 * 将对象转换成Map
	 * @param obj
	 * @param getNull 是否需要null值的属性
	 * @return
	 */
	public static List<Object> toMapByList(Object obj,boolean getNull){
	
		
		List<Object> objSet = (List<Object>) obj;
		
		List<Object> resultSet = new ArrayList<Object>();
		
		for(int i=0 ; i<objSet.size() ; i++){
			Object result = ObjectUtils.toMap(objSet.get(i), getNull);
			if(result instanceof List 
					|| result instanceof Set){
				List<Object> resultList = (List<Object>) result;
				if(resultList.size()>0){
					resultSet.add(resultList);
				}
			}
			else if(result instanceof Map){
				Map<Object,Object> map = (Map<Object,Object>) result;
				if(!map.isEmpty()){
					resultSet.add(map);
				}
			}
		}
		
		return resultSet;
	}
	
	/**
	 * 将对象转换成JSON
	 * @param obj
	 * @param getNull 是否需要null值的属性
	 * @return
	 */
	public static String toJSON(Object obj,boolean getNull){
		
		JSONObject json = (JSONObject) JSONObject.toJSON(ObjectUtils.reanderMap( obj,getNull));
		
		return json.toJSONString();
	}
	
	/**
	 * 将对象转换成SOO  Map
	 * @param sooType
	 * @param sooName
	 * @param obj
	 * @param getNull 是否需要null值的属性
	 * @return
	 */
	public static Map toSOOMap(String sooType,String sooName,Object obj,boolean getNull){
		Map<String,Object> sooMap = new HashMap<String,Object>();
		 
		
		Map<String,Object> pubMap = new HashMap<String,Object>();
		pubMap.put("TYPE", sooType);
		
		Object soo = null;
		
		if(obj instanceof List || obj instanceof List){
			soo = ObjectUtils.toMapByList( obj, getNull);
			List<Object> resultSoo = (List<Object>) soo;
			if(resultSoo.size() == 0){
				soo = null;
			}
		}else{
			soo = ObjectUtils.toMap( obj, getNull);
			Map<Object,Object> resultSoo = (Map<Object,Object>) soo;
			if(resultSoo.isEmpty()){
				soo = null;
			}
		}
		
		if(null == soo || ObjectUtils.isNull(soo)){
			return null;
		}
		
		sooMap.put("PUB_REQ", pubMap);
		sooMap.put(sooName  , soo	);
		sooMap.put("SOO_NAME", sooName);
		
		
		return sooMap;
	}

	/**
	 * 将对象转换成SOO
	 * @param sooType
	 * @param sooName
	 * @param obj
	 * @param getNull 是否需要null值的属性
	 * @return
	 */
	public static String toSOOstr(String sooType,String sooName,Object obj,boolean getNull){
		
		
		Map sooMap = ObjectUtils.toSOOMap( sooType, sooName, obj, getNull);
		
		JSONObject json = (JSONObject) JSONObject.toJSON(sooMap);
		
		return json.toJSONString();
	}
	
	private static Object reanderMap(Object obj,boolean getNull){
		
		/******null类型*******/
		if(null == obj) 
			return obj;
		/******基本类型【直接返回】*******/
		if(ObjectUtils.isBasicType(obj.getClass())){
			return obj;
		}
		/******Map类型*******/
		else if(obj instanceof Map){
			return ObjectUtils.getMapByMap( obj, getNull);
		}
		/******list类型*******/
		else if(obj instanceof List 
				|| obj instanceof Set){
			return ObjectUtils.getListByList( obj, getNull);
		}
		/******obj类型*******/
		else{
			return ObjectUtils.getFieldByField( obj, getNull);
		}
	}
	
	
	// 获取Map类型
	private static Map<Object,Object> getMapByMap(Object obj,boolean getNull){
		Map<String,Object> map = (Map<String,Object>)obj;
		Map<Object,Object> resultMap = new HashMap<Object,Object>();
		for( Iterator<String> it = map.keySet().iterator() ; it.hasNext();){
			String key = it.next();
			Object mapVal = ObjectUtils.reanderMap( map.get(key), getNull);
			if((null != mapVal && !"".equals(mapVal)) || getNull){
				resultMap.put(key, mapVal);
			}
		}
		return resultMap;
	}
	// 获取List类型
	private static List<Object> getListByList(Object obj,boolean getNull){
		List<Object>  objList = (List<Object>) obj;
		List<Object> resultList = new ArrayList<Object>();
		for(Iterator<?> it = objList.iterator() ; it.hasNext();){
			Object paramObj = ObjectUtils.reanderMap(it.next(), getNull);
			if(paramObj instanceof List || paramObj instanceof Set){
				if(((List<Object>)paramObj).size()>0){
					resultList.add(paramObj);
				}
			}else{
				if(paramObj instanceof Map && !((Map<Object,Object>)paramObj).isEmpty()){
					resultList.add(paramObj);
				}else if(null != paramObj || getNull){
					resultList.add(paramObj);
				}
			}
		}
		if(resultList.size() == 0){
			resultList = null;
		}
		
		return resultList;
	}
	
	// 获取Field属性值
	private static Map<Object,Object> getFieldByField(Object obj,boolean getNull){
		
		Map<Object,Object> map = new HashMap<Object,Object>();
		
		try {
			Class<? extends Object> clas = obj.getClass();
			Field[] fields = clas.getDeclaredFields();
			for(Field field : fields){
				//反射出方法
				Method method = null; 
				String methodName = "get" + ObjectUtils.toFirstLetterUpperCase(field.getName());
				try {
					method = clas.getDeclaredMethod( methodName);
				} catch (NoSuchMethodException e) {
					continue;
				}
				Object param = method.invoke(obj, new Object[0]);
				//是否需要空值
				if((null == param || "".equals(param)) && !getNull){
					continue;
				}
				/***基础类型**/
				if(ObjectUtils.isBasicType(field.getType())){
					if(null == param) param = "";
					map.put(field.getName(), param);
				}
				/***非基础类型*/
				else{
						
					Object paramObj = ObjectUtils.reanderMap(param,getNull);
					if(paramObj instanceof Set || paramObj instanceof List){
						if(((List<Object>)paramObj).size()>0){
							map.put(field.getName(),paramObj);
						}
					}else{
						if(paramObj instanceof Map && !((Map<Object,Object>) paramObj).isEmpty()){
							map.put(field.getName(),paramObj);
						}else if(null != paramObj || getNull){
							map.put(field.getName(),paramObj);
						}
					}
				}
				
			}
		} catch (SecurityException e) {
			log.error("对象转换错误：SecurityException", e);
		} catch (IllegalArgumentException e) {
			log.error("对象转换错误：IllegalArgumentException", e);
		} catch (IllegalAccessException e) {
			log.error("对象转换错误：IllegalAccessException", e);
		} catch (InvocationTargetException e) {
			log.error("对象转换错误：InvocationTargetException", e);
		}
		
		return map;
	}
	
	
	private static boolean isNull(Object soo){
		
		boolean isNull = true;
		
		if(soo instanceof List || soo instanceof Set){
			return false;
		}
		else{
			Map<Object,Object> sooMap = (Map<Object, Object>) soo;
			for(Iterator<Object> it = sooMap.keySet().iterator() ; it.hasNext();){
				String key = String.valueOf(it.next());
				String val = String.valueOf(sooMap.get(key));
				if(null != val && !"".equals(val)){
					isNull = false;
					break;
				}
			}
		}
		
		return isNull;
	}
	
	// 将手字母大写
	private static String toFirstLetterUpperCase(String strName) {
		if (strName == null || strName.length() < 2) {
			return strName;
		}
		String firstLetter = strName.substring(0, 1).toUpperCase();
		return firstLetter + strName.substring(1, strName.length());
	}
	

	/**
	 * 对象是否基础类型
	 * @param obj
	 * @return
	 */
	private static boolean isBasicType(Class<?> obj) {

		/*String*/
		if(obj == String.class){
			return true;
		}
		/*Integer*/
		if(obj == Integer.class){
			return true;
		}
		/*Long*/
		if(obj == Long.class){
			return true;
		}
		/*Double*/
		if(obj == Double.class){
			return true;
		}
		/*Date*/
		if(obj == Date.class){
			return true;
		}
		if(obj == Map.class){
			return true;
		}
		if(obj == BigDecimal.class){
			return true;
		}
		
		return false;
	}
	
	public static void main(String[] args){
		List<Object>  ss = new ArrayList<Object>();
		
		/*for(int i=0 ; i<3 ; i++){
			CustVO  c= new CustVO();
			c.setAGRT_TYPE_ID("aGRTTYPEID_"+i);
			c.setAREA_ID("aREAID_"+i);
			c.setBST_CARD("bSTCARD_"+i);
			ss.add(c);
		}*/
		
		for(int i=0 ; i<3; i++){
			Map<Object,Object> aa = new HashMap<Object,Object>();
			aa.put("AAA", "AAA"+i);
			aa.put("CCC", "");
			ss.add(aa);
		}
		
		/*List  ss2 = new ArrayList();
		for(int i=0 ; i<10; i++){
			Map aa = new HashMap();
			//aa.put("BBB", "BBB"+i);
			aa.put("LIST"+i, new ArrayList());
			ss2.add(aa);
		}
		ss.add(ss2);
		*/
		 
		String a = ObjectUtils.toSOOstr("SSSS_SX", "PROD_INST", ss, false);
		
		System.out.println(a);
	
	}
}
