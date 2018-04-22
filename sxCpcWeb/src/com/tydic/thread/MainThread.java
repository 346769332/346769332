package com.tydic.thread;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.List;
import java.util.concurrent.CountDownLatch;

import org.apache.log4j.Logger;

import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.utils.Tools;
import com.tydic.thread.vo.MethodParams;

/**
 * 启用多线程执行的访问
 * @author xkarvy
 *
 */
@SuppressWarnings("unchecked")
public class MainThread{
	
	private MainThread(){
		this.threadLocalPool = (ThreadPoolTask)SpringContextUtils.getInstance().getBean("threadPoolTask");
	}

	private Logger log = Logger.getLogger(this.getClass());
	 
	/**
	 * 默认一个线程执行数量
	 */
	private static int DEFAULT_RUN_COUNT = 20000;
	
	/**
	 * 线程计数器
	 */
	private CountDownLatch countdownLatch = null;
	
	/**
	 * 系统配置线程池
	 */
	private ThreadPoolTask threadLocalPool;
	
	/**
	 * 多线程执行完的返回结果集
	 */
	private List resultSet = null;
	
	public synchronized void addResultSet(List resultSet) {
		this.resultSet.addAll(resultSet);
	}
	
	
	/**
	 * 获取新线程类
	 * new
	 * @return
	 */
	public static MainThread getNewIntance(){
		return new MainThread();
	}
	
	/**
	 * 运行前：初始化
	 */
	private void runInit(){
		this.resultSet = new ArrayList();
	}
	
	/**
	 * 获取线程数
	 * @param coreThreadSize
	 * @param listSize
	 * @return
	 */
	private int getRunSize(int coreThreadSize,int listSize){
		if(0 != coreThreadSize){
			return coreThreadSize;
		}
		return (listSize-1)/DEFAULT_RUN_COUNT+1;
	}
	
	/**
	 * 获取每个线程运行的数量
	 * @param runSize
	 * @param listSize
	 * @return
	 */
	private int getRunLength(int runSize,int listSize){
		return Double.valueOf(Math.ceil(Double.valueOf(listSize)/runSize)).intValue();
	}

	/**
	 * 多线程调用
	 * @param coreThreadSize  核心线程数(0表示默认配置)
	 * @param instance        操作对象实例
	 * @param method          操作对象对应方法
	 * @param methodParamsSet 操作对象方法方法入参
	 * @param isAsyn          是否异步操作（true是，false否）
	 * @param desc            操作描述
	 * @return  返回操作方法返回值集合
	 */
	public List runMainThread(int coreThreadSize ,Object instance ,String method,List<MethodParams> methodParamsSet,boolean isAsyn, String desc ){
		
		//初始化
		this.runInit();
		
		//获取多线程执行业务数据集下标
		int threadIndex = this.getThreadParams(methodParamsSet);
		if(threadIndex == -1){
			log.info(desc+"无法启动多线程，无待分隔的数据集合！");
			return this.resultSet;
		}
		
		//获取多线程执行业务数据集
		List threadSet = (List) methodParamsSet.get(threadIndex).getValue();
		if(Tools.isNull(threadSet)){
			log.info(desc+"无法启动多线程，待执行数据量为空！");
			return this.resultSet;
		}
		
		//获取线程数
		int runSize = this.getRunSize(coreThreadSize, threadSet.size());
		//获取每个线程执行的数量
		int runLangth = this.getRunLength(runSize, threadSet.size());
		
		log.info(desc+"，多线程正在启动执行！待执行数量："+threadSet.size()+"条，最大线程数量："+runSize);
		log.info("线程池情况："+this.threadLocalPool.getThreadMsg());
		
		//启动多线程
		this.countdownLatch = new CountDownLatch(runSize);
		int start = 0,endCount = 0;
		for(int i=0 ; i< runSize; i++){
			start = endCount;
			endCount = (i+1)*runLangth;
			if(start >= threadSet.size()) {
				this.countdownLatch.countDown();
				continue;
			}
			if(endCount >= threadSet.size()) endCount = threadSet.size();
			//获取执行需要的集合
			List curRunSet = Tools.getSubList(threadSet, start, endCount);
			//设置到入参中...
			List<MethodParams> mpSet = null;
			if(!Tools.isNull(curRunSet)){
				mpSet = this.cloneMethodParamsList(methodParamsSet);
				mpSet.get(threadIndex).setValue(curRunSet);
				//添加线程
				try {
					this.threadLocalPool.addExec(instance, method, mpSet, this, this.countdownLatch);
				} catch (Exception e) {
					log.error("添加线程池执行失败，启动多线程失败!!", e);
					break;
				}
			}
			
		}
		
		

		//主线程,监听
		//同步
		if(!isAsyn){
			//主线程,监听
			try {
				this.countdownLatch.await();
			} catch (InterruptedException e) {
				log.error(desc+"，主线程监听失败，线程池关闭！",e);
			}
			
			log.info(desc+"，多线程已处理："+threadSet.size()+"条数据，“该方法返回："+this.resultSet.size()+"条结果” 线程池已经关闭！");
		}
		//异步
		else{
			log.info(desc+"，多线程已处理："+threadSet.size()+"条数据，异步处理开始执行！");
		}
		return this.resultSet;
	}
	
	
	/**
	 * 获取多线程分隔字段集合
	 * @param methodParamsSet
	 * @return
	 */
	private int getThreadParams(List<MethodParams> methodParamsSet){
		for(int i=0 ; i<methodParamsSet.size() ; i++){
			MethodParams methodParams = methodParamsSet.get(i);
			if(methodParams.isThreadParams()){
				return i;
			}
		}
		
		return -1;
	}

	
	/**
	 * 设置入参
	 * @param methodParams
	 * @return
	 */
	public static List<MethodParams> getMethodParamsSet(MethodParams... methodParams ){
		
		List<MethodParams> methodParamsSet = new LinkedList<MethodParams>();
		
		for(MethodParams methodParam : methodParams){
			methodParamsSet.add(methodParam);
		}
		return methodParamsSet;
	}

	
	/**
	 * 克隆线程方法入参集合
	 * @param set
	 * @return
	 */
	public List<MethodParams> cloneMethodParamsList(List<MethodParams> set){
		List newSet = new ArrayList();
		try {
			for(MethodParams mp : set){
				if(mp.isThreadParams()){
					newSet.add(mp.clone());
				}else{
					newSet.add(mp);
				}
			}
		} catch (CloneNotSupportedException e) {
			log.error("该对象的克隆“clone()”方法不存在!", e);
		}
		return newSet;
	}
}
