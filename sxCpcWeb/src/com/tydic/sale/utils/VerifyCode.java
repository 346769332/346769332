/*
 * Created on 2006-12-12
 */
package com.tydic.sale.utils;

import java.awt.Color;
import java.awt.Font;
import java.awt.Graphics;
import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Random;

import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.tydic.sale.service.util.Const;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.wss.util.RandomUtil;


/**
 * 生成随机验证码
 * 
 * @author leo
 */
public final class VerifyCode extends AbstractServlet {

	private static final long serialVersionUID = -709374314175660572L;

	/** 最大随机数 */
	private static final int MAX_NUM = 9999;

	/** 最小随机数 */
	private static final int MIN_NUM = 1000;

	/**图片宽度*/
	private static final int WIDTH = 48;

	/**图片高度*/
	private static final int HEIGHT = 20;

	public void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		response.setHeader("Pragma", "No-cache");
		response.setHeader("Cache-Control", "no-cache");
		response.setDateHeader("Expires", 0);
		response.setContentType("text/html;charset=UTF-8");  

		BufferedImage image = new BufferedImage(WIDTH, HEIGHT,
				BufferedImage.TYPE_INT_RGB);
		Graphics g = image.getGraphics();
		g.fillRect(0, 0, WIDTH, HEIGHT);// 矩形
		g.setFont(new Font("Times New Roman", Font.PLAIN, 18));// 字体

		g.setColor(new Color(RandomUtil.getRandomRangeNum(56, 87), RandomUtil
				.getRandomRangeNum(67, 161), RandomUtil.getRandomRangeNum(170, 215)));// 颜色
//		g.setColor(getRandColor(200, 250));
		// 生成干扰线
		for (int i = 0; i < 2; i++) {
			// int x1 = getRandom(0,width-60);
			int y1 = RandomUtil.getRandomRangeNum(i, HEIGHT - 1);
			// int x2 = getRandom(width-5,width);
			int y2 = RandomUtil.getRandomRangeNum(i, HEIGHT - 2);
			g.drawLine(3, y1, WIDTH - 5, y2);
		}

		String sRand = String.valueOf(RandomUtil.getRandomRangeNum(MIN_NUM, MAX_NUM));
		g.setColor(new Color(RandomUtil.getRandomRangeNum(13, 158), RandomUtil
				.getRandomRangeNum(2, 129), RandomUtil.getRandomRangeNum(20, 53)));
		g.drawString(sRand, 4, HEIGHT - 4);
		request.getSession(true).setAttribute(Const.RANDNUM_KEY, sRand);
		g.dispose();
		//response.reset();
		ImageIO.write(image, "JPEG", response.getOutputStream());

	};
	
	/*
	 * 给定范围获得随机颜色
	 */
	private Color getRandColor(int fc, int bc) {
		Random random = new Random();
		if (fc > 255)
			fc = 255;
		if (bc > 255)
			bc = 255;
		int r = fc + random.nextInt(bc - fc);
		int g = fc + random.nextInt(bc - fc);
		int b = fc + random.nextInt(bc - fc);
		return new Color(r, g, b);
	}

}