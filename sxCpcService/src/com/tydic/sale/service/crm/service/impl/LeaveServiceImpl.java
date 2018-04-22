package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import net.sf.json.JSONArray;
import net.sf.json.JSONObject;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.LeaveService;
import com.tydic.sale.service.util.Const;

public class LeaveServiceImpl implements LeaveService {

	
private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "leave";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	@Override
	public Map<String, Object> queryLeaveFlowId(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			resultMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_LeaveId", param);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryLeaveType(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String,Object>> leaveTypeMapLst = new ArrayList<Map<String,Object>>();
		
		try {
			leaveTypeMapLst = (List<Map<String, Object>>) this.cpcDao.qryMapListInfos(NAME_SPACE, "qryVacationDayList", param);
			resultMap.put("code", "0");
			
			resultMap.put("data", leaveTypeMapLst);
		} catch (Exception e) {
			resultMap.put("code", "0");
			resultMap.put("msg", "数据库查询异常");
			e.printStackTrace();
		}
		
		return resultMap;
	}

	@SuppressWarnings({ "static-access", "unchecked" })
	public String addLeaveDemandInfo(Map<String, Object> param) {
		try {
			String recordId = this.queryLeaveNewFlowId(param);//获取 流程流转ID
			if (recordId=="0") {
				return recordId;
			}
			
			Map<String, Object> nodeMap = this.queryNextOptId(param);
			param.put("recordId", recordId);
			param.put("optId", nodeMap.get("post_staff_id"));
			param.put("curr_node_id", nodeMap.get("node_id"));
			param.put("curr_node_name", nodeMap.get("node_name"));
			
			param.put("opt_action", 0);
			param.put("opt_action_name", "发起");
			param.put("opt_conclusion", "发起流程");
			param.put("opt_desc", "提交");
			param.put("state", "1");
			//插入请假基本信息
			this.cpcDao.insert(NAME_SPACE, "addLeaveDemandInfo", param);
			
			//插入流转信息
			this.cpcDao.insert(NAME_SPACE, "addLeaveDemandFlowInfo", param);

			
			String fileList = String.valueOf(param.get("fileList"));
			if (!"".equals(fileList)) {
				List toList = this.toList(fileList, Map.class);
				//插入流转信息
				for (int i = 0; i < toList.size(); i++) {
					Map<String, Object> fileMap = (Map<String, Object>) toList.get(i);
					this.cpcDao.insert(NAME_SPACE, "addFileInfo", fileMap);
				}
			}
			
			
			int nextNodeLevel = Integer.parseInt(param.get("nextNodeLevel")+"");
			param.put("nextNodeLevel", nextNodeLevel+1);//当前层级+1
			//更新流程流转信息
			this.updateFlowInfo(param);
			
			//更新我的假期
			this.cpcDao.update(NAME_SPACE, "updMyVacationDay", param);
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return "1";
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	private static List toList(String jsonString, Class cla) {
		JSONArray jsonArray = JSONArray.fromObject(jsonString);
		List lists = new ArrayList(jsonArray.size());
		for (int i = 0; i < jsonArray.size(); i++) {
			JSONObject jsonObject = jsonArray.getJSONObject(i);
			lists.add(JSONObject.toBean(jsonObject, cla));
		}

		return lists;
	}
	
	//更新流程流转信息
	private String updateFlowInfo(Map<String, Object> param) {
		int nextNodeLevel = Integer.parseInt(param.get("nextNodeLevel")+"");
		param.put("nextNodeLevel", nextNodeLevel);//当前层级+1
		Map<String, Object> nodeMap = this.queryNextOptId(param);
		Map<String, Object> paramMap = new HashMap<String, Object>();

		String isSucess = "1";
		
		paramMap.put("nextNodeId", nodeMap.get("node_id"));
		paramMap.put("nextNodeName", nodeMap.get("node_name"));
		paramMap.put("state", nodeMap.get("is_end"));
		paramMap.put("recordId", param.get("recordId"));
		paramMap.put("nextNodeLevel", param.get("nextNodeLevel"));
		
		String postStaffId = String.valueOf(nodeMap.get("post_staff_id"));
		try {
			System.out.println(param.get("opt_action"));
			
			if ("3".equals(param.get("opt_action"))|| nextNodeLevel == 1) {
				Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "qryDemandInfoById", param);

				paramMap.put("nextOptId", demandInfo.get("STAFF_ID"));
				paramMap.put("nextOptName", demandInfo.get("staff_name"));
			}else {
				if (postStaffId.equals("") || postStaffId.equals("null")) {
					Map<String, Object> reqMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qryNextNodeInfoByDept", param);
					paramMap.put("nextOptId", reqMap.get("post_staff_id"));
					paramMap.put("nextOptName", reqMap.get("staff_name"));
				}else {
					paramMap.put("nextOptId", nodeMap.get("post_staff_id"));
					paramMap.put("nextOptName", nodeMap.get("staff_name"));
				}
			}
			
			
			//更新 流程流转信息
			this.cpcDao.update(NAME_SPACE, "updDemandFlowInfo", paramMap);
		} catch (Exception e) {
			isSucess = "0";
			e.printStackTrace();
		}
		return isSucess;
	}
	
	
	
	@Override
	public String addLeaveDemandFlowInfo(Map<String, Object> param) {
		String isTrue = "1";
		 
		try {
			this.cpcDao.insert(NAME_SPACE, "addLeaveDemandFlowInfo", param);
		} catch (Exception e) {
			isTrue = "0";
			e.printStackTrace();
		}
		return isTrue;
	}

	@Override
	public Map<String, Object> saveDamand(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			
			Map<String, Object> flowInfo = this.qryLeaveFlowMap(param);
			
			System.out.println(flowInfo);
			
			
			if ("1".equals(flowInfo.get("code"))) {
				return flowInfo;
			}
			//流程发起，流程层级默认 1
			param.put("nextNodeLevel", 1);
			
			param.put("flow_id", flowInfo.get("flow_id"));
			this.addLeaveDemandInfo(param);

			resultMap.put("code", "0");
			resultMap.put("msg", "保存成功");
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "1");
			resultMap.put("msg", "保存异常");
		}

