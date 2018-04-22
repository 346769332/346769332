package com.tydic.sale.servlet.taskBook;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/taskBook/flowTaskBook.do")
public class FlowTaskBookServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(FlowTaskBookServlet.class);
	
	public FlowTaskBookServlet() {
		super();
	}
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException{
		this.doPost(request, response);
	}
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException{
		Map<Object,Object> resultMap=new HashMap<Object,Object>();
		SystemUser sysUser=(SystemUser)request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		Map<Object,Object> reqMap=new HashMap<Object,Object>();
		String optRet=String.valueOf(request.getParameter("optRet"));
		reqMap.put("task_code", request.getParameter("busi_id"));
		reqMap.put("optRet", optRet);
		reqMap.put("optDesc", request.getParameter("optDesc"));
		reqMap.put("promoters_id", request.getParameter("promoters_id"));
		reqMap.put("promoters_name", request.getParameter("promoters_name"));
		reqMap.put("record_id", request.getParameter("record_id"));
		reqMap.put("opt_time", request.getParameter("opt_time"));
		reqMap.put("staffId", sysUser.getStaffId());
		reqMap.put("staffName", sysUser.getStaffName());
		List<Map> roleList=sysUser.getRoleLst();
		String roleId="";
		for(Map map:roleList){
			String role_id=String.valueOf(map.get("role_id"));
			if("160000613".equals(role_id)){//经理
				roleId="160000613";
			}else if("160000614".equals(role_id)){//副经理
				roleId="160000614";
			}
		}
		String funTypeId="";
		if("pass".equals(optRet)&&"160000613".equals(roleId)){//经理审批通过
			funTypeId="100119";
		}else if("pass".equals(optRet)&&"160000614".equals(roleId)){//副经理审批通过
			funTypeId="100117";
		}else if("nopass".equals(optRet)&&"160000613".equals(roleId)){//经理审批不通过
			funTypeId="100120";
		}else if("nopass".equals(optRet)&&"160000614".equals(roleId)){//副经理审批不通过
			funTypeId="100118";
		}else if("againSend".equals(optRet)){
			funTypeId="100121";
		}
		reqMap.put("funTypeId", funTypeId);
		reqMap.put("SERVER_NAME", "flowTaskBook");
		resultMap = crmService.dealObjectFun(reqMap);
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
