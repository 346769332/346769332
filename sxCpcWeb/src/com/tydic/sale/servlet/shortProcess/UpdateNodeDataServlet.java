package com.tydic.sale.servlet.shortProcess;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
/**
 * 更新节点信息类
 * @author dangzw
 */
@WebServlet("/shortProcess/updateNodeData.do")
public class UpdateNodeDataServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UpdateNodeDataServlet() {
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
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		String workflowId=request.getParameter("workflowId");
		String nodeId=request.getParameter("nodeId");
		String nodeExecuteDepart=request.getParameter("nodeExecuteDepart");
		String nodeExecuteDepartId=request.getParameter("nodeExecuteDepartId");
		String nodeExecutor=request.getParameter("nodeExecutor");
		String nodeExecutorId=request.getParameter("nodeExecutorId");
		String nodeExecutorTel=request.getParameter("nodeExecutorTel");
		String nodesId=request.getParameter("nodesId");
		String disposeDeptId=request.getParameter("disposeDeptId");
		String disposeJobId=request.getParameter("disposeJobId");
		String disposeDeptLevel=request.getParameter("disposeDeptLevel");
		String workflowRadioInfo=request.getParameter("workflowRadioInfo");//单选规则ID
		//处理通过动作
		String opertionAgree=request.getParameter("opertionAgree");
		//处理不通过动作
		String reject=request.getParameter("reject");
		//是否会签
		String isSignature=request.getParameter("isSignature");
		String toPrevNode="";
		String toBeginNode="";
		if(reject!=null && !reject.equals("")){
			int index=reject.indexOf(",");
			if(index==-1){
				if(reject.equals("2")){
					toPrevNode=reject;
				}else{
					toBeginNode=reject;
				}
				reqMap.put("toPrevNode", toPrevNode);
				reqMap.put("toBeginNode", toBeginNode);
			}else{
				String[] rejects=reject.split(",");
				for (int i = 0; i < rejects.length; i++) {
					toPrevNode=rejects[0];
					toBeginNode=rejects[1];
				}
				reqMap.put("toPrevNode", toPrevNode);
				reqMap.put("toBeginNode", toBeginNode);
			}
		}else{
			reqMap.put("toPrevNode", toPrevNode);
			reqMap.put("toBeginNode", toBeginNode);
		}
		String timeLimit=request.getParameter("timeLimit");
		//String operatagree=request.getParameter("operatagree");
		/*String isOrNotZhicheng=request.getParameter("isOrNotZhicheng");*/
		//String toPrevNode=request.getParameter("toPrevNode");
		//String toBeginNode=request.getParameter("toBeginNode");
		reqMap.put("SERVER_NAME", "updateNodeData");
		reqMap.put("workflowId", workflowId);
		reqMap.put("nodeId", nodeId);
		reqMap.put("nodesId", nodesId);
		reqMap.put("disposeDeptId", disposeDeptId);
		reqMap.put("disposeJobId", disposeJobId);
		reqMap.put("disposeDeptLevel", disposeDeptLevel);
		reqMap.put("nodeExecuteDepart", nodeExecuteDepart);
		reqMap.put("nodeExecuteDepartId", nodeExecuteDepartId);
		reqMap.put("nodeExecutorTel", nodeExecutorTel);
		reqMap.put("nodeExecutor", nodeExecutor);
		reqMap.put("nodeExecutorId", nodeExecutorId);
		reqMap.put("isSignature", isSignature);
		reqMap.put("workflowRadioInfo", workflowRadioInfo);
		if(timeLimit!=null){
			reqMap.put("timeLimit", timeLimit);
		}
		/*reqMap.put("isOrNotZhicheng", isOrNotZhicheng);*/
		//reqMap.put("toPrevNode", toPrevNode);
		//reqMap.put("toBeginNode", toBeginNode);
		//reqMap.put("operat_agree", operatagree);
		if(opertionAgree!=null){
			reqMap.put("opertionAgree", opertionAgree);
		}
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
		reqMap.put("nodeExecutorId", nodeExecutorId);
		if("0".equals(serMap.get("code"))){
			resultMap.put("code", "0");
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}
