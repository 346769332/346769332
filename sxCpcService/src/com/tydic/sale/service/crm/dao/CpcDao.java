package com.tydic.sale.service.crm.dao;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

import com.tydic.sale.service.crm.po.PolicyManualInfoBean;

public interface CpcDao  {
	
 	public Map<String, Object> qryMapInfo(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception ;
 	public Map<String, Object> qryMapInfo(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception ;

 	public List<Map<String, Object>> qryMapListInfos(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
 	public List<Map<String, Object>> qryMapListInfos(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
 	
 	
	public Object qryObject(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	public Object qryObject(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	
	public List<String> getResultHeadSet(String sql) throws SQLException;

	public void delete(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	public void delete(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	
	public int update(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	public int update(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
	
	public void insert(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception ;
	public void insert(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception ;
	public int insert(String nameSpace, String sqlMapId, Map<String, Object> parMap,int type) throws Exception ;
	//批量修改
	public void batchUpdate(final String nameSpace, final String sqlMapId,List<Map<String, Object>> batchSet);
	//批量新增
	public void batchInsert(final String nameSpace, final String sqlMapId,List<Map<String, Object>> batchSet);

	//批量处理
	public void batchOperationTable(final String operationType,final String nameSpace, final String sqlMapId,final Map<String, Object> parMap)throws Exception;
	
	

 	public List<PolicyManualInfoBean> queryPolicyManualInfoList(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception;
}
