package com.tydic.sale.servlet.comprehensive;

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

import org.apache.shiro.crypto.hash.Sha512Hash;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

/**
 * Servlet implementation class QuerySaleOderList
 */
@WebServlet("/comprehensive/pwdUpdate.do")
public class PwdUpdateServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(PwdUpdateServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PwdUpdateServlet() {
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
		String handleType = request.getParameter("handleType"); //操作类型
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		if("init".equals(handleType)){
			resultMap.put("loginCode", systemUser.getLoginCode());
			resultMap.put("passWord",systemUser.getPassWord());
		}else if("pwdCheck".equals(handleType)){
			String passWord = request.getParameter("passWord").trim();
			passWord = new Sha512Hash(passWord).toBase64();
			if(passWord.equals(systemUser.getPassWord())){
				resultMap.put("flag", true);
			}else{
				resultMap.put("flag", false);
			}
		}else if("pwdUpdate".equals(handleType)){
			String passWord = request.getParameter("passWord").trim();
			passWord = new Sha512Hash(passWord).toBase64();
			Map<Object,Object> reqMap = new HashMap<Object,Object>();
			reqMap.put("passWord", passWord);
			reqMap.put("staffId", systemUser.getStaffId());
			resultMap = crmService.updatePwd(reqMap);
			if("0".equals(resultMap.get("code"))){
				systemUser.setPassWord(passWord);
			}
		}
		sendMessages(response, JSON.toJSONString(resultMap));
	}
}
