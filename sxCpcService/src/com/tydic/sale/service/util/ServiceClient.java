package com.tydic.sale.service.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.zk.ZKUtil;

import com.tydic.sale.utils.SaleUtil;
import com.tydic.wss.exception.NotFoundLocalNetException;
import com.tydic.wss.remote.client.util.ResourceUtil;
import com.tydic.wss.util.LocalNetUtil;
import com.tydic.wss.util.NullUtil;

import cots.service.integration.ServiceResourceManagementServicePortType;
/***
 * 调用订单分拣服务
 * @author danny
 *
 */
public class ServiceClient implements Observer{
	private static final Log log = LogFactory.getLog(ServiceClient.class);
	private String servicePrefix;
	public void setServicePrefix(String servicePrefix) {
		this.servicePrefix = servicePrefix;
	}
	private String[] ATTRIBUTE_KEYS = {"290", "wzhpc", "wzhpad", "imgcache", "imgcacheflag"};
	@SuppressWarnings("rawtypes")
	private final Map confMap = new HashMap();
	
	private LocalNetUtil<ServiceResourceManagementServicePortType> lnu = new LocalNetUtil<ServiceResourceManagementServicePortType>();
	
	// 代理调用对象,key是本地网ID，VALUE是代理对象
	private Map<String, ServiceResourceManagementServicePortType> cmap;
	public ServiceClient(){}
	@SuppressWarnings("unchecked")
	public synchronized void init() {
		if (servicePrefix == null)
			throw new RuntimeException("\"servicePrefix\" can't null.");
		confMap.putAll(ZKUtil.addObserver("/config", this));
		
		Map<String, String> m = new HashMap<String, String>();
		for (String attr : ATTRIBUTE_KEYS) {
			String newValue = (String) confMap.get(servicePrefix + attr);
			m.put(attr, newValue);
		}
		this.cmap = lnu.splitLocalNetForWS(m,
				ServiceResourceManagementServicePortType.class);
	}

	public void destroy() {
		ZKUtil.deleteObserver("/config", this);
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public void update(Observable o, Object arg) {
		Map<String, Object> m = (Map) arg;
		boolean isupdate = false;
		for (String attr : ATTRIBUTE_KEYS) {
			Object newValue = m.get(servicePrefix + attr);
			Object oldValue = confMap.get(servicePrefix + attr);
			if (!newValue.equals(oldValue)) {
				isupdate = true;
				confMap.put(servicePrefix + attr, newValue);
			}
		}

		if (isupdate) {
			init();
		}
	}
	
	public String getServiceInfo(String lant_id){
		return String.valueOf(confMap.get(servicePrefix +lant_id));
	}
	
	/**
	 * 获取无纸化地址
	 * @param object
	 * @return
	 */
	public String getWZHPath(Object object){
		if (SaleUtil.SOURCE_SYS_PAD.equals(object)) {
			return String.valueOf(confMap.get(servicePrefix + "wzhpad"));
		}
		
		return String.valueOf(confMap.get(servicePrefix + "wzhpc"));
	}
	
	/**
	 * 获取是否使用图片缓存功能 1：使用   0：不使用
	 * @param object
	 * @return
	 */
	public String getImgCacheFlag(){
		
		return String.valueOf(confMap.get(servicePrefix + "imgcacheflag"));
	}
	
	/**
	 * 获取资源服务器地址用于图片缓存
	 * @param object
	 * @return
	 */
	public String getImgUrl(){
		
		return String.valueOf(confMap.get(servicePrefix + "imgcache"));
	}
	
	/**
	 * 供外部调用RESOURCE WebService
	 * 
	 * @param recBizParaMap
	 *            调用REC参数,封装参数的Map对象
	 * @throws NotFoundLocalNetException
	 */
	@SuppressWarnings({ "rawtypes" })
	public String callService(Map recBizParaMap) throws NotFoundLocalNetException {
		String latnID = (String) recBizParaMap.get("");
		// 获得请求的XML文，将map转换为xml文件
		String reqXMLString = ResourceUtil.getCrmXMLStr(recBizParaMap);
		if (log.isDebugEnabled()) {
			log.debug("=============== RESOURCE Req:===============");
			log.debug(reqXMLString);
			log.debug("=======================================");
		}
		// 调用接口获取响应的XML文
		ServiceResourceManagementServicePortType csd = lnu.getService(cmap,
				latnID);
		if (NullUtil.isNull(csd)) {
			throw new NotFoundLocalNetException("localNetID:" + latnID);
		}
		String rspXMLString = csd.service(reqXMLString);
		if (log.isDebugEnabled()) {
			log.debug("=============== RESOURCE Resp:===============");
			log.debug(rspXMLString);
			log.debug("=======================================");
		}

		return rspXMLString;
	}
}
