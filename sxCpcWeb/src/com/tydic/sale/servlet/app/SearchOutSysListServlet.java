package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/app/searchOutSysList.do")
public class SearchOutSysListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchOutSysListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchOutSysListServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		//查询
		Map<Object,Object> resultMap = super.crmService.qryOutSysFlowSet(reqParamMap);
		//转换
		resultMap = this.getFormatResource(resultMap);
		
		super.sendMessagesApp(request,response,  resultMap);
	}
	
	private Map<Object,Object> getFormatResource(Map<Object,Object> resultMap){
		
		
		
		Map<Object,Object> formatResult = new HashMap<Object,Object>();
		
		List<Map<Object,Object>> todaySet = new LinkedList<Map<Object,Object>>();
		List<Map<Object,Object>> yesterdaySet = new LinkedList<Map<Object,Object>>();
		List<Map<Object,Object>> earlierSet = new LinkedList<Map<Object,Object>>();
		
		formatResult.put("code"			, resultMap.get("code"));
		formatResult.put("todaySet"		, todaySet);
		formatResult.put("yesterdaySet"	, yesterdaySet);
		formatResult.put("earlierSet"	, earlierSet);
		
		Object listObj = resultMap.get("list");
		if(Tools.isNull(listObj) || !(listObj instanceof List)){
			return formatResult;
		}
		
		List<Map<Object,Object>> outSysFlowSet = (List<Map<Object, Object>>) listObj;
		
		String now = Tools.addDate("yyyy-MM-dd", Calendar.YEAR, 0);
		for(Map<Object,Object> outSysFlow : outSysFlowSet){
			Map<Object,Object> showObjMap = getShowObjColumn(outSysFlow );
			String createTime = String.valueOf(showObjMap.get("create_time"));
			if(Tools.isNull(createTime)){
				earlierSet.add(showObjMap);
				continue;
			}
			String createDate = createTime.split(" ")[0];
			long spanCount = Tools.countDay(now, createDate, "yyyy-MM-dd", Calendar.DATE);
			if(spanCount == 0){
				todaySet.add(showObjMap);
			}
			else if(spanCount == -1){
				yesterdaySet.add(showObjMap);
			}else{
				earlierSet.add(showObjMap);
			}
		}
		
		return formatResult;
	}
	
	private Map<Object,Object> getShowObjColumn(Map<Object,Object> outSysFlow ){
		Map<Object,Object> showObj = new HashMap<Object,Object>();

		showObj.put("flow_record_id", outSysFlow.get("flow_record_id"));
		showObj.put("node_record_id", outSysFlow.get("node_record_id"));
		showObj.put("flow_theme"	, outSysFlow.get("flow_theme"));
		showObj.put("flow_name"		, outSysFlow.get("flow_name"));
		showObj.put("node_name"		, outSysFlow.get("node_name"));
		showObj.put("flow_status"	, outSysFlow.get("flow_status"));
		showObj.put("opt_time"		, outSysFlow.get("opt_time"));
		showObj.put("create_time"	, outSysFlow.get("create_time"));
		showObj.put("opt_status"	, outSysFlow.get("opt_status"));
		showObj.put("opt_remark"	, outSysFlow.get("opt_remark"));
		showObj.put("opter_id"		, outSysFlow.get("opter_id"));
		showObj.put("opter_name"	, outSysFlow.get("opter_name"));
		showObj.put("opter_org_id"	, outSysFlow.get("opter_org_id"));
		showObj.put("opter_org_name", outSysFlow.get("opter_org_name"));
		showObj.put("latn_id"		, outSysFlow.get("latn_id"));
		showObj.put("out_sys_id"	, outSysFlow.get("out_sys_id"));
		
		return showObj;
	}
}
