package com.tydic.sale.servlet.taskBook;

import java.io.IOException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.servlet.order.QueryAttachInfoServlet;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;
@WebServlet("/taskBook/queryTaskBook.do")
public class QueryTaskBookList extends AbstractServlet {

	private static final long serialVersionUID = 1L;
	private final static Logger logger = LoggerFactory.getLogger(QueryTaskBookList.class);
	
	public QueryTaskBookList() {
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
		String pageNum = request.getParameter("limit");
		String pageSize = request.getParameter("pageSize");
		String handleType = request.getParameter("handleType");
		String year = request.getParameter("year");//年份
		String bookType=request.getParameter("bookType");//责任书类型
		String bookState=request.getParameter("bookState");//责任书状态
		String OBUName=request.getParameter("OBUName");//归属obu
		String contractorName=request.getParameter("contractorName");//承包人姓名
		String loginTreeInfo=request.getParameter("staffTreeInfo");//登录者的树信息
		Map<String,Object> treeMap=new HashMap<String,Object>();
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
        if("processing".equals(handleType)){//查询待审批的责任书
        	reqMap.put("optId", optId);
        	reqMap.put("curr_node_id", "100301");
		}else if("queryList".equals(handleType)){//obu登录后展示的列表
			if(!Tools.isNull(loginTreeInfo)){
				treeMap=this.toMap(loginTreeInfo);
				reqMap.put("obuTreeId", treeMap.get("TREE_ID"));
				reqMap.put("obuTreeLevel", treeMap.get("TREE_LEVEL"));
				//reqMap.put("pTreeId", treeMap.get("P_TREE_ID"));
				reqMap.put("latnId", treeMap.get("LATN_ID"));
			}
		}else if("queryListByTree".equals(handleType)){//根据点击的树结构查询列表
			reqMap.put("obuTreeId", request.getParameter("tree_id"));
			reqMap.put("obuTreeLevel", request.getParameter("level"));
			reqMap.put("latnId", request.getParameter("latn_id"));
		}
		
		reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
		reqMap.put("pagesize",pageSize);
		reqMap.put("year", year);
		reqMap.put("bookType", bookType);
		reqMap.put("bookState", bookState);
		reqMap.put("OBUName", OBUName);
		reqMap.put("contractorName", contractorName);
		reqMap.put("SERVER_NAME", "qryTaskBookList");
		resultMap = crmService.dealObjectFun(reqMap);
		resultMap.put("staffId", systemUser.getStaffId());//登录者本人
		super.sendMessages(response, JSON.toJSONString(resultMap));


	}
	private static Map<String,Object> toMap(String s){
		if(s==null || s.length() < 1){return null; }
		Map<String,Object> map=new HashMap<String,Object>();
		JSONObject json=JSONObject.fromObject(s);
		Iterator keys=json.keys();
		while(keys.hasNext()){
			String key=(String) keys.next();
			String value=json.get(key).toString();
			if(value.startsWith("{")&&value.endsWith("}")){
				map.put(key, toMap(value));
			}else{
				map.put(key, value);
			}

		}
		return map;
	}


}
