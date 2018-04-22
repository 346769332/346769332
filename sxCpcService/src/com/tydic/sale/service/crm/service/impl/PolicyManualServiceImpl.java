package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.po.PolicyManualInfoBean;
import com.tydic.sale.service.crm.service.PolicyManualService;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;

public class PolicyManualServiceImpl implements PolicyManualService{
	private Logger log = Logger.getLogger(this.getClass());

	private CpcDao cpcDao ;

	private static final String NAME_SPACE = "policyManual";
	private static final String latn_id="888";
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	private SMSService getSmsService(){
		WebApplicationContext	springContext = ContextLoader.getCurrentWebApplicationContext();
		return (SMSService) springContext.getBean("sMSService");
	}
	
	@Override
	public Map<String, Object> searchPolicyManualTypeList( Map<String, Object> param) {
		
		param.put("latn_id", latn_id);
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualTypeListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}else{
				
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
//				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "searchPolicyManualTypeListSum", param);
				param.put("page_num",  (pagenum-1) * pagesize );
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualTypeListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
//				resultMap.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取政策手册类型数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> searchPolicyManualTypeDetailList( Map<String, Object> param) {
		
		param.put("latn_id", latn_id);
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualTypeDetailListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}else{
				
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
//				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "searchPolicyManualTypeDetailListSum", param);
				param.put("page_num",  (pagenum-1) * pagesize );
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualTypeDetailListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
//				resultMap.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取政策手册类型详细数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryPolicyManualList(Map<String, Object> param) {
		
		param.put("latn_id", latn_id);
		
		Map<String,Object> resultMap = new HashMap<String, Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List<PolicyManualInfoBean>  list = this.cpcDao.queryPolicyManualInfoList(NAME_SPACE, "queryPolicyManualListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}else{
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
				param.put("limit", "limit");
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryPolicyManualListSum", param);
				param.put("page_num",  (pagenum-1) * pagesize );
				//当前页内容
				List<PolicyManualInfoBean> list = this.cpcDao.queryPolicyManualInfoList(NAME_SPACE, "queryPolicyManualListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
			}
	 
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询功能数据失败", e);
		}
		return resultMap;
	}
	
	@Override
	public Map<String, Object> searchPolicyManualInfoList( Map<String, Object> param) {

		param.put("latn_id", latn_id);
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualInfoListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}else{
				
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
//				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "searchPolicyManualInfoListSum", param);
				param.put("page_num",  (pagenum-1) * pagesize );
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "searchPolicyManualInfoListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
//				resultMap.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取政策手册数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> insertPolicyManual(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		String PMId = null ;
		try {
			param.put("seq_name", "seq_policy_manual_id");
			PMId =  (String)this.cpcDao.qryObject(NAME_SPACE, "selectNextVal", param);
			param.put("PMId", PMId);
			
			this.cpcDao.insert(NAME_SPACE, "savePM", param);
			Object attrSet= param.get("AttrSet");
			if(null!=attrSet){
				List list = (List) param.get("AttrSet");
				if(list != null && list.size()>0) {
					//插入属性
					this.cpcDao.insert(NAME_SPACE, "savePMAtrr", param);
				}
			}
			Object releaseSet= param.get("releaseSet");
			if(null!=releaseSet){
				List list = (List) param.get("releaseSet");
				if(list != null && list.size()>0) {
					this.cpcDao.insert(NAME_SPACE, "saveReleaseArea", param);
				}
			}
			
			//发短信
			if("O".equals(param.get("state"))){
				String theme=String.valueOf(param.get("theme"));
				String type=String.valueOf(param.get("busiTypeName"));
				List<Map<String,Object>> messageList=this.getMessagePeopleList(param,"SAVE",type,theme);
				getSmsService().sedMessage("", "POLICYMANUAL-SAVE", messageList, "新增政策手册");
			}
			
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("PMId", PMId);
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("新增政策手册数据异常！", e);
		}
		return resultMap ;
	}

