//每次调用ajax请求时 都会先调用ajaxPrefilter这个函数
//这个函数可以拿到我们给ajax提供的配置对象
$.ajaxPrefilter(function(options) {
    //在发起真正的ajax请求之前，统一拼接请求的根路径
    options.url = 'http://api-breakingnews-web.itheima.net' +
        options.url
    console.log(options.url);
})