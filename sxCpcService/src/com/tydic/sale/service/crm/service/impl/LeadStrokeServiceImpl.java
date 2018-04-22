package com.tydic.sale.service.crm.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.orm.ibatis.support.SqlMapClientDaoSupport;
import org.springframework.web.context.WebApplicationContext;

import com.ibatis.sqlmap.client.SqlMapClient;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.LeadStrokeService;
import com.tydic.sale.service.util.Const;
/**
 * 用户短流程处理的类
 * @author simon
 * @date 2016-09-28
 */
public class LeadStrokeServiceImpl implements LeadStrokeService{
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "leadStroke";
	
	private WebApplicationContext springContext;
	
	private CpcDao cpcDao ;

	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	@Override
	public Map<String, Object> sendSaveLeadStrokeInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			
			String dataStr = param.get("dataArr").toString();
			String save_type=(String)param.get("saveType");
			String laedStrokeIds="";//发布时返回的所有发布箱的主键
			String rowArr[] = dataStr.split(";");
			for (int i = 0; i < rowArr.length; i++) {
				String dataArr[] = rowArr[i].split(",");
					String strokeTime=dataArr[0]; param.put("strokeTime", strokeTime);
					String strokeTimeStart=dataArr[1]; param.put("strokeTimeStart", strokeTimeStart);
					String periodTime=dataArr[2]; param.put("periodTime", periodTime);
					String strokeInfo=dataArr[3];param.put("strokeInfo", strokeInfo);
					String remarkInfo=dataArr[4];param.put("remarkInfo", remarkInfo);
					//这里对行程的日期做个处理，得到该行程是本周的第几天
					int weeks=getStartTimeWeeks(strokeTimeStart);
					param.put("weeks", weeks);
					if(save_type.equals("1")){//发布，要给发布表和草稿箱表都插入数据
						//给发布表插入数据
						int laedStrokeId=this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeInfo", param,1);
						laedStrokeIds=laedStrokeIds+laedStrokeId+",";
						
					}else if(save_type.equals("0")){//只发草稿箱
						param.put("saveType", "0");
						param.put("laedStrokeStatus",   0);
						this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeInfo", param);
					}
			}
			if(save_type.equals("1")&&laedStrokeIds!=null&&!laedStrokeIds.equals("")){
				laedStrokeIds=laedStrokeIds.substring(0, laedStrokeIds.length()-1);
				//给草稿箱插入数据
				param.put("laedStrokeIds", laedStrokeIds);
				param.put("laedStrokeStatus",   0);
				this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeDraftsInfo", param);
			}
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("保存草稿异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> submitLeadStrokeInfo(Map<String, Object> param) {
		Map<String,Object> resultMap = new HashMap<String,Object>();
		try {
			//从草稿进来，如果是保存，就是将原来的草稿删除，重新插入一条草稿，如果是发布，就需要将草稿箱和发布箱中的都删除，插入新的数据
			String saveType=(String)param.get("saveType");
			if(saveType.equals("0")){//草稿保存
				this.cpcDao.delete(NAME_SPACE, "delLeadStorkeInfo", param);
			}else if(saveType.equals("1")){//草稿发布
				param.put("saveType", "0");//先删草稿
				this.cpcDao.delete(NAME_SPACE, "delLeadStorkeInfo", param);
				param.put("saveType", "1");//再删发布表
				this.cpcDao.delete(NAME_SPACE, "delLeadStorkeInfo", param);
			}
			param.put("saveType", saveType);//删除完成后，恢复原来的type
			String dataStr = param.get("dataArr").toString();
			String rowArr[] = dataStr.split(";");
			String laedStrokeIds="";//发布时返回的所有发布箱的主键 
			for (int i = 0; i < rowArr.length; i++) {
				String dataArr[] = rowArr[i].split(",");
					String strokeTime=dataArr[0]; param.put("strokeTime", strokeTime);
					String strokeTimeStart=dataArr[1]; param.put("strokeTimeStart", strokeTimeStart);
					String periodTime=dataArr[2]; param.put("periodTime", periodTime);
					String strokeInfo=dataArr[3];param.put("strokeInfo", strokeInfo);
					String remarkInfo=dataArr[4];param.put("remarkInfo", remarkInfo);
					//这里对行程的日期做个处理，得到该行程是本周的第几天
					int weeks=getStartTimeWeeks(strokeTimeStart);
					param.put("weeks", weeks);
					//给发布表插入数据
					int laedStrokeId=this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeInfo", param,1);
					laedStrokeIds=laedStrokeIds+laedStrokeId+",";
					//this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeInfo", param);	
			}
			if(saveType.equals("1")&&laedStrokeIds!=null&&!laedStrokeIds.equals("")){
				laedStrokeIds=laedStrokeIds.substring(0, laedStrokeIds.length()-1);
				//给草稿箱插入数据
				param.put("laedStrokeIds", laedStrokeIds);
				param.put("laedStrokeStatus",   0);
				this.cpcDao.insert(NAME_SPACE, "sendSaveLeadStrokeDraftsInfo", param);
			}
			resultMap.put("code",Const.SUCCESS);
			resultMap.put("msg", "成功");
 		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("保存草稿异常！", e);
		}
		return resultMap;
	}
	
    /**
     * 得到指定时间是一周中的第几天
     * @param strokeTimeStart
     * @return
     * @throws ParseException 
     */
	public static int getStartTimeWeeks(String strokeTimeStart) throws ParseException {
		// TODO Auto-generated method stub
		//先将strokeTimeStart时间处理一下
		String year=(strokeTimeStart.split("/"))[0];
		String month=(strokeTimeStart.split("/"))[1];
		String day=(strokeTimeStart.split("/"))[2];
		if(Integer.parseInt(month)<10){
			month="0"+month;
		}
		if(Integer.parseInt(day)<10){
			day="0"+day;
		}
		strokeTimeStart=year+"/"+month+"/"+day;
		java.text.SimpleDateFormat formatter = new SimpleDateFormat( "yyyy/MM/dd");
		Date date =  formatter.parse(strokeTimeStart);
		Calendar cal = Calendar.getInstance();  
        cal.setTime(date);  
        int week_index = cal.get(Calendar.DAY_OF_WEEK)-1;
        if(week_index==0){//周日
        	week_index=7;
        }
		return week_index;
	}
	
}
