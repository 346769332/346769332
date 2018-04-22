package com.tydic.sale.service.crm.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.NotificationService;
import com.tydic.sale.service.util.Const;

/**
 * PUSH推送消息实现类
 * 
 * @author simon
 * @date 2017-10-24
 */
public class NotificationServiceImpl implements NotificationService {
	private Logger log = Logger.getLogger(this.getClass());

	private final String NAME_SPACE = "pushInfo";


	private WebApplicationContext springContext;

	private CpcDao cpcDao;

	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	/**
	 * 查询PUSH消息推送
	 * @author simon
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> qryPushInfo(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if (null != param.get("pagenum") && !"".equals(param.get("pagenum"))
					&& null != param.get("pagesize")
					&& !"".equals(param.get("pagesize"))) {
	
				pagenum =  Integer.parseInt(String.valueOf(param.get("pagenum")));
				pagesize =  Integer.parseInt(String.valueOf(param.get("pagesize")));
				int start = (pagenum-1)*pagesize;
				int end = pagesize;
				param.put("minSize", start);
				param.put("maxSize", end);
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryPushListSum", param);
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPushListPage", param);
			
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryPushListPage", param);
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

	/**
	 * 新增PUSH推送消息
	 * @author simon
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> addPushInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
				this.cpcDao.insert(NAME_SPACE, "addPushInfo", paramMap);
				if(paramMap.get("pushLevel").equals("1")){
					paramMap.put("pushLevels", 1);
					paramMap.put("sendToIds", paramMap.get("sendToId"));
					String staff_ids = (String) this.cpcDao.qryObject(NAME_SPACE, "getSendToStaffId", paramMap);
					result.put("staff_ids", staff_ids);
				}else{
					result.put("staff_ids", paramMap.get("sendToId"));
				}
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

}
