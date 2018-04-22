package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.BackService;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.util.Tools;
import com.tydic.thread.MainThread;
import com.tydic.thread.vo.MethodParams;

public class BackServiceImpl implements BackService {

	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "backService";

	private CpcDao cpcDao ;
	
	private SMSService sMSService;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	public SMSService getsMSService() {
		return sMSService;
	}

	public void setsMSService(SMSService sMSService) {
		this.sMSService = sMSService;
	}

	@Override
	public void starEvalOnTime(Map<String,Object> param) {
		
		//查询全量需要评价的数据
		List<Map<String, Object>> starEvalSet = null;
		try {
			param.put("data_type", "STAR_EVAL");
			starEvalSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_auth_star_eval", param);
		} catch (Exception e) {
			log.error("抽取星级评价数据失败，数据库访问异常", e);
		}
		if(Tools.isNull(starEvalSet)){
			return;
		}
		//多线程处理
		MainThread mainThread = MainThread.getNewIntance();
		List<MethodParams> methodParamsSet = MainThread.getMethodParamsSet(
									new MethodParams(param,false),
									new MethodParams(starEvalSet,true));
		mainThread.runMainThread(3, this, "insertStarEval", methodParamsSet, true, "批量抽取五星评价，并且推送短消息");
	}

	/**
	 * @param startEvalSet
	 */
	public void insertStarEval(Map<String,Object> param,List<Map<String,Object>> starEvalSet){
		
		
		int startSpan = 0;
		int endSpan = 5;
		try {
			startSpan = Integer.valueOf(String.valueOf(param.get("KEY_0")));
			endSpan = Integer.valueOf(String.valueOf(param.get("KEY_1")));
		} catch (NumberFormatException e1) {
			log.warn("入参没有值，默认：近5天内");
		}
		
		List<Map<String,Object>> newsSet = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> totalSet = new ArrayList<Map<String,Object>>();
		String cycle = Tools.addDate("yyyyMMdd", Calendar.YEAR, 0);
		String now = Tools.addDate("yyyyMMdd", Calendar.DATE, startSpan);
		String day3 = Tools.addDate("yyyyMMdd", Calendar.DATE, endSpan);
		now+="000000";
		day3+="000000";
		for(Map<String,Object> starEval : starEvalSet){
			//推送短消息 
			Map<String,Object> news = new HashMap<String,Object>();
			news.put("news_id", starEval.get("news_id"));
			news.put("news_name", starEval.get("data_name"));
			news.put("news_desc", starEval.get("data_desc"));
			news.put("news_type", starEval.get("data_type"));
			news.put("create_time", now);
			news.put("eff_time", now);
			news.put("staff_id", starEval.get("staff_id"));
			news.put("exp_time", day3);
			newsSet.add(news);
			//汇总星级数据
			Map<String,Object> total = new HashMap<String,Object>();
			total.put("eval_total_id", starEval.get("eval_total_id"));
			total.put("data_id", starEval.get("data_id"));
			total.put("eval_cycle", cycle);
			total.put("staff_id", starEval.get("staff_id"));
			total.put("news_id", starEval.get("news_id"));
			totalSet.add(total);
		}
		try {
			Map<String,Object> parMap = new HashMap<String,Object>();
			//批量推送短消息
			parMap.put("List", newsSet);
			this.cpcDao.batchOperationTable("insert", NAME_SPACE, "insert_ceo_news", parMap);
			//批量保存[评价汇总、评价明细]
			parMap.put("List", totalSet);
			this.cpcDao.batchOperationTable("insert", NAME_SPACE, "insert_ceo_star_eval_info", parMap);
			this.cpcDao.batchOperationTable("insert", NAME_SPACE, "insert_ceo_star_eval_total", parMap);
		} catch (Exception e) {
			log.error("批量保存星级评价信息失败，数据库错误", e);
		}
	}

	@Override
	public void overNewsOnTime() {
		
		String expTime = Tools.addDate("yyyyMMdd", Calendar.YEAR, 0);
		expTime += "000000";
		Map<String,Object> parMap = new HashMap<String,Object>();
		parMap.put("exp_time", expTime);
		
		try {
			this.cpcDao.update(NAME_SPACE, "update_expTime_news", parMap);
		} catch (Exception e) {
			log.error("关闭短消息失败，数据库访问异常", e);
		}
		
	}

