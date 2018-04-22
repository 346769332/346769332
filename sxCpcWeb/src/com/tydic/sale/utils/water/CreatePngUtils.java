package com.tydic.sale.utils.water;

import java.awt.BasicStroke;
import java.awt.Color;
import java.awt.Font;
import java.awt.FontMetrics;
import java.awt.Graphics;
import java.awt.Graphics2D;
import java.awt.Rectangle;
import java.awt.Transparency;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.IOException;

import javax.imageio.ImageIO;

public class CreatePngUtils {
	 public static void main(String[] args) throws Exception {  
	       
	        createImage("D9161 王小花","e:/a2.png");  
	    }  
	    public static void createImage(String message,  String filePath) throws Exception {
	    	int width = 400;
			int height = 300;
			// 创建BufferedImage对象
			BufferedImage image = new BufferedImage(width, height,     BufferedImage.TYPE_INT_RGB);
			// 获取Graphics2D
			Graphics2D g2d = image.createGraphics();

			// ----------  增加下面的代码使得背景透明  -----------------
			image = g2d.getDeviceConfiguration().createCompatibleImage(width, height, Transparency.TRANSLUCENT);
			g2d.dispose();
			g2d = image.createGraphics();
			// ----------  背景透明代码结束  -----------------
			// 画图
			g2d.setColor(new Color(75,203,251));
			g2d.setStroke(new BasicStroke(1)); 
			Font font2=new Font("SansSerif",Font.ITALIC,30);
		//   平移原点到图形环境的中心
	        g2d.translate(width/4,height/1.5);
	        //   旋转文本
	            g2d.rotate(270 * Math.PI / 150);
	            g2d.setFont(font2);
	            g2d.drawString(message, 0, 0);
			//释放对象
			g2d.dispose();
			// 保存文件    
			try {
				ImageIO.write(image, "png", new File(filePath));
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
	    }

}
