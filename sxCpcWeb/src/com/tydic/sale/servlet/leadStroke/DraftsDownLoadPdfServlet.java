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

import com.itextpdf.text.Document;
import com.itextpdf.text.RectangleReadOnly;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.Constant;
import com.tydic.sale.servlet.leadStroke.LeadCreatePDF;
import com.tydic.sale.utils.DownLoadFile;
import com.tydic.sale.utils.ParamEnum;
import com.tydic.sale.utils.SaleUtil;
@WebServlet("/leadStroke/draftsDownLoadPdf.do")
public class DraftsDownLoadPdfServlet extends AbstractServlet{
	private static final long serialVersionUID = 1L;
	
	public DraftsDownLoadPdfServlet() {
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
		String headlineInfo=request.getParameter("headlineInfo");
		Map<Object, Object> reqMap = new HashMap<Object, Object>();
		reqMap.put("sqlName", "queryLeadStorkeInfo");
		reqMap.put("nameSpace", "leadStroke");
		reqMap.put("dataSource", "");
		reqMap.put("startDate", URLDecoder.decode(startDate,"UTF-8"));
		reqMap.put("endDate", URLDecoder.decode(endDate,"UTF-8"));
		reqMap.put("staff_id", systemUser.getStaffId());
		reqMap.put(Constant.SERVER_NAME, "qryLstCommonMethod");
		Map resultMap = crmService.commonMothed(reqMap);
		//下面开始生成pdf文档
			String head="日期,时段,具体内容,备注";//表格列名
			String colwidth="90f,50f,200f,100f";
			String col ="STROKETIME,PERIODTIME,STROKEINFO,REMARKINFO";//从list中取列名
			List list = (List)resultMap.get("data");
			List list1 =new ArrayList();
			for(int i=0;i<list.size();i++){
				Map map=(Map)list.get(i);
				String stroketime=(String)map.get("STROKETIME");
				String periodtime=(String)map.get("PERIODTIME");
				String strokeinfo=(String)map.get("STROKEINFO");
				String remarkinfo=(String)map.get("REMARKINFO");
				map.put("STROKETIME",stroketime);
				map.put("PERIODTIME", periodtime);
				map.put("STROKEINFO", strokeinfo);
				map.put("REMARKINFO", remarkinfo);
				list1.add(map);
			}
			Map<String, Object> titleMap = new HashMap<String, Object>();
			System.out.println("======================================================================"+head.length());
			  titleMap.put("title1", makeStr(head));
			  LeadCreatePDF cp = new LeadCreatePDF(list1, titleMap, makeColWidth(colwidth));
			  cp.setPdfTitle(URLDecoder.decode(headlineInfo+"—初稿","UTF-8"));// PDF中显示标题
 			  cp.setColMaping(makeStr(col));// 取字段
			 try {
				cp.createDownLoadPdf(document, response.getOutputStream());
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			// 关闭文档并释放资源
			 response.setHeader("content-disposition", "attachment;filename="
					+ new String((URLDecoder.decode(headlineInfo+"—初稿","UTF-8")+ ".pdf").getBytes(), "ISO-8859-1"));
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
