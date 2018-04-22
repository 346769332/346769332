package com.tydic.sale.service.crm.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.OutcommonService;
import com.tydic.sale.service.util.Const;

public class OutcommonServiceImpl implements OutcommonService {
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "outcommom";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	@Override
	public Map<String, Object> selectUserSecondaryList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "selectUserSecondaryList", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("data",list);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询用户信息异常！", e);
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> addStaffInfoOut(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "addStaffInfo", param);
			//this.addLoggerInfo(param);
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
	public Map<String, Object> updateUserInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateUserInfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("更新工号信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> delUserInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "delUserInfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除信息异常！", e);
		}
		return resultMap;
	}
	/**
	 * 就这个完成了，其他都是半拉子
	 */
	@Override
	public Map<String, Object> selectroleInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "selectroleinfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("data",list);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询角色信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> insertroleInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "insertroleInfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("新增角色信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updateroleInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateroleInfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("更新角色信息异常！", e);
		}
		return resultMap;
	}
	@Override
	public Map<String, Object> deleteroleInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "deleteroleInfo", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除角色信息异常！", e);
		}
		return resultMap;
	}
	//这个也完成了，哈哈
	@Override
	public Map<String, Object> selectroleInfosecondaryList(
			Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "selectroleInfosecondaryList", param);
			//this.addLoggerInfo(param);
			resultMap.put("data",list);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> selectOrganizationList(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			List list=this.cpcDao.qryMapListInfos(NAME_SPACE, "selectOrganizationList", param);
			//this.addLoggerInfo(param);
			resultMap.put("data",list);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> insertResRoleUsersecondaryList(
			Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.insert(NAME_SPACE, "insertResRoleUsersecondaryList", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除角色信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updateResRoleUsersecondaryList(
			Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateResRoleUsersecondaryList", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除角色信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> deleteResRoleUsersecondaryList(
			Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "deleteResRoleUsersecondaryList", param);
			//this.addLoggerInfo(param);
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("删除角色信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> getOrderCount(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			Map map=this.cpcDao.qryMapInfo(NAME_SPACE, "getordercount", param);
			resultMap.put("code","0000");
			resultMap.put("data",map.get("countq"));
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询待办异常！", e);
		}
		return resultMap;
	}

	

}
