package com.tydic.common.dynamicDbSource;


@SuppressWarnings("unchecked")
public class DbContextHolder {
	
	/**
	 * 资金归集——生产库
	 */
	public static final String DB_CPC_DEFAULT = "0";

	/**
	 * 多角色门户——生产库
	 */
	public static final String DB_ROLE_PORTAL = "1";
	
	/**
	 * 统一接触平台——短信接口
	 */
	public static final String DB_ORA_ECP_SMS = "2";
	
	
	private static final ThreadLocal contextHolder = new ThreadLocal();   
	  
    public static void setDbType(String dbType) {   
        contextHolder.set(dbType);   
    }   
  
    public static String getDbType() { 

    	String dbType = (String) contextHolder.get(); 
        return dbType;   
    }   
  
    public static void clearDbType() {   
        contextHolder.remove();   
    }   
}