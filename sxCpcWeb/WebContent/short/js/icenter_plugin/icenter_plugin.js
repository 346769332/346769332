/**
 * Created by qin on 14-1-7.
 */
var AppService = function() {};

AppService.exec = cordova.require('cordova/exec');
//html app跳转
AppService.prototype.pushApp = function (url, win, fail) {
    AppService.exec(win, fail, "AppService", "pushApp", [url]);
}

//获取票据
AppService.prototype.getTicket = function(win, fail) {
    AppService.exec(win, fail, "AppService", "getTicket", []);
}

//启动原生应用
AppService.prototype.startApp = function(url, win, fail) {
    AppService.exec(win, fail, "AppService", "startApp" [url]);
}

//保存Cache
AppService.prototype.saveCache = function(key, json, win, fail) {
    AppService.exec(win, fail, "AppService", "saveCache", [key, json]);
}

//获取Cache
AppService.prototype.getCache = function(key, win, fail) {
    AppService.exec(win, fail, "AppService", "getCache", [key]);
}

/**
 *  票据失败
 *
 *  @param win  Javascript function
 *  @param fail Javascript function
 */
AppService.prototype.ticketError = function(json, win, fail) {
    AppService.exec(win, fail, "AppService", "ticketError", [json]);
}
/**
 *  关闭app
 *
 *  @param win  Javascript function
 *  @param fail Javascript function
 */
AppService.prototype.closeApp = function(win, fail) {
    AppService.exec(win, fail, "AppService", "closeHtmlApp", []);
}
/**
 *  短信
 *  @author mbwang
 *  @date 2014-12-18 09:30
 *  @param phone 可选。手机号，多个手机号码与逗号分隔
 *  @param message 可选。短信内容
 *  @param 发送方式。入参为INTENT（该参数只对Android系统有效），传入时，表示使用调用系统短信模块界面发送，未传时表示不使用界面发送。
 *  @param success  发送成功回调
 *  @param failure 发送失败回调
 */
AppService.prototype.send = function(phone, message, method, success, failure) {
    //phone = sms.convertPhoneToArray(phone);
    if(typeof phone === 'string' && phone.indexOf(',') !== -1) {
        phone = phone.split(',');
    }
    if(Object.prototype.toString.call(phone) !== '[object Array]') {
        phone = [phone];
    }
//    alert('s');
    AppService.exec(
        success,
        failure,
        'Sms',
        'send',
        [phone, message, method]
    );
// alert('ss');
}
/**
 *  文件查看/视频播放。文件已经下载，直接查看，文件未下载，则下载，下载完成后提示用户。
 *  @author mbwang
 *  @date 2015-3-11 15:14
 *  @param url 可以为文件/查看下载地址，视频在线播放地址（只支持3GP/MP4）
 *  @param success  文件进入下载队列成功时回调，备注：直接打开文件/播放视频时不回调
 *  @param failure 打开文件不存在时回调
 */
AppService.prototype.readerFile = function(url,success,failure){
    cordova.exec(success,failure,'FileOrVideo','readerFile',[url]);
}


