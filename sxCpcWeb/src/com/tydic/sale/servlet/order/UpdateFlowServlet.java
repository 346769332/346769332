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
import com.tydic.sale.servlet.domain.Pool;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * Servlet implementation class QuerySaleOderList
 */
@WebServlet("/order/updateflowrecord.do")
public class UpdateFlowServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(UpdateFlowServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateFlowServlet() {
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
		Map<Object,Object> reqMap = null;
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
				//当前登录人的OPT_ID
			String opt_id = systemUser.getStaffId();
				//服务单号
			String  busi_id=request.getParameter("busi_id");
				//留言内容
			String opt_desc=request.getParameter("opt_desc");
			String methodtype=request.getParameter("methodtype");
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String optTime=sdf.format(new Date());//再处理时间
			if("update".equals(methodtype)){
				reqMap = new HashMap<Object, Object>();
				reqMap.put("opt_id", opt_id);
				reqMap.put("busi_id", busi_id);
				reqMap.put("opt_desc", opt_desc);
				reqMap.put("methodtype", methodtype);
			    resultMap = crmService.updateflow(reqMap);
			}else if ("query".equals(methodtype)){
				reqMap = new HashMap<Object, Object>();
				reqMap.put("methodtype", methodtype);
				reqMap.put("opt_id", opt_id);
				reqMap.put("busi_id", busi_id);
				resultMap = crmService.updateflow(reqMap);
			}else if("updateDesc".equals(methodtype)){
				reqMap = new HashMap<Object, Object>();
				reqMap.put("record_id", request.getParameter("record_id"));
				String lastDesc=String.valueOf(request.getParameter("optedDesc"));//之前的处理意见
				opt_desc=lastDesc+" * "+optTime+" 添加再处理意见："+opt_desc;
				reqMap.put("opt_desc", opt_desc);
				reqMap.put("methodtype", methodtype);
			    resultMap = crmService.updateflow(reqMap);
			}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
