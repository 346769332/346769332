package com.tydic.sale.service.crm.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.json.JSONArray;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.EvalMonService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;

public class EvalMonServiceImpl implements EvalMonService{
	
	private static final String SUCCESS = "0";
	
	private static final String FAIL = "-1";

	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "evalMonth";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	

	@Override
	public Map<String, Object> searchUserInfo(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			Map<String,Object> userInfo=cpcDao.qryMapInfo(NAME_SPACE, "select_user_info", param);
			if(Tools.isNull(userInfo)){
				resultMap.put("code", FAIL);
				resultMap.put("msg", "此综支中心本月已被评价过！");
			}else{
			   resultMap.put("userInfo", userInfo);
			   resultMap.put("code", SUCCESS);
			   resultMap.put("msg","成功");
			}
		} catch (Exception e) {
			log.error("查询用户信息", e);
			resultMap.put("code", FAIL);
			resultMap.put("msg", "查询异常");
		}
		
		return resultMap;
	}

	@Override
	public Map<String, Object> saveEvalMonZZ(Map<String, Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		Map<String,Object> evalMap=new HashMap<String,Object>();
        try {
			cpcDao.insert(NAME_SPACE, "save_evalMonZZ", paramMap);
			evalMap.put("staff_id", paramMap.get("staff_id"));
			evalMap.put("eval_type", 3);//综支中心的评价
			evalMap.put("eval_integ", 10);
			cpcDao.insert(NAME_SPACE, "save_eval_integer", evalMap);
			resultMap.put("code", SUCCESS);
			resultMap.put("msg","完成评价，并获得10分积分");
		} catch (Exception e) {
			log.error("保存月度综合评价综支中心",e);
			resultMap.put("msg", "保存数据失败");
			resultMap.put("code", FAIL);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> searchDeptInfo(Map<String,Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		
        try {
			List<Map<String,Object>> deptInfo=cpcDao.qryMapListInfos(NAME_SPACE, "select_dept_info", paramMap);
			if(Tools.isNull(deptInfo)){
				resultMap.put("msg", "本月专业部门已被评价过！");
				resultMap.put("code", FAIL);
			}else{
				resultMap.put("deptInfo", deptInfo);
				resultMap.put("code", SUCCESS);
				resultMap.put("msg","查询成功");
			}
			
		} catch (Exception e) {
			log.error("查询月度综合评价专业部门",e);
			resultMap.put("msg", "查询数据失败");
			resultMap.put("code", FAIL);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> saveEvalDept(Map<String, Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
        List<Map<String,Object>> evalDeptSetLst=(List<Map<String,Object>>)paramMap.get("evalSet");
        String staff_id=String.valueOf(evalDeptSetLst.get(0).get("staff_id"));
        String notEvalDept=String.valueOf(paramMap.get("notSubSize"));
        String dept_type=String.valueOf(paramMap.get("dept_type"));
        Map<String,Object> evalMap=new HashMap<String,Object>();
        int score=0;
        String eval_type="";
        try {
			cpcDao.batchInsert(NAME_SPACE, "save_eval_dept", evalDeptSetLst);
			resultMap.put("msg","保存成功");
			resultMap.put("code", SUCCESS);
			if(notEvalDept.equals("0")){
				evalMap.put("staff_id", staff_id);
				/*if("1".equals(dept_type)){
					score=30;
					eval_type="5";//分公司专业部门的评价
				}else*//* if("2".equals(dept_type)){
					score=10;
					eval_type="4";//区公司专业部门及直属单位的评价
				}*/
				evalMap.put("eval_type", eval_type);
				evalMap.put("eval_integ", score);
				cpcDao.insert(NAME_SPACE, "save_eval_integer", evalMap);
				resultMap.put("msg", "所有部门已评价完，恭喜您可以获得"+score+"分积分！");
			}
		} catch(Exception e){
			log.error("保存月度综合评价专业部门",e);
			resultMap.put("msg", "保存数据失败");
			resultMap.put("code", FAIL);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> searchScoreInfo(Map<String, Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			Map<String,Object> scoreInfo=cpcDao.qryMapInfo(NAME_SPACE, "select_score_info", paramMap);
			resultMap.put("scoreInfo", scoreInfo);
			resultMap.put("code", SUCCESS);
			resultMap.put("msg", "查询积分信息成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", FAIL);
			resultMap.put("msg", "网络异常，查询积分信息失败");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> searchDate() {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		Map<String,Object> paramMap=new HashMap<String,Object>();
		try {
			Map<String,Object> scoreInfo=cpcDao.qryMapInfo(NAME_SPACE, "search_date", paramMap);
			resultMap.put("scoreInfo", scoreInfo);
			resultMap.put("code", SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", FAIL);
			resultMap.put("msg", "网络异常，查询积分信息失败");
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> searchDeptmentInfo(Map<String,Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
        try {
        	List<Map<String,Object>> deptInfo=cpcDao.qryMapListInfos(NAME_SPACE, "select_deptment_info", paramMap);
        	resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("deptInfo", deptInfo);
		} catch (Exception e) {
			e.printStackTrace();
			log.error("查询月度综合评价部门",e);
			resultMap.put("msg", "查询部门信息失败");
			resultMap.put("code", FAIL);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> searchIndexInfo(Map<String,Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
        try {
        	List<Map<String,Object>> indexInfo=cpcDao.qryMapListInfos(NAME_SPACE, "select_index_info", paramMap);
			resultMap.put("indexInfo", indexInfo);
			resultMap.put("code", SUCCESS);
			resultMap.put("msg","查询成功");
		} catch (Exception e) {
	 		e.printStackTrace();
			log.error("查询月度综合评价部门",e);
			resultMap.put("msg", "查询数据失败");
			resultMap.put("code", FAIL);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> updateAssessInfo(Map<String, Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		try {
			String [] indexIds = ((String)paramMap.get("index_ids")).split(",");
			String [] pgValues = ((String)paramMap.get("pg_values")).split(",");
			Map<String,Object> condMap = new HashMap<String, Object>();
			condMap.putAll(paramMap);
			for (int i = 0; i < indexIds.length; i++) {
				condMap.put("index_id", indexIds[i]);
				condMap.put("pg_value", pgValues[i]);
				cpcDao.update(NAME_SPACE, "updateAssessInfo", condMap);
			}
			resultMap.put("code", "0");
			resultMap.put("msg", "评价成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("修改异常", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryDeptAndStaffInfo(Map<String, Object> paramMap) {
		Map<String,Object> resultMap=new HashMap<String,Object>();
		if("qryDeptOrStaffInfo".equals(paramMap.get("hanleType"))){ //查询
			try {
	        	List<Map<String,Object>> deptInfo=cpcDao.qryMapListInfos(NAME_SPACE, "qry_relation_info", paramMap);
	        	resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "查询成功");
				resultMap.put("deptInfo", deptInfo);
			} catch (Exception e) {
				e.printStackTrace();
				log.error("查询信息失败！",e);
				resultMap.put("msg", "查询部门及领导信息失败");
				resultMap.put("code", FAIL);
			}
		}else if("insertScoreInfo".equals(paramMap.get("hanleType"))){ //评价打分
			try {
				String fileList = String.valueOf(paramMap.get("arrayFileInfo"));
				String promoters_id = String.valueOf(paramMap.get("promoters_id"));
				if("".equals(fileList) || fileList!="" || fileList!=null){
					JSONArray fileJson = new JSONArray(fileList);
					Map<String, Object> fileMap = new HashMap<String, Object>();
					for (int i = 0; i < fileJson.length(); i++) {
						fileMap.put("flag", fileJson.getJSONObject(i).get("flag"));
						fileMap.put("opt_id", fileJson.getJSONObject(i).get("optId"));
						fileMap.put("pro_role_type", fileJson.getJSONObject(i).get("proRoleType"));
						fileMap.put("score", fileJson.getJSONObject(i).get("score"));
						fileMap.put("promoters_id", promoters_id);
						cpcDao.insert(NAME_SPACE, "save_score_info", fileMap);
					}
				}
				cpcDao.update(NAME_SPACE, "updScoreRelationInfo", paramMap);
				resultMap.put("code", "0");
				resultMap.put("msg", "打分成功");
	 		} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("code", "-1");
				resultMap.put("msg", "系统异常"+e.getMessage());
				log.error("打分异常", e);
			}
		}else if("checkEval".equals(paramMap.get("hanleType"))){
			try {
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "check_isEval", paramMap);
	        	resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "校验成功");
				resultMap.put("data", sum);
			} catch (Exception e) {
				e.printStackTrace();
				resultMap.put("msg", "校验失败");
				resultMap.put("code", FAIL);
			}
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryDemandShortType(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		try {
			List<Map<String,Object>>  typeList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_demand_short_type", param);
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
			resultMap.put("list", typeList);
		} catch (Exception e) {
			log.error("查询bbs评论类型失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询bbs评论类型失败，网络异常或条件错误！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> addBBsCommentInfo(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		try {
			
			this.cpcDao.insert(NAME_SPACE, "save_bbs_comment", param);
			resultMap.put("code", "0");
			resultMap.put("msg", "提交成功");
		} catch (Exception e) {
			log.error("提交bbs评论失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "提交bbs评论失败，网络异常或条件错误！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryCommentList(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		List<Map<String,Object>> commentList=new ArrayList<Map<String,Object>>();
		int pagenum=0;
		int pagesize=0;
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
			//查询总行数
			String sum=(String)this.cpcDao.qryObject(NAME_SPACE, "qry_comment_list_sum", param);
			 param.put("page_num",  (pagenum-1) * pagesize );
			List<Map<String,Object>> comList=  this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_comment_list", param);
			if(!Tools.isNull(comList)){
				for(Map map : comList){
					String comId=String.valueOf(map.get("comment_id"));
					if(!Tools.isNull(comId)){
						Map<String, Object> parMap=new HashMap<String, Object>();
						parMap.put("comment_id", comId);
						String evalSum=(String)this.cpcDao.qryObject(NAME_SPACE, "qry_eval_comment_sum", parMap);
						map.put("evalSum", evalSum);
						commentList.add(map);
					}
					
				}
				
			}
			resultMap.put("data", commentList);
			resultMap.put("totalSize",  sum);
			resultMap.put("code", "0");
			resultMap.put("msg", "查询成功！");
		} catch (Exception e) {
			log.error("查询失败", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询失败！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryCommentInfoList(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		try {
			//查询跟帖列表
			List<Map<String,Object>> evalList=  this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_eval_comment_list", param);
			//评论详情
			Map<String,Object> commentInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "qry_comment_info", param);
			resultMap.put("list", evalList);
			resultMap.put("commentInfo", commentInfo);
			resultMap.put("code", "0");
			resultMap.put("msg", "查询成功！");
		} catch (Exception e) {
			log.error("查询失败", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "查询失败！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> saveEvalComment(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		try {
			
			this.cpcDao.insert(NAME_SPACE, "save_bbs_eval_comment", param);
			resultMap.put("code", "0");
			resultMap.put("msg", "提交成功");
		} catch (Exception e) {
			log.error("提交bbs评论失败，网络异常或条件错误", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "提交bbs评论失败，网络异常或条件错误！");
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryReverseEvalInfo(Map<String, Object> param) {
		Map<String,Object> resultMap=new HashMap<String, Object>();
		try {
			String msg="";
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Calendar cal=Calendar.getInstance();
			cal.setTime(new Date());
			cal.set(Calendar.DAY_OF_MONTH, 1);
			Date date=cal.getTime();
			String firstDay=sdf.format(date);//本月的第一天
			String handleType=String.valueOf(param.get("handleType"));
			if("qryHomePageInfo".equals(handleType)){//查询首页信息
				List<Map<String,Object>> dayList=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_config_day", param);
				resultMap.put("dayList", dayList);
				//不满意的评价列表
				Map<String,Object> reqMap=new HashMap<String, Object>();
				reqMap.put("eval_type", "dept");
				reqMap.put("eval_value", "D");
				reqMap.put("firstDay", firstDay);
				reqMap.put("opt_id", param.get("opt_id"));
				List<Map<String, Object>> noSatisfy=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_reverse_dept_manager", reqMap);
				//支撑部门评价满意的列表
				reqMap=new HashMap<String, Object>();
				reqMap.put("eval_type", "dept");
				reqMap.put("eval_value", "A");
				reqMap.put("firstDay", firstDay);
				reqMap.put("opt_id", param.get("opt_id"));
				List<Map<String, Object>> satisfy=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_reverse_dept_manager", reqMap);
				resultMap.put("noSatisfy", noSatisfy);
				resultMap.put("satisfy", satisfy);
				//领导班子的评价列表
				reqMap=new HashMap<String, Object>();
				reqMap.put("eval_type", "manager");
				reqMap.put("firstDay", firstDay);
				reqMap.put("opt_id", param.get("opt_id"));
				List<Map<String, Object>> evalManager=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_reverse_dept_manager", reqMap);
				resultMap.put("evalManager", evalManager);
				msg="查询列表成功！";
			}else if("qryEvalDept".equals(handleType)){//查询要评价的支撑部门列表
				List<Map<String, Object>> deptList=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_reverse_eval_dept", param);
				resultMap.put("deptList", deptList);
				//不满意的评价列表
				Map<String,Object> reqMap=new HashMap<String, Object>();
				reqMap.put("eval_type", "dept");
				reqMap.put("eval_value", "D");
				reqMap.put("firstDay", firstDay);
				reqMap.put("opt_id", param.get("opt_id"));
				List<Map<String, Object>> noSatisfy=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_reverse_dept_manager", reqMap);
				resultMap.put("noSatisfy", noSatisfy);
				msg="查询列表成功！";
			}else if("submitEvalReverse".equals(handleType)){//提交评价结果
				List<Map<String,Object>> evalList=(List<Map<String,Object>>)param.get("evalList");
				this.cpcDao.batchInsert(NAME_SPACE, "insert_reverse_eval", evalList);
				msg="评价成功！";
			}else if("qryEvalManager".equals(handleType)){//查询评价的领导列表
				List<Map<String, Object>> managerList=new ArrayList<Map<String,Object>>();
				//查询登录者的信息
				//Map<String,Object> staffInfo=this.cpcDao.qryMapInfo(NAME_SPACE, "select_eval_manager_info", param);
				managerList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_manager_list", param);
				resultMap.put("managerList", managerList);
			}else if("qryUrgeOrg".equals(handleType)){//查询小ceo可以激励的部门
				List<Map<String, Object>> orgList=this.cpcDao.qryMapListInfos(NAME_SPACE, "qry_reverse_reward_dept", param);
				/*if(!Tools.isNull(orgList)){
					for(Map orgMap : orgList){
						String orgId=String.valueOf(orgMap.get("org_id"));
						Map<String, Object> reqMap=new HashMap<String, Object>();
						reqMap.put("latn_id", param.get("latn_id"));
						reqMap.put("department_id", orgId);
						List<Map<String, Object>> staffList=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_eval_manager_info", reqMap);
						orgMap.put("staffList", staffList);
					}
				}*/
				resultMap.put("orgList", orgList);
				//查询此小ceo本月的红包信息
				Map<String, Object> parMap=new HashMap<String, Object>();
				parMap.put("staff_id", param.get("staff_id"));
				parMap.put("latn_id", param.get("latn_id"));
				parMap.put("firstDay", firstDay);
				Map<String, Object> moneyMap=this.cpcDao.qryMapInfo(NAME_SPACE, "select_urge_money_info", parMap);
				int moneyNum=0;
				if(!Tools.isNull(moneyMap)){
					moneyNum=(Integer)moneyMap.get("money_num");
				}
				//查询小CEO已发的红包信息
				String send_sum=(String)this.cpcDao.qryObject(NAME_SPACE, "select_send_money_sum", parMap);
				resultMap.put("send_sum", send_sum);
				resultMap.put("month_num", moneyNum);
				msg="查询列表成功！";
			}else if("sendUrgeMoney".equals(handleType)){//发送红包
				Map<String,Object> reqMap=new HashMap<String, Object>();
				reqMap.put("urge_id", param.get("urge_id"));
				reqMap.put("urge_name", param.get("urge_name"));
				reqMap.put("money_num", param.get("money_num"));
				reqMap.put("urge_desc", param.get("urge_desc"));
				reqMap.put("urge_dept_id", param.get("urge_dept_id"));
				reqMap.put("urge_dept_name", param.get("urge_dept_name"));
				reqMap.put("send_id", param.get("send_id"));
				reqMap.put("send_name", param.get("send_name"));
				reqMap.put("latn_id", param.get("latn_id"));
				this.cpcDao.insert(NAME_SPACE, "save_urge_money_record", reqMap);
				//查询小CEO所属的划小单元名称
				reqMap=new HashMap<String, Object>();
				reqMap.put("staff_id", param.get("send_id"));
				Map<String, Object> ceoInfo= this.cpcDao.qryMapInfo(NAME_SPACE, "select_eval_manager_info", reqMap);
				if(!Tools.isNull(ceoInfo)){
					resultMap.put("unitName", ceoInfo.get("dept_name"));
				}
				msg="红包发放成功！";
			}else if("qryOrgRelStaffList".equals(handleType)){//查询部门下对应的员工
				List<Map<String, Object>> staffList=this.cpcDao.qryMapListInfos(NAME_SPACE, "select_eval_manager_info", param);
				resultMap.put("staffList", staffList);
				msg="查询成功！";
			}
			resultMap.put("code", "0");
			resultMap.put("msg", msg);
		} catch (Exception e) {
			log.error("操作失败！", e);
			resultMap.put("code", "-1");
			resultMap.put("msg", "操作失败！");
		}
		return resultMap;
	}
	
}
