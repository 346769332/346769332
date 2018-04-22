package com.tydic.sale.servlet.shortProcess;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
//import com.lowagie.text.pdf.PdfReader;
//import com.lowagie.text.pdf.PdfStamper;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
import com.tydic.sale.utils.water.CreatePngUtils;
import com.tydic.sale.utils.water.WaterMarkUtilOffice;
import com.tydic.sale.utils.water.WaterMarkUtilPDF;

@WebServlet("/shortProcess/queryGoverEnterList.do")
public class QueryGoverEnterListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryGoverEnterListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryGoverEnterListServlet() {
		super();
		// TODO Auto-generated constructor stub
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
	@SuppressWarnings({ "rawtypes", "unchecked" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String hanleType = request.getParameter("hanleType");
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		//查询列表
		if ("qryDownloadPath".equals(hanleType)){
			reqMap.clear();
			String proId = request.getParameter("proId");
			reqMap.put("proId", proId);
			reqMap.put("SERVER_NAME", "qryDownloadPath");
			resultMap = crmService.dealObjectFun(reqMap);
		} else if("getAttachmentId".equals(hanleType)) {
			reqMap.put("SERVER_NAME", "getAttachmentId");
			resultMap = crmService.dealObjectFun(reqMap);
		} else if("delFileName".equals(hanleType)) {
			reqMap.clear();
			String attachment_value = request.getParameter("attachment_value");
			reqMap.put("attachment_value", attachment_value);
			reqMap.put("attachment_name", request.getParameter("fileName"));
			reqMap.put("SERVER_NAME", "dealFileNameInfo");
			Map<Object,Object> respMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if(!"0".equals(respMap.get("code"))){
				resultMap.put("code", "1");
				resultMap.put("msg", "删除失败");
			} else {
				resultMap.put("code", "0");
			}
		}else if("goverInsertAttach".equals(hanleType)){
			String attachment_type = request.getParameter("attachment_type");
			String proId = request.getParameter("attachment_value");
			String attachment_path = request.getParameter("attachment_path");
			String attachment_name = request.getParameter("attachment_name");
			String other_attachment_name=request.getParameter("other_attachment_name");
			String namespace ="mysql";//提交与发布编号
			reqMap.put("attachment_name", attachment_name);
			reqMap.put("attachment_value", proId);
			reqMap.put("proId", proId);
			reqMap.put("attachment_type", attachment_type);
			reqMap.put("userId", systemUser.getStaffId());
			reqMap.put("userName", systemUser.getStaffName());
			reqMap.put("namespace", namespace);
			reqMap.put("other_attachment_name", other_attachment_name);
			reqMap.put("attachment_path", attachment_path);
			//在这里判断如果上次的附件是pdf，excel，word，要重新给附件加水印 add 2017-07-31
//			String suffix = attachment_name.substring(attachment_name.lastIndexOf(".") + 1);
//			if(suffix.equals("pdf")||suffix.equals("xls")||suffix.equals("xlsx")){
//			try {
//				this.createWaterFile(systemUser,attachment_path,other_attachment_name,suffix);
//			} catch (Exception e) {
//				// TODO Auto-generated catch block
//				e.printStackTrace();
//			}
//			}
			reqMap.put("SERVER_NAME", "goverInsertAttach");
			System.out.println("++++++++++++++++++++++++++++水印完成后的操作reqMap++++++++++"+reqMap.toString());
			Map<Object,Object> respMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if(!"0".equals(respMap.get("code"))){
				resultMap.put("code", "1");
			} else {
				resultMap.put("code", "0");
			}
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}

	public void createWaterFile(SystemUser systemUser, String attachment_path,
			String attachment_name,String suffix) throws Exception {
		// TODO Auto-generated method stub
		String message=systemUser.getStaffName()+"  "+systemUser.getLoginCode();//需要显示的水印文字
		String waterFileName=Tools.creatFileName()+"."+suffix;//生成水印文件的名称
		String pngFileName="";
		if(suffix.equals("xls")||suffix.equals("xlsx")){//说明上传的是excel文件，要先生成水印图片
			//先生成一个随机文件名
			pngFileName=Tools.creatFileName()+".png";
			String filePath=attachment_path+pngFileName;
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
			PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileOutputStream(attachment_path+waterFileName));
			logger.info("pdf生成水印文件的地址+++++++++++++++++++++++++++++++："+attachment_path+waterFileName);
			WaterMarkUtilPDF.addWatermark(pdfStamper, message);
			pdfStamper.close();	
		}else if(suffix.equals("xls")){
			WaterMarkUtilOffice.excel2003(message, attachment_path+attachment_name, attachment_path+waterFileName,attachment_path+pngFileName);
		}else if(suffix.equals("xlsx")){
			System.out.println("++++++++++++++++++++++++++++调用水印工具类2007++++++++++"+attachment_path+attachment_name);
			WaterMarkUtilOffice.excel2007(message, attachment_path+attachment_name, attachment_path+waterFileName,attachment_path+pngFileName);
		}
		//生成完毕后，要将原始文件和生成的图片文件都删除，并将水印文件名修改成原始文件名
		if(suffix.equals("xls")||suffix.equals("xlsx")){
		this.deleteFile(attachment_path+pngFileName);
		}
		this.deleteFile(attachment_path+attachment_name);
		//修改文件名
		 File f = new File(attachment_path+waterFileName);   
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
