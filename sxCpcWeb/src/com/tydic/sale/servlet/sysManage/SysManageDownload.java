package com.tydic.sale.servlet.sysManage;

import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.common.WeekdayUtil;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.DownExcel;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.StringUtils;
import com.tydic.sale.utils.Tools;

@WebServlet("/sysManage/sysManageDownload.do")
public class SysManageDownload  extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(SysManageDownload.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public SysManageDownload() {
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
		request.setCharacterEncoding("UTF-8");  
		Map<String ,String> headerMap=new HashMap<String, String>();
		List<Map<String, Object>> contentSet=new ArrayList<Map<String,Object>>();
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String fileName="";
//		List<String> headSet=new ArrayList<String>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		String type=request.getParameter("type");
		String param=request.getParameter("param");
		if(StringUtil.isNotEmpty(param)){
			   try {
				   JSONObject jsonParam=JSONObject.fromObject(param);
				   reqMap=(Map<Object, Object>) JSONObject.toBean(jsonParam, Map.class);
				} catch (Exception e) {
					
				}
		   }
		if("saveRoleList".equals(type)){
			fileName="角色数据.xls";
//			headSet=this.getHeaderSet(request, response);
			headerMap=this.getHeaderMap(request, response);
			reqMap.put("queryType", "queryAll"); 
			Map seqMap=this.crmService.queryRoleList(reqMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) seqMap.get("list");
			}
		}else if("saveAuthList".equals(type)){
			fileName="权限数据.xls";
//			headSet=this.getHeaderSet(request, response);
			headerMap=this.getHeaderMap(request, response);
			reqMap.put("queryType", "queryAll"); 
			Map seqMap=this.crmService.queryAuthList(reqMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) seqMap.get("list");
			}
		}else if("saveAuthList".equals(type)){
			fileName="权限数据.xls";
//			headSet=this.getHeaderSet(request, response);
			headerMap=this.getHeaderMap(request, response);
			reqMap.put("queryType", "queryAll");
			Map seqMap=this.crmService.queryAuthList(reqMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) seqMap.get("list");
			}
		}else if("saveAuthList".equals(type)){
			fileName="需求单数据.xls";
			headerMap=this.getHeaderMap(request, response);
			reqMap.put("queryType", "queryAll");
			Map seqMap=this.crmService.getDemandLst(reqMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) seqMap.get("list");
			}
		}else if("saveComprehensiveDemandList".equals(type)){
			fileName="需求单数据.xls";
			Map<Object,Object> parMap=new HashMap<Object,Object>();
			headerMap=this.getHeaderMap(request, response);
			String sendBeginDate = String.valueOf(reqMap.get("sendBeginDate"));// 发起开始时间
			String sendEndDate = String.valueOf(reqMap.get("sendEndDate"));//发起结束时间
			
			String calimLimitBeginDate =String.valueOf(reqMap.get("calimLimitBeginDate"));//认领开始时间
			String calimLimitEndDate = String.valueOf(reqMap.get("calimLimitEndDate"));//认领结束时间
			
			String overLimitBeginDate = String.valueOf(reqMap.get("overLimitBeginDate"));//办结开始时间
			String overLimitEndDate = String.valueOf(reqMap.get("overLimitEndDate"));//办结结束时间
			if(!Tools.isNull(sendBeginDate)){
				sendBeginDate =  String.valueOf(sendBeginDate+" 00:00:00") ;
			}
			if(!Tools.isNull(sendEndDate)){
				sendEndDate =  String.valueOf(sendEndDate+" 23:59:59") ;
			}
			
			if(!Tools.isNull(calimLimitBeginDate)){
				calimLimitBeginDate =   String.valueOf(calimLimitBeginDate+" 00:00:00") ;
			}
			if(!Tools.isNull(calimLimitEndDate)){
				calimLimitEndDate =   String.valueOf(calimLimitEndDate+" 23:59:59") ;
			}
			
			if(!StringUtils.isEmpty(overLimitBeginDate)){
				overLimitBeginDate =   String.valueOf(overLimitBeginDate+" 00:00:00") ;
			}
			if(!StringUtils.isEmpty(overLimitEndDate)){
				overLimitEndDate =   String.valueOf(overLimitEndDate+" 23:59:59") ;
			}
			/******* 截止时间计算 *********/
			parMap.put("start_create_time", sendBeginDate);
			parMap.put("end_create_time", sendEndDate);
			
			parMap.put("calim_limit", calimLimitEndDate);
			parMap.put("calim_limit_begin", calimLimitBeginDate);
			
			parMap.put("over_limit", overLimitEndDate);
			parMap.put("over_limit_begin", overLimitBeginDate);
			parMap.put("latnId", reqMap.get("latnId"));
			parMap.put("promoters_id", reqMap.get("sendUserName"));
			parMap.put("curr_node_id", reqMap.get("newStatusCd"));
			parMap.put("calimTimeOutFlag", reqMap.get("calimTimeOutFlag"));
			parMap.put("overTimeOutFlag", reqMap.get("overTimeOutFlag"));
			parMap.put("demand_theme", reqMap.get("themeSeach"));
			parMap.put("demand_type", reqMap.get("demandType"));
			parMap.put("demand_id", reqMap.get("demandId"));
			parMap.put("isNowNodeId", "1");
			parMap.put("demand_details", reqMap.get("demandDetails"));
			parMap.put("tel", reqMap.get("sendUserTel"));
			parMap.put("department", reqMap.get("sendUserDept"));
			parMap.put("tree_name", reqMap.get("sendUserArea"));
			parMap.put("lastOptName", reqMap.get("optName"));
			parMap.put("lastOptTel",reqMap.get("optTel"));
			parMap.put("lastOptDept", reqMap.get("optDept"));
			parMap.put("pool_id", reqMap.get("poolId"));
			parMap.put("over_eval", reqMap.get("evalStar"));
			parMap.put("searchType", "comprehensive");
			parMap.put("queryType", "queryAll");
			Map seqMap=this.crmService.getDemandLst(parMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) dateCalculation(seqMap,String.valueOf(reqMap.get("latnId")));
			}
		}else if("saveComprehensiveServiceList".equals(type)){
			fileName="服务单数据.xls";
//			headSet=this.getHeaderSet(request, response);
			headerMap=this.getHeaderMap(request, response);
			reqMap.put("queryType", "queryAll");
			Map seqMap=this.crmService.getServiceLst(reqMap);
			if("0".equals(seqMap.get("code"))){
				contentSet=(List<Map<String, Object>>) seqMap.get("list");
			}
		}
		
