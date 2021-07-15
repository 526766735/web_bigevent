$(function() {
    //调用函数 获取用户基本信息
    getUSerInfo()

    var layer = layui.layer
        //退出功能
        //给按钮添加点击事件
    $('#logout').on('click', function() {
        //提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function(index) {
            //回调函数
            //1.清空本地储存的token
            localStorage.removeItem('token')
                //2.重新跳转到登录页面
            location.href = 'login.html'
                //关闭confirm询问框
            layer.close(index)
        });
    })


    //获取用户基本信息
    function getUSerInfo() {
        $.ajax({
            url: '/my/userinfo',
            method: 'GET',
            //headers 就是请求头配置对象
            // headers: {
            //     Authorization: localStorage.getItem('token') || ''
            // },
            success: function(res) {
                console.log(res);
                if (res.status !== 0) {
                    return layui.layer.msg('获取用户权限失败！')
                }
                //调用函数渲染用户头像
                renderAvatar(res.data)
            },
            //无论成功还是失败，都会调用complete回调函数
            // complete: function(res) {
            //     console.log(res);
            //     // layer.msg(11)
            //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //         //强制清空token数据
            //         localStorage.removeItem('token')
            //             //强制回到登录界面
            //         location.href = 'login.html'

            //     }

            // }
        })
    }

    //渲染用户头像
    function renderAvatar(user) {
        //1.获取用户名称
        var name = user.nickname || user.username
            //设置欢迎的文本
        $('.welcome').html('欢迎&nbsp;&nbsp;' + name)
        var pic = user.user_pic
        if (pic !== null) {
            //渲染头像
            $('.layui-nav-img').attr('src', pic).show()
            $('.text-avatar').hide()
        }
        //渲染文本图片
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()

    }
})