		return resultMap;
	}

	//获取流程类型信息
	public Map<String, Object> qryLeaveFlowMap(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String,Object>> leaveTypeMapLst = new ArrayList<Map<String,Object>>();
		
		try {
			leaveTypeMapLst = (List<Map<String, Object>>) this.cpcDao.qryMapListInfos(NAME_SPACE, "queryLeavelFlowId", param);
			
			if (leaveTypeMapLst.size() == 1 ) {
				resultMap.put("code", "0");
				resultMap.put("flow_id", leaveTypeMapLst.get(0).get("flow_id"));
			}else {
				resultMap.put("code", "1");
				resultMap.put("msg", "流程数据配置异常，请联系管理员");
			}
			
		} catch (Exception e) {
			resultMap.put("code", "1");
			resultMap.put("msg", "数据库查询异常");
			e.printStackTrace();
		}
		
		return resultMap;
	}
	
	public String queryLeaveNewFlowId(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String recordId ="";
		try {
			resultMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_FlowId", param);
			recordId = String.valueOf(resultMap.get("recordId"));
		} catch (Exception e) {
			e.printStackTrace();
			recordId = "0";
		}
		return recordId;
	}

	
	public Map<String, Object> queryNextOptId(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			//按照岗位查询
			resultMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qryNextNodeInfoByPost", param);
			String postStaffId = String.valueOf(resultMap.get("post_staff_id"));
			
			String deptId = String.valueOf(resultMap.get("dept_id"));
			
			Map<String, Object> repMap =  new HashMap<String, Object>();
			
			if ("101".equals(deptId)) {//查询部门分管领导
				repMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qryNextNodeInfoByDeptManager", param);
				resultMap.put("post_staff_id", repMap.get("post_staff_id"));
				resultMap.put("staff_name", repMap.get("staff_name"));
			}else if(postStaffId.equals("") || postStaffId.equals("null")) {//按照部门查询部门负责人
				repMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qryNextNodeInfoByDept", param);
				resultMap.put("post_staff_id", repMap.get("post_staff_id"));
				resultMap.put("staff_name", repMap.get("staff_name"));
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> querySavelList(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		
		try {
			list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryDemandList", param);
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryDemandListCount", param);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("list", list);
			resultMap.put("sum",  sum);
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
			e.printStackTrace();
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> qryLeaveDemandInfo(Map<String,Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "qryDemandInfoById", param);
			List<Map<String, Object>> flowInfoList = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryFlowInfoList", param);
			List<Map<String, Object>> fileInfoList = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryFileInfo", param);

			resultMap.put("demandInfo", demandInfo);
			resultMap.put("flowInfoList", flowInfoList);
			resultMap.put("fileInfoList", fileInfoList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return resultMap;
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public Map<String, Object> handComment(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> repMap = new HashMap<String, Object>();
		
		try {
			Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "qryDemandInfoById", param);
			if (!param.get("staff_id").equals(demandInfo.get("next_opt_id"))) {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "您非请假单下一步处理人，不能处理！");
				return resultMap;
			}
		} catch (Exception e1) {
			e1.printStackTrace();
		}
		
		String recordId = queryLeaveNewFlowId(param);
		if (recordId == "") {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "流程流转信息新增失败！");
			return resultMap;
		}
		try {
			repMap.put("demandId", param.get("demandId"));
			repMap.put("recordId", recordId);
			this.cpcDao.update(NAME_SPACE, "updDemandInfoById", repMap);

			repMap.put("flow_id", param.get("flowId"));
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryFlowInfoList", param);
			Map<String, Object> recordMap = (Map<String, Object>) list.get(0);
			repMap.put("curr_node_id", recordMap.get("next_node_id"));
			repMap.put("curr_node_name", recordMap.get("next_node_name"));
			repMap.put("staff_id", param.get("staff_id"));//当前操作人
			repMap.put("staffId", param.get("staffId"));//请假发起人
			repMap.put("staff_name", param.get("staff_name"));
			repMap.put("opt_action", param.get("actionType"));
			repMap.put("opt_desc", param.get("handComment"));
			
			if (param.get("actionType").equals("1")) {//通过
				repMap.put("opt_action_name", "通过");
				repMap.put("opt_conclusion", "通过");
				int nextNodeLevel = Integer.parseInt(param.get("currNodeLevel")+"");
				repMap.put("nextNodeLevel", nextNodeLevel+1);//当前层级+1
				
			}else if (param.get("actionType").equals("2")) {//打回上一节点
				int nextNodeLevel = Integer.parseInt(param.get("currNodeLevel")+"");
				repMap.put("opt_action_name", "打回");
				repMap.put("opt_conclusion", "打回上一节点");
				repMap.put("nextNodeLevel", nextNodeLevel-1);//当前层级-1
				
			}else if (param.get("actionType").equals("3")) {//打回发起节点
				repMap.put("opt_action_name", "打回");
				repMap.put("opt_conclusion", "打回发起节点");
				repMap.put("nextNodeLevel", 1);//当前层级=1
			}
			
			String isTrue = this.addLeaveDemandFlowInfo(repMap);
			if (isTrue=="0") {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "流程流转信息新增失败！");
				return resultMap; 
			}
			isTrue = this.updateFlowInfo(repMap);
			if (isTrue=="0") {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "流程流转信息更新失败！");
				return resultMap;
			}
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "流程更新成功！");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "流程更新失败！");
			e.printStackTrace();
		}
		return resultMap;
	}
	

	@Override
	public Map<String, Object> queryListOld(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
		
		try {
			list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryChuliDemandList", param);
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryChuliDemandListCount", param);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("list", list);
			resultMap.put("sum",  sum);
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
			e.printStackTrace();
		}
		
		return resultMap;
	}

	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	public Map<String, Object> cancleDamand(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		Map<String, Object> repMap = new HashMap<String, Object>();
		String recordId = queryLeaveNewFlowId(param);
		
		try {
			Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "qryDemandInfoById", param);
			
			if (param.get("staff_id").equals(demandInfo.get("staff_id"))) {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "您非当前请假单处理人，也非发起人，不能作废工单！");
				return resultMap;
			}			
			
			//使用天数
			String num = String.valueOf(demandInfo.get("holiday_num"));
			String holiday_Type = String.valueOf(demandInfo.get("holiday_Type"));
			repMap.put("holidayType", holiday_Type);
			repMap.put("SUM_NUM", num);
			
			repMap.put("demandId", param.get("demandId"));
			repMap.put("recordId", recordId);
			this.cpcDao.update(NAME_SPACE, "updDemandInfoById", repMap);

			repMap.put("flow_id", param.get("flowId"));
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryFlowInfoList", param);
			Map<String, Object> recordMap = (Map<String, Object>) list.get(0);
			repMap.put("curr_node_id", recordMap.get("next_node_id"));
			repMap.put("curr_node_name", recordMap.get("next_node_name"));
			repMap.put("staff_id", param.get("staff_id"));//当前操作人
			repMap.put("staffId", param.get("staffId"));//请假发起人
			repMap.put("staff_name", param.get("staff_name"));
			repMap.put("opt_action", -1);
			repMap.put("opt_desc", param.get("opt_desc"));
			
			repMap.put("state", "-1");
			
			//更新我的假期
			this.cpcDao.update(NAME_SPACE, "updMyVacationDayReSubmit", param);
			
			//通过
			repMap.put("opt_action_name", "作废");
			repMap.put("opt_conclusion", "作废");