	@Override
	public Map<String, Object> deletePolicyManualList(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "deletePolicyManualListPage", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("删除政策异常", e);
		}
		return result;
	}
	
	@Override
	public Map<String, Object> updatePolicyManual(Map<String, Object> param) {

		Map<String,Object> resultMap = new HashMap<String,Object>();
 		try {
			 
			this.cpcDao.update(NAME_SPACE, "updatePM", param);
			
			//删除之前属性
			this.cpcDao.delete(NAME_SPACE, "deletePMAtrr", param);
			Object attrSet= param.get("AttrSet");
			if(null!=attrSet){
				List list = (List) param.get("AttrSet");
				if(list != null && list.size()>0) {
					//插入属性
					this.cpcDao.insert(NAME_SPACE, "savePMAtrr", param);
				}
			}
			
			this.cpcDao.delete(NAME_SPACE, "deleteReleaseArea", param);
			Object releaseSet= param.get("releaseSet");
			if(null!=attrSet){
				List list = (List) param.get("releaseSet");
				if(list != null && list.size()>0) {
					this.cpcDao.insert(NAME_SPACE, "saveReleaseArea", param);
				}
			}
			
			
			//发短信
			if("O".equals(param.get("state"))){
				String theme=String.valueOf(param.get("theme"));
				String type=String.valueOf(param.get("busiTypeName"));
				List<Map<String,Object>> messageList=this.getMessagePeopleList(param,"SAVE",type,theme);
				getSmsService().sedMessage("", "POLICYMANUAL-SAVE", messageList, "修改政策手册");
			}
			resultMap.put("code", Const.SUCCESS);
 			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("新增政策手册数据异常！", e);
		}
		return resultMap ;
	
	}
	
	@Override
	public Map<String,Object> updatePolicyManualInfoState(Map<String, Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
 		try {
 			this.cpcDao.update(NAME_SPACE, "updatePMState", param);
 			if("O".equals(param.get("state"))){
				String theme=String.valueOf(param.get("theme"));
				String type=String.valueOf(param.get("busiTypeName"));
				List<Map<String,Object>> messageList=this.getMessagePeopleList(param,"SAVE",type,theme);
				getSmsService().sedMessage("", "POLICYMANUAL-SAVE", messageList, "提交政策手册");
			}
			resultMap.put("code", Const.SUCCESS);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("提交政策手册政策修改状态异常！", e);
		}
		return resultMap ; 
	}

	@Override
	public Map<String, Object> releasePolicyManualList(Map<String, Object> param) {
		
		param.put("latn_id", latn_id);
		
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "releasePolicyManualListPage", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("发布政策异常", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> queryAreaData(Map<String, Object> param) {
		
		param.put("latn_id", latn_id);
		
		Map result = new HashMap();
		List allAreaList = new ArrayList(); 
		List useAreaList = new ArrayList();
		try {
			allAreaList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllAreaData", param);
			useAreaList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryUseAreaList", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("allAreaList", allAreaList);
			result.put("useAreaList", useAreaList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询区域数据", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> approvalPolicyManualList(
			Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List list = (List) param.get("AttrSet");
			if(list != null && list.size()>0) {
				//插入属性
				this.cpcDao.insert(NAME_SPACE, "savePMAtrr", param);
			}
			String smsModelId="";
			String spState =  (String) param.get("spState");
			if("通过".equals(spState)){
				smsModelId="POLICYMANUAL-APPROVE-GO";
				this.cpcDao.update(NAME_SPACE, "approvalPolicyManualListPage", param);
			}else if("不通过".equals(spState)){
				smsModelId="POLICYMANUAL-APPROVE-NOT";
				this.cpcDao.update(NAME_SPACE, "approvalNotPolicyManualListPage", param);
			}
			
			//发短信
			List<Map<String,Object>> messageList=this.getMessagePeopleList(param,"APPROVE","","");
			getSmsService().sedMessage("", smsModelId, messageList, "审批政策手册");
			
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("发布政策异常", e);
		}
		return result;
	}
	
	private List<Map<String,Object>> getMessagePeopleList(Map<String,Object> param,String optType,String busiType,String busiTheme){
		
		param.put("latn_id", latn_id);
		
		List<Map<String,Object>> approveList=new ArrayList<Map<String,Object>>();
			try {
				if("APPROVE".equals(optType)){
					approveList = this.cpcDao.qryMapListInfos(NAME_SPACE, "getPolicyManualPeople", param);
				}else if("SAVE".equals(optType)){
					approveList = this.cpcDao.qryMapListInfos(NAME_SPACE, "getApprovePeopleList", param);
				}
				if(approveList.size()>0){
					for (Map<String, Object> map : approveList) {
						map.put("staffName", map.get("staff_name"));
						map.put("loginCode", map.get("login_code"));
						map.put("mobTel", map.get("mob_tel"));
						if(!Tools.isNull(map.get("busiTheme"))){
							map.put("busiTheme", map.get("busiTheme"));
						}else{
							map.put("busiTheme", busiTheme);
						}
						if(!Tools.isNull(map.get("busiType"))){
							map.put("busiType", map.get("busiType"));
						}else{
							map.put("busiType", busiType);
						}
					}
				}
	 		} catch (Exception e) {
				e.printStackTrace();
				log.error("查询政策手册短信发送人数据", e);
			}
		 return approveList;
	}
}
