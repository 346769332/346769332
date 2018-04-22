package com.tydic.sale.servlet.taskBook;
/**
 * 生成html
 */
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.OutputStreamWriter;
import java.io.Writer;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
@WebServlet("/taskBook/editNormBookInfo.do")    
public class SaveEditNormBookInfo extends AbstractServlet{    
        
	private static final long serialVersionUID = 1L;
	
	private final static Logger logger = LoggerFactory.getLogger(QueryTaskBookList.class);
	private Configuration configuration = null;    
        
    public SaveEditNormBookInfo(){    
    	super();
    }    
        
    protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}
    
    @SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
    	Map<Object, Object> resultMap = new HashMap<Object, Object>();
    	Map<Object,Object> resMap = new HashMap<Object,Object>();
		String handleType = request.getParameter("handleType");
		if("saveNormBookInfo".equals(handleType)){
			resMap.put("colIds", request.getParameter("colIds"));
			resMap.put("colValues", request.getParameter("colValues"));
			resMap.put("modelType", request.getParameter("modelType"));
			resMap.put("promoters_id", request.getParameter("promoters_id"));
			resMap.put("SERVER_NAME", "insertTaskBookInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(resMap);
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
			}
		}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
}    