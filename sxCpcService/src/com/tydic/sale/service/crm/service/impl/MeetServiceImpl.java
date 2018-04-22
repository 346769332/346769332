package com.tydic.sale.service.crm.service.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;







import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.MeetService;
import com.tydic.sale.service.util.Const;

public class MeetServiceImpl implements MeetService {
	
	private final String NAME_SPACE = "meet";

	private CpcDao cpcDao ;
	
	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}

	@Override
	public Map<String,Object> addMeetInfo(Map<String, Object> param) {
		String meetId = this.qryMeetIdInfo(param);//获取 流程流转ID
		String meetInfoStr = String.valueOf(param.get("dataArr"));
		String meetInfoTRArr[] = meetInfoStr.split(";");
		
		Map<String, Object> resultMap = new HashMap<String, Object>();
		
		try {
			Map<String, Object> paramMap = null;
			for (int i = 0; i < meetInfoTRArr.length; i++) {
				String meetInfoTR = meetInfoTRArr[i];
				String meetInfoTDArr[] = meetInfoTR.split(",");
	
				paramMap = new HashMap<String, Object>();
				paramMap.put("STAFF_ID", param.get("staff_id"));
				paramMap.put("MEET_ID", meetId);
				paramMap.put("MEET_WEEK", param.get("dateInfos"));
				paramMap.put("state", param.get("state"));
				
				for (int j = 0; j < meetInfoTDArr.length; j++) {
					if(j==0)paramMap.put("MEET_ORG", meetInfoTDArr[j]);
					if(j==1) paramMap.put("MEET_NAME", meetInfoTDArr[j]);
					if(j==2) paramMap.put("MEET_TIME", meetInfoTDArr[j]);
					if(j==3) paramMap.put("MEET_ADDR", meetInfoTDArr[j]);
					if(j==4) paramMap.put("MEET_JT_OWNER", meetInfoTDArr[j]);
					if(j==5) paramMap.put("MEET_PROVINCE", meetInfoTDArr[j]);
					if(j==6) paramMap.put("MEET_CITY", meetInfoTDArr[j]);
					if(j==7) paramMap.put("MEET_REMARK", meetInfoTDArr[j]);
				}
				this.cpcDao.insert(NAME_SPACE, "addMeetInfo", paramMap);
			}

			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "失败");
		}
		return resultMap;
	}
	
	private String qryMeetIdInfo(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		String meetId ="";
		try {
			resultMap = this.cpcDao.qryMapInfo(NAME_SPACE, "qry_MeetId", param);
			meetId = String.valueOf(resultMap.get("meetId"));
		} catch (Exception e) {
			e.printStackTrace();
		}
		return meetId;
	}

	@Override
	public Map<String, Object> qryMeetInfo(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> meetInfoList = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryMeetInfo", param);

			resultMap.put("meetInfoList", meetInfoList);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "失败");
			e.printStackTrace();
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updMeetInfo(Map<String, Object> param) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "delMeetInfo", param);
			
			this.addMeetInfo(param);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "失败");
			e.printStackTrace();
		}
		return resultMap;
	}
	
}
