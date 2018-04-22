package com.tydic.sale.servlet.shortProcess;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
/**
 * 新建会签
 * @author shanglei 2017-01-09
 */
@WebServlet("/shortProcess/addWorkflowSign.do")
public class AddWorkflowSignServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public AddWorkflowSignServlet() {
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
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);

		/**********************************流程信息begin******************************************/
				//需求ID
		        String demandId = request.getParameter("demandId");
				//流程ID
		        String workflowId = request.getParameter("workflowId");
				//会签处理处理人ID
				String chulirenid2 = request.getParameter("chulirenid2");
				//会签处理人名称
				String chulirenname2 = request.getParameter("chulirenname2");
				//会签处理人部门ID
				String chulideptid2 = request.getParameter("chulideptid2");
				//会签处理人部门名称
				String chulideptname2 = request.getParameter("chulideptname2");
				//任务ID
				String taskId=request.getParameter("taskId");
				//当前会签处理人ID
				String chulirenid1 =systemUser.getStaffId();
				//当前会签处理人名称
				String chulirenname1 = systemUser.getStaffName();
				//当前会签处理人部门ID
				String chulideptid1 = systemUser.getOrgId();
				//当前会签处理人部门名称
				String chulideptname1 = systemUser.getOrgName();
				//当前节点ID
				String now_node_id=request.getParameter("now_node_id");
				/**********************************参数存入map******************************************/
				Map<Object,Object> reqMap = new HashMap<Object, Object>();
				reqMap.put("demandId", demandId);
				reqMap.put("workflowId", workflowId);
				reqMap.put("chulirenid2", chulirenid2);
				reqMap.put("chulirenname2", chulirenname2);
				reqMap.put("chulideptid2", chulideptid2);
				reqMap.put("chulideptname2", chulideptname2);
				reqMap.put("taskId", taskId);
				reqMap.put("chulirenid1", chulirenid1);
				reqMap.put("chulirenname1", chulirenname1);
				reqMap.put("chulideptid1", chulideptid1);
				reqMap.put("chulideptname1", chulideptname1);
				reqMap.put("now_node_id", now_node_id);	
				reqMap.put("SERVER_NAME", "addWorkflowSign");
				Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
				String code=String.valueOf(serMap.get("code"));
				if(StringUtil.isNotEmpty(code) && code.equals("0")){
					Map<Object,Object> resultMap = new HashMap<Object, Object>();
					resultMap.put("code", "0");
					//往前台发送消息
					super.sendMessages(response, JSON.toJSONString(resultMap));
				}
			}
}
