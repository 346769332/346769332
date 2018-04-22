package com.tydic.sale.service.util;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.dom4j.tree.DefaultCDATA;

import com.tydic.sale.utils.SaleUtil;

/**
 * Map格式转换
 * @author liuyw
 *
 */
public class MapUtils {
	
	public static final String ATTR_KEY = "@ATTR@";
	
	public static final String CDATA_KEY = "@CDATA@";
	
	private static Logger log = Logger.getLogger(MapUtils.class);
	
	public static String map2Xml(Map param,boolean hasVersion){
		
		String resultXml = "";
		
		Document doc = DocumentHelper.createDocument();
		
		try {
			Set paramSet = param.keySet();
			
			String rootName = MapUtils.getMapRootName(param);
			if(SaleUtil.isNull(rootName)){
				throw new Exception("root节点不存在，无法定位到root节点");
			}
			
			//创建root
			Element root = doc.addElement(rootName);
			MapUtils.addAttrs(root, param);
			//递归添加叶子节点
			MapUtils.map2Ele(root,param.get(rootName));
		} catch (Exception e) {
			log.error( e);
		}
		
		if(!hasVersion){
			String[] axml =doc.asXML().split("\n");
			resultXml = axml[1];
		}else{
			resultXml = doc.asXML();
		}
		return resultXml;
	}
	
	/**
	 * 
	 * @param parEle
	 * @param paramObject
	 * @param parentMap
	 */
	private static void map2Ele(Element parEle ,Object paramObject){		
		
		if(paramObject instanceof List){
			List paramSet = (List)paramObject;
			for(int i=0 ; i<paramSet.size() ; i++){
				if(paramSet.get(i) instanceof Map){
					Map subMap = (Map) paramSet.get(i);
					MapUtils.map2Ele(parEle ,subMap);
				}
			}
		}
		else if(paramObject instanceof Map){
			Map paramMap = (Map)paramObject;
			for(Iterator it = paramMap.keySet().iterator(); it.hasNext();){
				String key = String.valueOf(it.next());
				boolean isCDATA = false;
				Element ele = null;
				//如果是属性，不创建Element
				if(key.indexOf(MapUtils.ATTR_KEY)>0){
					continue;
				}
				else if(key.indexOf(MapUtils.CDATA_KEY)>0){
					ele = parEle.addCDATA(key.split(MapUtils.CDATA_KEY)[0]);
					isCDATA = true;
				}
				else{
					ele = parEle.addElement(key);
				}
				if(paramMap.get(key) instanceof Map){
					MapUtils.map2Ele(ele ,(Map)paramMap.get(key));
				}
				else if(paramMap.get(key) instanceof List){
					List subSet = (List)paramMap.get(key);
					for(int i=0 ; i<subSet.size() ; i++){
						if(subSet.get(i) instanceof Map){
							Map subMap = (Map) subSet.get(i);
							MapUtils.map2Ele(ele ,subMap);
						}
					}
				}
				else{
					if(isCDATA){
						ele.add(new DefaultCDATA(paramMap.get(key).toString()));
					}else{
						ele.setText(paramMap.get(key).toString());
					}
				}
			}	
			//添加属性
			MapUtils.addAttrs(parEle.elements(), paramMap);
		}
		else if(MapUtils.isBaseType(paramObject)){
			parEle.setText(paramObject.toString());
		}
		
		
	}
	
	public static String getMapRootName(Map paramMap){
		String rootName = "";
		Set paramSet = paramMap.keySet();
		int i=0;
		for(Iterator it = paramSet.iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			if(key.indexOf(MapUtils.ATTR_KEY)<0){
				if(key.indexOf(MapUtils.CDATA_KEY)>0){
					rootName = key.split(MapUtils.CDATA_KEY)[0];
				}else{
					rootName=key;
				}
				i++;
			}
			if(i>1){
				return "";
			}
		}
		
		return rootName;
	}
	
