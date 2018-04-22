package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tydic.sale.servlet.AbstractServlet;
@WebServlet("/app/saveEvalMonZZ.do")
public class SaveEvalMonZZServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SaveEvalMonZZServlet.class);
	private static final long serialVersionUID = 1L;
	
	public SaveEvalMonZZServlet() {
		super();
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		//查询
		Map<Object,Object> resultMap = super.crmService.saveEvalMonZZ(reqParamMap);

		super.sendMessagesApp(request,response,  resultMap);
	}
}
