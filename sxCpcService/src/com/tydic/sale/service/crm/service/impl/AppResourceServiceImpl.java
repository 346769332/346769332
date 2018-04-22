package com.tydic.sale.service.crm.service.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.annotation.Resource;

import org.apache.log4j.Logger;
import org.dom4j.Document;
import org.dom4j.DocumentException;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;

import com.tydic.osgi.org.springframework.context.ISpringContext;
import com.tydic.osgi.org.springframework.context.SpringContextUtils;
import com.tydic.sale.service.crm.service.AppResourceService;
import com.tydic.sale.service.crm.service.OutcommonService;
import com.tydic.sale.service.crm.service.SearchService;
import com.tydic.sale.utils.XMLUtil;

public class AppResourceServiceImpl implements AppResourceService {
	
	private Logger logger = Logger.getLogger(AppResourceServiceImpl.class);

	@Override
	public String getUserSecondaryList() {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><usersecondaries>";
        Map map1=new HashMap();
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        Map map3=outcommonService.selectUserSecondaryList(map1);
        List<Map<String, Object>> list=(List<Map<String, Object>>) map3.get("data");
        for (Map<String, Object> map : list) {
        	String username=(String)map.get("username");
        	String realname=(String)map.get("realname");
        	String localnet=(String)map.get("localnet");
        	String hrid=(String)map.get("hrid");
        	String password=(String)map.get("password");
        	String encrypt="true";
        	String email=(String)map.get("email");
        	String mobile=(String)map.get("mobile");
        	String organization=(String)map.get("organization");
        	String starttime=(String)map.get("state_date");
        	String endtime=(String)map.get("state_date");
        	String modifytime=(String)map.get("state_date");
			ret+="<usersecondary username=\""+username+"\" realname=\""+realname+"\" localnet=\""+localnet+
					"\" hrid=\""+hrid+"\" encrypt=\""+encrypt+"\" email=\""+email+
					"\" mobile=\""+mobile+"\" organization=\""+organization+"\" starttime=\""+starttime+
					"\" endtime=\""+endtime+"\" modifytime=\""+modifytime+"\"/>";
		}
        
        ret += "</usersecondaries></root>";  
  	  	return ret;
	}
	@Override
	public String setUserSecondaryList(String paString) {
		/*String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><responses>";
        
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        
        Document document = null;
		try {
			document = DocumentHelper.parseText(paString);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
        Element root=document.getRootElement();//获取根节点  
        Element usersecondaries=root.element("usersecondaries");
        List nodes = usersecondaries.elements("usersecondary");
        for (Iterator it = nodes.iterator(); it.hasNext();) {  
            Element elm = (Element) it.next(); 
            String opt=elm.attributeValue("opt");
            String username=elm.attributeValue("username");
            String realname=elm.attributeValue("realname");
            String password=elm.attributeValue("password");
            String encrypt=elm.attributeValue("encrypt");
            String email=elm.attributeValue("email");
            String mobile=elm.attributeValue("mobile");
            String localnet=elm.attributeValue("localnet");
            String hrid=elm.attributeValue("hrid");  
            String starttime=elm.attributeValue("starttime");
            String endtime=elm.attributeValue("endtime");
            String modifytime=elm.attributeValue("modifytime");
            String organization=elm.attributeValue("organization");
            Map map1=new HashMap();
            map1.put("username", username);
            map1.put("realname", realname);            
            map1.put("encrypt", encrypt);
            map1.put("email", email);
            map1.put("mobile", mobile);
            map1.put("localnet", localnet);
            map1.put("hrid", hrid);
            map1.put("starttime", starttime);
            map1.put("endtime", endtime);
            map1.put("modifytime", modifytime);
            map1.put("organization", organization);
            
            String result=null;
            String message=null;
            if("add".equals(opt)){
            	password = new Sha512Hash(password).toBase64();//此处需要引入shiro包
            	map1.put("password", password);
            	Map map=outcommonService.addStaffInfoOut(map1);
            	if("0".equals(map.get("code"))){
            		result="success";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+"创建成功"+"\"></response>";
            	}else{
            		result="failure";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+"创建失败"+"\"></response>";
            	}
            }else if("update".equals(opt)){
            	password = new Sha512Hash(password).toBase64();
            	map1.put("password", password);
            	Map map=outcommonService.updateUserInfo(map1);
            	if("0".equals(map.get("code"))){
            		result="success";
            		message="修改成功";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"></response>";
            	}else{
            		result="failure";
            		message="修改失败";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"></response>";
            	}
            }else{
            	Map map=outcommonService.delUserInfo(map1);
            	if("0".equals(map.get("code"))){
            		result="success";
            		message="删除成功";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"></response>";
            	}else{
            		result="failure";
            		message="删除失败";
                	ret+="<response username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"></response>";
            	}
            }
      }  
      ret += "</responses></root>";  
	  return ret;*/
		return "";
	}
	
