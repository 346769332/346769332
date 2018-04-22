package com.tydic.sale.servlet.shortProcess;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Field;
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
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
import com.tydic.sale.utils.water.CreatePngUtils;
import com.tydic.sale.utils.water.WaterMarkUtilOffice;
import com.tydic.sale.utils.water.WaterMarkUtilPDF;

@WebServlet("/shortProcess/helpFile.do")
public class HelpFileServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(HelpFileServlet.class);
	public HelpFileServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String attachment_path = request.getParameter("filePath");
		String attachment_name = request.getParameter("fileName");
		String other_attachment_name=request.getParameter("downloadName");
		//在这里判断如果上次的附件是pdf，excel，word，要重新给附件加水印 add 2017-07-31
		String suffix = attachment_name.substring(attachment_name.lastIndexOf(".") + 1);
		String attachment_path1 = attachment_path+systemUser.getLoginCode()+"/";
		File filePar = new File(attachment_path1);
		if (!filePar.exists() && !filePar.isDirectory()) {
			filePar.mkdirs();
		}
		if(suffix.equals("pdf")||suffix.equals("xls")||suffix.equals("xlsx")){
			try {
				this.createWaterFile(systemUser,attachment_path,other_attachment_name,suffix);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		reqMap.put("handleType", "add");
		reqMap.put("dataSource", "");
		reqMap.put("nameSpace", "shortProcess");
		reqMap.put("sqlName", "insertDownWatermarkFileInfo");
		reqMap.put("staff_Id", systemUser.getStaffId());
		reqMap.put("staff_Name", systemUser.getStaffName());
		reqMap.put("attachment_path", attachment_path);
		reqMap.put("attachment_name", attachment_name);
		reqMap.put(Constant.SERVER_NAME, "addCommonMethod");
		System.out.println("++++++++++++++++++++++++++++水印完成后的操作reqMap++++++++++"+reqMap.toString());
		Map<Object,Object> respMap = this.crmService.commonMothed(reqMap);
		resultMap.put("code", "1");
		if(!"0".equals(respMap.get("code"))){
			resultMap.put("code", "1");
		} else {
			resultMap.put("code", "0");
			if(suffix.equals("pdf")||suffix.equals("xls")||suffix.equals("xlsx")){
				resultMap.put("file_path", attachment_path1);
			}else{
				resultMap.put("file_path", attachment_path);
			}
			
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	

	public void createWaterFile(SystemUser systemUser, String attachment_path,
			String attachment_name,String suffix) throws Exception {
		// TODO Auto-generated method stub
		String message=systemUser.getStaffName()+"  "+systemUser.getLoginCode();//需要显示的水印文字
		String waterFileName=Tools.creatFileName()+"."+suffix;//生成水印文件的名称
		String attachment_path1 = attachment_path+systemUser.getLoginCode()+"/";
		String pngFileName="";
		if(suffix.equals("xls")||suffix.equals("xlsx")){//说明上传的是excel文件，要先生成水印图片
			//先生成一个随机文件名
			pngFileName=Tools.creatFileName()+".png";
			String filePath=attachment_path1+pngFileName;
			logger.info("生成水印图片的地址+++++++++++++++++++++++++++++++："+filePath);
			CreatePngUtils.createImage(message, filePath);
		}
		//在这里将原文件生成带有水印的文件
		if(suffix.equals("pdf")){
			PdfReader pdfReader = new PdfReader(attachment_path+attachment_name);
			logger.info("pdf上传文件的地址+++++++++++++++++++++++++++++++："+attachment_path+attachment_name);
			Field f = PdfReader.class.getDeclaredField("ownerPasswordUsed");
			f.setAccessible(true);
			f.set(pdfReader, Boolean.TRUE);
			
			// Get the PdfStamper object
			PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileOutputStream(attachment_path1+waterFileName));
			logger.info("pdf生成水印文件的地址+++++++++++++++++++++++++++++++："+attachment_path1+waterFileName);
			WaterMarkUtilPDF.addWatermark(pdfStamper, message);
			pdfStamper.close();	
		}else if(suffix.equals("xls")){
			WaterMarkUtilOffice.excel2003(message, attachment_path+attachment_name, attachment_path1+waterFileName,attachment_path1+pngFileName);
		}else if(suffix.equals("xlsx")){
			System.out.println("++++++++++++++++++++++++++++调用水印工具类2007++++++++++"+attachment_path1+attachment_name);
			WaterMarkUtilOffice.excel2007(message, attachment_path+attachment_name, attachment_path1+waterFileName,attachment_path1+pngFileName);
		}
		//生成完毕后，要将原始文件和生成的图片文件都删除，并将水印文件名修改成原始文件名
		if(suffix.equals("xls")||suffix.equals("xlsx")){
		this.deleteFile(attachment_path1+pngFileName);
		}
		this.deleteFile(attachment_path1+attachment_name);
//		//修改文件名
		 File f = new File(attachment_path1+waterFileName);   
	        String p = f.getParent();   // 文件所在路径(一定要写,否则改名操作将把原文件删除)
	        File nf = new File(p + File.separatorChar+attachment_name);   
	        if(f.renameTo(nf))   
	        {   
	          System.out.println("修改成功!");   
	        }   
	        else   
	        {   
	          System.out.println("修改失败");   
	        }  
	}

	private void deleteFile(String filePath) {
		// TODO Auto-generated method stub
		File f = new File(filePath); // 输入要删除的文件位置
		if(f.exists())
		f.delete();
	}
}
