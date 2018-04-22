package com.tydic.sale.service.crm.service.impl;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.UseAuthService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;

public class UseAuthServiceImpl implements UseAuthService {
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "useAuth";
	
	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	@Override
	public Map<String, Object> queryFun(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		try {
			List<Map<String,Object>> roleLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryRole", param);
			List<Object> roleIdLst = new ArrayList<Object>();
			
			if(roleLst != null &&roleLst.size() >0){
				for(Map<String,Object> relMap : roleLst ){
					Map<String,Object> temp = new HashMap<String,Object>();
					temp.put("roleId", relMap.get("role_id"));
					roleIdLst.add(temp);
				}
			}
			Map<String,Object> reqMap = new HashMap<String, Object>();
			reqMap.put("qryColSet", roleIdLst);
			List<Map<String,Object>> funLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"queryFun", reqMap);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("funLst", funLst);
			resultMap.put("roleLst", roleLst);
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询功能数据失败", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryUserRolePoolInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		try {
			List<Map<String,Object>> roleLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryRole", param);
			List<Object> roleIdLst = new ArrayList<Object>();
			
			if(roleLst != null &&roleLst.size() >0){
				for(Map<String,Object> relMap : roleLst ){
					Map<String,Object> temp = new HashMap<String,Object>();
					temp.put("roleId", relMap.get("role_id"));
					roleIdLst.add(temp);
				}
			}
			if(roleIdLst.size() == 0){
				resultMap.put("code", "1");
				resultMap.put("msg", "无角色数据");
				resultMap.put("funLst", "");
				resultMap.put("poolLst", "");
				resultMap.put("roleLst", roleLst);
				return resultMap;
			}
			//查询主页信息
			List<Map<String,Object>> homePageLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryHomePageInfo", param);
			
			String regionCode=String.valueOf(param.get("regionCode"));
			//西安市的需要根据部门id查询接单池
			String orgId="";
			if(!Tools.isNull(regionCode)&&!"888".equals(regionCode)){
				List<Map> preList=(List<Map>)param.get("qryUserColSet");
				for(Map map:preList){
					if("ORG".equals(map.get("relType"))){
						orgId=String.valueOf(map.get("relValue"));
					}
				}
			}
			//查询角色单池
			Map<String,Object> reqMap = new HashMap<String, Object>();
			reqMap.put("orgId",orgId);
			reqMap.put("qryColSet", roleIdLst);
			List<Map<String,Object>> poolLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"queryPoolByRole", reqMap);
			
			//查询角色功能
			reqMap = new HashMap<String, Object>();
			reqMap.put("qryColSet", roleIdLst);
			List<Map<String,Object>> funLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"queryFun", reqMap);
			
			
			//查询角色菜单
			reqMap = new HashMap<String, Object>();
			reqMap.put("qryColSet", roleIdLst);
			List<Map<String,Object>> menuLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"queryMenu", reqMap);
			
			//查询角色下属的员工数据
			reqMap = new HashMap<String, Object>();
			reqMap.put("qryUserColSet", roleIdLst);
			List<Map<String, Object>> dataLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"queryRoleData", reqMap);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("funLst", funLst);
			resultMap.put("poolLst", poolLst);
			resultMap.put("roleLst", roleLst);
			resultMap.put("menuLst", menuLst);
			resultMap.put("dataLst", dataLst);
			resultMap.put("homePageLst", homePageLst);
			
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询角色单池数据失败", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryStaffByData(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		List<Object> staffLst = new ArrayList<Object>();//员工集合
		try {
		//查询配置的角色
		Map<String,Object> reqMap = new HashMap<String, Object>();
		reqMap.put("data_id", param.get("data_id"));
		reqMap.put("o_type", "ORG");
		List<Map<String,Object>> dataRoolLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"query_data_role", reqMap);
			if(!Tools.isNull(dataRoolLst) && dataRoolLst.size()>0){
				String orgLst = "";
				for(Map map : dataRoolLst){
					orgLst += String.valueOf(map.get("value_id"))+",";
				}
				if(!Tools.isNull(orgLst)){
					orgLst = orgLst.substring(0,orgLst.length()-1);
				}
				
				reqMap = new HashMap<String, Object>();
				reqMap.put("orgLst", orgLst);
				List<Map<String, Object>> staffMapLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "query_orgId_staff", reqMap);
				if(!Tools.isNull(staffMapLst) && staffMapLst.size() >0){
					for(Map map :staffMapLst){
						staffLst.add(map.get("STAFF_ID"));
					}
				}
				
			}
				
				//直接查询员工的配置
				reqMap.put("data_id", param.get("data_id"));
				reqMap.put("o_type", "STAFF");
				List<Map<String,Object>> dataStaffLst = this.cpcDao.qryMapListInfos(NAME_SPACE,"query_data_role", reqMap);
				
				
				if(!Tools.isNull(staffLst) && staffLst.size() > 0){
					if(!Tools.isNull(dataStaffLst) && dataStaffLst.size()>0){
						for(Map map : dataStaffLst){
							String staffId = String.valueOf(map.get("value_id"));
							if(!staffLst.contains(staffId)){
								staffLst.add(staffId);
							}
						}
					}
				}else{
					if(!Tools.isNull(dataStaffLst) && dataStaffLst.size()>0){
						for(Map map : dataStaffLst){
							staffLst.add(String.valueOf(map.get("value_id")));
						}
					}
				}
				
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("staffLst", staffLst);
		} catch (Exception e) {
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "查询失败"+e.getMessage());
			log.error("查询数据配置角色异常",e);
			e.printStackTrace();
		}
		return resultMap;
	}


	
}
