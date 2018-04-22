package com.tydic.sale.utils;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Map.Entry;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.io.SAXReader;

/**
 * xml处理工具，依赖dom4j组件
 */
public class XMLUtil {
	private final static Logger log = LoggerFactory.getLogger(XMLUtil.class);
	
	public static String getValue(String xml, String name) {
		String responseXML = "";
		String xmlRes = "<ESB>.*?<" + name + (">(.*?)</" + name + ">");
		Pattern pattern = Pattern.compile(xmlRes, Pattern.DOTALL);
		Matcher matcher = pattern.matcher(xml);
		if (matcher.find()) {
			responseXML = matcher.group(1).trim();
		}
		// System.out.println("responseXML:" + responseXML);
		return responseXML;
	}
	
	public static String getValueByRootName(String rootName, String xml, String name) {
		String responseXML = "";
		String xmlRes = "<" + rootName + ">.*?<" + name + (">(.*?)</" + name + ">");
		Pattern pattern = Pattern.compile(xmlRes, Pattern.DOTALL);
		Matcher matcher = pattern.matcher(xml);
		if (matcher.find()) {
			responseXML = matcher.group(1).trim();
		}
		// System.out.println("responseXML:" + responseXML);
		return responseXML;
	}
	
	  /**
     * 在类路径中对没有使用了DTD的XML进行加载
     *
     * @param classpath -
     *                  类路径
     */
    public static Document getDocumentWithClassPath(String classpath) {
        SAXReader reader = new SAXReader();
        Document doc = null;
        try {
            doc = reader.read(XMLUtil.class.getClassLoader()
                    .getResourceAsStream(classpath));
        } catch (DocumentException e) {
            log.error(e.getMessage());
        }

        return doc;
    }

    /**
     * 在文件路径中对使用了DTD的XML进行加载
     *
     * @param filepath -
     *                 文件路径
     */
    public static Document getDocumentWithFilePath(String filepath) {
        SAXReader reader = new SAXReader();
        Document doc = null;
        try {
            doc = reader.read(new FileInputStream(filepath));
        } catch (DocumentException e) {
            log.error(e.getMessage());
        } catch (FileNotFoundException e) {
            log.error(e.getMessage());
        }

        return doc;
    }

    /**
     * 在文件路径中对使用了DTD的XML进行加载
     *
     * @param  -
     *                 文件路径
     */
    public static Document getDocumentWithString(String xmlStr) {
        if (xmlStr == null) {
            return null;
        }

        Document document = null;
        try {
            document = DocumentHelper.parseText(xmlStr);
        } catch (Exception e) {
            log.error("getDocumentWithString----xmlStr convert error", e);
            return null;
        }
        return document;
    }

    @SuppressWarnings("unchecked")
    public static Map<String, Object> dom2Map(Document doc) {
        Map<String, Object> map = new HashMap<String, Object>();
        if (doc == null)
            return map;
        Element root = doc.getRootElement();
        for (Iterator iterator = root.elementIterator(); iterator.hasNext(); ) {
            Element e = (Element) iterator.next();
            List list = e.elements();
            if (list.size() > 0) {
                map.put(e.getName(), dom2Map(e));
            } else
                map.put(e.getName(), e.getText());
        }
        return map;
    }

    @SuppressWarnings("unchecked")
    public static Map dom2Map(Element e) {
        Map map = new HashMap();
        List list = e.elements();
        if (list.size() > 0) {
            for (int i = 0; i < list.size(); i++) {
                Element iter = (Element) list.get(i);
                List mapList = new ArrayList();

                if (iter.elements().size() > 0) {
                    Map m = dom2Map(iter);
                    if (map.get(iter.getName()) != null) {
                        Object obj = map.get(iter.getName());
                        if (!obj.getClass().getName().equals(
                                "java.util.ArrayList")) {
                            mapList = new ArrayList();
                            mapList.add(obj);
                            mapList.add(m);
                        }
                        if (obj.getClass().getName().equals(
                                "java.util.ArrayList")) {
                            mapList = (List) obj;
                            mapList.add(m);
                        }
                        map.put(iter.getName(), mapList);
                    } else
                        map.put(iter.getName(), m);
                } else {
                    if (map.get(iter.getName()) != null) {
                        Object obj = map.get(iter.getName());
                        if (!obj.getClass().getName().equals(
                                "java.util.ArrayList")) {
                            mapList = new ArrayList();
                            mapList.add(obj);
                            mapList.add(iter.getText());
                        }
                        if (obj.getClass().getName().equals(
                                "java.util.ArrayList")) {
                            mapList = (List) obj;
                            mapList.add(iter.getText());
                        }
                        map.put(iter.getName(), mapList);
                    } else
                        map.put(iter.getName(), iter.getText());
                }
            }
        } else
            map.put(e.getName(), e.getText());
        return map;
    }

