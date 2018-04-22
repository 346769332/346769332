/**
 * Created by qin on 14-4-15.
 */
/**
 * string to json
 * @param str
 * @returns {*}
 */
function parseJson(str){
    try{
        eval('var obj='+str);
        return obj;
    }catch(e){
        return null;
    }
}
/**
 * json to string
 * @param obj
 * @returns {string}
 */
function jsonTString(obj){
    var isArray = obj instanceof Array;
    var r = [];
    for(var i in obj){
        var value = obj[i];
        if(typeof value == "function"){
            continue;
        }else if(typeof value == 'string'){
            value = '"' + value + '"';
        }else if(value != null && typeof value == 'object'){
            value = jsonTString(value);
        }
        r.push((isArray?'':'"'+i+'"'+':')+value);
    }
    return isArray ? '['+r.join(',')+']' : '{'+r.join(',')+'}';}





function json2String(obj){
    var isArray = obj instanceof Array;
    var r = [];
    for(var i in obj){
        var value = obj[i];
        if(typeof value == "function"){
            continue;
        }else if(typeof value == 'string'){
            value = "'" + value + "'";
        }else if(value != null && typeof value == 'object'){
            value = json2String(value);
        }
        r.push((isArray?'':"'"+i+"'"+':')+value);
    }
    return isArray ? '['+r.join(',')+']' : '{'+r.join(',')+'}';
}

/**
 * 动态加载css/js
 * @param filename 文件名称
 * @param filetype 文件类型（css/js）
 * @aut tianxj@tydic.com
 */
function loadJsCssFile (filename,filetype){
    var fileHref = "";
    if(filetype == "js"){
        fileHref = document.createElement('script');
        fileHref.setAttribute("type","text/javascript");
        fileHref.setAttribute("src",filename);
    }else if(filetype == "css"){
        fileHref = document.createElement('link');
        fileHref.setAttribute("rel","stylesheet");
        fileHref.setAttribute("type","text/css");
        fileHref.setAttribute("href",filename);
    }
    if(typeof fileHref != "undefined"){
        document.getElementsByTagName("head")[0].appendChild(fileHref);
    }
}


Array.prototype.remove=function(n) {
    if(n<0){
        return this;
    }else{
        return this.slice(0,n).concat(this.slice(n+1,this.length));
    }
};

window.__defineGetter__("isOnline",function(){
    return navigator.network.connection.type != "none";
});

navigator.__defineGetter__("isAndroid",function(){
    var sUserAgent= navigator.userAgent.toLowerCase();
    return sUserAgent.match(/android/i) == "android";
});

/**
 * 公用类
 * User: tianxj@tydic.com
 * Date: 13-12-9
 * Time: 下午4:31
 * 公用类
 */
Util = function(){
    /**
     * ajax请求
     * @param reqUrl 请求服务源
     * @param param 请求参数x
     * @param success 成功回调函数
     * @param fail 失败回调函数
     */
    this.ajaxRequest = function(reqUrl,param,success,fail,showMask){
        var copyedParam = $.extend({
            key:"95abf3cf483c652a92968e520bd190b6",
            version:"1.0.0",
            ticket:sessionStorage.getItem("ticket"),
            latn_id: sessionStorage.getItem("latn_id")
        },{},param);

        $.ajax({
        	type:"post",
            url: reqUrl,
            data: copyedParam,
            dataType: "json",
            timeout:180*1000,
            success :function(data){
                if(data.code=="AT01"||(data.data!=undefined&&data.data.valid_result!=undefined&&data.data.valid_result=="AT01")){
                	new AppService().ticketError(jsonTString(data),function(){},function(){});
                }
                success(data)
            },
            error : fail
        });
    };

    this.showMyMask=function(param){
        if(!param)param= R.STRING.LOADING;
        $("#myMask").show()
        $.ui.showMask(param);
    }
    this.hideMyMask=function(){
        $.ui.hideMask();
        $("#myMask").hide()
    }
}
var util = new Util();
