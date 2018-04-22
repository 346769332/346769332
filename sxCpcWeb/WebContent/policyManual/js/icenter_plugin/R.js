var R = {};
//R.IP="http://192.168.1.103:8080/mpi";
//R.IP="http://134.64.110.51:8080/mpi";
//R.IP="http://192.3.6.83:8080/mpi/";
//R.IP="http://134.64.110.40:8081/mpi/"
R.IP="http://222.83.4.69:9001/mpi/";
var PointDetailsUrl= R.IP+"m/intf/call";//客户详情、
//R.key="mkey";
R.key="";//分配
//R.ticket="123456";
var ticketUrl= R.IP+'/m/sys/ticketValid';//获取票据
R.String = {
    ALERT_TITLE:"提示信息",//提示框默认标题
    CONFIRM_TITLE:"确认提醒",//确认框默认标题
    EXIT_APP_MSG:"您确定要退出吗？",//退出程序提示信息
    CONNECTION_FAIL:"服务器异常或无法连接！",//连接失败提示
    GET_APPS_FAIL:"应用列表获取失败！",//获取应用列表失败提示
    GET_APP_FAIL:"应用信息获取失败！",
    GET_ACCESS_FAIL:"无法获取用户应用权限信息！",
    REMOTE_RESULT_NULL:"服务器返回数据为空！",//服务器返回null的提示信息
    NOT_FOUND_APP:"未找到任何应用",//为找到任何应用数据提示信息
    OFFLINE_MODE:"您处于离线模式,请打开网络!",//离线模式提示信息
    UNINSTALL_APP_CONFIRM:"你确定要卸载应用吗？",//卸载确认提示信息
    REMOVE_APP_CONFIRM:"确定要删除快捷方式？",
    UNINSTALL_APP_FAIL:"移除应用失败!",//卸载应用失败
    UNINSTALL_APP_ACCESS:"移除应用成功!", //应用移除
    ACTION_RETURN_FAIL:"失败：{message}",//API返回错误提示信息
    SEARCH_RESULT_NULL:"没有找到相关应用！",
    CHECK_UPDATE_FAIL:"检查更新失败",
    GET_APPS_NULL:"该分类下没有任何应用！",
    GET_APPS_ING:"正在刷新应用列表",
    IS_NEWEST_VERSION:"当前版本已经是最新版本！",
    CHECK_UPDATE_ERROR:"检查更新应用时发生错误",
    UPDATE_CONFIRM:"当前版本:{currentVersion},检测到新版本:{planVersion}，是否更新？",
    START_BROWSER_DOWNLOAD:"开始任务下载...",
    BROWSER_DOWNLOAD_ERROR:"下载启动失败！",
    AJAX_NO_NETWORK:"未监测到网络连接！",
    AJAX_LOADING_MSG:"数据请求中...",
    AJAX_CHECK_UPDATE:"检查更新中...",
    COMMENT_LOADING_MSG:"内容加载中...",
    COMMENT_LOADING_FAIL:"评论列表获取失败",
    COMMENT_NULL:"暂无评论",
    COMMENT_TEXT_NULL:"请填写点评信息！",
    COMMENT_TEXT_TOO_LONG:"点评内容不能超过200字！",
    COMMENT_SUBMIT_SUCCESS:"点评提交成功",
    COMMENT_SUBMIT_ERROR:"提交失败:{status}",
    DOWNLOAD_FAIL:"下载失败:{message}",
    CANCEL_DOWNLOAD_CONFIRM:"您确定要终止下载吗？",
    APP_DOWNLOAD:"正在下载....",
    APP_INSTALLING:"正在安装...",
    APP_INSTALL_SUCCESS:"安装成功！",
    APP_INSTALL_FAIL:"安装失败：{message}",
    APP_UPDATE_TITLE:"应用更新",
    APP_UPDATE_FAIL:"应用更新失败!",
    APP_UPDATE_NULL:"没有可以更新的应用！",
    APK_OPEN_FAIL:"应用安装包启动失败！",
    APP_STARTING:"请稍候,应用启动中...",
    APP_START_FAIL:"应用启动失败！",
    CHANGE_PASSWORD_SUCCESS:"密码修改成功！",
    TRAFFIC_EXCEED_CONFIRM:"您本月的流量已超额，使用离线模式？",
    APP_ROLLBACK_TITLE:"应用回滚",
    APP_UPDATE_MESSAGE:"检测到新版本！\r\n版本号：{version}" +
        "\r\n是否立即安装?\r\n\r\n更新说明：\r\n{log}",
    APP_ROLLBACK_MESSAGE:"此应用已回滚至{version}版本！\r\n回滚说明:{log}",
    NATIVE_UPDATE_MESSAGE:"检测到新版本！\r\n最新版本：{plan}\r\n当前版本：{version}" +
        "\r\n是否立即安装?\r\n\r\n更新说明：\r\n{log}",
    ON_PUSH_MESSAGE:"收到新消息，立即查看？",
    SHOW_DESKTOP:"正在布置桌面，请稍等...",
    ADD_APP_HANDY:"addApp",
    SHOW_APP_INFO:"请稍后,正在加载应用详情...."
};
R.Array = {
    ALERT_BUTTON:["确定"],
    CONFIRM_BUTTON:["确定","取消"],
    UPDATE_CONFIRM_BUTTON:["更新","取消"],
    ROLLBACK_CONFIRM_BUTTON:["回滚","取消"],
    UpdateOrDelete:['编辑','删除']
};

R.MORE_STRING = {
    LOADING : "拼命加载中,请稍后..." ,
    SUCCEED:"加载成功",
    FAIL:'请求失败',
    MORE:'上拉加载更多...',
    REFRESH:'加载中...',
    RELEASE : "松开开始加载...",
    NO_MORE:"没有更多数据了...",
    NULL:"查询到0条符合条件的数据"
};

/**
 * Created with JetBrains WebStorm.
 * User: Administrator
 * Date: 14-9-18
 * Time: 下午3:07
 * To change this template use File | Settings | File Templates.
 */
