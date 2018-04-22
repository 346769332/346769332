package com.tydic.sale.servlet.leadStroke;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.HttpClientUtil;
import com.tydic.sale.utils.JSONUtil;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/leadStroke/commonLeadStroke.do")
public class CommonLeadStrokeServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(CommonLeadStrokeServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public CommonLeadStrokeServlet() {
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
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String methodType = request.getParameter("methodType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		if("sendSaveLeadStrokeInfo".equals(methodType)) {//从新增发布or保存草稿
			reqMap.put("dataArr",   request.getParameter("dataArr"));//行程内容及时间等信息集合	
			reqMap.put("ascriptionLaedId",   request.getParameter("ascriptionLaedId"));//领导ID
			reqMap.put("ascriptionLaedName",   request.getParameter("ascriptionLaedName"));//领导名称
			reqMap.put("ascriptionLaedPosition",   request.getParameter("ascriptionLaedPosition"));//领导职务
			reqMap.put("startDate",   request.getParameter("startDate"));//标题
			reqMap.put("endDate",   request.getParameter("endDate"));//标题
			reqMap.put("headlineInfo",   request.getParameter("headlineInfo"));//标题
			if("send".equals(request.getParameter("saveType"))){
				reqMap.put("laedStrokeStatus",   0);//行程状态  0：草稿 1：发布
			}else if("submit".equals(request.getParameter("saveType"))){
				reqMap.put("laedStrokeStatus",   1);//行程状态  0：草稿 1：发布
			}
			reqMap.put("staff_Id",  systemUser.getStaffId());//填写人ID
			reqMap.put("staff_Name",  systemUser.getStaffName());//填写人姓名
			reqMap.put("SERVER_NAME", "sendSaveLeadStrokeInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
			}
		}else if("submitLeadStrokeInfo".equals(methodType)){//从草稿箱发布
			reqMap.put("dataArr",   request.getParameter("dataArr"));//行程内容及时间等信息集合	
			reqMap.put("ascriptionLaedId",   request.getParameter("ascriptionLaedId"));//领导ID
			reqMap.put("ascriptionLaedName",   request.getParameter("ascriptionLaedName"));//领导名称
			reqMap.put("ascriptionLaedPosition",   request.getParameter("ascriptionLaedPosition"));//领导职务
			reqMap.put("headlineInfo",   request.getParameter("headlineInfo"));//标题
			reqMap.put("startDate",   request.getParameter("startDate"));//标题
			reqMap.put("endDate",   request.getParameter("endDate"));//标题
			if("send".equals(request.getParameter("saveType"))){
				reqMap.put("laedStrokeStatus",   0);//行程状态  0：草稿 1：发布
			}else if("submit".equals(request.getParameter("saveType"))){
				reqMap.put("laedStrokeStatus",   1);//行程状态  0：草稿 1：发布
			}
			reqMap.put("staff_Id",  systemUser.getStaffId());//填写人ID
			reqMap.put("staff_Name",  systemUser.getStaffName());//填写人姓名
			reqMap.put("SERVER_NAME", "submitLeadStrokeInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
			}
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	
}
