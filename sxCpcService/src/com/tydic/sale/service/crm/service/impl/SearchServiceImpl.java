package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.FlowService;
import com.tydic.sale.service.crm.service.SearchService;
import com.tydic.sale.service.crm.service.SysManageService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;
import com.tydic.sale.utils.CommonUtil;
import com.tydic.sale.utils.StringUtils;

import java.io.BufferedReader;
import java.io.FileInputStream;  
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.io.InputStream;  
import java.io.InputStreamReader;
import java.io.OutputStream;    

import sun.misc.BASE64Decoder;  
import sun.misc.BASE64Encoder; 

public class SearchServiceImpl implements SearchService{
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "search";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	   
	
	@Override
	public Map<String, Object> insertAttachInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			//先查询上传相片是否存在
			//List<Map<String, Object>> existList1 = this.cpcDao.qryMapListInfos(NAME_SPACE, "getAttachInfoQ", param);
			//
			List<Map<String, Object>> existList = this.cpcDao.qryMapListInfos(NAME_SPACE, "getAttachInfo", param);
			
			if(existList.size()==0) {
				this.cpcDao.insert(NAME_SPACE, "insertAttachInfo", param);
				result.put("code", "0");
				result.put("msg", "成功");
			}else{
				result.put("code", "-1");
				result.put("msg", "失败");
			}
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}
	
	@Override
	public Map<String, Object> getAttachInfo(Map<String, Object> param) {
		Map result = new HashMap();
		List<Map<String,Object>> attachInfoLst = null;
		try {
			
			String path="";
			String name="";
			String photourl="";
			attachInfoLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "getAttachInfo", param);
//			if(attachInfoLst.size()!=0){
//		 		
//			
//			for(Map<String,Object> list : attachInfoLst){
//				
//				path=String.valueOf(list.get("attachment_path"));
//				name=String.valueOf(list.get("attachment_name"));
//				photourl=path+name;
//			
//				
//			}
//			
//			 InputStream in = null;  
//		        byte[] data = null;  
//		        //读取图片字节数组  
//		        try   
//		        {  
//		            in = new FileInputStream(photourl);     
//		               
//		            data = new byte[in.available()];  
//		            in.read(data);  
//		            in.close();  
//		        }   
//		        catch (IOException e)   
//		        {  
//		            e.printStackTrace();  
//		        }  
//		        //对字节数组Base64编码  
//		        BASE64Encoder encoder = new BASE64Encoder();  
//		        encoder.encode(data);//返回Base64编码过的字节数组字符串  
//		        result.put("encoder",encoder.encode(data));
//		       
//			}
			result.put("attachInfoLst", attachInfoLst);
			
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}
	@Override
	public Map<String,Object> demandDraftSet(Map<String,Object> paramMap){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		
		try {
			
			paramMap.put("isDraft", "Y");
			List<Map<String,Object>> demandDraftSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_demand", paramMap);
			resultMap.put("demandDraftSet", demandDraftSet);
			resultMap.put("code", Const.SUCCESS);
		} catch (Exception e) {
			log.error("查询需求单草稿箱集合", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "需求需求单草稿箱集合->查询参数传入异常！");
		}
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> demandInfo(String demandId, String isHistory) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		Map<String,Object> paramMap = new HashMap<String,Object>();
		
		paramMap.put("demandId", demandId);
		
		try {
			List<Map<String,Object>> recordSet = null;
			List<Map<String,Object>> recordProcSet = null;
			List<Map<String,Object>> serviceSet = null;
			List<Map<String, Object>> recordServiceSet=null;
			List<Map<String, Object>> imgList=null;
			Map<String,Object> demandInst = this.cpcDao.qryMapInfo(NAME_SPACE, "select_demand", paramMap);
			Map<String,Object> viedemandInst = this.cpcDao.qryMapInfo(NAME_SPACE, "select_demand_vie", paramMap);
			if(null == demandInst || demandInst.isEmpty()){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "查无数据！");
				return resultMap;
			}
			if("N".equals(isHistory)){
				paramMap.put("recordId", demandInst.get("curr_record_id"));
			}
			if("Y".equals(isHistory) || (null != paramMap.get("recordId") && !"".equals(paramMap.get("recordId")))){	
				recordSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_flow_record", paramMap);
				recordProcSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_record_proc", paramMap);
				paramMap.put("recordServiceFlag", "recordServiceFlag");
				recordServiceSet=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_flow_record", paramMap);
				//查询需求单上传的多图片
				Map<String,Object> reqMap = new HashMap<String,Object>();
				reqMap.put("attachment_value", demandId);
				reqMap.put("attachment_type", "demand");
				imgList=this.cpcDao.qryMapListInfos(NAME_SPACE, "selectUploadImages", reqMap);
				
			}
			serviceSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "query_service", paramMap);
			resultMap.put("demandInst", demandInst);
			resultMap.put("viedemandInst", viedemandInst);
			resultMap.put("recordSet", recordSet);
			resultMap.put("recordProcSet", recordProcSet);
			resultMap.put("recordServiceSet", recordServiceSet);
			resultMap.put("serviceInst", serviceSet);
			resultMap.put("imgList", imgList);//上传的多图片
			resultMap.put("code", Const.SUCCESS);
			
		} catch (Exception e) {
			log.error("查询需求单详情", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "需求单详情查询->查询参数传入异常！");
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> serviceInfo(String serviceId, String isHistory) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("serviceId", serviceId);
		paramMap.put("demandId", serviceId);
		
		try {
			List<Map<String,Object>> recordSet = null;
			List<Map<String,Object>> recordProcSet = null;
			Map<String,Object> serviceInst = this.cpcDao.qryMapInfo(NAME_SPACE, "select_service", paramMap);
			if(null == serviceInst || serviceInst.isEmpty()){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "查无数据！");
				return resultMap;
			}
			if("N".equals(isHistory)){
				paramMap.put("recordId", serviceInst.get("curr_record_id"));
			}
			if("Y".equals(isHistory) || (null != paramMap.get("recordId") && !"".equals(paramMap.get("recordId")))){	
				recordSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_flow_record", paramMap);
				recordProcSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_record_proc", paramMap);
			}
			resultMap.put("serviceInst", serviceInst);
			resultMap.put("recordSet", recordSet);
			resultMap.put("recordProcSet", recordProcSet);
			resultMap.put("code", Const.SUCCESS);
			
		} catch (Exception e) {
			log.error("查询服务单详情", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "服务单详情查询异常"+e);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> sysInfo(String flowRecordId, String isHistory) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		Map<String,Object> paramMap = new HashMap<String,Object>();
		paramMap.put("flowRecordId", flowRecordId);
		//paramMap.put("demandId", serviceId);
		
		try {
			List<Map<String,Object>> recordSet = null;
			//List<Map<String,Object>> recordProcSet = null;
			Map<String,Object> sysInst = this.cpcDao.qryMapInfo(NAME_SPACE, "select_sys", paramMap);
			if(null == sysInst || sysInst.isEmpty()){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "查无数据！");
				return resultMap;
			}
			if("N".equals(isHistory)){
				paramMap.put("flow_record_id", sysInst.get("flow_record_id"));
			}
			if("Y".equals(isHistory) || (null != paramMap.get("flow_record_id") && !"".equals(paramMap.get("flow_record_id")))){	
				recordSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_sys_flow_record", paramMap);
			//	recordProcSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_record_proc", paramMap);
			}
			resultMap.put("sysInst", sysInst);
			resultMap.put("recordSet", recordSet);
			//resultMap.put("recordProcSet", recordProcSet);
			resultMap.put("code", Const.SUCCESS);
			
		} catch (Exception e) {
			log.error("查询专业系统详情", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "专业系统详情查询异常"+e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> recordProcSet( String recordId) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		Map<String,Object> paramMap = new HashMap<String,Object>();
		 
		paramMap.put("recordId", recordId);
		
		try {
			List<Map<String,Object>> recordProcSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_record_proc", paramMap);
			resultMap.put("recordProcSet", recordProcSet);
			resultMap.put("code", Const.SUCCESS);
		} catch (Exception e) {
			log.error("查询已处理过程属性", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询已处理过程属性->查询参数传入异常！");
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> dic(Map<String,Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		
		try {
			List<Map<String,Object>> dicSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_dic", param);
			
			resultMap.put("dicSet", dicSet);
			resultMap.put("code", Const.SUCCESS);
			
		} catch (Exception e) {
			log.error("查询字典失败", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询字典失败->数据库异常！");
		}
		return resultMap;
	}
	

	@Override
	public Map getDemandList(Map<String,Object> param) {
		Map result = new HashMap();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			
			if("queryAll".equals(param.get("queryType"))){
				List list=new ArrayList();
				if("comprehensive".equals(param.get("searchType"))){
					list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getComprehensiveListPage", param);
				}else{
					list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandListPage", param);
				}
				result.put("code", Const.SUCCESS);
				result.put("msg", "成功");
				result.put("list", list);
			}else{
				if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pagenum不能为空" );
					return result;
		 		}
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pagesize不能为空" );
					return result;
		 		}
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
			
				//总行数  
				String sum="";
				List list=new ArrayList();
				if("comprehensive".equals(param.get("searchType"))){
					sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getComprehensiveListSum", param);
		  	        param.put("page_num",  (pagenum-1) * pagesize );
		  	       //当前页内容
		  	        list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getComprehensiveListPage", param);
				}else{
					sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandListSum", param);
		  	        param.put("page_num",  (pagenum-1) * pagesize );
		  	       //当前页内容
		  	        list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandListPage", param);
				}
	  	        result.put("code", Const.SUCCESS);
				result.put("msg", "成功");
				result.put("list", list);
				result.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
	     
		return result;
	}
	
	
	@Override
	public Map getServiceList(Map<String,Object> param) {
		Map result = new HashMap();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getServiceListPage", param);
				result.put("code", Const.SUCCESS);
				result.put("msg", "成功");
				result.put("list", list);
			}else{
				if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pagenum不能为空" );
					return result;
		 		}
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pagesize不能为空" );
					return result;
		 		}
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				
//				String sums = (String) this.cpcDao.qryObject(NAME_SPACE, "getServiceList_state", param);
//				param.put("sums", sums);
//				String nums = (String) this.cpcDao.qryObject(NAME_SPACE, "getServiceList_states", param);
//				if(nums.equals("100107")){
//					//总行数  
//					param.put("nodes_id", "100102");
//					String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getServiceListSumzs", param);
//		  	        param.put("page_num",  (pagenum-1) * pagesize );
//		  	       //当前页内容
//		  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getServiceListPagezs", param);
//		  	        result.put("code", Const.SUCCESS);
//					result.put("msg", "成功");
//					result.put("list", list);
//					result.put("sum",  sum);
//				}else{
					//总行数  
					String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getServiceListSum", param);
		  	        param.put("page_num",  (pagenum-1) * pagesize );
		  	       //当前页内容
		  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getServiceListPage", param);
		  	        result.put("code", Const.SUCCESS);
					result.put("msg", "成功");
					result.put("list", list);
					result.put("sum",  sum);
//				}
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("服务单列表查询异常", e);
		}
	     
		return result;
	}
	
	@Override
	public Map getSysList(Map<String,Object> param) {
		Map result = new HashMap();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagenum不能为空" );
				return result;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
			if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagesize不能为空" );
				return result;
	 		}
			pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
		
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getSysListSum", param);
  	        param.put("page_num",  (pagenum-1) * pagesize );
  	       //当前页内容
  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysListPage", param);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("专业系统列表查询异常", e);
		}
	     
		return result;
	}

	@Override
	public Map getRecordSumList(Map param) {
		Map result = new HashMap();
		try {
			List resultCount = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_flow_record_status", param);
			result.put("code", "0");
			result.put("msg", "成功");
			result.put("list", resultCount);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("按环节统计每个功能总量", e);
		}
	     
		return result;
	}

	@Override
	public Map urgedDemand(Map param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "update_demand_urge_count", param);
			this.cpcDao.update(NAME_SPACE, "update_record_urge_count", param);
			
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("催单", e);
		}
		return result;
		
	}

	@Override
	public Map getAllFlowNode(Map param) {
		Map result = new HashMap();
		try {
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getAllFlowNode", param);
			result.put("code", "0");
			result.put("msg", "成功");
			result.put("list", list);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("催单", e);
		}
		return result;
	}

	@Override
	public Map saveRecordProc(Map param) {
		Map result = new HashMap();
		try {
			this.cpcDao.batchOperationTable("insert",NAME_SPACE, "getAllFlowNode",param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}

	@Override
	public Map updateDemand(Map param) {
		Map result = new HashMap();
		try {
			List list = new ArrayList();
			String demand_id = param.get("demand_id").toString();
			param.remove("demand_id");
			Set<String> key = param.keySet();
			for (Iterator it = key.iterator(); it.hasNext();) {
				Map temp = new HashMap();
				String keyStr = it.next().toString();
				temp.put("col_name", keyStr);
				temp.put("col_value", param.get(keyStr));
				list.add(temp);
	        }
			param.put("demand_id", demand_id);
			param.put("updateColSet", list);
			this.cpcDao.batchOperationTable("update",NAME_SPACE, "updateDemand",param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单实例变更", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> removeDemandDraftLst(Map<String, Object> param) {
		Map result = new HashMap();
		try {			
			this.cpcDao.delete(NAME_SPACE, "delete_demand_draft_list", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单实例草稿删除", e);
		}
		return result;
	}
	
	@Override
	public Map<String, Object> getLatnData(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("msg","成功");
		try {
			List<Map<String,Object>> latnSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "getLatnData", param);
			
			resultMap.put("latnSet", latnSet);
			resultMap.put("code", Const.SUCCESS);
			
		} catch (Exception e) {
			log.error("查询本地网失败", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询本地网失败->数据库异常！");
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> login(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			result = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_user_info", param);
			if(!StringUtils.isEmpty(result)){
				result.put("code", "0");
				result.put("msg", "成功");
			}else{
				result = new HashMap();
				result.put("code", "1");
				result.put("msg", "账号或密码错误");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("登陆查询异常", e);
		}
		return result;
	}


	@Override
	public Map<String, Object> getSysOrg(Map<String, Object> param) {
		Map result = new HashMap();
		String deptType=String.valueOf(param.get("deptType"));
		try {
			List list = new ArrayList();
			if(!Tools.isNull(param.get("qryType"))){
				 list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysOrgByType", param);
				 
				 List resultLst = null;
					
					for(int i=0; i<list.size(); i++) {
						Map map = new HashMap();
						map = (Map) list.get(i);
						String pid = (String) map.get("pid");
						String org_id = (String) map.get("org_id");
						Map<String, Object> pidparam = new HashMap<String, Object>();
						if(!"".equals(pid) && pid != null) {
							Boolean checkFlag = false;
							for(int j=0; j<list.size(); j++) {
								Map map1 = new HashMap();
								map1 = (Map) list.get(j);
								String org_id1 = (String) map1.get("org_id");
								if(pid == org_id1 || pid.equals(org_id1)) {
									checkFlag = true;
								}
							}
							pidparam.put("org_code", pid);
							pidparam.put("region_code", param.get("region_code"));
							List<Map<String, Object>> pidlist = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysOrg", pidparam);
							Map pmap=new HashMap<String, Object>();
							if(!Tools.isNull(pidlist)){
								pmap = (Map) pidlist.get(0);
							}
							//String porg_id = (String) pmap.get("org_id");
							if(!checkFlag&&!Tools.isNull(pmap)) {
								list.add(pmap);
							}
						}
					}
					if(param.containsKey("pid") && !"search".equals(param.get("pid"))){
						resultLst = CommonUtil.getList(list,String.valueOf(param.get("pid")));
					}
					result.put("list", resultLst);
			}else if(!Tools.isNull(deptType)&&"centerDept".equals(deptType)){
				list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysOrgByPid", param);
				Map<String,Object> pidMap=new HashMap<String,Object>();
				pidMap.put("org_id", param.get("pid"));
				pidMap.put("org_name", param.get("orgName"));
				pidMap.put("pid", "");
				list.add(pidMap);
				if(param.containsKey("pid") && !"search".equals(param.get("pid"))){
					list = CommonUtil.getList(list,"");
				}
			    result.put("list", list);
			}else{
				 list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysOrg", param);
				 if(param.containsKey("pid") && !"search".equals(param.get("pid"))){
						list = CommonUtil.getList(list,String.valueOf(param.get("pid")));
					}
				result.put("list", list);
			}
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("通用组织机构树Service", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> getStaffByOrgId(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getStaffByOrgId", param);
			result.put("code", "0");
			result.put("msg", "成功");
 			result.put("list", list);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("通用组织机构树Service", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> qryPoolOpts(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List poolRelLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPoolOpts", param);
			result.put("code", "0");
			result.put("msg", "成功");
 			result.put("poolRelLst", poolRelLst);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询单池关系失败", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> selectDraftCount(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List<Map<String,Object>> draftCountSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_draft_count", param);
			
			result.put("code", "0");
			result.put("msg", "成功");
			result.put("draftCountSet", draftCountSet);
			 
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("统计需求中当前记录id为空异常", e);
		}
		return result;
	}

	@Override
	public Map<String,Object> insertOutSysFlowRecord(Map<String, Object> param) {
		
		Map<String,Object> result = new HashMap<String,Object>();
		if(Tools.isNull(param)){
			result.put("code", "-1");
			result.put("msg", "入参不符合JSON格式");
			return result;
		}
		
		if(Tools.isNull(param.get("outSysId"))){
			result.put("code", "-2");
			result.put("msg", "接入专业系统编码错误请修改");
			return result;
		}
		
		try {
			//验证获取系统编码
			Map<String,Object> dicMap = new HashMap<String,Object>();
			dicMap.put("dicType", "outSysId");
			dicMap.put("dicCode", param.get("outSysId"));
			List<Map<String,Object>> dicSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_dic", dicMap);
			if(Tools.isNull(dicSet)){
				result.put("code", "-3");
				result.put("msg", "系统编码为空或不符合规范");
				return result;
			}
			//属性验证
			String formatKeys = "flowRecordId,nodeRecordId,flowTheme,flowName,nodeName,flowStatus" +
								",optTime,createTime,optStatus,optRemark,opterId,opterName" +
								",opterOrgId,opterOrgName,latnId,outSysId";
			String notfounds = this.validateOutSysParam( param, formatKeys);
			if(!Tools.isNull(notfounds)){
				result.put("code", "-4");
				result.put("msg", "notfounds:{"+notfounds+"}");
				return result;
			}
			//查询流程是否已经存在
			Map<String,Object> flowMap = new HashMap<String,Object>();
			flowMap.put("flowRecordId"	, param.get("flowRecordId"));
			flowMap.put("outSysId"		, param.get("outSysId"));
			
			List<Map<String,Object>> outSysFlowSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_out_sys_flow", flowMap);
			if(!Tools.isNull(outSysFlowSet) && outSysFlowSet.size()>0){
				//变更流程记录
				this.cpcDao.update(NAME_SPACE, "update_out_sys_flow", param);
			}else{
				//插入流程记录
				this.cpcDao.insert(NAME_SPACE, "insert_out_sys_flow", param);
			}
			//插入过程记录
			this.cpcDao.insert(NAME_SPACE, "insert_out_sys_flow_record", param);
			result.put("code", "0");
			result.put("msg", "记录保存成功");
		} catch (Exception e) {
			log.error("外系统流转单记录失败", e);
		}
		
		return param;
	} 

	private String validateOutSysParam(Map<String, Object> param, String formatKeys){
		
		String notFounds = "";
		
		for(String key : formatKeys.split(",")){
			boolean isExists = false;
			for(Iterator itP = param.keySet().iterator(); itP.hasNext();){
				String keyP = String.valueOf(itP.next());
				if(key.equals(keyP)){
					isExists = true;
					break;
				}
			}
			//不存在记录
			if(!isExists){
				if(!notFounds.equals(""))
					notFounds += ",";
				notFounds += key;
			}
		}
		
		return notFounds;
	}

	@Override
	public Map<String, Object> qryOutSysFlow(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			if(Tools.isNull(param.get("pagenum"))){
				resultMap.put("code", "-1");
				resultMap.put("msg", "查询分页当前页pagenum没有传值");
				return resultMap;
			}
			if(Tools.isNull(param.get("pagesize"))){
				resultMap.put("code", "-1");
				resultMap.put("msg", "查询分页大小页pagesize没有传值");
				return resultMap;
			}
			
			long pageNum = Long.valueOf(String.valueOf(param.get("pagenum")));
			long pagesize = Long.valueOf(String.valueOf(param.get("pagesize")));
			
			long limit = (pageNum-1)*pagesize;
			param.put("limit", limit);
			//查询数据库
			Map<String,Object> countMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_out_sys_flow_count", param);
			String counts = String.valueOf(countMap.get("flowCount"));
			long count = Long.valueOf(Tools.isNull(counts)?"0":counts);
			Map<String,Object> outSysFlowMap = new HashMap<String,Object>();
			List<Map<String,Object>> outSysFlowSet = null;
			if(count>0){
				outSysFlowSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_out_sys_flow", param);
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("size", countMap.get("flowCount"));
			resultMap.put("list", outSysFlowSet);
		} catch (Exception e) {
			log.error("查询专业系统流程失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询专业系统流程失败，网络异常或条件错误！");
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> qryOutSysFlowRecord(Map<String, Object> param) {

		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			Map<String,Object> outFlowMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_out_sys_flow", param);
			List<Map<String,Object>> outSysRecordSet = new ArrayList<Map<String,Object>>();
			if(!Tools.isNull(outFlowMap) 
					&& !Tools.isNull(param.get("isHistory"))
					&& "Y".equals(String.valueOf(param.get("isHistory")))){
				outSysRecordSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_out_sys_flow_record", param);
				
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("outFlow", outFlowMap);
			resultMap.put("outFlowRecordSet", outSysRecordSet);
		} catch (Exception e) {
			log.error("查询专业系统流程记录失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询专业系统流程记录失败，网络异常或条件错误！");
		}
		
		
		return resultMap;
	}

	@Override
	public Map<String, Object> getStaffInfo(Map<String, Object> paramMap) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			Map<String,Object> staffMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_staff_info", paramMap);
			if(Tools.isNull(staffMap)){
				resultMap.put("code", "-1");
				resultMap.put("msg", "此工号不存在！");
			}else{
				resultMap.put("code", "0");
				resultMap.put("msg", "成功");
				resultMap.put("staff", staffMap);
			}
			
		} catch (Exception e) {
			log.error("查询员工信息失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询员工信息失败，网络异常或条件错误！");
		}
		
		
		return resultMap;
	}

	
	@Override
	public Map<String, Object> validateBusiFlowRel(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			Map<String,Object> colmap = this.getMapCond( param, "");
			Map<String,Object> busiFlowRel = this.cpcDao.qryMapInfo(NAME_SPACE, "select_busi_flow_rel", colmap);
			String nullColumns = this.busiFlowRel( param, busiFlowRel);
			boolean hasBusiFlowRel = false;
			if(Tools.isNull(nullColumns)){
				hasBusiFlowRel = true;
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("hasBusiFlowRel", hasBusiFlowRel);
		} catch (Exception e) {
			log.error("保存业务流程关联关系失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "保存业务流程关联关系失败，网络异常或条件错误！");
		}
		
		return resultMap;
	}
	
	@Override
	public Map<String, Object> saveBusiFlowRel(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		try {
			
			Map<String,Object> colmap = this.getMapCond( param, "");
			Map<String,Object> busiFlowRel = this.cpcDao.qryMapInfo(NAME_SPACE, "select_busi_flow_rel", colmap);
			String nullColumns = this.busiFlowRel( param, busiFlowRel);
			if(null == nullColumns){
				this.cpcDao.insert(NAME_SPACE, "insert_busi_flow_rel", colmap);
			}
			else if(!"".equals(nullColumns)){
				colmap = this.getMapCond( param, nullColumns);
				this.cpcDao.update(NAME_SPACE, "update_busi_flow_rel", colmap);
			}else{
				resultMap.put("code", "0");
				resultMap.put("msg", "已经存在，无需保存关系");
				resultMap.put("status", "N");
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			log.error("保存业务流程关联关系失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "保存业务流程关联关系失败，网络异常或条件错误！");
		}
		
		
		return resultMap;
	}
	
	private Map<String,Object> getMapCond(Map<String, Object> param,String nullColumns){
		
		Map<String,Object> map = new HashMap<String,Object>();
		
		List<Map<String,Object>> condList = new ArrayList<Map<String,Object>>();
		List<Map<String,Object>> changeList = new ArrayList<Map<String,Object>>();
		
		for(Iterator it = param.keySet().iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			boolean isExists = false;
			for(String nullColumn : nullColumns.split(",")){
				if(key.equals(nullColumn)){
					Map<String,Object> changeMap = new HashMap<String,Object>();
					changeMap.put("key", key);
					changeMap.put("value", param.get(key));
					changeList.add(changeMap);
					isExists = true;
					break;
				}
			}
			
			if(!isExists){
				Map<String,Object> condMap = new HashMap<String,Object>();
				condMap.put("key", key);
				condMap.put("value", param.get(key));
				condList.add(condMap);
			}
		}
		
		map.put("condList", condList);
		map.put("changeList", changeList);
		
		return map;
	}
	/**
	 * 是否已经保存成功关系
	 * @param param
	 * @param busiFlowRel
	 * @return
	 */
	private String busiFlowRel(Map<String, Object> param, Map<String, Object> busiFlowRel){
		String nullColumn = "";
		if(Tools.isNull(busiFlowRel)){
			return null;
		}
		for(Iterator it = param.keySet().iterator(); it.hasNext();){
			String key = String.valueOf(it.next());
			if(Tools.isNull(busiFlowRel.get(key))){
				if(!"".equals(nullColumn))
					nullColumn += ",";
				nullColumn += key;
			}
		}
		
		return nullColumn;
	}

	@Override
	public Map<String, Object> updatePwd(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			int num = this.cpcDao.update(NAME_SPACE, "update_pwd", param);
			if(num == 1){
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
			}else{
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "密码修改失败");
			}
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "密码修改失败"+e);
			e.printStackTrace();
			log.error("密码自改service"+e);
		}
		return resultMap;
	}


	@Override
	public Map<String, Object> queryNodeByFunId(String funId) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		try {
			Map<String,Object> param = new HashMap<String, Object>();
			param.put("fun_id",funId); 
			List nodeLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryNodeByFunId", param);
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("nodeLst", nodeLst);
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询功能数据失败", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryNews(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> newsSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_news", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("newsSet", newsSet);
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询失败，数据访问异常"+e);
			log.error("查询失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> starEvalOnMonth(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		Object obj = param.get("starEvalSet");
		if(Tools.isNull(obj)
				|| !(obj instanceof List)){
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "没有接收到数据集合：starEvalSet。");
			return resultMap;
		}
		
		try {
			Map<String,Object> parMap = new HashMap<String,Object>();
			List<Map<String,Object>> starEvalSet = this.rendarSubmitEval((List<Map<String, Object>>) obj);
			parMap.put("List", starEvalSet);
			//设置评价信息
			this.cpcDao.batchOperationTable("update", NAME_SPACE, "update_star_eval_info", parMap);
			//汇总信息
			List<Map<String,Object>> starEvalTotalSet = this.getStarEvalTotalSet(starEvalSet);
			parMap.put("List", starEvalTotalSet);
			this.cpcDao.batchOperationTable("update", NAME_SPACE, "update_star_eval_total", parMap);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "批量保存评价信息失败，数据访问异常！"+e);
			log.error("批量保存评价信息失败，数据访问异常！",e);
		}
		return resultMap;
	}
	
	private List<Map<String,Object>> rendarSubmitEval(List<Map<String,Object>> starEvalSet){
		
		List<Map<String,Object>> starEvalRows = new ArrayList<Map<String,Object>>();
		
		for(Map<String,Object> starEval : starEvalSet){
			
			String evalId = String.valueOf(starEval.get("eval_id"));
			
			boolean isExists = false;
			for(Map<String,Object> starEvalRow : starEvalRows){
				String evalRowId = String.valueOf(starEvalRow.get("eval_id"));
				if(evalRowId.equals(evalId)){
					isExists = true;
					String key = String.valueOf(starEval.get("column"));
					String val = String.valueOf(starEval.get("eval_star"));
					starEvalRow.put(key, val);
				}
			}
			
			if(!isExists){
				Map<String,Object> starEvalRow = new HashMap<String,Object>();
				String key = String.valueOf(starEval.get("column"));
				String val = String.valueOf(starEval.get("eval_star"));
				starEvalRow.putAll(starEval);
				starEvalRow.put(key,val);
				starEvalRows.add(starEvalRow);
			}
		}
		
		
		return starEvalRows;
	}

	/**
	 * 获取评价汇总集合
	 * @param starEvalSet
	 * @return
	 */
	private List<Map<String,Object>> getStarEvalTotalSet(List<Map<String,Object>> starEvalSet){
		
		List<Map<String,Object>> starEvalTotalSet = new ArrayList<Map<String,Object>>();
		for(Map<String,Object> starEval : starEvalSet){
			String total_id = String.valueOf(starEval.get("total_id"));
			boolean isExists = false;
			for(Map<String,Object> starEvalTotal : starEvalTotalSet){
				if(total_id.equals(String.valueOf(starEvalTotal.get("total_id")))){
					isExists = true;
					break;
				}
			}
			if(!isExists){
				Map<String,Object> starEvalTotal = new HashMap<String,Object>();
				starEvalTotal.put("total_id", total_id);
				starEvalTotalSet.add(starEvalTotal);
			}
		}
		
		return starEvalTotalSet;
	}

	@Override
	public Map<String, Object> updateLookNews(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "update_look_news", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "变更消息查看失败，数据访问异常"+e);
			log.error("变更消息查看失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryNewsInfoByType(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			
			if(Tools.isNull(param.get("news_type"))){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "消息类型为空，请增加传参news_type");
				return resultMap;
			}
			
			Map<String,Object> result = new HashMap<String,Object>();
			
			String newsType = String.valueOf(param.get("news_type"));
			
			//五星评价查看
			if(newsType.equals("STAR_EVAL")){
				Map<String,Object> totalMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_starEvalTotal_by_newsType", param);
				List<Map<String,Object>> starEvalInfoSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_starEval_by_newsType", totalMap);
				totalMap.put("staff_name", param.get("staff_name"));
				result.put("totalInfo", totalMap);
				result.put("starEvalInfoSet", starEvalInfoSet);
			}
			resultMap.put("result", result);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "根据类型查看消息详情失败，数据访问异常"+e);
			log.error("根据类型查看消息详情失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getNotLookNewsCount(Map<String, Object> param) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			Map<String,Object> notLookNewsCountsMap = this.cpcDao.qryMapInfo(NAME_SPACE, "select_notLook_news_count", param);
			resultMap.put("notLookNewsCount", notLookNewsCountsMap.get("not_look_count"));
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "变更消息查看失败，数据访问异常"+e);
			log.error("变更消息查看失败，数据访问异常",e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> querySysUserInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> sysInfoLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "querySysUserInfo", param);
			resultMap.put("sysInfoLst", sysInfoLst);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询用户信息异常"+e);
			log.error("查询用户信息异常",e);
		}
		return resultMap;
	}
	

	@Override
	public Map<String, Object> queryNeedEvalList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "pagenum不能为空" );
				return resultMap;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
			if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "pagesize不能为空" );
				return resultMap;
	 		}
			pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
		
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryNeedEvalListSum", param);
  	        param.put("page_num",  (pagenum-1) * pagesize );
  	        //当前页内容
  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryNeedEvalListPage", param);
  	        resultMap.put("code", Const.SUCCESS);
  	        resultMap.put("msg", "成功");
			resultMap.put("list", list);
			resultMap.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取待评价的数据异常！", e);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> queryNeedEvalServiceList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
//			if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
//				resultMap.put("code", Const.FAIL_SQL);
//				resultMap.put("msg", "pagenum不能为空" );
//				return resultMap;
//	 		}
//			pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
//			if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
//				resultMap.put("code", Const.FAIL_SQL);
//				resultMap.put("msg", "pagesize不能为空" );
//				return resultMap;
//	 		}
//			pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
//		
			//总行数  
//			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryNeedEvalServiceListSum", param);
//  	        param.put("page_num",  (pagenum-1) * pagesize );
  	        //当前页内容
  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryNeedEvalServiceListPage", param);
  	        resultMap.put("code", Const.SUCCESS);
  	        resultMap.put("msg", "成功");
			resultMap.put("list", list);
//			resultMap.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取待评价服务单的数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> saveEvalData(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "saveEvalData", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "评价成功");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "评价异常"+e);
			log.error("评价异常",e);
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> getDateConfigData(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List  holiDayList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryHoliDayList", param);
			List  workDayList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkDayList", param);
			Map<String,Object> timeData = this.cpcDao.qryMapInfo(NAME_SPACE, "queryTimeData", param);
			resultMap.put("code", Const.SUCCESS);
  	        resultMap.put("msg", "成功");
			resultMap.put("holiDayList", holiDayList);
			resultMap.put("workDayList",  workDayList);
			resultMap.put("timeData",  timeData);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取日期相关数据异常！", e);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> getCeoSysOrg(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getCeoSysOrg", param);
			result.put("code", "0");
			result.put("msg", "成功");
			List resultLst = null;
			
			for(int i=0; i<list.size(); i++) {
				Map map = new HashMap();
				map = (Map) list.get(i);
				String pid = (String) map.get("pid");
				String org_id = (String) map.get("org_id");
				Map<String, Object> pidparam = new HashMap<String, Object>();
				if(!"".equals(pid) && pid != null) {
					pidparam.put("org_code", pid);
					pidparam.put("region_code", param.get("region_code"));
					List<Map<String, Object>> pidlist = this.cpcDao.qryMapListInfos(NAME_SPACE, "getSysOrg", pidparam);
					Map pmap = (Map) pidlist.get(0);
					String porg_id = (String) pmap.get("org_id");
					
					Boolean checkFlag = false;
					for(int j=0; j<list.size(); j++) {
						Map map1 = new HashMap();
						map1 = (Map) list.get(j);
						String org_id1 = (String) map1.get("org_id");
						if(porg_id == org_id1 || porg_id.equals(org_id1)) {
							checkFlag = true;
						}
					}
					if(!checkFlag) {
						list.add(pmap);
					}
				}
			}
			
			if(param.containsKey("pid") && !"search".equals(param.get("pid"))){
				resultLst = CommonUtil.getList(list,String.valueOf(param.get("pid")));
			}
			result.put("list", resultLst);
			/*if(resultLst == null || resultLst.size() == 0) {
				for(int i=0; i<list.size(); i++) {
					Map map = new HashMap();
					map = (Map) list.get(i);
					map.put("childNode", new ArrayList());
				}
				result.put("list", list);
			}else {
				result.put("list", resultLst);
			}*/
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("通用组织机构树Service", e);
		}
		return result;
	}
	
	@Override
	public Map<String, Object> updateLoginState(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateLoginState", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
		}
		return result;
	}
	
	@Override
	public Map<String, Object> checkLogin(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "checkLogin", param);
			if(list == null || list.size() == 0) {
				result.put("code", "1");
				result.put("msg", "未登录");
			}else {
				result.put("code", "0");
				result.put("msg", "已登录");
			}
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
		}
		return result;
	}

	@Override
	public Map<String, Object> getDeptSysOrg(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "getDeptSysOrg", param);
			List resultList=null;
			if(param.containsKey("pid") && !"search".equals(param.get("pid"))){
				resultList = CommonUtil.getList(list,String.valueOf(param.get("pid")));
			}
			resultMap.put("list", resultList);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询专业部门成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("通用组织机构树Service", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getDemandsaveLst(Map<String, Object> param) {
		Map<String,Object> result=new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		//判断是查询草稿，还是删除草稿条件
		String handleType="";
		try {
			handleType=(String)param.get("handleType");
			if(handleType.equals("getDemandALL")){
				
			
		if(null == param.get("pagenum") || "".equals(param.get("pagenum"))){
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "pagenum不能为空" );
			return result;
 		}
		pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
		if(null == param.get("pagesize") || "".equals(param.get("pagesize"))){
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "pagesize不能为空" );
			return result;
 		}
		pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
		 
		param.put("isDraft", "Y");
				//总行数  
				   String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandsaveLstSum", param);
			       param.put("pagenum",  (pagenum) * pagesize );
			       //当前页内容
			       List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandsaveLstPage", param);
			       result.put("code", Const.SUCCESS);
			       result.put("msg", "成功");
			       result.put("list", list);
			       result.put("sum",  sum);
			}
			else if (handleType.equals("deleteDemand")){	
				  this.cpcDao.delete(NAME_SPACE, "delete_demand_save", param);
				  result.put("code", Const.SUCCESS);
				  result.put("msg", "成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("通用组织机构树Service", e);
		}
		return result;

	}

	@Override
	public Map<String, Object> showStaff(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			String methodtype=(String)param.get("methodtype");
			if("shi".equals(methodtype)){
				
				List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "showStaff", param);
				resultMap.put("list", list);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "查询省市领导工号信息成功");
			}else if ("sheng".equals(methodtype)){
				List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "showStaff_s", param);
				resultMap.put("list", list);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "查询省市领导工号信息成功");
			}
		
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询省市领导工号信息异常Service", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updateflow(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			String methodtype=(String)param.get("methodtype");
			if("update".equals(methodtype)){
				
			this.cpcDao.update(NAME_SPACE, "update_flow_record_service", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "省市领导留言成功");
			}else if ("query".equals(methodtype)){
				  String opt_desc = (String) this.cpcDao.qryObject(NAME_SPACE, "query_flow_record_service", param);
				  
				  resultMap.put("opt_desc", opt_desc);
				  resultMap.put("code", Const.SUCCESS);
					resultMap.put("msg", "省市领导留言查询成功");
			}else if("updateDesc".equals(methodtype)){
				this.cpcDao.update(NAME_SPACE, "update_record_opt_desc", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "添加再处理意见成功！");
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询省市领导工号信息异常Service", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getLoginCodeList(Map<String, Object> param) {
		Map<String, Object> resultMap=new HashMap<String,Object>();
		try {
			List loginCodeSet=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_login_code_list", param);
			resultMap.put("list", loginCodeSet);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询部门下的员工信息成功！");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询部门下的员工信息", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> deleteFile(Map<String, Object> param) {
		Map<String, Object> resultMap=new HashMap<String,Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "delete_file_info", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg","删除附件信息成功！");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除附件信息异常", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryHistoryRecord(Map<String, Object> param) {
		Map<String, Object> resultMap=new HashMap<String,Object>();
		try {
			List recordSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "select_flow_record", param);
			resultMap.put("recordSet", recordSet);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询流程信息成功！");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询流程信息成功！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryDeptStaffInfo(Map<String, Object> param) {
        Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			
			System.out.println("===================param=================="+param);
			Map<String,Object> staffMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_dept_staff_info", param);
			
			System.out.println("================staffMap============"+staffMap);
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("staff", staffMap);
		} catch (Exception e) {
			log.error("查询员工信息失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询员工信息失败，网络异常或条件错误！");
		}
		
		
		return resultMap;
	}

	@Override
	public Map<String, Object> uploadDemandImages(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			//先查询上传相片是否存在
			List<Map<String, Object>> existList = this.cpcDao.qryMapListInfos(NAME_SPACE, "selectUploadImages", param);
			
			if(existList.size()==0) {
				this.cpcDao.insert(NAME_SPACE, "insertUploadImages", param);
				result.put("code", "0");
				result.put("msg", "成功");
			}else{
				result.put("code", "-1");
				result.put("msg", "失败");
			}
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}
	
}
