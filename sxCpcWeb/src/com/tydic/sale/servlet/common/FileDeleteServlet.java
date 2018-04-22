package com.tydic.sale.servlet.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.utils.FtpClientUtil;
import com.tydic.sale.utils.NewMD5;
@WebServlet("/common/deleteFile.do")
public class FileDeleteServlet extends AbstractServlet {
	private static final long serialVersionUID=1L;
	private static final Logger logger=Logger.getLogger(FileDeleteServlet.class);
	private String filePath;
	public FileDeleteServlet(){
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		request.setCharacterEncoding("utf-8"); // 设置编码
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=UTF-8");
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		String other_attachment_name = request.getParameter("other_attachment_name");
		String attachment_path = request.getParameter("attachment_path");
		String attachment_value=request.getParameter("attachment_value");
		String filePath = attachment_path+other_attachment_name;
		System.out.println(filePath);
		try {
			 File file = new File(filePath);  
		      if (file.delete()) {  
		        System.out.println("fileName is deleted"); 
				reqMap.put("attachment_value", request.getParameter("attachment_value"));
				System.out.println("attachment_value"+request.getParameter("attachment_value")); 
				reqMap.put("attachment_type", request.getParameter("attachment_type"));
				System.out.println("attachment_type"+request.getParameter("attachment_type")); 
				reqMap.put("other_attachment_name", request.getParameter("other_attachment_name"));
				System.out.println("other_attachment_name"+request.getParameter("other_attachment_name")); 
				reqMap.put("SERVER_NAME", "deleteFileInfos");
				Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
				if ("0".equals(serMap.get("code"))) {
					System.out.println("删除成功！"); 
					resultMap.put("code", "0");
					resultMap.put("msg", "删除成功！");
				}
				//add 2017-11-15 删除远程服务器上的文件
				deleteRemoatFile(attachment_value,other_attachment_name);
		      } else {  
					resultMap.put("code", "1");
					resultMap.put("msg", "删除失败！");
		      }
		} catch (Exception e) {
//			System.out.println("使用 fileupload 包时发生异常 ...");
			e.printStackTrace();
			resultMap.put("code", "1");
			resultMap.put("msg", "删除失败！");
		}

		this.sendMessagess(response, JSON.toJSONString(resultMap));

	}
	/**
	 * 远程删除服务器上的文件
	 * @param attachment_value
	 * @param other_attachment_name
	 */
	private void deleteRemoatFile(String attachment_value,
			String other_attachment_name) {
		// TODO Auto-generated method stub
		String uppath=super.getUpLoadPath()+attachment_value + "/";
		String upIp=super.getUpLoadIp();
		int upPort=Integer.parseInt(super.getUpLoadPort());
		String upPassWord=super.getUpLoadPassword();
		String upUsername=super.getUpLoadUsername();
		FtpClientUtil client =new FtpClientUtil(upIp,upPort,upUsername,upPassWord,other_attachment_name,uppath,"290");
		client.delFiles(uppath, other_attachment_name);
		
	}

	/** 
     * 往前台发送消息 
     * @param response 
     * @param json 
     * @return 
     */ 
    public String sendMessagess(HttpServletResponse response, String json) { 
        //response.setContentType("application/json"); 
        //修复IE8，上传文件   text/html 
        response.setContentType("text/html; charset=utf-8"); 
        response.setCharacterEncoding("UTF-8"); 
        try { 
            response.getWriter().print(json); 
        } catch (IOException e) { 
            logger.error("返回前台请求异常", e); 
            e.printStackTrace(); 
        } 
        return null; 
    } 

}
