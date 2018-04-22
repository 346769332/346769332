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
import com.tydic.sale.utils.Tools;

@WebServlet("/order/saveDemand.do")
public class SaveDemandServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SaveDemandServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SaveDemandServlet() {
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
		
		Map<Object,Object> demandInfo = new HashMap<Object,Object>();
		String handleType = request.getParameter("handleType");//操作类型
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		demandInfo.put("region_code", systemUser.getRegionCode());
		//获取需求单ID
		if("getDemandId".equals(handleType)){
			Map<Object,Object> demandIdMap = crmService.getDemandId(new HashMap<Object, Object>());
			String demandId = (String) demandIdMap.get("demandId");
			if(!Tools.isNull(demandId)){
				resultMap.put("code", "0");
				String appId = "";
				int index=4;
				for(int i = 0; i< (index - demandId.length());i++){
					appId = appId+"0";
				};
				demandId = appId+demandId;
				SimpleDateFormat dfs = new SimpleDateFormat("yyMMddHH");
				Date nowTime = new Date();
				String date = dfs.format(nowTime);
				resultMap.put("demandId", "D"+date+demandId);
				resultMap.put("org_name", systemUser.getOrgName());
			}else{
				resultMap.put("code", "1");
			}
			
		}else if("submitDem".equals(handleType)){
			 demandInfo.put("demand_theme", request.getParameter("demand_theme"));
			 demandInfo.put("demand_details", request.getParameter("medDetail"));
			 demandInfo.put("demand_id", request.getParameter("demandId"));
			 demandInfo.put("promoters_id", request.getParameter("promotersId"));
			 demandInfo.put("promoters", request.getParameter("promotersName"));
			 demandInfo.put("department_id", request.getParameter("departmentId"));
			 demandInfo.put("department", request.getParameter("departmentName"));
			 demandInfo.put("tel", request.getParameter("tel"));
			 demandInfo.put("up_photo_names", "");
			 if(!Tools.isNull(request.getParameter("optId"))){//西安有接单人和发单等级
				 demandInfo.put("optId", request.getParameter("optId"));
				 demandInfo.put("optName", request.getParameter("optName"));
				 demandInfo.put("rankId", request.getParameter("rankId"));
				 demandInfo.put("rankName", request.getParameter("rankName"));
			 }
			 resultMap = super.crmService.submitDemandInfo(demandInfo, "1");
			 //工单提交成功后，保存附件
			 if("0".equals(resultMap.get("code"))){
				 String fileListInfo=String.valueOf(request.getParameter("fileList"));
				 List<Map<Object,Object>> fileList=new ArrayList<Map<Object,Object>>();
				 if(!Tools.isNull(fileListInfo)){
					 fileList=this.toList(fileListInfo, Map.class);
					 for(Map<Object,Object> map:fileList){
							map.put("SERVER_NAME", "uploadDemandImages");
							crmService.dealObjectFun(map);
					 }
				 }
			 }
		}else if("save".equals(handleType)){
			 demandInfo.put("demand_theme", request.getParameter("demand_theme"));
			 demandInfo.put("demand_details", request.getParameter("medDetail"));
			 demandInfo.put("demand_id", request.getParameter("demandId"));
			 demandInfo.put("promoters_id", request.getParameter("promotersId"));
			 demandInfo.put("promoters", request.getParameter("promotersName"));
			 demandInfo.put("department_id", request.getParameter("departmentId"));
			 demandInfo.put("department", request.getParameter("departmentName"));
			 demandInfo.put("tel", request.getParameter("tel"));
			 demandInfo.put("up_photo_names", "");
			 if(!Tools.isNull(request.getParameter("optId"))){
				 demandInfo.put("optId", request.getParameter("optId"));
				 demandInfo.put("optName", request.getParameter("optName"));
				 demandInfo.put("rankId", request.getParameter("rankId"));
				 demandInfo.put("rankName", request.getParameter("rankName"));
			 }
			 resultMap = super.crmService.submitDemandInfo(demandInfo, "2");
		}else if("draftsend".equals(handleType)){
			 demandInfo.put("demand_theme", request.getParameter("demand_theme"));
			 demandInfo.put("demand_details", request.getParameter("medDetail"));
			 demandInfo.put("demand_id", request.getParameter("demandId"));
			 demandInfo.put("promoters_id", request.getParameter("promotersId"));
			 demandInfo.put("promoters", request.getParameter("promotersName"));
			 demandInfo.put("department_id", request.getParameter("departmentId"));
			 demandInfo.put("department", request.getParameter("departmentName"));
			 demandInfo.put("tel", request.getParameter("tel"));
			 demandInfo.put("up_photo_names", "");
			 if(!Tools.isNull(request.getParameter("optId"))){
				 demandInfo.put("optId", request.getParameter("optId"));
				 demandInfo.put("optName", request.getParameter("optName"));
				 demandInfo.put("rankId", request.getParameter("rankId"));
				 demandInfo.put("rankName", request.getParameter("rankName"));
			 }
			 resultMap = super.crmService.submitDemandInfo(demandInfo, "3");
			//工单提交成功后，保存附件
			 if("0".equals(resultMap.get("code"))){
				 String fileListInfo=String.valueOf(request.getParameter("fileList"));
				 List<Map<Object,Object>> fileList=new ArrayList<Map<Object,Object>>();
				 if(!Tools.isNull(fileListInfo)){
					 fileList=this.toList(fileListInfo, Map.class);
					 for(Map<Object,Object> map:fileList){
							map.put("SERVER_NAME", "uploadDemandImages");
							crmService.dealObjectFun(map);
					 }
				 }
			 }
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
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
