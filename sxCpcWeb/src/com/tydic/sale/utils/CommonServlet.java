package com.tydic.sale.utils;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
/**
 * 开发 提取公共方法使用
 * @author Administrator
 *
 */
public class CommonServlet extends DispatcherServlet {


	private static final long serialVersionUID = 7105988536921250472L;


	/**
	 * @param args
	 */
	public static void main(String[] args) {
		// TODO Auto-generated method stub

	}
	
	
	/**
	 * 统一返回
	 * @param response
	 * @param rltMap
	 * @throws IOException
	 */
	public void printJson(HttpServletResponse response,Map<String,Object> rltMap) throws IOException{
		response.setCharacterEncoding("UTF-8");
		String rlt=JSON.toJSONString(rltMap);
		PrintWriter out = response.getWriter();
		out.print(rlt);
		out.flush();
		out.close();
	}
	
	
	/**
	 * 统一返回
	 * @param response
	 * @param rltMap
	 * @throws IOException
	 */
	public void print(HttpServletResponse response,String rlt) throws IOException{
		response.setCharacterEncoding("UTF-8");
		PrintWriter out = response.getWriter();
		out.print(rlt);
		out.flush();
		out.close();
	}
}
