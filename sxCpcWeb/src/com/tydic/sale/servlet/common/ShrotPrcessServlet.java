package com.tydic.sale.servlet.common;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.net.URL;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import net.sf.json.JSONArray;

import org.apache.zk.ZKUtil;

import bea.jolt.ServiceException;

import com.alibaba.fastjson.JSON;
import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.FtpClientUtil;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.Tools;
import com.tydic.sale.utils.water.CreatePngUtils;
import com.tydic.sale.utils.water.WaterMarkUtilOffice;
import com.tydic.sale.utils.water.WaterMarkUtilPDF;

@WebServlet("/sale/shrotPrcess.do")
public class ShrotPrcessServlet extends AbstractServlet {
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
	 *      response) 短流程相关接口
	 */
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		response.setCharacterEncoding("UTF-8");
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session
				.getAttribute(SaleUtil.SYSTEMUSER);
		// 公共参数 --区分流转接口
		Map<Object, Object> reqParamMap = super.getReqParamMap(request);
		int handleTypes = (Integer) reqParamMap.get("handleType");
		String handleType = "" + handleTypes + "";
		Map<Object, Object> resultMap = new HashMap<Object, Object>();
		
		 if ("2005".equals(handleType)) {// 查询短流程需求列表
			/********************************** 查询短流程需求列表 ******************************************/
			// 需求编号
			String demandCode =  (String)reqParamMap.get("demandCode");
			// 需求名称
			String demandName =  (String)reqParamMap.get("demandName");
			// 所属短流程名称
			String workflowName = (String)reqParamMap.get("workflowName");
			String staffId = systemUser.getStaffId();
			Map<Object, Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("demandCode", demandCode);
			reqMap.put("demandName", demandName);
			reqMap.put("promoters", workflowName);
			reqMap.put("pagenum", reqParamMap.get("limit"));
			reqMap.put("pagesize", reqParamMap.get("pageSize"));
			reqMap.put("staffId", staffId);
			reqMap.put("latn_id", systemUser.getRegionId());
			reqMap.put("flags", reqParamMap.get("flags"));
			reqMap.put("is_evaluate", reqParamMap.get("is_evaluate")); //是否评价
			Map<Object, Object> demandMap = null;
			demandMap = crmService.queryDemandList(reqMap);
			String code = String.valueOf(demandMap.get("code"));
			if (StringUtil.isNotEmpty(code) && code.equals("0")) {
				resultMap.put("code", "0");
				resultMap.put("staffId", staffId);
				resultMap.put("data", demandMap.get("list"));
				resultMap.put("totalSize", demandMap.get("sum"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		} else if ("2006".equals(handleType)) {// 查询历史短流程需求列表
			/********************************** 查询历史短流程需求列表 ******************************************/
			// 需求编号
			String demandCode = (String)reqParamMap.get("demandCode");
			// 需求名称
			String demandName =  (String)reqParamMap.get("demandName");
			// 所属短流程名称
			String workflowName =  (String)reqParamMap.get("workflowName");

			String staffId = systemUser.getStaffId();
			Map<Object, Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("demandCode", demandCode);
			reqMap.put("demandName", demandName);
			reqMap.put("promoters", workflowName);
			reqMap.put("pagenum", reqParamMap.get("limit"));
			reqMap.put("pagesize", reqParamMap.get("pageSize"));
			Map<Object, Object> demandMap = null;
			reqMap.put("staffId", staffId);
			reqMap.put("latn_id", systemUser.getRegionId());
			demandMap = crmService.queryDemandHistoryList(reqMap);
			String code = String.valueOf(demandMap.get("code"));
			if (StringUtil.isNotEmpty(code) && code.equals("0")) {
				resultMap.put("code", "0");
				resultMap.put("staffId", staffId);
				resultMap.put("data", demandMap.get("list"));
				resultMap.put("totalSize", demandMap.get("sum"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		} else if ("2007".equals(handleType)) {
			/********************************** 催单 ******************************************/
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			// 遍历前台js传递参数
			paramMap.put("demand_id", (String) reqParamMap.get("demand_id"));
			paramMap.put("demand_name", (String) reqParamMap.get("demand_name"));
			paramMap.put("opt_id", (String) reqParamMap.get("opt_id"));
			paramMap.put("opt_name", (String) reqParamMap.get("opt_name"));
			paramMap.put("demandcode", (String) reqParamMap.get("demandcode"));
			paramMap.put("SERVER_NAME", "updatedemandinfo");
			Map<Object, Object> serMap = crmService.dealObjectFun(paramMap);
			if (serMap.get("code").equals("0")) {
				resultMap.put("code", serMap.get("code"));
				Map<Object, Object> staffSearch = new HashMap<Object, Object>();
				// 处理人Id
				staffSearch.put("staffId", paramMap.get("opt_id").toString());
				// 处理人信息
				staffSearch = this.crmService.getStaffInfo(staffSearch);
				// ####################催单发短信
				if (!String.valueOf(staffSearch.get("code")).equals("0")) {
					resultMap.put("cuo",
							"未能发送短信通知处理人，用户：“" + paramMap.get("opt_name")+"”的登录账号信息未查到，请联系管理员");
				} else {
					// 处理人信息接受
					Map<Object, Object> staff = (java.util.Map<Object, Object>) staffSearch.get("staff");
					// ######登录工号
					String loginCode = String.valueOf(staff.get("login_code"));
					if (!"".equals(loginCode)) {
						Map<Object, Object> smsMap = new HashMap<Object, Object>();
						smsMap.put("busiNum", staff.get("mob_tel"));
						smsMap.put("busiId", paramMap.get("demandcode"));
						smsMap.put("loginCode", loginCode);
						smsMap.put("smsModelId", "DEMAND-CUIDAN");
						smsMap.put("demandTheme", paramMap.get("demand_name"));
						crmService.sendSms(smsMap);
					} else {
						resultMap.put("cuo","未能发送短信通知处理人，用户：“" +paramMap.get("opt_name")+ "”的登录账号信息未查到，请联系管理员");
					}
				}
			} else {
				resultMap.put("code", "1");
				resultMap.put("cuo", "催单异常");
			}
		} else if ("2008".equals(handleType)) {
			/********************************** 评价 ******************************************/
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			String staffid = systemUser.getStaffId();
			String staffname = systemUser.getStaffName();
			paramMap.put("staffId", staffid);
			paramMap.put("staffName", staffname);
			paramMap.put("demand_Code", (String) reqParamMap.get("demand_Code"));
			paramMap.put("starNum", (String) reqParamMap.get("starNum"));
			paramMap.put("evalDesc", (String) reqParamMap.get("evalDesc"));
			paramMap.put("demandId", (String) reqParamMap.get("demandId"));
			paramMap.put("workflowId", (String) reqParamMap.get("workflowId"));
			paramMap.put("SERVER_NAME", "addEvalInfo");
			Map<Object,Object> serMap=crmService.dealObjectFun(paramMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("staffId", staffid);
				resultMap.put("staffName", staffname);
				resultMap.put("code", "0");
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者

			}
		} else if ("2009".equals(handleType)) {
			/*********************************** 获取短流程配置信息列表 *****************************************/
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			paramMap.put("minSize", reqParamMap.get("limit"));
			paramMap.put("maxSize", reqParamMap.get("pageSize"));
			paramMap.put("latnId", systemUser.getRegionId());
			paramMap.put("workflowState",reqParamMap.get("workflowState"));
			paramMap.put("dataSource", "");
			paramMap.put("handleType", "qryLst");
			paramMap.put("nameSpace", "shortProcess");
			paramMap.put("sqlName", "qryWorkFlowListPage_fun");
			// 走公共方法去查节点数据
			paramMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			//resultMap = this.crmService.commonMothed(paramMap);
			Map<Object, Object> serMap = crmService.commonMothed(paramMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("data"));
				resultMap.put("totalSize", serMap.get("sum"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}

		} else if ("2010".equals(handleType)) {
			/*********************************** 获取短流程配置信息详细信息 *****************************************/
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			String workflowId = (String)reqParamMap.get("workflowId");
			paramMap.put("SERVER_NAME", "getOneWorkflowData");
			paramMap.put("workflowId", workflowId);
			Map<Object, Object> serMap = crmService.dealObjectFun(paramMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者

			}
		} else if ("2011".equals(handleType)) {
			/*********************************** 获取短流程内在途短流程内步骤详细信息 *****************************************/
			// ----------------节点步骤
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
//			String workflowId = request.getParameter("workflowId");//需求ID
//			String demandId = request.getParameter("demandId");//流程ID
			String workflowId = (String) reqParamMap.get("workflowId");
			String demandId =  (String) reqParamMap.get("demandId");
			// 节点ID
			paramMap.put("demandId", demandId);
			paramMap.put("workflowId", workflowId);
			paramMap.put("dataSource", "");;
			paramMap.put("handleType", "qryLst");
			paramMap.put("nameSpace", "shortProcess");
			paramMap.put("sqlName", "queryshortp_sum");
			// 走公共方法去查节点数据
			paramMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
			resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
		} 
		else if ("2012".equals(handleType)) {
			/**********************************APP发起需求******************************************/
			//获取需求ID
			Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
			reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
			Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
			List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
			//本地网
			String latnId=systemUser.getRegionId();
			String latnName=systemUser.getRegionName();
			
			//需求ID
	        String type=(String)reqParamMap.get("type");
	       

			//需求名称
			String demandName=(String)reqParamMap.get("demandName");
			//需求状态
			String demandState="1000";
			//需求编码
			String demandCode=(String) list.get(0).get("WORKFLOWNEEDCODE");		
			//需求描述
			String demandDesc=(String)reqParamMap.get("demandDesc");
			//所属短流程ID
			String workflowId=(String)reqParamMap.get("workflowId");
			//是否超时
			String isNotTime="0";
			//需求结束流转时间 
			
			//需求发起人ID
			String StaffId = systemUser.getStaffId();
			//需求发起人名称
			String StaffName = systemUser.getStaffName();
			//需求发起人名称
			String phone = (String)reqParamMap.get("phone");
			//是否平价
			String isNotPingJia="0";

			/**********************************需求任务******************************************/
			//任务ID
			int questId=(Integer) list.get(0).get("QUESTID");
			//节点ID1
			String node1 =reqParamMap.get("now_node_id").toString();
			//节点ID2
			String node2 = reqParamMap.get("next_node_id").toString();
			//处理人ID1
			String chulirenid1 = systemUser.getStaffId(); 
			//处理人ID2
			String chulirenid2 = (String)reqParamMap.get("operator_Id");
			//处理人名称1
			String chulirenname1 = systemUser.getStaffName(); 
			//处理人名称2
			String chulirenname2 =(String)reqParamMap.get("operator_Name");
			//处理人部门ID1
			String chulideptid1 = systemUser.getOrgId(); 
			//处理人部门ID2
			String chulideptid2 = (String)reqParamMap.get("operator_dept_Id");
			//处理人部门名称1
			String chulideptname1 = systemUser.getOrgName(); 
			//处理人部门名称2
			String chulideptname2 = (String)reqParamMap.get("operator_dept_Name");
			//任务类型
			String questtype=(String)reqParamMap.get("questtype");
			
			//处理人被授权人ID2
			String ear_chulirenid2 = (String)reqParamMap.get("ear_chulirenid2");
			//处理人被授权人名称2
			String ear_chulirenname2 = (String)reqParamMap.get("ear_chulirenname2");
			//处理人被授权人部门ID2
			String ear_chulideptid2 = (String)reqParamMap.get("ear_chulideptid2");
			//处理人被授权人名称2
			String ear_chulideptname2 = (String)reqParamMap.get("ear_chulideptname2");
			//模板属性
			String attrName=(String)reqParamMap.get("attrName");
			String attrId=(String)reqParamMap.get("attrId");
			String attrOname=(String)reqParamMap.get("attrOname");
			String attrValue=(String)reqParamMap.get("attrValue");
			String templateId=(String)reqParamMap.get("templateId");
			//加上附件删除的内容
			String oldfilepaths=(String)reqParamMap.get("oldfilepaths");
			String oldOtherFileNames=(String)reqParamMap.get("oldOtherFileNames");
			String start_type=(String)reqParamMap.get("start_type");
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("latnId", latnId);
			reqMap.put("latnName", latnName);
			
			reqMap.put("demandName", demandName);
			reqMap.put("demandState", demandState);
			reqMap.put("demandCode", demandCode);
			reqMap.put("demandDesc", demandDesc);
			reqMap.put("workflowId", workflowId);
			reqMap.put("isNotTime", isNotTime);
			reqMap.put("StaffId", StaffId);
			reqMap.put("StaffName", StaffName);
			reqMap.put("phone", phone);
			reqMap.put("isNotPingJia", isNotPingJia);
			reqMap.put("questId", questId);
			reqMap.put("node1", node1);
			reqMap.put("node2", node2);
			reqMap.put("now_node_id", node1);
			reqMap.put("chulirenid1", chulirenid1);
			reqMap.put("chulirenid2", chulirenid2);
			reqMap.put("chulirenname1", chulirenname1);
			reqMap.put("chulirenname2", chulirenname2);
			reqMap.put("chulideptid1", chulideptid1);
			reqMap.put("chulideptid2", chulideptid2);
			reqMap.put("chulideptname1", chulideptname1);
			reqMap.put("chulideptname2", chulideptname2);
			reqMap.put("questtype", questtype);
			reqMap.put("type", type);
			
			reqMap.put("ear_chulirenid2", ear_chulirenid2);
			reqMap.put("ear_chulirenname2", ear_chulirenname2);
			reqMap.put("ear_chulideptid2", ear_chulideptid2);
			reqMap.put("ear_chulideptname2", ear_chulideptname2);
			
			reqMap.put("templateId", templateId);
			reqMap.put("attrValue", attrValue);
			reqMap.put("attrId", attrId);
			reqMap.put("attrOname", attrOname);
			reqMap.put("attrName", attrName);
			
			reqMap.put("latn_id", systemUser.getRegionId());
			if(start_type.equals("update")){
			reqMap.put("SERVER_NAME", "updateWorkflowNeed");	
			 String demandId=(String)reqParamMap.get("demandId");
			 reqMap.put("demandId", demandId);
			}else{
			reqMap.put("SERVER_NAME", "addWorkflowNeed");
			 int demandId=(Integer)reqParamMap.get("demandId");
			 reqMap.put("demandId", demandId);
			}
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
				//成功后，如果删除过附件，在这里进行处理
				if(oldOtherFileNames!=null&&!oldOtherFileNames.equals("")){
					oldOtherFileNames=oldOtherFileNames.substring(0,oldOtherFileNames.length()-1);
					oldfilepaths=oldfilepaths.substring(0,oldfilepaths.length()-1);
					//这里连接远程服务器
					//**************************删除远程服务器文件开始***************************//
					String uppath=super.getUpLoadPath()+(String)reqParamMap.get("demandId") + "/";
					String upIp=super.getUpLoadIp();
					int upPort=Integer.parseInt(super.getUpLoadPort());
					String upPassWord=super.getUpLoadPassword();
					String upUsername=super.getUpLoadUsername();
					FtpClientUtil client =new FtpClientUtil(upIp,upPort,upUsername,upPassWord,"",uppath,"290");
					client.delFiles(uppath, oldOtherFileNames);
					//**************************删除远程服务器文件结束***************************//
					
					String[] files=oldOtherFileNames.split(",");
					String[] filepath=oldfilepaths.split(",");
					for(int i=0;i<files.length;i++){
					Map<Object, Object> reqMapp = new HashMap<Object, Object>();
					String filePath = filepath[i]+files[i];
					try {
						 File file = new File(filePath);  
					      if (file.delete()) {   
							reqMapp.put("attachment_value", (String)reqParamMap.get("demandId"));
							reqMapp.put("attachment_type", "shortProcess");
							reqMapp.put("other_attachment_name", files[i]);
							reqMapp.put("SERVER_NAME", "deleteFileInfos");
							Map<Object,Object> serMapp=crmService.dealObjectFun(reqMapp);
							if ("0".equals(serMapp.get("code"))) {
								System.out.println("删除成功！"); 
								resultMap.put("code", "0");
								resultMap.put("msg", "删除成功！");
							}
					      } else {  
								resultMap.put("code", "1");
								resultMap.put("msg", "删除失败！");
					      }
					      //这里进行远程删除服务器上的文件
					      
					} catch (Exception e) {
//						System.out.println("使用 fileupload 包时发生异常 ...");
						e.printStackTrace();
						resultMap.put("code", "1");
						resultMap.put("msg", "删除失败！");
					}
					}
				}
			}

		} else if ("2013".equals(handleType)) {
			/**********************************APP发起需求所需节点ID****************************************/		
			//需求ID
	         String workflowId=(String)reqParamMap.get("workflowId");
		
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			String staffname=systemUser.getStaffName();
			String regionname=systemUser.getOrgName();
			String staffpno=systemUser.getMobTel();
			reqMap.put("workflowId", workflowId);
			reqMap.put("SERVER_NAME", "queryDemandHistoryListDetail");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("staffname", staffname);
				resultMap.put("regionname", regionname);
				resultMap.put("staffpno", staffpno);
				resultMap.put("nodeNum", serMap.get("nodeNum"));
				resultMap.put("lineNum", serMap.get("lineNum"));
				
				resultMap.put("data", serMap.get("list"));
				resultMap.put("data0", serMap.get("list0"));
				resultMap.put("data1", serMap.get("list1"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者

			}

		}else if ("2014".equals(handleType)) {
			/*********************************** APP选人模糊查询 *****************************************/
			// ----------------节点步骤
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			String name = (String) reqParamMap.get("name");
			String latnId=systemUser.getRegionId();
			if(latnId.equals("888")){
				latnId="";
			}
			// 节点ID
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("name", name);
			reqMap.put("latnId", latnId);
			reqMap.put("dataSource", "");
			reqMap.put("handleType", "qryLst");
			reqMap.put("nameSpace", "shortProcess");
			reqMap.put("sqlName", "queryChuLiName");
			// 走公共方法去查节点数据
			reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			Map<Object,Object> serMap = this.crmService.commonMothed(reqMap);
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("data"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		} else if ("2015".equals(handleType)) {
		/*********************************** APP需求id *****************************************/
		// ----------------节点步骤
		Map<Object, Object> paramMap = new HashMap<Object, Object>();
		// 节点ID
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("dataSource", "");
		reqMap.put("handleType", "qryLst");
		reqMap.put("nameSpace", "shortProcess");
		reqMap.put("sqlName", "queryWorkFlowNeedId");
		// 走公共方法去查节点数据
		reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map<Object,Object> serMap = this.crmService.commonMothed(reqMap);
		if ("0".equals(serMap.get("code"))) {
			resultMap.put("code", "0");
			resultMap.put("data", serMap.get("data"));
			resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
		}
		}else if("2017".equals(handleType)){
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("templateId",reqParamMap.get("templateId"));
			reqMap.put("SERVER_NAME", "queryDemandTemplateAttr");
			Map<Object, Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		}else if("2018".equals(handleType)){
			Map<Object, Object> paramMap = new HashMap<Object, Object>();
			// 节点ID
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			String sqlName =  (String)reqParamMap.get("sqlName");
			String handleTypecom =  (String)reqParamMap.get("handleTypecom");
			String workflowId =  (String)reqParamMap.get("workflowId");//流程ID
			String demandId =  (String)reqParamMap.get("demandId");//需求ID
			String demandCode =  (String)reqParamMap.get("demandCode");//需求Code
			String now_node_id =  (String)reqParamMap.get("now_node_id");//当前节点ID
			String start_staffId=(String)reqParamMap.get("staff_id");
			
			reqMap.put("workflowId", workflowId);
			reqMap.put("demandId", demandId);
			reqMap.put("now_node_id", now_node_id);
			reqMap.put("nodeId", reqParamMap.get("nodeId"));
			reqMap.put("dataSource", "");
			reqMap.put("handleType", handleTypecom);
			reqMap.put("nameSpace", "shortProcess");
			reqMap.put("demandCode", demandCode);
			reqMap.put("sqlName", sqlName);
			reqMap.put("staff_id", systemUser.getStaffId());
			if(sqlName.equals("queryRedNode")){
				reqMap.put("task_id", reqParamMap.get("task_id"));//当前任务ID
				reqMap.put("flag", reqParamMap.get("flag"));
			}else if(sqlName.equals("qryTaskId")){
				reqMap.put("staff_id", systemUser.getStaffId());
			}else if(sqlName.equals("qryOldNode")){
				reqMap.put("caozuo", reqParamMap.get("caozuo"));
				reqMap.put("task_id", reqParamMap.get("task_id"));
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qryPrevNode")){
				reqMap.put("task_id", reqParamMap.get("task_id"));
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qryTongJiNode")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
				reqMap.put("task_id", reqParamMap.get("task_id"));
			}else if(sqlName.equals("qryTaskNum")){
				reqMap.put("upNodeId", reqParamMap.get("upNodeId"));
				reqMap.put("task_id", reqParamMap.get("task_id"));
			}else if(sqlName.equals("getWorkflowAuthorStaffInfo")){
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
				reqMap.put("next_node_id", reqParamMap.get("next_node_id"));
			}else if(sqlName.equals("qryParallelSum")){
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
				reqMap.put("next_node_id", reqParamMap.get("next_node_id"));
			}else if(sqlName.equals("getFlowRuleToNextNodeInfo")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qryCTaskNum")){
				reqMap.put("demandId", reqParamMap.get("demandId"));
			}else if(sqlName.equals("showNowNodeDeptInfo")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qryEndNodeIdAndPrveNodeId")){
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
			}else if(sqlName.equals("qryCTaskNum")){
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
				reqMap.put("next_node_id", reqParamMap.get("next_node_id"));
			}else if(sqlName.equals("getSolveProcessList")){
				reqMap.put("staff_id", systemUser.getStaffId());
				reqMap.put("demandStatus", reqParamMap.get("demandStatus"));
				reqMap.put("workflowType", reqParamMap.get("workflowType"));
				reqMap.put("demandName", reqParamMap.get("demandName"));
			}else if(sqlName.equals("getWorkflowAuthorStaffInfo")){
				reqMap.put("next_node_id", reqParamMap.get("next_node_id"));
			}else if(sqlName.equals("queryDemandTemplateAttr")){
				reqMap.put("templateId", reqParamMap.get("templateId"));
			}else if(sqlName.equals("queryFlowRuleNextNodeInfo")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("queryTemplataInfo")){
				reqMap.put("templateId", reqParamMap.get("templateId"));
				reqMap.put("demandId", reqParamMap.get("demandId"));
			}else if(sqlName.equals("queryFlowRuleNextNodeInfo")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qrySumitLeadIdByDept")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
				reqMap.put("flag", reqParamMap.get("flag"));
			}else if(sqlName.equals("getWorkflowTrendsNodeIdAuthorStaffInfo")){
				reqMap.put("trendNodeStaff", reqParamMap.get("trendNodeStaff"));
			}else if(sqlName.equals("qrySumitLeadIdByDisDept")){//动态节点，查询下一步处理人
				reqMap.put("post_id", reqParamMap.get("post_id"));
				reqMap.put("dept_type_id", reqParamMap.get("dept_type_id"));
				reqMap.put("dept_level", reqParamMap.get("dept_level"));
				reqMap.put("workFlowTypeCode", reqParamMap.get("workFlowTypeCode"));
				reqMap.put("selectNodeId", reqParamMap.get("selectNodeId"));
				reqMap.put("flag", reqParamMap.get("flag"));
				reqMap.put("staff_id", start_staffId);
			}else if(sqlName.equals("qrySumitLeadIdByDisDeptInfo")){//动态节点使用的岗位，单位等信息查询
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
			}else if(sqlName.equals("getSolveProcessListInfo")){//在途列表明细
				reqMap.put("staff_id", systemUser.getStaffId());
				reqMap.put("demandCode", reqParamMap.get("demandCode"));
				reqMap.put("sqlName", "getSolveProcessList");
			}else if(sqlName.equals("qrySelectedRadioInfo")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
			}else if(sqlName.equals("qrySelectedRadioInfoDispose")){
				reqMap.put("nodeId", reqParamMap.get("nodeId"));
				reqMap.put("radioContentId", reqParamMap.get("radioContentId"));
				reqMap.put("workflowId", reqParamMap.get("workflowId"));
			}else if(sqlName.equals("qryRealDeptLevel")){//动态节点查询真实的层级
				reqMap.put("staff_id", reqParamMap.get("staff_id"));
				reqMap.put("selectNodeId", reqParamMap.get("selectNodeId"));
				reqMap.put("flag", reqParamMap.get("flag"));
			}

			
			// 走公共方法去查节点数据
			if(sqlName.equals("getSolveProcessList")){//这里查每个需求单对应的附件信息
				reqMap.put("SERVER_NAME", "querySolveProcessList");
				Map<Object,Object> serMap=crmService.querySolveProcessList(reqMap);
				resultMap.put("code", "1");
				if ("0".equals(serMap.get("code"))) {
					resultMap.put("code", "0");
					resultMap.put("data", serMap.get("data"));
					resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
				}
			}else{
			reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			Map<Object,Object> serMap = this.crmService.commonMothed(reqMap);
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("data"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
			}
			
		}else if("2019".equals(handleType)){	/**********************************需求******************************************/
			//获取需求ID
			Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
			reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
			Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
			List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
			/**********************************需求任务******************************************/
			//任务ID
			int questId=(Integer) list.get(0).get("QUESTID");
			//需求ID
	        String demandId = (String) reqParamMap.get("demandId");
	        //需求主题
	        String demandName = (String) reqParamMap.get("demandName");
			//流程ID
	        String workflowId = (String) reqParamMap.get("workflowId");
			//下一节点
			String node2 = reqParamMap.get("node2")+"";
			//下一节点处理人ID
			String chulirenid2 = (String) reqParamMap.get("chulirenid2");
			//下一节点处理人名称
			String chulirenname2 = (String) reqParamMap.get("chulirenname2");
			//下一节点处理人部门ID
			String chulideptid2 = (String) reqParamMap.get("chulideptid2");
			//下一节点处理人部门名称
			String chulideptname2 = (String) reqParamMap.get("chulideptname2");
			//任务类型
			String questtype=(String) reqParamMap.get("questtype");
			//日志任务ID
			int taskId=(Integer) reqParamMap.get("taskId");
			//审批结果
			String disposeRadio=(String) reqParamMap.get("disposeRadio");
			//审批意见
			String disposeDesc=(String) reqParamMap.get("disposeDesc");
			//当前节点处理人ID
			String chulirenid1 =systemUser.getStaffId();
			//当前节点处理人名称
			String chulirenname1 = systemUser.getStaffName();
			//当前节点处理人部门ID
			String chulideptid1 = systemUser.getOrgId();
			//当前节点处理人部门名称
			String chulideptname1 = systemUser.getOrgName();
			//当前节点ID
			int now_node_id=(Integer) reqParamMap.get("now_node_id");
			//处理时限
			int timeLimit=Integer.parseInt(String.valueOf(reqParamMap.get("timeLimit")));
			//是否超时
			int isEndTime=(Integer) reqParamMap.get("isEndTime");
			//催单次数
			int urgeCount=(Integer) reqParamMap.get("urgeCount");
			//催单时间
			String urgeTime =(String) reqParamMap.get("urgeTime");
			//会签标识
			String countersign=(String) reqParamMap.get("countersign");
			
			//处理人被授权人ID2
			String ear_chulirenid2 = (String)reqParamMap.get("ear_chulirenid2");
			//处理人被授权人名称2
			String ear_chulirenname2 = (String)reqParamMap.get("ear_chulirenname2");
			//处理人被授权人部门ID2
			String ear_chulideptid2 = (String)reqParamMap.get("ear_chulideptid2");
			//处理人被授权人名称2
			String ear_chulideptname2 = (String)reqParamMap.get("ear_chulideptname2");
			
			//本节点处理人ID
			String now_ear_chulirenid1 =(String)reqParamMap.get("now_ear_operator_Id");
			//本节点处理人名称
			String now_ear_chulirenname1 = (String)reqParamMap.get("now_ear_operator_Name");
			//本节点处理人部门ID
			String now_ear_chulideptid1 = (String)reqParamMap.get("now_ear_operator_dept_Id");
			//本节点处理人部门名称
			String now_ear_chulideptname1 = (String)reqParamMap.get("now_ear_operator_dept_Name");
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("questId", questId);
			reqMap.put("demandId", demandId);
			reqMap.put("demandName", demandName);
			reqMap.put("demandCode", reqParamMap.get("demandCode"));
			reqMap.put("workflowId", workflowId);
			reqMap.put("node2", node2);
			reqMap.put("chulirenid2", chulirenid2);
			reqMap.put("chulirenname2", chulirenname2);
			reqMap.put("chulideptid2", chulideptid2);
			reqMap.put("chulideptname2", chulideptname2);
			reqMap.put("questtype", questtype);
			reqMap.put("taskId", taskId);
			
			reqMap.put("disposeRadio", disposeRadio);
			reqMap.put("disposeDesc", disposeDesc);
			reqMap.put("chulirenid1", chulirenid1);
			reqMap.put("chulirenname1", chulirenname1);
			reqMap.put("chulideptid1", chulideptid1);
			reqMap.put("chulideptname1", chulideptname1);
			reqMap.put("now_node_id", now_node_id);
			reqMap.put("timeLimit", timeLimit);
			reqMap.put("isEndTime", isEndTime);
			reqMap.put("urgeCount", urgeCount);
			reqMap.put("urgeTime", urgeTime);
			reqMap.put("countersign", countersign);
			reqMap.put("latn_id", systemUser.getRegionId());
			
			if(ear_chulirenid2==null){
				reqMap.put("ear_chulirenid2", "");
				reqMap.put("ear_chulirenname2", "");
				reqMap.put("ear_chulideptid2", "");
				reqMap.put("ear_chulideptname2", "");
			}else{
				reqMap.put("ear_chulirenid2", ear_chulirenid2);
				reqMap.put("ear_chulirenname2", ear_chulirenname2);
				reqMap.put("ear_chulideptid2", ear_chulideptid2);
				reqMap.put("ear_chulideptname2", ear_chulideptname2);
			}
			
			reqMap.put("ear_chulirenid1", now_ear_chulirenid1);
			reqMap.put("ear_chulirenname1", now_ear_chulirenname1);
			reqMap.put("ear_chulideptid1", now_ear_chulideptid1);
			reqMap.put("ear_chulideptname1", now_ear_chulideptname1);
			
			reqMap.put("SERVER_NAME", "addWorkflowNeedd");
			
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		}else if("2020".equals(handleType)){
			/**********************************需求******************************************/
			//获取需求ID
			Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
			reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
			Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
			List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
			/**********************************需求任务******************************************/
			//会签是否结束标识
			String taskNums=reqParamMap.get("taskNums")+"";
			//任务ID
			int questId=(Integer) list.get(0).get("QUESTID");
			//需求ID
	        String demandId = (String) reqParamMap.get("demandId");
	        //需求主题
	        String demandName = (String) reqParamMap.get("demandName");
			//流程ID
	        String workflowId = (String) reqParamMap.get("workflowId");
			//下一节点
			String node2 = reqParamMap.get("node2")+"";
			//下一节点处理人ID
			String chulirenid2 = (String) reqParamMap.get("chulirenid2");
			//下一节点处理人名称
			String chulirenname2 = (String) reqParamMap.get("chulirenname2");
			//下一节点处理人部门ID
			String chulideptid2 = (String) reqParamMap.get("chulideptid2");
			//下一节点处理人部门名称
			String chulideptname2 = (String) reqParamMap.get("chulideptname2");
			//任务类型
			String questtype=(String) reqParamMap.get("questtype");
			//日志任务ID
			int taskId=(Integer) reqParamMap.get("taskId");
			//审批结果
			String disposeRadio=(String) reqParamMap.get("disposeRadio");
			//审批意见
			String disposeDesc=(String) reqParamMap.get("disposeDesc");
			//当前节点处理人ID
			String chulirenid1 =systemUser.getStaffId();
			//当前节点处理人名称
			String chulirenname1 = systemUser.getStaffName();
			//当前节点处理人部门ID
			String chulideptid1 = systemUser.getOrgId();
			//当前节点处理人部门名称
			String chulideptname1 = systemUser.getOrgName();
			//当前节点ID
			int now_node_id=(Integer) reqParamMap.get("now_node_id");
			//处理时限
			int timeLimit=Integer.parseInt(String.valueOf(reqParamMap.get("timeLimit")));
			//是否超时
			int isEndTime=(Integer) reqParamMap.get("isEndTime");
			//催单次数
			int urgeCount=(Integer) reqParamMap.get("urgeCount");
			//催单时间
			String urgeTime =(String) reqParamMap.get("urgeTime");
			//会签标识
			String countersign=(String) reqParamMap.get("countersign");
			
			//处理人被授权人ID2
			String ear_chulirenid2 = (String)reqParamMap.get("ear_chulirenid2");
			//处理人被授权人名称2
			String ear_chulirenname2 = (String)reqParamMap.get("ear_chulirenname2");
			//处理人被授权人部门ID2
			String ear_chulideptid2 = (String)reqParamMap.get("ear_chulideptid2");
			//处理人被授权人名称2
			String ear_chulideptname2 = (String)reqParamMap.get("ear_chulideptname2");
			
			//本节点处理人ID
			String now_ear_chulirenid1 =(String)reqParamMap.get("now_ear_operator_Id");
			//本节点处理人名称
			String now_ear_chulirenname1 = (String)reqParamMap.get("now_ear_operator_Name");
			//本节点处理人部门ID
			String now_ear_chulideptid1 = (String)reqParamMap.get("now_ear_operator_dept_Id");
			//本节点处理人部门名称
			String now_ear_chulideptname1 = (String)reqParamMap.get("now_ear_operator_dept_Name");
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("questId", questId);
			reqMap.put("demandId", demandId);
			reqMap.put("demandName", demandName);
			reqMap.put("demandCode", reqParamMap.get("demandCode"));
			reqMap.put("workflowId", workflowId);
			reqMap.put("node2", node2);
			reqMap.put("chulirenid2", chulirenid2);
			reqMap.put("chulirenname2", chulirenname2);
			reqMap.put("chulideptid2", chulideptid2);
			reqMap.put("chulideptname2", chulideptname2);
			reqMap.put("questtype", questtype);
			reqMap.put("taskId", taskId);
			reqMap.put("disposeRadio", disposeRadio);
			reqMap.put("disposeDesc", disposeDesc);
			reqMap.put("chulirenid1", chulirenid1);
			reqMap.put("chulirenname1", chulirenname1);
			reqMap.put("chulideptid1", chulideptid1);
			reqMap.put("chulideptname1", chulideptname1);
			reqMap.put("now_node_id", now_node_id);
			reqMap.put("timeLimit", timeLimit);
			reqMap.put("isEndTime", isEndTime);
			reqMap.put("urgeCount", urgeCount);
			reqMap.put("urgeTime", urgeTime);
			reqMap.put("taskNums", taskNums);
			
			if(ear_chulirenid2==null){
				reqMap.put("ear_chulirenid2", "");
				reqMap.put("ear_chulirenname2", "");
				reqMap.put("ear_chulideptid2", "");
				reqMap.put("ear_chulideptname2", "");
			}else{
				reqMap.put("ear_chulirenid2", ear_chulirenid2);
				reqMap.put("ear_chulirenname2", ear_chulirenname2);
				reqMap.put("ear_chulideptid2", ear_chulideptid2);
				reqMap.put("ear_chulideptname2", ear_chulideptname2);
			}
			
			reqMap.put("ear_chulirenid1", now_ear_chulirenid1);
			reqMap.put("ear_chulirenname1", now_ear_chulirenname1);
			reqMap.put("ear_chulideptid1", now_ear_chulideptid1);
			reqMap.put("ear_chulideptname1", now_ear_chulideptname1);
			
			reqMap.put("latn_id", systemUser.getRegionId());
			reqMap.put("SERVER_NAME", "addWorkflowNeeddd");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		}else if("2021".equals(handleType)){
			/**********************************需求******************************************/
			//获取需求ID
			Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
			reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
			Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
			List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
			/**********************************需求任务******************************************/
			//会签是否结束标识
			String taskNums=reqParamMap.get("taskNums")+"";
			//任务ID
			int questId=(Integer) list.get(0).get("QUESTID");
			//需求ID
	        String demandId = (String) reqParamMap.get("demandId");
	        String flag = (String) reqParamMap.get("flag");
	        //需求主题
	        String demandName = (String) reqParamMap.get("demandName");
			//流程ID
	        String workflowId = (String) reqParamMap.get("workflowId");
			//下一节点
			String node2 = reqParamMap.get("node2")+"";
			//下一节点处理人ID
			String chulirenid2 = (String) reqParamMap.get("chulirenid2");
			//下一节点处理人名称
			String chulirenname2 = (String) reqParamMap.get("chulirenname2");
			//下一节点处理人部门ID
			String chulideptid2 = (String) reqParamMap.get("chulideptid2");
			//下一节点处理人部门名称
			String chulideptname2 = (String) reqParamMap.get("chulideptname2");
			//任务类型
			String questtype=(String) reqParamMap.get("questtype");
			//日志任务ID
			int taskId=(Integer) reqParamMap.get("taskId");
			//审批结果
			String disposeRadio=(String) reqParamMap.get("disposeRadio");
			//审批意见
			String disposeDesc=(String) reqParamMap.get("disposeDesc");
			//当前节点处理人ID
			String chulirenid1 =systemUser.getStaffId();
			//当前节点处理人名称
			String chulirenname1 = systemUser.getStaffName();
			//当前节点处理人部门ID
			String chulideptid1 = systemUser.getOrgId();
			//当前节点处理人部门名称
			String chulideptname1 = systemUser.getOrgName();
			//当前节点ID
			int now_node_id=(Integer) reqParamMap.get("now_node_id");
			//处理时限
			int timeLimit=Integer.parseInt(String.valueOf(reqParamMap.get("timeLimit")));
			//是否超时
			int isEndTime=(Integer) reqParamMap.get("isEndTime");
			//催单次数
			int urgeCount=(Integer) reqParamMap.get("urgeCount");
			//催单时间
			String urgeTime =(String) reqParamMap.get("urgeTime");
			//会签标识
			String countersign=(String) reqParamMap.get("countersign");
			
			//处理人被授权人ID2
			String ear_chulirenid2 = (String)reqParamMap.get("ear_chulirenid2");
			//处理人被授权人名称2
			String ear_chulirenname2 = (String)reqParamMap.get("ear_chulirenname2");
			//处理人被授权人部门ID2
			String ear_chulideptid2 = (String)reqParamMap.get("ear_chulideptid2");
			//处理人被授权人名称2
			String ear_chulideptname2 = (String)reqParamMap.get("ear_chulideptname2");
			
			//本节点处理人ID
			String now_ear_chulirenid1 =(String)reqParamMap.get("now_ear_operator_Id");
			//本节点处理人名称
			String now_ear_chulirenname1 = (String)reqParamMap.get("now_ear_operator_Name");
			//本节点处理人部门ID
			String now_ear_chulideptid1 = (String)reqParamMap.get("now_ear_operator_dept_Id");
			//本节点处理人部门名称
			String now_ear_chulideptname1 = (String)reqParamMap.get("now_ear_operator_dept_Name");
			String demandCode=(String)reqParamMap.get("demandCode");
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("questId", questId);
			reqMap.put("demandId", demandId);
			reqMap.put("demandName", demandName);
			reqMap.put("workflowId", workflowId);
			reqMap.put("node2", node2);
			reqMap.put("chulirenid2", chulirenid2);
			reqMap.put("chulirenname2", chulirenname2);
			reqMap.put("chulideptid2", chulideptid2);
			reqMap.put("chulideptname2", chulideptname2);
			reqMap.put("questtype", questtype);
			reqMap.put("taskId", taskId);
			reqMap.put("disposeRadio", disposeRadio);
			reqMap.put("disposeDesc", disposeDesc);
			reqMap.put("chulirenid1", chulirenid1);
			reqMap.put("chulirenname1", chulirenname1);
			reqMap.put("chulideptid1", chulideptid1);
			reqMap.put("chulideptname1", chulideptname1);
			reqMap.put("now_node_id", now_node_id);
			reqMap.put("timeLimit", timeLimit);
			reqMap.put("isEndTime", isEndTime);
			reqMap.put("urgeCount", urgeCount);
			reqMap.put("urgeTime", urgeTime);
			reqMap.put("taskNums", taskNums);
			reqMap.put("flag", flag);
			reqMap.put("latn_id", systemUser.getRegionId());
			reqMap.put("demandCode", demandCode);
			if(ear_chulirenid2==null){
				reqMap.put("ear_chulirenid2", "");
				reqMap.put("ear_chulirenname2", "");
				reqMap.put("ear_chulideptid2", "");
				reqMap.put("ear_chulideptname2", "");
			}else{
				reqMap.put("ear_chulirenid2", ear_chulirenid2);
				reqMap.put("ear_chulirenname2", ear_chulirenname2);
				reqMap.put("ear_chulideptid2", ear_chulideptid2);
				reqMap.put("ear_chulideptname2", ear_chulideptname2);
			}
			
			reqMap.put("ear_chulirenid1", now_ear_chulirenid1);
			reqMap.put("ear_chulirenname1", now_ear_chulirenname1);
			reqMap.put("ear_chulideptid1", now_ear_chulideptid1);
			reqMap.put("ear_chulideptname1", now_ear_chulideptname1);
			reqMap.put("SERVER_NAME", "addWorkflowNeedddd");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			}
		}else if("2022".equals(handleType)){
			/**********************************需求******************************************/
			//获取需求ID
			Map<Object,Object> reqMap1 = new HashMap<Object, Object>();
			reqMap1.put("SERVER_NAME", "queryWorkFlowNeedId");
			Map<Object,Object> serMap1 = crmService.dealObjectFun(reqMap1);
			List<Map<String, Object>> list = (List<Map<String, Object>>) serMap1.get("list");
			//本地网
			String latnId=systemUser.getRegionId();
			String latnName=systemUser.getRegionName();
			
			//需求ID
	        String type=(String) reqParamMap.get("type");
			int demandId=Integer.parseInt(String.valueOf(reqParamMap.get("demandId")));

			//需求名称
			String demandName=(String) reqParamMap.get("demandName");
			//需求编码
			String demandCode=(String) reqParamMap.get("demandCode");
			//需求状态
			String demandState="1000";
			//需求描述
			String demandDesc=(String) reqParamMap.get("demandDesc");
			//所属短流程ID
			String workflowId=(String) reqParamMap.get("workflowId");
			//是否超时
			String isNotTime="0";
			//需求结束流转时间 
			
			//需求发起人ID
			String StaffId = systemUser.getStaffId();
			//需求发起人名称
			String StaffName = systemUser.getStaffName();
			//需求发起人名称
			String phone = (String) reqParamMap.get("phone");
			//是否平价
			String isNotPingJia="0";

			/**********************************需求任务******************************************/
			//任务ID
			int questId=(Integer) list.get(0).get("QUESTID");

			//节点ID1
			int now_node_id=(Integer) reqParamMap.get("now_node_id");
			//节点ID2
			String node2 = reqParamMap.get("node2")+"";
			//处理人ID1
			String chulirenid1 = systemUser.getStaffId(); 
			//处理人ID2
			String chulirenid2 = (String) reqParamMap.get("chulirenid2");
			//处理人名称1
			String chulirenname1 = systemUser.getStaffName(); 
			//处理人名称2
			String chulirenname2 = (String) reqParamMap.get("chulirenname2");
			//处理人部门ID1
			String chulideptid1 = systemUser.getOrgId(); 
			//处理人部门ID2
			String chulideptid2 = (String) reqParamMap.get("chulideptid2");
			//处理人部门名称1
			String chulideptname1 = systemUser.getOrgName(); 
			//处理人部门名称2
			String chulideptname2 = (String) reqParamMap.get("chulideptname2");
			//任务类型
			String questtype=(String) reqParamMap.get("questtype");
			
			//处理人被授权人ID2
			String ear_chulirenid2 = (String)reqParamMap.get("ear_chulirenid2");
			//处理人被授权人名称2
			String ear_chulirenname2 = (String)reqParamMap.get("ear_chulirenname2");
			//处理人被授权人部门ID2
			String ear_chulideptid2 = (String)reqParamMap.get("ear_chulideptid2");
			//处理人被授权人名称2
			String ear_chulideptname2 = (String)reqParamMap.get("ear_chulideptname2");
			
			//本节点处理人ID
			String now_ear_chulirenid1 =(String)reqParamMap.get("now_ear_operator_Id");
			//本节点处理人名称
			String now_ear_chulirenname1 = (String)reqParamMap.get("now_ear_operator_Name");
			//本节点处理人部门ID
			String now_ear_chulideptid1 = (String)reqParamMap.get("now_ear_operator_dept_Id");
			//本节点处理人部门名称
			String now_ear_chulideptname1 = (String)reqParamMap.get("now_ear_operator_dept_Name");
			/**********************************需求模板实例化表******************************************/
		    //模板实例ID
			int templateid=(Integer) list.get(0).get("TEMPLATEID");

			//模板属性
			String templatepro=(String) reqParamMap.get("attrDesc");
			//获取第二部 处理时限
			//审批结果
			String disposeRadio=(String) reqParamMap.get("disposeRadio");
			//审批意见
			String disposeDesc=(String) reqParamMap.get("disposeDesc");
			//处理时限
			int timeLimit=Integer.parseInt(String.valueOf(reqParamMap.get("timeLimit")));
			//是否超时
			int isEndTime=(Integer) reqParamMap.get("isEndTime");
			//催单次数
			int urgeCount=(Integer) reqParamMap.get("urgeCount");
			//催单时间
			String urgeTime =(String) reqParamMap.get("urgeTime");
			/**********************************参数存入map******************************************/
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("latnId", latnId);
			reqMap.put("latnName", latnName);
			reqMap.put("demandId", demandId);
			reqMap.put("demandName", demandName);
			reqMap.put("demandState", demandState);
			reqMap.put("demandCode", demandCode);
			reqMap.put("demandDesc", demandDesc);
			reqMap.put("workflowId", workflowId);
			reqMap.put("isNotTime", isNotTime);
			reqMap.put("disposeRadio", disposeRadio);
			reqMap.put("disposeDesc", disposeDesc);
			reqMap.put("StaffId", StaffId);
			reqMap.put("StaffName", StaffName);
			reqMap.put("phone", phone);
			reqMap.put("isNotPingJia", isNotPingJia);
			reqMap.put("questId", questId);
			reqMap.put("now_node_id", now_node_id);
			reqMap.put("node2", node2);
			reqMap.put("chulirenid1", chulirenid1);
			reqMap.put("chulirenid2", chulirenid2);
			reqMap.put("chulirenname1", chulirenname1);
			reqMap.put("chulirenname2", chulirenname2);
			reqMap.put("chulideptid1", chulideptid1);
			reqMap.put("chulideptid2", chulideptid2);
			reqMap.put("chulideptname1", chulideptname1);
			reqMap.put("chulideptname2", chulideptname2);
			reqMap.put("questtype", questtype);
			reqMap.put("templateid", templateid);
			reqMap.put("templatepro", templatepro);
			reqMap.put("type", type);
			
			reqMap.put("timeLimit", timeLimit);
			reqMap.put("isEndTime", isEndTime);
			reqMap.put("urgeCount", urgeCount);
			reqMap.put("urgeTime", urgeTime);
			reqMap.put("latn_id", systemUser.getRegionId());
			
			if(ear_chulirenid2==null){
				reqMap.put("ear_chulirenid2", "");
				reqMap.put("ear_chulirenname2", "");
				reqMap.put("ear_chulideptid2", "");
				reqMap.put("ear_chulideptname2", "");
			}else{
				reqMap.put("ear_chulirenid2", ear_chulirenid2);
				reqMap.put("ear_chulirenname2", ear_chulirenname2);
				reqMap.put("ear_chulideptid2", ear_chulideptid2);
				reqMap.put("ear_chulideptname2", ear_chulideptname2);
			}
			
			reqMap.put("ear_chulirenid1", now_ear_chulirenid1);
			reqMap.put("ear_chulirenname1", now_ear_chulirenname1);
			reqMap.put("ear_chulideptid1", now_ear_chulideptid1);
			reqMap.put("ear_chulideptname1", now_ear_chulideptname1);
			reqMap.put("SERVER_NAME", "addWorkflowBack");
			Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if ("0".equals(serMap.get("code"))) {
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("staff_id", systemUser.getStaffId());//当前登录者

			}
		}else if("2023".equals(handleType)){//查询需求对应的附件列表
			//String demandId = (String) reqParamMap.get("demandId");
			int demandId=Integer.parseInt(String.valueOf(reqParamMap.get("demandId")));
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("proId", demandId);
			reqMap.put("dataSource", "");
			reqMap.put("handleType", "qryLst");
			reqMap.put("nameSpace", "shortProcess");
			reqMap.put("sqlName", "qryDownloadPath");
			reqMap.put("staff_id", systemUser.getStaffId());
			// 走公共方法去查节点数据
			reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			resultMap= this.crmService.commonMothed(reqMap);
			resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			
		}else if("2024".equals(handleType)){//下载水印
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			String attachment_path=(String) reqParamMap.get("filePath");
			String attachment_name=(String) reqParamMap.get("fileName");
			String other_attachment_name=(String) reqParamMap.get("downloadName");	
			//在这里判断如果上次的附件是pdf，excel，word，要重新给附件加水印 add 2017-07-31
			String suffix = attachment_name.substring(attachment_name.lastIndexOf(".") + 1);
			String attachment_path1 = attachment_path+systemUser.getLoginCode()+"/";
			File filePar = new File(attachment_path1);
			if (!filePar.exists() && !filePar.isDirectory()) {
				filePar.mkdirs();
			}
			if(suffix.equals("pdf")||suffix.equals("xls")||suffix.equals("xlsx")){
				try {
					this.createWaterFile(systemUser,attachment_path,other_attachment_name,suffix);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			reqMap.put("handleType", "add");
			reqMap.put("dataSource", "");
			reqMap.put("nameSpace", "shortProcess");
			reqMap.put("sqlName", "insertDownWatermarkFileInfo");
			reqMap.put("staff_Id", systemUser.getStaffId());
			reqMap.put("staff_Name", systemUser.getStaffName());
			reqMap.put("attachment_path", attachment_path);
			reqMap.put("attachment_name", attachment_name);
			reqMap.put(Constant.SERVER_NAME, "addCommonMethod");
			System.out.println("++++++++++++++++++++++++++++水印完成后的操作reqMap++++++++++"+reqMap.toString());
			Map<Object,Object> respMap = this.crmService.commonMothed(reqMap);
			resultMap.put("code", "1");
			if(!"0".equals(respMap.get("code"))){
				resultMap.put("code", "1");
			} else {
				resultMap.put("code", "0");
				resultMap.put("file_path", attachment_path1);
			}
		}else if("2025".equals(handleType)){//查询附件信息
			//查询需求对应的附件列表
			String demandId = (String) reqParamMap.get("demandId");
			String attachment_type=(String)reqParamMap.get("attachment_type");
			Map<Object,Object> reqMap = new HashMap<Object, Object>();
			reqMap.put("demandId", demandId);
			reqMap.put("attachment_type", attachment_type);
			reqMap.put("dataSource", "");
			reqMap.put("handleType", "qryLst");
			reqMap.put("nameSpace", "shortProcess");
			reqMap.put("sqlName", "queryAttachmentFile");
			reqMap.put("staff_id", systemUser.getStaffId());
			// 走公共方法去查节点数据
			reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			resultMap= this.crmService.commonMothed(reqMap);
			resultMap.put("staff_id", systemUser.getStaffId());//当前登录者
			
		
		}else if("2026".equals(handleType)){//删除附件信息
			Map<Object, Object> reqMap = new HashMap<Object, Object>();
			String other_attachment_name =(String)reqParamMap.get("other_attachment_name");
			String attachment_path =(String)reqParamMap.get("attachment_path");
			String filePath = attachment_path+other_attachment_name;
			try {
				 File file = new File(filePath);  
			      if (file.delete()) {   
					reqMap.put("attachment_value", (String)reqParamMap.get("attachment_value"));
					reqMap.put("attachment_type", (String)reqParamMap.get("attachment_type"));
					reqMap.put("other_attachment_name", (String)reqParamMap.get("other_attachment_name"));
					reqMap.put("SERVER_NAME", "deleteFileInfos");
					Map<Object,Object> serMap=crmService.dealObjectFun(reqMap);
					if ("0".equals(serMap.get("code"))) {
						System.out.println("删除成功！"); 
						resultMap.put("code", "0");
						resultMap.put("msg", "删除成功！");
					}
			      } else {  
						resultMap.put("code", "1");
						resultMap.put("msg", "删除失败！");
			      }
			} catch (Exception e) {
//				System.out.println("使用 fileupload 包时发生异常 ...");
				e.printStackTrace();
				resultMap.put("code", "1");
				resultMap.put("msg", "删除失败！");
			}
		}
		 
		super.sendMessagesApp(request, response, resultMap);
	}
	
	public void createWaterFile(SystemUser systemUser, String attachment_path,
			String attachment_name,String suffix) throws Exception {
		// TODO Auto-generated method stub
		String message=systemUser.getStaffName()+"  "+systemUser.getLoginCode();//需要显示的水印文字
		String waterFileName=Tools.creatFileName()+"."+suffix;//生成水印文件的名称
		String attachment_path1 = attachment_path+systemUser.getLoginCode()+"/";
		String pngFileName="";
		if(suffix.equals("xls")||suffix.equals("xlsx")){//说明上传的是excel文件，要先生成水印图片
			//先生成一个随机文件名
			pngFileName=Tools.creatFileName()+".png";
			String filePath=attachment_path1+pngFileName;
			System.out.println("生成水印图片的地址+++++++++++++++++++++++++++++++："+filePath);
			CreatePngUtils.createImage(message, filePath);
		}
		//在这里将原文件生成带有水印的文件
		if(suffix.equals("pdf")){
			PdfReader pdfReader = new PdfReader(attachment_path+attachment_name);
			System.out.println("pdf上传文件的地址+++++++++++++++++++++++++++++++："+attachment_path+attachment_name);
			Field f = PdfReader.class.getDeclaredField("ownerPasswordUsed");
			f.setAccessible(true);
			f.set(pdfReader, Boolean.TRUE);
			
			// Get the PdfStamper object
			PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileOutputStream(attachment_path1+waterFileName));
			System.out.println("pdf生成水印文件的地址+++++++++++++++++++++++++++++++："+attachment_path1+waterFileName);
			WaterMarkUtilPDF.addWatermark(pdfStamper, message);
			pdfStamper.close();	
		}else if(suffix.equals("xls")){
			WaterMarkUtilOffice.excel2003(message, attachment_path+attachment_name, attachment_path1+waterFileName,attachment_path1+pngFileName);
		}else if(suffix.equals("xlsx")){
			System.out.println("++++++++++++++++++++++++++++调用水印工具类2007++++++++++"+attachment_path1+attachment_name);
			WaterMarkUtilOffice.excel2007(message, attachment_path+attachment_name, attachment_path1+waterFileName,attachment_path1+pngFileName);
		}
		//生成完毕后，要将原始文件和生成的图片文件都删除，并将水印文件名修改成原始文件名
		if(suffix.equals("xls")||suffix.equals("xlsx")){
		this.deleteFile(attachment_path1+pngFileName);
		}
		this.deleteFile(attachment_path1+attachment_name);
//		//修改文件名
		 File f = new File(attachment_path1+waterFileName);   
	        String p = f.getParent();   // 文件所在路径(一定要写,否则改名操作将把原文件删除)
	        File nf = new File(p + File.separatorChar+attachment_name);   
	        if(f.renameTo(nf))   
	        {   
	          System.out.println("修改成功!");   
	        }   
	        else   
	        {   
	          System.out.println("修改失败");   
	        }  
	}

	private void deleteFile(String filePath) {
		// TODO Auto-generated method stub
		File f = new File(filePath); // 输入要删除的文件位置
		if(f.exists())
		f.delete();
	}
}
