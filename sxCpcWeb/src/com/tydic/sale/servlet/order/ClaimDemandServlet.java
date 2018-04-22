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
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.common.WeekdayUtil;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryOderLstServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/claimDemand.do")
public class ClaimDemandServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(ClaimDemandServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public ClaimDemandServlet() {
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
		
		String handleType = request.getParameter("handleType");//操作类型
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		//查询专业系统和办理时限
		if("qryData".equals(handleType)){
			//获取本地网的工作时间
			String regionCode =systemUser.getRegionId();
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("dicType", "demandType");
			Map<Object,Object> demandTypeMap = crmService.getdic(reqMap);
			reqMap = new HashMap<Object, Object>();
			String proType="";
			if("290".equals(regionCode)){
				proType="processingTime";//西安的办结时限
			}else{
				proType="otherprocessing";//其他本地的
			}
			reqMap.put("dicType", proType);
			Map<Object,Object> processingTimeMap = crmService.getdic(reqMap);
			resultMap.put("demandTypeMap", demandTypeMap);
			resultMap.put("processingTimeMap", processingTimeMap);
			
			WeekdayUtil.setDateConfigData(regionCode);
			WeekdayUtil.setWorkLength("");
			int workLength=WeekdayUtil.getWorkLength();
			resultMap.put("workLength", workLength);
		}else if("dateCompute".equals(handleType)){ //时间计算
			String chooseTime = request.getParameter("chooseTime");
			String createDate = request.getParameter("createDate");
			String regionCode = request.getParameter("regionCode");
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
			String overTime = ""; //办理截止时间
			long surplusTime ;//办理剩余时间
//				Date date;
//					date = sdf.parse(createDate);
//					Calendar curr=Calendar.getInstance();
//					curr.setTime(date);
//					curr.set(Calendar.HOUR_OF_DAY,curr.get(Calendar.HOUR_OF_DAY)+Integer.parseInt(chooseTime));
//					overTime =sdf.format(curr.getTime());
//			if("290".equals(regionCode)){//西安市的不需要剔除非工作日
//				overTime=WeekdayUtil.addTimeHour("yyyy-MM-dd HH:mm:ss",createDate,Integer.parseInt(chooseTime));
//			}else{
				overTime= WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",createDate,Float.parseFloat(chooseTime),regionCode);
			//}
			
			try {
				Date begin = new Date();
				Date end = sdf.parse(String.valueOf(overTime));
				surplusTime = (end.getTime()-begin.getTime());
				long hour = (surplusTime/(60*60*1000));
				long min=((surplusTime/(60*1000))-hour*60);
				String twoTime=WeekdayUtil.computWorkTime(sdf.format(begin), overTime, regionCode);
				if(surplusTime > 0){
					//resultMap.put("surplusTime", String.valueOf(hour)+"小时"+String.valueOf(min)+"分钟");
					resultMap.put("flag", "0");
				}else{
					//resultMap.put("surplusTime","超时："+String.valueOf(hour).replaceAll("-", "")+"小时"+String.valueOf(min).replaceAll("-","")+"分钟");
					resultMap.put("flag", "1");
				}
				resultMap.put("surplusTime", twoTime);
			} catch (ParseException e) {
				e.printStackTrace();
			}
			
			resultMap.put("overTime", overTime);
			resultMap.put("code", "0");
			
		}else if("qryPoolRel".equals(handleType)){
			   String orgId = request.getParameter("orgId");
			   String stsffId = request.getParameter("staffId");
			   String regionCode=request.getParameter("regionCode");
			   Map<Object,Object> userRolePoolMap = new HashMap<Object, Object>();
				List<Map<String,Object>> colSetLst = new ArrayList<Map<String,Object>>();
				Map<String,Object> temp = new HashMap<String,Object>();
				temp.put("relType", "STAFF");
				temp.put("relValue", stsffId);
				colSetLst.add(temp);
				temp = new HashMap<String,Object>();
				temp.put("relType", "ORG");
				temp.put("relValue", orgId);
				colSetLst.add(temp);
				
				Map<Object,Object> reqMap = new HashMap<Object, Object>();
				reqMap.put("qryUserColSet", colSetLst);
				reqMap.put("regionCode", regionCode);
				userRolePoolMap = crmService.getUserRolePool(reqMap);
				resultMap = userRolePoolMap;
		}else if("qryPoolInfo".equals(handleType)){//查询接单池的有关信息
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("regionId",request.getParameter("latnId"));
			reqMap.put("SERVER_NAME", "qryPoolInfo");
			resultMap=crmService.dealObjectFun(reqMap);
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
