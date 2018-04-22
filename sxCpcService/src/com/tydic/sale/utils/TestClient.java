package com.tydic.sale.utils;

import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import javax.xml.namespace.QName;

import org.apache.axis.client.Call;
import org.apache.axis.client.Service;

import com.alibaba.fastjson.JSON;

public class TestClient {
	   String targetEendPoint =  "http://localhost:8080/CpcService/services/EvaluationService" ; 

	
		private void  testService() throws Exception{
				Service service =  new  Service();    Call call = (Call) service.createCall();    
				call.setTargetEndpointAddress( new  URL(targetEendPoint));  
				Map  param = new HashMap();
				param.put("end_create_time", "2015-02-04");
				param.put("idx_val", 0);
				param.put("start_create_time", "2015-02-04");
				param.put("seq_desc", "test");
				call.setOperationName( new  QName(targetEendPoint,  "getRecordSumList" ));     
//				call.setOperationName( new  QName(targetEendPoint,  "saveDemandInfo" ));
//				String jsonStr = "{\"demandInfo\":{\"demand_details\":\"43443\",\"demand_theme\":\"343\",\"department\":\"测试部门\",\"department_id\":\"111\",\"promoters\":\"测试人\",\"promoters_id\":\"222\",\"tel\":\"3434\"},\"demandType\":\"1\"}";
				String jsonStr = "{\"list\":[{\"node_id\":\"100100\"}],\"promoters_id\":\"1\"}";
				String result = (String) call.invoke( new  Object[]{ jsonStr });  
//				String result = (String) call.invoke( new  Object[]{ JSON.toJSON(param).toString() });    
				System.out.println(result);      
     	}
		
		public static void main(String[] args) throws Exception {
			TestClient test = new TestClient();
			test.testService();
		}

}
