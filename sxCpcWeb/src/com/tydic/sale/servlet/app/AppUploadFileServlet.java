package com.tydic.sale.servlet.app;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.apache.log4j.Logger;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
@WebServlet("/app/upLoadFile.do")
public class AppUploadFileServlet extends AbstractServlet {
	private static final long serialVersionUID=1L;
	private static final Logger logger=Logger.getLogger(AppUploadFileServlet.class);
	private String filePath;
	public AppUploadFileServlet(){
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
		
		String demandId = String.valueOf(request.getParameter("demand_id"));
		
		/*String webRoot = request.getSession().getServletContext()
				.getRealPath("/");
		if (webRoot == null) {
			webRoot = this.getClass().getClassLoader().getResource("/")
					.getPath();
			webRoot = webRoot.substring(0, webRoot.indexOf("WEB-INF"));
		}*/
		
		String webRoot = this.getDocumentRoot(request);
		
		File webRootFile = new File(webRoot);
		String webRootFilePath = webRootFile.getParent();
//		filePath = webRootFilePath+"/"+super.getDemSendUpDirPath()+ "/";
		filePath = super.getDemSendUpDirPath()+ "/";

	//	filePath="/home/tms/downfile/";
		File filePar = new File(filePath);
		if (!filePar.exists() && !filePar.isDirectory()) {
			filePar.mkdirs();
		}
		
		if(!"".equals(demandId) && demandId != null && !"null".equals(demandId)) {
			filePath = filePath + demandId + "/";
		}
		File file = new File(filePath);
		// 判断上传文件的保存目录是否存在
		if (!file.exists() && !file.isDirectory()) {
			file.mkdirs();
		}
		//PrintWriter pw = response.getWriter();
		try {
			DiskFileItemFactory diskFactory = new DiskFileItemFactory();
			// threshold 极限、临界值，即硬盘缓存 1M
			diskFactory.setSizeThreshold(20 * 1024);

			ServletFileUpload upload = new ServletFileUpload(diskFactory);
			// 设置允许上传的最大文件大小 4M
			upload.setSizeMax(100 * 1024 * 1024);
			List fileItems = upload.parseRequest(request);
			Iterator iter = fileItems.iterator();
			while (iter.hasNext()) {
				FileItem item = (FileItem) iter.next();
				String filename = item.getName();
				int pointIndex = filename.lastIndexOf(".");
	        	String fileType = filename.substring(pointIndex+1);
	        	String limitType=super.getLimitFileType();
	        	if(limitType.indexOf(fileType)==-1){//此文件限制上传
	        		continue;
	        	}
	        	String filenamel = "." + fileType;
	        	Date day=new Date();    
	        	SimpleDateFormat df = new SimpleDateFormat("yyyyMMddhhmmssSSS");  
	        	String other_attachment_name=demandId+df.format(day)+filenamel;
	        	if (item.isFormField()) {
//					System.out.println("处理表单内容 ...");
					processFormField(item);
				} else {
//					System.out.println("处理上传的文件 ...");
					processUploadFile(item,other_attachment_name);
				}
				Map<Object, Object> reqMap = new HashMap<Object, Object>();
				if(!"null".equals(filename) && !"".equals(filename) && filename != null) {
					reqMap.put("attachment_name", filename);
					reqMap.put("attachment_path", filePath);
					reqMap.put("attachment_type", "demand");
					reqMap.put("attachment_value", demandId);
					reqMap.put("SERVER_NAME", "insertAttachInfo");
					crmService.dealObjectFun(reqMap);
					/*resultMap.put("attachment_name", filename);
					resultMap.put("attachment_path", filePath);
					resultMap.put("other_attachment_name", other_attachment_name);
					resultMap.put("code", "0");
					resultMap.put("msg", "上传成功！");*/
				}
			}
			//pw.close();
			
		} catch (Exception e) {
//			System.out.println("使用 fileupload 包时发生异常 ...");
			e.printStackTrace();
			resultMap.put("code", "1");
			resultMap.put("msg", "上传失败！");
		}

		this.sendMessagess(response, JSON.toJSONString(resultMap));

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

	// 处理表单内容
	private void processFormField(FileItem item)
			throws Exception {
		String name = item.getFieldName();
		String value = item.getString();
	//	pw.println(name + " : " + value + "\r\n");
	}

	// 处理上传的文件
	private void processUploadFile(FileItem item,String other_attachment_name)
			throws Exception {
		// 此时的文件名包含了完整的路径，得注意加工一下
		String filename = item.getName();
//		System.out.println("完整的文件名：" + filename);
		int index = filename.lastIndexOf("\\");
		filename = filename.substring(index + 1, filename.length());

		long fileSize = item.getSize();

		if ("".equals(filename) && fileSize == 0) {
			System.out.println("文件名为空 ...");
			return;
		}
//		String fileType=filename.substring(filename.lastIndexOf("."),filename.length());
		
		File uploadFile = new File(filePath + "/" + other_attachment_name);
		item.write(uploadFile);
//		pw.println(filename + " 文件保存完毕 ...");
//		pw.println("文件大小为 ：" + fileSize + "\r\n");
	}
	
	//获取项目部署的目录
	public String getDocumentRoot(HttpServletRequest request) {
		String webRoot = request.getSession().getServletContext()
				.getRealPath("/");
		if (webRoot == null) {
			webRoot = this.getClass().getClassLoader().getResource("/")
					.getPath();
			webRoot = webRoot.substring(0, webRoot.indexOf("WEB-INF"));
		}
		return webRoot;
	}

}
