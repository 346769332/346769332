package com.tydic.sale.utils;

import java.io.IOException;
import java.lang.reflect.InvocationTargetException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;

public class DispatcherServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
       
    public DispatcherServlet() {
        super();
    }

	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		super.service(request, response);
	}
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("UTF-8");
		response.setCharacterEncoding("UTF-8");
		execute(request,response);
	}
	
	protected void execute(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String methodName = request.getParameter("method");
		if(StringUtils.isBlank(methodName)){
			methodName = request.getParameter("func");
		}
		
		try {
			this.getClass().getMethod(methodName, HttpServletRequest.class,HttpServletResponse.class)
							.invoke(this, request,response);
		} catch (IllegalArgumentException e) {
			e.printStackTrace();
			throw new RuntimeException(e); 
		} catch (SecurityException e) {
			e.printStackTrace();
			throw new RuntimeException(e); 
		} catch (IllegalAccessException e) {
			e.printStackTrace();
			throw new RuntimeException(e); 
		} catch (InvocationTargetException e) {
			e.printStackTrace();
			throw new RuntimeException(e); 
		} catch (NoSuchMethodException e) {
			e.printStackTrace();
			throw new RuntimeException(e); 
		}
	}
}
