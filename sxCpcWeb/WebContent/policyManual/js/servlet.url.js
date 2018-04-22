
var IP =  "";
var AREA_VERSION = "";

var APP_ID = "policy_manual_android"; //版本ID
var APP_VERSION = "";
var APP_VALDATE_VERSION = true; //是否验证版本
/***************项目版本、配置管理 START*****************/
var IP_SET = [
     {"AREA_VERSION":"NX","IP":"http://202.100.110.41:8001"	,"APP_VERSION" : "15.6.1","IS_USE":false },  //【宁夏生产】
     {"AREA_VERSION":"NX","IP":"http://202.100.110.42:8080"	,"APP_VERSION" : "15.6.1","IS_USE":false},  //【宁夏测试】
     {"AREA_VERSION":"NX","IP":"http://127.0.0.1:8081"		,"APP_VERSION" : "15.6.1","IS_USE":true}   //本机测试
];
for(var i=0 ; i<IP_SET.length ; i++){
	if(IP_SET[i].IS_USE){
		IP			 = IP_SET[i].IP;
		AREA_VERSION = IP_SET[i].AREA_VERSION;
		APP_VERSION	 = IP_SET[i].APP_VERSION;
		break;
	}
}

/****************项目版本、配置管理 END*****************/

var CONTEXT = IP + "/CpcWeb";

var URL_SEARCH_POLICY_MANUAL_INFO = CONTEXT + "/app/searchPolicyManualInfo.do";//查询数据
var URL_SEARCH_POLICY_MANUAL_TYPE_LIST= CONTEXT + "/app/searchPolicyManualTypeList.do";
var URL_SEARCH_POLICY_MANUAL_TYPE_DETAIL_LIST= CONTEXT + "/app/searchPolicyManualTypeDetailList.do";
var URL_SEARCH_POLICY_MANUAL_INFO_LIST= CONTEXT + "/app/searchPolicyManualInfoList.do";

///登录
var URL_LOGIN_CHECKRAND =  CONTEXT + "/sale/checkRand.do";	//	验证码校验
var URL_LOGIN			=  CONTEXT + "/sale/authLogin.do";
var URL_QRY_STAFFORG	=  CONTEXT + "/sale/qryStaffOrg.do";
var URL_TGTVALIDATE     =  CONTEXT + "/tgtValidate.do";
var URL_LOGOUT              = CONTEXT + "/sale/logout.do";
var URL_SYSUSERINFO_QUERY 	=  CONTEXT + "/sale/sysUserInfoQuery.do";      // 查询员工登录信息