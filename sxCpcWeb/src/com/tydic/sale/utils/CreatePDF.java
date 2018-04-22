package com.tydic.sale.utils;

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
public class CreatePDF  extends PdfPageEventHelper {
	private List contList;//内容列表
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
	private CreatePDF() {}

	private CreatePDF(List contList,Map contTitle) {
		this.contList = contList;
		this.contTitle = contTitle;
	}
	
	public CreatePDF(List contList,Map contTitle,float [] colWidth) {
		this.contList = contList;
		this.contTitle = contTitle;
		this.colWidth = colWidth;
	}
	public CreatePDF(List contList,Map contTitle,float [] colWidth,Map firstMap) {
		this.contList = contList;
		this.contTitle = contTitle;
		this.colWidth = colWidth;
		this.firstMap=firstMap;
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
		//document.setPageSize(PageSize.A4);
		document.setMargins(0, 0, 50, 50);
		PdfWriter pdfWriter = PdfWriter.getInstance(document, os);
		if(waterCont!=null)pdfWriter.setPageEvent(new PdfWatermark(waterCont));
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
		Paragraph t1 = new Paragraph("流程基本信息", FontChineseTitle);
		t1.setAlignment(1); 
		document.add(t1);
		document.add(new Paragraph("\n"));
		
		createNewParagraph(firstMap,document,FontChineseTableTitle);
		document.add(new Paragraph("\n"));
		
		Paragraph t = new Paragraph(pdfTitle, FontChineseTitle);
		t.setAlignment(1); 
		document.add(t);
		document.add(new Paragraph("\n"));

		PdfPTable table = new PdfPTable(colWidth);
		//设置表头
		if(contTitle.get("colspan3")!=null){
			PdfPCell begCell ;
			String title1[]=(String[])contTitle.get("title1");
			String title2[]=(String[])contTitle.get("title2");
			String title3[]=(String[])contTitle.get("title3");
			String title4[]=(String[])contTitle.get("title4");
			String title5[]=(String[])contTitle.get("title5");
			String colspan[]=((String)contTitle.get("colspan")).split(",");
			String colspan2[]=((String)contTitle.get("colspan1")).split(",");
			String colspan3[]=((String)contTitle.get("colspan2")).split(",");
			String colspan4[]=((String)contTitle.get("colspan3")).split(",");
			
			
			for (int i = 0; i < colspan4.length; i++) {
				begCell = new PdfPCell(new Paragraph(title5[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan4[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan3.length; i++) {
				begCell = new PdfPCell(new Paragraph(title4[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan3[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan2.length; i++) {
				begCell = new PdfPCell(new Paragraph(title3[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan2[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan.length; i++) {
				begCell = new PdfPCell(new Paragraph(title2[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
				
			}
			table.completeRow();
			for (int i = 0; i < title1.length; i++) {
				begCell = new PdfPCell(new Paragraph(title1[i], FontChineseTableTitle));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
		}else if(contTitle.get("colspan2")!=null){
			PdfPCell begCell ;
			String title1[]=(String[])contTitle.get("title1");
			String title2[]=(String[])contTitle.get("title2");
			String title3[]=(String[])contTitle.get("title3");
			String title4[]=(String[])contTitle.get("title4");
			String colspan[]=((String)contTitle.get("colspan")).split(",");
			String colspan2[]=((String)contTitle.get("colspan1")).split(",");
			String colspan3[]=((String)contTitle.get("colspan2")).split(",");
			
			
			System.out.println(colspan3.length+"=="+title4.length);
			for (int i = 0; i < colspan3.length; i++) {
				begCell = new PdfPCell(new Paragraph(title4[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan3[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan2.length; i++) {
				begCell = new PdfPCell(new Paragraph(title3[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan2[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan.length; i++) {
				begCell = new PdfPCell(new Paragraph(title2[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
				
			}
			table.completeRow();
			for (int i = 0; i < title1.length; i++) {
				begCell = new PdfPCell(new Paragraph(title1[i], FontChineseTableTitle));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
		}else if(contTitle.get("colspan1")!=null){
			PdfPCell begCell ;
			String title1[]=(String[])contTitle.get("title1");
			String title2[]=(String[])contTitle.get("title2");
			String title3[]=(String[])contTitle.get("title3");
			String colspan[]=((String)contTitle.get("colspan")).split(",");
			String colspan2[]=((String)contTitle.get("colspan1")).split(",");
			for (int i = 0; i < colspan2.length; i++) {
				begCell = new PdfPCell(new Paragraph(title3[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan2[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < colspan.length; i++) {
				begCell = new PdfPCell(new Paragraph(title2[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
			for (int i = 0; i < title1.length; i++) {
				begCell = new PdfPCell(new Paragraph(title1[i], FontChineseTableTitle));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
		}else if(contTitle.get("colspan")!=null){
			PdfPCell begCell ;
			String title1[]=(String[])contTitle.get("title1");
			String title2[]=(String[])contTitle.get("title2");
			String colspan[]=((String)contTitle.get("colspan")).split(",");
			for (int i = 0; i < colspan.length; i++) {
				begCell = new PdfPCell(new Paragraph(title2[i], FontChineseTableTitle));
				begCell.setColspan(Integer.parseInt(colspan[i]));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
				
			}
			table.completeRow();
			for (int i = 0; i < title1.length; i++) {
				begCell = new PdfPCell(new Paragraph(title1[i], FontChineseTableTitle));
				begCell.setHorizontalAlignment(1);
				table.addCell(begCell);
			}
			table.completeRow();
		}else{
			String title[]=(String[])contTitle.get("title1");
			for (int i = 0; i < title.length; i++) {
				table.addCell(new Paragraph(title[i], FontChineseTableTitle));
			}
			table.completeRow();
		}
		if(colMaping==null){
			int tempi=0;
			Set<String> key = ((Map)contList.get(tempi)).keySet();
			colMaping= new String[key.size()];
			for (Iterator it = key.iterator(); it.hasNext();) {
				colMaping[tempi++]=(String) it.next();
			}
		}
		
		Map tempMap;
		String tempStr="";
		
		for (int i = 0; i < contList.size(); i++) {
			tempMap=(Map)contList.get(i);
			for (int j=0;j<colMaping.length;j++) {
				if(disposeName.get("NAME")!=null&&colMaping[j].equals(disposeName.get("NAME"))){
					tempStr=disposeName(tempMap.get(disposeName.get("NAME")));
				}else if(disposeName.get("NAME1")!=null&&colMaping[j].equals(disposeName.get("NAME1"))){
					tempStr=disposeName(tempMap.get(disposeName.get("NAME1")));
				}else if(percent.get(colMaping[j])!=null){
					if(tempMap.get(colMaping[j])==null) tempStr = "-";
					else tempStr=tempMap.get(colMaping[j])+"%";
				}else{
					tempStr=tempMap.get(colMaping[j])!=null?tempMap.get(colMaping[j]).toString():"";
				}
				table.addCell(new Paragraph(tempStr, FontChineseCont));
			}
			table.completeRow();
		}
		
		document.add(table);
	}
    
	public void createNewParagraph(Map firstMap, Document document, Font fontChineseTableTitle) throws DocumentException {
		// TODO Auto-generated method stub
		 //生成三列表格
        PdfPTable table = new PdfPTable(4);
        //设置表格具体宽度
        table.setTotalWidth(90);
        //设置每一列所占的长度
        table.setWidths(new float[]{30f,30f,30f, 30f});
        table.addCell(new Paragraph("流程名称：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("workflowName"), fontChineseTableTitle));
		table.addCell(new Paragraph("工单主题：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("demandName"), fontChineseTableTitle));
		table.completeRow();
		table.addCell(new Paragraph("流程一级类型：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("firstType"), fontChineseTableTitle));
		table.addCell(new Paragraph("流程二级类型：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("secondType"), fontChineseTableTitle));
		table.completeRow();
		table.addCell(new Paragraph("发起人姓名：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("staff_name"), fontChineseTableTitle));
		table.addCell(new Paragraph("发起人联系电话：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("mob_tel"), fontChineseTableTitle));
		table.completeRow();
		table.addCell(new Paragraph("发起人所属区县局/部门：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("department"), fontChineseTableTitle));
		table.addCell(new Paragraph("打印流水号：", fontChineseTableTitle));
		table.addCell(new Paragraph((String)firstMap.get("waterSeq"), fontChineseTableTitle));
		table.completeRow();
		document.add(table);
		
		PdfPTable table1 = new PdfPTable(1);
		table1.setTotalWidth(90);
        //设置每一列所占的长度
        table1.setWidths(new float[]{90f});
//        table1.addCell(new Paragraph("发起人所属区县局/部门："+(String)firstMap.get("department"), fontChineseTableTitle));
//		table1.completeRow();
		table1.addCell(new Paragraph("工单内容："+(String)firstMap.get("demandDesc"), fontChineseTableTitle));
		table1.completeRow();
		document.add(table1);
        

//		document.add(new Paragraph("流程名称："+(String)firstMap.get("workflowName")+"             工单主题："+(String)firstMap.get("demandName"), fontChineseTableTitle));
//		document.add(new Paragraph("流程一级类型："+(String)firstMap.get("firstType")+"             流程二级类型："+(String)firstMap.get("secondType"), fontChineseTableTitle));
//		document.add(new Paragraph("发起人姓名："+(String)firstMap.get("staff_name")+"             发起人联系电话："+(String)firstMap.get("mob_tel"), fontChineseTableTitle));
//		document.add(new Paragraph("发起人所属区县局/部门："+(String)firstMap.get("department"), fontChineseTableTitle));
//		document.add(new Paragraph("工单内容："+(String)firstMap.get("demandDesc"), fontChineseTableTitle));
		
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



/**
 * 
 * @author YangBin
 * @Date 2013-4-18
 * @Company: Tydic
 * @version 1.0
 * @Description:水印
 */
class PdfWatermark  extends PdfPageEventHelper {

	private String waterCont;// 水印内容

	@SuppressWarnings("unused")
	private PdfWatermark() {

	}

	public PdfWatermark(String waterCont) {
		this.waterCont = waterCont;
	}

	@Override
	public void onEndPage(PdfWriter writer, Document document) {
		// 设定字体 为的是支持中文
		Font FONT = null;
		try {
			BaseFont bfChinese = BaseFont.createFont("STSong-Light",
					"UniGB-UCS2-H", BaseFont.NOT_EMBEDDED);
			FONT = new Font(bfChinese, 30, Font.BOLD, new GrayColor(0.80f));
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}

		for (int i = 0; i < 100; i++) {
			for (int j = 0; j < 10; j++) {
				ColumnText.showTextAligned(writer.getDirectContentUnder(),
						Element.ALIGN_CENTER, new Phrase(this.waterCont, FONT),
						(30.5f + i * 200), (20.0f + j * 250), -45);
			}
		}
	}
}
