package com.tydic.thread;

import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.apache.log4j.Logger;

import com.tydic.sale.utils.Tools;
import com.tydic.thread.vo.MethodParams;

/**
 * 线程池
 * @author xkarvy
 * 管理线程
 */
public class ThreadPoolTask {

	private Logger log = Logger.getLogger(this.getClass());
	
	/**
	 * 线程池集合
	 */
	private SubThread[] subThreadSet = null;
 
	/**
	 * 最大线程数
	 */
	private int maxThreadSize = 0;
	
	/**
	 * 繁忙等待时间（毫秒）
	 */
	private long waitTime = 0;
 
	
	/**
	 * 初始化线程池
	 */
	public void init(){
		if(!Tools.isNull(this.subThreadSet) && 0 != this.subThreadSet.length){
			return;
		}
		this.subThreadSet = new SubThread[this.getMaxThreadSize()];
		for(int i=0 ; i<this.subThreadSet.length ; i++){
			this.subThreadSet[i] = new SubThread();
			this.subThreadSet[i].start();
		}
		log.info("ThreadPoolTask自定义线程池初始化完毕，共启动："+this.subThreadSet.length+"个线程数等待服务请求！");
	}
	
	/**
	 * 获取当前线程情况
	 * @return
	 */
	public String getThreadMsg(){
		
		this.init();
		
		int idle = 0;
		int busy = 0;
		for(int i=0 ; i<this.subThreadSet.length ; i++){
			if(this.subThreadSet[i].isIdle()){
				idle++;
			}else{
				busy++;
			}
		}
		
		return "目前线程情况==>空闲："+idle+"   繁忙："+busy;
	}
	
	/**
	 * 添加线程
	 * @param instance
	 * @param methodName
	 * @param methodParamsSet
	 * @param mainThread
	 * @throws Exception
	 */
	public synchronized void addExec(Object instance ,String methodName,List<MethodParams> methodParamsSet,MainThread mainThread,CountDownLatch countdownLatch){
		
		this.init();
		
		while(true){
			boolean isSuccess = this.exec(instance, methodName, methodParamsSet, mainThread, countdownLatch);
			if(!isSuccess){
				log.error("队列开始等待“"+this.getWaitTime()+"” 毫秒，线程池已满，建议请扩大线程池！！！！！！！！！！");
				try {
					Thread.sleep(this.getWaitTime());
				} catch (InterruptedException e) {}
			}
			if(isSuccess)
				break;
		}
	}
	
	
	
	
	private boolean exec(Object instance ,String methodName,List<MethodParams> methodParamsSet,MainThread mainThread,CountDownLatch countdownLatch){
		
		boolean isDistSuccess = false;//是否已分发
		
		for(int i=0 ; i<this.subThreadSet.length ; i++){
			if(this.subThreadSet[i].isIdle()){
				this.subThreadSet[i].execute(instance, methodName, methodParamsSet, mainThread, countdownLatch);
				isDistSuccess = true;
				break;
			}
		}
		return isDistSuccess;
	}
	
	public long getWaitTime() {
		return waitTime;
	}


	public void setWaitTime(long waitTime) {
		this.waitTime = waitTime;
	}

	

	public int getMaxThreadSize() {
		return maxThreadSize;
	}


	public void setMaxThreadSize(int maxThreadSize) {
		this.maxThreadSize = maxThreadSize;
	}

	
}
