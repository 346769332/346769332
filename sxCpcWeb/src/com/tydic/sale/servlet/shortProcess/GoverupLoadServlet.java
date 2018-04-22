package com.tydic.sale.servlet.shortProcess;

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
import org.apache.commons.fileupload.FileUploadBase.SizeLimitExceededException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;

@WebServlet("/shortProcess/goverupLoad.do")
public class GoverupLoadServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(GoverupLoadServlet.class);
	private String filePath;    // 文件存放目录  
	
	private String demand_Id;
	public GoverupLoadServlet() {
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
		if(request.getContentLength() > 500*1024*1024){
			resultMap.put("code", "2");
		} else {
			request.setCharacterEncoding("utf-8"); // 设置编码
			String demandId = request.getParameter("demand_id");
			String type = request.getParameter("type");
			demand_Id= request.getParameter("demand_id");
			String proId = request.getParameter("pro_id");//提交与发布编号
			String namespace ="mysql";//提交与发布编号
			// 获取员工基本信息
			SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			String userId = systemUser.getStaffId();//用户编码
			filePath =super.getDemSendUpDirPath()+ "/";
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
			PrintWriter pw = response.getWriter();
			try {
				DiskFileItemFactory diskFactory = new DiskFileItemFactory();
				// threshold 极限、临界值，即硬盘缓存 1M
				diskFactory.setSizeThreshold(200 * 1024);
				ServletFileUpload upload = new ServletFileUpload(diskFactory);
				// 设置允许上传的最大文件大小 50M
				upload.setSizeMax(1024 * 1024 * 1024);
				List fileItems = upload.parseRequest(request);
				Iterator iter = fileItems.iterator();
				while (iter.hasNext()) {
					FileItem item = (FileItem) iter.next();
					if (item.isFormField()) {
						processFormField(item, pw);
					} else {
						processUploadFile(item, pw);
					}
					String filename = item.getName();
					Map<Object, Object> reqMap = new HashMap<Object, Object>();
					if(!"null".equals(filename) && !"".equals(filename) && filename != null) {
						reqMap.put("attachment_name", filename);
						reqMap.put("attachment_path", filePath);
						if(!"null".equals(type) && !"".equals(type) && type != null){
							reqMap.put("attachment_type", type);
						}else{
							reqMap.put("attachment_type", "goverManger");
						}
						
						reqMap.put("attachment_value", demandId);
						reqMap.put("proId", proId);
						reqMap.put("userId", userId);
						reqMap.put("namespace", namespace);
						int pointIndex = filename.lastIndexOf(".");
						String fileType = filename.substring(pointIndex+1);
				        String filenamel = "." + fileType;
						Date day=new Date();    
						SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");  
						String other_attachment_name=demandId+df.format(day)+filenamel;
						reqMap.put("other_attachment_name", other_attachment_name);
						reqMap.put("SERVER_NAME", "goverInsertAttach");
						crmService.dealObjectFun(reqMap);
					}
				}
				pw.close();
			}catch(SizeLimitExceededException se){
				resultMap.put("code", "-1");
			}catch (Exception e) {
				resultMap.put("code", "1");
			}
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
	private void processFormField(FileItem item, PrintWriter pw)
			throws Exception {
		String name = item.getFieldName();
		String value = item.getString();
		pw.println(name + " : " + value + "\r\n");
	}

	// 处理上传的文件
	private void processUploadFile(FileItem item, PrintWriter pw)
			throws Exception {
		// 此时的文件名包含了完整的路径，得注意加工一下
		String filename = item.getName();
		//int index = filename.lastIndexOf("\\");
		//filename = filename.substring(index + 1, filename.length());
		int index = filename.lastIndexOf('.');
		String lastName = filename.substring(index,filename.length());//文件后缀
		Date day=new Date();    
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMdd");  
		filename=demand_Id+df.format(day)+lastName;//别名
		long fileSize = item.getSize();

		if ("".equals(filename) && fileSize == 0) {
			System.out.println("文件名为空 ...");
			return;
		}
//		String fileType=filename.substring(filename.lastIndexOf("."),filename.length());
		File uploadFile = new File(filePath + "/" + filename);
		item.write(uploadFile);
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
