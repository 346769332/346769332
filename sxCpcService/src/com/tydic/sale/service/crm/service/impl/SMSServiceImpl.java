package com.tydic.sale.service.crm.service.impl;

import java.io.UnsupportedEncodingException;
import java.rmi.RemoteException;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.xml.namespace.QName;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.axis.encoding.Base64;
import org.apache.log4j.Logger;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.common.dynamicDbSource.DbContextHolder;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.FlowService;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.crm.service.SearchService;
import com.tydic.sale.service.util.Tools;
import com.tydic.thread.MainThread;
import com.tydic.thread.vo.MethodParams;

public class SMSServiceImpl implements SMSService {

	private static Logger log = Logger.getLogger(SMSServiceImpl.class);

	final static String url = "http://135.224.81.208/smmcserver/msgservice";//url
	final static String nameSpace = "http://impl.webservice.smadmin.ztesoft.com/";//namespace
	final static String method = "send";//method
	final static String paramName = "itData";//paramnam
	final static String account = "10032";//接入系统设置的帐号
	final static String srcTermId = "1183600";//发送方号码[短信码]
	final static String tplInstId = "6401";//短信模板实例ID
	
	public static WebApplicationContext springContext;
	
	static Call call;
	
	private final String NAME_SPACE = "sms";
	
	public SMSServiceImpl(){
		SMSServiceImpl.initWebService();
	}

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	private  static void initWebService() {
		Service service = new Service();
		try {
			call = (Call) service.createCall();
			call.setTargetEndpointAddress(new java.net.URL(url));
			call.setOperationName(new QName(nameSpace, method));
			call.addParameter(paramName,
					org.apache.axis.encoding.XMLType.XSD_STRING,
					javax.xml.rpc.ParameterMode.IN);
			call.setUseSOAPAction(true);
			call.setReturnType(org.apache.axis.Constants.XSD_STRING);
			call.setSOAPActionURI(nameSpace + method);
		} catch (Exception e) {
			log.error("创建短信客户端失败！", e);
		}
		
		//获取sprig
		springContext = ContextLoader.getCurrentWebApplicationContext();
	}

	/**
	 * 发送短信
	 * @param paramValue
	 * @return
	 */
	private String callSMS(String paramValue){
		if(null == call)
			SMSServiceImpl.initWebService();
		Object obj = null;
		try {
			
			
			obj = call.invoke(new Object[] { paramValue });
		} catch (RemoteException e) {
			log.error("调用短信接口异常，或网络异常！", e);
		}
		
		return String.valueOf(obj);
	}
	
	
	/**
	 * 拼接短信报文
	 * @param busiNum
	 * @param paramValue
	 * @return
	 */
	private String rendarSMSMessage(String busiNum,String paramValue){
		
		byte[] paramBytes = new byte[2];
		try {
			paramBytes = paramValue.getBytes("utf-8");
		} catch (UnsupportedEncodingException e) {
			log.error("内容转码失败！", e);
		}
		
		StringBuffer sb = new  StringBuffer();
		sb.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>");
		sb.append("<request>");
		sb.append("<account>"+SMSServiceImpl.account+"</account>");
		sb.append("<password>E10ADC3949BA59ABBE56E057F20F883E</password>");
		sb.append("<tplInstId>"+SMSServiceImpl.tplInstId+"</tplInstId>");
		sb.append("<interfaceType>001</interfaceType>");
		sb.append("<businessType>001</businessType>");
		sb.append("<needReport>0</needReport>");
		sb.append("<msgFormat>15</msgFormat>");//GBK
		sb.append("<srcTermId>"+SMSServiceImpl.srcTermId+"</srcTermId>");
		sb.append("<destTermId>"+busiNum+"</destTermId>");
		sb.append("<msgContent>"+Base64.encode(paramBytes)+"</msgContent>");
		sb.append("</request>");
		
		return sb.toString();
	}
	