	@Override
	public void dirMonitorSmsOnTime(Map<String,Object> param) {
		Map<String,Object> parMap = new HashMap<String,Object>();
		parMap.put("data_type", "DIR_SMS");
		
		try {
			//读取主任数据权限
			List<Map<String, Object>> dirSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_dir_data", parMap);
			
			//绘制短信格式
			List<Map<String, Object>> smsSet = this.rendarDirSms(param,dirSet);
			
			//读取短信模板
			parMap.put("smsModelId", "DSRW-DEMAND-ZRJK");
			Map<String,Object> smsModel = sMSService.getSMSModel( parMap);
			//多线程处理
			MainThread mainThead = MainThread.getNewIntance();
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams("",false),
					new MethodParams(smsModel,false),
					new MethodParams(smsSet,true)
			);
			mainThead.runMainThread(1, sMSService, "sendSmsByThread", demandAttrParams, true, "多线程：“主任日监控超时需求单”推送短信");
		} catch (Exception e) {
			log.error("发送主任短信异常", e);
		}
	}
	
	public List<Map<String,Object>> rendarDirSms(Map<String,Object> param,List<Map<String, Object>> dirSet){
		
		int startSpan = 0;
		int endSpan = 24;
		try {
			startSpan = Integer.valueOf(String.valueOf(param.get("KEY_0")));
			endSpan = Integer.valueOf(String.valueOf(param.get("KEY_1")));
		} catch (NumberFormatException e1) {
			log.error("入参[startSpan endSpan] 为空，按[当前-24小时]区间");
		}
		
		List<Map<String,Object>> smsSet = new ArrayList<Map<String,Object>>();
		try {
			String today = Tools.addDate("yyyyMMdd", Calendar.YEAR, 0);
			String now = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
			String startDate = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.HOUR_OF_DAY, startSpan);
			String endDate = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.HOUR_OF_DAY, endSpan);
			StringBuffer demandInfo = new StringBuffer("flag");
			StringBuffer overDemandInfo = new StringBuffer("flag");
			for(Map<String, Object> dir : dirSet){
				dir.put("startDate", startDate);
				dir.put("endDate", endDate);
				List<Map<String, Object>> demandSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_data_role_demand", dir);
				demandInfo.delete(0,demandInfo.length());
				overDemandInfo.delete(0,overDemandInfo.length());
				int totalSize = demandSet.size();
				int overTimeSize = 0;
				if(totalSize == 0)
					continue;
				for(Map<String, Object> demand : demandSet){
					StringBuffer demandStr = demandInfo;
					if(Tools.countDay(String.valueOf(demand.get("over_limit"))
							, now, "yyyy-MM-dd HH:mm:ss", Calendar.MINUTE) > 0){
						overTimeSize++;
						demandStr = overDemandInfo;
					}
					String demandTheme = String.valueOf(demand.get("demand_theme"));
					demandStr.append((demandTheme.length()>20) ? demandTheme.substring(0,20)+"..." : demandTheme);
					demandStr.append("/");
					demandStr.append(String.valueOf(demand.get("demand_id")));
					demandStr.append("/");
					demandStr.append(String.valueOf(demand.get("promoters")));
					demandStr.append("/");
					demandStr.append(String.valueOf(demand.get("opt_name")));
					demandStr.append("/");
					demandStr.append(String.valueOf(demand.get("over_limit")));
					demandStr.append("；");
				}
				
				if(Tools.isNull(demandInfo.toString()))
					demandInfo.append("无；");
				if(Tools.isNull(overDemandInfo.toString()))
					overDemandInfo.append("无；");
				
				Map<String,Object> smsInfoMap = new HashMap<String,Object>();
				smsInfoMap.put("today", today);
				smsInfoMap.put("totalSize", totalSize);
				smsInfoMap.put("otherSize", (totalSize-overTimeSize));
				smsInfoMap.put("overTimeSize", overTimeSize);
				smsInfoMap.put("demandInfo", "即将超时工单信息："+ demandInfo.toString());
				smsInfoMap.put("overDemandInfo","超时工单信息："+ overDemandInfo.toString());
				smsInfoMap.put("mobTel",dir.get("mob_tel"));
				smsInfoMap.put("busiId",dir.get("staff_id"));
				smsInfoMap.put("loginCode",dir.get("login_code"));
				
				smsSet.add(smsInfoMap);
			}
		} catch (Exception e) {
			log.error("拼接主任短信异常", e);
		}
		
		return smsSet;
	}

	@Override
	public void updatePoolStaff(Map<String, Object> param) {
		int call_type = 1; //1 上午  2 下午
			try {
				call_type = Integer.valueOf(String.valueOf(param.get("KEY_0")));
				param.put("call_type", call_type);
				this.cpcDao.update(NAME_SPACE, "updatePoolStaff", param);
				 
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
				log.error("定时任务 根据值班安排同步工单池默认员工异常", e);
			}
		
	}

	@Override
	public void halfLimitSmsOnTime(Map<String, Object> param) {
		int startSpan = 0;
		int endSpan = 24;
		try {
			startSpan = Integer.valueOf(String.valueOf(param.get("KEY_0")));
			endSpan = Integer.valueOf(String.valueOf(param.get("KEY_1")));
		} catch (NumberFormatException e1) {
			log.error("入参[startSpan endSpan] 为空，按[当前-24小时]区间");
		}
		String startTime = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.SECOND, startSpan);
		String endTime = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.SECOND, endSpan);
		
		Map<String,Object> parMap = new HashMap<String,Object>();
		parMap.put("startTime", startTime);
		parMap.put("endTime", endTime);
		
		List<Map<String, Object>> halfLimitSmsSet = null;
		try {
			//查询过半指定时间内即将超时 短信内容集合
			halfLimitSmsSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_half_limit_sms", parMap);
			
			//读取短信模板
			parMap.put("smsModelId", "DSRW-GDGBOVERTIME");
			Map<String,Object> smsModel = sMSService.getSMSModel( parMap);
			//多线程处理
			MainThread mainThead = MainThread.getNewIntance();
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams("",false),
					new MethodParams(smsModel,false),
					new MethodParams(halfLimitSmsSet,true)
			);
			mainThead.runMainThread(1, sMSService, "sendSmsByThread", demandAttrParams, true, "多线程：“临近超时一半”推送短信");
			
		} catch (Exception e) {

			log.error("定时任务 多线程：“临近超时一半”推送短信  异常", e);
		}
		
		
		
	}
	
}