	@Override
	public String getResourceRoleList() {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><resourceroles>";
        Map map1=new HashMap();
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        Map map=outcommonService.selectroleInfo(map1);
        List<Map<String, Object>> list=(List<Map<String, Object>>) map.get("data");
        for (Map<String, Object> map2 : list) {
        	ret += "<resourcerole name=\""+map2.get("ROLE_ID")+"\" localnet=\""+map2.get("LATN_ID")+"\" description=\""+map2.get("ROLE_DESC") +"\" createdate=\""+map2.get("CREATE_TIME")+"\" updatedate=\""+map2.get("MODIFY_TIME")+"\"/>";
		}
        ret += "</resourceroles></root>";  
		return ret;
	}

	@Override
	public String setResourceRoleList(String paString) {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><resourceroles>";
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        Document document = null;
		try {
			document = DocumentHelper.parseText(paString);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
        Element root=document.getRootElement();//获取根节点  
        Element usersecondaries=root.element("resourceroles");
        List nodes = usersecondaries.elements("resourcerole");
        for (Iterator it = nodes.iterator(); it.hasNext();) {  
        	 Element elm = (Element) it.next(); 
             String opt=elm.attributeValue("opt");
             String name=elm.attributeValue("name");
             String description=elm.attributeValue("description");
             String lcoalnet=elm.attributeValue("lcoalnet");
             String createdate=elm.attributeValue("createdate");
             String updatedate=elm.attributeValue("updatedate");
             Map map1=new HashMap();
             map1.put("name1", name);
             map1.put("lcoalnet", lcoalnet);
             map1.put("createdate", createdate);
             map1.put("updatedate", updatedate);
             String result=null;
             String message=null;
             if("add".equals(opt)){
                 Map map3=outcommonService.insertroleInfo(map1);
                 if("0".equals(map3.get("code"))){
                	 result="success";
                	 message="创建成功";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }else{
                	 result="failure";
                	 message="创建失败";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }            	 
             }else if("update".equals(opt)){
            	 Map map3=outcommonService.updateroleInfo(map1);
                 if("0".equals(map3.get("code"))){
                	 result="success";
                	 message="修改成功";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }else{
                	 result="failure";
                	 message="修改失败";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }
             }else{
            	 Map map3=outcommonService.deleteroleInfo(map1);
                 if("0".equals(map3.get("code"))){
                	 result="success";
                	 message="删除成功";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }else{
                	 result="failure";
                	 message="删除失败";
                	 ret+="<response rolename=\""+name+"\" result=\""+result+"\" message=\""+message+"\"></response>";
                 }
             }
        }
        ret += "</resourceroles></root>";  
		return ret;
	}
	//狗日的，难写死了,这个也ok了
	@Override
	public String getResRoleUsersecondaryList() {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><roleUsersecondaries>";
        Map map1=new HashMap();
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        Map<String, Object> map3=outcommonService.selectroleInfosecondaryList(map1);
        System.out.println(map3.toString());
        if("0".equals(map3.get("code"))){
        	List<Map<String, Object>> list=(List<Map<String, Object>>) map3.get("data");
        	String rolename="";
        	String login_code="";
        	String rolename1="";
        	int i=0;
        	for (Map<String, Object> map : list) {
        			rolename=(String.valueOf(map.get("role_id"))) ;
        			login_code=(String.valueOf(map.get("login_code"))) ;
        			if(i==0){
        				ret +="<role rolename=\""+rolename+"\">";
        			}else{
        				if(!rolename.equals(rolename1)){
    	        			ret +="</role>";
    	        			ret +="<role rolename=\""+rolename+"\">";
    	        		}
        			}
        			rolename1=rolename;
        			ret +="<usersecondary username=\""+login_code+"\"/>";
        			if(i==list.size()-1){
        				ret +="</role>";
        			}
        			i++;
			}
        }
        ret += "</roleUsersecondaries></root>";  
		return ret;
	}
	@Override
	public String setResRoleUsersecondaryList(String paString) {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><responses>";
        
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        
        Document document = null;
		try {
			document = DocumentHelper.parseText(paString);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
        Element root=document.getRootElement();//获取根节点  
        Element roleUsersecondaries=root.element("roleUsersecondaries");
        List nodes = roleUsersecondaries.elements("role");
        String result=null;        String message=null;
        for (Iterator it = nodes.iterator(); it.hasNext();) {  
        	Element elm = (Element) it.next();
        	List sonnodes = elm.elements("usersecondary");
        	String rolename=elm.attributeValue("rolename");
        	for (Iterator sonit = sonnodes.iterator(); sonit.hasNext();) {
        		Element sonelm = (Element) sonit.next();
        		String username=sonelm.attributeValue("username");
        		String opt=sonelm.attributeValue("opt");
        		Map map1=new HashMap();
        		map1.put("rolename", rolename);
        		map1.put("username", username);
        		if("add".equals(opt)){
        			Map map3=outcommonService.insertResRoleUsersecondaryList(map1);
                    if("0".equals(map3.get("code"))){
                   	 result="success";
                   	 message="创建成功";
         			  ret += "<response rolename=\""+rolename+"\" username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"/>";
                    }else{
                   	 result="failure";
                   	 message="创建失败";
         			  ret += "<response rolename=\""+rolename+"\" username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"/>";
                    }            	 
        			//
        		}else if("delete".equals(opt)){
        			Map map3=outcommonService.deleteResRoleUsersecondaryList(map1);
                    if("0".equals(map3.get("code"))){
                   	 result="success";
                   	 message="删除成功";
         			  ret += "<response rolename=\""+rolename+"\" username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"/>";
                    }else{
                   	 result="failure";
                   	 message="删除失败";
         			  ret += "<response rolename=\""+rolename+"\" username=\""+username+"\" result=\""+result+"\" message=\""+message+"\"/>";
                    }            
        		}else{
       			  	ret += "<response rolename=\""+rolename+"\" username=\""+username+"\" result=\""+"failure"+"\" message=\""+"opt填入的值不识别"+"\"/>";
        			/*Map map3=outcommonService.updateResRoleUsersecondaryList(map1);
                    if("0".equals(map3.get("code"))){
                   	 result="success";
                   	 message="更新成功";
         			  ret += "<response rolename="+rolename+" username="+username+" result="+result+" message="+message+"/>""failure";"failure"
                    }else{
                   	 result="failure";
                   	 message="更新失败";
         			  ret += "<response rolename="+rolename+" username="+username+" result="+result+" message="+message+"/>";
                    }*/
        		}
        	}
            
        }
        ret += "</responses></root>";  
		return ret;
	}
	@Override
	public String getOrganizationList() {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><organizations>";
        Map map1=new HashMap();
        ISpringContext springInstance = SpringContextUtils.getInstance();
        OutcommonService outcommonService = (OutcommonService) springInstance.getBean("outcommonService");
        Map<String, Object> map3=outcommonService.selectOrganizationList(map1);
        if("0".equals(map3.get("code"))){
        	List<Map<String, Object>> list=(List<Map<String, Object>>) map3.get("data");
        	for (Map<String, Object> map : list) {
        		String id=(String) map.get("id");
        		String parentid=(String) map.get("parentid");
        		String name=(String) map.get("name1");;
        		String initials=name;
                String erpid=id;
                String description=name;
                String modifytime=(String) map.get("modifytime");;
                ret +="<organization id=\""+id+"\" parentid=\""+parentid+"\" name=\""+name+"\" initials=\""+initials+"\" erpid=\""+erpid+"\" description=\""+description+"\" modifytime=\""+modifytime+"\"/>";

			}
        }
        ret += "</organizations></root>";  
		return ret;
	}
	@Override
	public String setOrganizationList(String paString) {
		String ret = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        ret += "<root><responses>";
        Document document = null;
		try {
			document = DocumentHelper.parseText(paString);
		} catch (DocumentException e) {
			e.printStackTrace();
		}
        Element root=document.getRootElement();//获取根节点  
        Element organizations=root.element("organizations");
        List nodes = organizations.elements("organization");
        for (Iterator it = nodes.iterator(); it.hasNext();) {  
	       	 Element elm = (Element) it.next(); 
	       	 String opt=elm.attributeValue("opt");
	       	 String id=elm.attributeValue("id");
	       	 String parentid=elm.attributeValue("parentid");
	       	 String name=elm.attributeValue("name");
	       	 String initials=elm.attributeValue("initials");
	       	 String erpid=elm.attributeValue("erpid");
	       	 String description=elm.attributeValue("description");
	       	 String modifytime=elm.attributeValue("modifytime");
	       	 String unitid=elm.attributeValue("unitid");
	       	 String IsOA=elm.attributeValue("IsOA");
	       	 String result=null;	       	 String message=null;
	       	 if("add".equals(opt)){
	       		 //
	       		ret +="<resonse name=\""+name+"\" resault=\""+result+"\" message=\""+message+"\"/>";
	       	 }else if("update".equals(opt)){
	       		 //
		       	ret +="<resonse name=\""+name+"\" resault=\""+result+"\" message=\""+message+"\"/>";
	       	 }else{
	       		 //
		       	ret +="<resonse name=\""+name+"\" resault=\""+result+"\" message=\""+message+"\"/>";
	       	 }
        }
        ret += "</responses></root>";  
		return ret;
	}

}
