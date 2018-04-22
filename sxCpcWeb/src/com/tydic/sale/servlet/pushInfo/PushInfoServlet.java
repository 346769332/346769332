package com.tydic.sale.servlet.pushInfo;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.alibaba.fastjson.JSON;
import com.tydic.sale.servlet.AbstractServlet;
import com.tydic.sale.servlet.domain.SystemUser;
import com.tydic.sale.utils.HttpClientUtil;
import com.tydic.sale.utils.JSONUtil;
import com.tydic.sale.utils.SaleUtil;
import com.tydic.sale.utils.Tools;

@WebServlet("/pushInfo/pushInfo.do")
public class PushInfoServlet extends AbstractServlet {
	private final static Logger logger = LoggerFactory.getLogger(PushInfoServlet.class);
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public PushInfoServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doGet(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		this.doPost(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings("rawtypes")
	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		SystemUser systemUser = (SystemUser) request.getSession().getAttribute(SaleUtil.SYSTEMUSER);
		String methodType = request.getParameter("methodType");
		Map<Object,Object> resultMap = new HashMap<Object, Object>();
		Map<Object,Object> reqMap = new HashMap<Object, Object>();
		if("qryNotification".equals(methodType)) {
			String pageNum = request.getParameter("limit");
			String pageSize = request.getParameter("pageSize");
			
			reqMap.put("pagenum", (Integer.parseInt(pageNum)+1));
			reqMap.put("pagesize", pageSize);
			
			reqMap.put("sendDate",request.getParameter("sendDate"));//推送时间
			reqMap.put("endDate",request.getParameter("endDate"));//推送时间
			reqMap.put("themeSeach", request.getParameter("themeSeach"));//主题
			
			reqMap.put("SERVER_NAME", "qryPushInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(reqMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
				resultMap.put("data", serMap.get("list"));
				resultMap.put("totalSize", serMap.get("sum"));
			}
		}else if("addNotification".equals(methodType)){
			String baseParam = request.getParameter("baseParam");
			Map<Object, Object> baseMap = JSONUtil.toObjectMap(baseParam);
//			String sendToIdObj = (String) baseMap.get("sendToId");
//			String sendToId = sendToIdObj.substring(0, sendToIdObj.length()-1);
//			String sendToNameObj = (String) baseMap.get("sendToName");
//			String sendToName = sendToNameObj.substring(0, sendToNameObj.length()-1);
//			System.out.println(sendToId);
//			baseMap.put("sendToId", sendToId);
//			baseMap.put("sendToName", sendToName);
			baseMap.put("createrId", systemUser.getStaffId());
			baseMap.put("createrName", systemUser.getStaffName());
			baseMap.put("latnId", systemUser.getRegionId());
			baseMap.put("SERVER_NAME", "addPushInfo");
			Map<Object,Object> serMap = crmService.dealObjectFun(baseMap);
			resultMap.put("code", "1");
			if("0".equals(serMap.get("code"))){
				resultMap.put("code", "0");
			}
			/**
			 * 时间：2017-10-24
			 * 作者：simon
			 * 内容：PUSH推送
			 */
			System.out.println("list"+serMap.get("staff_ids"));
			if(!Tools.isNull(baseMap.get("sendToId"))&&"0".equals(serMap.get("code"))){
				Map<String,String> pushInfoMap = new HashMap<String,String>();
				//String url="http://117.32.232.208/mes/m/msg/push";
				//String url="http://133.64.93.103:7009/mes/m/msg/push";
				String url = String.valueOf(confMap.get("com.tydic.service.Notification.url"));
				System.out.println("====================================================url==================================================="+url);
				pushInfoMap.put("service_code", "MSG_PUSH");
				pushInfoMap.put("key", "mkey"); //验证摘要串
				pushInfoMap.put("version", "1.0.0"); //版本号
				pushInfoMap.put("os_type", "windows"); //操作系统  windows
				pushInfoMap.put("msg_title",String.valueOf(baseMap.get("pushTheme")));//消息title
				pushInfoMap.put("msg_code", "M202"); //消息类别CODE
				pushInfoMap.put("msg_content", String.valueOf(baseMap.get("pushContent")));//消息内容
				pushInfoMap.put("recv_user_id", String.valueOf(serMap.get("staff_ids")));//接收用户标识
				pushInfoMap.put("from_msg_id", String.valueOf(baseMap.get("pushId")));//推送方消息的唯一标识
				//pushInfoMap.put("req_send_date", "");//要求推送时间
				pushInfoMap.put("msg_param",request.getParameter("msg_param")); //附带消息参数
				System.out.println("=========================================pushInfoMap================================================="+pushInfoMap);
				HttpClientUtil httpClientUtil=new HttpClientUtil();
				String resultJson =  httpClientUtil.doPost(url,pushInfoMap,"UTF-8");
				Map strMap = new HashMap();
				System.out.println("=========================================resultJson================================================="+resultJson);
				if(!Tools.isNull(resultJson)){
					strMap = JSONObject.fromObject(resultJson);
					System.out.println("=========================================resultJson不为空================================================="+strMap);
					if("0000".equals(strMap.get("code"))){ //0000 调用成功
						System.out.println("===============================================接口调用成功=====================================================");
						resultMap.put("code", "0");
						resultMap.put("msg", strMap.get("msg"));
						resultMap.put("data", strMap.get("data"));
					}else{
						System.out.println("===============================================接口调用失败=====================================================");
						resultMap.put("code","2");
						resultMap.put("msg", strMap.get("msg"));
					}	
				}else{
					resultMap.put("code","2");
					resultMap.put("msg", "接口调用失败！");
					System.out.println("===============================================接口调用失败2=====================================================");
				}
			  }
			}
		super.sendMessages(response, JSON.toJSONString(resultMap));
	}
	
}
