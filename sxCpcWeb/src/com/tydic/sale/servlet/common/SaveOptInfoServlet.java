package com.tydic.sale.servlet.common;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletConfig;
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
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;

@WebServlet("/comprehensive/saveOptInfo.do")
public class SaveOptInfoServlet extends AbstractServlet {

	private static final long serialVersionUID = 1107895169837504060L;

	private final static Logger logger = LoggerFactory
			.getLogger(SaveOptInfoServlet.class);

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
	}

	@Override
	protected void doPut(HttpServletRequest req, HttpServletResponse resp)
			throws ServletException, IOException {
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings({ "unchecked", "rawtypes" })
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		if (logger.isDebugEnabled()) {
			logger.debug("进入ReadJurisdictionServlet的post方法");
		}
		response.setCharacterEncoding("UTF-8");
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		Map<Object, Object> reqMap = new HashMap<Object, Object>();

		SystemUser sysUser = (SystemUser) request.getSession().getAttribute(
				SaleUtil.SYSTEMUSER);
		String userCode = sysUser.getLoginCode();
		String funId = request.getParameter("funId");
		String optAttr = request.getParameter("optAttr");
		String latnId = sysUser.getRegionId();
		String optFrom = request.getParameter("optFrom");
		String sysId = request.getParameter("sysId");

		reqMap.put("userCode", userCode);
		reqMap.put("funId", funId);
		reqMap.put("optAttr", optAttr);
		reqMap.put("latnId", latnId);
		reqMap.put("optFrom", optFrom);
		reqMap.put("sysId", sysId);

		reqMap.put("SERVER_NAME", "saveOptRecordInfo");

		Object object = request.getParameter("optAttrInfoSet");
		if (StringUtil.objIsNotEmpty(object)) {
			List<Map<String, Object>> optAttrInfoList = new ArrayList<Map<String, Object>>();
			ArrayList<Map<String, Object>> tempOptAttrInfoList = (ArrayList<Map<String, Object>>) this
					.toList(object.toString(), Map.class);
			for (Map<String, Object> tempMap : tempOptAttrInfoList) {
				Map<String, Object> optAttrInfoMap = new HashMap<String, Object>();
				optAttrInfoMap.put("optType", tempMap.get("optType"));
				optAttrInfoMap.put("optAttr", tempMap.get("optAttr"));
				optAttrInfoMap.put("optValue", tempMap.get("optValue"));
				optAttrInfoList.add(optAttrInfoMap);
			}
			reqMap.put("optAttrInfoSet", optAttrInfoList);
		}

		resultMap = crmService.dealObjectFun(reqMap);

		sendMessages(response, JSON.toJSONString(resultMap));
	}

	private List toList(String jsonString, Class cla) {
		jsonString = jsonString.replaceAll("\"\"\"\"", "\"\'\'\"");
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}
		return lists;
	}

}
