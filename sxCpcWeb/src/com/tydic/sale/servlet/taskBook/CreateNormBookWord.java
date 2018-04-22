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
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

import freemarker.template.Configuration;
import freemarker.template.Template;
import freemarker.template.TemplateException;
@WebServlet("/taskBook/createNormBookWord.do")    
public class CreateNormBookWord extends AbstractServlet{    
        
	private static final long serialVersionUID = 1L;
	
	private final static Logger logger = LoggerFactory.getLogger(QueryTaskBookList.class);
	private Configuration configuration = null;    
        
    public CreateNormBookWord(){    
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
		request.setCharacterEncoding("utf-8"); // 设置编码
		response.setCharacterEncoding("utf-8");
		response.setContentType("text/html;charset=UTF-8");
		String taskCode = String.valueOf(request.getParameter("taskCode"));
		String modelId = String.valueOf(request.getParameter("modelId"));
		String taskType = String.valueOf(request.getParameter("taskType"));
		String modelType = String.valueOf(request.getParameter("modelType"));
		String promoters_id = String.valueOf(request.getParameter("promoters_id"));
		//String s = request.getParameter("dataMap");
		configuration = new Configuration();    
        configuration.setDefaultEncoding("UTF-8");  
        //Map<String,Object> dataMap=this.toMap(s);
        Map<String,Object> dataMap=new HashMap<String,Object>();    
		getData(dataMap,modelType, promoters_id, modelId); 
		configuration.setClassForTemplateLoading(this.getClass(), "ftlFile");  //FTL文件所存在的位置
		Template t=null;    
		try {
		    t = configuration.getTemplate(taskType+".ftl"); //文件名
		    t.setEncoding("UTF-8");
		} catch (IOException e) {    
		    e.printStackTrace();    
		}    
		String path = request.getSession().getServletContext().getRealPath("");  //E:\workspace\soft\sx\apache-tomcat-7.0.63\webapps\CpcWeb
		//获取当前路径
		File outFile = null;
		String file_name = "";
		if(!Tools.isNull(taskCode)){
			outFile = new File(path+"\\"+taskType+"_"+taskCode+".doc"); //导出文件
			file_name = ""+taskType+"_"+taskCode+".doc";
		}
		if(!Tools.isNull(modelId)){
			outFile = new File(path+"\\"+taskType+"_"+modelId+".doc"); //导出文件
			file_name = ""+taskType+"_"+modelId+".doc";
		}
		Writer out = null;    
		try {    
		    out = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(outFile),"UTF-8"));
		} catch (FileNotFoundException e1) {    
		    e1.printStackTrace();    
		}    
		try {    
		    t.process(dataMap, out);    
		} catch (TemplateException e) {    
		    e.printStackTrace();    
		} catch (IOException e) {    
		    e.printStackTrace();    
		  
		} finally{
			out.flush();
			out.close(); 
			outFile.exists();
		}
		resultMap.put("code", "0");
		resultMap.put("file_name", file_name);
		resultMap.put("file_path", path+"\\");
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
    private static Map<String,Object> toMap(String s){
		if(s==null || s.length() < 1){return null; }
		Map<String,Object> map=new HashMap<String,Object>();
		JSONObject json=JSONObject.fromObject(s);
		Iterator keys=json.keys();
		while(keys.hasNext()){
			String key=(String) keys.next();
			String value=json.get(key).toString();
			if(value.startsWith("{")&&value.endsWith("}")){
				map.put(key, toMap(value));
			}else{
				map.put(key, value);
			}
		}
		return map;
	}
  //这里赋值的时候需要注意,xml中需要的数据你必须提供给它,不然会报找不到某元素错的.  
  	private void getData(Map<String, Object> dataMap, String modelType, String promoters_id, String modelId) {
      	Map<Object, Object> resultMap = new HashMap<Object, Object>();
      	Map<Object, Object> reqMap = new HashMap<Object, Object>();
      	List<Map<String,Object>> normBookInfo = new ArrayList<Map<String,Object>>();
      	reqMap.put("model_type", modelType);
      	reqMap.put("staff_code", promoters_id);
      	reqMap.put("model_id", modelId);
      	reqMap.put("SERVER_NAME", "searchTaskBookInfo");
      	resultMap = crmService.dealObjectFun(reqMap);
      	if ("0".equals(resultMap.get("code"))) {
      		normBookInfo = (List<Map<String, Object>>) resultMap.get("normBookInfo");
      		if(normBookInfo.size() > 0){
      			for(int i=0; i<normBookInfo.size(); i++){
          			dataMap.put((String) normBookInfo.get(i).get("model_column"), normBookInfo.get(i).get("model_context"));
      			}
      		}
  		}
      }  
}    