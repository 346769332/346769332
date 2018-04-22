package com.tydic.sale.servlet.common;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
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
import javax.servlet.http.HttpSession;

import net.sf.json.JSONObject;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.auth.client.utils.AuthConfigManagerClient;
import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.FtpClientUtil;
import com.tydic.sale.utils.NewMD5;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/sale/shrotPrcessUpload.do")
public class ShrotPrcessUploadServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(ShrotPrcessUploadServlet.class);
	private String filePath;    // 文件存放目录  
	private String demand_Id;
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
	 *      response) 短流程相关接口
	 */
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		System.out.println("+++++++++++++++++++进入app上传附件+++++++++++++++++++++++");
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		// 获取员工基本信息
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session
				.getAttribute(SaleUtil.SYSTEMUSER);
 		request.setCharacterEncoding("utf-8"); // 设置编码
 		boolean isMultipart = ServletFileUpload.isMultipartContent(request);  
 		System.out.println("isMultipart::"+isMultipart);
		String demandId = request.getParameter("demand_id");
		String type = request.getParameter("type");
		demand_Id= request.getParameter("demand_id");
		String proId = request.getParameter("pro_id");//提交与发布编号
		String namespace = request.getParameter("namespace");//提交与发布编号
		String userId = request.getParameter("staffId");//上传人
		if(namespace==null||namespace.equals("")||namespace.equals("null")){
			namespace="mysql";
		}
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		
		String webRoot = this.getDocumentRoot(request);
		
		File webRootFile = new File(webRoot);
		String webRootFilePath = webRootFile.getParent();
		
		//		filePath =webRootFilePath+"/"+super.getDemSendUpDirPath()+ "/";
		filePath=super.getDemSendUpDirPath()+ "/";
		File filePar = new File(filePath);
		if (!filePar.exists() && !filePar.isDirectory()) {
			filePar.mkdirs();
		}
		
		if(!"".equals(demandId) && demandId != null && !"null".equals(demandId)) {
			filePath = filePath + demandId + "/";
		}
		
		//String userId = systemUser.getStaffId();//用户编码
		File file = new File(filePath);
		// 判断上传文件的保存目录是否存在
		if (!file.exists() && !file.isDirectory()) {
			file.mkdirs();
		}
		 System.out.println("++++++++++++fielpath+++++++++++++++++++:"+filePath);
		//PrintWriter pw = response.getWriter();
		 DiskFileItemFactory diskFactory = new DiskFileItemFactory();
			// threshold 极限、临界值，即硬盘缓存 1M
			diskFactory.setSizeThreshold(200 * 1024);
			ServletFileUpload upload = new ServletFileUpload(diskFactory);
			// 设置允许上传的最大文件大小 4M
			upload.setSizeMax(1024 * 1024 * 1024);
		try {
			
			List<FileItem> listr = (List<FileItem>)upload.parseRequest(request);
			//List<?> items = upload.parseRequest(request);  
			//List items = upload.parseRequest(request);  
			//add 2017-11-15 将文件上传到远程服务器，连接远程服务器
			String uppath=super.getUpLoadPath()+demandId + "/";
			String upIp=super.getUpLoadIp();
			int upPort=Integer.parseInt(super.getUpLoadPort());
			String upPassWord=super.getUpLoadPassword();
			String upUsername=super.getUpLoadUsername();
			FtpClientUtil client =new FtpClientUtil(upIp,upPort,upUsername,upPassWord,"",uppath,"290");
			for(FileItem item : listr){
				String fieldName = item.getFieldName();  
				String fileName = item.getName();  
				String contentType = item.getContentType();  
				Map<Object, Object> paramMap = new HashMap<Object, Object>();
				//qry_FileInfoId
				paramMap.put("SERVER_NAME", "qry_FileInfoId");
				//resultMap = this.crmService.commonMothed(paramMap);
				Map<Object, Object> serMap = crmService.dealObjectFun(paramMap);
				String  filePictureInfo =null;
				if("0".equals(serMap.get("code"))){
					//System.out.println("list.get(0)::"+list.get(0));
					 filePictureInfo =(String) serMap.get("sum");
				}
				
				if (item.isFormField()) {
					System.out.println("处理表单内容 ...");
					processFormField(item);
				} else {
					System.out.println("处理上传的文件 ...");
			       
			        if(!"null".equals(fileName) && !"".equals(fileName) && fileName != null) {
			        	reqMap.put("attachment_name", fileName);
			        	reqMap.put("attachment_path", filePath);
			        	reqMap.put("attachment_type", type);
			        	reqMap.put("attachment_value", demandId);
			        	reqMap.put("proId", proId);
			        	reqMap.put("userId", userId);
			        	reqMap.put("userName", systemUser.getStaffName());
			        	reqMap.put("namespace", namespace);
			        	int pointIndex = fileName.lastIndexOf(".");
			        	String fileType = fileName.substring(pointIndex+1);
			        	String filenamel = "." + fileType;
			        	Date day=new Date();    
			        	String newfilename=fileName.substring(0,pointIndex);
			        	//String other_attachment_name=NewMD5.string2MD5(newfilename)+filenamel;
			        	SimpleDateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");  
			        	String other_attachment_name=demandId+df.format(day)+filePictureInfo+filenamel;
			        	System.out.println("other_attachment_name::"+other_attachment_name);
			        	System.out.println("++++++++++++++++++++++app文件上传路径+++++++++++"+filePath);
			        	//上传文件
			        	processUploadFile(item,other_attachment_name);
			        	//本地上传成功后调用远程上传
			        	File file1 = new File(filePath + "/" + other_attachment_name);
			    		FileInputStream inputStream = null;
			    		try {
			    			inputStream = new FileInputStream(file1);
			    		} catch (FileNotFoundException e1) {
			    			logger.error(e1.getMessage());
			    		}
			    		client.upload(inputStream,other_attachment_name);
			        	reqMap.put("other_attachment_name", other_attachment_name);
			        	reqMap.put("SERVER_NAME", "goverInsertAttach");
			        	System.out.println("++++++++++++++++++++++插入app文件数据other_attachment_name+++++++++++"+other_attachment_name);
			        	resultMap=crmService.dealGoverAndEnter(reqMap);
			        	System.out.println("++++++++++++++++++++++插入app数据成功+++++++++++");
			        }
				}
			}
//			Iterator iter = items.iterator();
//			while (iter.hasNext()) {
//				FileItem item = (FileItem) iter.next();
//				if (item.isFormField()) {
//					System.out.println("处理表单内容 ...");
//					processFormField(item);
//				} else {
//					System.out.println("处理上传的文件 ...");
//					String fieldName = item.getFieldName();  
//			        String fileName = item.getName();  
//			        String contentType = item.getContentType();  
//			        System.out.println("++++++++++++fieldName:"+fieldName);
//			        System.out.println("+++++++++++++++++fileName:"+fileName);
//			        System.out.println("++++++++++++++++++contentType:"+contentType);
//			       
//			        if(!"null".equals(fileName) && !"".equals(fileName) && fileName != null) {
//			        	reqMap.put("attachment_name", fileName);
//			        	reqMap.put("attachment_path", filePath);
//			        	if(!"null".equals(type) && !"".equals(type) && type != null){
//			        		reqMap.put("attachment_type", type);
//			        	}else{
//			        		reqMap.put("attachment_type", "goverManger");
//			        	}
//			        	
//			        	reqMap.put("attachment_value", demandId);
//			        	reqMap.put("proId", proId);
//			        	reqMap.put("userId", userId);
//			        	reqMap.put("namespace", namespace);
//			        	int pointIndex = fileName.lastIndexOf(".");
//			        	String fileType = fileName.substring(pointIndex+1);
//			        	String filenamel = "." + fileType;
//			        	Date day=new Date();    
//			        	String newfilename=fileName.substring(0,pointIndex);
//			        	//String other_attachment_name=NewMD5.string2MD5(newfilename)+filenamel;
//			        	SimpleDateFormat df = new SimpleDateFormat("yyyyMMddhhmmss");  
//			        	String other_attachment_name=demandId+df.format(day)+filenamel;
//			        	System.out.println("++++++++++++++++++++++app文件上传路径+++++++++++"+filePath);
//			        	//上传文件
//			        	processUploadFile(item,other_attachment_name);
//			        	reqMap.put("other_attachment_name", other_attachment_name);
//			        	reqMap.put("SERVER_NAME", "goverInsertAttach");
//			        	System.out.println("++++++++++++++++++++++插入app文件数据other_attachment_name+++++++++++"+other_attachment_name);
//			        	resultMap=crmService.dealGoverAndEnter(reqMap);
//			        	System.out.println("++++++++++++++++++++++插入app数据成功+++++++++++");
//			        }
//				}
//				
//			}
		//	pw.close();
			resultMap.put("code", "0");
		} catch (Exception e) {
//			System.out.println("使用 fileupload 包时发生异常 ...");
			e.printStackTrace();
			resultMap.put("code", "1");
		}

		this.sendMessages(response, JSON.toJSONString(resultMap));
	}

	/**
	 * 往前台发送消息-解决在IE浏览器中返回json格式的数据时提示下载办法 
	 * @param response
	 * @param json
	 * @return
	 */
	public String sendMessages(HttpServletResponse response, String json) {
		response.setContentType("text/plain");
		response.setContentType("text/plain;charset=UTF-8");
		response.setCharacterEncoding("UTF-8");
		try {
			response.getWriter().print(json);
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	// 处理表单内容
	private void processFormField(FileItem item)
			throws Exception {
		String name = item.getFieldName();
		String value = item.getString();
	}

	// 处理上传的文件
	private void processUploadFile(FileItem item,String other_attachment_name)
			throws Exception {
		// 此时的文件名包含了完整的路径，得注意加工一下
		String filename = item.getName();
		int index = filename.lastIndexOf("\\");
		filename = filename.substring(index + 1, filename.length());

		long fileSize = item.getSize();

		if ("".equals(filename) && fileSize == 0) {
			System.out.println("文件名为空 ...");
			return;
		}
//		String fileType=filename.substring(filename.lastIndexOf("."),filename.length());
		
		//File uploadFile = new File(filePath + "/" + filename);
		File uploadFile = new File(filePath + "/" + other_attachment_name);
		item.write(uploadFile);
		System.out.println("++++++++++++++++++++++app文件上传文件成功+++++++++++"+filePath);
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
