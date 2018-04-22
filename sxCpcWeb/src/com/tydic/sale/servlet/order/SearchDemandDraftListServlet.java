package com.tydic.sale.servlet.order;

import java.io.IOException;
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

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryOderLstServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

@WebServlet("/order/searchDemandDraftList.do")
public class SearchDemandDraftListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchDemandDraftListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchDemandDraftListServlet() {
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
		
		SystemUser sysUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqParamMap  = new HashMap<Object, Object>();
		reqParamMap.put("promoters_id", sysUser.getStaffId());
		String handleType=request.getParameter("handleType");
		System.out.println("=============handleType===================");
		if(handleType.equals("getDemandALL")){
			reqParamMap.put("pagenum", request.getParameter("limit"));
			reqParamMap.put("pagesize", request.getParameter("pageSize"));
			reqParamMap.put("handleType", handleType);
			String sendDate = request.getParameter("sendDate");// 发起时间
			String topSeach = request.getParameter("themeSeach");// 主题
			reqParamMap.put("demand_theme", topSeach);
			String sendUserName = request.getParameter("sendUserName");// 发起人
			if(!Tools.isNull(sendUserName)){
				reqParamMap.put("promoters_id", sendUserName);
			}
		
			String startCreateTime ="";			
			if(!StringUtils.isEmpty(sendDate)){
				startCreateTime =  String.valueOf(sendDate+" 00:00:00") ;				
			}
			reqParamMap.put("start_create_time", startCreateTime);
			//查询
			Map<Object,Object> resultMap = super.crmService.getDemandsaveLst(reqParamMap);
		
			if("0".equals(resultMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", resultMap.get("list"));
				resultMap.put("totalSize", resultMap.get("sum"));
			}	
			super.sendMessagesApp(request,response,  resultMap);
		}else if (handleType.equals("deleteDemand")){
			String demand_id=request.getParameter("demand_id");
		  	    
			reqParamMap.put("demand_id",demand_id);
			reqParamMap.put("handleType",handleType);
			Map<Object,Object> resultMap = super.crmService.getDemandsaveLst(reqParamMap);
			if("0".equals(resultMap.get("code"))){
				resultMap.put("code", "0");
				
			}	
			super.sendMessagesApp(request,response,  resultMap);
		}else if("demandList".equals(handleType)){
			reqParamMap.clear();
			reqParamMap.put("promoters_id", sysUser.getStaffId());
			reqParamMap.put("latnId", sysUser.getRegionId());
			reqParamMap.put("record_status", request.getParameter("record_status"));
			reqParamMap.put("curr_node_id", request.getParameter("curr_node_id"));
			reqParamMap.put("start_create_time", request.getParameter("start_create_time"));
			reqParamMap.put("demand_theme", request.getParameter("demand_theme"));
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			reqParamMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqParamMap.put("pagesize", pageSize);
			//查询
			Map<Object,Object> demMap = super.crmService.getDemandLst(reqParamMap);
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			if("0".equals(demMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", demMap.get("list"));
				resultMap.put("totalSize", demMap.get("sum"));
			}
			super.sendMessagesApp(request,response,  resultMap);
		}else if("demandDetailInfo".equals(handleType)){
			String demandId = request.getParameter("demand_id");
			String isHistory = request.getParameter("isHistory");
			String isCEO = request.getParameter("isCEO");
			Map<Object,Object> resultMap = null;
			if(!Tools.isNull(demandId)){
				resultMap = super.crmService.searchDemandInfo(demandId, isHistory, isCEO);
			}
			super.sendMessagesApp(request,response,resultMap);
		}else if("qryAnnexInfo".equals(handleType)){
			reqParamMap.clear();
			reqParamMap.put("attachment_type", request.getParameter("attachment_type"));
			reqParamMap.put("attachment_value", request.getParameter("attachment_value"));
			reqParamMap.put("SERVER_NAME", "getAttachInfo");
			Map<Object,Object> resultMap = new HashMap<Object, Object>();
			resultMap = crmService.dealObjectFun(reqParamMap);
			super.sendMessages(response, JSON.toJSONString(resultMap));
		}
	}
	private static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
	}
}
