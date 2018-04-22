package com.tydic.sale.servlet.app;

import java.io.IOException;
import java.util.HashMap;
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

@WebServlet("/app/searchDeptmentInfo.do")
public class SearchDeptmentInfoServlet extends AbstractServlet{
	private final static Logger logger = LoggerFactory
			.getLogger(SubmitStarEvalServlet.class);
	private static final long serialVersionUID = 1L;
	
	public SearchDeptmentInfoServlet(){
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
		SystemUser systemUser = 
				(com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		reqParamMap.put("staff_id", systemUser.getStaffId());
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		//查询
		if(reqParamMap.get("hanleType").equals("queryDeptmentInfo")) {
			Map<Object,Object> respMap = super.crmService.searchDeptmentInfo(reqParamMap);
			resultMap.put("code", "1");
			if("0".equals(respMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("deptInfo", respMap.get("deptInfo"));
			}
		}else if(reqParamMap.get("hanleType").equals("queryIndexInfo")) {
			Map<Object,Object> respMap = super.crmService.searchIndexInfo(reqParamMap);
			resultMap.put("code", "1");
			if("0".equals(respMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("indexInfo", respMap.get("indexInfo"));
			}
		}else if(reqParamMap.get("hanleType").equals("updateAssessInfo")) {
			/*Map<Object,Object> resMap = new HashMap<Object, Object>();
			resMap.put("staff_id", reqParamMap.get("staff_id"));
			String indexObj=(String) reqParamMap.get("index_id");
			String pgValueObj=(String) reqParamMap.get("pg_value");
			for(int i=0; i<indexObj.split(",").length; i++) {
				resMap.put("index_id", indexObj.split(",")[i]);
				resMap.put("pg_value", pgValueObj.split(",")[i]);
			}*/
			Map<Object,Object> respMap = super.crmService.updateAssessInfo(reqParamMap);
			resultMap.put("code", "1");
			if("0".equals(respMap.get("code"))){
				resultMap.put("code", "0");
			}
		}
		super.sendMessagesApp(request,response,  resultMap);
	}
}
