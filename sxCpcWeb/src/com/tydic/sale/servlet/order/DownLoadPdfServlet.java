package com.tydic.sale.servlet.order;

import java.io.IOException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.itextpdf.text.Document;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.CreatePDF;
import com.tydic.sale.utils.DownLoadFile;
import com.tydic.sale.utils.ParamEnum;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/order/downLoadPdf.do")
public class DownLoadPdfServlet extends AbstractServlet{
	private static final long serialVersionUID = 1L;
	
	public DownLoadPdfServlet() {
		super();
		// TODO Auto-generated constructor stub
	}
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);	
		Document document = new Document();
		String workflowId=request.getParameter("workflowId");
		String workflowName=request.getParameter("workflowName");
		String demandName=request.getParameter("demandName");
		String demandDesc=request.getParameter("demandDesc");
		String firstType=request.getParameter("firstType");
		String secondType=request.getParameter("secondType");
		String demand_id=request.getParameter("demand_id");
		String department=request.getParameter("department");
		String demand_Code=request.getParameter("demand_Code");
		String mob_tel=request.getParameter("mob_tel");
		String staff_name=request.getParameter("demand_sumit_pname");//发起人name
		String staff_id=request.getParameter("demand_sumit_pid");//发起人id
		Map<Object, Object> firstMap = new HashMap<Object, Object>();
		firstMap.put("workflowName", URLDecoder.decode(workflowName,"UTF-8"));
		firstMap.put("demandName", URLDecoder.decode(demandName,"UTF-8"));
		firstMap.put("demandDesc", URLDecoder.decode(demandDesc,"UTF-8"));
		firstMap.put("firstType", URLDecoder.decode(firstType,"UTF-8"));
		firstMap.put("secondType", URLDecoder.decode(secondType,"UTF-8"));
		firstMap.put("department", URLDecoder.decode(department,"UTF-8"));
		firstMap.put("mob_tel", mob_tel);
		firstMap.put("staff_name", URLDecoder.decode(staff_name,"UTF-8"));
		//上面要区分一下是区县局还是市级，如果是市级可以直接用，如果是区县局，需要查上级部门
		Map<Object, Object> reqMapp = new HashMap<Object, Object>();
		reqMapp.put("staffId", staff_id);
		reqMapp.put("sqlName", "queryStarPerDeptment");
		reqMapp.put("nameSpace", "shortProcess");
		reqMapp.put("dataSource", "");
		reqMapp.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map<Object,Object> resultMapDept = crmService.commonMothed(reqMapp);
		List<Map<Object,Object>> listDept=(List<Map<Object,Object>>)resultMapDept.get("data");
		if(listDept!=null&&listDept.size()>0){
			Map<Object,Object> mm=(Map<Object,Object>)listDept.get(0);
			if(((String)mm.get("dept_level")).equals("2")){//区县局
				firstMap.put("department", (String)mm.get("area_name"));
			}
		}
		//生成流水信息，并将打印的流水信息记录到数据库中，流水号就用打印时间戳+demandId生成
		SimpleDateFormat df = new SimpleDateFormat("yyyyMMddHHmmssSSS");//设置日期格式
		String date = df.format(new Date());// new Date()为获取当前系统时间，也可使用当前时间戳
		String waterSeq=demand_id+date;
		//将打印流水信息插入数据库
		Map<Object, Object> reqMapw = new HashMap<Object, Object>();
		reqMapw.put("waterSeq", waterSeq);
		reqMapw.put("staffId", systemUser.getStaffId());
		reqMapw.put("demandId", demand_id);
		reqMapw.put("SERVER_NAME", "addPrintDemandInfo");
		Map<Object,Object> serMap=crmService.dealObjectFun(reqMapw);
		firstMap.put("waterSeq", waterSeq);
		//查询流程审批信息
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("workflowId", workflowId);
		reqMap.put("demandId", demand_id);
		reqMap.put("sqlName", "queryshortp_sum");
		reqMap.put("nameSpace", "shortProcess");
		reqMap.put("dataSource", "");
		reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map resultMap = crmService.commonMothed(reqMap);
		//下面开始生成pdf文档
			String head="序号,处理节点,处理部门,处理人,处理时间,审批操作,审批意见,是否超时,处理状态";//表格列名
			String colwidth="80f,80f,80f,80f,80f,80f,80f,80f,80f";
			String col ="NUM,NODE_NAME,OPERATOR_DEPTS,OPERATOR_NAME,APPCREATE_TIME,OPERATION,OPERATION_INFO,TLOVER_TIME,TASK_STATUS";//从list中取列名
			List list = (List)resultMap.get("data");
			List list1 =new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map=(Map)list.get(i);
				//这里将内容取出进行判断
				String TASK_STATUS="未处理";
				if((Integer)map.get("TASK_STATUS")==0){
					TASK_STATUS="已处理";
				}
				map.put("TASK_STATUS", TASK_STATUS);
				String operate_name=(String)map.get("OPERATOR_NAME");
				String operDept=(String)map.get("OPERATOR_DEPTS");
				String earoperate_name=(String)map.get("ERA_OPERATOR_NAME");
				String earoperate_dept=(String)map.get("ERA_OPERATOR_DEPT");
			
				if(!earoperate_name.equals("")&&!earoperate_dept.equals("")&&!((String)map.get("ERA_OPERATOR_ID")).equals((String)map.get("OPERATOR_ID"))){
					operate_name=(String)map.get("OPERATOR_NAME")+"代["+(String)map.get("ERA_OPERATOR_NAME")+"]";
					operDept=(String)map.get("ERA_OPERATOR_DEPT");
				}
				map.put("OPERATOR_DEPTS", operDept);
				map.put("OPERATOR_NAME", operate_name);
				String operation="";
				String operation_Info="";
				if(((String)map.get("NOTE_NAME")).equals("开始")){
					operation="发起";
					operation_Info="通过";
					map.put("TLOVER_TIME", "未超时");
				}else{
					if(((String)map.get("OPERATION")).equals("同意")){
		 				operation="通过";
		 			}
		 			else if(((String)map.get("OPERATION")).equals("打回根节点")) {
		 				operation="打回发起节点";
		 			}else if(((String)map.get("OPERATION")).equals("打回上一步")) {
		 				operation="打回上一节点";
		 			}else if(((String)map.get("OPERATION")).equals("作废")) {
		 				operation="作废";
		 			}else {
		 				operation="";
		 			}
					operation_Info=(String)map.get("OPERATION_INFO");
				}
				map.put("OPERATION", operation);
				map.put("OPERATION_INFO", operation_Info);
				map.put("NUM", i+1);
				list1.add(map);
			}
			Map<String, Object> titleMap = new HashMap<String, Object>();
			System.out.println("======================================================================"+head.length());
			  titleMap.put("title1", makeStr(head));
			  CreatePDF cp = new CreatePDF(list1, titleMap, makeColWidth(colwidth),firstMap);
			  cp.setPdfTitle("短流程处理记录");// PDF中显示标题
			  cp.setWaterCont(systemUser.getStaffName()+"  "+systemUser.getLoginCode());
 			  cp.setColMaping(makeStr(col));// 取字段
			 try {
				cp.createDownLoadPdf(document, response.getOutputStream());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// 关闭文档并释放资源
			 response.setHeader("content-disposition", "attachment;filename="
					+ new String((URLDecoder.decode(demandName,"UTF-8")+ ".pdf").getBytes(), "ISO-8859-1"));
			 response.flushBuffer();
			 document.close();
		
	}
	public String[] makeStr(String param){
		String[] str = param.split(",");
		return str;
	}
	
	public float[] makeColWidth(String str) {
		String[] col = str.split(",");
		float[] width = new float[col.length];
		for (int i = 0; i < col.length; i++) {
			width[i]= Float.parseFloat(col[i]);
		}
		return width;
	}
	public Map makeMap(String str) {
		String[] col = str.split(",");
		Map map= new HashMap();
		for (int i = 0; i < col.length; i++) {
			map.put(col[i], col[i]);
		}
		return map;
	}

}
