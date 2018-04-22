package com.tydic.sale.servlet.leadStroke;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Phrase;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.ColumnText;
import com.itextpdf.text.pdf.GrayColor;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfPageEventHelper;
import com.itextpdf.text.pdf.PdfWriter;

/**
 * 
 * @author YangBin
 * @Date 2013-4-18
 * @Company: Tydic
 * @version 1.0
 * @Description: 创建PDF
 */
public class LeadCreatePDFShow  extends PdfPageEventHelper {
	private List contList;//内容列表
	private List contList1;//内容列表
	private Map contTitle;//内容标题
	private float [] colWidth;//列宽
	private String waterCont;//水印内容
	private String pdfTitle;//文档标题
	private String pdfAuthor = "天源迪科";//创建人
	private String pdfSubject;//文档主题
	private String [] colMaping;
	private final int PDFWIDTH=700;
	private final int PDFHEIGHT=1200;
	private Map disposeName = new HashMap();
	private Map percent = new HashMap();
	private Map firstMap;//pdf流程详细内容

	@SuppressWarnings("unused")
	private LeadCreatePDFShow() {}

	private LeadCreatePDFShow(List contList,Map contTitle) {
		this.contList = contList;
		this.contTitle = contTitle;
	}
	
	public LeadCreatePDFShow(List contList,Map contTitle,float [] colWidth,List contList1) {
		this.contList = contList;
		this.contList1 = contList1;
		this.contTitle = contTitle;
		this.colWidth = colWidth;
	}
	/**
	 * 
	 * @return
	 * @throws Exception 
	 */
	public void createDownLoadPdf(Document document,OutputStream os) throws Exception{
		// 设定字体 为的是支持中文
		BaseFont bfChinese = BaseFont.createFont("STSong-Light","UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
		Font FontChineseCont = new Font(bfChinese, 14, Font.NORMAL);//正常表格字体
		Font FontChineseTitle = new Font(bfChinese, 18, Font.BOLD);//标题字体
		Font FontChineseTableTitle = new Font(bfChinese, 14, Font.BOLD);//表格表头字体
		float totalWidth=0;
		for(int i=0;i<colWidth.length;i++){
			totalWidth+=colWidth[i];
		}
		document.setPageSize(new Rectangle(totalWidth, PDFHEIGHT));		
		//document.setPageSize(pageSize.rotate());
		document.setMargins(10, 0, 0, 0);
		PdfWriter pdfWriter = PdfWriter.getInstance(document, os);
		//if(waterCont!=null)pdfWriter.setPageEvent(new PdfWatermark(waterCont));
		if(pdfAuthor!=null)document.addAuthor(pdfAuthor);
		if(pdfSubject!=null)document.addSubject(pdfSubject);
		if(pdfTitle!=null)document.addTitle(pdfTitle);
		if(pdfAuthor!=null)document.addCreator(pdfAuthor);
		document.addCreationDate();
		// 设置权限
		pdfWriter.setEncryption(null, null, PdfWriter.ALLOW_SCREENREADERS,
				PdfWriter.STANDARD_ENCRYPTION_128);
		// 开启文档
		document.open();
		Paragraph t = new Paragraph(pdfTitle, FontChineseTitle);
		t.setAlignment(1); 
		document.add(t);
		document.add(new Paragraph("\n"));
		Map tempMap;
		Map tempMaps;
		Map tempMap1;
		Map tempMap2;
		Map tempMap3;
		Map tempMap4;
		String tempStr="";
		String tempStr1="";
		String tempStr2="";
		String tempStr3="";
		PdfPTable table = new PdfPTable(colWidth);
		table.addCell(new Paragraph("日期", FontChineseCont));
		table.addCell(new Paragraph("时段", FontChineseCont));
		for(int i =0;i<contList1.size();i++){
			tempMap=(Map)contList1.get(i);
			String str = (String)tempMap.get("ASCRIPTIONLAEDNAME")+"\n"+(String)tempMap.get("ASCRIPTIONLAEDPOSITION");
			table.addCell(new Paragraph(str, FontChineseCont));
		}
		int sum = contList1.size();
		for(int j =0;j<=(contList.size()-sum);){
			tempMap=(Map)contList.get(j);
			PdfPCell pdfCell = null; //表格的单元格
			if(j%(sum*2)==0){
				tempStr = (String) tempMap.get("strokeTime");
				pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
				pdfCell.setRowspan(2);
		        table.addCell(pdfCell);
			}
			for(int i = j; i<(j+sum);i++){
				tempMaps =(Map)contList.get(i);
				if(i==j){
					tempStr1= (String) tempMaps.get("periodTime");
					pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr1,FontChineseCont)));
			        table.addCell(pdfCell);
				}
				if("上午".equals(tempMaps.get("periodTime"))){
					tempMap1 = (Map)contList.get(i+sum);
					tempMap2 = (Map)contList.get(i);
					if(tempMap2.get("strokeInfo").equals(tempMap1.get("strokeInfo"))){
						tempStr = (String) tempMap2.get("strokeInfo");
						pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
						pdfCell.setRowspan(2);
				        table.addCell(pdfCell);
					}else{
						tempStr = (String) tempMap2.get("strokeInfo");
						pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
						//pdfCell.setRowspan(2);
				        table.addCell(pdfCell);
					}
				}else if("下午".equals(tempMaps.get("periodTime"))){
					tempMap1 = (Map)contList.get(i-sum);
					tempMap2 = (Map)contList.get(i);
					if(tempMap2.get("strokeInfo").equals(tempMap1.get("strokeInfo"))){
						
					}else{
						tempStr = (String) tempMap2.get("strokeInfo");
						pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
						//pdfCell.setRowspan(2);
				        table.addCell(pdfCell);
					}
				
				}
//					 if("上午".equals(tempMaps.get("periodTime"))){
//						    tempStr1= (String) tempMap.get("periodTime");
//							pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr1,FontChineseCont)));
//					        table.addCell(pdfCell);
//					 }
					
				
				
				
				
				
				
				
				
				

//				if("上午".equals(tempMaps.get("periodTime"))){
//					tempMap1 = (Map)contList.get(i+sum);
//					if(tempMaps.get("strokeInfo").equals(tempMap1.get("strokeInfo"))){
//						tempStr = (String) tempMap.get("strokeTime");
//						pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
//						pdfCell.setRowspan(2);
//				        table.addCell(pdfCell);
//					}
//					
//				}else if("下午".equals(tempMaps.get("periodTime"))){
//					tempMap2 = (Map)contList.get(i-sum);
//					if(tempMaps.get("strokeInfo").equals(tempMap2.get("strokeInfo"))){
//						
//					}else{
//						tempStr2= (String) tempMaps.get("strokeInfo");
//						pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr2,FontChineseCont)));
//				        table.addCell(pdfCell);
//					}
//				}else{
//					tempStr2= (String) tempMaps.get("strokeInfo");
//					pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr2,FontChineseCont)));
//			        table.addCell(pdfCell);
//				}
				
			}
			j = j+sum;
		}
		document.add(table);
	}
    
	public Map getFirstMap() {
		return firstMap;
	}

	public void setFirstMap(Map firstMap) {
		this.firstMap = firstMap;
	}

	public List getContList() {
		return contList;
	}

	public void setContList(List contList) {
		this.contList = contList;
	}
	public List getContList1() {
		return contList1;
	}
	
	public void setContList1(List contList1) {
		this.contList1 = contList1;
	}

	public Map getContTitle() {
		return contTitle;
	}

	public void setContTitle(Map contTitle) {
		this.contTitle = contTitle;
	}

	public float[] getColWidth() {
		return colWidth;
	}

	public void setColWidth(float[] colWidth) {
		this.colWidth = colWidth;
	}

	public String getWaterCont() {
		return waterCont;
	}

	public void setWaterCont(String waterCont) {
		this.waterCont = waterCont;
	}

	public String getPdfTitle() {
		return pdfTitle;
	}

	public void setPdfTitle(String pdfTitle) {
		this.pdfTitle = pdfTitle;
	}

	public String getPdfSubject() {
		return pdfSubject;
	}

	public void setPdfSubject(String pdfSubject) {
		this.pdfSubject = pdfSubject;
	}

	public String[] getColMaping() {
		return colMaping;
	}

	public void setColMaping(String[] colMaping) {
		this.colMaping = colMaping;
	}
	
	public String getPdfAuthor() {
		return pdfAuthor;
	}

	public void setPdfAuthor(String pdfAuthor) {
		this.pdfAuthor = pdfAuthor;
	}

	public Map getDisposeName() {
		return disposeName;
	}

	public void setDisposeName(Map disposeName) {
		this.disposeName = disposeName;
	}

	public Map getPercent() {
		return percent;
	}

	public void setPercent(Map percent) {
		this.percent = percent;
	}

	/**
	 * 名字处理
	 * 导出客户姓名（两位的对第二位脱敏、三位的对中间位脱敏、大于三位的倒数第二位）
	 * @param ob
	 * @return
	 */
	private String disposeName(Object ob){
		String retStr="";
		if(ob==null){
			retStr ="";
		}else if(ob.toString().length()==1){
			retStr=ob.toString();
		}else if(ob.toString().length()==2){
			retStr=ob.toString().substring(0,1)+"*";
		}else if(ob.toString().length()==3){
			retStr=ob.toString().substring(0,1)+"*"+ob.toString().substring(2,3);
		}else if(ob.toString().length()>3){
			retStr=ob.toString().substring(0,ob.toString().length()-2)+"*"+ob.toString().substring(ob.toString().length()-1,ob.toString().length());
		}
		return retStr;
	}
}

