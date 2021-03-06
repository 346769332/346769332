package com.tydic.sale.service.crm.dao.impl;

import java.sql.Connection;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.springframework.orm.ibatis.SqlMapClientCallback;
import org.springframework.orm.ibatis.SqlMapClientTemplate;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.ibatis.sqlmap.client.SqlMapExecutor;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.po.PolicyManualInfoBean;
import com.tydic.sale.service.util.Tools;

public class CpcDaoImpl extends SqlMapClientDaoSupport implements CpcDao {

	private SqlMapClientTemplate sqlMapClientTemplateCPi;
	private SqlMapClientTemplate sqlMapClientTemplateOra;
	
	public SqlMapClientTemplate getSqlMapClientTemplateOra() {
		return sqlMapClientTemplateOra;
	}

	public void setSqlMapClientTemplateOra(
			SqlMapClientTemplate sqlMapClientTemplateOra) {
		this.sqlMapClientTemplateOra = sqlMapClientTemplateOra;
	}

	public SqlMapClientTemplate getSqlMapClientTemplateCPi() {
		return sqlMapClientTemplateCPi;
	}

	public void setSqlMapClientTemplateCPi(
			SqlMapClientTemplate sqlMapClientTemplateCPi) {
		this.sqlMapClientTemplateCPi = sqlMapClientTemplateCPi;
	}
	@SuppressWarnings("unchecked")
	public Map<String, Object> qryMapInfo(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		return (Map<String, Object>) getSqlMapClientTemplate().queryForObject(nameSpace + "." + sqlMapId, parMap);
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> qryMapInfo(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			return (Map<String, Object>) getSqlMapClientTemplateCPi().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			return (Map<String, Object>) getSqlMapClientTemplateOra().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}else{
			return (Map<String, Object>) getSqlMapClientTemplate().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}
	}
	
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> qryMapListInfos(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		return getSqlMapClientTemplate().queryForList(nameSpace + "." + sqlMapId, parMap);
	}
	@SuppressWarnings("unchecked")
	public List<Map<String, Object>> qryMapListInfos(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			return getSqlMapClientTemplateCPi().queryForList(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			return getSqlMapClientTemplateOra().queryForList(nameSpace + "." + sqlMapId, parMap);
		}else{
			return getSqlMapClientTemplate().queryForList(nameSpace + "." + sqlMapId, parMap);
		}
	}
	

