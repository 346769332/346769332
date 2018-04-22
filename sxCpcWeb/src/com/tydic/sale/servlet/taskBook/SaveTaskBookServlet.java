package com.tydic.sale.servlet.taskBook;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.annotation.WebServlet;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
@WebServlet("/taskBook/sendTaskBook.do")
public class SaveTaskBookServlet extends AbstractServlet {
	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(QueryTaskBookList.class);

	public SaveTaskBookServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		this.doPost(request, response);
	}
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		Map<Object,Object> resultMap=new HashMap<Object,Object>();
		String handleType=String.valueOf(request.getParameter("handleType"));
		String taskCode=String.valueOf(request.getParameter("taskCode"));
		SystemUser systemUser=(SystemUser)request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		if("submitTask".equals(handleType)){//发起审批
			Map<Object,Object> taskInfo=new HashMap<Object,Object>();
			taskInfo.put("taskCode", taskCode);
			taskInfo.put("opt_id", systemUser.getStaffId());
			taskInfo.put("opt_name", systemUser.getStaffName());
			resultMap = crmService.submitTask(taskInfo,"1");
		}else if("saveFile".equals(handleType)){//提交所上传的文件
			String fileListInfo=String.valueOf(request.getParameter("fileList"));
			 List<Map<Object,Object>> fileList=new ArrayList<Map<Object,Object>>();
			 if(!Tools.isNull(fileListInfo)){
				 fileList=this.toList(fileListInfo, Map.class);
				 for(Map<Object,Object> map:fileList){
						map.put("SERVER_NAME", "insertAttachInfo");
						crmService.dealObjectFun(map);
				 }
				 resultMap.put("code", "0");
				 resultMap.put("msg", "文件上传成功！");
			 }
		}else if("queryFileInfo".equals(handleType)){
			Map<Object,Object> reqMap=new HashMap<Object,Object>();
			String fileType=String.valueOf(request.getParameter("fileType"));
			reqMap.put("attachment_value", taskCode);
			reqMap.put("attachment_type", fileType);
			reqMap.put("SERVER_NAME", "qryAttachInfo");
			resultMap=crmService.dealObjectFun(reqMap);
		}else if("getFilePath".equals(handleType)){
			String webRoot = this.getDocumentRoot(request);
			File webRootFile = new File(webRoot);
			String webRootFilePath = webRootFile.getParent();
			String filePath = webRootFilePath+"/"+super.getDemSendUpDirPath()+ "/";
			if(!Tools.isNull(taskCode)){
				filePath = filePath + taskCode + "/";
			}
			resultMap.put("code", "0");
			resultMap.put("file_path", filePath);
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	private static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
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
