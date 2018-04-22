package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.ArrayList;
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
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/cpc/queryLatnData.do")
public class QueryLatnDataServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(QueryLatnDataServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryLatnDataServlet() {
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
		//查询字典表数据
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		try{
			// 获取员工基本信息
			SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
			resultMap = crmService.getLatnData(reqMap);
			List<Map<String,Object>> latnLst = new ArrayList<Map<String,Object>>();
			List<Map<String,Object>> latnMapLst = new ArrayList<Map<String,Object>>();
			
			latnMapLst = (List<Map<String, Object>>) resultMap.get("latnSet");
			if(!"888".equals(systemUser.getRegionId())){
				if(!Tools.isNull(resultMap) && latnMapLst.size() > 0){
					for(Map map : latnMapLst){
						if(systemUser.getRegionId().equals(String.valueOf(map.get("REGION_ID")))){
							latnLst.add(map);
							break;
						}
					}
				} 
				resultMap.put("latnSet", latnLst);
			}
			
			
			resultMap.put("orgid", systemUser.getRegionId());
			resultMap.put("code", "0");
		}catch (Exception e) {
			resultMap.put("code", "1");
			resultMap.put("msg", "查询本地网数据异常:"+e);
		}
//		resultMap.put("currUser", this.getSysInstance(request));
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