//		DownExcel.exec(response, fileName, headSet, contentSet);
		DownExcel.exec2(response, fileName, headerMap, contentSet);
	}

	private List<String> getHeaderSet(HttpServletRequest request, HttpServletResponse response){
		 List<String> headerSet=new ArrayList<String>();
		 Map reMap=request.getParameterMap();
		 for (Object object : reMap.keySet()) {
			 if(StringUtil.objIsNotEmpty(object) && !"type".equals(object)){
				 headerSet.add(object.toString());
			 } 
		}
		 return headerSet;
	}
	
	private  Map<String,String> getHeaderMap(HttpServletRequest request, HttpServletResponse response){
	
		Map<String,String> returnMap=new HashMap<String,String>();
	    Map properties = request.getParameterMap();
	    Iterator entries = properties.entrySet().iterator();
	    Map.Entry entry;
	    String name = "";
	    String value = "";
	    while (entries.hasNext()) {
	        entry = (Map.Entry) entries.next();
	        name = (String) entry.getKey();
	        if(!"type".equals(name) && !"param".equals(name)){
	        	Object valueObj = entry.getValue();
	        	if(null == valueObj){
	        		value = "";
	        	}else if(valueObj instanceof String[]){
	        		String[] values = (String[])valueObj;
	        		for(int i=0;i<values.length;i++){
	        			value = values[i] + ",";
	        		}
	        		value = value.substring(0, value.length()-1);
	        	}else{
	        		value = valueObj.toString();
	        	}
	        	returnMap.put(name, value);
	        }
	    }
	    return returnMap;
	}
	/**
	 * 时间计算
	 * @return
	 */
	private List<Map<String, Object>> dateCalculation( Map demMap,String latnId ){
		List<Map<String, Object>> resultLst = new ArrayList<Map<String, Object>>();
		if(Tools.isNull(latnId)){
			latnId="888";
		}
			//办理剩余时间计算
			List<Map> list =  (List<Map>) demMap.get("list");
			if(list.size()>0){
				for(Map map : list){
					try {
						SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						String currNodeId=String.valueOf(map.get("curr_node_id"));
						String overLimit=String.valueOf(map.get("over_limit"));
						String calimLimit=String.valueOf(map.get("calim_limit"));
						String overTime=String.valueOf(map.get("over_time"));
						String backTime=String.valueOf(map.get("back_time"));//回单时间
						String calimTime=String.valueOf(map.get("calim_time"));//认领的处理时间
						
						//计算办结是否超时
						Date begin=new Date();
						Date end=new Date();
						/*if(("100104".equals(currNodeId))&& !Tools.isNull(overLimit)&&!Tools.isNull(overTime)){ //已归档时办理剩余时间计算
							begin=dfs.parse(overTime);
							end = dfs.parse(overLimit);
						}*/
						if(("100102".equals(currNodeId)||"200102".equals(currNodeId))&&!Tools.isNull(overLimit)){ //待处理截止时间计算
							end = dfs.parse(overLimit);
						}else if(!Tools.isNull(overLimit)&&("100103".equals(currNodeId)||"100104".equals(currNodeId))){//待评价时办理时间的计算
							if(!Tools.isNull(backTime)){
								begin=dfs.parse(backTime);//最后一次的处理时间
							}
							end = dfs.parse(overLimit);
						}
						long optSurplusTime = (end.getTime()-begin.getTime());
						long hour2 = (optSurplusTime/(60*60*1000));
						long min2=((optSurplusTime/(60*1000))-hour2*60);
						if(optSurplusTime > 0){
							//map.put("optflag", "0");
							map.put("flag", "否");
							map.put("surplusTimeD","无");
						}else{
							//map.put("optflag", "1");
							String optDif=WeekdayUtil.computWorkTime(dfs.format(begin),dfs.format(end),latnId);
							map.put("surplusTimeD",optDif.substring(2));
							map.put("flag", "是");
						}
						
					} catch (ParseException e) {
						e.printStackTrace();
					}
					resultLst.add(map);
			   }
		}
		return resultLst;
	}
}
