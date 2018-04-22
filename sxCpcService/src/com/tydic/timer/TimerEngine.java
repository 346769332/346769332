package com.tydic.timer;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.quartz.CronTrigger;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.impl.StdSchedulerFactory;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.util.Tools;

public class TimerEngine implements ApplicationContextAware{
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private static final String NAME_SPACE = "timer";
	
	private CpcDao cpcDao;
	
	private Scheduler scheduler = null;

	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	private ApplicationContext springContext;


	private List<Map<String,Object>> timerConfigSet = new ArrayList<Map<String,Object>>();
	
	public List<Map<String,Object>> getTimerConfig(){
		try {
			timerConfigSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_timer_config", null);
		} catch (Exception e) {
			log.error("初始化定时异常，获取定时器配置信息异常，数据异常", e);
		}
		
		return timerConfigSet;
	}
	
	public void runTimerSet(){
		List<Map<String,Object>> timerConfigSet = this.getTimerConfig();
		Map<String,Object> timerConfigItem = null;
			try {
				for(Map<String,Object> timerConfig : timerConfigSet){
					timerConfigItem = timerConfig;
					this.initJobTrigger(timerConfig);
				}
				
				//对比清空
				this.removeDeadJob(timerConfigSet);
			} catch (SchedulerException e) {
				log.error("执行TimerTrigger创建：Scheduler【配置参数】如："+timerConfigItem, e);
			} catch (ParseException e) {
				log.error("执行TimerTrigger获取：CronTrigger异常【配置参数】如："+timerConfigItem, e);
			}
	}
	
	public void initJobTrigger(Map<String,Object> timerConfig) throws SchedulerException, ParseException{
		
		String triggerName = "jobName_"+String.valueOf(timerConfig.get("time_id"));
		String jobName = "jobName_"+String.valueOf(timerConfig.get("time_id"));
		String group= "group_"+String.valueOf(timerConfig.get("time_id"));
		String express = String.valueOf(timerConfig.get("time_config"));
		
		String timeStatus = String.valueOf(timerConfig.get("time_status"));
		String serviceTag = String.valueOf(timerConfig.get("service_tag"));
		String methodTag = String.valueOf(timerConfig.get("method_tag"));
		String methodParam = String.valueOf(timerConfig.get("method_param"));
		
		timerConfig.put("springContext", springContext);
		
		if(null == this.scheduler){
			this.scheduler = StdSchedulerFactory.getDefaultScheduler();
		}

		CronTrigger trigger = (CronTrigger) this.scheduler.getTrigger(triggerName, group);
		
		if(null == trigger){
			
			if(!timeStatus.toUpperCase().equals("Y")){
				return;
			}
			
			JobDetail jobDetail = new JobDetail(jobName,group,ExecuteJob.class);
			jobDetail.getJobDataMap().put("timerConfig", timerConfig);
			
			trigger = new CronTrigger(triggerName, group, express);
			trigger.setStartTime(new Date()); 
			
			this.scheduler.scheduleJob(jobDetail, trigger);
		}
		//挂起 删除job 自动关联删除trigger
		else if(timeStatus.toUpperCase().equals("P") || timeStatus.toUpperCase().equals("N")){
			this.scheduler.deleteJob(jobName, group);
		}
		else if(timeStatus.toUpperCase().equals("Y")){
			JobDetail jobDetail = this.scheduler.getJobDetail(jobName, group);
			
			Map<String,Object> jobTimerConfig = (Map<String, Object>) jobDetail.getJobDataMap().get("timerConfig");
			
			String service_tag = String.valueOf(jobTimerConfig.get("service_tag"));
			String method_tag = String.valueOf(jobTimerConfig.get("method_tag"));
			String method_param = String.valueOf(jobTimerConfig.get("method_param"));
			
			/*定时公式发生变更*/
			if(!express.equals(trigger.getCronExpression())){
				trigger.setCronExpression(express);
				this.scheduler.deleteJob(jobName, group);
			}
			
			/*服务&方法变更 删除原有job*/
			if(!service_tag.equals(serviceTag)
					|| !method_tag.equals(methodTag)
					|| (Tools.isNull(methodParam) && !Tools.isNull(method_param))
					|| (!Tools.isNull(methodParam) && Tools.isNull(method_param))
					|| !methodParam.equals(method_param) ){
				this.scheduler.deleteJob(jobName, group);
			}
			
			if(null == this.scheduler.getJobDetail(jobName, group)){
				jobDetail = new JobDetail(jobName,group,ExecuteJob.class);
				jobDetail.getJobDataMap().put("timerConfig", timerConfig);
				
				this.scheduler.scheduleJob(jobDetail, trigger);
			}
		}
	}
	
	public void removeDeadJob(List<Map<String,Object>> timerConfigSet) throws SchedulerException{
		
		if(null == this.scheduler){
			return;
		}
		
		for(Iterator it = this.scheduler.getJobListenerNames().iterator() ; it.hasNext();){
			JobDetail jobDetail = (JobDetail) it.next();
			boolean isExists = false;
			for(Map<String,Object> timerConfig : timerConfigSet){
				String jobName = "jobName_"+String.valueOf(timerConfig.get("time_id"));
				String group= "group_"+String.valueOf(timerConfig.get("time_id"));
				if(jobDetail.getName().equals(jobName)
						&& jobDetail.getGroup().equals(group)){
					isExists = true;
					break;
				}
			}
			if(!isExists){
				this.scheduler.deleteJob(jobDetail.getName(), jobDetail.getGroup());
			}
		}
		
	}
	
	@Override
	public void setApplicationContext(ApplicationContext context)
			throws BeansException {
		this.springContext = context;
	}
}
