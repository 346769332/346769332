package com.tydic.thread.vo;

import java.io.Serializable;

import com.tydic.sale.utils.Tools;

/**
 * 多线程需要输入的对象入参
 * @author xkarvy
 *
 */
@SuppressWarnings("unchecked")
public class MethodParams implements Serializable,Cloneable{

	private static final long serialVersionUID = -2349570766959192363L;
	
	
	/**
	 * 字段入参类型
	 */
	private Class classType;
	
	/**
	 * 字段入参值
	 */
	private Object value;
	
	/**
	 * 是否作为多线程分隔字段
	 */
	private boolean isThreadParams;
	
	public MethodParams(){
		
	}
	
	public MethodParams(Object value, boolean isThreadParams){
		this.classType = Tools.gatAttrClassType(value);
		this.value         = value;
		this.isThreadParams=isThreadParams;	
	}
	
	
	public Class getClassType() {
		return classType;
	}

	public void setClassType(Class classType) {
		this.classType = classType;
	}

	public Object getValue() {
		return value;
	}

	public void setValue(Object value) {
		this.value = value;
	}

	public boolean isThreadParams() {
		return isThreadParams;
	}

	public void setThreadParams(boolean isThreadParams) {
		this.isThreadParams = isThreadParams;
	}

	@Override
	public MethodParams clone() throws CloneNotSupportedException {
		return (MethodParams) super.clone();
	}

	
	
}