	@Override
	public Map<String, Object> sendNodeMessage(Map<String,Object> innerMap) {
		
		String busiId = String.valueOf(innerMap.get("busiId"));
		String busiNum = String.valueOf(innerMap.get("busiNum"));
		String smsModelId = String.valueOf(innerMap.get("smsModelId"));
		
		String[] modelIdList = {"SERVICE-BTZD","DEMAND-SENDBACK","DEMAND-ZYHD","DEMAND-ZYTD","DEMAND-ZZZXZP","DEMAND-XCEODH","DEMAND-XCEOCD","DEMAND-JDCFF","DEMAND-XCEOFQ","DEMAND-SZZSB","DEMAND-QZZHD","SERVICE-ZYXTRYHD"}; 
		
		Map<String, Object> reqMap = new HashMap<String, Object>();
		if (!(Tools.isNull(busiId))) {
			for (int i = 0; i < modelIdList.length; i++) {
				if (smsModelId == modelIdList[i]
						|| smsModelId.equals(modelIdList[i])) {
					String staffName = "";
					String loginCode = String.valueOf(innerMap.get("loginCode"));
					reqMap.clear();
					reqMap.put("loginCode", loginCode);

					Map<String, Object> sltMap = null;
					try {
						sltMap = this.cpcDao.qryMapInfo(NAME_SPACE,
								"select_staff", reqMap);
					} catch (Exception e) {
						log.error("访问数据库异常,或网络异常！", e);
					}
					if(sltMap != null) {
						staffName = String.valueOf(sltMap.get("STAFF_NAME"));
					}
					innerMap.put("staff_name", staffName);

					reqMap.clear();
					reqMap.put("busiId", busiId);
					String busiDetail = "";
					if (smsModelId.substring(0, 3) == "DEM" || "DEM".equals(smsModelId.substring(0, 3))) {
						try {
							sltMap = this.cpcDao.qryMapInfo(NAME_SPACE,
									"select_demand", reqMap);
						} catch (Exception e) {
							log.error("访问数据库异常,或网络异常！", e);
						}
						busiDetail = String.valueOf(sltMap.get("demand_details"));
					} else if (smsModelId.substring(0, 3) == "SER" || "SER".equals(smsModelId.substring(0, 3))) {
						try {
							sltMap = this.cpcDao.qryMapInfo(NAME_SPACE,
									"select_service", reqMap);
						} catch (Exception e) {
							log.error("访问数据库异常,或网络异常！", e);
						}
						busiDetail = String.valueOf(sltMap.get("SERVICE_DESC"));
					}
					busiDetail = busiDetail.length() > 40 ? busiDetail
							.substring(0, 40) + "..." : busiDetail;
					innerMap.put("busiDetails", busiDetail);
				}
			}
		}
		
		
		//查询短信模板
		Map<String, Object> smsModel = this.getSMSModel(innerMap);
		
		return this.sendNodeMessage(busiId, busiNum, smsModel,innerMap);
	}
	
