package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
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
import com.google.gson.JsonArray;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;

@WebServlet("/order/saveEvalData.do")
public class SaveEvalDataServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(SaveEvalDataServlet.class);
	private static final  SimpleDateFormat yMdHms = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");// 24小时制
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveEvalDataServlet() {
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
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String evalStr=request.getParameter("evalSet");
		List evalList = new ArrayList();
		String create_time=yMdHms.format(new Date());
		
		List evalSet = new ArrayList();
 		if(!StringUtils.isEmpty(evalStr)){
 			evalSet = this.toList(evalStr, Map.class);
 		}
 		for (Object object : evalSet) {
			Map evalObjMap=(Map) object;
			String serviceIdStr=String.valueOf(evalObjMap.get("serviceIds")) ;
			String demandId=String.valueOf(evalObjMap.get("demandId")) ;
			if(!StringUtils.isEmpty(serviceIdStr)){
				String[] serviceIdArr=serviceIdStr.split(",");
				for (int i = 0; i < serviceIdArr.length; i++) {
					Map evalInfoMap=new HashMap<String, Object>();
					evalInfoMap.put("demand_id", evalObjMap.get("demandId"));
					evalInfoMap.put("o_rel_id", evalObjMap.get("departmentId"));
					evalInfoMap.put("o_type", evalObjMap.get("o_type"));
					evalInfoMap.put("eval_star", evalObjMap.get("evalStar"));
					evalInfoMap.put("eval_remark", evalObjMap.get("evalContent"));
					evalInfoMap.put("opt_id",systemUser.getStaffId());
					evalInfoMap.put("create_time",create_time);
					evalInfoMap.put("service_id", serviceIdArr[i]);
					if(demandId.equals(serviceIdArr[i])){
						evalInfoMap.put("info_type", "DEMAND");
					}else{
						evalInfoMap.put("info_type", "SERVICE");
					}
					evalList.add(evalInfoMap);
				}
			}
		}
 		if(evalList.size()>0){
 			reqMap.put("evalList", evalList);
 			resultMap=crmService.saveEvalData(reqMap);
 		}else{
 			resultMap.put("code", "0");
 		}
 		
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	
	
	private static List toList(String jsonString, Class cla) {
		jsonString=jsonString.replaceAll("\"\"\"\"", "\"\'\'\"");
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}
		return lists;
	}
}