//			param.put("opt_desc", "取消");
			
			this.addLeaveDemandFlowInfo(repMap);
			//更新 流程流转信息
			this.cpcDao.update(NAME_SPACE, "updDemandFlowInfo", repMap);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "流程更新成功！");
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "流程更新失败！");
			e.printStackTrace();
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryDateCount(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();	
		try {
			Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "qryDateCount", param);

			System.out.println( demandInfo.get("day_count"));
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("dateCount", demandInfo.get("day_count"));
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询日期差失败！");
			e.printStackTrace();
		}
		
		return resultMap;
	}
	@Override
	public Map<String, Object> checkHoliyday(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();	

		try {
			List<Map<String, Object>> leaveTypeMapLst = (List<Map<String, Object>>) this.cpcDao.qryMapListInfos(NAME_SPACE, "queryLeavelFlowId", param);
//			Map<String, Object> demandInfo = this.cpcDao.qryMapInfo(NAME_SPACE, "checkHoliyday", param);
			List<Map<String, Object>> holidayMapLst = (List<Map<String, Object>>) this.cpcDao.qryMapListInfos(NAME_SPACE, "checkHoliyday", param);
			
			if (holidayMapLst.size()<1) {
				resultMap.put("count", 0);
				resultMap.put("countMsg", "");
			}else {
				resultMap.put("count", Const.FAIL_SQL);
				
				String msg = "您已经在 ";
				for (int i = 0; i < holidayMapLst.size(); i++) {
					Map<String, Object> holidayMap = holidayMapLst.get(i);
					msg += holidayMap.get("begin_time");
					msg += " 至 ";
					msg += holidayMap.get("end_time")+"  ";
					
				}
				msg += holidayMapLst.size()+"个时间段内已经请过假了，不能重复请假！";
				resultMap.put("countMsg", msg);
			}
			
			if (leaveTypeMapLst.size()>1) {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "查询到多条流程信息，请联系管理员！");
			}else if (leaveTypeMapLst.size()==0) {
				resultMap.put("code", Const.FAIL_SQL);
				resultMap.put("msg", "未查询到流程信息，请联系管理员！");
			}else{
				Map<String, Object> reqMap = leaveTypeMapLst.get(0);
				resultMap.put("isLoft", reqMap.get("is_loft"));
				resultMap.put("code", Const.SUCCESS);
			}
		
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "数据库查询异常，请联系管理员！");
		}

		return resultMap;
	}
	
	

}