	public Object qryObject(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		return getSqlMapClientTemplate().queryForObject(nameSpace + "." + sqlMapId, parMap);
	}
	public Object qryObject(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			return getSqlMapClientTemplateCPi().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			return getSqlMapClientTemplateOra().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}else{
			return getSqlMapClientTemplate().queryForObject(nameSpace + "." + sqlMapId, parMap);
		}
	}
	

	public void delete(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		getSqlMapClientTemplate().delete(nameSpace + "." + sqlMapId, parMap);
	}
	public void delete(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			getSqlMapClientTemplateCPi().delete(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			getSqlMapClientTemplateOra().delete(nameSpace + "." + sqlMapId, parMap);
		}else{
			getSqlMapClientTemplate().delete(nameSpace + "." + sqlMapId, parMap);
		}
	}

	public int update(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		return getSqlMapClientTemplate().update(nameSpace + "." + sqlMapId, parMap);	
  	}
	
	public int update(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception{
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			return 	getSqlMapClientTemplateCPi().update(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			return getSqlMapClientTemplateOra().update(nameSpace + "." + sqlMapId, parMap);
		}else{
			return getSqlMapClientTemplate().update(nameSpace + "." + sqlMapId, parMap);	
		}
  	}
	
	public void insert(String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception {
		getSqlMapClientTemplate().insert(nameSpace + "." + sqlMapId, parMap);		
	}
	//增加一个可以返回主键的insert方法
	public int insert(String nameSpace, String sqlMapId, Map<String, Object> parMap,int type)throws Exception {
		return (Integer) getSqlMapClientTemplate().insert(nameSpace + "." + sqlMapId, parMap);		
	}
	public void insert(String dataSource,String nameSpace, String sqlMapId, Map<String, Object> parMap) throws Exception {
		if(!Tools.isNull(dataSource) && "cpi".equals(dataSource)){
			 getSqlMapClientTemplateCPi().insert(nameSpace + "." + sqlMapId, parMap);
		}else if(!Tools.isNull(dataSource) && "ora".equals(dataSource)){//链接oracle数据库
			getSqlMapClientTemplateOra().insert(nameSpace + "." + sqlMapId, parMap);
		}else{
			 getSqlMapClientTemplate().insert(nameSpace + "." + sqlMapId, parMap);	
		}
	}
	
public void batchInsert(final String nameSpace, final String sqlMapId,List<Map<String, Object>> batchSet){
		
		SqlMapClient sqlClient = getSqlMapClientTemplate().getSqlMapClient();
		try {
			sqlClient.startBatch();
			for(Map<String, Object> batch : batchSet){
				sqlClient.insert(nameSpace+"."+sqlMapId,batch);
			}
			sqlClient.executeBatch();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			sqlClient.flushDataCache();
		}
		
	}
	
	public void batchUpdate(final String nameSpace, final String sqlMapId,List<Map<String, Object>> batchSet){
		
		SqlMapClient sqlClient = getSqlMapClientTemplate().getSqlMapClient();
		try {
			sqlClient.startBatch();
			for(Map<String, Object> batch : batchSet){
				sqlClient.update(nameSpace+"."+sqlMapId,batch);
			}
			sqlClient.executeBatch();
		} catch (SQLException e) {
			e.printStackTrace();
		}finally{
			sqlClient.flushDataCache();
		}
		
	}
	
	public void batchOperationTable(final String operationType,final String nameSpace, final String sqlMapId,final Map<String, Object> parMap)throws Exception{
		getSqlMapClientTemplate().execute(new SqlMapClientCallback() {
			public Object doInSqlMapClient(SqlMapExecutor executor) throws SQLException {
				getSqlMapClientTemplate().getSqlMapClient().startTransaction();
				try {
					executor.startBatch();
					List<Map<String, Object>> batchList = (List<Map<String, Object>>) parMap.get("List");
					if(batchList != null && batchList.size()>0){
						if("insert".equals(operationType)){
							for(Map<String, Object> m :batchList){
								executor.insert(nameSpace+"."+sqlMapId,m);
							}
						}else if("update".equals(operationType)){
							for(Map<String, Object> m :batchList){
								executor.update(nameSpace+"."+sqlMapId,m);
							}
						}
					}
					executor.executeBatch();
					getSqlMapClientTemplate().getSqlMapClient().commitTransaction();
				} catch (Exception e) {
					e.printStackTrace();
				}finally{
					getSqlMapClientTemplate().getSqlMapClient().endTransaction();
				}
				
				return null;
			}
		});
	}

	@Override
	public List<String> getResultHeadSet(String sql) throws SQLException {
		
		List<String> headSet = new LinkedList<String>();
		
		Connection conn = this.getSqlMapClient().getDataSource().getConnection();
		
		Statement st = conn.createStatement();
		
		java.sql.ResultSet rs = st.executeQuery(sql);
		java.sql.ResultSetMetaData rsm = rs.getMetaData();
		for(int i=0 ; i<rsm.getColumnCount() ; i++){
			headSet.add(rsm.getColumnLabel(i+1));
		}
	
		return headSet;
	}

	@Override
	public List<PolicyManualInfoBean> queryPolicyManualInfoList(
			String nameSpace, String sqlMapId, Map<String, Object> parMap)
			throws Exception {
		return getSqlMapClientTemplate().queryForList(nameSpace + "." + sqlMapId, parMap);
	}
}
