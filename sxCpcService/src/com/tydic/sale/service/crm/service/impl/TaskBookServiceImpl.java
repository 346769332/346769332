package com.tydic.sale.service.crm.service.impl;

import java.io.File;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.TaskBookService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;

public class TaskBookServiceImpl implements TaskBookService {
    private final static Logger logger = LoggerFactory.getLogger(FlowServiceImpl.class);
	private final static String NAME_SPACE="taskBook";
	private WebApplicationContext springContext;
	
	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	@Override
	public Map<String, Object> qryTaskBookList(Map<String, Object> param) {
		Map<String,Object> result=new HashMap<String,Object>();
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
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qry_task_book_sum", param);
  	        param.put("page_num",  (pagenum-1) * pagesize );
  	       //当前页内容
  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_task_book_list", param);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("data", list);
			result.put("totalSize",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			logger.error("专业系统列表查询异常", e);
		}
	     
		return result;
	}

	@Override
	public Map<String, Object> submitTaskBook(Map<String, Object> reqMap,String handleType) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		resultMap.put("code", "0");
		resultMap.put("msg", "成功！");
		Map<String,Object> param=new HashMap<String,Object>();
		if("1".equals(handleType)){//发起审批
			String record_id="";
			try {
				record_id=(String)this.cpcDao.qryObject(NAME_SPACE, "qry_task_record_id", param);
			} catch (Exception e) {
				resultMap.put("code", "-1");
				resultMap.put("msg", "查询流程记录id异常！");
				logger.error("查询seq_task_record_id异常", e);
				e.printStackTrace();
				return resultMap;
			}

			Map<String,Object> saveFlowMap=this.saveFlow(reqMap,record_id);
			if(!"0".equals(saveFlowMap.get("code"))){
				resultMap.put("code", "-1");//失败
				resultMap.put("msg", saveFlowMap.get("msg"));
				resultMap.put("demandId","");
				return resultMap;
			}else if("0".equals(saveFlowMap.get("code"))){
				//流程流转成功
				param=new HashMap<String,Object>();
				param.put("curr_record_id", String.valueOf(saveFlowMap.get("curr_record_id")));
				param.put("taskCode", reqMap.get("taskCode"));
//				Date nowDate=new Date();
//			    String nowTime=sdf.format(nowDate);
//			    param.put("createTime", nowTime);
				try {
					this.cpcDao.update(NAME_SPACE, "update_task_info", param);
				} catch (Exception e) {
					resultMap.put("code", "-1");
					resultMap.put("msg", "修改失败！");
					e.printStackTrace();
					return resultMap;
				}
			}
		
		}
		return resultMap;
	}
	private Map<String,Object> saveFlow(Map<String,Object> reqMap,String recordId){
		Map<String,Object> result=new HashMap<String,Object>();
		String taskCode=String.valueOf(reqMap.get("taskCode"));
		String flowId="200";
		Map<String,Object> parMap=new HashMap<String,Object>();
		parMap.put("flow_id", flowId);
		List<Map<String,Object>> nodeList=new ArrayList<Map<String,Object>>();
		try {
			 nodeList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_node_info", parMap);
		} catch (Exception e) {
			result.put("code", "-1");
			result.put("msg", "查询节点信息异常！");
			e.printStackTrace();
			return result;
		}
		//查询责任书信息
		Map<String,Object> taskInfo=new HashMap<String,Object>();
		parMap=new HashMap<String,Object>();
		parMap.put("taskCode", taskCode);
		String obu_id="";
		try {
			taskInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_task_book_info", reqMap);
			obu_id=String.valueOf(taskInfo.get("obu_id"));
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", "-1");//失败
			result.put("msg", "查询责任书信息异常！");			
			return result;
		}
		List<Map<String,Object>> flowMapList=new ArrayList<Map<String,Object>>();
		//下一步节点信息
		Map<String,Object> nextNodeMap = new HashMap<String, Object>();
		List flowList=new ArrayList();
		for(Map<String,Object> map:nodeList){
			if("100300".equals(String.valueOf(map.get("node_id")))){
				flowMapList.add(map);
				flowList.add("1");//发起审批
			}else if("100301".equals(String.valueOf(map.get("node_id")))){
				flowMapList.add(map);
				flowList.add("2");//待审批
				nextNodeMap=map;
			}
		}
		if(!flowList.contains("1")||!flowList.contains("2")){
			result.put("code", "1");//失败
			result.put("msg", "发起审批权限数据缺失");
			return result;
		}
		String curr_record_id="";//当前记录id
		//保存流程流转信息
		for(Map map:flowMapList){
			String curr_node_id=String.valueOf(map.get("node_id"));
			String curr_node_name=String.valueOf(map.get("node_name"));	
			String opt_id="";
			String opt_name="";
			String record_states="";
			String next_node_id="";
			String next_node_name="";
			String mobTel="";
			if("100300".equals(curr_node_id)){//发起
				opt_id=String.valueOf(reqMap.get("opt_id"));
				opt_name=String.valueOf(reqMap.get("opt_name"));
				record_states="1";
				next_node_id=String.valueOf(nextNodeMap.get("node_id"));
				next_node_name=String.valueOf(nextNodeMap.get("node_name"));
			}else if("100301".equals(curr_node_id)){//待审批
				//查询一级审批人
				parMap=new HashMap<String,Object>();
				parMap.put("obu_id", obu_id);
				try {
					Map<String,Object> optInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_opt_info", parMap);
					opt_id=String.valueOf(optInfo.get("first_opt_id"));
					opt_name=String.valueOf(optInfo.get("first_opt_name"));
					record_states="0";
					next_node_id="100301";//下一步二级审批
					next_node_name="待审批";
				} catch (Exception e) {
					result.put("code", "-1");
					result.put("msg", "查询审批人失败！");
					e.printStackTrace();
					return result;
				}
			}
			String record_id="";
			String on_record_id="";
			if("100300".equals(curr_node_id)){
				record_id=recordId;
			}else if("100301".equals(curr_node_id)){
				try {
					record_id=(String)this.cpcDao.qryObject(NAME_SPACE, "qry_task_record_id", null);
				} catch (Exception e) {
					e.printStackTrace();
					result.put("code", "-1");//失败
					result.put("msg", "查询qry_record_id异常");			
					return result;
				}
				on_record_id=recordId;
				curr_record_id=record_id;
			}
			parMap.clear();
			parMap.put("record_id", record_id);
			parMap.put("curr_node_id", curr_node_id);
			parMap.put("curr_node_name", curr_node_name);
			parMap.put("opt_id", opt_id);
			parMap.put("opt_name", opt_name);
			Date nowTime=new Date();
			parMap.put("opt_time", nowTime);
			parMap.put("next_node_id", next_node_id);
			parMap.put("next_node_name", next_node_name);
			parMap.put("time_count", 0);
			parMap.put("urge_count", 0);
			parMap.put("busi_id",taskCode);
			parMap.put("opt_desc", "");
			parMap.put("record_status", record_states);
			parMap.put("mob_tel", mobTel);
			parMap.put("on_record_id", on_record_id);
			try {
				this.cpcDao.insert(NAME_SPACE, "save_task_record", parMap);
			} catch (Exception e) {
				logger.error("保存流转记录异常"+e);
				e.printStackTrace();
				parMap.put("code", "-1");//失败
				parMap.put("msg", "保存流转记录异常");
				return parMap;
			}
		}
		result.put("curr_record_id", curr_record_id);
		result.put("code", "0");
		result.put("msg", "发起审批流程成功！");
		return result;
	}

	@Override
	public Map<String, Object> searchTaskInfo(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		Map<String,Object> taskInfo=new HashMap<String,Object>();
		List<Map<String,Object>> recordSet=new ArrayList<Map<String,Object>>();
		try {
			taskInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_task_book_info", param);
			recordSet=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_task_book_record", param);
			resultMap.put("taskInfo", taskInfo);
			resultMap.put("recordSet", recordSet);
			resultMap.put("code", "0");
			resultMap.put("msg", "查询责任书详情成功！");
		} catch (Exception e) {
			logger.error("查询责任书详情", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "责任书详情查询->查询参数传入异常！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> flowTaskBook(Map<String, Object> param) {
		Map<String,Object> result=new HashMap<String,Object>();
		Map<String,Object> reqMap = new HashMap<String, Object>();
		String record_id="";
		try {
			record_id=(String)this.cpcDao.qryObject(NAME_SPACE, "qry_task_record_id", null);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", "-1");//失败
			result.put("msg", "查询qry_record_id异常");			
			return result;
		}
		String funTypeId=String.valueOf(param.get("funTypeId"));
		String taskCode=String.valueOf(param.get("task_code"));
		//查询责任书信息
		Map<String,Object> taskInfo=new HashMap<String,Object>();
		reqMap.put("taskCode", taskCode);
		String obu_id="";
		try {
			taskInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_task_book_info", reqMap);
			obu_id=String.valueOf(taskInfo.get("obu_id"));
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", "-1");//失败
			result.put("msg", "查询责任书信息异常！");			
			return result;
		}
		boolean isOverFlow = false;
		if(!Tools.isNull(funTypeId)){//此操作需要走流程
			//获取操作流程节点信息
			Map<String,Object> nodeInfoMap = new HashMap<String, Object>();
			reqMap.put("fun_id", funTypeId);
			try {
				nodeInfoMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_node_by_funId", reqMap);
			} catch (Exception e) {
				e.printStackTrace();
				result.put("code", "-1");//失败
				result.put("msg", "当前操作无流程节点配置");			
				return result;
			}
			//生成新的业务流程
			reqMap = new HashMap<String, Object>();
			reqMap.put("record_id", record_id);
			reqMap.put("on_record_id", param.get("record_id"));
			reqMap.put("curr_node_id", nodeInfoMap.get("node_id"));
			reqMap.put("curr_node_name", nodeInfoMap.get("node_name"));
			reqMap.put("busi_id", taskCode);
			reqMap.put("opt_desc", "");
			Date nowTime=new Date();
			SimpleDateFormat sdf=new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			String opt_time=sdf.format(nowTime);
			reqMap.put("opt_time", nowTime);
			String opt_id="";
			String opt_name="";
			String record_status="0";
			String next_node_id="";
			String next_node_name="";
			if("100118".equals(funTypeId)||"100120".equals(funTypeId)){//审批不通过，到小承包人
				opt_id=String.valueOf(param.get("promoters_id"));
				opt_name=String.valueOf(param.get("promoters_name"));
				next_node_id="100300";
				next_node_name="发起审批";
			}else if("100119".equals(funTypeId)){//经理审批通过
				opt_id=String.valueOf(param.get("staffId"));
				opt_name=String.valueOf(param.get("staffName"));
				record_status="0";
				next_node_id="-1";
				next_node_name="结束";
				isOverFlow = true; //是最后一步流程
			}else if("100117".equals(funTypeId)){//副经理审批通过，到经理审批
				//查询二级审批人
				Map<String,Object> parMap=new HashMap<String,Object>();
				parMap.put("obu_id", obu_id);
				try {
					Map<String,Object> optInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_opt_info", parMap);
					opt_id=String.valueOf(optInfo.get("second_opt_id"));
					opt_name=String.valueOf(optInfo.get("second_opt_name"));
					next_node_id="100303";//下一步二级审批
					next_node_name="已发布";
				} catch (Exception e) {
					result.put("code", "-1");
					result.put("msg", "查询审批人失败！");
					e.printStackTrace();
					return result;
				}
			}else if("100121".equals(funTypeId)){//再次发起审批
				//查询一级审批人
				Map<String,Object> parMap=new HashMap<String,Object>();
				parMap.put("obu_id", obu_id);
				try {
					Map<String,Object> optInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_opt_info", parMap);
					opt_id=String.valueOf(optInfo.get("first_opt_id"));
					opt_name=String.valueOf(optInfo.get("first_opt_name"));
					next_node_id="100301";//下一步二级审批
					next_node_name="待审批";
				} catch (Exception e) {
					result.put("code", "-1");
					result.put("msg", "查询审批人失败！");
					e.printStackTrace();
					return result;
				}
			}
			reqMap.put("opt_id", opt_id);
			reqMap.put("opt_name", opt_name);
			reqMap.put("record_status", record_status);
			reqMap.put("next_node_id", next_node_id);
			reqMap.put("next_node_name", next_node_name);
			try {
				this.cpcDao.insert(NAME_SPACE, "save_task_record", reqMap);
			} catch (Exception e) {
				logger.error("保存流转记录异常"+e);
				e.printStackTrace();
				result.put("code", "-1");//失败
				result.put("msg", "保存流转记录异常");
				return result;
			}
			//更新当前业务状态为1失效状态
			try {
				int min=0;//计算环节耗时
				String last_opt_time=String.valueOf(param.get("opt_time"));
				if(!Tools.isNull(last_opt_time)){
					Date begin=sdf.parse(last_opt_time);
					Date end=sdf.parse(opt_time);
					double between=end.getTime()-begin.getTime();
					min=(int)between/(60*1000);
				}
				String recordId = String.valueOf(param.get("record_id"));
				String optDesc = String.valueOf(param.get("optDesc"));
				reqMap = new HashMap<String,Object>();
				reqMap.put("record_id", recordId);
				reqMap.put("opt_desc", optDesc);
				reqMap.put("next_node_id", nodeInfoMap.get("node_id"));
				reqMap.put("next_node_name",nodeInfoMap.get("node_name"));
				reqMap.put("record_status", "1");
				reqMap.put("time_count", min);
				reqMap.put("fun_id", funTypeId);
				this.updateFlowRecord(reqMap);
				
			} catch (Exception e) {
				logger.error("更新流程表状态"+e);
				e.printStackTrace();
				result.put("code", "1");//失败
				result.put("msg", "更新流程表状态"+e);
				return result;
			}
			//修改业务实例
			try {
				
				//String recordId = String.valueOf(param.get("record_id"));
				reqMap = new HashMap<String,Object>();
				reqMap.put("curr_record_id", record_id);
				reqMap.put("task_code", taskCode);
				this.updateTaskBook(reqMap);
				result.put("code", "0");
				result.put("msg", "流程流转成功！");
			} catch (Exception e) {
				logger.error("更新流程表状态"+e);
				e.printStackTrace();
				result.put("code", "1");//失败
				result.put("msg", "更新流程表状态"+e);
				return result;
			}
		}
		return result;
	}
	private Map updateFlowRecord(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String record_id = String.valueOf(param.get("record_id"));
		param.remove("record_id");
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
			
        }
		param.put("record_id", record_id);
		param.put("updateColSet", list);
		if(list.size()>0){
			this.cpcDao.update(NAME_SPACE, "updateFlowRecord",param);
		}
		return result;
	}
	private Map updateTaskBook(Map param) throws Exception {
		Map result = new HashMap();
		List list = new ArrayList();
		String task_code = param.get("task_code").toString();
		param.remove("task_code");
		Set<String> key = param.keySet();
		for (Iterator it = key.iterator(); it.hasNext();) {
			Map temp = new HashMap();
			String keyStr = it.next().toString();
			temp.put("col_name", keyStr);
			temp.put("col_value", param.get(keyStr));
			list.add(temp);
        }
		param.put("task_code", task_code);
		param.put("updateColSet", list);
		this.cpcDao.update(NAME_SPACE, "updateTaskBook",param);
		result.put("code", "0");
		result.put("msg", "成功");
		return result;
	}
	
	@Override
	public Map<String, Object> searchTaskBookInfo(Map<String, Object> inputParam) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		List<Map<String,Object>> normBookInfo = new ArrayList<Map<String,Object>>();
		try {
	    	if(!Tools.isNull(inputParam.get("model_id"))){ //查询责任书制定
	    		normBookInfo=this.cpcDao.qryMapListInfos(NAME_SPACE, "search_norm_book_info", inputParam);
			}
	    	if(!Tools.isNull(inputParam.get("model_type"))){ //查询责任书规范书人员信息 
	    		normBookInfo=this.cpcDao.qryMapListInfos(NAME_SPACE, "search_staff_book_info", inputParam);
			}
			resultMap.put("normBookInfo", normBookInfo);
			resultMap.put("code", "0");
		} catch (Exception e) {
			logger.error("查询责任书详情", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "责任书详情查询->查询参数传入异常！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> insertTaskBookInfo(Map<String, Object> inputParam) {
		List<Map<String,Object>> normBookInfo = new ArrayList<Map<String,Object>>();
		Map<String,Object> resultMap=new HashMap<String,Object>();
        try {
			String colIds = String.valueOf(inputParam.get("colIds"));
			String colValues = String.valueOf(inputParam.get("colValues"));
			String[] colIdArr = colIds.split(",");
			String[] colValueArr = colValues.split(",");
			Map<String,Object> colMap = new HashMap<String,Object>();
			colMap.put("modelType", inputParam.get("modelType"));
			colMap.put("staff_code", inputParam.get("promoters_id"));
			for(int i=0; i<colIdArr.length; i++){
				colMap.put("model_column", colIdArr[i]);
				colMap.put("model_context", colValueArr[i]);
				this.cpcDao.insert(NAME_SPACE, "update_taskBook_info", colMap);
			}
			resultMap.put("code","0");
			resultMap.put("msg", "修改规格书信息成功!");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "修改规格书信息失败！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryStaffTree(Map<String, Object> inputParam) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		Map<String,Object> staffInfo=new HashMap<String,Object>();
		List<Map<String,Object>> treeList=new ArrayList<Map<String,Object>>();
		try {
			staffInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_login_staff_info", inputParam);
			if(!Tools.isNull(staffInfo)){
				String tree_level=String.valueOf(staffInfo.get("TREE_LEVEL"));
				Map<String,Object> reqMap=new HashMap<String,Object>();
				if("2".equals(tree_level)){
					//属于市一级的，可以根据本地网id查找下面的
					String latn_id=String.valueOf(staffInfo.get("LATN_ID"));
					reqMap.put("latn_id", latn_id);
					treeList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_tree_list", reqMap);
				}else if("3".equals(tree_level)){
					//属于区县级的，可以根据父级p_tree_id查找下面的
					String tree_id=String.valueOf(staffInfo.get("TREE_ID"));
					reqMap.put("tree_id", tree_id);
					treeList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_tree_list", reqMap);
				}else{
					Map<String,Object> rootTree=new HashMap<String,Object>();
					rootTree.put("ID", staffInfo.get("TREE_ID"));
					rootTree.put("NAME", staffInfo.get("TREE_NAME"));
					rootTree.put("LEVEL", staffInfo.get("TREE_LEVEL"));
					rootTree.put("LATN_ID", staffInfo.get("LATN_ID"));
					rootTree.put("LATN_NAME", staffInfo.get("LATN_NAME"));
					rootTree.put("PID", "0");
					treeList.add(rootTree);
				}
				resultMap.put("staffInfo", staffInfo);
				resultMap.put("list", treeList);
				resultMap.put("code","0");
				resultMap.put("msg", "查询组织机构树成功！");
			}else{
				resultMap.put("code", "-1");
				resultMap.put("msg", "查询登录者信息异常！");
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询组织机构树异常！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryTaskModelList(Map<String, Object> inputParam) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		List<Map<String,Object>> taskModelList = new ArrayList<Map<String,Object>>();
		try {
			taskModelList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_task_model_list", inputParam);
			resultMap.put("taskModelList", taskModelList);
			resultMap.put("code", "0");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询责任书模板列表异常！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> releaseTaskBook(Map<String, Object> inputParam) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		Map<String,Object> reqMap = new HashMap<String,Object>();
		Map<String,Object> modelInfo=new HashMap<String,Object>();
		String modelId=String.valueOf(inputParam.get("modelId"));
		try {
			modelInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_task_model", inputParam);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询模板信息异常！");
			return resultMap;
		}
		//查询待发布的obu
		List<Map<String,Object>> obuList=new ArrayList<Map<String,Object>>();
		if(!Tools.isNull(modelInfo)){
			String task_type=String.valueOf(modelInfo.get("task_type"));
			String latn_id=String.valueOf(modelInfo.get("latn_id"));
			reqMap.put("task_type", task_type);
			reqMap.put("latn_id", latn_id);
		    try {
				obuList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_release_obu_list", reqMap);
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("code", "-1");
				resultMap.put("msg", "查询待发布的obu列表异常！");
				return resultMap;
			}
		}
		//生成代办
	    if(!Tools.isNull(obuList)){
	    	for(int i=0;i<obuList.size();i++){
	    		Map<String,Object> map=obuList.get(i);
	    		reqMap=new HashMap<String,Object>();
	    		//生成责任书编码
	    		String taskCode=modelId;
	    		if(i<10){
	    			taskCode+="00"+i;
	    		}else if(i<100){
	    			taskCode+="0"+i;
	    		}else if(i<1000){
	    			taskCode+=i;
	    		}
	    		reqMap.put("task_code", taskCode);
	    		reqMap.put("promoters_id", map.get("staff_id"));
	    		reqMap.put("promoters_name", map.get("staff_name"));
	    		reqMap.put("mob_tel", map.get("mob_tel"));
	    		reqMap.put("obu_id", map.get("obu_id"));
	    		reqMap.put("task_type", map.get("task_type"));
	    		reqMap.put("latn_id", map.get("latn_id"));
	    		reqMap.put("create_time", new Date());
	    		try {
					this.cpcDao.insert(NAME_SPACE, "insert_task_book_info", reqMap);
				} catch (Exception e) {
					e.printStackTrace();
					resultMap.put("code", "-1");
					resultMap.put("msg", "插入待办异常！");
					return resultMap;
				}
	    		
	    		//王世梅(将模板信息插入到人员模板表中)
		    	List<Map<String,Object>> normBookInfo = new ArrayList<Map<String,Object>>();
		    	Map<String,Object> staffNormInfo = new HashMap<String,Object>();
		    	staffNormInfo.put("model_id", modelId);
		    	try {
					normBookInfo=this.cpcDao.qryMapListInfos(NAME_SPACE, "search_norm_book_info", staffNormInfo);
					for (Map<String, Object> map2 : normBookInfo) {
						map2.put("model_type", map.get("task_type"));
						map2.put("staff_code", map.get("staff_id"));
					}
					this.cpcDao.batchInsert(NAME_SPACE, "save_staff_bookinfo", normBookInfo);
				} catch (Exception e1) {
					e1.printStackTrace();
				}
	    	}
	    	
	    	//修改模板状态
	    	reqMap=new HashMap<String,Object>();
	    	reqMap.put("modelId", modelId);
	    	try {
				this.cpcDao.update(NAME_SPACE, "update_model_state", reqMap);
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("code", "-1");
				resultMap.put("msg", "修改模板状态失败！");
				return resultMap;
			}
	    }
	    resultMap.put("code", "0");
	    resultMap.put("msg", "发布成功！");
		return resultMap;
	}

	@Override
	public Map<String, Object> qryAttachInfo(Map<String, Object> inputParam) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		resultMap.put("code", "0");
	    resultMap.put("msg", "查询上传文件信息成功！");
		List<Map<String,Object>> fileList = new ArrayList<Map<String,Object>>();
		try {
			fileList=this.cpcDao.qryMapListInfos(NAME_SPACE, "search_task_file_list", inputParam);
			resultMap.put("fileList", fileList);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询责任书上传文件失败！");
			return resultMap;
		}
		return resultMap;
	}
}
