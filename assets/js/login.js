$(function() {
    $("#link_reg").on('click', function() {
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function() {
            $('.login-box').show()
            $('.reg-box').hide()
        })
        //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer

    //通过form.verify()函数自定义效验规则
    form.verify({
        //自定义了一个叫做pwd的效验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        //效验两次密码是否一致的规则
        repwd: function(value) {
            //通过形参拿到是确认密码框的内容
            //还要拿到密码框中的内容   
            //进行一次等于判断
            var pwd = $('.reg-box [name=password]').val()
                // var pwd = $('#repwd').val()

            if (pwd !== value) {
                return '两次密码不一致'
            }

        }
    })

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止默认提交行为
        e.preventDefault()
            //将对象提取出来
        var data = { username: $('.reg-box [name=username]').val(), password: $('.reg-box [name=password]').val() }
            //发起ajax的post请求
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message)
            }
            // return console.log('注册成功！');
            layer.msg('注册成功,请登录')
                //添加自动点击事件（模拟人的点击）
            $('#link_login').click()
        })
    })

    //监听登录表单的提交事件
    $('#form_login').submit(function(e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            url: '/api/login',
            method: 'POST',
            //快速获取表单中的数据
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                    // console.log(res.token);
                    //将登录成功得到的token字符串，保存到localStorage中
                localStorage.setItem('token', res.token)
                    //跳转到后台主页
                location.href = 'index.html'
            }
        })
    })



})