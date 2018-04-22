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

@WebServlet("/app/searchDemandList.do")
public class SearchDemandListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchDemandListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchDemandListServlet() {
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
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		reqParamMap.put("promoters_id", systemUser.getStaffId());
		//查询
		Map<Object,Object> resultMap = super.crmService.getDemandLst(reqParamMap);
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
		
		List<Map<Object,Object>> demandSet = (List<Map<Object, Object>>) listObj;
		
		String now = Tools.addDate("yyyy-MM-dd", Calendar.YEAR, 0);
		for(Map<Object,Object> demand : demandSet){
			Map<Object,Object> showObjMap = getShowObjColumn(demand );
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
	
	private Map<Object,Object> getShowObjColumn(Map<Object,Object> demand ){
		Map<Object,Object> showObj = new HashMap<Object,Object>();
		
		showObj.put("create_time"		, demand.get("create_time"));
		showObj.put("busi_id"			, demand.get("busi_id"));
		showObj.put("over_limit"		, demand.get("over_limit"));
		showObj.put("curr_record_id"	, demand.get("curr_record_id"));
		showObj.put("curr_node_id"		, demand.get("curr_node_id"));
		showObj.put("curr_node_name"	, demand.get("curr_node_name"));
		showObj.put("demand_type_name"	, demand.get("demand_type_name"));
		showObj.put("demand_theme"		, demand.get("demand_theme"));
		showObj.put("demand_details"	, demand.get("demand_details"));
		Map<Object,Object> reqMap=new HashMap<Object,Object>();
		Map<Object,Object> demMap=new HashMap<Object,Object>();
		reqMap.put("demandId", demand.get("busi_id"));
		reqMap.put("SERVER_NAME", "qryHistoryRecord");
		demMap = super.crmService.dealObjectFun(reqMap);
		if("0".equals(demMap.get("code"))){
			List<Map<String,Object>> recordList=(List<Map<String,Object>>)demMap.get("recordSet");
			Map<String,Object> lastOpt=recordList.get(recordList.size()-2);
			showObj.put("opt_name"	, lastOpt.get("opt_name"));
			showObj.put("opt_desc"	, lastOpt.get("opt_desc"));
			showObj.put("opt_time"	, lastOpt.get("opt_time"));
		}
		return showObj;
	}
}
