package com.tydic.sale.utils;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletResponse;

import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableCellFormat;
import jxl.write.WritableFont;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;
import jxl.write.WriteException;
import jxl.write.biff.RowsExceededException;

import org.apache.log4j.Logger;

public class DownExcel {
	
	private static Logger log = Logger.getLogger(DownExcel.class);
	private static String tempFileName="export.xls";

	public static void exec(HttpServletResponse response,String fileName,List<String> headSet,List<Map<String,Object>> contentSet){
		if(!DownExcel.isNotEmpty(fileName)){
			fileName=tempFileName;
		}
		
	    try {
	    	response.reset();
	    	response.setContentType("application/octet-stream; charset=UTF-8");
	    	response.addHeader("Content-Disposition", "attachment; filename="+ (new String((fileName).getBytes("GB2312"),"iso8859-1")));
			DownExcel.createExcel( fileName, response, headSet, contentSet);
			response.flushBuffer();
		} catch (RowsExceededException e) {
			log.error("创建sheetCell列失败", e);
		} catch (WriteException e) {
			log.error("输出写入失败", e);
		} catch (IOException e) {
			log.error("输出流异常", e);
		}
	    
	}
	
	
	private static boolean createExcel(String fileName,HttpServletResponse response,List<String> headSet,List<Map<String,Object>> contentSet) throws IOException, RowsExceededException, WriteException{
		
		boolean rBool = false;
		WritableWorkbook ww = Workbook.createWorkbook(response.getOutputStream());
		WritableSheet sheet = ww.createSheet("SheetOne",0);	
		
		WritableFont times16font  = new WritableFont(WritableFont.ARIAL,12); 
		WritableCellFormat arial10format = new WritableCellFormat (times16font); 
		
		//绘制头部
		for(int i=0 ; i<headSet.size() ; i++){
			String head = headSet.get(i);
			Label l1=new Label(i,0,head,arial10format);
			sheet.addCell(l1);
		}
		//绘制内容
		for(int i=0;i<contentSet.size();i++){
			Map<String,Object> content = contentSet.get(i);
			for(int j=0 ; j<headSet.size() ; j++){
				String head = headSet.get(j);
				Label pr=new Label(j,i+1,String.valueOf(content.get(head)));
				sheet.addCell(pr);
			}
		}
		if(Tools.isNull(headSet)){
			Label l1=new Label(0,0,"--未获取到数据，请回到系统，确认查询条件是否正确--");
			sheet.addCell(l1);
		}
		//结束
	    ww.write();
		ww.close();
		rBool = true;
		
	    return rBool;
	}
	
	
	
	/**
	 * 带中文的输出
	 * @param response
	 * @param fileName
	 * @param headSet
	 * @param contentSet
	 */
	
	public static void exec2(HttpServletResponse response,String fileName,Map<String,String> headMap,List<Map<String,Object>> contentSet){
		if(!DownExcel.isNotEmpty(fileName)){
			fileName=tempFileName;
		}
		
	    try {
	    	response.reset();
	    	response.setContentType("application/octet-stream; charset=UTF-8");
	    	response.addHeader("Content-Disposition", "attachment; filename="+ (new String((fileName).getBytes("GB2312"),"iso8859-1")));
			DownExcel.createExcel2( fileName, response, headMap, contentSet);
			response.flushBuffer();
		} catch (RowsExceededException e) {
			log.error("创建sheetCell列失败", e);
		} catch (WriteException e) {
			log.error("输出写入失败", e);
		} catch (IOException e) {
			log.error("输出流异常", e);
		}
	    
	}
	
	private static boolean createExcel2(String fileName,HttpServletResponse response,Map<String,String> headMap,List<Map<String,Object>> contentSet) throws IOException, RowsExceededException, WriteException{
		
		boolean rBool = false;
		WritableWorkbook ww = Workbook.createWorkbook(response.getOutputStream());
		WritableSheet sheet = ww.createSheet("SheetOne",0);	
		
		WritableFont times16font  = new WritableFont(WritableFont.ARIAL,12); 
		WritableCellFormat arial10format = new WritableCellFormat (times16font); 
		
		//绘制头部
		int headNum=0;
		for (Map.Entry<String, String> entry : headMap.entrySet()) {
			   String headValue = entry.getValue();
				Label l1=new Label(headNum,0,headValue,arial10format);
				sheet.addCell(l1);
				headNum++;
		} 
		
		//绘制内容
		headNum=0;
		for(int i=0;i<contentSet.size();i++){
			headNum=0;
			Map<String,Object> content = contentSet.get(i);
			for (Map.Entry<String, String> entry : headMap.entrySet()) {
				    String headkey = entry.getKey();
				    String headValue="";
				    Object obj=content.get(headkey);
				    if(null!=obj && !"null".equals(obj)){
				    	headValue=obj.toString();
				    }
				    Label pr=new Label(headNum,i+1,headValue);
					sheet.addCell(pr);
					headNum++;
			}
		}
		if(Tools.isNull(headMap)){
			Label l1=new Label(0,0,"--未获取到数据，请回到系统，确认查询条件是否正确--");
			sheet.addCell(l1);
		}
		//结束
	    ww.write();
		ww.close();
		rBool = true;
		
	    return rBool;
	}
	
	
	public static boolean isNotEmpty(String str){
		if(str!=null&&!"".equals(str)&&!"null".equals(str)){
			return true;
		}else{
			return false;
		}
	}
}
