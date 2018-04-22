package com.tydic.thread;

import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.CountDownLatch;

import org.apache.log4j.Logger;

import com.tydic.sale.service.util.Tools;
import com.tydic.thread.vo.MethodParams;

/**
 * 线程执行对象
 * @author xkarvy
 *
 */
@SuppressWarnings("unchecked")
public class SubThread extends Thread {
	
	private Logger log = Logger.getLogger(this.getClass());
	
	/**
	 * 任务：繁忙
	 */
	public static int TASK_BASY = 1;
	
	/**
	 * 任务：空闲
	 */
	public static int TASK_IDLE = 0;
	
	private int task = SubThread.TASK_IDLE;
	
	private Object instance;
	
	private String methodName;
	
	private List<MethodParams> methodParamsSet;
	
	private MainThread mainThread;
	
	private CountDownLatch countdownLatch;

	
	public void run() {
		
		while(true){
		
			//是否空闲[空闲等待]
			if(this.isIdle()){
				try {
					Thread.sleep(500);
				} catch (InterruptedException e) {}
				continue;
			}
			
			
			try {
				if(!Tools.isNull(methodParamsSet)){
					Class instaceClass = this.instance.getClass();
					Class[] classTypes = new Class[methodParamsSet.size()];
					Object[] objValues = new Object[methodParamsSet.size()];
					
					//循环设置入参类型与入参值
					for(int i=0 ; i<methodParamsSet.size() ; i++){
						MethodParams methodParams = methodParamsSet.get(i);
						classTypes[i]  = methodParams.getClassType();
						objValues[i] = methodParams.getValue();
					}
					//获取执行方法
					Method method = instaceClass.getDeclaredMethod(this.methodName, classTypes);
					Object result = method.invoke(this.instance, objValues);
					
					//设置返回值
					if(!Tools.isNull(result)){
						List returnSet = this.object2List(result);
						this.mainThread.addResultSet(returnSet);
					}
				}
			} catch (Exception e) {
				log.error("多线程(ThreadRunning)执行失败，匿名化执行对方方法失败....", e);
			}finally{
				if(null != this.countdownLatch) 
					this.countdownLatch.countDown();
				this.setTask(SubThread.TASK_IDLE);
			}
		}
	}
	 
	
	
	
	/**
	 * 执行
	 * @param instance
	 * @param methodName
	 * @param methodParamsSet
	 * @param mainThread
	 */
	public synchronized void execute(Object instance ,String methodName,List<MethodParams> methodParamsSet,MainThread mainThread,CountDownLatch countdownLatch){
		this.instance        = instance;
		this.methodName      = methodName;
		this.methodParamsSet = methodParamsSet;
		this.mainThread      = mainThread;
		this.countdownLatch  = countdownLatch;
		this.setTask(SubThread.TASK_BASY);
	}
	
	
	/**
	 * 对象转换成集合
	 * @param obj
	 * @return
	 */
	public List object2List(Object obj){
		List returnSet = new ArrayList();
		if(obj instanceof List){
			returnSet = (List) obj;
		}
		else if(obj instanceof Set){
			returnSet = new ArrayList(((Set)obj));
		}
		else if(obj instanceof int[]){
			for(Object s : ((int[])obj)){
				returnSet.add(s);
			}
		}
		else if(obj instanceof long[]){
			for(Object s : ((long[])obj)){
				returnSet.add(s);
			}
		}
		else if(obj instanceof double[]){
			for(Object s : ((double[])obj)){
				returnSet.add(s);
			}
		}
		else if(obj instanceof Object[] 
		           || obj instanceof Double[] 
		           || obj instanceof Long[] 
		           || obj instanceof Integer[] 
		           || obj instanceof String[]){
			for(Object s : ((Object[])obj)){
				returnSet.add(s);
			}
		}
		else if(obj instanceof Object){
			returnSet.add(obj);
		}
		return returnSet;
	}
	
	/**
	 * 是否空闲
	 * @return
	 */
	public boolean isIdle(){
		if(this.getTask() == SubThread.TASK_IDLE){
			return true;
		}
		return false;
	}

	public int getTask() {
		return task;
	}

	private void setTask(int task) {
		this.task = task;
	}

}
