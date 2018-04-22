package com.tydic.sale.servlet.publicMethod;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.List;  

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/common/commonMethod.do")
public class CommonMethodServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(CommonMethodServlet.class);
	private static final long serialVersionUID = 1L;

	public CommonMethodServlet() {
		super();
	}

	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		request.setCharacterEncoding("utf-8");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> paramMap = new HashMap<Object, Object>(); 
		
		//遍历前台js传递参数
		for(Iterator<String> it = request.getParameterMap().keySet().iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			paramMap.put(key, request.getParameter(key));
		}
		// 获取员工基本信息
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String staffid=systemUser.getStaffId();
		String staffname=systemUser.getStaffName();
		String handleType = paramMap.get("handleType").toString();//操作类型
		String dataSource = String.valueOf(paramMap.get("dataSource"));//获取连接的数据库类型
		String sqlName = String.valueOf(paramMap.get("sqlName"));//获取sqlmapID
		paramMap.put("staff_id", staffid);
		paramMap.put("staff_name", staffname);
		paramMap.put("latn_Id", systemUser.getRegionId());
		if ("qry".equals(handleType)) {
			int pagesize = 0;
			int limit = 0;
			if(paramMap.containsKey("limit")){
				limit=Integer.parseInt(paramMap.get("limit").toString());
			}
			if(paramMap.containsKey("pageSize")){
				pagesize=Integer.parseInt(paramMap.get("pageSize").toString()); 
			}
			
			//oracle中的分页
			int minSize=0, maxSize=0;
			if("ora".equals(dataSource)){
				minSize=limit*pagesize +1 ;
				maxSize=(limit+1)*pagesize;
				paramMap.put("minSize", minSize);
				paramMap.put("maxSize", maxSize);
			}else if("".equals(dataSource)){	//mysql中的分页
				minSize=limit*pagesize;
				paramMap.put("limit", minSize);
				paramMap.put("pageSize", pagesize);
			}
			paramMap.put(Constant.SERVER_NAME, "qryCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
		}else if ("del".equals(handleType)) {
			paramMap.put(Constant.SERVER_NAME, "delCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
		}else if ("upd".equals(handleType)) {
			    paramMap.put("staffid", staffid);
			    paramMap.put("staffname", staffname);
				paramMap.put(Constant.SERVER_NAME, "updCommonMethod");
				resultMap = this.crmService.commonMothed(paramMap);
		}else if ("add".equals(handleType)) {
			paramMap.put(Constant.SERVER_NAME, "addCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
		}else if ("qryLst".equals(handleType)) {
			paramMap.put("contestRegionId", systemUser.getRegionId());
			paramMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
		}else if("qryObj".equals(handleType)){
			paramMap.put(Constant.SERVER_NAME, "qryObjCommonMethod");
			resultMap = this.crmService.commonMothed(paramMap);
		}
		resultMap.put("staffId", staffid);
		resultMap.put("staffName", staffname);
		if(sqlName.equals("qry_easy_list")||sqlName=="qry_easy_list"){
			resultMap.put("list", dateCalculation( resultMap));		
			resultMap.put("data", resultMap.get("list"));
		}
		
		//返回前台参数及数据
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}

	/**
	 * 时间计算
	 * @return
	 */
	private List<Map> dateCalculation( Map demMap){
		//办结剩余时间		
		  List<Map> resultLst = new ArrayList<Map>();
				List<Map> list =  (List<Map>) demMap.get("data");
				if(list.size()>0){
					for(Map map : list){
						if(!Tools.isNull(String.valueOf(map.get("OPT_TIME")))){
							try {
								SimpleDateFormat dfs = new SimpleDateFormat("yyyy:MM:dd HH:mm:ss");
								Date begin = new Date();
								Date end = null;
								long calimSurplusTime = 1L;								
									end = dfs.parse(String.valueOf(map.get("OPT_TIME")));
								calimSurplusTime = (begin.getTime()-end.getTime());
								long hour = (calimSurplusTime/(60*60*1000));
								long min=((calimSurplusTime/(60*1000))-hour*60);
								if(calimSurplusTime > 0){								
										map.put("HOTTIME", "已耗时："+String.valueOf(hour)+"小时"+String.valueOf(min-5)+"分钟");
	
								}
							} catch (ParseException e) {
								e.printStackTrace();
							}
						}else{
							map.put("HOTTIME", "");
							map.put("FLAG", "0");
						}
						resultLst.add(map);
				   }
				}
				return resultLst;
			
	}
}
