package com.tydic.sale.service.crm.service.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.SysManageService;
import com.tydic.sale.service.util.Const;

public class SysManageServiceImpl implements SysManageService {
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "sysManage";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	
	@Override
	public Map<String,Object> qryMaxStaffId(Map<String,Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			String maxStaffId = (String) this.cpcDao.qryObject(NAME_SPACE, "qryMaxStaffId", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("maxStaffId", maxStaffId);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取staffId数据异常！", e);
		}
		return resultMap;
	}
	
	@Override
	public Map<String,Object> addStaffInfo(Map<String,Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "addStaffInfo", param);
			this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("新增工号信息异常！", e);
		}
		return resultMap;
	}
	@Override
	public Map<String,Object> checkLoginCode(Map<String,Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			String count = (String) this.cpcDao.qryObject(NAME_SPACE, "checkLoginCode", param);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("count", count);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("校验loginCode异常！", e);
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> updateStaffState(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateStaffState", param);
			this.addLoggerInfo(param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("修改工号状态", e);
		}
		return result;
	}
	
	@Override
	public Map<String,Object> queryOrganisationList(Map<String,Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if (null != param.get("pagenum") && !"".equals(param.get("pagenum"))
					&& null != param.get("pagesize")
					&& !"".equals(param.get("pagesize"))) {
	
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryOrganisationListSum", param);
				param.put("limit",  (pagenum-1) * pagesize );
				
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryOrganisationListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryOrganisationListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}
			 
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取组织机构数据异常！", e);
		}
		return resultMap;
		
	}
	
	@Override
	public Map<String, Object> queryRoleList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryRoleListPage", param);
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
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryRoleListSum", param);
				param.put("page_num",  (pagenum-1) * pagesize );
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryRoleListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取角色数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> addRoleInfo(Map<String, Object> param) {
		Map result = new HashMap();
		String call_id = null ;
		try {
			call_id = (String) cpcDao.qryObject("flow", "qry_demandId", null);
			param.put("call_id", call_id);
			this.cpcDao.insert(NAME_SPACE, "addRoleInfo", param);
			result.put("code",Const.SUCCESS);
			result.put("msg", "成功");
			result.put("call_id", call_id);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("添加角色", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> updateRoleInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateRoleInfo", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("修改角色", e);
		}
		return result;
	}
	@Override
	public Map<String,Object> queryRoleUseCount(Map<String,Object> param){
		Map result = new HashMap();
		try {
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryRoleUseCount", param);
			result.put("sum",  sum);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("判断角色是否使用", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> deleteRoleInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "deleteRoleInfo", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("删除角色", e);
		}
		return result;
	}
	
	/*------20150424权限集合begin--------*/
	@Override
	public Map<String, Object> addAuthInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			this.cpcDao.insert(NAME_SPACE, "addAuthInfo", param);
			result.put("code",Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("添加权限", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> deleteAuthInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "deleteAuthInfo", param);
			result.put("code", "0");
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("删除权限", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> queryAuthList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if("queryAll".equals(param.get("queryType"))){
				 List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAuthListPage", param);
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
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryAuthListSum", param);
	  	        param.put("page_num",  (pagenum-1) * pagesize );
	  	        //当前页内容
	  	        List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAuthListPage", param);
	  	        resultMap.put("code", Const.SUCCESS);
	  	        resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取权限数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> queryAuthUseCount(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryAuthUseCount", param);
			result.put("sum",  sum);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("判断权限是否使用", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> updateAuthInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateAuthInfo", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("修改权限", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> queryAssignAuthInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		Map result = new HashMap();
		try {
			List useAssignAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryUseAssignAuthList", param);
			List allAssignAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllAssignAuthList", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("allAssignAuthList", allAssignAuthList);
			result.put("useAssignAuthList", useAssignAuthList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询权限数据", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> saveAssignAuthInfo(Map<String, Object> param) {
		
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "saveAssignAuthInfo_delete", param);
			String size=String.valueOf(param.get("assignAuthInfoSetSize"));
			if(Integer.parseInt(size)>0){
				this.cpcDao.insert(NAME_SPACE, "saveAssignAuthInfo_insert", param);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存权限", e);
		}
		return result;
	}

	/*------20150424权限集合end--------*/

	@Override
	public Map<String, Object> queryRoleAuthInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			List useRoleAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryUseRoleAuthList", param);
			List allRoleAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllRoleAuthList", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("allRoleAuthList", allRoleAuthList);
			result.put("useRoleAuthList", useRoleAuthList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询角色权限数据", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> saveRoleAuthInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "saveRoleAuthInfo_delete", param);
			String size=String.valueOf(param.get("roleAuthInfoSetSize"));
			if(Integer.parseInt(size)>0){
				this.cpcDao.insert(NAME_SPACE, "saveRoleAuthInfo_insert", param);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存角色权限", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> queryRoleUserInfo(Map<String, Object> param) {
		Map result = new HashMap();
		List allRoleUserList = new ArrayList(); 
		List useRoleUserList = new ArrayList();
		try {
			if("latn".equals(param.get("serch_type"))){
				allRoleUserList= this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllRoleUserList_latn", param);
				useRoleUserList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryUseRoleUserList", param);
			}else if("org".equals(param.get("serch_type"))){
				allRoleUserList= this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllRoleUserList_org", param);
			}else if("staff".equals(param.get("serch_type"))){
				int pageIndex = 0 ;
				int pageSize = 0 ;
				if(null == param.get("pageIndex") || "".equals(param.get("pageIndex"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pageIndex不能为空" );
					return result;
				}
				pageIndex =  Integer.parseInt(String.valueOf(param.get("pageIndex")));
				if(null == param.get("pageSize") || "".equals(param.get("pageSize"))){
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "pageSize不能为空" );
					return result;
				}
				pageSize =  Integer.parseInt(String.valueOf(param.get("pageSize")));
				//总行数  
//				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryRoleUseListSum", param);
				param.put("pageNum",  (pageIndex-1) * pageSize );
				allRoleUserList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryAllRoleUserList", param);
//				result.put("sum", sum);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("allRoleUserList", allRoleUserList);
			result.put("useRoleUserList", useRoleUserList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询角色用户数据", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> saveRoleUserInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "saveRoleUserInfo_delete", param);
			String size=String.valueOf(param.get("roleUserInfoSetSize"));
			if(Integer.parseInt(size)>0){
				this.cpcDao.insert(NAME_SPACE, "saveRoleUserInfo_insert", param);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存角色用户", e);
		}
		return result;
	}
	
	@Override
	public Map<String,Object> saveOptRecordInfo(Map<String,Object> param){
		Map result = new HashMap();
		Date date = new Date();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
		int random = (int) ((Math.random() * 9 + 1) * 1000);
		String optId = sdf.format(date)+random;
		param.put("optId", optId);
		try {
			this.cpcDao.insert(NAME_SPACE, "saveOptRecordInfo", param);
			List list = (List) param.get("optAttrInfoSet");
			if(list != null && list.size()>0) {
				this.cpcDao.insert(NAME_SPACE, "saveOptAttrInfo", param);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存操作记录", e);
		}
		return result;
		
		
	}

	@Override
	public Map<String, Object> queryCallSchedule(Map<String, Object> param) {

		Map result = new HashMap();
		try {
			List useRoleAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryCallSchedule", param);
 			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 			result.put("callWorks", useRoleAuthList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询值班", e);
		}
		return result;
	
	}

	@Override
	public Map<String, Object> updateCallSchedule(Map<String, Object> param) {


		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateCallSchedule", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存操作记录", e);
		}
		return result;
		
		
	
	}

	@Override
	public Map<String, Object> addCallSchedule(Map<String, Object> param) {



		Map result = new HashMap();
		String call_id = null ;
		try {
			call_id =  (String)this.cpcDao.qryObject(NAME_SPACE, "seq_CallSchedule", null);
			param.put("call_id", call_id);
			this.cpcDao.insert(NAME_SPACE, "addCallSchedule", param);
			
			result.put("call_id", call_id);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存操作记录", e);
		}
		return result;
		
		
	
	
	}

	@Override
	public Map<String, Object> qryPoolListPage(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if (null != param.get("pagenum") && !"".equals(param.get("pagenum"))
					&& null != param.get("pagesize")
					&& !"".equals(param.get("pagesize"))) {
	
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryPoolListSum", param);
				param.put("limit",  (pagenum-1) * pagesize );
				
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPoolListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPoolListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}
			 
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取组织机构数据异常！", e);
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> qryServiceListPage(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if (null != param.get("pagenum") && !"".equals(param.get("pagenum"))
					&& null != param.get("pagesize")
					&& !"".equals(param.get("pagesize"))) {
				
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryServiceListSum", param);
				param.put("limit",  (pagenum-1) * pagesize );
				
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryservicePage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPoolListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取组织机构数据异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> qryStaffInfo(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if (null != param.get("pagenum") && !"".equals(param.get("pagenum"))
					&& null != param.get("pagesize")
					&& !"".equals(param.get("pagesize"))) {
	
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryStaffListSum", param);
				param.put("limit",  (pagenum-1) * pagesize );
				
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryStaffListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryStaffListPage", param);
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
			}
			 
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取组织机构数据异常！", e);
		}
			return resultMap;
	}

	@Override
	public Map<String, Object> updatePoolInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updatePoolInfo", param);
			this.addLoggerInfo(param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("修改接单池值班信息", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> updateServiceInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.update(NAME_SPACE, "updateOldServiceInfo", param);
			this.cpcDao.update(NAME_SPACE, "updateServiceInfo", param);
			this.addLoggerInfo(param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("修改接单池值班信息", e);
		}
		return result;
	}
	@Override
	public Map<String,Object> addOrgInfo(Map<String,Object> param){
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "addOrgInfo", param);
			this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("新增组织机构", e);
		}
		return resultMap;
		
	}
	@Override
	public Map<String, Object> qryOrgAuthInfo(Map<String, Object> param) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			List useOrgAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryUseOrgAuthList", param);
			List allOrgAuthList = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryAllOrgAuthList", param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("allOrgAuthList", allOrgAuthList);
			result.put("useOrgAuthList", useOrgAuthList);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询角色权限数据", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> saveOrgAuthInfo(Map<String, Object> param) {
		Map result = new HashMap();
		try {
			this.cpcDao.delete(NAME_SPACE, "saveOrgAuthInfo_delete", param);
			String size=String.valueOf(param.get("roleAuthInfoSetSize"));
			if(Integer.parseInt(size)>0){
				this.cpcDao.insert(NAME_SPACE, "saveOrgAuthInfo_insert", param);
			}
			this.addLoggerInfo(param);
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存角色权限", e);
		}
		return result;
	}
	
	
	private void addLoggerInfo(Map<String, Object> param) {
		// TODO Auto-generated method stub
		
	}
	
}
