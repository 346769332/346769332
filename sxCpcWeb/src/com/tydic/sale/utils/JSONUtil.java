package com.tydic.sale.utils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

/**
 * JSON工具
 */
public class JSONUtil {

	/**
	 * 转换JSON字符串为对象列表
	 * @param jsonString
	 * @param cla
	 * @return Object
	 */
	@SuppressWarnings("unchecked")
	public static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
	}
	
	/**
	 * 转换JSON字符串为Map列表
	 * @param jsonString
	 * @param cla
	 * @return Object
	 */
	@SuppressWarnings("unchecked")
	public static List toMapLst(String jsonString) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.fromObject(jsonObject));
		}
		return lists;
	}
	
	@SuppressWarnings("unchecked")
	public static List toList(List list, Class cla) {
		return JSONUtil.toList(JSONArray.fromObject(list).toString(), cla);
	}
	
	/**
	 * 转换JSON字符串为对象
	 * @param jsonString
	 * @param cla
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public static Object toObject(String jsonString, Class cla) {
		return JSONObject.toBean(JSONObject.fromObject(jsonString), cla);
	}
	
	/**
	 *对复杂类型对象的json转换
	 */
	@SuppressWarnings("unchecked")
	public static Object toFzObject(String jsonString, Class cla,Map<String, Class> st) {
		return JSONObject.toBean(JSONObject.fromObject(jsonString), cla,st);
	}
	
	/**
	 * 转换JSON字符串为MAP
	 * @param s
	 * @return
	 */
	public static Map<String,Object> toMap(String s){
		Map<String,Object> map=new HashMap<String,Object>();
		JSONObject json=JSONObject.fromObject(s);
		Iterator keys=json.keys();
		while(keys.hasNext()){
			String key=(String) keys.next();
			String value=json.get(key).toString();
			if(value.startsWith("{")&&value.endsWith("}")){
				map.put(key, toMap(value));
			}else{
				map.put(key, value);
			}

		}
		return map;
	}
	/**
	 * 转换JSON字符串为MAP
	 * @param s
	 * @return
	 */
	public static Map<Object,Object> toObjectMap(String s){
		Map<Object,Object> map=new HashMap<Object,Object>();
		JSONObject json=JSONObject.fromObject(s);
		Iterator keys=json.keys();
		while(keys.hasNext()){
			String key=(String) keys.next();
			String value=json.get(key).toString();
			if(value.startsWith("{")&&value.endsWith("}")){
				map.put(key, toMap(value));
			}else{
				map.put(key, value);
			}

		}
		return map;
	}
	/**
	 * 处理特殊字符
	 * @param s
	 * @return
	 */
	public static String removeSpecialChar(String s){    
        StringBuffer sb = new StringBuffer();     
        for(int i=0; i<s.length(); i++){     
            char c =s.charAt(i);     
            switch(c){     
//            case'\"':     
//                sb.append("\\\"");     
//                break;     
//            case'/':     
//                sb.append("\\/");     
//                break;     
            case'\b':      //退格
           	 sb.append("\\b");//换行    
                break;     
            case'\f':      //走纸换页
                sb.append("\\f");     
                break;     
            case'\n':     
                sb.toString().replace("\n", "");//换行    
                break;     
            case'\r':      //回车
                sb.toString().replaceAll("\r","");     
                break;     
            case'\t':      //横向跳格
           	 sb.toString().replaceAll("\t","");     
                break;     
            default:     
                sb.append(c);    
            }}
        return sb.toString();     
     }
	
	public static void main(String args[]){
		
	}
	
}
