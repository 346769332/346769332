package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.common.WeekdayUtil;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * Servlet implementation class QuerySaleOderList
 */
@WebServlet("/order/ComprehensiveQry.do")
public class ComprehensiveQryServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(ComprehensiveQryServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ComprehensiveQryServlet() {
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
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		
		String hanleType = request.getParameter("hanleType");
		
		// 获取员工基本信息
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize", pageSize);
			/******* 截止时间计算 *********/
			String sendBeginDate = request.getParameter("sendBeginDate");// 发起开始时间
			String sendEndDate = request.getParameter("sendEndDate");//发起结束时间
			
			String calimLimitBeginDate = request.getParameter("calimLimitBeginDate");//认领开始时间
			String calimLimitEndDate = request.getParameter("calimLimitEndDate");//认领结束时间
			
			String overLimitBeginDate = request.getParameter("overLimitBeginDate");//办结开始时间
			String overLimitEndDate = request.getParameter("overLimitEndDate");//办结结束时间
			if(!Tools.isNull(sendBeginDate)){
				sendBeginDate =  String.valueOf(sendBeginDate+" 00:00:00") ;
			}
			if(!Tools.isNull(sendEndDate)){
				sendEndDate =  String.valueOf(sendEndDate+" 23:59:59") ;
			}
			
			if(!Tools.isNull(calimLimitBeginDate)){
				calimLimitBeginDate =   String.valueOf(calimLimitBeginDate+" 00:00:00") ;
			}
			if(!Tools.isNull(calimLimitEndDate)){
				calimLimitEndDate =   String.valueOf(calimLimitEndDate+" 23:59:59") ;
			}
			
			if(!StringUtils.isEmpty(overLimitBeginDate)){
				overLimitBeginDate =   String.valueOf(overLimitBeginDate+" 00:00:00") ;
			}
			if(!StringUtils.isEmpty(overLimitEndDate)){
				overLimitEndDate =   String.valueOf(overLimitEndDate+" 23:59:59") ;
			}
			/******* 截止时间计算 *********/
			reqMap.put("start_create_time", sendBeginDate);
			reqMap.put("end_create_time", sendEndDate);
			
			reqMap.put("calim_limit", calimLimitEndDate);
			reqMap.put("calim_limit_begin", calimLimitBeginDate);
			
			reqMap.put("over_limit", overLimitEndDate);
			reqMap.put("over_limit_begin", overLimitBeginDate);
			
			String latnId = request.getParameter("latnId");
			reqMap.put("latnId", latnId);
			
			String sendUserName = request.getParameter("sendUserName");// 发起人
			reqMap.put("promoters_id", sendUserName);
			String newStatusCd = request.getParameter("newStatusCd");
			reqMap.put("curr_node_id", newStatusCd);
			
			
			Map<Object,Object> respMap = new HashMap<Object, Object>();
			if("demand".equals(hanleType)){
				String calimTimeOutFlag = request.getParameter("calimTimeOutFlag");
				reqMap.put("calimTimeOutFlag", calimTimeOutFlag);
				
				String overTimeOutFlag = request.getParameter("overTimeOutFlag");
				reqMap.put("overTimeOutFlag", overTimeOutFlag);
				
				String topSeach = request.getParameter("themeSeach");// 主题
				reqMap.put("demand_theme", topSeach);
				String demandType = request.getParameter("demandType");
				reqMap.put("demand_type", demandType);
				String demandId = request.getParameter("demandId");
				reqMap.put("demand_id", demandId);
				reqMap.put("isNowNodeId", "1");
				
				reqMap.put("demand_details", request.getParameter("demandDetails"));
				reqMap.put("tel", request.getParameter("sendUserTel"));
				reqMap.put("department", request.getParameter("sendUserDept"));
				reqMap.put("tree_name", request.getParameter("sendUserArea"));
				reqMap.put("lastOptName", request.getParameter("optName"));
				reqMap.put("lastOptTel", request.getParameter("optTel"));
				reqMap.put("lastOptDept", request.getParameter("optDept"));
				reqMap.put("pool_id", request.getParameter("poolId"));
				reqMap.put("over_eval", request.getParameter("evalStar"));
				reqMap.put("searchType", "comprehensive");
			   respMap = crmService.getDemandLst(reqMap);
			}else if("service".equals(hanleType)){
				String timeOutFlag = request.getParameter("timeOutFlag");
				reqMap.put("timeOutFlag", timeOutFlag);
				String topSeach = request.getParameter("themeSeach");// 主题
				reqMap.put("service_theme", topSeach);
				String serviceId = request.getParameter("serviceId");
				reqMap.put("service_id", serviceId);
				String demandId = request.getParameter("demandId");
				reqMap.put("demand_id", demandId);
				respMap = crmService.getServiceLst(reqMap);
			}
			
			resultMap.put("code", "1");
			if("0".equals(respMap.get("code"))){
				respMap.put("list", dateCalculation(respMap,latnId));
				resultMap.put("code", "0");
				resultMap.put("data", respMap.get("list"));
				resultMap.put("totalSize", respMap.get("sum"));
			}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	/**
	 * 时间计算
	 * @return
	 */
	private List<Map> dateCalculation( Map demMap,String latnId ){
		List<Map> resultLst = new ArrayList<Map>();
		if(Tools.isNull(latnId)){
			latnId="888";
		}
			//办理剩余时间计算
			List<Map> list =  (List<Map>) demMap.get("list");
			if(list.size()>0){
				for(Map map : list){
					try {
						SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						String currNodeId=String.valueOf(map.get("curr_node_id"));
						String overLimit=String.valueOf(map.get("over_limit"));
						String calimLimit=String.valueOf(map.get("calim_limit"));
						String overTime=String.valueOf(map.get("over_time"));
						String backTime=String.valueOf(map.get("back_time"));//回单时间
						String calimTime=String.valueOf(map.get("calim_time"));//认领的处理时间
						//计算认领是否超时
						/*Date calim_end=dfs.parse(calimLimit);
						Date calim_begin=new Date();
						if(!Tools.isNull(calimTime)){
							calim_begin=dfs.parse(calimTime);
						}
						long calimSurplusTime = (calim_end.getTime()-calim_begin.getTime());
						long hour = (calimSurplusTime/(60*60*1000));
						long min=((calimSurplusTime/(60*1000))-hour*60);
						if(calimSurplusTime > 0){
							map.put("calimflag", "0");
						}else{
							map.put("calimflag", "1");
						}
						String calimDif=WeekdayUtil.computWorkTime(dfs.format(calim_begin),dfs.format(calim_end),latnId);
						map.put("surplusCalimTime",calimDif.substring(2));*/
						//计算办结是否超时
						Date begin=new Date();
						Date end=new Date();
						/*if(("100104".equals(currNodeId))&& !Tools.isNull(overLimit)&&!Tools.isNull(overTime)){ //已归档时办理剩余时间计算
							begin=dfs.parse(overTime);
							end = dfs.parse(overLimit);
						}*/
						if(("100102".equals(currNodeId)||"200102".equals(currNodeId))&&!Tools.isNull(overLimit)){ //待处理截止时间计算
							end = dfs.parse(overLimit);
						}else if(!Tools.isNull(overLimit)&&("100103".equals(currNodeId)||"100104".equals(currNodeId))){//待评价时办理时间的计算
							if(!Tools.isNull(backTime)){
								begin=dfs.parse(backTime);//最后一次的处理时间
							}
							end = dfs.parse(overLimit);
						}
						long optSurplusTime = (end.getTime()-begin.getTime());
						long hour2 = (optSurplusTime/(60*60*1000));
						long min2=((optSurplusTime/(60*1000))-hour2*60);
						if(optSurplusTime > 0){
							map.put("optflag", "0");
						}else{
							map.put("optflag", "1");
						}
						String optDif=WeekdayUtil.computWorkTime(dfs.format(begin),dfs.format(end),latnId);
						map.put("surplusOptTime",optDif.substring(2));
					} catch (ParseException e) {
						e.printStackTrace();
					}
					resultLst.add(map);
			   }
		}
		return resultLst;
	}
	
	/**
	 * 格式化时间
	 * @param reqDate
	 * @param addFlag
	 * @return
	 */
	private String formatDate(String reqDate,boolean addFlag){
		String respDate = "";
		java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat(
				"yyyy-MM-dd");
		java.util.Calendar cal = java.util.Calendar.getInstance();
		try {
			cal.setTime(sdf.parse(reqDate));
		} catch (ParseException e1) {
			logger.error("计算截止时间出现异常", e1);
			e1.printStackTrace();
		}
		if(addFlag){
			cal.add(java.util.Calendar.DATE, +1);
		}
//		respDate = sdf.format(cal.getTime()).replaceAll("-", "");
		respDate = sdf.format(cal.getTime());
		return respDate;
	};

	// 获取三个时间选项时间
	private Map getDate() {
		Map<String, Object> datemap = new HashMap<String, Object>();
		java.util.Calendar c = java.util.Calendar.getInstance();
		java.text.SimpleDateFormat f = new java.text.SimpleDateFormat(
				"yyyy-MM-dd");
		java.util.Calendar calendar = java.util.Calendar.getInstance();
		calendar.add(Calendar.DATE, +1); // 得到前一天
		String nextDay = f.format(calendar.getTime()); // 前一天
		String day = f.format(c.getTime()); // 本日
		c.set(Calendar.DAY_OF_MONTH, c.get(Calendar.DAY_OF_MONTH) - 6);
		String week = f.format(c.getTime()); // 最近一周
		java.util.Calendar cc = java.util.Calendar.getInstance();
		cc.set(Calendar.MONTH, cc.get(Calendar.MONTH) - 1);
		String month = f.format(cc.getTime());
		datemap.put("nextDay", nextDay);
		datemap.put("day", day);
		datemap.put("week", week);
		datemap.put("month", month);
		return datemap;
	}
	
	/*
	 * 查询单池关系数据
	 */
	private Map<Object,Object> qryPoolRel (Map<Object,Object> reqMap){
		Map<Object,Object> respMap = new HashMap<Object,Object>();
		respMap = crmService.qryPoolRel(reqMap);
		return respMap;
	}
	public String sendMessages(HttpServletResponse response, String json) {
		response.setContentType("application/json");
		response.setContentType("text/json; charset=utf-8");

		response.setCharacterEncoding("UTF-8");
		try {
			response.getWriter().print(json);
		} catch (IOException e) {
			logger.error("返回前台请求异常", e);
			e.printStackTrace();
		}
		return null;
	}
	
}