    // 请求包中的行缩进
    // private static final String TAB = "\t";

    // XML格式符号
    private static final String XML_START_LEFT = "<";
    private static final String XML_RIGHT = ">";
    private static final String XML_END_LEFT = "</";
    private static final int XML_INIT_LENGTH = 1000;

    /**
     * 根据hashmap的模型转化为内容字符串
     *
     * @param map  HashMap 输入的Map
     * @param tabs String XML文件缩进空格
     * @return String 返回的XML片段
     * @throws Exception 如果HashMap中无对应类型抛出异常
     */
    @SuppressWarnings("unchecked")
    public static String getStringOfMap(Map map, String tabs) {
        StringBuilder sb = new StringBuilder(XML_INIT_LENGTH);
        Iterator keys = map.keySet().iterator();
        while (keys.hasNext()) {
            Object key = keys.next();
            Object val = map.get(key);
            if (val == null || val.equals("")) {// 没有值
                //	     sb.append(tabs);
                //	     sb.append(XML_START_LEFT + key + XML_RIGHT);
                //	     // sb.append("");
                //	     sb.append(XML_END_LEFT + key + XML_RIGHT);
            } else {// 有值
                if (val instanceof String) { // 包含int
                    sb.append(tabs);
                    sb.append(XML_START_LEFT + key + XML_RIGHT);
                    sb.append(val);
                    sb.append(XML_END_LEFT + key + XML_RIGHT);
                } else if (val instanceof HashMap) { // 如果还有子节点，则递归调用
                    sb.append(tabs);
                    sb.append(XML_START_LEFT + key + XML_RIGHT);
                    sb.append(Constants.LINE_SEP);
                    sb.append(getStringOfMap((HashMap) val, tabs
                            + Constants.TAB));
                    sb.append(tabs);
                    sb.append(XML_END_LEFT + key + XML_RIGHT);
                } else if (val instanceof HashMap[]) { // 如果还有并列的子节点数组，则递归调用
                    HashMap[] maps = (HashMap[]) val;
                    for (int i = 0; i < maps.length; i++) {// 每个map一个节点
                        sb.append(tabs);
                        sb.append(XML_START_LEFT + key + XML_RIGHT);
                        sb.append(Constants.LINE_SEP);
                        sb
                                .append(getStringOfMap(maps[i], tabs
                                        + Constants.TAB));
                        sb.append(tabs);
                        sb.append(XML_END_LEFT + key + XML_RIGHT);
                        sb.append(Constants.LINE_SEP);
                    }
                } else if (val instanceof List) { // 如果有List节点
                    List<Map> temp = (List) val;
                    sb.append(tabs);
                    sb.append(XML_START_LEFT + key + XML_RIGHT);
                    sb.append(Constants.LINE_SEP);
                    for (int i = 0; i < temp.size(); i++) {// 每个map一个节点
                        sb.append(getStringOfMap(temp.get(i), ""));
                    }
                    sb.append(XML_END_LEFT + key + XML_RIGHT);
                } else {
                    return null;
                }
            }
            sb.append(Constants.LINE_SEP);
        }
        return sb.toString();
    }

    @SuppressWarnings("unchecked")
    public static void main(String[] args) {
//        Map outer = new HashMap();
//        Map payInfoitem = new HashMap();
//        Map payInfo = new HashMap();
//        List payInfoList = new ArrayList();
//        outer.put("payInfoPak", payInfoList);
//        payInfo.put("payInfo", payInfoitem);
//        payInfoitem.put("test", "test");
//        payInfoList.add(payInfo);
//        
//        String xml = getStringOfMap(outer, "");
//        System.out.println(outer.toString());
//        System.out.println(xml);
        
        Map map = new HashMap();
        map.put("saleOrderId","10568");
        map.put("areaCode", "550");
        
        String xml2 = XMLUtil.getStringOfMap(map, "");
        
        System.out.println("<ESB>"+xml2+"</ESB>");
    }


