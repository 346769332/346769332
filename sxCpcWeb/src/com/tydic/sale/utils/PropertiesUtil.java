package com.tydic.sale.utils;

import java.io.IOException;
import java.util.Properties;


public class PropertiesUtil{
	private static Properties properties = null;
	private static String fileName = "/configuration.properties";
	
	public synchronized static Properties getProperties(){
		if(properties==null){
			properties = new Properties();
			try {
				properties.load((PropertiesUtil.class.getResourceAsStream(fileName)));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
		return properties;
	}
	/**
	 * 得到一个配置参数
	 * @param key
	 * @return
	 */
	public static String getProperty(String key){
		return getProperties().getProperty(key);
	}
	/**
	 * 得到一个配置参数
	 * @param key
	 * @param defaultValue 
	 * @return
	 */
	public static String getProperty(String key,String defaultValue){
		return getProperties().getProperty(key,defaultValue);
	}
	
	/**
	 * 添加或更新一个配置参数
	 * @param key
	 * @param value
	 */
	public static void putProperty(String key , String value){
		getProperties().put(key, value);
	}
	
	/**
	 * 刷新配置参数
	 */
	public synchronized static boolean refresh(){
		Properties p = new Properties();
		try {
			p.load(PropertiesUtil.class.getResourceAsStream(fileName));
		} catch (IOException e) {
			e.printStackTrace();
			return false;
		}
		if(properties!=null){
			synchronized (properties) {
				properties = p;
			}
		}else{
			properties = p;
		}
		return true;
	}
}