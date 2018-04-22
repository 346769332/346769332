package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/app/qryDeptAndStaffInfo.do")
public class QryDeptAndStaffInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(QryDeptAndStaffInfoServlet.class);
	private static final long serialVersionUID = 1L;

	public QryDeptAndStaffInfoServlet() {
		super();
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

        HttpSession session = request.getSession();
        SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		String hanleType = (String) reqParamMap.get("hanleType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		if("qryDeptOrStaffInfo".equals(hanleType)){
			reqParamMap.put("promoters_id", systemUser.getStaffId());
			//查询
			Map<Object,Object> resMap = super.crmService.dealDeptAndStaffInfo(reqParamMap);
		    if("0".equals(resMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("deptInfo", resMap.get("deptInfo"));
			}
		}else if("insertScoreInfo".equals(hanleType)){
			Map<Object,Object> reqFileMap  = super.getReqParamMap(request);
			reqParamMap.put("promoters_id", systemUser.getStaffId());
			reqParamMap.put("arrayFileInfo", reqFileMap.get("arrayFileInfo"));
			Map<Object,Object> resMap = super.crmService.dealDeptAndStaffInfo(reqParamMap);
			if("0".equals(resMap.get("code"))){
				resultMap.put("code", "0");
			}
		}else if("checkEval".equals(hanleType)){
			reqParamMap.put("promoters_id", systemUser.getStaffId());
			Map<Object,Object> resMap = super.crmService.dealDeptAndStaffInfo(reqParamMap);
			if("0".equals(resMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", resMap.get("data"));
			}
		}
		super.sendMessagesApp(request, response, resultMap);
	}
}
