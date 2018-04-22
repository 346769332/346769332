package com.tydic.sale.utils;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;  
import java.util.Iterator;  
import java.util.List;  
import java.util.Map;  
import java.util.Map.Entry;  

import java.net.HttpURLConnection;
import org.apache.http.message.BasicNameValuePair;  
import org.apache.http.HttpEntity;  
import org.apache.http.HttpResponse;  
import org.apache.http.NameValuePair;  
import org.apache.http.client.HttpClient;  
import org.apache.http.client.entity.UrlEncodedFormEntity;  
import org.apache.http.client.methods.HttpPost;  
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicHeader;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;  
/* 
 * 利用HttpClient进行post请求的工具类 
 */  
public class HttpClientUtil {
    public String doPost(String url,Map<String,String> map,String charset){  
        HttpClient httpClient = null;  
        HttpPost httpPost = null;  
        String result = null;  
        try{  
            httpClient = new SSLClient();  
            httpPost = new HttpPost(url);  
            //设置参数  
            List<NameValuePair> list = new ArrayList<NameValuePair>();  
            Iterator<Entry<String, String>> iterator = map.entrySet().iterator();  
            while(iterator.hasNext()){  
                Entry<String,String> elem = (Entry<String, String>) iterator.next();  
                list.add(new BasicNameValuePair(elem.getKey(),elem.getValue()));  
            }  
            if(list.size() > 0){  
                UrlEncodedFormEntity entity = new UrlEncodedFormEntity(list,charset);  
                httpPost.setEntity(entity);  
            }  
            HttpResponse response = httpClient.execute(httpPost);  
            if(response != null){  
                HttpEntity resEntity = response.getEntity();  
                if(resEntity != null){  
                    result = EntityUtils.toString(resEntity,charset);  
                }  
            }  
        }catch(Exception ex){  
            ex.printStackTrace();  
        }  
        return result;  
    }  
    public String doGet(String url, String param){  
    	 String result = "";
         BufferedReader in = null;
         try {
             String urlNameString = url + "?" + param;
             URL realUrl = new URL(urlNameString);
             System.out.println("-----doGet----------realUrl---------=="+realUrl);
             // 打开和URL之间的连接
             HttpURLConnection  connection = (HttpURLConnection)realUrl.openConnection();
              // 设置通用的请求属性             
             connection.setDoInput(true);
             connection.setDoOutput(true);
             connection.setConnectTimeout(10000);
             connection.setUseCaches(false);
             connection.setRequestMethod("GET");
             connection.setRequestProperty("contentType", "application/json");
             connection.setRequestProperty("Accept-Charset", "UTF-8");
             connection.setRequestProperty("contentType", "UTF-8");
             connection.connect();
             
             InputStreamReader reader = new InputStreamReader(connection.getInputStream());
             BufferedReader bReader = new BufferedReader(reader);
             result = bReader.readLine();
             System.out.println("------doGet---------result---------=="+result);
         } catch (Exception e) {
             System.out.println("发送GET请求出现异常！" + e);
             e.printStackTrace();
         }
         // 使用finally块来关闭输入流
         finally {
             try {
                 if (in != null) {
                     in.close();
                 }
             } catch (Exception e2) {
                 e2.printStackTrace();
             }
         }
         return result;  
    } 
    public String doPostStr(String url, String param){  
   	 String result = "";
        BufferedReader in = null;
        try {
            String urlNameString = url + "?" + param;
            URL realUrl = new URL(urlNameString);
            System.out.println("-------doPostStr--------realUrl---------=="+realUrl);
            // 打开和URL之间的连接
            HttpURLConnection  connection = (HttpURLConnection)realUrl.openConnection();
             // 设置通用的请求属性             
            connection.setDoInput(true);
            connection.setDoOutput(true);
            connection.setConnectTimeout(10000);
            connection.setUseCaches(false);
            connection.setRequestMethod("POST");
            connection.setRequestProperty("contentType", "application/json");
            connection.setRequestProperty("Accept-Charset", "UTF-8");
            connection.setRequestProperty("contentType", "UTF-8");
            connection.connect();
            
            InputStreamReader reader = new InputStreamReader(connection.getInputStream());
            BufferedReader bReader = new BufferedReader(reader);
            result = bReader.readLine();
            System.out.println("------doPostStr---------result---------=="+result);
        } catch (Exception e) {
            System.out.println("发送post请求出现异常！" + e);
            e.printStackTrace();
        }
        // 使用finally块来关闭输入流
        finally {
            try {
                if (in != null) {
                    in.close();
                }
            } catch (Exception e2) {
                e2.printStackTrace();
            }
        }
        return result;       
   }
    private static final String APPLICATION_JSON = "application/json";
    private static final String CONTENT_TYPE_TEXT_JSON = "text/json";
    public String httpPostWithJSON(String url, String json) throws Exception {
        // 将JSON进行UTF-8编码,以便传输中文
//        String encoderJson = URLEncoder.encode(json, "utf-8");
        String result = "";
        DefaultHttpClient httpClient = new DefaultHttpClient(); 
        HttpPost httpPost = new HttpPost(url);
        httpPost.addHeader(HTTP.CONTENT_TYPE, APPLICATION_JSON);
        
        StringEntity se = new StringEntity(json);
        se.setContentType(CONTENT_TYPE_TEXT_JSON);
        se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, APPLICATION_JSON));
        httpPost.setEntity(se);
        HttpResponse response = httpClient.execute(httpPost);  
        if(response != null){  
            HttpEntity resEntity = response.getEntity();  
            if(resEntity != null){  
                result = EntityUtils.toString(resEntity,"utf-8");  
            }  
        }  
        
        return result;
    }
    
    public String httpsPostWithJSON(String url, String json) throws Exception {
        // 将JSON进行UTF-8编码,以便传输中文
//        String encoderJson = URLEncoder.encode(json, "utf-8");
        String result = "";
        HttpClient httpClient = new SSLClient();
        HttpPost httpPost = new HttpPost(url);
        httpPost.addHeader(HTTP.CONTENT_TYPE, APPLICATION_JSON);
        
        StringEntity se = new StringEntity(json);
        se.setContentType(CONTENT_TYPE_TEXT_JSON);
        se.setContentEncoding(new BasicHeader(HTTP.CONTENT_TYPE, APPLICATION_JSON));
        httpPost.setEntity(se);
        HttpResponse response = httpClient.execute(httpPost);  
        if(response != null){  
            HttpEntity resEntity = response.getEntity();  
            if(resEntity != null){  
                result = EntityUtils.toString(resEntity,"utf-8");  
            }  
        }  
        
        return result;
    }
}  
