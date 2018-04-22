package com.tydic.sale.utils.water;

import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;

import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfContentByte;
import com.itextpdf.text.pdf.PdfGState;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;

public class WaterMarkUtilPDF {

	public static void main(String[] args) throws Exception {
		PdfReader pdfReader = new PdfReader("D:/webdata/webuser/upLoadFile/1488/CRM.pdf");

		Field f = PdfReader.class.getDeclaredField("ownerPasswordUsed");
		f.setAccessible(true);
		f.set(pdfReader, Boolean.TRUE);
		PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileOutputStream("D:/webdata/webuser/upLoadFile/1479/147.pdf"));
		addWatermark(pdfStamper, "陕西电信集团公司");
		pdfStamper.close();
	}

	public static void addWatermark(PdfStamper pdfStamper, String waterMarkName)
			throws NoSuchFieldException, SecurityException,
			IllegalArgumentException, IllegalAccessException {
		PdfContentByte content = null;
		BaseFont base = null;
		Rectangle pageRect = null;
		PdfGState gs = new PdfGState();
		try {
			// 设置字体
			base = BaseFont.createFont("STSong-Light", "UniGB-UCS2-H",
					BaseFont.EMBEDDED);
		} catch (DocumentException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		try {
			if (base == null || pdfStamper == null) {
				return;
			}
			// 设置透明度为0.4
			gs.setFillOpacity(0.4f);
			gs.setStrokeOpacity(0.4f);
			int toPage = pdfStamper.getReader().getNumberOfPages();
			for (int i = 1; i <= toPage; i++) {
				pageRect = pdfStamper.getReader().getPageSizeWithRotation(i);
				// 计算水印X,Y坐标
				float x = pageRect.getWidth() / 2;
				float y = pageRect.getHeight() / 2;
				// 获得PDF最顶层
				content = pdfStamper.getOverContent(i);
				content.saveState();
				// set Transparency
				content.setGState(gs);
				content.beginText();
				// content.setColorFill(BaseColor.GRAY);
				content.setFontAndSize(base, 50);
				// 水印文字成45度角倾斜
				content.showTextAligned(Element.ALIGN_CENTER, waterMarkName, x,
						y, 330);
				content.endText();
			}
		} catch (Exception ex) {
			ex.printStackTrace();
		}

		finally {
			content = null;
			base = null;
			pageRect = null;
		}
	}

}