package com.tydic.sale.utils;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
	
	/**
	 * 遍历 
	 * */
	public static List getList(List<Map> list, String parentId){
		List list1 = new ArrayList();
		for(Map map : list){
			Map region = new HashMap();
			String id = String.valueOf(map.get("org_id"));
			String pid = String.valueOf(map.get("pid"));
			if("null".equals(pid)){
				map.put("pid", "");
				pid = "" ;
			}
			if(parentId.equals(pid)){
				List sub_region = getList(list,id);
				map.put("childNode", sub_region);
				list1.add(map);
			}
		}
		
		showList(list1,parentId);
		return list1 ;
	}
	
	private static List  showList(List<Map> list,String parentId){
		List result = new ArrayList();
		for(Map map : list){
			String id = String.valueOf(map.get("org_id"));
			String pid = String.valueOf(map.get("pid"));
			if(pid.equals(parentId)){
				List childNode = (List)map.get("childNode");
 				if(childNode.size() > 0){
					showList(list,id);
				} 
 				result.add(map);
			}
		}
		list = result ;
		return list ;
	}
	
	 public static void main(String[] args) {
		List list = new ArrayList();
		Map temp1 =new HashMap();
		temp1.put("id","123");
		temp1.put("pid",null);
		Map temp2 =new HashMap();
		temp2.put("id","124");
		temp2.put("pid","");
		Map temp3 =new HashMap();
		temp3.put("id","125");
		temp3.put("pid","123");
		Map temp4 =new HashMap();
		temp4.put("id","126");
		temp4.put("pid","124");
		Map temp5 =new HashMap();
		temp5.put("id","127");
		temp5.put("pid","126");
		Map temp6 =new HashMap();
		temp6.put("id","128");
		temp6.put("pid","123");
		list.add(temp1);
		list.add(temp2);
		list.add(temp3);
		list.add(temp4);
		list.add(temp5);
		list.add(temp6);
		System.out.println("null".equals(String.valueOf(temp1.get("pid"))));
//		List result = CommonUtil.getList(list,"124");
//		System.out.println(result.toString());
//		System.out.println(result.size());
	}
}
