package com.tydic.sale.utils;

import java.io.ByteArrayInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.jdom.Document;
import org.jdom.Element;
import org.jdom.input.SAXBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


public class XmlTransformationUtil {
	/**
	 *
	 * @param xmlStr
	 * @param encode 编码方式
	 * @return
	 * 将字符串转换为map对象
	 * joe date:2009-11-02
	 */
	public static Map string2Map(String xmlStr,String encode) {
		if (xmlStr == null) {
			return null;
		}
		//去掉xml头部有空格或者换行
		xmlStr = xmlStr.substring(xmlStr.indexOf("<"));
		SAXBuilder builder = new SAXBuilder(false);
		Document doc = null;
		try {
			//加载xml文档
			doc = builder.build(new ByteArrayInputStream(xmlStr.getBytes(encode)));
		} catch (Exception e) {
			e.printStackTrace();
			return null;
		}
		//获取xml文件的根节点 ESB节点
		Element root = doc.getRootElement();
		return (Map) marshal2Map(root, null, null);
	}
	
	/**
	 * 把JDOM模型解析成map模型 本方法递归调用 为了便于进行递归调用
	 *
	 * @param ele
	 *            Element XML文件中的一个根节点
	 * @param superName
	 *            根节点对应上一级的名称
	 * @param supermap
	 *            根节点对应上一级的map
	 *
	 * @return HashMap
	 * joe date:2009-11-02
	 */
	@SuppressWarnings("unchecked")
	private static Object marshal2Map(Element ele, String superName,
			Map supermap) {
		Map map = new HashMap();

		//获取所有的子节点
		List children = ele.getChildren();

		List slist = new ArrayList();
		for (int i = 0; i < children.size(); i++) {
			Element child = (Element) children.get(i);

			//子节点的名字
			String name = child.getName().trim();
			//获取子节点是否有下级节点
			int childSize = child.getChildren().size();
			if (childSize == 0) {// 无下一级节点,
				//获取节点的值
				String val = child.getText().trim();
				if (slist.size() > 0) {
					//如果有多个节点信息，将节点的map信息保存到list中
					Map temp = new HashMap();
					temp.put(name, val);
					slist.add(temp);
				} else if (map.containsKey(name)) {
					Map temp = new HashMap();
					temp.put(name, val);
					slist.add(map);
					slist.add(temp);
				} else {
					map.put(name, val);
				}
			} else {// 还有一层子节点，从根开始是第3层了，
				// 重名的子节点的情况只有复杂的节点才有，有下一级节点递归调用
				Object childMap = marshal2Map(child, name, map);
				if (childMap instanceof Map) {
					if (map.containsKey(name)) {
						if (supermap.get(superName) instanceof List) {
							List tempList = (List) supermap.get(superName);
							Map temp = new HashMap();
							temp.put(name, childMap);
							tempList.add(temp);
						} else {
							//将list放到map中
							List list = new ArrayList();
							list.add(map);
							Map temp = new HashMap();
							temp.put(name, childMap);
							list.add(temp);
							//supermap.remove(superName);
							supermap.put(superName, list);
						}
					} else {
						map.put(name, childMap);
					}
				} else {
					map.put(name, childMap);
				}
			}
		}
		//当多个相同节点已经转化为List放入父MAP中时候需要将其作为返回对象
		if(supermap!=null){
			Object obj =  supermap.get(superName);
			if(obj!=null && obj instanceof List){
				return obj;
			}
		}

		if (slist.size() != 0) {
			return slist;
		}
		return map;
	}
}
