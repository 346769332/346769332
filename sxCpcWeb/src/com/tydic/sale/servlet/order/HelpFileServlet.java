package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.util.Map;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.utils.DownLoadFile;
@WebServlet("/order/helpFile.do")
public class HelpFileServlet extends AbstractServlet {
	private static Logger log = Logger.getLogger(HelpFileServlet.class);
	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		
	}
	
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
	   doPost(request, response);
	}
	
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {

		request.setCharacterEncoding("UTF-8");
			String fileName=request.getParameter("fileName");
			String fileName1 = URLEncoder.encode(fileName, "UTF8"); 
			String filePath=URLDecoder.decode(request.getParameter("filePath"));
			
			//String downloadPath = super.getDownLoadDirPath();
			String downloadName=request.getParameter("downloadName");
			DownLoadFile.exec(request, response, fileName1, filePath, downloadName);
	}
}
