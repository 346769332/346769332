package com.tydic.sale.service.crm.service.impl;

import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import net.sf.json.JSONObject;
import org.codehaus.jackson.JsonParseException;
import org.codehaus.jackson.map.JsonMappingException;
import org.codehaus.jackson.map.ObjectMapper;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.CommonMethodService;
import com.tydic.sale.service.util.Const;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

public class CommonMethodServiceImpl implements CommonMethodService {
	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	private String dataSource = "";
	private String nameSpace = "";
	private String sqlName = "";
	/**
	 * 公共入参转换方法
	 * @param json
	 * @return
	 * @throws IOException 
	 * @throws JsonMappingException 
	 * @throws JsonParseException 
	 */
	@SuppressWarnings("unchecked")
	public Map<String,Object> input(String json) {
		ObjectMapper mapper = new ObjectMapper();  
		Map<String, Object> input = new HashMap<String, Object>();
		try {
			input = mapper.readValue(json, Map.class);
		} catch (Exception e) {
 			e.printStackTrace();
		}//转成map 
		return input;
	}
	
	/**
	 * 输出
	 * @param param
	 * @return
	 */
	public String out(Map<String,Object> param){
		String out = JSON.toJSONString(param,SerializerFeature.WriteMapNullValue) ;
		return out.replaceAll(":null", ":\"\"");
	}
	@Override
	public Map<String, Object> addCommonMethod(Map<String, Object> inputParam)
			throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			if(inputParam.containsKey("addIntegralInfoList")){
				this.addExpertScheduling(inputParam);
			}else{
				this.cpcDao.insert(dataSource, nameSpace, sqlName,inputParam);
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "保存成功！");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常" + e.getMessage());
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> delCommonMethod(Map<String, Object> inputParam)
			throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			cpcDao.update(dataSource, nameSpace,sqlName, inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updCommonMethod(Map<String, Object> inputParam)
			throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			cpcDao.update(dataSource, nameSpace,sqlName, inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryCommonMethod(Map<String, Object> inputParam)
			throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			List<Map<String, Object>> list= cpcDao.qryMapListInfos(dataSource, nameSpace, sqlName, inputParam);
			//总行数  
			String sum = (String) this.cpcDao.qryObject(dataSource,nameSpace, sqlName+"Count", inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", list);
			resultMap.put("totalSize",  sum);
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> qryLstCommonMethod(Map<String, Object> inputParam)
			throws Exception {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			List<Map<String, Object>> list= cpcDao.qryMapListInfos(dataSource, nameSpace, sqlName, inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", list);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
	private void addExpertScheduling(Map<String, Object> inputParam) throws Exception{
		ArrayList<Map<String,Object>> addIntegralList=(ArrayList<Map<String, Object>>)this.toList(String.valueOf(inputParam.get("addIntegralInfoList")),  Map.class);
		for(Map<String,Object> addIntegral : addIntegralList){
			inputParam.put("ask_id", addIntegral.get("ask_id"));
			inputParam.put("staff_id", addIntegral.get("staff_id"));
			inputParam.put("staff_name", addIntegral.get("staff_name"));
			inputParam.put("latn_id", addIntegral.get("latn_id"));
			inputParam.put("percentage", addIntegral.get("percentage"));
			inputParam.put("staff_type", addIntegral.get("staff_type"));
			dataSource = inputParam.get("dataSource").toString();
			nameSpace = inputParam.get("nameSpace").toString();
			sqlName = inputParam.get("sqlName").toString();
			this.cpcDao.insert(dataSource, nameSpace, sqlName,inputParam);
		}
	}
	
	private  List toList(String jsonString, Class cla) {
		jsonString=jsonString.replaceAll("\"\"\"\"", "\"\'\'\"");
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}
		return lists;
	}
}
