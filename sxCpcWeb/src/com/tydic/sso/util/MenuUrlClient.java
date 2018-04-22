package com.tydic.sso.util;

import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import org.apache.zk.ZKUtil;

public class MenuUrlClient implements Observer{

	private String argsPrefix;
	private String[] ATTRIBUTE_KEYS={"web", "mangerWeb", "appId", "agentWeb"};
	private final Map confMap = new HashMap();
	
	public synchronized void init() {
		if (argsPrefix == null)
			throw new RuntimeException("\"argsPrefix\" can't null.");
		confMap.putAll(ZKUtil.addObserver("/config", this));
		
		Map<String, String> m = new HashMap<String, String>();
		for (String attr : ATTRIBUTE_KEYS) {
			String newValue = (String)confMap.get(argsPrefix + attr);
//			if("appId".equals(attr)){
//				if(null == confMap.get(argsPrefix + attr)){
//					throw new  RuntimeException("\"appId\" can't null.");
//				}
//			}
			m.put(attr, newValue);
		}
	}
	
	@Override
	public void update(Observable o, Object arg) {
		Map<String, Object> m = (Map) arg;
		boolean isupdate = false;
		for (String attr : ATTRIBUTE_KEYS) {
			Object newValue = m.get(argsPrefix + attr);
			Object oldValue = confMap.get(argsPrefix + attr);
			if (null != newValue && !newValue.equals(oldValue)) {
				isupdate = true;
				confMap.put(argsPrefix + attr, newValue);
			}
		}

		if (isupdate) {
			init();
		}
	}
	
	public void setArgsPrefix(String argsPrefix) {
		this.argsPrefix = argsPrefix;
	}

	public String  getUrl(String key){
		return (String) confMap.get(argsPrefix + key);
	}
	
}
