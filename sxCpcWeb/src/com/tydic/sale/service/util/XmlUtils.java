package com.tydic.sale.service.util;

import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;


import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

/**
 * Xml格式转换
 * @author liuyw
 *
 */
@SuppressWarnings("unchecked")
public class XmlUtils {
	
	private static Logger log = Logger.getLogger(XmlUtils.class);
	
	public static Map xml2Map(String xml){
		Map map = new LinkedHashMap();
		try {
			Document doc = DocumentHelper.parseText(xml);
			Element root = doc.getRootElement();
			for (Iterator iterator = root.elementIterator(); iterator.hasNext();) {  
	            Element e = (Element) iterator.next();   
	            List list = e.elements();  
	            
	            if(map.get(e.getName())  != null){
	            	Object obj = map.get(e.getName());
	            	List objList;
	            	if(!obj.getClass().getName().equals("java.util.LinkedList")){
	            		objList = new LinkedList();
	            		objList.add(obj);	            		
	            		 if(list.size() > 0){  
	            			 objList.add(ele2Map(e));  
	     	            }else  {
	     	            	objList.add(e.getText());
	     	            }            		
	            		            		
	            	}else{
	            		objList = (List)map.get(e.getName());
	            		if(list.size() > 0){  
	            			 objList.add(ele2Map(e));  
	     	            }else  {
	     	            	objList.add(e.getText());
	     	            }
	            	}
	            	map.put(e.getName(),objList);	
	            }else{	            
		            if(list.size() > 0){  
		                map.put(e.getName(), ele2Map(e));  
		            }else{  
		                map.put(e.getName(), e.getText());
		            }
			   }
	        }  
		} catch (Exception e) {
			log.error("xml格式异常", e);
		}
		
		return map;
	}
	
	private static Map ele2Map(Element e){
		Map eleMap = new LinkedHashMap();
		List list = e.elements();  
        if(list.size() > 0){  
            for (int i = 0;i < list.size(); i++) {  
                Element iter = (Element) list.get(i);  
                List mapList = new LinkedList();  
                  
                if(iter.elements().size() > 0){  
                    Map m = ele2Map(iter);  
                    if(eleMap.get(iter.getName()) != null){  
                        Object obj = eleMap.get(iter.getName());  
                        if(!obj.getClass().getName().equals("java.util.LinkedList")){  
                            mapList = new LinkedList();  
                            mapList.add(obj);  
                            mapList.add(m);  
                        }  
                        if(obj.getClass().getName().equals("java.util.LinkedList")){  
                            mapList = (List) obj;  
                            mapList.add(m);  
                        }  
                        eleMap.put(iter.getName(), mapList);  
                    }else  
                    	eleMap.put(iter.getName(), m);  
                }  
                else{  
                    if(eleMap.get(iter.getName()) != null){  
                        Object obj = eleMap.get(iter.getName());  
                        if(!obj.getClass().getName().equals("java.util.LinkedList")){  
                            mapList = new LinkedList();  
                            mapList.add(obj);  
                            mapList.add(iter.getText());  
                        }  
                        if(obj.getClass().getName().equals("java.util.LinkedList")){  
                            mapList = (List) obj;  
                            mapList.add(iter.getText());  
                        }  
                        eleMap.put(iter.getName(), mapList);  
                    }else  
                    	eleMap.put(iter.getName(), iter.getText());  
                }  
            }  
        }else  
        	eleMap.put(e.getName(), e.getText());  
		
		return eleMap;
	}
	
	
	public static void main(String[] args){
		String xml = "<root><returnResult><code>0</code>"+
"<message>成功</message></returnResult>"+
"<test>1</test><test>2</test><test>3</test>"+
"<testinsideo><testInside>1</testInside><testInside>2</testInside><testInside>3</testInside></testinsideo>"+
"<testinsideo1><testInside><tt>1</tt></testInside><testInside><tt>2</tt></testInside><testInside><tt>3</tt></testInside></testinsideo1>"+
"<numberInfo><phoNumId>31407158</phoNumId><phoNum>18987150594</phoNum><numLevName>十级号码</numLevName><numLevMemo></numLevMemo><SelSum>0</SelSum></numberInfo>"+
"<numberInfo><phoNumId>38044406</phoNumId><phoNum>18987681733</phoNum><numLevName>九级号码</numLevName><numLevMemo>"+
"133/153号码预存话费:无 180/189号码预存话费:1800元;月保底消费:50元;在网年限:36个月 </numLevMemo><SelSum>0</SelSum></numberInfo></root>";
		XmlUtils util = new XmlUtils();
		Map map = util.xml2Map(xml);
		System.out.print(map);
	}
	
}
