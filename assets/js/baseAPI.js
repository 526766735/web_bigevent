//每次调用ajax请求时 都会先调用ajaxPrefilter这个函数
//这个函数可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' +
        options.url
        // console.log(options.url);
        // console.log(options);

    //统一为有权限的接口，设置headers请求头
    //判断是否需要权限
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    options.complete = function(res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //强制清空token数据
            localStorage.removeItem('token')
                //强制回到登录界面
            location.href = 'login.html'

        }
    }

})