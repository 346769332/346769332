package com.tydic.sale.service.crm.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.AppVersionService;
import com.tydic.sale.service.util.Const;

public class AppVersionServiceImpl implements AppVersionService {

private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "AppVersionService";

	private CpcDao cpcDao ;

	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	@Override
	public Map<String, Object> valdateVersion(Map<String, Object> reqMap) {
		
		Map<String,Object> resultMap = new HashMap<String,Object>();
		
		resultMap.put("code", Const.SUCCESS);
		resultMap.put("msg", "成功！");
		
		try {
			Map<String,Object> appVersion = this.cpcDao.qryMapInfo(NAME_SPACE, "select_version_by_app", reqMap);
			//替换版本编号
			appVersion.put("app_url", String.valueOf(appVersion.get("app_url")).replace("[VERSION]", String.valueOf(appVersion.get("app_version"))));

			resultMap.put("appVersion", appVersion);
			
		} catch (Exception e) {
			log.error("版本验证失败：数据库访问异常！入参:"+reqMap+"", e);
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "版本验证失败：数据库访问异常！");
		}
		
		return resultMap;
	}
	
	
	
}
