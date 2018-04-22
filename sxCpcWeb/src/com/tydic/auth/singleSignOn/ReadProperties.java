package com.tydic.auth.singleSignOn;

import java.io.FileInputStream;
import java.io.InputStream;
import java.util.Iterator;
import java.util.List;
import java.util.Properties;

public class ReadProperties {
	private static final String PropertiesName = "configuration.properties";

	public static Properties readProperties() {
		InputStream inputStream = ReadProperties.class.getClassLoader()
				.getResourceAsStream(PropertiesName);
		Properties p = new Properties();
		try {
			p.load(inputStream);
			return p;
		} catch (Exception e) {
			return new Properties();
		}
	}
}
