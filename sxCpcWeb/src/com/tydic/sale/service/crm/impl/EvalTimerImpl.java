package com.tydic.sale.service.crm.impl;

import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import org.apache.zk.ZKUtil;
 

import com.tydic.sale.service.crm.CrmService;
import com.tydic.sale.service.crm.EvalTimer;
import com.tydic.sale.utils.Tools;
import com.tydic.thread.MainThread;
import com.tydic.thread.vo.MethodParams;

public class EvalTimerImpl implements EvalTimer, Observer{
	
	private CrmService crmService;
	
	private String isEval = "";
	
	private String defaultEval = "";
	
	private int defaultDate = 5;
	
	
	private Map confMap = new HashMap();

	public EvalTimerImpl(){
		confMap.putAll(ZKUtil.addObserver("/config", this));
		
		this.isEval = String.valueOf(this.confMap.get("com.tydic.default.is_eval"));
		this.defaultEval = String.valueOf(this.confMap.get("com.tydic.default.eval_value"));
		this.defaultDate =Integer.valueOf(String.valueOf(this.confMap.get("com.tydic.default.eval_date")));
	}

	
	public CrmService getCrmService() {
		return crmService;
	}


	public void setCrmService(CrmService crmService) {
		this.crmService = crmService;
	}


	@Override
	public void update(Observable arg0, Object arg1) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void evalTimerBatch() {
		
		if(Tools.isNull(isEval) || !"Y".equals(isEval.toUpperCase())){
			return;
		}
		
		String befre = Tools.addDate("yyyy-MM-dd", Calendar.DATE, -this.defaultDate-1);
		String start_create_time = befre + " 00:00:00";
		String end_create_time 	= befre + " 23:59:59";

		/**
		 * 1.查询待评价 的内容
		 * **/
		Map<Object,Object> reqEvalMap = new HashMap<Object,Object>();
		reqEvalMap.put("curr_node_id", "100103");
		reqEvalMap.put("record_status", "0");
		reqEvalMap.put("pagesize", "10000");
		reqEvalMap.put("pagenum", "1");
		reqEvalMap.put("start_create_time", start_create_time);
		reqEvalMap.put("end_create_time", end_create_time);		
		Map<Object,Object> demandEvalMap = this.crmService.getDemandLst(reqEvalMap);
		if(Tools.isNull(demandEvalMap) 
				|| !"0".equals(String.valueOf(demandEvalMap.get("code")))
				|| Tools.isNull(demandEvalMap.get("list"))
				|| !(demandEvalMap.get("list") instanceof List)){
			return;
		}
		List<Map<Object,Object>> demandEvalSet = (List<Map<Object, Object>>) demandEvalMap.get("list");
		/**
		 * 2.批量调用接口
		 * **/
		MainThread mainThread = MainThread.getNewIntance();
		List<MethodParams> methodParamSet = mainThread.getMethodParamsSet(
											new MethodParams(demandEvalSet,true));
		mainThread.runMainThread(5, this, "eval", methodParamSet, false, "多线程默认评价为"+this.defaultEval+"颗星！");
	}
	
	
	public void eval(List<Map<Object,Object>> evalSet){
		
		Map<Object,Object> reqMap = new HashMap<Object,Object>();
		
		String opinion = "超时"+this.defaultDate+"天默认评"+this.defaultEval+"星";
		
		String now = Tools.addDate("yyyy-MM-dd HH:mm:ss", Calendar.YEAR, 0);
		
		for(Map<Object,Object> eval : evalSet){
			Map<Object,Object> demand = new HashMap<Object,Object>();
			demand.put("demand_id"		, eval.get("demand_id"));
			demand.put("over_opinion"	, opinion);
			demand.put("over_eval"		, this.defaultEval);
			demand.put("over_time"		, now);
			
			Map<Object,Object> cpcFlowRecord = new HashMap<Object,Object>();
			cpcFlowRecord.put("busi_id"		, eval.get("demand_id"));
			cpcFlowRecord.put("opt_id"		, eval.get("opt_id"));
			cpcFlowRecord.put("opt_name"	, eval.get("opt_name"));
			cpcFlowRecord.put("opt_desc"	, opinion);
			cpcFlowRecord.put("curr_node_id", eval.get("curr_node_id"));
			cpcFlowRecord.put("curr_node_name", eval.get("curr_node_name"));
			cpcFlowRecord.put("opt_time"	, now);
			cpcFlowRecord.put("record_id"	, eval.get("curr_record_id") );
			cpcFlowRecord.put("next_node_id", eval.get("next_node_id"));
			cpcFlowRecord.put("next_node_name", eval.get("next_node_name"));
			cpcFlowRecord.put("next_opt_id"		, eval.get("opt_id"));
			cpcFlowRecord.put("next_opt_name"	, eval.get("opt_name"));
			
			reqMap.put("cpcDemand", demand);
			reqMap.put("cpcFlowRecord", cpcFlowRecord);
			
			this.crmService.flowExchange(reqMap);
		}
		
	}
}
