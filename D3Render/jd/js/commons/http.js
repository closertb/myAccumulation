/**
 * Created by chengwb on 2016/8/5.
 * 旅游资讯网后台数据所有接口
 * 2017-02-27修改
 *调用
 var params={
		url:"/news/list",
		data:{
			channelCode:"bjfjx",
			page:   1,
			rows:   9
		}
	};
        infoApi.executeRequest(params,function(data){
			console.log(data);
		});
 */
(function(global, $){
    global.infoApi = global.infoApi || {};
    global.infoApi.executeRequest=function(options, todo) {
        var prefix = options.prefix ? '/' + options.prefix : '';
        console.log(prefix + options.url );
        $.ajax({
            url: prefix + options.url,//requiredParams在header.html中通过config文件配置
            type: options.method || 'get',
            data: options.data || null,
            complete: function (jqXHR, textStatus) {
                if (textStatus === 'success') {
                    var result = $.parseJSON(jqXHR.responseText);
                    todo(result);
                } else if(textStatus === 'timeout') {
                    todo({
                        error: true,
                        message: '服务器响应超时'
                    });
                } else {
                    todo({
                        error: true,
                        message: '服务器错误'
                    });
                }
            }
        });
    }
})(window, jQuery);


