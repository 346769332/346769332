package com.tydic.sale.utils;

import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.Properties;
import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.ServletContextEvent;
import javax.servlet.annotation.WebListener;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import com.tydic.framework.osgi.commons.cache.CacheService;
import com.tydic.framework.web.mvc.context.IContext;
import com.tydic.framework.web.mvc.core.SpringContextListener;
import com.tydic.framework.web.mvc.core.Version;
import com.tydic.framework.web.mvc.sna.HttpSessionUtil;

@WebListener
public class DicSaleWebContextListern extends SpringContextListener {

	private static Logger logger = Logger.getLogger("DIC-SALWWEB");
	
	@Override
	public void contextDestroyed(ServletContextEvent event) {
		super.contextDestroyed(event);
		logger.log(Level.INFO,"project is Destroyed");

	}

	@Override
	public void contextInitialized(ServletContextEvent event) {
	 
		super.contextInitialized(event);
		
		logger.log(Level.INFO,"project is init success");
	}

	private void loadBackProgramSpingConfig(ServletContextEvent event) {
		try {
			// 读取配置
			URL url = event.getServletContext().getResource("/META-INF/dic-web-back.xml");

			if (url != null){
				ApplicationContext cac = new FileSystemXmlApplicationContext(url.toExternalForm());
				
				// 存入ServletContext
				event.getServletContext().setAttribute(IContext.class.getName(),
						new com.tydic.framework.web.mvc.core.ApplicationContext(cac));
				logger.log(Level.INFO, "dic-web-back Global " + Version.getRawVersion() + " inited.");
				if (cac.containsBean("com.tydic.framework.web.mvc.sna.HttpSessionUtil.cacheService")) {
					CacheService cacheService = (CacheService) cac
							.getBean("com.tydic.framework.web.mvc.sna.HttpSessionUtil.cacheService");
					HttpSessionUtil.setCacheService(cacheService);
				}
				return;
			} else {
				logger.log(Level.SEVERE, "dic-web-back Global /META-INF/dic-web-back.xml Not Found.");
			}
		} catch (Throwable t) {
			logger.log(Level.SEVERE, "dic-web-back Global load dic-web-back global configure failured.", t);
			throw new RuntimeException(t);
		}
		
	}

}
