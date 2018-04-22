package com.tydic.sale.service.crm.service;

import java.util.Map;

public interface AppVersionService {

	/**
	 * 版本验证
	 * @param reqMap
	 * @return
	 */
	public Map<String,Object> valdateVersion(Map<String,Object> reqMap);
}
