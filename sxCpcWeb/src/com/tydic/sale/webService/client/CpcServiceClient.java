package com.tydic.sale.webService.client;

import java.net.MalformedURLException;
import java.net.URL;
import java.rmi.RemoteException;
import java.util.HashMap;
import java.util.Map;
import java.util.Observable;
import java.util.Observer;

import javax.xml.namespace.QName;
import javax.xml.rpc.ServiceException;

import net.sf.json.JSONObject;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;
import org.apache.log4j.Logger;
import org.apache.zk.ZKUtil;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.utils.StringUtil;
import com.tydic.sale.utils.Tools;

public class CpcServiceClient implements Observer{
	 

	private Map confMap = new HashMap();
	
	private Logger log = Logger.getLogger(this.getClass());
	
	Service service = null;
	Call call = null;
	
	public CpcServiceClient(){
		confMap.putAll(ZKUtil.addObserver("/config", this));
		this.cpcServiceURL = String.valueOf(confMap.get("com.tydic.cpcService.client"));
		this.init();
	}
	
	private String cpcServiceURL;
	

	public String getCpcServiceURL() {
		return cpcServiceURL;
	}
 
	
	private void init(){
		if(Tools.isNull(service)){
			service = new  Service();
		}
		try {
			if(Tools.isNull(call)){
				call = (Call) service.createCall();  
			}
			call.setTargetEndpointAddress( new  URL(cpcServiceURL));
			
		} catch (MalformedURLException e) {
			log.error("创建CpcService客户端：地址异常 url:"+cpcServiceURL, e);
		} catch (ServiceException e) {
			log.error("创建CpcService客户端异常", e);
		}  
	}

	/**
	 * 调用服务
	 * @param param
	 * @param serviceName
	 * @return
	 */
	public Map<Object,Object> callCpcService(Map<Object,Object> param,String serviceName){
		
		Map<Object,Object> resultMap = null;
		
		try {
			call.setOperationName( new  QName(cpcServiceURL,  serviceName));    
			String paramStr = JSON.toJSON(param).toString();
			paramStr=StringUtil.replaceTab(paramStr);
			log.debug(serviceName+"接口：请求报文"+paramStr);
			String result = (String) call.invoke(new Object[]{paramStr });
			log.debug(serviceName+"接口：返回报文"+result);
			result=result.replaceAll("\"\"\"\"", "\"\'\'\"");
			result=StringUtil.replaceTab2(result);
			resultMap = JSONObject.fromObject(result);
			
			
		} catch (RemoteException e) {
			log.error("创建CpcService客户端：地址异常 url:"+cpcServiceURL, e);
			resultMap = new HashMap<Object,Object>();
			resultMap.put("code", "-999");
			resultMap.put("msg", "调用接口服务端异常,网路或超时！");
		} 
		
		return resultMap;
	}
	
	

	@Override
	public void update(Observable o, Object arg) {
		// TODO Auto-generated method stub
		
	}

}
