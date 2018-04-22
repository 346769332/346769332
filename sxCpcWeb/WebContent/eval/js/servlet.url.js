
var IP =  "";			//IP地址
var AREA_VERSION = ""; 	//发布区域
var APP_ID = "";		//版本ID
var APP_VERSION = "";	//版本编码
var APP_VALDATE_VERSION = true; //是否验证版本
/***************新疆、宁夏项目版本、配置管理 START*****************/
var IP_SET = [
     //【宁夏生产】
     {"IS_USE":false ,"APP_ID":"help_me_android",
    	 "APP_VERSION" : "15.7.1", "AREA_VERSION":"NX","IP":"http://202.100.110.41:8001"
     },  
     {"IS_USE":false ,"APP_ID":"help_me_ios",
    	 "APP_VERSION" : "15.7.1", "AREA_VERSION":"NX","IP":"http://202.100.110.41:8001"
     },  
     //【宁夏测试】
     {"IS_USE":false,"APP_ID":"help_me_test_android",
    	 "APP_VERSION" : "15.7.1","AREA_VERSION":"NX","IP":"http://202.100.110.42:8080"	
     },
     //【wangdl】 http://117.32.232.208|
     {"IS_USE":false,"APP_ID":"help_me_test_android",
    	 "APP_VERSION" : "15.7.1","AREA_VERSION":"NX","IP":"http://117.32.232.208"	
     },
     {"IS_USE":false,"APP_ID":"help_me_test_android",
    	 "APP_VERSION" : "15.7.1","AREA_VERSION":"NX","IP":"http://202.100.110.42:8080"	
     },
     {"IS_USE":false,"APP_ID":"help_me_test_ios",
    	 "APP_VERSION" : "15.7.1","AREA_VERSION":"NX","IP":"http://202.100.110.42:8080"	
     }, 
     //本机测试
     {"IS_USE":true,"APP_ID":"help_me_android",
    	 "APP_VERSION" : "15.7.1","AREA_VERSION":"NX","IP":"http://127.0.0.1:8080"
     }   
];
for(var i=0 ; i<IP_SET.length ; i++){
	if(IP_SET[i].IS_USE){
		IP			 = IP_SET[i].IP;
		APP_ID		 = IP_SET[i].APP_ID;
		AREA_VERSION = IP_SET[i].AREA_VERSION;
		APP_VERSION	 = IP_SET[i].APP_VERSION;
		break;
	}
}

//开发环境："http://localhost:8080";
/****************新疆、宁夏项目版本、配置管理 END*****************/


var CONTEXT = IP + "/CpcWeb";

/***多角色门户  MPI接口 START***/
var MPI_IP ="http://117.32.232.208/mpi/"; //陕西生产
//获取票据
var MPI_TICKET_VALID = MPI_IP+'m/sys/ticketValid';

/***多角色门户  MPI接口 END***/


var SAVE_EDITOR = CONTEXT + "/app/saveDemand.do";

var SHOW_DEMAND_INFO = CONTEXT + "/app/searchDemandInfo.do";

var SHOW_DEMAND_LIST = CONTEXT + "/app/searchDemandList.do";

var SHOW_DEMAND_DRAFT_LIST = CONTEXT + "/app/searchDemandDraftList.do";

var SHOW_LIST_COUNT = CONTEXT + "/app/searchListCount.do";

var CHANGE_DEMAND_INFO = CONTEXT + "/app/updateDemandInfo.do";

var REMOVE_DEMAND_DRAFT_LIST = CONTEXT + "/app/deleteDemandDraft.do"; 

var FLOW_EX_CHANGE = CONTEXT + "/app/flowExChange.do"; 

var SHOW_DIC_LIST = CONTEXT + "/app/searchDicList.do";

var SHOW_OUTSYS_LIST = CONTEXT + "/app/searchOutSysList.do";

var SHOW_OUTSYS_INFO = CONTEXT + "/app/searchOutSysInfo.do";
 
var UP_LOAD_IMG = CONTEXT + "/app/upLoadImg.do";

var SHOW_NEWS_LIST = CONTEXT + "/app/searchNewsList.do";

var SHOW_STAR_EVAL_LIST = CONTEXT + "/app/searchStarEvalList.do";

var SUBMIT_STAR_EVAL = CONTEXT + "/app/submitStarEval.do";

var URL_UPLOAD_FILE = CONTEXT + "/app/upLoadFile.do";

var SAVE_EVALZZ = CONTEXT + "/app/saveEvalMonZZ.do";

var SAVE_EVAL_DEPT = CONTEXT + "/app/saveEvalDept.do";

var SHOW_CEO_INFO = CONTEXT +"/app/searchCEOInfo.do";

var SHOW_DEPT_INFO = CONTEXT + "/app/searchDeptInfo.do" ;



///登录
var URL_LOGIN_CHECKRAND =  CONTEXT + "/sale/checkRand.do";	//	验证码校验
var URL_LOGIN			=  CONTEXT + "/sale/authLogin.do";
var URL_QRY_STAFFORG	=  CONTEXT + "/sale/qryStaffOrg.do";
var URL_TGTVALIDATE     =  CONTEXT + "/tgtValidate.do";


var URL_LOGOUT              = CONTEXT + "/sale/logout.do";
var URL_SYSUSERINFO_QUERY 	=  CONTEXT + "/sale/sysUserInfoQuery.do";      // 查询员工登录信息

var URL_REGION_STAFF =  CONTEXT + "/app/RegionStaff.do"; //组织结构
var URL_UPLOAD_IMG=CONTEXT + "/sale/shrotPrcessUpload.do";//图片上传

var URL_SHOW_EVAL_PAGE=CONTEXT + "/app/showEvalInfo.do";//咸阳逆评