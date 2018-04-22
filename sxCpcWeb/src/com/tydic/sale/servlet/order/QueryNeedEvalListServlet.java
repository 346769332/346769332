package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.util.Calendar;
import java.util.HashMap;
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
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;

@WebServlet("/order/queryNeedEvalList.do")
public class QueryNeedEvalListServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(QueryNeedEvalListServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public QueryNeedEvalListServlet() {
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
//		String queryType = request.getParameter("queryType");// 查询类型
//		String queryStatusCd = request.getParameter("queryStatusCd");//查询状态
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("optId",systemUser.getStaffId());
		reqMap.put("department_id",systemUser.getOrgId());
		reqMap.put("latnId",systemUser.getRegionId());
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize", pageSize);
		String overLimitBeginDate = request.getParameter("overLimitBeginDate");//办结开始时间
		String overLimitEndDate = request.getParameter("overLimitEndDate");//办结结束时间
		if(!StringUtils.isEmpty(overLimitBeginDate)){
			overLimitBeginDate =   String.valueOf(overLimitBeginDate+" 00:00:00") ;
		}
		if(!StringUtils.isEmpty(overLimitEndDate)){
			overLimitEndDate =   String.valueOf(overLimitEndDate+" 23:59:59") ;
		}
		reqMap.put("overLimitBeginDate", overLimitBeginDate);
		reqMap.put("overLimitEndDate", overLimitEndDate);
		String demandType = request.getParameter("demandType");
		reqMap.put("demandType", demandType);
		String demandId = request.getParameter("demandId");
		reqMap.put("demandId", demandId);
		Map<Object,Object> serMap = crmService.queryNeedEvalList(reqMap);
		resultMap.put("code", "1");
		if("0".equals(serMap.get("code"))){
			resultMap.put("optId",systemUser.getRegionId());
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("list"));
			resultMap.put("totalSize", serMap.get("sum"));
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
