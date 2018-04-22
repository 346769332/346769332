package com.tydic.sale.utils;

import java.sql.Connection;

import org.springframework.jdbc.core.JdbcTemplate;

public class TestIbatis {
	
	private JdbcTemplate jdbcTemplate;
	
	public Connection getConnection() throws Exception {  
        Connection conn = jdbcTemplate.getDataSource().getConnection();  
        return conn;  
    }  
	
	public static void main(String[] args) {
		org.springframework.jndi.JndiObjectFactoryBean jofb = new org.springframework.jndi.JndiObjectFactoryBean();
		javax.sql.DataSource ds = (javax.sql.DataSource)jofb;
		org.springframework.jdbc.core.JdbcTemplate jTemplate = new org.springframework.jdbc.core.JdbcTemplate();
		jTemplate.setDataSource(ds);
	}

}
