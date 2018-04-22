package com.tydic.sale.servlet.policyManual;

import java.io.IOException;
import java.util.ArrayList;
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
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.utils.StringUtil;

@WebServlet("/policyManual/deletePolicyManual.do")
public class DeletePolicyManualServlet extends AbstractServlet {
		/**
		 * 
		 */
		private static final long serialVersionUID = 1L;
		private final static Logger logger = LoggerFactory.getLogger(DeletePolicyManualServlet.class);
		
		/**
		 * @see HttpServlet#HttpServlet()
		 */
		public DeletePolicyManualServlet() {
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
			Map<Object,Object> serMap =new HashMap<Object, Object>();
			resultMap.put("code", "1");
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("policyId",request.getParameter("policyID"));
			String policyId=request.getParameter("policyID");
			List list=new ArrayList();
			if(StringUtil.isNotEmpty(policyId) && policyId.indexOf(",")!=-1){
				String[] arr= policyId.split(",");
				for (int i = 0; i < arr.length; i++) {
					if(StringUtil.isNotEmpty(arr[i]) && arr[i].length()>0){
						Map idMap=new HashMap<String, String>();
						idMap.put("policyId", arr[i]);
						list.add(idMap);
					}
				}
			}
			reqMap.put("policyIdSet", list);
			
			String type = request.getParameter("type");
			if("delete".equals(type)){
				serMap = crmService.deletePolicyManual(reqMap);
			}else if("release".equals(type)){
				serMap = crmService.releasePolicyManual(reqMap);
			}
			resultMap.putAll(serMap);
			super.sendMessages(response, JSON.toJSONString(resultMap));
				
		}
}
