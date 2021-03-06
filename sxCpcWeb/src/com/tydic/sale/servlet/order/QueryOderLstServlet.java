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

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.sun.corba.se.impl.orbutil.closure.Constant;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.common.WeekdayUtil;
import com.tydic.sale.servlet.domain.Pool;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * Servlet implementation class QuerySaleOderList
 */
@WebServlet("/order/QueryOderLst.do")
public class QueryOderLstServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(QueryOderLstServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryOderLstServlet() {
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
		String queryType = request.getParameter("queryType");// 查询类型
		String queryStatusCd = request.getParameter("queryStatusCd");//查询状态
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		String orderType = request.getParameter("orderType"); //订单分类
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map dateMap = getDate();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize", pageSize);
		List<Map> funLst = systemUser.getFunLst();//获取角色功能
		String regionCode=systemUser.getRegionCode();
		reqMap.put("regionCode", regionCode);
		if(Tools.isNull(funLst) || funLst.size() == 0){ //无功能配置直接返回。。。
			resultMap.put("code", "1");
			resultMap.put("msg", "角色无当前功能，无法查询");
			sendMessages(response, JSON.toJSONString(resultMap));
			return ;
		}
		String currNodeId = "";//当前流程ID
		if("100101".equals(queryStatusCd)){ //待认领
			for(Map funMap : funLst){
				if("100008".equals(String.valueOf(funMap.get("fun_id"))) || "100009".equals(String.valueOf(funMap.get("fun_id")))){
					currNodeId = String.valueOf(funMap.get("node_id"));
					break;
				}
			}
			reqMap.put("curr_node_id", currNodeId);
			reqMap.put("record_status", "0");
			reqMap.put("default_opt_id", String.valueOf(""));
			
			List optIdLst = new ArrayList();
			List<Map> poolList = new ArrayList<Map>();
			poolList = systemUser.getPoolLst();
			if(!Tools.isNull(poolList) && poolList.size() > 0 ){
				try{
					for(Map map : poolList ){
						Map temp = new HashMap();
						temp.put("optId", map.get("pool_id"));
						optIdLst.add(temp);
					}
				}catch (Exception e) {
					e.printStackTrace();
				}
				
			}
			reqMap.put("qryColSet", optIdLst);
		}else if("100104".equals(queryStatusCd)){//已处理
			reqMap.put("opt_id", systemUser.getLeaderDataLst());
			if("290".equals(systemUser.getRegionCode()) || true){
				reqMap.put("orgId", systemUser.getOrgId());
			}
			reqMap.put("record_status", "1");
			reqMap.put("ifopted", "1");
			reqMap.put("isNowNodeId", "1");
		}else if("100102".equals(queryStatusCd)){ //待处理
			reqMap.put("opt_id", systemUser.getLeaderDataLst());
			if("290".equals(systemUser.getRegionCode()) || true){
				reqMap.put("orgId", systemUser.getOrgId());
			}
			reqMap.put("ifopted", "1");
			for(Map funMap : funLst){
				if("100012".equals(String.valueOf(funMap.get("fun_id"))) || "100013".equals(String.valueOf(funMap.get("fun_id")))){
					currNodeId = String.valueOf(funMap.get("node_id"));
					break;
				}
			}
			reqMap.put("curr_node_id", currNodeId);
			reqMap.put("record_status", "0");
		}
		 if("dairen".equals(orderType)){ //待认领
			reqMap.put("default_opt_id", systemUser.getLeaderDataLst());
		 }
		// 查询本日销售单
		if ("today".equals(queryType)) {
			String beginDate = dateMap.get("day").toString();// 获取当前日期
			reqMap.put("start_create_time", String.valueOf(beginDate+" 00:00:00"));
			reqMap.put("end_create_time", String.valueOf(beginDate+" 23:59:59"));
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
			// 查询近一周销售单
		} else if ("week".equals(queryType)) {
			String endDate = String.valueOf(dateMap.get("day"));// 获取当前日期
			String beginDate = String.valueOf(dateMap.get("week"));// 获取前一周日期
			reqMap.put("start_create_time", String.valueOf(beginDate+" 00:00:00"));
			reqMap.put("end_create_time", String.valueOf(endDate+" 23:59:59"));
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
			// 查询近一个月销售单
		} else if ("month".equals(queryType)) {
			String endDate = String.valueOf(dateMap.get("day"));// 获取当前日期
			String beginDate = String.valueOf(dateMap.get("month"));// 获取前一月的日期
			reqMap.put("start_create_time", String.valueOf(beginDate+" 00:00:00"));
			reqMap.put("end_create_time", String.valueOf(endDate+" 23:59:59"));
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}	// 查询一个月以前的销售单
		} else if ("overMonth".equals(queryType)) {
			String endDate = String.valueOf(dateMap.get("month"));// 获取前一月的日期
			reqMap.put("end_create_time", String.valueOf(endDate+" 00:00:00"));
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
		}else if("listAll".equals(queryType)){
			//全部列表的展示
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
		} else if ("senior".equals(queryType)) {
			// 高级查询销售单
			/******* 截止时间计算 *********/
			String sendDate = request.getParameter("sendDate");// 发起时间
			String endDate = request.getParameter("endDate");// 截止时间
			String startCreateTime ="";
			String endCreateTime="";
			if(!StringUtils.isEmpty(sendDate)){
				startCreateTime =  String.valueOf(sendDate+" 00:00:00") ;
				endCreateTime =   String.valueOf(sendDate+" 23:59:59") ;
			}
			if(!StringUtils.isEmpty(endDate)){
				endDate =   String.valueOf(endDate+" 23:59:59") ;
			}
			/******* 截止时间计算 *********/
			reqMap.put("start_create_time", startCreateTime);
			reqMap.put("end_create_time", endCreateTime);
			if("100101".equals(queryStatusCd)){ //待认领
				reqMap.put("calim_limit", endDate);
			}else if("100102".equals(queryStatusCd) || "100104".equals(queryStatusCd)){ //待处理
				reqMap.put("over_limit", endDate);
			}
			
			String topSeach = request.getParameter("themeSeach");// 主题
			reqMap.put("demand_theme", topSeach);
			String sendUserName = request.getParameter("sendUserName");// 发起人
			reqMap.put("promoters_id", sendUserName);
			String newStatusCd = request.getParameter("newStatusCd");
			if(!reqMap.containsKey("curr_node_id")){
				reqMap.put("curr_node_id", newStatusCd);
			}
			//reqMap.put("ifopted", "");
			String demandType = request.getParameter("demandType");
			reqMap.put("demand_type", demandType);
			Map<Object,Object> demMap = crmService.getDemandLst(reqMap);
			resultMap.put("code", "1");
			if("0".equals(demMap.get("code"))){
				demMap.put("list", dateCalculation(queryStatusCd, demMap,regionCode));
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
		}
		resultMap.put("sysUserId", systemUser.getStaffId());
		resultMap.put("latnId", systemUser.getRegionCode());//西安的增加了发单等级所以用到本地网
		resultMap.put("orgId", systemUser.getOrgId());
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	private String getOptIds (List<Map> dataLst,SystemUser systemUser){
		String optIds = "";
		String dataIds = "";
		List<Object> staffLst = new ArrayList<Object>();
		if(!Tools.isNull(dataLst) && dataLst.size()>0){
			for(Map map : dataLst){
				dataIds += String.valueOf(map.get("data_id"))+",";
			}
			dataIds = dataIds.substring(0, dataIds.length()-1);
			Map<Object,Object> sqlMap  = new HashMap<Object, Object>();
			sqlMap.put("data_id", dataIds);
			Map<Object,Object> staffLstMap = crmService.queryStaffByData(sqlMap);
			if("0".equals(String.valueOf(staffLstMap.get("code")))){
				staffLst = (List<Object>) staffLstMap.get("staffLst");
			}
			if(!Tools.isNull(staffLst)&&staffLst.size() > 0){
				for(int i = 0 ; i<staffLst.size();i++){
					optIds += staffLst.get(i)+",";
				}
				optIds = optIds.substring(0,optIds.length()-1);
			}
		}
		if(!Tools.isNull(optIds)){
			if(!optIds.contains(systemUser.getStaffId())){
				optIds += ","+systemUser.getStaffId();
			}
		}else{
			optIds = systemUser.getStaffId();
		}
		return optIds;
	}
	
	/**
	 * 时间计算
	 * @return
	 */
	private List<Map> dateCalculation(String queryStatusCd , Map demMap,String regionCode){
		List<Map> resultLst = new ArrayList<Map>();
		if("100101".equals(queryStatusCd)){ //认领剩余时间计算
			List<Map> list =  (List<Map>) demMap.get("list");
			if(list.size()>0){
				for(Map map : list){
				SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				try {
					Date begin = new Date();
					Date end = dfs.parse(String.valueOf(map.get("calim_limit")));
					long calimSurplusTime = (end.getTime()-begin.getTime());
					long hour = (calimSurplusTime/(60*60*1000));
					long min=((calimSurplusTime/(60*1000))-hour*60);
					if(calimSurplusTime > 0){
						//map.put("calimSurplusTime", String.valueOf(hour)+"小时"+String.valueOf(min)+"分钟");
						map.put("flag", "0");
					}else{
						//map.put("calimSurplusTime","超时："+String.valueOf(hour).replaceAll("-", "")+"小时"+String.valueOf(min).replaceAll("-","")+"分钟");
						map.put("flag", "1");
					}
					String twoTime=WeekdayUtil.computWorkTime(dfs.format(begin), String.valueOf(map.get("calim_limit")), regionCode);
					map.put("calimSurplusTime",twoTime);
				} catch (ParseException e) {
					e.printStackTrace();
				}
				resultLst.add(map);
			  }
			}
		}else if("100104".equals(queryStatusCd) || "100102".equals(queryStatusCd)){//办结剩余时间
			//办理剩余时间计算
			List<Map> list =  (List<Map>) demMap.get("list");
			if(list.size()>0){
				for(Map map : list){
					if(!Tools.isNull(String.valueOf(map.get("over_limit"))) && (!"100103".equals(String.valueOf(map.get("curr_node_id"))) && !"100104".equals(String.valueOf(map.get("curr_node_id"))))){
						SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						try {
							Date begin = new Date();
							Date end = dfs.parse(String.valueOf(map.get("over_limit")));
							long calimSurplusTime = (end.getTime()-begin.getTime());
							long hour = (calimSurplusTime/(60*60*1000));
							long min=((calimSurplusTime/(60*1000))-hour*60);
							if(calimSurplusTime > 0){
								//map.put("surplusTime", String.valueOf(hour)+"小时"+String.valueOf(min)+"分钟");
								map.put("flag", "0");
							}else{
								//map.put("surplusTime","超时："+String.valueOf(hour).replaceAll("-", "")+"小时"+String.valueOf(min).replaceAll("-","")+"分钟");
								map.put("flag", "1");
							}
							String twoTime=WeekdayUtil.computWorkTime(dfs.format(begin), String.valueOf(map.get("over_limit")), regionCode);
							map.put("surplusTime",twoTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}else{
						map.put("surplusTime", "");
						map.put("flag", "0");
					}
					resultLst.add(map);
			   }
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
	
}
