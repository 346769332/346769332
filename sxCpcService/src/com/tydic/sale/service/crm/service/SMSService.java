package com.tydic.sale.service.crm.service;

import java.util.List;
import java.util.Map;

public interface SMSService {

	/**
	 * 发送【流程流转】短信
	 * @param busiId      [关键属性]
	 * @param busiNum     [关键属性]
	 * @param smsModelId  [关键属性]
	 * @return
	 */
	public Map<String, Object> sendNodeMessage(Map<String,Object> innerMap) ;
	
	/**
	 * 发送【流程流转】短信
	 * @param busiId
	 * @param busiNum
	 * @param smsModelId
	 * @param param  [发送参数变量替换]
	 * @return
	 */
	public Map<String,Object> sendNodeMessage(String busiId,String busiNum,Map<String,Object> smsModel,Map<String,Object> param);
	
	
	/**
	 * 
	 * [定时上行处理]
	 * 上行短信处理
	 * @return
	 */
	public Map<String,Object> upSmsOpt();
	
	
	/**
	 * [定时提醒即将超时/已超时流程单 需求/服务单]
	 */
	public void overTimeRemind();
	
	
	/**
	 * [定时]
	 * 准实时超时短信提醒
	 */
	public void overTimeQusiTime(Map<String,Object> parMap);
	
	/**
	 * 根据多线程推送短信
	 * @param busiId
	 * @param QBCSsmsModel
	 * @param overTimeSet
	 */
	public void sendSmsByThread(String busiId,Map<String,Object> smsModel,List<Map<String,Object>> smsSet);
	
	/**
	 * 获取短信模板
	 * @param smsModelSet
	 * @param smsId
	 * @return
	 */
	public Map<String,Object> getSMSModel(Map<String,Object> smsModelMap);
	
	/**
	 * 认领超时短信提醒
	 * @param param
	 */
	public void calimLimitTime(Map<String,Object> param);
	
	
	/*** 政策手册短信发送*/
	
	public void sedMessage(String busiId,String smsModelId,List<Map<String,Object>> smsSet,String desc);
}