	/**
	 * 添加属性
	 * @param ele
	 * @param paramMap
	 */
	private static void addAttrs(Object obj ,Map paramMap){
		if(obj instanceof List){
			List<Element> eleSet = (List<Element>) obj;
			for(Element ele : eleSet){
				MapUtils.addAttrs(ele, paramMap);
			}
		}
		else if(obj instanceof Element){
			Element ele = (Element) obj;
			for(Iterator it = paramMap.keySet().iterator(); it.hasNext();){
				String key = String.valueOf(it.next());
				if(key.indexOf(MapUtils.ATTR_KEY)>0){
					String[] keys = key.split(MapUtils.ATTR_KEY);
					if(keys.length == 2 && ele.getName().equals(keys[0]) && MapUtils.isBaseType(paramMap.get(key))){
						ele.addAttribute(keys[1], String.valueOf(paramMap.get(key)));
					}
				}
			}
		}
	}
	
	/**
	 * 是否基本数据类型
	 * @param obj
	 * @return
	 */
	private static boolean isBaseType(Object obj){
		if(obj==null) return true;
		/*String*/
		if(obj instanceof String){
			return true;
		}
		/*Integer*/
		if(obj instanceof Integer){
			return true;
		}
		/*Long*/
		if(obj instanceof Long){
			return true;
		}
		/*Double*/
		if(obj instanceof Double){
			return true;
		}
		
		return false;
	}
	public static String getCrmMethodXml(Map crmParamMap){
    	//获取Crm参数
    	String crmParamXml = MapUtils.map2Xml( crmParamMap,false);
    	
    	//拼装到接口方法块
    	String methodName = MapUtils.getMapRootName(crmParamMap);
    	Map methodMap = new HashMap();
    	methodMap.put(methodName+MapUtils.ATTR_KEY+"xsi:type", "xsd:string");
    	methodMap.put(methodName, crmParamXml);
    	String crmMethodXml = MapUtils.map2Xml( methodMap,false);
    	
    	return crmMethodXml;
    }
	
	public static void main(String[] args){
		
		Map param = new HashMap();
		
		/*List<Map> phoneSet= new ArrayList<Map>();
		for(int i=0 ; i<10 ;i++){
			Map phoneObj = new HashMap();
			Map phoneMap = new HashMap();
			phoneMap.put("phone", "1333333333"+i);
			phoneMap.put("name", "张"+i);
			phoneMap.put("name"+MapUtils.ATTR_KEY+"id", i);
			phoneMap.put("name"+MapUtils.ATTR_KEY+"key", "yyyymmmdd"+i);
			phoneObj.put("phoneObj", phoneMap);
			phoneSet.add(phoneObj);
		}
		
		Map subInfo = new HashMap();
		subInfo.put("address", "昆明市盘龙区XXX地址XX号嘛<><><<<");
		subInfo.put("phoneSet", phoneSet);
		Map packages = new HashMap();
		packages.put("name", "e9-159元档");
		packages.put("fee", "159");
		packages.put("eff_date", "2013-11-21");
		packages.put("eff_date"+MapUtils.ATTR_KEY+"type", "string");
		packages.put("exp_date", "2015-11-22");
		
		Map sub = new HashMap();
		sub.put("age", "32");
		sub.put("name", "张三");
		sub.put("height", "170.3");
		sub.put("packages", packages);
		sub.put("info", subInfo);
		
		param.put("xmlHander", sub);
		param.put("xmlHander"+MapUtils.ATTR_KEY+"xsi:type", "xsd:string");*/
		//param.put("xmlHander2", sub);
		
		Map subParamMap = new HashMap();
		subParamMap.put("accNbr", "A02719584");
		subParamMap.put("accNbrType", 1);
		subParamMap.put("areaCode", "0871");
		subParamMap.put("channelId", "10012");
		subParamMap.put("staffCode", "-10012");
		subParamMap.put("queryType", "1");
		subParamMap.put("queryMode", "1");
		
		Map crmParamMap = new HashMap();
		crmParamMap.put("queryConditionInfo", subParamMap);
		
		String ss = MapUtils.map2Xml(crmParamMap,false);
		
		param.put("queryConditionInfo", ss);
		param.put("queryConditionInfo"+MapUtils.ATTR_KEY+"xsi:type", "xsd:string");
		
		System.out.println(MapUtils.map2Xml(param,false));
	}
}
