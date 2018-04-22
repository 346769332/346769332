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
public class LeadCreatePDF  extends PdfPageEventHelper {
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
	private LeadCreatePDF() {}

	private LeadCreatePDF(List contList,Map contTitle) {
		this.contList = contList;
		this.contTitle = contTitle;
	}
	
	public LeadCreatePDF(List contList,Map contTitle,float [] colWidth) {
		this.contList = contList;
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
		Paragraph t = new Paragraph(pdfTitle, FontChineseTitle);
		t.setAlignment(1); 
		document.add(t);
		document.add(new Paragraph("\n"));
		Map tempMap;
		Map tempMaps;
		String tempStr="";
		String tempStr1="";
		String tempStr2="";
		String tempStr3="";
		PdfPTable table = new PdfPTable(colWidth);

		table.addCell(new Paragraph("日期", FontChineseCont));
		table.addCell(new Paragraph("时段", FontChineseCont));
		table.addCell(new Paragraph("具体内容", FontChineseCont));
		table.addCell(new Paragraph("备注", FontChineseCont));
		for(int i =0;i<contList.size();i++){
			tempMap=(Map)contList.get(i);
            System.out.println(tempMap.get("STROKETIME"));
			PdfPCell pdfCell = null; //表格的单元格
			if(i==0){
				tempMaps=(Map)contList.get(i+1);
				tempStr = (String) tempMap.get("STROKETIME");
				pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
				pdfCell.setRowspan(2);
		        table.addCell(pdfCell);
			}else{
				tempMaps=(Map)contList.get(i-1);
				String  str1 = (String) tempMap.get("STROKETIME");
				String  str2 = (String) tempMaps.get("STROKETIME");
				System.out.println("上一天"+tempMaps.get("STROKETIME"));
				System.out.println("dangq天"+tempMap.get("STROKETIME"));
				if(!str1.equals(str2)){
					tempStr = (String) tempMap.get("STROKETIME");
					pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr,FontChineseCont)));
					pdfCell.setRowspan(2);
			        table.addCell(pdfCell);	
				}
			}
			tempStr1= (String) tempMap.get("PERIODTIME");
			tempStr2= (String) tempMap.get("STROKEINFO");
			tempStr3= (String) tempMap.get("REMARKINFO");
			pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr1,FontChineseCont)));
	        table.addCell(pdfCell);
	        pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr2,FontChineseCont)));
	        table.addCell(pdfCell);
	        pdfCell = new PdfPCell(new PdfPCell(new Paragraph(tempStr3,FontChineseCont)));
	        table.addCell(pdfCell);
//	        Paragraph paragraph = new Paragraph(, FontChineseCont);
//	        pdfCell.setPhrase(paragraph);	        table.addCell(pdfCell);
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