	@Override
	public Map<String, Object> sendNodeMessage(String busiId,String busiNum,Map<String, Object> smsModel,Map<String,Object> param) {
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		resultMap.put("code", "0");
		resultMap.put("msg", "成功");
		if(Tools.isNull(smsModel)){
			resultMap.put("code", "-10");
			resultMap.put("msg", "[smsModelId]短信模板ID未传值，请确认！");
			return resultMap;
		}
		//短信模板内容替换
		String reqMsg = this.rendarSMSModel(smsModel, param);
		if(null == reqMsg){
			resultMap.put("code", "-2");
			resultMap.put("msg", "无法获取短信模板，尚未发送短信！");
			return resultMap;
		}
		//拼接短信报文
		String message = reqMsg;
		log.debug("需求单号："+busiId+"，的短信【发送】报文："+message);
		
		//保存记录
		String innTime = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
		String smsId = this.saveSMS( busiId, busiNum, reqMsg, message, innTime);
		if(Tools.isNull(smsId)){
			resultMap.put("code", "-3");
			resultMap.put("msg", "数据库访问异常，无法记录短信内容，尚未发送短信！");
			return resultMap;
		}
		if(Tools.isNull(busiNum)){
			String outTime = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
			this.updateSMSStatus( smsId, "待接收的业务号码为空或未配置!", outTime,"-1");
			resultMap.put("code", "-4");
			resultMap.put("msg", "待接收的业务号码为空或未配置，尚未发送短信！");
			return resultMap;
		}
		
		//执行发送
		String result = "";
		try {
			Map<String, Object> sendSmsParamMap = new HashMap<String, Object>();
			sendSmsParamMap.put("busi_num", busiNum);
			sendSmsParamMap.put("sms_msg", message);
			DbContextHolder.setDbType(DbContextHolder.DB_ORA_ECP_SMS);
			this.cpcDao.insert(NAME_SPACE,"insert_ecp_sms_ot", sendSmsParamMap);
			result = "已插入统一认证，数据接口无返回值！";
		} catch (Exception e) {
			DbContextHolder.clearDbType();
			log.error("插入短信统一平台【数据库访问异常】", e);
		}finally{
			DbContextHolder.clearDbType();
		}
		
		String outTime = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
		if(Tools.isNull(result)){
			resultMap.put("code", "-5");
			resultMap.put("msg", "短信记录码："+smsId+"；发送短信失败，调用接口失败！");
			this.updateSMSStatus( smsId, "发送短信失败，调用接口失败,或网络异常！", outTime,"-1");
			return resultMap;
		}
		//修改记录状态
		this.updateSMSStatus( smsId, result, outTime,"1");
		log.debug("需求单号："+busiId+"，的短信【响应】报文："+result);
		
		
		return resultMap;
	}
 
	
	public String saveSMS(String busiId, 
						String busiNum, 
						String smsMsg, 
						String innMsg, 
						String innTime){
		
		String smsId = "";
		try {
			smsId = String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "select_sms_record_id", null));
		} catch (Exception e) {
			log.error("查询短信序列码，数据库失败！", e);
		}
		
		if("".equals(smsId)){
			return "";
		}
			
		
		Map<String,Object> paramMap = new HashMap<String,Object>();
		
		paramMap.put("sms_id"	, smsId);
		paramMap.put("busi_id"	, busiId);
		paramMap.put("busi_num"	, busiNum);
		paramMap.put("sms_msg"	, smsMsg);
		paramMap.put("inn_msg"	, innMsg);
		paramMap.put("inn_time"	, innTime);
		paramMap.put("status"	, "0");
		try {
			this.cpcDao.insert(NAME_SPACE, "insert_sms_record", paramMap);
		} catch (Exception e) {
			log.error("插入短信记录表失败，数据库异常！", e);
			smsId = "";
		}
		
		return smsId;
	}
	
	public void updateSMSStatus(String smsId, 
								String outMsg, 
								String outTime,
								String status){
			
			Map<String,Object> paramMap = new HashMap<String,Object>();
			
			paramMap.put("sms_id"	, smsId);
			paramMap.put("out_time"	, outTime);
			paramMap.put("out_msg"	, outMsg);
			paramMap.put("status"	, status);
			try {
				this.cpcDao.insert(NAME_SPACE, "update_sms_record", paramMap);
			} catch (Exception e) {
				log.error("修改短信记录表失败，数据库异常！", e);
			}
	}
	
	/**
	 * 替换短信模板
	 * @param smsModel
	 * @param paramMap
	 * @return
	 */
	public String rendarSMSModel(Map<String,Object> smsModel,Map<String,Object> paramMap){
		
		if(Tools.isNull(smsModel) || Tools.isNull(smsModel.get("sms_content"))){
			return null;
		}
		
		String modelContent = String.valueOf(smsModel.get("sms_content"));
		
		
		for(Iterator it = paramMap.keySet().iterator() ; it.hasNext();){
			String key = String.valueOf(it.next());
			String val = String.valueOf(paramMap.get(key));
			String reKey = "["+key+"]";
			modelContent = modelContent.replace(reKey, val);
		}
		
		return modelContent;
	}
	
	/**
	 * 查询短信模板
	 * @param smsModelMap
	 * @return
	 */
	@Override
	public Map<String,Object> getSMSModel(Map<String,Object> smsModelMap){
		
		Map<String, Object> smsModel = null;
		try {
			smsModel = this.cpcDao.qryMapInfo(NAME_SPACE, "select_sms_model", smsModelMap);
		} catch (Exception e) {
			log.error("访问数据库异常,或网络异常！", e);
		}
		
		return  smsModel;
	}
	
	
	@Override
	public Map<String, Object> upSmsOpt() {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			Map<String,Object> param = new HashMap<String,Object>();
			//查询最近处理时间
			String lastUpRecvTime = String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "select_last_up_sms_service", null));
			if(Tools.isNull(lastUpRecvTime))
				lastUpRecvTime = Tools.addDate("yyyy-MM-dd", Calendar.YEAR, 0) + " 00:00:00";
			param.put("lastUpRecvTime", lastUpRecvTime);
			//查询待处理短信
			DbContextHolder.setDbType(DbContextHolder.DB_ROLE_PORTAL);
			List< Map<String, Object>> upSmsSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_up_sms_service", param);
			DbContextHolder.clearDbType();
			
			MainThread mainThead = MainThread.getNewIntance();
			 List<MethodParams> attrParams = MainThread.getMethodParamsSet(
					 	new MethodParams(upSmsSet,true)
					 );
			mainThead.runMainThread(5, this, "opterSmsEvalDemand", attrParams, true, "多线程执行上行短信处理");
			
			
		} catch (Exception e) {
			DbContextHolder.clearDbType();
			e.printStackTrace();
		}finally{
			DbContextHolder.clearDbType();
		}
		
		return resultMap;
	}

	
	public void opterSmsEvalDemand(List<Map<String, Object>> upSmsSet){
		
		if(Tools.isNull(springContext))
			springContext = ContextLoader.getCurrentWebApplicationContext();
		
		FlowService flowService = (FlowService) springContext.getBean("flowService");
		SearchService searchService = (SearchService) springContext.getBean("searchService");
		
		for(Map<String,Object> upSms : upSmsSet){
			
			try {
				/***参数格式化*/
				int optEval = -1;
				String optType = "",busiId = "",optDesc = "";
				String[] msgContent = String.valueOf(upSms.get("msg_content")).split("#");
				if(!Tools.isNull(msgContent) && msgContent.length>2){
					busiId  = msgContent[0];
					optDesc = msgContent[2];
					try {
						optEval = Integer.valueOf(String.valueOf(msgContent[1]));
					} catch (Exception e) {
						upSms.put("up_status", "-1");
						upSms.put("up_desc", "星级填写错误(非数字)，短信评价失败！");
						this.cpcDao.update(NAME_SPACE, "update_up_sms_service", upSms);
						continue;//退出
					}
				}
				/***处理上行短信逻辑*/
				if(optEval > -1){
					optEval = optEval > 5 ? 5 : optEval;
					optType = optEval == 0 ? "DH" : "PJ";
					//1.记录处理过程
					upSms.put("busi_id", busiId);
					upSms.put("opt_type", optType);
					upSms.put("opt_desc", optDesc);
					upSms.put("create_time", Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0));
					upSms.put("up_status", "0");
					upSms.put("up_desc"	, "处理中");
					this.cpcDao.insert(NAME_SPACE, "insert_up_sms_service", upSms);
					//2.调用流程
					Map<String,Object> flowOptMap = this.flowEvalChange(flowService,searchService, busiId, optType, optDesc, optEval);
					//3.更改记录状态
					upSms.put("up_status", flowOptMap.get("code"));
					upSms.put("up_desc", flowOptMap.get("msg"));
					this.cpcDao.update(NAME_SPACE, "update_up_sms_service", upSms);
					
				}else{
					upSms.put("up_status", "-1");
					upSms.put("up_desc", "短信格式错误");
					this.cpcDao.update(NAME_SPACE, "update_up_sms_service", upSms);
				}
			} catch (Exception e) {
				log.error("上行短信数据库操作异常，或网络异常："+upSms.toString(), e);
			}
		}
	}
	
	
	/**
	 * 根据busiID评价
	 * @return
	 */
	private Map<String,Object> flowEvalChange(FlowService flowService ,SearchService searchService,String busiId,String optType,String optDesc,int optEval){
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		//1.查询流程信息
		Map<String,Object> demandInfoMap = searchService.demandInfo(busiId, "Y");
		if("0".equals(demandInfoMap.get("code")) && !Tools.isNull(demandInfoMap.get("demandInst"))){
			
			Map<String,Object> demandInfo = (Map<String, Object>) demandInfoMap.get("demandInst");
			List<Map<String,Object>> recordSet = (List<Map<String, Object>>) demandInfoMap.get("recordSet");
			//1.1获取当前
			Map<String,Object> currRecord = null;
			for(Map<String,Object> record : recordSet){
				if("0".equals(String.valueOf(record.get("record_status")))){
					currRecord = record;
					break;
				}
			}
			//没有记录返回失败
			if(Tools.isNull(currRecord)){
				resultMap.put("code", "-1");
				resultMap.put("msg", "无法获取需求单："+busiId+"的当前记录信息");
				return resultMap;
			}
			/**********************/
			String now = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
			//2.流程处理
			Map<String,Object> flowRecordMap = new HashMap<String,Object>();
			flowRecordMap.put("busi_id"		, busiId);
			flowRecordMap.put("opt_desc"	, "用户短信回复评价星级："+optDesc);
			flowRecordMap.put("curr_node_id", currRecord.get("curr_node_id"));
			flowRecordMap.put("curr_node_name", currRecord.get("curr_node_name"));
			flowRecordMap.put("opt_time"	, now);
			flowRecordMap.put("record_id"	, currRecord.get("record_id"));
			Map<String,Object> demandMap = new HashMap<String,Object>();
			demandMap.put("demand_id"		, busiId);
			demandMap.put("over_opinion"	, optDesc);
			
			Map<String,Object> flowExchangeMap = null;
			//打分
			if("PJ".equals(optType)){
				demandMap.put("over_eval", optEval);
				demandMap.put("over_time", now);
				flowRecordMap.put("next_node_id", "100104");
				flowRecordMap.put("next_node_name", "已归档");
				flowRecordMap.put("opt_id"		, demandInfo.get("promoters_id"));
				flowRecordMap.put("opt_name"	, demandInfo.get("promoters"));
				//流程流转
				flowExchangeMap = flowService.flowExchange(flowRecordMap, demandMap,null, null,"demandFlow");
			}
			//打回
			else if("DH".equals(optType)){
				//1.2获取上一节点
				Map<String,Object> pastRecord = null;
				for(Map<String,Object> record : recordSet){
					if("1".equals(String.valueOf(record.get("record_status")))
							&& "100103".equals(String.valueOf(record.get("next_node_id")))){
						pastRecord = record;
						break;
					}
				}
				//没有记录返回失败
				if(Tools.isNull(pastRecord)){
					resultMap.put("code", "-1");
					resultMap.put("msg", "无法获取需求单："+busiId+"的上一步【待处理】记录信息");
					return resultMap;
				}
				
				flowRecordMap.put("next_node_id"	, pastRecord.get("curr_node_id"));
				flowRecordMap.put("next_node_name"	, pastRecord.get("curr_node_name"));
				flowRecordMap.put("opt_id"		, pastRecord.get("opt_id"));
				flowRecordMap.put("opt_name"	, pastRecord.get("opt_name"));
				//流程流转
				flowExchangeMap = flowService.flowExchange(flowRecordMap, demandMap, null, null,"demandFlow");
				
				//3.发送短信[打回]
				if("DH".equals(optType)){
					if(Tools.isNull(flowExchangeMap)){
						resultMap.put("code", "-1");
						resultMap.put("msg", "流程执行失败！");
					}
					else if("0".equals(String.valueOf(flowExchangeMap.get("code")))){
						String mob_tel = String.valueOf(pastRecord.get("mob_tel"));
						if(mob_tel.length() != 11){
							resultMap.put("code", "1");
							resultMap.put("msg", "成功，但短信发送失败，号码长度错误！");
							return resultMap;
						}
						try {
							Long.valueOf(mob_tel);
						} catch (NumberFormatException e) {
							resultMap.put("code", "1");
							resultMap.put("msg", "成功，但短信发送失败,号码类型错误！");
							return resultMap;
						}
						Map<String,Object> smsMap = new HashMap<String,Object>();
						String demand_theme = String.valueOf(demandInfo.get("demand_theme"));
						demand_theme = demand_theme.length()>20 ? demand_theme.substring(0, 20) +"..." : demand_theme;
						smsMap.put("busiNum"	, mob_tel);
						smsMap.put("busiId"		, demandInfo.get("demand_id"));
						smsMap.put("smsModelId"	, "DEMAND-XCEODH");
						smsMap.put("demandTheme", demand_theme);
						//发送
						resultMap = this.sendNodeMessage(smsMap);
					}
				}
			}
			
			resultMap.put("code", "1");
			resultMap.put("msg", "成功");
		}else{
			resultMap = demandInfoMap;
		}
		
		return resultMap;
	}

	@Override
	public void overTimeRemind() {
		
		Map<String,Object> parMap = new HashMap<String,Object>();
		
		try {
			
			List<Map<String,Object>> smsModelSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_sms_model", parMap);
			
			/**超时汇总短信逻辑*/
			String now = Tools.addDate("yyyyMMddHHmmss", Calendar.YEAR, 0);
			String busiDemandId = "TD" + now , busiServiceId = "TS" + now;
			//需求单汇总短信
			Map<String,Object> QBCSsmsModel = this.getSmsModelById( smsModelSet, "DSRW-DEMAND-HZCS");
			if(!Tools.isNull(QBCSsmsModel)){
				List<Map<String,Object>> overTimeDemandSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_overTime_demand_total", new HashMap());
				List<Map<String,Object>> willTimeDemandSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_willTime_demand_total", new HashMap());
				//1.合并集合
				List<Map<String,Object>> rendarTotalSet = this.rendarTotalSmsByLoginCode( willTimeDemandSet  ,overTimeDemandSet);
				this.totalToDayRemind(busiDemandId, QBCSsmsModel, rendarTotalSet,"超时统计【需求单】");
			}
			
			/**超时[需求单明细]短信逻辑*/
			//超时[需求单]短信逻辑
			Map<String,Object> demandInfoSmsModel = this.getSmsModelById( smsModelSet, "DSRW-DEMAND-INFO");
			if(!Tools.isNull(demandInfoSmsModel)){
				parMap.put("startTime", Tools.addDate("yyyyMMdd", Calendar.YEAR, 0));
				parMap.put("endTime", Tools.addDate("yyyyMMdd", Calendar.DATE, 1));
				List<Map<String,Object>> overTimeDemandSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_overTime_demand_set", parMap);
				this.totalToDayRemind("", demandInfoSmsModel, overTimeDemandSet,"超时[需求单]短信详情");
			}
			
			/**超时[服务单明细]短信逻辑*/
			//超时[服务单]短信逻辑
			Map<String,Object> serviceInfosmsModel = this.getSmsModelById( smsModelSet, "DSRW-SERVICE-INFO");
			if(!Tools.isNull(serviceInfosmsModel)){
				parMap.put("startTime", Tools.addDate("yyyyMMdd", Calendar.YEAR, 0));
				parMap.put("endTime", Tools.addDate("yyyyMMdd", Calendar.DATE, 1));
				List<Map<String,Object>> overTimeServiceSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_overTime_service_set", parMap);
				this.totalToDayRemind("", serviceInfosmsModel, overTimeServiceSet,"超时[服务单]短信详情");
			}
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private List<Map<String,Object>> rendarTotalSmsByLoginCode(List<Map<String,Object>> willOverTimeSet  ,List<Map<String,Object>> overTimeSet){
		
		
		List<Map<String,Object>> rendarTotalSet = new ArrayList<Map<String,Object>>();
		
		if(Tools.isNull(willOverTimeSet) && Tools.isNull(overTimeSet)){
			return rendarTotalSet;
		} 
		else if(Tools.isNull(willOverTimeSet)){
			rendarTotalSet.addAll(overTimeSet);
			return rendarTotalSet;
		}
		else if(Tools.isNull(overTimeSet)){
			rendarTotalSet.addAll(willOverTimeSet);
			return rendarTotalSet;
		}
		
		rendarTotalSet.addAll(willOverTimeSet);
		
		for(Map<String,Object> overTime : overTimeSet){
			
			//获取总数
			long totalSize = 0;
			try {
				totalSize = Long.valueOf(String.valueOf(overTime.get("totalSize")));
			} catch (NumberFormatException e) {
				totalSize = 0;
			}
			
			String loginCode = String.valueOf(overTime.get("loginCode"));
			String mobTel = String.valueOf(overTime.get("mobTel"));
			Map<String,Object> existsMap = null;
			//是否已经存在will
			for(Map<String,Object> rendarTotal : rendarTotalSet){
				String rendarLoginCode = String.valueOf(rendarTotal.get("loginCode"));
				String rendarMobTel = String.valueOf(rendarTotal.get("mobTel"));
				if(loginCode.equals(rendarLoginCode)
						&& mobTel.equals(rendarMobTel)){
					existsMap = rendarTotal;
					break;
				}
			}
			//不存在
			if(Tools.isNull(existsMap)){
				existsMap = overTime;
				existsMap.put("willTotalCount","0");
				rendarTotalSet.add(existsMap);
			}else{
				existsMap.put("overTotalCount", overTime.get("overTotalCount"));
				//重新设置总数
				try {
					totalSize += Long.valueOf(String.valueOf(existsMap.get("willTotalCount")));
				} catch (NumberFormatException e) {
					totalSize += 0;
				}
				existsMap.put("totalSize", totalSize);
			}
			
			
		}
		
		return rendarTotalSet;
	}
	
	
	/**
	 * 根据smsId
	 * @param smsModelSet
	 * @param smsId
	 * @return
	 */
	private Map<String,Object> getSmsModelById(List<Map<String,Object>> smsModelSet,String smsId){
		
		Map<String,Object> smsModelById = null;
		
		for(Map<String,Object> smsModel : smsModelSet){
			if(smsId.equals(String.valueOf(smsModel.get("model_id")))){
				smsModelById = smsModel;
				break;
			}
		}
		
		return smsModelById;
	}
	
	
	/**
	 * 汇总短信
	 * @param overTimeDemandSet
	 * @param overTimeServiceSet
	 */
	private void totalToDayRemind(String busiId ,Map<String,Object> smsModel,List<Map<String,Object>> overTimeSet,String desc){
		
		try {
			MainThread mainThead = MainThread.getNewIntance();
			/**超时【需求单】*/
			
			//2.调用多线程群发 
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams(busiId,false),
					new MethodParams(smsModel,false),
					new MethodParams(overTimeSet,true)
			);
			mainThead.runMainThread(2, this, "sendSmsByThread", demandAttrParams, true, "多线程："+desc+"群发短信");
		} catch (Exception e) {
			log.error("汇总短信执行失败或数据库链接异常！", e);
		}
	}
	
	
	/**
	 * 根据多线程推送短信
	 * @param busiId
	 * @param QBCSsmsModel
	 * @param overTimeSet
	 */
	@Override
	public void sendSmsByThread(String busiId,Map<String,Object> smsModel,List<Map<String,Object>> smsSet){
		for(Map<String,Object> sms : smsSet){
			if(Tools.isNull(busiId))
				busiId = String.valueOf(sms.get("busiId"));
			sms.put("busiId", busiId);
			String busiNum = String.valueOf(sms.get("mobTel"));
			String busiTheme = String.valueOf(sms.get("busiTheme"));
			if(!Tools.isNull(busiTheme)){
				busiTheme = busiTheme.length()>20 ? busiTheme.substring(0, 20) + "..." : busiTheme;
				sms.put("busiTheme", busiTheme);
			}
			String busiDetails = String.valueOf(sms.get("busiDetails"));
			if(!Tools.isNull(busiDetails)){
				busiDetails = busiDetails.length()>40 ? busiDetails.substring(0, 40) + "..." : busiDetails;
				sms.put("busiDetails", busiDetails);
			}
			this.sendNodeMessage(busiId, busiNum, smsModel, sms);
		}
	}

	@Override
	public void overTimeQusiTime(Map<String,Object> parMap) {
		
		
		int startSpan = 0;
		int endSpan = 120;
		try {
			startSpan = Integer.valueOf(String.valueOf(parMap.get("KEY_0")));
			endSpan = Integer.valueOf(String.valueOf(parMap.get("KEY_1")));
		} catch (NumberFormatException e1) {
			log.warn("overTimeQusiTime：参数传递错误，执行默认参数：0-120分钟");
		}
		
		parMap.put("startTime", Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, startSpan));
		parMap.put("endTime", Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, endSpan));
		
		try {
			List<Map<String,Object>> smsModelSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_sms_model", parMap);
			
			/**超时[需求单明细]短信逻辑*/
			//超时[需求单]短信逻辑
			Map<String,Object> demandInfoSmsModel = this.getSmsModelById( smsModelSet,  "DSRW-DEMAND-OVERTIME");
			if(!Tools.isNull(demandInfoSmsModel)){
				List<Map<String,Object>> overTimeDemandSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_overTime_demand_set", parMap);
				this.totalToDayRemind("", demandInfoSmsModel, overTimeDemandSet,"准实时超时[需求单]短信详情");
			}
			
			/**超时[服务单明细]短信逻辑*/
			//超时[服务单]短信逻辑
			Map<String,Object> serviceInfosmsModel = this.getSmsModelById( smsModelSet, "DSRW-SERVICE-OVERTIME");
			if(!Tools.isNull(serviceInfosmsModel)){
				List<Map<String,Object>> overTimeServiceSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_overTime_service_set", parMap);
				this.totalToDayRemind("", serviceInfosmsModel, overTimeServiceSet,"准实时超时[服务单]短信详情");
			}
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}

	@Override
	public void calimLimitTime(Map<String, Object> param) {
		
		int start = Integer.valueOf(String.valueOf(param.get("KEY_0")));
		int span = Integer.valueOf(String.valueOf(param.get("KEY_1")));
		
		String startDate = Tools.addDate("yyyyMMddHHmmss", Calendar.HOUR_OF_DAY, start);
		String endDate = Tools.addDate("yyyyMMddHHmmss", Calendar.HOUR_OF_DAY, (start+span));
		
		param.put("startDate", startDate);
		param.put("endDate", endDate);
		param.put("smsModelId", "DSRW-DEMAND-CALIMTIME");
		try {
			
			Map<String,Object> smsModel = this.getSMSModel(param);
			
			List<Map<String, Object>> calimLimitSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_calim_limit_sms", param);
			String busiId = "";
			
			MainThread mainThead = MainThread.getNewIntance();
			
			//2.调用多线程群发 
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams(busiId,false),
					new MethodParams(smsModel,false),
					new MethodParams(calimLimitSet,true)
			);
			mainThead.runMainThread(2, this, "sendSmsByThread", demandAttrParams, true, "多线程：“认领超时”推送短信");
			
		} catch (Exception e) {
			log.error("认领超时提醒短信执行异常："+param, e);
		}
		
		
	}

	@Override
	public void sedMessage(String busiId,String smsModelId, List<Map<String, Object>> smsSet,String desc) {
		try {
			if(Tools.isNull(smsModelId)){
				log.info("短信模板Id不能为空");
				return ;
			}
			if(Tools.isNull(smsSet)){
				log.info("发送短信对象为空");
				return ;
			}
			
			Map<String,Object> param=new HashMap<String,Object>();
			param.put("smsModelId", smsModelId);
			Map<String,Object> smsModel = this.getSMSModel(param); 
			
			MainThread mainThead = MainThread.getNewIntance();
			
			//2.调用多线程群发 
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams(busiId,false),
					new MethodParams(smsModel,false),
					new MethodParams(smsSet,true)
			);
			mainThead.runMainThread(2, this, "sendSmsByThread", demandAttrParams, true, "多线程："+desc+"群发短信");
		} catch (Exception e) {
			 e.printStackTrace();
		}
	}
	
}
	 