    /**
	 * 
	 * @Title: listMapToXML
	 * @param @param list
	 * @param @param entityName
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String mapToXML(Map<String, Object> map) {
		if(map==null){
//			throw new SysLevelException("将MAP转换为XML出错！map=null");
			map = new HashMap<String, Object>();
		}
		StringBuffer xml = new StringBuffer();
        //xml.append("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n");
        Object rootName = map.get("ROOT_NAME");
        if(rootName==null){
        	rootName = "LIST";
        }
//        if(map.get("RESPONSE_CODE")==null){
//        	map.put("RESPONSE_CODE", ErrorEnum.DEFAULT_SUCCESS.getCode());
//        }
        xml.append(parseMapToXML(map,rootName.toString()));
        System.out.println(xml.toString());
        return xml.toString();
    }
	
	/**
	 * 
	 * @Title: parseListMapToXML
	 * @param @param list
	 * @param @param entityName
	 * @param @return
	 * @return String
	 * @throws
	 */
	public static String parseListMapToXML(List list,String entityName) {
		StringBuffer xml = new StringBuffer();
		xml.append("<"+entityName+" type=\"list\">\n");
        for (Object obj :list) {
        	String centityName = entityName.substring(0, entityName.length()-1);
        	if(obj instanceof String || obj instanceof Timestamp|| obj instanceof Integer|| obj instanceof BigDecimal){
        		
            }else if(obj instanceof Map){
            	 xml.append(parseMapToXML((Map<String, Object>) obj,centityName));
            }else if(obj instanceof List){
            	 xml.append(parseListMapToXML((List<Object>) obj,centityName));
            }
        }
        xml.append("</"+entityName+">\n");
        return xml.toString();
    }
	
	/**
	 * 
	 * @Title: parseMapToXML
	 * @param @param map
	 * @param @param entityName
	 * @param @return
	 * @return String
	 * @throws
	 */
	@SuppressWarnings("unchecked")
	private static String parseMapToXML(Map<String, Object> map,String entityName) {
		StringBuffer xml = new StringBuffer();
        Set<Map.Entry<String, Object>> set = map.entrySet();
        //所有Map
        Map maps = new HashMap();
        //所有List
        Map list = new HashMap();
        xml.append("<"+entityName+" type=\"map\">\n");
        for (Iterator<Map.Entry<String, Object>> it = set.iterator(); it.hasNext();) {
            Map.Entry<String, Object> entry = (Map.Entry<String, Object>) it.next();
//            if(entry.getKey().equals("LICENSE_KEY")){
//            	 xml.append("<LICENSE_KEY value=\""+entry.getValue()+"\"/>\n");
//            }else if(entry.getKey().equals("RESPONSE_CODE")){
//            	 xml.append("<RESPONSE_CODE value=\""+entry.getValue()+"\"/>\n");
//            }else 
            	if(entry.getValue() instanceof String || entry.getValue() instanceof Timestamp|| entry.getValue() instanceof Integer|| entry.getValue() instanceof BigDecimal){
            	 xml.append("<"+entry.getKey()+" value=\""+entry.getValue()+"\"/>\n");
            }else if(entry.getValue()==null){
            	 xml.append("<"+entry.getKey()+" value=\"\"/>\n");
            }else if(entry.getValue() instanceof List){
            	List listValue = (List) entry.getValue();
            	list.put(entry.getKey(),listValue);
            }else if(entry.getValue() instanceof Map){
            	maps.put(entry.getKey(), (Map<String, Object>) entry.getValue());
            }else{
            	System.out.println(entry.getKey()+"------------------"+entry.getValue());
            }
        }
        Set<Entry<String, Map<String, Object>>> set1 = maps.entrySet();
        for (Iterator<Entry<String, Map<String, Object>>> it = set1.iterator(); it.hasNext();) {
        	Map.Entry<String, Map<String, Object>> entry = (Map.Entry<String, Map<String, Object>>) it.next();
        	xml.append(parseMapToXML(entry.getValue(),entry.getKey()));
        }
        Set<Entry<String, List<Map<String, Object>>>> set2 = list.entrySet();
        for (Iterator<Entry<String, List<Map<String, Object>>>> it = set2.iterator(); it.hasNext();) {
            Map.Entry<String, List<Map<String, Object>>> entry = (Map.Entry<String, List<Map<String, Object>>>) it.next();
            List listValue = (List) entry.getValue();
            listValue.add(0,entry.getKey());
            
            Map<String, Object> lm = new HashMap<String, Object>(); 
            lm.put(entry.getKey(),entry.getValue());
        	xml.append(parseListMapToXML(entry.getValue(),entry.getKey()));
        }
        xml.append("</"+entityName+">\n");
        return xml.toString();
    }
}
