package com.tydic.sale.service.crm.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.web.context.WebApplicationContext;

import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.dao.CpcDao;
import com.tydic.sale.service.crm.service.SMSService;
import com.tydic.sale.service.crm.service.ShortProcessService;
import com.tydic.sale.service.util.Const;
import com.tydic.sale.service.util.Tools;
import com.tydic.sale.service.util.WeekdayUtil;
import com.tydic.sale.utils.StringUtil;
import com.tydic.thread.MainThread;
import com.tydic.thread.vo.MethodParams;
/**
 * 用户短流程处理的类
 * @author simon
 * @date 2016-09-28
 */
public class ShortProcessServiceImpl implements ShortProcessService{
	
	private Logger log = Logger.getLogger(this.getClass());
	
	private final String NAME_SPACE = "shortProcess";

	private SMSService sMSService;
	
	private WebApplicationContext springContext;
	
	private CpcDao cpcDao ;

	public CpcDao getCpcDao() {
		return cpcDao;
	}

	public void setCpcDao(CpcDao cpcDao) {
		this.cpcDao = cpcDao;
	}
	
	public SMSService getsMSService() {
		return sMSService;
	}

	public void setsMSService(SMSService sMSService) {
		this.sMSService = sMSService;
	}
	/**
	 * 短流程查询
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> queryDemandList(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == paramMap.get("pagenum") || "".equals(paramMap.get("pagenum"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagenum不能为空" );
				return result;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(paramMap.get("pagenum")));
			if(null == paramMap.get("pagesize") || "".equals(paramMap.get("pagesize"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagesize不能为空" );
				return result;
	 		}
			if(paramMap.get("flags").equals("chuli")){
				paramMap.put("latn_id", "");	
				pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
				paramMap.put("pagenum",  pagenum*pagesize);	  	
				paramMap.put("pagesize", pagesize);	   
				  List<Map<String,Object>> relist=new ArrayList<Map<String,Object>>();
				  List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandListPage_fun", paramMap);
					String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandListSum_fun", paramMap);
					//add by wxh 加上查询每个需求单的附件信息
					if(list!=null&&list.size()>0){
						for(int i=0;i<list.size();i++){
							Map<String,Object> demmap=(Map<String,Object>)list.get(i);
							Map<String, Object> newMap=new HashMap<String, Object>();
							newMap.put("proId", demmap.get("DEMAND_ID"));	
							List<Map<String, Object>> filelist=cpcDao.qryMapListInfos(NAME_SPACE, "qryDownloadPath",  newMap);
							demmap.put("fileList", filelist);
							relist.add(demmap);
						}
					}
		  	        result.put("code", Const.SUCCESS);
					result.put("msg", "成功");
					result.put("list", relist);
					result.put("sum",  sum);
				
			}else {
				//查询角色--------综支角色可以查看本地网下所有单子信息 -----
				String role = (String) this.cpcDao.qryObject(NAME_SPACE, "get_role_o", paramMap);
				if(role.equals("1")){
					paramMap.put("staffId", "");				
					if(paramMap.get("latn_id").equals("888")){
					paramMap.put("latn_id", "");								
					}
					pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
					paramMap.put("page_num",  pagenum*pagesize);	  	
					paramMap.put("pagesize", pagesize);	    	      
					  List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandListPage", paramMap);
						String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandListSum", paramMap);
			  	        result.put("code", Const.SUCCESS);
						result.put("msg", "成功");
						result.put("role", role);
						result.put("list", list);
						result.put("sum",  sum);
				}else {

					pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
					paramMap.put("page_num",  pagenum*pagesize);	  	
					paramMap.put("pagesize", pagesize);	  
					  List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandListPage", paramMap);
						String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandListSum", paramMap);
			  	      
			  	        result.put("code", Const.SUCCESS);
						result.put("msg", "成功");
						result.put("list", list);
						result.put("role", role);
						result.put("sum",  sum);
				
				}
			}
			
			
			
		
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 历史短流程查询
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> queryDemandHistoryList(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == paramMap.get("pagenum") || "".equals(paramMap.get("pagenum"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagenum不能为空" );
				return result;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(paramMap.get("pagenum")));
			if(null == paramMap.get("pagesize") || "".equals(paramMap.get("pagesize"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagesize不能为空" );
				return result;
	 		}
			//查询角色--------小CEO只能看到自己发起的所有单子信息 ----- 综支人员可以看到全部单子
			String role = (String) this.cpcDao.qryObject(NAME_SPACE, "get_role_o_rel", paramMap);
			if(role.equals("1")){
				paramMap.put("latn_id", "");
			}else {
				paramMap.put("staffId", "");
				if(paramMap.get("latn_id").equals("888")){
					paramMap.put("latn_id", "");
				}
			}
			pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getDemandHistoryListSum", paramMap);
			paramMap.put("page_num",  pagenum*pagesize);	  	
			paramMap.put("pagesize", pagesize);	  
  	        List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getDemandHistoryListPage", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 流程配置列表查询
	 */
	@Override
	public Map<String, Object> qryActWorkflwoInfoList(Map<String, Object> param) {
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
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryWorkFlowListSum", param);
				//当前页内容
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryWorkFlowListPage", param);
			
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryWorkFlowListPage", param);
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
	 * 短流程需求详细查询
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> queryDemandHistoryListDetail(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		Map<String,Object> map = new HashMap<String,Object>();
		try {
			List<Map<String,Object>>  list0= this.cpcDao.qryMapListInfos(NAME_SPACE, "getTemplatePro", paramMap);
			List<Map<String,Object>>  list1= this.cpcDao.qryMapListInfos(NAME_SPACE, "getStarNode", paramMap);
			//从节点实例表中取数据
			List<Map<String,Object>> mapNodes = this.cpcDao.qryMapListInfos(NAME_SPACE, "getNodes", paramMap);
			Map<String,Object> nodeMap = new HashMap<String,Object>();
			for (int i = 0; i < mapNodes.size(); i++) {
				nodeMap.put(mapNodes.get(i).get("NODE_ID").toString(), mapNodes.get(i));
			}
			map.put("nodes",nodeMap);
			//从流程线中取数据
  	        List<Map<String,Object>>  mapLines= this.cpcDao.qryMapListInfos(NAME_SPACE, "getLines", paramMap);
			Map<String,Object> lineMap = new HashMap<String,Object>();
 			for (int i = 0; i < mapLines.size(); i++) {
				lineMap.put("demo_line_"+(i+1), mapLines.get(i));
			}
  	        map.put("lines",lineMap);
  	        
  	        result.put("nodeNum", mapNodes.size());
  	        result.put("lineNum", mapLines.size());
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", map);
			result.put("list0", list0);
			result.put("list1", list1);
			
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 短流程需求节点信息
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> queryWorkflowNodeInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkflowNodeInfo", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 模板信息
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> queryDemandTemplateInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			//add by dangzw begin 2016-12-05
			int pagenum =  Integer.parseInt(String.valueOf(paramMap.get("pagenum")));
			int pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
			int start = (pagenum-1)*pagesize;
			int end = pagesize;
			paramMap.put("pagenum", start);
			paramMap.put("pagesize", end);
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryDemandTemplateInfoSum", paramMap);
			//add by dangzw end 2016-12-05
			List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryDemandTemplateInfo", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 新建流程
	 * @author dangzw
	 * @param
	 * @return 
	 */
	@Override
	public Map<String, Object> addWorkflow(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			//保存流程信息(ACT_WORKFLOW_INFO)
			String workflowId="";
			List<Map<String,Object>> listWorkflow=getWorkflowList(paramMap);
			for(Map<String, Object> batch : listWorkflow){
				workflowId = (String) batch.get("workflowId");

	  	      
			}
			
			this.cpcDao.batchInsert(NAME_SPACE, "addWorkflow", listWorkflow);
			System.out.println(listWorkflow);
			//保存节点信息信息(ACT_PROCESS_NODE_EXAMPLE)
			//说明：listWorkflow 这个参数主要是为了 取流程id 
			List<Map<String,Object>> listNodeExample=getNodeExampleList(paramMap,listWorkflow);
			this.cpcDao.batchInsert(NAME_SPACE, "addNodeExample", listNodeExample);
			
			//保存节点别名与节点ID关系信息(ACT_NODEALIAS_NODEID_REALITION)
			//listWorkflow 表示流程id,listNodeExample表示节点id
			List<Map<String,Object>> listNodealiasNodeRealition=getNodeAliasRealtion(paramMap,listNodeExample);
			this.cpcDao.batchInsert(NAME_SPACE, "addNodeRealition", listNodealiasNodeRealition);
			
			//保存线信息(ACT_WORKFLOW_LINE)
			List<Map<String,Object>> listLine=getLineList(paramMap,listWorkflow);
			System.out.println(listLine);
			this.cpcDao.batchInsert(NAME_SPACE, "addWorkflowLine", listLine);
			
			//保存流程配置信息(ACT_WORKFLOW_CONFIG)
			
			List<Map<String,Object>> listWorkflowConfig=getWorkflowConfigList(paramMap,listWorkflow);
			this.cpcDao.batchInsert(NAME_SPACE, "addWorkflowConfig", listWorkflowConfig);
			
  	        result.put("code", Const.SUCCESS);
			result.put("workflowId",workflowId);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("保存流程异常", e);
		}
		return result;
	}
	
	/**
	 * 封装流程数据
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> getWorkflowList(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		List<Map<String,Object>> listWorkflow=new ArrayList<Map<String,Object>>();
		String localNets= String.valueOf(paramMap.get("localNet"));
		String[] localNet=localNets.split(",");
		String workflowId=String.valueOf(paramMap.get("workflowId"));
		String workflowName=String.valueOf(paramMap.get("workflowName"));
		String workflowClass=String.valueOf(paramMap.get("workflowClass"));
		String workflowType=String.valueOf(paramMap.get("workflowType"));
		String workflowSingleType=String.valueOf(paramMap.get("workflowSingleType"));
		String workflowCustomType=String.valueOf(paramMap.get("workflowCustomType"));
		String workflowTemplateId=String.valueOf(paramMap.get("workflowTemplateId"));
		String regionId=String.valueOf(paramMap.get("regionId"));
		String noticeInfo=String.valueOf(paramMap.get("noticeInfo"));
		String workflowParentId="";
		//保存省级流程
		try {
//			if(regionId.equals("888")){
//				Map<String,Object> mapParentWorkflow=new HashMap<String, Object>();
//				workflowParentId=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getWorkflowId", null));
//				System.out.println(workflowParentId);
//				String workflowParentCode=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getWorkflowCode", null));
//				mapParentWorkflow.put("workflowId", workflowParentId);
//				mapParentWorkflow.put("workflowCode", workflowParentCode);
//				mapParentWorkflow.put("workflowStatus", "1010");
//				mapParentWorkflow.put("workflowName", workflowName);
//				mapParentWorkflow.put("workflowClass", workflowClass);
//				mapParentWorkflow.put("workflowType", workflowType);
//				mapParentWorkflow.put("workflowSingleType", workflowSingleType);
//				//mapParentWorkflow.put("workflowCustomType", workflowCustomType);
//				mapParentWorkflow.put("workflowParentId", "");
//				mapParentWorkflow.put("wcreatorId", paramMap.get("wcreatorId"));
//				mapParentWorkflow.put("localNet", regionId);
//				mapParentWorkflow.put("workflowTemplateId", workflowTemplateId);
//				mapParentWorkflow.put("workflowLevel", "1");
//				mapParentWorkflow.put("workflowPublishStatus", "0");
//				listWorkflow.add(mapParentWorkflow);
//			}
//			
			//保存市级流程
			for (int i = 0; i < localNet.length; i++) {
				Map<String,Object> mapWorkflow=new HashMap<String, Object>();
				try {
					//String workflowId=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getWorkflowId", null));
					String workflowCode=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getWorkflowCode", null));
					mapWorkflow.put("workflowId", workflowId);
					mapWorkflow.put("workflowCode", workflowCode);
					mapWorkflow.put("workflowStatus", "1001");
					mapWorkflow.put("noticeInfo", noticeInfo);
					//父流程id
					mapWorkflow.put("workflowParentId", workflowParentId);
					mapWorkflow.put("wcreatorId", paramMap.get("wcreatorId"));
					mapWorkflow.put("workflowName", workflowName);
					mapWorkflow.put("workflowClass", workflowClass);
					mapWorkflow.put("workflowSingleType", workflowSingleType);
					mapWorkflow.put("workflowCustomType", workflowCustomType);
					mapWorkflow.put("workflowType", workflowType);
					mapWorkflow.put("localNet", localNet[i]);
					mapWorkflow.put("workflowTemplateId", workflowTemplateId);
					mapWorkflow.put("workflowPublishStatus", "0");
//					if(regionId.equals("888")){
//						mapWorkflow.put("workflowLevel", "2");
//					}else{
//						
						mapWorkflow.put("workflowLevel", "3");
//					}
					listWorkflow.add(mapWorkflow);
				} catch (Exception e) {
					e.printStackTrace();
					result.put("code", Const.FAIL_SQL);
					result.put("msg", "系统异常"+e.getMessage());
					log.error("获取流程id异常", e);
				}
			}

		} catch (Exception e1) {
			e1.printStackTrace();
		}
		return listWorkflow;
	}
	
	/**
	 * 封装节点实例数据
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> getNodeExampleList(Map<String, Object> paramMap,List<Map<String,Object>> list){
		List<Map<String,Object>> listNode=new ArrayList<Map<String,Object>>();
		
		String workflowAlias=(String.valueOf(paramMap.get("workflowAlias"))) ;
		String[] workflowAlia=workflowAlias.split(",");
		String nodeNames=(String.valueOf(paramMap.get("nodeNames")));
		String[] nodeName=nodeNames.split(",");
		String nodeTypes=(String.valueOf(paramMap.get("nodeTypes")));
		String[] nodeType=nodeTypes.split(",");
		String nodeTops=(String.valueOf(paramMap.get("nodeTops")));
		String[] nodeTop=nodeTops.split(",");
		String nodeLefts=(String.valueOf(paramMap.get("nodeLefts")));
		String[] nodeLeft=nodeLefts.split(",");
		String nodeWidths=(String.valueOf(paramMap.get("nodeWidths")));
		String[] nodeWidth=nodeWidths.split(",");
		String nodeHeights=(String.valueOf(paramMap.get("nodeHeights")));
		String[] nodeHeight=nodeHeights.split(",");
		for (int i = 0; i < list.size() ; i++) {
			for (int j = 0; j < nodeName.length; j++) {
				try {
					Map<String,Object> mapNode=new HashMap<String, Object>();
					String nodeId=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getNodeId", null));
					//主要是在向  保存节点别名与节点ID关系信息(ACT_NODEALIAS_NODEID_REALITION)中时用
					mapNode.put("workflowAlias", workflowAlia[j]);
					mapNode.put("nodeId", nodeId);
					mapNode.put("workflowId", list.get(i).get("workflowId"));
					mapNode.put("nodeName", nodeName[j]);
					if(nodeType[j].equals("start round")){
						//0 表示开始节点
						mapNode.put("nodeType", 0);
					}else if(nodeType[j].equals("node")){
						//1 表示自由节点
						mapNode.put("nodeType", 1);
					}else{
						//2 表示 结束节点
						mapNode.put("nodeType", 2);
					}
					/**********************************************节点流入类型*********************************************/
//					String currentAlias=workflowAlia[j].substring(workflowAlia[j].lastIndexOf("_")+1);
//					int lastNum=Integer.parseInt(currentAlias);
//					String lineFroms=(String.valueOf(paramMap.get("lineFroms"))) ;
//					String[] lineFrom=lineFroms.split(",");
//					for (int k = 0; k < lineFrom.length; k++) {
//						lineFrom[k]=lineFrom[k].substring(lineFrom[k].lastIndexOf("_")+1);
//					}
//					int count=0;
//					for (int m = 0; m < lineFrom.length; m++) {
//						if(Integer.parseInt(lineFrom[m]) < lastNum){
//							count++;
//						}
//					}
//					if(count<=1){
//						//串行
//						mapNode.put("nodeInType", 0);
//					}else{
//						//并行
//						mapNode.put("nodeInType", 1);
//					}
					/**********************************************节点流入类型*********************************************/
					mapNode.put("nodeTop", nodeTop[j]);
					mapNode.put("nodeLeft", nodeLeft[j]);
					mapNode.put("nodeWidth", nodeWidth[j]);
					mapNode.put("nodeHeight", nodeHeight[j]);
					if(nodeType[j].equals("start round")){
						mapNode.put("timeLimit", 1);
					}else{
						mapNode.put("timeLimit", 2);
					}
					listNode.add(mapNode);
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return listNode;
	}
	
	/**
	 * 封装线数据
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> getLineList(Map<String, Object> paramMap,List<Map<String,Object>> list){
		List<Map<String,Object>> listLine=new ArrayList<Map<String,Object>>();
		Map<String,Object> parMap=new HashMap<String, Object>();
		String lineFroms=(String.valueOf(paramMap.get("lineFroms"))) ;
		String[] lineFrom=lineFroms.split(",");
		String lineTos=(String.valueOf(paramMap.get("lineTos")));
		String[] lineTo=lineTos.split(",");
		String lineTypes=(String.valueOf( paramMap.get("lineTypes")));
		String[] lineType=lineTypes.split(",");
		String lineMs=(String.valueOf( paramMap.get("lineMs")));
		String[] lineM=lineMs.split(",");
		String lineNames=(String.valueOf( paramMap.get("lineNames")));
		String[] lineName=lineNames.split(",");
		
		String workflowSingleType=(String.valueOf( paramMap.get("workflowSingleType")));
		
		for (int i = 0; i < lineM.length; i++) {
			if(lineM[i].equals("undefined")){
				lineM[i]="";
			}
		}
		for (int i = 0; i < list.size() ; i++) {
			for (int j = 0; j < lineFrom.length; j++) {
				try {
					Map<String,Object> mapLine=new HashMap<String, Object>();
					
					//获取lineFromId
					parMap.put("workflowId", list.get(i).get("workflowId"));
					parMap.put("nodeAlais", lineFrom[j].substring(lineFrom[j].lastIndexOf("_")+1));
					String lineFromId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
					parMap.clear();
					
					//获取lineToId
					parMap.put("workflowId", list.get(i).get("workflowId"));
					parMap.put("nodeAlais", lineTo[j].substring(lineTo[j].lastIndexOf("_")+1));
					String lineToId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
					parMap.clear();
					
					mapLine.put("workflowId", list.get(i).get("workflowId"));
					mapLine.put("lineFromId", lineFromId);
					mapLine.put("lineToId", lineToId);
					mapLine.put("lineType", lineType[j]);
					mapLine.put("lineM", lineM[j]);
					if(workflowSingleType.equals("1")){
						if(lineName.length==0){
							mapLine.put("lineName", "1");
						}else{
							mapLine.put("lineName",lineName[j]);
						}
					}else if(workflowSingleType.equals("0")){
						//渠道工号流程
						if(lineName.length==0){
							mapLine.put("lineName", "1");
						}else{
							mapLine.put("lineName", lineName[j]);
						}
					}else{
						//内联
						mapLine.put("lineName", lineName[j]);
					}
					listLine.add(mapLine);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
		}
		return listLine;
	}
	
	/**
	 * 封装流程配置信息
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> getWorkflowConfigList(Map<String, Object> paramMap,List<Map<String,Object>> listWorkflow){
		List<Map<String,Object>> listWorkflowConfig=new ArrayList<Map<String,Object>>();
		
		String lineFroms=(String.valueOf(paramMap.get("lineFroms"))) ;
		String[] lineFrom=lineFroms.split(",");
		lineFrom=substrLart(lineFrom);
		String lineTos=(String.valueOf(paramMap.get("lineTos")));
		String[] lineTo=lineTos.split(",");
		lineTo=substrLart(lineTo);
		String lineTypes=(String.valueOf( paramMap.get("lineTypes")));
		String[] lineType=lineTypes.split(",");
		Map<String, Object> parMap=new HashMap<String, Object>();
		String workflowId="";
		String workflowCode="";
		String id=String.valueOf(listWorkflow.get(0).get("workflowId"));
		String[] nodeAliasAndType=getNodeAliasAndType(lineFrom,id);
		//循环流程
		for(int i= 0;i < listWorkflow.size();i++){
			workflowId=String.valueOf(listWorkflow.get(i).get("workflowId"));
			workflowCode=String.valueOf(listWorkflow.get(i).get("workflowCode"));
			//插入开始节点配置信息
			for (int k = 0; k < lineFrom.length; k++) {
				try {
					parMap.put("nodeAlais", lineFrom[k]);
					parMap.put("workflowId", workflowId);
					String nodeType=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeTypeByPara", parMap));
					parMap.clear();
					if(nodeType.equals("0")){
						Map<String,Object> mapEndNode=new HashMap<String, Object>();
						//当前节点id
						parMap.put("workflowId", workflowId);
						parMap.put("nodeAlais", lineFrom[k]);
						String currentNodeId = String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
						parMap.clear();
						//下一节点id	
						parMap.put("workflowId", workflowId);
						parMap.put("nodeAlais", lineTo[k]);
						String nextNodeId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
						parMap.clear();
						
						//插入审批结果(根据fromId 和 toId 去 线表中查询 line_name即为对应的 审批结果)
//						parMap.put("fromId", currentNodeId);
//						parMap.put("toId", nextNodeId);
//						String operation=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getOperation", parMap));
//						parMap.clear();
//						if(operation.equals("通过") || operation.equals("同意") || operation.equals("T")){
//							mapEndNode.put("operation", "agree");
//						}else{
//							mapEndNode.put("operation","reject");
//						}
						mapEndNode.put("operation","");
						mapEndNode.put("workflowId", workflowId);
						mapEndNode.put("workflowCode", workflowCode);
						mapEndNode.put("nodeId", currentNodeId);
						mapEndNode.put("prevNodeId", "");
						mapEndNode.put("nextNodeId", nextNodeId);
						listWorkflowConfig.add(mapEndNode);
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			//插入中间节点
			//循环开始节点
			for (int j = 0; j < nodeAliasAndType.length; j++) {
				try {
					String nodeType=nodeAliasAndType[j].substring(nodeAliasAndType[j].indexOf("_")+1);
					if(!nodeType.equals("0")){
						//循环结束节点
						for (int k = 0; k < lineTo.length; k++) {
							Map<String,Object> mapWorkflowConfig=new HashMap<String, Object>();
							String currentNode=nodeAliasAndType[j].substring(0, nodeAliasAndType[j].indexOf("_"));
							if(currentNode.equals(lineTo[k])){
								//根据流程id和别名去 ACT_NODEALIAS_NODEID_REALITION 表中获取 节点id
								//当前节点id
								parMap.put("workflowId", workflowId);
								parMap.put("nodeAlais", currentNode);
								String currentNodeId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
								parMap.clear();
								//上一步对应流程节点id
								String prevNode=lineFrom[k];
								parMap.put("nodeAlais", prevNode);
								parMap.put("workflowId", workflowId);
								String prevNodeId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
								parMap.clear();
								
								//int nextStep=step+1;
								//下一步对应节点id
								String nextNodeAlais=lineTo[j];
								parMap.put("workflowId", workflowId);
								parMap.put("nodeAlais", nextNodeAlais);
								String nextNodeId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
								parMap.clear();
								//插入审批结果(根据fromId 和 toId 去 线表中查询 line_name即为对应的 审批结果)
//								parMap.put("fromId", currentNodeId);
//								parMap.put("toId", nextNodeId);
//								String operation=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getOperation", parMap));
//								parMap.clear();
//								if(operation.equals("通过") || operation.equals("同意") || operation.equals("T")){
//									mapWorkflowConfig.put("operation", "agree");
//								}else{
//									mapWorkflowConfig.put("operation","reject");
//								}
								mapWorkflowConfig.put("workflowId", workflowId);
								mapWorkflowConfig.put("workflowCode", workflowCode);
								//mapWorkflowConfig.put("step", step);
								mapWorkflowConfig.put("nodeId", currentNodeId);
								mapWorkflowConfig.put("prevNodeId", prevNodeId);
								//mapWorkflowConfig.put("nextStep", nextStep);
								mapWorkflowConfig.put("nextNodeId", nextNodeId);
								listWorkflowConfig.add(mapWorkflowConfig);
								
							}
						}
					}
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			
			//插入末尾节点配置信息
				for (int k = 0; k < lineTo.length; k++) {
					try {
						parMap.put("nodeAlais", lineTo[k]);
						parMap.put("workflowId", workflowId);
						String nodeType=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeTypeByPara", parMap));
						parMap.clear();
						
						if(nodeType.equals("2")){
							Map<String,Object> mapEndNode=new HashMap<String, Object>();
							//末尾节点id
							parMap.put("workflowId", workflowId);
							parMap.put("nodeAlais", lineTo[k]);
							String currentNodeId = String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
							parMap.clear();
							//上一节点id	
							parMap.put("workflowId", workflowId);
							parMap.put("nodeAlais", lineFrom[k]);
							String prevNodeId=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeIdByPara", parMap));
							parMap.clear();
							
							mapEndNode.put("workflowId", workflowId);
							mapEndNode.put("workflowCode", workflowCode);
							mapEndNode.put("nodeId", currentNodeId);
							mapEndNode.put("prevNodeId", prevNodeId);
							mapEndNode.put("nextNodeId", "");
							listWorkflowConfig.add(mapEndNode);
						}
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
			}
		return listWorkflowConfig;
	}
	
	/**
	 * 封装节点别名与节点ID关系信息
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public List<Map<String,Object>> getNodeAliasRealtion(Map<String, Object> paramMap,List<Map<String,Object>> listNode){
		List<Map<String,Object>> listNodeAliasRealtion=new ArrayList<Map<String,Object>>();
		for(int i=0;i < listNode.size(); i++){
			Map<String,Object> mapNodeAliasRealtion=new HashMap<String, Object>();
			String workflowAlias=String.valueOf(listNode.get(i).get("workflowAlias"));
			workflowAlias=workflowAlias.substring(workflowAlias.lastIndexOf("_")+1);
			mapNodeAliasRealtion.put("workflowAlias", workflowAlias);
			mapNodeAliasRealtion.put("workflowId", listNode.get(i).get("workflowId"));
			mapNodeAliasRealtion.put("nodeId", listNode.get(i).get("nodeId"));
			mapNodeAliasRealtion.put("nodeName", listNode.get(i).get("nodeName"));
			listNodeAliasRealtion.add(mapNodeAliasRealtion);
		}
		return listNodeAliasRealtion;
	}
	
	/**
	 * 将数字型的字符串数组转成整型数组,并求出其中的最大值
	 * @param strArray 数字 字符串数组
	 * @return max 最大值
	 */
	public int getArrayMaxValue(String[] strArray){
		int[] array=new int[strArray.length];
		for (int i = 0; i < strArray.length; i++) {
			array[i]=Integer.parseInt(strArray[i]);
		}
		int max=0;
		for(int i=0;i<array.length;i++){
		    if(max<array[i])
		    max=array[i];
		}
		return max;
	}
	
	/**
	 * 将数组中的值去重
	 * @param strArray 数字 字符串数组
	 * @return 
	 */
	public List<String> quChong(String[] lineFrom){
		List<String> lineFroms=new ArrayList<String>();
		//去重
		for (int i = 0; i < lineFrom.length; i++) {
			if(!lineFroms.contains(lineFrom[i])){
				lineFroms.add(lineFrom[i]);
			}
		}
		//给每一元素加上节点类型
		List<String> lineFromAndType=new ArrayList<String>();
		for (int i = 0; i < lineFroms.size(); i++) {
			try {
				Map<String,Object> parMap=new HashMap<String,Object>();
				parMap.put("nodeAlais", lineFroms.get(i));
				String nodeType=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeTypeByPara", parMap));
				parMap.clear();
				String nodeAliasAndType=lineFroms.get(i)+"_"+nodeType;
				lineFromAndType.add(nodeAliasAndType);
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return lineFromAndType;
	}

	/**
	 * 将数组中的值去重
	 * @param strArray 数字 字符串数组
	 * @return 
	 */
	public String[] getNodeAliasAndType(String[] lineFrom,String workflowId){
		//给每一元素加上节点类型
		String[] nodeAliasAndType= new String[lineFrom.length];
		for (int i = 0; i < lineFrom.length; i++) {
			try {
				Map<String,Object> parMap=new HashMap<String,Object>();
				parMap.put("nodeAlais", lineFrom[i]);
				parMap.put("workflowId", workflowId);
				String nodeType=String.valueOf(this.cpcDao.qryObject( NAME_SPACE, "getNodeTypeByPara", parMap));
				parMap.clear();
				nodeAliasAndType[i]=lineFrom[i]+"_"+nodeType;
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
		return nodeAliasAndType;
	}
	
	
	/**
	 * 截取最后
	 * @param strArray 数字 字符串数组
	 * @return 
	 */
	public String[] substrLart(String[] strArray){
		for (int i = 0; i < strArray.length; i++) {
			strArray[i]=strArray[i].substring(strArray[i].lastIndexOf("_")+1);
		}
		return strArray;
	}
	
	/**
	 * 根据流程id获取数据
	 * @author dangzw
	 * @param paramMap
	 * @return List<Map<String,Object>>
	 */
	public Map<String,Object> getOneWorkflowData(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			Map<String,Object> map = this.cpcDao.qryMapInfo(NAME_SPACE, "qryWorkFlowListPage", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", map);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
	
	/**
	 * 查询父流程
	 * @author dangzw
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> queryWorkflowPublishParentList(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			Map<String,Object> map = this.cpcDao.qryMapInfo(NAME_SPACE, "queryWorkflowPublishParentList", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", map);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询父流程异常", e);
		}
		return result;
	}
	
	/**
	 * 查询子流程
	 * @author dangzw
	 * @param paramMap
	 * @return Map<String,Object>
	 */
	public Map<String,Object> queryWorkflowPublishSonList(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkflowPublishSonList", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询子流程异常", e);
		}
		return result;
	}
	
	/**
	 * 更新流程状态为草稿
	 * @author dangzw
	 * @param paramMap
	 */
	public Map<String,Object> updateStatusToDraft(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String authority=String.valueOf(paramMap.get("authority"));
			if(!authority.equals("null") && !authority.equals("")){
				//this.cpcDao.update(NAME_SPACE, "updateParentWorkflow", paramMap);
				this.cpcDao.update(NAME_SPACE, "updateSonWorkflow", paramMap);
				result.put("code", Const.SUCCESS);
				result.put("msg", "成功");
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新流程状态异常", e);
		}
		return result;
	}
	
	/**
	 * 更新流程状态为发布
	 * @author dangzw
	 * @param paramMap
	 */
	public Map<String,Object> updateStatusToPublish(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String wlanId=String.valueOf(paramMap.get("wlanId"));
//			if(wlanId.equals("888")){
//				//发布省
//				this.cpcDao.update(NAME_SPACE, "publishParent", paramMap);
//				this.cpcDao.update(NAME_SPACE, "publishSon", paramMap);
//			}else{
				//发布本地网
				this.cpcDao.update(NAME_SPACE, "publishLocalNet", paramMap);
//			}
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新流程状态异常", e);
		}
		return result;
	}
	
	/**
	 * 查询本地网
	 * @author dangzw
	 * @param paramMap
	 */
	public Map<String,Object> querySysRegion(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "querySysRegion", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新流程状态异常", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> queryWorkFlowNeedId(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkFlowNeedId", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新流程状态异常", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> addWorkflowNeed(Map<String, Object> paramMap) {

		Map<String,Object> result = new HashMap<String,Object>();
		try {
			     //获取第二步的处理时限
			 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
			 int  def_calim_limit= Integer.parseInt(String.valueOf(list.get(0).get("TIME_LIMIT")));
			 String newDate = dfs.format(new Date());
			 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit, String.valueOf(paramMap.get("latn_id")));
			 paramMap.put("endtime2",calim_limit);
	            //需求表保存
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneed1", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneed2", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneedStartLog", paramMap);
				String attrIds=(String) paramMap.get("attrId");
				String templateId=(String) paramMap.get("templateId");
				if(!"".equals(templateId)){
					String attrId[]=attrIds.split(",");
					String attrOnames=(String) paramMap.get("attrOname");
					String attrOname[]=attrOnames.split(",");
					String attrNames=(String) paramMap.get("attrName");
					String attrName[]=attrNames.split(",");
					String attrValues=(String) paramMap.get("attrValue");
					String attrValue[]=attrValues.split(",");
					for(int i=0;i<attrId.length;i++){
						 paramMap.put("attrId",attrId[i]);
						 paramMap.put("attrOname",attrOname[i]);
						 paramMap.put("attrName",attrName[i]);
						 paramMap.put("attrValue",attrValue[i]);
						 //修改 ACT_DEMAND_TEMPLATE_DATA(需求模板实例化表)
						 //this.cpcDao.update(NAME_SPACE, "updateWorkflowDemandTemplateData", paramMap);
						 //保存 ACT_DEMAND_TEMPLATE_DATA(需求模板实例化表)
						 this.cpcDao.insert(NAME_SPACE, "addWorkflowDemandTemplateData", paramMap);
					}
				}
			 	//处理提醒短信
				try {
					System.out.println("处理提醒短信");
					List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
					Map<String,Object> reqMap=new HashMap<String,Object>();
					String busiId = String.valueOf(paramMap.get("demandCode"));
					String busiNum =(String) staffList.get(0).get("MOB_TEL");
					reqMap.put("busiId", busiId);
					reqMap.put("busiNum",busiNum);//发单人电话
					reqMap.put("demandName",paramMap.get("demandName"));
					reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
					reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
					//查询短信模板
					Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
					System.out.println("处理提醒短信");
					Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
					System.out.println("发送短信成功=="+resMap.toString());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				//this.getsMSService().sendNodeMessage(reqMap);
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

	@Override
	public Map<String, Object> addWorkflowNeedd(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String countersign=(String) paramMap.get("countersign");
			if(countersign.equals("0")){
				String node=(String) paramMap.get("node2");
				String node2[]=node.split(",");
				String chulirenid=(String) paramMap.get("chulirenid2");
				String chulirenid2[]=chulirenid.split(",");
				String chulirenname=(String) paramMap.get("chulirenname2");
				String chulirenname2[]=chulirenname.split(",");
				String chulideptid=(String) paramMap.get("chulideptid2");
				
				String chulideptid2[]=chulideptid.split(",");
				String chulideptname=(String) paramMap.get("chulideptname2");
				String chulideptname2[]=chulideptname.split(",");
				
				String chulipostId=(String)paramMap.get("chulipostId2");
				String chulipostId2[]=chulipostId.split(",");
				
				
				
				String ear_chulirenid=(String) paramMap.get("ear_chulirenid2");
				String ear_chulirenid2[]=ear_chulirenid.split(",");
				String ear_chulirenname=(String) paramMap.get("ear_chulirenname2");
				String ear_chulirenname2[]=ear_chulirenname.split(",");
				String ear_chulideptid=(String) paramMap.get("ear_chulideptid2");
				String ear_chulideptid2[]=ear_chulideptid.split(",");
				String ear_chulideptname=(String) paramMap.get("ear_chulideptname2");
				String ear_chulideptname2[]=ear_chulideptname.split(",");
				
				for(int i=0;i<node2.length;i++){
					if(chulirenid2[i]==null||chulirenid2[i].equals("")||chulirenid2[i].equals("")){
						break;
					}else{
						paramMap.put("node2", node2[i]);
						paramMap.put("chulirenid2", chulirenid2[i]);
						paramMap.put("chulirenname2", chulirenname2[i]);
						paramMap.put("chulideptid2", chulideptid2[i]);
						paramMap.put("chulideptname2", chulideptname2[i]);
						paramMap.put("chulipostId2", chulipostId2[i]);
						if(ear_chulirenid2.length>1){
							paramMap.put("ear_chulirenid2", ear_chulirenid2[i]);
							paramMap.put("ear_chulirenname2", ear_chulirenname2[i]);
							paramMap.put("ear_chulideptid2", ear_chulideptid2[i]);
							paramMap.put("ear_chulideptname2", ear_chulideptname2[i]);
						}else{
							paramMap.put("ear_chulirenid2", "");
							paramMap.put("ear_chulirenname2", "");
							paramMap.put("ear_chulideptid2", "");
							paramMap.put("ear_chulideptname2", "");
						}

						
						 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						 List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
						 int  def_calim_limit= Integer.parseInt(String.valueOf(list.get(0).get("TIME_LIMIT")));
						 String newDate = dfs.format(new Date());
						 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit,String.valueOf(paramMap.get("latn_id")));
						 paramMap.put("endtime2",calim_limit);
						 this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
						 	//处理提醒短信
							try {
								System.out.println("处理提醒短信");
								List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
								Map<String,Object> reqMap=new HashMap<String,Object>();
								String busiId = String.valueOf(paramMap.get("demandCode"));
								String busiNum =(String) staffList.get(0).get("MOB_TEL");
								reqMap.put("busiId", busiId);
								reqMap.put("busiNum",busiNum);//发单人电话
								reqMap.put("demandName",paramMap.get("demandName"));
								reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
								reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
								//查询短信模板
								Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
								System.out.println("处理提醒短信");
								Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
								System.out.println("发送短信成功=="+resMap.toString());
							} catch (Exception e) {
								// TODO Auto-generated catch block
								e.printStackTrace();
							}
							//this.getsMSService().sendNodeMessage(reqMap);
					}
				}
				 this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
				     this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				 result.put("code", "0");
				 result.put("msg", "成功");
				
			}else{
				 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
				 int  def_calim_limit= Integer.parseInt(String.valueOf(list.get(0).get("TIME_LIMIT")));
				 String newDate = dfs.format(new Date());
				 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit,String.valueOf(paramMap.get("latn_id")));
				 paramMap.put("endtime2",calim_limit);
				 String  disposeRadio = (String) paramMap.get("disposeRadio");
				 if(disposeRadio.equals("toStart")){
					 this.cpcDao.insert(NAME_SPACE, "toStartWorkflowneed", paramMap);
				 }else{
					 
						this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
				 }
				 	this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
					this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
				 	//处理提醒短信
					try {
						System.out.println("处理提醒短信");
						List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
						Map<String,Object> reqMap=new HashMap<String,Object>();
						String busiId = String.valueOf(paramMap.get("demandCode"));
						String busiNum =(String) staffList.get(0).get("MOB_TEL");
						reqMap.put("busiId", busiId);
						reqMap.put("busiNum",busiNum);//发单人电话
						reqMap.put("demandName",paramMap.get("demandName"));
						reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
						reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
						//查询短信模板
						Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
						System.out.println("处理提醒短信");
						Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
						System.out.println("发送短信成功=="+resMap.toString());
					} catch (Exception e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					//this.getsMSService().sendNodeMessage(reqMap);
					//this.getsMSService().sendNodeMessage(reqMap);
					result.put("code", "0");
					result.put("msg", "成功");
			}
			//在OA中生成代办
			//this.sendMessageToOA(paramMap);
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> addWorkflowNeeddd(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			 this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
			 this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
			String taskNums=(String) paramMap.get("taskNums");
			if(taskNums.equals("0")){
				 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 
				 List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
				 int  def_calim_limit= Integer.parseInt(String.valueOf(list.get(0).get("TIME_LIMIT")));
				 String newDate = dfs.format(new Date());
				 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit,String.valueOf(paramMap.get("latn_id")));
				 paramMap.put("endtime2",calim_limit);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
			}else{
	
			}
			

			//处理提醒短信
			try {
				System.out.println("处理提醒短信");
				List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
				Map<String,Object> reqMap=new HashMap<String,Object>();
				String busiId = String.valueOf(paramMap.get("demandCode"));
				String busiNum =(String) staffList.get(0).get("MOB_TEL");
				reqMap.put("busiId", busiId);
				reqMap.put("busiNum",busiNum);//发单人电话
				reqMap.put("demandName",paramMap.get("demandName"));
				reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
				reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
				//查询短信模板
				Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
				System.out.println("处理提醒短信");
				Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
				System.out.println("发送短信成功=="+resMap.toString());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//this.getsMSService().sendNodeMessage(reqMap);
			result.put("code", "0");
			result.put("msg", "成功");
			//在OA中生成代办
			//this.sendMessageToOA(paramMap);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> addWorkflowNeedddd(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String flag=(String) paramMap.get("flag");
			if(flag.equals("0")){
				this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				this.cpcDao.update(NAME_SPACE, "updateWorkflowDemandInfo", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
				result.put("code", "0");
				result.put("msg", "成功");
			}else if(flag.equals("1")){// 并行一个节点结束流程其他节点均结束
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryEndNodeIdAndPrveNodeId", paramMap);
			    for(int i=0; i<list.size();i++){
			    	Map map = (Map) list.get(i);
			    	paramMap.put("now_node_id", map.get("PREV_NODE_ID"));
			    	this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				    this.cpcDao.insert(NAME_SPACE, "addEndNodeWorkflowNeedProcessLog", paramMap);
			    }
			    this.cpcDao.update(NAME_SPACE, "updateWorkflowDemandInfo", paramMap);
				result.put("code", "0");
				result.put("msg", "成功");
			}
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		if("0".equals(result.get("code"))){
			//审批完结，给发单人发送短信
			try {
				System.out.println("审批完结，给发单人发送短信");
				List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryShortEvalSmsInfo", paramMap);
				Map<String,Object> reqMap=new HashMap<String,Object>();
				String busiId = String.valueOf(paramMap.get("demandCode"));
				String busiNum =(String) staffList.get(0).get("MOB_TEL");
				reqMap.put("busiId", busiId);
				reqMap.put("busiNum",busiNum);//发单人电话
				reqMap.put("demandName",paramMap.get("demandName"));
				reqMap.put("sendStaffName",(String) staffList.get(0).get("STAFF_NAME"));
				reqMap.put("smsModelId", "SHORT-DEMAND-OVER");
				//查询短信模板
				Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
				System.out.println("审批完结，给发单人发送短信");
				Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
				System.out.println("发送短信成功=="+resMap.toString());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			//this.getsMSService().sendNodeMessage(reqMap);
		}
		return result;
	}

	/**
	 * 查询要标红的节点信息
	 * @author dangzw
	 * @param paramMap
	 */
	@Override
	public Map<String, Object> queryRedNode(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String flag=String.valueOf(paramMap.get("flag"));
			if(flag.equals("1")){
				//需求审批中的当前节点
				List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryCurrentRedNode", paramMap);
				result.put("list", list);
			}else{
				//需求审批中审批完结的节点
				List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryConfirmRedNode", paramMap);
				result.put("list", list);
			}
			result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询要标红的节点信息异常", e);
		}
		return result;
	}

	/**
	 * 更新节点信息
	 * @author dangzw
	 * @param paramMap
	 */
	@Override
	public Map<String,Object> updateNodeData(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			//更新节点处理人 处理部门 处理动作 处理 时限
			this.cpcDao.update(NAME_SPACE, "updateNodeData", paramMap);
			System.out.println("service端的时限：：：：：：：：：：：：：：：：：：：：：：：："+paramMap.get("timeLimit"));
			//更新流程处理时限
			String wlimitTime=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryAllNodeTimeLimit", paramMap));
			String workflowId=String.valueOf(paramMap.get("workflowId"));
			if(wlimitTime!="null" && !wlimitTime.equals("") && workflowId!="null" && !workflowId.equals("")){
				Map<String,Object> mapPara=new HashMap<String,Object>();
				int workflowLimitTime=Integer.parseInt(wlimitTime);
				mapPara.put("workflowLimitTime", workflowLimitTime);
				mapPara.put("workflowId", workflowId);
				this.cpcDao.update(NAME_SPACE, "updateWorkflowTimeLimit", mapPara);
			}
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新节点信息异常", e);
		}
		return result;
	}
	@Override
	public Map<String, Object> updatedemandinfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			
			this.cpcDao.update(NAME_SPACE, "update_demand_urge_count", paramMap);
			this.cpcDao.update(NAME_SPACE, "update_record_urge_count", paramMap);
			result.put("code", "0");
			result.put("msg", "催单成功");
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("催单次数，时间", e);
		}
		
		return result;
	}
	
	/**
	 * 更新流程状态为暂停
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> updateWFStatusToStop(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateWFStatusToStop", paramMap);
			result.put("code", Const.SUCCESS);
			result.put("msg", "暂停成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("暂停失败", e);
		}
		return result;
	}


	@Override
	public Map<String, Object> addWorkflowBack(Map<String, Object> paramMap) {

		Map<String,Object> result = new HashMap<String,Object>();
		try {
			  List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTongJiNode1", paramMap);
			  String nodeIds="";
			  for(int i=0;i<list.size();i++){
				  if(i==list.size()-1){
					  nodeIds+=list.get(i).get("NOW_NODE_ID");
				  }else{
					  nodeIds+=list.get(i).get("NOW_NODE_ID")+",";
				  }
			  }
			  paramMap.put("nodeIds", nodeIds);
			  this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
			  this.cpcDao.delete(NAME_SPACE, "delDemandTaskNode", paramMap);
			  SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
				 List<Map<String,Object>> list1= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
				 int  def_calim_limit= Integer.parseInt(String.valueOf(list1.get(0).get("TIME_LIMIT")));
				 String newDate = dfs.format(new Date());
				 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit,String.valueOf(paramMap.get("latn_id")));
				 paramMap.put("endtime2",calim_limit);
			 this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
			//处理提醒短信
			try {
					System.out.println("处理提醒短信");
					List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
					Map<String,Object> reqMap=new HashMap<String,Object>();
					String busiId = String.valueOf(paramMap.get("demandCode"));
					String busiNum =(String) staffList.get(0).get("MOB_TEL");
					reqMap.put("busiId", busiId);
					reqMap.put("busiNum",busiNum);//发单人电话
					reqMap.put("demandName",paramMap.get("demandName"));
					reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
					reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
					//查询短信模板
					Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
					System.out.println("处理提醒短信");
					Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
					System.out.println("发送短信成功=="+resMap.toString());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
				//this.getsMSService().sendNodeMessage(reqMap);
			 
			result.put("code", "0");
			result.put("msg", "成功");
			//在OA中生成代办
			//this.sendMessageToOA(paramMap);
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	
	}

	
	/**
	 * 查询子流程数据量及流程处理所需的平均工时
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> querySonWFNumAndTimeLimit(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			double num=0;
			double timeLimit=0;
			double avgTimeLimt=0;
			double stepNum=0;
			//子流程数量
			String sonWorkflwoNum=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "querySonWorkflowNum", paramMap));
			if(sonWorkflwoNum!="null" && !sonWorkflwoNum.equals("")){
				num=Double.parseDouble(sonWorkflwoNum);
			}
			//所有节点的处理时限的和
			String wlimitTime=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryAllNodeTimeLimit", paramMap));
			if(wlimitTime!="null" && !wlimitTime.equals("")){
				timeLimit=Double.parseDouble(wlimitTime);
			}
			//步骤数
			String workflowStepNum=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryStepNum", paramMap));
			if(workflowStepNum!="null" && !workflowStepNum.equals("")){
				stepNum=Double.parseDouble(workflowStepNum);
			}
			
			if(num!=0){
				BigDecimal t=new BigDecimal(timeLimit);
				BigDecimal s=new BigDecimal(stepNum);
				avgTimeLimt=t.divide(s,2, RoundingMode.HALF_UP).doubleValue();
			}
			
			result.put("num", num);
			result.put("avgTimeLimt", avgTimeLimt);
			result.put("code", Const.SUCCESS);
			result.put("msg", "查询子流程数据量及流程处理所需的平均工时");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询子流程数据量及流程处理所需的平均工时", e);
		}
		return result;
	}
	
	/**
	 * 更新流程数据
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> updateWorkflow(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateWorkflow", paramMap);
			result.put("code", Const.SUCCESS);
			result.put("msg", "暂停成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("暂停失败", e);
		}
		return result;
	}
	
	/**
	 * 更新流程状态为废弃
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> updateWorkflowToDiscard(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "updateWorkflowToDiscard", paramMap);
			result.put("code", Const.SUCCESS);
			result.put("msg", "作废成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "作废异常"+e.getMessage());
			log.error("暂停失败", e);
		}
		return result;
	}
	
	/**
	 * 查询每个节点是否设置了处理时限
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryEveryNodeTimeLimit(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			int flag=1;
			List<Map<String,Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryEveryNodeTimeLimit", paramMap);
			for (int i = 0; i < list.size(); i++) {
				String timeLimit=String.valueOf(list.get(i).get("TIME_LIMIT"));
				int limit=Integer.parseInt(timeLimit);
				if(limit==0){
					flag=0;
					break;
				}
			}
			if(flag==0){
				result.put("code", Const.FAIL_SQL);
			}else{
				result.put("code", Const.SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("暂停失败", e);
		}
		return result;
	}
	
	/**
	 * 查询流程实例状态
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryWorkflowExampleStatus(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkflowExampleStatus", paramMap);
			int flag=1;
			if(list.size()>0){
				for (int i = 0; i < list.size(); i++) {
					String demandStatus=String.valueOf(list.get(i).get("DEMAND_STATUS"));
					if(demandStatus.equals("1000")){
						flag=0;
						break;
					}
				}
				if(flag==0){
					result.put("code", Const.FAIL_SQL);
				}else{
					result.put("code", Const.SUCCESS);
				}
			}else{
				//该流程下面还没有流程实例 所以可以维护
				result.put("code", Const.SUCCESS);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询流程实例状态失败", e);
		}
		return result;
	}
	
	/**
	 * 查询节点类型
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryNodeType(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String nodeType =String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryNodeType", paramMap));
			result.put("code", Const.SUCCESS);
			result.put("nodeType", nodeType);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询节点类型失败", e);
		}
		return result;
	}
	
	/**
	 * 查询流程分类和类型
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryWorkflwoSortAndType(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String flag=String.valueOf(paramMap.get("flag"));
			List<Map<String,Object>> list=null;
			if(flag.equals("1")){
				list =this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkflwoSort", paramMap);
			}else{
				list =this.cpcDao.qryMapListInfos(NAME_SPACE, "queryWorkflwoType", paramMap);
			}
			result.put("code", Const.SUCCESS);
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询流程分类和类型失败", e);
		}
		return result;
	}
	
	/**
	 * 查询子流程权限维护
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryWisUpdate(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String wisUpdate =String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryWisUpdate", paramMap));
			result.put("code", Const.SUCCESS);
			result.put("wisUpdate", wisUpdate);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询子流程权限维护失败", e);
		}
		return result;
	}
	
	/**
	 * 查询父流程是否已发布
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryIsOrNotPublish(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String publishStatus =String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryIsOrNotPublish", paramMap));
			result.put("code", Const.SUCCESS);
			result.put("publishStatus", publishStatus);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询父流程是否已发布", e);
		}
		return result;
	}

	/**
	 * 查询需求模板属性
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryDemandTemplateAttr(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String,Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryDemandTemplateAttr", paramMap);
			result.put("code", Const.SUCCESS);
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询需求模板属性", e);
		}
		return result;
	}
	
	/**
	 * 查询需求是否处理完结
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryDemandFinsh(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String demandStatus=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryDemandFinsh", paramMap));
			result.put("demandStatus", demandStatus);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询需求是否处理完结", e);
		}
		return result;
	}
	
	/**
	 * 环节超时提醒
	 * @param
	 * @reutrn
	 */
	@Override
	public void demandOverTimeRemind(Map<String, Object> param) {
		
		int start = Integer.valueOf(String.valueOf(param.get("KEY_0")));
		int span = Integer.valueOf(String.valueOf(param.get("KEY_1")));
		
		String startDate = Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, start);
		//String endDate = Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, (start+span));
		String endDate = Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, span);
		
/*		String startDate =Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, -120);
		String endDate = Tools.addDate("yyyyMMddHHmmss", Calendar.MINUTE, 30);*/
		
		param.put("startDate", startDate);
		param.put("endDate", endDate);
		param.put("smsModelId", "DEMAND-HJCSTX");
		try {
			
			Map<String,Object> smsModel = sMSService.getSMSModel(param);
			
			List<Map<String, Object>> calimLimitSet = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryDemandPreOverTime", param);
			String busiId = "";
			MainThread mainThead = MainThread.getNewIntance();
			//2.调用多线程群发 
			List<MethodParams> demandAttrParams = MainThread.getMethodParamsSet(
					new MethodParams(busiId,false),
					new MethodParams(smsModel,false),
					new MethodParams(calimLimitSet,true)
			);
			mainThead.runMainThread(2, sMSService, "sendSmsByThread", demandAttrParams, true, "多线程：“环节超时”推送短信");
			
		} catch (Exception e) {
			log.error("环节超时提醒短信执行异常："+param, e);
		}
	}

	
	/**
	 * 查询支局名称
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> querySubofficeName(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String, Object>> subofficeNames=this.cpcDao.qryMapListInfos(NAME_SPACE, "querySubofficeName", paramMap);
			result.put("code", "0");
			result.put("list", subofficeNames);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询支局名称", e);
		}
		return result;
	}

	
	/**
	 * 物料查询
	 */
	@Override
	public Map<String, Object> qryMaterialList(Map<String, Object> param) {
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
				int end = pagenum * pagesize;
				param.put("minSize", start+1);
				param.put("maxSize", end);
				//总行数  
				String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qryMaterialListSum", param);
				//当前页内容
				List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryMaterialListPage", param);
			
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}else {
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryMaterialListPage", param);
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
	 * 更新末梢库存需求状态
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> updateDistalDemandStatus(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			this.cpcDao.update(NAME_SPACE, "querySubofficeName", paramMap);
			result.put("code", "0");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("更新末梢库存需求状态异常", e);
		}
		return result;
	}

	/**
	 * 末梢库存需求添加 
	 * @param param
	 * @return
	 */
	public Map<String,Object> addDistalRepetority(Map<String, Object> paramMap){
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String demandId=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getDemandId", paramMap));
			String releasePersonName=String.valueOf(paramMap.get("releasePersonName"));
			String subofficeName=String.valueOf(paramMap.get("subofficeName"));
			String workflowId=String.valueOf(paramMap.get("workflowId"));
			paramMap.put("demandId", demandId);
			
			String demandName=getDemandNameBatch(workflowId,releasePersonName,subofficeName);
			paramMap.put("demandName", demandName);
			//插入需求表数据
			this.cpcDao.insert(NAME_SPACE, "addDistalRepetorityDemand", paramMap);
			
			//插入需求任务表数据
			this.cpcDao.insert(NAME_SPACE, "addDistalRepetorityDemandTask", paramMap);
			
			List<Map<String,Object>> listMaterial=getMaterialList(paramMap);
			this.cpcDao.batchInsert(NAME_SPACE, "addDistalRepetorityMaterial", listMaterial);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("末梢库存需求添加 异常", e);
		}
		return result;
	}

	/**
	 *	得到物料list
	 *	@param
	 * 	@return
	 */
	public List<Map<String,Object>> getMaterialList(Map<String, Object> paramMap){
		
		List<Map<String,Object>> list=new ArrayList<Map<String,Object>>();
		String materialIds=String.valueOf(paramMap.get("materialIds"));
		String materialCounts=String.valueOf(paramMap.get("materialCounts"));
		String demandId=String.valueOf(paramMap.get("demandId"));
		String workflowId=String.valueOf(paramMap.get("workflowId"));
		String workflowName=String.valueOf(paramMap.get("workflowName"));
		String[] materialId=materialIds.split(",");
		String[] materialCount=materialCounts.split(",");
		for (int i = 0; i < materialId.length; i++) {
			Map<String,Object> map=new HashMap<String, Object>();
			map.put("demandId", demandId);
			map.put("workflowId", workflowId);
			map.put("workflowName", workflowName);
			map.put("materialId", materialId[i]);
			map.put("materialCount", materialCount[i]);
			list.add(map);
		}
		return list;
	}
	
	/**
	 * 末梢库存需求名称批次
	 * @return
	 */
	public String getDemandNameBatch(String workflowId,String releasePersonName,String subofficeName){
		//需求名称--末梢库存领用前台不需要填写需求名称，后台生成个吧，生成规则：“日期“-“批次”“发单人姓名”发起【支局名称】末梢库存领用申请。
		//如：20161219-01穆娟发起【乌鲁木齐翠泉城区支局】末梢库存领用申请
		String demandName="";
		String newDemandName="";
		Map<String,Object> paraMap = new HashMap<String,Object>();
		try {
			if(workflowId!=null && !workflowId.equals("") && !workflowId.equals("null")){
				paraMap.put("workflowId", workflowId);
				demandName = String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "getDemandName", paraMap));
			}
			String strDate=new SimpleDateFormat("yyyyMMdd").format(new Date());
			if(demandName!=null && !demandName.equals("") && !demandName.equals("null")){
				String datePrefix=demandName.substring(0, 8);
				String batch="";
				if(datePrefix.equals(strDate)){
					batch=demandName.substring(9, 11);
					int batchNum=Integer.parseInt(batch);
					batchNum+=1;
					String newBatchNum=batchNum+"";
					if(newBatchNum.length()==1){
						newBatchNum="0"+newBatchNum;
					}
					newDemandName=datePrefix+"-"+newBatchNum+releasePersonName+"发起"+"【"+subofficeName+"】"+"末梢库存领用申请";
				}else{
					newDemandName=strDate+"-"+"01"+releasePersonName+"发起"+"【"+subofficeName+"】"+"末梢库存领用申请";
				}
			}else{
				newDemandName=strDate+"-"+"01"+releasePersonName+"发起"+"【"+subofficeName+"】"+"末梢库存领用申请";
			}
		} catch (Exception e) {
			e.printStackTrace();
		}
		return newDemandName;
	}

	
	/**
	 * 查询物料通过需求id
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryMaterialListByDemandId(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			List<Map<String, Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryMaterialListByDemandId", paramMap);
			result.put("code", "0");
			result.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询物料异常", e);
		}
		return result;
	}
	/**
	 * 在OA生成待办
	 * 
	private void sendMessageToOA(Map<String,Object> reqMap){
		ISpringContext springInstance = SpringContextUtils.getInstance();
		OAClient oaClient = (OAClient) springInstance.getBean("oAClient");
		String demand_id=String.valueOf(reqMap.get("demandId"));
		String demand_theme=String.valueOf(reqMap.get("demandName"));
		String chulirenid=(String) reqMap.get("chulirenid2");
		
		if(!Tools.isNull(chulirenid)){
			String chulirenid2[]=chulirenid.split(",");
			String oaLoginCodes[]=new String[chulirenid2.length];
			for(int i=0;i<chulirenid2.length;i++){
				Map<String,Object> paramMap=new HashMap<String,Object>();
				paramMap.put("staffId", chulirenid2[i]);
				try {
					Map<String,Object> staffInfo=this.cpcDao.qryMapInfo( "search", "qry_staff_info", paramMap);
					String loginCode=String.valueOf(staffInfo.get("LOGIN_CODE"));
					oaLoginCodes[i]=loginCode;
				} catch (Exception e) {
					e.printStackTrace();
					log.error("查询员工信息异常", e);
				}
			}
			oaClient.sendFlow(demand_id, "shortProcessHandle", demand_theme, "", oaLoginCodes,"");
		}
		
		
	}*/
	/**
	 * 查询节点是否会签
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> queryNodeIsSingature(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String count=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryNodeIsSingature", paramMap));
			if(count.equals("4")){
				result.put("code", "0");
			}else{
				result.put("code", Const.FAIL_SQL);
			}
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("查询节点是否会签", e);
		}
		return result;
	}
	
	/**
	 * 会签节点设置
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> updateIssingatureSet(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String nodeId=String.valueOf(paramMap.get("nodeId"));
			//走会签节点的集合
			List<String> singatureNode=new ArrayList<String>();
			String notSingatureNode="";
			Map<String,Object> map=new HashMap<String, Object>();
			List<Map<String,Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryNextIdsByCurrentId", paramMap);
			for (int i = 0; i <list.size(); i++) {
				//查询节点出去的线的数量
				String fromNodeId=String.valueOf(list.get(i).get("NEXT_NODE_ID"));
				map.put("fromNodeId", fromNodeId);
				String outLineCount=String.valueOf(this.cpcDao.qryObject(NAME_SPACE, "queryOutLineCount", map));
				if(outLineCount.equals("1")){
					//会签的节点
					singatureNode.add(fromNodeId);
				}
				if(outLineCount.equals("4")){
					//走串行的节点
					notSingatureNode=fromNodeId;
				}
				map.clear();
			}
			String isSignature=String.valueOf(paramMap.get("isSignature"));
			if(isSignature.equals("1")){
				//走会签
				Map<String,Object> singurateMap=new HashMap<String, Object>();
				singurateMap.put("nodeId", nodeId);
				singurateMap.put("notSingatureNode", notSingatureNode);
				if(!nodeId.equals("null") && !nodeId.equals("") && !notSingatureNode.equals("null") && !notSingatureNode.equals("")){
					this.cpcDao.update(NAME_SPACE, "updateNotSingatureNodeLineName", singurateMap);
				}
			}else{
				//不走会签
				Map<String,Object> notSingurateMap=new HashMap<String, Object>();
				notSingurateMap.put("fromNodeId", nodeId);
				for(int j=0;j<singatureNode.size();j++){
					notSingurateMap.put("toNodeId", singatureNode.get(j));
					this.cpcDao.update(NAME_SPACE, "updateSingatureNodeLineName", notSingurateMap);
					notSingurateMap.remove("toNodeId");
				}
			}
			
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("会签节点设置", e);
		}
		return result;
	}
	
	/**
	 * 会签待处理列表
	 * @param
	 * @return
	 */
	@Override
	public Map<String, Object> queryNoSingatureDemandList(Map<String, Object> param) {
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
				int end =pagesize;
				param.put("minSize", start);
				param.put("maxSize", end);
				
				String flag=String.valueOf(param.get("flag"));
				String sum="";
				List<Map<String,Object>> list=null;
				if(flag.equals("0")){
					//待处理会签列表查询
					//总行数  
					sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryNoSingatureDemandListSum", param);
					//当前页内容
					list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryNoSingatureDemandList", param);
				}else{
					//已处理会签列表查询
					sum = (String) this.cpcDao.qryObject(NAME_SPACE, "queryHasSingatureDemandListSum", param);
					list = this.cpcDao.qryMapListInfos(NAME_SPACE, "queryHasSingatureDemandList", param);
				}
				resultMap.put("code", Const.SUCCESS);
				resultMap.put("msg", "成功");
				resultMap.put("list", list);
				resultMap.put("sum",  sum);
				
			}
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", Const.FAIL_SQL);
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("会签待处理列表异常！", e);
		}
		return resultMap;
		
	}

	/**
	 * 会签新建
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> addWorkflowSign(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		paramMap.put("signStatus", 1);
		try {
		String chulirenid=(String) paramMap.get("chulirenid2");
		String chulirenid2[]=chulirenid.split(",");
		String chulirenname=(String) paramMap.get("chulirenname2");
		String chulirenname2[]=chulirenname.split(",");
		String chulideptid=(String) paramMap.get("chulideptid2");
		
		String chulideptid2[]=chulideptid.split(",");
		String chulideptname=(String) paramMap.get("chulideptname2");
		String chulideptname2[]=chulideptname.split(",");
		for(int i=0;i<chulideptid2.length;i++){
			if(chulirenid2[i]==null||chulirenid2[i].equals("")||chulirenid2[i].equals("")){
				break;
			}else{
				paramMap.put("chulirenid2", chulirenid2[i]);
				paramMap.put("chulirenname2", chulirenname2[i]);
				paramMap.put("chulideptid2", chulideptid2[i]);
				paramMap.put("chulideptname2", chulideptname2[i]);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneedSign", paramMap);
			}
		}
		paramMap.put("disposeRadio", "sign");
		paramMap.put("disposeDesc", "会签");
		paramMap.put("timeLimit", "");
		paramMap.put("isEndTime", "");
		paramMap.put("urgeCount", 0);
		paramMap.put("urgeTime", "");
		 this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
		 this.cpcDao.update(NAME_SPACE, "updateWorkflowSignStatus", paramMap);
		 result.put("code", "0");
		 result.put("msg", "成功");
		
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("会签新建异常", e);
		}
		 return result;
	}

	
	/**
	 * 会签需求处理
	 * @param
	 * @reutrn
	 */
	@Override
	public Map<String, Object> singatureDeal(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			//修改会签需求任务状态
			String taskId=String.valueOf(paramMap.get("taskId"));
			paramMap.put("disposeRadio", "sign");
			paramMap.put("disposeDesc", "会签");
			paramMap.put("timeLimit", "");
			paramMap.put("isEndTime", "");
			paramMap.put("urgeCount", 0);
			paramMap.put("urgeTime", "");
			if(!taskId.equals("null") && !taskId.equals("")){
				this.cpcDao.update(NAME_SPACE, "updateSingatureDemandStatus", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addEndNodeWorkflowNeedProcessLog", paramMap);
			}
			//查询会签需求任务的单子是否已处理
			int count=0;
			List<Map<String,Object>> list=this.cpcDao.qryMapListInfos(NAME_SPACE, "queryDealSingatre", paramMap);
			for(int i=0;i<list.size();i++){
				String taskStatus=String.valueOf(list.get(i).get("TASK_STATUS"));
				if(taskStatus.equals("0")){
					count++;
				}
			}
			if(count==list.size()){
				//修改发起会签需求的 单子的 IS_SINGATURE,使得能继续发起会签需求
				this.cpcDao.update(NAME_SPACE, "updateIsSingature", paramMap);
			}
			result.put("code", 0);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("会签需求处理", e);
		}
		return result;
	}

	/**
	 * 查询文件路径
	 */
	@Override
	public Map<String, Object> qryDownloadPath(Map<String, Object> inputParam) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			List list = this.cpcDao.qryMapListInfos(NAME_SPACE,"qryDownloadPath", inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "成功");
			resultMap.put("list", list);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("获取指标信息异常！", e);
		}
		return resultMap;
	}

	/**
	 * 文件上传  author：wangshimei
	 */
	@Override
	public Map<String, Object> goverInsertAttach(Map<String, Object> inputParam) {
		System.out.print("--——______________________inputParam____________+"+inputParam);
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String namespace =(String) inputParam.get("namespace");
			String workflowId=(String)inputParam.get("workflowId");
			String demandId=(String)inputParam.get("attachment_value");
			if(namespace.equals("mysql")){
				//获取附件信息
				List<Map<String, Object>> existList = this.cpcDao.qryMapListInfos(NAME_SPACE, "getGoverAttachInfo", inputParam);
				if(!(existList.size()>0)) {
					//mysql附件信息保存
					//this.cpcDao.insert("goverManger", "goverInsertAttach", inputParam);
					//oracle附件信息保存
					this.cpcDao.insert(NAME_SPACE, "goverInsertAttach", inputParam);
					if(demandId!=null&&!demandId.equals("")){//是需求发起上传附件
					//关系表保存
					this.cpcDao.insert(NAME_SPACE, "goverInsertAttachInfo1", inputParam);
					}
					result.put("code", "0");
					result.put("msg", "成功");
				}
				
			}/*else{
				//获取附件信息
				List<Map<String, Object>> existList = this.cpcDao.qryMapListInfos("goverManger", "getGoverAttachInfo", inputParam);
				if(!(existList.size()>0)) {
					//mysql附件信息保存
					//this.cpcDao.insert("goverManger", "goverInsertAttach", inputParam);
					//oracle附件信息保存
					this.cpcDao.insert("goverManger", "oracleGoverInsertAttach", inputParam);
					//关系表保存
					this.cpcDao.insert("goverManger", "goverInsertAttachInfo", inputParam);
					result.put("code", "0");
					result.put("msg", "成功");
				}
			}*/
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}

	/**
	 * 附件信息查询
	 */
	@Override
	public Map<String, Object> getGoverAttachInfo(Map<String, Object> inputParam) {
		Map<String,Object> result = new HashMap<String,Object>();
		List<Map<String,Object>> attachInfoLst = null;
		try {
			attachInfoLst = this.cpcDao.qryMapListInfos(NAME_SPACE, "getGoverAttachInfo", inputParam);
			result.put("attachInfoLst", attachInfoLst);
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

	/**
	 * 随机生成attachmentId
	 */
	@Override
	public Map<String, Object> getAttachmentId(Map<String, Object> inputParam) {
		Map<String,Object> resultMap = new HashMap<String, Object>();
		try {
			String attachmentId = (String) this.cpcDao.qryObject(NAME_SPACE,"getAttachmentId", inputParam);
			resultMap.put("attachmentId", attachmentId);
			resultMap.put("code", "0");
			resultMap.put("msg", "随机数获取成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
			log.error("查询信息异常！", e);
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> dealFileNameInfo(Map<String, Object> inputParam) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			this.cpcDao.delete(NAME_SPACE, "dealFileNameInfo", inputParam);
			//this.cpcDao.delete("ora", "goverManger", "dealGoverFileNameInfo", inputParam);
			//删除mysql中的文件信息
			this.cpcDao.delete(NAME_SPACE, "delMysqlFileName", inputParam);
			result.put("code", "0");
			result.put("msg", "删除成功");
		}catch (Exception e) {
			e.printStackTrace();
			result.put("code", "-1");
			result.put("msg", "系统异常"+e.getMessage());
			log.error("删除异常", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> queryFlowRuleInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == paramMap.get("pagenum") || "".equals(paramMap.get("pagenum"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagenum不能为空" );
				return result;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(paramMap.get("pagenum")));
			if(null == paramMap.get("pagesize") || "".equals(paramMap.get("pagesize"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagesize不能为空" );
				return result;
	 		}
			pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getFlowRuleListSum", paramMap);
			paramMap.put("pagenum",  pagenum*pagesize);	  	
			paramMap.put("pagesize", pagesize);	  
  	        List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getFlowRuleListPage", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("流程规则列表查询异常", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> addEvalInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
		 this.cpcDao.insert(NAME_SPACE, "addWorkflowEvalInfo", paramMap);
		 this.cpcDao.update(NAME_SPACE, "update_demand_eval_info", paramMap);
		 result.put("code", "0");
		 result.put("msg", "成功");
		
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("会签新建异常", e);
		}
		 return result;
	}

	@Override
	public Map<String, Object> addAuthorInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			if("0".equals(paramMap.get("flag"))){
				 List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTypeGetWorkflowInfo", paramMap);
				 for(int i=0;i<list.size();i++){
					 paramMap.put("workflowId", list.get(i).get("WORKFLOW_ID"));
					 paramMap.put("workflowCode", list.get(i).get("WORKFLOW_CODE"));
					 this.cpcDao.insert(NAME_SPACE, "addWorkflowAuthorInfo", paramMap);
				 }
			}else{
				String workflowCodes=(String) paramMap.get("workflowCodes");
				String workflowCode[]=workflowCodes.split(",");
				String workflowIds=(String) paramMap.get("workflowIds");
				String workflowId[]=workflowIds.split(",");
				for(int i=0;i<workflowId.length;i++){
					 paramMap.put("workflowId", workflowId[i]);
					 paramMap.put("workflowCode", workflowCode[i]);
					 this.cpcDao.insert(NAME_SPACE, "addWorkflowAuthorInfo", paramMap);
				}
			}
			 result.put("code", "0");
			 result.put("msg", "成功");
			
			} catch (Exception e) {
				e.printStackTrace();
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "系统异常"+e.getMessage());
				log.error("会签新建异常", e);
			}
			 return result;
	}

	@Override
	public Map<String, Object> qrySubmitAuthorInfo(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		int pagenum = 0 ;
		int pagesize = 0 ;
		try {
			if(null == paramMap.get("pagenum") || "".equals(paramMap.get("pagenum"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagenum不能为空" );
				return result;
	 		}
			pagenum =  Integer.parseInt(String.valueOf(paramMap.get("pagenum")));
			if(null == paramMap.get("pagesize") || "".equals(paramMap.get("pagesize"))){
				result.put("code", Const.FAIL_SQL);
				result.put("msg", "pagesize不能为空" );
				return result;
	 		}
			pagesize =  Integer.parseInt(String.valueOf(paramMap.get("pagesize")));
			//总行数  
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "getWorkflowAuthorListSum", paramMap);
			paramMap.put("pagenum",  (pagenum-1)*pagesize);	  	
			paramMap.put("pagesize", pagesize);	  
  	        List<Map<String,Object>> list = this.cpcDao.qryMapListInfos(NAME_SPACE, "getWorkflowAuthorListPage", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("list", list);
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("流程规则列表查询异常", e);
		}
		return result;
	}
    /**
     * 查询短流程在途列表
     */
	@Override
	public Map<String, Object> querySolveProcessList(
			Map<String, Object> inputParam) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String, Object>> relist=new ArrayList<Map<String, Object>>();
		try {
			List<Map<String, Object>> list= cpcDao.qryMapListInfos(NAME_SPACE, "getSolveProcessList",  inputParam);
			if(list.size()>0){
				for(int i=0;i<list.size();i++){
					Map<String, Object> map=(Map<String, Object>)list.get(i);
					Map<String, Object> newMap=new HashMap<String, Object>();
					newMap.put("proId", map.get("DEMAND_ID"));	
					List<Map<String, Object>> filelist=cpcDao.qryMapListInfos(NAME_SPACE, "qryDownloadPath",  newMap);
					map.put("fileList", filelist);
					relist.add(map);
				}
			}
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", relist);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}

	@Override
	public Map<String, Object> updateWorkflowNeed(Map<String, Object> paramMap) {


		Map<String,Object> result = new HashMap<String,Object>();
		try {
			     //获取第二步的处理时限
			 SimpleDateFormat dfs = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			List<Map<String,Object>> list= this.cpcDao.qryMapListInfos(NAME_SPACE, "qryTime", paramMap);
			 int  def_calim_limit= Integer.parseInt(String.valueOf(list.get(0).get("TIME_LIMIT")));
			 String newDate = dfs.format(new Date());
			 String	calim_limit = WeekdayUtil.addDateHours("yyyy-MM-dd HH:mm:ss",newDate,def_calim_limit, String.valueOf(paramMap.get("latn_id")));
			 paramMap.put("endtime2",calim_limit);
	            //需求表保存
				this.cpcDao.update(NAME_SPACE, "updateWorkflowneed1", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneed21", paramMap);
				this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneedStartLog", paramMap);
				String attrIds=(String) paramMap.get("attrId");
				String templateId=(String) paramMap.get("templateId");
				if(!"".equals(templateId)&&attrIds.length()>0){
					String attrId[]=attrIds.split(",");
					String attrOnames=(String) paramMap.get("attrOname");
					String attrOname[]=attrOnames.split(",");
					String attrNames=(String) paramMap.get("attrName");
					String attrName[]=attrNames.split(",");
					String attrValues=(String) paramMap.get("attrValue");
					String attrValue[]=attrValues.split(",");
					for(int i=0;i<attrId.length;i++){
						 paramMap.put("attrId",attrId[i]);
						 paramMap.put("attrOname",attrOname[i]);
						 paramMap.put("attrName",attrName[i]);
						 paramMap.put("attrValue",attrValue[i]);
						 //修改 ACT_DEMAND_TEMPLATE_DATA(需求模板实例化表)
						 this.cpcDao.update(NAME_SPACE, "updateWorkflowDemandTemplateData", paramMap);
					}
				}
			 	//处理提醒短信
				try {
					System.out.println("处理提醒短信");
					List<Map<String,Object>> staffList= this.cpcDao.qryMapListInfos(NAME_SPACE, "qrySmsStaffMobTel", paramMap);
					Map<String,Object> reqMap=new HashMap<String,Object>();
					String busiId = String.valueOf(paramMap.get("demandCode"));
					String busiNum =(String) staffList.get(0).get("MOB_TEL");
					reqMap.put("busiId", busiId);
					reqMap.put("busiNum",busiNum);//发单人电话
					reqMap.put("demandName",paramMap.get("demandName"));
					reqMap.put("loginCode",(String) staffList.get(0).get("LOGIN_CODE"));
					reqMap.put("smsModelId", "SHORT-DEMAND-FIOW");
					//查询短信模板
					Map<String, Object> smsModel = this.sMSService.getSMSModel(reqMap);
					System.out.println("处理提醒短信");
					Map<String,Object> resMap=this.sMSService.sendNodeMessage(busiId, busiNum, smsModel,reqMap);
					System.out.println("发送短信成功=="+resMap.toString());
				} catch (Exception e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
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

	@Override
	public Map<String, Object> deleteFileInfos(Map<String, Object> inputParam) {
		Map<String, Object> result = new HashMap<String, Object>();
		try {
			//删除mysql中的文件信息
			this.cpcDao.delete(NAME_SPACE, "dealFileInfos", inputParam);
			result.put("code", "0");
			result.put("msg", "删除成功");
		}catch (Exception e) {
			e.printStackTrace();
			result.put("code", "-1");
			result.put("msg", "系统异常"+e.getMessage());
			log.error("删除异常", e);
		}
		return result;
	}

	@Override
	public Map<String, Object> qry_FileInfoId(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String sum = (String) this.cpcDao.qryObject(NAME_SPACE, "qry_FileInfoId", paramMap);
  	        result.put("code", Const.SUCCESS);
			result.put("msg", "成功");
			result.put("sum",  sum);
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("需求单列表查询异常", e);
		}
		return result;
	}
    /**
     * 打印完洁流程流水信息保存
     */
	@Override
	public Map<String, Object> addPrintDemandInfo(Map<String, Object> paramMap) {
		// TODO Auto-generated method stub
		Map<String,Object> result = new HashMap<String,Object>();
		try {
		    this.cpcDao.insert(NAME_SPACE, "addPrintDemandInfo", paramMap);
			result.put("code", "0");
			result.put("msg", "成功");
		}catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("打印流水保存", e);
		}
		return result;
		
	}
    /**
     * 短流程的作废处理操作
     */
	@Override
	public Map<String, Object> cancleWorkflowNoed(Map<String, Object> paramMap) {
		Map<String,Object> result = new HashMap<String,Object>();
		try {
			String flag=(String) paramMap.get("flag");
			if(flag.equals("0")){
				this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				this.cpcDao.update(NAME_SPACE, "cancleWorkflowDemandInfo", paramMap);
				this.cpcDao.insert(NAME_SPACE, "addWorkflowneedProcessLog", paramMap);
				result.put("code", "0");
				result.put("msg", "成功");
			}else if(flag.equals("1")){// 发起人申请作废
				//1、将发起人的作废操作生成一个任务（同发起人的第一个任务）ACT_DEMAND_TASK
				this.cpcDao.insert(NAME_SPACE, "insertCancleWorkflow", paramMap);
				//2、生成作废操作记录ACT_DEMAND_TASK_LOG
				this.cpcDao.insert(NAME_SPACE, "insertCancleWorkflowLog", paramMap);
				//3、将该需求的其他任务都作废
				this.cpcDao.update(NAME_SPACE, "updateWorkflowCancle", paramMap);
				//4、修改该需求的状态
				this.cpcDao.update(NAME_SPACE, "cancleWorkflowDemandInfo", paramMap);
				result.put("code", "0");
				result.put("msg", "成功");
			}else if(flag.equals("2")){
				this.cpcDao.update(NAME_SPACE, "cancleWorkflowDemandInfo", paramMap);
				List list = this.cpcDao.qryMapListInfos(NAME_SPACE, "qryEndNodeIdAndPrveNodeId", paramMap);
			    for(int i=0; i<list.size();i++){
			    	Map map = (Map) list.get(i);
			    	paramMap.put("now_node_id", map.get("PREV_NODE_ID"));
			    	this.cpcDao.update(NAME_SPACE, "updateWorkflowneed", paramMap);
				    this.cpcDao.insert(NAME_SPACE, "addEndNodeWorkflowNeedProcessLog", paramMap);
			    }
			    this.cpcDao.update(NAME_SPACE, "cancleWorkflowDemandInfo", paramMap);
				result.put("code", "0");
				result.put("msg", "成功");
			}
			
 		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("过程处理属性保存", e);
		}
		return result;
	}
    /**
     * 手机端短流程流转明细查询
     */
	@Override
	public Map<String, Object> qryLstTaskLogDetailList(Map<String, Object> inputParam) {
		// TODO Auto-generated method stub
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String, Object>> relist=new ArrayList<Map<String, Object>>();
		try {
			List<Map<String, Object>> list= cpcDao.qryMapListInfos(NAME_SPACE, "queryshortp_sum",  inputParam);
			if(list.size()>0){
				for(int i=0;i<list.size();i++){
					Map<String, Object> map=(Map<String, Object>)list.get(i);
					Map<String, Object> newMap=new HashMap<String, Object>();
					newMap.put("demandId", map.get("DEMAND_ID"));
					newMap.put("taskLogId", map.get("TASK_LOG_ID"));
					List<Map<String, Object>> filelist=cpcDao.qryMapListInfos(NAME_SPACE, "queryFileForTaskLog",  newMap);
					map.put("fileList", filelist);
					relist.add(map);
				}
			}
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", relist);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
    /**
     * 查询当前登录者本地网的信息（一个人可能对应多个本地网）
     */
	@Override
	public Map<String, Object> queryCurrentStaffLant(Map<String, Object> inputParam) {
		// TODO Auto-generated method stub
		Map<String, Object> resultMap = new HashMap<String, Object>();
		List<Map<String, Object>> relist=new ArrayList<Map<String, Object>>();
		try {
			List<Map<String, Object>> list= cpcDao.qryMapListInfos(NAME_SPACE, "queryCurrentStaffLant",  inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", list);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
    /**
     * 护照申领流程保存
     */
	@Override
	public Map<String, Object> saveDocuPaperApply(Map<String, Object> reqMap) {
		// TODO Auto-generated method stub
		Map<String,Object> result = new HashMap<String,Object>();
		try{
		//保存申请主要信息
		cpcDao.insert("paperApply", "addPaperApplyInfo", reqMap);
		String connt = (String) this.cpcDao.qryObject("paperApply", "qryCountStaffDetail", reqMap);
		if(connt.equals("0")){//需要新增
		cpcDao.insert("paperApply", "insertStaffDetail", reqMap);
		}else{
		cpcDao.update("paperApply", "updateApplyPersonInfo", reqMap);//更新基本信息
		}
		//生成本节点任务信息
		cpcDao.insert("paperApply", "addCurNodeApplyTask", reqMap);
		//生成下一节点任务信息
		cpcDao.insert("paperApply", "addNextNodeApplyTask", reqMap);
		//生成本节点操作日志
		cpcDao.insert("paperApply", "addCurNodeApplyLog", reqMap);
		String between_name=(String)reqMap.get("between_name");
		String the_name=(String)reqMap.get("the_name");
		String face_name=(String)reqMap.get("face_name");
		String job_name=(String)reqMap.get("job_name");
		String jobpost_name=(String)reqMap.get("jobpost_name");
		if(between_name!=null&&between_name!=""){
			String[] benames=between_name.split(",");
			String[] thenames=the_name.split(",");
			String[] facenames=face_name.split(",");
			String[]  jobnames=job_name.split(",");
			String[] jobpostnames=jobpost_name.split(",");
			for(int i=0;i<benames.length;i++){//如果between_name与本人关系没有填，就不保存其他成员的信息了
				Map<String, Object> paramMap = new HashMap<String, Object>();
				paramMap.put("bename", benames[i]);
				paramMap.put("thename", thenames[i]);
				paramMap.put("facename", facenames[i]);
				paramMap.put("jobname", jobnames[i]);
				paramMap.put("jobpostname", jobpostnames[i]);
				paramMap.put("documentApplyId", reqMap.get("documentApplyId"));
				if(benames[i]!=null&&!benames[i].equals("")){
				cpcDao.insert("paperApply", "addPaperApplyFamily", paramMap);
				}
			}
		}
		result.put("code", "0");
		result.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			result.put("code", Const.FAIL_SQL);
			result.put("msg", "系统异常"+e.getMessage());
			log.error("护照申领保存", e);
		}
		
		return result;
	}
    /**
     * 申领流程处理过程
     */
	@Override
	public Map<String, Object> duePaperApply(Map<String, Object> Param) {
		// TODO Auto-generated method stub
		Map<String,Object> result = new HashMap<String,Object>();
		try{
		String current_node_id=(String)Param.get("current_node_id");//当前处理节点
		//查当前节点的并行节点任务是否已完成
		List<Map<String, Object>> list1= cpcDao.qryMapListInfos("paperApply", "queryCountTask",  Param);
		String count="0";
		if(list1!=null&&list1.size()>0){
			count=(String)(((Map<String,Object>)list1.get(0)).get("cnt").toString());
		}
		//查询当前节点是否最后一个节点
		String endNode="";
		List<Map<String, Object>> list= cpcDao.qryMapListInfos("paperApply", "queryMaxNode",  Param);
		if(list!=null&&list.size()>0){
			endNode=(String)(((Map<String,Object>)list.get(0)).get("NODE_ID")).toString();
		}
		
		if(!current_node_id.equals(endNode)){//非结束节点
		String next_node=(String)Param.get("next_node");//下一节点id
		String next_node_level=(String)Param.get("next_node_level");
		String next_node_post_id=(String)Param.get("next_node_post_id");
		String next_node_name=(String)Param.get("next_node_name");
		String next_person=(String)Param.get("next_person");
		String next_person_id=(String)Param.get("next_person_id");
		String next_dept=(String)Param.get("next_dept");
		String next_dept_id=(String)Param.get("next_dept_id");
		//更新任务状态
		cpcDao.update("paperApply", "updatePaperTaskStatus", Param);
	    // 记录操作日志
		cpcDao.insert("paperApply", "addCurNodeApplyLog", Param);
		if(count.equals("0")){//本节点的所有任务都已完成
		if((next_node.split(",")).length>1){//下一节点有多个，说明是并行
			String[] nextNodes=next_node.split(",");
			String[] nextNLevel=next_node_level.split(",");
			String[] nextPostIds=next_node_post_id.split(",");
            String[] nextNodeNames=next_node_name.split(",");
			String[] nextPersons=next_person.split(",");
			String[] nextPersonIds=next_person_id.split(",");
			String[] nextDepts=next_dept.split(",");
			String[] nextDeptIds=next_dept_id.split(",");
			
			for(int i=0;i<nextNodes.length;i++){
				Map<String,Object> reparam = new HashMap<String,Object>();
				reparam.put("next_node", nextNodes[i]);
				reparam.put("next_node_name", nextNodeNames[i]);
				reparam.put("next_node_post_id", nextPostIds[i]);
				reparam.put("next_node_level", nextNLevel[i]);
				reparam.put("next_person_id", nextPersonIds[i]);
				reparam.put("next_person", nextPersons[i]);
				reparam.put("next_dept", nextDepts[i]);
				reparam.put("next_dept_id", nextDeptIds[i]);
				reparam.put("documentApplyId",Param.get("documentApplyId"));
				reparam.put("flow_id", Param.get("flow_id"));
				reparam.put("current_node", Param.get("current_node"));
				reparam.put("current_node_name", Param.get("current_node_name"));
				reparam.put("staff_Id", Param.get("staff_Id"));
				reparam.put("staff_Name", Param.get("staff_Name"));
				//生成新任务
				cpcDao.insert("paperApply", "addNextNodeApplyTask", reparam);
				}
			
		}else{
			cpcDao.insert("paperApply", "addNextNodeApplyTask", Param);
		}
		//
		}
	}else{//结束节点
			//更新任务状态
			cpcDao.update("paperApply", "updatePaperTaskStatus", Param);
			//更新流程状态
			cpcDao.update("paperApply", "updateDocApplyStatus", Param);
			//插入操作日志
			cpcDao.insert("paperApply", "addCurNodeApplyLog", Param);
	}
		result.put("code", "0");
		result.put("msg", "成功");
	} catch (Exception e) {
		e.printStackTrace();
		result.put("code", Const.FAIL_SQL);
		result.put("msg", "系统异常"+e.getMessage());
		log.error("护照申领保存", e);
	}
		return result;
	}
    /**
     * 待处理和已处理列表查询
     */
	@Override
	public Map<String, Object> queryDocApplyTask(Map<String, Object> inputParam) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			List<Map<String, Object>> list= cpcDao.qryMapListInfos("paperApply", "queryDocApplyTask",  inputParam);
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", list);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
    /**
     * 打回处理，不管是在哪一步打回，流程都完结
     */
	@Override
	public Map<String, Object> toPrevPaperApply(Map<String, Object> inputParam) {
		// TODO Auto-generated method stub
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			//1、更新任务状态
			cpcDao.update("paperApply", "updatePaperTaskStatus", inputParam);
			//2、更新其他任务状态
			cpcDao.update("paperApply", "updatePaperOtherTask", inputParam);
			//3、更新流程状态
			cpcDao.update("paperApply", "updateDocApplyStatus", inputParam);
			//4、插入操作日志
			cpcDao.insert("paperApply", "addCurNodeApplyLog", inputParam);
			resultMap.put("code", "0");
			resultMap.put("msg", "成功");
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
    /**
     * 查询申请明细
     */
	@Override
	public Map<String, Object> queryApplyDetail(Map<String, Object> inputParam) {
		Map<String, Object> resultMap = new HashMap<String, Object>();
		try {
			//详细信息
			List<Map<String, Object>> list= cpcDao.qryMapListInfos("paperApply", "queryDocApplyInfo",  inputParam);
			//查询家庭成员
			List<Map<String, Object>> listfamily= cpcDao.qryMapListInfos("paperApply", "queryDocApplyFamily",  inputParam);
			//流程流转信息
			List<Map<String, Object>> listDetail= cpcDao.qryMapListInfos("paperApply", "queryDocApplyTaskLog",  inputParam);
			
			resultMap.put("code", Const.SUCCESS);
			resultMap.put("msg", "查询成功");
			resultMap.put("data", list);
			resultMap.put("data1", listfamily);
			resultMap.put("data2", listDetail);
		} catch (Exception e) {
			e.printStackTrace();
			resultMap.put("code", "-1");
			resultMap.put("msg", "系统异常"+e.getMessage());
		}
		return resultMap;
	}
	
	
	
}
