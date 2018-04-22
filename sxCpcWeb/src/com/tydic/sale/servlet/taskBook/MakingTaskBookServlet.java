package com.tydic.sale.servlet.taskBook;

import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
@WebServlet("/taskBook/qryModelList.do")
public class MakingTaskBookServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(MakingTaskBookServlet.class);
	
	public MakingTaskBookServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		SystemUser systemUser=(SystemUser)request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String optId=systemUser.getStaffId();
		String latn_id=systemUser.getRegionId();
		String handleType = request.getParameter("handleType");
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		String nowTime=sdf.format(new Date());
		nowTime=nowTime.substring(0, 4);//只取年份
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
        if("qryModelList".equals(handleType)){//查询列表
        	String year = request.getParameter("year");
    		String taskType=request.getParameter("taskType");
    		String taskState=request.getParameter("taskState");
        	reqMap.put("taskType", taskType);
        	reqMap.put("taskState", taskState);
        	if(Tools.isNull(year)){
        		year=nowTime;//默认展示当前年份的责任书
        	}
        	reqMap.put("year", year);
        	reqMap.put("latn_id", latn_id);
        	reqMap.put("SERVER_NAME", "qryTaskModelList");
    		resultMap = crmService.dealObjectFun(reqMap);
		}else if("releaseTask".equals(handleType)){//责任书发布
			String modelId=String.valueOf(request.getParameter("modelId"));
			reqMap.put("modelId", modelId);
			reqMap.put("SERVER_NAME", "releaseTaskBook");
			resultMap = crmService.dealObjectFun(reqMap);
		}
		
		super.sendMessages(response, JSON.toJSONString(resultMap));


	}
}
