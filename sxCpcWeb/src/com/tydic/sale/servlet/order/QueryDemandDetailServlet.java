package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
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

import sun.misc.BASE64Decoder;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.common.WeekdayUtil;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;


@WebServlet("/order/QueryDemandInfo.do")
public class QueryDemandDetailServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryDemandDetailServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryDemandDetailServlet() {
		super();
	}

	 
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	 
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		String demandId = request.getParameter("demandId"); 
		String isHistory = request.getParameter("isHistory"); 
 		Map<Object,Object> reqMap = new HashMap<Object, Object>();
 		// 获取员工基本信息
 		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		reqMap.put("demandId", demandId);
		reqMap.put("isHistory", isHistory);
		SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		try {
			Map<Object,Object> demMap = crmService.getDemandInfo(reqMap);
			if("0".equals(demMap.get("code"))){
				boolean flag = false;
				String optTime = "";
				List<Map<String,Object>> recordSetLst = new ArrayList<Map<String,Object>>();
				recordSetLst = (List<Map<String, Object>>) demMap.get("recordSet");
				if(!Tools.isNull(recordSetLst) && recordSetLst.size()>0){
					Map<String, Object> currRecord=new HashMap<String, Object>();
					int len=recordSetLst.size();
					currRecord=recordSetLst.get(len-1);//最后一个环节
					String currNodeId=String.valueOf(currRecord.get("curr_node_id"));//当前状态
					String onrecordId="";//取待评价环节的上一个环节待处理
					for(Map recordSetMap : recordSetLst){
						if("100103".equals(String.valueOf(recordSetMap.get("curr_node_id")))){
							/*flag = true;
							optTime = String.valueOf(recordSetMap.get("opt_time"));*/
							onrecordId=String.valueOf(recordSetMap.get("on_record_id"));
						}
					}
					if(!Tools.isNull(onrecordId)&&("100103".equals(currNodeId)||"100104".equals(currNodeId))){
						for(Map recordSet:recordSetLst){
							if (onrecordId.equals(String.valueOf(recordSet.get("record_id")))) {
								flag = true;
								optTime = String.valueOf(recordSet.get("opt_time"));
								break;
							}
						}
					}
					
				}
				
				Map<String,Object> demandInstMap = new HashMap<String, Object>();
				demandInstMap = (Map<String, Object>) demMap.get("demandInst");
					String overLimit = String.valueOf(demandInstMap.get("over_limit"));
					if(!Tools.isNull(overLimit)){
						try {
							Date actualTime = new Date(); //实际时间
							if(flag){
								actualTime = dfs.parse(optTime);
							}
							Date end = dfs.parse(overLimit);
							long calimSurplusTime = (end.getTime()-actualTime.getTime());
							if(calimSurplusTime > 0){
								demandInstMap.put("flag", "0");
							}else{
								demandInstMap.put("flag", "1");
							}
							String twoTime=WeekdayUtil.computWorkTime(dfs.format(actualTime), overLimit, systemUser.getRegionCode());
							demandInstMap.put("calimSurplusTime",twoTime);
						} catch (ParseException e) {
							e.printStackTrace();
						}
					}
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
				resultMap.put("flag", flag);
				resultMap.put("demandInst", demandInstMap);
				resultMap.put("recordSet", demMap.get("recordSet"));
				resultMap.put("recordProcSet", demMap.get("recordProcSet"));				
				resultMap.put("serviceInst", demMap.get("serviceInst"));
				resultMap.put("recordServiceSet", demMap.get("recordServiceSet"));
				resultMap.put("imgList", demMap.get("imgList"));//工单发起时上传的文件
				resultMap.put("optId", systemUser.getStaffId());
				resultMap.put("regionName",systemUser.getRegionName());
				resultMap.put("regionCode", systemUser.getRegionCode());//得到登录者的本地网id
				resultMap.put("orgId", systemUser.getOrgId());
				resultMap.put("orgFlag", systemUser.getOrgFlag());
				resultMap.put("funLst", systemUser.getFunLst());
				resultMap.put("leaderDataLst", systemUser.getLeaderDataLst());
				resultMap.put("staffName", systemUser.getStaffName());
				resultMap.put("nowDate", dfs.format(new Date()));
			}else{
				resultMap.put("code", "-1");
				resultMap.put("msg", "系统异常");
			}
		} catch (Exception e) {
			resultMap.put("code", "-1");
			e.printStackTrace();
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		 
		sendMessages(response, JSON.toJSONString(resultMap));
	}
	 
	
}