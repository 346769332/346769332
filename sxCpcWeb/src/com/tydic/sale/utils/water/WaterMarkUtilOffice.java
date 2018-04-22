package com.tydic.sale.utils.water;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import javax.imageio.ImageIO;

import org.apache.poi.EncryptedDocumentException;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.openxml4j.exceptions.InvalidFormatException;
import org.apache.poi.ss.usermodel.ClientAnchor;
import org.apache.poi.ss.usermodel.Drawing;
import org.apache.poi.ss.usermodel.Picture;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;



public final class WaterMarkUtilOffice {   
   
    /**  
     * 打印文字水印图片  
     *   
     * @param pressText  
     *            --文字  
     * @param targetImg --  
     *            目标图片  
     * @param fontName --  
     *            字体名  
     * @param fontStyle --  
     *            字体样式  
     * @param color --  
     *            字体颜色  
     * @param fontSize --  
     *            字体大小  
     * @throws IOException 
     */  
    
     
    public static void excel2003(String pressText,String srcFile,String targetFile,String pngPath) throws IOException, EncryptedDocumentException, InvalidFormatException { 
        File file = new File(srcFile);
        InputStream input = new FileInputStream(file);
        HSSFWorkbook wb = (HSSFWorkbook) WorkbookFactory.create(input);
        HSSFSheet sheet = null;
        int sheetNumbers = wb.getNumberOfSheets();

        BufferedImage bufferImg = null;  
        // sheet
        for (int i = 0; i < sheetNumbers; i++) {
			sheet = wb.getSheetAt(i);
			
			sheet.protectSheet(getPassCode());
			ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();

			int rowNums = sheet.getLastRowNum();
			int colNums = sheet.getRow(0).getPhysicalNumberOfCells();//sheet.getRow(0).getPhysicalNumberOfCells();
			
			File fileImg = new File(pngPath);
			InputStream imageIn = new FileInputStream(fileImg);

			bufferImg = ImageIO.read(imageIn);
			ImageIO.write(bufferImg, "png", byteArrayOut);
			Drawing drawing = sheet.createDrawingPatriarch();
			if (colNums<4) {
				for (int j = 0; j < rowNums; j++) {
					if ((j-8)%11==0) {
						ClientAnchor anchor = drawing.createAnchor(50, 90, 1022,254, 0, j, 200, 200);
						Picture pic = drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG));
						pic.resize();	
					}
					
				}
			}else if (rowNums<6) {
				for (int j = 0; j < colNums; j++) {
					if ((j-4)%8==0) {
						ClientAnchor anchor = drawing.createAnchor(50, 90, 1022,254, j, 2, 200, 200);
						Picture pic = drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG));
						pic.resize();	
					}
				}
			}else {
				for (int j2 = 0; j2 < colNums; j2++) {
					if ((j2-4)%6==0) {
						for (int k = 0; k < rowNums; k++) {
							if ((k-8)%9==0) {
								ClientAnchor anchor = drawing.createAnchor(50, 90, 1022,254, j2, k, 200, 200);
								int picture = wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG);
								
								Picture pic = drawing.createPicture(anchor, picture);
								pic.resize();	
							}
						}
					}
				}
			}
		}
	    OutputStream os = new FileOutputStream(targetFile);  
	    wb.write(os); 
	    os.close();
	    System.out.println("水印完成！！！");
    }
    
    public static void excel2007(String pressText,String srcFile,String targetFile,String pngPath) throws IOException, EncryptedDocumentException, InvalidFormatException { 
        File file = new File(srcFile);
        InputStream input = new FileInputStream(file);
        XSSFWorkbook wb = (XSSFWorkbook) WorkbookFactory.create(input);
        XSSFSheet sheet = null;

        int sheetNumbers = wb.getNumberOfSheets();
        BufferedImage bufferImg = null;  
		for (int i = 0; i < sheetNumbers; i++) {
			sheet = wb.getSheetAt(i);
			sheet.protectSheet(getPassCode());
			ByteArrayOutputStream byteArrayOut = new ByteArrayOutputStream();
			
			int rowNums = sheet.getLastRowNum();
			int colNums = sheet.getRow(0).getPhysicalNumberOfCells();
			
			File fileImg = new File(pngPath);
			InputStream imageIn = new FileInputStream(fileImg);

			bufferImg = ImageIO.read(imageIn);
			ImageIO.write(bufferImg, "png", byteArrayOut);
			Drawing drawing = sheet.createDrawingPatriarch();

			if (colNums<4) {
				for (int j = 0; j < rowNums; j++) {
					if ((j-8)%11==0) {
						ClientAnchor anchor = drawing.createAnchor(50, 90, Short.MAX_VALUE,Integer.MAX_VALUE, 0, j, 200, 200);
						Picture pic = drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG));
						pic.resize();	
					}
					
				}
			}else if (rowNums<12) {
				for (int j = 0; j < colNums; j++) {
					if ((j-4)%8==0) {
						ClientAnchor anchor = drawing.createAnchor(50, 90, Short.MAX_VALUE,Integer.MAX_VALUE, j, 2, 200, 200);
						Picture pic = drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG));
						pic.resize();	
					}
				}
			}else {
				for (int j2 = 0; j2 < colNums; j2++) {
					if ((j2-4)%8==0) {
						for (int k = 0; k < rowNums; k++) {
							if ((k-8)%11==0) {
								
								ClientAnchor anchor = drawing.createAnchor(50, 90, Short.MAX_VALUE,Integer.MAX_VALUE, j2, k, 200, 200);
								Picture pic = drawing.createPicture(anchor, wb.addPicture(byteArrayOut.toByteArray(), Workbook.PICTURE_TYPE_PNG));
								pic.resize();	
							}
						}
					}
				}
			}
			imageIn.close();	
		}
        OutputStream os = new FileOutputStream(targetFile);  
	    wb.write(os);  
	    input.close();
	    os.close();
	    System.out.println("game over !!!");
    }
    
    
    public static String getPassCode() {
		String chars = "gh7o34ma8xzl9stu5cb0kyij6efp1wrn2dvq";
		String passCode = "";
		for (int i = 0; i < 8; i++) {
			int index = (int) (Math.random() * 36);
			passCode += chars.charAt(index);
		}
		return passCode;
	}
   
    public static void main(String[] args) throws IOException, EncryptedDocumentException, InvalidFormatException {   
//    	word("闵行区档案馆","e:\\test\\2.docx","e:\\test\\3.docx");
    	//	excel2003("闵行区档案馆","e:\\test\\456.xls","e:\\test\\456 - 副本.xls");
    	excel2007("闵行区档案馆","D:\\webdata\\webuser\\upLoadFile\\1492\\积分兑换工作量评估.xlsx","D:\\webdata\\webuser\\upLoadFile\\1492\\789.xlsx","D:\\webdata\\webuser\\upLoadFile\\1492\\OnQ8tKsIM5.png");
    }   
}  