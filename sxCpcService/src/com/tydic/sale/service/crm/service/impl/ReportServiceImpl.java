package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.ReportService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;

public class ReportServiceImpl implements ReportService {
	
	private static final String SUCCESS = "0";
	
	private static final String FAIL = "-1";
	
	private Logger log = Logger.getLogger(this.getClass());

	private CpcDao cpcDao ;

	private static final String NAME_SPACE = "reprot";
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	@Override
	public void execReportProc(Map<String, Object> param) {

		String procName = String.valueOf(param.get("KEY_0"));
		param.put("proc_name", procName);
		try {
			List<Map<String, Object>> procSeqSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_proc_config", param);
			for(Map<String, Object> proc : procSeqSet){
				this.cpcDao.qryMapInfo(NAME_SPACE, "proc_dynamic_exec", proc);
			}
 		} catch (Exception e) {
			log.error("执行报表存储过程异常，请确认", e);
		}
	}

	@Override
	public void batchProcTimer(Map<String, Object> param) {
		
		try {
			List<Map<String,Object>> reportSqlMapSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_report_search", param);
			
		} catch (Exception e) {
			log.error("执行查询需要处理的任务列表异常，数据库访问异常", e);
		}
		
		
	}

	@Override
	public Map<String, Object> searchReportPublic(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("code", SUCCESS);
		resultMap.put("msg", "成功");
		try {
			//查询执行脚本
			Map<String, Object> reportSqlMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_report_sql", param);
			
			if(!Tools.isNull(reportSqlMap)){
				//执行sql
				reportSqlMap = this.rendarSQLParam( reportSqlMap , param);
				Map<String, Object> countMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_dynamic_sql_count", reportSqlMap);
				List<Map<String, Object>> searchReportSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_dynamic_sql", reportSqlMap);
				this.rendarReportResult(searchReportSet,resultMap);
				if(Tools.isNull(searchReportSet)){
					List<String> headSet = this.cpcDao.getResultHeadSet(String.valueOf(reportSqlMap.get("search_sql")));
					resultMap.put("headSet", headSet);
				}
				
				//查询报表钻取字段集合
				List<Map<String, Object>> searchReportSubRelSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_report_sub_rel", reportSqlMap);
				
				resultMap.put("totalSize", countMap.get("totalSize"));
				resultMap.put("pageSize", reportSqlMap.get("pageSize"));
				resultMap.put("subRelSet", searchReportSubRelSet);
				
			}
		} catch (Exception e) {
			log.error("执行查询报表异常，数据库访问异常", e);
			resultMap.put("code", FAIL);
			resultMap.put("msg", "失败：执行查询报表异常，数据库异常");
		}
		
		return resultMap;
	}
	
	private Map<String,Object> rendarSQLParam(Map<String, Object> searchReportMap ,Map<String, Object> param){
		
		StringBuffer basicSql = new StringBuffer();
		//替换条件参数
		String search_sql = String.valueOf(searchReportMap.get("search_sql"));
		for(Iterator it = param.keySet().iterator() ; it.hasNext();){
			String key = String.valueOf(it.next());
			search_sql = search_sql.replace("#"+key+"#", "'"+String.valueOf(param.get(key))+"'");
		}
		//清除无条件选项
		search_sql.replace(" and ", " AND ");
		String[] andConds = search_sql.split(" AND ");
		for(int i=0 ; i<andConds.length ; i++){
			if(andConds[i].indexOf("#") < 0){
				if(i>0){
					basicSql.append(" AND ");
				}
				basicSql.append(andConds[i]);
			}
		}
		
		//获取from后条件内容便于 拼接总数
		String search_sql_from = basicSql.toString();
		searchReportMap.put("search_sql_from",search_sql_from);
		
		//进行分页拼接
		int startIndex = 0;
		int pageSize = 999999;
		
		try {
			if(Tools.isNull(param.get("outExcel")) || String.valueOf(param.get("outExcel")).equals("N")){
				pageSize = Integer.valueOf(String.valueOf(searchReportMap.get("page_size"))).intValue();
			}
		} catch (NumberFormatException e) {}
		try {
			int pages = 0;
			if(Tools.isNull(param.get("outExcel")) || String.valueOf(param.get("outExcel")).equals("N")){
				pages = Integer.valueOf(String.valueOf(param.get("limit"))).intValue();
			}
			startIndex = pages*pageSize;
		} catch (NumberFormatException e) {}
		basicSql.append(" limit ");
		basicSql.append(startIndex);
		basicSql.append(",");
		basicSql.append(pageSize);
		
		searchReportMap.put("limit", startIndex);
		searchReportMap.put("pageSize", pageSize);
		searchReportMap.put("search_sql",basicSql.toString());
		
		
		
		return searchReportMap;
	}
	
	private Map<String,Object> rendarReportResult(List<Map<String, Object>> searchReportSet,Map<String,Object> resultMap){
		
		List<String> headSet = new LinkedList<String>();
		if(!Tools.isNull(searchReportSet)){
			Map<String, Object> searchReport = searchReportSet.get(0);
			//绘制head
			for(Iterator it = searchReport.keySet().iterator() ; it.hasNext();){
				String key = String.valueOf(it.next());
				headSet.add(key);
			}
			
		}
		
		//绘制set
		resultMap.put("searchReportSet", searchReportSet);
		resultMap.put("headSet", headSet);
		
		return resultMap;
	}

