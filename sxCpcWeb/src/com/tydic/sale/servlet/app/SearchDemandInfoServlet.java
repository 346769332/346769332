package com.tydic.sale.servlet.app;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.Date;
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

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryOderLstServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/app/searchDemandInfo.do")
public class SearchDemandInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory
			.getLogger(SearchDemandInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SearchDemandInfoServlet() {
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
		
		Map<Object,Object> reqParamMap  = super.getReqParamMap(request);
		if(Tools.isNull(reqParamMap.get("isHistory")) || reqParamMap.get("isHistory").equals("N"))
			reqParamMap.put("isHistory","N");
		String demandId = String.valueOf(reqParamMap.get("demandId"));
		String isHistory = String.valueOf(reqParamMap.get("isHistory"));
		String isCEO=String.valueOf(reqParamMap.get("isCEO"));
		Map<Object,Object> resultMap = null;
		//生成存放路径
		String filePath="";
		if(!Tools.isNull(demandId)){
			resultMap = super.crmService.searchDemandInfo(demandId, isHistory, isCEO);
			//是否需要当前节点拦截 
			if(!Tools.isNull(reqParamMap.get("isNodeIntercept")) 
					&& reqParamMap.get("isNodeIntercept").equals("Y")){
				String curr_record_id = String.valueOf(reqParamMap.get("curr_record_id"));
				Object recordSetObj = resultMap.get("recordSet");
				if(!Tools.isNull(recordSetObj) && (recordSetObj instanceof List)){
					List<Map<Object,Object>> recordSet = (List<Map<Object,Object>>) recordSetObj;
					Map<Object,Object> record = recordSet.get(recordSet.size()-1);
					if(!curr_record_id.equals(String.valueOf(record.get("record_id")))
							|| !String.valueOf(record.get("record_status")).equals("0")){
						resultMap =  new HashMap<Object,Object>();
						resultMap.put("code", "-999");
						resultMap.put("msg", "流程已不在当前节点，请返回，重新确认操作！");
					}
				}
			}
		}else{//没有需求单则生成需求单号，查找存放图片的服务器地址
			Map<Object,Object> demandIdMap = crmService.getDemandId(new HashMap<Object, Object>());
			demandId = (String) demandIdMap.get("demandId");
			if(!Tools.isNull(demandId)){
				String appId = "";
				int index=4;
				for(int i = 0; i< (index - demandId.length());i++){
					appId = appId+"0";
				};
				demandId = appId+demandId;
				SimpleDateFormat dfs = new SimpleDateFormat("yyMMddHH");
				Date nowTime = new Date();
				String date = dfs.format(nowTime);
				demandId = "D"+date+demandId;
			}
			
		}
		
		if(Tools.isNull(resultMap)){
			resultMap = new HashMap();
			resultMap.put("code", "0");
			resultMap.put("demandInst",new HashMap());
		}
		
		//追加session信息
		HttpSession session = request.getSession();
		SystemUser systemUser = (com.tydic.sale.servlet.domain.SystemUser) session.getAttribute(SaleUtil.SYSTEMUSER);
		
		Map demandInst = (Map) resultMap.get("demandInst");
//		if(null != demandInst){
			demandInst.put("staffId", systemUser.getStaffId());
			demandInst.put("staffName", systemUser.getStaffName());
			demandInst.put("depId", systemUser.getOrgId());
			demandInst.put("depName", systemUser.getOrgName());
			demandInst.put("tel", systemUser.getMobTel());
			demandInst.put("latnId", systemUser.getRegionId());
//		}
            resultMap.put("demandId", demandId);
			//获取文件存放路径
			String webRoot = this.getDocumentRoot(request);
			File webRootFile = new File(webRoot);
			String webRootFilePath = webRootFile.getParent();
			filePath = webRootFilePath+"/"+super.getDemSendUpDirPath()+ "/";
			filePath = filePath + demandId + "/";
			resultMap.put("file_path", filePath);			
		super.sendMessagesApp(request,response,  resultMap);
	}
	//获取项目部署的目录
	private String getDocumentRoot(HttpServletRequest request) {
		String webRoot = request.getSession().getServletContext()
				.getRealPath("/");
		if (webRoot == null) {
			webRoot = this.getClass().getClassLoader().getResource("/")
					.getPath();
			webRoot = webRoot.substring(0, webRoot.indexOf("WEB-INF"));
		}
		return webRoot;
	}
}
