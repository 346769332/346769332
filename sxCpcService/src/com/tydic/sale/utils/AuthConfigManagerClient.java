package com.tydic.sale.utils;

import java.util.Observable;
import java.util.Observer;

import org.apache.zk.GProperties;
import org.apache.zk.ZKUtil;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SuppressWarnings("unchecked")
public class AuthConfigManagerClient implements Observer {

	private static final Logger LOG = LoggerFactory.getLogger(AuthConfigManagerClient.class);

	private GProperties<String, Object> properties = null;

	
	public AuthConfigManagerClient() {

		properties = (GProperties<String, Object>) ZKUtil.addObserver("/config", this);

		if (LOG.isDebugEnabled()) {
			LOG.debug("ConfigManagerClient is initialized: " + properties.toString());
		}
	}

	@Override
	public synchronized void update(Observable o, Object arg) {

		if (LOG.isDebugEnabled()) {
			LOG.debug("properties before update: " + properties.toString());
		}

		properties = (GProperties<String, Object>) arg;

		if (LOG.isDebugEnabled()) {
			LOG.debug("properties after update: " + properties.toString());
		}
	}

	public String getProperty(String key) {
		return (String) properties.get(key);
	}
	
	
	public void destroy() {
		ZKUtil.deleteObserver("/config", this);
	}

}
