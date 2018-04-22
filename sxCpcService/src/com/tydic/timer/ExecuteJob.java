package com.tydic.timer;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Trigger;
import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.scheduling.quartz.CronTriggerBean;
import org.springframework.scheduling.quartz.MethodInvokingJobDetailFactoryBean;
import org.springframework.scheduling.quartz.SchedulerFactoryBean;

import com.tydic.sale.service.util.Tools;


public class ExecuteJob implements Job  {
	
	private Logger log = Logger.getLogger(this.getClass());
	
	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		// TODO Auto-generated method stub
		Map<String,Object> timerConfig = (Map<String, Object>) context.getMergedJobDataMap().get("timerConfig");
		
		ApplicationContext springContext = (ApplicationContext) timerConfig.get("springContext");
		
		/**绘制参数*/
		String methodParams = String.valueOf(timerConfig.get("method_param"));
		Map paramMap = null;
		Class[] classTypes = null;
		if(!Tools.isNull(methodParams)){
			classTypes = new Class[1];
			classTypes[0] = Map.class;
			paramMap = new HashMap();
			String[] methodParam = methodParams.split(",");
			for(int i=0 ; i<methodParam.length ; i++){
				paramMap.put("KEY_"+i, methodParam[i]);
			}
		}
		
		/**反射执行方法*/
		try {
			Object service = springContext.getBean(String.valueOf(timerConfig.get("service_tag")));
			Method method = service.getClass().getMethod(String.valueOf(timerConfig.get("method_tag")), classTypes);
			if(Tools.isNull(paramMap)){
				method.invoke(service, null);
			}else{
				method.invoke(service, paramMap);
			}
		} catch (BeansException e) {
			log.error("spring获取服务失败，服务不存在[服务名:"+timerConfig.get("service_tag")+"]", e);
		} catch (NoSuchMethodException e) {
			log.error("待执行的“方法”不存在,[方法名："+timerConfig.get("method_tag")+"]", e);
		} catch (IllegalAccessException e) {
			log.error("方法执行失败[方法名称："+timerConfig.get("method_tag")+",入参："+paramMap+"  注：空表示无需入参]", e);
		} catch (InvocationTargetException e) {
			log.error("方法执行失败[方法名称："+timerConfig.get("method_tag")+",入参："+paramMap+"  注：空表示无需入参]", e);
		}
	}

	
}