	@Override
	public Map<String, Object> queryReportPublicConfig(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("code", SUCCESS);
		resultMap.put("msg", "成功");
		
		//执行sql
		try {
			Map<String, Object> reportSqlMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_report_sql", param);
			
			resultMap.put("reprotConfig", reportSqlMap);
		} catch (Exception e) {
			log.error("执行查询报表配置异常，数据库访问异常", e);
			resultMap.put("code", FAIL);
			resultMap.put("msg", "失败：执行查询报表配置异常，数据库异常");
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> searchReportPublicControl(
			Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("code", SUCCESS);
		resultMap.put("msg", "成功");
		
		//执行sql
		try {
			List<Map<String, Object>> reprotControlSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_cond_control_config", param);
			
			for(Map<String, Object> reportControl : reprotControlSet){
				String controlType = String.valueOf(reportControl.get("control_type"));
				String controlBase = String.valueOf(reportControl.get("control_base"));
				String defaultValue = String.valueOf(reportControl.get("default_value"));
				//获取基础数据
 				if(controlType.equals("SELECT")
						&& !Tools.isNull(controlBase)){
					controlBase = controlBase.replace("#latnId#", param.get("latnId").toString())
									.replace("#staffId#", param.get("staffId").toString())
									.replace("#loginCode#", param.get("loginCode").toString())
									.replace("#orgId#", param.get("orgId").toString());
					param.put("search_sql", controlBase);
					List<Map<String, Object>> baseSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_dynamic_sql", param);
					
					reportControl.put("baseSet", baseSet);
				}
				
				//换算默认值
				
				if(!Tools.isNull(defaultValue)){
					if(defaultValue.equals("[latn_id]")){		
						reportControl.put("default_value", param.get("latnId"));				
					}else if(defaultValue.equals("[staff_id]")){
						reportControl.put("default_value", param.get("staffId"));
					}else if(defaultValue.equals("[login_code]")){
						reportControl.put("default_value", param.get("loginCode"));
					}else if(defaultValue.equals("[org_id]")){
						reportControl.put("default_value", param.get("orgId"));
					}else if(defaultValue.indexOf("[date:")==0){
						String[] dVals = defaultValue.split(":");
						reportControl.put("default_value", Tools.addDate(dVals[1].replace("]", ""), Calendar.YEAR, 0));
					}
				}
			}
			
			resultMap.put("controlSet", reprotControlSet);
		} catch (Exception e) {
			log.error("执行报表【查询控件】异常，数据库访问异常", e);
			resultMap.put("code", FAIL);
			resultMap.put("msg", "失败：执行报表【查询控件】异常，数据库异常");
		}
		
		return resultMap;
	}
	

	@Override
	public Map<String, Object> qryNews(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> newsSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_news", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("newsSet", newsSet);
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询失败，数据访问异常"+e);
			log.error("查询失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> starEvalOnMonth(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		Object obj = param.get("starEvalSet");
		if(Tools.isNull(obj)
				|| !(obj instanceof List)){
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "没有接收到数据集合：starEvalSet。");
			return resultMap;
		}
		
		try {
			List<Map<String,Object>> starEvalSet = (List<Map<String, Object>>) obj;
			//设置评价信息
			this.cpcDao.batchUpdate(NAME_SPACE, "update_star_eval_info", starEvalSet);
			//汇总信息
			List<Map<String,Object>> starEvalTotalSet = this.getStarEvalTotalSet(starEvalSet);
			this.cpcDao.batchUpdate(NAME_SPACE, "update_star_eval_total", starEvalTotalSet);

			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "批量保存评价信息失败，数据访问异常！"+e);
			log.error("批量保存评价信息失败，数据访问异常！",e);
		}
		return resultMap;
	}

	/**
	 * 获取评价汇总集合
	 * @param starEvalSet
	 * @return
	 */
	private List<Map<String,Object>> getStarEvalTotalSet(List<Map<String,Object>> starEvalSet){
		
		List<Map<String,Object>> starEvalTotalSet = new ArrayList<Map<String,Object>>();
		for(Map<String,Object> starEval : starEvalSet){
			String total_id = String.valueOf(starEval.get("total_id"));
			boolean isExists = false;
			for(Map<String,Object> starEvalTotal : starEvalTotalSet){
				if(total_id.equals(String.valueOf(starEvalTotal.get("total_id")))){
					isExists = true;
					break;
				}
			}
			if(!isExists){
				Map<String,Object> starEvalTotal = new HashMap<String,Object>();
				starEvalTotal.put("total_id", total_id);
				starEvalTotalSet.add(starEvalTotal);
			}
		}
		
		return starEvalTotalSet;
	}

	@Override
	public Map<String, Object> updateLookNews(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "update_look_news", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "变更消息查看失败，数据访问异常"+e);
			log.error("变更消息查看失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryNewsInfoByType(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			
			if(Tools.isNull(param.get("news_type"))){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "消息类型为空，请增加传参news_type");
				return resultMap;
			}
			
			Map<String,Object> result = new HashMap<String,Object>();
			
			String newsType = String.valueOf(param.get("news_type"));
			
			//五星评价查看
			if(newsType.equals("STAR_EVAL")){
				Map<String,Object> totalMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_starEvalTotal_by_newsType", param);
				List<Map<String,Object>> starEvalInfoSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_starEval_by_newsType", totalMap);
				totalMap.put("staff_name", param.get("staff_name"));
				result.put("totalInfo", totalMap);
				result.put("starEvalInfoSet", starEvalInfoSet);
			}
			resultMap.put("result", result);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "根据类型查看消息详情失败，数据访问异常"+e);
			log.error("根据类型查看消息详情失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getNotLookNewsCount(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			Map<String,Object> notLookNewsCountsMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_notLook_news_count", param);
			resultMap.put("notLookNewsCount", notLookNewsCountsMap.get("not_look_count"));
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "变更消息查看失败，数据访问异常"+e);
			log.error("变更消息查看失败，数据访问异常",e);
		}
		return resultMap;
	}
}
