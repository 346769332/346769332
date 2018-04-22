package com.tydic.sale.utils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.commons.lang.RandomStringUtils;

public class CommonUtil {

	public static String[] generateFileName(String... filePaths){
		return randomNumFormat(filePaths);
	}

	private static String[] randomNumFormat(String[] filePaths) {
		String[] replacedFilePaths = new String[filePaths.length]; 
		for (int i = 0; filePaths != null && i < filePaths.length; i++) {
			//当前时间
			Date dt = new Date(System.currentTimeMillis());
			SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmssSSS");
			String timestamp = sdf.format(dt);
			//4位随机数
			String randomNum = RandomStringUtils.randomNumeric(4);
			//文件扩展名
			int fileNameIndex = filePaths[0].lastIndexOf(File.separator)+1;
			int extIndex = filePaths[0].lastIndexOf(".");
			String oldFileName = filePaths[0].substring(fileNameIndex);
			String extName = filePaths[0].substring(extIndex);
			String newFilename = timestamp+randomNum+extName;
			String replacedFilePath = filePaths[0].replace(oldFileName, newFilename);
			replacedFilePaths[i]=replacedFilePath;
		}
		return replacedFilePaths;
	}
	
	public static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}
		return lists;
	}
}
