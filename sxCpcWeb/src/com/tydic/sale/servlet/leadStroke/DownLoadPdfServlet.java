package com.tydic.sale.servlet.leadStroke;

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

import com.tydic.sale.servlet.leadStroke.LeadCreatePDFShow;
import com.itextpdf.text.Document;
import com.itextpdf.text.Rectangle;
import com.itextpdf.text.RectangleReadOnly;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.utils.DownLoadFile;
import com.tydic.sale.utils.ParamEnum;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/leadStroke/downLoadPdf.do")
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
		Document document = new Document(new RectangleReadOnly(842F,595F));
		//Document  document=new Document();
		String startDate=request.getParameter("startDate");
		String endDate=request.getParameter("endDate");
		String uploadHeadLine=request.getParameter("uploadHeadLine");
		String stroketCount1=request.getParameter("stroketCount1");
		String stroketCount=request.getParameter("stroketCount");
		String endDate6=request.getParameter("endDate6");
		String endDate7=request.getParameter("endDate7");
		Map<Object, Object> reqMapp = new HashMap<Object, Object>();
		reqMapp.put("sqlName", "qryLeadStorkeheadlineInfo");
		reqMapp.put("nameSpace", "leadStroke");
		reqMapp.put("dataSource", "");
		reqMapp.put("startDate", URLDecoder.decode(startDate,"UTF-8"));
		reqMapp.put("endDate", URLDecoder.decode(endDate,"UTF-8"));
		reqMapp.put("stroketCount1", URLDecoder.decode(stroketCount1,"UTF-8"));
		reqMapp.put("stroketCount", URLDecoder.decode(stroketCount,"UTF-8"));
		reqMapp.put("endDate6", URLDecoder.decode(endDate6,"UTF-8"));
		reqMapp.put("endDate7", URLDecoder.decode(endDate7,"UTF-8"));
		reqMapp.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map<Object,Object> resultMapList = crmService.commonMothed(reqMapp);
		List list0 = (List)resultMapList.get("data");
		String colwidth="90f,50f,";
		List list1 =new ArrayList();
		for(int i=0;i<list0.size();i++){
			Map map=(Map)list0.get(i);
			colwidth+="200f,";
			String ascriptionLaedName=(String)map.get("ASCRIPTIONLAEDNAME");
			String ascriptionLaedPosition=(String)map.get("ASCRIPTIONLAEDPOSITION");
			map.put("ASCRIPTIONLAEDNAME",ascriptionLaedName);
			map.put("ASCRIPTIONLAEDPOSITION",ascriptionLaedPosition);
			list1.add(map);
		}
		colwidth = colwidth.substring(0,colwidth.length()-1);
		//查询
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
//		reqMap.put("workflowId", workflowId);
//		reqMap.put("demandId", demand_id);
		reqMap.put("sqlName", "qryLeadStorkeListInfo");
		reqMap.put("nameSpace", "leadStroke");
		reqMap.put("dataSource", "");
		reqMap.put("startDate", URLDecoder.decode(startDate,"UTF-8"));
		reqMap.put("endDate", URLDecoder.decode(endDate,"UTF-8"));
		reqMap.put("stroketCount1", URLDecoder.decode(stroketCount1,"UTF-8"));
		reqMap.put("stroketCount", URLDecoder.decode(stroketCount,"UTF-8"));
		reqMap.put("endDate6", URLDecoder.decode(endDate6,"UTF-8"));
		reqMap.put("endDate7", URLDecoder.decode(endDate7,"UTF-8"));
		reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map resultMap = crmService.commonMothed(reqMap);
		
		List list2 = (List)resultMap.get("data");
			List list3 =new ArrayList();
			for(int i=0;i<list2.size();i++){
				Map map=(Map)list2.get(i);
				String strokeTime=(String)map.get("STROKETIME");
				String periodTime=(String)map.get("PERIODTIME");
				String strokeInfo=(String)map.get("STROKEINFO");
				String remarkInfo=(String)map.get("REMARKINFO");
				map.put("strokeTime",strokeTime);
				map.put("periodTime",periodTime);
				map.put("strokeInfo",strokeInfo);
				map.put("remarkInfo",remarkInfo);
				list3.add(map);
			}
			Map<String, Object> titleMap = new HashMap<String, Object>();
			LeadCreatePDFShow cp = new LeadCreatePDFShow(list3, titleMap, makeColWidth(colwidth),list1);
			  cp.setPdfTitle(URLDecoder.decode(uploadHeadLine,"UTF-8"));// PDF中显示标题
			 try {
				cp.createDownLoadPdf(document, response.getOutputStream());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// 关闭文档并释放资源
			 response.setHeader("content-disposition", "attachment;filename="
					+ new String((URLDecoder.decode(uploadHeadLine,"UTF-8")+ ".pdf").getBytes(), "ISO-8859-1"));
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
