package com.tydic.sale.utils;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
public class DownLoadFile {
	private static Logger log = Logger.getLogger(DownLoadFile.class);
	
	public static void exec(HttpServletRequest request,HttpServletResponse response,String fileName,String filePath, String downloadName) throws ServletException, IOException {
			OutputStream outputStream=null;
			InputStream inputStream=null ;
			request.setCharacterEncoding("UTF-8");  	 
			if(!DownLoadFile.isNotEmpty(fileName)){
				return ;
			}else{
				fileName = new String(fileName.getBytes("ISO-8859-1"),"UTF8");
				fileName=java.net.URLDecoder.decode(fileName,"UTF-8");
			}
			
			if(!DownLoadFile.isNotEmpty(downloadName)){
				return ;
			}else{
				downloadName = new String(downloadName.getBytes("ISO-8859-1"),"UTF8");
				downloadName=java.net.URLDecoder.decode(downloadName,"UTF-8");
			}
			
			if(!DownLoadFile.isNotEmpty(filePath)){
				 ServletContext servletContext = request.getServletContext();
				 filePath=servletContext.getRealPath("/")+"downLoad/" ;
			}else{
				filePath=new String(filePath.getBytes("ISO-8859-1"),"UTF8");
				filePath=java.net.URLDecoder.decode(filePath,"UTF-8");
				filePath.replaceAll("\\\\", "/");
				filePath.replaceAll("//", "/");
			}
			
			response.reset();
			response.setContentType("text/plain");
			response.setHeader("Location",fileName);
			response.addHeader("Content-Disposition", "attachment; filename="+(new String((fileName).getBytes("UTF-8"),"iso8859-1"))); 
			try {
				 outputStream = response.getOutputStream();
				inputStream = new FileInputStream(filePath+downloadName);
				byte[] buffer = new byte[1024];
				int i = -1;
				while ((i = inputStream.read(buffer)) != -1) {
 					outputStream.write(buffer, 0, i);
				}
			} catch (Exception e) {
				log.error("输出流异常", e);
			}finally{
				outputStream.flush();
				outputStream.close();
				inputStream.close();
			}
	}

	public static boolean isNotEmpty(String str){
		if(str!=null&&!"".equals(str)&&!"null".equals(str)){
			return true;
		}else{
			return false;
		}
	}
}
